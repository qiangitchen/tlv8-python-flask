# _*_ coding: utf-8 _*_

from . import oa
from flask import request, render_template, url_for, redirect, session, send_file, current_app
from app import db
from app.common.decorated import user_login
from app.common.pubstatic import url_decode, guid, serialize, nul2em, form_set_data_model
from app.models import SAPerson, SAOrganization, OALeave, OAPersonDayReport, OAWorkLog, OAMyGroup, OAMyGroupPerson
from app.models import OASendMail, OAReceiveMail
from app.sa.forms import PersonForm
from app.oa.forms import PersonDayReportForm, WorkLogForm, MyGroupForm
from app.common.persons import get_curr_person_info, get_person_list_by_org
from datetime import datetime
import json


# 请假申请-流程
@oa.route("/leave/<activity>", methods=["GET", "POST"])
@user_login
def oa_leave(activity=None):
    process = request.args.get('process')
    return render_template("oa/leave/mainActivity.html", process=process, activity=activity)


# 保存数据
@oa.route("/leave/saveData", methods=["GET", "POST"])
@user_login
def oa_leave_save_data():
    rdata = dict()
    try:
        field = url_decode(request.form.get('field'))
        if field:
            field = eval(field)
            fid = field['fid']
            leave = None
            if fid and fid != '':
                leave = OALeave.query.filter_by(fid=fid).first()
            else:
                fid = guid()
            if not leave:
                leave = OALeave(fid=fid)
            for k in field.keys():
                if k != 'fid':
                    setattr(leave, k, field[k])
            db.session.add(leave)
            db.session.commit()
            rdata['state'] = True
            rdata['rowid'] = fid
        else:
            rdata['state'] = False
            rdata['msg'] = "保存失败：无效数据！"
    except Exception as e:
        current_app.logger.error(e)
        rdata['state'] = False
        rdata['msg'] = "保存失败：后台异常！"
    return json.dumps(rdata, ensure_ascii=False)


# 加载数据
@oa.route("/leave/queryData", methods=["GET", "POST"])
@user_login
def oa_leave_query_data():
    rdata = dict()
    rowid = request.form.get('rowid')
    if rowid:
        leave = OALeave.query.filter_by(fid=rowid).first()
        if leave:
            rdata['state'] = True
            rdata['data'] = json.dumps(serialize(leave), ensure_ascii=False)
        else:
            rdata['state'] = False
            rdata['msg'] = "指定的rowid无效!"
    else:
        rdata['state'] = False
        rdata['msg'] = "必须指定rowid!"
    return json.dumps(rdata, ensure_ascii=False)


# 删除数据
@oa.route("/leave/deleteData", methods=["GET", "POST"])
@user_login
def oa_leave_del_data():
    rdata = dict()
    rowid = request.form.get('rowid')
    if rowid:
        leave = OALeave.query.filter_by(fid=rowid).first()
        if leave:
            db.session.delete(leave)
            db.session.execute("delete from sa_task where sdata1=:rowid_", {"rowid_": rowid})  # 删除数据的同时删除任务
            db.session.commit()
            rdata['state'] = True
        else:
            rdata['state'] = False
            rdata['msg'] = "指定的rowid无效!"
    else:
        rdata['state'] = False
        rdata['msg'] = "必须指定rowid!"
    return json.dumps(rdata, ensure_ascii=False)


# 个人日报
@oa.route("/PersonUse/DayReport/reportList", methods=["GET", "POST"])
@user_login
def person_use_day_report():
    data_query = OAPersonDayReport.query
    search_text = url_decode(request.args.get('search_text', ''))
    if search_text and search_text != '':
        data_query = data_query.filter(or_(SAOnlineInfo.ftitle.ilike('%' + search_text + '%'),
                                           SAOnlineInfo.fcontext.ilike('%' + search_text + '%')))
    else:
        search_text = ""
    count = data_query.count()
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 20, type=int)
    page_data = data_query.order_by(OAPersonDayReport.fcreatetime.desc()).paginate(page, limit)
    return render_template("oa/PersonUse//DayReport/reportList.html", page_data=page_data, search_text=search_text,
                           count=count, limit=limit, page=page)


