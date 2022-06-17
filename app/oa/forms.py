# _*_ coding: utf-8 _*_

from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, TextAreaField


# 个人日报表单
class PersonDayReportForm(FlaskForm):
    fid = StringField(
        render_kw={
            "style": "display:none"
        }
    )

    ftitle = StringField(
        label="标题",
        render_kw={
            "class": "layui-input",
            "lay-verify": "required",
            "placeholder": "请输入标题"
        }
    )

    fcontext = TextAreaField(
        description="内容",
        render_kw={
            "lay-verify": "required",
            "class": "layui-textarea",
            "placeholder": "请输入内容",
            "style": "height:150px"
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
