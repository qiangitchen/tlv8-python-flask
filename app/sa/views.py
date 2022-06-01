# _*_ coding: utf-8 _*_

from . import system
from flask import session, redirect, url_for, render_template, request, abort
from sqlalchemy import or_
from datetime import datetime
from app import db
from app.sa.forms import LoginForm, OrgForm, PersonForm, RoleForm
from app.models import SAOrganization, SAPerson, SALogs, SARole, SAPermission, SAAuthorize, SAOnlineInfo
from app.models import SAFlowDraw, SAFlowFolder
from app.menus.menuutils import get_process_name, get_process_full, get_function_tree, is_have_author_url
from app.menus.menuutils import get_function_ztree
from app.common.pubstatic import url_decode, create_icon, nul2em, md5_code, guid, get_org_type
from app.sa.persons import get_person_info, get_curr_person_info, get_permission_list
from app.sa.onlineutils import set_online, clear_online
from app.sa.orgutils import can_move_to, up_child_org_path
from app.flow.expressions import get_expression_tree
from functools import wraps
import json


# 登录装饰器(验证是否已登录和是否有权限访问)
def user_login(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "user_id" not in session:  # 未登录则跳转登录页
            return redirect(url_for("home.login"))
        else:
            if 'permission' in session:
                per = session['permission']
            else:
                per = get_permission_list(session['user_id'])
                session['permission'] = per
            if not is_have_author_url(per, request.path):
                abort(403)  # 返回没有访问权限的错误
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
    session.pop('permission', None)
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
        if len(activateName) < 1:
            activateName = get_process_name(srcPath)
        sprocessName = get_process_full(srcPath)
        person_info = get_curr_person_info()
        ip = request.remote_addr
        log = SALogs(sdescription=discription,
                     stypename="前端提交",
                     sprocessname=sprocessName,
                     sactivityname=activateName,
                     sactionname=actionName,
                     screatorpersonid=person_info['personid'],
                     screatorpersonname=person_info['personName'],
                     screatorfid=person_info['orgfid'],
                     screatorfname=person_info['orgfname'],
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
    org_query = SAOrganization.query.filter(SAOrganization.svalidstate > -1)
    show_system = request.args.get('show_system')
    if not show_system:
        org_query = org_query.filter(SAOrganization.scode != 'SYSTEM')
    hide_psm = request.args.get('hide_psm')
    if hide_psm:
        org_query = org_query.filter(SAOrganization.sorgkindid != 'psm')
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
    limit = request.args.get('limit', 20, type=int)
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
    search_text = request.args.get('search_text')
    if search_text:
        org_query = org_query.filter(or_(SAOrganization.scode.ilike('%' + search_text + '%'),
                                         SAOrganization.sname.ilike('%' + search_text + '%')))
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
        print(data)
        operator = request.args.get('operator')
        if operator == 'edit':
            model = SAOrganization.query.filter_by(sid=data['sid']).first()
            if not model:
                model = SAOrganization()
            else:
                model.version = model.version + 1
        else:
            model = SAOrganization()
        if data['sparent'] and data['sparent'] != "":
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
            org.version = org.version + 1
            person.version = person.version + 1
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
@system.route("/dialog/SelectChPsm")
@user_login
def select_ch_psm():
    return render_template("system/dialog/SelectChPsm.html")


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


# 设置所属部门
@system.route("/OPM/organization/setMemberOrgAction", methods=["GET", "POST"])
@user_login
def set_member_org():
    rdata = dict()
    rowid = url_decode(request.form.get('rowid'))
    org = SAOrganization.query.filter_by(sid=rowid, sorgkindid='psm').first()
    if org:
        # 更新其他部门下的人员为（分配）
        other_orgs = SAOrganization.query.filter(SAOrganization.sid != rowid, SAOrganization.sorgkindid == 'psm',
                                                 SAOrganization.spersonid == org.spersonid).all()
        for o in other_orgs:
            o.snodekind = 'nkLimb'
            db.session.add(o)
        # 更新人员表的机构ID
        person = SAPerson.query.filter_by(sid=org.spersonid).first()
        person.smainorgid = org.sparent
        db.session.add(person)
        # 更新节点类型为空
        org.snodekind = None
        db.session.add(org)
        db.session.commit()
        rdata['state'] = True
    else:
        rdata['state'] = False
        rdata['msg'] = '指定的id不存在！'
    return json.dumps(rdata, ensure_ascii=False)


# 移动/选择机构
@system.route("/OPM/organization/moveOrg", methods=["GET", "POST"])
@user_login
def move_org():
    if request.method == "POST":
        rdata = dict()
        rowid = url_decode(request.form.get('rowid'))
        org_id = url_decode(request.form.get('orgID'))
        from_org = SAOrganization.query.filter_by(sid=rowid).first()
        to_org = SAOrganization.query.filter_by(sid=org_id).first()
        if from_org and to_org:
            state, msg = can_move_to(from_org, to_org)
            if state:
                if from_org.sorgkindid == 'psm':  # 如果是人员类型需要更新主键，需要特殊处理。
                    new_org_id = from_org.spersonid + '@' + to_org.sid
                    db.session.execute('update sa_oporg set sid = :nid_  where sid = :sid_',
                                       {'nid_': new_org_id, 'sid_': from_org.sid})
                    db.session.commit()
                    from_org = SAOrganization.query.filter_by(sid=new_org_id).first()
                    if from_org.snodekind != 'nkLimb':  # 如果不是挂载的人员需要更新人员表的机构id
                        person = SAPerson.query.filter_by(sid=from_org.spersonid)
                        person.smainorgid = to_org.sid
                        db.session.add(person)
                from_org.sparent = to_org.sid
                from_org.sfid = to_org.sfid + '/' + from_org.sid + '.' + from_org.sorgkindid
                from_org.sfcode = to_org.sfcode + '/' + from_org.scode
                from_org.sfname = to_org.sfname + '/' + from_org.sname
                db.session.add(from_org)
                db.session.commit()
                if from_org.sorgkindid != 'psm':  # 如果移动的不是人员需要更新下属组织的路径
                    up_child_org_path(from_org)
                rdata['state'] = True
            else:
                rdata['state'] = False
                rdata['msg'] = msg
        else:
            rdata['state'] = False
            rdata['msg'] = '指定的id不存在！'
        return json.dumps(rdata, ensure_ascii=False)
    return render_template("system/OPM/dialog/moveOrg.html")


# 启用/禁用组织
@system.route("/OPM/organization/changeOrgAble", methods=["GET", "POST"])
@user_login
def change_org_able():
    rdata = dict()
    rowid = url_decode(request.form.get('rowid'))
    state = url_decode(request.form.get('state'))
    org = SAOrganization.query.filter_by(sid=rowid).first()
    if org:
        child_org = SAOrganization.query.filter(SAOrganization.sfid.like(org.sfid + '%')).all()
        for o in child_org:
            o.svalidstate = state
            db.session.add(o)
        db.session.commit()
        rdata['state'] = True
    else:
        rdata['state'] = False
        rdata['msg'] = '指定的id不存在！'
    return json.dumps(rdata, ensure_ascii=False)


# 删除组织-逻辑删除
@system.route("/OPM/organization/deleteOrgLogic", methods=["GET", "POST"])
@user_login
def delete_org_logic():
    rdata = dict()
    rowid = url_decode(request.form.get('rowid'))
    org = SAOrganization.query.filter_by(sid=rowid).first()
    if org:
        child_org = SAOrganization.query.filter(SAOrganization.sfid.like(org.sfid + '%')).all()
        for o in child_org:
            if o.sorgkindid == 'psm':
                person = SAPerson.query.filter_by(smainorgid=o.sparent).first()
                if person:
                    person.svalidstate = -1
                    db.session.add(person)
            o.svalidstate = -1
            db.session.add(o)
        db.session.commit()
        rdata['state'] = True
    else:
        rdata['state'] = False
        rdata['msg'] = '指定的id不存在！'
    return json.dumps(rdata, ensure_ascii=False)


# 回收站
@system.route("/OPM/recycled", methods=["GET", "POST"])
@user_login
def recycled():
    if request.method == "POST":
        rdata = dict()
        action = url_decode(request.form.get('action'))
        rowids = url_decode(request.form.get('rowids'))
        if action == 'reduction':  # 还原
            for rowid in rowids.split(","):
                org = SAOrganization.query.filter_by(sid=rowid).first()
                if org:
                    child_org = SAOrganization.query.filter(SAOrganization.sfid.like(org.sfid + '%')).all()
                    for o in child_org:
                        if o.sorgkindid == 'psm':
                            person = SAPerson.query.filter_by(smainorgid=o.sparent).first()
                            if person:
                                person.svalidstate = 1
                                db.session.add(person)
                        o.svalidstate = 1
                        db.session.add(o)
                    db.session.commit()
        elif action == 'delete':  # 删除数据
            for rowid in rowids.split(","):
                org = SAOrganization.query.filter_by(sid=rowid).first()
                if org:
                    child_org = SAOrganization.query.filter(SAOrganization.sfid.like(org.sfid + '%')).all()
                    for o in child_org:
                        if o.sorgkindid == 'psm':
                            person = SAPerson.query.filter_by(smainorgid=o.sparent).first()
                            if person:
                                db.session.delete(person)
                        db.session.delete(o)
                    db.session.commit()
        rdata['state'] = True
        return json.dumps(rdata, ensure_ascii=False)
    # 加载数据到页面==
    org_query = SAOrganization.query.filter_by(svalidstate=-1)
    search_text = url_decode(request.args.get('search_text', ''))
    if search_text and search_text != '':
        org_query = org_query.filter(or_(SAOrganization.scode.ilike('%' + search_text + '%'),
                                         SAOrganization.sname.ilike('%' + search_text + '%')))
    count = org_query.count()
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 20, type=int)
    page_data = org_query.order_by(SAOrganization.slevel.asc(), SAOrganization.ssequence.asc()).paginate(page, limit)
    return render_template("system/OPM/recycled.html", count=count, page=page, limit=limit,
                           page_data=page_data, search_text=search_text,
                           create_icon=create_icon,
                           get_org_type=get_org_type)


# 角色管理
@system.route("/OPM/role")
@user_login
def role():
    return render_template("system/OPM/role.html")


# 角色数据列表
@system.route("/OPM/role/roleList")
@user_login
def role_list():
    rdata = dict()
    rdata['code'] = 0
    role_query = SARole.query
    search_role = url_decode(request.args.get('search_role', ''))
    if search_role and search_role != '':
        role_query = role_query.filter(or_(SARole.scode.ilike('%' + search_role + '%'),
                                           SARole.sname.ilike('%' + search_role + '%')))
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 20, type=int)
    count = role_query.count()
    rdata['count'] = count
    page_data = role_query.order_by(SARole.ssequence.asc()).paginate(page, limit)
    no = 1
    data = list()
    for d in page_data.items:
        row_data = dict()
        row_data['no'] = no + (page - 1) * limit
        row_data['sid'] = d.sid
        row_data['sname'] = d.sname
        row_data['scode'] = d.scode
        row_data['srolekind'] = d.srolekind
        row_data['sdescription'] = d.sdescription
        data.append(row_data)
        no += 1
    rdata['data'] = data
    return json.dumps(rdata, ensure_ascii=False)


