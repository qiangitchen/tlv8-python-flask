# _*_ coding: utf-8 _*_

from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, RadioField, TextAreaField, SelectField, FileField
from wtforms.validators import DataRequired, Email, Regexp, EqualTo, ValidationError


class LoginForm(FlaskForm):
    """
    登录功能
    """
    username = StringField(
        validators=[
            DataRequired("用户名不能为空！")
        ],
        description="用户名",
        render_kw={
            "class": "layui-input",
            "lay-verify": "required",
            "type": "text",
            "placeholder": "请输入用户名！",
        }
    )
    password = PasswordField(

        validators=[
            DataRequired("密码不能为空！")
        ],
        description="密码",
        render_kw={
            "class": "layui-input",
            "lay-verify": "required",
            "type": "password",
            "placeholder": "请输入密码！",
        }
    )
    captcha = StringField(
        validators=[
            DataRequired("验证码不能为空！")
        ],
        description="验证码",
        render_kw={
            "class": "layui-input",
            "lay-verify": "required",
            "type": "text",
            "placeholder": "请输入验证码！",
        }
    )
    submit = SubmitField(
        '登录',
        render_kw={
            "class": "layui-btn",
            "lay-submit": "",
            "lay-filter": "login"
        }
    )


class OrgForm(FlaskForm):
    """
    机构表单
    """
    sid = StringField(
        render_kw={
            "style": "display:none",
        }
    )
    sparent = StringField(
        render_kw={
            "style": "display:none",
        }
    )
    scode = StringField(
        validators=[
            DataRequired("编号不能为空！")
        ],
        description="编号",
        render_kw={
            "class": "layui-input",
            "lay-verify": "required",
            "type": "text",
            "placeholder": "请输入编号！",
        }
    )
    sname = StringField(
        validators=[
            DataRequired("名称不能为空！")
        ],
        description="名称",
        render_kw={
            "class": "layui-input",
            "lay-verify": "required",
            "type": "text",
            "placeholder": "请输入名称！",
        }
    )
    sorgkindid = SelectField(
        validators=[
            DataRequired("请选择类型！")
        ],
        description="类型",
        choices=[('ogn', "机构"), ('dpt', "部门"), ('pos', "岗位")],
        default='ogn'
    )
    slevel = StringField(
        description="层级",
        render_kw={
            "class": "layui-input",
            "type": "number"
        },
        default=0
    )
    ssequence = StringField(
        description="序号",
        render_kw={
            "class": "layui-input",
            "type": "number"
        },
        default=1
    )
    sphone = StringField(
        description="电话",
        render_kw={
            "class": "layui-input",
            "type": "text"
        }
    )
    sfax = StringField(
        description="传真",
        render_kw={
            "class": "layui-input",
            "type": "text"
        }
    )
    saddress = StringField(
        description="地址",
        render_kw={
            "class": "layui-input",
            "type": "text"
        }
    )
    sdescription = TextAreaField(
        description="描述",
        render_kw={
            "class": "layui-textarea",
            "style": "min-height:80px;"
        }
    )
    submit = SubmitField(
        '提交保存',
        render_kw={
            "class": "layui-btn",
            "lay-submit": "",
            "lay-filter": "mainform"
        }
    )


# 人员表单
class PersonForm(FlaskForm):
    sid = StringField(
        render_kw={
            "style": "display:none",
        }
    )
    smainorgid = StringField(
        render_kw={
            "style": "display:none",
        }
    )
    scode = StringField(
        validators=[
            DataRequired("编号不能为空！")
        ],
        description="编号",
        render_kw={
            "class": "layui-input",
            "lay-verify": "required",
            "type": "text",
            "placeholder": "请输入编号！",
        }
    )
    sname = StringField(
        validators=[
            DataRequired("名称不能为空！")
        ],
        description="名称",
        render_kw={
            "class": "layui-input",
            "lay-verify": "required",
            "type": "text",
            "placeholder": "请输入名称！",
        }
    )
    sloginname = StringField(
        description="登录名",
        render_kw={
            "class": "layui-input",
            "type": "text"
        }
    )
    ssex = SelectField(
        label="性别",
        choices=[('', '请选择'), ('男', '男'), ('女', '女')]
    )
    sbirthday = StringField(
        description="生日",
        render_kw={
            "class": "layui-input Wdate",
            "type": "text",
            "onClick": "WdatePicker({dateFmt:'yyyy-MM-dd'})"
        }
    )
    smobilephone = StringField(
        description="手机号",
        render_kw={
            "class": "layui-input",
            "type": "text"
        }
    )
    smail = StringField(
        description="邮箱",
        render_kw={
            "class": "layui-input",
            "type": "text"
        }
    )
    scasn = StringField(
        description="CA编号",
        render_kw={
            "class": "layui-input",
            "type": "text"
        }
    )
    sdescription = TextAreaField(
        description="描述",
        render_kw={
            "class": "layui-textarea",
            "style": "min-height:40px;"
        }
    )
    submit = SubmitField(
        '提交保存',
        render_kw={
            "class": "layui-btn",
            "lay-submit": "",
            "lay-filter": "mainform"
        }
    )


