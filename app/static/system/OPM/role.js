var currentRole = {};

/**
 * 添加角色
 */
function addRoleData() {
    tlv8.portal.dailog.openDailog("添加角色",
        "/system/OPM/role/editRole?operator=new", "500", "400",
        function () {
            reloadList();
        });
}

/**
 * 重载‘角色’数据
 */
function reloadList() {
    var search_role = $("#search_role").val();
    layui.table.reload('role_list', {
        url: '/system/OPM/role/roleList?search_role=' + J_u_encode(search_role),
        done: function () {
            $("#search_role").val(search_role);
            loadPermission({});
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
 * @param data
 */
function editRoleData(data) {
    tlv8.portal.dailog.openDailog("编辑角色",
        "/system/OPM/role/editRole?operator=edit&rowid=" + data.sid, "500", "400",
        function () {
            reloadList();
        });
}

/**
 * 删除‘角色’
 * @param data
 */
function delRoleData(data) {
    layui.layer.confirm('角色删除后不可恢复，确认删除吗？', function () {
        var param = new tlv8.RequestParam();
        param.set("rowid", data.sid);
        tlv8.XMLHttpRequest("/system/OPM/role/deleteRole", param, "post", true,
            function (r) {
                if (r.state === true) {
                    layui.layer.msg("删除成功！");
                    reloadList();
                } else {
                    layui.layer.alert(r.msg);
                }
            });
    });
}

/**
 * 加载权限数据
 * @param roleData
 */
function loadPermission(roleData) {
    var search_perm = $("#search_perm").val();
    layui.table.reload('perm_list', {
        url: '/system/OPM/role/PermissionList?permission_kind=0&role_id=' + roleData.sid + '&search_perm=' + J_u_encode(search_perm),
        done: function () {
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
    //console.log(JSON.stringify(values));
    var param = new tlv8.RequestParam();
    param.set("rowid", currentRole.sid);
    param.set("values", JSON.stringify(values));
    tlv8.XMLHttpRequest("/system/OPM/role/AssignPermissions", param, "post", true,
        function (r) {
            if (r.state === true) {
                layui.layer.msg("添加权限成功！");
                loadPermission(currentRole);
            } else {
                layui.layer.alert(r.msg);
            }
        });
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
    var values = [];
    for (var i = 0; i < rows.length; i++) {
        values.push(rows[i].sid);
    }
    var param = new tlv8.RequestParam();
    param.set("values", values.join(","));
    tlv8.XMLHttpRequest("/system/OPM/role/CancelPermissions", param, "post", true,
        function (r) {
            if (r.state === true) {
                layui.layer.msg("删除成功！");
                loadPermission(currentRole);
            } else {
                layui.layer.alert(r.msg);
            }
        });
}