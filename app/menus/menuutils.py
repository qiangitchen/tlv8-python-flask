# _*_ coding:utf-8 _*_

from app.menus.functiontree import functions
from app.common.pubstatic import guid

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
        item['fullname'] = '/' + mm['title']
        mm['fullname'] = '/' + mm['title']
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
        m['fullname'] = item['fullname'] + '/' + it['title']
        it['fullname'] = item['fullname'] + '/' + it['title']
        if 'href' in it:
            m['url'] = it['href']
            m['process'] = it['process']
            m['activity'] = it['activity']
        m['children'] = get_function_tree_child(it)
        child.append(m)
    return child


# 获取功能菜单
def get_function_menu(per):
    menus = list()
    for fun in functions:
        if is_effective(per, fun):
            item = dict()
            item['title'] = fun['title']
            if 'icon' in fun:
                item['icon'] = fun['icon']
            if 'child' in fun:
                item['child'] = get_function_menu_child(per, fun)
            menus.append(item)
    return menus


# 获取功能菜单-子
def get_function_menu_child(per, fun):
    children = list()
    if 'child' not in fun:
        return children
    for m in fun['child']:
        if is_effective(per, m):
            item = dict()
            item['title'] = m['title']
            if 'icon' in m:
                item['icon'] = m['icon']
            if 'href' in m:
                item['href'] = m['href']
            if 'process' in m:
                item['process'] = m['process']
            if 'activity' in m:
                item['activity'] = m['activity']
            if 'child' in m:
                item['child'] = get_function_menu_child(per, m)
            children.append(item)
    return children


# 是否显示菜单
def is_effective(per, item):
    if 'display' in item:
        display = item['display']
        if display == 'hide':
            return False
    if 'href' in item:
        return is_have_author(per, item['process'], item['activity'])
    if 'child' in item:
        child = item['child']
        for ch in child:
            ih = is_effective(per, ch)
            if ih:
                return True
    return False


# 判断功能是否在权限列表中
def is_have_author(per, process, activity):
    for p in per:
        if p['sprocess'] == process and p['sactivity'] == activity:
            return True
    return False


# 判断功能是否在权限列表中（根据url）
def is_have_author_url(per, url):
    if not is_in_function_tree(url, functions):
        return True
    for p in per:
        if p['sdescription'] == url:
            return True
    return False


# 判断url是否在功能菜单配置中（为了区分动作请求和页面请求）
def is_in_function_tree(url, menus):
    for fun in menus:
        if 'href' in fun:
            if url == fun['href']:
                return True
        if 'child' in fun:
            child = fun['child']
            is_in = is_in_function_tree(url, child)
            if is_in:
                return True
    return False


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


# 获取功能树菜单（全部）用于zTree展示
def get_function_ztree():
    zTree = list()
    for mm in functions:
        item = dict()
        id = guid()
        item['id'] = id
        item['name'] = mm['title']
        item['pid'] = ''
        item['surl'] = ''
        zTree.append(item)
        if 'child' in mm:
            get_function_ztree_child(zTree, mm['child'], id)
    return zTree


# 获取功能树菜单（子）用于zTree展示
def get_function_ztree_child(zTree, childs, pid):
    for mm in childs:
        item = dict()
        id = guid()
        item['id'] = id
        item['name'] = mm['title']
        item['pid'] = pid
        if 'href' in mm:
            item['surl'] = mm['href']
        else:
            item['surl'] = ''
        if 'process' in mm:
            item['process'] = mm['process']
        if 'activity' in mm:
            item['activity'] = mm['activity']
        zTree.append(item)
        if 'child' in mm:
            get_function_ztree_child(zTree, mm['child'], id)
