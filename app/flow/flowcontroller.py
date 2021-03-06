# _*_ coding:utf-8 _*_

from app.models import SAFlowDraw
from app.flow.flowentity import FlowActivity
from app.common.pubstatic import guid
from app.common.persons import *
from app.flow.expprocess import *
from app.flow.exporgexecutor import *
from app.flow.expbusiness import *
from datetime import datetime

"""
流程控制
"""


# 根据地址获取流程图id
def seach_process_id(url):
    url = url.replace("/", "%")
    dwr = SAFlowDraw.query.filter(SAFlowDraw.sprocessacty.ilike("%" + url + "%")).first()
    if dwr:
        return dwr.sprocessid


# 启动流程
def start_flow(sdata1, srcPath, processid):
    if not processid or processid == "":
        processid = seach_process_id(srcPath)
        if not processid:
            raise Exception("没有找到流程图，请确认流程图配置是否正确！")
    activity = FlowActivity(processid, 'start')
    processName = activity.getProcessName()
    flowID = guid()
    taskID = flowID
    person = get_curr_person_info()
    task = SATask(sid=taskID, sflowid=flowID, sprocess=processid,
                  sname=processName,
                  sdata1=sdata1,
                  scpersonid=person['personid'],
                  scpersonname=person['personName'],
                  scdeptid=person['deptid'],
                  scdeptname=person['deptname'],
                  scognid=person['ognid'],
                  scognname=person['ognname'],
                  scfid=person['personfid'],
                  scfname=person['personfname'],
                  sepersonid=person['personid'],
                  sepersonname=person['personName'],
                  sedeptid=person['deptid'],
                  sedeptname=person['deptname'],
                  seognid=person['ognid'],
                  seognname=person['ognname'],
                  sefid=person['personfid'],
                  sefname=person['personfname'],
                  sstatusid='tesExecuting',
                  sstatusname='正在处理')
    db.session.add(task)
    db.session.commit()
    afactivity = activity.getAfterActivity()[0].getActivity()
    return processid, flowID, taskID, afactivity


