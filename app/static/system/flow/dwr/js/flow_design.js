/**
 * 打开流程图
 */
function openFlow() {
    var url = "/system/flow/dwr/dialog/processSelect";
    tlv8.portal.dailog.openDailog("打开流程", url, 1000, 700,
        flowdrowopenback);
}

//打开回调（加载流程图数据）
function flowdrowopenback(rdata) {
    var param = new tlv8.RequestParam();
    param.set("processID", rdata.id);
    tlv8.XMLHttpRequest("/system/flow/dwr/flowloadIocusXAction", param, "post", true,
        function (r) {
            if (r.state == false) {
                layui.layer.alert(r.msg);
                return false;
            } else {
                drow_init(rdata.id, rdata.name, r.data.jsonStr);
                OperationHistory.init();
                var group = document.getElementById('group');
                var Love = group.bindClass;
                window.modeljson = Love.toJson();
            }
        });
}

/**
 * 保存流程图数据
 */
function saveFlowData(love) {
    var param = new tlv8.RequestParam();
    param.set("sprocessid", love.id);
    param.set("sprocessname", love.name);
    param.set("sdrawlg", document.getElementById("group").innerHTML);
    param.set("sprocessacty", love.toJson().toString().encodeSpechars());
    tlv8.XMLHttpRequest("/system/flow/dwr/saveFlowDrawLGAction", param, "post", true,
        function (r) {
            if (r.state == false) {
                layui.layer.alert(r.msg);
            } else {
                layui.layer.msg("保存成功!");
            }
        });
}

/*
 * 选择执行页面
 */
function selectexePage() {
    var url = "/system/flow/dwr/dialog/funcTreeSelect";
    tlv8.portal.dailog.openDailog("选择执行页面", url, 300, 400, function (data) {
        if (data) {
            var win = document.getElementById('propWin');
            $("#" + win.type + '_p_exepage').val(data.surl);
        }
    });
}

/*
 * 选择执行人
 */
function selectexePerson() {
    var url = "/system/dialog/SelectChPsm";
    tlv8.portal.dailog.openDailog("选择执行人", url, 800, 700, function (data) {
        if (data) {
            var win = document.getElementById('propWin');
            $("#" + win.type + '_p_roleID').val(data.id);
            $("#" + win.type + '_p_role').val(data.name);
        }
    });
}

/*
 * 环节标题
 */
function selectexeLabel() {
    var win = document.getElementById('propWin');
    var Olexpression = document.getElementById(win.type + '_p_label').value;
    if (Olexpression) {
        Olexpression = tlv8.encodeURIComponent(Olexpression.toString()
            .decodeSpechars());
    } else {
        Olexpression = "";
    }
    var url = "/system/flow/dwr/dialog/expressionEditor?Olexpression="
        + Olexpression;
    tlv8.portal.dailog.openDailog("环节标题-表达式编辑器", url, 800, 600, function (
        data) {
        try {
            $("#" + win.type + '_p_label').val(data ? data : "");
        } catch (e) {
        }
    });
}

/*
 * 选择执行人范围
 */
function selectRange() {
    var win = document.getElementById('propWin');
    var Olexpression = document.getElementById(win.type + '_p_group').innerHTML;
    if (Olexpression) {
        Olexpression = tlv8.encodeURIComponent(Olexpression.toString()
            .decodeSpechars());
    } else {
        Olexpression = "";
    }
    var url = "/system/flow/dwr/dialog/expressionEditor?Olexpression="
        + Olexpression;
    tlv8.portal.dailog.openDailog("执行人范围-表达式编辑器", url, 800, 600, function (
        data) {
        try {
            $("#" + win.type + '_p_group').html(data ? data : "");
        } catch (e) {
        }
    });
}

// 转发规则
function selectRangeTran() {
    var win = document.getElementById('propWin');
    var Olexpression = document.getElementById(win.type + '_r_transe').innerHTML;
    if (Olexpression) {
        Olexpression = tlv8.encodeURIComponent(Olexpression.toString()
            .decodeSpechars());
    } else {
        Olexpression = "";
    }
    var url = "/system/flow/dwr/dialog/expressionEditor?Olexpression="
        + Olexpression;
    tlv8.portal.dailog.openDailog("转发规则-表达式编辑器", url, 800, 600, function (
        data) {
        try {
            $("#" + win.type + '_r_transe').html(data ? data : "");
        } catch (e) {
        }
    });
}

/*
 * 编辑条件表达式
 */
function selectConditionExpression() {
    var win = document.getElementById('propWin');
    var Olexpression = document.getElementById(win.type + '_p_expression').value;
    if (Olexpression) {
        Olexpression = tlv8.encodeURIComponent(Olexpression.toString()
            .decodeSpechars());
    } else {
        Olexpression = "";
    }
    var url = "/system/flow/dwr/dialog/expressionEditor?operatType=condition&Olexpression="
        + Olexpression;
    tlv8.portal.dailog.openDailog("转发规则-表达式编辑器", url, 800, 600, function (
        data) {
        try {
            $("#" + win.type + '_p_expression').val(data ? data : "");
        } catch (e) {
        }
    });
}