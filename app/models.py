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
    ssequence = db.Column(db.Integer, default=1, doc='排序序号')
    svalidstate = db.Column(db.Integer, default=1, doc='状态（0：禁用，1：正常，-1：删除）')
    version = db.Column(db.Integer, nullable=False, default=0, doc='版本号')


# 授权信息
class SAAuthorize(db.Model):
    __tablename__ = "sa_opauthorize"
    __table_args__ = {"useexisting": True}
    sid = db.Column(db.String(32), primary_key=True, default=guid, doc='主键')
    sorgid = db.Column(db.String(65), nullable=False, index=True, doc='组织id')
    sorgname = db.Column(db.String(255), doc='组织名称')
    sorgfid = db.Column(db.String(2048), doc='组织fid')
    sorgfname = db.Column(db.String(2048), doc='组织全名称')
    sauthorizeroleid = db.Column(db.String(32), nullable=False, index=True, doc='角色ID')
    sauthorizerolecode = db.Column(db.String(64), index=True, doc='角色编号')
    sdescription = db.Column(db.String(1024), doc='角色名称')
    screatorfid = db.Column(db.String(2048), doc='创建人fid')
    screatorfname = db.Column(db.String(2048), doc='创建人全名称')
    screatetime = db.Column(db.DateTime, default=datetime.now, doc='创建时间')
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


# 流程图
class SAFlowDraw(db.Model):
    __tablename__ = "sa_flowdrawlg"
    __table_args__ = {"useexisting": True}
    sid = db.Column(db.String(32), primary_key=True, default=guid, doc='主键')
    sfolderid = db.Column(db.String(32), index=True, doc='目录ID')
    sprocessid = db.Column(db.String(100), nullable=False, unique=True, doc='流程标识')
    sprocessname = db.Column(db.String(100), doc='流程名称')
    sdrawlg = db.Column(db.Text, doc='流程图')
    sprocessacty = db.Column(db.Text, default='', doc='流程环节')
    screatorid = db.Column(db.String(100), doc='创建人ID')
    screatorname = db.Column(db.String(100), doc='创建人名称')
    supdatorid = db.Column(db.String(100), doc='修改人ID')
    supdatorname = db.Column(db.String(100), doc='修改人名称')
    screatetime = db.Column(db.DateTime, default=datetime.now, doc='创建时间')
    supdatetime = db.Column(db.DateTime, doc='修改时间')
    fenabled = db.Column(db.Integer, default=1, doc='启用状态')
    version = db.Column(db.Integer, nullable=False, default=0, doc='版本号')


# 流程图目录
class SAFlowFolder(db.Model):
    __tablename__ = "sa_flowfolder"
    __table_args__ = {"useexisting": True}
    sid = db.Column(db.String(32), primary_key=True, default=guid, doc='主键')
    scode = db.Column(db.String(100), doc='编号')
    sname = db.Column(db.String(100), doc='名称')
    sparent = db.Column(db.String(32), index=True, doc='父id')
    sidpath = db.Column(db.String(2048), doc='id路径用于搜索定位')
    version = db.Column(db.Integer, nullable=False, default=0, doc='版本号')


# 流程任务数据
class SATask(db.Model):
    __tablename__ = "sa_task"
    __table_args__ = {"useexisting": True}
    sid = db.Column(db.String(32), primary_key=True, default=guid, doc='主键')
    sparentid = db.Column(db.String(32), index=True, doc='父id')
    sname = db.Column(db.String(255), doc='名称')
    sflowid = db.Column(db.String(32), index=True, doc='流程id')
    sprocess = db.Column(db.String(255), doc='流程图标识')
    sactivity = db.Column(db.String(255), index=True, doc='流程环节')
    sstatusid = db.Column(db.String(36), doc='任务状态：')
    sstatusname = db.Column(db.String(100), doc='任务状态：')
    screatetime = db.Column(db.DateTime, default=datetime.now, doc='创建时间')
    slimittime = db.Column(db.DateTime, doc='办理时限')
    scpersonid = db.Column(db.String(36), index=True, doc='提交人id')
    scpersonname = db.Column(db.String(100), doc='提交人')
    scdeptid = db.Column(db.String(32), doc='提交部门id')
    scdeptname = db.Column(db.String(255), doc='提交部门名称')
    scognid = db.Column(db.String(32), doc='提交机构id')
    scognname = db.Column(db.String(255), doc='提交机构名称')
    scfid = db.Column(db.String(1024), doc='提交人fid')
    scfname = db.Column(db.String(1024), doc='提交人fname')
    sexecutetime = db.Column(db.DateTime, doc='处理时间')
    sepersonid = db.Column(db.String(36), index=True, doc='执行人id')
    sepersonname = db.Column(db.String(100), doc='执行人人')
    sedeptid = db.Column(db.String(32), doc='执行人部门id')
    sedeptname = db.Column(db.String(255), doc='执行人部门名称')
    seognid = db.Column(db.String(32), doc='执行人机构id')
    seognname = db.Column(db.String(255), doc='执行人机构名称')
    sefid = db.Column(db.String(1024), doc='执行人fid')
    sefname = db.Column(db.String(1024), doc='执行人fname')
    slock = db.Column(db.String(36), doc='任务锁定的人员id')
    scurl = db.Column(db.String(1024), doc='提交任务的页面')
    seurl = db.Column(db.String(1024), doc='执行任务的页面')
    sdata1 = db.Column(db.String(32), index=True, doc='业务数据主键')
    skindid = db.Column(db.String(32), default='task', doc='任务类型：task-待办，note-通知')
    scontent = db.Column(db.Text, doc='任务内容')
    version = db.Column(db.Integer, nullable=False, default=0, doc='版本号')


