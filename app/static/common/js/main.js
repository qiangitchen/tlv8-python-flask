var cpath = "";
/**
 * @name J$
 * @description 根据ID获取HTML的Element对象
 * @param {string}
 *            id
 * @returns {HTMLElement}
 */
var J$ = function (id) {
    return document.getElementById(id);
};

/**
 * @name J$n
 * @description 根据标签名称获取HTML的Element对象数组
 * @param {string}
 *            tagName
 * @returns {HTMLElements}
 */
var J$n = function (tagName) {
    return document.getElementsByTagName(tagName);
};

/**
 * @name J_u_encode
 * @description 将字符串UTF-8编码
 * @param {string}
 *            str
 * @returns {string}
 */
var J_u_encode = function (str) {
    return encodeURIComponent(encodeURIComponent(str));
};

/**
 * @name J_u_decode
 * @description 将字符串UTF-8解码
 * @param {string}
 *            str
 * @returns {string}
 */
var J_u_decode = function (str) {
    try {
        return decodeURIComponent(decodeURIComponent(str));
    } catch (e) {
        return str;
    }
};

/**
 * @name topparent
 * @description 获取顶层窗口对象
 * @returns {window}
 */
var topparent = function () {
    var nowwdw = window;
    var parentwdw = window.parent;
    while (nowwdw != parentwdw) {
        nowwdw = parentwdw;
        parentwdw = nowwdw.parent;
    }
    return nowwdw;
}();

function checkEncode() {
    var META = document.getElementsByTagName("META");
    for (var i = 0; i < META.length; i++) {
        if (META[i].content.toLowerCase().indexOf("utf-8") > -1)
            return true;
    }
    return false;
}

var createMeta = function () {
    var HTMLhead = document.getElementsByTagName('HEAD')[0];
    var meta = document.createElement('meta');
    meta.setAttribute("http-equiv", "content-type");
    meta.setAttribute("content", "text/html; charset=utf-8");
    HTMLhead.appendChild(meta);
};
if (!checkEncode())
    createMeta();

/**
 * 名空间
 */
var tlv8 = {};

/**
 * 请求参数为了统一编码
 */
tlv8.RequestParam = function () {
    var params = new Map();
    this.params = params;
    var set = function (key, value) {
        this.params.put(key, value);
    };
    this.set = set;
    var get = function (key) {
        return this.params.gut(key);
    };
    this.get = get;
    return this;
};
/*
 * ajax
 */
tlv8.xmlHttp = function () {
    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    return xmlhttp;
};
tlv8.getRequestURI = function () {
    var url = window.location.pathname;
    return url.substring(0, url.lastIndexOf("/"));
};

function getHost() {
    var surl = window.location.href;
    var host = surl.substring(0, surl.indexOf(cpath)) + cpath;
    return host;
}

/**
 * 显示loading状态
 */
tlv8.showSate = function (state) {
    try {
        if (topparent.tlv8.showSate) {
            topparent.tlv8.showSate(state);
        }
    } catch (e) {
    }
};

function addEvent(elm, evType, fn, useCapture) {
    if (elm.addEventListener) {
        elm.addEventListener(evType, fn, useCapture);
        return true;
    } else if (elm.attachEvent) {
        var r = elm.attachEvent('on' + evType, fn);
        return r;
    } else {
        elm['on' + evType] = fn;
    }
}

function removeEvent(obj, type, fn, cap) {
    var cap = cap || false;
    if (obj.removeEventListener) {
        obj.removeEventListener(type, fn, cap);
    } else {
        obj.detachEvent("on" + type, fn);
    }
}

// 添加页面加载事件
addEvent(window, "load", function () {
    if (!window.actiondoing) {
        tlv8.showSate(false);
    }
    try {
        window.top.checkLogin();
    } catch (e) {
    }
    tlv8.Context.init();
}, true);

/**
 * @description发送请求
 * @actionName:Action名称
 * @param:参数
 * @post:{"post"/"get"}
 * @ayn:是否异步提交{true/false}
 * @callBack:回调函数
 * @unShowState:是否显示loading{true/false}
 */
tlv8.XMLHttpRequest = function (actionName, param, post, ayn, callBack,
                                unShowState) {
    var localurl = window.location.href;
    if (localurl.indexOf("file://") > -1) {
        return;
    }
    if (!unShowState) {
        tlv8.showModelState(true);
        window.actiondoing = true;
    }
    var paramMap = param ? param.params : new Map();
    var params = "";
    if (paramMap) {
        if (!paramMap.isEmpty()) {
            var list = paramMap.keySet();
            for (var i = 0; i < list.length; i++) {
                var sk = list[i];
                if (i > 0)
                    params += "&";
                params += sk + "=" + J_u_encode(paramMap.get(sk));
            }
        }
    }
    actionName = (actionName.startWith(cpath) ? actionName : (cpath + "/" + actionName));
    try {
        var rs;
        var hideModelState = function () {
            if (!unShowState) {
                try {
                    tlv8.showModelState(false);
                    window.actiondoing = false;
                } catch (e) {
                }
            }
        };
        $.ajax({
            type: post ? post : "post",
            async: ayn ? ayn : false,
            url: actionName,
            data: params,
            // dataType : "json",
            success: function (result, textStatus) {
                rs = result;
                try {
                    rs = window.eval("(" + rs + ")");
                } catch (e) {
                }
                hideModelState();
                try {
                    if (rs.data.flag == "timeout") {
                        window.top.sessionTimeout();
                        return;
                    }
                } catch (e) {
                }
                if (callBack && typeof callBack == "function") {
                    try {
                        callBack(rs);
                    } catch (e) {
                        // console.error(e);
                    }
                }
            },
            error: function (xreq, xmsg, xep) {
                hideModelState();
                // alert("请求失败! \nurl:"+actionName+"\n错误信息："+xmsg);
            }
        });
        return rs;
    } catch (e) {
        // console.log(e);
    }
};

// 初始化当前登陆人信息
function initUserInfo() {
    var personID = tlv8.Context.getCurrentPersonID();
    var param = new tlv8.RequestParam();
    param.set("personID", personID);
    tlv8.XMLHttpRequest("InitUserInfo", param, "get", true, null, true);
}

/*
 * 写操作日志
 */
function writeLog(ev, actionName, discription) {
    if (window.isWriteLog == false)
        return;
    try {
        var activateName = $("title").text();
        var srcPath = window.location.pathname;
        if (srcPath.indexOf("?") > 0)
            srcPath = srcPath.substring(0, srcPath.indexOf("?"));
        var param = new tlv8.RequestParam();
        param.set("personID", tlv8.Context.getCurrentPersonID());
        param.set("processName", "");
        param.set("activateName", activateName);
        param.set("actionName", actionName ? actionName : "查看");
        param.set("srcPath", srcPath);
        param.set("discription", discription ? discription : "");
        tlv8.XMLHttpRequest("/system/WriteSystemLogAction", param, "post", true,
            null, true);
    } catch (e) {
        console.log(e);
    }
}

addEvent(window, "load", writeLog, false);

tlv8.RequestURLParam = {
    /**
     * @name tlv8.RequestURLParam.getParam
     * @description 获取URL参数
     * @param {string}
     *            paramName
     * @returns {string}
     */
    getParam: function (name) {
        var lurl = window.location.href;
        if (lurl.indexOf(name) < 0)
            return;
        if (lurl.indexOf("?") < 0) {
            return "";
        } else {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null)
                return J_u_decode(r[2]);
            var par;
            if (lurl.indexOf("?" + name) > 0) {
                par = lurl.substring(lurl.indexOf("?" + name) + 1, lurl.length);
            }
            if (lurl.indexOf("&" + name) > 0) {
                par = lurl.substring(lurl.indexOf("&" + name) + 1, lurl.length);
            }
            if (!par)
                return;
            var start = name.length + 1;
            var len = (par.indexOf("&") > 0) ? par.indexOf("&") : lurl.length;
            var pav = par.substring(start, len);
            return J_u_decode(pav);
        }
    },
    getParamByURL: function (lurl, name) {
        if (lurl.indexOf(name) < 0)
            return;
        if (lurl.indexOf("?") < 0) {
            return "";
        } else {
            var par;
            if (lurl.indexOf("?" + name) > 0) {
                par = lurl.substring(lurl.indexOf("?" + name) + 1, lurl.length);
            }
            if (lurl.indexOf("&" + name) > 0) {
                par = lurl.substring(lurl.indexOf("&" + name) + 1, lurl.length);
            }
            if (!par)
                return;
            var start = name.length + 1;
            var len = (par.indexOf("&") > 0) ? par.indexOf("&") : lurl.length;
            return J_u_decode(par.substring(start, len));
        }
    }
};

/**
 * @name tlv8.Queryaction
 * @function
 * @description 公用函数java调用动作针对查询
 * @param actionName
 * @param post
 * @param callBack
 * @param data
 * @param where
 * @param ays
 * @returns {JSON}
 */
tlv8.Queryaction = function (actionName, post, callBack, data, where, ays) {
    var table = data ? data.table : "";
    where = where ? where : "";
    var dbkay = data ? data.dbkay : "";
    var relation = data ? data.relation : "";
    var orderby = data ? data.orderby : "";
    if (!where || where == "") {
        where = tlv8.RequestURLParam.getParamByURL(actionName, "where");
    }
    var param = new tlv8.RequestParam();
    param.set("dbkay", dbkay);
    param.set("table", table);
    param.set("relation", relation);
    param.set("orderby", orderby);
    if (actionName.indexOf("getGridActionBySQL") > -1) {
        actionName += "&where=" + J_u_encode(CryptoJS.AESEncrypt(where));
    } else {
        param.set("where", CryptoJS.AESEncrypt(where));
    }
    var isay = (ays == false) ? ays : true;
    var rscallBack = function (r) {
        if (callBack)
            callBack(r.data);
    };
    var result = tlv8.XMLHttpRequest(actionName, param, post, isay,
        rscallBack);
    if (ays == false) {
        if (callBack)
            callBack(result.data);
        return result.data;
    }
};

/**
 * @name tlv8.Deleteaction
 * @function
 * @description 公用函数：java调用动作{针对带参数操作 删除}
 * @param actionName
 * @param post
 * @param callBack
 * @param rowid
 * @param data
 * @param ays
 * @returns {JSON}
 */
tlv8.Deleteaction = function (actionName, post, callBack, rowid, data, ays) {
    if (!rowid || rowid == "") {
        alert("rowid不能为空！");
        return;
    }
    var table = data ? data.table : "";
    var dbkay = data ? data.dbkay : "";
    var Cascade = data ? data.Cascade : "";
    var param = new tlv8.RequestParam();
    param.set("dbkay", dbkay);
    param.set("table", table);
    param.set("rowid", rowid);
    param.set("Cascade", Cascade);
    var isay = (ays == false) ? ays : true;
    var rscallBack = function (r) {
        if (callBack)
            callBack(r.data);
    };
    var result = tlv8.XMLHttpRequest(actionName, param, post, isay,
        rscallBack);
    if (ays == false) {
        if (callBack)
            callBack(result.data);
        return result.data;
    }
};

/**
 * @name tlv8.saveAction
 * @function
 * @description 公用函数：java调用动作{针对带参数操作 保存}
 * @param actionName
 * @param post
 * @param callBack
 * @param data
 * @param allreturn
 * @param ays
 * @returns {JSON}
 */
tlv8.saveAction = function (actionName, post, callBack, data, allreturn,
                            ays) {
    if (!data || data == "") {
        return;
    }
    var table = data.table;
    var cells = data.cells;
    var dbkay = data ? data.dbkay : "";
    var param = new tlv8.RequestParam();
    param.set("dbkay", dbkay);
    param.set("table", table);
    param.set("cells", cells);
    var ays_true = (ays == false) ? ays : true;
    var rscallBack = function (r) {
        if (callBack && allreturn)
            callBack(r);
        else if (callBack) {
            callBack(r.data);
        }
    };
    var result = tlv8.XMLHttpRequest(actionName, param, post, ays_true,
        rscallBack);
    if (ays_true == false && result) {
        if (callBack && allreturn)
            callBack(result);
        else if (callBack) {
            callBack(result.data);
        }
        return result;
    }
};
/*
 * 将字符串转换为XMLDom对象
 */
tlv8.strToXML = function (str) {
    str = str.toString().replaceAll("&", "&amp;");
    var x = "<?xml version=\"1.0\" encoding='UTF-8' ?>\n<root>\n" + str
        + "</root>";
    if (window.ActiveXObject) {
        var xmlDom = new ActiveXObject("Microsoft.XMLDOM");
        xmlDom.async = "false";
        xmlDom.loadXML(x);
        return xmlDom;
    } else if (document.implementation
        && document.implementation.createDocument) {
        var parser = new DOMParser();
        var xmlDom = parser.parseFromString(x, "text/xml");
        return xmlDom;
    }
};

/*
 * 信息提示
 */
function sAlert(str, time) {
    if (topparent != window && topparent.sAlert) {
        topparent.sAlert(str, time);
        return;
    }
    var sAlertDiv = document.getElementById("msgDiv");
    if (sAlertDiv && sAlertDiv.tagName == "DIV") {
        document.body.removeChild(sAlertDiv);
    }
    var msgw, msgh, bordercolor;
    msgw = 100;
    msgh = 20;
    titleheight = 20;
    bordercolor = "#ffffff";
    titlecolor = "#FFFF66";
    var sWidth, sHeight;
    sWidth = document.body.clientWidth;
    sHeight = document.body.clientHeight;
    if (window.innerHeight && window.scrollMaxY) {
        sHeight = window.innerHeight + window.scrollMaxY;
    } else if (document.body.scrollHeight > document.body.offsetHeight) {
        sHeight = document.body.scrollHeight;
    } else {
        sHeight = document.body.offsetHeight;
    }
    var msgObj = document.createElement("div");
    msgObj.setAttribute("id", "msgDiv");
    msgObj.setAttribute("align", "center");
    msgObj.style.background = titlecolor;
    msgObj.style.border = "1px solid " + bordercolor;
    msgObj.style.position = "absolute";
    msgObj.style.left = "88%";
    msgObj.style.top = "1%";
    msgObj.style.font = "12px/1.6em Verdana, Geneva, Arial, Helvetica, sans-serif";
    msgObj.style.width = msgw + "px";
    msgObj.style.height = msgh + "px";
    msgObj.style.textAlign = "center";
    msgObj.style.lineHeight = "2px";
    msgObj.style.zIndex = "101";
    var title = document.createElement("h4");
    title.setAttribute("id", "msgTitle");
    title.setAttribute("align", "center");
    title.style.margin = "0";
    title.style.padding = "3px";
    title.style.background = titlecolor;
    title.style.filter = "progid:DXImageTransform.Microsoft.Alpha(startX=20, startY=20, finishX=100, finishY=100,style=1,opacity=75,finishOpacity=100);";
    title.style.opacity = "0.75";
    title.style.height = "20px";
    title.style.font = "12px Verdana, Geneva, Arial, Helvetica, sans-serif";
    title.style.color = "#000000";
    title.innerHTML = str;
    title.onclick = function () {
        document.getElementById("msgDiv").removeChild(title);
        document.body.removeChild(msgObj);
    };
    document.body.appendChild(msgObj);
    document.getElementById("msgDiv").appendChild(title);
    var txt = document.createElement("p");
    txt.style.margin = "1em 0";
    txt.setAttribute("id", "msgTxt");
    txt.innerHTML = str;
    time = time ? time : 500;
    setTimeout('displayActionMessage()', time);
}

var displayActionMessage = function () {
    if (document.getElementById("msgTitle"))
        document.getElementById("msgDiv").removeChild(
            document.getElementById("msgTitle"));
    if (document.getElementById("msgDiv"))
        document.body.removeChild(document.getElementById("msgDiv"));
};

/**
 * @class tlv8.Data
 * @description 公用对象用于构建提交数据
 */
