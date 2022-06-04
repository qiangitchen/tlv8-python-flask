# _*_ coding:utf-8 _*_

from app.models import SAFlowDraw
from app.flow.codeutils import decodeSpechars

"""
流程相关实体
"""


# 流程环节
class FlowActivity:
    __sActivityList = list()
    __LinesList = list()
    __sActivity = dict()
    __sActivityLabel = ""
    __processID = ""
    __processName = ""
    __processActy = ""
    __id = ""
    __type = ""
    __activity = ""
    __activityname = ""
    __property = dict()
    __url = ""
    __urlname = ""
    __excutorGroup = ""
    __excutorIDs = ""
    __excutorNames = ""
    __grapModle = ""
    __grapWay = ""
    __conditionValue = ""
    __trueOutValue = ""
    __falseOutValue = ""
    __backActivity = ""
    __noteActivity = ""
    __transeRole = ""
    __outquery = ""

    def __init__(self, ProcessID, ActivityID):  # 构造函数
        dwr = SAFlowDraw.query.filter_by(sprocessid=ProcessID).first()
        if dwr:
            self.__processID = ProcessID
            self.__processName = dwr.sprocessname
            self.__processActy = dwr.sprocessacty
            jsonObj = eval(dwr.sprocessacty.replace("null", "''"))
            sprocessacty = jsonObj['nodes']
            self.__sActivityList = sprocessacty
            for Acjson in sprocessacty:
                if Acjson['id'] == ActivityID or Acjson['type'] == ActivityID:
                    self.__sActivity = Acjson
                    self.__id = Acjson["id"]
                    self.__type = Acjson["type"]
                    self.__activity = Acjson["id"]
                    self.__activityname = Acjson["name"]
                    self.__urlname = Acjson["name"]
                    if "property" in Acjson and Acjson['property']:
                        self.__property = Acjson['property']
                        for propJson in Acjson['property']:
                            if propJson['id'] == 'n_p_exepage':
                                self.__url = propJson['value'].replace("\\", "")
                            if propJson['id'] == 'n_p_label':
                                self.__sActivityLabel = propJson['value']
                            if propJson['id'] == 'n_p_group':
                                self.__excutorGroup = propJson['value']
                            if propJson['id'] == 'n_p_roleID':
                                self.__excutorIDs = propJson['value']
                            if propJson['id'] == 'n_p_role':
                                self.__excutorNames = propJson['value']
                            if propJson['id'] == 'n_r_grab':
                                self.__grapModle = propJson['value']
                            if propJson['id'] == 'n_r_grabway':
                                self.__grapWay = propJson['value']
                            if propJson['id'] == 'c_p_expression':
                                self.__conditionValue = propJson['value']
                            if propJson['id'] == 'c_p_trueOut':
                                self.__trueOutValue = propJson['value']
                            if propJson['id'] == 'c_p_falseOut':
                                self.__falseOutValue = propJson['value']
                            if propJson['id'] == 'n_p_back':
                                self.__backActivity = propJson['value']
                            if propJson['id'] == 'n_p_note':
                                self.__noteActivity = propJson['value']
                            if propJson['id'] == 'n_r_transe':
                                self.__transeRole = propJson['value']
                            if propJson['id'] == 'n_t_queryt':
                                self.__outquery = propJson['value']
                self.__LinesList = jsonObj['lines']

    def toJson(self):
        data = dict()
        data['id'] = self.__id
        data['type'] = self.__type
        data['processID'] = self.__processID
        data['processName'] = self.__processName
        data['processActy'] = self.__processActy
        data['activity'] = self.__activity
        data['activityname'] = self.__activityname
        data['property'] = self.__property
        data['url'] = self.__url
        data['urlname'] = self.__urlname
        data['excutorGroup'] = self.__excutorGroup
        data['excutorIDs'] = self.__excutorIDs
        data['excutorNames'] = self.__excutorNames
        data['grapModle'] = self.__grapModle
        data['grapWay'] = self.__grapWay
        data['transeRole'] = self.__transeRole
        data['outquery'] = self.__outquery
        return data

    def getBeforeActivity(self):  # 获取前序环节
        alist = list()
        for LineJson in self.__LinesList:
            if LineJson['to'] == self.__id:
                bfActivity = FlowActivity(self.__processID, LineJson['from'])
                if bfActivity.getType() == "condition":
                    alist = bfActivity.getBeforeActivity()
                else:
                    alist.append(bfActivity)
        return alist

    def getAfterActivity(self):  # 获取后续环节
        alist = list()
        for LineJson in self.__LinesList:
            if LineJson['from'] == self.__id:
                afActivity = FlowActivity(self.__processID, LineJson['to'])
                if afActivity.getType() == "condition":
                    express = decodeSpechars(afActivity.getConditionValue())
                    direct = bool(eval(express))
                    if direct:
                        afDirectActivity = FlowActivity(self.__processID, afActivity.getTrueOutValue());
                    else:
                        afDirectActivity = FlowActivity(self.__processID, afActivity.getFalseOutValue());
                    alist.append(afDirectActivity)
                else:
                    alist.append(afActivity)
        return alist

    def getTaskAfterActivity(self, flowID, taskID, sData1):  # 获取流程后续环节
        alist = list()
        for LineJson in self.__LinesList:
            if LineJson['from'] == self.__id:
                afActivity = FlowActivity(self.__processID, LineJson['to'])
                if afActivity.getType() == "condition":
                    express = decodeSpechars(afActivity.getConditionValue())
                    express = express.replace("getProcessID()", flowID);
                    express = express.replace("getTaskID()", taskID);
                    express = express.replace("getProcesssData1()", sData1);
                    direct = bool(eval(express))
                    if direct:
                        afDirectActivity = FlowActivity(self.__processID, afActivity.getTrueOutValue());
                    else:
                        afDirectActivity = FlowActivity(self.__processID, afActivity.getFalseOutValue());
                    alist.append(afDirectActivity)
                else:
                    alist.append(afActivity)
        return alist

    def getsActivityList(self):
        return self.__sActivityList

    def getsActivity(self):
        return self.__sActivity

    def getActivity(self):
        return self.__activity

    def getId(self):
        return self.__id

    def getActivityname(self):
        return self.__activityname

    def getProcessName(self):
        return self.__processName

    def getUrl(self):
        return self.__url

    def getUrlname(self):
        return self.__urlname

    def getProperty(self):
        self.__property

    def getProcessActy(self):
        self.__processActy

    def getLinesList(self):
        return self.__LinesList

    def getProcessID(self):
        return self.__processID

    def getExcutorGroup(self):
        return self.__excutorGroup

    def getExcutorIDs(self):
        return self.__excutorIDs

    def getExcutorNames(self):
        return self.__excutorNames

    def getType(self):
        return self.__type

    def getConditionValue(self):
        return self.__conditionValue

    def getTrueOutValue(self):
        return self.__trueOutValue

    def getFalseOutValue(self):
        return self.__falseOutValue

    def getBackActivity(self):
        return self.__backActivity

    def getNoteActivity(self):
        return self.__noteActivity

    def getGrapModle(self):
        return self.__grapModle

    def getTranseRole(self):
        return self.__transeRole

    def getGrapWay(self):
        return self.__grapWay

    def getsActivityLabel(self):
        return self.__sActivityLabel

    def getOutquery(self):
        return self.__outquery