# 个人日报-添加/编辑数据
@oa.route("/PersonUse/DayReport/dialog/editData", methods=["GET", "POST"])
@user_login
def person_use_day_report_edit():
    form = PersonDayReportForm()
    if form.is_submitted():
        rdata = dict()
        data = form.data
        day_report = OAPersonDayReport.query.filter_by(fid=data['fid']).first()
        if not day_report:
            day_report = OAPersonDayReport()
        person = get_curr_person_info()
        day_report.fcreatorid = person['personid']
        day_report.fcreatorname = person['personName']
        day_report.fcreatedeptid = person['deptid']
        day_report.fcreatedeptname = person['deptname']
        day_report.ftitle = data['ftitle']
        day_report.fcontext = data['fcontext']
        db.session.add(day_report)
        db.session.commit()
        rdata['state'] = True
        rdata['data'] = day_report.fid
        return json.dumps(rdata, ensure_ascii=False)
    model = OAPersonDayReport()
    rowid = request.args.get("rowid")
    if rowid and rowid != "":
        model = OAPersonDayReport.query.filter_by(fid=rowid).first()
        if model:
            form.fid.data = model.fid
            form.ftitle.data = model.ftitle
            form.fcontext.data = model.fcontext
    return render_template("oa/PersonUse//DayReport/dialog/editData.html", form=form)


# 个人日报-删除数据
@oa.route("/PersonUse/DayReport/deleteData", methods=["GET", "POST"])
@user_login
def person_use_day_report_del():
    rdata = dict()
    rowid = url_decode(request.form.get('rowid'))
    data = OAPersonDayReport.query.filter_by(fid=rowid).first()
    if data:
        db.session.delete(data)
        db.session.commit()
        rdata['state'] = True
    else:
        rdata['state'] = False
        rdata['msg'] = "指定的id错误~"
    return json.dumps(rdata, ensure_ascii=False)


# 工作日志-功能页面
@oa.route("/PersonUse/workLog/WorkLog", methods=["GET", "POST"])
@user_login
def person_work_log():
    return render_template("oa/PersonUse/workLog/WorkLog.html")


# 工作日志-加载数据列表
@oa.route("/PersonUse/workLog/WorkLog/dataList", methods=["GET", "POST"])
@user_login
def person_work_log_list():
    rdata = dict()
    rdata['code'] = 0
    user_id = session['user_id']
    data_query = OAWorkLog.query.filter_by(fcreatorid=user_id)
    search_text = url_decode(request.args.get('search_text', ''))
    if search_text and search_text != '':
        data_query = data_query.filter(or_(OAWorkLog.fname.ilike('%' + search_text + '%'),
                                           OAWorkLog.fproject.ilike('%' + search_text + '%'),
                                           OAWorkLog.fcontext.ilike('%' + search_text + '%')))
    count = data_query.count()
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 20, type=int)
    rdata['count'] = count
    page_data = data_query.order_by(OAWorkLog.fcreatetime.desc()).paginate(page, limit)
    data = list()
    no = 1
    for d in page_data.items:
        row_data = serialize(d)
        row_data['no'] = no + (page - 1) * limit
        data.append(row_data)
        no += 1
    rdata['data'] = data
    return json.dumps(rdata, ensure_ascii=False)


# 工作日志-删除数据
@oa.route("/PersonUse/workLog/WorkLog/deleteData", methods=["GET", "POST"])
@user_login
def person_work_log_del():
    rdata = dict()
    rowid = url_decode(request.form.get('rowid'))
    data = OAWorkLog.query.filter_by(fid=rowid).first()
    if data:
        db.session.delete(data)
        db.session.commit()
        rdata['state'] = True
    else:
        rdata['state'] = False
        rdata['msg'] = "指定的id错误~"
    return json.dumps(rdata, ensure_ascii=False)


