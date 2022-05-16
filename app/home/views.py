# _*_ coding: utf-8 _*_
from . import home
from flask import render_template, url_for, redirect, session, send_file
from functools import wraps
from app.captcha import generate_captcha


# 登录装饰器
def user_login(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "user_id" not in session:
            return redirect(url_for("home.login"))
        return f(*args, **kwargs)

    return decorated_function


# 项目首页
@home.route("/")
@user_login
def index():
    return redirect(url_for("home.user_list"))


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
