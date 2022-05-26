/* 创建树 */
var param = {
    cell: {
        id: "sid",// 设置构建树的id
        name: "sname",// 树显示的名称
        parent: "sparent",// 表示树的层级
        other: "scode,sidpath"
    }
};
// 设置树的属性
var setting = {
    view: {
        addHoverDom: addHoverDom,
        removeHoverDom: removeHoverDom,
        selectedMulti: false, // 设置是否允许同时选中多个节点。默认值: true
        autoCancelSelected: false,
        dblClickExpand: true
    },
    data: {
        simpleData: {
            enable: true
        }
    },
    async: {
        enable: true,
        url: "TreeSelectAction",
        autoParam: ["id=currenid"],
        type: "post"
    },
    isquickPosition: {
        enable: true, // 是否有快速查询框
        url: "QuickTreeAction",
        quickCells: "scode,sname",// 用于快速查询的字段
        path: "SIDPATH"// 查询路径字段
    },
    edit: {
        enable: true,
        editNameSelectAll: false
    },
    callback: {
        beforeDrag: beforeDrag,
        beforeRemove: beforeRemove,
        beforeRename: beforeRename,
        onRemove: onRemove,
        onRename: afterEditName,
        onClick: onClick
    }
};

var currentNode;

function onClick(event, treeId, treeNode, clickFlag) {
    // alert("单击：" + treeNode.id);
    currentNode = treeNode;
    loadList();
}

function beforeDrag(treeId, treeNodes) {
    return false;
}

var newCount = 0;

function addHoverDom(treeId, treeNode) {
    var sObj = $("#" + treeNode.tId + "_span");
    if (treeNode.editNameFlag || $("#addBtn_" + treeNode.id).length > 0)
        return;
    var addStr = "<button type='button' class='add' id='addBtn_" + treeNode.id
        + "' title='新增子节点' onfocus='this.blur();'></button>";
    sObj.append(addStr);
    var btn = $("#addBtn_" + treeNode.id);
    if (btn)
        btn.bind("click", function () {
            newCount++;
            var zTree = $.fn.zTree.getZTreeObj("tree_folder");
            var newid = new UUID().toString();
            var newCode = treeNode.scode + (newCount);
            var newName = "新增节点" + (newCount);
            var newSIDPATH = treeNode.sidpath + "/" + newid;
            var param = new tlv8.RequestParam();
            param.set("id", newid);
            param.set("pid", treeNode.id);
            param.set("scode", newCode);
            param.set("name", newName);
            param.set("sidpath", newSIDPATH);
            var r = tlv8.XMLHttpRequest("insertflwFolderAction", param,
                "post", true, null);
            zTree.addNodes(treeNode, {
                id: newid,
                pId: treeNode.id,
                name: newName,
                scode: newCode,
                sidpath: newSIDPATH
            });
            return false;
        });
};

function removeHoverDom(treeId, treeNode) {
    $("#addBtn_" + treeNode.id).unbind().remove();
};

function beforeRename(treeId, treeNode, newName) {
    if (newName.length == 0) {
        layui.layer.alert("节点名称不能为空.");
        var zTree = $.fn.zTree.getZTreeObj("tree_folder");
        setTimeout(function () {
            zTree.editName(treeNode);
        }, 10);
        return false;
    }
    return true;
}

/*
 * 编辑目录文件 @param {Object} treeId @param {Object} treeNode
 */
function afterEditName(event, treeId, treeNode) {
    // alert(treeNode.name);
    var param = new tlv8.RequestParam();
    param.set("id", treeNode.id);
    param.set("name", treeNode.name);
    var r = tlv8.XMLHttpRequest("editflwFolderAction", param, "post",
        true, null);
}

function beforeRemove(treeId, treeNode) {
    if (treeNode.id == "root") {
        alert("跟目录不能删除!");
        return false;
    }
    var zTree = $.fn.zTree.getZTreeObj("tree_folder");
    zTree.selectNode(treeNode);
    return confirm("确认删除 节点 -- " + treeNode.name + " 吗？");
}

function onRemove(e, treeId, treeNode) {
    var param = new tlv8.RequestParam();
    param.set("id", treeNode.id);
    param.set("name", treeNode.name);
    param.set("sidpath", treeNode.sidpath);
    var r = tlv8.XMLHttpRequest("deleteflwFolderAction", param, "post",
        true, function () {
            //clear_draw_board();
        });
}

var Jtree_Folder = new Jtree();

function pageLoad() {
    Jtree_Folder.init("tree_folder", setting, param);
}

function loadList() {
    var search_text = $("#search_text").val();
    var surl = '/system/flow/dwr/dialog/dataList?search_text=' + J_u_encode(search_text);
    if (currentNode) {
        surl += "&sparent=" + currentNode.id;
    }
    layui.table.reload('datalist', {
        url: surl,
        done: function (res, curr, count) {
            $("#search_text").val(search_text);
        }
    });
}

function addData(){

}

function deleteData(){

}