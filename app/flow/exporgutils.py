# _*_ coding:utf-8 _*_

from app.common.persons import get_curr_person_info

"""
组织函数-获取当前登录人相关信息
"""


# 获取当前人员ID
def getCurrentPersonID():
    person = get_curr_person_info()
    return person['personid']


# 获取当前人员Code
def getCurrentPersonCode():
    person = get_curr_person_info()
    return person['personcode']


# 获取当前人员Name
def getCurrentPersonName():
    person = get_curr_person_info()
    return person['personName']


# 获取当前人员FID
def getCurrentPersonFID():
    person = get_curr_person_info()
    return person['personfid']


# 获取当前人员FCode
def getCurrentPersonFCode():
    person = get_curr_person_info()
    return person['personfcode']


# 获取当前人员Name
def getCurrentPersonFName():
    person = get_curr_person_info()
    return person['personfname']


# 获取当前人岗位ID
def getCurrentPosID():
    person = get_curr_person_info()
    return person['positionid']


# 获取当前人岗位Code
def getCurrentPosCode():
    person = get_curr_person_info()
    return person['positioncode']


# 获取当前人岗位Name
def getCurrentPosName():
    person = get_curr_person_info()
    return person['positionname']


# 获取当前人部门ID
def getCurrentDeptID():
    person = get_curr_person_info()
    return person['deptid']


# 获取当前人部门Code
def getCurrentDeptCode():
    person = get_curr_person_info()
    return person['deptcode']


# 获取当前人部门Name
def getCurrentDeptName():
    person = get_curr_person_info()
    return person['deptname']


# 获取当前人机构ID
def getCurrentOgnID():
    person = get_curr_person_info()
    return person['ognid']


# 获取当前人机构Code
def getCurrentOgnCode():
    person = get_curr_person_info()
    return person['ogncode']


# 获取当前人机构Name
def getCurrentOgnName():
    person = get_curr_person_info()
    return person['ognname']


# 获取当前人组织ID
def getCurrentOrgID():
    person = get_curr_person_info()
    return person['orgid']


# 获取当前人组织Code
def getCurrentOrgCode():
    person = get_curr_person_info()
    return person['orgcode']


# 获取当前人组织Name
def getCurrentOrgName():
    person = get_curr_person_info()
    return person['orgname']


# 获取当前人组织FID
def getCurrentOrgFID():
    person = get_curr_person_info()
    return person['orgfid']


# 获取当前人组织FCode
def getCurrentOrgFCode():
    person = get_curr_person_info()
    return person['orgfcode']


# 获取当前人组织Name
def getCurrentOrgFName():
    person = get_curr_person_info()
    return person['orgfname']
