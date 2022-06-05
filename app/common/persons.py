# _*_ coding: utf-8 _*_

from app import db
from flask import session
from app.models import SAOrganization, SAAuthorize, SAPermission
from sqlalchemy import or_

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


# 获取用户的权限列表
def get_permission_list(psm_id):
    per = list()
    org = SAOrganization.query.filter_by(spersonid=psm_id).first()
    if org:
        # 授权给自己角色
        author = SAAuthorize.query.filter_by(sorgid=org.sid).all()
        for au in author:
            permission = SAPermission.query.filter_by(spermissionroleid=au.sauthorizeroleid, spermissionkind=0).all()
            for p in permission:
                pp = dict()
                pp['sid'] = p.sid
                pp['spermissionroleid'] = p.spermissionroleid
                pp['sprocess'] = p.sprocess
                pp['sactivity'] = p.sactivity
                pp['sdescription'] = p.sdescription
                pp['sactivityfname'] = p.sactivityfname
                per.append(pp)
        # 授权给父级角色
        parent_author = db.session.execute("select * from sa_opauthorize where :orgfid_ like concat(sorgfid,'%')",
                                           {'orgfid_': org.sfid})
        for aus in parent_author:
            permission = SAPermission.query.filter_by(spermissionroleid=aus.sauthorizeroleid, spermissionkind=0).all()
            for p in permission:
                pp = dict()
                pp['sid'] = p.sid
                pp['spermissionroleid'] = p.spermissionroleid
                pp['sprocess'] = p.sprocess
                pp['sactivity'] = p.sactivity
                pp['sdescription'] = p.sdescription
                pp['sactivityfname'] = p.sactivityfname
                per.append(pp)
    return per


# 获取指定id或fid的组织下的人员列表
def get_person_list_by_org(orgidss):
    relist = list()
    orgids = orgidss.split(",")
    for orgid in orgids:
        orgs = SAOrganization.query.filter(
            or_(SAOrganization.sid == orgid, SAOrganization.sfid == orgid)).all()
        for org in orgs:
            pmo = SAOrganization.query.filter(SAOrganization.sfid.ilike(org.sfid + '%'),
                                              SAOrganization.sorgkindid == 'psm').all()
            for pm in pmo:
                p = get_person_info(pm.spersonid)
                relist.append(p)
    return relist
