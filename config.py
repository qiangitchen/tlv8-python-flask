# -*- coding=utf-8 -*-
import os


class Config:
    SECRET_KEY = 'tlv8'
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    UP_DIR = os.path.join(os.path.abspath(os.path.dirname(__file__)), "app/static/uploads/")  # 文件上传路径

    @staticmethod
    def init_app(app):
        pass


# the config for development
class DevelopmentConfig(Config):
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:password@127.0.0.1:3306/tlv8'
    DEBUG = True


# define the config
config = {
    'default': DevelopmentConfig
}
