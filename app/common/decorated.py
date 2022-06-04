# _*_ coding: utf-8 _*_

from flask import session, redirect, url_for, request, abort
from functools import wraps
from app.common.persons import get_permission_list
from app.menus.menuutils import is_have_author_url


# 登录装饰器(验证是否已登录和是否有权限访问)
def user_login(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "user_id" not in session:  # 未登录则跳转登录页
            return redirect(url_for("home.login"))
        else:
            if 'permission' in session:
                per = session['permission']
            else:
                per = get_permission_list(session['user_id'])
                session['permission'] = per
            if not is_have_author_url(per, request.path):
                abort(403)  # 返回没有访问权限的错误
        return f(*args, **kwargs)

    return decorated_function
