# _*_ coding: utf-8 _*_

from . import home
from flask import render_template, url_for, redirect, session, send_file
from app.common.captcha import generate_captcha
from app.menus.menuutils import get_function_menu
from app.common.persons import get_permission_list
from app.sa.views import user_login
from datetime import datetime
import json


# 项目首页
@home.route("/")
@user_login
def index():
    if "user_id" not in session:
        return redirect(url_for("home.login"))
    return redirect(url_for("home.index_page"))


@home.route("/captchaimage")
def captchaimage():
    text, img_io = generate_captcha()
    session['code'] = text
    img_io.seek(0)
    return send_file(img_io, mimetype='image/png', cache_timeout=0)


# 登录页面
@home.route("/login")
def login():
    return render_template("login.html")


# 系统首页
@home.route("/index")
def index_page():
    return render_template("index.html")


# 加载菜单
@home.route("/portal/initMenu")
def init_menu():
    rdata = dict()
    head = dict()
    head['title'] = "首页"
    head['href'] = "/home/console"
    rdata['homeInfo'] = head
    logos = dict()
    logos['title'] = "TLv8 平台"
    logos['image'] = url_for("static", filename="portal/images/logo.png")
    logos['href'] = ""
    rdata['logoInfo'] = logos
    person_id = session['user_id']
    permission = get_permission_list(person_id)  # 获取当前用户的权限列表
    rdata['menuInfo'] = get_function_menu(permission)  # 根据权限获取功能菜单
    return json.dumps(rdata, ensure_ascii=False)


# 首页控制台
@home.route("/home/console")
def home_console():
    return render_template("home/console.html")


# 获取当前日期
@home.route("/getSystemDate", methods=["GET", "POST"])
def get_system_date():
    rdata = dict()
    rdata['sysdate'] = datetime.now().strftime("%Y-%m-%d")
    return json.dumps(rdata, ensure_ascii=False)


# 获取当前时间
@home.route("/getSystemDateTime", methods=["GET", "POST"])
def get_system_date_time():
    rdata = dict()
    rdata['sysdate'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return json.dumps(rdata, ensure_ascii=False)
