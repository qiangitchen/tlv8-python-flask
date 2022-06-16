// 构建树
const param = {
    cell: {
        id: "sid",// 设置构建树的id
        name: "sparentname",// 树显示的名称
        parent: "sparentid",// 表示树的层级
        other: "spath"
    }
};
// 设置树的属性
const setting = {
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
        quickCells: "sid,sparentname",
        path: "spath"// 查询路径字段

    },
    callback: {
        onClick: treeselected
    }

};

let sJtree = new Jtree();
$(document).ready(function () {
    sJtree.init("maintree", setting, param);
});

// 单击树节点
let treeRowid = "", parentid = "";
let uploadInst = null;

function treeselected(event, treeId, treeNode) {
    $("#upbtn").removeAttr("disabled").removeClass("layui-btn-disabled");
    treeRowid = treeNode.id;
    parentid = treeNode.parent;
    if (uploadInst) {
        uploadInst.reload({
            url: '/system/doc/docCenter/uploadFile?t=' + new Date().getTime()
        });
    } else {
        uploadInst = layui.upload.render({
            elem: '#upbtn'
            , url: '/system/doc/docCenter/uploadFile?t=' + new Date().getTime()
            , data: {docPath: "/root/个人文件柜" + tlv8.Context.getCurrentPersonFName()}
            , accept: 'file'
            , multiple: false
            , size: 1024 * 1024 * 100 //限定大小100M
            , before: function (obj) {
                layui.layer.load();
            }
            , done: function (res) {
                layui.layer.closeAll('loading');
                if (res.code === 0) {
                    layui.layer.msg("上传成功~");
                    saveFileData(res.data);
                } else {
                    layui.layer.alert("上传失败！");
                }
            }
            , error: function () {
                layui.layer.closeAll('loading');
            }
        });
    }
    doQuery();
}


function folderCallback(data) {
    sJtree.refreshJtree();
    treeRowid = "";
    parentid = "";
    if (data) {
        //sJtree.quickPosition(data);
    }
}

//添加目录
function openview() {
    let url = "/system/personal/docnode/dialog/FolderManage";
    if (treeRowid && treeRowid !== "") {
        url += "?parent=" + treeRowid;
    }
    tlv8.portal.dailog.openDailog("添加目录", url, 400, 300, folderCallback);
}

//编辑目录
function editview() {
    if (!treeRowid || treeRowid === "") {
        layui.layer.alert("请选择需要编辑的目录~");
        return;
    }
    let url = "/system/personal/docnode/dialog/FolderManage?sid=" + treeRowid;
    tlv8.portal.dailog.openDailog("编辑目录", url, 400, 300, folderCallback);
}

//删除目录
function deleteview() {
    if (!treeRowid || treeRowid === "") {
        layui.layer.alert("请选择需要删除的目录~");
        return;
    }
    layui.layer.confirm("数据删除之后不能恢复，确认删除吗？", function () {
        $.ajax({
            url: "/system/personal/docnode/deleteFolder?rowid=" + treeRowid,
            type: "post",
            async: false,
            dataType: "json",
            success: function (re, textStatus) {
                if (re.state === true) {
                    rowid = re.data;
                    layui.layer.msg("删除成功！");
                    folderCallback();
                } else {
                    layui.layer.alert("删除失败：" + re.msg);
                }
            }
        });
    });
}

function saveFileData(data) {
    let param = new tlv8.RequestParam();
    param.set("folder", treeRowid);
    param.set("file", JSON.stringify(data));
    tlv8.XMLHttpRequest("/system/personal/docnode/saveFileData", param, "post", true, function (r) {
        if (r.state === true) {
            layui.layer.msg("操作成功~");
            doQuery();
        } else {
            layui.layer.alert("数据保存失败：" + r.msg);
        }
    });
}