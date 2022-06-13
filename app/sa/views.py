# _*_ coding: utf-8 _*_

import os
import uuid

from . import system
from flask import session, render_template, request, current_app, send_file, send_from_directory, abort
from sqlalchemy import or_
from datetime import datetime
from app import db
from app.sa.forms import LoginForm, ChangePassForm, OrgForm, PersonForm, RoleForm, DocNodeForm, UpLoadForm
from app.models import SAOrganization, SAPerson, SALogs, SARole, SAPermission, SAAuthorize, SAOnlineInfo
from app.models import SAFlowDraw, SAFlowFolder, SATask
from app.models import SADocNode, SADocPath
from app.menus.menuutils import get_process_name, get_process_full, get_function_tree
from app.menus.menuutils import get_function_ztree
from app.common.pubstatic import url_decode, create_icon, nul2em, md5_code, guid, get_org_type
from app.common.persons import get_person_info, get_curr_person_info
from app.common.decorated import user_login
from app.sa.onlineutils import set_online, clear_online
from app.sa.orgutils import can_move_to, up_child_org_path
from app.flow.expressions import get_expression_tree
from app.flow.flowcontroller import seach_process_id
from app.sa.docutils import get_doc_folder_by_path
from mimetypes import MimeTypes
import json


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


@system.route("/User/change_password", methods=["GET", "POST"])
@user_login
def change_password():
    form = ChangePassForm()
    if form.is_submitted():
        rdata = dict()
        person_id = session['user_id']
        old_pass = form.data['old_pass']
        new_pass = form.data['new_pass']
        user = SAPerson.query.filter_by(sid=person_id, svalidstate=1).first()
        if user:
            if user.spassword != old_pass:
                rdata['state'] = False
                rdata['msg'] = "原密码验证失败~"
            else:
                user.spassword = new_pass
                db.session.add(user)
                db.session.commit()
                rdata['state'] = True
        return json.dumps(rdata, ensure_ascii=False)
    return render_template("home/dialog/changePassword.html", form=form)


"""
下面是系统管理基础模块
"""


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
        if not activateName or len(activateName) < 1:
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


# 选择人员（单选）
@system.route("/dialog/singleSelectPsn")
@user_login
def single_select_psm():
    return render_template("system/dialog/singleSelectPsn.html")


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
    else:
        search_text = ""
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
    else:
        search_text = ""
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
    else:
        search_text = ""
    count = data_query.count()
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 20, type=int)
    page_data = data_query.order_by(SALogs.screatetime.desc()).paginate(page, limit)
    return render_template("system/log/SysLog.html", count=count, page=page, limit=limit,
                           page_data=page_data, search_text=search_text)


"""
下面是流程引擎相关功能
"""


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
    p_folder = SAFlowFolder.query.filter_by(sparent=id).first()
    if p_folder:
        rdata['state'] = False
        rdata['msg'] = '指定的目录下有子目录不能删除，如确认要删除，请先删除子目录~'
        return json.dumps(rdata, ensure_ascii=False)
    draw = SAFlowDraw.query.filter_by(sfolderid=id).first()
    if draw:
        rdata['state'] = False
        rdata['msg'] = '指定的目录下有流程图，不能删除此目录，如确认要删除，请先删除目录下的流程图~'
        return json.dumps(rdata, ensure_ascii=False)
    if folder:
        db.session.delete(folder)
        # 删除目录时同步删除子目录（或者判断有子目录时不让删除，以免出现垃圾数据）
        db.session.execute("delete from sa_flowfolder where sidpath like :sidpath_", {'sidpath_': str(sidpath) + '%'})
        db.session.commit()
        rdata['state'] = True
    else:
        rdata['state'] = False
        rdata['msg'] = '指定的目录id无效~'
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


# 查看流程图
@system.route("/flow/viewiocusbot/", methods=["GET", "POST"])
@user_login
def view_iocusbot():
    return render_template("system/flow/viewiocusbot/iocus_bot.html")


