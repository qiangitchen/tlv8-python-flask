var addOrgItem, deleteUserItem, refreshUserItem, disableUserItem, ableUserItem, moveOrgItem, viewOrg, sortOrgItem;// 新增，删除，禁用，启用，移动按钮，显示机构
var currentNode;
var currentgrid = null;
var currenttreeID = null;
var currenttreeName = null;
var sorgkindid = null;
var scode = null;
var sfname = null;
var sfcode = null;
var sparent = null;
var sfid = null;

/* =========创建树========== */

var param = {
    cell: {
        id: "sid",// 设置构建树的id
        name: "sname",// 树显示的名称
        parent: "sparent",// 表示树的层级
        other: "sfid,sfname,sorgkindid,scode,sfcode",// 树中所带字段信息
        orderby: "ssequence asc" // 排序字段
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
        quickCells: "SID,SCODE,SNAME",// 用于快速查询的字段
        path: "SFID"// 查询路径字段
    },
    callback: {
        beforeClick: beforeClick
    }
};

function beforeClick(treeId, treeNode) {
    currentNode = treeNode;
    document.getElementById("main_org_trr").rowid = treeNode.id;
    currenttreeID = treeNode.id;
    currenttreeName = treeNode.name;
    sorgkindid = treeNode.sorgkindid;
    scode = treeNode.scode;
    sfname = treeNode.sfname;
    sfcode = treeNode.sfcode;
    sfid = treeNode.sfid;
    sparent = treeNode.parent;
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
}

var MainJtree = new Jtree();
function pageLoad(){
    MainJtree.init("JtreeView", setting, param);
}