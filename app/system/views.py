# _*_ coding: utf-8 _*_
from . import system
from app import db
from flask import session, redirect, url_for
from sqlalchemy import or_, and_, not_
from app.system.forms import LoginForm
from app.models import Organization, Person
from app.pubstatic import md5_code
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
            person = Person.query.filter_by(svalidstate=1).filter(
                or_(Person.scode.ilike(data['username']), Person.sloginname.ilike(data['username']))).first()
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
    person = Person.query.filter_by(sid=person_id).first()
    person_info = dict()
    person_info['personid'] = person_id
    person_info['personName'] = person.sname
    org = Organization.query.filter_by(spersonid=person_id).first()
    person_info['orgFullName'] = org.sfname
    rdata['status'] = True
    rdata['data'] = person_info
    print(rdata)
    return json.dumps(rdata, ensure_ascii=False)
