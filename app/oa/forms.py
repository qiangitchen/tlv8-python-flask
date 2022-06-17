# _*_ coding: utf-8 _*_

from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, TextAreaField, SelectField


# 个人日报表单
class PersonDayReportForm(FlaskForm):
    fid = StringField(
        render_kw={
            "style": "display:none"
        }
    )

    version = StringField(
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


# 工作日志表单
class WorkLogForm(FlaskForm):
    fid = StringField(
        render_kw={
            "style": "display:none"
        }
    )

    version = StringField(
        render_kw={
            "style": "display:none"
        }
    )

    fcode = StringField(
        label="编号",
        render_kw={
            "class": "layui-input",
            "readonly": "readonly",
            "placeholder": "自动生成"
        }
    )

    fcustomer = StringField(
        label="客户",
        render_kw={
            "class": "layui-input",
            "placeholder": "请输入客户名称"
        }
    )

    fname = StringField(
        label="标题",
        render_kw={
            "class": "layui-input",
            "lay-verify": "required",
            "placeholder": "请输入标题"
        }
    )

    flimittime = StringField(
        label="限制时间",
        render_kw={
            "class": "layui-input Wdate",
            "autocomplete": "off",
            "placeholder": "请选择时间",
            "onclick": "WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})"
        }
    )

    fimportance = SelectField(
        description="重要性",
        choices=["", "最高", "高", "中", "低"]
    )

    femergency = SelectField(
        description="紧迫度",
        choices=["", "紧急", "急迫", "一般", "较低"]
    )

    fplan = StringField(
        label="计划",
        render_kw={
            "class": "layui-input"
        }
    )

    fproject = StringField(
        label="项目",
        render_kw={
            "class": "layui-input",
            "placeholder": "请输入项目名称"
        }
    )

    fcontext = TextAreaField(
        description="内容",
        render_kw={
            "lay-verify": "required",
            "class": "layui-textarea",
            "placeholder": "请输入内容",
            "style": "height:300px"
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


# 我的群组表单
class MyGroupForm(FlaskForm):
    fid = StringField(
        render_kw={
            "style": "display:none"
        }
    )

    version = StringField(
        render_kw={
            "style": "display:none"
        }
    )

    fcode = StringField(
        label="编号",
        render_kw={
            "class": "layui-input",
            "readonly": "readonly",
            "placeholder": "自动生成"
        }
    )

    fname = StringField(
        label="标题",
        render_kw={
            "class": "layui-input",
            "lay-verify": "required",
            "placeholder": "请输入标题"
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
