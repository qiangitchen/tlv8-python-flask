var currentNode;
var currenttreeID = "";
var currenttreeName = "";
var sorgkindid = "";

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
        url: "/system/OPM/TreeSelectAction",// 加载数据的Action,可以自定义
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

function afterRefresh(event) {
    currentNode = null;
    currenttreeID = "";
    currenttreeName = "";
    sorgkindid = "";
    loadList();
}

function beforeClick(treeId, treeNode) {
    currentNode = treeNode;
    document.getElementById("main_org_trr").rowid = treeNode.id;
    currenttreeID = treeNode.id;
    currenttreeName = treeNode.name;
    sorgkindid = treeNode.sorgkindid;
    if ("org" == sorgkindid || sorgkindid == "ogn") {
        $(".buttnew").removeAttr("disabled");
    }
    if ("dpt" == sorgkindid) {
        $("#org").attr({
            disabled: "disabled"
        });
        $("#ogn").attr({
            disabled: "disabled"
        });
        // $("#dpt").attr({
        // disabled : "disabled"
        // });
        $("#dpt").removeAttr("disabled");
        $("#pos").removeAttr("disabled");
        $("#psm").removeAttr("disabled");
        $("#assignPerson").removeAttr("disabled");
    }
    if ("pos" == sorgkindid) {
        $("#org").attr({
            disabled: "disabled"
        });
        $("#dept").attr({
            disabled: "disabled"
        });
        $("#pos").attr({
            disabled: "disabled"
        });
        $("#psm").removeAttr("disabled");
        $("#assignPerson").removeAttr("disabled");
    }
    if ("psm" == sorgkindid) {
        $(".buttnew").attr({
            disabled: "disabled"
        });
    }

    loadList();

}

var MainJtree = new Jtree();

function pageLoad() {
    MainJtree.init("JtreeView", setting, param);
}

// 获取弹出菜单的位置
var count = 0;

function addorgitem() {
    count++;
    var aNode = $("#addOrgItem");
    // 找到当前节点的位置
    var offset = aNode.offset();
    // 设置弹出框的位置
    $("#showdivt").css({"left": offset.left, "top": (offset.top + 40), "z-index": 9999}).slideDown("fast");
    // .slideDown("fast");
    $("body").bind("mousedown", onBodyDown);
    // if (count % 2 == 0) {
    // hideMenu();
    // }
}

// 隐藏树
function hideMenu() {
    $("#showdivt").fadeOut("fast");
    $("body").unbind("mousedown", onBodyDown);
}

function onBodyDown(event) {
    if (!(event.target.id == "addOrgItem" || event.target.id == "showdivt" || $(
        event.target).parents("#showdivt").length > 0)) {
        hideMenu();
    }
}

function loadList() {
    var url = '/system/OPM/orgList';
    if (currenttreeID && currenttreeID !== '') {
        url += "?parent=" + currenttreeID;
    }
    layui.table.render({
        elem: '#orglist'
        , url: url
        , toolbar: '#list_toolbar'
        , height: 'full-100'
        , defaultToolbar: ['exports']
        , cols: [[
            {field: 'sid', title: 'ID', hide: true}
            , {field: 'no', title: '序号', width: 60, unresize: true, align: 'center'}
            , {field: 'scode', title: '编号', width: 80}
            , {field: 'sname', title: '名称', width: 150}
            , {field: 'sdescription', title: '描述'}
            , {field: 'sfcode', title: '全编号', width: 200}
            , {field: 'sfname', title: '全名称', width: 200}
            , {fixed: 'right', title: '操作', toolbar: '#actionBar', width: 490}
        ]]
        , even: true
        , page: true
    });
}

function creat_dailogcallback(data) {
    MainJtree.refreshJtree("JtreeView");
    if (data && data != "") {
        MainJtree.quickPosition(data);
    } else {
        loadList();
    }
}

function editOrgData(data) {
    var rowid = data.sid;
    var SORGKINDID = data.sorgkindid;
    var SPERSONID = data.spersonid;
    if (SORGKINDID == "psm") {
        tlv8.portal.dailog
            .openDailog('人员信息',
                "/system/OPM/organization/psm_edit?gridrowid="
                + rowid + "&personid=" + SPERSONID + "&operator=edit",
                800, 490, creatPsm_dailogcallback);
    } else {
        tlv8.portal.dailog.openDailog('机构管理',
            "/system/OPM/organization/org_edit?gridrowid="
            + rowid + "&operator=edit", 700, 500,
            creat_dailogcallback);
    }
}