# 编辑角色数据
@system.route("/OPM/role/editRole", methods=["GET", "POST"])
@user_login
def edit_role():
    rowid = request.args.get('rowid')
    operator = request.args.get('operator')
    model = SARole.query.filter_by(sid=rowid).first()
    form = RoleForm()
    if form.validate_on_submit():
        rdata = dict()
        data = form.data
        if not model:
            model = SARole()
        model.sname = data['sname']
        model.scode = data['scode']
        model.srolekind = data['srolekind']
        model.sdescription = data['sdescription']
        db.session.add(model)
        db.session.commit()
        rdata['state'] = True
        return json.dumps(rdata, ensure_ascii=False)
    return render_template("system/OPM/dialog/editRole.html", nul2em=nul2em,
                           model=model, form=form,
                           operator=operator, rowid=rowid)


# 删除角色数据
@system.route("/OPM/role/deleteRole", methods=["POST"])
@user_login
def delete_role():
    rdata = dict()
    rowid = request.form.get('rowid')
    model = SARole.query.filter_by(sid=rowid).first()
    if model:
        if model.sid == 'RL01':
            rdata['state'] = False
            rdata['msg'] = '超管角色不允许删除！'
            return json.dumps(rdata, ensure_ascii=False)
        perm = SAPermission.query.filter_by(spermissionroleid=model.sid).all()
        for p in perm:  # 删除角色需要同时删除角色授权
            db.session.delete(p)
        db.session.delete(model)
        db.session.commit()
        rdata['state'] = True
    else:
        rdata['state'] = False
        rdata['msg'] = '指定的角色id不存在！'
    return json.dumps(rdata, ensure_ascii=False)