tlv8.Data = function () {
    this.table = "";
    this.relation = null;
    this.cells = "";
    this.rowid = null;
    this.formid = "";
    this.savAction = "";
    this.dbkay = "";
    this.version = 0;
    this.Cascade = "";
    this.filter = "";
    this.orderby = "";
    this.readonly = false;
    this.childrenData = new Map();
    this.setVersion = function (vi) {
        this.version = vi;
    };
    /**
     * @name setReadonly
     * @description 设置表单只读状态
     * @param {boolean}
     *            sta
     */
    this.setReadonly = function (sta) {
        try {
            this.readonly = sta;
            if (this.relation && this.relation != "") {
                var relations = this.relation.split(",");
                for (var i = 0; i < relations.length; i++) {
                    var revalueEl = document.getElementById(relations[i]);
                    if (revalueEl) {
                        if (this.readonly == true) {
                            revalueEl.readOnly = true;
                            if (revalueEl.parentNode.Check
                                || revalueEl.parentNode.Radio) {
                                revalueEl.parentNode.disabled = true;
                            }
                            if (revalueEl.tagName == "DIV"
                                || revalueEl.tagName == "SELECT") {
                                revalueEl.disabled = true;
                            }
                        } else {
                            revalueEl.readOnly = false;
                            if (revalueEl.parentNode.Check
                                || revalueEl.parentNode.Radio) {
                                revalueEl.parentNode.disabled = false;
                            }
                            if (revalueEl.tagName == "DIV"
                                || revalueEl.tagName == "SELECT") {
                                revalueEl.disabled = false;
                            }
                        }
                    }
                    try {
                        // 只读设置取消单击事件
                        $(revalueEl).removeAttr("onclick");
                    } catch (e) {
                    }
                }
            } else if (this.formid) {
                $("#" + this.formid).find("input").attr("readonly", "readonly");
                $("#" + this.formid).find("textarea").attr("readonly",
                    "readonly");
                $("#" + this.formid).find("select")
                    .attr("disabled", "disabled");
                $("#" + this.formid).find("input[type='radio']").attr(
                    "disabled", "disabled");
            }
        } catch (e) {
        }
    };
    /**
     * @name setOrderby
     * @description 设置数据排序
     * @param {string}
     *            ob
     * @example data.setOrderby("FCODE asc,fNAME desc");
     */
    this.setOrderby = function (ob) {
        if (typeof (ob) == "string")
            this.orderby = ob;
        else
            this.orderby = ob.toString();
    };
    /**
     * @name setFilter
     * @description 设置过滤条件
     * @param {string}
     *            fil
     * @example data.setFilter("FCODE = '123'");
     */
    this.setFilter = function (fil) {
        if (typeof (fil) == "string")
            this.filter = fil;
        else
            this.filter = fil.toString();
    };
    /**
     * @name setCascade
     * @description 设置级联删除{表名:外键,表名:外键,...}
     * @param {string}
     *            cas
     * @example data.setCascade("OA_ALREADYBUY:fBillID");
     * @example data.setCascade("OA_ALREADYBUY:fBillID,OA_ALREADYBUY1:fBillID1");
     */
    this.setCascade = function (cas) {
        if (typeof (cas) == "string")
            this.Cascade = cas;
        else
            this.Cascade = cas.toString();
    };
    /**
     * @name setRowId
     * @description 设置主键，记录表单当前正在编辑的数据主键。
     * @param {string}
     *            rowid
     */
    this.setRowId = function (id) {
        try {
            if (typeof (id) == "string")
                this.rowid = id;
            else
                this.rowid = id.toString();
        } catch (e) {
        }
        try {
            J$(this.formid).rowid = this.rowid;
            J$(this.formid).setAttribute("rowid", this.rowid);
            $("#" + this.formid).attr("rowid", this.rowid);
        } catch (e) {
        }
    };
    /**
     * @name setDbkey
     * @description 设置关联数据库
     * @param {string}
     *            dbkey
     * @example data.setDbkey("oa");
     */
    this.setDbkey = function (k) {
        if (typeof (k) == "string")
            this.dbkay = k;
        else {
            try {
                this.dbkay = k.toString();
            } catch (e) {
            }
        }
    };
    this.setSaveAction = function (a) {
        if (typeof (a) == "string")
            this.savAction = a;
        else
            this.savAction = a.toString();
    };
    /**
     * @name setFormId
     * @description 设置数据对应的FORM表单ID
     * @param {string}
     *            s
     * @example data.setFormId("main_form");
     */
    this.setFormId = function (s) {
        if (typeof (s) == "string")
            this.formid = s;
        else
            this.formid = s.toString();
        try {
            document.getElementById(this.formid).data = this;
        } catch (e) {
        }
    };
    var onDataValueChanged;
    var isEdited = false;
    /**
     * @name setonDataValueChanged
     * @description 设置表单值改变事件回调函数
     * @param {function}
     *            fn
     * @example data.setonDataValueChanged(function(event){});
     */
    this.setonDataValueChanged = function (fn) {
        onDataValueChanged = fn;
        this.registerChangeEvent();
        document.getElementById(this.formid).data = this;
    };
    /**
     * @name registerChangeEvent
     * @description 注册表单值改变事件,一般不需要主动调用
     * @param {string}
     *            formid
     * @example data.registerChangeEvent();
     */
    this.registerChangeEvent = function (formid) {
        var dataform = formid || this.formid;
        var mainform = document.getElementById(dataform);
        var $JromTag = function (tagname) {
            return mainform.getElementsByTagName(tagname);
        };
        var inputs = $JromTag("INPUT");
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].type == "text" || inputs[i].type == "textarea"
                || inputs[i].type == "password"
                || inputs[i].type == "date" || inputs[i].type == "datetime"
                || inputs[i].type == "hidden") {
                var $rid = inputs[i].id;
                if ($rid && $rid != ""
                    && $rid.toUpperCase().substr(4, 12) != "_FIXFFCURSOR"
                    && $rid.indexOf("_quick_text") < 0
                    && $rid.indexOf("_page") < 0
                    && $rid.indexOf("_editgridipt") < 0) {
                    addEvent(inputs[i], "change", function (evt) {
                        isEdited = true;
                        var event = evt || window.event;
                        var objEdit = event.srcElement ? event.srcElement
                            : event.target;
                        var _dchg = onDataValueChanged;
                        if (_dchg && typeof (_dchg) == "function") {
                            _dchg(evt, objEdit.id, objEdit
                                .getAttribute("value"), objEdit.type);
                        } else if (_dchg && _dchg != "") {
                            _dchg = eval(_dchg);
                            _dchg(evt, objEdit.id, objEdit
                                .getAttribute("value"), objEdit.type);
                        }
                    }, true);
                }
            }
        }
        var textareas = $JromTag("TEXTAREA");
        for (var i = 0; i < textareas.length; i++) {
            var $rid = textareas[i].id;
            var $rval = textareas[i].getAttribute("value")
                || textareas[i].innerHTML;
            if ($rid && $rid != ""
                && $rid.toUpperCase().substr(4, 12) != "_FIXFFCURSOR") {
                addEvent(textareas[i], "change", function (evt) {
                    isEdited = true;
                    var event = evt || window.event;
                    var objEdit = event.srcElement ? event.srcElement
                        : event.target;
                    var _dchg = onDataValueChanged;
                    if (_dchg && typeof (_dchg) == "function") {
                        _dchg(evt, objEdit.id, objEdit.getAttribute("value"),
                            objEdit.type);
                    } else if (_dchg && _dchg != "") {
                        _dchg = eval(_dchg);
                        _dchg(evt, objEdit.id, objEdit.getAttribute("value"),
                            objEdit.type);
                    }
                }, true);
            }
        }
        var selects = $JromTag("SELECT");
        for (var i = 0; i < selects.length; i++) {
            var $rid = selects[i].id;
            var $rval = selects[i].getAttribute("value");
            if ($rid && $rid != ""
                && $rid.toUpperCase().substr(4, 12) != "_FIXFFCURSOR") {
                addEvent(selects[i], "change", function (evt) {
                    isEdited = true;
                    var event = evt || window.event;
                    var objEdit = event.srcElement ? event.srcElement
                        : event.target;
                    var _dchg = onDataValueChanged;
                    if (_dchg && typeof (_dchg) == "function") {
                        _dchg(evt, objEdit.id, objEdit.getAttribute("value"),
                            objEdit.type);
                    } else if (_dchg && _dchg != "") {
                        _dchg = eval(_dchg);
                        _dchg(evt, objEdit.id, objEdit.getAttribute("value"),
                            objEdit.type);
                    }
                }, true);
            }
        }
        var labels = $JromTag("LABEL");
        for (var i = 0; i < labels.length; i++) {
            var $rid = labels[i].id;
            var $rval = labels[i].innerHTML;
            if ($rid && $rid != ""
                && $rid.toUpperCase().substr(4, 12) != "_FIXFFCURSOR") {
                addEvent(labels[i], "change", function (evt) {
                    isEdited = true;
                    var event = evt || window.event;
                    var objEdit = event.srcElement ? event.srcElement
                        : event.target;
                    var _dchg = onDataValueChanged;
                    if (_dchg && typeof (_dchg) == "function") {
                        _dchg(evt, objEdit.id, objEdit.getAttribute("value"),
                            objEdit.type);
                    } else if (_dchg && _dchg != "") {
                        _dchg = eval(_dchg);
                        _dchg(evt, objEdit.id, objEdit.getAttribute("value"),
                            objEdit.type);
                    }
                }, true);
            }
        }
    };
    /**
     * @name setTable
     * @description 设置表单关联数据库表名
     * @param {string}
     *            tablename
     * @example data.setTable("SA_OPPERSON");
     */
    this.setTable = function (t) {
        if (typeof (t) == "string")
            this.table = t;
        else {
            try {
                this.table = t.toString();
            } catch (e) {
            }
        }
    };
    /**
     * @name setCells
     * @description 设置列的值
     * @param {Map}
     *            cells
     * @example var cell=new Map(); cell.put("a","a"); cell.put("b","b");
     *          data.setCells(cell);
     */
    this.setCells = function (cell) {
        if (cell && typeof (cell) == "object") {
            var keys = cell.keySet();
            for (i in keys) {
                var key = keys[i];
                var value = cell.get(key);
                try {
                    value = value.replaceAll("<", "#lt;");
                    value = value.replaceAll(">", "#gt;");
                    value = value.replaceAll("&nbsp;", "#160;");
                    value = value.replaceAll("'", "#apos;");
                    value = value.replaceAll("&", "#amp;");
                } catch (e) {
                }
                this.cells += "<" + key + "><![CDATA[" + value + "]]></" + key
                    + ">";
            }
        } else if (typeof (cell) == "function") {
            alert("传入的类型不能为：function");
        } else if (!cell) {
            this.cells = "";
        } else {
            this.cells += cell;
        }
    };
    /**
     * @name saveData
     * @description 保存数据
     * @returns {string}
     * @example var rowid = data.saveData();
     */
    this.saveData = function (formfield) {
        if (!this.formid || this.formid == "") {
            alert("未指定保存内容！");
            return false;
        }
        var bfSave = document.getElementById(this.formid).getAttribute(
            "beforeSave");
        if (bfSave && bfSave != "") {
            if (typeof bfSave == "function") {
                var bfck = bfSave(this);
                if (bfck == false)
                    return false;
            } else {
                var bfS = window.eval(bfSave);
                if (typeof bfS == "function") {
                    var bfck = bfS(this);
                    if (bfck == false)
                        return false;
                }
            }
        }
        var mainform = document.getElementById(this.formid);
        mainform.data = this;
        var cell = new Map();
        var fdata = formfield || $(mainform).serializeJSON();
        for (var cnm in fdata) {
            cell.put(cnm, fdata[cnm]);
        }
        var $JromTag = function (tagname) {
            return mainform.getElementsByTagName(tagname);
        };
        var labels = $JromTag("LABEL");
        for (var i = 0; i < labels.length; i++) {
            var $rid = labels[i].id;
            var $rval = labels[i].innerHTML;
            if ($rid && $rid != ""
                && $rid.toUpperCase().substr(4, 12) != "_FIXFFCURSOR") {
                labels[i].title = $rval;
                labels[i].setAttribute("value", $rval);
                if ($(labels[i]).attr("format")
                    && $(labels[i]).attr("format") != "") {
                    try {
                        $rval = $rval.replaceAll(",", "");
                    } catch (e) {
                        $rval = "";
                    }
                }
                cell.put($rid, $rval);
            }
        }
        var rowid = $(mainform).attr("rowid") || mainform.getAttribute("rowid")
            || mainform.rowid;
        if (rowid) {
            cell.put("rowid", rowid);
        }
        cell.put("VERSION", (this.version + 1) + "");
        this.setCells();
        this.setCells("<root>");
        this.setCells(cell);
        this.setCells("</root>");
        if (!this.savAction || this.savAction == "") {
            this.setSaveAction("saveAction");
        } else {
            this.setSaveAction(this.savAction);
        }
        var self = this;
        var r = tlv8.saveAction(this.savAction, "post", null, this, true,
            false);
        writeLog(window.event, "保存数据", "操作的表:" + this.dbkay + "." + this.table);
        if (r) {
            isEdited = false;
            var msessage = "操作成功!";
            if (r.data.flag != "true") {
                msessage = r.data.message;
                // 截取java异常
                if (msessage.indexOf("Exception:") > 0) {
                    msessage = msessage.substring(msessage
                        .indexOf("Exception:") + 10);
                }
                alert(msessage);
                return false;
            } else {
                this.version++;// 保存成功记录新的版本号
            }
            sAlert(msessage, 500);
            var rRowID = r.data.rowid;
            self.setRowId(rRowID);
            try {
                mainform.setAttribute("rowid", rRowID);
            } catch (e) {
                mainform.rowid = rRowID;
            }
            if (!self.childrenData.isEmpty()) {
                var keyset = self.childrenData.keySet();
                for (i in keyset) {
                    key = keyset[i];
                    var childData = self.childrenData.get(key);
                    var isCsave = childData.saveData(event, self.refreshData);
                    if (!isCsave || isCsave == false) {
                        break;
                    }
                }
            }
            var afSave = mainform.getAttribute("afterSave");
            if (afSave && afSave != "") {
                if (typeof afSave == "function") {
                    afSave(this, r.data);
                } else {
                    var afS = window.eval(afSave);
                    if (typeof afS == "function") {
                        afS(this, r.data);
                    }
                }
            }
            return rRowID;
        }
    };
    this.deleteAction = "";
    this.setDeleteAction = function (del) {
        if (typeof (del) == "string")
            this.deleteAction = del;
        else
            this.deleteAction = del.toString();
    };
    /**
     * @name deleteData
     * @description 删除数据
     * @param {boolean}
     *            isconfirm -是否提示确认[默认是]
     * @example data.deleteData();
     */
    this.deleteData = function (isconfirm) {
        var bfDelete = document.getElementById(this.formid).getAttribute(
            "beforeDelete");
        if (bfDelete && bfDelete != "") {
            if (typeof bfDelete == "function") {
                bfDelete(this);
            } else {
                var bfd = window.eval(bfDelete);
                if (typeof bfd == "function") {
                    bfd(this);
                }
            }
        }
        if (!this.deleteAction || this.deleteAction == "") {
            this.setDeleteAction("deleteAction");
        } else {
            this.setDeleteAction(this.deleteAction);
        }
        document.getElementById(this.formid).data = this;
        var self = this;
        if (isconfirm == false) {
            tlv8.Deleteaction(this.deleteAction, "post", function () {
                self.afdelete(self);
            }, this.rowid, this);
            isEdited = false;
            return true;
        } else if (confirm("确定删除数据吗?")) {
            tlv8.Deleteaction(this.deleteAction, "post", function () {
                self.afdelete(self);
            }, this.rowid, this);
            isEdited = false;
            return true;
        }
        return false;
    };
    this.afdelete = function (self) {
        writeLog(window.event, "删除数据", "操作的表:" + self.dbkay + "." + self.table);
        try {
            document.getElementById(self.formid).reset();
        } catch (e) {
        }
        var afDelete = document.getElementById(self.formid).getAttribute(
            "afterDelete");
        if (afDelete && afDelete != "") {
            if (typeof afDelete == "function") {
                afDelete(document.getElementById(self.formid).data);
            } else {
                var afd = window.eval(afDelete);
                if (typeof afd == "function") {
                    afd(document.getElementById(self.formid).data);
                }
            }
        }
    };
    /**
     * @name refreshData
     * @param {boolean}
     *            isconfirm -是否提示确认
     * @param {boolean}
     *            isrefreshSub -是否刷新关联的子表数据
     * @description 刷新数据
     * @description 只是重加载表单的数据，不刷新页面
     * @example data.refreshData();
     */
    this.refreshData = function (isconfirm, isrefreshSub) {
        if (isEdited == true) {
            if (isconfirm != false)
                if (!confirm("当前数据已更改，刷新数据更改后的数据将丢失，是否确定刷新?")) {
                    return false;
                }
        }
        var bfrefresh = document.getElementById(this.formid).getAttribute(
            "beforeRefresh");
        if (bfrefresh && bfrefresh != "") {
            if (typeof bfrefresh == "function") {
                bfrefresh(this);
            } else {
                var bfr = window.eval(bfrefresh);
                if (typeof bfr == "function") {
                    bfr(this);
                }
            }
        }
        this.relation = "";
        var mainform = document.getElementById(this.formid);
        mainform.reset();
        var $JromTag = function (tagname) {
            return mainform.getElementsByTagName(tagname);
        };
        mainform.isrefreshSub = isrefreshSub;
        mainform.data = this;
        var rowid = $(mainform).attr("rowid") || mainform.getAttribute("rowid")
            || mainform.rowid;
        if (rowid && rowid != "") {
            this.setRowId(trim(rowid));
        }
        if (!this.filter || this.filter == "") {
            if (this.dbkay && this.dbkay != "system") {
                this.setFilter("fID='" + this.rowid + "'");
            } else {
                this.setFilter("sID='" + this.rowid + "'");
            }
        }
        if (this.dbkay && this.dbkay != "system") {
            this.relation += ",FID";
        } else {
            this.relation += ",SID";
        }
        var inputs = $JromTag("INPUT");
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].type == "text" || inputs[i].type == "textarea"
                || inputs[i].type == "password" || inputs[i].type == "number"
                || inputs[i].type == "date" || inputs[i].type == "datetime"
                || inputs[i].type == "hidden") {
                var $rid = inputs[i].id;
                if ($rid && $rid != ""
                    && $rid.toUpperCase().substr(4, 12) != "_FIXFFCURSOR"
                    && $rid.indexOf("_editgridipt") < 0
                    && $rid.indexOf("_quick_text") < 0
                    && $rid.indexOf("_page") < 0) {
                    this.relation += "," + $rid;
                }
            }
        }
        var textareas = $JromTag("TEXTAREA");
        for (var i = 0; i < textareas.length; i++) {
            var $rid = textareas[i].id;
            if ($rid && $rid != ""
                && $rid.toUpperCase().substr(4, 12) != "_FIXFFCURSOR") {
                this.relation += "," + $rid;
            }
        }
        var selects = $JromTag("SELECT");
        for (var i = 0; i < selects.length; i++) {
            var $rid = selects[i].id;
            if ($rid && $rid != ""
                && $rid.toUpperCase().substr(4, 12) != "_FIXFFCURSOR") {
                this.relation += "," + $rid;
            }
        }
        var labels = $JromTag("LABEL");
        for (var i = 0; i < labels.length; i++) {
            var $rid = labels[i].id;
            if ($rid && $rid != ""
                && $rid.toUpperCase().substr(4, 12) != "_FIXFFCURSOR") {
                this.relation += "," + $rid;
            }
        }
        this.relation += ",VERSION";
        this.relation = this.relation.replace(",", "");
        var self = this;
        tlv8.Queryaction("queryAction", "post", function (rd) {
            self.setData(rd, self.formid);
        }, this, this.filter, true);
        return true;
    };
    this.setData = function (data, nowformid) {
        var taptt = tlv8.RequestURLParam.getParam("activity-pattern");
        var isTasksub = (taptt == "detail");
        if (isTasksub) {
            this.setReadonly(true);
        }
        var message = "操作成功!";
        if (data.flag == "false") {
            msessage = r.data.message;
            if (msessage.indexOf("Exception:") > 0) {
                msessage = msessage
                    .substring(msessage.indexOf("Exception:") + 10);
            }
            alert(msessage);
        } else {
            try {
                var xmlElem = tlv8.strToXML(data.data);
                var relations = data.relation.split(",");
                var type = getOs();
                for (var i = 0; i < relations.length; i++) {
                    var revalueEl = document.getElementById(nowformid)[relations[i]]
                        || document.getElementById(relations[i]);
                    if (data.data && data.data != "") {
                        var sValue = (type == "MSIE") ? xmlElem
                                .getElementsByTagName(relations[i])[0].text
                            : xmlElem.getElementsByTagName(relations[i])
                                .item(0).textContent;
                        if (relations[i] == "SID" || relations[i] == "FID") {
                            document.getElementById(nowformid).rowid = sValue;
                            document.getElementById(nowformid).setAttribute("rowid", sValue);
                            $("#" + nowformid).attr("rowid", sValue);
                            document.getElementById(nowformid).data.setRowId(sValue);
                        }
                        if (relations[i] == "VERSION") {
                            document.getElementById(nowformid).data
                                .setVersion(parseInt(sValue) || 0);
                        }
                    } else {
                        document.getElementById(nowformid).rowid = "";
                        document.getElementById(nowformid).data.setRowId("");
                    }
                    if (revalueEl && data.data && data.data != "") {
                        var $dval = "";
                        try {
                            $dval = (type == "MSIE") ? xmlElem
                                    .getElementsByTagName(relations[i])[0].text
                                : xmlElem
                                    .getElementsByTagName(relations[i])
                                    .item(0).textContent
                                || "";
                            $dval = $dval.replaceAll("&amp;", "&");
                        } catch (e) {
                        }
                        var elformat = "";
                        try {
                            elformat = revalueEl.getAttribute("format");
                        } catch (e) {
                        }
                        if (elformat && elformat != "") {
                            var Sdate = tlv8.System.Date.strToDate($dval);
                            if (Sdate && elformat == "yyyy-MM-dd") {
                                $dval = Sdate.format("yyyy-MM-dd");
                            } else if (Sdate
                                && elformat == "yyyy-MM-dd hh:mm:ss") {
                                $dval = Sdate.format("yyyy-MM-dd hh:mm:ss");
                            } else if (Sdate
                                && elformat.indexOf("yyyy-MM-dd") > -1) {
                                $dval = Sdate.format(elformat);
                            } else if ($dval) {
                                revalueEl.olvalue = $dval;
                                $dval = tlv8.numberFormat($dval, elformat);
                                if (!revalueEl.getAttribute("readonly")) {
                                    revalueEl.onfocus = function () {
                                        this
                                            .setAttribute("value",
                                                this.olvalue);
                                    };
                                    revalueEl.onblur = function () {
                                        this.olvalue = this
                                            .getAttribute("value");
                                        this.setAttribute("value", tlv8
                                            .numberFormat(this
                                                    .getAttribute("value"),
                                                this.format));
                                    };
                                }
                            }
                        } else {
                            $dval = $dval.replaceAll("#160;", "&nbsp;");
                            $dval = $dval.replaceAll("#lt;", "<");
                            $dval = $dval.replaceAll("#gt;", ">");
                            $dval = $dval.replaceAll("#apos;", "'");
                            $dval = $dval.replaceAll("#amp;", "&");
                        }
                        if ("LABEL" == revalueEl.tagName) {
                            try {
                                revalueEl.innerHTML = $dval;
                                revalueEl.title = $dval;
                                revalueEl.setAttribute("value", $dval);
                            } catch (e) {
                            }
                        } else if ("TEXTAREA" == revalueEl.tagName) {
                            try {
                                revalueEl.value = $dval;
                                revalueEl.title = $dval;
                                revalueEl.setAttribute("value", $dval);
                                $(revalueEl).val($dval);
                            } catch (e) {
                            }
                        } else {
                            try {
                                if (revalueEl.tagName == "DIV") {
                                    revalueEl = revalueEl
                                        .getElementsByTagName("input")[0] ? revalueEl
                                            .getElementsByTagName("input")[0]
                                        : revalueEl
                                            .getElementsByTagName("select")[0];
                                    revalueEl.setAttribute("value", $dval);
                                    revalueEl.title = $dval;
                                    revalueEl.value = $dval;
                                } else {
                                    revalueEl.setAttribute("value", $dval);
                                    revalueEl.title = $dval;
                                    revalueEl.value = $dval;
                                }
                                $(revalueEl).val($dval);
                            } catch (e) {
                            }
                            try {
                                // 单选框赋值
                                document.getElementById(revalueEl.id
                                    + "_compent").Radio.initData(revalueEl);
                            } catch (e) {
                            }
                            try {
                                // 单选框赋值
                                var cellname = revalueEl.id || $(revalueEl).attr("name");
                                $('input[name="' + cellname + '"][value="' + $dval + '"]').attr('checked', 'checked');
                                layui.form.render('radio');
                            } catch (e) {
                            }
                            try {
                                // 多选框赋值
                                document.getElementById(revalueEl.id
                                    + "_compent").Check.initData(revalueEl);
                            } catch (e) {
                            }
                            try {
                                // easyUI下拉选择
                                $("#" + relations[i]).combo("setValue", $dval);
                            } catch (e) {
                            }
                            try {
                                // easyUI下拉选择
                                $("#" + relations[i]).combobox("setValue", $dval);
                            } catch (e) {
                            }
                            try {
                                // easyUI下拉选择
                                $("#" + relations[i]).combotree("setValue", $dval);
                            } catch (e) {
                            }
                            try {
                                // easyUI下拉选择
                                $("#" + relations[i]).combogrid("setValue", $dval);
                            } catch (e) {
                            }
                        }
                    }
                }
            } catch (e) {
                alert(e.name + ":" + e.message);
            }
        }
        isEdited = false;
        var childrenData = document.getElementById(nowformid).data.childrenData;
        var isrefreshSub = document.getElementById(nowformid).isrefreshSub;
        if (!childrenData.isEmpty() && isrefreshSub != false) {
            var keyset = childrenData.keySet();
            for (i in keyset) {
                try {
                    key = keyset[i];
                    var childData = childrenData.get(key);
                    childData.refreshData(null, false);
                } catch (e) {
                }
            }
        }
        tlv8.requerat();// 提示设置
        var afrefresh = document.getElementById(nowformid).getAttribute(
            "afterRefresh");
        if (afrefresh && afrefresh != "") {
            if (typeof afrefresh == "function") {
                afrefresh(document.getElementById(nowformid).data);
            } else {
                var afr = window.eval(afrefresh);
                if (typeof afr == "function") {
                    afr(document.getElementById(nowformid).data);
                }
            }
        }
        sAlert(message, 500);
    };
    /**
     * @name getValueByName
     * @param {string}
     *            cellname -字段名（表单中INPUT、TEXTAREA等字段id）
     * @description 获取指定字段的值
     * @returns {string}
     * @example var nmv = data.getValueByName("FNAME");
     */
    this.getValueByName = function (name) {
        try {
            var revalueEl = document.getElementById(this.formid)[name]
                || document.getElementById(name);
            var elformat = revalueEl.getAttribute("format");
            if (revalueEl) {
                if (revalueEl.tagName == "INPUT"
                    || revalueEl.tagName == "SELECT") {
                    var $dval = $(revalueEl).val()
                        || revalueEl.getAttribute("value");
                    if (!$dval || $dval == null || $dval == "null") {
                        $dval = "";
                    }
                    try {
                        if (elformat && elformat == "0,000.00") {
                            $dval = $dval.toString().replaceAll(",", "");
                        }
                    } catch (e) {
                    }
                    return $dval;
                } else if (revalueEl.tagName == "LABEL") {
                    var $dval = revalueEl.innerHTML;
                    try {
                        if (elformat && elformat == "0,000.00") {
                            $dval = $dval.toString().replaceAll(",", "");
                        }
                    } catch (e) {
                    }
                    return $dval;
                } else {
                    var $dval = $(revalueEl).val()
                        || revalueEl.getAttribute("value");
                    if (!$dval || $dval == null || $dval == "null") {
                        $dval = "";
                    }
                    return $dval;
                }
            } else {
                alert("指定的列名无效：" + name);
            }
        } catch (e) {
            alert("指定的列名无效：" + name);
        }
        return "";
    };
    /**
     * @name setValueByName
     * @param {string}
     *            cellname -字段名（表单中INPUT、TEXTAREA等字段id）
     * @param {string}
     *            value -需要给的值
     * @description 给指定字段赋值
     * @example data.setValueByName("FNAME","test");
     */
    this.setValueByName = function (name, value) {
        try {
            var revalueEl = document.getElementById(this.formid)[name]
                || document.getElementById(name);
            if (revalueEl) {
                revalueEl.title = value;
                revalueEl.value = value;
                if (revalueEl.tagName == "LABEL") {
                    revalueEl.innerHTML = value;
                    revalueEl.setAttribute("value", value);
                } else {
                    $(revalueEl).val(value);
                }
                try {
                    // 单选框赋值
                    document.getElementById(name + "_compent").Radio.initData(revalueEl);
                } catch (e) {
                }
                try {
                    // 多选框赋值
                    document.getElementById(name + "_compent").Check.initData(revalueEl);
                } catch (e) {
                }
                try {
                    // easyUI下拉选择
                    $("#" + name).combo("setValue", value);
                } catch (e) {
                }
                try {
                    // easyUI下拉选择
                    $("#" + name).combobox("setValue", value);
                } catch (e) {
                }
                try {
                    // easyUI下拉选择
                    $("#" + name).combotree("setValue", value);
                } catch (e) {
                }
                try {
                    // easyUI下拉选择
                    $("#" + name).combogrid("setValue", value);
                } catch (e) {
                }
                isEdited = true;
            } else {
                alert("指定的列名无效：" + name);
            }
        } catch (e) {
            alert("指定的列名无效：" + name);
        }
    };
    return this;
};

