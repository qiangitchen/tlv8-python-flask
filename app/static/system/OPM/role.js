var currentRole = {};

/**
 * 添加角色
 */
function addRoleData() {

}

/**
 * 重载‘角色’数据
 */
function reloadList() {
    var search_role = $("#search_role").val();
    layui.table.reload('role_list', {
        url: '/system/OPM/roleList?search_role=' + J_u_encode(search_role),
        done: function (res, curr, count) {
            $("#search_role").val(search_role);
        }
    });
}

/**
 * 排序
 */
function sortAction() {

}

/**
 * 编辑'角色'
 * @param dtaa
 */
function editRoleData(data) {

}

/**
 * 删除‘角色’
 * @param dtaa
 */
function delRoleData(data) {

}

/**
 * 加载权限数据
 * @param roleData
 */
function loadPermission(roleData) {
    var search_perm = $("#search_perm").val();
    layui.table.reload('perm_list', {
        url: '/system/OPM/PermissionList?permission_kind=0&role_id=' + roleData.sid + '&search_perm=' + J_u_encode(search_perm),
        done: function (res, curr, count) {
            $("#search_perm").val(search_perm);
        }
    });
}

/**
 *添加权限
 */
function addPermission() {
    if (!currentRole.sid) {
        layui.layer.alert('请先选择需要分配权限的角色！');
        return;
    }
    tlv8.portal.dailog.openDailog("分配功能",
        "/system/dialog/functionTreeSelect", "400", "600",
        cocationCallback);
}

function cocationCallback(data) {
    // alert("ok"+data);//确定回传
    var values = [];
    var kSet = data.keySet();
    for (k in kSet) {
        values.push(data.get(kSet[k]));
    }
    console.log(JSON.stringify(values));
}


/**
 * 删除权限
 */
function deletePermission() {
    var checked_rows = layui.table.checkStatus('perm_list');
    var rows = checked_rows.data;
    if (rows.length < 1) {
        layui.layer.alert("请先勾选需要删除的数据！")
        return;
    }
}