# _*_ coding:utf-8 _*_

"""
表达式
"""

# 组织机构执行者函数
OrgExecutor = {
    'id': 'OrgExecutor',
    'isParent': 'true',
    'name': '组织机构执行者函数',
    'children': [
        {'pId': 'OrgExecutor',
         'id': 'get_org_unit_has_activity',
         'name': '获取指定activity权限的组织单元',
         'param': 'process,activity,in-org,person-member',
         'param_value': 'getProcessID(),,,False',
         'helper': ("getOrgUnitHasActivity<br>参数: <br>"
                    "process: 过程标识,类型是字符串或SYMBOL,为空时表示当前process<br>"
                    "activity: 活动标识,类型是字符串<br>in-org: 返回值必须在指定组织范围内,值是组织的ID或FID,单值用字符串,多值用cons函数组合<br>"
                    "person-member: TRUE表示获取分配了权限的组织单元下的人员成员,FALSE表示只获取到分配了权限的组织单元<br>"
                    "说明: 获取分配了activity权限的组织单元,或者这些组织单元下的所有人员成员,可直接当作执行者返回<br>"
                    "例子: <br>get_org_unit_has_activity('dept-code1', 'tartActivity', getCurrentDeptID(), True)")
         },
        {'pId': 'OrgExecutor',
         'id': 'get_org_unit_has_activity_inter_agency',
         'name': '获取指定activity权限的组织单元(跨单位)',
         'param': 'process,activity,person-member',
         'param_value': 'getProcessID(),,False',
         'helper': ("getOrgUnitHasActivity<br>参数: <br>"
                    "process: 过程标识,类型是字符串或SYMBOL,为空时表示当前process<br>"
                    "activity: 活动标识,类型是字符串<br>"
                    "person-member: TRUE表示获取分配了权限的组织单元下的人员成员,FALSE表示只获取到分配了权限的组织单元<br>"
                    "说明: 获取分配了activity权限的组织单元,或者这些组织单元下的所有人员成员,可直接当作执行者返回<br>"
                    "例子: <br>get_org_unit_has_activity_inter_agency('dept-code1', 'tartActivity', True)")
         },
        {'pId': 'OrgExecutor',
         'id': 'get_org_unit_manager',
         'name': '获取指定组织单元的管理者',
         'param': 'org,manage-type,clude-parent,in-org,person-member',
         'param_value': ',,False,,True',
         'helper': ("get_org_unit_manager <br>参数: <br>org: 组织的ID或FID,单值用字符串或SYMBOL,多值用逗号分隔<br>"
                    "manage-type: 管理类型的CODE,空表示所有管理类型<br>"
                    "clude-parent: FALSE表示直接取ORG上的管理者, TRUE表示ORG的父上的管理者也取<br>"
                    "in-org: 返回值必须在指定组织范围内,值是组织的ID或FID,单值用字符串,多值用cons函数组合<br>"
                    "person-member：FALSE表示只获取到org的管理者,TRUE表示获取到org的管理者的人员成员<br>"
                    "说明: 获取指定组织单元的管理者,可直接当作执行者返回<br>例子: <br>"
                    "get_org_unit_manager(getCurrentDeptID(), 'SYSTEM', True, '', True)<br>")
         },
        {'pId': 'OrgExecutor',
         'id': 'get_org_unit_has_role_by_code',
         'name': '获取属于指定角色的组织单元',
         'param': 'role-code,in-org,person-member',
         'param_value': ',,True',
         'helper': ("get_org_unit_has_role_by_code <br>参数: <br>"
                    "role-code: 角色的CODE,单值用字符串,多值用cons函数组合<br>"
                    "in-org: 返回值必须在指定组织范围内,值是组织的ID或FID,单值用字符串,多值用cons函数组合<br>"
                    "person-member：是否取到人员成员<br>"
                    "说明: 获取属于指定角色的组织单元,可直接当作执行者返回<br>"
                    "例子: <br>get_org_unit_has_role_by_code('system', '', True)")
         },
        {'pId': 'OrgExecutor',
         'id': 'get_org_unit_has_role_by_code_inter_agency',
         'name': '获取属于指定角色的组织单元(跨单位)',
         'param': 'role-code,person-member',
         'param_value': ',True',
         'helper': ("get_org_unit_has_role_by_code_inter_agency <br>参数: <br>"
                    "role-code: 角色的CODE,单值用字符串,多值用cons函数组合<br>"
                    "in-org: 返回值必须在指定组织范围内,值是组织的ID或FID,单值用字符串,多值用cons函数组合<br>"
                    "person-member：是否取到人员成员<br>"
                    "说明: 获取属于指定角色的组织单元,可直接当作执行者返回<br>"
                    "例子: <br>get_org_unit_has_role_by_code_inter_agency('system', True)")
         }
    ]
}

