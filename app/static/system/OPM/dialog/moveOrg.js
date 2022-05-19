var currenttreeID = null;
var rowid = tlv8.RequestURLParam.getParam("rowid");

/*创建树*/
var param = {
    cell: {
        id: "sid",//设置构建树的id
        name: "sname",//树显示的名称
        parent: "sparent",//表示树的层级
        other: "sfid,sfname,sorgkindid,scode,sfcode"
    }
};
//设置树的属性
var setting = {
    view: {
        selectedMulti: false, //设置是否允许同时选中多个节点。默认值: true
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
        url: "/system/OPM/TreeSelectAction?hide_psm=true",
        autoParam: ["id=currenid"],
        type: "post"
    },
    isquickPosition: {
        enable: true, //是否有快速查询框
        url: "/system/OPM/QuickTreeAction",
        quickCells: "SCODE,SNAME",//用于快速查询的字段
        path: "SFID"//查询路径字段
    },
    edit: {
        enable: false
    },
    callback: {
        onClick: treeselected
    }
};

function treeselected(event, treeId, treeNode) {
    currenttreeID = treeNode.id;
}

/*
 * 确认返回
 * @param {Object} param
 * @return {TypeName} 
 */
function dailogEngin(param) {
    return currenttreeID;
}