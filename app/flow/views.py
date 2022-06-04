# _*_ coding: utf-8 _*_

from . import flow
from flask import request, render_template, url_for, redirect, session, send_file
from app import db
from app.models import SATask
from app.common.decorated import user_login
from app.common.pubstatic import url_decode, create_icon
from app.common.persons import get_curr_person_info, get_person_list_by_org
from app.flow.flowcontroller import start_flow, out_flow
from app.flow.flowentity import FlowActivity
from app.flow.expprocess import *
from app.flow.exporgexecutor import *
from app.common.persons import *
from datetime import datetime
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
    epersonids = url_decode(request.form.get('epersonids'))
    afterActivity = url_decode(request.form.get('afterActivity'))
    task = SATask.query.filter_by(sid=taskID).first()
    if task:
        processID = task.sprocess
        Activity = task.sactivity
        flwA = FlowActivity(processID, Activity)
        if flwA.getGrapModle() == "together" and flwA.getGrapWay() == "merge":  # 当前环节为“共同模式”则需要判断是否所有人已处理任务
            ch_task = SATask.query.filter(SATask.sflowid == task.sflowid, SATask.sactivity == flwA.getActivity(),
                                          SATask.sid != taskID, SATask.sstatusid == 'tesReady').first()
            if ch_task:  # 如果有其他待办则值更新状态并提示“等待其他人处理”
                task.sexecutetime = datetime.now()
                task.sstatusid = 'tesFinished'
                task.sstatusname = '已完成'
                task.version = task.version + 1
                db.session.add(task)
                db.session.commit()
                rdata['state'] = 'msg'
                rdata['msg'] = '请等待其他人处理!'
                return json.dumps(rdata, ensure_ascii=False)
        aftAList = list()
        if afterActivity and afterActivity != "":  # 如果指定了环节则不需要选择确认
            if epersonids and epersonids != "":  # 如果已经选择执行人则直接流转
                ePersonList = get_person_list_by_org(epersonids)
                taskIDs = out_flow(flowID, taskID, sdata1, ePersonList, afterActivity)
                if taskIDs:
                    rdata['state'] = True
                    rdata['processID'] = processID
                    rdata['flowID'] = flowID
                    rdata['taskID'] = taskIDs.split(",")[0]
                    return json.dumps(rdata, ensure_ascii=False)
            aftAList.append(FlowActivity(processID, afterActivity))
        else:
            aftAList = flwA.getAfterActivity()
        if len(aftAList) == 1:
            # 下一环节为“结束环节”且当前环节不是“共同模式”则直接结束流程
            if aftAList[0].getType() == "end" and (flwA.getGrapModle() != "together" or flwA.getGrapWay() != "merge"):
                out_flow(flowID, taskID, sdata1, None, aftAList[0].getActivity())
                rdata['state'] = 'end'
                return json.dumps(rdata, ensure_ascii=False)
            if aftAList[0].getOutquery() == "no":  # 不需要流转确认时处理
                epersonid = aftAList.get(0).getExcutorIDs()
                ePersonList = list()
                if epersonid and epersonid != "":
                    ePersonList = get_person_list_by_org(epersonid)
                else:
                    exeGroup = aftAList[0].getExcutorGroup()
                    if exeGroup and exeGroup != "":  # 配置了执行规则的“群组”则解析表达式获得执行人信息
                        exeGroup = exeGroup.replace("getProcessID()", processID)
                        exeGroup = exeGroup.replace("getFlowID()", flowID)
                        exeGroup = exeGroup.replace("getTaskID()", taskID)
                        exeGroup = exeGroup.replace("getProcesssData1()", sdata1)
                        excutorGroup = eval(exeGroup)
                    else:  # 如果没有配置规则则自动获取有权限的人员
                        exeGroup = "get_org_unit_has_activity('" + processID + "','" + aftAList[
                            0].getActivity() + "',False,False)"
                        excutorGroup = eval(exeGroup)
                    ePersonList = get_person_list_by_org(excutorGroup)
                if len(ePersonList) > 0:
                    taskIDs = out_flow(flowID, taskID, sdata1, ePersonList, aftAList[0].getActivity())
                    if taskIDs:
                        rdata['state'] = True
                        rdata['processID'] = processID
                        rdata['flowID'] = flowID
                        rdata['taskID'] = taskIDs.split(",")[0]
                        return json.dumps(rdata, ensure_ascii=False)
        afterActList = list()
        for afactivity in aftAList:
            nactivity = dict()
            nactivity['id'] = afactivity.getId()
            nactivity['name'] = afactivity.getActivityname()
            nactivity['type'] = afactivity.getType()
            nactivity['excutorIDs'] = afactivity.getExcutorIDs()
            nactivity['excutorNames'] = afactivity.getExcutorNames()
            exeGroup = afactivity.getExcutorGroup()
            if exeGroup and exeGroup != "":
                exeGroup = exeGroup.replace("getProcessID()", processID)
                exeGroup = exeGroup.replace("getFlowID()", flowID)
                exeGroup = exeGroup.replace("getTaskID()", taskID)
                exeGroup = exeGroup.replace("getProcesssData1()", sdata1)
                excutorGroup = eval(exeGroup)
            else:  # 如果没有配置规则则自动获取有权限的人员
                exeGroup = "get_org_unit_has_activity('" + processID + "','" + aftAList[
                    0].getActivity() + "',False,False)"
                excutorGroup = eval(exeGroup)
            nactivity['excutorGroup'] = excutorGroup
            activitylabel = afactivity.getsActivityLabel()
            if not activitylabel or activitylabel == "":
                activitylabel = afactivity.getActivityname() + ":" + afactivity.getProcessName()
            else:
                activitylabel = activitylabel.replace("getProcessID()", processID)
                activitylabel = activitylabel.replace("getFlowID()", flowID)
                activitylabel = activitylabel.replace("getTaskID()", taskID)
                activitylabel = activitylabel.replace("getProcesssData1()", sdata1)
                activitylabel = eval(activitylabel)
            nactivity['label'] = activitylabel
            afterActList.append(nactivity)
        rdata['state'] = 'select'
        data = dict()
        data['processID'] = processID
        data['flowID'] = flowID
        data['taskID'] = taskID
        data['activityList'] = afterActList
        rdata['data'] = data
    else:
        rdata['state'] = False
        rdata['msg'] = "任务id无效！"
    return json.dumps(rdata, ensure_ascii=False)