# 查看流程图-加载流程图
@system.route("/flow/viewiocusbot/flowloadIocusAction", methods=["GET", "POST"])
@user_login
def flow_load_iocus_action():
    rdata = dict()
    flowID = url_decode(request.form.get('flowID', ''))
    currentUrl = url_decode(request.form.get('currentUrl', ''))
    sprocessid = None
    if flowID and flowID != "":
        task = SATask.query.filter(SATask.sflowid == flowID).first()
        if task:
            sprocessid = task.sprocess
        elif currentUrl and currentUrl != "":
            sprocessid = seach_process_id(currentUrl)
    if not sprocessid:
        rdata['state'] = False
        rdata['msg'] = "没有找到流程图，请确认流程图配置！"
    else:
        dwr = SAFlowDraw.query.filter_by(sprocessid=sprocessid).first()
        if dwr:
            data = dict()
            data['id'] = sprocessid
            data['name'] = dwr.sprocessname
            data['jsonStr'] = dwr.sprocessacty
            rdata['data'] = data
            rdata['state'] = True
        else:
            rdata['state'] = False
            rdata['msg'] = "processid无效~"
    return json.dumps(rdata, ensure_ascii=False)


# 查看流程图-加载流程图(process)
@system.route("/flow/viewiocusbot/getFlowDrawAction", methods=["GET", "POST"])
@user_login
def flow_load_draw_action():
    rdata = dict()
    sprocessid = url_decode(request.form.get('sprocessid', ''))
    if not sprocessid:
        rdata['state'] = False
        rdata['msg'] = "没有找到流程图，请确认流程图配置！"
    else:
        dwr = SAFlowDraw.query.filter_by(sprocessid=sprocessid).first()
        if dwr:
            data = dict()
            data['id'] = sprocessid
            data['name'] = dwr.sprocessname
            data['jsonStr'] = dwr.sprocessacty
            rdata['data'] = data
            rdata['state'] = True
        else:
            rdata['state'] = False
            rdata['msg'] = "processid无效~"
    return json.dumps(rdata, ensure_ascii=False)


# 首页待办任务列表框
@system.route("/flow/taskporLet/", methods=["GET", "POST"])
@user_login
def wait_task_view():
    person = get_curr_person_info()
    page_data = SATask.query.filter_by(sepersonid=person['personid'], sstatusid='tesReady').order_by(
        SATask.screatetime.desc()).paginate(1, 5)
    return render_template("system/flow/taskporLet/wait_task_view.html", page_data=page_data)


# 流程执行-选择执行人
@system.route("/flow/flowDialog/Select_executor", methods=["GET", "POST"])
@user_login
def select_executor():
    return render_template("system/flow/flowDialog/Select_executor.html")


# 任务中心
@system.route("/task/taskCenter", methods=["GET", "POST"])
@user_login
def task_center():
    option = request.args.get('option', 'waiting')
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 10, type=int)
    person = get_curr_person_info()
    data_query = SATask.query.filter(SATask.sflowid != SATask.sid, SATask.sepersonid == person['personid'])
    # if option == 'all':
    #     data_query = data_query.filter(SATask.sepersonid == person['personid'])
    if option == 'waiting':
        data_query = data_query.filter(SATask.sstatusid == 'tesReady')
    if option == 'finished':
        data_query = data_query.filter(SATask.sstatusid == 'tesFinished')
    if option == 'tesReturned':
        data_query = data_query.filter(SATask.sstatusid == 'tesReturned')
    if option == 'tesCanceled':
        data_query = data_query.filter(SATask.sstatusid == 'tesCanceled')
    if option == 'tesAborted':
        data_query = data_query.filter(SATask.sstatusid == 'tesAborted')
    search_text = url_decode(request.args.get('search_text', ''))
    if search_text and search_text != "":
        data_query = data_query.filter(
            or_(SATask.sname.ilike('%' + search_text + '%'), SATask.scpersonname.ilike('%' + search_text + '%'),
                SATask.scdeptname.ilike('%' + search_text + '%')))
    count = data_query.count()
    page_data = data_query.order_by(SATask.screatetime.desc()).paginate(page, limit)
    return render_template("system/task/taskCenter/mainActivity.html", option=option,
                           page_data=page_data, count=count, limit=limit, page=page,
                           nul2em=nul2em, search_text=search_text)


