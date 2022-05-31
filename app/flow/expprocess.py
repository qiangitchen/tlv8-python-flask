# _*_ coding:utf-8 _*_

from app.sa.models import SATask, SAOrganization, SAPerson

"""
流程执行者函数
"""


# 获取指定环节处理人
def getActivityExecutor(flowID, activity):
    task = SATask.query.filter_by(sflowid=flowID, sactivity=activity).first()
    if task:
        return task.sepersonname
    return ""


# 获取指定环节处理人FID
def getActivityExecutorFID(flowID, activity):
    task = SATask.query.filter_by(sflowid=flowID, sactivity=activity).first()
    if task:
        return task.sefid
    return ""


# 获取指定环节处理人所属组织
def getActivityExecutorOrg(flowID, activity):
    task = SATask.query.filter_by(sflowid=flowID, sactivity=activity).first()
    if task:
        person = SAPerson.query.filter_by(sid=task.sepersonid).first()
        if person:
            org = SAOrganization.query.filter_by(sid=person.smainorgid).first()
            if org:
                return org.sname
    return ""


# 获取指定环节处理人所属组织ID
def getActivityExecutorOrgID(flowID, activity):
    task = SATask.query.filter_by(sflowid=flowID, sactivity=activity).first()
    if task:
        person = SAPerson.query.filter_by(sid=task.sepersonid).first()
        if person:
            return person.smainorgid
    return ""


# 获取指定环节处理人所属组织FID
def getActivityExecutorOrgFID(flowID, activity):
    task = SATask.query.filter_by(sflowid=flowID, sactivity=activity).first()
    if task:
        person = SAPerson.query.filter_by(sid=task.sepersonid).first()
        if person:
            org = SAOrganization.query.filter_by(sid=person.smainorgid).first()
            if org:
                return org.sfid
    return ""


# 获取指定环节处理人所属部门
def getActivityExecutorDept(flowID, activity):
    task = SATask.query.filter_by(sflowid=flowID, sactivity=activity).first()
    if task:
        return task.sedeptname
    return ""


# 获取指定环节处理人所属部门ID
def getActivityExecutorDeptID(flowID, activity):
    task = SATask.query.filter_by(sflowid=flowID, sactivity=activity).first()
    if task:
        return task.sedeptid
    return ""


# 获取指定环节处理人所属部门FID
def getActivityExecutorDeptFID(flowID, activity):
    task = SATask.query.filter_by(sflowid=flowID, sactivity=activity).first()
    if task:
        org = SAOrganization.query.filter_by(sid=task.sedeptid).first()
        if org:
            return org.sfid
    return ""


# 获取指定环节提交人
def getActivityCreator(flowID, activity):
    task = SATask.query.filter_by(sflowid=flowID, sactivity=activity).first()
    if task:
        return task.scpersonname
    return ""


# 获取指定环节提交人FID
def getActivityCreatorFID(flowID, activity):
    task = SATask.query.filter_by(sflowid=flowID, sactivity=activity).first()
    if task:
        return task.scfid
    return ""


# 获取指定环节提交人所属组织
def getActivityCreatorOrg(flowID, activity):
    task = SATask.query.filter_by(sflowid=flowID, sactivity=activity).first()
    if task:
        person = SAPerson.query.filter_by(sid=task.scpersonid).first()
        if person:
            org = SAOrganization.query.filter_by(sid=person.smainorgid).first()
            if org:
                return org.sname
    return ""


# 获取指定环节提交人所属组织ID
def getActivityCreatorOrgID(flowID, activity):
    task = SATask.query.filter_by(sflowid=flowID, sactivity=activity).first()
    if task:
        person = SAPerson.query.filter_by(sid=task.scpersonid).first()
        if person:
            return person.smainorgid
    return ""


# 获取指定环节提交人所属组织FID
def getActivityCreatorOrgFID(flowID, activity):
    task = SATask.query.filter_by(sflowid=flowID, sactivity=activity).first()
    if task:
        person = SAPerson.query.filter_by(sid=task.scpersonid).first()
        if person:
            org = SAOrganization.query.filter_by(sid=person.smainorgid).first()
            if org:
                return org.sfid
    return ""


# 获取指定环节提交人所属部门
def getActivityCreatorDept(flowID, activity):
    task = SATask.query.filter_by(sflowid=flowID, sactivity=activity).first()
    if task:
        return task.scdeptname
    return ""


# 获取指定环节提交人所属部门ID
def getActivityCreatorDeptID(flowID, activity):
    task = SATask.query.filter_by(sflowid=flowID, sactivity=activity).first()
    if task:
        return task.scdeptid
    return ""


# 获取指定环节提交人所属部门FID
def getActivityCreatorDeptFID(flowID, activity):
    task = SATask.query.filter_by(sflowid=flowID, sactivity=activity).first()
    if task:
        org = SAOrganization.query.filter_by(sid=task.scdeptid).first()
        if org:
            return org.sfid
    return ""
