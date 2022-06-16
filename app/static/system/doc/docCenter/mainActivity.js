/* 创建树 */
const param = {
    cell: {
        id: "sid",// 设置构建树的id
        name: "sdocname",// 树显示的名称
        parent: "sparentid",// 表示树的层级
        other: "skind,sdocpath,sdocdisplaypath,screatorname,screatorid"
    },
    action: "TreeSelectAction"
};
// 设置树的属性
const setting = {
    view: {
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
        enable: false, // 是否有快速查询框
        url: "QuickTreeAction",
        path: "sdocpath"
    },
    callback: {
        onClick: treeselected
    }

};

let currenttreeNode = null;
let currenttreeID = null;
let currenttreeName = null;
let currenttreeSDOCPATH = null;
let currenttreeSDOCPATHName = null;

let uploadInst;


// 选中树
function treeselected(event, treeId, node) {
    let treeID = node.id;
    currenttreeNode = node;
    currenttreeID = treeID;
    currenttreeName = node.name;
    currenttreeSDOCPATH = node.sdocpath;
    currenttreeSDOCPATHName = node.sdocdisplaypath;

    $("#new_folder_item").attr("src", "/static/common/image/doc/newfolder.gif");
    J$("new_folder_item").onclick = newFolderData;

    $("#folder_pro_item").attr("src", "/static/common/image/doc/folder_pro_g.gif");
    J$("folder_pro_item").onclick = null;

    $("#deletefile_item").attr("src", "/static/common/image/doc/deletefile_g.gif");
    J$("deletefile_item").onclick = null;

    if (treeID !== 'root') {
        if (node.screatorid === tlv8.Context.getCurrentPersonID()) {
            $("#folder_pro_item").attr("src", "/static/common/image/doc/folder_pro.gif");
            J$("folder_pro_item").onclick = editFolderData;

            $("#deletefile_item").attr("src", "/static/common/image/doc/deletefile.gif");
            J$("deletefile_item").onclick = deleteFolderData;
        }
    }

    $("#upbtn").removeClass("layui-btn-disabled");
    if (!uploadInst) {
        uploadInst = layui.upload.render({
            elem: '#upbtn'
            , url: '/system/doc/docCenter/uploadFile?t=' + new Date().getTime()
            , data: {folder: currenttreeID}
            , accept: 'file'
            , multiple: true
            , size: 1024 * 1024 * 100 //限定大小100M
            , before: function (obj) {
                layui.layer.load();
            }
            , done: function (res) {
                layui.layer.closeAll('loading');
                if (res.code === 0) {
                    layui.layer.msg("上传成功~");
                    doQuery();
                } else {
                    layui.layer.alert("上传失败！");
                }
            }
            , error: function () {
                layui.layer.closeAll('loading');
            }
        });
    } else {
        uploadInst.reload({
            url: '/system/doc/docCenter/uploadFile?t=' + new Date().getTime(),
            data: {folder: currenttreeID}
        });
    }

    doQuery();
}

function dailogcallback(data) {
    MainJtree.quickPosition(data);
}

function newFolderData() {
    tlv8.portal.dailog.openDailog('新建目录',
        "/system/doc/docCenter/dialog/createFolder?sparent="
        + currenttreeID, 400, 300, dailogcallback, null);
}

function editFolderData() {
    tlv8.portal.dailog.openDailog('编辑目录',
        "/system/doc/docCenter/dialog/createFolder?rowid="
        + currenttreeID, 400, 300, dailogcallback, null);
}

function deleteFolderData() {
    layui.layer.confirm("目录删除之后不可恢复，确认删除吗？", function () {
        let url = "/system/doc/docCenter/dialog/createFolder?rowid=" + currenttreeNode.id + "&option=del";
        $.ajax({
            url: url,
            type: "post",
            async: true,
            data: {rowid: currenttreeNode.id},
            dataType: "json",
            success: function (re) {
                if (re.state === true) {
                    layui.layer.msg("删除成功！");
                    Jtree.refreshJtree('maintree');
                } else {
                    layui.layer.alert("删除失败：" + re.msg);
                }
            }
        });
    });
}