# 流程监控
@system.route("/flow/monitor", methods=["GET", "POST"])
@user_login
def flow_monitor():
    return render_template("system/task/monitor/mainActivity.html")


# 流程监控-流程数据列表
@system.route("/flow/monitor/processDataList", methods=["GET", "POST"])
@user_login
def process_data_list():
    rdata = dict()
    rdata['code'] = 0
    person = get_curr_person_info()
    data_query = SATask.query.filter(SATask.sid == SATask.sflowid)
    search_text = url_decode(request.args.get('search_text', ''))
    status = url_decode(request.args.get('status', ''))
    orgs = url_decode(request.args.get('orgs', 'myself'))
    if orgs == 'myself':
        data_query = data_query.filter(SATask.scpersonid == person['personid'])
    elif orgs != 'all':
        for ofid in orgs.split(","):
            data_query = data_query.filter(SATask.scfid.ilike(ofid + '%'))

    if search_text and search_text != '':
        data_query = data_query.filter(or_(SATask.sname.ilike('%' + search_text + '%'),
                                           SATask.sepersonname.ilike('%' + search_text + '%')))
    if status:
        if status != "all":
            data_query = data_query.filter_by(sstatusid=status)
    count = data_query.count()
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 20, type=int)
    rdata['count'] = count
    page_data = data_query.order_by(SATask.screatetime.desc()).paginate(page, limit)
    no = 1
    data = list()
    for d in page_data.items:
        row_data = dict()
        row_data['no'] = no + (page - 1) * limit
        row_data['sid'] = d.sid
        row_data['sflowid'] = d.sflowid
        row_data['sname'] = d.sname
        row_data['sflowname'] = d.sname
        ff = SATask.query.filter_by(sparentid=d.sid).first()
        if ff:
            row_data['sflowname'] = ff.sname
        row_data['screatetime'] = datetime.strftime(d.screatetime, '%Y-%m-%d %H:%M:%S')
        row_data['sepersonname'] = d.sepersonname
        row_data['sefname'] = d.sefname
        row_data['sstatusid'] = d.sstatusid
        row_data['sstatusname'] = d.sstatusname
        data.append(row_data)
        no += 1
    rdata['data'] = data
    return json.dumps(rdata, ensure_ascii=False)


# 流程监控-任务数据列表
@system.route("/flow/monitor/taskDataList", methods=["GET", "POST"])
@user_login
def task_data_list():
    rdata = dict()
    rdata['code'] = 0
    flowid = url_decode(request.args.get('flowid', ''))
    data_query = SATask.query.filter(SATask.sflowid == flowid, SATask.sid != flowid)
    search_text = url_decode(request.args.get('search_text', ''))
    status = url_decode(request.args.get('status', ''))
    if search_text and search_text != '':
        data_query = data_query.filter(or_(SATask.sname.ilike('%' + search_text + '%'),
                                           SATask.sepersonname.ilike('%' + search_text + '%')))
    if status:
        if status != "all":
            data_query = data_query.filter_by(sstatusid=status)
    count = data_query.count()
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 20, type=int)
    rdata['count'] = count
    page_data = data_query.order_by(SATask.screatetime.desc()).paginate(page, limit)
    no = 1
    data = list()
    for d in page_data.items:
        row_data = dict()
        row_data['no'] = no + (page - 1) * limit
        row_data['sid'] = d.sid
        row_data['sflowid'] = d.sflowid
        row_data['sname'] = d.sname
        row_data['sflowname'] = d.sname
        ff = SATask.query.filter_by(sparentid=d.sid).first()
        if ff:
            row_data['sflowname'] = ff.sname
        row_data['screatetime'] = datetime.strftime(d.screatetime, '%Y-%m-%d %H:%M:%S')
        row_data['scpersonname'] = d.scpersonname
        if d.sexecutetime:
            row_data['sexecutetime'] = datetime.strftime(d.sexecutetime, '%Y-%m-%d %H:%M:%S')
        row_data['sepersonname'] = d.sepersonname
        row_data['scfname'] = d.scfname
        row_data['sefname'] = d.sefname
        row_data['sstatusid'] = d.sstatusid
        row_data['sstatusname'] = d.sstatusname
        row_data['seurl'] = d.seurl
        row_data['sdata1'] = d.sdata1
        data.append(row_data)
        no += 1
    rdata['data'] = data
    return json.dumps(rdata, ensure_ascii=False)


