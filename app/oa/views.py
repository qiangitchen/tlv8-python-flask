# _*_ coding: utf-8 _*_

from . import oa
from flask import request, render_template, url_for, redirect, session, send_file, current_app
from app import db
from app.common.decorated import user_login
from app.common.pubstatic import url_decode, guid, serialize
from app.models import OALeave
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