# 流程执行者函数
Process = {
    'id': 'process',
    'isParent': 'true',
    'name': '流程执行者函数',
    'children': [
        {'pId': 'process',
         'id': 'getActivityExecutor',
         'name': '获取指定环节处理人',
         'param': 'flowID,activity',
         'param_value': 'getFlowID(),',
         'helper': ("getActivityExecutor<br>参数: <br>"
                    "flowID值为当前流程标识,默认为:getFlowID()<br>"
                    "activity: 活动标识,类型是字符串<br>"
                    "例子: <br>getActivityExecutor(getFlowID(), 'activity1')")
         },
        {'pId': 'process',
         'id': 'getActivityExecutorFID',
         'name': '获取指定环节处理人FID',
         'param': 'flowID,activity',
         'param_value': 'getFlowID(),',
         'helper': ("getActivityExecutorFID<br>参数: <br>"
                    "flowID值为当前流程标识,默认为:getFlowID()<br>"
                    "activity: 活动标识,类型是字符串<br>"
                    "例子: <br>getActivityExecutorFID(getFlowID(), 'activity1')")
         },
        {'pId': 'process',
         'id': 'getActivityExecutorOrg',
         'name': '获取指定环节处理人所属组织',
         'param': 'flowID,activity',
         'param_value': 'getFlowID(),',
         'helper': ("getActivityExecutorOrg<br>参数: <br>"
                    "flowID值为当前流程标识,默认为:getFlowID()<br>"
                    "activity: 活动标识,类型是字符串<br>"
                    "例子: <br>getActivityExecutorOrg(getFlowID(), 'activity1')")
         },
        {'pId': 'process',
         'id': 'getActivityExecutorOrgID',
         'name': '获取指定环节处理人所属组织ID',
         'param': 'flowID,activity',
         'param_value': 'getFlowID(),',
         'helper': ("getActivityExecutorOrgID<br>参数: <br>"
                    "flowID值为当前流程标识,默认为:getFlowID()<br>"
                    "activity: 活动标识,类型是字符串<br>"
                    "例子: <br>getActivityExecutorOrgID(getFlowID(), 'activity1')")
         },
        {'pId': 'process',
         'id': 'getActivityExecutorOrgFID',
         'name': '获取指定环节处理人所属组织FID',
         'param': 'flowID,activity',
         'param_value': 'getFlowID(),',
         'helper': ("getActivityExecutorOrgFID<br>参数: <br>"
                    "flowID值为当前流程标识,默认为:getFlowID()<br>"
                    "activity: 活动标识,类型是字符串<br>"
                    "例子: <br>getActivityExecutorOrgFID(getFlowID(), 'activity1')")
         },
        {'pId': 'process',
         'id': 'getActivityExecutorDept',
         'name': '获取指定环节处理人所属部门',
         'param': 'flowID,activity',
         'param_value': 'getFlowID(),',
         'helper': ("getActivityExecutorDept<br>参数: <br>"
                    "flowID值为当前流程标识,默认为:getFlowID()<br>"
                    "activity: 活动标识,类型是字符串<br>"
                    "例子: <br>getActivityExecutorDept(getFlowID(), 'activity1')")
         },
        {'pId': 'process',
         'id': 'getActivityExecutorDeptID',
         'name': '获取指定环节处理人所属部门ID',
         'param': 'flowID,activity',
         'param_value': 'getFlowID(),',
         'helper': ("getActivityExecutorDeptID<br>参数: <br>"
                    "flowID值为当前流程标识,默认为:getFlowID()<br>"
                    "activity: 活动标识,类型是字符串<br>"
                    "例子: <br>getActivityExecutorDeptID(getFlowID(), 'activity1')")
         },
        {'pId': 'process',
         'id': 'getActivityExecutorDeptFID',
         'name': '获取指定环节处理人所属部门FID',
         'param': 'flowID,activity',
         'param_value': 'getFlowID(),',
         'helper': ("getActivityExecutorDeptFID<br>参数: <br>"
                    "flowID值为当前流程标识,默认为:getFlowID()<br>"
                    "activity: 活动标识,类型是字符串<br>"
                    "例子: <br>getActivityExecutorDeptFID(getFlowID(), 'activity1')")
         },
        {'pId': 'process',
         'id': 'getActivityCreator',
         'name': '获取指定环节提交人',
         'param': 'flowID,activity',
         'param_value': 'getFlowID(),',
         'helper': ("getActivityCreator<br>参数: <br>"
                    "flowID值为当前流程标识,默认为:getFlowID()<br>"
                    "activity: 活动标识,类型是字符串<br>"
                    "例子: <br>getActivityCreator(getFlowID(), 'activity1')")
         },
        {'pId': 'process',
         'id': 'getActivityCreatorFID',
         'name': '获取指定环节提交人FID',
         'param': 'flowID,activity',
         'param_value': 'getFlowID(),',
         'helper': ("getActivityCreatorFID<br>参数: <br>"
                    "flowID值为当前流程标识,默认为:getFlowID()<br>"
                    "activity: 活动标识,类型是字符串<br>"
                    "例子: <br>getActivityCreatorFID(getFlowID(), 'activity1')")
         },
        {'pId': 'process',
         'id': 'getActivityCreatorOrg',
         'name': '获取指定环节提交人所属组织',
         'param': 'flowID,activity',
         'param_value': 'getFlowID(),',
         'helper': ("getActivityCreatorOrg<br>参数: <br>"
                    "flowID值为当前流程标识,默认为:getFlowID()<br>"
                    "activity: 活动标识,类型是字符串<br>"
                    "例子: <br>getActivityCreatorOrg(getFlowID(), 'activity1')")
         },
        {'pId': 'process',
         'id': 'getActivityCreatorOrgFID',
         'name': '获取指定环节提交人所属组织FID',
         'param': 'flowID,activity',
         'param_value': 'getFlowID(),',
         'helper': ("getActivityCreatorOrgFID<br>参数: <br>"
                    "flowID值为当前流程标识,默认为:getFlowID()<br>"
                    "activity: 活动标识,类型是字符串<br>"
                    "例子: <br>getActivityCreatorOrgFID(getFlowID(), 'activity1')")
         },
        {'pId': 'process',
         'id': 'getActivityCreatorDept',
         'name': '获取指定环节提交人所属部门',
         'param': 'flowID,activity',
         'param_value': 'getFlowID(),',
         'helper': ("getActivityCreatorDept<br>参数: <br>"
                    "flowID值为当前流程标识,默认为:getFlowID()<br>"
                    "activity: 活动标识,类型是字符串<br>"
                    "例子: <br>getActivityCreatorDept(getFlowID(), 'activity1')")
         },
        {'pId': 'process',
         'id': 'getActivityCreatorDeptID',
         'name': '获取指定环节提交人所属部门ID',
         'param': 'flowID,activity',
         'param_value': 'getFlowID(),',
         'helper': ("getActivityCreatorDeptID<br>参数: <br>"
                    "flowID值为当前流程标识,默认为:getFlowID()<br>"
                    "activity: 活动标识,类型是字符串<br>"
                    "例子: <br>getActivityCreatorDeptID(getFlowID(), 'activity1')")
         },
        {'pId': 'process',
         'id': 'getActivityCreatorDeptFID',
         'name': '获取指定环节提交人所属部门FID',
         'param': 'flowID,activity',
         'param_value': 'getFlowID(),',
         'helper': ("getActivityCreatorDeptFID<br>参数: <br>"
                    "flowID值为当前流程标识,默认为:getFlowID()<br>"
                    "activity: 活动标识,类型是字符串<br>"
                    "例子: <br>getActivityCreatorDeptFID(getFlowID(), 'activity1')")
         }
    ]
}

