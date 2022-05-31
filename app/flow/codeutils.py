# _*_ coding: utf-8 _*_

"""
字符转义
"""


def encodeSpechars(str1):
    str1 = str1.replace("<", "#lt;");
    str1 = str1.replace(">", "#gt;");
    str1 = str1.replace("&nbsp;", "#160;");
    str1 = str1.replace("'", "#apos;");
    return str1;


def decodeSpechars(str2):
    str2 = str2.replace("&lt;", "<");
    str2 = str2.replace("&gt;", ">");
    str2 = str2.replace("#lt;", "<");
    str2 = str2.replace("#gt;", ">");
    str2 = str2.replace("#quot;", "\"");
    str2 = str2.replace("#160;", "&nbsp;");
    str2 = str2.replace("#amp;", "&");
    return str2;
