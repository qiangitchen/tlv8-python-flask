/**
 * @class tlv8.flw
 * @description 流程组件
 * @param {HTMLDivElement} div
 * @param {object} data tlv8.Data
 * @param {object} setting
 */
tlv8.flw = function (div, data, setting) {
    if (typeof div == "string") {
        try {
            div = document.getElementById(div);
        } catch (e) {
            mAlert("参数div:" + e.message);
            return false;
        }
    }
    if (!setting) {
        setting = {
            autosaveData: true,
            autoclose: true,
            autofilter: true,
            autorefresh: true,
            autoselectext: true,
            item: {
                audit: false,
                back: true,
                out: true,
                transmit: false,
                pause: false,
                stop: false
            }
        };
    }
    if (!setting.auditParam) {
        setting.auditParam = {
            isRequired: false //是否为必须填写意见
        }
    }
    if (!setting.item) {
        setting.item = {
            audit: false,
            back: false,
            out: true,
            transmit: false,
            pause: false,
            stop: true
        };
    } else {
        // if (setting.autosaveData != false)
        //     setting.autosaveData = true;
        if (setting.autoclose != false)
            setting.autoclose = true;
        if (setting.autofilter != false)
            setting.autofilter = true;
        if (setting.autorefresh != false)
            setting.autorefresh = true;
        if (setting.autoselectext != false)
            setting.autoselectext = true;
    }
    this.id = div.id;
    this.Dom = div;
    this.setting = setting;
    /**
     @name data
     @description 流程对应的数据组件 tlv8.Data
     */
    this.data = data;
    /**
     @name processID
     @description 流程标识(流程图ID)
     */
    this.processID = "";
    /**
     @name flowID
     @description 流程ID
     */
    this.flowID = tlv8.RequestURLParam.getParam("flowID");
    /**
     @name taskID
     @description 任务ID
     */
    this.taskID = tlv8.RequestURLParam.getParam("taskID");
    /**
     @name sData1
     @description 流程关联的数据主键
     */
    this.sData1 = tlv8.RequestURLParam.getParam("sData1");
    div.flw = this;
    this.setItemStatus();
    return this;
};
/**
 @name setItemStatus
 @description 设置流程组件按钮状态
 @param {object} item -{
           back : true,//回退按钮
           out : true,//流转按钮
           transmit : false,//转发按钮
           pause : true,//暂停按钮
           stop : "readonly" //终止按钮
         }
 */
tlv8.flw.prototype.setItemStatus = function (item) {
    var setting = this.setting;
    if (!item)
        item = setting.item;
    var activity_pattern = tlv8.RequestURLParam
        .getParam("activity-pattern");
    if (activity_pattern == "detail") {
        item.audit = false;
        item.back = false;
        item.out = false;
        item.transmit = false;
        item.pause = false;
        item.stop = false;
    }
    var div = document.getElementById(this.id);
    var itemHTML = "<table style='height:25px; boder:1px solid #eee;'><tr style='width'>";
    itemHTML += "<td style='boder:1px solid #eee;'>"
        + "<a style='float: left;padding: 3px;'><img id='"
        + this.id
        + "_groupItem' src='"
        + $dpimgpath
        + "toolbar/flw/group.gif' title='流程工具条' onclick='return false;'/></a></td>";
    if (item.audit == false) {
    } else if ((item.audit && item.audit == true)
        || (!item.audit && setting.item.audit == true && item != setting.item)) {
        itemHTML += "<td style='boder:1px solid #eee;' id='" + this.id
            + "_auditItem_Td'>"
            + "<button class='layui-btn layui-btn-sm layui-btn-primary' id='"
            + this.id + "_auditItem' src='" + $dpimgpath
            + "toolbar/flw/audit.gif' title='审批' "
            + "onclick='document.getElementById(\"" + div.id
            + "\").flw.flowAudit();return false;' style='height:30px; width:80px; margin-right:5px;'><i class='layui-icon'>&#xe672;</i>审批</button></td>";
    } else if (item.audit == "readonly"
        || (!item.audit && setting.item.audit == "readonly" && item != setting.item)) {
        itemHTML += "<td style='boder:1px solid #eee;' id='" + this.id
            + "_auditItem_Td'>"
            + "<button class='layui-btn layui-btn-sm layui-btn-disabled' id='"
            + this.id + "_auditItem' disabled='true'  src='" + $dpimgpath
            + "toolbar/flw/un_audit.gif' title='审批' "
            + "onclick='return false;' style='height:30px; width:80px; margin-right:5px;'><i class='layui-icon'>&#xe672;</i>审批</button></td>";
    }
    if (item.back == false) {
    } else if ((item.back && item.back == true && setting.auditParam.isRequired == false)
        || (!item.back && setting.item.back == true && item != setting.item && setting.auditParam.isRequired == false)) {
        itemHTML += "<td style='boder:1px solid #eee;'>"
            + "<button class='layui-btn layui-btn-sm layui-btn-warm' id='"
            + this.id
            + "_backItem' src='"
            + $dpimgpath
            + "toolbar/flw/back.gif' title='回退' onclick='document.getElementById(\""
            + div.id + "\").flw.flowback()' style='height:30px; width:80px; margin-right:5px;'><i class='layui-icon'>&#xe65c;</i>回退</button></td>";
    } else if (item.back == "readonly"
        || setting.auditParam.isRequired == true
        || (!item.back && setting.item.back == "readonly" && item != setting.item)) {
        itemHTML += "<td style='boder:1px solid #eee;'>"
            + "<button class='layui-btn layui-btn-sm layui-btn-disabled' id='"
            + this.id + "_backItem' disabled='true' src='" + $dpimgpath
            + "toolbar/flw/un_back.gif' title='回退' style='height:30px; width:80px; margin-right:5px;'><i class='layui-icon'>&#xe65c;</i>回退</button></td>";
    }
    if (item.out == false) {
    } else if ((item.out == true && setting.auditParam.isRequired == false)
        || (!item.out && setting.item.out == true && item != setting.item && setting.auditParam.isRequired == false)) {
        itemHTML += "<td><button class='layui-btn layui-btn-sm layui-btn-normal' id='"
            + this.id
            + "_outItem' src='"
            + $dpimgpath
            + "toolbar/flw/turn.gif' title='流转' onclick='document.getElementById(\""
            + div.id + "\").flw.flowout()' style='height:30px; width:80px; margin-right:5px;'><i class='layui-icon'>&#xe605;</i>提交</button></td>";
    } else if (item.out == "readonly"
        || setting.auditParam.isRequired == true
        || (item.out && setting.item.out == "readonly" && item != setting.item)) {
        itemHTML += "<td><button class='layui-btn layui-btn-sm layui-btn-disabled' id='"
            + this.id
            + "_outItem' disabled='true' src='"
            + $dpimgpath
            + "toolbar/flw/un_turn.gif' title='流转' style='height:30px; width:80px; margin-right:5px;'><i class='layui-icon'>&#xe605;</i>提交</button></td>";
    }
    if (item.transmit == false) {
    } else if ((item.transmit == true && setting.auditParam.isRequired == false)
        || (!item.transmit && setting.item.transmit == true
            && item != setting.item && setting.auditParam.isRequired == false)) {
        itemHTML += "<td><button class='layui-btn layui-btn-sm layui-btn-primary' id='"
            + this.id
            + "_transmitItem' src='"
            + $dpimgpath
            + "toolbar/flw/redirect.gif' title='转发' onclick='document.getElementById(\""
            + div.id + "\").flw.flowtransmit()' style='height:30px; width:80px; margin-right:5px;'><i class='layui-icon'>&#xe609;</i>转发</button></td>";
    } else if (item.transmit == "readonly"
        || setting.auditParam.isRequired == true
        || (!item.transmit && setting.item.transmit == "readonly" && item != setting.item)) {
        itemHTML += "<td><button class='layui-btn layui-btn-sm layui-btn-disabled' id='"
            + this.id
            + "_transmitItem' disabled='true' src='"
            + $dpimgpath
            + "toolbar/flw/un_redirect.gif' title='转发' style='height:30px; width:80px; margin-right:5px;'><i class='layui-icon'>&#xe609;</i>转发</button></td>";
    }
    if (item.pause == false) {
    } else if ((item.pause == true && setting.auditParam.isRequired == false)
        || (!item.pause && setting.item.pause == true
            && item != setting.item && setting.auditParam.isRequired == false)) {
        itemHTML += "<td><button class='layui-btn layui-btn-sm layui-btn-warm' id='"
            + this.id
            + "_pauseItem' src='"
            + $dpimgpath
            + "toolbar/flw/pause.gif' title='暂停' onclick='document.getElementById(\""
            + div.id + "\").flw.flowpause()' style='height:30px; width:80px; margin-right:5px;'><i class='layui-icon'>&#xe651;</i>暂停</button></td>";
    } else if (item.pause == "readonly"
        || setting.auditParam.isRequired == true
        || (!item.pause && setting.item.pause == "readonly" && item != setting.item)) {
        itemHTML += "<td><button class='layui-btn layui-btn-sm layui-btn-disabled' id='"
            + this.id
            + "_pauseItem' disabled='true' src='"
            + $dpimgpath
            + "toolbar/flw/un_pause.gif' title='暂停' style='height:30px; width:80px; margin-right:5px;'><i class='layui-icon'>&#xe651;</i>暂停</button></td>";
    }
    if (item.stop == false) {
    } else if ((item.stop == true && setting.auditParam.isRequired == false)
        || (!item.stop && setting.item.stop == true && item != setting.item && setting.auditParam.isRequired == false)) {
        itemHTML += "<td><button class='layui-btn layui-btn-sm layui-btn-danger' id='"
            + this.id
            + "_stopItem' src='"
            + $dpimgpath
            + "toolbar/flw/stop.gif' title='终止' onclick='document.getElementById(\""
            + div.id + "\").flw.flowstop()' style='height:30px; width:80px; margin-right:5px;'><i class='layui-icon'>&#xe617;</i>终止</button></td>";
    } else if (item.stop == "readonly"
        || setting.auditParam.isRequired == true
        || (!item.stop && setting.item.stop == "readonly" && item != setting.item)) {
        itemHTML += "<td><button class='layui-btn layui-btn-sm layui-btn-disabled' id='"
            + this.id
            + "_stopItem' disabled='true' src='"
            + $dpimgpath
            + "toolbar/flw/un_stop.gif' title='终止' style='height:30px; width:80px; margin-right:2px;'><i class='layui-icon'>&#xe617;</i>终止</button></td>";
    }
    itemHTML += "<td><button class='layui-btn layui-btn-sm' id='"
        + this.id
        + "_chartItem' src='"
        + $dpimgpath
        + "toolbar/flw/chart.gif' title='查看流程图' onclick='document.getElementById(\""
        + div.id + "\").flw.viewChart()' style='height:30px; width:90px; margin-right:2px;'><i class='layui-icon'>&#xe60d;</i>流程图</button></td>";
    itemHTML += "</tr></table>";
    div.innerHTML = itemHTML;
};
/**
 @name flowAudit
 @description 流程审批
 @param {string} flowID
 @param {string} taskID
 @param {string} ePersonID -执行人ID，多个执行人用逗号(,)分隔
 @param {string} sData1
 */
