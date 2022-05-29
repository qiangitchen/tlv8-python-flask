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
         'id': 'getOrgUnitHasActivity',
         'name': '获取指定activity权限的组织单元',
         'param': 'process,activity,in-org,person-member',
         'param_value': 'getProcessID(),,,FALSE',
         'code': 'get_org_unit_has_activity',
         'helper': ("getOrgUnitHasActivity&lt;br&gt;参数: &lt;br&gt;"
                    "process: 过程标识,类型是字符串或SYMBOL,为空时表示当前process&lt;br&gt;"
                    "activity: 活动标识,类型是字符串&lt;br&gt;in-org: 返回值必须在指定组织范围内,值是组织的ID或FID,单值用字符串,多值用cons函数组合&lt;br&gt;"
                    "person-member: TRUE表示获取分配了权限的组织单元下的人员成员,FALSE表示只获取到分配了权限的组织单元&lt;br&gt;"
                    "说明: 获取分配了activity权限的组织单元,或者这些组织单元下的所有人员成员,可直接当作执行者返回&lt;br&gt;"
                    "例子: &lt;br&gt;getOrgUnitHasActivity('dept-code1', 'tartActivity', getCurrentDeptID(), TRUE)")
         },
        {'pId': 'OrgExecutor',
         'id': 'getOrgUnitHasActivityInterAgency',
         'name': '获取指定activity权限的组织单元(跨单位)',
         'param': 'process,activity,person-member',
         'param_value': 'getProcessID(),,FALSE',
         'code': 'get_org_unit_has_activity_inter_agency',
         'helper': ("getOrgUnitHasActivity&lt;br&gt;参数: &lt;br&gt;"
                    "process: 过程标识,类型是字符串或SYMBOL,为空时表示当前process&lt;br&gt;"
                    "activity: 活动标识,类型是字符串&lt;br&gt;"
                    "person-member: TRUE表示获取分配了权限的组织单元下的人员成员,FALSE表示只获取到分配了权限的组织单元&lt;br&gt;"
                    "说明: 获取分配了activity权限的组织单元,或者这些组织单元下的所有人员成员,可直接当作执行者返回&lt;br&gt;"
                    "例子: &lt;br&gt;getOrgUnitHasActivityInterAgency('dept-code1', 'tartActivity', TRUE)")
         }
    ]
}
