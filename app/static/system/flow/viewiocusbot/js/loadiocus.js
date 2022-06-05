/*
 * 波特图
 * @memberOf {TypeName} 
 */
var botItemMap = new Map();
var tilItemMap = new Map();
var JBot = function () {
    this.itemID; // 当前节点ID
    this.butlenth = 0; // 节点长度(边框+位置)
    this.bots = new Array(); // 波特图id数组
    this.map = new Map(); // 波特图记录
    this.rows = 1; // 波特图的行数
    this.cell = 0;
    this.botData;
};
/*
 * 创建波特图节点 @param {Object} title @param {Object} executor @param {Object}
 * excutordpt @param {Object} status @param {Object} creator @param {Object}
 * createTime @param {Object} auditeTime @return {TypeName}
 */
JBot.prototype.creatBotItem = function (title, executor, excutordpt, status,
                                        creator, createTime, auditeTime) {
    var itemid = new UUID().createUUID();
    var itemHTML = '<div id="'
        + itemid
        + '" style="width:210px;height:210px; border:2px solid #eee; background: #D2E9FF; float:left; '
        + ((this.butlenth > 0) ? ('margin-left:60px;') : '')
        + 'cursor:normal;">' // position:absolute;
        // left:'+100+'px;top:'+100+'px;"
        + '<table style="width:100%;height:27px; border-collapse: collapse; table-layout: fixed;">'
        + '<tr style="height:27px;"><td width="60px" height="25px"><span style="font-weight: bold;font-size:12px;">标题:</span></td>'
        + '<td><span id="Activity1_title" style="font-size:12px; line-height:25px;" title="'
        + title
        + '">'
        + title
        + '</span></td></tr></table>'
        + '<div id="Activity1_body" style="border-top:1px solid #000;">'
        + '<table style="width:100%;height:100%; border-collapse: collapse; table-layout: fixed;"><tr style="height:22px;">'
        + '<td width="80px" height="22px"><span style="font-weight: bold;font-size:12px;">执行者:</span></td>'
        + '<td><span style="font-size:12px;" title="'
        + executor
        + '">'
        + executor
        + '</span></td></tr><tr style="height:22px;">'
        + '<td height="22px"><span style="font-weight: bold;font-size:12px;">所属部门:</span></td>'
        + '<td><span style="font-size:12px;" title="'
        + excutordpt
        + '">'
        + excutordpt
        + '</span></td></tr>'
        + '<tr style="height:22px;"><td width="60px">'
        + '<span style="font-weight: bold;font-size:12px;">状态:</span></td>'
        + '<td><span style="font-size:12px;" title="'
        + status
        + '">'
        + status
        + '</span></td></tr>'
        + '<tr style="height:22px;">'
        + '<td width="60px"><span style="font-weight: bold;font-size:12px;">提交人:</span></td>'
        + '<td><span style="font-size:12px;" title="'
        + creator
        + '">'
        + creator
        + '</span></td></tr>'
        + '<tr style="height:22px;">'
        + '<td width="60px"><span style="font-weight: bold;font-size:12px;">提交时间:</span></td>'
        + '<td><span style="font-size:12px;" title="'
        + createTime
        + '">'
        + createTime
        + '</span></td></tr>'
        + '<tr style="height:22px;">'
        + '<td width="60px"><span style="font-weight: bold;font-size:12px;">处理时间:</span></td>'
        + '<td><span style="font-size:12px;" title="' + auditeTime + '">'
        + auditeTime + '</span></td>' + '</tr></table></div></div>';
    this.map.put(itemid, itemHTML); // 记住创建过的botItem
    this.bots.push(itemid);
    this.cell++;
    this.itemID = itemid;
    this.butlenth += 210;
    return itemHTML;
};

JBot.prototype.creatTilItem = function (title, executor, excutordpt, status,
                                        creator, createTime, auditeTime) {
    var itemid = new UUID().createUUID();
    var itemHTML = '标题:' + title + '\n';
    var len = (title.length / 2 > 7) ? (title.length / 2) : 7;
    for (var i = 0; i < len; i++) {
        itemHTML += '——';
    }
    itemHTML += '\n执行者: ' + executor + '\n' + '所属部门: ' + excutordpt + '\n'
        + '状态: ' + status + '\n' + '提交人: ' + creator + '\n' + '提交时间: '
        + createTime + '\n' + '处理时间: ' + auditeTime;
    return itemHTML;
};