tlv8.flw.prototype.flowAudit = function (flowID, taskID, ePersonID, sData1) {
    if (this.setting.autosaveData) {
        this.sData1 = this.data.saveData();
    }
    if (!this.setting.auditParam) {
        alert("审批信息未配置！");
        return false;
    }
    var url = "/flw/flwcommo/flowDialog/flow_audit_opinion.html";
    url += "?flowID=" + (flowID ? flowID : this.flowID);
    url += "&taskID=" + (taskID ? taskID : this.taskID);
    url += "&ePersonID=" + ePersonID;
    url += "&sData1=" + (sData1 ? sData1 : this.sData1);
    url += "&flowItem=" + JSON.toString(this.setting.item);
    url += "&auditParam=" + JSON.toString(this.setting.auditParam);
    var taskCompant = this;
    tlv8.portal.dailog.openDailog("审批信息", url, 700, 450, function (auData) {
        if (auData) {
            var onauditOpionWrited = taskCompant.Dom
                .getAttribute("onauditOpionWrited");
            if (onauditOpionWrited) {
                var inFn = eval(onauditOpionWrited);
                if (typeof (inFn) == "function") {
                    var rEvent = {
                        source: taskCompant,
                        taskID: taskCompant.taskID,
                        flowID: taskCompant.flowID,
                        cancel: false,
                        opinion: auData.auditOp
                    };
                    var bfData = inFn(rEvent);
                    try {
                        if (bfData.cancel == true) {
                            return "cancel";
                        }
                    } catch (e) {
                    }
                } else {
                    try {
                        if (inFn.cancel == true) {
                            return "cancel";
                        }
                    } catch (e) {
                    }
                }
            }
            taskCompant.setting.auditParam.isRequired = false;
            taskCompant.setItemStatus(taskCompant.setting.item);
        }
        if (auData == "flowBack") {
            taskCompant.flowback();
        }
        if (auData == "flowOut") {
            taskCompant.flowout();
        }
        if (auData == "flowTransmit") {
            taskCompant.flowtransmit();
        }
        if (auData == "flowPause") {
            taskCompant.flowpause();
        }
        if (auData == "flowStop") {
            taskCompant.flowstop();
        }
    }, false);
};
/**
 @name flowstart
 @description 启动流程
 @param {string} billid -业务表单主键的值
 */
tlv8.flw.prototype.flowstart = function (billid) {
    var flowCompent = this;
    var sData1 = billid || this.sData1;
    var param = new tlv8.RequestParam();
    param.set("sdata1", sData1);
    var srcPath = window.location.pathname;
    if (srcPath.indexOf("?") > 0)
        srcPath = srcPath.substring(0, srcPath.indexOf("?"));
    param.set("srcPath", srcPath);
    param.set("processID", this.processID ? this.processID : "");
    var onBeforeStart = this.Dom.getAttribute("onBeforeStart");
    if (onBeforeStart) {
        var inFn = eval(onBeforeStart);
        if (typeof (inFn) == "function") {
            var rEvent = {
                source: this,
                taskID: this.taskID,
                flowID: this.flowID,
                cancel: false
            };
            var bfData = inFn(rEvent);
            try {
                if (bfData.cancel == true) {
                    return "cancel";
                }
            } catch (e) {
            }
        } else {
            try {
                if (inFn.cancel == true) {
                    return "cancel";
                }
            } catch (e) {
            }
        }
    }
    var onBeforeFlowAction = this.Dom.getAttribute("onBeforeFlowAction");
    if (onBeforeFlowAction) {
        var inFn = eval(onBeforeFlowAction);
        if (typeof (inFn) == "function") {
            var rEvent = {
                source: this,
                taskID: this.taskID,
                flowID: this.flowID,
                cancel: false
            };
            inFn(rEvent);
        }
    }
    tlv8.showModelState(true);
    tlv8.XMLHttpRequest("flowstartAction", param, "post", false, function (
        r) {
        tlv8.showModelState(false);
        if (r.data.flag == "false") {
            alert("操作失败:" + r.data.message);
        } else {
            var flwData = eval("(" + r.data.data + ")");
            flowCompent.processID = flwData.processID;
            flowCompent.flowID = flwData.flowID;
            flowCompent.taskID = flwData.taskID;
            var onStartCommit = flowCompent.Dom.getAttribute("onStartCommit");
            if (onStartCommit) {
                var inFn = eval(onStartCommit);
                if (typeof (inFn) == "function") {
                    var rEvent = {
                        source: flowCompent,
                        taskID: flowCompent.taskID,
                        flowID: flowCompent.flowID,
                        cancel: false
                    };
                    inFn(rEvent);
                }
            }
            var onFlowActionCommit = flowCompent.Dom
                .getAttribute("onFlowActionCommit");
            if (onFlowActionCommit) {
                var inFn = eval(onFlowActionCommit);
                if (typeof (inFn) == "function") {
                    var rEvent = {
                        source: flowCompent,
                        taskID: flowCompent.taskID,
                        flowID: flowCompent.flowID,
                        cancel: false
                    };
                    inFn(rEvent);
                }
            }
        }
        var onAfterStart = flowCompent.Dom.getAttribute("onAfterStart");
        if (onAfterStart) {
            var inFn = eval(onAfterStart);
            if (typeof (inFn) == "function") {
                var rEvent = {
                    source: flowCompent,
                    taskID: flowCompent.taskID,
                    flowID: flowCompent.flowID,
                    cancel: false
                };
                inFn(rEvent);
            }
        }
        var onAfterFlowAction = flowCompent.Dom
            .getAttribute("onAfterFlowAction");
        if (onAfterFlowAction) {
            var inFn = eval(onAfterFlowAction);
            if (typeof (inFn) == "function") {
                var rEvent = {
                    source: flowCompent,
                    taskID: flowCompent.taskID,
                    flowID: flowCompent.flowID,
                    cancel: false
                };
                inFn(rEvent);
            }
        }
    });
};
/**
 @name flowback
 @description 流程回退
 @param {string} flowID
 @param {string} taskID
 */