/**
 * 获取浏览器类型
 */
function getOs() {
    var OsObject = "";
    if (navigator.userAgent.indexOf("MSIE") > 0) {
        return "MSIE";
    }
    if (isFirefox = navigator.userAgent.indexOf("Firefox") > 0) {
        return "Firefox";
    }
    if (isSafari = navigator.userAgent.indexOf("Safari") > 0) {
        return "Safari";
    }
    if (isCamino = navigator.userAgent.indexOf("Camino") > 0) {
        return "Camino";
    }
    if (isMozilla = navigator.userAgent.indexOf("Gecko/") > 0) {
        return "Gecko";
    }
}

/**
 * @class tlv8.toolbar
 * @description 工具栏组件
 * @param {HTMLDivElement}
 *            div
 * @param {string}
 *            insertitem -("readonly":只读,true：可操作,false：不可见)
 * @param {string}
 *            saveitem -("readonly":只读,true：可操作,false：不可见)
 * @param {string}
 *            deleteitem -("readonly":只读,true：可操作,false：不可见)
 * @param {string}
 *            refreshitem -("readonly":只读,true：可操作,false：不可见)
 * @returns {object}
 */
tlv8.toolbar = function (div, insertitem, saveitem, deleteitem, refreshitem) {
    if (!div) return;
    var items = {
        insertAction: function () {
            if (div.getAttribute("insertAction")) {
                eval(div.getAttribute("insertAction"));
            }
        },
        saveAction: function () {
            if (div.getAttribute("saveAction")) {
                eval(div.getAttribute("saveAction"));
            }
        },
        deleteAction: function () {
            if (div.getAttribute("deleteAction")) {
                eval(div.getAttribute("deleteAction"));
            }
        },
        refreshAction: function () {
            if (div.getAttribute("refreshAction")) {
                eval(div.getAttribute("refreshAction"));
            }
        },
        /**
         * @name setItemStatus
         * @description 工具栏组件设置按钮状态
         * @param {string}
         *            insertitem -("readonly":只读,true：可操作,false：不可见)
         * @param {string}
         *            saveitem -("readonly":只读,true：可操作,false：不可见)
         * @param {string}
         *            deleteitem -("readonly":只读,true：可操作,false：不可见)
         * @param {string}
         *            refreshitem -("readonly":只读,true：可操作,false：不可见)
         */
        setItemStatus: function (insertitem, saveitem, deleteitem, refreshitem) {
            var taptt = tlv8.RequestURLParam.getParam("activity-pattern");
            var isTasksub = (taptt == "detail");
            var insert_item = document.getElementById(div.id + "insert-item");
            var insert_item_img = document.getElementById(div.id
                + "insert-item-img");
            var save_item = document.getElementById(div.id + "save-item");
            var save_item_img = document.getElementById(div.id
                + "save-item-img");
            var delete_item = document.getElementById(div.id + "delete-item");
            var delete_item_img = document.getElementById(div.id
                + "delete-item-img");
            var refresh_item = document.getElementById(div.id + "refresh-item");
            var refresh_item_img = document.getElementById(div.id
                + "refresh-item-img");
            var ienable = $dpimgpath + "toolbar/insert.gif";
            var iread = $dpimgpath + "toolbar/un_insert.gif";
            var senable = $dpimgpath + "toolbar/save.gif";
            var sread = $dpimgpath + "toolbar/un_save.gif";
            var denable = $dpimgpath + "toolbar/remove.gif";
            var dread = $dpimgpath + "toolbar/un_remove.gif";
            var renable = $dpimgpath + "toolbar/refreshbill.png";
            var rread = $dpimgpath + "toolbar/un_refreshbill.png";
            if (insertitem == false) {
                document.getElementById(div.id + "insert-item-tr").style.display = "none";
            } else if (insertitem == "readonly" || isTasksub) {
                insert_item_img.src = iread;
                insert_item.onclick = null;
            } else if (insertitem == true) {
                document.getElementById(div.id + "insert-item-tr").style.display = "";
                insert_item_img.src = ienable;
                insert_item.onclick = items.insertAction;
            }
            if (saveitem == false) {
                document.getElementById(div.id + "save-item-tr").style.display = "none";
            } else if (saveitem == "readonly" || isTasksub) {
                save_item_img.src = sread;
                save_item.onclick = null;
            } else if (saveitem == true) {
                document.getElementById(div.id + "save-item-tr").style.display = "";
                save_item_img.src = senable;
                save_item.onclick = items.saveAction;
            }
            if (deleteitem == false) {
                document.getElementById(div.id + "delete-item-tr").style.display = "none";
            } else if (deleteitem == "readonly" || isTasksub) {
                delete_item_img.src = dread;
                delete_item.onclick = null;
            } else if (deleteitem == true) {
                document.getElementById(div.id + "delete-item-tr").style.display = "";
                delete_item_img.src = denable;
                delete_item.onclick = items.deleteAction;
            }
            if (refreshitem == false) {
                document.getElementById(div.id + "refresh-item-tr").style.display = "none";
            } else if (refreshitem == "readonly" || isTasksub) {
                refresh_item_img.src = rread;
                refresh_item.onclick = null;
            } else if (refreshitem == true) {
                document.getElementById(div.id + "refresh-item-tr").style.display = "";
                refresh_item_img.src = renable;
                refresh_item.onclick = items.refreshAction;
            }
        }
    };
    this.items = items;
    if (!checkPathisHave($dpcsspath + "toolbar.main.css"))
        createStyleSheet($dpcsspath + "toolbar.main.css");
    div.style.overflow = "hidden";
    var Stander = "<table style='align:left;' class='standard_toolbar' border='0' id='toolbar'><tr>"
        + "<td width='75px' align='left' id='"
        + div.id
        + "insert-item-tr'><button class='btn btn-default btn-sm' style='float:left;margin-right:5px;' id='"
        + div.id
        + "insert-item' title='新增'><span class='glyphicon'><img id='"
        + div.id
        + "insert-item-img'  src='"
        + $dpimgpath
        + "toolbar/insert.gif' style='height:20px;margin-top:-2px;'/></span></button></td>"
        + "<td width='75px' align='left' id='"
        + div.id
        + "save-item-tr'><button class='btn btn-default btn-sm' style='float:left;margin-right:5px;' id='"
        + div.id
        + "save-item' title='保存'><span class='glyphicon'><img id='"
        + div.id
        + "save-item-img'  src='"
        + $dpimgpath
        + "toolbar/save.gif' style='height:20px;margin-top:-2px;'/></span></button></td>"
        + "<td width='75px' align='left' id='"
        + div.id
        + "delete-item-tr'><button class='btn btn-default btn-sm' style='float:left;margin-right:5px;' id='"
        + div.id
        + "delete-item' title='删除'><span class='glyphicon'><img id='"
        + div.id
        + "delete-item-img'  src='"
        + $dpimgpath
        + "toolbar/remove.gif' style='height:20px;margin-top:-2px;'/></span></button></td>"
        + "<td width='75px' align='left' id='"
        + div.id
        + "refresh-item-tr'><button class='btn btn-default btn-sm' style='float:left;margin-right:5px;' id='"
        + div.id
        + "refresh-item' title='刷新'><span class='glyphicon'><img id='"
        + div.id
        + "refresh-item-img' src='"
        + $dpimgpath
        + "toolbar/refreshbill.png' style='height:20px;margin-top:-2px;'/></span></button></td></tr></table>";
    div.innerHTML = Stander;
    div.items = items;
    this.items.setItemStatus(insertitem, saveitem, deleteitem, refreshitem);
    return this;
};

/**
 * @param div
 * @param expid
 * @param canprint
 * @param isword
 * @param isexcel
 * @param ispdf
 */
tlv8.exportbar = function (div, expid, canprint, isword, isexcel, ispdf) {
    var $commonpath = $dpjspath.replace("/js/", "/");
    if (!checkPathisHave($dpcsspath + "toolbar.main.css"))
        createStyleSheet($dpcsspath + "toolbar.main.css");
    if (!checkPathisHave($commonpath + "print/print.js"))
        createJSSheet($commonpath + "print/print.js");
    div.style.overflow = "hidden";
    var Stander = "<table style='align:left;' class='standard_toolbar' border='0' id='"
        + div.id + "exportbar'><tr>";
    if (canprint) {
        Stander += "<td width='70px' align='left' id='"
            + div.id
            + "print-item-tr'><a href='javascript:void(0)' id='"
            + div.id
            + "print-item' class='toobar_item' title='打印' style='height:25px; line-height: 25px; color:#000; font-size:10px;'><img id='"
            + div.id
            + "print-item-img' style='float: left;' src='"
            + $dpimgpath
            + "toolbar/standard_toolbar/standard/print.gif'/><SPAN style='float: left;'>打印</SPAN></a></td>";
    }
    if (isword) {
        Stander += "<td width='128px' align='left' id='"
            + div.id
            + "word-item-tr'><a href='javascript:void(0)' id='"
            + div.id
            + "word-item' class='toobar_item' title='导出为Word文件' style='height:25px; line-height: 25px; color:#000; font-size:10px;'><img id='"
            + div.id
            + "word-item-img' style='float: left;' src='"
            + $dpimgpath
            + "toolbar/exp_doc.bmp'/><SPAN style='float: left;'>导出为Word文件</SPAN></a></td>";
    }
    if (isexcel) {
        Stander += "<td width='125px' align='left' id='"
            + div.id
            + "excel-item-tr'><a href='javascript:void(0)' id='"
            + div.id
            + "excel-item' class='toobar_item' title='导出为Excel文件' style='height:25px; line-height: 25px; color:#000; font-size:10px;'><img id='"
            + div.id
            + "excel-item-img' style='float: left;' src='"
            + $dpimgpath
            + "toolbar/exp_xls.bmp'/><SPAN style='float: left;'>导出为Excel文件</SPAN></a></td>";
    }
    if (ispdf) {
        Stander += "<td width='118px' align='left' id='"
            + div.id
            + "pdf-item-tr'><a href='javascript:void(0)' id='"
            + div.id
            + "pdf-item' class='toobar_item' title='导出为PDF文件' style='height:25px; line-height: 25px; color:#000; font-size:10px;'><img id='"
            + div.id
            + "pdf-item-img' style='float: left;' src='"
            + $dpimgpath
            + "toolbar/exp_pdf.bmp'/><SPAN style='float: left;'>导出为PDF文件</SPAN></a></td>";
    }
    Stander += "</tr></table>";
    div.innerHTML = Stander;
    div.getHead = function () {
        var head = "";
        $(document)
            .find("link")
            .filter(function () {
                return $(this).attr("rel").toLowerCase() == "stylesheet";
            })
            .each(
                function () {
                    head += '<link type="text/css" rel="stylesheet" href="' + $(
                        this).attr("href") + '" >';
                });
        return head;
    }
    $("#" + div.id + "print-item").click(function () {
        var tableToPrint = $("#" + expid).clone();
        // tableToPrint.css("width", "100%");
        var phtml = $("<div></div>").append(tableToPrint).html();
        var pwdoc = "<html><head>" + div.getHead() + "</head><body>" + phtml + "</body></html>";
        // console.log(pwdoc);
        var windowAttr = "location=yes,statusbar=no,directories=no,menubar=no,titlebar=no,toolbar=no,dependent=no";
        var newWin = window.open("", "_blank", windowAttr);
        newWin.document.write(pwdoc);
        newWin.document.close();
        newWin.focus();
        setTimeout(function () {
            newWin.print();
            newWin.close();
        }, 100);
    });
    $("#" + div.id + "word-item").click(
        function () {
            var tableToPrint = $("#" + expid).clone();
            // tableToPrint.css("width", "100%");
            // console.log(div.getHead());
            var htmcontext = div.getHead() + $("<div></div>").append(tableToPrint).html();
            // console.log(htmcontext);
            var form = $("<form></form>")
                .attr("action", "exportWordAction").attr("method",
                    "post");
            form.append($("<input></input>").attr("type", "hidden").attr(
                "name", "htmcontext").attr("value",
                J_u_encode(htmcontext)));
            form.appendTo('body').submit().remove();
        });
    $("#" + div.id + "excel-item").click(
        function () {
            var tableToPrint = $("#" + expid).clone();
            // tableToPrint.css("width", "100%");
            var htmcontext = $("<div></div>").append(tableToPrint).html();
            var form = $("<form></form>").attr("action",
                "exportExcelAction").attr("method", "post");
            form.append($("<input></input>").attr("type", "hidden").attr(
                "name", "htmcontext").attr("value",
                J_u_encode(htmcontext)));
            form.appendTo('body').submit().remove();
        });
    $("#" + div.id + "pdf-item").click(
        function () {
            var tableToPrint = $("#" + expid).clone();
            // tableToPrint.css("width", "100%");
            var htmcontext = $("<div></div>").append(tableToPrint).html();
            var form = $("<form></form>").attr("action", "exportPdfAction")
                .attr("method", "post");
            form.append($("<input></input>").attr("type", "hidden").attr(
                "name", "htmcontext").attr("value",
                J_u_encode(htmcontext)));
            form.appendTo('body').submit().remove();
        });
};

/**
 * @class Map
 * @description jsMap对象
 */
var Map = function () {
    var struct = function (key, value) {
        this.key = key;
        this.value = value;
    };
    var put = function (key, value) {
        for (var i = 0; i < this.arr.length; i++) {
            if (this.arr[i].key === key) {
                this.arr[i].value = value;
                return;
            }
        }
        this.arr[this.arr.length] = new struct(key, value);
    };
    var get = function (key) {
        for (var i = 0; i < this.arr.length; i++) {
            if (this.arr[i].key === key) {
                return this.arr[i].value;
            }
        }
        return null;
    };
    var remove = function (key) {
        var v;
        for (var i = 0; i < this.arr.length; i++) {
            v = this.arr.pop();
            if (v.key === key) {
                continue;
            }
            this.arr.unshift(v);
        }
    };
    var size = function () {
        return this.arr.length;
    };
    var isEmpty = function () {
        return this.arr.length <= 0;
    };
    var containsKey = function (key) {
        var result = false;
        for (var i = 0; i < this.arr.length; i++) {
            if (this.arr[i].key === key) {
                result = true;
            }
        }
        return result;
    };
    var containsValue = function (value) {
        var result = false;
        for (var i = 0; i < this.arr.length; i++) {
            if (this.arr[i].value === value) {
                result = true;
            }
        }
        return result;
    };
    var keySet = function () {
        var result = new Array();
        for (var i = 0; i < this.arr.length; i++) {
            result.push(this.arr[i].key);
        }
        return result;
    };
    this.arr = new Array();
    this.struct = struct;
    this.get = get;
    this.put = put;
    this.remove = remove;
    this.size = size;
    this.isEmpty = isEmpty;
    this.containsKey = containsKey;
    this.containsValue = containsValue;
    this.keySet = keySet;
    return this;
};
/**
 * @name toString
 * @description Map对象转换为字符串
 * @returns {string}
 */
Map.prototype.toString = function () {
    var rs = "{";
    for (var i = 0; i < this.arr.length; i++) {
        if (i > 0)
            rs += ",";
        rs += "\"" + this.arr[i].key + "\":\"" + this.arr[i].value + "\"";
    }
    rs += "}";
    return rs;
};

/**
 * portal
 */
tlv8.portal = {};

/**
 * @name tlv8.portal.closeWindow
 * @description 关闭portle页面
 * @param {string}
 *            tabId -可以为空，为空时关闭当前窗口
 */
tlv8.portal.closeWindow = function (tabId) {
    try {
        var currentTabId = tabId ? tabId : topparent.$.jpolite.getTabID();
        topparent.$.jpolite.removeTab(currentTabId);
    } catch (e) {
        window.opener = null;
        window.open('', '_self');
        window.close();
    }
};

/**
 * @name tlv8.portal.currentTabId
 * @description 获取当前portlet的ID
 * @returns {string}
 */
tlv8.portal.currentTabId = function () {
    try {
        return topparent.$.jpolite.getTabID();
    } catch (e) {
        alert("tlv8.portal.currentTabId: " + e.message);
    }
};

/**
 * @name tlv8.portal.openWindow
 * @description 打开指定的portlet
 * @param {string}
 *            name -标签名称
 * @param {string}
 *            url -页面地址
 * @param {string}
 *            param -传递的参数
 */
tlv8.portal.openWindow = function (name, url, param) {
    try {
        if (url.indexOf("?") > 0) {
            var reUrl = url.substring(0, url.indexOf("?"));
            var rePar = url.substring(url.indexOf("?") + 1);
            var parPe = rePar.split("&");
            for (var i = 0; i < parPe.length; i++) {
                var perP = parPe[i];
                parPe[i] = perP.split("=")[0] + "="
                    + J_u_encode(J_u_decode(perP.split("=")[1]));
            }
            url = reUrl + "?" + parPe.join("&");
        }
        var option = {name: name, title: name, url: url, param: param};
        topparent.$.X.runFunc(option, param);
        // topparent.justep.Portal.Tab.open(name, url, param);
    } catch (e) {
        if ((url.substring(0, 4)).toLowerCase() != "http") {
            var serverPath = window.location.protocol + "//" + window.location.host + "/" + window.location.pathname.split("/")[1];
            url = serverPath + url;
        }
        window.open(url, name);
        // alert("tlv8.portal.openWindow: " + e.message);
    }
};

/**
 * @name tlv8.portal.callBack
 * @description 回调指定页面的函数
 * @param {string}
 *            tabID -页面ID
 * @param {string}
 *            FnName -回调函数名
 * @param {string}
 *            param -传递的参数
 */