# 加载流程执行人
@flow.route("/getExecutorTree", methods=["GET", "POST"])
@user_login
def flow_get_executor_tree():
    rdata = dict()
    exGroup = url_decode(request.form.get('exGroup', ''))
    excutorIDs = url_decode(request.form.get('excutorIDs', ''))
    isflowMonitor = url_decode(request.form.get('isflowMonitor'))
    sql = ("select distinct a.sparent,a.sid,a.scode,a.sname,a.sfid,a.sorgkindid,a.ssequence from "
           " sa_oporg a inner join (select sfid from sa_oporg where svalidstate=1 ")
    if exGroup and exGroup != "":
        sql += " and (1=2 "
        for sid in exGroup.split(","):
            sql += " or sfid like '%" + sid + "%' "
        if excutorIDs and excutorIDs != "":
            for sid in excutorIDs.split(","):
                sql += " or sfid like '%" + sid + "%' "
        sql += ")"
    sql += ")b on b.sfid like concat(a.sfid,'%') where svalidstate=1 order by b.sfid,a.ssequence asc"
    org_list = db.session.execute(sql)
    data_list = list()
    for org in org_list:
        data = dict()
        data['id'] = org.sid
        data['name'] = org.sname
        data['type'] = org.sorgkindid
        data['icon'] = create_icon(org.sorgkindid)
        if org.sparent:
            data['pId'] = org.sparent
        else:
            data['pId'] = ""
        if org.sorgkindid != "psm":
            data["open"] = "true"
        data_list.append(data)
    rdata['state'] = True
    rdata['data'] = data_list
    print(rdata)
    return json.dumps(rdata, ensure_ascii=False)
