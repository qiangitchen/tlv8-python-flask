# _*_ Coding:utf-8 _*_

from app import db
from app.common.pubstatic import guid
from datetime import datetime


# 组织机构信息
class SAOrganization(db.Model):
    __tablename__ = "sa_oporg"
    __table_args__ = {"useexisting": True}
    sid = db.Column(db.String(100), primary_key=True, default=guid, doc='主键')
    sname = db.Column(db.String(128), doc='名称')
    scode = db.Column(db.String(64), doc='编号')
    slongname = db.Column(db.String(255), doc='全称')
    sfname = db.Column(db.String(2048), doc='路径（全）名')
    sfcode = db.Column(db.String(2048), doc='路径（全）编号')
    sfid = db.Column(db.String(2048), doc='路径（全）ID')
    sorgkindid = db.Column(db.String(5), index=True, doc='组织类型（ogn:机构，dpt:部门， pos:岗位, psm:人员）')
    svalidstate = db.Column(db.Integer, default=1, doc='状态（0：禁用，1：正常，-1：删除）')
    sparent = db.Column(db.String(100), index=True, doc='父级id')
    slevel = db.Column(db.Integer, default=0, doc='层级')
    sphone = db.Column(db.String(64), doc='电话')
    sfax = db.Column(db.String(64), doc='传真')
    saddress = db.Column(db.String(255), doc='地址')
    szip = db.Column(db.String(16), doc='邮编')
    sdescription = db.Column(db.String(1024), doc='描述')
    spersonid = db.Column(db.String(32), index=True, doc='人员id （sorgkindid为psm时有值）')
    snodekind = db.Column(db.String(32), doc='节点类型(nkLimb:分配的人员)')
    sshowname = db.Column(db.String(100), doc='展示名称')
    ssequence = db.Column(db.Integer, default=1, doc='排序序号')
    version = db.Column(db.Integer, nullable=False, default=0, doc='版本号')


# 人员信息
class SAPerson(db.Model):
    __tablename__ = "sa_opperson"
    __table_args__ = {"useexisting": True}
    sid = db.Column(db.String(32), primary_key=True, default=guid, doc='主键')
    sname = db.Column(db.String(64), doc='名称')
    scode = db.Column(db.String(64), unique=True, doc='编号')
    sloginname = db.Column(db.String(64), doc='登录名（默认用scode）-可用于中文登录，不能重复')
    spassword = db.Column(db.String(64), doc='密码')
    ssequence = db.Column(db.Integer, doc='排序序号')
    svalidstate = db.Column(db.Integer, default=1, doc='状态（0：禁用，1：正常，-1：删除）')
    smainorgid = db.Column(db.String(64), nullable=False, doc='所属机构')
    sdescription = db.Column(db.String(2048), doc='描述')
    ssex = db.Column(db.String(10), doc='性别')
    sbirthday = db.Column(db.String(20), doc='生日')
    smobilephone = db.Column(db.String(20), doc='手机号')
    smail = db.Column(db.String(50), doc='邮箱')
    scasn = db.Column(db.String(100), doc='CA编号')
    ssignm = db.Column(db.String(100), doc='签名')
    version = db.Column(db.Integer, nullable=False, default=0, doc='版本号')


# 角色
class SARole(db.Model):
    __tablename__ = "sa_oprole"
    __table_args__ = {"useexisting": True}
    sid = db.Column(db.String(32), primary_key=True, default=guid, doc='主键')
    sname = db.Column(db.String(128), doc='名称')
    scode = db.Column(db.String(64), doc='编号')
    srolekind = db.Column(db.String(64), doc='角色分类')
    sdescription = db.Column(db.String(2048), doc='描述')
    ssequence = db.Column(db.Integer, doc='排序序号')
    svalidstate = db.Column(db.Integer, default=1, doc='状态（0：禁用，1：正常，-1：删除）')
    version = db.Column(db.Integer, nullable=False, default=0, doc='版本号')


# 角色权限
class SAPermission(db.Model):
    __tablename__ = "sa_oppermission"
    __table_args__ = {"useexisting": True}
    sid = db.Column(db.String(32), primary_key=True, default=guid, doc='主键')
    spermissionroleid = db.Column(db.String(32), nullable=False, index=True, doc='角色ID')
    sprocess = db.Column(db.String(1024), doc='功能模块')
    sactivityfname = db.Column(db.String(1024), doc='功能全名称')
    sactivity = db.Column(db.String(2048), doc='功能标识')
    sactionsnames = db.Column(db.Text, doc='动作名称（多个逗号分割）')
    sactions = db.Column(db.Text, doc='动作（多个逗号分割）')
    spermissionkind = db.Column(db.Integer, nullable=False, default=0, doc='权限类型（0：功能权限、1：动作权限）')
    sdescription = db.Column(db.String(2048), doc='描述')
    ssequence = db.Column(db.Integer, doc='排序序号')
    svalidstate = db.Column(db.Integer, default=1, doc='状态（0：禁用，1：正常，-1：删除）')
    version = db.Column(db.Integer, nullable=False, default=0, doc='版本号')


# 系统日志
class SALogs(db.Model):
    __tablename__ = "sa_log"
    __table_args__ = {"useexisting": True}
    sid = db.Column(db.String(32), primary_key=True, default=guid, doc='主键')
    sdescription = db.Column(db.Text, doc='描述')
    sprocessname = db.Column(db.String(2048), doc='功能模块名称')
    sactivityname = db.Column(db.String(1024), doc='功能名称')
    screatorpersonname = db.Column(db.String(255), doc='操作者')
    screatorpersonid = db.Column(db.String(36), doc='操作者ID')
    screatorfid = db.Column(db.String(2048), doc='操作者全ID')
    screatorfname = db.Column(db.String(2048), doc='操作者全名称')
    sactionname = db.Column(db.String(2048), doc='操作')
    stypename = db.Column(db.String(100), doc='操作类型')
    sip = db.Column(db.String(64), doc='操作者IP')
    screatetime = db.Column(db.DateTime, default=datetime.now, doc='操作时间')
    version = db.Column(db.Integer, nullable=False, default=0, doc='版本号')


# 在线用户
class SAOnlineInfo(db.Model):
    __tablename__ = "sa_onlineinfo"
    __table_args__ = {"useexisting": True}
    sid = db.Column(db.String(32), primary_key=True, default=guid, doc='主键')
    suserid = db.Column(db.String(36), doc='用户id')
    susername = db.Column(db.String(100), doc='用户')
    suserfid = db.Column(db.String(2048), doc='用户全id')
    suserfname = db.Column(db.String(2048), doc='用户全名称')
    sloginip = db.Column(db.String(64), doc='用户IP')
    slogindate = db.Column(db.DateTime, default=datetime.now, doc='登录时间')
    ssessionid = db.Column(db.String(64), unique=True, doc='用户唯一标志')
    sserviceip = db.Column(db.String(64), doc='服务器IP')
    smachinecode = db.Column(db.String(100), index=True, doc='机器码-多台服务器集群时用于区分服务器')
    version = db.Column(db.Integer, nullable=False, default=0, doc='版本号')