# 工作日志-添加/编辑数据
@oa.route("/PersonUse/workLog/editData", methods=["GET", "POST"])
@user_login
def person_work_log_edit():
    form = WorkLogForm()
    if form.is_submitted():
        rdata = dict()
        data = form.data
        model = OAWorkLog.query.filter_by(fid=data['fid']).first()
        if not model:
            model = OAWorkLog()
        form_set_data_model(form, model)
        person = get_curr_person_info()
        model.fcreatorid = person['personid']
        model.fcreatorname = person['personName']
        db.session.add(model)
        db.session.commit()
        rdata['state'] = True
        rdata['data'] = model.fid
        return json.dumps(rdata, ensure_ascii=False)
    rowid = request.args.get("rowid")
    model = None
    if rowid and rowid != "":
        model = OAWorkLog.query.filter_by(fid=rowid).first()
    if not model:
        model = OAWorkLog(fid=guid(), fcode='W' + datetime.strftime(datetime.now(), '%Y%m%d%H%M%S'), version=0)
    form.fimportance.data = nul2em(model.fimportance)
    form.femergency.data = nul2em(model.femergency)
    form.fcontext.data = nul2em(model.fcontext)
    return render_template("oa/PersonUse/workLog/editData.html", form=form, model=model, nul2em=nul2em)


# 我的群组-功能页面
@oa.route("/PersonUse/MYGROUP/listActivity", methods=["GET", "POST"])
@user_login
def person_mygroup():
    return render_template("oa/PersonUse/MYGROUP/listActivity.html")


# 我的群组-加载数据列表
@oa.route("/PersonUse/MYGROUP/dataList", methods=["GET", "POST"])
@user_login
def person_mygroup_list():
    rdata = dict()
    rdata['code'] = 0
    user_id = session['user_id']
    data_query = OAMyGroup.query.filter_by(fcreatorid=user_id)
    search_text = url_decode(request.args.get('search_text', ''))
    if search_text and search_text != '':
        data_query = data_query.filter(or_(OAMyGroup.fname.ilike('%' + search_text + '%'),
                                           OAMyGroup.fcode.ilike('%' + search_text + '%')))
    count = data_query.count()
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 20, type=int)
    rdata['count'] = count
    page_data = data_query.order_by(OAMyGroup.fcreatetime.desc()).paginate(page, limit)
    data = list()
    no = 1
    for d in page_data.items:
        row_data = serialize(d)
        row_data['no'] = no + (page - 1) * limit
        data.append(row_data)
        no += 1
    rdata['data'] = data
    return json.dumps(rdata, ensure_ascii=False)


# 我的群组-添加/编辑数据
@oa.route("/PersonUse/MYGROUP/editData", methods=["GET", "POST"])
@user_login
def person_mygroup_edit():
    form = MyGroupForm()
    if form.is_submitted():
        rdata = dict()
        data = form.data
        model = OAMyGroup.query.filter_by(fid=data['fid']).first()
        if not model:
            model = OAMyGroup()
        form_set_data_model(form, model)
        person = get_curr_person_info()
        model.fcreatorid = person['personid']
        model.fcreatorname = person['personName']
        db.session.add(model)
        db.session.commit()
        rdata['state'] = True
        rdata['data'] = model.fid
        return json.dumps(rdata, ensure_ascii=False)
    rowid = request.args.get("rowid")
    model = None
    if rowid and rowid != "":
        model = OAMyGroup.query.filter_by(fid=rowid).first()
    if not model:
        model = OAMyGroup(fid=guid(), fcode='G' + datetime.strftime(datetime.now(), '%Y%m%d%H%M%S'), version=0)
    return render_template("oa/PersonUse/MYGROUP/editData.html", form=form, model=model, nul2em=nul2em)


# 我的群组-删除数据
@oa.route("/PersonUse/MYGROUP/deleteData", methods=["GET", "POST"])
@user_login
def person_mygroup_del():
    rdata = dict()
    rowid = url_decode(request.form.get('rowid'))
    data = OAMyGroup.query.filter_by(fid=rowid).first()
    if data:
        gp = OAMyGroupPerson.query.filter_by(fgroupid=data.fid).all()
        for p in gp:  # 同时删除子表数据
            db.session.delete(p)
        db.session.delete(data)
        db.session.commit()
        rdata['state'] = True
    else:
        rdata['state'] = False
        rdata['msg'] = "指定的id错误~"
    return json.dumps(rdata, ensure_ascii=False)