# 流转流程
def out_flow(flowID, taskID, sdata1, ePersonList, afactivity):
    newtaskIDs = list()
    ctask = SATask.query.filter(SATask.sid == taskID, SATask.sflowid == flowID,
                                or_(SATask.sstatusid == 'tesReady', SATask.sstatusid == 'tesExecuting')).first()
    if ctask:
        processID = ctask.sprocess
        Activity = ctask.sactivity
        if not Activity:
            Activity = 'start'
        flwA = FlowActivity(processID, Activity)
        # processName = flwA.getProcessName()
        person = get_curr_person_info()
        act = FlowActivity(processID, afactivity)
        beforeAct = FlowActivity(processID, Activity)
        actType = beforeAct.getType()
        activitylabel = act.getsActivityLabel()
        SSTATUSID = "tesReady"
        SSTATUSNAME = "尚未处理"
        if act.getType() == "end":
            SSTATUSID = "tesFinished"
            SSTATUSNAME = "已完成"
            ePersonList = list()  # 结束环节默认执行人为自己
            ePersonList.append(person)
        if not activitylabel:
            processName = act.getActivityname() + ":" + act.getProcessName()
        else:
            activitylabel = activitylabel.replace("getProcessID()", flowID)
            activitylabel = activitylabel.replace("getTaskID()", taskID)
            activitylabel = activitylabel.replace("getProcesssData1()", sdata1)
            processName = eval(activitylabel)
        for eperson in ePersonList:  # 给指定的执行人添加待办
            newtaskID = guid()
            task = SATask(sid=newtaskID, sparentid=taskID, sflowid=flowID,
                          sprocess=processID, sactivity=afactivity,
                          sname=processName,
                          sdata1=sdata1,
                          scurl=flwA.getUrl(),
                          scpersonid=person['personid'],
                          scpersonname=person['personName'],
                          scdeptid=person['deptid'],
                          scdeptname=person['deptname'],
                          scognid=person['ognid'],
                          scognname=person['ognname'],
                          scfid=person['personfid'],
                          scfname=person['personfname'],
                          sepersonid=eperson['personid'],
                          sepersonname=eperson['personName'],
                          sedeptid=eperson['deptid'],
                          sedeptname=eperson['deptname'],
                          seognid=eperson['ognid'],
                          seognname=eperson['ognname'],
                          sefid=eperson['personfid'],
                          sefname=eperson['personfname'],
                          seurl=act.getUrl(),
                          sstatusid=SSTATUSID,
                          sstatusname=SSTATUSNAME)
            db.session.add(task)
            newtaskIDs.append(newtaskID)
        if actType != "start" and beforeAct.getGrapModle() != "together":  # 上一个环节为抢占模式需要取消同环节任务
            bftasks = SATask.query.filter(SATask.sid != taskID, SATask.sflowid == flowID,
                                          SATask.sparentid == ctask.sparentid).all()
            for bft in bftasks:
                bft.sstatusid = 'tesCanceled'
                bft.sstatusname = '已取消'
                bft.sexecutetime = datetime.now()
                bft.version = bft.version + 1
                db.session.add(bft)
        if len(act.getAfterActivity()) == 0 or act.getType() == "end":  # 流程结束 完成所有待办
            chtask = SATask.query.filter_by(sstatusid='tesReady', sflowid=flowID, sparentid=taskID).first()
            if not chtask:
                stask = SATask.query.filter_by(sid=flowID).first()  # 完成所有待办则标记流程为已完成
                if stask:
                    stask.sstatusid = 'tesFinished'
                    stask.sstatusname = '已完成'
                    stask.sexecutetime = datetime.now()
                    db.session.add(stask)
        if ctask.sstatusid == "tesReady":
            ctask.sstatusid = 'tesFinished'
            ctask.sstatusname = '已完成'
            ctask.sexecutetime = datetime.now()
            ctask.version = ctask.version + 1
            db.session.add(ctask)
        db.session.commit()
        noteActivity = act.getNoteActivity()
        if noteActivity and noteActivity != "":  # 如果定义了通知环节则去发送通知
            flow_send_notes(flowID, taskID, sdata1, noteActivity)
        return newtaskIDs
    else:
        raise Exception("指定的任务id无效,或任务已经处理完成不能再处理！")


# 发送流程通知
def flow_send_notes(flowID, taskID, sdata1, noteActivity):
    ctask = SATask.query.filter_by(sid=taskID).first()
    if ctask:
        processID = ctask.sprocess
        Activity = ctask.sactivity
        flwA = FlowActivity(processID, Activity)
        act = FlowActivity(processID, noteActivity)
        activitylabel = act.getsActivityLabel()
        if not activitylabel:
            processName = act.getActivityname() + ":" + act.getProcessName()
        else:
            activitylabel = activitylabel.replace("getProcessID()", flowID)
            activitylabel = activitylabel.replace("getTaskID()", taskID)
            activitylabel = activitylabel.replace("getProcesssData1()", sdata1)
            processName = eval(activitylabel)
        excutorids = act.getExcutorIDs()
        if not excutorids or excutorids == "":
            exp_executors = act.getExcutorGroup()
            if exp_executors and exp_executors != "":
                exp_executors = exp_executors.replace("getProcessID()", flowID)
                exp_executors = exp_executors.replace("getTaskID()", taskID)
                exp_executors = exp_executors.replace("getProcesssData1()", sdata1)
                excutorids = eval(exp_executors)
            else:
                excutorids = get_org_unit_has_activity(processID, noteActivity, True, False)
        if excutorids and excutorids != "":
            person = get_curr_person_info()
            ePersonList = get_person_list_by_org(excutorids)
            for eperson in ePersonList:  # 给指定的执行人添加待办
                c_task = SATask.query.filter_by(sparentid=taskID, sflowid=flowID,
                                                sepersonid=eperson['personid'], sstatusid='tesReady').first()
                if c_task:  # 如果已经存在相同通知，则不再发送（避免重复通知）
                    continue
                newtaskID = guid()
                task = SATask(sid=newtaskID, sparentid=taskID, sflowid=flowID,
                              sprocess=processID,
                              sname=processName,
                              sdata1=sdata1,
                              scurl=flwA.getUrl(),
                              scpersonid=person['personid'],
                              scpersonname=person['personName'],
                              scdeptid=person['deptid'],
                              scdeptname=person['deptname'],
                              scognid=person['ognid'],
                              scognname=person['ognname'],
                              scfid=person['personfid'],
                              scfname=person['personfname'],
                              sepersonid=eperson['personid'],
                              sepersonname=eperson['personName'],
                              sedeptid=eperson['deptid'],
                              sedeptname=eperson['deptname'],
                              seognid=eperson['ognid'],
                              seognname=eperson['ognname'],
                              sefid=eperson['personfid'],
                              sefname=eperson['personfname'],
                              seurl=act.getUrl(),
                              sstatusid='tesReady',
                              sstatusname='尚未处理',
                              skindid='note')
                db.session.add(task)
            db.session.commit()


