var SelectExecutor = {};
SelectExecutor.flowID = "";// 流程ID
SelectExecutor.taskID = "";// 任务ID
SelectExecutor.excutorIDs = "";// 执行人ID
SelectExecutor.excutorNames = "";// 执行人名称
SelectExecutor.sData1 = "";// 单据ID
SelectExecutor.type = "";// 环节类型
var activityListStr;// 环节列表
var orgTree; // 执行人机构树
var staticGrid; // 执行人列表

/*
 * 打开对话框时调用 @param {Object} param
 */
var getUrlParam = function (param) {
    activityListStr = param;
    SelectExecutor.init();
};

/*
 * 初始化
 */
SelectExecutor.init = function () {
    SelectExecutor.flowID = tlv8.RequestURLParam.getParam("flowID");
    SelectExecutor.taskID = tlv8.RequestURLParam.getParam("taskID");
    SelectExecutor.sData1 = tlv8.RequestURLParam.getParam("sData1");
    SelectExecutor.creatActivList(activityListStr);
    staticGrid = new StaticGrid("executorList");
    staticGrid
        .init("[{id:'fName',name:'名称',width:80},{id:'fType',name:'类型',width:80}]");
    staticGrid.setRowDbclick(staticGridDbclick);
};

/*
 * 创建执行环节列表
 */
SelectExecutor.creatActivList = function (activityListStr) {
    if (!activityListStr || activityListStr == "undefined") {
        alert("流程配置错误!");
        return;
    }
    var JsonArray;
    if (typeof activityListStr == "string") {
        try {
            JsonArray = eval("(" + activityListStr + ")");
        } catch (e) {
            alert("参数:activityListStr不符合. " + e.message);
        }
    } else {
        JsonArray = activityListStr;
    }
    var listHtml = "";
    for (var i = 0; i < JsonArray.length; i++) {
        var acty = JsonArray[i];
        listHtml += "<span id='"
            + acty.id
            + "' name='"
            + acty.name
            + "' type='"
            + acty.type
            + "' excutorGroup='"
            + acty.excutorGroup
            + "' excutorIDs='"
            + acty.excutorIDs
            + "' excutorNames='"
            + acty.excutorNames
            + "' sData1='"
            + acty.sData1
            + "' type='"
            + acty.type
            + "' style='font-size:12px;line-height:22px;'>"
            + "<input type='checkbox' onclick='SelectExecutor.checkActivty(this)' value='"
            + acty.id
            + "'/>"
            + "<img src='/static/common/image/toolbar/flow/flowdata_activity.png'/>"
            + "<a name='" + acty.id + "' href='javascript:void(0)' title='"
            + acty.name + "'>" + acty.name + "</a>" + "</span><br/>";
    }
    $("#activityList").html(listHtml);
    try {
        var actAs = document.getElementById("activityList")
            .getElementsByTagName("input");
        try {
            actAs[0].click();
        } catch (e) {
            SelectExecutor.checkActivty(actAs[0]);
        }
    } catch (e) {
    }
};

// 选中的环节
SelectExecutor.checkedAct = {
    id: '',
    name: '',
    excutorGroup: '',
    excutorIDs: '',
    excutorNames: '',
    sData1: '',
    type: ''
};

/*
 * 选中环节 @param {Object} obj
 */
SelectExecutor.checkActivty = function (obj) {
    obj.checked = true;
    SelectExecutor.excutorIDs = "";
    SelectExecutor.checkedAct.id = obj.parentNode.id;
    SelectExecutor.checkedAct.type = obj.parentNode.getAttribute("type");
    SelectExecutor.checkedAct.name = obj.parentNode.getAttribute("name");
    SelectExecutor.checkedAct.excutorGroup = obj.parentNode
        .getAttribute("excutorGroup");
    SelectExecutor.checkedAct.excutorIDs = obj.parentNode
        .getAttribute("excutorIDs");
    SelectExecutor.excutorIDs = obj.parentNode.getAttribute("excutorIDs");
    SelectExecutor.checkedAct.excutorNames = obj.parentNode
        .getAttribute("excutorNames");
    SelectExecutor.excutorNames = obj.parentNode.getAttribute("excutorNames");
    let lab = $("a[name=" + obj.parentNode.id + "]")[0];
    SelectExecutor.selectActivty(lab);
    if (SelectExecutor.checkedAct.obj && SelectExecutor.checkedAct.obj != obj) {
        SelectExecutor.checkedAct.obj.checked = false;
        staticGrid.clearData();
    }
    SelectExecutor.checkedAct.obj = obj;
    if (SelectExecutor.checkedAct.type == "end") {
        SelectExecutor.excutorIDs = tlv8.Context.getCurrentPersonID();
        zNodes = [];
        orgTree = $.fn.zTree.init($("#treeDemo"), setting, zNodes);
        staticGrid.clearData();
        return;
    }
    if (typeof SelectExecutor.checkedAct.excutorGroup == "string") {
        let exGroup = SelectExecutor.checkedAct.excutorGroup;
        let ims = tlv8.RequestURLParam.getParam("isflowMonitor");
        let param = new tlv8.RequestParam();
        param.set("exGroup", exGroup);
        param.set("excutorIDs", SelectExecutor.checkedAct.excutorIDs);
        param.set("isflowMonitor", ims);
        tlv8.XMLHttpRequest("/flowControl/getExecutorTree", param, "post", true,
            function (r) {
                let NodeData = r.data;
                if (typeof NodeData == "string") {
                    zNodes = eval("(" + NodeData + ")");
                } else {
                    zNodes = NodeData;
                }
                console.log(zNodes)
                orgTree = $.fn.zTree.init($("#treeDemo"), setting, zNodes);
                // SelectExecutor.initExecutorList();//流转执行人记录
            });
    } else {
        zNodes = [];
        orgTree = $.fn.zTree.init($("#treeDemo"), setting, zNodes);
    }
};

