# _*_ coding:utf-8 _*_

from flask import Blueprint

oa = Blueprint("oa", __name__)

import app.oa.views

"""
业务模块-以OA为例
"""