# 角色权限数据列表
@system.route("/OPM/role/PermissionList")
@user_login
def permission_list():
    rdata = dict()
    rdata['code'] = 0
    role_id = request.args.get('role_id')
    permission_kind = request.args.get('permission_kind', 0)
    data_query = SAPermission.query.filter_by(spermissionkind=permission_kind, spermissionroleid=role_id)
    search_perm = url_decode(request.args.get('search_perm', ''))
    if search_perm and search_perm != '':
        data_query = data_query.filter(or_(SAPermission.sprocess.ilike('%' + search_perm + '%'),
                                           SAPermission.sactivityfname.ilike('%' + search_perm + '%'),
                                           SAPermission.sactivity.ilike('%' + search_perm + '%'),
                                           SAPermission.sdescription.ilike('%' + search_perm + '%'),
                                           SAPermission.sactionsnames.ilike('%' + search_perm + '%')))
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 20, type=int)
    count = data_query.count()
    rdata['count'] = count
    page_data = data_query.order_by(SAPermission.ssequence.asc()).paginate(page, limit)
    no = 1
    data = list()
    for d in page_data.items:
        row_data = dict()
        row_data['no'] = no + (page - 1) * limit
        row_data['sid'] = d.sid
        row_data['sactivityfname'] = d.sactivityfname
        row_data['sprocess'] = d.sprocess
        row_data['sactivity'] = d.sactivity
        row_data['sactionsnames'] = d.sactionsnames
        row_data['sactions'] = d.sactions
        row_data['sdescription'] = d.sdescription
        data.append(row_data)
        no += 1
    rdata['data'] = data
    return json.dumps(rdata, ensure_ascii=False)


