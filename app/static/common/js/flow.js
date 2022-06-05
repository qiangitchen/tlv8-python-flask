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
                back: false,
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
            stop: false
        };
    } else {
        // if (setting.autosaveData != false)
        //     setting.autosaveData = true;
        if (setting.autoclose !== false)
            setting.autoclose = true;
        if (setting.autofilter !== false)
            setting.autofilter = true;
        if (setting.autorefresh !== false)
            setting.autorefresh = true;
        if (setting.autoselectext !== false)
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
    //回调方法定义--start--
    this.onBeforeStart = null;
    this.onAfterStart = null;
    this.onStartCommit = null;
    this.onBeforeBack = null;
    this.onAfterBack = null;
    this.onBackCommit = null;
    this.onBeforeAdvance = null;
    this.onAfterAdvance = null;
    this.onBeforeFlowAction = null;
    this.onAfterFlowAction = null;
    this.onAdvanceCommit = null;
    this.onFlowEndCommit = null;
    this.onFlowActionCommit = null;
    this.onBeforeTransfer = null;
    this.onAfterTransfer = null;
    this.onTransferCommit = null;
    this.onBeforeSuspend = null;
    this.onAfterSuspend = null;
    this.onSuspendCommit = null;
    this.onBeforeAbort = null;
    this.onAfterAbort = null;
    this.onAbortCommit = null;
    //==end==
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
    const setting = this.setting;
    if (!item)
        item = setting.item;
    let activity_pattern = tlv8.RequestURLParam
        .getParam("activity-pattern");
    if (activity_pattern === "detail") {
        item.audit = false;
        item.back = false;
        item.out = false;
        item.transmit = false;
        item.pause = false;
        item.stop = false;
    }
    const div = document.getElementById(this.id);
    let itemHTML = "<table style='height:25px;'><tr style='width'>";
    itemHTML += "<td>"
        + "<a style='float: left;padding: 3px;'><img id='"
        + this.id
        + "_groupItem' src='"
        + $dpimgpath
        + "toolbar/flw/group.gif' title='流程工具条' onclick='return false;' alt=''/></a></td>";
    if (item.audit === false) {
    } else if ((item.audit && item.audit === true)
        || (!item.audit && setting.item.audit === true && item !== setting.item)) {
        itemHTML += "<td id='" + this.id
            + "_auditItem_Td'>"
            + "<button class='layui-btn layui-btn-sm layui-btn-primary' id='"
            + this.id + "_auditItem' title='审批' "
            + "onclick='document.getElementById(\"" + div.id
            + "\").flw.flowAudit();return false;' style='height:30px; width:80px; margin-right:5px;'>"
            + "<i class='layui-icon'>&#xe672;</i>审批</button></td>";
    } else if (item.audit === "readonly"
        || (!item.audit && setting.item.audit === "readonly" && item !== setting.item)) {
        itemHTML += "<td id='" + this.id
            + "_auditItem_Td'>"
            + "<button class='layui-btn layui-btn-sm layui-btn-disabled' id='"
            + this.id + "_auditItem' disabled='true' title='审批' "
            + "onclick='return false;' style='height:30px; width:80px; margin-right:5px;'>"
            + "<i class='layui-icon'>&#xe672;</i>审批</button></td>";
    }
    if (item.back === false) {
    } else if ((item.back && item.back === true && setting.auditParam.isRequired === false)
        || (!item.back && setting.item.back === true && item !== setting.item && setting.auditParam.isRequired === false)) {
        itemHTML += "<td>"
            + "<button class='layui-btn layui-btn-sm layui-btn-warm' id='"
            + this.id
            + "_backItem' title='回退' onclick='document.getElementById(\""
            + div.id + "\").flw.flowBack()' style='height:30px; width:80px; margin-right:5px;'>"
            + "<i class='layui-icon'>&#xe65c;</i>回退</button></td>";
    } else if (item.back === "readonly"
        || setting.auditParam.isRequired === true
        || (!item.back && setting.item.back === "readonly" && item !== setting.item)) {
        itemHTML += "<td>"
            + "<button class='layui-btn layui-btn-sm layui-btn-disabled' id='"
            + this.id + "_backItem' disabled='true' title='回退' style='height:30px; width:80px; margin-right:5px;'>"
            + "<i class='layui-icon'>&#xe65c;</i>回退</button></td>";
    }
    if (item.out === false) {
    } else if ((item.out === true && setting.auditParam.isRequired === false)
        || (!item.out && setting.item.out === true && item !== setting.item && setting.auditParam.isRequired === false)) {
        itemHTML += "<td><button class='layui-btn layui-btn-sm layui-btn-normal' id='"
            + this.id
            + "_outItem' title='流转' onclick='document.getElementById(\""
            + div.id + "\").flw.flowOut()' style='height:30px; width:80px; margin-right:5px;'>"
            + "<i class='layui-icon'>&#xe605;</i>提交</button></td>";
    } else if (item.out === "readonly"
        || setting.auditParam.isRequired === true
        || (item.out && setting.item.out === "readonly" && item !== setting.item)) {
        itemHTML += "<td><button class='layui-btn layui-btn-sm layui-btn-disabled' id='"
            + this.id
            + "_outItem' disabled='true' title='流转' style='height:30px; width:80px; margin-right:5px;'>"
            + "<i class='layui-icon'>&#xe605;</i>提交</button></td>";
    }
    if (item.transmit === false) {
    } else if ((item.transmit === true && setting.auditParam.isRequired === false)
        || (!item.transmit && setting.item.transmit === true
            && item !== setting.item && setting.auditParam.isRequired === false)) {
        itemHTML += "<td><button class='layui-btn layui-btn-sm layui-btn-primary' id='"
            + this.id
            + "_transmitItem' title='转发' onclick='document.getElementById(\""
            + div.id + "\").flw.flowForward()' style='height:30px; width:80px; margin-right:5px;'>"
            + "<i class='layui-icon'>&#xe609;</i>转发</button></td>";
    } else if (item.transmit === "readonly"
        || setting.auditParam.isRequired === true
        || (!item.transmit && setting.item.transmit === "readonly" && item !== setting.item)) {
        itemHTML += "<td><button class='layui-btn layui-btn-sm layui-btn-disabled' id='"
            + this.id
            + "_transmitItem' disabled='true' title='转发' style='height:30px; width:80px; margin-right:5px;'>"
            + "<i class='layui-icon'>&#xe609;</i>转发</button></td>";
    }
    if (item.pause === false) {
    } else if ((item.pause === true && setting.auditParam.isRequired === false)
        || (!item.pause && setting.item.pause === true
            && item !== setting.item && setting.auditParam.isRequired === false)) {
        itemHTML += "<td><button class='layui-btn layui-btn-sm layui-btn-warm' id='"
            + this.id
            + "_pauseItem' title='暂停' onclick='document.getElementById(\""
            + div.id + "\").flw.flowPause()' style='height:30px; width:80px; margin-right:5px;'>"
            + "<i class='layui-icon'>&#xe651;</i>暂停</button></td>";
    } else if (item.pause === "readonly"
        || setting.auditParam.isRequired === true
        || (!item.pause && setting.item.pause === "readonly" && item !== setting.item)) {
        itemHTML += "<td><button class='layui-btn layui-btn-sm layui-btn-disabled' id='"
            + this.id
            + "_pauseItem' disabled='true' title='暂停' style='height:30px; width:80px; margin-right:5px;'>"
            + "<i class='layui-icon'>&#xe651;</i>暂停</button></td>";
    }
    if (item.stop === false) {
    } else if ((item.stop === true && setting.auditParam.isRequired === false)
        || (!item.stop && setting.item.stop === true && item !== setting.item && setting.auditParam.isRequired === false)) {
        itemHTML += "<td><button class='layui-btn layui-btn-sm layui-btn-danger' id='"
            + this.id
            + "_stopItem' title='终止' onclick='document.getElementById(\""
            + div.id + "\").flw.flowStop()' style='height:30px; width:80px; margin-right:5px;'>"
            + "<i class='layui-icon'>&#xe617;</i>终止</button></td>";
    } else if (item.stop === "readonly"
        || setting.auditParam.isRequired === true
        || (!item.stop && setting.item.stop === "readonly" && item !== setting.item)) {
        itemHTML += "<td><button class='layui-btn layui-btn-sm layui-btn-disabled' id='"
            + this.id
            + "_stopItem' disabled='true' title='终止' style='height:30px; width:80px; margin-right:2px;'>"
            + "<i class='layui-icon'>&#xe617;</i>终止</button></td>";
    }
    itemHTML += "<td><button class='layui-btn layui-btn-sm' id='"
        + this.id
        + "_chartItem' title='查看流程图' onclick='document.getElementById(\""
        + div.id + "\").flw.viewChart()' style='height:30px; width:90px; margin-right:2px;'>"
        + "<i class='layui-icon'>&#xe60d;</i>流程图</button></td>";
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
    if (!this.setting.auditParam) {
        alert("审批信息未配置！");
        return false;
    }
    let url = "/flw/flwcommo/flowDialog/flow_audit_opinion.html";
    url += "?flowID=" + (flowID ? flowID : this.flowID);
    url += "&taskID=" + (taskID ? taskID : this.taskID);
    url += "&ePersonID=" + ePersonID;
    url += "&sData1=" + (sData1 ? sData1 : this.sData1);
    url += "&flowItem=" + JSON.toString(this.setting.item);
    url += "&auditParam=" + JSON.toString(this.setting.auditParam);
    let taskCompact = this;
    tlv8.portal.dailog.openDailog("审批信息", url, 700, 450, function (auData) {
        if (auData) {
            let onauditOpionWrited = taskCompact.Dom
                .getAttribute("onauditOpionWrited");
            if (onauditOpionWrited) {
                let inFn = eval(onauditOpionWrited);
                if (typeof (inFn) == "function") {
                    let rEvent = {
                        source: taskCompact,
                        taskID: taskCompact.taskID,
                        flowID: taskCompact.flowID,
                        cancel: false,
                        opinion: auData.auditOp
                    };
                    let bfData = inFn(rEvent);
                    try {
                        if (bfData.cancel === true) {
                            return "cancel";
                        }
                    } catch (e) {
                    }
                } else {
                    try {
                        if (inFn.cancel === true) {
                            return "cancel";
                        }
                    } catch (e) {
                    }
                }
            }
            taskCompact.setting.auditParam.isRequired = false;
            taskCompact.setItemStatus(taskCompact.setting.item);
        }
        if (auData === "flowBack") {
            taskCompact.flowBack();
        }
        if (auData === "flowOut") {
            taskCompact.flowOut();
        }
        if (auData === "flowTransmit") {
            taskCompact.flowForward();
        }
        if (auData === "flowPause") {
            taskCompact.flowPause();
        }
        if (auData === "flowStop") {
            taskCompact.flowStop();
        }
    }, false);
};
/**
 @name flowStart
 @description 启动流程
 @param {string} billid -业务表单主键的值
 */
