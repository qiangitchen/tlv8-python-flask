# _*_ coding:utf-8 _*_

from app.menus.functiontree import functions

"""
菜单操作相关方法
"""


# 获取功能菜单树
def get_function_tree():
    tree = list()
    for mm in functions:
        item = dict()
        item['title'] = mm['title']
        item['icon'] = mm['icon']
        item['fname'] = mm['title']
        item['children'] = get_function_tree_child(mm)
        tree.append(item)
    return tree


# 获取功能菜单树-子
def get_function_tree_child(item):
    if 'child' not in item:
        return []
    child = list()
    for it in item['child']:
        m = dict()
        m['title'] = it['title']
        if 'icon' in it:
            m['icon'] = it['icon']
        m['fname'] = item['title'] + '/' + it['title']
        if 'href' in it:
            m['url'] = it['href']
            m['process'] = it['process']
            m['activity'] = it['activity']
        m['children'] = get_function_tree_child(it)
        child.append(m)
    return child


# 获取功能菜单
def get_function_menu():
    return functions


# 获取url对应的功能名称
def get_process_name(url):
    for menu in functions:
        if url == menu.get('href', ''):
            return menu.get('title', '')
        if len(menu.get('child', [])) > 0:
            name = get_process_name_child(menu.get('child', []), url)
            if name:
                return name
    return ""


# 获取url对应的功能名称【子菜单】
def get_process_name_child(child, url):
    for menu in child:
        if url == menu.get('href', ''):
            return menu.get('title', '')
        if len(menu.get('child', [])) > 0:
            name = get_process_name_child(menu.get('child', []), url)
            if name:
                return name


# 获取功能模块全称
def get_process_full(url):
    for menu in functions:
        if url == menu.get('href', ''):
            return menu.get('title', '')
        if len(menu.get('child', [])) > 0:
            name = get_process_full_child(menu.get('child', []), url)
            if name:
                return "/" + menu.get('title', '') + "/" + name
    return ""


# 获取url对应的功能全名称【子菜单】
def get_process_full_child(child, url):
    for menu in child:
        if url == menu.get('href', ''):
            return menu.get('title', '')
        if len(menu.get('child', [])) > 0:
            name = get_process_full_child(menu.get('child', []), url)
            if name:
                return menu.get('title', '') + "/" + name
