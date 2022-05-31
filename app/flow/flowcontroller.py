# _*_ coding:utf-8 _*_

from flask import request
from app import db
from app.sa.models import SATask, SAOrganization, SAPerson, SAFlowDraw
from app.sa.persons import get_curr_person_info
from app.flow.flowentity import FlowActivity
from app.common.pubstatic import guid
from app.flow.exporgutils import *
from app.flow.expprocess import *
from app.flow.expbusiness import *
from app.flow.exporgexecutor import *

"""
流程控制
"""


# 根据地址获取流程图id
def seach_process_id(url):
    dwr = SAFlowDraw.query.filter(SAFlowDraw.sprocessacty.ilike("%" + url + "%")).first()
    if dwr:
        return dwr.sprocessid


# 启动流程
def start_flow(sdata1, processid):
    if not processid:
        processid = seach_process_id(request.path)
        if not processid:
            raise Exception("没有找到流程图，请确认流程图配置是否正确！")
    processName = FlowActivity(processid, 'start').getProcessName()
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
    return flowID, taskID


# 流转流程
def out_flow(flowID, taskID, sdata1, ePersonList, afterActivityList):
    ctask = SATask.query.filter_by(sid=taskID, sflowid=flowID).first()
    if ctask:
        processID = ctask.sprocess
        Activity = ctask.sactivity
        if not Activity:
            Activity = 'start'
        flwA = FlowActivity(processID, Activity)
        # processName = flwA.getProcessName()
        person = get_curr_person_info()
        for afactivity in afterActivityList:
            act = FlowActivity(processID, afactivity)
            activitylabel = act.getsActivityLabel()
            if not activitylabel:
                processName = act.getActivityname() + ":" + act.getProcessName()
            else:
                activitylabel = activitylabel.replace("getProcessID()", flowID);
                activitylabel = activitylabel.replace("getTaskID()", taskID);
                activitylabel = activitylabel.replace("getProcesssData1()", sdata1);
                processName = eval(activitylabel)
            for eperson in ePersonList:
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
                              sstatusid='tesExecuting',
                              sstatusname='正在处理')
                db.session.add(task)
        db.session.commit()
        return newtaskID
