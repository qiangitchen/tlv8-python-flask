# _*_ coding: utf-8 _*_

from . import system
from flask import session, redirect, url_for, render_template, request
from sqlalchemy import or_
from urllib.parse import unquote, unquote_to_bytes
from app import db
from app.sa.forms import LoginForm
from app.sa.models import SAOrganization, SAPerson, SALogs
from app.menus.menuutils import get_process_name, get_process_full
from functools import wraps
import json


# 登录装饰器
def user_login(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "user_id" not in session:
            return redirect(url_for("home.login"))
        return f(*args, **kwargs)

    return decorated_function


# 用户登录
@system.route("/User/login", methods=["GET", "POST"])
def login():
    rdata = dict()
    form = LoginForm()
    if form.is_submitted():
        data = form.data
        if data['captcha'].upper() == session['code'].upper():
            person = SAPerson.query.filter_by(svalidstate=1).filter(
                or_(SAPerson.scode.ilike(data['username']), SAPerson.sloginname.ilike(data['username']))).first()
            if person:
                if person.spassword == data['password']:
                    session['user_id'] = person.sid
                    rdata['status'] = True
                else:
                    rdata['status'] = False
                    rdata['msg'] = "用户名或密码错误~"
            else:
                rdata['status'] = False
                rdata['msg'] = "用户名或密码错误~"
        else:
            rdata['status'] = False
            rdata['msg'] = "验证码错误~"
    else:
        rdata['status'] = False
        rdata['msg'] = "参数错误~"
    return json.dumps(rdata, ensure_ascii=False)


# 用户注销
@system.route("/User/logout", methods=["GET", "POST"])
def logout():
    rdata = dict()
    session.pop("user_id", None)
    rdata['status'] = True
    return json.dumps(rdata, ensure_ascii=False)


# 前端登录验证
@system.route("/User/check", methods=["GET", "POST"])
def login_check():
    rdata = dict()
    if "user_id" in session:
        rdata['status'] = True
    else:
        rdata['status'] = False
    return json.dumps(rdata, ensure_ascii=False)


# 初始化登录人员信息
@system.route("/User/initPortalInfo", methods=["GET", "POST"])
@user_login
def init_portal_info():
    rdata = dict()
    person_id = session['user_id']
    person = SAPerson.query.filter_by(sid=person_id).first()
    person_info = dict()
    person_info['personid'] = person_id
    person_info['personName'] = person.sname
    org = SAOrganization.query.filter_by(spersonid=person_id).first()
    person_info['orgFullName'] = org.sfname
    rdata['status'] = True
    rdata['data'] = person_info
    print(rdata)
    return json.dumps(rdata, ensure_ascii=False)


# 写系统日志
@system.route("/WriteSystemLogAction", methods=["GET", "POST"])
@user_login
def write_system_log():
    rdata = dict()
    try:
        data = request.form
        srcPath = unquote_to_bytes(data.get('srcPath', '')).decode('utf-8')
        activateName = unquote_to_bytes(data.get('activateName', '')).decode('utf-8')
        actionName = unquote_to_bytes(data.get('actionName', '')).decode('utf-8')
        discription = unquote_to_bytes(data.get('discription', '')).decode('utf-8')
        personID = data.get('personID', session['user_id'])
        if len(activateName) < 1:
            activateName = get_process_name(srcPath)
        sprocessName = get_process_full(srcPath)
        person = SAPerson.query.filter_by(sid=personID).first()
        org = SAOrganization.query.filter_by(spersonid=personID).first()
        ip = request.remote_addr
        log = SALogs(sdescription=discription,
                     stypename="前端提交",
                     sprocessname=sprocessName,
                     sactivityname=activateName,
                     sactionname=actionName,
                     screatorpersonid=personID,
                     screatorpersonname=person.sname,
                     screatorfid=org.sfid,
                     screatorfname=org.sfname,
                     sip=ip)
        db.session.add(log)
        db.session.commit()
        rdata['status'] = True
    except Exception as e:
        print(e)
        rdata['status'] = False
    return json.dumps(rdata, ensure_ascii=False)


# 机构管理
@system.route("/OPM/organization", methods=["GET", "POST"])
@user_login
def organization():
    return render_template("system/OPM/organization.html")