# 功能树选择
@system.route("/dialog/functionTreeSelect")
@user_login
def function_tree_select():
    return render_template("system/dialog/functionTreeSelect.html", functions=get_function_tree())


# 分配功能权限
@system.route("/OPM/role/AssignPermissions", methods=["GET", "POST"])
@user_login
def assign_permissions():
    rdata = dict()
    rowid = url_decode(request.form.get('rowid'))
    values = url_decode(request.form.get('values'))
    sa_role = SARole.query.filter_by(sid=rowid).first()
    if sa_role:
        per = eval(values)
        i = 1
        for p in per:
            permission = SAPermission(spermissionroleid=sa_role.sid)
            permission.sprocess = p['process']
            permission.sactivityfname = p['fullname']
            permission.sactivity = p['activity']
            permission.sdescription = p['url']
            permission.ssequence = i
            db.session.add(permission)
            i += 1
        db.session.commit()
        rdata['state'] = True
    else:
        rdata['state'] = False
        rdata['state'] = '指定的角色ID错误！'
    return json.dumps(rdata, ensure_ascii=False)


# 取消（删除）功能权限
@system.route("/OPM/role/CancelPermissions", methods=["GET", "POST"])
@user_login
def cancel_permissions():
    rdata = dict()
    try:
        values = url_decode(request.form.get('values'))
        ids = values.split(',')
        for sid in ids:
            permission = SAPermission.query.filter_by(sid=sid).first()
            db.session.delete(permission)
        db.session.commit()
        rdata['state'] = True
    except Exception as e:
        rdata['state'] = False
        rdata['msg'] = '操作异常：' + str(e)
    return json.dumps(rdata, ensure_ascii=False)