tlv8.flw.prototype.flowback = function (flowID, taskID) {
    if (!confirm("确定回退流程吗？")) return;
    var flowCompent = this;
    if (this.setting.autosaveData) {
        this.sData1 = this.data.saveData();
    }
    var param = new tlv8.RequestParam();
    var onBeforeBack = this.Dom.getAttribute("onBeforeBack");
    if (onBeforeBack) {
        var inFn = eval(onBeforeBack);
        if (typeof (inFn) == "function") {
            var rEvent = {
                source: this,
                taskID: this.taskID,
                flowID: this.flowID,
                cancel: false
            };
            var bfData = inFn(rEvent);
            try {
                if (bfData.cancel == true) {
                    return "cancel";
                }
            } catch (e) {
            }
        } else {
            try {
                if (inFn.cancel == true) {
                    return "cancel";
                }
            } catch (e) {
            }
        }
    }
    var onBeforeFlowAction = this.Dom.getAttribute("onBeforeFlowAction");
    if (onBeforeFlowAction) {
        var inFn = eval(onBeforeFlowAction);
        if (typeof (inFn) == "function") {
            var rEvent = {
                source: this,
                taskID: this.taskID,
                flowID: this.flowID,
                cancel: false
            };
            inFn(rEvent);
        }
    }
    if (flowID && taskID) {
        param.set("flowID", flowID);
        param.set("taskID", taskID);
        tlv8.XMLHttpRequest("flowbackAction", param, "post", true,
            function (r) {
                tlv8.showModelState(false);
                if (r.data.flag == "false") {
                    alert("操作失败:" + r.data.message);
                } else {
                    var flwData = eval("(" + r.data.data + ")");
                    flowCompent.processID = flwData.processID;
                    flowCompent.flowID = flwData.flowID;
                    flowCompent.taskID = flwData.taskID;
                    var onBackCommit = flowCompent.Dom
                        .getAttribute("onBackCommit");
                    if (onBackCommit) {
                        var inFn = eval(onBackCommit);
                        if (typeof (inFn) == "function") {
                            var rEvent = {
                                source: flowCompent,
                                taskID: flowCompent.taskID,
                                flowID: flowCompent.flowID,
                                cancel: false
                            };
                            inFn(rEvent);
                        }
                    }
                    var onFlowActionCommit = flowCompent.Dom
                        .getAttribute("onFlowActionCommit");
                    if (onFlowActionCommit) {
                        var inFn = eval(onFlowActionCommit);
                        if (typeof (inFn) == "function") {
                            var rEvent = {
                                source: flowCompent,
                                taskID: flowCompent.taskID,
                                flowID: flowCompent.flowID,
                                cancel: false
                            };
                            inFn(rEvent);
                        }
                    }
                    if (flowCompent.setting.autoclose == true) {
                        tlv8.portal.closeWindow();
                    }
                }
                var onAfterBack = flowCompent.Dom
                    .getAttribute("onAfterBack");
                if (onAfterBack) {
                    var inFn = eval(onAfterBack);
                    if (typeof (inFn) == "function") {
                        var rEvent = {
                            source: flowCompent,
                            taskID: flowCompent.taskID,
                            flowID: flowCompent.flowID,
                            cancel: false
                        };
                        inFn(rEvent);
                    }
                }
                var onAfterFlowAction = flowCompent.Dom
                    .getAttribute("onAfterFlowAction");
                if (onAfterFlowAction) {
                    var inFn = eval(onAfterFlowAction);
                    if (typeof (inFn) == "function") {
                        var rEvent = {
                            source: flowCompent,
                            taskID: flowCompent.taskID,
                            flowID: flowCompent.flowID,
                            cancel: false
                        };
                        inFn(rEvent);
                    }
                }
            });
        tlv8.showModelState(true);
    } else if (this.flowID && this.flowID != "" && this.taskID
        && this.taskID != "") {
        param.set("flowID", this.flowID);
        param.set("taskID", this.taskID);
        tlv8.XMLHttpRequest("flowbackAction", param, "post", true,
            function (r) {
                tlv8.showModelState(false);
                if (r.data.flag == "false") {
                    alert("操作失败:" + r.data.message);
                } else {
                    var flwData = eval("(" + r.data.data + ")");
                    flowCompent.processID = flwData.processID;
                    flowCompent.flowID = flwData.flowID;
                    flowCompent.taskID = flwData.taskID;
                    var onBackCommit = flowCompent.Dom
                        .getAttribute("onBackCommit");
                    if (onBackCommit) {
                        var inFn = eval(onBackCommit);
                        if (typeof (inFn) == "function") {
                            var rEvent = {
                                source: flowCompent,
                                taskID: flowCompent.taskID,
                                flowID: flowCompent.flowID,
                                cancel: false
                            };
                            inFn(rEvent);
                        }
                    }
                    var onFlowActionCommit = flowCompent.Dom
                        .getAttribute("onFlowActionCommit");
                    if (onFlowActionCommit) {
                        var inFn = eval(onFlowActionCommit);
                        if (typeof (inFn) == "function") {
                            var rEvent = {
                                source: flowCompent,
                                taskID: flowCompent.taskID,
                                flowID: flowCompent.flowID,
                                cancel: false
                            };
                            inFn(rEvent);
                        }
                    }
                    if (flowCompent.setting.autoclose == true) {
                        tlv8.portal.closeWindow();
                    }
                }
                var onAfterBack = flowCompent.Dom
                    .getAttribute("onAfterBack");
                if (onAfterBack) {
                    var inFn = eval(onAfterBack);
                    if (typeof (inFn) == "function") {
                        var rEvent = {
                            source: flowCompent,
                            taskID: flowCompent.taskID,
                            flowID: flowCompent.flowID,
                            cancel: false
                        };
                        inFn(rEvent);
                    }
                }
                var onAfterFlowAction = flowCompent.Dom
                    .getAttribute("onAfterFlowAction");
                if (onAfterFlowAction) {
                    var inFn = eval(onAfterFlowAction);
                    if (typeof (inFn) == "function") {
                        var rEvent = {
                            source: flowCompent,
                            taskID: flowCompent.taskID,
                            flowID: flowCompent.flowID,
                            cancel: false
                        };
                        inFn(rEvent);
                    }
                }
            });
        tlv8.showModelState(true);
    } else {
        mAlert("未指定任务.");
    }
};
/**
 @name flowout
 @description 流程流转
 @param {string} flowID
 @param {string} taskID
 @param {string} ePersonID -执行人ID，多个执行人用逗号(,)分隔
 @param {string} sData1
 */