# 文档中心
class SADocNode(db.Model):
    __tablename__ = "sa_docnode"
    __table_args__ = {"useexisting": True}
    sid = db.Column(db.String(32), primary_key=True, default=guid, doc='主键')
    sdocname = db.Column(db.String(255), doc='名称')
    sparentid = db.Column(db.String(32), index=True, doc='父id')
    sfileid = db.Column(db.String(128), index=True, doc='文件id')
    ssize = db.Column(db.Float, doc='文件大小B')
    skind = db.Column(db.String(128), index=True, doc='类型：dir（文件夹）,其他：文件的MimeType')
    sdocpath = db.Column(db.String(2048), doc='文件路径')
    sdocdisplaypath = db.Column(db.String(2048), doc='显示文件路径名')
    screatorid = db.Column(db.String(32), doc='创建人id')
    screatorname = db.Column(db.String(128), doc='创建人姓名')
    screatetime = db.Column(db.DateTime, default=datetime.now, doc='创建时间')
    seditorid = db.Column(db.String(32), doc='编辑人id')
    seditorname = db.Column(db.String(128), doc='编辑人姓名')
    slastwritetime = db.Column(db.DateTime, default=datetime.now, doc='最后修改时间')
    sdescription = db.Column(db.Text, doc='描述')
    skeywords = db.Column(db.String(1024), doc='搜索关键字')
    version = db.Column(db.Integer, nullable=False, default=0, doc='版本号')


# 文件存储位置
class SADocPath(db.Model):
    __tablename__ = "sa_docpath"
    __table_args__ = {"useexisting": True}
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, doc='主键')
    filename = db.Column(db.String(255), doc='文件名')
    extname = db.Column(db.String(10), doc='文件扩展名')
    filesize = db.Column(db.Float, doc='文件大小B')
    filetype = db.Column(db.String(128), doc='文件类型')
    filepath = db.Column(db.String(2048), doc='文件路径')
    addtime = db.Column(db.DateTime, default=datetime.now, doc='上传时间')
    updatetime = db.Column(db.DateTime, default=datetime.now, doc='更新时间')


# 日程安排
class SASchedule(db.Model):
    __tablename__ = "sa_psnschedule"
    __table_args__ = {"useexisting": True}
    sid = db.Column(db.String(32), primary_key=True, default=guid, doc='主键')
    scaption = db.Column(db.String(255), doc='标题')
    sstatus = db.Column(db.String(100), index=True, doc='状态')
    spriority = db.Column(db.Integer, default=0, doc='优先级别')
    sstartdate = db.Column(db.DateTime, nullable=False, doc='开始时间')
    senddate = db.Column(db.DateTime, doc='结束时间')
    scontent = db.Column(db.String(2048), doc='事务内容')
    swhouser = db.Column(db.String(36), index=True, doc='所属用户')
    saffairstype = db.Column(db.Integer, doc='事务类型')
    sstartdate_axis = db.Column(db.Integer, doc='开始时间轴')
    ssenddate_axis = db.Column(db.Integer, doc='结束时间轴')
    version = db.Column(db.Integer, nullable=False, default=0, doc='版本号')