tlv8.flw.prototype.flowStart = function (billid) {
    let inFn;
    let flowComponent = this;
    let sData1 = billid || this.sData1;
    let param = new tlv8.RequestParam();
    param.set("sdata1", sData1);
    let srcPath = window.location.pathname;
    if (srcPath.indexOf("?") > 0)
        srcPath = srcPath.substring(0, srcPath.indexOf("?"));
    param.set("srcPath", srcPath);
    param.set("processID", this.processID ? this.processID : "");
    let onBeforeStart = flowComponent.onBeforeStart;
    if (onBeforeStart) {
        let inFn = onBeforeStart;
        if (typeof onBeforeStart == "string") {
            inFn = eval(onBeforeStart);
        }
        if (typeof (inFn) == "function") {
            let rEvent = {
                source: this,
                taskID: this.taskID,
                flowID: this.flowID,
                cancel: false
            };
            let bfData = inFn(rEvent);
            try {
                if (bfData.cancel === true) {
                    return "cancel";
                }
            } catch (e) {
            }
        } else {
            try {
                if (inFn.cancel === true) {
                    return "cancel";
                }
            } catch (e) {
            }
        }
    }
    let onBeforeFlowAction = flowComponent.onBeforeFlowAction;
    if (onBeforeFlowAction) {
        let inFn = onBeforeFlowAction;
        if (typeof onBeforeFlowAction == "string") {
            inFn = eval(onBeforeFlowAction);
        }
        if (typeof (inFn) == "function") {
            let rEvent = {
                source: this,
                taskID: this.taskID,
                flowID: this.flowID,
                cancel: false
            };
            inFn(rEvent);
        }
    }
    tlv8.showModelState(true);
    tlv8.XMLHttpRequest("/flowControl/flowStartAction", param, "post", false, function (
        r) {
        tlv8.showModelState(false);
        if (r.state === false) {
            layui.layer.alert("操作失败:" + r.msg);
        } else {
            let flwData = r.data; //eval("(" + r.data + ")");
            flowComponent.processID = flwData.processID;
            flowComponent.flowID = flwData.flowID;
            flowComponent.taskID = flwData.taskID;
            let onStartCommit = flowComponent.onStartCommit;
            if (onStartCommit) {
                let inFn = onStartCommit;
                if (typeof onStartCommit == "string") {
                    inFn = eval(onStartCommit);
                }
                if (typeof (inFn) == "function") {
                    let rEvent = {
                        source: flowComponent,
                        taskID: flowComponent.taskID,
                        flowID: flowComponent.flowID,
                        cancel: false
                    };
                    inFn(rEvent);
                }
            }
            let onFlowActionCommit = flowComponent.onFlowActionCommit;
            if (onFlowActionCommit) {
                let inFn = onFlowActionCommit;
                if (typeof onFlowActionCommit == "string") {
                    inFn = eval(onFlowActionCommit);
                }
                if (typeof (inFn) == "function") {
                    let rEvent = {
                        source: flowComponent,
                        taskID: flowComponent.taskID,
                        flowID: flowComponent.flowID,
                        cancel: false
                    };
                    inFn(rEvent);
                }
            }
            let aurl = window.location.href;
            if (aurl.indexOf("?") < 0) {
                aurl += "?t=1";
            }
            aurl += "&pattern=do";
            aurl += "&flowID=" + flowComponent.flowID;
            aurl += "&taskID=" + flowComponent.taskID;
            aurl += "&sData1=" + sData1;
            window.location.href = aurl;
        }
        let onAfterStart = flowComponent.onAfterStart;
        if (onAfterStart) {
            let inFn = onAfterStart;
            if (typeof onAfterStart == "string") {
                inFn = eval(onAfterStart);
            }
            if (typeof (inFn) == "function") {
                let rEvent = {
                    source: flowComponent,
                    taskID: flowComponent.taskID,
                    flowID: flowComponent.flowID,
                    cancel: false
                };
                inFn(rEvent);
            }
        }
        let onAfterFlowAction = flowComponent.onAfterFlowAction;
        if (onAfterFlowAction) {
            let inFn = onAfterFlowAction;
            if (typeof onAfterFlowAction == "string") {
                inFn = eval(onAfterFlowAction);
            }
            if (typeof (inFn) == "function") {
                let rEvent = {
                    source: flowComponent,
                    taskID: flowComponent.taskID,
                    flowID: flowComponent.flowID,
                    cancel: false
                };
                inFn(rEvent);
            }
        }
    });
};
/**
 @name flowBack
 @description 流程回退
 @param {string} flowID
 @param {string} taskID
 */
