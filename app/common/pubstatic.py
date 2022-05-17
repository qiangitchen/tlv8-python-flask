# _*_ coding: utf-8 _*_
import hashlib
import os
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


def url_decode(s):
    return unquote_to_bytes(s).decode('utf-8')


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
