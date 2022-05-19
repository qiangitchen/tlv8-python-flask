var currentNode;
var currenttreeID = null;
var currenttreeName = null;
var sorgkindid = null;

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
    currenttreeID = null;
    currenttreeName = null;
    sorgkindid = null;
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
    setTimeout(function () {
        MainJtree.quickPosition(data);
    }, 1000)
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
    //MainJtree.refreshJtree("JtreeView");
    setTimeout(function () {
        MainJtree.quickPosition(currenttreeID);
    }, 1000)
}

//添加人员
function newPsmData() {
    tlv8.portal.dailog
        .openDailog('添加人员',
            "/system/OPM/organization/psm_edit?parent="
            + currenttreeID + "&operator=new",
            700, 490, creatPsm_dailogcallback);
}