// 添加组织
function newognData(type) {
    hideMenu();
    tlv8.portal.dailog.openDailog('新建组织',
        "/system/OPM/organization/org_edit?parent=" + currenttreeID + "&type=" + type,
        700, 500, creat_dailogcallback);
}

// 新增、编辑人员信息回调
function creatPsm_dailogcallback(data) {
    MainJtree.quickPosition(currenttreeID);
}

//添加人员
function newPsmData() {
    hideMenu();
    tlv8.portal.dailog
        .openDailog('添加人员',
            "/system/OPM/organization/psm_edit?parent="
            + currenttreeID + "&operator=new",
            700, 490, creatPsm_dailogcallback);
}

// 排序
function sortOrgAction() {
    var rowid = currenttreeID;
    if (!rowid || rowid == "") {
        layui.layer.alert("未选中数据!");
        return;
    }
    tlv8.portal.dailog.openDailog('机构排序',
        "/system/OPM/organization/sortOrgs?rowid=" + rowid, 600, 450, creat_dailogcallback);
}

// 重置密码
function resetPassword(data) {
    if (data.sorgkindid != 'psm') {
        layui.layer.alert("当前行的数据不是人员，不能重置密码！");
        return;
    }
    layui.layer.confirm("确定将该用户密码设置为初始密码吗?", function () {
        var param = new tlv8.RequestParam();
        param.set("personid", data.spersonid);
        var r = tlv8.XMLHttpRequest("/system/OPM/organization/ResetPassword", param,
            "post", false, null);
        if (r.state == true) {
            layui.layer.alert("密码重置成功！");
        } else {
            layui.layer.alert(r.msg);
        }
    });
}

// 分配人员
function assignPsmData() {
    hideMenu();
    tlv8.portal.dailog.openDailog('分配人员',
        "/system/OPM/organization/SelectChPsm?rowid="
        + currenttreeID, 800, 700, assign_dailogcallback);
}

function assign_dailogcallback(data) {
    var param = new tlv8.RequestParam();
    param.set("orgId", currenttreeID);
    param.set("personIds", data.id);
    tlv8.XMLHttpRequest("/system/OPM/organization/appendPersonMembers", param, "post", true, function (
        r) {
        if (r.state == true) {
            layui.layer.msg("操作成功!");
            creat_dailogcallback(currenttreeID);// 分配完成刷新数据
        } else {
            layui.layer.alert(r.msg);
        }
    });
}

// 取消人员分配
function disassignPsmFn(data) {
    if (data.sorgkindid != 'psm') {
        layui.layer.alert("当前行的数据不是人员，不能取消分配！");
        return;
    }
    if (data.snodekind != 'nkLimb') {
        layui.layer.alert("当前人员并非分配的人员，不能取消分配！");
        return;
    }
    layui.layer.confirm("取消后不能恢复，确认取消吗?", function () {
            var param = new tlv8.RequestParam();
            param.set("rowid", data.sid);
            var r = tlv8.XMLHttpRequest("/system/OPM/organization/disassignPsmAction", param, "post", false,
                null);
            if (r.state == true) {
                layui.layer.alert("取消分配成功！");
                creat_dailogcallback(currenttreeID);// 操作完成刷新数据
            } else {
                layui.layer.alert(r.msg);
            }
        }
    );
}

//设置所属部门
function setMemberOrg(data) {
    layui.layer.confirm("确认将【" + data.sname + "】的主部门设置为【" + currentNode.name + "】吗?", function () {
        var param1 = new tlv8.RequestParam();
        param1.set("rowid", data.sid);
        tlv8.XMLHttpRequest("/system/OPM/organization/setMemberOrgAction", param1, "post", true,
            function (r) {
                if (r.state == true) {
                    layui.layer.alert("设置成功！");
                    loadList();
                } else {
                    alert(r.msg);
                }
            });
    });
}

// 移动数据回调
function dailogcallback(data, rowid) {
    var param1 = new tlv8.RequestParam();
    param1.set("rowid", rowid);
    param1.set("orgID", data);
    var r = tlv8.XMLHttpRequest("/system/OPM/organization/moveOrg", param1, "post", false, null);
    if (r.state != true) {
        layui.layer.alert(r.msg);
        return;
    }
    creat_dailogcallback(data);
}

// 移动
function moveOrg(data) {
    tlv8.portal.dailog.openDailog('移动机构',
        "/system/OPM/organization/moveOrg?rowid=" + data.sid, 400, 350,
        function (rdata) {
            dailogcallback(rdata, data.sid);
        }, null);
}