tlv8.portal.callBack = function (tabID, FnName, param) {
    try {
        var t = topparent.$.jpolite.getTab(tabID);
        if (t && t != null && t != undefined) {
            var containers = t.tabLayoutDiv.get(0);
            var pTabIframe = containers.getElementsByTagName("iframe")[0].contentWindow;
            var callFn = pTabIframe[FnName];
            callFn(param);
        } else {
            topparent.tlv8.portal.callBack(tabID, FnName, param);
        }
    } catch (e) {
    }
};

/**
 * dialog
 */
tlv8.portal.dailog = {
    transeUrl: function (url) {
        // 路径转换[utf-8编码]
        if (url.indexOf("http://") < 0 && url.indexOf("https://") < 0
            && url.indexOf(cpath) != 0) {
            url = cpath + url;
        }
        if (url.indexOf("?") > 0) {
            var reUrl = url.substring(0, url.indexOf("?"));
            var rePar = url.substring(url.indexOf("?") + 1);
            var parPe = rePar.split("&");
            for (var i = 0; i < parPe.length; i++) {
                var perP = parPe[i];
                parPe[i] = perP.split("=")[0] + "="
                    + J_u_encode(J_u_decode(perP.split("=")[1]));
            }
            url = reUrl + "?" + parPe.join("&");
        }
        return url;
    },
    /**
     * @name tlv8.portal.dailog.openDailog
     * @description 打开对话框
     * @param {string}
     *            name
     * @param {string}
     *            url
     * @param {number}
     *            width
     * @param {number}
     *            height
     * @param {function}
     *            callback
     * @param {object}
     *            itemSetInit -{refreshItem:true,enginItem:true,CanclItem:true}
     * @param {boolean}
     *            titleItem -为false时掩藏标题栏
     * @param {object}
     *            urlParam -JS任意类型可以直接传递到对话框页面 对话框页面通过函数getUrlParam获取
     */
    openDailog: function (name, url, width, height, callback, itemSetInit,
                          titleItem, urlParam) {
        tlv8.portal.dailog.callback = callback;
        url = this.transeUrl(url);
        if (this.dindex) {
            layui.layer.close(this.dindex);// 防止打开多个
            this.dindex = null;
        }
        var ww = $(window).width() - 20;
        var hh = $(window).height() - 20;
        this.dindex = layui.layer.open({
            type: 1,
            maxmin: true,
            area: [Math.min(width, ww) + 'px', Math.min(height, hh) + 'px'],
            title: [name, 'font-size:18px;'],
            content: '<div id="dailogmsgDiv" style="width:99%;height:99%;overflow:hidden;border-top:1px solid #eee;border-bottom:1px solid #eee;"><iframe id="windowdialogIframe" frameborder="0" style="border:none;width:100%;height:100%;"></iframe></div>',
            btn: itemSetInit == false ? [] : ['确定', '取消'],
            yes: function (index, layero) {
                var dlw = J$("windowdialogIframe").contentWindow;
                if (dlw.dailogEngin) {
                    var re = dlw.dailogEngin();
                    if ((typeof re == "boolean") && re == false) {
                        return false;
                    } else {
                        if (callback) {
                            callback(re);
                        }
                    }
                } else {
                    if (callback) {
                        callback(re);
                    }
                }
                layui.layer.close(index);
            },
            btn2: function (index, layero) {
            },
            cancel: function () {// 右上角关闭回调
            }
        });
        $("#windowdialogIframe").attr("src", url);
        try {
            var func_iframe = document.getElementById("windowdialogIframe");
            if (func_iframe.attachEvent) {
                func_iframe.attachEvent("onload", function () {
                    try {
                        var dialogWin = func_iframe.contentWindow;
                        if (dialogWin.getUrlParam) {
                            dialogWin.getUrlParam(urlParam);
                        }
                    } catch (e) {
                    }
                });
            } else {
                func_iframe.onload = function () {
                    try {
                        var dialogWin = func_iframe.contentWindow;
                        if (dialogWin.getUrlParam) {
                            dialogWin.getUrlParam(urlParam);
                        }
                    } catch (e) {
                    }
                };
            }
        } catch (e) {
        }
    },
    callback: null,
    sendData: null,
    returnData: null,
    /**
     * @name tlv8.portal.dailog.dailogEngin
     * @description 自定义对话框确定
     * @param {object}
     *            data
     */
    dailogEngin: function (data, b_g) {
        this.returnData = data ? data : this.returnData;
        try {
            var callbackFn;
            if (b_g) {
                callbackFn = tlv8.portal.dailog.callback;
            } else {
                callbackFn = window.parent.tlv8.portal.dailog.callback;
            }
            if (callbackFn) {
                callbackFn(this.returnData);
            }
        } catch (e) {
        }
        try {
            var index = window.parent.layui.layer.getFrameIndex(window.name); // 先得到当前iframe层的索引
            window.parent.layui.layer.close(index); // 再执行关闭
            window.parent.layui.layer.closeAll();
        } catch (e) {
        }
        if (this.dindex)
            layui.layer.close(this.dindex);
        return true;
    },
    /**
     * @name tlv8.portal.dailog.dailogReload
     * @description 自定义对话框刷新
     */
    dailogReload: function () {
        try {
            var dialogview = parent.document.getElementById("dailogmsgDiv");
            if (dialogview)
                parent.document.getElementById("windowdialogIframe").contentWindow.location
                    .reload();
        } catch (e) {
        }
        var dialogview = document.getElementById("dailogmsgDiv");
        if (dialogview)
            document.getElementById("windowdialogIframe").contentWindow.location
                .reload();
    },
    /**
     * @name tlv8.portal.dailog.dailogReload
     * @description 自定义对话框取消
     */
    dailogCancel: function () {
        try {
            var index = window.parent.layui.layer.getFrameIndex(window.name); // 先得到当前iframe层的索引
            window.parent.layui.layer.close(index); // 再执行关闭
            window.parent.layui.layer.closeAll();
        } catch (e) {
        }
        if (this.dindex)
            layui.layer.close(this.dindex);
    }
};

function setTab(n) {
    var tli = document.getElementById("menu").getElementsByTagName("li");
    var mli = document.getElementById("tab_view").getElementsByTagName("ul");
    for (var i = 0; i < tli.length; i++) {
        tli[i].className = i == n ? "hover" : "";
        mli[i].style.display = i == n ? "block" : "none";
    }
}

/**
 * @name tlv8.Context
 * @description 获取登录人员信息
 */
tlv8.Context = {
    userInfo: {},
    /**
     * @name tlv8.Context.getPath
     * @function
     * @description 当前系统路径
     * @returns {string}
     */
    getPath: function () {
        this.checklogin();
        return this.userInfo.uiserverremoteurl;
    },
    /**
     * @name tlv8.Context.getCurrentPersonID
     * @function
     * @description 当前登录人ID
     * @returns {string}
     */
    getCurrentPersonID: function () {
        this.checklogin();
        return this.userInfo.personid;
    },
    /**
     * @name tlv8.Context.getCurrentPersonCode
     * @function
     * @description 当前登录人SCODE
     * @returns {string}
     */
    getCurrentPersonCode: function () {
        this.checklogin();
        return this.userInfo.personcode;
    },
    /**
     * @name tlv8.Context.getCurrentPersonName
     * @function
     * @description 当前登录人姓名
     * @returns {string}
     */
    getCurrentPersonName: function () {
        this.checklogin();
        return this.userInfo.personName;
    },
    /**
     * @name tlv8.Context.getCurrentPersonFID
     * @function
     * @description 当前登录人SFID
     * @returns {string}
     */
    getCurrentPersonFID: function () {
        this.checklogin();
        return this.userInfo.personfid;
    },
    /**
     * @name tlv8.Context.getCurrentPersonFCode
     * @function
     * @description 当前登录人SFCODE
     * @returns {string}
     */
    getCurrentPersonFCode: function () {
        this.checklogin();
        return this.userInfo.personfcode;
    },
    /**
     * @name tlv8.Context.getCurrentPersonFName
     * @function
     * @description 当前登录人全名称
     * @returns {string}
     */
    getCurrentPersonFName: function () {
        this.checklogin();
        return this.userInfo.personfname;
    },
    /**
     * @name tlv8.Context.getCurrentPostID
     * @function
     * @description 当前登录人岗位ID
     * @returns {string}
     */
    getCurrentPostID: function () {
        this.checklogin();
        return this.userInfo.positionid;
    },
    /**
     * @name tlv8.Context.getCurrentPostCode
     * @function
     * @description 当前登录人岗位编号
     * @returns {string}
     */
    getCurrentPostCode: function () {
        this.checklogin();
        return this.userInfo.positioncode;
    },
    /**
     * @name tlv8.Context.getCurrentPostName
     * @function
     * @description 当前登录人岗位名称
     * @returns {string}
     */
    getCurrentPostName: function () {
        this.checklogin();
        return this.userInfo.positionname;
    },
    /**
     * @name tlv8.Context.getCurrentPostFID
     * @function
     * @description 当前登录人岗位ID路径
     * @returns {string}
     */
    getCurrentPostFID: function () {
        this.checklogin();
        return this.userInfo.positionfid;
    },
    /**
     * @name tlv8.Context.getCurrentPostFCode
     * @function
     * @description 当前登录人岗位编号路径
     * @returns {string}
     */
    getCurrentPostFCode: function () {
        this.checklogin();
        return this.userInfo.positionfcode;
    },
    /**
     * @name tlv8.Context.getCurrentPostFName
     * @function
     * @description 当前登录人岗位名称路径
     * @returns {string}
     */
    getCurrentPostFName: function () {
        this.checklogin();
        return this.userInfo.positionfname;
    },
    /**
     * @name tlv8.Context.getCurrentDeptID
     * @function
     * @description 当前登录人部门ID
     * @returns {string}
     */
    getCurrentDeptID: function () {
        this.checklogin();
        return this.userInfo.deptid;
    },
    /**
     * @name tlv8.Context.getCurrentDeptCode
     * @function
     * @description 当前登录人部门编号
     * @returns {string}
     */
    getCurrentDeptCode: function () {
        this.checklogin();
        return this.userInfo.deptcode;
    },
    /**
     * @name tlv8.Context.getCurrentDeptName
     * @function
     * @description 当前登录人部门名称
     * @returns {string}
     */
    getCurrentDeptName: function () {
        this.checklogin();
        return this.userInfo.deptname;
    },
    /**
     * @name tlv8.Context.getCurrentDeptFID
     * @function
     * @description 当前登录人部门ID路径
     * @returns {string}
     */
    getCurrentDeptFID: function () {
        this.checklogin();
        return this.userInfo.deptfid;
    },
    /**
     * @name tlv8.Context.getCurrentDeptFCode
     * @function
     * @description 当前登录人部门编号路径
     * @returns {string}
     */
    getCurrentDeptFCode: function () {
        this.checklogin();
        return this.userInfo.deptfcode;
    },
    /**
     * @name tlv8.Context.getCurrentDeptFName
     * @function
     * @description 当前登录人部门名称路径
     * @returns {string}
     */
    getCurrentDeptFName: function () {
        this.checklogin();
        return this.userInfo.deptfname;
    },
    /**
     * @name tlv8.Context.getCurrentOgnID
     * @function
     * @description 当前登录人机构ID
     * @returns {string}
     */
    getCurrentOgnID: function () {
        this.checklogin();
        return this.userInfo.ognid;
    },
    /**
     * @name tlv8.Context.getCurrentOgnCode
     * @function
     * @description 当前登录人机构编号
     * @returns {string}
     */
    getCurrentOgnCode: function () {
        this.checklogin();
        return this.userInfo.ogncode;
    },
    /**
     * @name tlv8.Context.getCurrentOgnName
     * @function
     * @description 当前登录人机构名称
     * @returns {string}
     */
    getCurrentOgnName: function () {
        this.checklogin();
        return this.userInfo.ognname;
    },
    /**
     * @name tlv8.Context.getCurrentOgnFID
     * @function
     * @description 当前登录人机构ID路径
     * @returns {string}
     */
    getCurrentOgnFID: function () {
        this.checklogin();
        return this.userInfo.ognfid;
    },
    /**
     * @name tlv8.Context.getCurrentOgnFCode
     * @function
     * @description 当前登录人机构编号路径
     * @returns {string}
     */
    getCurrentOgnFCode: function () {
        this.checklogin();
        return this.userInfo.ognfcode;
    },
    /**
     * @name tlv8.Context.getCurrentOgnFName
     * @function
     * @description 当前登录人机构名称路径
     * @returns {string}
     */
    getCurrentOgnFName: function () {
        this.checklogin();
        return this.userInfo.ognfname;
    },
    /**
     * @name tlv8.Context.getCurrentOrgID
     * @function
     * @description 当前登录人组织ID
     * @returns {string}
     */
    getCurrentOrgID: function () {
        this.checklogin();
        return this.userInfo.orgid;
    },
    /**
     * @name tlv8.Context.getCurrentOrgCode
     * @function
     * @description 当前登录人组织编号
     * @returns {string}
     */
    getCurrentOrgCode: function () {
        this.checklogin();
        return this.userInfo.orgcode;
    },
    /**
     * @name tlv8.Context.getCurrentOrgName
     * @function
     * @description 当前登录人组织名称
     * @returns {string}
     */
    getCurrentOrgName: function () {
        this.checklogin();
        return this.userInfo.orgname;
    },
    /**
     * @name tlv8.Context.getCurrentOrgFID
     * @function
     * @description 当前登录人组织ID路径
     * @returns {string}
     */
    getCurrentOrgFID: function () {
        this.checklogin();
        return this.userInfo.orgfid;
    },
    /**
     * @name tlv8.Context.getCurrentOrgFCode
     * @function
     * @description 当前登录人组织编号路径
     * @returns {string}
     */
    getCurrentOrgFCode: function () {
        this.checklogin();
        return this.userInfo.orgfcode;
    },
    /**
     * @name tlv8.Context.getCurrentOrgFName
     * @function
     * @description 当前登录人组织名称路径
     * @returns {string}
     */
    getCurrentOrgFName: function () {
        this.checklogin();
        return this.userInfo.orgfname;
    },
    init: function () {
        if (topparent != window) {
            try {
                if (topparent.$.jpolite.clientInfo && topparent.$.jpolite.clientInfo.personid) {
                    this.userInfo = topparent.$.jpolite.clientInfo;
                    return;
                }
            } catch (e) {
            }
        }
        var result = tlv8
            .XMLHttpRequest("sa/User/initPortalInfo");
        if (!result)
            return;
        if (typeof result == "string") {
            result = window.eval("(" + result + ")");
        }
        this.userInfo = window["eval"]("(" + result[0].data + ")");
    },
    checklogin: function () {
        if (!this.userInfo.personid || this.userInfo.personid == ""
            || this.userInfo.personid == "null") {
            this.init();
        }
    }
};

/**
 * @name trim
 * @description 去除字符串两边的空格
 * @returns {string}
 */
function trim(text) {
    if (text == undefined) {
        return "";
    } else {
        return text.replace(/(^\s*)|(\s*$)/g, "");
    }
}

/**
 * @name trim
 * @description 去除字符串两边的空格
 * @returns {string}
 */
String.prototype.trim = function () {
    return this.replace(/(^\s+)|(\s+$)/g, "");
};
/**
 * @name ltrim
 * @description 去除字符串左边的空格
 * @returns {string}
 */
String.prototype.ltrim = function () {
    return this.replace(/^\s+/, "");
};
/**
 * @name rtrim
 * @description 去除字符串右边的空格
 * @returns {string}
 */
String.prototype.rtrim = function () {
    return this.replace(/\s+$/, "");
};
/**
 * @name startWith
 * @description 是否以某个字符开始
 * @returns {string}
 */
String.prototype.startWith = function (str) {
    return this.indexOf(str) == 0;
};
var reMoveStr = function (str1, str2) {
    if (str1.indexOf(str2) > -1)
        str1 = str1.replace(str2, "");
    return str1;
};
var replaceFirst = function (str, p, m) {
    if (str.indexOf(p) == 0)
        str = str.replace(p, m);
    return str;
};
/**
 * @name replaceFirst
 * @param {string}
 *            p
 * @param {string}
 *            m
 * @description 替换字符串中的第一个p字符为m
 * @returns {string}
 */
String.prototype.replaceFirst = function (p, m) {
    if (this.indexOf(p) == 0) {
        return this.replace(p, m);
    }
    return this;
};
/**
 * @name replaceAll
 * @param {string}
 *            p
 * @param {string}
 *            m
 * @description 替换字符串中的所有p字符为m
 * @returns {string}
 */
String.prototype.replaceAll = function (p, m) {
    return this.replace(new RegExp(p, "gm"), m);
};

function closeself() {
    window.opener = null;
    window.open("", "_self");
    window.close();
}

/*
 * 日期格式化
 */
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours() % 24 == 0 ? 24 : this.getHours() % 24,
        "H+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    var week = {
        "0": "\u65e5",
        "1": "\u4e00",
        "2": "\u4e8c",
        "3": "\u4e09",
        "4": "\u56db",
        "5": "\u4e94",
        "6": "\u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
            .substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt
            .replace(
                RegExp.$1,
                ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f"
                        : "\u5468")
                    : "")
                + week[this.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k])
                : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};
var daxieshuzhu = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖");
var danwei = new Array("仟", "佰", "拾", "");
var dadanwei = new Array(" ", "万", "亿", "万亿");
var input = new Array();
var zhuanhuan = function () {
    this.input = new Array();
    this.jsq = 0;
    this.output = new Array();
    this.daxiezhuanhuan = function () {
        this.strtemp = "";
        for (var jwq = 0; jwq < this.input.length; jwq++) {
            this.strtemp += daxieshuzhu[this.input[jwq]] + danwei[jwq];
        }
        this.strtemp += " ";
        this.re = /(零\D)+/g;
        this.strtemp = this.strtemp.replace(this.re, "零");
        this.re = /零$/g;
        this.strtemp = this.strtemp.replace(this.re, "");
        if (this.strtemp != "") {
            this.output[this.jsq] = this.strtemp.replace(" ", "")
                + dadanwei[this.jsq];
        } else {
            this.output[this.jsq] = this.strtemp.replace(" ", "");
        }
        this.jsq++;
    };
    this.taifen = function (input, pb) {
        this.pb = pb;
        this.input = input;
        var Ainput = new Array();
        var Atemp = new Array(0, 0, 0, 0);
        for (var temp = this.input.length - 1, temp2 = 3, jwq = 0; temp >= 0; temp--, temp2--) {
            if (temp2 < 0) {
                temp2 = 3;
            }
            Atemp[temp2] = input.substr(temp, 1);
            if ((temp2 % 4) == 0) {
                Ainput[jwq] = Atemp;
                jwq++;
                Atemp = new Array(0, 0, 0, 0);
            } else if (temp == 0) {
                Ainput[jwq] = Atemp;
            }
        }
        if (this.pb == 1) {
            var Ainput2 = new Array();
            for (var temp = 1; temp < Ainput[0].length; temp++) {
                Ainput2[temp - 1] = Ainput[0][temp];
            }
            Ainput2[3] = 0;
            Ainput = new Array(Ainput2);
            return this.zhuanhuandaxie(Ainput, this.pb);
        } else {
            return this.zhuanhuandaxie(Ainput, this.pb);
        }
    };
    this.zhuanhuandaxie = function (Ainput, pb) {
        this.pb = pb;
        this.Ainput = Ainput;
        for (var temp = 0; temp < this.Ainput.length; temp++) {
            this.input = Ainput[temp];
            this.daxiezhuanhuan();
        }
        return this.chongzhu(this.output, this.pb);
    };
    this.chongzhu = function (output, pb) {
        this.pb = pb;
        this.output = output;
        this.Stroutput = "";
        for (var temp = this.output.length - 1; temp >= 0; temp--) {
            this.Stroutput += this.output[temp];
        }
        if (this.pb == 1) {
            return this.Stroutput.replace("仟", "角").replace("佰", "分").replace(
                "拾", "厘");
        } else {
            this.re = /^零/g;
            this.Stroutput = this.Stroutput.replace(this.re, "");
            return this.Stroutput;
        }
    };
};
/*
 * 数字转换为大写
 */
tlv8.numberL2U = function (data) {
    var input = (data) ? data.toString() : "0";
    var xiaoshu = 0;
    var re = /^0+/g;
    var xiaoshu = 0;
    var output = "", output2 = "";
    var chafen = new Array();
    chafen = input.split(".");
    if (chafen.length == 2) {
        xiaoshu = chafen[1];
    }
    input = chafen[0];
    var myzhuanhuan = new zhuanhuan();
    output = myzhuanhuan.taifen(input, 0);
    if (xiaoshu != 0) {
        for (var temp = 3 - xiaoshu.length; temp > 0; temp--) {
            xiaoshu += "0";
        }
        var myzhuanhuan = new zhuanhuan();
        output2 = myzhuanhuan.taifen(xiaoshu, 1);
    }
    if (output != "" && output2 != 0) {
        return (output + "元" + output2).replace(" ", "");
    } else {
        if (output != "" && output2 == 0) {
            return (output + "元整").replace(" ", "");
        } else {
            var re = /^零/g;
            return "";
        }
    }
};
/*
 * 数字格式化
 */
