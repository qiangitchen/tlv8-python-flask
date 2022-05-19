# _*_ coding: utf-8 _*_

from . import system
from flask import session, redirect, url_for, render_template, request
from sqlalchemy import or_, and_, not_
from app import db
from app.sa.forms import LoginForm, OrgForm, PersonForm
from app.sa.models import SAOrganization, SAPerson, SALogs
from app.menus.menuutils import get_process_name, get_process_full
from app.common.pubstatic import url_decode, create_icon, nul2em, md5_code
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
    unself = request.args.get('unself')
    org_query = SAOrganization.query.filter(SAOrganization.scode != 'SYSTEM', SAOrganization.svalidstate > -1)
    if parent:
        if unself:
            org_query = org_query.filter(SAOrganization.sparent == parent)
        else:
            org_query = org_query.filter(or_(SAOrganization.sparent == parent, SAOrganization.sid == parent))
    else:
        org_query = org_query.filter(or_(SAOrganization.sparent.is_(None), SAOrganization.sid == ''))
    rdata['code'] = 0
    rdata['count'] = org_query.count()
    page_data = org_query.order_by(SAOrganization.slevel.asc(), SAOrganization.ssequence.asc()).paginate(page, limit)
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
    parent = request.args.get('parent')
    if not model:
        model = SAOrganization(slevel=0, ssequence=1, sparent=parent)
    return render_template("system/OPM/dialog/organ-org-createorg.html", form=form, model=model, nul2em=nul2em)


# 人员编辑/添加
@system.route("/OPM/organization/psm_edit", methods=["GET", "POST"])
@user_login
def psm_edit():
    gridrowid = request.args.get('gridrowid', '')
    org = SAOrganization.query.filter_by(sid=gridrowid).first()
    parent = request.args.get('parent')
    form = PersonForm()
    if form.validate_on_submit():
        rdata = dict()
        data = form.data
        parent_org = SAOrganization.query.filter_by(sid=parent).first()
        person = SAPerson.query.filter_by(sid=data['sid']).first()
        if not org:
            org = SAOrganization(sparent=parent_org.sid, sorgkindid='psm')
            person = SAPerson(smainorgid=parent, spassword=md5_code('123456'))  # 默认密码
            person_check = SAPerson.query.filter_by(scode=data['scode']).first()
            if person_check:
                rdata['state'] = False
                rdata['msg'] = '编号为：“' + data['scode'] + '”的用户已经存在！'
                return json.dumps(rdata, ensure_ascii=False)
        else:
            parent_org = SAOrganization.query.filter_by(sid=org.sparent).first()
        try:
            person.scode = data['scode']
            person.sname = data['sname']
            person.sloginname = data['sloginname']
            person.ssex = data['ssex']
            person.smobilephone = data['smobilephone']
            person.sbirthday = data['sbirthday']
            person.smail = data['smail']
            person.scasn = data['scasn']
            person.sdescription = data['sdescription']
            db.session.add(person)
            db.session.commit()
            org.sid = person.sid + '@' + parent_org.sid
            org.spersonid = person.sid
            org.sfid = parent_org.sfid + '/' + person.sid + '@' + parent_org.sid + '.psm'
            org.scode = person.scode
            org.sfcode = parent_org.sfcode + '/' + person.scode
            org.sname = person.sname
            org.sfname = parent_org.sfname + '/' + person.sname
            db.session.add(org)
            db.session.commit()
            rdata['state'] = True
        except Exception as e:
            print(e)
            rdata['state'] = False
            rdata['msg'] = '保存到数据库时异常!'
        return json.dumps(rdata, ensure_ascii=False)
    personid = request.args.get('personid', '')
    model = SAPerson.query.filter_by(sid=personid).first()
    if not model:
        model = SAPerson(smainorgid=parent)
    return render_template("system/OPM/dialog/organ-psm-createpsm.html", form=form, model=model, org=org, nul2em=nul2em)


