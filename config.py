# -*- coding=utf-8 -*-
import os


class Config:
    SECRET_KEY = 'tlv8-flask'
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    UP_DIR = os.path.join(os.path.abspath(os.path.dirname(__file__)), "uploads/")  # 文件上传路径

    @staticmethod
    def init_app(app):
        f = open('app/banner.txt', 'r')
        file_contents = f.read()
        print(file_contents)
        f.close()


# the config for development
class DevelopmentConfig(Config):
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:TLv8MySQL@127.0.0.1:3306/tlv8'
    DEBUG = True


# 生产环境
class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:TLv8MySQL@127.0.0.1:3306/tlv8'
    DEBUG = False


# define the config
config = {
    'default': DevelopmentConfig,
    'production': ProductionConfig
}
