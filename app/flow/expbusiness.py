# _*_ coding:utf-8 _*_

from app import db

"""
业务功能
"""


# 获取数据库字段值
def getRelationValueString(concept, individual, condition, orderRelation, returnRelation):
    try:
        sql = ("select " + returnRelation + " from " + concept + +" where " + condition + "='" + individual + "'")
        if orderRelation and orderRelation != "":
            sql += " order by " + orderRelation
        rs = db.session.execute(sql).first()
        if rs:
            return rs[returnRelation]
    except Exception as e:
        print(e)
    return ""


# 空值选择
def selectChoice(str1, str2):
    if not str1 or str1 == "":
        return str2
    return str1


# 是否为空
def isNull(values):
    if values and values != "":
        return False
    return True


# 字符串连接
def concat(str1, str2, str3):
    str0 = ""
    if str1:
        str0 += str1
    if str2:
        str0 += str2
    if str3:
        str0 += str3
    return str0


# 字符串转大写
def upper(values):
    if values:
        return values.upper()
    return ""


# 字符串转小写
def lower(values):
    if values:
        return values.lower()
    return ""


# 字符串去空格
def trim(values):
    if values:
        return values.strip(" ")
    return values


# 是否包含
def isContain(str1, str2):
    if str2 in str1:
        return True
    return False