# 个人文件柜
class SAPersonalDocNode(db.Model):
    __tablename__ = "sa_personal_docnode"
    __table_args__ = {"useexisting": True}
    sid = db.Column(db.String(32), primary_key=True, default=guid, doc='主键')
    sparentid = db.Column(db.String(32), index=True, doc='父id')
    sparentname = db.Column(db.String(128), doc='名称')
    sdescription = db.Column(db.String(2048), doc='描述')
    spath = db.Column(db.String(1024), doc='路径')
    screatorid = db.Column(db.String(32), index=True, doc='创建人id')
    screatorname = db.Column(db.String(128), doc='创建人')
    screatetime = db.Column(db.DateTime, default=datetime.now, doc='创建时间')
    version = db.Column(db.Integer, nullable=False, default=0, doc='版本号')


# 个人文-列表
class SAPersonalFile(db.Model):
    __tablename__ = "sa_personal_file"
    __table_args__ = {"useexisting": True}
    sid = db.Column(db.String(32), primary_key=True, default=guid, doc='主键')
    smasterid = db.Column(db.String(32), index=True, doc='目录id')
    sfileid = db.Column(db.String(100), doc='文件id')
    sfilename = db.Column(db.String(255), doc='文件名')
    sfilesize = db.Column(db.String(100), doc='文件大小')
    saccessory = db.Column(db.String(1024), doc='文件信息')
    screatorid = db.Column(db.String(32), index=True, doc='创建人id')
    screatorname = db.Column(db.String(128), doc='创建人')
    screatetime = db.Column(db.DateTime, default=datetime.now, doc='创建时间')
    saccesscurrentid = db.Column(db.String(2048), doc='分享的人员id')
    saccesscurrentname = db.Column(db.String(2048), doc='分享的人员姓名')
    version = db.Column(db.Integer, nullable=False, default=0, doc='版本号')


# 常用审批意见
class SAFlowConclusion(db.Model):
    __tablename__ = "sa_flowconclusion"
    __table_args__ = {"useexisting": True}
    sid = db.Column(db.String(32), primary_key=True, default=guid, doc='主键')
    sorder = db.Column(db.Integer, nullable=False, default=0, doc='排序')
    sconclusionname = db.Column(db.String(255), nullable=False, doc='意见')
    screatorid = db.Column(db.String(32), index=True, doc='创建人id')
    screatorname = db.Column(db.String(128), doc='创建人')
    screatetime = db.Column(db.DateTime, default=datetime.now, doc='创建时间')
    version = db.Column(db.Integer, nullable=False, default=0, doc='版本号')


# 审批意见记录
class SAFlowRecord(db.Model):
    __tablename__ = "sa_flowrecord"
    __table_args__ = {"useexisting": True}
    sid = db.Column(db.String(32), primary_key=True, default=guid, doc='主键')
    sbillid = db.Column(db.String(32), index=True, doc='业务id')
    snodeid = db.Column(db.String(255), doc='环节标识')
    snodename = db.Column(db.String(255), doc='环节名称')
    sagreetext = db.Column(db.String(2048), doc='审批意见')
    sopviewid = db.Column(db.String(100), index=True, doc='显示位置的div id')
    staskid = db.Column(db.String(32), index=True, doc='任务id')
    sflowid = db.Column(db.String(32), doc='流程id')
    screatorid = db.Column(db.String(32), index=True, doc='创建人id')
    screatorname = db.Column(db.String(128), doc='审批人姓名')
    ssign = db.Column(db.Text, doc='审批人签名')
    screatetime = db.Column(db.DateTime, default=datetime.now, doc='创建时间')
    version = db.Column(db.Integer, nullable=False, default=0, doc='版本号')


# OA-请假
class OALeave(db.Model):
    __tablename__ = "oa_leave"
    __table_args__ = {"useexisting": True}
    fid = db.Column(db.String(32), primary_key=True, default=guid, doc='主键')
    fcreatorname = db.Column(db.String(255), doc='申请人名称')
    fcreatorid = db.Column(db.String(32), doc='申请人ID')
    fcreatorfid = db.Column(db.String(1024), doc='申请人fID')
    fcreatorfname = db.Column(db.String(1024), doc='申请人全名')
    fcreatedate = db.Column(db.DateTime, default=datetime.now, doc='创建时间')
    fstartdate = db.Column(db.DateTime, doc='开始时间')
    fenddate = db.Column(db.DateTime, doc='结束时间')
    fday = db.Column(db.Integer, default=0, doc='请假天数')
    fleavetype = db.Column(db.String(255), doc='请假类型')
    fstate = db.Column(db.String(50), doc='申请状态')
    freason = db.Column(db.String(512), doc='请假原因')
    fenclosure = db.Column(db.String(1024), doc='附件')
    version = db.Column(db.Integer, nullable=False, default=0, doc='版本号')