tlv8.flw.prototype.flowout = function (flowID, taskID, ePersonID, sData1) {
    var flowCompent = this;
    if (this.setting.autosaveData) {
        this.sData1 = this.data.saveData();
    }
    var onBeforeAdvance = this.Dom.getAttribute("onBeforeAdvance");
    if (onBeforeAdvance) {
        var inFn = eval(onBeforeAdvance);
        if (typeof (inFn) == "function") {
            var rEvent = {
                source: this,
                taskID: this.taskID,
                flowID: this.flowID,
                cancel: false
            };
            var bfData = inFn(rEvent);
            try {
                if (bfData.cancel == true) {
                    return "cancel";
                }
            } catch (e) {
            }
        } else {
            try {
                if (inFn.cancel == true) {
                    return "cancel";
                }
            } catch (e) {
            }
        }
    }
    var onBeforeFlowAction = this.Dom.getAttribute("onBeforeFlowAction");
    if (onBeforeFlowAction) {
        var inFn = eval(onBeforeFlowAction);
        if (typeof (inFn) == "function") {
            var rEvent = {
                source: this,
                taskID: this.taskID,
                flowID: this.flowID,
                cancel: false
            };
            inFn(rEvent);
        }
    }
    var param = new tlv8.RequestParam();
    if (!sData1)
        sData1 = this.data.rowid;
    if (flowID && taskID && ePersonID) {
        param.set("flowID", flowID);
        param.set("taskID", taskID);
        param.set("epersonids", ePersonID);
        param.set("sdata1", sData1);
        tlv8
            .XMLHttpRequest(
                "flowoutAction",
                param,
                "post",
                true,
                function (r) {
                    tlv8.showModelState(false);
                    if (r.data.flag == "false") {
                        alert("操作失败:" + r.data.message);
                    } else if (r.data.flag == "msg") {
                        alert(r.data.message);
                        if (flowCompent.setting.autoclose == true) {
                            tlv8.showSate(false);
                            tlv8.portal.closeWindow();
                        }
                    } else if (r.data.flag == "select") {
                        try {
                            var reActData = eval("(" + r.data.data
                                + ")");
                            flowCompent.processID = reActData.processID;
                            flowCompent.flowID = reActData.flowID;
                            flowCompent.taskID = reActData.taskID;
                            var activityListStr = reActData.activityListStr;
                            var exe_selct_url = "/flw/flwcommo/flowDialog/Select_executor.html";
                            exe_selct_url += "?flowID="
                                + reActData.flowID;
                            exe_selct_url += "&taskID="
                                + reActData.taskID;
                            tlv8.portal.dailog.openDailog('流程信息',
                                exe_selct_url, 800, 600,
                                flowEngion, null, null,
                                activityListStr);
                        } catch (e) {
                            alert("流转失败!m:" + e.message);
                        }
                    } else {
                        var flwData = eval("(" + r.data.data + ")");
                        flowCompent.processID = flwData.processID;
                        flowCompent.flowID = flwData.flowID;
                        flowCompent.taskID = flwData.taskID;
                        var onAdvanceCommit = flowCompent.Dom
                            .getAttribute("onAdvanceCommit");
                        if (onAdvanceCommit) {
                            var inFn = eval(onAdvanceCommit);
                            if (typeof (inFn) == "function") {
                                var rEvent = {
                                    source: flowCompent,
                                    taskID: flowCompent.taskID,
                                    flowID: flowCompent.flowID,
                                    cancel: false
                                };
                                inFn(rEvent);
                            }
                        }
                        var onFlowActionCommit = flowCompent.Dom
                            .getAttribute("onFlowActionCommit");
                        if (onFlowActionCommit) {
                            var inFn = eval(onFlowActionCommit);
                            if (typeof (inFn) == "function") {
                                var rEvent = {
                                    source: flowCompent,
                                    taskID: flowCompent.taskID,
                                    flowID: flowCompent.flowID,
                                    cancel: false
                                };
                                inFn(rEvent);
                            }
                        }
                        if (flowCompent.setting.autoclose == true) {
                            tlv8.portal.closeWindow();
                        }
                    }
                    var onAfterAdvance = flowCompent.Dom
                        .getAttribute("onAfterAdvance");
                    if (onAfterAdvance) {
                        var inFn = eval(onAfterAdvance);
                        if (typeof (inFn) == "function") {
                            var rEvent = {
                                source: flowCompent,
                                taskID: flowCompent.taskID,
                                flowID: flowCompent.flowID,
                                cancel: false
                            };
                            inFn(rEvent);
                        }
                    }
                    var onAfterFlowAction = flowCompent.Dom
                        .getAttribute("onAfterFlowAction");
                    if (onAfterFlowAction) {
                        var inFn = eval(onAfterFlowAction);
                        if (typeof (inFn) == "function") {
                            var rEvent = {
                                source: flowCompent,
                                taskID: flowCompent.taskID,
                                flowID: flowCompent.flowID,
                                cancel: false
                            };
                            inFn(rEvent);
                        }
                    }
                });
        tlv8.showModelState(true);
    } else if (this.flowID && this.flowID != "" && this.taskID
        && this.taskID != "") {
        param.set("flowID", this.flowID);
        param.set("taskID", this.taskID);
        param.set("sdata1", sData1);
        tlv8
            .XMLHttpRequest(
                "flowoutAction",
                param,
                "post",
                true,
                function (r) {
                    tlv8.showModelState(false);
                    if (r.data.flag == "false") {
                        alert("操作失败:" + r.data.message);
                    } else if (r.data.flag == "msg") {
                        alert(r.data.message);
                        if (flowCompent.setting.autoclose == true) {
                            tlv8.showSate(false);
                            tlv8.portal.closeWindow();
                        }
                    } else if (r.data.flag == "select") {
                        try {
                            var reActData = eval("(" + r.data.data
                                + ")");
                            flowCompent.processID = reActData.processID;
                            flowCompent.flowID = reActData.flowID;
                            flowCompent.taskID = reActData.taskID;
                            var activityListStr = reActData.activityListStr;
                            var exe_selct_url = "/flw/flwcommo/flowDialog/Select_executor.html";
                            exe_selct_url += "?flowID="
                                + reActData.flowID;
                            exe_selct_url += "&taskID="
                                + reActData.taskID;
                            tlv8.portal.dailog.openDailog('流程信息',
                                exe_selct_url, 800, 600,
                                flowEngion, null, null,
                                activityListStr);
                        } catch (e) {
                            alert("流转失败!m:" + e.message);
                        }
                    } else {
                        var flwData = eval("(" + r.data.data + ")");
                        flowCompent.processID = flwData.processID;
                        flowCompent.flowID = flwData.flowID;
                        flowCompent.taskID = flwData.taskID;
                        var onAdvanceCommit = flowCompent.Dom
                            .getAttribute("onAdvanceCommit");
                        if (onAdvanceCommit) {
                            var inFn = eval(onAdvanceCommit);
                            if (typeof (inFn) == "function") {
                                var rEvent = {
                                    source: flowCompent,
                                    taskID: flowCompent.taskID,
                                    flowID: flowCompent.flowID,
                                    cancel: false
                                };
                                inFn(rEvent);
                            }
                        }
                        var onFlowActionCommit = flowCompent.Dom
                            .getAttribute("onFlowActionCommit");
                        if (onFlowActionCommit) {
                            var inFn = eval(onFlowActionCommit);
                            if (typeof (inFn) == "function") {
                                var rEvent = {
                                    source: flowCompent,
                                    taskID: flowCompent.taskID,
                                    flowID: flowCompent.flowID,
                                    cancel: false
                                };
                                inFn(rEvent);
                            }
                        }
                        // 流程结束
                        if (r.data.flag == "end") {
                            var onFlowEndCommit = flowCompent.Dom
                                .getAttribute("onFlowEndCommit");
                            if (onFlowEndCommit) {
                                var inFnend = eval(onFlowEndCommit);
                                if (typeof (inFnend) == "function") {
                                    var rEvent = {
                                        source: flowCompent,
                                        taskID: flowCompent.taskID,
                                        flowID: flowCompent.flowID,
                                        cancel: false
                                    };
                                    inFnend(rEvent);
                                }
                            }
                        }
                        if (flowCompent.setting.autoclose == true) {
                            tlv8.portal.closeWindow();
                        }
                    }
                    var onAfterAdvance = flowCompent.Dom
                        .getAttribute("onAfterAdvance");
                    if (onAfterAdvance) {
                        var inFn = eval(onAfterAdvance);
                        if (typeof (inFn) == "function") {
                            var rEvent = {
                                source: flowCompent,
                                taskID: flowCompent.taskID,
                                flowID: flowCompent.flowID,
                                cancel: false
                            };
                            inFn(rEvent);
                        }
                    }
                    var onAfterFlowAction = flowCompent.Dom
                        .getAttribute("onAfterFlowAction");
                    if (onAfterFlowAction) {
                        var inFn = eval(onAfterFlowAction);
                        if (typeof (inFn) == "function") {
                            var rEvent = {
                                source: flowCompent,
                                taskID: flowCompent.taskID,
                                flowID: flowCompent.flowID,
                                cancel: false
                            };
                            inFn(rEvent);
                        }
                    }
                });
        tlv8.showModelState(true);
    } else {
        var srcPath = window.location.pathname;
        if (srcPath.indexOf("?") > 0)
            srcPath = srcPath.substring(0, srcPath.indexOf("?"));
        param.set("srcPath", srcPath);
        param.set("processID", this.processID ? this.processID : "");
        param.set("sdata1", sData1);
        tlv8
            .XMLHttpRequest(
                "flowoutAction",
                param,
                "post",
                true,
                function (r) {
                    tlv8.showModelState(false);
                    if (r.data.flag == "false") {
                        alert("启动流程失败:" + r.data.message);
                    } else if (r.data.flag == "msg") {
                        alert(r.data.message);
                        if (flowCompent.setting.autoclose == true) {
                            tlv8.showSate(false);
                            tlv8.portal.closeWindow();
                        }
                    } else if (r.data.flag == "select") {
                        try {
                            var reActData = eval("(" + r.data.data
                                + ")");
                            flowCompent.processID = reActData.processID;
                            flowCompent.flowID = reActData.flowID;
                            flowCompent.taskID = reActData.taskID;
                            var activityListStr = reActData.activityListStr;
                            var exe_selct_url = "/flw/flwcommo/flowDialog/Select_executor.html";
                            exe_selct_url += "?flowID="
                                + reActData.flowID;
                            exe_selct_url += "&taskID="
                                + reActData.taskID;
                            tlv8.portal.dailog.openDailog('流程信息',
                                exe_selct_url, 800, 600,
                                flowEngion, null, null,
                                activityListStr);
                        } catch (e) {
                            alert("流转失败!m:" + e.message);
                        }
                        window.flwquery = false;
                    } else {
                        var flwData = eval("(" + r.data.data + ")");
                        flowCompent.processID = flwData.processID;
                        flowCompent.flowID = flwData.flowID;
                        flowCompent.taskID = flwData.taskID;
                        window.flwquery = true;
                    }
                    var onAfterAdvance = flowCompent.Dom
                        .getAttribute("onAfterAdvance");
                    if (onAfterAdvance) {
                        var inFn = eval(onAfterAdvance);
                        if (typeof (inFn) == "function") {
                            var rEvent = {
                                source: flowCompent,
                                taskID: flowCompent.taskID,
                                flowID: flowCompent.flowID,
                                cancel: false
                            };
                            inFn(rEvent);
                        }
                    }
                    var onAfterFlowAction = flowCompent.Dom
                        .getAttribute("onAfterFlowAction");
                    if (onAfterFlowAction) {
                        var inFn = eval(onAfterFlowAction);
                        if (typeof (inFn) == "function") {
                            var rEvent = {
                                source: flowCompent,
                                taskID: flowCompent.taskID,
                                flowID: flowCompent.flowID,
                                cancel: false
                            };
                            inFn(rEvent);
                        }
                    }
                    if (window.flwquery
                        && flowCompent.setting.autoclose == true) {
                        tlv8.portal.closeWindow();
                    }
                });
        tlv8.showModelState(true);
    }
    var flowEngion = function (backData) {
        param.set("flowID", backData.flowID);
        param.set("taskID", backData.taskID);
        param.set("afterActivity", backData.activity);
        param.set("epersonids", backData.epersonids);
        tlv8.XMLHttpRequest("flowoutAction", param, "post", true,
            function (r) {
                if (r.data.flag == "false") {
                    alert(r.data.message);
                    return false;
                }
                var onAdvanceCommit = flowCompent.Dom
                    .getAttribute("onAdvanceCommit");
                if (onAdvanceCommit) {
                    var inFn = eval(onAdvanceCommit);
                    if (typeof (inFn) == "function") {
                        var rEvent = {
                            source: flowCompent,
                            taskID: flowCompent.taskID,
                            flowID: flowCompent.flowID,
                            cancel: false
                        };
                        inFn(rEvent);
                    }
                }
                var onFlowActionCommit = flowCompent.Dom
                    .getAttribute("onFlowActionCommit");
                if (onFlowActionCommit) {
                    var inFn = eval(onFlowActionCommit);
                    if (typeof (inFn) == "function") {
                        var rEvent = {
                            source: flowCompent,
                            taskID: flowCompent.taskID,
                            flowID: flowCompent.flowID,
                            cancel: false
                        };
                        inFn(rEvent);
                    }
                }
                if (backData.type == "end") {
                    var onFlowEndCommit = flowCompent.Dom
                        .getAttribute("onFlowEndCommit");
                    if (onFlowEndCommit) {
                        var inFnend = eval(onFlowEndCommit);
                        if (typeof (inFnend) == "function") {
                            var rEvent = {
                                source: flowCompent,
                                taskID: flowCompent.taskID,
                                flowID: flowCompent.flowID,
                                cancel: false
                            };
                            inFnend(rEvent);
                        }
                    }
                }
                if (flowCompent.setting.autoclose == true) {
                    tlv8.showSate(false);
                    tlv8.portal.closeWindow();
                }
            });
    };
};
/**
 @name flowtransmit
 @description 流程转发
 @param {string} flowID
 @param {string} taskID
 @param {string} ePersonID -执行人ID，多个执行人用逗号(,)分隔
 */