# 授权管理
@system.route("/OPM/authorization")
@user_login
def authorization():
    return render_template("system/OPM/authorization.html")


# 授权管理-角色列表数据
@system.route("/OPM/authorization/dataList")
@user_login
def authorization_data_list():
    rdata = dict()
    rdata['code'] = 0
    data_query = SAAuthorize.query
    org_id = request.args.get('org_id')
    if org_id:
        data_query = data_query.filter_by(sorgid=org_id)
    else:
        data_query = data_query.filter(1 == 2)  # 没有传机构id则不加载数据
    query_text = url_decode(request.args.get('query_text', ''))
    if query_text and query_text != '':
        data_query = data_query.filter(or_(SAAuthorize.sdescription.ilike('%' + query_text + '%'),
                                           SAAuthorize.sauthorizerolecode.ilike('%' + query_text + '%'),
                                           SAAuthorize.sauthorizeroleid.ilike('%' + query_text + '%')))
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 20, type=int)
    count = data_query.count()
    rdata['count'] = count
    page_data = data_query.order_by(SAAuthorize.screatetime.desc()).paginate(page, limit)
    no = 1
    data = list()
    for d in page_data.items:
        row_data = dict()
        row_data['no'] = no + (page - 1) * limit
        row_data['sid'] = d.sid
        row_data['sauthorizeroleid'] = d.sauthorizeroleid
        row_data['sauthorizerolecode'] = d.sauthorizerolecode
        row_data['sdescription'] = d.sdescription
        row_data['sorgfname'] = d.sorgfname
        row_data['screatorfname'] = d.screatorfname
        row_data['screatetime'] = str(d.screatetime)
        data.append(row_data)
        no += 1
    rdata['data'] = data
    return json.dumps(rdata, ensure_ascii=False)


# 授权管理-角色列表-对话框
@system.route("/OPM/authorization/dialog/roleList")
@user_login
def authorization_role_list():
    return render_template("system/OPM/dialog/role-list.html")


# 授权管理-添加（分配）角色
@system.route("/OPM/authorization/addRole", methods=["POST"])
@user_login
def authorization_add_role():
    rdata = dict()
    try:
        orgid = url_decode(request.form.get('orgid'))
        roles = url_decode(request.form.get('roles'))
        role_list = roles.split(",")
        org = SAOrganization.query.filter_by(sid=orgid).first()
        for rid in role_list:
            role = SARole.query.filter_by(sid=rid).first()
            authorize = SAAuthorize(sauthorizeroleid=role.sid, sauthorizerolecode=role.scode, sdescription=role.sname)
            person_info = get_curr_person_info()
            authorize.screatorfid = person_info['personfid']
            authorize.screatorfname = person_info['personfname']
            authorize.sorgid = org.sid
            authorize.sorgname = org.sname
            authorize.sorgfid = org.sfid
            authorize.sorgfname = org.sfname
            db.session.add(authorize)
        db.session.commit()
        rdata['state'] = True
    except Exception as e:
        rdata['state'] = False
        rdata['msg'] = '操作异常：' + str(e)
    return json.dumps(rdata, ensure_ascii=False)


# 授权管理-删除（取消）分配角色
@system.route("/OPM/authorization/deleteRole", methods=["POST"])
@user_login
def authorization_del_role():
    rdata = dict()
    try:
        values = url_decode(request.form.get('values'))
        ids = values.split(',')
        for sid in ids:
            permission = SAAuthorize.query.filter_by(sid=sid).first()
            if 'PSN01@ORG01' == permission.sorgid and 'RL01' == permission.sauthorizeroleid:
                continue  # 超管用户的授权不能删除-防止误删
            db.session.delete(permission)
        db.session.commit()
        rdata['state'] = True
    except Exception as e:
        rdata['state'] = False
        rdata['msg'] = '操作异常：' + str(e)
    return json.dumps(rdata, ensure_ascii=False)


