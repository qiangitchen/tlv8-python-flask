# _*_ coding:utf-8 _*_

from flask import Blueprint

home = Blueprint("home", __name__)

import app.home.views
