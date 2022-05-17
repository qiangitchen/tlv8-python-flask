# _*_ coding: utf-8 _*_
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, FileField, TextAreaField
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