# 在线用户信息
@system.route("/online", methods=["GET", "POST"])
@user_login
def online_info():
    data_query = SAOnlineInfo.query
    search_text = url_decode(request.args.get('search_text', ''))
    if search_text and search_text != '':
        data_query = data_query.filter(or_(SAOnlineInfo.susername.ilike('%' + search_text + '%'),
                                           SAOnlineInfo.suserfname.ilike('%' + search_text + '%'),
                                           SAOnlineInfo.sloginip.ilike('%' + search_text + '%')))
    count = data_query.count()
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 20, type=int)
    page_data = data_query.order_by(SAOnlineInfo.slogindate.desc()).paginate(page, limit)
    return render_template("system/online/OnlineInfo.html", count=count, page=page, limit=limit,
                           page_data=page_data, search_text=search_text)


# 系统（操作）日志
@system.route("/logs", methods=["GET", "POST"])
@user_login
def sys_log():
    data_query = SALogs.query
    search_text = url_decode(request.args.get('search_text', ''))
    if search_text and search_text != '':
        data_query = data_query.filter(or_(SALogs.sdescription.ilike('%' + search_text + '%'),
                                           SALogs.sactivityname.ilike('%' + search_text + '%'),
                                           SALogs.sactionname.ilike('%' + search_text + '%')))
    count = data_query.count()
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 20, type=int)
    page_data = data_query.order_by(SALogs.screatetime.desc()).paginate(page, limit)
    return render_template("system/log/SysLog.html", count=count, page=page, limit=limit,
                           page_data=page_data, search_text=search_text)


# 流程设计
@system.route("/flow/flow_design", methods=["GET", "POST"])
@user_login
def flow_design():
    return render_template("system/flow/dwr/flow_design.html")


# 流程设计-流程选择对话框
@system.route("/flow/dwr/dialog/processSelect", methods=["GET", "POST"])
@user_login
def process_select():
    return render_template("system/flow/dwr/dialog/processSelect.html")


# 加载流程目录树
@system.route("/flow/dwr/dialog/TreeSelectAction", methods=["GET", "POST"])
@user_login
def flow_folder_tree():
    rdata = dict()
    data = request.form
    params = url_decode(data.get('params', ''))  # 接收的参数需要解码
    param_dict = eval(params)  # 字符串转字典
    others = param_dict.get('other', '').split(',')
    org_query = SAFlowFolder.query
    currenid = data.get('currenid')
    if currenid:
        org_query = org_query.filter(SAFlowFolder.sparent == currenid)
    else:
        org_query = org_query.filter(or_(SAFlowFolder.sparent.is_(None), SAFlowFolder.sparent == 'root'))
    orgs = org_query.all()
    json_result = list()
    if not currenid:
        root_item = dict()
        root_item['id'] = 'root'
        root_item['name'] = '根目录'
        root_item['sidpath'] = '/root'
        root_item['isParent'] = True
        json_result.append(root_item)
    for org in orgs:
        item = dict()
        item['id'] = getattr(org, param_dict['id'])
        item['name'] = getattr(org, param_dict['name'])
        item['parent'] = getattr(org, param_dict['parent'])
        for o in others:
            item[o] = getattr(org, o)
        item['isParent'] = True
        json_result.append(item)
    rdata['jsonResult'] = json_result
    return json.dumps(rdata, ensure_ascii=False)


# 流程目录树-搜索
@system.route("/flow/dwr/dialog/QuickTreeAction", methods=["GET", "POST"])
@user_login
def flow_folder_tree_quick():
    rdata = dict()
    data = request.form
    quicktext = url_decode(data.get('quicktext', ''))
    path = url_decode(data.get('path', ''))
    org_query = SAFlowFolder.query
    org_query = org_query.filter(
        or_(SAFlowFolder.sid.ilike(quicktext), SAFlowFolder.scode.ilike('%' + quicktext + '%'),
            SAFlowFolder.sname.ilike('%' + quicktext + '%')))
    orgs = org_query.all()
    json_result = list()
    for org in orgs:
        item = dict()
        item[path] = getattr(org, path)
        json_result.append(item)
    rdata['jsonResult'] = json_result
    return json.dumps(rdata, ensure_ascii=False)


