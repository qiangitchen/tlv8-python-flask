# _*_ coding: utf-8 _*_
import hashlib
from datetime import date


# md5加密
def md5_code(s):
    # sha1 才会与java和php的结果一样
    return hashlib.sha1(s.encode('utf-8')).hexdigest().upper()


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
