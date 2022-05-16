# _*_ coding:utf-8 _*_

from flask import Blueprint

system = Blueprint("system", __name__)

import app.system.views