/*
 * 创建连接线 @param {Object} startX @param {Object} startY @param {Object} endX
 * @param {Object} endY @return {TypeName}
 */
JBot.prototype.createStockline = function (startX, startY, endX, endY) {
    var str = "<v:line  style='position:absolute;z-index:2;" + "left:"
        + (startX) + ";top:" + (startY) + "' \n" + " to='" + (endX) + ","
        + (endY) + "' \n" + "strokecolor='#555'> \n"
        + "<v:stroke dashstyle='solid' endarrow='classic'/> \n"
        + "</v:line> \n";
    return str;
};

/*
 * 渲染波特图 @param {Object} botBody 显示波特图的div的id @param {Object} botData
 * json数据组[{title:"", executor:"", excutordpt:"", status:"",createTime:"",
 * auditeTime:""},{...}]
 */
JBot.prototype.drawBot = function (botBody, botData) {
    if (!botBody || !botData) {
        mAlert("参数不正确:JBot>botBody,botData!");
        return;
    }
    if (typeof botData == "string") {
        try {
            botData = eval("(" + botData + ")");
        } catch (e) {
            mAlert("参数不正确:JBot>botData必须为json数组!");
            return;
        }
    }
    for (var i = 0; i < botData.length; i++) {
        var Itdata = botData[i];
        if (typeof Itdata == "string")
            Itdata = eval("(" + Itdata + ")");
        if (Itdata.activity != "endActivity") {
            var cuActivity = document.getElementById(Itdata.activity);
            if (!cuActivity) {
                continue;
            }
            if (Itdata.status == "已完成") {
                if (SVG.supported) {
                    cuActivity.style.background = "green";
                    cuActivity.style.border = '1px solid green';
                } else {
                    cuActivity.fillcolor = "green";
                    cuActivity.strokecolor = 'green';
                }
                document.getElementById(Itdata.activity + "_Label").style.color = "white";
            } else if (Itdata.status == "已终止") {
                if (SVG.supported) {
                    cuActivity.style.background = "red";
                    cuActivity.style.border = '1px solid red';
                } else {
                    cuActivity.fillcolor = "red";
                    cuActivity.strokecolor = 'red';
                }
                document.getElementById(Itdata.activity + "_Label").style.color = "white";
            } else if (Itdata.status == "已回退") {
                if (SVG.supported) {
                    cuActivity.style.background = "#FFFF00";
                    cuActivity.style.border = '1px solid #FFFF00';
                } else {
                    cuActivity.fillcolor = "#FFFF00";
                    cuActivity.strokecolor = '#FFFF00';
                }
                document.getElementById(Itdata.activity + "_Label").style.color = "#000";
                var ID = Itdata.id;
                var cuActivity = Itdata.activity;
                var sql = "select SACTIVITY from SA_TASK where SPARENTID = '"
                    + ID + "'";
                tlv8.sqlQueryAction("system", sql, function (r) {
                    if (r.getCount() > 0) {
                        var toActivity = r.getValueByName("SACTIVITY");
                        var groupObj = document
                            .getElementById('group');
                        var Love = groupObj.bindClass;
                        var snode = Love.getNodeById(cuActivity);
                        var n = Love.getNodeById(toActivity);
                        var ln = new PolyLine();// 创建连线
                        ln.setShape("polyline");
                        ln.init();
                        ln.link({
                            fromObj: snode,
                            toObj: n
                        });
                        if (ln.obj.pline) {
                            ln.obj.pline.stroke({
                                color: 'red'
                            });
                        } else {
                            ln.obj.strokecolor = "red";
                        }
                        ln.obj.title = "回退";
                    }
                }, false);
            } else if (Itdata.status == "尚未处理") {
                document.getElementById(Itdata.activity).title = "当前环节:"
                    + document.getElementById(Itdata.activity).title;
                if (SVG.supported) {
                    cuActivity.style.background = "#006699";
                } else {
                    document.getElementById(Itdata.activity).fillcolor = "#006699";
                }
                document.getElementById(Itdata.activity + "_Label").style.color = "white";
            }
        }
    }
};
/*
 * 加载波特图 @param {Object} flowID
 */