/*
 * 选择环节着色 @param {Object} obj
 */
SelectExecutor.selectActivty = function (obj) {
    try {
        obj.style.background = "#0044BB";
        obj.style.color = "#ffffff";
        obj.parentNode.name = obj.innerHTML;
        let actAs = document.getElementById("activityList")
            .getElementsByTagName("a");
        for (let i = 0; i < actAs.length; i++) {
            if (actAs[i].name != obj.name) {
                actAs[i].style.background = "";
                actAs[i].style.color = "#000000";
            }
        }
    } catch (e) {
    }
};

/*
 * 初始化 执行人列表
 */
SelectExecutor.initExecutorList = function () {
    staticGrid.clearData();
    if (SelectExecutor.excutorIDs != "") {
        let excutorIDs = SelectExecutor.excutorIDs.split(",");
        let excutorNames = SelectExecutor.excutorNames.split(",");
        for (let i = 0; i < excutorIDs.length; i++) {
            let json = {};
            json.rowid = excutorIDs[i];
            json.fName = excutorNames[i];
            json.fType = "人员";
            if (json.rowid && json.rowid != "" && json.rowid != "null") {
                let HaveNode = orgTree.getNodeByTId(json.rowid);
                if (HaveNode) {
                    orgTree.checkNode(HaveNode, true, true, false);
                    if (json.fName && json.fName != "null" && json.fName != "") {
                        staticGrid.addData(json);
                        staticGrid.selectRowById(json.rowid);
                    }
                }
            }
        }
        SelectExecutor.excutorIDs = staticGrid.getRowIds();
    }
};

/*
 * 机构树配置
 */
const setting = {
    view: {
        selectedMulti: false
    },
    check: {
        enable: true
    },
    data: {
        simpleData: {
            enable: true
        }
    },
    callback: {
        beforeCheck: null,
        onCheck: personSelect
    }
};

let zNodes = [];

/*
 * 选择执行人 @param {Object} e @param {Object} treeId @param {Object} treeNode
 */
function personSelect(e, treeId, treeNode) {
    // alert(treeNode.checked);
    // alert(treeNode.children);
    // alert(treeNode.id);
    if (treeNode.type == 'psm' && treeNode.checked) {
        let json = {};
        json.rowid = treeNode.id;
        json.fName = treeNode.name;
        json.fType = '人员';
        if (staticGrid.checkRowId(treeNode.id))
            staticGrid.selectRowById(treeNode.id);
        else {
            staticGrid.addData(json);
            staticGrid.selectRowById(treeNode.id);
        }
    } else if (treeNode.type == 'psm' && !treeNode.checked) {
        staticGrid.removeData(treeNode.id);
    } else if (treeNode.checked) {
        checkChildrenNode(treeNode.children, true);
    } else if (!treeNode.checked) {
        checkChildrenNode(treeNode.children, false);
    }
    SelectExecutor.excutorIDs = staticGrid.getRowIds();
}

let child_count = 0;

function checkChildrenNode(parentNode, isCheck) {
    if (child_count > 100) {
        alert("当前选择用户太多.请手动选择剩余执行者.");
        return;
    }
    for (let i = 0; i < parentNode.length; i++) {
        child_count++;
        var cNode = parentNode[i];
        if (cNode.type == 'psm') {
            if (isCheck) {
                var json = {};
                json.rowid = cNode.id;
                json.fName = cNode.name;
                json.fType = '人员';
                if (staticGrid.checkRowId(cNode.id))
                    staticGrid.selectRowById(cNode.id);
                else {
                    staticGrid.addData(json);
                    staticGrid.selectRowById(cNode.id);
                }
            } else {
                staticGrid.removeData(cNode.id);
            }
        }
        if (cNode.children) {
            checkChildrenNode(cNode.children, isCheck);
        }
    }
}

/*
 * grid双击行事件
 */
function staticGridDbclick(obj, stGrid) {
    let curowid = obj.id;
    let HaveNode = orgTree.getNodeByTId(curowid);
    if (HaveNode) {
        orgTree.checkNode(HaveNode, false, true, false);
    }
    staticGrid.removeData(curowid);
    SelectExecutor.excutorIDs = staticGrid.getRowIds();
}

/*
 * 确定返回 @return {TypeName}
 */
function dailogEngin() {
    if (SelectExecutor.excutorIDs == "") {
        alert("请选择执行人!");
        return false;
    }
    return {
        activity: SelectExecutor.checkedAct.id,
        epersonids: SelectExecutor.excutorIDs,
        flowID: SelectExecutor.flowID,
        taskID: SelectExecutor.taskID,
        sData1: SelectExecutor.sData1,
        type: SelectExecutor.checkedAct.type
    };
}