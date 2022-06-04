# _*_ coding:utf-8 _*_

from flask import Blueprint

flow = Blueprint("flow", __name__)

import app.flow.views

"""
流程引擎模块
"""