# 角色表单
class RoleForm(FlaskForm):
    sid = StringField(
        render_kw={
            "style": "display:none",
        }
    )
    scode = StringField(
        validators=[
            DataRequired("编号不能为空！")
        ],
        description="编号",
        render_kw={
            "class": "layui-input",
            "lay-verify": "required",
            "type": "text",
            "placeholder": "请输入编号！",
        }
    )
    sname = StringField(
        validators=[
            DataRequired("名称不能为空！")
        ],
        description="名称",
        render_kw={
            "class": "layui-input",
            "lay-verify": "required",
            "type": "text",
            "placeholder": "请输入名称！",
        }
    )
    srolekind = SelectField(
        label="角色分类",
        choices=['业务功能', '流程权限', '系统管理']
    )
    sdescription = TextAreaField(
        description="描述",
        render_kw={
            "class": "layui-textarea",
            "style": "min-height:40px;"
        }
    )
    submit = SubmitField(
        '提交保存',
        render_kw={
            "class": "layui-btn",
            "lay-submit": "",
            "lay-filter": "mainform"
        }
    )


# 修改密码表单
class ChangePassForm(FlaskForm):
    old_pass = PasswordField(
        render_kw={
            "class": "layui-input",
            "lay-verify": "required",
            "type": "password",
            "autocomplete": "off",
            "placeholder": "请输入原密码！",
        }
    )

    new_pass = PasswordField(
        render_kw={
            "class": "layui-input",
            "lay-verify": "required",
            "type": "password",
            "autocomplete": "off",
            "placeholder": "请输入新密码！",
        }
    )

    new_pass_ord = PasswordField(
        render_kw={
            "class": "layui-input",
            "lay-verify": "required",
            "type": "password",
            "autocomplete": "off",
            "placeholder": "请再次输入新密码！",
        }
    )

    submit = SubmitField(
        '确认修改',
        render_kw={
            "class": "layui-btn",
            "lay-submit": "",
            "lay-filter": "dataform"
        }
    )


# 文档目录表单
class DocNodeForm(FlaskForm):
    sdocname = StringField(
        render_kw={
            "class": "layui-input",
            "lay-verify": "required",
            "placeholder": "请输入名称",
        }
    )

    sdescription = TextAreaField(
        description="描述",
        render_kw={
            "class": "layui-textarea"
        }
    )

    sparentid = StringField(
        render_kw={
            "style": "display:none"
        }
    )

    skind = StringField(
        render_kw={
            "style": "display:none"
        }
    )

    screatorid = StringField(
        render_kw={
            "style": "display:none"
        }
    )

    screatorname = StringField(
        render_kw={
            "style": "display:none"
        }
    )

    submit = SubmitField(
        '提交保存',
        render_kw={
            "class": "layui-btn",
            "lay-submit": "",
            "lay-filter": "mainform"
        }
    )


# 文件上传表单
class UpLoadForm(FlaskForm):
    file = FileField(
        label="文件",
        description="文件",
    )


# 日程安排表单
class ScheduleForm(FlaskForm):
    scaption = StringField(
        label="标题",
        render_kw={
            "class": "layui-input",
            "lay-verify": "required",
            "placeholder": "请输入标题",
        }
    )

    spriority = SelectField(
        description="优先级别",
        choices=[(0, "普通"), (1, "不重要/不紧急"), (2, "不重要/紧急"), (3, '重要/不紧急'), (4, '重要/紧急')],
        default=0
    )

    sstatus = SelectField(
        description="状态",
        choices=["未开始", "进行中", "已完成"],
        default="未开始"
    )

    sstartdate = StringField(
        label="开始时间",
        render_kw={
            "class": "layui-input Wdate",
            "autocomplete": "off",
            "lay-verify": "required",
            "placeholder": "请选择时间",
            "onclick": "WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})",
            "onblur": "setTextdata()"
        }
    )

    senddate = StringField(
        label="结束时间",
        render_kw={
            "class": "layui-input Wdate",
            "autocomplete": "off",
            "placeholder": "请选择时间",
            "onclick": "WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})",
            "onblur": "setTextdata()"
        }
    )

    scontent = TextAreaField(
        description="事务内容",
        render_kw={
            "class": "layui-textarea",
            "style": "min-height:90px;"
        }
    )

    swhouser = StringField(
        description="所属用户",
        render_kw={
            "style": "display:none"
        }
    )

    saffairstype = StringField(
        description="事务类型",
        render_kw={
            "style": "display:none"
        }
    )

    sstartdate_axis = StringField(
        description="开始时间轴",
        render_kw={
            "style": "display:none"
        }
    )

    ssenddate_axis = StringField(
        description="结束时间轴",
        render_kw={
            "style": "display:none"
        }
    )

    submit = SubmitField(
        '提交保存',
        render_kw={
            "class": "layui-btn",
            "lay-submit": "",
            "lay-filter": "mainform"
        }
    )


# 个人文件柜目录表单
class PersonalDocForm(FlaskForm):
    sid = StringField(
        render_kw={
            "style": "display:none"
        }
    )

    sparentname = StringField(
        label="名称",
        render_kw={
            "class": "layui-input",
            "lay-verify": "required",
            "placeholder": "请输入名称",
        }
    )

    sdescription = TextAreaField(
        description="描述",
        render_kw={
            "class": "layui-textarea",
            "style": "min-height:90px;"
        }
    )

    sparentid = StringField(
        render_kw={
            "style": "display:none"
        }
    )

    submit = SubmitField(
        '提交保存',
        render_kw={
            "class": "layui-btn",
            "lay-submit": "",
            "lay-filter": "mainform"
        }
    )
