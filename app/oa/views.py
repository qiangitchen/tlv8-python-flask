# _*_ coding: utf-8 _*_

from . import oa
from flask import request, render_template, url_for, redirect, session, send_file, current_app
from app import db
from app.common.decorated import user_login
from app.common.pubstatic import url_decode, guid, serialize
from app.models import OALeave, OAPersonDayReport
from app.oa.forms import PersonDayReportForm
from app.common.persons import get_curr_person_info
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


# 首页Email展示
@oa.route("/email/portalShow/", methods=["GET", "POST"])
@user_login
def oa_email_show():
    return render_template("oa/email/portalShow/show.html")


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
    page_data = data_query.order_by(OAPersonDayReport.screatetime.desc()).paginate(page, limit)
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
        day_report.screatorid = person['personid']
        day_report.screatorname = person['personName']
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