# 组织机构一般函数
OrgUtils = {
    'id': 'orgUtils',
    'isParent': 'true',
    'name': '组织机构一般函数',
    'children': [
        {'pId': 'orgUtils',
         'id': 'getCurrentPersonID',
         'name': '获取当前人员ID',
         'helper': ("说明: 获取当前人的ID<br>"
                    "例子: getCurrentPersonID()")
         },
        {'pId': 'orgUtils',
         'id': 'getCurrentPersonCode',
         'name': '获取当前人员Code',
         'helper': ("说明: 获取当前人员Code<br>"
                    "例子: getCurrentPersonCode()")
         },
        {'pId': 'orgUtils',
         'id': 'getCurrentPersonName',
         'name': '获取当前人员Name',
         'helper': ("说明: 获取当前人员Name<br>"
                    "例子: getCurrentPersonName()")
         },
        {'pId': 'orgUtils',
         'id': 'getCurrentPersonFID',
         'name': '获取当前人员FID',
         'helper': ("说明: 获取当前人员FID<br>"
                    "例子: getCurrentPersonFID()")
         },
        {'pId': 'orgUtils',
         'id': 'getCurrentPersonFCode',
         'name': '获取当前人员FCode',
         'helper': ("说明: 获取当前人员FCode<br>"
                    "例子: getCurrentPersonFCode()")
         },
        {'pId': 'orgUtils',
         'id': 'getCurrentPersonFName',
         'name': '获取当前人员Name',
         'helper': ("说明: 获取当前人员Name<br>"
                    "例子: getCurrentPersonFName()")
         },
        {'pId': 'orgUtils',
         'id': 'getCurrentPosID',
         'name': '获取当前人岗位ID',
         'helper': ("说明: 获取当前人岗位ID<br>"
                    "例子: getCurrentPosID()")
         },
        {'pId': 'orgUtils',
         'id': 'getCurrentPosCode',
         'name': '获取当前人岗位Code',
         'helper': ("说明: 获取当前人岗位Code<br>"
                    "例子: getCurrentPosCode()")
         },
        {'pId': 'orgUtils',
         'id': 'getCurrentPosName',
         'name': '获取当前人岗位Name',
         'helper': ("说明: 获取当前人岗位Name<br>"
                    "例子: getCurrentPosName()")
         },
        # {'pId': 'orgUtils',
        #  'id': 'getCurrentPosFID',
        #  'name': '获取当前人岗位FID',
        #  'helper': ("说明: 获取当前人岗位FID<br>"
        #             "例子: getCurrentPosFID()")
        #  },
        # {'pId': 'orgUtils',
        #  'id': 'getCurrentPosFCode',
        #  'name': '获取当前人岗位FCode',
        #  'helper': ("说明: 获取当前人岗位FCode<br>"
        #             "例子: getCurrentPosFCode()")
        #  },
        # {'pId': 'orgUtils',
        #  'id': 'getCurrentPosFName',
        #  'name': '获取当前人岗位Name',
        #  'helper': ("说明: 获取当前人岗位Name<br>"
        #             "例子: getCurrentPosFName()")
        #  },
        {'pId': 'orgUtils',
         'id': 'getCurrentDeptID',
         'name': '获取当前人部门ID',
         'helper': ("说明: 获取当前人部门ID<br>"
                    "例子: getCurrentDeptID()")
         },
        {'pId': 'orgUtils',
         'id': 'getCurrentDeptCode',
         'name': '获取当前人部门Code',
         'helper': ("说明: 获取当前人部门Code<br>"
                    "例子: getCurrentDeptCode()")
         },
        {'pId': 'orgUtils',
         'id': 'getCurrentDeptName',
         'name': '获取当前人部门Name',
         'helper': ("说明: 获取当前人部门Name<br>"
                    "例子: getCurrentDeptName()")
         },
        # {'pId': 'orgUtils',
        #  'id': 'getCurrentDeptFID',
        #  'name': '获取当前人部门FID',
        #  'helper': ("说明: 获取当前人部门FID<br>"
        #             "例子: getCurrentDeptFID()")
        #  },
        # {'pId': 'orgUtils',
        #  'id': 'getCurrentDeptFCode',
        #  'name': '获取当前人部门FCode',
        #  'helper': ("说明: 获取当前人部门FCode<br>"
        #             "例子: getCurrentDeptFCode()")
        #  },
        # {'pId': 'orgUtils',
        #  'id': 'getCurrentDeptFName',
        #  'name': '获取当前人部门Name',
        #  'helper': ("说明: 获取当前人部门Name<br>"
        #             "例子: getCurrentDeptFName()")
        #  },
        {'pId': 'orgUtils',
         'id': 'getCurrentOgnID',
         'name': '获取当前人机构ID',
         'helper': ("说明: 获取当前人机构ID<br>"
                    "例子: getCurrentOgnID()")
         },
        {'pId': 'orgUtils',
         'id': 'getCurrentOgnCode',
         'name': '获取当前人机构Code',
         'helper': ("说明: 获取当前人机构Code<br>"
                    "例子: getCurrentOgnCode()")
         },
        {'pId': 'orgUtils',
         'id': 'getCurrentOgnName',
         'name': '获取当前人机构Name',
         'helper': ("说明: 获取当前人机构Name<br>"
                    "例子: getCurrentOgnName()")
         },
        # {'pId': 'orgUtils',
        #  'id': 'getCurrentOgnFID',
        #  'name': '获取当前人机构FID',
        #  'helper': ("说明: 获取当前人机构FID<br>"
        #             "例子: getCurrentOgnFID()")
        #  },
        # {'pId': 'orgUtils',
        #  'id': 'getCurrentOgnFCode',
        #  'name': '获取当前人机构FCode',
        #  'helper': ("说明: 获取当前人机构FCode<br>"
        #             "例子: getCurrentOgnFCode()")
        #  },
        # {'pId': 'orgUtils',
        #  'id': 'getCurrentOgnFName',
        #  'name': '获取当前人机构Name',
        #  'helper': ("说明: 获取当前人机构Name<br>"
        #             "例子: getCurrentOgnFName()")
        #  },
        {'pId': 'orgUtils',
         'id': 'getCurrentOrgID',
         'name': '获取当前人组织ID',
         'helper': ("说明: 获取当前人组织ID<br>"
                    "例子: getCurrentOrgID()")
         },
        {'pId': 'orgUtils',
         'id': 'getCurrentOrgCode',
         'name': '获取当前人组织Code',
         'helper': ("说明: 获取当前人组织Code<br>"
                    "例子: getCurrentOrgCode()")
         },
        {'pId': 'orgUtils',
         'id': 'getCurrentOrgName',
         'name': '获取当前人组织Name',
         'helper': ("说明: 获取当前人组织Name<br>"
                    "例子: getCurrentOrgName()")
         },
        {'pId': 'orgUtils',
         'id': 'getCurrentOrgFID',
         'name': '获取当前人组织FID',
         'helper': ("说明: 获取当前人组织FID<br>"
                    "例子: getCurrentOrgFID()")
         },
        {'pId': 'orgUtils',
         'id': 'getCurrentOrgFCode',
         'name': '获取当前人组织FCode',
         'helper': ("说明: 获取当前人组织FCode<br>"
                    "例子: getCurrentOrgFCode()")
         },
        {'pId': 'orgUtils',
         'id': 'getCurrentOrgFName',
         'name': '获取当前人组织Name',
         'helper': ("说明: 获取当前人组织Name<br>"
                    "例子: getCurrentOrgFName()")
         }
    ]
}

