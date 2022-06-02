# _*_ codding:utf-8 _*_

from app import create_app
from flask import render_template, session
from datetime import timedelta
from gevent import pywsgi

app = create_app('production')


@app.errorhandler(404)
def page_not_found(error):
    """
    404
    """
    return render_template("404/404.html"), 404


@app.before_request
def before_request():
    session.permanent = True
    app.permanent_session_lifetime = timedelta(minutes=12 * 60)  # session超时 12小时


# 正式环境使用
if __name__ == '__main__':
    try:
        host = "127.0.0.1"  # 正式环境需要使用服务器真实IP
        port = 5000  # 服务端口号
        server = pywsgi.WSGIServer((host, port), app)
        server.serve_forever()
    except Exception as e:
        print("启动失败：", e)