tlv8.flw.prototype.flowtransmit = function (flowID, taskID, ePersonID) {
    var flowCompent = this;
    if (this.setting.autosaveData) {
        this.sData1 = this.data.saveData();
    }
    var onBeforeTransfer = this.Dom.getAttribute("onBeforeTransfer");
    if (onBeforeTransfer) {
        var inFn = eval(onBeforeTransfer);
        if (typeof (inFn) == "function") {
            var rEvent = {
                source: this,
                taskID: this.taskID,
                flowID: this.flowID,
                cancel: false
            };
            var bfData = inFn(rEvent);
            try {
                if (bfData.cancel == true) {
                    return "cancel";
                }
            } catch (e) {
            }
        } else {
            try {
                if (inFn.cancel == true) {
                    return "cancel";
                }
            } catch (e) {
            }
        }
    }
    var onBeforeFlowAction = this.Dom.getAttribute("onBeforeFlowAction");
    if (onBeforeFlowAction) {
        var inFn = eval(onBeforeFlowAction);
        if (typeof (inFn) == "function") {
            var rEvent = {
                source: this,
                taskID: this.taskID,
                flowID: this.flowID,
                cancel: false
            };
            inFn(rEvent);
        }
    }
    var param = new tlv8.RequestParam();
    if (!sData1)
        var sData1 = this.data.rowid;
    if (flowID && taskID) {
        param.set("flowID", flowID);
        param.set("taskID", taskID);
        param.set("epersonids", ePersonID ? ePersonID : "");
        param.set("sdata1", sData1);
        tlv8
            .XMLHttpRequest(
                "flowtransmitAction",
                param,
                "post",
                true,
                function (r) {
                    tlv8.showModelState(false);
                    if (r.data.flag == "false") {
                        alert("操作失败:" + r.data.message);
                    } else if (r.data.flag == "select") {
                        try {
                            var reActData = eval("(" + r.data.data
                                + ")");
                            var activityListStr = reActData.activityListStr;
                            var exe_selct_url = "/flw/flwcommo/flowDialog/Select_executor.html";
                            exe_selct_url += "?flowID="
                                + reActData.flowID;
                            exe_selct_url += "&taskID="
                                + reActData.taskID;
                            tlv8.portal.dailog.openDailog('流程转发',
                                exe_selct_url, 800, 600,
                                flowTransEngion, null, null,
                                activityListStr);
                        } catch (e) {
                            alert("流转失败!m:" + e.message);
                        }
                    } else {
                        var flwData = eval("(" + r.data.data + ")");
                        flowCompent.processID = flwData.processID;
                        flowCompent.flowID = flwData.flowID;
                        flowCompent.taskID = flwData.taskID;
                        var onTransferCommit = this.Dom
                            .getAttribute("onTransferCommit");
                        if (onTransferCommit) {
                            var inFn = eval(onTransferCommit);
                            if (typeof (inFn) == "function") {
                                var rEvent = {
                                    source: flowCompent,
                                    taskID: flowCompent.taskID,
                                    flowID: flowCompent.flowID,
                                    cancel: false
                                };
                                inFn(rEvent);
                            }
                        }
                        var onFlowActionCommit = this.Dom
                            .getAttribute("onFlowActionCommit");
                        if (onFlowActionCommit) {
                            var inFn = eval(onFlowActionCommit);
                            if (typeof (inFn) == "function") {
                                var rEvent = {
                                    source: flowCompent,
                                    taskID: flowCompent.taskID,
                                    flowID: flowCompent.flowID,
                                    cancel: false
                                };
                                inFn(rEvent);
                            }
                        }
                        if (flowCompent.setting.autoclose == true) {
                            tlv8.showSate(false);
                            tlv8.portal.closeWindow();
                        }
                    }
                });
        tlv8.showModelState(true);
    } else {
        var taskid = this.taskID;
        tlv8.portal.dailog
            .openDailog(
                "选择执行人",
                "/comon/SelectDialogPsn/singleSelectPsn.html",
                500,
                350,
                function (re) {
                    var param = new tlv8.RequestParam();
                    param.set("taskID", taskid);
                    param.set("epersonids", re.rowid);
                    tlv8
                        .XMLHttpRequest(
                            "ChangeFlowExcutorAction",
                            param,
                            "POST",
                            true,
                            function (r) {
                                if (r.data.flag == "false") {
                                    alert(r.data.message);
                                } else {
                                    var onTransferCommit = flowCompent.Dom
                                        .getAttribute("onTransferCommit");
                                    if (onTransferCommit) {
                                        var inFn = eval(onTransferCommit);
                                        if (typeof (inFn) == "function") {
                                            var rEvent = {
                                                source: flowCompent,
                                                taskID: flowCompent.taskID,
                                                flowID: flowCompent.flowID,
                                                cancel: false
                                            };
                                            inFn(rEvent);
                                        }
                                    }
                                    var onFlowActionCommit = flowCompent.Dom
                                        .getAttribute("onFlowActionCommit");
                                    if (onFlowActionCommit) {
                                        var inFn = eval(onFlowActionCommit);
                                        if (typeof (inFn) == "function") {
                                            var rEvent = {
                                                source: flowCompent,
                                                taskID: flowCompent.taskID,
                                                flowID: flowCompent.flowID,
                                                cancel: false
                                            };
                                            inFn(rEvent);
                                        }
                                    }
                                    if (flowCompent.setting.autoclose == true) {
                                        tlv8
                                            .showSate(false);
                                        tlv8.portal
                                            .closeWindow();
                                    }
                                }
                            });
                });
    }
    var onAfterTransfer = this.Dom.getAttribute("onAfterTransfer");
    if (onAfterTransfer) {
        var inFn = eval(onAfterTransfer);
        if (typeof (inFn) == "function") {
            var rEvent = {
                source: this,
                taskID: this.taskID,
                flowID: this.flowID,
                cancel: false
            };
            inFn(rEvent);
        }
    }
    var onAfterFlowAction = this.Dom.getAttribute("onAfterFlowAction");
    if (onAfterFlowAction) {
        var inFn = eval(onAfterFlowAction);
        if (typeof (inFn) == "function") {
            var rEvent = {
                source: this,
                taskID: this.taskID,
                flowID: this.flowID,
                cancel: false
            };
            inFn(rEvent);
        }
    }
    var flowTransEngion = function (backData) {
        param.set("flowID", backData.flowID);
        param.set("taskID", backData.taskID);
        param.set("afterActivity", backData.activity);
        param.set("epersonids", backData.epersonids);
        tlv8.XMLHttpRequest("flowtransmitAction", param, "post", true,
            function (r) {
                var flwData = eval("(" + r.data.data + ")");
                flowCompent.processID = flwData.processID;
                flowCompent.flowID = flwData.flowID;
                flowCompent.taskID = flwData.taskID;
                var onTransferCommit = flowCompent.Dom
                    .getAttribute("onTransferCommit");
                if (onTransferCommit) {
                    var inFn = eval(onTransferCommit);
                    if (typeof (inFn) == "function") {
                        var rEvent = {
                            source: flowCompent,
                            taskID: flowCompent.taskID,
                            flowID: flowCompent.flowID,
                            cancel: false
                        };
                        inFn(rEvent);
                    }
                }
                var onFlowActionCommit = flowCompent.Dom
                    .getAttribute("onFlowActionCommit");
                if (onFlowActionCommit) {
                    var inFn = eval(onFlowActionCommit);
                    if (typeof (inFn) == "function") {
                        var rEvent = {
                            source: flowCompent,
                            taskID: flowCompent.taskID,
                            flowID: flowCompent.flowID,
                            cancel: false
                        };
                        inFn(rEvent);
                    }
                }
            });
    };
};
/**
 @name flowpause
 @description 流程暂停
 @param {string} flowID
 @param {string} taskID
 */
