// 需要从主页面传递的参数
// 流程ID、任务ID,业务单据ID
let flowID, taskID, sData1, opviewID;

function pageInit() {
    flowID = tlv8.RequestURLParam.getParam("flowID");
    taskID = tlv8.RequestURLParam.getParam("taskID");
    sData1 = tlv8.RequestURLParam.getParam("sData1");
    opviewID = tlv8.RequestURLParam.getParam("opviewID");

    dataInit();
    // Send();
    // loadOption();

    $("#sagreetext").focus();
}

function dataInit() {
    let surl = '/system/personal/flowset/myOpinion/dataList?t=' + new Date().getTime();
    $.ajax({
        url: surl,
        type: "get",
        async: true,
        dataType: "json",
        success: function (re) {
            createSelectList(re.data);
        }
    });
}

function createSelectList(data) {
    let listHtml = "<table style='width:100%;'>";
    for (let i = 0; i < data.length; i++) {
        listHtml += "<tr><td style='font-size:13px;cursor:pointer;border-bottom: 1px solid #ddd;padding-bottom:5px;' "
            + "onmouseover='mouseover(this)' onmouseout='mouseout(this)' onclick='selectList(this)'>"
            + data[i].sconclusionname + "</td><tr>";
    }
    listHtml += "</table>";
    $("#selectListView").html(listHtml);
}

function mouseover(obj) {
    obj.style.background = "blue";
    obj.style.color = "#ffffff";
}

function mouseout(obj) {
    obj.style.background = "#ffffff";
    obj.style.color = "#000000";
}

function selectList(obj) {
    $("#sagreetext").val(obj.innerText);
}

function clearData() {
    $("#sagreetext").val("");
}

function saveDatatoMyOp() {
    let opt = $("#sagreetext").val();
    if (!opt || opt === "") {
        layui.layer.alert("意见内容不能为空！");
        return;
    }
    $.ajax({
        url: "/system/personal/flowset/myOpinion",
        type: "post",
        async: false,
        data: {sorder: 0, sconclusionname: opt},
        dataType: "json",
        success: function (re) {
            if (re.state === true) {
                layui.layer.closeAll();
                layui.layer.msg("保存成功！")
                dataInit();
            } else {
                layui.layer.alert("保存失败：" + re.msg);
            }
        }
    });
}

function dailogEngin() {
    $("#submit").click();
    return false;
}

function managemyop() {
    tlv8.portal.openWindow("审批意见设置", "/system/personal/flowset/myOpinion");
}