tlv8.numberFormat = function (number, format) {
    var result = "";
    try {
        if (number && !isNaN(parseInt(number)) && number.indexOf("E") > 0) {
            var tempNumD = number.split("E")[0];
            var tempNumEx = number.split("E")[1];
            var newNum = tempNumD * Math.pow(10, tempNumEx);
            number = newNum;
        }
    } catch (e) {
    }
    if (number && number != "") {
        number = number.toString().replaceAll(",", "");
    }
    var fix = (format.split(".").length > 1) ? format.split(".")[1].length : 0;
    number = parseFloat(number);
    var isfushu = false;
    if (number < 0) {
        isfushu = true;
        number = -number;
    }
    var val = number.toFixed(fix);
    if (format.split(".")[0].indexOf(",") > 0) {
        var sfa = format.split(".")[0].split(",");
        var scl = sfa[sfa.length - 1].length;
        var numList = new Array();
        var inNum = val.split(".")[0];
        var n = 0;
        var m = inNum.length;
        for (var i = inNum.length; i > 0; i--) {
            if (i - scl > 0 && n % scl == 0) {
                numList.push(inNum.substring(i - scl, i));
                m = m - scl;
            } else if (i == 1) {
                numList.push(inNum.substring(0, m));
            }
            n++;
        }
        for (k in numList) {
            if (result != "") {
                result = numList[k] + "," + result;
            } else
                result = numList[k];
        }
        var zer = "";
        for (var i = 0; i < fix; i++) {
            zer += "0";
        }
        if (val.split(".").length > 1)
            result = result + "." + val.split(".")[1];
        else {
            if (zer != "")
                result = result + "." + zer;
        }
    } else {
        result = val;
    }
    if (isfushu) {
        result = "-" + result;
    }
    return result;
};
/*
 * 检查电子邮箱地址
 */
tlv8.CheckMail = function (mail) {
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (filter.test(mail))
        return true;
    else {
        alert('您的电子邮件格式不正确!');
        return false;
    }
};
/*
 * 检查日期格式
 */
tlv8.checkdate = function (date) {
    var filter = /^(\d{4})+\/|-([1-9]|0+[1-9]|1+[0-2])+\/|-([1-9]|0+[1-9]|[1-2]+[0-9]|3+[0-1])+$/;
    if (filter.test(date))
        return true;
    else {
        alert('您的日期格式不正确!');
        return false;
    }
};
/*
 * 输入数字验证
 */
tlv8.CheckNumber = {
    valNum: function (event) {
        event = event || window.event;
        var e = event.keyCode;
        var objEdit = event.srcElement ? event.srcElement : event.target;
        if (e != 48 && e != 49 && e != 50 && e != 51 && e != 52 && e != 53
            && e != 54 && e != 55 && e != 56 && e != 57 && e != 96
            && e != 97 && e != 98 && e != 99 && e != 100 && e != 101
            && e != 102 && e != 103 && e != 104 && e != 105 && e != 109
            && e != 37 && e != 39 && e != 13 && e != 8 && e != 46
            && e != 190 && e != 110 && e != 189 && e != 229) {
            if (event.ctrlKey == false) {
                if (event.preventDefault) {
                    event.preventDefault();
                } else {
                    event.returnValue = false;
                }
                return false;
            } else {
                tlv8.CheckNumber.valClip(event);
            }
        } else if (e == 109 || e == 189 || e == 190 || e == 110) {
            if ((e == 189 || e == 109)
                && objEdit.getAttribute("value").indexOf("-") > -1) {
                if (event.preventDefault) {
                    event.preventDefault();
                } else {
                    event.returnValue = false;
                }
                return false;
            }
            if ((e == 190 || e == 110)
                && objEdit.getAttribute("value").indexOf(".") > -1) {
                if (event.preventDefault) {
                    event.preventDefault();
                } else {
                    event.returnValue = false;
                }
                return false;
            }
        } else if (e == 229) {
            addEvent(objEdit, 'keyup', function (event) {
                tlv8.CheckNumber.checkValNum(objEdit);
            }, true);
        }
    },
    checkValNum: function (obj) {
        if (obj.getAttribute("value") == "") {
        } else if (Number(obj.getAttribute("value")) == "NaN") {
            var str = (obj.getAttribute("value") || "").toString();
            obj.setAttribute("value", str.substring(0, str.length - 1));
        } else if (obj.getAttribute("value") == "NaN") {
            obj.setAttribute("value", "");
        } else {
            obj.setAttribute("value", Number(obj.getAttribute("value")));
        }
    },
    valClip: function (ev) {
        ev = ev || window.event;
        var content = window.clipboardData.getData('Text');
        if (content != null) {
            try {
                var test = parseFloat(content);
                var str = "" + test;
                if (isNaN(test) == true) {
                    window.clipboardData.setData("Text", "");
                } else {
                    if (str != content)
                        window.clipboardData.setData("Text", str);
                }
            } catch (e) {
                alert("粘贴出现错误!");
            }
        }
    }
};
tlv8.String = {};
tlv8.String.isin = function (abs, str) {
    var substr = abs.split(',');
    for (var i = 0; i < substr.length; i++) {
        if (str == substr[i])
            return true;
    }
    if (abs.indexOf(str) > -1)
        return true;
    return false;
};
/*
 * 是否包含
 */
tlv8.String.isHave = function (abs, str) {
    var substr = abs.split(',');
    for (var i = 0; i < substr.length; i++) {
        if (str == substr[i])
            return true;
    }
    return false;
};
/**
 * @name tlv8.getIdCardInfo
 * @function
 * @description 根据身份证取 省份,生日，性别
 * @param id
 * @returns {String[]}
 */
tlv8.getIdCardInfo = function (id) {
    var arr = [null, null, null, null, null, null, null, null, null, null,
        null, "北京", "天津", "河北", "山西", "内蒙古", null, null, null, null, null,
        "辽宁", "吉林", "黑龙江", null, null, null, null, null, null, null, "上海",
        "江苏", "浙江", "安微", "福建", "江西", "山东", null, null, null, "河南", "湖北",
        "湖南", "广东", "广西", "海南", null, null, null, "重庆", "四川", "贵州", "云南",
        "西藏", null, null, null, null, null, null, "陕西", "甘肃", "青海", "宁夏",
        "新疆", null, null, null, null, null, "台湾", null, null, null, null,
        null, null, null, null, null, "香港", "澳门", null, null, null, null,
        null, null, null, null, "国外"];
    var isid = tlv8.checkId(id);
    if (isid != "true" && isid)
        return "错误的身份证号码";
    var id = String(id), prov = arr[id.slice(0, 2)], sex = id.slice(14, 17) % 2 ? "男"
        : "女";
    var birthday = (new Date(id.slice(6, 10), id.slice(10, 12) - 1, id.slice(
        12, 14))).format('yyyy-MM-dd');
    return [prov, birthday, sex];
};
/*
 * 检查身份证号是否合法
 */
tlv8.checkId = function (pId) {
    var arrVerifyCode = [1, 0, "x", 9, 8, 7, 6, 5, 4, 3, 2];
    var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    var Checker = [1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1];
    var result = "";
    if (pId.length != 15 && pId.length != 18)
        result += "身份证号共有 15 码或18位";
    var Ai = pId.length == 18 ? pId.substring(0, 17) : pId.slice(0, 6) + "19"
        + pId.slice(6, 16);
    if (!/^\d+$/.test(Ai))
        result += "身份证除最后一位外，必须为数字！";
    var yyyy = Ai.slice(6, 10), mm = Ai.slice(10, 12) - 1, dd = Ai
        .slice(12, 14);
    var d = new Date(yyyy, mm, dd), now = new Date();
    var year = d.getFullYear(), mon = d.getMonth(), day = d.getDate();
    if (year != yyyy || mon != mm || day != dd || d > now || year < 1940)
        result += "身份证输入错误！";
    for (var i = 0, ret = 0; i < 17; i++)
        ret += Ai.charAt(i) * Wi[i];
    Ai += arrVerifyCode[ret %= 11];
    if (!result || result == "")
        return "true";
    return pId == (Ai) ? "true" : result;
};
/*
 * 手机号格式验证
 */