tlv8.flw.prototype.flowpause = function (flowID, taskID) {
    var flowCompent = this;
    if (this.setting.autosaveData) {
        this.sData1 = this.data.saveData();
    }
    if (!confirm("流程暂停后只能到任务中心激活.\n  确定暂停吗?"))
        return;
    var onBeforeSuspend = this.Dom.getAttribute("onBeforeSuspend");
    if (onBeforeSuspend) {
        var inFn = eval(onBeforeSuspend);
        if (typeof (inFn) == "function") {
            var rEvent = {
                source: this,
                taskID: this.taskID,
                flowID: this.flowID,
                cancel: false
            };
            var bfData = inFn(rEvent);
            try {
                if (bfData.cancel == true) {
                    return "cancel";
                }
            } catch (e) {
            }
        } else {
            try {
                if (inFn.cancel == true) {
                    return "cancel";
                }
            } catch (e) {
            }
        }
    }
    var onBeforeFlowAction = this.Dom.getAttribute("onBeforeFlowAction");
    if (onBeforeFlowAction) {
        var inFn = eval(onBeforeFlowAction);
        if (typeof (inFn) == "function") {
            var rEvent = {
                source: this,
                taskID: this.taskID,
                flowID: this.flowID,
                cancel: false
            };
            inFn(rEvent);
        }
    }
    var param = new tlv8.RequestParam();
    if (flowID && taskID) {
        param.set("flowID", flowID);
        param.set("taskID", taskID);
        tlv8.XMLHttpRequest("flowpauseAction", param, "post", true,
            function (r) {
                tlv8.showModelState(false);
                if (r.data.flag == "false") {
                    alert("操作失败:" + r.data.message);
                } else {
                    var onSuspendCommit = flowCompent.Dom
                        .getAttribute("onSuspendCommit");
                    if (onSuspendCommit) {
                        var inFn = eval(onSuspendCommit);
                        if (typeof (inFn) == "function") {
                            var rEvent = {
                                source: flowCompent,
                                taskID: flowCompent.taskID,
                                flowID: flowCompent.flowID,
                                cancel: false
                            };
                            inFn(rEvent);
                        }
                    }
                    var onFlowActionCommit = flowCompent.Dom
                        .getAttribute("onFlowActionCommit");
                    if (onFlowActionCommit) {
                        var inFn = eval(onFlowActionCommit);
                        if (typeof (inFn) == "function") {
                            var rEvent = {
                                source: flowCompent,
                                taskID: flowCompent.taskID,
                                flowID: flowCompent.flowID,
                                cancel: false
                            };
                            inFn(rEvent);
                        }
                    }
                    if (flowCompent.setting.autoclose)
                        tlv8.portal.closeWindow();
                }
                var onAfterSuspend = flowCompent.Dom
                    .getAttribute("onAfterSuspend");
                if (onAfterSuspend) {
                    var inFn = eval(onAfterSuspend);
                    if (typeof (inFn) == "function") {
                        var rEvent = {
                            source: flowCompent,
                            taskID: flowCompent.taskID,
                            flowID: flowCompent.flowID,
                            cancel: false
                        };
                        inFn(rEvent);
                    }
                }
                var onAfterFlowAction = flowCompent.Dom
                    .getAttribute("onAfterFlowAction");
                if (onAfterFlowAction) {
                    var inFn = eval(onAfterFlowAction);
                    if (typeof (inFn) == "function") {
                        var rEvent = {
                            source: flowCompent,
                            taskID: flowCompent.taskID,
                            flowID: flowCompent.flowID,
                            cancel: false
                        };
                        inFn(rEvent);
                    }
                }
            });
        tlv8.showModelState(true);
    } else if (this.flowID && this.flowID != "" && this.taskID
        && this.taskID != "") {
        param.set("flowID", this.flowID);
        param.set("taskID", this.taskID);
        tlv8.XMLHttpRequest("flowpauseAction", param, "post", true,
            function (r) {
                tlv8.showModelState(false);
                if (r.data.flag == "false") {
                    alert("操作失败:" + r.data.message);
                } else {
                    var onSuspendCommit = flowCompent.Dom
                        .getAttribute("onSuspendCommit");
                    if (onSuspendCommit) {
                        var inFn = eval(onSuspendCommit);
                        if (typeof (inFn) == "function") {
                            var rEvent = {
                                source: flowCompent,
                                taskID: flowCompent.taskID,
                                flowID: flowCompent.flowID,
                                cancel: false
                            };
                            inFn(rEvent);
                        }
                    }
                    var onFlowActionCommit = flowCompent.Dom
                        .getAttribute("onFlowActionCommit");
                    if (onFlowActionCommit) {
                        var inFn = eval(onFlowActionCommit);
                        if (typeof (inFn) == "function") {
                            var rEvent = {
                                source: flowCompent,
                                taskID: flowCompent.taskID,
                                flowID: flowCompent.flowID,
                                cancel: false
                            };
                            inFn(rEvent);
                        }
                    }
                    if (flowCompent.setting.autoclose)
                        tlv8.portal.closeWindow();
                }
                var onAfterSuspend = flowCompent.Dom
                    .getAttribute("onAfterSuspend");
                if (onAfterSuspend) {
                    var inFn = eval(onAfterSuspend);
                    if (typeof (inFn) == "function") {
                        var rEvent = {
                            source: flowCompent,
                            taskID: flowCompent.taskID,
                            flowID: flowCompent.flowID,
                            cancel: false
                        };
                        inFn(rEvent);
                    }
                }
                var onAfterFlowAction = flowCompent.Dom
                    .getAttribute("onAfterFlowAction");
                if (onAfterFlowAction) {
                    var inFn = eval(onAfterFlowAction);
                    if (typeof (inFn) == "function") {
                        var rEvent = {
                            source: flowCompent,
                            taskID: flowCompent.taskID,
                            flowID: flowCompent.flowID,
                            cancel: false
                        };
                        inFn(rEvent);
                    }
                }
            });
        tlv8.showModelState(true);
    } else {
        mAlert("未指定任务.");
    }
};
/**
 @name flowstop
 @description 流程终止
 @param {string} flowID
 @param {string} taskID
 */
