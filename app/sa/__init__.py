# _*_ coding:utf-8 _*_

from flask import Blueprint

system = Blueprint("sa", __name__)

import app.sa.views

"""
系统管理模块
"""
