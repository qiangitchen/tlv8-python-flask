# _*_ coding: utf-8 _*_

from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, FileField, TextAreaField, SelectField
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