tlv8.Telephone = function (date) {
    var filter = /(\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$/;
    if (filter.test(date))
        return true;
    else {
        alert('您输入的电话号码不正确，请重新输入！');
        return false;
    }
};
/*
 * 获取周工作日
 */
tlv8.getworkdays = function (starttime) {
    var date = justep.System.datetime();
    var createweek = starttime.getDay();
    var num = justep.Date.diff(starttime, date, 'd');
    var weekwork = 0;
    var holiday = Math.round(num / 7) * 2;
    if (num > 7) {
        weekwork = num - holiday;
    } else {
        var week = date.getDay();
        if (week == 6) {
            weekwork = num - 1;
        } else if (weekwork - createweek <= 0 && num != 0) {
            weekwork = num - 2;
        } else {
            weekwork = num;
        }
    }
    return weekwork;
};
if (!tlv8.System)
    tlv8.System = {};
tlv8.System.Date = {
    /**
     * @name tlv8.System.Date.sysDate
     * @description 获取服务时间（日期）
     * @returns {string}
     */
    sysDate: function () {
        var param = new tlv8.RequestParam();
        var r = tlv8.XMLHttpRequest("getSystemDate", param, "post", false,
            null, true);
        var rdate = tlv8.System.Date.strToDate(r.sysdate);
        return rdate.format("yyyy-MM-dd");
    },
    /**
     * @name tlv8.System.Date.sysDateTime
     * @description 获取服务时间（日期时间）
     * @returns {string}
     */
    sysDateTime: function () {
        var param = new tlv8.RequestParam();
        var r = tlv8.XMLHttpRequest("getSystemDateTime", param, "post",
            false, null, true);
        return r.sysdate;
    },
    /**
     * @name tlv8.System.Date.strToDate
     * @description 日期字符串转日期对象
     * @param {string}
     *            datestr
     * @returns {Date}
     */
    strToDate: function (str) {
        if (!str || str == "" || str.indexOf("-") < 0) {
            return;
        }
        str = trim(str);
        var val = str.split(" ");
        var newDate;
        if (val.length > 1) {
            var sdate = val[0].split("-");
            var sTime = val[1].split(":");
            newDate = new Date(sdate[0], sdate[1] - 1, sdate[2], sTime[0],
                sTime[1], sTime[2]);
        } else {
            var sdate = val[0].split("-");
            newDate = new Date(sdate[0], sdate[1] - 1, sdate[2]);
        }
        return newDate;
    }
};
var $dpjspath = null;
var scripts = document.getElementsByTagName("script");
for (i = 0; i < scripts.length; i++) {
    if (scripts[i].src.substring(scripts[i].src.length - 13).toLowerCase() == 'comon.main.js') {
        $dpjspath = scripts[i].src.substring(0, scripts[i].src.length - 13);
        break;
    }
}
var $dpcsspath = $dpjspath ? $dpjspath.replace("/js/", "/css/") : null;
var $dpimgpath = $dpjspath ? $dpjspath.replace("/js/", "/image/") : null;
/*
 * 添加JS引用
 */
var createJSSheet = function (jsPath) {
    var head = document.getElementsByTagName('HEAD')[0];
    var script = document.createElement('script');
    script.src = jsPath;
    script.type = 'text/javascript';
    $(script).attr("charset", 'utf-8');
    head.appendChild(script);
};
/*
 * 添加CSS引用
 */
var createStyleSheet = function (cssPath) {
    var head = document.getElementsByTagName('HEAD')[0];
    var style = document.createElement('link');
    style.href = cssPath;
    style.rel = 'stylesheet';
    style.type = 'text/css';
    head.appendChild(style);
};
/*
 * 检查引用文件是否已存在
 */
var checkPathisHave = function (path) {
    var Hhead = document.getElementsByTagName('HEAD')[0];
    var Hscript = Hhead.getElementsByTagName("SCRIPT");
    for (var i = 0; i < Hscript.length; i++) {
        if (Hscript[i].src == path)
            return true;
    }
    var Hstyle = Hhead.getElementsByTagName("LINK");
    for (var i = 0; i < Hstyle.length; i++) {
        if (Hstyle[i].href == path)
            return true;
    }
    return false;
};
/*
 * 列表下拉
 */
tlv8.GridSelect = function (div, dbkey, sql, master, caninput) {
    if (!div.id || div.id == "") {
        alert("div的id不能为空！");
        return;
    }
    var disabled = "";
    if (div.disabled)
        disabled = "disabled=true";
    var gridSelect = {
        onselected: div.onselected,
        onchecked: div.onchecked,
        onValueChanged: div.onValueChanged,
        value: "",
        select: function (obj) {
            if (gridSelect.onValueChanged) {
                if (gridSelect.value != obj.getAttribute("value")) {
                    var exfn = eval(gridSelect.onValueChanged);
                    if (gridSelect.onValueChanged
                        && gridSelect.onValueChanged.indexOf("(") < 0)
                        exfn(obj);
                }
            }
            gridSelect.value = $(obj).val();
            if (obj && !gridSelect.value)
                gridSelect.value = $(obj).val();
            div.setAttribute("value", $(obj).val());
            if (div.getAttribute("onselected")) {
                var efn = eval(div.getAttribute("onselected"));
                if (typeof (efn) == "function")
                    efn(obj);
            }
        },
        change: function (obj) {
            if (div.getAttribute("onValueChanged")) {
                var efn = eval(div.getAttribute("onValueChanged"));
                if (typeof (efn) == "function")
                    efn(obj);
            }
        },
        check: function () {
            if (div.getAttribute("onchecked")) {
                var efn = eval(div.getAttribute("onchecked"));
                if (typeof (efn) == "function")
                    efn(this);
            }
            gridSelect.onselectting = false;
            this.reMoveGridselect();
        },
        currentRowId: "",
        currenttr: null,
        currentRowId: "",
        checkedValue: "",
        setSelect: function (obj, m) {
            var seleDiv = document.getElementById(div.id + "_gridSelect");
            if (seleDiv) {
                return;
            }
            var posX = obj.offsetLeft;
            var posY = obj.offsetTop;
            var aBox = obj;
            do {
                aBox = aBox.offsetParent;
                posX += aBox.offsetLeft;
                posY += aBox.offsetTop;
            } while (aBox.tagName != "BODY");
            var selectIfram = document.createElement("div");
            selectIfram.setAttribute("id", div.id + "_gridSelect");
            selectIfram.setAttribute("align", "center");
            selectIfram.style.background = "#ffffff";
            selectIfram.style.border = "1px solid #eee";
            selectIfram.style.position = "absolute";
            selectIfram.style.left = posX;
            selectIfram.style.top = (parseInt(posY) + 22) + "px";
            selectIfram.style.font = "12px/1.6em Verdana, Geneva, Arial, Helvetica, sans-serif";
            selectIfram.style.width = obj.offsetWidth;
            selectIfram.style.height = 100 + "px";
            selectIfram.style.textAlign = "left";
            selectIfram.style.lineHeight = "22px";
            selectIfram.style.zIndex = "101";
            var isChecked = function (val) {
                var strV = obj.getAttribute("value");
                var strVs = strV.split(",");
                for (var h in strVs) {
                    if (strVs[h] == val)
                        return true;
                }
                return false;
            };
            if (obj.getAttribute("value") && obj.getAttribute("value") != "")
                gridSelect.checkedValue = obj.getAttribute("value");
            var dataTable = "<div style='height:200px;word-break:break-all;overflow-Y:auto;overflow-X:hidden;background:#fff;'><table id='"
                + div.id
                + "_table' style='width:100%;border-collapse: collapse;table-layout:fixed;word-break: break-all;line-height:22px;'>";
            if (!m) {
                for (var i = 0; i < datares.length; i++) {
                    dataTable += "<tr id='" + datares[i].value
                        + "'><td class='grid_td'>" + datares[i].text
                        + "</td></tr>";
                }
            } else {
                for (var i = 0; i < datares.length; i++) {
                    var fV = datares[i].value;
                    if (isChecked(fV)) {
                        dataTable += "<tr id='"
                            + fV
                            + "'><td width='20px'><input type='checkbox' id='"
                            + fV
                            + "' checked='true' class='gridselectchackbox'></td><td class='grid_td'>"
                            + datares[i].text + "</td></tr>";
                    } else {
                        dataTable += "<tr id='"
                            + fV
                            + "'><td width='20px'><input type='checkbox' id='"
                            + fV
                            + "' class='gridselectchackbox'></td><td class='grid_td'>"
                            + datares[i].text + "</td></tr>";
                    }
                }
            }
            dataTable += "</table></div>";
            // if (m)
            // dataTable += "<table class='grid'><tr><td width='90%'></td><td
            // width='40px' align='left'><input type='button' value='确定'
            // title='确定' style='font-size:12px;'
            // onclick='document.getElementById(\""
            // + div.id + "\").gridSelect.check()'></td></tr><table>";
            selectIfram.innerHTML = dataTable;
            document.body.appendChild(selectIfram);
            var dataTable = document.getElementById(div.id + "_table");
            var sTR = dataTable.getElementsByTagName("TR");
            for (var i = 0; i < sTR.length; i++) {
                sTR[i].onmouseover = function () {
                    if (gridSelect.currentRowId == this.id)
                        return;
                    this.tmpClass = this.className;
                    this.className = "t4";
                    if (gridSelect.currenttr) {
                        gridSelect.currenttr.className = gridSelect.currenttr.tmpClass;
                    }
                    gridSelect.currenttr = this;
                    gridSelect.currentRowId = this.id;
                };
                if (!m)
                    sTR[i].onclick = function () {
                        var dInput = div.getElementsByTagName("INPUT")[0];
                        if (dInput) {
                            dInput.setAttribute("value", this.id);
                            $(dInput).val(this.id);
                        }
                        gridSelect.select(dInput);
                        gridSelect.outEdit();
                    };
                if (m) {
                    var sTD = sTR[i].getElementsByTagName("TD")[0];
                    var sChek = sTD.getElementsByTagName("INPUT")[0];
                    sChek.onclick = function () {
                        gridSelect.onselectting = true;
                        if (this.checked) {
                            if (!tlv8.String.isin(gridSelect.checkedValue,
                                this.id))
                                gridSelect.checkedValue += "," + this.id;
                        } else {
                            if (tlv8.String.isin(gridSelect.checkedValue,
                                "," + this.id))
                                gridSelect.checkedValue = reMoveStr(
                                    gridSelect.checkedValue, "," + this.id);
                            else if (tlv8.String.isin(
                                gridSelect.checkedValue, this.id))
                                gridSelect.checkedValue = reMoveStr(
                                    gridSelect.checkedValue, this.id);
                        }
                        var dInput = div.getElementsByTagName("INPUT")[0];
                        if (dInput) {
                            dInput.setAttribute("value", replaceFirst(
                                gridSelect.checkedValue, ",", ""));
                            gridSelect.checkedValue = replaceFirst(
                                gridSelect.checkedValue, ",", "");
                        }
                    };
                }
            }
            var bfdocclick = document.onclick;
            document.onclick = function (event) {
                try {
                    event = event || window.event;
                    var objEdit = event.srcElement ? event.srcElement
                        : event.target;
                    if (J$(div.id + "_gridSelect") != objEdit
                        && objEdit.id != div.id
                        && $(objEdit).attr("class") != "gridselectchackbox") {
                        if (m) {
                            document.getElementById(div.id).gridSelect.check();
                        } else {
                            document.getElementById(div.id).gridSelect
                                .reMoveGridselect();
                        }
                        document.onclick = bfdocclick;
                    }
                } catch (e) {
                }
            };
        },
        reMoveGridselect: function () {
            if (gridSelect.onselectting)
                return;
            if (document.getElementById(div.id + "_gridSelect"))
                document.body.removeChild(document.getElementById(div.id
                    + "_gridSelect"));
        },
        onselectting: false,
        outEdit: function () {
            gridSelect.reMoveGridselect();
        }
    };
    this.gridSelect = gridSelect;
    div.gridSelect = gridSelect;
    div.master = master;
    var gsID = div.id ? div.id : "";
    var param = new tlv8.RequestParam();
    param.set("dbkey", dbkey);
    param.set("sql", sql);
    var r = tlv8.XMLHttpRequest("getGridSelectDataAction",
        param, "post", false);
    var datares = window.eval("(" + r.data.data + ")");
    if (!master && !caninput) {
        var option = "<option value=''></option>";
        for (var i = 0; i < datares.length; i++) {
            option += "<option value='" + datares[i].value + "'>" + datares[i].text + "</option>";
        }
        var select = "<select id='"
            + gsID
            + "' name='" + gsID + "'"
            + disabled
            + " style='width:100%'>";
        select += option;
        select += "</select>";
        div.innerHTML = select;
// var op = div.getElementsByTagName("SELECT")[0];
// op.onchange = gridSelect.select;
        try {
            $("select[id='" + gsID + "']").change(function () {
                try {
                    document.getElementById(div.id).gridSelect.select(this);
                    document.getElementById(div.id).gridSelect.change(this);
                } catch (er) {
                }
            });
        } catch (e) {
        }
    } else if (!master && caninput) {
        var selectinput = "<input name='" + div.id + "' id='"
            + div.id
            + "' type='text' class='Dselect' style='width:100%;cursor:pointer;' value='' "
            + disabled + " onFocus='document.getElementById(\"" + div.id
            + "\").gridSelect.setSelect(this,false)'/>";
        div.innerHTML = selectinput;
    } else {
        var selectinput = "<input name='" + div.id + "' id='"
            + div.id
            + "' type='text' class='Dselect' style='width:100%;cursor:pointer;' value='' "
            + disabled
            + " onFocus='document.getElementById(\""
            + div.id
            + "\").gridSelect.setSelect(this,true)'/>";
        div.innerHTML = selectinput;
        try {
            $("input[id='" + div.id + "']").change(function () {
                try {
                    document.getElementById(div.id).gridSelect.change(this);
                } catch (er) {
                }
            });
        } catch (e) {
        }
    }
    return this;
};
/*
 * 树形下拉
 */
tlv8.TreeSelect = function (div, QueryAction, master) {
    if (!div) {
        return;
    }
    var treeSelect = {
        inputtext: null,
        rowid: "",
        value: "",
        parentid: "",
        checking: false,
        select: function (data) {
            treeSelect.checking = true;
            if (master) {
                return;
            }
            treeSelect.inputtext.setAttribute("value", data.CurrentValue);
            treeSelect.value = data.CurrentValue;
            treeSelect.rowid = data.CurrentRowId;
            treeSelect.parentid = data.CurrentparentID;
        },
        check: function (data) {
            treeSelect.checking = true;
            if (!master)
                return;
            treeSelect.inputtext.setAttribute("value", data.checkedValue);
            treeSelect.value = data.checkedValue;
            treeSelect.rowid = data.checkedID;
        },
        setSelect: function (obj) {
            var seleDiv = document.getElementById(div.id + "_treeSelect");
            if (seleDiv) {
                return;
            }
            var posX = obj.offsetLeft;
            var posY = obj.offsetTop;
            var aBox = obj;
            do {
                aBox = aBox.offsetParent;
                posX += aBox.offsetLeft;
                posY += aBox.offsetTop;
            } while (aBox.tagName != "BODY");
            var selectIfram = document.createElement("div");
            selectIfram.setAttribute("id", div.id + "_treeSelect");
            selectIfram.setAttribute("align", "center");
            selectIfram.style.background = "#ffffff";
            selectIfram.style.border = "1px solid #eee";
            selectIfram.style.position = "absolute";
            selectIfram.style.left = posX;
            selectIfram.style.top = (parseInt(posY) + 22) + "px";
            selectIfram.style.font = "12px/1.6em Verdana, Geneva, Arial, Helvetica, sans-serif";
            selectIfram.style.width = obj.offsetWidth;
            selectIfram.style.height = (getOs() == "MSIE") ? 100 + "px"
                : 100 + "px auto";
            selectIfram.style.textAlign = "left";
            selectIfram.style.lineHeight = "22px";
            selectIfram.style.zIndex = "101";
            selectIfram.innerHTML = "<div id='"
                + div.id
                + "_tree_data' onselect='document.getElementById(\""
                + div.id
                + "\").treeSelect.select'onchecked='document.getElementById(\""
                + div.id
                + "\").treeSelect.check' style='height:200px;word-break:break-all;overflow-Y:auto;background:#fff;'></div><table style='width:100%;height:22px;'><tr><td align='right'><input id='"
                + div.id
                + "_engButton' type='button' value='确定' title='确定' style='font-size:12px;line-height:12px;'></td><td width='20px'/></tr></table>";
            document.body.appendChild(selectIfram);
            var treeDataView = document.getElementById(div.id + "_tree_data");
            document.getElementById(div.id + "_engButton").onclick = reMoveTreeselect;
            var tree = new tlv8.createTree(treeDataView, QueryAction,
                "normal", null, master);
        }
    };
    if (!checkPathisHave($dpjspath + "tree.main.js"))
        createJSSheet($dpjspath + "tree.main.js");
    if (!checkPathisHave($dpcsspath + "tree.css"))
        createStyleSheet($dpcsspath + "tree.css");
    var reMoveTreeselect = function () {
        if (master) {
            if (div.getAttribute("onchecked")) {
                var efn = eval(div.getAttribute("onchecked"));
                if (typeof (efn) == "function")
                    efn(treeSelect);
            }
        } else {
            if (div.getAttribute("onselected")) {
                var efn = eval(div.getAttribute("onselected"));
                if (typeof (efn) == "function")
                    efn(treeSelect);
            }
        }
        if (document.getElementById(div.id + "_treeSelect"))
            document.body.removeChild(document.getElementById(div.id
                + "_treeSelect"));
    };
    this.reMoveTreeselect = reMoveTreeselect;
    var disabled = false;
    if (div.disabled)
        disabled = true;
    var reMoveTreeselectOnl = function () {
        if (treeSelect.checking)
            return;
        if (document.getElementById(div.id + "_treeSelect"))
            document.body.removeChild(document.getElementById(div.id
                + "_treeSelect"));
    };
    var input = document.createElement("input");
    input.id = div.id;
    input.type = "text";
    input.className = "Dselect";
    input.style.width = "100%";
    input.style.height = "22px";
    input.disabled = disabled;
    input.onfocus = function () {
        treeSelect.checking = false;
        document.getElementById(div.id).treeSelect.setSelect(input);
    };
    input.onblur = function () {
        setTimeout(reMoveTreeselectOnl, 300);
    };
    treeSelect.inputtext = input;
    div.appendChild(input);
    div.treeSelect = treeSelect;
    div.master = master;
    return this;
};
/*
 * 输入提示
 */
tlv8.inputCaption = function (input, dbkey, table, cell, where) {
    if (!input)
        return;
    var reMovetextCaption = function () {
        if (document.getElementById(input.id + "_textCaption"))
            document.body.removeChild(document.getElementById(input.id
                + "_textCaption"));
    };
    if (!input.getAttribute("value") || input.getAttribute("value") == "") {
        reMovetextCaption();
        return;
    }
    var sql = "select " + cell + " from " + table + " where " + cell
        + " like '%" + input.getAttribute("value") + "%'";
    if (where && where != "")
        sql += " and (" + where + ")";
    var selDataback = function (re) {
        r = re;
        var datares = r.getDatas();
        var currenttr = null;
        var posX = input.offsetLeft;
        var posY = input.offsetTop;
        var aBox = input;
        do {
            aBox = aBox.offsetParent;
            posX += aBox.offsetLeft;
            posY += aBox.offsetTop;
        } while (aBox.tagName != "BODY");
        var selectIfram = document.createElement("div");
        selectIfram.setAttribute("id", input.id + "_textCaption");
        selectIfram.setAttribute("align", "center");
        selectIfram.style.background = "#ffffff";
        selectIfram.style.border = "1px solid #eee";
        selectIfram.style.position = "absolute";
        selectIfram.style.left = posX;
        selectIfram.style.top = (parseInt(posY) + input.offsetHeight) + "px";
        selectIfram.style.font = "12px/1.6em Verdana, Geneva, Arial, Helvetica, sans-serif";
        selectIfram.style.width = input.offsetWidth;
        selectIfram.style.height = 100 + "px";
        selectIfram.style.textAlign = "left";
        selectIfram.style.lineHeight = "22px";
        selectIfram.style.zIndex = "101";
        var dataTable = "<div style='height:200px;word-break:break-all;overflow-Y:auto;background:#fff;'><table id='"
            + input.id
            + "_table' style='width:100%;border-collapse: collapse;table-layout:fixed;word-break: break-all;line-height:22px;'>";
        if (datares.length > 2) {
            for (var i = 0; i < datares.length; i++) {
                var fV = (datares[i] == "null") ? "" : datares[i];
                if (fV && fV != "")
                    dataTable += "<tr id='" + fV + "'><td class='grid_td'>"
                        + fV + "</td></tr>";
            }
        } else {
            var datare = datares[0].split(" ");
            for (var i = 0; i < datare.length; i++) {
                var fV = (datare[i] == "null") ? "" : datare[i];
                if (fV && fV != "")
                    dataTable += "<tr id='" + fV + "'><td class='grid_td'>"
                        + fV + "</td></tr>";
            }
        }
        dataTable += "</table></div>";
        selectIfram.innerHTML = dataTable;
        document.body.appendChild(selectIfram);
        var dataTable = document.getElementById(input.id + "_table");
        var sTR = dataTable.getElementsByTagName("TR");
        for (var i = 0; i < sTR.length; i++) {
            sTR[i].onmouseover = function () {
                this.tmpClass = this.className;
                this.className = "t4";
                if (currenttr) {
                    currenttr.className = currenttr.tmpClass;
                }
                currenttr = this;
            };
            sTR[i].onclick = function () {
                input.setAttribute("value", this.id);
                reMovetextCaption();
            };
        }
        input.onblur = function () {
            setTimeout(reMovetextCaption, 300);
        };
    };
    tlv8.sqlQueryAction(dbkey, sql, selDataback);
    return this;
};
/*
 * 单选组件
 */
tlv8.Radio = function (div, item, splithtmlarray) {
    if (div.Radio)
        return;
    if (!div || !item) {
        alert("参数无效：tlv8.Radio");
        return;
    }
    var checkboxcompid = div.id;
    var divnid = checkboxcompid + "_compent";
    var radio = "<input id='"
        + checkboxcompid
        + "' name='" + checkboxcompid + "' type='text' style='display:none;'onpropertychange='document.getElementById(\""
        + divnid + "\").Radio.initData(this)'/>";
    div.innerHTML = radio;
    var Radio = {
        radiocheck: function (obj) {
            var radiolab = div.getElementsByTagName("input")[0];
            $(radiolab).val(obj.getAttribute("value"));
            div.setAttribute("value", obj.getAttribute("value"));
            var radios = div.getElementsByTagName("INPUT");
            for (var i = 1; i < radios.length; i++) {
                if (radios[i] != obj)
                    radios[i].checked = false;
            }
            var onselected = div.getAttribute("onselected");
            if (onselected && onselected != "") {
                var sFn = eval(onselected);
                if (typeof (sFn) == "function") {
                    sFn(radiolab.getAttribute("value"));
                }
            }
        },
        initData: function (obj) {
            var radios = div.getElementsByTagName("INPUT");
            for (var i = 1; i < radios.length; i++) {
                if (radios[i].getAttribute("value") == obj
                    .getAttribute("value"))
                    radios[i].checked = true;
                else
                    radios[i].checked = false;
            }
        },
        setValue: function (val) {
            var radiolab = div.getElementsByTagName("input")[0];
            $(radiolab).val(val);
            this.initData(radiolab);
        }
    };
    var set = item.keySet();
    var disabled = "";
    if (div.disabled || $(div).attr("disabled"))
        disabled = "disabled='disabled'";
    for (k in set) {
        div.innerHTML += "<input type='radio' name='" + checkboxcompid + "' value='" + set[k]
            + "' onclick='document.getElementById(\"" + divnid
            + "\").Radio.radiocheck(this)' " + disabled
            + " title='" + item.get(set[k]) + "'>";
        if (splithtmlarray && splithtmlarray.length == set.length
            && k < set.length - 1) {
            try {
                div.innerHTML += splithtmlarray[k];
            } catch (e) {
                mAlert("参数：splithtmlarray无效，应该为item等长度的数组.");
            }
        }
    }
    div.Radio = Radio;
    document.getElementById(checkboxcompid).Radio = Radio;
    div.id = checkboxcompid + "_compent";
    div.setAttribute("id", checkboxcompid + "_compent");
    return this;
};
/*
 * 多选组件
 */
tlv8.CheckBox = function (div, item, splithtmlarray) {
    if (div.Check)
        return;
    if (!div || !item) {
        alert("参数无效：tlv8.CheckBox");
        return;
    }
    var checkboxcompid = div.id;
    var divnid = checkboxcompid + "_compent";
    var check = "<input id='"
        + checkboxcompid
        + "' name='" + checkboxcompid + "' style='display:none;' onpropertychange='document.getElementById(\""
        + divnid + "\").Check.initData(this)'/>";
    div.innerHTML = check;
    var Check = {
        boxcheck: function (obj) {
            var checklab = div.getElementsByTagName("input")[0];
            var Cvalue = "";
            var checks = div.getElementsByTagName("INPUT");
            for (var i = 1; i < checks.length; i++) {
                if (checks[i].checked)
                    Cvalue += "," + checks[i].getAttribute("value");
            }
            Cvalue = Cvalue.replaceFirst(",", "");
            $(checklab).val(Cvalue);
            div.setAttribute("value", Cvalue);
            var onchecked = div.getAttribute("onchecked");
            if (onchecked && onchecked != "") {
                var chFn = eval(onchecked);
                if (typeof chFn == "function") {
                    chFn(Cvalue);
                }
            }
            div.setAttribute("value", Cvalue);
        },
        initData: function (obj) {
            var checks = div.getElementsByTagName("INPUT");
            var value = obj.getAttribute("value");
            for (var i = 1; i < checks.length; i++) {
                if (tlv8.String.isHave(value, checks[i]
                    .getAttribute("value")))
                    checks[i].checked = true;
                else
                    checks[i].checked = false;
            }
        },
        checkAll: function () {
            var checks = div.getElementsByTagName("INPUT");
            for (var i = 1; i < checks.length; i++) {
                checks[i].checked = true;
                Check.boxcheck(checks[i]);
            }
        },
        uncheckAll: function () {
            var checks = div.getElementsByTagName("INPUT");
            for (var i = 1; i < checks.length; i++) {
                checks[i].checked = false;
                Check.boxcheck(checks[i]);
            }
        }
    };
    var set = item.keySet();
    var disabled = "";
    if (div.disabled)
        disabled = "disabled=true";
    for (k in set) {
        div.innerHTML += "<input type='checkbox' name='" + item.get(set[k])
            + "' value='" + set[k]
            + "' onclick='document.getElementById(\"" + divnid
            + "\").Check.boxcheck(this)' " + disabled
            + "/><a style='font-size:12px'>" + item.get(set[k]) + "</a>";
        if (splithtmlarray && splithtmlarray.length == set.length
            && k < set.length - 1) {
            try {
                div.innerHTML += splithtmlarray[k];
            } catch (e) {
                mAlert("参数：splithtmlarray无效，应该为item等长度的数组.");
            }
        }
    }
    div.disabled = false;
    document.getElementById(checkboxcompid).Check = Check;
    div.Check = Check;
    div.id = divnid;
    div.setAttribute("id", divnid);
    return this;
};
var easyTitle = function (dModule) {
    this.parent = dModule;
    this.init();
};
easyTitle.prototype = {
    getElementsByTitle: function (dModule) {
        if (!dModule)
            return null;
        var dMC = dModule.childNodes, aDC = [], at = null;
        for (var i = 0, l = dMC.length; i < l; i++) {
            at = (dMC[i].getAttribute) ? dMC[i].getAttribute("title") : null;
            if (!!at)
                aDC.push(dMC[i]);
        }
        return aDC.slice(0);
    },
    addEventListen: function (d, e, f, c) {
        if (d && f) {
            if (document.attachEvent) {
                for (var i = 0, l = d.length; i < l; i++)
                    d[i].attachEvent('on' + e, f);
            } else {
                for (var i = 0, l = d.length; i < l; i++)
                    d[i].addEventListener(e, f, c);
            }
        }
    },
    showTitle: function (e) {
        var e = e || window.event, dObj = e.srcElement || e.target;
        var x = e.clientX, y = e.clientY;
        var sTitle = dObj.getAttribute('title'), sCss = dObj
            .getAttribute('titlestyle');
        var dTitle = document.getElementById('easyTitleShow');
        if (sTitle) {
            dTitle.innerHTML = sTitle;
            sCss += ';position:absolute';
            sCss += ';left:' + (x - 2) + 'px';
            sCss += ';top:' + (y + 19) + 'px';
            sCss += ';display:;';
            dTitle.style.cssText = sCss;
        }
    },
    hideTitle: function () {
        var dTitle = document.getElementById('easyTitleShow');
        dTitle.style.display = 'none';
    },
    init: function () {
        var aTitle = this.getElementsByTitle(this.parent);
        if (aTitle) {
            var dTitle = document.createElement('DIV');
            dTitle.style.display = 'none';
            dTitle.setAttribute('id', 'easyTitleShow');
            document.body.appendChild(dTitle);
            this.addEventListen(aTitle, 'mouseover', this.showTitle, false);
            this.addEventListen(aTitle, 'mousemove', this.showTitle, false);
            this.addEventListen(aTitle, 'mouseout', this.hideTitle, false);
        }
    }
};
var et = new easyTitle(document.body);

function getSelectedText() {
    if (window.getSelection) {
        return window.getSelection().toString();
    } else if (document.getSelection) {
        return document.getSelection();
    } else if (document.selection) {
        return document.selection.createRange().text;
    }
}

tlv8.showMessage = function (message) {
    if (parent.justep && parent.tlv8 && parent.tlv8.showMessage) {
        parent.tlv8.showMessage(message);
        return;
    }
    if (!checkPathisHave($dpcsspath + "showMessage.css"))
        createStyleSheet($dpcsspath + "showMessage.css");
    var oldsg = document.getElementById("msg-showmessage");
    if (oldsg)
        document.body.removeChild(oldsg);
    var main_Message_view = document.createElement("div");
    main_Message_view.setAttribute("id", "msg-showmessage");
    main_Message_view.setAttribute("class", "showmessage");
    main_Message_view.style.position = "absolute";
    main_Message_view.style.left = (document.body.offsetWidth - 300) / 2;
    main_Message_view.style.top = (document.body.offsetHeight - 100) / 2;
    main_Message_view.style.zIndex = "101";
    var message_show = "<div class=\"mborder\" style=\"margin-left:3px;width:294px;\"></div><div class=\"mborder\" style=\"margin-left:2px;width:296px;\"></div><div class=\"mborder\" style=\"margin-left:1px;width:298px\"></div><div id=\"msg_Text\" style=\"width:300px;height:25px;font-size:16px;font-color:#FF3333;\">"
        + message
        + "</div><div class=\"mborder\" style=\"margin-left:1px;width:298px\"></div><div class=\"mborder\" style=\"margin-left:2px;width:296px;\"></div><div class=\"mborder\" style=\"margin-left:3px;width:294px;\"></div>";
    document.body.appendChild(main_Message_view);
    main_Message_view.innerHTML = message_show;

    function startMove(obj) {
        obj.iAlpha = 60;
        obj.times && clearInterval(obj.time);
        obj.times = setInterval(function () {
            doMove(obj);
        }, 100);
    }

    function doMove(obj) {
        var iSpeed = 5;
        if (obj.iAlpha >= 90) {
            clearInterval(obj.times);
            obj.iAlpha = 100;
            obj.times = setInterval(function () {
                endMove(obj);
            }, 100);
        } else {
            obj.iAlpha += iSpeed;
        }
        obj.style.filter = "alpha(opacity=" + obj.iAlpha + ")";
        obj.style.opacity = obj.iAlpha / 100;
    }

    function endMove(obj) {
        var iSpeed = 5;
        if (obj.iAlpha <= 10) {
            clearInterval(obj.times);
            obj.iAlpha = 10;
            obj.time = null;
            document.body.removeChild(obj);
        } else {
            obj.iAlpha -= iSpeed;
        }
        obj.style.filter = "alpha(opacity=" + obj.iAlpha + ")";
        obj.style.opacity = obj.iAlpha / 100;
    }

    function showMessage() {
        var msgView = document.getElementById("msg-showmessage");
        startMove(msgView);
    }

    showMessage();
};
tlv8.fileupload = function (dbkey, docPath, tablename, cellname, rowid,
                            callback) {
    var url = "/comon/fileupload/upload";
    url += "?dbkey=" + dbkey;
    url += "&docPath=" + docPath;
    url += "&tablename=" + (tablename ? tablename : "undefined");
    url += "&cellname=" + (cellname ? cellname : "undefined");
    url += "&rowid=" + (rowid ? rowid : "undefined");
    url += "&personID=" + tlv8.Context.getCurrentPersonID();
    tlv8.portal.dailog.openDailog('文件上传', url, 350, 200, callback, false);
};
tlv8.dowloadfile = function (fileID, filename) {
    var xmlHttp = tlv8.xmlHttp();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4) {
            if (xmlHttp.status == 200) {
                var r = eval('(' + xmlHttp.responseText + ')');
            }
        }
    };
    xmlHttp.open("post", cpath + "/GetDownloadURLAction?fileID=" + J_u_encode(fileID)
        + "&filename=" + J_u_encode(filename), false);
    xmlHttp.send(null);
    try {
        var r = eval('(' + xmlHttp.responseText + ')');
    } catch (e) {
    }
    if (!r) {
        alert("获取文件信息失败!可能文档服务配置错误，请联系管理员");
        return;
    }
    if (r.url && r.url != "err")
        window.open(r.url, "文件下载", "height=" + (screen.availHeight - 60)
            + ",width=" + (screen.availWidth)
            + ",toolbar=no,menubar=no,status=no,location=no,top=0,left=0");
    else
        alert("下载失败!");
    return;
};
tlv8.deletefile = function (fileID, filename, dbkey, tablename, cellname,
                            rowid, callback) {
    if (!fileID || fileID == "" || !filename)
        return;
    if (confirm("确定删除文件'" + filename + "'吗？")) {
        var url = cpath + "/deleteFileAction?fileID=" + fileID;
        url += "&filename=" + J_u_encode(filename);
        url += "&dbkey=" + dbkey;
        url += "&tablename=" + tablename;
        url += "&cellname=" + cellname;
        url += "&rowid=" + rowid;
        var xmlHttp = tlv8.xmlHttp();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4) {
                if (xmlHttp.status == 200) {
                    var r = eval('(' + xmlHttp.responseText + ')');
                    if (callback)
                        callback(r);
                }
            }
        };
        xmlHttp.open("post", url, true);
        xmlHttp.send(null);
    }
};

