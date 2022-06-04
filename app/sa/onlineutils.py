# _*_ coding: utf-8 _*_

from flask import session, request
from app import db
from app.models import SAOnlineInfo
from app.common.persons import get_person_info
from app.common.pubstatic import guid, get_ip, md5_code

"""
在线用户管理
"""


# 保存在线用户信息
def set_online(person_id):
    person_info = get_person_info(person_id)
    sessionid = session.get('sessionid', guid())
    session['sessionid'] = sessionid
    online = SAOnlineInfo.query.filter_by(ssessionid=sessionid).first()
    if not online:
        online = SAOnlineInfo(ssessionid=sessionid)
    online.suserid = person_info['personid']
    online.susername = person_info['personName']
    online.suserfid = person_info['personfid']
    online.suserfname = person_info['personfname']
    online.sloginip = request.remote_addr
    online.sserviceip = get_ip()
    online.smachinecode = md5_code(get_ip())
    db.session.add(online)
    db.session.commit()


# 删除在线用户信息
def clear_online():
    if 'sessionid' in session:
        online = SAOnlineInfo.query.filter_by(ssessionid=session['sessionid']).first()
        if online:
            db.session.delete(online)
            db.session.commit()
        session.pop("sessionid", None)
