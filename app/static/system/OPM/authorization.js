var currentNode;
var currenttreeID = "";

/* =========创建树========== */

var param = {
    cell: {
        id: "sid",// 设置构建树的id
        name: "sname",// 树显示的名称
        parent: "sparent",// 表示树的层级
        other: "sfid,sfname,sorgkindid,scode,sfcode"// 树中所带字段信息
    }
};
var setting = {
    view: {
        selectedMulti: false, // 设置是否允许同时选中多个节点。默认值: true
        autoCancelSelected: false,
        dblClickExpand: true
        // 双击展开
    },
    data: {
        simpleData: {
            enable: true
        }
    },
    async: {
        enable: true, // 异步加载
        url: "/system/OPM/TreeSelectAction?show_system=true",// 加载数据的Action,可以自定义
        autoParam: ["id=currenid"]
    },
    isquickPosition: {
        enable: true, // 是否有快速查询框
        url: "/system/OPM/QuickTreeAction",
        quickCells: "sid,scode,sname",// 用于快速查询的字段
        path: "sfid"// 查询路径字段
    },
    callback: {
        beforeClick: beforeClick,
        afterRefresh: afterRefresh
    }
};

function afterRefresh() {
    currentNode = null;
    currenttreeID = "";
    loadList();
}

function beforeClick(treeId, treeNode) {
    currentNode = treeNode;
    currenttreeID = treeNode.id;
    loadList();
}

var MainJtree = new Jtree();

function pageLoad() {
    MainJtree.init("JtreeView", setting, param);
}

function loadList() {
    var query_text = $("#query_text").val();
    layui.table.reload('rolelist',
        {
            url: "/system/OPM/authorization/dataList?org_id=" + currenttreeID + "&query_text=" + J_u_encode(query_text),
            done: function () {
                $("#query_text").val(query_text);
            }
        }
    );
}

function addData() {
    if (!currenttreeID || currenttreeID === "") {
        layui.layer.alert("请先在左边【机构数】选择需要分配角色的组织！");
        return;
    }
    tlv8.portal.dailog.openDailog("分配角色",
        "/system/OPM/authorization/dialog/roleList", "600", "600",
        addDataCallBack);
}

function addDataCallBack(roles) {
    var param = new tlv8.RequestParam();
    param.set("orgid", currenttreeID);
    param.set("roles", roles);
    tlv8.XMLHttpRequest("/system/OPM/authorization/addRole", param, "post", true,
        function (r) {
            if (r.state === true) {
                layui.layer.msg("添加成功！");
                loadList();
            } else {
                layui.layer.alert(r.msg);
            }
        });
}

function deleteData() {
    var checked_rows = layui.table.checkStatus('rolelist');
    var rows = checked_rows.data;
    if (rows.length < 1) {
        layui.layer.alert("请先勾选需要删除的数据！")
        return;
    }
    layui.layer.confirm("确定删除所选数据吗？", function () {
        var values = [];
        for (var i = 0; i < rows.length; i++) {
            values.push(rows[i].sid);
        }
        var param = new tlv8.RequestParam();
        param.set("values", values.join(","));
        tlv8.XMLHttpRequest("/system/OPM/authorization/deleteRole", param, "post", true,
            function (r) {
                if (r.state === true) {
                    layui.layer.msg("删除成功！");
                    loadList();
                } else {
                    layui.layer.alert(r.msg);
                }
            });
    });
}