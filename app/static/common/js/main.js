var cpath = "";
/**
 * 名空间
 */
var tlv8 = {};

/**
 * @name J$
 * @description 根据ID获取HTML的Element对象
 * @param id
 * @returns {HTMLElement}
 */
const J$ = function (id) {
    return document.getElementById(id);
};

/**
 * @name J$n
 * @description 根据标签名称获取HTML的Element对象数组
 * @param tagName
 * @returns {[HTMLElement]}
 */
const J$n = function (tagName) {
    return document.getElementsByTagName(tagName);
};

/**
 * @name J_u_encode
 * @description 将字符串UTF-8编码
 * @param  str
 * @returns {string}
 */
const J_u_encode = function (str) {
    return encodeURIComponent(encodeURIComponent(str));
};

/**
 * @name J_u_decode
 * @description 将字符串UTF-8解码
 * @param str
 * @returns {string}
 */
const J_u_decode = function (str) {
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
const topparent = function () {
    let nowwdw = window;
    let parentwdw = window.parent;
    while (nowwdw !== parentwdw) {
        nowwdw = parentwdw;
        parentwdw = nowwdw.parent;
    }
    return nowwdw;
}();

function checkEncode() {
    let META = document.getElementsByTagName("META");
    for (let i = 0; i < META.length; i++) {
        if (META[i].content.toLowerCase().indexOf("utf-8") > -1)
            return true;
    }
    return false;
}

const createMeta = function () {
    let HTMLhead = document.getElementsByTagName('HEAD')[0];
    let meta = document.createElement('meta');
    meta.setAttribute("http-equiv", "content-type");
    meta.setAttribute("content", "text/html; charset=utf-8");
    HTMLhead.appendChild(meta);
};
if (!checkEncode())
    createMeta();

/**
 * 请求参数为了统一编码
 */
tlv8.RequestParam = function () {
    this.params = new Map();
    this.set = function (key, value) {
        this.params.put(key, value);
    };
    this.get = function (key) {
        return this.params.gut(key);
    };
    return this;
};
/*
 * ajax
 */
tlv8.xmlHttp = function () {
    let xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    return xmlhttp;
};
tlv8.getRequestURI = function () {
    let url = window.location.pathname;
    return url.substring(0, url.lastIndexOf("/"));
};

/**
 * 获取当前服务器地址
 * @returns {string}
 */
tlv8.getHost = function () {
    let surl = window.location.href;
    let host = surl.substring(0, surl.indexOf(cpath));
    return host + cpath;
};

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

/**
 * 添加事件
 * @param elm
 * @param evType
 * @param fn
 * @param useCapture
 * @returns {boolean|*|void}
 */
function addEvent(elm, evType, fn, useCapture) {
    if (elm.addEventListener) {
        elm.addEventListener(evType, fn, useCapture);
        return true;
    } else if (elm.attachEvent) {
        return elm.attachEvent('on' + evType, fn);
    } else {
        elm['on' + evType] = fn;
    }
}

/**
 * 移除事件
 * @param obj
 * @param type
 * @param fn
 * @param cap
 */
function removeEvent(obj, type, fn, cap) {
    cap = cap || false;
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
tlv8.XMLHttpRequest = function (actionName, param, post, ayn, callBack, unShowState) {
    let localurl = window.location.href;
    if (localurl.indexOf("file://") > -1) {
        return;
    }
    if (!unShowState) {
        tlv8.showModelState(true);
        window.actiondoing = true;
    }
    let paramMap = param ? param.params : new Map();
    let params = "";
    if (paramMap) {
        if (!paramMap.isEmpty()) {
            let list = paramMap.keySet();
            for (let i = 0; i < list.length; i++) {
                let sk = list[i];
                if (i > 0)
                    params += "&";
                params += sk + "=" + J_u_encode(paramMap.get(sk));
            }
        }
    }
    try {
        let rs;
        let hideModelState = function () {
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
            success: function (result) {
                rs = result;
                try {
                    rs = window.eval("(" + rs + ")");
                } catch (e) {
                }
                hideModelState();
                try {
                    if (rs.data.flag === "timeout") {
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
            error: function () {//xreq, xmsg, xep
                hideModelState();
                // alert("请求失败! \nurl:"+actionName+"\n错误信息："+xmsg);
            }
        });
        return rs;
    } catch (e) {
        // console.log(e);
    }
};

/*
 * 写操作日志
 */
function writeLog(ev, actionName, discription) {
    if (window.isWriteLog === false)
        return;
    try {
        let activateName = $("title").text();
        let srcPath = window.location.pathname;
        if (srcPath.indexOf("?") > 0)
            srcPath = srcPath.substring(0, srcPath.indexOf("?"));
        let param = new tlv8.RequestParam();
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
     * @param name
     */
    getParam: function (name) {
        let lurl = window.location.href;
        if (lurl.indexOf(name) < 0)
            return;
        if (lurl.indexOf("?") < 0) {
            return "";
        } else {
            let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            let r = window.location.search.substring(1).match(reg);
            if (r != null)
                return J_u_decode(r[2]);
            let par;
            if (lurl.indexOf("?" + name) > 0) {
                par = lurl.substring(lurl.indexOf("?" + name) + 1, lurl.length);
            }
            if (lurl.indexOf("&" + name) > 0) {
                par = lurl.substring(lurl.indexOf("&" + name) + 1, lurl.length);
            }
            if (!par)
                return;
            let start = name.length + 1;
            let len = (par.indexOf("&") > 0) ? par.indexOf("&") : lurl.length;
            let pav = par.substring(start, len);
            return J_u_decode(pav);
        }
    },
    getParamByURL: function (lurl, name) {
        if (lurl.indexOf(name) < 0)
            return;
        if (lurl.indexOf("?") < 0) {
            return "";
        } else {
            let par;
            if (lurl.indexOf("?" + name) > 0) {
                par = lurl.substring(lurl.indexOf("?" + name) + 1, lurl.length);
            }
            if (lurl.indexOf("&" + name) > 0) {
                par = lurl.substring(lurl.indexOf("&" + name) + 1, lurl.length);
            }
            if (!par)
                return;
            let start = name.length + 1;
            let len = (par.indexOf("&") > 0) ? par.indexOf("&") : lurl.length;
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
    let table = data ? data.table : "";
    where = where ? where : "";
    let dbkay = data ? data.dbkay : "";
    let relation = data ? data.relation : "";
    let orderby = data ? data.orderby : "";
    if (!where || where === "") {
        where = tlv8.RequestURLParam.getParamByURL(actionName, "where");
    }
    let param = new tlv8.RequestParam();
    param.set("dbkay", dbkay);
    param.set("table", table);
    param.set("relation", relation);
    param.set("orderby", orderby);
    if (actionName.indexOf("getGridActionBySQL") > -1) {
        actionName += "&where=" + J_u_encode(CryptoJS.AESEncrypt(where));
    } else {
        param.set("where", CryptoJS.AESEncrypt(where));
    }
    let isay = (ays === false) ? ays : true;
    let rscallBack = function (r) {
        if (callBack)
            callBack(r.data);
    };
    let result = tlv8.XMLHttpRequest(actionName, param, post, isay,
        rscallBack);
    if (ays === false) {
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
 * @returns
 */
tlv8.DeleteAction = function (actionName, post, callBack, rowid, data, ays) {
    if (!rowid || rowid === "") {
        layui.layer.alert("rowid不能为空！");
        return;
    }
    let table = data ? data.table : "";
    let dbkay = data ? data.dbkay : "";
    let Cascade = data ? data.Cascade : "";
    let param = new tlv8.RequestParam();
    param.set("dbkay", dbkay);
    param.set("table", table);
    param.set("rowid", rowid);
    param.set("Cascade", Cascade);
    let isay = (ays === false) ? ays : true;
    let rscallBack = function (r) {
        if (callBack)
            callBack(r);
    };
    let result = tlv8.XMLHttpRequest(actionName, param, post, isay,
        rscallBack);
    if (ays === false) {
        if (callBack)
            callBack(result);
        return result;
    }
};

/**
 * @name tlv8.saveAction
 * @function
 * @description 公用函数：java调用动作{针对带参数操作 保存}
 * @param actionName {string}
 * @param post {string}
 * @param callBack {function}
 * @param data
 * @param allreturn
 * @param ays
 * @returns
 */
tlv8.saveAction = function (actionName, post, callBack, data, allreturn, ays) {
    if (!data || data === "") {
        return;
    }
    let table = data.table;
    let cells = data.cells;
    let dbkay = data ? data.dbkay : "";
    let param = new tlv8.RequestParam();
    param.set("dbkay", dbkay);
    param.set("table", table);
    param.set("cells", cells);
    let ays_true = (ays === false) ? ays : true;
    let rscallBack = function (r) {
        if (callBack && allreturn)
            callBack(r);
        else if (callBack) {
            callBack(r.data);
        }
    };
    let result = tlv8.XMLHttpRequest(actionName, param, post, ays_true,
        rscallBack);
    if (ays_true === false && result) {
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
    let x = "<?xml version=\"1.0\" encoding='UTF-8' ?>\n<root>\n" + str
        + "</root>";
    if (window.ActiveXObject) {
        let xmlDom = new ActiveXObject("Microsoft.XMLDOM");
        xmlDom.async = "false";
        xmlDom.loadXML(x);
        return xmlDom;
    } else if (document.implementation
        && document.implementation.createDocument) {
        let parser = new DOMParser();
        return parser.parseFromString(x, "text/xml");
    }
};

/*
 * 信息提示
 */
function sAlert(str, stime) {
    layui.layer.msg(str, {time: stime});
}

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
    this.queryAction = "";
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
     * @param state
     */
    this.setReadonly = function (state) {
        try {
            this.readonly = state;
            if (this.relation && this.relation !== "") {
                let relations = this.relation.split(",");
                for (let i = 0; i < relations.length; i++) {
                    let name = relations[i];
                    let revalueEl = document.getElementById(this.formid)[name] || document.getElementById(name);
                    if (revalueEl) {
                        if (this.readonly === true) {
                            revalueEl.readOnly = true;
                            if (revalueEl.parentNode.Check || revalueEl.parentNode.Radio) {
                                revalueEl.parentNode.disabled = true;
                            }
                            if (revalueEl.tagName === "DIV" || revalueEl.tagName === "SELECT") {
                                revalueEl.disabled = true;
                            }
                        } else {
                            revalueEl.readOnly = false;
                            if (revalueEl.parentNode.Check || revalueEl.parentNode.Radio) {
                                revalueEl.parentNode.disabled = false;
                            }
                            if (revalueEl.tagName === "DIV"
                                || revalueEl.tagName === "SELECT") {
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
                let form = $("#" + this.formid);
                form.find("input").attr("readonly", "readonly");
                form.find("textarea").attr("readonly", "readonly");
                form.find("select").attr("disabled", "disabled");
                form.find("input[type='radio']").attr("disabled", "disabled");
                form.find("input").removeAttr("onclick");
            }
        } catch (e) {
        }
    };
    /**
     * @name setOrderby
     * @description 设置数据排序
     * @param ob
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
     * @param fil
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
     * @param cas
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
     * @param id
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
     * @param k
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
    this.setQueryAction = function (a) {
        if (typeof (a) == "string")
            this.queryAction = a;
        else
            this.queryAction = a.toString();
    };
    /**
     * @name setFormId
     * @description 设置数据对应的FORM表单ID
     * @param  s
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
    let onDataValueChanged;
    let isEdited = false;
    /**
     * @name setonDataValueChanged
     * @description 设置表单值改变事件回调函数
     * @param fn
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
     * @param formid
     * @example data.registerChangeEvent();
     */
    this.registerChangeEvent = function (formid) {
        let dataform = formid || this.formid;
        let mainform = document.getElementById(dataform);
        let $JromTag = function (tagname) {
            return mainform.getElementsByTagName(tagname);
        };
        let inputs = $JromTag("INPUT");
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].type === "text" || inputs[i].type === "textarea"
                || inputs[i].type === "password"
                || inputs[i].type === "date" || inputs[i].type === "datetime"
                || inputs[i].type === "hidden") {
                let $rid = inputs[i].id;
                if ($rid && $rid !== ""
                    && $rid.toUpperCase().substring(4, 12) !== "_FIXFFCURSOR"
                    && $rid.indexOf("_quick_text") < 0
                    && $rid.indexOf("_page") < 0
                    && $rid.indexOf("_editgridipt") < 0) {
                    addEvent(inputs[i], "change", function (evt) {
                        isEdited = true;
                        let event = evt || window.event;
                        let objEdit = event.srcElement ? event.srcElement
                            : event.target;
                        let _dchg = onDataValueChanged;
                        if (_dchg && typeof (_dchg) == "function") {
                            _dchg(evt, objEdit.id, objEdit
                                .getAttribute("value"), objEdit.type);
                        } else if (_dchg && _dchg !== "") {
                            _dchg = eval(_dchg);
                            _dchg(evt, objEdit.id, objEdit
                                .getAttribute("value"), objEdit.type);
                        }
                    }, true);
                }
            }
        }
        let textareas = $JromTag("TEXTAREA");
        for (let i = 0; i < textareas.length; i++) {
            let $rid = textareas[i].id;
            if ($rid && $rid !== ""
                && $rid.toUpperCase().substring(4, 12) !== "_FIXFFCURSOR") {
                addEvent(textareas[i], "change", function (evt) {
                    isEdited = true;
                    let event = evt || window.event;
                    let objEdit = event.srcElement ? event.srcElement
                        : event.target;
                    let _dchg = onDataValueChanged;
                    if (_dchg && typeof (_dchg) == "function") {
                        _dchg(evt, objEdit.id, objEdit.getAttribute("value"),
                            objEdit.type);
                    } else if (_dchg && _dchg !== "") {
                        _dchg = eval(_dchg);
                        _dchg(evt, objEdit.id, objEdit.getAttribute("value"),
                            objEdit.type);
                    }
                }, true);
            }
        }
        let selects = $JromTag("SELECT");
        for (let i = 0; i < selects.length; i++) {
            let $rid = selects[i].id;
            if ($rid && $rid !== ""
                && $rid.toUpperCase().substring(4, 12) !== "_FIXFFCURSOR") {
                addEvent(selects[i], "change", function (evt) {
                    isEdited = true;
                    let event = evt || window.event;
                    let objEdit = event.srcElement ? event.srcElement
                        : event.target;
                    let _dchg = onDataValueChanged;
                    if (_dchg && typeof (_dchg) == "function") {
                        _dchg(evt, objEdit.id, objEdit.getAttribute("value"),
                            objEdit.type);
                    } else if (_dchg && _dchg !== "") {
                        _dchg = eval(_dchg);
                        _dchg(evt, objEdit.id, objEdit.getAttribute("value"),
                            objEdit.type);
                    }
                }, true);
            }
        }
        let labels = $JromTag("LABEL");
        for (let i = 0; i < labels.length; i++) {
            let $rid = labels[i].id;
            if ($rid && $rid !== ""
                && $rid.toUpperCase().substring(4, 12) !== "_FIXFFCURSOR") {
                addEvent(labels[i], "change", function (evt) {
                    isEdited = true;
                    let event = evt || window.event;
                    let objEdit = event.srcElement ? event.srcElement
                        : event.target;
                    let _dchg = onDataValueChanged;
                    if (_dchg && typeof (_dchg) == "function") {
                        _dchg(evt, objEdit.id, objEdit.getAttribute("value"),
                            objEdit.type);
                    } else if (_dchg && _dchg !== "") {
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
     * @param t
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
     * @param cells
     * @example let cell=new Map(); cell.put("a","a"); cell.put("b","b");
     *          data.setCells(cell);
     */
    this.setCells = function (cells) {

    };
    /**
     * @name saveData
     * @description 保存数据
     * @param formfield
     * @returns {string}
     * @example let rowid = data.saveData();
     */
    this.saveData = function (formfield) {
        if (!this.formid || this.formid === "") {
            layui.layer.alert("未指定保存内容！");
            return false;
        }
        let bfSave = document.getElementById(this.formid).getAttribute(
            "beforeSave");
        if (bfSave && bfSave !== "") {
            if (typeof bfSave == "function") {
                let bfck = bfSave(this);
                if (bfck === false)
                    return false;
            } else {
                let bfS = window.eval(bfSave);
                if (typeof bfS == "function") {
                    let bfck = bfS(this);
                    if (bfck === false)
                        return false;
                }
            }
        }
        let mainform = document.getElementById(this.formid);
        mainform.data = this;
        let cell = new Map();
        let fdata = formfield || $(mainform).serializeJSON();
        for (let cnm in fdata) {
            cell.put(cnm, fdata[cnm]);
        }
        let $JromTag = function (tagname) {
            return mainform.getElementsByTagName(tagname);
        };
        let labels = $JromTag("LABEL");
        for (let i = 0; i < labels.length; i++) {
            let $rid = labels[i].id;
            let $rval = labels[i].innerHTML;
            if ($rid && $rid !== ""
                && $rid.toUpperCase().substring(4, 12) !== "_FIXFFCURSOR") {
                labels[i].title = $rval;
                labels[i].setAttribute("value", $rval);
                if ($(labels[i]).attr("format")
                    && $(labels[i]).attr("format") !== "") {
                    try {
                        $rval = $rval.replaceAll(",", "");
                    } catch (e) {
                        $rval = "";
                    }
                }
                cell.put($rid, $rval);
            }
        }
        let rowid = $(mainform).attr("rowid") || mainform.getAttribute("rowid")
            || mainform.rowid;
        if (rowid) {
            cell.put("rowid", rowid);
        }
        cell.put("VERSION", (this.version + 1) + "");
        this.setCells();
        this.setCells("<root>");
        this.setCells(cell);
        this.setCells("</root>");
        if (!this.savAction || this.savAction === "") {
            this.setSaveAction("saveAction");
        } else {
            this.setSaveAction(this.savAction);
        }
        let self = this;
        let r = tlv8.saveAction(this.savAction, "post", null, this, true,
            false);
        writeLog(window.event, "保存数据", "操作的表:" + this.dbkay + "." + this.table);
        if (r) {
            isEdited = false;
            let msessage = "操作成功!";
            if (r.data.flag !== "true") {
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
            let rRowID = r.data.rowid;
            self.setRowId(rRowID);
            try {
                mainform.setAttribute("rowid", rRowID);
            } catch (e) {
                mainform.rowid = rRowID;
            }
            if (!self.childrenData.isEmpty()) {
                let keyset = self.childrenData.keySet();
                for (i in keyset) {
                    key = keyset[i];
                    let childData = self.childrenData.get(key);
                    let isCsave = childData.saveData(event, self.refreshData);
                    if (!isCsave || isCsave === false) {
                        break;
                    }
                }
            }
            let afSave = mainform.getAttribute("afterSave");
            if (afSave && afSave !== "") {
                if (typeof afSave == "function") {
                    afSave(this, r.data);
                } else {
                    let afS = window.eval(afSave);
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
     * @param isconfirm -是否提示确认[默认是]
     * @example data.deleteData();
     */
    this.deleteData = function (isconfirm) {
        let bfDelete = document.getElementById(this.formid).getAttribute(
            "beforeDelete");
        if (bfDelete && bfDelete !== "") {
            if (typeof bfDelete == "function") {
                bfDelete(this);
            } else {
                let bfd = window.eval(bfDelete);
                if (typeof bfd == "function") {
                    bfd(this);
                }
            }
        }
        document.getElementById(this.formid).data = this;
        let self = this;
        if (isconfirm === false) {
            tlv8.DeleteAction(self.deleteAction, "post", function (r) {
                if (r.state === true) {
                    self.afdelete(self);
                } else {
                    layui.layer.alert(r.msg);
                }
            }, self.rowid, self, true);
            isEdited = false;
            return true;
        } else {
            layui.layer.confirm("确定删除数据吗?", function (index) {
                layui.layer.closeAll();
                tlv8.DeleteAction(self.deleteAction, "post", function (r) {
                    if (r.state === true) {
                        self.afdelete(self);
                    } else {
                        layui.layer.alert(r.msg);
                    }
                }, self.rowid, self, true);
                isEdited = false;
                return true;
            });
        }
        return false;
    };
    this.afdelete = function (self) {
        writeLog(window.event, "删除数据", "操作的表:" + self.dbkay + "." + self.table);
        try {
            document.getElementById(self.formid).reset();
        } catch (e) {
        }
        let afDelete = document.getElementById(self.formid).getAttribute(
            "afterDelete");
        if (afDelete && afDelete !== "") {
            if (typeof afDelete == "function") {
                afDelete(document.getElementById(self.formid).data);
            } else {
                let afd = window.eval(afDelete);
                if (typeof afd == "function") {
                    afd(document.getElementById(self.formid).data);
                }
            }
        }
        layui.layer.alert("删除成功！", function () {
            tlv8.portal.closeWindow();
        });
    };
    /**
     * @name refreshData
     * @param isconfirm -是否提示确认
     * @param isrefreshSub -是否刷新关联的子表数据
     * @description 刷新数据
     * @description 只是重加载表单的数据，不刷新页面
     * @example data.refreshData();
     */
    this.refreshData = function (isconfirm, isrefreshSub) {
        if (isEdited === true) {
            if (isconfirm !== false)
                if (!confirm("当前数据已更改，刷新数据更改后的数据将丢失，是否确定刷新?")) {
                    return false;
                }
        }
        let bfrefresh = document.getElementById(this.formid).getAttribute(
            "beforeRefresh");
        if (bfrefresh && bfrefresh !== "") {
            if (typeof bfrefresh == "function") {
                bfrefresh(this);
            } else {
                let bfr = window.eval(bfrefresh);
                if (typeof bfr == "function") {
                    bfr(this);
                }
            }
        }
        let self = this;
        let param = new tlv8.RequestParam();
        param.set("rowid", self.rowid);
        tlv8.XMLHttpRequest(self.queryAction, param, "post", true, function (rd) {
            self.setData(rd, self.formid);
        });
        if (isrefreshSub !== false) {
            //刷新子表数据实现
        }
        return true;
    };
    this.setData = function (data, nowformid) {
        let taptt = tlv8.RequestURLParam.getParam("activity-pattern");
        let isTasksub = (taptt === "detail");
        if (isTasksub) {
            this.setReadonly(true);
        }
        if (data.state === false) {
            layui.layer.msg(data.msg);
        } else {
            layui.layer.msg("操作成功~");
            //给表单赋值
            let form = document.getElementById(nowformid);
            let rdata = data.data;
            if (typeof rdata == "string") {
                rdata = JSON.parse(rdata);
            }
            for (let k in rdata) {
                $(form[k]).val(rdata[k]);
            }
        }
        isEdited = false;
        let childrenData = document.getElementById(nowformid).data.childrenData;
        let isrefreshSub = document.getElementById(nowformid).isrefreshSub;
        if (!childrenData.isEmpty() && isrefreshSub !== false) {
            let keyset = childrenData.keySet();
            for (let i in keyset) {
                try {
                    let key = keyset[i];
                    let childData = childrenData.get(key);
                    childData.refreshData(null, false);
                } catch (e) {
                }
            }
        }
        tlv8.requerat();// 提示设置
        let afrefresh = document.getElementById(nowformid).getAttribute(
            "afterRefresh");
        if (afrefresh && afrefresh !== "") {
            if (typeof afrefresh == "function") {
                afrefresh(document.getElementById(nowformid).data);
            } else {
                let afr = window.eval(afrefresh);
                if (typeof afr == "function") {
                    afr(document.getElementById(nowformid).data);
                }
            }
        }
    };
    /**
     * @name getValueByName
     * @param name {string}  -字段名（表单中INPUT、TEXTAREA等字段id）
     * @description 获取指定字段的值
     * @returns {string}
     * @example let nmv = data.getValueByName("FNAME");
     */
    this.getValueByName = function (name) {
        try {
            let revalueEl = document.getElementById(this.formid)[name] || document.getElementById(name);
            let elformat = revalueEl.getAttribute("format");
            if (revalueEl) {
                if (revalueEl.tagName === "INPUT"
                    || revalueEl.tagName === "SELECT") {
                    let $dval = $(revalueEl).val()
                        || revalueEl.getAttribute("value");
                    if (!$dval || $dval === "null") {
                        $dval = "";
                    }
                    try {
                        if (elformat && elformat === "0,000.00") {
                            $dval = $dval.toString().replaceAll(",", "");
                        }
                    } catch (e) {
                    }
                    return $dval;
                } else if (revalueEl.tagName === "LABEL") {
                    let $dval = revalueEl.innerHTML;
                    try {
                        if (elformat && elformat === "0,000.00") {
                            $dval = $dval.toString().replaceAll(",", "");
                        }
                    } catch (e) {
                    }
                    return $dval;
                } else {
                    let $dval = $(revalueEl).val()
                        || revalueEl.getAttribute("value");
                    if (!$dval || $dval === "null") {
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
     * @param name {string} -字段名（表单中INPUT、TEXTAREA等字段id）
     * @param value {string} -需要给的值
     * @description 给指定字段赋值
     * @example data.setValueByName("FNAME","test");
     */
    this.setValueByName = function (name, value) {
        try {
            let revalueEl = document.getElementById(this.formid)[name]
                || document.getElementById(name);
            if (revalueEl) {
                revalueEl.title = value;
                revalueEl.value = value;
                if (revalueEl.tagName === "LABEL") {
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
 * @class tlv8.toolbar
 * @description 工具栏组件
 * @param div {HTMLDivElement}
 * @param insertitem -("readonly":只读,true：可操作,false：不可见)
 * @param saveitem -("readonly":只读,true：可操作,false：不可见)
 * @param deleteitem -("readonly":只读,true：可操作,false：不可见)
 * @param refreshitem -("readonly":只读,true：可操作,false：不可见)
 * @returns {object}
 */
tlv8.toolbar = function (div, insertitem, saveitem, deleteitem, refreshitem) {
    if (!div) return;
    let items = {
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
         * @param insertitem {string} -("readonly":只读,true：可操作,false：不可见)
         * @param saveitem {string} -("readonly":只读,true：可操作,false：不可见)
         * @param deleteitem {string} -("readonly":只读,true：可操作,false：不可见)
         * @param  refreshitem {string} -("readonly":只读,true：可操作,false：不可见)
         */
        setItemStatus: function (insertitem, saveitem, deleteitem, refreshitem) {
            let taptt = tlv8.RequestURLParam.getParam("activity-pattern");
            let isTasksub = (taptt === "detail");
            let insert_item = document.getElementById(div.id + "insert-item");
            let insert_item_img = document.getElementById(div.id
                + "insert-item-img");
            let save_item = document.getElementById(div.id + "save-item");
            let save_item_img = document.getElementById(div.id
                + "save-item-img");
            let delete_item = document.getElementById(div.id + "delete-item");
            let delete_item_img = document.getElementById(div.id
                + "delete-item-img");
            let refresh_item = document.getElementById(div.id + "refresh-item");
            let refresh_item_img = document.getElementById(div.id
                + "refresh-item-img");
            let ienable = $dpimgpath + "toolbar/insert.gif";
            let iread = $dpimgpath + "toolbar/un_insert.gif";
            let senable = $dpimgpath + "toolbar/save.gif";
            let sread = $dpimgpath + "toolbar/un_save.gif";
            let denable = $dpimgpath + "toolbar/remove.gif";
            let dread = $dpimgpath + "toolbar/un_remove.gif";
            let renable = $dpimgpath + "toolbar/refreshbill.png";
            let rread = $dpimgpath + "toolbar/un_refreshbill.png";
            if (insertitem === false) {
                document.getElementById(div.id + "insert-item-tr").style.display = "none";
            } else if (insertitem === "readonly" || isTasksub) {
                insert_item_img.src = iread;
                insert_item.onclick = null;
            } else if (insertitem === true) {
                document.getElementById(div.id + "insert-item-tr").style.display = "";
                insert_item_img.src = ienable;
                insert_item.onclick = items.insertAction;
            }
            if (saveitem === false) {
                document.getElementById(div.id + "save-item-tr").style.display = "none";
            } else if (saveitem === "readonly" || isTasksub) {
                save_item_img.src = sread;
                save_item.onclick = null;
            } else if (saveitem === true) {
                document.getElementById(div.id + "save-item-tr").style.display = "";
                save_item_img.src = senable;
                save_item.onclick = items.saveAction;
            }
            if (deleteitem === false) {
                document.getElementById(div.id + "delete-item-tr").style.display = "none";
            } else if (deleteitem === "readonly" || isTasksub) {
                delete_item_img.src = dread;
                delete_item.onclick = null;
            } else if (deleteitem === true) {
                document.getElementById(div.id + "delete-item-tr").style.display = "";
                delete_item_img.src = denable;
                delete_item.onclick = items.deleteAction;
            }
            if (refreshitem === false) {
                document.getElementById(div.id + "refresh-item-tr").style.display = "none";
            } else if (refreshitem === "readonly" || isTasksub) {
                refresh_item_img.src = rread;
                refresh_item.onclick = null;
            } else if (refreshitem === true) {
                document.getElementById(div.id + "refresh-item-tr").style.display = "";
                refresh_item_img.src = renable;
                refresh_item.onclick = items.refreshAction;
            }
        }
    };
    this.items = items;
    if (!checkPathisHave($dpcsspath + "toolbar.css"))
        createStyleSheet($dpcsspath + "toolbar.css");
    div.style.overflow = "hidden";
    div.innerHTML = "<table class='standard_toolbar' border='0' id='toolbar'><tr>"
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
    let $commonpath = $dpjspath.replace("/js/", "/");
    if (!checkPathisHave($dpcsspath + "toolbar.css"))
        createStyleSheet($dpcsspath + "toolbar.css");
    if (!checkPathisHave($commonpath + "print/print.js"))
        createJSSheet($commonpath + "print/print.js");
    div.style.overflow = "hidden";
    let Stander = "<table style='align:left;' class='standard_toolbar' border='0' id='"
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
        let head = "";
        $(document)
            .find("link")
            .filter(function () {
                return $(this).attr("rel").toLowerCase() === "stylesheet";
            })
            .each(
                function () {
                    head += '<link type="text/css" rel="stylesheet" href="' + $(
                        this).attr("href") + '" >';
                });
        return head;
    }
    $("#" + div.id + "print-item").click(function () {
        let tableToPrint = $("#" + expid).clone();
        // tableToPrint.css("width", "100%");
        let phtml = $("<div></div>").append(tableToPrint).html();
        let pwdoc = "<html lang='zh'><head>" + div.getHead() + "</head><body>" + phtml + "</body></html>";
        // console.log(pwdoc);
        let windowAttr = "location=yes,statusbar=no,directories=no,menubar=no,titlebar=no,toolbar=no,dependent=no";
        let newWin = window.open("", "_blank", windowAttr);
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
            let tableToPrint = $("#" + expid).clone();
            // tableToPrint.css("width", "100%");
            // console.log(div.getHead());
            let htmcontext = div.getHead() + $("<div></div>").append(tableToPrint).html();
            // console.log(htmcontext);
            let form = $("<form></form>")
                .attr("action", "exportWordAction").attr("method",
                    "post");
            form.append($("<input>").attr("type", "hidden").attr(
                "name", "htmcontext").attr("value",
                J_u_encode(htmcontext)));
            form.appendTo('body').submit().remove();
        });
    $("#" + div.id + "excel-item").click(
        function () {
            let tableToPrint = $("#" + expid).clone();
            // tableToPrint.css("width", "100%");
            let htmcontext = $("<div></div>").append(tableToPrint).html();
            let form = $("<form></form>").attr("action",
                "exportExcelAction").attr("method", "post");
            form.append($("<input>").attr("type", "hidden").attr(
                "name", "htmcontext").attr("value",
                J_u_encode(htmcontext)));
            form.appendTo('body').submit().remove();
        });
    $("#" + div.id + "pdf-item").click(
        function () {
            let tableToPrint = $("#" + expid).clone();
            // tableToPrint.css("width", "100%");
            let htmcontext = $("<div></div>").append(tableToPrint).html();
            let form = $("<form></form>").attr("action", "exportPdfAction")
                .attr("method", "post");
            form.append($("<input>").attr("type", "hidden").attr(
                "name", "htmcontext").attr("value",
                J_u_encode(htmcontext)));
            form.appendTo('body').submit().remove();
        });
};

/**
 * @class Map
 * @description jsMap对象
 */
let Map = function () {
    this.arr = [];
    let struct = function (key, value) {
        this.key = key;
        this.value = value;
    };
    this.put = function (key, value) {
        for (let i = 0; i < this.arr.length; i++) {
            if (this.arr[i].key === key) {
                this.arr[i].value = value;
                return;
            }
        }
        this.arr[this.arr.length] = new struct(key, value);
    };
    this.get = function (key) {
        for (let i = 0; i < this.arr.length; i++) {
            if (this.arr[i].key === key) {
                return this.arr[i].value;
            }
        }
        return null;
    };
    this.remove = function (key) {
        let v;
        for (let i = 0; i < this.arr.length; i++) {
            v = this.arr.pop();
            if (v.key === key) {
                continue;
            }
            this.arr.unshift(v);
        }
    };
    this.size = function () {
        return this.arr.length;
    };
    this.isEmpty = function () {
        return this.arr.length <= 0;
    };
    this.containsKey = function (key) {
        let result = false;
        for (let i = 0; i < this.arr.length; i++) {
            if (this.arr[i].key === key) {
                result = true;
            }
        }
        return result;
    };
    this.containsValue = function (value) {
        let result = false;
        for (let i = 0; i < this.arr.length; i++) {
            if (this.arr[i].value === value) {
                result = true;
            }
        }
        return result;
    };
    this.keySet = function () {
        let result = [];
        for (let i = 0; i < this.arr.length; i++) {
            result.push(this.arr[i].key);
        }
        return result;
    };
    return this;
};

/**
 * @name toString
 * @description Map对象转换为字符串
 * @returns {string}
 */
Map.prototype.toString = function () {
    let rs = "{";
    for (let i = 0; i < this.arr.length; i++) {
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
 * @param tabId -可以为空，为空时关闭当前窗口
 */
tlv8.portal.closeWindow = function (tabId) {
    try {
        let currentTabId = tabId ? tabId : topparent.$.jpolite.getTabID();
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
 * @param name {string} -标签名称
 * @param url {string} -页面地址
 * @param param -传递的参数
 */
tlv8.portal.openWindow = function (name, url, param) {
    try {
        if (url.indexOf("?") > 0) {
            let reUrl = url.substring(0, url.indexOf("?"));
            let rePar = url.substring(url.indexOf("?") + 1);
            let parPe = rePar.split("&");
            for (let i = 0; i < parPe.length; i++) {
                let perP = parPe[i];
                parPe[i] = perP.split("=")[0] + "="
                    + J_u_encode(J_u_decode(perP.split("=")[1]));
            }
            url = reUrl + "?" + parPe.join("&");
        }
        let option = {name: name, title: name, url: url, param: param};
        topparent.$.X.runFunc(option, param);
        // topparent.justep.Portal.Tab.open(name, url, param);
    } catch (e) {
        if ((url.substring(0, 4)).toLowerCase() !== "http") {
            let serverPath = window.location.protocol + "//" + window.location.host + "/" + window.location.pathname.split("/")[1];
            url = serverPath + url;
        }
        window.open(url, name);
        // alert("tlv8.portal.openWindow: " + e.message);
    }
};

/**
 * @name tlv8.portal.callBack
 * @description 回调指定页面的函数
 * @param tabID {string} -页面ID
 * @param FnName {string} -回调函数名
 * @param param -传递的参数
 */
tlv8.portal.callBack = function (tabID, FnName, param) {
    try {
        let t = topparent.$.jpolite.getTab(tabID);
        if (t) {
            let containers = t.tabLayoutDiv.get(0);
            let pTabIframe = containers.getElementsByTagName("iframe")[0].contentWindow;
            let callFn = pTabIframe[FnName];
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
            && url.indexOf(cpath) !== 0) {
            url = cpath + url;
        }
        if (url.indexOf("?") > 0) {
            let reUrl = url.substring(0, url.indexOf("?"));
            let rePar = url.substring(url.indexOf("?") + 1);
            let parPe = rePar.split("&");
            for (let i = 0; i < parPe.length; i++) {
                let perP = parPe[i];
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
     * @param name {string}
     * @param url {string}
     * @param width {number}
     * @param height {number}
     * @param callback {function}
     * @param itemSetInit  -{refreshItem:true,enginItem:true,CanclItem:true}
     * @param titleItem {boolean} -为false时掩藏标题栏
     * @param urlParam -JS任意类型可以直接传递到对话框页面 对话框页面通过函数getUrlParam获取
     */
    openDailog: function (name, url, width, height, callback, itemSetInit,
                          titleItem, urlParam) {
        tlv8.portal.dailog.callback = callback;
        url = this.transeUrl(url);
        if (this.dindex) {
            layui.layer.close(this.dindex);// 防止打开多个
            this.dindex = null;
        }
        let ww = $(window).width() - 20;
        let hh = $(window).height() - 20;
        this.dindex = layui.layer.open({
            type: 1,
            maxmin: true,
            area: [Math.min(width, ww) + 'px', Math.min(height, hh) + 'px'],
            title: [name, 'font-size:18px;'],
            content: '<div id="dailogmsgDiv" style="width:99%;height:99%;overflow:hidden;border-top:1px solid #eee;border-bottom:1px solid #eee;"><iframe id="windowdialogIframe" style="border:none;width:100%;height:100%;"></iframe></div>',
            btn: itemSetInit === false ? [] : ['确定', '取消'],
            yes: function (index) {
                let dlw = J$("windowdialogIframe").contentWindow;
                if (dlw.dailogEngin) {
                    let re = dlw.dailogEngin();
                    if ((typeof re == "boolean") && re === false) {
                        return false;
                    } else {
                        if (callback) {
                            callback(re);
                        }
                    }
                } else {
                    if (callback) {
                        callback();
                    }
                }
                layui.layer.close(index);
            },
            btn2: function (index) {
            },
            cancel: function () {// 右上角关闭回调
            }
        });
        $("#windowdialogIframe").attr("src", url);
        try {
            let func_iframe = document.getElementById("windowdialogIframe");
            if (func_iframe.attachEvent) {
                func_iframe.attachEvent("onload", function () {
                    try {
                        let dialogWin = func_iframe.contentWindow;
                        if (dialogWin.getUrlParam) {
                            dialogWin.getUrlParam(urlParam);
                        }
                    } catch (e) {
                    }
                });
            } else {
                func_iframe.onload = function () {
                    try {
                        let dialogWin = func_iframe.contentWindow;
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
     * @param data
     * @param b_g
     */
    dailogEngin: function (data, b_g,) {
        this.returnData = data ? data : this.returnData;
        try {
            let callbackFn;
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
            let index = window.parent.layui.layer.getFrameIndex(window.name); // 先得到当前iframe层的索引
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
            let dialogview = parent.document.getElementById("dailogmsgDiv");
            if (dialogview)
                parent.document.getElementById("windowdialogIframe").contentWindow.location
                    .reload();
        } catch (e) {
        }
        let dialogview = document.getElementById("dailogmsgDiv");
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
            let index = window.parent.layui.layer.getFrameIndex(window.name); // 先得到当前iframe层的索引
            window.parent.layui.layer.close(index); // 再执行关闭
            window.parent.layui.layer.closeAll();
        } catch (e) {
        }
        if (this.dindex)
            layui.layer.close(this.dindex);
    }
};

//纠正拼写错误
tlv8.portal.dialog = {
    openDialog: tlv8.portal.dailog.openDailog,
    dialogEngin: tlv8.portal.dailog.dailogEngin,
    dialogReload: tlv8.portal.dailog.dailogReload,
    dialogCancel: tlv8.portal.dailog.dailogCancel
};

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
        if (topparent !== window) {
            try {
                if (topparent.$.jpolite.clientInfo && topparent.$.jpolite.clientInfo.personid) {
                    this.userInfo = topparent.$.jpolite.clientInfo;
                    return;
                }
            } catch (e) {
            }
        }
        let result = tlv8
            .XMLHttpRequest("/system/User/initPortalInfo");
        if (!result)
            return;
        if (typeof result == "string") {
            result = window.eval("(" + result + ")");
        }
        this.userInfo = result.data;
    },
    checklogin: function () {
        if (!this.userInfo.personid || this.userInfo.personid === ""
            || this.userInfo.personid === "null") {
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
    if (text === undefined) {
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
 * @returns {boolean}
 */
String.prototype.startWith = function (str) {
    return this.indexOf(str) === 0;
};
const reMoveStr = function (str1, str2) {
    if (str1.indexOf(str2) > -1)
        str1 = str1.replace(str2, "");
    return str1;
};
const replaceFirst = function (str, p, m) {
    if (str.indexOf(p) === 0)
        str = str.replace(p, m);
    return str;
};
/**
 * @name replaceFirst
 * @param p {string}
 * @param m {string}
 * @description 替换字符串中的第一个p字符为m
 * @returns {string}
 */
String.prototype.replaceFirst = function (p, m) {
    if (this.indexOf(p) === 0) {
        return this.replace(p, m);
    }
    return this;
};
/**
 * @name replaceAll
 * @param p {string}
 * @param m {string}
 * @description 替换字符串中的所有p字符为m
 * @returns {string}
 */
String.prototype.replaceAll = function (p, m) {
    return this.replace(new RegExp(p, "gm"), m);
};

function closeself() {
    try {
        window.opener = null;
        window.open("", "_self");
    } catch (e) {
    }
    window.close();
}

/*
 * 日期格式化
 */
Date.prototype.format = function (fmt) {
    let o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours() % 24 === 0 ? 24 : this.getHours() % 24,
        "H+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    let week = {
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
    for (let k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k])
                : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};
let daxieshuzhu = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
let danwei = ["仟", "佰", "拾", ""];
let dadanwei = [" ", "万", "亿", "万亿"];
let input = [];
let zhuanhuan = function () {
    this.input = [];
    this.jsq = 0;
    this.output = [];
    this.daxiezhuanhuan = function () {
        this.strtemp = "";
        for (let jwq = 0; jwq < this.input.length; jwq++) {
            this.strtemp += daxieshuzhu[this.input[jwq]] + danwei[jwq];
        }
        this.strtemp += " ";
        this.re = /(零\D)+/g;
        this.strtemp = this.strtemp.replace(this.re, "零");
        this.re = /零$/g;
        this.strtemp = this.strtemp.replace(this.re, "");
        if (this.strtemp !== "") {
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
        let Ainput = [];
        let Atemp = [0, 0, 0, 0];
        for (let temp = this.input.length - 1, temp2 = 3, jwq = 0; temp >= 0; temp--, temp2--) {
            if (temp2 < 0) {
                temp2 = 3;
            }
            Atemp[temp2] = input.substr(temp, 1);
            if ((temp2 % 4) === 0) {
                Ainput[jwq] = Atemp;
                jwq++;
                Atemp = [0, 0, 0, 0];
            } else if (temp === 0) {
                Ainput[jwq] = Atemp;
            }
        }
        if (this.pb === 1) {
            let Ainput2 = [];
            for (let temp = 1; temp < Ainput[0].length; temp++) {
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
        for (let temp = 0; temp < this.Ainput.length; temp++) {
            this.input = Ainput[temp];
            this.daxiezhuanhuan();
        }
        return this.chongzhu(this.output, this.pb);
    };
    this.chongzhu = function (output, pb) {
        this.pb = pb;
        this.output = output;
        this.Stroutput = "";
        for (let temp = this.output.length - 1; temp >= 0; temp--) {
            this.Stroutput += this.output[temp];
        }
        if (this.pb === 1) {
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
    let input = (data) ? data.toString() : "0";
    let xiaoshu = 0;
    //let re = /^0+/g;
    let output = "";
    let output2 = "";
    let chafen = [];
    chafen = input.split(".");
    if (chafen.length === 2) {
        xiaoshu = chafen[1];
    }
    input = chafen[0];
    let myzhuanhuan = new zhuanhuan();
    output = myzhuanhuan.taifen(input, 0);
    if (xiaoshu !== 0) {
        for (let temp = 3 - xiaoshu.length; temp > 0; temp--) {
            xiaoshu += "0";
        }
        let myzhuanhuan = new zhuanhuan();
        output2 = myzhuanhuan.taifen(xiaoshu, 1);
    }
    if (output !== "" && output2 !== "0") {
        return (output + "元" + output2).replace(" ", "");
    } else {
        if (output !== "" && output2 === "0") {
            return (output + "元整").replace(" ", "");
        } else {
            let re = /^零/g;
            return "";
        }
    }
};
/*
 * 数字格式化
 */
tlv8.numberFormat = function (number, format) {
    let result = "";
    try {
        if (number && !isNaN(parseInt(number)) && number.indexOf("E") > 0) {
            let tempNumD = number.split("E")[0];
            let tempNumEx = number.split("E")[1];
            number = tempNumD * Math.pow(10, tempNumEx);
        }
    } catch (e) {
    }
    if (number && number !== "") {
        number = number.toString().replaceAll(",", "");
    }
    let fix = (format.split(".").length > 1) ? format.split(".")[1].length : 0;
    number = parseFloat(number);
    let isubh = false;
    if (number < 0) {
        isubh = true;
        number = -number;
    }
    let val = number.toFixed(fix);
    if (format.split(".")[0].indexOf(",") > 0) {
        let sfa = format.split(".")[0].split(",");
        let scl = sfa[sfa.length - 1].length;
        let numList = [];
        let inNum = val.split(".")[0];
        let n = 0;
        let m = inNum.length;
        for (let i = inNum.length; i > 0; i--) {
            if (i - scl > 0 && n % scl === 0) {
                numList.push(inNum.substring(i - scl, i));
                m = m - scl;
            } else if (i === 1) {
                numList.push(inNum.substring(0, m));
            }
            n++;
        }
        for (let k in numList) {
            if (result !== "") {
                result = numList[k] + "," + result;
            } else
                result = numList[k];
        }
        let zer = "";
        for (let i = 0; i < fix; i++) {
            zer += "0";
        }
        if (val.split(".").length > 1)
            result = result + "." + val.split(".")[1];
        else {
            if (zer !== "")
                result = result + "." + zer;
        }
    } else {
        result = val;
    }
    if (isubh) {
        result = "-" + result;
    }
    return result;
};
/*
 * 检查电子邮箱地址
 */
tlv8.CheckMail = function (mail) {
    let filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
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
    let filter = /^(\d{4})+\/|-([1-9]|0+[1-9]|1+[0-2])+\/|-([1-9]|0+[1-9]|[1-2]+[0-9]|3+[0-1])+$/;
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
        let e = event.keyCode;
        let objEdit = event.srcElement ? event.srcElement : event.target;
        if (e !== 48 && e !== 49 && e !== 50 && e !== 51 && e !== 52 && e !== 53
            && e !== 54 && e !== 55 && e !== 56 && e !== 57 && e !== 96
            && e !== 97 && e !== 98 && e !== 99 && e !== 100 && e !== 101
            && e !== 102 && e !== 103 && e !== 104 && e !== 105 && e !== 109
            && e !== 37 && e !== 39 && e !== 13 && e !== 8 && e !== 46
            && e !== 190 && e !== 110 && e !== 189 && e !== 229) {
            if (event.ctrlKey === false) {
                if (event.preventDefault) {
                    event.preventDefault();
                } else {
                    event.returnValue = false;
                }
                return false;
            } else {
                tlv8.CheckNumber.valClip(event);
            }
        } else if (e === 109 || e === 189 || e === 190 || e === 110) {
            if ((e === 189 || e === 109)
                && objEdit.getAttribute("value").indexOf("-") > -1) {
                if (event.preventDefault) {
                    event.preventDefault();
                } else {
                    event.returnValue = false;
                }
                return false;
            }
            if ((e === 190 || e === 110)
                && objEdit.getAttribute("value").indexOf(".") > -1) {
                if (event.preventDefault) {
                    event.preventDefault();
                } else {
                    event.returnValue = false;
                }
                return false;
            }
        } else if (e === 229) {
            addEvent(objEdit, 'keyup', function (event) {
                tlv8.CheckNumber.checkValNum(objEdit);
            }, true);
        }
    },
    checkValNum: function (obj) {
        if (obj.getAttribute("value") === "") {
        } else if (Number(obj.getAttribute("value")) === "NaN") {
            let str = (obj.getAttribute("value") || "").toString();
            obj.setAttribute("value", str.substring(0, str.length - 1));
        } else if (obj.getAttribute("value") === "NaN") {
            obj.setAttribute("value", "");
        } else {
            obj.setAttribute("value", Number(obj.getAttribute("value")));
        }
    },
    valClip: function (ev) {
        //ev = ev || window.event;
        let content = window.clipboardData.getData('Text');
        if (content != null) {
            try {
                let test = parseFloat(content);
                let str = "" + test;
                if (isNaN(test) === true) {
                    window.clipboardData.setData("Text", "");
                } else {
                    if (str !== content)
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
    let substr = abs.split(',');
    for (let i = 0; i < substr.length; i++) {
        if (str === substr[i])
            return true;
    }
    return abs.indexOf(str) > -1;
};

/*
 * 是否包含
 */
tlv8.String.isHave = function (abs, str) {
    let substr = abs.split(',');
    for (let i = 0; i < substr.length; i++) {
        if (str === substr[i])
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
    let arr = [null, null, null, null, null, null, null, null, null, null,
        null, "北京", "天津", "河北", "山西", "内蒙古", null, null, null, null, null,
        "辽宁", "吉林", "黑龙江", null, null, null, null, null, null, null, "上海",
        "江苏", "浙江", "安微", "福建", "江西", "山东", null, null, null, "河南", "湖北",
        "湖南", "广东", "广西", "海南", null, null, null, "重庆", "四川", "贵州", "云南",
        "西藏", null, null, null, null, null, null, "陕西", "甘肃", "青海", "宁夏",
        "新疆", null, null, null, null, null, "台湾", null, null, null, null,
        null, null, null, null, null, "香港", "澳门", null, null, null, null,
        null, null, null, null, "国外"];
    let isid = tlv8.checkId(id);
    if (isid !== "true" && isid)
        return ["错误的身份证号码"];
    id = String(id);
    let prov = arr[id.slice(0, 2)];
    let sex = id.slice(14, 17) % 2 ? "男" : "女";
    let birthday = new Date(parseInt(id.slice(6, 10)), id.slice(10, 12) - 1, parseInt(id.slice(12, 14))).format('yyyy-MM-dd');
    return [prov, birthday, sex];
};

/*
 * 检查身份证号是否合法
 */
tlv8.checkId = function (pId) {
    let arrVerifyCode = [1, 0, "x", 9, 8, 7, 6, 5, 4, 3, 2];
    let Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    //let Checker = [1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1];
    let result = "";
    if (pId.length !== 15 && pId.length !== 18)
        result += "身份证号共有 15 码或18位";
    let Ai = pId.length === 18 ? pId.substring(0, 17) : pId.slice(0, 6) + "19"
        + pId.slice(6, 16);
    if (!/^\d+$/.test(Ai))
        result += "身份证除最后一位外，必须为数字！";
    let yyyy = parseInt(Ai.slice(6, 10)), mm = parseInt(Ai.slice(10, 12)) - 1, dd = parseInt(Ai.slice(12, 14));
    let d = new Date(yyyy, mm, dd), now = new Date();
    let year = d.getFullYear(), mon = d.getMonth(), day = d.getDate();
    if (year !== yyyy || mon !== mm || day !== dd || d > now || year < 1940)
        result += "身份证输入错误！";
    let ret = 0;
    for (let i = 0; i < 17; i++)
        ret += Ai.charAt(i) * Wi[i];
    Ai += arrVerifyCode[ret % 11];
    if (!result || result === "")
        return "true";
    return pId === (Ai) ? "true" : result;
};
/*
 * 手机号格式验证
 */
tlv8.Telephone = function (date) {
    let filter = /(\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$/;
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
    let date = justep.System.datetime();
    let createweek = starttime.getDay();
    let num = justep.Date.diff(starttime, date, 'd');
    let weekwork = 0;
    let holiday = Math.round(num / 7) * 2;
    if (num > 7) {
        weekwork = num - holiday;
    } else {
        let week = date.getDay();
        if (week === 6) {
            weekwork = num - 1;
        } else if (weekwork - createweek <= 0 && num !== 0) {
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
        let param = new tlv8.RequestParam();
        let r = tlv8.XMLHttpRequest("/getSystemDate", param, "post", false,
            null, true);
        let rdate = tlv8.System.Date.strToDate(r.sysdate);
        return rdate.format("yyyy-MM-dd");
    },
    /**
     * @name tlv8.System.Date.sysDateTime
     * @description 获取服务时间（日期时间）
     * @returns {string}
     */
    sysDateTime: function () {
        let param = new tlv8.RequestParam();
        let r = tlv8.XMLHttpRequest("/getSystemDateTime", param, "post",
            false, null, true);
        return r.sysdate;
    },
    /**
     * @name tlv8.System.Date.strToDate
     * @description 日期字符串转日期对象
     * @param str {string}
     * @returns {Date}
     */
    strToDate: function (str) {
        if (!str || str === "" || str.indexOf("-") < 0) {
            return;
        }
        str = trim(str);
        let val = str.split(" ");
        let newDate;
        if (val.length > 1) {
            let sdate = val[0].split("-");
            let sTime = val[1].split(":");
            newDate = new Date(sdate[0], sdate[1] - 1, sdate[2], sTime[0],
                sTime[1], sTime[2]);
        } else {
            let sdate = val[0].split("-");
            newDate = new Date(sdate[0], sdate[1] - 1, sdate[2]);
        }
        return newDate;
    }
};
let $dpjspath = null;
let scripts = document.getElementsByTagName("script");
for (let i = 0; i < scripts.length; i++) {
    if (scripts[i].src.substring(scripts[i].src.length - 7).toLowerCase() === 'main.js') {
        $dpjspath = scripts[i].src.substring(0, scripts[i].src.length - 7);
        break;
    }
}
const $dpcsspath = $dpjspath ? $dpjspath.replace("/js/", "/css/") : null;
const $dpimgpath = $dpjspath ? $dpjspath.replace("/js/", "/image/") : null;
/*
 * 添加JS引用
 */
const createJSSheet = function (jsPath) {
    let head = document.getElementsByTagName('HEAD')[0];
    let script = document.createElement('script');
    script.src = jsPath;
    script.type = 'text/javascript';
    $(script).attr("charset", 'utf-8');
    head.appendChild(script);
};
/*
 * 添加CSS引用
 */
const createStyleSheet = function (cssPath) {
    let head = document.getElementsByTagName('HEAD')[0];
    let style = document.createElement('link');
    style.href = cssPath;
    style.rel = 'stylesheet';
    style.type = 'text/css';
    head.appendChild(style);
};
/*
 * 检查引用文件是否已存在
 */
const checkPathisHave = function (path) {
    let Hhead = document.getElementsByTagName('HEAD')[0];
    let Hscript = Hhead.getElementsByTagName("SCRIPT");
    for (let i = 0; i < Hscript.length; i++) {
        if (Hscript[i].src === path)
            return true;
    }
    let Hstyle = Hhead.getElementsByTagName("LINK");
    for (let i = 0; i < Hstyle.length; i++) {
        if (Hstyle[i].href === path)
            return true;
    }
    return false;
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
    let dg = new Date(1582, 10, 15, 0, 0, 0, 0);
    let dc = new Date();
    let t = dc.getTime() - dg.getTime();
    let tl = UUID.getIntegerBits(t, 0, 31);
    let tm = UUID.getIntegerBits(t, 32, 47);
    let thv = UUID.getIntegerBits(t, 48, 59) + '1';
    let csar = UUID.getIntegerBits(UUID.rand(4095), 0, 7);
    let csl = UUID.getIntegerBits(UUID.rand(4095), 0, 7);
    let n = UUID.getIntegerBits(UUID.rand(8191), 0, 7)
        + UUID.getIntegerBits(UUID.rand(8191), 8, 15)
        + UUID.getIntegerBits(UUID.rand(8191), 0, 7)
        + UUID.getIntegerBits(UUID.rand(8191), 8, 15)
        + UUID.getIntegerBits(UUID.rand(8191), 0, 15);
    return tl + tm + thv + csar + csl + n;
};
UUID.getIntegerBits = function (val, start, end) {
    let base16 = UUID.returnBase(val, 16);
    let quadArray = [];
    let quadString = '';
    let i = 0;
    for (i = 0; i < base16.length; i++) {
        quadArray.push(base16.substring(i, i + 1));
    }
    for (i = Math.floor(start / 4); i <= Math.floor(end / 4); i++) {
        if (!quadArray[i] || quadArray[i] === '')
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
    let srcPath = tlv8.getRequestURI();
    let url = "/comon/report/import-compent";
    url += "?srcPath=" + srcPath;
    url += "&dbkey=" + dbkey;
    url += "&table=" + table;
    url += "&relation=" + relation;
    url += "&confirmXmlName=" + confirmXmlName;
    tlv8.portal.dailog.openDailog('Excel导入', url, 350, 350, callback,
        false);
};

tlv8.ExcelExp = function (dbkey, table, relation, labels, where, orderby) {
    let srcPath = tlv8.getRequestURI();
    let url = "/comon/report/export-compent";
    let params = {
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
        let $rval = str.toString().replaceAll("<", "#lt;");
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
        let sValue = str.toString().replaceAll("#160;", "&nbsp;");
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
                               candelete, canedit, viewhistory, limit, download, accept) {
    if (!div || !data || !cellname)
        return;
    if (typeof div == "string") {
        div = J$(div);
    }
    $(div).html("");//每次创建重新初始化
    let transJson = function (str) {
        str = str.toString().replaceAll(":", ":\"");
        str = str.toString().replaceAll(",", "\",");
        str = str.toString().replaceAll("}", "\"}");
        str = str.toString().replaceAll("}{", "},{");
        str = str.toString().replaceAll(";", "\",");
        return eval("([" + str + "])");
    };
    let loadFiles = function () {
        let file_list = [];
        $.ajax({
            url: "/system/doc/file/cell/view/",
            method: "post",
            data: {tablename: data.table, cellname: cellname, rowid: data.rowid},
            dataType: "json",
            async: false,
            success: function (r) {
                try {
                    file_list = JSON.parse(r.data);
                } catch (e) {
                    try {
                        file_list = JSON.parse(transJson(r.data));
                    } catch (er) {
                        file_list = [];
                    }
                }
            }
        });
        return file_list;
    };
    let file_list = loadFiles();
    let upload_btn = new UUID().toString();
    this.buildUploader = function () {
        layui.upload.render({
            elem: '#' + upload_btn
            , url: '/system/doc/docCenter/uploadFile'
            , data: {docPath: docPath || "/root", tablename: data.table, cellname: cellname, rowid: data.rowid}
            , accept: accept || 'file'
            , multiple: (limit && limit > 1)
            , size: 1024 * 1024 * 100 //限定大小100M
            , before: function (obj) {
                if (!data.rowid || data.rowid === "") {
                    layui.layer.alert("请先保存数据~");
                    return false;
                }
                layui.layer.load();
            }
            , done: function (res) {
                layui.layer.closeAll('loading');
                if (res.code === 0) {
                    layui.layer.msg("上传成功~");
                    loadFileList();
                    try {
                        //上传完成回调
                        let onuploaded = $(div).attr("onuploaded");
                        if (onuploaded && onuploaded !== "") {
                            let upcallback = window.eval(onuploaded);
                            upcallback(res.data);
                        }
                    } catch (e) {
                    }
                } else {
                    layui.layer.alert("上传失败！");
                }
            }
        });
    };
    if (canupload && ((limit && limit > file_list.length) || !limit)) {
        $(div).append('<button type="button" class="layui-btn" id="' + upload_btn + '">' +
            '  <i class="layui-icon">&#xe67c;</i>上传' +
            '</button>');
        if (!data.rowid || data.rowid === "") {
            $("#" + upload_btn).click(function () {
                layui.layer.alert("请先保存数据~");
            });
        } else {
            this.buildUploader();
        }
    }
    let listID = div.id + "_fileList";
    $(div).append('<div id="' + listID + '"></div>');
    let loadFileList = function (file_list) {
        if (!file_list) {
            file_list = loadFiles();
        }
        let tt = [];
        tt.push('<table class="layui-table">');
        for (let i = 0; i < file_list.length; i++) {
            tt.push('<tr>');
            tt.push('<td><a style="color: green;" href="javascript:tlv8.viewFile(\'' + file_list[i].fileID + '\',\'' + file_list[i].fileName + '\');">' + file_list[i].fileName + '</a></td>');
            if (canedit) {
                tt.push('<td width="100px"><a style="color: blue;" href="javascript:tlv8.trangereditfile(\'' + file_list[i].fileID + '\',\'' + file_list[i].fileName + '\');">编辑</a></td>');
            }
            if (candelete) {
                tt.push('<td width="100px"><a style="color: red;" class="file_list_del" href="javascript:void();" fileID="' + file_list[i].fileID + '" fileName="' + file_list[i].fileName + '">删除</a></td>');
            }
            if (viewhistory) {
                tt.push('<td width="100px"><a style="color: #555555;" href="javascript:tlv8.viewFileHistory(\'' + file_list[i].fileID + '\',\'' + file_list[i].fileName + '\');">历史</a></td>');
            }
            tt.push('</tr>');
        }
        tt.push('</table>');
        $('#' + listID).html(tt.join(" "));
        $(".file_list_del").click(function () {
            tlv8.deleteFile($(this).attr("fileID"), $(this).attr("fileName"), data.table, cellname, data.rowid, function (r) {
                loadFileList();//重新加载文件列表
            });
        });
    }
    loadFileList(file_list);
    this.loadFiles = loadFiles;
    this.loadFileList = loadFileList;
};

/**
 * office、wps文件在线编辑
 * @param fileID
 * @param fileName
 */
tlv8.trangereditfile = function (fileID, fileName) {
    if ('.doc.docx.xls.xlsx.ppt.pptx.mpp.vsd.dps.wps.et.'
        .indexOf(String(/\.[^.]+$/.exec(fileName)) + '.') < 0) {
        alert("不支持非Office文件在线编辑");
        return;
    }
    let url = "/system/doc/wps/fileEditor?option=edit&fileID=" + fileID;
    window.open(url);
};

/**
 * 查看文件
 * @param fileID
 * @param fileName
 */
tlv8.viewFile = function (fileID, fileName) {
    if ('.wma.wmv.'.indexOf(String(/\.[^.]+$/.exec(fileName.toLowerCase())) + '.') > -1) {
        let audioData = "/system/doc/file/" + fileID + "/view/";
        layui.layer.close(tlv8.audioIndex);
        tlv8.audioIndex = layui.layer.open({
            type: 1,
            title: '在线播放:' + fileName,
            area: ['400px', '300px'],
            maxmin: false,
            content: '<div style="height: 100%; overflow: hidden;"><object id="mplayer" align="baseline" border="0" width="100%" height="100%" classid="CLSID:22d6f312-b0f6-11d0-94ab-0080c74c7e95" codebase="http://activex.microsoft.com/activex/controls/mplayer/en/nsmp2inf.cab#Version=6,4,5,715" type="application/x-oleobject">\n' +
                '<param name="FileName" value="' + audioData + '"><param name="ShowControls" value="1"><param name="ShowPositionControls" value="0"><param name="ShowAudioControls" value="1"><param name="ShowTracker" value="1"><param name="ShowDisplay" value="0"><param name="ShowStatusBar" value="1"><param name="AutoSize" value="0"><param name="ShowGotoBar" value="0"><param name="ShowCaptioning" value="0"><param name="EnableContextMenu" value="1"><param name="InvokeURLs" value="1"><param name="DefaultFrame" value="datawindow">' +
                '<embed src="' + audioData + '" align="baseline" border="0" width="100%" height="100%" type="application/x-mplayer2" pluginspage="http://www.microsoft.com/isapi/redir.dll?prd=windows& sbp=mediaplayer&ar=media&sba=plugin&" name="MediaPlayer" showcontrols="1" showpositioncontrols="0" showaudiocontrols="1" showtracker="1" showdisplay="0" showstatusbar="1" showgotobar="0" showcaptioning="0" animationatstart="0" transparentatstart="0" allowscan="1" enablecontextmenu="1" clicktoplay="0" invokeurls="1" defaultframe="datawindow">你的浏览器不支持在线播放，请下载播放~</embed></object></div>'
        });
        return;
    } else if ('.mp3.ogg.wav.'.indexOf(String(/\.[^.]+$/.exec(fileName.toLowerCase())) + '.') > -1) {
        let audioData = "/system/doc/file/" + fileID + "/view/";
        layui.layer.close(tlv8.audioIndex);
        tlv8.audioIndex = layui.layer.open({
            type: 1,
            title: '播放音频:' + fileName,
            area: ['400px', '100px'],
            maxmin: false,
            content: '<div style="height: 100%; overflow: hidden;"><audio style="width:100%;height:100%;" autoplay="autoplay" controls><source src="' + audioData + '">你的浏览器不支持音频播放，请下载播放~</audio></div>'
        });
        return;
    } else if ('.mp4.mp5.avi.rm.rmvb.mkv.'.indexOf(String(/\.[^.]+$/.exec(fileName.toLowerCase())) + '.') > -1) {
        let videoData = "/system/doc/file/" + fileID + "/view/";
        layui.layer.close(tlv8.videoIndex);
        tlv8.videoIndex = layui.layer.open({
            type: 1,
            title: '播放视频:' + fileName,
            area: ['600px', '400px'],
            maxmin: true,
            content: '<div style="background-color: #000; height: 100%;"><video style="position: absolute; width: 100%; height: 100%;" src="' + videoData + '" loop="loop" autoplay="autoplay" controls="controls">你的浏览器不支持视频查看，请下载查看~</video></div>'
        });
        return;
    } else if ('.jpg.jpeg.png.git.bmp.'.indexOf(String(/\.[^.]+$/.exec(fileName.toLowerCase())) + '.') > -1) {
        layui.layer.close(tlv8.photosIndex);
        layui.layer.photos({
            photos: {
                data: [{
                    "alt": fileName,
                    "src": "/system/doc/file/" + fileID + "/view/"
                }]
            }
            , shade: 0.01
            , closeBtn: 2
            , anim: 0
            , resize: false
            , success: function (layero, index) {
                tlv8.photosIndex = index;
            }
        });
        return;
    } else if ('.pdf.'.indexOf(String(/\.[^.]+$/.exec(fileName.toLowerCase())) + '.') > -1) {
        let url = "/system/doc/pdf/fileBrowser?fileID=" + fileID;
        window.open(url);
        return;
    } else if ('.doc.docx.xls.xlsx.ppt.pptx.mpp.vsd.dps.wps.et.'
        .indexOf(String(/\.[^.]+$/.exec(fileName)) + '.') < 0) {
        layui.layer.confirm("文件不支持在线查看，请下载查看~", function () {
            tlv8.downloadFile(fileID);
        });
        return;
    }
    let url = "/system/doc/wps/fileEditor?option=view&fileID=" + fileID;
    window.open(url);
};

/**
 * 文件下载
 * @param fileID
 */
tlv8.downloadFile = function (fileID) {
    let url = "/system/doc/file/" + fileID + "/download?t=" + new Date().getTime();
    window.open(url, "_download");
};

/**
 * 删除文件
 * @param fileID
 * @param fileName
 */
tlv8.deleteFile = function (fileID, fileName, tableName, cellName, rowid, callback) {
    layui.layer.confirm("确定删除文件[" + fileName + "]吗？", function () {
        layui.layer.closeAll();
        $.ajax({
            url: "/system/doc/file/cell/delete/",
            method: "post",
            data: {tablename: tableName, cellname: cellName, rowid: rowid, fileID: fileID},
            dataType: "json",
            async: false,
            success: function (r) {
                if (callback) {
                    callback(r);
                }
            }
        });
    });
};

/**
 * 查看文件编辑历史
 * @param fileID
 * @param fileName
 */
tlv8.viewFileHistory = function (fileID, fileName) {

};


function Confirm(msg, okcallFn, cancelcallFn) {
    layui.layer.confirm(msg, okcallFn, cancelcallFn);
}

tlv8.isHaveAuthorization = function (url) {
    let orgFID = tlv8.Context.getCurrentPersonFID();
    let param = new tlv8.RequestParam();
    param.set("orgFID", orgFID);
    param.set("url", url);
    let callBackfn = function (r) {
        if (r.data.flag === "false") {
            alert(r.data.message);
        } else {
            return r.data.data === "true";
        }
    };
    let r = tlv8.XMLHttpRequest("HaveFunctionAuthority", param, "get",
        false, callBackfn);
    if (r.data.flag === "false") {
        alert(r.data.message);
    } else {
        return r.data.data === "true";
    }
};
tlv8.isIE6 = function () {
    if (window.ActiveXObject) {
        let ua = navigator.userAgent.toLowerCase();
        let ie = ua.match(/msie ([\d.]+)/)[1];
        if (parseFloat(ie) === 6.0) {
            return true;
        }
    }
    return false;
};
tlv8.islowIE10 = function () {
    if (window.ActiveXObject) {
        let ua = navigator.userAgent.toLowerCase();
        let ie = ua.match(/msie ([\d.]+)/)[1];
        if (parseInt(ie) < 10) {
            return true;
        }
    }
    return false;
};
tlv8.isIE = function () { // ie?
    return !!window.ActiveXObject || "ActiveXObject" in window;
}

/**
 * @des 显示loading信息 模式
 * @param state[true/false]
 * @param msg
 *            提示信息
 */
tlv8.showModelState = function (state, msg) {
    if (state && state === true) {
        tlv8.loadindex = layui.layer.load(2);
    } else {
        if (tlv8.loadindex) {
            layui.layer.close(tlv8.loadindex);
            delete tlv8.loadindex;
        }
    }
};
tlv8.DateAdd = function (strInterval, date, Number) {
    let dtTmp = date;
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
    if (navigator.appVersion.match(/6./i) === "6.") {
        return "IE6";
    } else if (navigator.appVersion.match(/7./i) === "7.") {
        return "IE7";
    } else if (navigator.appVersion.match(/8./i) === "8.") {
        return "IE8";
    } else if (navigator.appVersion.match(/9./i) === "9.") {
        return "IE9";
    }
    return "Other";
}

// 填写审批意见
tlv8.writeOpinion = function (view) {
    let taptt = tlv8.RequestURLParam.getParam("activity-pattern");
    let isTasksub = (taptt === "detail");
    if (isTasksub) {
        alert("已办任务不能再填写意见!");
        return;
    }
    let sData1 = tlv8.RequestURLParam.getParam("sData1");
    let flowID = tlv8.RequestURLParam.getParam("flowID");
    let taskID = tlv8.RequestURLParam.getParam("taskID");
    let url = "/flw/flwcommo/flowDialog/processAudit.html";
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
    let param = new tlv8.RequestParam();
    param.set("fbillID", sData1);
    param.set("fopviewID", viewID);
    let re = tlv8.XMLHttpRequest("LoadAuditOpinionAction", param, "POST", false);
    let redata = re.data.data;
    try {
        redata = window.eval("(" + redata + ")");
    } catch (e) {
    }
    let viewHTml = "<ul style='width:100%;font-size:14px;display: block;overflow:hidden;'>";
    for (let i = 0; i < redata.length; i++) {
        let opinion = redata[i].FAGREETEXT;
        let writeDate = redata[i].FCREATETIME;
        let personid = redata[i].FCREATEPERID;
        let personname = redata[i].FCREATEPERNAME;
        let psign = redata[i].FSIGN;
        if (writeDate && writeDate !== "") {
            writeDate = tlv8.System.Date.strToDate(writeDate);
            writeDate = writeDate.format("yyyy-MM-dd HH:mm");
        }
        let hdws = viewID + "_handwrite";
        if (psign && psign !== "") {
            writpsm = '<img src="data:image/png;base64,' + psign + '" style="height:30px;">&nbsp;&nbsp;';
        } else {
            let param1 = new tlv8.RequestParam();
            param1.set("personid", personid);
            let pcre = tlv8.XMLHttpRequest("LoadAuditOpinionAction", param1, "POST", false);
            let picID = "";
            if (pcre.data.length > 0) {
                picID = pcre.data[0].SID;
            }
            let url = cpath + "/common/picCompact/Pic-read?dbkey=sa"
                + "&tablename=sa_handwr_signature&cellname=shspic&fID=" + picID
                + "&Temp=" + new UUID().toString();
            let image = "<img src='" + url + "' style='width:100px;;height:30px;'></img>";
            let writpsm = personname;
            if (picID && picID !== "") {
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
    let oph = redata.length * 30 + 30;
    let view = $("#" + viewID);
    view.css("width", "100%");
    view.css("min-height", oph + "px");
    view.html(viewHTml);
    if (view.parent().height() < view.height()) {
        view.parent().height(view.height() + 10);
    }
};

// 禁止回退键“返回”页面
function disbackspace() {
    $("body")
        .bind(
            "keydown",
            function (event) {
                event = event || window.event;
                let elem = event.srcElement ? event.srcElement
                    : event.target;
                if (event.keyCode === 8) {
                    let name = elem.nodeName;
                    if (name !== 'INPUT' && name !== 'TEXTAREA') {
                        if (event.preventDefault) {
                            event.preventDefault();
                        } else {
                            event.returnValue = false;
                        }
                        return false;
                    }
                    let type_e = elem.type.toUpperCase();
                    if (name === 'INPUT'
                        && (type_e !== 'TEXT'
                            && type_e !== 'TEXTAREA'
                            && type_e !== 'PASSWORD' && type_e !== 'FILE')) {
                        if (event.preventDefault) {
                            event.preventDefault();
                        } else {
                            event.returnValue = false;
                        }
                        return false;
                    }
                    if (name === 'INPUT'
                        && (elem.readOnly === true || elem.disabled === true)) {
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
    let aDate, oDate1, oDate2, iDays;
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
        let defaults = {
            editable: false,
            valueField: "id",
            textField: "text",
            method: "get"
        };
        let opts = $.extend(defaults, options);
        let _this = $(this);
        let optiondata;
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
                error: function (errorcode) {
                    if (opts.onLoadError && typeof opts.onLoadError == "function") {
                        opts.onLoadError(errorcode);
                    }
                }
            });
        }
        let selectob;
        if (this.tagName === "SELECT") {
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
            for (let o = 0; o < optiondata.length; o++) {
                let opdata = optiondata[o];
                let op = $("<option></option>");
                op.attr("value", opdata[opts.valueField]);
                if (opts.textField.indexOf(",") < 0) {
                    op.text(opdata[opts.textField]);
                } else {
                    let tfields = opts.textField.split(",");
                    let optexts = [];
                    for (let t = 0; t < tfields.length; t++) {
                        let field = tfields[t];
                        optexts.push(opdata[field]);
                    }
                    op.text(optexts.join(" "));
                }
                for (let pk in opdata) {
                    op.attr(pk, opdata[pk]);
                }
                selectob.append(op);
                op.get(0).rec = opdata;
            }
        }
        selectob.change(function () {
            let selop = $(this).children('option:selected');
            let selopob = selop.get(0);
            if (opts.onSelect && typeof opts.onSelect == "function") {
                opts.onSelect(selopob.rec, selopob);
            }
        });
    };
})(jQuery);

