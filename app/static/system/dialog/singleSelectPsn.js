var currenttreeID = null, currentNode;

/* =========创建树========== */

var param = {
    cell: {
        id: "sid",// 设置构建树的id
        name: "sname",// 树显示的名称
        parent: "sparent",// 表示树的层级
        other: "spersonid,sfid,sfname,sorgkindid,scode,sfcode"// 树中所带字段信息
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
        beforeClick: beforeClick
    }
};

/*
 * 初始化
 */
var mainJtree = new Jtree();
var staticGrid;
var gridparam = [{
    id: 'fName',
    name: '名称',
    width: 100
}, {
    id: 'fCode',
    name: '编码',
    width: 80
}];
$(document).ready(function () {
    mainJtree.init("JtreeDemo", setting, param);
    staticGrid = new StaticGrid("main-grid-view"); // 实例化类
    staticGrid.init(gridparam); // 初始化
    staticGrid.setRowDbclick(staticGridDbclick); // 设置行双击事件
    staticGrid.clearData();
});

/*
 * 树单击 @param {Object} treeId @param {Object} treeNode
 */
function beforeClick(treeId, treeNode) {
    if (treeNode.sorgkindid == "psm") {
        staticGrid.clearData();
        var json = {};
        json.rowid = treeNode.id;
        json.fName = treeNode.name;
        json.fCode = treeNode.scode;
        json.sfid = treeNode.sfid;
        json.spersonid = treeNode.spersonid;
        staticGrid.addData(json);
        staticGrid.selectRowById(json.rowid);
    }
}

/*
 * 列表双击 @param {Object} obj @param {Object} stGrid
 */
function staticGridDbclick(obj, stGrid) {
    staticGrid.removeData(obj.id);
}

/*
 * 确定 @return {TypeName}
 */
function dailogEngin() {
    if (staticGrid.data.length > 0) {
        return staticGrid.data[0];
    } else {
        alert("未选择执行人!");
        return false;
    }
}

