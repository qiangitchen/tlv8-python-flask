# _*_ coding: utf-8 _*_

from app import db
from flask import session
from app.sa.models import SAOrganization

"""
用户信息（全）
"""


# 获取人员信息
def get_person_info(person_id):
    person_info = dict()
    person_info['personid'] = person_id
    org = SAOrganization.query.filter_by(spersonid=person_id).first()
    person_info['personName'] = org.sname
    person_info['username'] = org.scode
    person_info['personcode'] = org.scode
    person_info['userCode'] = org.scode
    person_info['orgFullName'] = org.sfname
    person_info['personfid'] = org.sfid
    person_info['personfcode'] = org.sfcode
    person_info['personfname'] = org.sfname
    posid, poscode, posname = get_org_type(org, '.pos')
    person_info['positionid'] = posid
    person_info['positioncode'] = poscode
    person_info['positionname'] = posname
    dptid, dptcode, dptname = get_org_type(org, '.dpt')
    person_info['deptid'] = dptid
    person_info['deptcode'] = dptcode
    person_info['deptname'] = dptname
    ognid, ogncode, ognname = get_ogn_info(org)
    person_info['ognid'] = ognid
    person_info['ogncode'] = ogncode
    person_info['ognname'] = ognname
    main_org = SAOrganization.query.filter_by(sid=org.sparent).first()
    person_info['orgid'] = main_org.sid
    person_info['orgcode'] = main_org.scode
    person_info['orgname'] = main_org.sname
    person_info['orgfid'] = main_org.sfid
    person_info['orgfcode'] = main_org.sfcode
    person_info['orgfname'] = main_org.sfname
    return person_info


# 获取 岗位、部门信息
def get_org_type(org, d_type):
    sfid = org.sfid
    sfcode = org.sfcode
    sfname = org.sfname
    orgid = ''
    orgcode = ''
    orgname = ''
    if d_type in sfid:
        i = 0
        for ids in sfid.split('/'):
            if d_type in ids:
                orgid = ids.replace(d_type, '')
                orgcode = sfcode.split('/')[i]
                orgname = sfname.split('/')[i]
            i += 1
    return orgid, orgcode, orgname


# 获取机构信息
def get_ogn_info(org):
    sfid = org.sfid
    sfcode = org.sfcode
    sfname = org.sfname
    orgid = ''
    orgcode = ''
    orgname = ''
    d_type = '.ogn'
    if d_type in sfid:
        sfids = sfid.split('/')
        l = len(sfids) - 1
        for i in range(l, -1, -1):
            ids = sfids[i]
            if d_type in ids:
                orgid = ids.replace(d_type, '')
                orgcode = sfcode.split('/')[i]
                orgname = sfname.split('/')[i]
    return orgid, orgcode, orgname


# 获取当前登录人信息
def get_curr_person_info():
    return get_person_info(session['user_id'])