JBot.prototype.loadBot = function (flowID) {
    let param = new tlv8.RequestParam();
    param.set("flowID", flowID);
    tlv8.XMLHttpRequest("/flowControl/flowloadbotAction", param, "post", true,
        function (r) {
            if (r.state === false) {
                // mAlert(r.data.message);
                return false;
            } else {
                let botData = r.data;
                let bot = new JBot();
                bot.botData = botData;
                bot.drawBot("main_bot_body", botData);
                if (botData.length > 0) {
                    start.fillcolor = "green";
                    start.textObj.style.color = '#fff';
                }
            }
        });
};

/*
 * 加载波特图 @param {Object} flowID
 */
JBot.prototype.loadBotX = function (flowID) {
    let param = new tlv8.RequestParam();
    param.set("flowID", flowID);
    let r = tlv8
        .XMLHttpRequest("/flowControl/flowloadbotXAction", param, "post", false);
    let red = [];
    if (r.state !== false) {
        let botData = r.data;
        red = botData;
    }
    return red;
};

/*
 * 流程轨迹 @memberOf {TypeName}
 */
const JIocus = function () {
    this.drawfg;
    this.drawItems;
    this.iocusData;
    this.flowID; // 流程标识
    this.taskID; // 任务标识
    this.sData1; // 单据主键
};
/*
 * 加载流程数据 @memberOf {TypeName} @return {TypeName}
 */
JIocus.prototype.loadData = function () {
    botItemMap = new Map();
    tilItemMap = new Map();
    this.flowID = tlv8.RequestURLParam.getParam("flowID"); // 流程标识
    this.taskID = tlv8.RequestURLParam.getParam("taskID"); // 任务标识
    this.sData1 = tlv8.RequestURLParam.getParam("sData1"); // 单据主键
    var currentUrl = tlv8.RequestURLParam.getParam("currentUrl");
    var flowID = this.flowID;
    if ((flowID && flowID != "" && flowID != "undefined") || (currentUrl
        && currentUrl != "" && currentUrl != "undefined")) {
        var JIocus = this;
        var param = new tlv8.RequestParam();
        param.set("flowID", flowID);
        param.set("currentUrl", currentUrl);
        tlv8.XMLHttpRequest("/system/flow/viewiocusbot/flowloadIocusAction", param, "post", true,
            function (r) {
                if (r.state == false) {
                    alert(r.msg);
                    return false;
                } else {
                    let reData = r.data;
                    drow_init(reData.id, reData.name, reData.jsonStr);
                    if (flowID && flowID != "") {
                        let bot = new JBot();
                        bot.loadBot(flowID);
                        JIocus.checkisfinish(flowID);
                        initDesigner(bot.loadBotX(flowID));
                    }
                }
            });
    } else {
        var processID = tlv8.RequestURLParam.getParam("processID"); // 流程图标识
        var param = new tlv8.RequestParam();
        param.set("sprocessid", processID);
        tlv8.XMLHttpRequest("/system/flow/viewiocusbot/getFlowDrawAction", param, "post", true,
            function (r) {
                drow_init(r.sprocessid, r.sprocessname, r.sprocessacty);
            });
    }
};

/*
 * 检查流程是否已结束 @param {Object} flowID @return {TypeName}
 */
JIocus.prototype.checkisfinish = function (flowID) {
    var param = new tlv8.RequestParam();
    param.set("flowID", flowID);
    tlv8.XMLHttpRequest("/flowControl/flowcheckfinishAction", param, "post", true,
        function (r) {
            if (r.state === false) {
                layui.layer.msg(r.msg);
                return false;
            } else {
                if (r.data === true) {
                    if (SVG.supported) {
                        end.style.background = "#green";
                    } else {
                        end.fillcolor = "green";
                    }
                }
            }
        });
};

/*
 * 显示提示信息 @param {Object} obj @return {TypeName}
 */
function show_popup_status(obj) {
    let texts = tilItemMap.get(obj.id);
    if (!texts || texts === "")
        return;
    return texts;
}