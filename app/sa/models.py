# _*_ Coding:utf-8 _*_

from app import db
from app.common.pubstatic import guid
from datetime import datetime


# 组织机构信息
class SAOrganization(db.Model):
    __tablename__ = "sa_oporg"
    __table_args__ = {"useexisting": True}
    sid = db.Column(db.String(100), primary_key=True, default=guid)  # 主键
    sname = db.Column(db.String(128))  # 名称
    scode = db.Column(db.String(64))  # 编号
    slongname = db.Column(db.String(255))  # 全称
    sfname = db.Column(db.String(2048))  # 路径（全）名
    sfcode = db.Column(db.String(2048))  # 路径（全）编号
    sfid = db.Column(db.String(2048))  # 路径（全）ID
    sorgkindid = db.Column(db.String(5), index=True)  # 组织类型（ogn:机构，dpt:部门， pos:岗位, psm:人员）
    svalidstate = db.Column(db.Integer)  # 状态（0：禁用，1：正常，-1：删除）
    sparent = db.Column(db.String(100), index=True)  # 父级id
    slevel = db.Column(db.Integer)  # 层级
    sphone = db.Column(db.String(64))  # 电话
    sfax = db.Column(db.String(64))  # 传真
    saddress = db.Column(db.String(255))  # 地址
    szip = db.Column(db.String(16))  # 邮编
    sdescription = db.Column(db.String(1024))  # 描述
    spersonid = db.Column(db.String(32), index=True)  # 人员id （sorgkindid为psm时有值）
    snodekind = db.Column(db.String(32))  # 节点类型
    sshowname = db.Column(db.String(100))  # 展示名称
    ssequence = db.Column(db.Integer)  # 排序序号
    version = db.Column(db.Integer, nullable=False, default=0)  # 版本号


# 人员信息
class SAPerson(db.Model):
    __tablename__ = "sa_opperson"
    __table_args__ = {"useexisting": True}
    sid = db.Column(db.String(32), primary_key=True, default=guid)  # 主键
    sname = db.Column(db.String(64))  # 名称
    scode = db.Column(db.String(64), unique=True)  # 编号
    sloginname = db.Column(db.String(64))  # 登录名（默认用scode）-可用于中文登录，不能重复
    spassword = db.Column(db.String(64))  # 密码
    ssequence = db.Column(db.Integer)  # 排序序号
    svalidstate = db.Column(db.Integer)  # 状态（0：禁用，1：正常，-1：删除）
    smainorgid = db.Column(db.String(64), nullable=False)  # 所属机构
    sdescription = db.Column(db.String(2048))  # 描述
    ssex = db.Column(db.String(10))  # 性别
    sbirthday = db.Column(db.Date)  # 生日
    fcasn = db.Column(db.String(100))  # CA编号
    fsignm = db.Column(db.String(100))  # 签名
    version = db.Column(db.Integer, nullable=False, default=0)  # 版本号


# 系统日志
class SALogs(db.Model):
    __tablename__ = "sa_log"
    __table_args__ = {"useexisting": True}
    sid = db.Column(db.String(32), primary_key=True, default=guid)  # 主键
    sdescription = db.Column(db.Text)  # 描述
    sprocessname = db.Column(db.String(2048))  # 功能模块名称
    sactivityname = db.Column(db.String(1024))  # 功能名称
    screatorpersonname = db.Column(db.String(255))  # 操作者
    screatorpersonid = db.Column(db.String(36))  # 操作者ID
    screatorfid = db.Column(db.String(2048))  # 操作者全ID
    screatorfname = db.Column(db.String(2048))  # 操作者全名称
    sactionname = db.Column(db.String(2048))  # 操作
    stypename = db.Column(db.String(100))  # 操作类型
    sip = db.Column(db.String(64))  # 操作者IP
    screatetime = db.Column(db.DateTime, default=datetime.now)  # 操作时间
    version = db.Column(db.Integer, nullable=False, default=0)  # 版本号