# 流程目录树-添加节点
@system.route("/flow/dwr/dialog/insertflwFolderAction", methods=["GET", "POST"])
@user_login
def flow_folder_tree_add():
    rdata = dict()
    data = request.form
    id = url_decode(data.get('id', ''))
    pid = url_decode(data.get('pid', ''))
    scode = url_decode(data.get('scode', ''))
    name = url_decode(data.get('name', ''))
    sidpath = url_decode(data.get('sidpath', ''))
    folder = SAFlowFolder(sid=id, scode=scode, sname=name, sparent=pid, sidpath=sidpath)
    db.session.add(folder)
    db.session.commit()
    rdata['state'] = True
    return json.dumps(rdata, ensure_ascii=False)


# 流程目录树-节点编辑
@system.route("/flow/dwr/dialog/editflwFolderAction", methods=["GET", "POST"])
@user_login
def flow_folder_tree_edit():
    rdata = dict()
    data = request.form
    id = url_decode(data.get('id', ''))
    name = url_decode(data.get('name', ''))
    folder = SAFlowFolder.query.filter_by(sid=id).first()
    if folder:
        folder.sname = name
        db.session.add(folder)
        db.session.commit()
        rdata['state'] = True
    else:
        rdata['state'] = False
    return json.dumps(rdata, ensure_ascii=False)


# 流程目录树-节点删除
@system.route("/flow/dwr/dialog/deleteflwFolderAction", methods=["POST"])
@user_login
def flow_folder_tree_del():
    rdata = dict()
    data = request.form
    id = url_decode(data.get('id', ''))
    sidpath = url_decode(data.get('sidpath'))
    folder = SAFlowFolder.query.filter_by(sid=id).first()
    if folder:
        db.session.delete(folder)
        db.session.execute("delete from sa_flowfolder where sidpath like :sidpath_", {'sidpath_': str(sidpath) + '%'})
        db.session.commit()
        rdata['state'] = True
    else:
        rdata['state'] = False
    return json.dumps(rdata, ensure_ascii=False)


# 流程设计-流程选择-流程数据列表
@system.route("/flow/dwr/dialog/dataList", methods=["GET", "POST"])
@user_login
def process_list():
    rdata = dict()
    rdata['code'] = 0
    sparent = request.args.get('sparent')
    action = request.args.get('action', '')
    if action == 'add':
        user = get_curr_person_info()
        new_data = SAFlowDraw()
        new_data.sprocessid = guid()
        new_data.sprocessname = '新建的流程图'
        new_data.screatorname = user['personName']
        if sparent:
            new_data.sfolderid = sparent
        else:
            new_data.sfolderid = 'root'
        db.session.add(new_data)
        db.session.commit()
    data_query = SAFlowDraw.query
    if sparent:
        data_query = data_query.filter(SAFlowDraw.sfolderid == sparent)
    search_text = url_decode(request.args.get('search_text', ''))
    if search_text and search_text != '':
        data_query = data_query.filter(or_(SAFlowDraw.sprocessid.ilike('%' + search_text + '%'),
                                           SAFlowDraw.sprocessname.ilike('%' + search_text + '%')))
    count = data_query.count()
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 20, type=int)
    rdata['count'] = count
    page_data = data_query.order_by(SAFlowDraw.screatetime.desc()).paginate(page, limit)
    no = 1
    data = list()
    for d in page_data.items:
        row_data = dict()
        row_data['no'] = no + (page - 1) * limit
        row_data['sid'] = d.sid
        row_data['sprocessid'] = d.sprocessid
        row_data['sprocessname'] = d.sprocessname
        row_data['screatorname'] = d.screatorname
        row_data['screatetime'] = datetime.strftime(d.screatetime, '%Y-%m-%d %H:%M:%S')
        data.append(row_data)
        no += 1
    rdata['data'] = data
    return json.dumps(rdata, ensure_ascii=False)