tlv8.flw.prototype.flowBack = function (flowID, taskID) {
    let rEvent;
    let flowComponent = this;
    layui.layer.confirm("确定回退流程吗？", function () {
        let onBeforeBack = flowComponent.onBeforeBack;
        if (onBeforeBack) {
            let inFn = onBeforeBack;
            if (typeof onBeforeBack == "string") {
                inFn = eval(onBeforeBack);
            }
            if (typeof (inFn) == "function") {
                rEvent = {
                    source: flowComponent,
                    taskID: flowComponent.taskID,
                    flowID: flowComponent.flowID,
                    cancel: false
                };
                let bfData = inFn(rEvent);
                try {
                    if (bfData.cancel === true) {
                        return "cancel";
                    }
                } catch (e) {
                }
            } else {
                try {
                    if (inFn.cancel === true) {
                        return "cancel";
                    }
                } catch (e) {
                }
            }
        }
        let onBeforeFlowAction = flowComponent.onBeforeFlowAction;
        if (onBeforeFlowAction) {
            let inFn = onBeforeFlowAction;
            if (typeof onBeforeFlowAction == "string") {
                inFn = eval(onBeforeFlowAction);
            }
            if (typeof (inFn) === "function") {
                rEvent = {
                    source: flowComponent,
                    taskID: flowComponent.taskID,
                    flowID: flowComponent.flowID,
                    cancel: false
                };
                inFn(rEvent);
            }
        }
        let param = new tlv8.RequestParam();
        param.set("flowID", flowID || flowComponent.flowID);
        param.set("taskID", taskID || flowComponent.taskID);
        tlv8.showModelState(true);
        tlv8.XMLHttpRequest("/flowControl/flowbackAction", param, "post", true,
            function (r) {
                tlv8.showModelState(false);
                if (r.state === false) {
                    layui.layer.alert("操作失败:" + r.msg);
                } else {
                    let flwData = r.data;
                    flowComponent.processID = flwData.processID;
                    flowComponent.flowID = flwData.flowID;
                    flowComponent.taskID = flwData.taskID;
                    let onBackCommit = flowComponent.onBackCommit;
                    if (onBackCommit) {
                        let inFn = onBackCommit;
                        if (typeof onBackCommit == "string") {
                            inFn = eval(onBackCommit);
                        }
                        if (typeof (inFn) == "function") {
                            let rEvent = {
                                source: flowComponent,
                                taskID: flowComponent.taskID,
                                flowID: flowComponent.flowID,
                                cancel: false
                            };
                            inFn(rEvent);
                        }
                    }
                    let onFlowActionCommit = flowComponent.onFlowActionCommit;
                    if (onFlowActionCommit) {
                        let inFn = onFlowActionCommit;
                        if (typeof onFlowActionCommit == "string") {
                            inFn = eval(onFlowActionCommit);
                        }
                        if (typeof (inFn) == "function") {
                            let rEvent = {
                                source: flowComponent,
                                taskID: flowComponent.taskID,
                                flowID: flowComponent.flowID,
                                cancel: false
                            };
                            inFn(rEvent);
                        }
                    }
                    if (flowComponent.setting.autoclose === true) {
                        tlv8.portal.closeWindow();
                    }
                }
                let onAfterBack = flowComponent.onAfterBack;
                if (onAfterBack) {
                    let inFn = onAfterBack;
                    if (typeof onAfterBack == "string") {
                        inFn = eval(onAfterBack);
                    }
                    if (typeof (inFn) == "function") {
                        let rEvent = {
                            source: flowComponent,
                            taskID: flowComponent.taskID,
                            flowID: flowComponent.flowID,
                            cancel: false
                        };
                        inFn(rEvent);
                    }
                }
                let onAfterFlowAction = flowComponent.onAfterFlowAction;
                if (onAfterFlowAction) {
                    let inFn = onAfterFlowAction;
                    if (typeof onAfterFlowAction == "string") {
                        inFn = eval(onAfterFlowAction);
                    }
                    if (typeof (inFn) == "function") {
                        let rEvent = {
                            source: flowComponent,
                            taskID: flowComponent.taskID,
                            flowID: flowComponent.flowID,
                            cancel: false
                        };
                        inFn(rEvent);
                    }
                }
            });
    });
};

