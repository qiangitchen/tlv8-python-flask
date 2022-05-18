# _*_ coding: utf-8 _*_

import socket
import hashlib
import os
from flask import url_for
from datetime import date, datetime
from urllib.parse import unquote, unquote_to_bytes


# md5加密
def md5_code(s):
    return str(hashlib.md5(s.encode('utf-8')).hexdigest()).upper()


# 生成32随机主键
def guid():
    curr_time = str(datetime.now())
    rm = str(os.urandom(16))
    mid = curr_time + rm
    return md5_code(mid)


# url参数解码：utf-8
def url_decode(s):
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