# 流程图列表-删除数据
@system.route("/flow/dwr/dialog/deleteFlowDWR", methods=["POST"])
@user_login
def process_list_del():
    rdata = dict()
    id = url_decode(request.form.get('id', ''))
    dwr = SAFlowDraw.query.filter_by(sid=id).first()
    if dwr:
        db.session.delete(dwr)
        db.session.commit()
        rdata['state'] = True
    else:
        rdata['state'] = False
        rdata['msg'] = '指定的id无效!'
    return json.dumps(rdata, ensure_ascii=False)


# 流程图列表-修改数据
@system.route("/flow/dwr/dialog/editFlowDWR", methods=["POST"])
@user_login
def process_list_edit():
    rdata = dict()
    id = url_decode(request.form.get('id', ''))
    value = url_decode(request.form.get('value'))
    field = url_decode(request.form.get('field'))
    dwr = SAFlowDraw.query.filter_by(sid=id).first()
    if dwr and field:
        setattr(dwr, field, value)
        db.session.add(dwr)
        db.session.commit()
        rdata['state'] = True
    else:
        rdata['state'] = False
        rdata['msg'] = '指定的id或字段无效!'
    return json.dumps(rdata, ensure_ascii=False)


# 加载流程图
@system.route("/flow/dwr/flowloadIocusXAction", methods=["GET", "POST"])
@user_login
def flow_load_io_cus():
    rdata = dict()
    processID = url_decode(request.form.get('processID', ''))
    dwr = SAFlowDraw.query.filter_by(sprocessid=processID).first()
    if dwr:
        data = dict()
        data['id'] = dwr.sprocessid
        data['name'] = dwr.sprocessname
        data['jsonStr'] = dwr.sprocessacty
        rdata['data'] = data
        rdata['state'] = True
    else:
        rdata['state'] = False
        rdata['msg'] = '指定的id无效!'
    return json.dumps(rdata, ensure_ascii=False)


# 保存流程图
@system.route("/flow/dwr/saveFlowDrawLGAction", methods=["GET", "POST"])
@user_login
def save_flow_draw():
    rdata = dict()
    sprocessid = url_decode(request.form.get('sprocessid', ''))
    print(sprocessid)
    # sprocessname = url_decode(request.form.get('sprocessname', ''))
    sdrawlg = url_decode(request.form.get('sdrawlg', ''))
    sprocessacty = url_decode(request.form.get('sprocessacty', ''))
    dwr = SAFlowDraw.query.filter_by(sprocessid=sprocessid).first()
    try:
        if dwr:
            # dwr.sprocessname = sprocessname
            dwr.sdrawlg = sdrawlg
            dwr.sprocessacty = sprocessacty
            db.session.add(dwr)
            db.session.commit()
            rdata['state'] = True
        else:
            rdata['state'] = False
            rdata['msg'] = 'sprocessid无效!'
    except Exception as e:
        rdata['state'] = False
        rdata['msg'] = '保存异常：' + str(e)
    return json.dumps(rdata, ensure_ascii=False)


# 流程设计-选择执行页面对话框
@system.route("/flow/dwr/dialog/funcTreeSelect", methods=["GET", "POST"])
@user_login
def func_tree_select():
    return render_template("system/flow/dwr/dialog/funcTreeSelect.html")


# 选择执行页面对话框-加载功能树
@system.route("/flow/dwr/dialog/getFunctionTreeAction", methods=["GET", "POST"])
@user_login
def get_function_ztree_action():
    rdata = dict()
    rdata['data'] = get_function_ztree()
    rdata['state'] = True
    return json.dumps(rdata, ensure_ascii=False)


# 流程设计-表单时编辑器对话框
@system.route("/flow/dwr/dialog/expressionEditor", methods=["GET", "POST"])
@user_login
def expression_editor():
    return render_template("system/flow/dwr/dialog/expressionEditor.html")


# 选择执行页面对话框-加载表达式
@system.route("/flow/dwr/dialog/GetExpressionTreeAction", methods=["GET", "POST"])
@user_login
def get_expression_tree_action():
    rdata = dict()
    rdata['data'] = get_expression_tree()
    rdata['state'] = True
    return json.dumps(rdata, ensure_ascii=False)