# 业务功能
BusiExp = {
    'id': 'busiExp',
    'isParent': 'true',
    'name': '业务功能',
    'children': [
        {'pId': 'busiExp',
         'id': 'getRelationValueString',
         'name': '获取表中字段的值',
         'param': 'concept,individual,condition,orderRelation,returnRelation',
         'param_value': ',getProcesssData1()',
         'helper': ("说明: 根据传入参数从数据库中获取字符串值，此函数可嵌套用来查从表数据<br>"
                    "参数说明：<br>"
                    "concept【必填】： 表(视图)名称<br>"
                    "individual【必填】： 主键的值 fID/sID 流程单据主键 如 ：getProcesssData1()<br>"
                    "condition【可选】： 过虑条件， 例如：fName='system'<br>"
                    "orderRelation【可选】： 用来作排序的字段<br>"
                    "returnRelation【必填】： 要取哪个字段的值.<br>"
                    "例子: getRelationValueString('sa_opperson',getProcesssData1(),'','','sname')<br>")
         },
        {'pId': 'busiExp',
         'id': 'selectChoice',
         'name': '空值选择',
         'param': 'value1,value2',
         'param_value': ',',
         'helper': ("说明: 如果value1存在取value1否则取value2<br>"
                    "例子: selectChoice('','')<br>")
         },
        {'pId': 'busiExp',
         'id': 'isNull',
         'name': '是否为空',
         'param': 'values',
         'param_value': '',
         'helper': ("说明: 判断是否为空<br>"
                    "例子: isNull(aa)<br>")
         },
        {'pId': 'busiExp',
         'id': 'concat',
         'name': '字符串连接',
         'param': 'values',
         'param_value': '',
         'helper': ("说明: 多个字符串连接，多个参数<br>"
                    "例子: concat('a','b')<br>")
         },
        {'pId': 'busiExp',
         'id': 'upper',
         'name': '字符串转大写',
         'param': 'values',
         'param_value': '',
         'helper': ("说明: 把字符串转成大写字符<br>"
                    "例子: upper('a')<br>")
         },
        {'pId': 'busiExp',
         'id': 'lower',
         'name': '字符串转小写',
         'param': 'values',
         'param_value': '',
         'helper': ("说明: 字符串转小写<br>"
                    "例子: lower('a')<br>")
         },
        {'pId': 'busiExp',
         'id': 'trim',
         'name': '字符串去空格',
         'param': 'values',
         'param_value': '',
         'helper': ("说明: 字符串去空格<br>"
                    "例子: trim(' a ')<br>")
         },
        {'pId': 'busiExp',
         'id': 'isContain',
         'name': '是否包含',
         'param': 'str1,str2',
         'param_value': ',',
         'helper': ("说明: 判断字符串str1中是否包含str2<br>"
                    "例子: isContain(str1,str2)<br>")
         }
    ]
}


# 获取表达式配置
def get_expression_tree():
    tree = list()
    tree.append(OrgExecutor)
    tree.append(Process)
    tree.append(OrgUtils)
    tree.append(BusiExp)
    return tree
