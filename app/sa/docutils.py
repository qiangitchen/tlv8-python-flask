# _*_ coding: utf-8 _*_

from app import db
from sqlalchemy import or_
from app.models import SADocNode
from app.common.pubstatic import guid


# 根据docpath创建目录
def get_doc_folder_by_path(doc_path, person):
    folders = doc_path.split("/")
    parent = SADocNode(sid='root', sdocpath='/root', sdocdisplaypath='/文档中心')
    for f in folders:
        if f == "" or f == "root":
            continue
        doc_node = SADocNode.query.filter(SADocNode.sparentid == parent.sid, or_(SADocNode.sdocname == f,
                                                                                 SADocNode.sid == f)).first()
        if not doc_node:
            parent = create_folder(parent, f, person)
        else:
            parent = doc_node
    return parent.sid


# 根据名称创建目录
def create_folder(parent, name, person):
    sid = guid()
    model = SADocNode(sid=sid, sdocname=name, skind='dir',
                      sdescription='自动创建', sparentid=parent.sid,
                      screatorid=person['personid'],
                      screatorname=person['personName'],
                      sdocpath=parent.sdocpath + '/' + sid,
                      sdocdisplaypath=parent.sdocdisplaypath + '/' + name)
    db.session.add(model)
    db.session.commit()
    return model
