# _*_ coding:utf-8 _*_

"""
功能树（菜单配置）
"""

functions = [
    {"title": "系统管理",
     "icon": "layui-icon layui-icon-set",
     "child": [
         {"title": "组织机构", "icon": "fa fa-sitemap", "child": [
             {"title": "机构管理",
              "href": "/system/OPM/organization",
              "process": "/SA/OPM/organization/organizationProcess",
              "activity": "mainActivity"
              },
             {"title": "角色管理",
              "href": "/system/OPM/role",
              "process": "/SA/OPM/role/roleProcess",
              "activity": "mainActivity"
              },
             {"title": "授权管理",
              "href": "/system/OPM/authorization",
              "process": "/SA/OPM/authorization/authorizationProcess",
              "activity": "mainActivity"
              }
         ]},
         {"title": "流程管理", "icon": "layui-icon layui-icon-auz", "child": [
             {"title": "流程监控",
              "href": "/system/flow/monitor",
              "process": "/SA/task/taskCenter/process",
              "activity": "monitorActivity"
              },
             {"title": "流程设计",
              "href": "/system/flow/flow_design",
              "process": "/flw/dwr/process",
              "activity": "vml-dwr-editor"
              }
         ]},
         {"title": "文档管理", "icon": "fa fa-sitemap", "child": [
             {"title": "文档中心",
              "href": "/system/doc/docCenter",
              "process": "/SA/doc/docCenter/docCenterProcess",
              "activity": "docCenter"
              },
             {"title": "文档检索",
              "href": "/system/doc/docSearch",
              "process": "/SA/doc/docSearch/docSearchProcess",
              "activity": "mainActivity"
              }
         ]},
         {"title": "系统工具", "icon": "layui-icon layui-icon-util", "child": [
             {"title": "操作日志",
              "href": "/system/logs",
              "process": "/SA/log/logProcess",
              "activity": "mainActivity"
              },
             {"title": "在线用户",
              "href": "/system/online",
              "process": "/SA/online/onlineProcess",
              "activity": "mainActivity"
              }
         ]}
     ]
     }
]