# 机构排序
@system.route("/OPM/organization/sortOrgs", methods=["GET", "POST"])
@user_login
def org_sort():
    rowid = request.args.get('rowid')
    if request.method == "POST":
        rdata = dict()
        act = request.form.get('act')
        sid = request.form.get('sid')
        org = SAOrganization.query.filter_by(sid=sid).first()
        if org:
            if act == 'up':
                s = org.ssequence - 1
                if s < 1:
                    s = 1
                org.ssequence = s
            if act == 'top':
                org.ssequence = 1
            if act == 'down':
                s = org.ssequence + 1
                org.ssequence = s
            if act == 'bottom':
                s = SAOrganization.query.filter_by(sparent=org.sparent).count() + 1
                org.ssequence = s
            db.session.add(org)
            db.session.commit()
        rdata['state'] = True
        return json.dumps(rdata, ensure_ascii=False)
    return render_template("system/OPM/dialog/sortOrgs.html", rowid=rowid)


# 重置密码
@system.route("/OPM/organization/ResetPassword", methods=["GET", "POST"])
@user_login
def reset_password():
    rdata = dict()
    personid = request.form.get('personid')
    person = SAPerson.query.filter_by(sid=personid).first()
    if person:
        person.spassword = md5_code('123456')  # 默认密码
        db.session.add(person)
        db.session.commit()
        rdata['state'] = True
    else:
        rdata['state'] = False
        rdata['msg'] = '指定的人员id不存在！'
    return json.dumps(rdata, ensure_ascii=False)


# 人员列表
@system.route("/OPM/psmList", methods=["GET", "POST"])
@user_login
def psm_list():
    rdata = dict()
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 16, type=int)
    spfid = request.args.get('spfid')
    if spfid and spfid != "":
        org_query = SAOrganization.query.filter(SAOrganization.sfid.like(spfid + '%'),
                                                SAOrganization.sorgkindid == 'psm')
    else:
        org_query = SAOrganization.query.filter_by(sorgkindid='psm')
    rdata['count'] = org_query.count()
    page_data = org_query.order_by(SAOrganization.slevel.asc(), SAOrganization.ssequence.asc()).paginate(page, limit)
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
    rdata['code'] = 0
    return json.dumps(rdata, ensure_ascii=False)


# 选择人员（多选）
@system.route("/OPM/organization/SelectChPsm")
@user_login
def select_ch_psm():
    return render_template("system/OPM/dialog/SelectChPsm.html")


# 分配人员
@system.route("/OPM/organization/appendPersonMembers", methods=["POST"])
@user_login
def append_person_members():
    rdata = dict()
    orgId = url_decode(request.form.get('orgId'))
    personIds = url_decode(request.form.get('personIds'))
    parent_org = SAOrganization.query.filter_by(sid=orgId).first()
    if len(personIds) < 1:
        rdata['state'] = False
        rdata['msg'] = '没有选择分配人员！'
    else:
        orgs = personIds.split(",")
        for orgid in orgs:
            org = SAOrganization.query.filter_by(sid=orgid).first()
            if org:
                if org.sparent == orgId:
                    rdata['state'] = False
                    rdata['msg'] = "[" + org.sname + "]已经在当前部门，不需要分配!"
                    break
                norg = SAOrganization(scode=org.scode, sname=org.sname, svalidstate=org.svalidstate,
                                      sorgkindid=org.sorgkindid,
                                      spersonid=org.spersonid)
                norg.sid = org.spersonid + '@' + orgId
                norg.sfid = parent_org.sfid + '/' + org.sid + '.psm'
                norg.sfcode = parent_org.sfcode + '/' + org.scode
                norg.sfname = parent_org.sfname + '/' + org.sname
                norg.snodekind = 'nkLimb'
                norg.sparent = orgId
                norg.slevel = parent_org.slevel + 1
                db.session.add(norg)
        db.session.commit()
        rdata['state'] = True
    return json.dumps(rdata, ensure_ascii=False)


# 取消分配
@system.route("/OPM/organization/disassignPsmAction", methods=["GET", "POST"])
@user_login
def disassign_psm():
    rdata = dict()
    rowid = url_decode(request.form.get('rowid'))
    org = SAOrganization.query.filter_by(sid=rowid).first()
    if org:
        if org.snodekind == 'nkLimb':
            db.session.delete(org)
            db.session.commit()
            rdata['state'] = True
        else:
            rdata['state'] = False
            rdata['msg'] = '人员并非分配的人员，不能取消分配！'
    else:
        rdata['state'] = False
        rdata['msg'] = '指定的id不存在！'
    return json.dumps(rdata, ensure_ascii=False)