/**
 @name flowOut
 @description 流程流转
 @param {string} flowID
 @param {string} taskID
 @param {string} ePersonID -执行人ID，多个执行人用逗号(,)分隔
 @param {string} sData1
 */
tlv8.flw.prototype.flowOut = function (flowID, taskID, ePersonID, sData1) {
    if (!sData1 && !this.sData1) {
        layui.layer.alert("请先保存数据~");
        return;
    }
    let flowComponent = this;
    let onBeforeAdvance = flowComponent.onBeforeAdvance;
    if (onBeforeAdvance) {
        let inFn = onBeforeAdvance;
        if (typeof onBeforeAdvance == "string") {
            inFn = eval(onBeforeAdvance);
        }
        if (typeof (inFn) == "function") {
            let rEvent = {
                source: flowComponent,
                taskID: flowComponent.taskID,
                flowID: flowComponent.flowID,
                cancel: false
            };
            let bfData = inFn(rEvent);
            try {
                if (bfData.cancel === true) {
                    return "cancel";
                }
            } catch (e) {
            }
        } else {
            try {
                if (inFn.cancel === true) {
                    return "cancel";
                }
            } catch (e) {
            }
        }
    }
    let onBeforeFlowAction = flowComponent.onBeforeFlowAction;
    if (onBeforeFlowAction) {
        let inFn = onBeforeFlowAction;
        if (typeof onBeforeFlowAction == "string") {
            inFn = eval(onBeforeFlowAction);
        }
        if (typeof (inFn) == "function") {
            let rEvent = {
                source: flowComponent,
                taskID: flowComponent.taskID,
                flowID: flowComponent.flowID,
                cancel: false
            };
            inFn(rEvent);
        }
    }
    let param = new tlv8.RequestParam();
    param.set("flowID", flowID || flowComponent.flowID);
    param.set("taskID", taskID || flowComponent.taskID);
    param.set("sdata1", sData1 || flowComponent.sData1);
    if (ePersonID && ePersonID !== "") {
        param.set("epersonids", ePersonID);
    }
    tlv8
        .XMLHttpRequest(
            "/flowControl/flowOutAction",
            param,
            "post",
            true,
            function (r) {
                tlv8.showModelState(false);
                if (r.state === false) {
                    layui.layer.alert("操作失败:" + r.msg);
                } else if (r.state === "msg") {
                    layui.layer.alert(r.msg, function () {
                        if (flowComponent.setting.autoclose === true) {
                            tlv8.showSate(false);
                            tlv8.portal.closeWindow();
                        }
                    });
                } else if (r.state === "select") {
                    try {
                        let reActData = r.data;
                        flowComponent.processID = reActData.processID;
                        flowComponent.flowID = reActData.flowID;
                        flowComponent.taskID = reActData.taskID;
                        let activityListStr = reActData.activityList;
                        let exe_selct_url = "/system/flow/flowDialog/Select_executor";
                        exe_selct_url += "?flowID="
                            + reActData.flowID;
                        exe_selct_url += "&taskID="
                            + reActData.taskID;
                        tlv8.portal.dailog.openDailog('流程信息',
                            exe_selct_url, 800, 600,
                            flowEngion, null, null,
                            activityListStr);
                    } catch (e) {
                        layui.layer.alert("流转失败!m:" + e.message);
                    }
                } else {
                    let flwData = r.data;
                    flowComponent.processID = flwData.processID;
                    flowComponent.flowID = flwData.flowID;
                    flowComponent.taskID = flwData.taskID;
                    let onAdvanceCommit = flowComponent.onAdvanceCommit;
                    if (onAdvanceCommit) {
                        let inFn = onAdvanceCommit;
                        if (typeof onAdvanceCommit == "string") {
                            inFn = eval(onAdvanceCommit);
                        }
                        if (typeof (inFn) == "function") {
                            let rEvent = {
                                source: flowComponent,
                                taskID: flowComponent.taskID,
                                flowID: flowComponent.flowID,
                                cancel: false
                            };
                            inFn(rEvent);
                        }
                    }
                    let onFlowActionCommit = flowComponent.onFlowActionCommit;
                    if (onFlowActionCommit) {
                        let inFn = onFlowActionCommit;
                        if (typeof onFlowActionCommit == "string") {
                            inFn = eval(onFlowActionCommit);
                        }
                        if (typeof (inFn) == "function") {
                            let rEvent = {
                                source: flowComponent,
                                taskID: flowComponent.taskID,
                                flowID: flowComponent.flowID,
                                cancel: false
                            };
                            inFn(rEvent);
                        }
                    }
                    // 流程结束
                    if (r.state === "end") {
                        let onFlowEndCommit = flowComponent.onFlowEndCommit;
                        if (onFlowEndCommit) {
                            let inFn = onFlowEndCommit;
                            if (typeof onFlowEndCommit == "string") {
                                inFn = eval(onFlowEndCommit);
                            }
                            if (typeof (inFn) == "function") {
                                let rEvent = {
                                    source: flowComponent,
                                    taskID: flowComponent.taskID,
                                    flowID: flowComponent.flowID,
                                    cancel: false
                                };
                                inFn(rEvent);
                            }
                        }
                    }
                    if (flowComponent.setting.autoclose === true) {
                        tlv8.portal.closeWindow();
                    }
                }
                let onAfterAdvance = flowComponent.onAfterAdvance;
                if (onAfterAdvance) {
                    let inFn = onAfterAdvance;
                    if (typeof onAfterAdvance == "string") {
                        inFn = eval(onAfterAdvance);
                    }
                    if (typeof (inFn) == "function") {
                        let rEvent = {
                            source: flowComponent,
                            taskID: flowComponent.taskID,
                            flowID: flowComponent.flowID,
                            cancel: false
                        };
                        inFn(rEvent);
                    }
                }
                let onAfterFlowAction = flowComponent.onAfterFlowAction;
                if (onAfterFlowAction) {
                    let inFn = onAfterFlowAction;
                    if (typeof onAfterFlowAction == "string") {
                        inFn = eval(onAfterFlowAction);
                    }
                    if (typeof (inFn) == "function") {
                        let rEvent = {
                            source: flowComponent,
                            taskID: flowComponent.taskID,
                            flowID: flowComponent.flowID,
                            cancel: false
                        };
                        inFn(rEvent);
                    }
                }
            });
    tlv8.showModelState(true);
    let flowEngion = function (backData) {
        param.set("flowID", backData.flowID);
        param.set("taskID", backData.taskID);
        param.set("afterActivity", backData.activity);
        param.set("epersonids", backData.epersonids);
        tlv8.XMLHttpRequest("/flowControl/flowOutAction", param, "post", true,
            function (r) {
                if (r.state === false) {
                    layui.layer.alert(r.msg);
                    return false;
                }
                let onAdvanceCommit = flowComponent.onAdvanceCommit;
                if (onAdvanceCommit) {
                    let inFn = onAdvanceCommit;
                    if (typeof onAdvanceCommit == "string") {
                        inFn = eval(onAdvanceCommit);
                    }
                    if (typeof (inFn) == "function") {
                        let rEvent = {
                            source: flowComponent,
                            taskID: flowComponent.taskID,
                            flowID: flowComponent.flowID,
                            cancel: false
                        };
                        inFn(rEvent);
                    }
                }
                let onFlowActionCommit = flowComponent.onFlowActionCommit;
                if (onFlowActionCommit) {
                    let inFn = onFlowActionCommit;
                    if (typeof onFlowActionCommit == "string") {
                        inFn = eval(onFlowActionCommit);
                    }
                    if (typeof (inFn) == "function") {
                        let rEvent = {
                            source: flowComponent,
                            taskID: flowComponent.taskID,
                            flowID: flowComponent.flowID,
                            cancel: false
                        };
                        inFn(rEvent);
                    }
                }
                if (backData.type === "end") {
                    let onFlowEndCommit = flowComponent.onFlowEndCommit;
                    if (onFlowEndCommit) {
                        let inFn = onFlowEndCommit;
                        if (typeof onFlowEndCommit == "string") {
                            inFn = eval(onFlowEndCommit);
                        }
                        if (typeof (inFn) == "function") {
                            let rEvent = {
                                source: flowComponent,
                                taskID: flowComponent.taskID,
                                flowID: flowComponent.flowID,
                                cancel: false
                            };
                            inFn(rEvent);
                        }
                    }
                }
                if (flowComponent.setting.autoclose === true) {
                    tlv8.showSate(false);
                    tlv8.portal.closeWindow();
                }
            });
    };
};
/**
 @name flow flowForward
 @description 流程转发
 @param {string} flowID
 @param {string} taskID
 @param {string} ePersonID -执行人ID，多个执行人用逗号(,)分隔
 */