"""
下面是文档中心功能
"""


# 文档中心
@system.route("/doc/docCenter", methods=["GET", "POST"])
@user_login
def doc_center():
    return render_template("system/doc/docCenter/mainActivity.html")


# 加载文档目录
@system.route("/doc/TreeSelectAction", methods=["GET", "POST"])
@user_login
def doc_tree_select():
    rdata = dict()
    data = request.form
    params = url_decode(data.get('params', ''))  # 接收的参数需要解码
    param_dict = eval(params)  # 字符串转字典
    others = param_dict.get('other', '').split(',')
    org_query = SADocNode.query.filter_by(skind='dir')
    currenid = data.get('currenid')
    if currenid:
        org_query = org_query.filter(SADocNode.sparentid == currenid)
    else:
        org_query = org_query.filter(or_(SADocNode.sparentid.is_(None), SADocNode.sparentid == ''))
    docs = org_query.order_by(SADocNode.screatetime.desc()).all()
    json_result = list()
    if not currenid:
        root_item = dict()
        root_item['id'] = 'root'
        root_item['name'] = '文档中心'
        root_item['skind'] = 'dir'
        root_item['sdocpath'] = '/root'
        root_item['sdocdisplaypath'] = '/文档中心'
        root_item['isParent'] = True
        json_result.append(root_item)
    for doc in docs:
        item = dict()
        item['id'] = getattr(doc, param_dict['id'])
        item['name'] = getattr(doc, param_dict['name'])
        item['parent'] = getattr(doc, param_dict['parent'])
        item['isParent'] = True
        for o in others:
            item[o] = getattr(doc, o)
        json_result.append(item)
    rdata['jsonResult'] = json_result
    return json.dumps(rdata, ensure_ascii=False)


# 创建/编辑目录页面
@system.route("/doc/docCenter/dialog/createFolder", methods=["GET", "POST"])
@user_login
def create_folder():
    form = DocNodeForm()
    rowid = request.args.get('rowid')
    sid = guid()
    model = None
    if rowid:
        model = SADocNode.query.filter_by(sid=rowid).first()
        if model:
            sid = rowid
    option = request.args.get('option')
    if option and option == 'del':
        rdata = dict()
        if model:
            db.session.delete(model)
            db.session.commit()
            rdata['state'] = True
        else:
            rdata['state'] = False
            rdata['msg'] = '指定的id无效~'
        return json.dumps(rdata, ensure_ascii=False)
    if not model:
        model = SADocNode(sdocname='', skind='dir', sdescription='')
    if form.is_submitted():
        rdata = dict()
        model.sid = sid
        model.sdocname = form.data['sdocname']
        model.sdescription = form.data['sdescription']
        model.sparentid = form.data['sparentid']
        model.skind = form.data['skind']
        model.screatorid = form.data['screatorid']
        model.screatorname = form.data['screatorname']
        parentid = request.form.get('sparentid', 'root')
        if parentid == 'root':
            model.sdocpath = '/root/' + model.sid
            model.sdocdisplaypath = '/文档中心/' + model.sdocname
        else:
            parent = SADocNode.query.filter_by(sid=parentid).first()
            if parent:
                model.sdocpath = parent.sdocpath + '/' + model.sid
                model.sdocdisplaypath = parent.sdocdisplaypath + '/' + model.sdocname
        db.session.add(model)
        db.session.commit()
        rdata['state'] = True
        return json.dumps(rdata, ensure_ascii=False)
    return render_template("system/doc/docCenter/dialog/createFolder.html", form=form, model=model)


