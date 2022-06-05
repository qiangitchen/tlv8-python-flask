# _*_ coding: utf-8 _*_

import app.menus.functiontree
from . import oa
from flask import request, render_template, url_for, redirect, session, send_file
from app import db
from functools import wraps
from app.common.decorated import user_login
import json


# 请假申请-流程
@oa.route("/leave/<activity>", methods=["GET", "POST"])
@user_login
def oa_leave(activity=None):
    process = request.args.get('process')
    return render_template("oa/leave/mainActivity.html", process=process, activity=activity)