tlv8.flw.prototype.flowstop = function (flowID, taskID) {
    var flowCompent = this;
    if (this.setting.autosaveData) {
        this.sData1 = this.data.saveData();
    }
    if (!confirm("终止流程,流程将彻底作废.\n  确定终止吗?"))
        return;
    var onBeforeAbort = this.Dom.getAttribute("onBeforeAbort");
    if (onBeforeAbort) {
        var inFn = eval(onBeforeAbort);
        if (typeof (inFn) == "function") {
            var rEvent = {
                source: this,
                taskID: this.taskID,
                flowID: this.flowID,
                cancel: false
            };
            var bfData = inFn(rEvent);
            try {
                if (bfData.cancel == true) {
                    return "cancel";
                }
            } catch (e) {
            }
        } else {
            try {
                if (inFn.cancel == true) {
                    return "cancel";
                }
            } catch (e) {
            }
        }
    }
    var onBeforeFlowAction = this.Dom.getAttribute("onBeforeFlowAction");
    if (onBeforeFlowAction) {
        var inFn = eval(onBeforeFlowAction);
        if (typeof (inFn) == "function") {
            var rEvent = {
                source: this,
                taskID: this.taskID,
                flowID: this.flowID,
                cancel: false
            };
            inFn(rEvent);
        }
    }
    var param = new tlv8.RequestParam();
    if (flowID && taskID) {
        param.set("flowID", flowID);
        param.set("taskID", taskID);
        tlv8.XMLHttpRequest("flowstopAction", param, "post", true,
            function (r) {
                tlv8.showModelState(false);
                if (r.data.flag == "false") {
                    alert("操作失败:" + r.data.message);
                } else {
                    var onAbortCommit = flowCompent.Dom
                        .getAttribute("onAbortCommit");
                    if (onAbortCommit) {
                        var inFn = eval(onAbortCommit);
                        if (typeof (inFn) == "function") {
                            var rEvent = {
                                source: flowCompent,
                                taskID: flowCompent.taskID,
                                flowID: flowCompent.flowID,
                                cancel: false
                            };
                            inFn(rEvent);
                        }
                    }
                    var onFlowActionCommit = flowCompent.Dom
                        .getAttribute("onFlowActionCommit");
                    if (onFlowActionCommit) {
                        var inFn = eval(onFlowActionCommit);
                        if (typeof (inFn) == "function") {
                            var rEvent = {
                                source: flowCompent,
                                taskID: flowCompent.taskID,
                                flowID: flowCompent.flowID,
                                cancel: false
                            };
                            inFn(rEvent);
                        }
                    }
                    if (flowCompent.setting.autoclose)
                        tlv8.portal.closeWindow();
                }
                var onAfterAbort = flowCompent.Dom
                    .getAttribute("onAfterAbort");
                if (onAfterAbort) {
                    var inFn = eval(onAfterAbort);
                    if (typeof (inFn) == "function") {
                        var rEvent = {
                            source: flowCompent,
                            taskID: flowCompent.taskID,
                            flowID: flowCompent.flowID,
                            cancel: false
                        };
                        inFn(rEvent);
                    }
                }
                var onAfterFlowAction = flowCompents.Dom
                    .getAttribute("onAfterFlowAction");
                if (onAfterFlowAction) {
                    var inFn = eval(onAfterFlowAction);
                    if (typeof (inFn) == "function") {
                        var rEvent = {
                            source: flowCompent,
                            taskID: flowCompent.taskID,
                            flowID: flowCompent.flowID,
                            cancel: false
                        };
                        inFn(rEvent);
                    }
                }
            });
        tlv8.showModelState(true);
    } else if (this.flowID && this.flowID != "" && this.taskID
        && this.taskID != "") {
        param.set("flowID", this.flowID);
        param.set("taskID", this.taskID);
        tlv8.XMLHttpRequest("flowstopAction", param, "post", true,
            function (r) {
                if (r.data.flag == "false") {
                    alert("操作失败:" + r.data.message);
                } else {
                    var onAbortCommit = flowCompent.Dom
                        .getAttribute("onAbortCommit");
                    if (onAbortCommit) {
                        var inFn = eval(onAbortCommit);
                        if (typeof (inFn) == "function") {
                            var rEvent = {
                                source: flowCompent,
                                taskID: flowCompent.taskID,
                                flowID: flowCompent.flowID,
                                cancel: false
                            };
                            inFn(rEvent);
                        }
                    }
                    var onFlowActionCommit = flowCompent.Dom
                        .getAttribute("onFlowActionCommit");
                    if (onFlowActionCommit) {
                        var inFn = eval(onFlowActionCommit);
                        if (typeof (inFn) == "function") {
                            var rEvent = {
                                source: flowCompent,
                                taskID: flowCompent.taskID,
                                flowID: flowCompent.flowID,
                                cancel: false
                            };
                            inFn(rEvent);
                        }
                    }
                    if (flowCompent.setting.autoclose)
                        tlv8.portal.closeWindow();
                }
                var onAfterAbort = flowCompent.Dom
                    .getAttribute("onAfterAbort");
                if (onAfterAbort) {
                    var inFn = eval(onAfterAbort);
                    if (typeof (inFn) == "function") {
                        var rEvent = {
                            source: flowCompent,
                            taskID: flowCompent.taskID,
                            flowID: flowCompent.flowID,
                            cancel: false
                        };
                        inFn(rEvent);
                    }
                }
                var onAfterFlowAction = flowCompent.Dom
                    .getAttribute("onAfterFlowAction");
                if (onAfterFlowAction) {
                    var inFn = eval(onAfterFlowAction);
                    if (typeof (inFn) == "function") {
                        var rEvent = {
                            source: flowCompent,
                            taskID: flowCompent.taskID,
                            flowID: flowCompent.flowID,
                            cancel: false
                        };
                        inFn(rEvent);
                    }
                }
            });
    } else {
        mAlert("未指定任务.");
    }
};
/**
 @name viewChart
 @description 查看流程流转图
 @param {string} flowID
 @param {string} taskID
 */