/**
 * @class UUID
 * @description UUID对象
 */
function UUID() {
    this.id = this.createUUID();
    return this;
}

/**
 * @name valueOf
 * @description UUID字符串
 * @returns {string}
 */
UUID.prototype.valueOf = function () {
    return this.id;
};

/**
 * @name toString
 * @description UUID字符串
 * @returns {string}
 */
UUID.prototype.toString = function () {
    return this.id;
};

/**
 * @name createUUID
 * @description UUID字符串
 * @returns {string}
 */
UUID.prototype.createUUID = function () {
    var dg = new Date(1582, 10, 15, 0, 0, 0, 0);
    var dc = new Date();
    var t = dc.getTime() - dg.getTime();
    var tl = UUID.getIntegerBits(t, 0, 31);
    var tm = UUID.getIntegerBits(t, 32, 47);
    var thv = UUID.getIntegerBits(t, 48, 59) + '1';
    var csar = UUID.getIntegerBits(UUID.rand(4095), 0, 7);
    var csl = UUID.getIntegerBits(UUID.rand(4095), 0, 7);
    var n = UUID.getIntegerBits(UUID.rand(8191), 0, 7)
        + UUID.getIntegerBits(UUID.rand(8191), 8, 15)
        + UUID.getIntegerBits(UUID.rand(8191), 0, 7)
        + UUID.getIntegerBits(UUID.rand(8191), 8, 15)
        + UUID.getIntegerBits(UUID.rand(8191), 0, 15);
    return tl + tm + thv + csar + csl + n;
};
UUID.getIntegerBits = function (val, start, end) {
    var base16 = UUID.returnBase(val, 16);
    var quadArray = new Array();
    var quadString = '';
    var i = 0;
    for (i = 0; i < base16.length; i++) {
        quadArray.push(base16.substring(i, i + 1));
    }
    for (i = Math.floor(start / 4); i <= Math.floor(end / 4); i++) {
        if (!quadArray[i] || quadArray[i] == '')
            quadString += '0';
        else
            quadString += quadArray[i];
    }
    return quadString;
};
UUID.returnBase = function (number, base) {
    return (number).toString(base).toUpperCase();
};
UUID.rand = function (max) {
    return Math.floor(Math.random() * (max + 1));
};
tlv8.ExcelImp = function (dbkey, table, relation, confirmXmlName, callback) {
    var srcPath = tlv8.getRequestURI();
    var url = "/comon/report/import-compent";
    url += "?srcPath=" + srcPath;
    url += "&dbkey=" + dbkey;
    url += "&table=" + table;
    url += "&relation=" + relation;
    url += "&confirmXmlName=" + confirmXmlName;
    tlv8.portal.dailog.openDailog('Excel导入', url, 350, 350, callback,
        false);
};
tlv8.ExcelExp = function (dbkey, table, relation, labels, where, orderby) {
    var srcPath = tlv8.getRequestURI();
    var url = "/comon/report/export-compent";
    var params = {
        dbkey: dbkey,
        table: table,
        relation: relation,
        labels: labels,
        where: where,
        orderby: orderby
    };
    tlv8.portal.dailog.openDailog('导出Excel', url, 350, 400, null, false,
        null, params);
};
tlv8.encodeURIComponent = function (str) {
    try {
        var $rval = str.toString().replaceAll("<", "#lt;");
        $rval = $rval.replaceAll(">", "#gt;");
        $rval = $rval.replaceAll("&nbsp;", "#160;");
        $rval = $rval.replaceAll("'", "#apos;");
        return J_u_encode($rval);
    } catch (e) {
        return "";
    }
};
tlv8.decodeURIComponent = function (str) {
    try {
        str = decodeURIComponent(decodeURIComponent(str));
        var sValue = str.toString().replaceAll("#160;", "&nbsp;");
        sValue = sValue.replaceAll("#lt;", "<");
        sValue = sValue.replaceAll("#gt;", ">");
        sValue = sValue.replaceAll("#apos;", "'");
        return sValue;
    } catch (e) {
        return "";
    }
};

/**
 * 附件上传组件【HTML方式 弃用flash】
 *上传文件完成回调事件： onuploaded  定义为div的属性即可
 */
tlv8.fileComponent = function (div, data, cellname, docPath, canupload,
                               candelete, canedit, viewhistory, limit, download) {
    if (!div || !data || !cellname)
        return;
    try {
        upload = layui.upload;
    } catch (e) {
        var $rp = $dpjspath.replace("/common/js/", "/");
        createStyleSheet($rp + "layui/css/layui.css");
        createJSSheet($rp + "layui/layui.js");
    }
    var $commonpath = $dpjspath.replace("/js/", "/");
    if (!checkPathisHave(cpath + "/common/doc_ocx/docUtil.js")
        && !checkPathisHave($commonpath + "doc_ocx/docUtil.js")) {
        createJSSheet($commonpath + "doc_ocx/docUtil.js");
    }
    $(div).css("padding", "10px 0");
    this.uploadcount = 0;
    div.uploader = null;
    div.writedata = new Array();
    this.div = div;
    this.CimitDataParam = function (docName, kind, size, cacheName,
                                    revisionCacheName, commentFileContent, filecount, compment) {
        var pa_log = {};
        pa_log.dbkey = data.dbkay;
        pa_log.docPath = docPath || "/root";
        pa_log.tablename = data.table;
        pa_log.cellname = cellname;
        pa_log.rowid = data.rowid;
        pa_log.docName = docName;
        pa_log.kind = kind;
        pa_log.size = size;
        pa_log.cacheName = cacheName;
        compment.div.writedata.push(pa_log);
        compment.uploadcount++;
        if (compment.uploadcount == filecount) {
            compment.comitDataFn();
        }
    };
    this.comitDataFn = function () {
        var paramlog = JSON.stringify(this.div.writedata);
        var pas = new tlv8.RequestParam();
        pas.set("writelog", paramlog);
        var self = this;
        tlv8.XMLHttpRequest("writeUploadDataAction", pas, "POST", true,
            function (r) {
                self.uploadcallback(r, self);
            });
        this.uploadcount = 0;
    };
    this.uploadcallback = function (r, compment) {
        compment.$refreshFileComp();
        compment.div.writedata = new Array();
    };
    var taptt = tlv8.RequestURLParam.getParam("activity-pattern");
    var isTasksub = (taptt == "detail");
    var fiTablehead = "<table style='width:100%;' border='0'>";
    if (false != canupload && !isTasksub) {
        fiTablehead += "<tr id=\""
            + div.id
            + "_uploadTR\"><td colspan='6' align='left' style='width:100%;height:20px;border:0px none;'><div style='position:relative;'>"
            + "<a href='javascript:void(0)' id='"
            + div.id
            + "_uploadItem'  title='上传文件' style='font-size:12px;color:#0033FF;text-decoration: none;'>上传文件</a><hr/></div></td></tr>";
    }
    var filetableBody = "<tr><td valign='top' style='border:0px none;'><div id='"
        + div.id + "_fileList'></div></td></tr>";
    var filetableFooter = "<tr><td style='border:0px none;'></td></tr></table>";
    this.div.innerHTML = fiTablehead + filetableBody + filetableFooter;
    this.createUploader = function () {
        layui.upload.render({
            elem: '#' + div.id + '_uploadItem',
            url: cpath + '/utils/layuiFileUploadAction',
            accept: 'file',
            multiple: (!limit || limit > 1),
            dataType: 'json',
            data: {dbkey: data.dbkay, rowid: data.rowid, tablename: data.table, cellname: cellname, docPath: docPath},
            before: function (obj) {
                layui.layer.load();
            },
            done: function (res, index, upload) {
                layui.layer.closeAll('loading');
                if (res.code != '-1') {
                    layui.layer.msg('上传成功.', {icon: 1, time: 1000});
                    div.refreshFileComp();
                    try {
                        var puploadcallback = $(div).attr("onuploaded");
                        if (typeof puploadcallback == "string") {
                            puploadcallback = window.eval(puploadcallback);
                        }
                        puploadcallback(div.dilelist);
                    } catch (e) {
                    }
                } else {
                    this.error(index, upload);
                }
            },
            error: function () {
                layui.layer.closeAll('loading');
                layui.layer.msg('上传失败!', {icon: 2});
            },
            progress: function (n, elem, e) {
                //layui.element.progress('正在上传:', n + '%'); //可配合 layui 进度条元素使用
            }
        });
    };
    div.createUploader = this.createUploader;
    if (false != canupload && !isTasksub) {
        setTimeout(function () {
            if (data.rowid && data.rowid != "") {
                div.createUploader();
            } else {
                $('#' + div.id + '_uploadItem').click(function () {
                    var rowid = data.saveData();
                    if (!rowid || rowid == "") {
                        layui.layer.msg("数据保存失败,请先保存数据!");
                    } else {
                        $('#' + div.id + '_uploadItem').unbind("click");
                        div.createUploader();
                    }
                });
            }
        }, 500);
    }
    this.$refreshFileComp = function () {
        var dbkey = data.dbkay;
        var tablename = data.table;
        var rowid = data.rowid;
        var sID = (dbkey == "system" || !dbkey) ? "SID" : "fID";
        var random = Math.random();
        var sql = "select " + cellname + " FILECOMPE from " + tablename
            + " where " + sID + " = '" + rowid + "' and " + random + "="
            + random;
        var r = tlv8.sqlQueryActionforJson(dbkey, sql);
        var dilelist = [];
        var transeJson = function (str) {
            str = str.toString().replaceAll(":", ":\"");
            str = str.toString().replaceAll(",", "\",");
            str = str.toString().replaceAll("}", "\"}");
            str = str.toString().replaceAll("}{", "},{");
            str = str.toString().replaceAll(";", "\",");
            var filelist = eval("([" + str + "])");
            return filelist;
        };
        try {
            if (r.data != "") {
                var datas = r.data[0];
                datas = datas.FILECOMPE;
                if ("null" == datas) {
                    datas = "";
                }
                if (datas && datas != "") {
                    try {
                        dilelist = eval("(" + datas + ")");
                    } catch (e) {
                        dilelist = transeJson(datas);
                    }
                }
            }
        } catch (e) {
            alert(e.message);
        }
        div.dilelist = dilelist;
        var fileIDs = new Array();
        var filenames = new Array();
        for (var i = 0; i < dilelist.length; i++) {
            fileIDs.push(dilelist[i].fileID);
            filenames.push(dilelist[i].filename);
        }
        filetableBody = "<table>";
        docPath = docPath || "/";
        try {
            if (limit && limit != -1 && limit <= filenames.length) {
                document.getElementById(div.id + "_uploadItem").style.display = "none";
                $("#" + div.id + "_uploadDocItemDiv").remove();
                div.uploader = null;
            } else {
                document.getElementById(div.id + "_uploadItem").style.display = "";
            }
        } catch (e) {
        }
        if (filenames && filenames.length > 0) {
            for (i in filenames) {
                var fileID = fileIDs[i];
                filetableBody += "<tr style='width:100%;height:20px;padding:5px;'><td style='border:0px none;'>"
                    + "<a style='font-size:12px;color:#0033FF;text-decoration: none;' href='javascript:void(0)' id=\""
                    + div.id
                    + "_titleItem\" title='"
                    + filenames[i]
                    + "' onclick='justep.Doc.browseDocByID(\""
                    + fileID
                    + "\",\""
                    + filenames[i]
                    + "\")'>"
                    + filenames[i]
                    + "</a>&nbsp;&nbsp;</td>";
                filetableBody += "<td width='40px;' style='border:0px none;'>"
                    + "<a href='javascript:void(0)' style='font-size:12px;color:#0033FF;text-decoration: none;' title='文件属性' onclick='justep.Doc.openDocInfoDialog(\""
                    + fileID + "\")'>属性</a></td>";
                if (canedit == true && !isTasksub) {
                    filetableBody += "<td width='40px;' style='border:0px none;'><a href='javascript:void(0)' "
                        + "style='font-size:12px;color:#0033FF;text-decoration: none;' title='编辑文件' "
                        + "onclick='tlv8.trangereditfile(\""
                        + fileID
                        + "\",\""
                        + filenames[i]
                        + "\",\""
                        + docPath
                        + "\",\""
                        + data.dbkay
                        + "\",\""
                        + data.table
                        + "\",\""
                        + data.rowid
                        + "\",\""
                        + cellname
                        + "\",\"" + div.id + "\")'>编辑</a></td>";
                } else {
                    filetableBody += "<td style='border:0px none;'></td>";
                }
                if (viewhistory == true) {
                    filetableBody += "<td width='40px;' style='border:0px none;'><a href='javascript:void(0)' style='font-size:12px;color:#0033FF;text-decoration: none;' title='历史版本' onclick='justep.Doc.openDocHistoryDialog(null,\""
                        + fileID + "\")'>历史</a></td>";
                } else {
                    filetableBody += "<td style='border:0px none;'></td>";
                }
                if (candelete != false && !isTasksub) {
                    filetableBody += "<td width='40px;' style='border:0px none;'><a href='javascript:void(0)' style='font-size:12px;color:#0033FF;text-decoration: none;' title='删除附件' onclick='tlv8.deletefile(\""
                        + fileID
                        + "\",\""
                        + filenames[i]
                        + "\",\""
                        + dbkey
                        + "\",\""
                        + tablename
                        + "\",\""
                        + cellname
                        + "\",\""
                        + rowid
                        + "\",function(){document.getElementById(\""
                        + div.id + "\").refreshFileComp()})'>删除</a></td>";
                } else {
                    filetableBody += "<td></td>";
                }
                if (download != false) {
                    filetableBody += "<td width='40px;' style='border:0px none;'><a href='javascript:void(0)' style='font-size:12px;color:#0033FF;text-decoration: none;' title='下载附件' onclick='justep.Doc.downloadDocByFileID(\""
                        + docPath + "\",\"" + fileID + "\")'>下载</a></td>";
                } else {
                    filetableBody += "<td style='border:0px none;'></td>";
                }
                filetableBody += "</tr>";
            }
        }
        filetableBody += "</table>";
        document.getElementById(div.id + "_fileList").innerHTML = filetableBody;
    };
    this.div.refreshFileComp = this.$refreshFileComp;
    div.compment = this;
    this.$refreshFileComp();
};
var editFilecoment;

function rahgereditercalback() {
    var reloadfilefn = document.getElementById(editFilecoment).refreshFileComp;
    reloadfilefn();
}

// office、wps文件在线编辑
tlv8.trangereditfile = function (fileID, fileName, docPath, dbkey,
                                 tablename, billid, cellname, comentid) {
    editFilecoment = comentid;
    if ('.doc.docx.xls.xlsx.ppt.pptx.mpp.vsd.dps.wps.et.'
        .indexOf(String(/\.[^\.]+$/.exec(fileName)) + '.') < 0) {
        alert("不支持非Office文件编辑");
        return;
    }
    var edurl = "/comon/doc_ocx/tangerOffice/officeediter?fileID="
        + fileID + "&fileName=" + J_u_encode(fileName) + "&dbkey="
        + dbkey + "&tablename=" + tablename + "&billid=" + billid
        + "&cellname=" + cellname + "&callerName="
        + tlv8.portal.currentTabId() + "&option=edit";
    //tlv8.portal.openWindow("文件" + fileName + "编辑",edurl);
    window.open(cpath + edurl);
};
tlv8.changeLog = {
    items: [],
    autoCreateVersion: 0,
    createVersionLogs: [],
    "operate": "",
    "url": "",
    process: "",
    activity: ""
};
tlv8.updateDoc = function (docID, fileID, docPath, docName, kind, size,
                           cacheName, revisionCacheName, commentFileContent, createVersion) {
    var node = justep.Doc.evalChangeLog(tlv8.changeLog, docID);
    if (node) {
        var version = node.version;
        var parentID = node.parent_id;
        var displayPath = node.doc_display_path;
        var docVersionID = node.doc_version_id;
        var description = node.description;
        var classification = node.classification;
        var keywords = node.keywords;
        var finishTime = node.finish_time;
        var serialNumber = node.serial_number;
        justep.Doc.modifyChangeLog(node,
            [version, fileID, docVersionID, docName, kind, size, parentID,
                docPath, displayPath, description, classification,
                keywords, finishTime, serialNumber], ["attachment",
                cacheName, revisionCacheName, commentFileContent]);
    } else {
        var row = justep.Doc.queryDoc(docID, undefined, ["VERSION",
            "SPARENTID", "SDOCDISPLAYPATH", "SDOCLIVEVERSIONID",
            "SDESCRIPTION", "SCLASSIFICATION", "SKEYWORDS", "SFINISHTIME",
            "SDOCSERIALNUMBER"], undefined, undefined, "single");
        var version = row.VERSION;
        var parentID = row.SPARENTID;
        var displayPath = row.SDOCDISPLAYPATH;
        var docVersionID = row.SDOCLIVEVERSIONID;
        var description = row.SDESCRIPTION;
        var classification = row.SCLASSIFICATION;
        var keywords = row.SKEYWORDS;
        var finishTime = !row.SFINISHTIME ? "" : row.SFINISHTIME;
        var serialNumber = row.SDOCSERIALNUMBER;
        justep.Doc.addChangeLog(tlv8.changeLog, "edit", [docID, version,
            fileID, docVersionID, docName, kind, size, parentID, docPath,
            displayPath, description, classification, keywords, finishTime,
            serialNumber], ["attachment", cacheName, revisionCacheName,
            commentFileContent]);
    }
    if (fileID) {
        justep.Doc.commitDocCache(docID, tlv8.changeLog);
    }
    if (createVersion && fileID) {
        tlv8.createVersion(docID, fileID, docName, docPath);
    }
};
tlv8.createVersion = function (docID, fileID, docName, docPath) {
    if (fileID == '') {
        return;
    }
    if ('.doc.docx.xls.xlsx.ppt.mpp.vsd.'.indexOf(String(/\.[^\.]+$/
            .exec(docName))
        + '.') < 0) {
        alert("不支持非Office文件成文");
        return;
    }
    var currentNode = justep.Doc.evalChangeLog(tlv8.changeLog, docID);
    if (currentNode != null) {
        justep.Doc.removeChangeLog(tlv8.changeLog, docID);
    }
    justep.Doc.createVersion(docID);
};
tlv8.getDocIdByFileId = function (fileID) {
    var r = tlv8.sqlQueryAction("system",
        "select SID from sa_docnode where (sfileid='" + fileID + "')");
    if (r.getCount() > 0) {
        return r.getValueByName("SID");
    }
};
/*
 * 图片组件
 */
