var currentRole = {};

var checkData = new Map();

function gridChecked(data, checked) {
    if (checked) {
        checkData.put(data.sid, data.sname);
    } else {
        checkData.remove(data.sid);
    }
    var kset = checkData.keySet();
    var html = "";
    for (var i in kset) {
        var value = checkData.get(kset[i]);
        html += "<span id='" + kset[i] + "'><input id='" + kset[i] + "' name='"
            + kset[i] + "' type='checkbox' value='" + value
            + "'  onclick='checkItem(event)' class='selectedItem'>" + value + "</input></span>";
    }
    $("#Chtext").html(html);
}

function gridCheckedAll(checked) {
    if (checked) {
        var checkStatus = layui.table.checkStatus('role_list');
        var data = checkStatus.data;
        for (var i in data) {
            checkData.put(data[i].sid, data[i].sname);
        }
    } else {
        checkData = new Map();
    }
    var kset = checkData.keySet();
    var html = "";
    for (var i in kset) {
        var value = checkData.get(kset[i]);
        html += "<span id='" + kset[i] + "'><input id='" + kset[i] + "' name='"
            + kset[i] + "' type='checkbox' value='" + value
            + "'  onclick='checkItem(event)' class='selectedItem'>" + value + "</input></span>";
    }
    $("#Chtext").html(html);
}

// 删除
var chid = '';

function deleteBills() {
    $("span[id='" + chid + "']").remove();
    checkData.remove(chid);
}

function checkItem(event) {
    $("input").bind("click", function () {
        chid = $(this).attr("id");
    });
}

function deleteAll() {
    $("#Chtext").html("");
    checkData = new Map();
    loadList();
}

// 单击确定对话框
function dailogEngin() {
    if (checkData.isEmpty()) {
        layui.layer.alert('请选择需要角色！');
        return false;
    }
    return checkData.keySet().join(",");
}