tlv8.flw.prototype.viewChart = function (flowID, taskID) {
    if (!flowID)
        flowID = this.flowID;
    if (!taskID)
        taskID = this.taskID;
    var sData1 = this.sData1;
    var url = "/system/flow/viewiocusbot/";
    if (flowID && flowID != "" && taskID && taskID != "") {
        tlv8.portal.openWindow("流程图",
            url + "?flowID=" + flowID
            + "&taskID=" + taskID);
    } else if (this.processID && this.processID != "") {
        tlv8.portal.openWindow("流程图",
            url + "?processID="
            + this.processID);
    } else if (sData1 && sData1 != "") {
        tlv8.task.viewChart(sData1);
    } else {
        var currentUrl = window.location.pathname;
        if (currentUrl.indexOf("?") > 0)
            currentUrl = currentUrl.substring(0, currentUrl.indexOf("?"));
        tlv8.portal.openWindow("流程图",
            url + "?currentUrl="
            + currentUrl);
    }
};
tlv8.task = {
    /**
     @function
     @name tlv8.task.openTask
     @description 打开任务页面
     @param {string} taskID
     @param {string} url
     @param {string} executor
     */
    openTask: function (taskID, url, executor) {
        var param = new tlv8.RequestParam();
        if (taskID) {
            param.set("taskID", taskID);
            param.set("executor", executor);
            tlv8.XMLHttpRequest("openTaskAction", param, "post", true,
                function (r) {
                    if (r.data.flag == "false") {
                        alert("操作失败:" + r.data.message);
                    } else {
                        var Data = eval("(" + r.data.data + ")");
                        var name = Data.name;
                        var sURL = url || Data.url;
                        var sData1 = Data.sData1;
                        if (sURL.indexOf(".w") > 0) {
                            sURL = sURL.replace(".w", ".html");
                        }
                        sURL += "?flowID=" + Data.flowID + "&taskID="
                            + taskID + "&sData1=" + sData1 + "&task="
                            + taskID + "&activity-pattern=do";
                        var cid = tlv8.portal.currentTabId();
                        tlv8.portal.openWindow(name, sURL);
                        writeLog(event, "处理任务");
                        tlv8.portal.closeWindow(cid);
                    }
                });
        }
    },
    processID: "",
    flowID: "",
    taskID: "",
    /**
     @function
     @name tlv8.task.flowback
     @description 回退流程
     @param {string} flowID
     @param {string} taskID
     @param {string} calback
     */
    flowback: function (flowID, taskID, calback) {
        var param = new tlv8.RequestParam();
        if (flowID && taskID) {
            param.set("flowID", flowID);
            param.set("taskID", taskID);
            tlv8.XMLHttpRequest("flowbackAction", param, "post", true,
                function (r) {
                    tlv8.showModelState(false);
                    if (r.data.flag == "false") {
                        alert("操作失败:" + r.data.message);
                        return false;
                    } else {
                        var flwData = eval("(" + r.data.data + ")");
                        this.processID = flwData.processID;
                        this.flowID = flwData.flowID;
                        this.taskID = flwData.taskID;
                        sAlert("操作成功！");
                    }
                    if (calback && typeof calback == "function") {
                        calback();
                    } else if (calback && calback != "") {
                        try {
                            calback = eval(calback);
                            if (typeof calback == "function")
                                calback();
                        } catch (e) {
                            alert("给定的回调函数不存在：" + e);
                        }
                    }
                });
            tlv8.showModelState(true);
        }
    },
    /**
     @function
     @name tlv8.task.flowout
     @description 流转流程
     @param {string} flowID
     @param {string} taskID
     @param {string} ePersonID
     @param {string} sData1
     @param {function} calback
     */
    flowout: function (flowID, taskID, ePersonID, sData1, calback) {
        var param = new tlv8.RequestParam();
        var srcPath = window.location.pathname;
        if (srcPath.indexOf('/flw/flwcommo/flowDialog/flow_audit_opinion.html') > 0) {
            srcPath = parent.window.location.pathname;
        }
        if (srcPath.indexOf("?") > 0)
            srcPath = srcPath.substring(0, srcPath.indexOf("?"));
        param.set("srcPath", srcPath);
        if (flowID && taskID) {
            param.set("flowID", flowID);
            param.set("taskID", taskID);
            param.set("ePersonID", ePersonID);
            if (sData1)
                param.set("sdata1", sData1);
            tlv8.XMLHttpRequest("flowoutAction", param, "post", true,
                function (r) {
                    tlv8.showModelState(false);
                    if (r.data.flag == "false") {
                        alert("操作失败:" + r.data.message);
                        return false;
                    } else {
                        var flwData = eval("(" + r.data.data + ")");
                        this.processID = flwData.processID;
                        this.flowID = flwData.flowID;
                        this.taskID = flwData.taskID;
                        sAlert("操作成功！");
                    }
                    if (calback && typeof calback == "function") {
                        calback();
                    } else if (calback && calback != "") {
                        try {
                            calback = eval(calback);
                            if (typeof calback == "function")
                                calback();
                        } catch (e) {
                            alert("给定的回调函数不存在：" + e);
                        }
                    }
                });
            tlv8.showModelState(true);
        }
    },
    /**
     @function
     @name tlv8.task.flowtransmit
     @description 转发流程
     @param {string} flowID
     @param {string} taskID
     @param {string} ePersonID
     */
    flowtransmit: function (flowID, taskID, ePersonID) {
    },
    /**
     @function
     @name tlv8.task.flowpause
     @description 暂停流程
     @param {string} flowID
     @param {string} taskID
     @param {function} calback
     */
    flowpause: function (flowID, taskID, calback) {
        if (!confirm("流程暂停后只能到任务中心激活.\n  确定暂停吗?"))
            return false;
        var param = new tlv8.RequestParam();
        if (flowID && taskID) {
            param.set("flowID", flowID);
            param.set("taskID", taskID);
            tlv8.XMLHttpRequest("flowpauseAction", param, "post", true,
                function (r) {
                    tlv8.showModelState(false);
                    if (r.data.flag == "false") {
                        alert("操作失败:" + r.data.message);
                        return false;
                    } else {
                        sAlert("操作成功！");
                        return true;
                    }
                    if (calback && typeof calback == "function") {
                        calback();
                    } else if (calback && calback != "") {
                        try {
                            calback = eval(calback);
                            if (typeof calback == "function")
                                calback();
                        } catch (e) {
                            alert("给定的回调函数不存在：" + e);
                        }
                    }
                });
            tlv8.showModelState(true);
        }
        return true;
    },
    /**
     @function
     @name tlv8.task.flowrestart
     @description 启动已暂停流程
     @param {string} flowID
     @param {string} taskID
     @param {function} calback
     */
    flowrestart: function (flowID, taskID, calback) {
        var param = new tlv8.RequestParam();
        if (flowID && taskID) {
            param.set("flowID", flowID);
            param.set("taskID", taskID);
            tlv8.XMLHttpRequest("flowrestartAction", param, "post", true,
                function (r) {
                    tlv8.showModelState(false);
                    if (r.data.flag == "false") {
                        alert("操作失败:" + r.data.message);
                        return false;
                    } else {
                        sAlert("操作成功！");
                        return true;
                    }
                    if (calback && typeof calback == "function") {
                        calback();
                    } else if (calback && calback != "") {
                        try {
                            calback = eval(calback);
                            if (typeof calback == "function")
                                calback();
                        } catch (e) {
                            alert("给定的回调函数不存在：" + e);
                        }
                    }
                });
            tlv8.showModelState(true);
        }
        return true;
    },
    /**
     @function
     @name tlv8.task.flowstop
     @description 终止流程
     @param {string} flowID
     @param {string} taskID
     @param {function} calback
     */
    flowstop: function (flowID, taskID, calback) {
        if (!confirm("终止流程,流程将彻底作废.\n  确定终止吗?"))
            return false;
        var param = new tlv8.RequestParam();
        if (flowID && taskID) {
            param.set("flowID", flowID);
            param.set("taskID", taskID);
            tlv8.XMLHttpRequest("flowstopAction", param, "post", true,
                function (r) {
                    tlv8.showModelState(false);
                    if (r.data.flag == "false") {
                        alert("操作失败:" + r.data.message);
                        return false;
                    } else {
                        sAlert("操作成功！");
                        return true;
                    }
                    if (calback && typeof calback == "function") {
                        calback();
                    } else if (calback && calback != "") {
                        try {
                            calback = eval(calback);
                            if (typeof calback == "function")
                                calback();
                        } catch (e) {
                            alert("给定的回调函数不存在：" + e);
                        }
                    }
                });
            tlv8.showModelState(true);
        }
        return true;
    },
    /**
     @function
     @name tlv8.task.flowstart
     @description 启动流程
     @param {string} flowID
     @param {string} sData1
     @param {function} calback
     */
    flowstart: function (sEurl, sData1, calback) {
        var flowCompent = this;
        var param = new tlv8.RequestParam();
        param.set("sdata1", sData1);
        var srcPath = sEurl || window.location.pathname;
        if (srcPath.indexOf("?") > 0)
            srcPath = srcPath.substring(0, srcPath.indexOf("?"));
        param.set("srcPath", srcPath);
        tlv8.showModelState(true);
        tlv8.XMLHttpRequest("flowstartAction", param, "post", true,
            function (r) {
                tlv8.showModelState(false);
                if (r.data.flag == "false") {
                    alert("操作失败:" + r.data.message);
                } else {
                    var flwData = eval("(" + r.data.data + ")");
                    flowCompent.processID = flwData.processID;
                    flowCompent.flowID = flwData.flowID;
                    flowCompent.taskID = flwData.taskID;
                }
                if (calback && typeof calback == "function") {
                    calback();
                } else if (calback && calback != "") {
                    try {
                        calback = eval(calback);
                        if (typeof calback == "function")
                            calback();
                    } catch (e) {
                        alert("给定的回调函数不存在：" + e);
                    }
                }
            });
    },
    /**
     @function
     @name tlv8.task.viewChart
     @description 查看流程图
     @param {string} sData1
     */
    viewChart: function (sData1) {
        var param = new tlv8.RequestParam();
        param.set("sdata1", sData1);
        var result = tlv8.XMLHttpRequest("getProcessByBillIDAction",
            param, "POST", false);
        var rdata = [];
        try {
            rdata = window.eval("(" + result.data.data + ")");
        } catch (e) {
        }
        var url = "/flow/viewiocusbot/";
        if (rdata.length > 0) {
            var flowID = rdata[0].SFLOWID;
            var taskID = rdata[0].SID;
            tlv8.portal.openWindow("流程图",
                url + "?flowID=" + flowID
                + "&taskID=" + taskID);
        } else {
            var currentUrl = window.location.pathname;
            if (currentUrl.indexOf("?") > 0)
                currentUrl = currentUrl.substring(0, currentUrl.indexOf("?"));
            tlv8.portal
                .openWindow("流程图",
                    url + "?currentUrl=" + currentUrl);
        }
    },
    /**
     @function
     @name tlv8.task.Update_Flowbillinfo
     @description 更新流程业务数据信息
     @param {string} tablename
     @param {string} fid
     @param {string} billitem
     */
    Update_Flowbillinfo: function (tablename, fid, billitem) {
        var param = new tlv8.RequestParam();
        param.set("tablename", tablename);
        param.set("fid", fid);
        param.set("billitem", billitem);
        var r = tlv8.XMLHttpRequest("Update_Flowbillinfo", param, "post",
            false, null);
        if (r.data.flag == "false") {
            alert(r.data.message);
            return false;
        }
        return r.data.data;
    }
};