tlv8.flw.prototype.flowForward = function (flowID, taskID, ePersonID) {
    let flowComponent = this;
    let onBeforeTransfer = flowComponent.onBeforeTransfer;
    if (onBeforeTransfer) {
        let inFn = onBeforeTransfer;
        if (typeof onBeforeTransfer == "string") {
            inFn = eval(onBeforeTransfer);
        }
        if (typeof (inFn) == "function") {
            let rEvent = {
                source: flowComponent,
                taskID: flowComponent.taskID,
                flowID: flowComponent.flowID,
                cancel: false
            };
            let bfData = inFn(rEvent);
            try {
                if (bfData.cancel === true) {
                    return "cancel";
                }
            } catch (e) {
            }
        } else {
            try {
                if (inFn.cancel === true) {
                    return "cancel";
                }
            } catch (e) {
            }
        }
    }
    let onBeforeFlowAction = flowComponent.onBeforeFlowAction;
    if (onBeforeFlowAction) {
        let inFn = onBeforeFlowAction;
        if (typeof onBeforeFlowAction == "string") {
            inFn = eval(onBeforeFlowAction);
        }
        if (typeof (inFn) == "function") {
            let rEvent = {
                source: flowComponent,
                taskID: flowComponent.taskID,
                flowID: flowComponent.flowID,
                cancel: false
            };
            inFn(rEvent);
        }
    }
    let param = new tlv8.RequestParam();
    param.set("flowID", flowID || flowComponent.flowID);
    param.set("taskID", taskID || flowComponent.taskID);
    if (ePersonID && ePersonID !== "") {
        param.set("epersonids", ePersonID);
    }
    tlv8.showModelState(true);
    tlv8.XMLHttpRequest("/flowControl/flowtransmitAction", param, "post", true,
        function (r) {
            tlv8.showModelState(false);
            if (r.state === false) {
                layui.layer.alert("操作失败:" + r.msg);
            } else if (r.state === "select") {
                try {
                    let reActData = r.data;
                    let activityListStr = reActData.activityList;
                    let exe_selct_url = "/system/flow/flowDialog/Select_executor";
                    exe_selct_url += "?flowID="
                        + reActData.flowID;
                    exe_selct_url += "&taskID="
                        + reActData.taskID;
                    tlv8.portal.dailog.openDailog('流程转发',
                        exe_selct_url, 800, 600,
                        flowTransEngion, null, null,
                        activityListStr);
                } catch (e) {
                    layui.layer.alert("操作失败!m:" + e.message);
                }
            } else {
                let flwData = r.data;
                flowComponent.processID = flwData.processID;
                flowComponent.flowID = flwData.flowID;
                flowComponent.taskID = flwData.taskID;
                let onTransferCommit = flowComponent.onTransferCommit;
                if (onTransferCommit) {
                    let inFn = onTransferCommit;
                    if (typeof onTransferCommit == "string") {
                        inFn = eval(onTransferCommit);
                    }
                    if (typeof (inFn) == "function") {
                        let rEvent = {
                            source: flowComponent,
                            taskID: flowComponent.taskID,
                            flowID: flowComponent.flowID,
                            cancel: false
                        };
                        inFn(rEvent);
                    }
                }
                let onFlowActionCommit = flowComponent.onFlowActionCommit;
                if (onFlowActionCommit) {
                    let inFn = onFlowActionCommit;
                    if (typeof onFlowActionCommit == "string") {
                        inFn = eval(onFlowActionCommit);
                    }
                    if (typeof (inFn) == "function") {
                        let rEvent = {
                            source: flowComponent,
                            taskID: flowComponent.taskID,
                            flowID: flowComponent.flowID,
                            cancel: false
                        };
                        inFn(rEvent);
                    }
                }
                if (flowComponent.setting.autoclose === true) {
                    tlv8.showSate(false);
                    tlv8.portal.closeWindow();
                }
            }
        });
    const onAfterTransfer = flowComponent.onAfterTransfer;
    if (onAfterTransfer) {
        let inFn = onAfterTransfer;
        if (typeof onAfterTransfer == "string") {
            inFn = eval(onAfterTransfer);
        }
        if (typeof (inFn) == "function") {
            let rEvent = {
                source: flowComponent,
                taskID: flowComponent.taskID,
                flowID: flowComponent.flowID,
                cancel: false
            };
            inFn(rEvent);
        }
    }
    const onAfterFlowAction = flowComponent.onAfterFlowAction;
    if (onAfterFlowAction) {
        let inFn = onAfterFlowAction;
        if (typeof onAfterFlowAction == "string") {
            inFn = eval(onAfterFlowAction);
        }
        if (typeof (inFn) == "function") {
            let rEvent = {
                source: flowComponent,
                taskID: flowComponent.taskID,
                flowID: flowComponent.flowID,
                cancel: false
            };
            inFn(rEvent);
        }
    }
    const flowTransEngion = function (backData) {
        param.set("flowID", backData.flowID);
        param.set("taskID", backData.taskID);
        param.set("epersonids", backData.epersonids);
        tlv8.XMLHttpRequest("/flowControl/flowtransmitAction", param, "post", true,
            function (r) {
                if (r.state === false) {
                    layui.layer.alert(r.msg);
                    return;
                }
                let flwData = r.data;
                flowComponent.processID = flwData.processID;
                flowComponent.flowID = flwData.flowID;
                flowComponent.taskID = flwData.taskID;
                let onTransferCommit = flowComponent.onTransferCommit;
                if (onTransferCommit) {
                    let inFn = onTransferCommit;
                    if (typeof onTransferCommit == "string") {
                        inFn = eval(onTransferCommit);
                    }
                    if (typeof (inFn) == "function") {
                        let rEvent = {
                            source: flowComponent,
                            taskID: flowComponent.taskID,
                            flowID: flowComponent.flowID,
                            cancel: false
                        };
                        inFn(rEvent);
                    }
                }
                let onFlowActionCommit = flowComponent.onFlowActionCommit;
                if (onFlowActionCommit) {
                    let inFn = onFlowActionCommit;
                    if (typeof onFlowActionCommit == "string") {
                        inFn = eval(onFlowActionCommit);
                    }
                    if (typeof (inFn) == "function") {
                        let rEvent = {
                            source: flowComponent,
                            taskID: flowComponent.taskID,
                            flowID: flowComponent.flowID,
                            cancel: false
                        };
                        inFn(rEvent);
                    }
                }
                if (flowComponent.setting.autoclose === true) {
                    tlv8.showSate(false);
                    tlv8.portal.closeWindow();
                }
            });
    };
};