# 我的群组-加载-群组人员-数据列表
@oa.route("/PersonUse/MYGROUP/person/dataList", methods=["GET", "POST"])
@user_login
def person_mygroup_person_list():
    rdata = dict()
    rdata['code'] = 0
    rowid = request.args.get('rowid')
    data_query = OAMyGroupPerson.query.filter_by(fgroupid=rowid)
    count = data_query.count()
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 20, type=int)
    rdata['count'] = count
    page_data = data_query.paginate(page, limit)
    data = list()
    no = 1
    for d in page_data.items:
        row_data = serialize(d)
        row_data['no'] = no + (page - 1) * limit
        data.append(row_data)
        no += 1
    rdata['data'] = data
    return json.dumps(rdata, ensure_ascii=False)


# 我的群组-添加群组人员
@oa.route("/PersonUse/MYGROUP/person/addData", methods=["GET", "POST"])
@user_login
def person_mygroup_person_add():
    rdata = dict()
    rowid = url_decode(request.form.get('rowid'))
    ids = url_decode(request.form.get('ids'))
    names = url_decode(request.form.get('names'))
    if rowid and rowid != "" and ids and ids != "":
        person_list = get_person_list_by_org(ids)
        for person in person_list:
            data = OAMyGroupPerson(fgroupid=rowid)
            data.forgid = person['orgid']
            data.fpersonid = person['personid']
            data.fpersonname = person['personName']
            db.session.add(data)
        db.session.commit()
        rdata['state'] = True
    else:
        rdata['state'] = False
        rdata['msg'] = "数据无效~"
    return json.dumps(rdata, ensure_ascii=False)


# 我的群组-添加群组人员
@oa.route("/PersonUse/MYGROUP/person/delData", methods=["GET", "POST"])
@user_login
def person_mygroup_person_del():
    rdata = dict()
    rowid = url_decode(request.form.get('rowid'))
    data = OAMyGroupPerson.query.filter_by(fid=rowid).first()
    if data:
        db.session.delete(data)
        db.session.commit()
        rdata['state'] = True
    else:
        rdata['state'] = False
        rdata['msg'] = "指定的id无效~"
    return json.dumps(rdata, ensure_ascii=False)


# 人事自助
@oa.route("/PersonUse/personInfo/mainActivity", methods=["GET", "POST"])
@user_login
def person_use_person_info():
    form = PersonForm()
    person = SAPerson.query.filter_by(sid=session['user_id']).first()
    if form.is_submitted():
        data = form.data
        rdata = dict()
        try:
            form_set_data_model(form, person)
            db.session.add(person)
            db.session.commit()
            org = SAOrganization.query.filter_by(spersonid=person.sid).first()
            parent_org = SAOrganization.query.filter_by(sid=person.smainorgid).first()
            if org:
                org.sname = person.sname
                if parent_org:
                    org.sfname = parent_org.sfname + '/' + person.sname
                db.session.add(org)
                db.session.commit()
            rdata['state'] = True
        except Exception as e:
            print(e)
            rdata['state'] = False
            rdata['msg'] = '保存到数据库时异常!'
        return json.dumps(rdata, ensure_ascii=False)
    form.sdescription.data = person.sdescription
    return render_template("oa/PersonUse/personInfo/mainActivity.html", form=form, person=person, nul2em=nul2em)


# 首页Email展示
@oa.route("/email/portalShow/", methods=["GET", "POST"])
@user_login
def oa_email_show():
    return render_template("oa/email/portalShow/show.html")


# 内部邮箱功能
@oa.route("/email/mainActivity", methods=["GET", "POST"])
@user_login
def oa_email():
    personid = session['user_id']
    data_query = OAReceiveMail.query.filter_by(fconsigneeid=personid)
    count = data_query.count()
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 20, type=int)
    page_data = data_query.paginate(page, limit)
    return render_template("oa/email/mainActivity.html", page_data=page_data, count=count)


