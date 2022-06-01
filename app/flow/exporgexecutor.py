# _*_ coding:utf-8 _*_

from app import db
from app.sa.models import SAOrganization
from app.flow.exporgutils import getCurrentOgnID

"""
组织机构执行者函数
"""


# 获取指定activity权限的组织单元
def get_org_unit_has_activity(process, activity, inOrg, personMember):
    org = SAOrganization.query.filter_by(sid=getCurrentOgnID()).first()
    ognfid = org.sfid
    sql = ("select SORGID from sa_opauthorize a inner join sa_oppermission m "
           " on m.SPERMISSIONROLEID = a.SAUTHORIZEROLEID where m.SPROCESS = '" + process + "' and SACTIVITY = '" + activity + "'")
    if personMember == True:
        sql += " and (SORGID like '%@%')"

    if inOrg and "" != inOrg and isinstance(inOrg, str):
        sql = ("select o.SID SORGID from sa_oporg o "
               "where o.SFID like '" + ognfid + "%' and o.SFID like '%" + str(inOrg) + "%'  and o.SID in (" + sql + ")")
    elif isinstance(inOrg, bool):  # 为false或true时为当前机构下
        sql = ("select o.SID SORGID from sa_oporg o "
               "where  o.SFID like '" + ognfid + "%' " + " and o.SID in(" + sql + ")")

    rs = db.session.execute(sql)
    orgs = list()
    for o in rs:
        orgs.append(o.SORGID)
    return ','.join(orgs)


# 获取指定activity权限的组织单元(跨单位)
def get_org_unit_has_activity_inter_agency(process, activity, personMember):
    sql = ("select SORGID from sa_opauthorize a inner join sa_oppermission m "
           " on m.SPERMISSIONROLEID = a.SAUTHORIZEROLEID where m.SPROCESS = '" + process + "' and SACTIVITY = '" + activity + "'")

    if personMember == True:
        sql += " and (SORGID like '%@%')"

    rs = db.session.execute(sql)
    orgs = list()
    for o in rs:
        orgs.append(o.SORGID)
    return ','.join(orgs)


# 获取指定组织单元的管理者
def get_org_unit_manager(org, manageType, cludeParent, inOrg, personMember):
    sql = "select SORGFID from SA_OPMANAGEMENT where 1=1"

    if cludeParent:
        sql += " and (SMANAGEORGID='" + org + "' or '" + org + "' like concat(SMANAGEORGFID,'%'))"
    else:
        sql += " and (SMANAGEORGID='" + org + "' or SMANAGEORGFID='" + org + "') "

    if manageType and manageType != "":
        sql += " and SMANAGETYPEID in (select SID from SA_OPMANAGETYPE where SCODE = '" + manageType + "') "

    # if personMember == True:
    #     sql += " and (SORGFID like '%@%')"

    rs = db.session.execute(sql)
    orgs = list()
    for o in rs:
        orgs.append(o.SORGFID)
    return ','.join(orgs)


# 获取属于指定角色的组织单元
def get_org_unit_has_role_by_code(roleCode, inOrg, personMember):
    org = SAOrganization.query.filter_by(sid=getCurrentOgnID()).first()
    if isinstance(inOrg, bool):
        inOrg = org.sfid
    sql = ("select o.SID as SORGID from sa_oporg o where o.SFID like '%" + inOrg
           + "%' and EXISTS(select a.SORGID from SA_OPAUTHORIZE a where a.SAUTHORIZEROLEID "
           + " in (select r.SID from SA_OPROLE r where r.SCODE='" + roleCode
           + "') and o.SFID like concat(a.SORGFID,'%'))")
    rs = db.session.execute(sql)
    orgs = list()
    orgs0 = list()
    for o in rs:
        orgs.append("'" + o.SORGID + "'")
        orgs0.append(o.SORGID)
    orgUnit = ','.join(orgs)
    if personMember:
        sql1 = ("select SID from sa_oporg o where o.sfid like '" + org.sfid + "%' EXISTS(select SFID from sa_oporg "
                + " o1 where SID in (" + orgUnit
                + ") and o.SFID like concat(o1.SFID,'%')) and SORGKINDID = 'psm'")
        rs1 = db.session.execute(sql1)
        orgs1 = list()
        for o in rs1:
            orgs1.append(o.SORGID)
        return ','.join(orgs1)
    else:
        return ','.join(orgs0)


# 获取属于指定角色的组织单元(跨单位)
def get_org_unit_has_role_by_code_inter_agency(roleCode, personMember):
    sql = ("select SORGID from SA_OPAUTHORIZE where SAUTHORIZEROLEID in "
           "(select SID from SA_OPROLE where SCODE='" + roleCode + "')")
    rs = db.session.execute(sql)
    orgs = list()
    orgs0 = list()
    for o in rs:
        orgs.append("'" + o.SORGID + "'")
        orgs0.append(o.SORGID)
    orgUnit = ','.join(orgs)
    if personMember:
        sql1 = ("select SID from sa_oporg o where o.sfid like '" + org.sfid + "%' EXISTS(select SFID from sa_oporg "
                + " o1 where SID in (" + orgUnit
                + ") and o.SFID like concat(o1.SFID,'%')) and SORGKINDID = 'psm'")
        rs1 = db.session.execute(sql1)
        orgs1 = list()
        for o in rs1:
            orgs1.append(o.SORGID)
        return ','.join(orgs1)
    else:
        return ','.join(orgs0)