# 文档中心-加载文件列表
@system.route("/doc/docCenter/docDataList", methods=["GET", "POST"])
@user_login
def doc_data_list():
    rdata = dict()
    rdata['code'] = 0
    folder = url_decode(request.args.get('folder', 'root'))
    data_query = SADocNode.query.filter(SADocNode.sparentid == folder,
                                        or_(SADocNode.skind != 'dir', SADocNode.skind.is_(None)))
    search_text = url_decode(request.args.get('search_text', ''))
    if search_text and search_text != '':
        data_query = data_query.filter(or_(SADocNode.sdocname.ilike('%' + search_text + '%'),
                                           SADocNode.skeywords.ilike('%' + search_text + '%')))
    count = data_query.count()
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 20, type=int)
    rdata['count'] = count
    page_data = data_query.order_by(SADocNode.screatetime.desc()).paginate(page, limit)
    no = 1
    data = list()
    for d in page_data.items:
        row_data = dict()
        row_data['no'] = no + (page - 1) * limit
        row_data['sid'] = d.sid
        row_data['sfileid'] = d.sfileid
        row_data['sdocname'] = d.sdocname
        row_data['ssize'] = d.ssize
        row_data['sdocdisplaypath'] = d.sdocdisplaypath
        row_data['screatorid'] = d.screatorid
        row_data['screatorname'] = d.screatorname
        row_data['seditorname'] = d.seditorname
        row_data['screatetime'] = datetime.strftime(d.screatetime, '%Y-%m-%d %H:%M:%S')
        if d.slastwritetime:
            row_data['slastwritetime'] = datetime.strftime(d.slastwritetime, '%Y-%m-%d %H:%M:%S')
        data.append(row_data)
        no += 1
    rdata['data'] = data
    return json.dumps(rdata, ensure_ascii=False)