/**
 @name flowPause
 @description 流程暂停
 @param {string} flowID
 @param {string} taskID
 */
tlv8.flw.prototype.flowPause = function (flowID, taskID) {
    let flowComponent = this;
    layui.layer.confirm("流程暂停后只能到任务中心激活.\n  确定暂停吗?", function () {
        let onBeforeSuspend = flowComponent.onBeforeSuspend;
        if (onBeforeSuspend) {
            let inFn = onBeforeSuspend;
            if (typeof onBeforeSuspend == "string") {
                inFn = eval(onBeforeSuspend);
            }
            if (typeof (inFn) == "function") {
                let rEvent = {
                    source: flowComponent,
                    taskID: flowComponent.taskID,
                    flowID: flowComponent.flowID,
                    cancel: false
                };
                let bfData = inFn(rEvent);
                try {
                    if (bfData.cancel === true) {
                        return "cancel";
                    }
                } catch (e) {
                }
            } else {
                try {
                    if (inFn.cancel === true) {
                        return "cancel";
                    }
                } catch (e) {
                }
            }
        }
        let onBeforeFlowAction = flowComponent.onBeforeFlowAction;
        if (onBeforeFlowAction) {
            let inFn = onBeforeFlowAction;
            if (typeof onBeforeFlowAction == "string") {
                inFn = eval(onBeforeFlowAction);
            }
            if (typeof (inFn) == "function") {
                let rEvent = {
                    source: flowComponent,
                    taskID: flowComponent.taskID,
                    flowID: flowComponent.flowID,
                    cancel: false
                };
                inFn(rEvent);
            }
        }
        let param = new tlv8.RequestParam();
        param.set("flowID", flowID || flowComponent.flowID);
        param.set("taskID", taskID || flowComponent.taskID);
        tlv8.showModelState(true);
        tlv8.XMLHttpRequest("/flowControl/flowpauseAction", param, "post", true,
            function (r) {
                tlv8.showModelState(false);
                if (r.data.flag === "false") {
                    alert("操作失败:" + r.data.message);
                } else {
                    let onSuspendCommit = flowComponent.onSuspendCommit;
                    if (onSuspendCommit) {
                        let inFn = onSuspendCommit;
                        if (typeof onSuspendCommit == "string") {
                            inFn = eval(onSuspendCommit);
                        }
                        if (typeof (inFn) == "function") {
                            let rEvent = {
                                source: flowComponent,
                                taskID: flowComponent.taskID,
                                flowID: flowComponent.flowID,
                                cancel: false
                            };
                            inFn(rEvent);
                        }
                    }
                    let onFlowActionCommit = flowComponent.onFlowActionCommit;
                    if (onFlowActionCommit) {
                        let inFn = onFlowActionCommit;
                        if (typeof onFlowActionCommit == "string") {
                            inFn = eval(onFlowActionCommit);
                        }
                        if (typeof (inFn) == "function") {
                            let rEvent = {
                                source: flowComponent,
                                taskID: flowComponent.taskID,
                                flowID: flowComponent.flowID,
                                cancel: false
                            };
                            inFn(rEvent);
                        }
                    }
                    if (flowComponent.setting.autoclose)
                        tlv8.portal.closeWindow();
                }
                let onAfterSuspend = flowComponent.onAfterSuspend;
                if (onAfterSuspend) {
                    let inFn = onAfterSuspend;
                    if (typeof onAfterSuspend == "string") {
                        inFn = eval(onAfterSuspend);
                    }
                    if (typeof (inFn) == "function") {
                        let rEvent = {
                            source: flowComponent,
                            taskID: flowComponent.taskID,
                            flowID: flowComponent.flowID,
                            cancel: false
                        };
                        inFn(rEvent);
                    }
                }
                let onAfterFlowAction = flowComponent.onAfterFlowAction;
                if (onAfterFlowAction) {
                    let inFn = onAfterFlowAction;
                    if (typeof onAfterFlowAction == "string") {
                        inFn = eval(onAfterFlowAction);
                    }
                    if (typeof (inFn) == "function") {
                        let rEvent = {
                            source: flowComponent,
                            taskID: flowComponent.taskID,
                            flowID: flowComponent.flowID,
                            cancel: false
                        };
                        inFn(rEvent);
                    }
                }
            });
    });
};

