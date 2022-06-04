# _*_ coding: utf-8 _*_

from . import flow
from flask import request, render_template, url_for, redirect, session, send_file
from app import db
from app.models import SATask
from app.common.decorated import user_login
from app.common.pubstatic import url_decode
from app.common.persons import get_curr_person_info
from app.flow.flowcontroller import start_flow, out_flow
from app.flow.flowentity import FlowActivity
import json


# 打开待办
@flow.route("/openTaskAction", methods=["GET", "POST"])
@user_login
def open_task_action():
    rdata = dict()
    person = get_curr_person_info()
    taskID = url_decode(request.form.get('taskID', ''))
    executor = url_decode(request.form.get('executor', ''))
    if not executor or executor == "" or executor == "null":
        executor = person['personid']
    task = SATask.query.filter_by(sid=taskID, sepersonid=executor).first()
    if task:
        task.slock = person['personid']
        db.session.add(task)
        processID = task.sprocess
        activity = task.sactivity
        Act = FlowActivity(processID, activity)
        if Act.getGrapModle() == "whenOpen":  # 打开时抢占，则自动取消当前环节其他待办
            upsql = ("update SA_TASK set SSTATUSID='tesCanceled' ,SSTATUSNAME='已取消' "
                     " where SID != :taskID and SACTIVITY = :activity and SFLOWID = :flowID and SSTATUSID = 'tesReady'")
            db.session.execute(upsql, {'taskID': taskID, 'activity': activity, 'flowID': task.sflowid})
        db.session.commit()
        data = dict()
        data['taskID'] = task.sid
        data['flowID'] = task.sflowid
        data['name'] = task.sname
        data['url'] = task.seurl
        data['sData1'] = task.sdata1
        rdata['data'] = data
        rdata['state'] = True
    else:
        rdata['state'] = False
        rdata['msg'] = "ID为'" + taskID + "'的任务不存在或您没有权限处理!"
    return json.dumps(rdata, ensure_ascii=False)


# 启动流程
@flow.route("/flowStartAction", methods=["GET", "POST"])
@user_login
def flow_start_action():
    rdata = dict()
    try:
        sdata1 = url_decode(request.form.get('sdata1', ''))
        srcPath = url_decode(request.form.get('srcPath', ''))
        processID = url_decode(request.form.get('processID', None))
        process_id, flowID, taskID, afactivity = start_flow(sdata1, srcPath, processID)
        ePersonList = list()
        ePersonList.append(get_curr_person_info())
        taskIDs = out_flow(flowID, taskID, sdata1, ePersonList, afactivity)
        data = dict()
        data['processID'] = process_id
        data['flowID'] = flowID
        data['taskID'] = taskIDs[0]
        rdata['data'] = data
        rdata['state'] = True
    except Exception as e:
        rdata['state'] = False
        rdata['msg'] = str(e)
    return json.dumps(rdata, ensure_ascii=False)


# 流程流转（提交）
@flow.route("/flowOutAction", methods=["GET", "POST"])
@user_login
def flow_out_action():
    rdata = dict()
    flowID = url_decode(request.form.get('flowID', ''))
    taskID = url_decode(request.form.get('taskID', ''))
    sdata1 = url_decode(request.form.get('sdata1', ''))
    ePersonIDs = url_decode(request.form.get('ePersonIDs'))
    afterActivity = url_decode(request.form.get('afterActivity'))
    task = SATask.query.filter_by(sid=taskID).first()
    if task:
        processID = task.sprocess
        Activity = task.sactivity
        flwA = FlowActivity(processID, Activity)
        aftAList = list()
        if afterActivity and afterActivity != "":
            aftAList.append(FlowActivity(processID, afterActivity))
        else:
            aftAList = flwA.getAfterActivity()
    rdata['state'] = True
    return json.dumps(rdata, ensure_ascii=False)