# 内部邮箱功能-写信
@oa.route("/email/writeEmail", methods=["GET", "POST"])
@user_login
def oa_email_write():
    sendmail = OASendMail()
    id = request.args.get("id", "")
    if id and id != "":
        sendmail = OASendMail.query.filter_by(fid=id).first()
    return render_template("oa/email/writeEmail.html", id=id, sendmail=sendmail, nul2em=nul2em)


# 内部邮箱功能-保存数据
@oa.route("/email/svaeSendEmail", methods=["POST"])
@user_login
def oa_email_save():
    rdata = dict()
    sendmail = OASendMail()
    id = request.args.get("id")
    if id and id != "":
        sendmail = OASendMail.query.filter_by(fid=id).first()
    sendmail.fconsigneeid = request.form.get("fconsigneeid")
    sendmail.fconsignee = request.form.get("fconsignee")
    sendmail.femailname = request.form.get("femailname")
    sendmail.fsendpername = request.form.get("fsendpername")
    sendmail.fsendperid = request.form.get("fsendperid")
    sendmail.ftext = request.form.get("ftext")
    db.session.add(sendmail)
    db.session.commit()
    rdata['state'] = True
    rdata['data'] = sendmail.fid
    return json.dumps(rdata, ensure_ascii=False)


# 内部邮箱功能-发送内部邮件
@oa.route("/email/toSendEmail", methods=["POST"])
@user_login
def oa_email_send():
    rdata = dict()
    sendmail = None
    id = request.args.get("id")
    if id and id != "":
        sendmail = OASendMail.query.filter_by(fid=id).first()
    if not sendmail:
        rdata['state'] = False
        rdata['msg'] = '指定的发送信息无效~'
    else:
        person_list = get_person_list_by_org(sendmail.fconsigneeid)
        sendtime = datetime.now()
        for person in person_list:
            reciveMail = OAReceiveMail()
            reciveMail.femailname = sendmail.femailname
            reciveMail.ftext = sendmail.ftext
            reciveMail.ffjid = sendmail.ffjid
            reciveMail.fsendpername = sendmail.fsendpername
            reciveMail.fsendperid = sendmail.fsendperid
            reciveMail.fconsignee = person['personName']
            reciveMail.fconsigneeid = person['personid']
            reciveMail.fsendtime = sendtime
            db.session.add(reciveMail)
        sendmail.fstate = '已发送'
        sendmail.fsendtime = sendtime
        db.session.add(sendmail)
        db.session.commit()
        rdata['state'] = True
    return json.dumps(rdata, ensure_ascii=False)


# 内部邮箱功能-草稿箱
@oa.route("/email/templetEmail", methods=["GET", "POST"])
@user_login
def oa_email_temp():
    personid = session['user_id']
    data_query = OASendMail.query.filter_by(fsendperid=personid, fstate='未发送')
    count = data_query.count()
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 20, type=int)
    page_data = data_query.paginate(page, limit)
    return render_template("oa/email/templetEmail.html", page_data=page_data, count=count)


# 内部邮箱功能-草稿箱
@oa.route("/email/sendedMail", methods=["GET", "POST"])
@user_login
def oa_email_sended():
    personid = session['user_id']
    data_query = OASendMail.query.filter_by(fsendperid=personid, fstate='已发送')
    count = data_query.count()
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 20, type=int)
    page_data = data_query.paginate(page, limit)
    return render_template("oa/email/sendedMail.html", page_data=page_data, count=count)

# 内部邮箱功能-查看邮件
@oa.route("/email/lookEmail", methods=["GET", "POST"])
@user_login
def oa_email_look():
    reciveMail = OAReceiveMail()
    id = request.args.get("id", "")
    if id and id != "":
        reciveMail = OAReceiveMail.query.filter_by(fid=id).first()
        if reciveMail.fsendtime:
            reciveMail.fqurey = '已查看'
            db.session.add(reciveMail)
            db.session.commit()
    return render_template("oa/email/lookEmail.html", id=id, reciveMail=reciveMail, nul2em=nul2em)