/**
 @name flowStop
 @description 流程终止
 @param {string} flowID
 @param {string} taskID
 */
tlv8.flw.prototype.flowStop = function (flowID, taskID) {
    let flowComponent = this;
    layui.layer.confirm("终止流程,流程将彻底作废.\n  确定终止吗?", function () {
        let onBeforeAbort = flowComponent.onBeforeAbort;
        if (onBeforeAbort) {
            let inFn = onBeforeAbort;
            if (typeof onBeforeAbort == "string") {
                inFn = eval(onBeforeAbort);
            }
            if (typeof (inFn) == "function") {
                let rEvent = {
                    source: flowComponent,
                    taskID: flowComponent.taskID,
                    flowID: flowComponent.flowID,
                    cancel: false
                };
                let bfData = inFn(rEvent);
                try {
                    if (bfData.cancel === true) {
                        return "cancel";
                    }
                } catch (e) {
                }
            } else {
                try {
                    if (inFn.cancel === true) {
                        return "cancel";
                    }
                } catch (e) {
                }
            }
        }
        let onBeforeFlowAction = flowComponent.onBeforeFlowAction;
        if (onBeforeFlowAction) {
            let inFn = onBeforeFlowAction;
            if (typeof onBeforeFlowAction == "string") {
                inFn = eval(onBeforeFlowAction);
            }
            if (typeof (inFn) == "function") {
                let rEvent = {
                    source: flowComponent,
                    taskID: flowComponent.taskID,
                    flowID: flowComponent.flowID,
                    cancel: false
                };
                inFn(rEvent);
            }
        }
        let param = new tlv8.RequestParam();
        param.set("flowID", flowID || flowComponent.flowID);
        param.set("taskID", taskID || flowComponent.taskID);
        tlv8.showModelState(true);
        tlv8.XMLHttpRequest("/flowControl/flowstopAction", param, "post", true,
            function (r) {
                tlv8.showModelState(false);
                if (r.state === "false") {
                    layui.layer.alert("操作失败:" + r.msg);
                } else {
                    let onAbortCommit = flowComponent.onAbortCommit;
                    if (onAbortCommit) {
                        let inFn = onAbortCommit;
                        if (typeof onAbortCommit == "string") {
                            inFn = eval(onAbortCommit);
                        }
                        if (typeof (inFn) == "function") {
                            let rEvent = {
                                source: flowComponent,
                                taskID: flowComponent.taskID,
                                flowID: flowComponent.flowID,
                                cancel: false
                            };
                            inFn(rEvent);
                        }
                    }
                    let onFlowActionCommit = flowComponent.onFlowActionCommit;
                    if (onFlowActionCommit) {
                        let inFn = onFlowActionCommit;
                        if (typeof onFlowActionCommit == "string") {
                            inFn = eval(onFlowActionCommit);
                        }
                        if (typeof (inFn) == "function") {
                            let rEvent = {
                                source: flowComponent,
                                taskID: flowComponent.taskID,
                                flowID: flowComponent.flowID,
                                cancel: false
                            };
                            inFn(rEvent);
                        }
                    }
                    if (flowComponent.setting.autoclose)
                        tlv8.portal.closeWindow();
                }
                let onAfterAbort = flowComponent.onAfterAbort;
                if (onAfterAbort) {
                    let inFn = onAfterAbort;
                    if (typeof onAfterAbort == "string") {
                        inFn = eval(onAfterAbort);
                    }
                    if (typeof (inFn) == "function") {
                        let rEvent = {
                            source: flowComponent,
                            taskID: flowComponent.taskID,
                            flowID: flowComponent.flowID,
                            cancel: false
                        };
                        inFn(rEvent);
                    }
                }
                let onAfterFlowAction = flowComponent.onAfterFlowAction;
                if (onAfterFlowAction) {
                    let inFn = onAfterFlowAction;
                    if (typeof onAfterFlowAction == "string") {
                        inFn = eval(onAfterFlowAction);
                    }
                    if (typeof (inFn) == "function") {
                        let rEvent = {
                            source: flowComponent,
                            taskID: flowComponent.taskID,
                            flowID: flowComponent.flowID,
                            cancel: false
                        };
                        inFn(rEvent);
                    }
                }
            });
    });
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
    let sData1 = this.sData1;
    let url = "/system/flow/viewiocusbot/";
    if (flowID && flowID !== "" && taskID && taskID !== "") {
        tlv8.portal.openWindow("流程图",
            url + "?flowID=" + flowID
            + "&taskID=" + taskID);
    } else if (this.processID && this.processID !== "") {
        tlv8.portal.openWindow("流程图",
            url + "?processID="
            + this.processID);
    } else if (sData1 && sData1 !== "") {
        tlv8.task.viewChart(sData1);
    } else {
        let currentUrl = window.location.pathname;
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
        let param = new tlv8.RequestParam();
        if (taskID) {
            param.set("taskID", taskID);
            param.set("executor", executor || "");
            tlv8.XMLHttpRequest("/flowControl/openTaskAction", param, "post", true,
                function (r) {
                    if (r.state === false) {
                        alert("操作失败:" + r.msg);
                    } else {
                        let Data = r.data;
                        let name = Data.name;
                        let sURL = url || Data.url;
                        let sData1 = Data.sData1;
                        sURL += "?flowID=" + Data.flowID + "&taskID="
                            + taskID + "&sData1=" + sData1 + "&task="
                            + taskID + "&activity-pattern=do";
                        let cid = tlv8.portal.currentTabId();
                        tlv8.portal.openWindow(name, sURL);
                        writeLog(event, "处理任务");
                        tlv8.portal.closeWindow(cid);
                    }
                });
        }
    },
    /**
     @function
     @name tlv8.task.viewChart
     @description 查看流程图
     @param {string} sData1
     */
    viewChart: function (sData1) {
        let param = new tlv8.RequestParam();
        param.set("sdata1", sData1);
        let result = tlv8.XMLHttpRequest("getProcessByBillIDAction",
            param, "POST", false);
        let rdata = [];
        try {
            rdata = window.eval("(" + result.data.data + ")");
        } catch (e) {
        }
        let url = "/flow/viewiocusbot/";
        if (rdata.length > 0) {
            let flowID = rdata[0].SFLOWID;
            let taskID = rdata[0].SID;
            tlv8.portal.openWindow("流程图",
                url + "?flowID=" + flowID
                + "&taskID=" + taskID);
        } else {
            let currentUrl = window.location.pathname;
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
        let param = new tlv8.RequestParam();
        param.set("tablename", tablename);
        param.set("fid", fid);
        param.set("billitem", billitem);
        let r = tlv8.XMLHttpRequest("Update_Flowbillinfo", param, "post",
            false, null);
        if (r.data.flag === "false") {
            alert(r.data.message);
            return false;
        }
        return r.data.data;
    }
};