# 上传文件
@system.route("/doc/docCenter/uploadFile", methods=["POST"])
@user_login
def upload_file():
    rdata = dict()
    person = get_curr_person_info()
    folder = request.form.get('folder')
    docPath = request.form.get('docPath')
    if not folder and docPath:
        folder = get_doc_folder_by_path(docPath, person)
    form = UpLoadForm()
    fileName = form.file.data.filename
    base_folder = current_app.config["UP_DIR"]
    filepath = datetime.strftime(datetime.now(), '%Y/%m/%d/%H/%M/%S')
    doc_folder = base_folder + "/" + filepath
    if not os.path.exists(doc_folder):
        # 创建一个多级目录
        os.makedirs(doc_folder)  # 创建文件夹
        os.chmod(doc_folder, 777)  # 设置权限
    extname = os.path.splitext(fileName)[1]
    file_mime = MimeTypes()
    mime_type = file_mime.guess_type(fileName)
    file_data = SADocPath(filename=fileName,
                          extname=extname,
                          filetype=mime_type[0],
                          filepath=filepath)
    db.session.add(file_data)
    db.session.commit()  # 保存文件数据
    file_id = md5_code(str(file_data.id) + '-root')
    file_path = doc_folder + "/" + file_id
    form.file.data.save(file_path)  # 保存文件
    size = os.stat(file_path).st_size
    file_data.filesize = size
    db.session.add(file_data)
    db.session.commit()  # 保存文件数据
    docnode = SADocNode(sdocname=fileName,
                        sparentid=folder,
                        ssize=size,
                        skind=mime_type[0],
                        sfileid=file_data.id,
                        screatorid=person['personid'],
                        screatorname=person['personName']
                        )
    db.session.add(docnode)
    db.session.commit()
    parent_node = SADocNode.query.filter_by(sid=folder).first()
    if parent_node:
        docnode.sdocpath = parent_node.sdocpath + '/' + docnode.sid
        docnode.sdocdisplaypath = parent_node.sdocdisplaypath + '/' + docnode.sdocname
    else:
        docnode.sdocpath = '/root/' + docnode.sid,
        docnode.sdocdisplaypath = '/文档中心/' + docnode.sdocname
    db.session.add(docnode)
    db.session.commit()
    rdata['code'] = 0
    rdata['msg'] = ''
    data = {
        'fileID': file_data.id,
        'fileName': docnode.sdocname,
        'fileSize': docnode.ssize
    }
    tablename = request.form.get('tablename')
    cellname = request.form.get('cellname')
    rowid = request.form.get('rowid')
    if tablename and cellname and rowid:
        base = db.session.execute("select " + cellname + " from " + tablename + " where fid=:fid_",
                                  {"fid_": rowid}).first()
        ff = []
        if base:
            ata = base[cellname]
            try:
                ff = eval(ata)
            except:
                ff = []
            ff.append(data)
        db.session.execute("update " + tablename + " set " + cellname + "=:ff_ where fid=:fid_",
                           {"ff_": json.dumps(ff, ensure_ascii=False), "fid_": rowid})
        db.session.commit()
    rdata['data'] = data
    return json.dumps(rdata, ensure_ascii=False)


# 查看文件（在线编辑）
@system.route("/doc/wps/fileEditor", methods=["GET", "POST"])
@user_login
def wps_file_editor():
    option = request.args.get('option', 'view')
    fileID = request.args.get('fileID', 0, type=int)
    fileName = ""
    extName = ""
    file_url = ""
    if fileID:
        doc = SADocPath.query.filter_by(id=fileID).first()
        if doc:
            fileName = doc.filename
            extName = doc.extname
            file_url = "/system/doc/file/" + str(doc.id) + "/download/?t=" + uuid.uuid4().hex
    return render_template("system/doc/docOcx/wps/fileEditor.html", option=option, fileName=fileName,
                           extName=extName.lower(), file_url=file_url)


# 查看文件（PDF）
@system.route("/doc/pdf/fileBrowser", methods=["GET", "POST"])
@user_login
def pdf_file_view():
    fileID = request.args.get('fileID', 0, type=int)
    fileName = ""
    file_url = "/system/doc/file/0/view"
    if fileID:
        doc = SADocPath.query.filter_by(id=fileID).first()
        if doc:
            fileName = doc.filename
            file_url = "/system/doc/file/" + str(doc.id) + "/view/?t=" + uuid.uuid4().hex
    return render_template("system/doc/docOcx/pdf/vform.html", fileName=fileName, file_url=file_url)


# 文件下载
@system.route("/doc/file/<int:fileid>/download/", methods=["GET", "POST"])
@user_login
def file_download(fileid=0):
    doc = SADocPath.query.filter_by(id=fileid).first()
    if doc:
        base_folder = current_app.config["UP_DIR"]
        filepath = doc.filepath
        doc_folder = base_folder + "/" + filepath
        file_name = md5_code(str(doc.id) + "-root")
        response_file = send_from_directory(doc_folder, filename=file_name,
                                            as_attachment=True, attachment_filename=doc.filename)
        response_file.headers["Content-Disposition"] = "attachment; filename=%s" % doc.filename.encode().decode(
            'latin-1')
        response_file.headers['content-length'] = os.stat(doc_folder + "/" + file_name).st_size
        return response_file
    else:
        abort(404)


