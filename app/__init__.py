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
    from app.sa import system as system_blueprint
    from app.flow import flow as flow_blueprint
    from app.oa import oa as oa_blueprint
    app.register_blueprint(home_blueprint)  # 登录页、首页
    app.register_blueprint(system_blueprint, url_prefix="/system")  # 系统管理模块
    app.register_blueprint(flow_blueprint, url_prefix="/flowControl")  # 流程控制模块
    app.register_blueprint(oa_blueprint, url_prefix="/oa")  # 业务模块（OA） 添加其他业务模块可以参考OA
    # 初始化Excel包
    excel.init_excel(app)
    return app
