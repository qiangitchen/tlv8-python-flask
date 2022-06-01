# _*_ coding: utf-8 _*_

from app import db
from app.models import SAOrganization

"""
组织机构操作公共方法
"""


# 判断是否可以移动到指定的组织（规则：机构不能移动到部门及以下的组织，部门不能移动到岗位及以下的组织等）
def can_move_to(from_org, to_org):
    if to_org.sorgkindid == 'psm':  # 任何类型的组织都不能移动到人员下
        return False, '任何类型的组织都不能移动到人员下'
    if from_org.sorgkindid == 'ogn':
        if to_org.sorgkindid != 'ogn':
            return False, '机构不能移动到部门及以下的组织'
    if from_org.sorgkindid == 'dpt':
        if to_org.sorgkindid == 'pos' or to_org.sorgkindid == 'psm':
            return False, '部门不能移动到岗位及以下的组织'
    if from_org.sorgkindid == 'pos':
        if to_org.sorgkindid == 'pos' or to_org.sorgkindid == 'psm':
            return False, '岗位不能移动到岗位及一下的组织'
    return True, ''


# 更新下属组织的路径
def up_child_org_path(org):
    child = SAOrganization.query.filter_by(sparent=org.sid).all()
    if len(child) < 1:
        return
    for o in child:
        o.sfid = org.sfid + '/' + o.sid + '.' + o.sorgkindid
        o.sfcode = org.sfcode + '/' + o.scode
        o.sfname = org.sfname + '/' + o.sname
        db.session.add(o)
        db.session.commit()
        up_child_org_path(o)