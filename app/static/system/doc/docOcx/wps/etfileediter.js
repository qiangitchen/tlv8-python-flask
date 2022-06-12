var obj = null;
var office = null;
var dataObj = new Object;

function verify(obj) {
    console.info(obj);
}

function init(tagID, w, h) {
    if (office != undefined)
        office.Application.Quit();
    var iframe;
    iframe = document.getElementById(tagID);
    var codes = [];
    codes.push('<object name="rpcet" id="rpcet_id" type="application/x-et" wpsshieldbutton="false" width="100%" height="100%">');
    codes.push('<param name="quality" value="high" />');
    codes.push('<param name="bgcolor" value="#ffffff" />');
    codes.push('<param name="Enabled" value="1" />');
    codes.push('<param name="allowFullScreen" value="true" />');
    codes.push('</object>');
    iframe.innerHTML = codes.join("");
    office = document.getElementById("rpcet_id");
    window.onbeforeunload = function () {
        office.Application.Quit();
    };
    return office.Application;
}

function Init(tagID) {
    if (office != undefined)
        office.Application.Quit();
    var iframe;
    iframe = document.getElementById(tagID);
    var codes = [];
    codes.push('<object name="rpcet" id="rpcet_id" type="application/x-et" wpsshieldbutton="false" width="100%" height="100%">');
    codes.push('<param name="quality" value="high" />');
    codes.push('<param name="bgcolor" value="#ffffff" />');
    codes.push('<param name="Enabled" value="1" />');
    codes.push('<param name="allowFullScreen" value="true" />');
    codes.push('</object>');
    iframe.innerHTML = codes.join("");
    office = document.getElementById("rpcet_id");
    window.onbeforeunload = function () {
        office.Application.Quit();
    };
    return office.Application;
}

var app = null;

//初始化插件及启动ET
function InitEt() {
    app = Init("wps");
    if (!app) {
        // 为了兼容
        office.setAttribute('data', '/static/system/doc/docOcx/wps/newfile.et');
        var Interval_control = setInterval(
            function () {
                if (app) {
                    clearInterval(Interval_control);
                    AddFile();
                }
            }, 500);
    } else {
        setTimeout(function () {
            AddFile();
        }, 200);
        //RegisterBeforeCloseEvent();
    }
}

function InitFrame() {
    InitEt();
}

function printwps() {
    app.print();
}

function AddFile() {
    var app = office.Application;
    app.openDocumentRemote_s(template, false);
    //var workbook = app.Workbooks.Add();
    //verify(workbook);
    //alert(workbook.Name);
}

function setUserName(username) {
    app.setUserName(username);
}

//显示标记的原始修订
function showRevision0() {
    app.showRevision(0);
}

//显示原始修订
function showRevision1() {
    app.showRevision(1);
}

//显示最终修订
function showRevision2() {
    app.showRevision(2);
}

function saveAs() {
    var aa = app.saveAs();
}

//经典界面隐藏/显示关闭所有文档、保存所有文档按钮
function menuvisibleF() {
    var aa = app.ActiveDocument.CommandBars.get_Item("File").Controls.get_Item("关闭所有文档(&L)").Visible = false;
    var bb = app.ActiveDocument.CommandBars.get_Item("File").Controls.get_Item("保存所有文档(&E)").Visible = false;
}

function menuvisibleT() {
    var aa = app.ActiveDocument.CommandBars.get_Item("File").Controls.get_Item("关闭所有文档(&L)").Visible = true;
    var bb = app.ActiveDocument.CommandBars.get_Item("File").Controls.get_Item("保存所有文档(&E)").Visible = true;
}

//显示工具条
function setToolbarAllVisibleT() {
    var aa = app.setToolbarAllVisible(true);
}

//隐藏工具条
function setToolbarAllVisibleF() {
    var aa = app.setToolbarAllVisible(false);
    layui.layer.alert(aa);
}

//获取文本内容
function getText() {
    var ret = app.ActiveDocument.Content.Text;
    ret = ret.replace(/\r/g, '\r\n');
    return ret;
}

//保护文档
function enableProtectT() {
    app.enableProtect(true);
}

//停止保护
function enableProtectF() {
    app.enableProtect(false);
}

//禁止剪切
function enableCut() {
    var aa = app.enableCut(false);
}

//禁止复制
function enableCopy() {
    var aa = app.enableCopy(false);
}

//隐藏文件菜单
function fileVisible() {
    var ret = app.showCommandByName("Menu Bar", 1, false);
}

//进入手写批注状态
function EnterInkDraw() {
    var aa = app.EnterInkDraw();
    layui.layer.alert(aa);
}

//退出手写批注状态
function ExitInkDraw() {
    var aa = app.ExitInkDraw();
    layui.layer.alert(aa);
}

//文档全屏
function appFullScreen() {
    app.FullScreen();
}

function def_callBackFun(a) {
    var callerName = tlv8.RequestURLParam.getParam("callerName");
    tlv8.portal.callBack(callerName, "rahgereditercalback");
}