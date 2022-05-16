# _*_ Coding:utf-8 _*_

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import config
import flask_excel as excel

db = SQLAlchemy()


def create_app(config_name):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)
    db.init_app(app)
    # 注册蓝图
    from app.home import home as home_blueprint
    from app.system import system as system_blueprint
    app.register_blueprint(home_blueprint)
    app.register_blueprint(system_blueprint, url_prefix="/system")
    # 初始化Excel包
    excel.init_excel(app)
    return app