# 文件预览
@system.route("/doc/file/<int:fileid>/view/", methods=["GET", "POST"])
@user_login
def file_browse(fileid=0):
    doc = SADocPath.query.filter_by(id=fileid).first()
    if doc:
        base_folder = current_app.config["UP_DIR"]
        filepath = doc.filepath
        doc_folder = base_folder + "/" + filepath
        file_name = md5_code(str(doc.id) + "-root")
        file_path = doc_folder + "/" + file_name
        response_file = send_file(file_path, doc.filetype,
                                  as_attachment=True, attachment_filename=doc.filename)
        response_file.headers["Content-Disposition"] = "inline; filename=%s" % doc.filename.encode().decode(
            'latin-1')
        response_file.headers['content-length'] = os.stat(file_path).st_size
        return response_file
    else:
        abort(404)


# 获取指定字段的信息
@system.route("/doc/file/cell/view/", methods=["GET", "POST"])
@user_login
def file_cell_view():
    rdata = dict()
    tablename = request.form.get('tablename')
    cellname = request.form.get('cellname')
    rowid = request.form.get('rowid')
    try:
        sql = ("select " + cellname + " from " + tablename + " where fid=:fid_")
        rs = db.session.execute(sql, {"fid_": rowid}).first()
        if rs:
            rdata['data'] = rs[cellname]
        else:
            rdata['data'] = ""
    except Exception as e:
        # print(e)
        rdata['data'] = ""
    rdata['state'] = True
    return json.dumps(rdata, ensure_ascii=False)


# 删除文件（附件）
@system.route("/doc/file/cell/delete/", methods=["GET", "POST"])
@user_login
def file_cell_del():
    rdata = dict()
    tablename = request.form.get('tablename')
    cellname = request.form.get('cellname')
    rowid = request.form.get('rowid')
    fileID = request.form.get('fileID', 0, type=int)
    try:
        sql = ("select " + cellname + " from " + tablename + " where fid=:fid_")
        rs = db.session.execute(sql, {"fid_": rowid}).first()
        if rs:
            file_list = eval(rs[cellname])
            for file in file_list:
                if file['fileID'] == fileID:
                    file_list.remove(file)
            db.session.execute("update " + tablename + " set " + cellname + "=:ff_ where fid=:fid_",
                               {"ff_": json.dumps(file_list, ensure_ascii=False), "fid_": rowid})
            db.session.commit()  # 更新附件信息
            file_delete(fileID)  # 删除文件
        rdata['state'] = True
    except Exception as e:
        # print(e)
        pass
    return json.dumps(rdata, ensure_ascii=False)


# 文件删除
@system.route("/doc/file/<int:fileid>/delete/", methods=["GET", "POST"])
@user_login
def file_delete(fileid=0):
    rdata = dict()
    doc = SADocPath.query.filter_by(id=fileid).first()
    if doc:
        base_folder = current_app.config["UP_DIR"]
        filepath = doc.filepath
        doc_folder = base_folder + "/" + filepath
        file_name = md5_code(str(doc.id) + "-root")
        file_path = doc_folder + "/" + file_name
        if os.path.isfile(file_path):
            os.remove(file_path)  # 删除文件
        doc_node = SADocNode.query.filter_by(sfileid=fileid).first()
        if doc_node:
            db.session.delete(doc_node)
        db.session.delete(doc)
        db.session.commit()  # 删除数据
        rdata['state'] = True
    else:
        rdata['state'] = False
        rdata['msg'] = "指定的文件id错误~"
    return json.dumps(rdata, ensure_ascii=False)


# 文档搜索
@system.route("/doc/docSearch", methods=["GET", "POST"])
@user_login
def doc_search():
    return render_template("system/doc/docSearch/docSearch.html")
