# _*_ coding: utf-8 _*_

import socket
import hashlib
import os
from flask import url_for
from datetime import date, datetime
from urllib.parse import unquote_to_bytes
from sqlalchemy.orm import class_mapper
from sqlalchemy.sql.sqltypes import DateTime, Date


# md5加密
def md5_code(s):
    return str(hashlib.md5(s.encode('utf-8')).hexdigest()).upper()


# 生成32随机主键
def guid():
    curr_time = str(datetime.now())
    rm = str(os.urandom(16))
    mid = curr_time + rm
    return md5_code(mid)


# model转json字典
def serialize(model):
    columns = [c.key for c in class_mapper(model.__class__).columns]
    data = dict()
    for c in columns:
        v = getattr(model, c)
        if type(v) == datetime:  # 日期类型在转json字符时会出错，所以需要提前格式化
            v = datetime.strftime(v, '%Y-%m-%d %H:%M:%S')
        if type(v) == date:
            v = datetime.strftime(v, '%Y-%m-%d')
        data[c] = v
    return data


# url参数解码：utf-8
def url_decode(s):
    if not s:
        return None
    return unquote_to_bytes(s).decode('utf-8')


# 获取本机IP
def get_ip():
    hostname = socket.gethostname()
    ip = socket.gethostbyname(hostname)
    return ip


# 日期增加n年
def add_years(d, years):
    try:
        return d.replace(year=d.year + years)
    except ValueError:
        return d + (date(d.year + years, 1, 1) - date(d.year, 1, 1))


# 将空null转为""
def nul2em(s):
    if not s:
        return ""
    return s


# 掩藏身份证中间的内容
def hide_card_id(s):
    ids = list(s)
    for i in range(6, 14, 1):
        ids[i] = '*'
    return ''.join(ids)


# 获取组织图标
def create_icon(kind):
    if kind == 'ogn' or kind == 'org':
        return url_for('static', filename='common/image/toolbar/org/org.gif')
    if kind == 'dept' or kind == 'dpt':
        return url_for('static', filename='common/image/toolbar/org/dept.gif')
    if kind == 'pos':
        return url_for('static', filename='common/image/toolbar/org/pos.gif')
    if kind == 'psm':
        return url_for('static', filename='common/image/toolbar/org/person.gif')

    return url_for('static', filename='common/image/toolbar/org/folder-open.gif')


# 获取组织类型名称
def get_org_type(kind):
    if kind == 'ogn' or kind == 'org':
        return '机构'
    if kind == 'dept' or kind == 'dpt':
        return '部门'
    if kind == 'pos':
        return '岗位'
    if kind == 'psm':
        return '人员'


# form的值自动赋值给model
def form_set_data_model(form, model):
    columns = class_mapper(model.__class__).columns
    for field in form:
        if field.name in columns:
            if type(columns[field.name].type) == DateTime or type(columns[field.name].type) == Date:
                if field.data and field.data != "":  # 日期类型的字段不能直接给空字符，所以需要判断处理
                    setattr(model, field.name, field.data)
                else:  # 如果是空字符赋值给None
                    setattr(model, field.name, None)
            else:
                setattr(model, field.name, field.data)
    return model