# 流程回退
def flow_back(processID, processName, Activity, flowID, taskID, sData1, ePersonList, cURL):
    act = FlowActivity(processID, Activity)
    nprocessName = act.getActivityname()  # 任务标题
    processName = nprocessName + "←回退-" + processName
    person = get_curr_person_info()
    newtaskID = None
    for eperson in ePersonList:
        newtaskID = guid()
        task = SATask(sid=newtaskID, sparentid=taskID, sflowid=flowID,
                      sprocess=processID, sactivity=Activity,
                      sname=processName,
                      sdata1=sData1,
                      scurl=cURL,
                      scpersonid=person['personid'],
                      scpersonname=person['personName'],
                      scdeptid=person['deptid'],
                      scdeptname=person['deptname'],
                      scognid=person['ognid'],
                      scognname=person['ognname'],
                      scfid=person['personfid'],
                      scfname=person['personfname'],
                      sepersonid=eperson['personid'],
                      sepersonname=eperson['personName'],
                      sedeptid=eperson['deptid'],
                      sedeptname=eperson['deptname'],
                      seognid=eperson['ognid'],
                      seognname=eperson['ognname'],
                      sefid=eperson['personfid'],
                      sefname=eperson['personfname'],
                      seurl=act.getUrl(),
                      sstatusid='tesReady',
                      sstatusname='尚未处理')
        db.session.add(task)
    return newtaskID


# 流程转发
def flow_forward(task, ePersonList):
    person = get_curr_person_info()
    newtaskID = None
    for eperson in ePersonList:
        newtaskID = guid()
        n_task = SATask(
            sid=newtaskID,
            sparentid=task.sid,
            sflowid=task.sflowid,
            sprocess=task.sprocess,
            sactivity=task.sactivity,
            sname=task.sname,
            sdata1=task.sdata1,
            scurl=task.scurl,
            scpersonid=person['personid'],
            scpersonname=person['personName'],
            scdeptid=person['deptid'],
            scdeptname=person['deptname'],
            scognid=person['ognid'],
            scognname=person['ognname'],
            scfid=person['personfid'],
            scfname=person['personfname'],
            sepersonid=eperson['personid'],
            sepersonname=eperson['personName'],
            sedeptid=eperson['deptid'],
            sedeptname=eperson['deptname'],
            seognid=eperson['ognid'],
            seognname=eperson['ognname'],
            sefid=eperson['personfid'],
            sefname=eperson['personfname'],
            seurl=task.seurl,
            sstatusid='tesReady',
            sstatusname='尚未处理')
        db.session.add(n_task)
    task.sstatusid = 'tesTransmit'
    task.sstatusname = '已转发'
    task.sexecutetime = datetime.now()
    task.version = task.version + 1
    db.session.add(task)
    db.session.commit()
    return newtaskID
