# _*_ coding: utf-8 _*_

from . import system
from flask import session, redirect, url_for, render_template, request
from sqlalchemy import or_, and_, not_
from app import db
from app.sa.forms import LoginForm, OrgForm
from app.sa.models import SAOrganization, SAPerson, SALogs
from app.menus.menuutils import get_process_name, get_process_full
from app.common.pubstatic import url_decode, create_icon, nul2em
from app.sa.persons import get_person_info
from app.sa.onlineutils import set_online, clear_online
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
                    set_online(person.sid)
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
    clear_online()
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
    person_info = get_person_info(person_id)
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
        srcPath = url_decode(data.get('srcPath', ''))
        activateName = url_decode(data.get('activateName', ''))
        actionName = url_decode(data.get('actionName', ''))
        discription = url_decode(data.get('discription', ''))
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


# 加载机构树
@system.route("/OPM/TreeSelectAction", methods=["GET", "POST"])
@user_login
def org_tree_select():
    rdata = dict()
    data = request.form
    params = url_decode(data.get('params', ''))  # 接收的参数需要解码
    param_dict = eval(params)  # 字符串转字典
    others = param_dict.get('other', '').split(',')
    org_query = SAOrganization.query.filter(SAOrganization.scode != 'SYSTEM', SAOrganization.svalidstate > -1)
    currenid = data.get('currenid')
    if currenid:
        org_query = org_query.filter(SAOrganization.sparent == currenid)
    else:
        org_query = org_query.filter(or_(SAOrganization.sparent.is_(None), SAOrganization.sparent == ''))
    orgs = org_query.order_by(SAOrganization.ssequence).all()
    json_result = list()
    for org in orgs:
        item = dict()
        item['id'] = getattr(org, param_dict['id'])
        item['name'] = getattr(org, param_dict['name'])
        item['parent'] = getattr(org, param_dict['parent'])
        if org.sorgkindid == 'psm':
            item['isParent'] = False
        else:
            item['isParent'] = True
        item['icon'] = create_icon(org.sorgkindid)
        for o in others:
            item[o] = getattr(org, o)
        json_result.append(item)
    rdata['jsonResult'] = json_result
    return json.dumps(rdata, ensure_ascii=False)


# 机构树-搜索
@system.route("/OPM/QuickTreeAction", methods=["GET", "POST"])
@user_login
def org_quick_tree():
    rdata = dict()
    data = request.form
    quicktext = url_decode(data.get('quicktext', ''))
    # quickCells = url_decode(data.get('quickCells', ''))
    path = url_decode(data.get('path', ''))
    org_query = SAOrganization.query.filter(SAOrganization.scode != 'SYSTEM', SAOrganization.svalidstate > -1)
    org_query = org_query.filter(
        or_(SAOrganization.sid.ilike(quicktext), SAOrganization.scode.ilike('%' + quicktext + '%'),
            SAOrganization.sname.ilike('%' + quicktext + '%')))
    orgs = org_query.order_by(SAOrganization.ssequence).all()
    json_result = list()
    for org in orgs:
        item = dict()
        item[path] = getattr(org, path)
        json_result.append(item)
    rdata['jsonResult'] = json_result
    return json.dumps(rdata, ensure_ascii=False)


# 机构列表
@system.route("/OPM/orgList", methods=["GET", "POST"])
@user_login
def org_list():
    rdata = dict()
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 16, type=int)
    parent = request.args.get('parent')
    org_query = SAOrganization.query.filter(SAOrganization.scode != 'SYSTEM', SAOrganization.svalidstate > -1)
    if parent:
        org_query = org_query.filter(or_(SAOrganization.sparent == parent, SAOrganization.sid == parent))
    rdata['code'] = 0
    rdata['count'] = org_query.count()
    page_data = org_query.paginate(page, limit)
    row_data = list()
    no = 1
    for d in page_data.items:
        item = dict()
        item['sid'] = d.sid
        item['no'] = no + (page - 1) * limit
        item['scode'] = d.scode
        item['sname'] = d.sname
        item['sdescription'] = d.sdescription
        item['sfcode'] = d.sfcode
        item['sfname'] = d.sfname
        item['sparent'] = d.sparent
        item['spersonid'] = d.spersonid
        item['sorgkindid'] = d.sorgkindid
        item['snodekind'] = d.snodekind
        item['svalidstate'] = d.svalidstate
        row_data.append(item)
        no += 1
    rdata['data'] = row_data
    return json.dumps(rdata, ensure_ascii=False)


# 机构编辑/添加
@system.route("/OPM/organization/org_edit", methods=["GET", "POST"])
@user_login
def org_edit():
    gridrowid = request.args.get('gridrowid', '')
    model = SAOrganization.query.filter_by(sid=gridrowid).first()
    form = OrgForm()
    if form.validate_on_submit():
        rdata = dict()
        data = form.data
        operator = request.args.get('operator')
        if operator == 'edit':
            model = SAOrganization.query.filter_by(sid=data['sid']).first()
            if not model:
                model = SAOrganization()
        else:
            model = SAOrganization()
        model.sparent = data['sparent']
        model.scode = data['scode']
        model.sname = data['sname']
        model.sorgkindid = data['sorgkindid']
        model.slevel = data['slevel']
        model.ssequence = data['ssequence']
        model.sphone = data['sphone']
        model.sfax = data['sfax']
        model.saddress = data['saddress']
        model.sdescription = data['sdescription']
        parent_org = SAOrganization.query.filter_by(sid=model.sparent).first()
        if parent_org:
            if operator == 'edit':
                model.sfid = parent_org.sfid + '/' + model.sid + '.' + model.sorgkindid
            model.sfcode = parent_org.sfcode + '/' + model.scode
            model.sfname = parent_org.sfname + '/' + model.sname
            model.slevel = parent_org.slevel + 1
        else:
            if operator == 'edit':
                model.sfid = '/' + model.sid + '.' + model.sorgkindid
            model.sfcode = '/' + model.scode
            model.sfname = '/' + model.sname
        db.session.add(model)
        db.session.commit()
        if operator != 'edit':  # 如果不是编辑则需要保存之后更新fid
            if parent_org:
                model.sfid = parent_org.sfid + '/' + model.sid + '.' + model.sorgkindid
            else:
                model.sfid = '/' + model.sid + '.' + model.sorgkindid
            db.session.add(model)
            db.session.commit()
        rdata['state'] = True
        return json.dumps(rdata, ensure_ascii=False)
    if not model:
        model = SAOrganization(slevel=0, ssequence=1)
    return render_template("system/OPM/dialog/organ-org-createorg.html", form=form, model=model, nul2em=nul2em)