tlv8.picComponent = function (div, data, cellname, canEdit) {
    if (!div || !data || !cellname) {
        mAlert("tlv8.picComponent：参数无效");
        return;
    }
    div.style.position = "relative";
    div.style.border = "1px solid #eee";
    var $CompPath = $dpimgpath.replace("/image", "") + "picCompant/";
    var bsPIC = false;
    var lookPIC = function () {
        var dbkey = data.dbkay ? data.dbkay : "system";
        var tablename = data.table;
        var rowid = data.rowid;
        if (!rowid) {
            div.innerHTML = "<img src='" + $CompPath
                + "pic/img.gif' style='width:" + div.clientWidth
                + ";height:" + div.clientHeight + ";z-index:-1;'/>";
            return;
        }
        var url = $dpimgpath.replace("/image", "");
        url += "picCompant/Pic-read?dbkey=" + dbkey + "&tablename="
            + tablename + "&cellname=" + cellname + "&fID=" + rowid
            + "&Temp=" + new UUID().toString();
        var image = "<img src='" + url + "' style='width:" + div.clientWidth
            + ";height:" + div.clientHeight + ";'/>";
        bsPIC = true;
        div.innerHTML = image;
    };
    div.lookPIC = lookPIC;
    var picBorder = function () {
        // $("#" + div.id + "_edit_bar").remove();
        var editBar = document.getElementById(div.id + "_edit_bar");
        if (editBar) {
            return;
        }
        var editBar = document.createElement("div");
        editBar.setAttribute("id", div.id + "_edit_bar");
        editBar.style.background = "#eee";
        editBar.style.border = "0";
        editBar.style.position = "absolute";
        editBar.style.left = "0px";
        editBar.style.top = "0px";
        editBar.style.font = "12px/1.6em Verdana, Geneva, Arial, Helvetica, sans-serif";
        editBar.style.width = div.offsetWidth;
        editBar.style.height = div.offsetHeight;
        editBar.style.textAlign = "right";
        editBar.style.lineHeight = "18px";
        editBar.style.filter = "alpha(opacity = 30)";
        editBar.style.opacity = 0.3;
        editBar.style.zIndex = 99;
        $(editBar).css("opacity", "0.3");
        $(editBar).css("-moz-opacity", "0.3");
        var dataTable = "<table id='"
            + div.id
            + "_table' style='width:100%;height:100%;z-index:999;'><tr><td colspan='3'></td></tr><tr style='width:100%;height:20px;align:right;'><td></td>";
        dataTable += "<td style='width:20px;'><a href='javascript:void(0)' style='color:#eee;' onclick='document.getElementById(\""
            + div.id
            + "\").uploadPIC()'><img src='"
            + $CompPath
            + "pic/edit.gif' title='上传图片' style='width:18px;'/></a></td>";
        dataTable += "<td style='width:20px;'><a href='javascript:void(0)' style='color:#eee;' onclick='document.getElementById(\""
            + div.id
            + "\").deletePIC()'><img src='"
            + $CompPath
            + "pic/remove.gif' title='删除图片' style='width:18px;'/></a></td>";
        dataTable += "</tr></table>";
        editBar.innerHTML = dataTable;
        // document.body.appendChild(editBar);
        $(div).append(editBar);
        var removeBar = function () {
            var editBar = document.getElementById(div.id + "_edit_bar");
            if (editBar) {
                div.removeChild(editBar);
            }
        };
        addEvent(document.getElementById(div.id + "_edit_bar"), "mouseout",
            removeBar, false);
    };
    div.picBorder = picBorder;
    if (canEdit != false) {
        addEvent(div, "mouseover", picBorder, false);
    }
    var uploadPIC = function () {
        var dbkey = data.dbkay ? data.dbkay : "system";
        var tablename = data.table;
        var rowid = data.saveData();
        // if (!rowid || rowid == "") {
        // alert("请先保存数据！");
        // return;
        // }
        var url = "/comon/picCompant/Imag-upload";
        url += "?dbkey=" + dbkey;
        url += "&tablename=" + tablename;
        url += "&cellname=" + cellname;
        url += "&rowid=" + rowid;
        var upLcallback = function () {
            document.getElementById(div.id).lookPIC();
        };
        tlv8.portal.dailog.openDailog('图片上传', url, 285, 225, upLcallback);
    };
    div.uploadPIC = uploadPIC;
    var deletePIC = function () {
        if (!bsPIC)
            return;
        var dbkey = data.dbkay;
        var tablename = data.table;
        var rowid = data.rowid;
        if (!rowid || rowid == "") {
            return;
        }
        if (confirm("确定删除图片吗？")) {
            var dbkey = data.dbkay ? data.dbkay : "system";
            var tablename = data.table;
            var rowid = data.rowid;
            var url = cpath + "/ImageDeleteAction";
            url += "?dbkey=" + dbkey;
            url += "&tablename=" + tablename;
            url += "&cellname=" + cellname;
            url += "&rowid=" + rowid;
            var xmlHttp = tlv8.xmlHttp();
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState == 4) {
                    if (xmlHttp.status == 200) {
                        var r = eval('(' + xmlHttp.responseText + ')');
                        if (r.flag == "false") {
                            alert(r.caption);
                        } else {
                            document.getElementById(div.id).lookPIC();
                        }
                    }
                }
            };
            xmlHttp.open("post", url, true);
            xmlHttp.send(null);
        }
    };
    div.deletePIC = deletePIC;
    $(div).css("overflow", "hidden");
    lookPIC();
    return this;
};
var mAlert = function (msg, img) {
    try {
        var allviewcap = document.createElement("div");
        allviewcap.setAttribute("id", "mAlertmsgDiv");
        allviewcap.style.left = "0px";
        allviewcap.style.top = "0px";
        allviewcap.style.width = document.body.clientWidth;
    } catch (e) {
        alert(msg);
        return;
    }
};

function Confirm(msg, okcallFn, cancelcallFn, img) {
    layui.layer.confirm(msg, okcallFn, cancelcallFn);
}

tlv8.isHaveAuthorization = function (url) {
    var orgFID = tlv8.Context.getCurrentPersonFID();
    var param = new tlv8.RequestParam();
    param.set("orgFID", orgFID);
    param.set("url", url);
    var callBackfn = function (r) {
        if (r.data.flag == "false") {
            alert(r.data.message);
        } else {
            if (r.data.data == "true")
                return true;
            else
                return false;
        }
    };
    var r = tlv8.XMLHttpRequest("HaveFunctionAuthority", param, "get",
        false, callBackfn);
    if (r.data.flag == "false") {
        alert(r.data.message);
    } else {
        if (r.data.data == "true")
            return true;
        else
            return false;
    }
};
tlv8.isIE6 = function () {
    if (window.ActiveXObject) {
        var ua = navigator.userAgent.toLowerCase();
        var ie = ua.match(/msie ([\d.]+)/)[1];
        if (ie == 6.0) {
            return true;
        }
    }
    return false;
};
tlv8.islowIE10 = function () {
    if (window.ActiveXObject) {
        var ua = navigator.userAgent.toLowerCase();
        var ie = ua.match(/msie ([\d.]+)/)[1];
        if (parseInt(ie) < 10) {
            return true;
        }
    }
    return false;
};
tlv8.isIE = function () { // ie?
    if (!!window.ActiveXObject || "ActiveXObject" in window)
        return true;
    else
        return false;
}

if (!JSON)
    var JSON = {};
JSON.parse = function (jsonStr) {
    try {
        return eval("(" + jsonStr + ")");
    } catch (e) {
        alert("JSON.parse: " + e);
    }
};
String.prototype.toJSON = function () {
    try {
        return eval("(" + this + ")");
    } catch (e) {
        alert("toJSON: " + e);
    }
};
JSON.toString = function (jsonObj) {
    if (jsonObj.toString().indexOf(",") < 0) {
        var str = "{";
        for (var k in jsonObj) {
            str += ",\"" + k + "\":\"" + jsonObj[k] + "\"";
        }
        str += "}";
        str = str.replace(",", "");
        return str;
    } else {
        var str = "[";
        for (var i = 0; i < jsonObj.length; i++) {
            if (i > 0)
                str += ",";
            var ostr = "{";
            for (var k in jsonObj[i]) {
                ostr += ",\"" + k + "\":\"" + jsonObj[i][k] + "\"";
            }
            ostr += "}";
            ostr = ostr.replace(",", "");
            str += ostr;
        }
        str += "]";
        return str;
    }
};

/**
 * @des 显示loading信息 模式
 * @param state[true/false]
 * @param msg
 *            提示信息
 */
tlv8.showModelState = function (state, msg) {
    if (state && state == true) {
        tlv8.loadindex = layui.layer.load(2);
    } else {
        if (tlv8.loadindex) {
            layui.layer.close(tlv8.loadindex);
            delete tlv8.loadindex;
        }
    }
};
tlv8.DateAdd = function (strInterval, date, Number) {
    var dtTmp = date;
    switch (strInterval) {
        case 's':
            return new Date(Date.parse(dtTmp) + (1000 * Number));
        case 'n':
            return new Date(Date.parse(dtTmp) + (60000 * Number));
        case 'h':
            return new Date(Date.parse(dtTmp) + (3600000 * Number));
        case 'd':
            return new Date(Date.parse(dtTmp) + (86400000 * Number));
        case 'w':
            return new Date(Date.parse(dtTmp) + ((86400000 * 7) * Number));
        case 'q':
            return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number * 3,
                dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp
                    .getSeconds());
        case 'm':
            return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp
                .getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp
                .getSeconds());
        case 'y':
            return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp
                .getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp
                .getSeconds());
    }
};

function getNevType() {
    try {
        if ((navigator.userAgent.indexOf('MSIE') >= 0)
            && (navigator.userAgent.indexOf('Opera') < 0)) {
            return 'IE';
        } else if (navigator.userAgent.indexOf('Firefox') >= 0) {
            return 'Firefox';
        } else if (navigator.userAgent.indexOf("Opera") >= 0) {
            return 'Opera';
        } else if (navigator.userAgent.indexOf("Camino") >= 0) {
            return 'Camino';
        } else {
            return 'Other';
        }
    } catch (e) {
        return false;
    }
}

function getIEVersion() {
    if (navigator.appVersion.match(/6./i) == "6.") {
        return "IE6";
    } else if (navigator.appVersion.match(/7./i) == "7.") {
        return "IE7";
    } else if (navigator.appVersion.match(/8./i) == "8.") {
        return "IE8";
    } else if (navigator.appVersion.match(/9./i) == "9.") {
        return "IE9";
    }
    return "Other";
}

if (topparent != window) {
    // if (!checkPathisHave(cpath+"/comon/js/jquery/jquery.min.js")
    // && !checkPathisHave($dpjspath + "jquery/jquery.min.js")) {
    // createJSSheet($dpjspath + "jquery/jquery.min.js");
    // }
}

tlv8.requerat = function () {
    $("[rel='remind']").each(function () {
        var val = $(this).val();
        if (!val || val == "") {
            $(this).val($(this).attr("rel-value"));
            $(this).css("color", "blue");
        }
        $(this).unbind("focus");
        $(this).bind('focus', function () {
            var val = $(this).val();
            if (val && val == $(this).attr("rel-value")) {
                $(this).val("");
            }
        });
        $(this).unbind("blur");
        $(this).bind('blur', function () {
            var val = $(this).val();
            if (!val || val == "") {
                $(this).val($(this).attr("rel-value"));
                $(this).css("color", "blue");
            } else {
                $(this).css("color", "#000");
            }
        });
    });
};

$(document).ready(function () {
    tlv8.requerat();
});

/**
 * @folder 目录 如："/行政审批/会议纪要"
 * @title 标题
 * @table 业务数据表
 * @billid 单据主键
 * @surl 查看页面地址
 */
tlv8.docpigeonhole = function (folder, title, table, billid, surl) {
    var param = new tlv8.RequestParam();
    param.set("folder", folder);
    param.set("title", title);
    param.set("table", table);
    param.set("billid", billid);
    param.set("surl", surl);
    tlv8.XMLHttpRequest("docpigeonholeAction", param, "POST", false);
};

/**
 * @title 标题
 * @table 业务数据表
 * @billid 单据主键
 * @surl 查看页面地址
 */
tlv8.Mydocpigeonhole = function (title, table, billid, surl) {
    var newid = new UUID().toString();
    var filename = "<a href=\"javascript:tlv8.docOpendeatail(''" + title
        + "'',''" + surl + "'',''" + billid + "'')\">" + title + "</a>";
    tlv8.portal.dailog
        .openDailog(
            "选择归档目录",
            "/SA/docnode/dialog/myFolderSelect.html",
            300,
            400,
            function (rdata) {
                var sql = "insert into PERSONAL_FILE(SID,SFILENAME,SCREATORID,SCREATORNAME,SMASTERID,VERSION)"
                    + " select '"
                    + newid
                    + "','"
                    + filename
                    + "','"
                    + tlv8.Context.getCurrentPersonID()
                    + "',"
                    + "'"
                    + tlv8.Context.getCurrentPersonName()
                    + "','" + rdata + "',0 from dual";
                tlv8.sqlUpdateAction("system", sql, function (re) {
                    if (re.flag == "false") {
                        alert(re.message);
                    } else {
                        alert("归档成功!");
                    }
                }, true);
            });
};

/**
 * @title 标题
 * @table 业务数据表
 * @billid 单据主键
 * @surl 查看页面地址
 */
tlv8.ognDocpigeonhole = function (title, table, billid, surl) {
    var selsql = "select * from oa_dz_filecabinet where FMAINID='" + billid
        + "'";
    var result = tlv8.sqlQueryActionforJson("oa", selsql);
    if (result.data.length > 0) {
        if (confirm("文件已归过档,是否更换文件夹")) {
            tlv8.portal.dailog.openDailog("选择归档目录",
                "/SA/docnode/dialog/ognFolderSelect.html", 300, 400,
                function (rdata) {
                    var sql = "update oa_dz_filecabinet set FMASTERID='"
                        + rdata + "' where FMAINID='" + billid + "'";
                    tlv8.sqlUpdateAction("oa", sql);
                    alert("归档成功!");
                });
        }
    } else {
        var newid = new UUID().toString();
        var filename = "<a href=\"javascript:tlv8.docOpendeatail(''"
            + title + "'',''" + surl + "'',''" + billid + "'')\">" + title
            + "</a>";
        tlv8.portal.dailog
            .openDailog(
                "选择归档目录",
                "/SA/docnode/dialog/ognFolderSelect.html",
                300,
                400,
                function (rdata) {
                    var sql = "insert into oa_dz_filecabinet(FID,FFILENAME,FCREATORID,FCREATORNAME,FMASTERID,FMAINID,VERSION)"
                        + " select '"
                        + newid
                        + "','"
                        + filename
                        + "','"
                        + tlv8.Context.getCurrentPersonID()
                        + "',"
                        + "'"
                        + tlv8.Context.getCurrentPersonName()
                        + "','"
                        + rdata
                        + "','"
                        + billid
                        + "',0 from dual";
                    tlv8.sqlUpdateAction("oa", sql, function (re) {
                        if (re.flag == "false") {
                            alert(re.message);
                        } else {
                            alert("归档成功!");
                        }
                    }, true);
                });
    }
};
/*
 * 查看归档文件详细
 */
tlv8.docOpendeatail = function (name, surl, billid) {
    var url = cpath + surl + "?sData1=" + billid;
    tlv8.portal.openWindow(name, url);
};

// 填写审批意见
tlv8.writeOpinion = function (view) {
    var taptt = tlv8.RequestURLParam.getParam("activity-pattern");
    var isTasksub = (taptt == "detail");
    if (isTasksub) {
        alert("已办任务不能再填写意见!");
        return;
    }
    var sData1 = tlv8.RequestURLParam.getParam("sData1");
    var flowID = tlv8.RequestURLParam.getParam("flowID");
    var taskID = tlv8.RequestURLParam.getParam("taskID");
    var url = "/flw/flwcommo/flowDialog/processAudit.html";
    url += "?flowID=" + flowID;
    url += "&taskID=" + taskID;
    url += "&sData1=" + sData1;
    url += "&opviewID=" + view;
    tlv8.portal.dailog.openDailog("填写意见", url, 800, 500, function (r) {
        // 参数:显示div ID，业务ID
        tlv8.loadOption(view, sData1);
    });
};

// 加载审核意见
tlv8.loadOption = function (viewID, sData1) {
    var param = new tlv8.RequestParam();
    param.set("fbillID", sData1);
    param.set("fopviewID", viewID);
    var re = tlv8.XMLHttpRequest("LoadAuditOpinionAction", param, "POST", false);
    var redata = re.data.data;
    try {
        redata = window.eval("(" + redata + ")");
    } catch (e) {
    }
    var viewHTml = "<ul style='width:100%;font-size:14px;display: block;overflow:hidden;'>";
    for (var i = 0; i < redata.length; i++) {
        var opinion = redata[i].FAGREETEXT;
        var writeDate = redata[i].FCREATETIME;
        var personid = redata[i].FCREATEPERID;
        var personname = redata[i].FCREATEPERNAME;
        var psign = redata[i].FSIGN;
        if (writeDate && writeDate != "") {
            writeDate = tlv8.System.Date.strToDate(writeDate);
            writeDate = writeDate.format("yyyy-MM-dd HH:mm");
        }
        var hdws = viewID + "_handwrite";
        if (psign && psign != "") {
            writpsm = '<img src="data:image/png;base64,' + psign + '" style="height:30px;">&nbsp;&nbsp;';
        } else {
            var param1 = new tlv8.RequestParam();
            param1.set("personid", personid);
            var pcre = tlv8.XMLHttpRequest("LoadAuditOpinionAction", param1, "POST", false);
            var picID = "";
            if (pcre.data.length > 0) {
                picID = pcre.data[0].SID;
            }
            var url = cpath + "/comon/picCompant/Pic-read?dbkey=sa"
                + "&tablename=SA_HANDWR_SIGNATURE&cellname=SHSPIC&fID=" + picID
                + "&Temp=" + new UUID().toString();
            var image = "<img src='" + url
                + "' style='width:100px;;height:30px;'></img>";
            var writpsm = personname;
            if (picID && picID != "") {
                writpsm = image;
            }
        }
        viewHTml += "<li style='margin-bottom:10px;width:100%;float:left;'>";
        viewHTml += "<ul style='width:100%;display: block;overflow:hidden;'>";
        viewHTml += "<li style='float:left;'>"
            + opinion + "</li>";
        viewHTml += "<li style='float:right;width:130px;'>"
            + writeDate + "</li>";
        viewHTml += "<li style='float:right;width:100px;' id='"
            + hdws + "'>"
            + writpsm
            + "</li>";
        viewHTml += "</ul>";
        viewHTml += "</li>";
    }
    viewHTml += "</ul>";
    var oph = redata.length * 30 + 30;
    $("#" + viewID).css("width", "100%");
    $("#" + viewID).css("min-height", oph + "px");
    $("#" + viewID).html(viewHTml);
    if ($("#" + viewID).parent().height() < $("#" + viewID).height()) {
        $("#" + viewID).parent().height($("#" + viewID).height() + 10);
    }
};

// 禁止回退键“返回”页面
function disbackspace() {
    $("body")
        .bind(
            "keydown",
            function (event) {
                event = event || window.event;
                var elem = event.srcElement ? event.srcElement
                    : event.target;
                if (event.keyCode == 8) {
                    var name = elem.nodeName;
                    if (name != 'INPUT' && name != 'TEXTAREA') {
                        if (event.preventDefault) {
                            event.preventDefault();
                        } else {
                            event.returnValue = false;
                        }
                        return false;
                    }
                    var type_e = elem.type.toUpperCase();
                    if (name == 'INPUT'
                        && (type_e != 'TEXT'
                            && type_e != 'TEXTAREA'
                            && type_e != 'PASSWORD' && type_e != 'FILE')) {
                        if (event.preventDefault) {
                            event.preventDefault();
                        } else {
                            event.returnValue = false;
                        }
                        return false;
                    }
                    if (name == 'INPUT'
                        && (elem.readOnly == true || elem.disabled == true)) {
                        if (event.preventDefault) {
                            event.preventDefault();
                        } else {
                            event.returnValue = false;
                        }
                        return false;
                    }
                }
            });
}

$(document).ready(function () {
    disbackspace();
});

/*
 * sDate1和sDate2是2002-12-18格式
 */
function DateDiff(startDate, endDate) {
    var aDate, oDate1, oDate2, iDays;
    aDate = startDate.split("-");
    oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]); // 转换为12-18-2002格式
    aDate = endDate.split("-");
    oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
    if (oDate1 > oDate2) {
        alert("开始日期大于结束日期！");
        return 0;
    } else {
        iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24); // 把相差的毫秒数转换为天数
        return iDays;
    }
}

/**
 * 基于JQuery的列表下拉组件 $("#ttt").gridSelect(options); 基础实现参考jQuery easyUI的列表下拉组件
 */
(function ($) {
    $.fn.gridSelect = function (options) {
        var defaults = {
            editable: false,
            valueField: "id",
            textField: "text",
            method: "get"
        };
        var opts = $.extend(defaults, options);
        var _this = $(this);
        var optiondata;
        if (opts.data) {
            optiondata = opts.data;
        } else if (opts.url) {
            $.ajax({
                type: opts.method,
                async: false,
                url: opts.url,
                success: function (result, textStatus) {
                    optiondata = result;
                    if (opts.onLoadSuccess && typeof opts.onLoadSuccess == "function") {
                        opts.onLoadSuccess(optiondata);
                    }
                },
                error: function (errocode) {
                    if (opts.onLoadError && typeof opts.onLoadError == "function") {
                        opts.onLoadError(errocode);
                    }
                }
            });
        }
        var selectob;
        if (this.tagName == "SELECT") {
            selectob = _this;
        } else {
            selectob = $("<select></select>")
            selectob.attr("id", _this.attr("id"))
            selectob.attr("style", _this.attr("style"))
            selectob.attr("class", _this.attr("class"))
            _this.replaceWith(selectob);
        }
        selectob.append("<option></option>");
        if (optiondata && optiondata.length > 0) {
            for (var o = 0; o < optiondata.length; o++) {
                var opdata = optiondata[o];
                var op = $("<option></option>");
                op.attr("value", opdata[opts.valueField]);
                if (opts.textField.indexOf(",") < 0) {
                    op.text(opdata[opts.textField]);
                } else {
                    var tfields = opts.textField.split(",");
                    var optexts = [];
                    for (var t = 0; t < tfields.length; t++) {
                        var field = tfields[t];
                        optexts.push(opdata[field]);
                    }
                    op.text(optexts.join(" "));
                }
                for (var pk in opdata) {
                    op.attr(pk, opdata[pk]);
                }
                selectob.append(op);
                op.get(0).rec = opdata;
            }
        }
        selectob.change(function () {
            var selop = $(this).children('option:selected');
            var selopob = selop.get(0);
            if (opts.onSelect && typeof opts.onSelect == "function") {
                opts.onSelect(selopob.rec, selopob);
            }
        });
    };
})(jQuery);

