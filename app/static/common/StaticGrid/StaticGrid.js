/*-------------------------------------------------------------------------------*\
|  Subject:  静态grid 支持json数据
|  Author:   ChenQian
 * CopyRight: www.tlv8.com
|  Created:  2012-6-11
|  Version:  v1.1.1
\*-------------------------------------------------------------------------------*/

/*
 * 静态grid
 * 支持json数据 
 * @param {Object} divDom
 */
var StaticGrid = function (divDom) {
    if (!divDom || divDom === "" || divDom === "undefined") {
        alert("new StaticGrid 异常.m:divDom参数不能为空!");
        return false;
    }
    if (typeof divDom == "string") {
        divDom = document.getElementById(divDom);
    }
    divDom.StaticGrid = this;
    this.Dom = divDom;
    this.id = this.Dom.id;
    this.LabArray;
    this.element;
    this.data = new Array();
    this.selectedRow;
    this.rowDbclick;
};

/*
 * 初始化 @param {Object} LabArray
 * 例如：[{id:'fCode',name:'编码',width:60},{id:'fName',name:'名称',width:60}]
 */
StaticGrid.prototype.init = function (LabArray) {
    if (!LabArray || LabArray === "" || LabArray === "undefined") {
        alert("初始化时,参数不能为空!");
        return false;
    }
    if (typeof LabArray == "string") {
        LabArray = eval("(" + LabArray + ")");
    }
    this.LabArray = LabArray;
    this.Dom.style.overflow = "auto";
//	this.Dom.style.border = "1px solid #ddd";
    this.Dom.style.cursor = "default";
    var gridTable = "<table id='" + this.id
        + "_Table' class='grid' width='100%'>";
    gridTable += "<tr class='scrollColThead' id='" + this.id + "_title_tr'>";
    for (var i = 0; i < LabArray.length; i++) {
        var celom = LabArray[i];
        var display = "";
        if (celom.width === 0) {
            display = "display:none;";
        }
        gridTable += "<td id='" + celom.id + "' width='" + celom.width
            + "px' class='grid_label' title='" + celom.name + "' style='"
            + display + "'>" + celom.name + "</td>";
    }
    gridTable += "<td></td></tr></table>";
    this.Dom.innerHTML = gridTable;
    this.initTable(document.getElementById(this.id + "_title_tr"));
};

/*
 * 初始化数据 @param {Object} json
 * TD:[{rowid:'xinhua',fCode:'zhangsan',fName:'张三'},{rowid:'xhege',fCode:'lisi',fName:'李四'}]
 */
StaticGrid.prototype.initData = function (json) {
    this.clearData();
    if (!json) {
        return true;
    } else {
        if (typeof json == "string") {
            json = eval("(" + json + ")");
        }
        for (var i = 0; i < json.length; i++) {
            this.addData(json[i]);
        }
    }
    this.data = json;
    try {
        this.element.rows[0].click();
    } catch (e) {
    }
};

/*
 * 清除数据
 */
StaticGrid.prototype.clearData = function () {
    if (!this.LabArray) {
        alert("未初始化!");
    } else {
        this.init(this.LabArray);
    }
    this.data = [];
};

/*
 * 添加数据 @param {Object} json TD. {rowid:'dd',fCode:'test',fName:'测试'}
 */
StaticGrid.prototype.addData = function (json) {
    if (typeof json == "string") {
        json = eval("(" + json + ")");
    }
    var newDatatr = document.createElement("tr");
    newDatatr.setAttribute("id", json.rowid);
    for (var i in this.LabArray) {
        var k = this.LabArray[i].id;
        var display = "";
        if (this.LabArray[i].width == 0) {
            display = "none";
        }
        var col = document.createElement("td");
        col.setAttribute("id", json[k]);
        col.innerHTML = this.transeValue(json[k]);
        col.title = json[k];
        col.className = "grid_td";
        try {
            $(col).css("display", display);
        } catch (e) {
        }
        newDatatr.appendChild(col);
    }
    try {
        this.element.childNodes[0].appendChild(newDatatr);
        this.data.push(json);
    } catch (e) {
        alert("StaticGrid添加数据失败!m:" + e.message);
    }
    this.colour();
};

/*
 * 删除数据 @param {Object} rowid
 */
StaticGrid.prototype.removeData = function (rowid) {
    if (!rowid) {
        alert("rowid不能为空");
        return;
    }
    let rows = this.element.rows;
    for (let i = 1; i < rows.length; i++) {
        if (rows[i].id === rowid) {
            try {
                rows[i].parentNode.removeChild(rows[i]);
            } catch (e) {
                alert("removeData m:" + e.message);
            }
        }
    }
    for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].rowid === rowid) {
            this.data.splice(i, 1);
        }
    }
    this.colour();// 重新着色
};

/*
 * 获取值 @param {Object} rowid @param {Object} column @memberOf {TypeName} @return
 * {TypeName}
 */
StaticGrid.prototype.getValue = function (rowid, column) {
    for (var i = 0; i < this.data.length; i++) {
        if (this.data[i].rowid === rowid) {
            return this.data[i][column];
        }
    }
};

/*
 * 赋值 @param {Object} rowid @param {Object} column @param {Object} nvalue
 * @memberOf {TypeName}
 */
StaticGrid.prototype.setValue = function (rowid, column, nvalue) {
    for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].rowid === rowid) {
            this.data[i][column] = nvalue;
        }
    }
    let rows = this.element.rows;
    for (let i = 1; i < rows.length; i++) {
        if (rows[i].id === rowid) {
            let cells = rows[0].cells;
            for (let j = 0; j < cells.length; j++) {
                if (cells[j].id === column) {
                    rows[i].cells[j].id = nvalue;
                    rows[i].cells[j].innerHTML = this.transeValue(nvalue);
                    rows[i].cells[j].title = nvalue;
                    break;
                }
            }
            break;
        }
    }
};

StaticGrid.prototype.transeValue = function (svalue) {
    return "<div style='width:100%;height:22px;overflow:hidden;'>" + svalue + "";
};

/*
 * 数据行着色{斑马条}
 */
StaticGrid.prototype.colour = function () {
    let rows = this.element.rows;
    for (let i = 1; i < rows.length; i++) {
        if (i % 2 === 0) {
            rows[i].className = 't2';
        } else {
            rows[i].className = 't1';
        }
        let Docum = this;
        rows[i].onclick = function () {
            if (Docum.selectedRow) {
                Docum.selectedRow.className = Docum.tempClass;
            }
            Docum.tempClass = this.className;
            Docum.selectedRow = this;
            this.className = "t3";
            this.selectedRow = this.id;
        };
        if (this.rowDbclick) {
            rows[i].ondblclick = function () {
                Docum.rowDbclick(this);
            };
        }
    }
};

/*
 * 设置行背景 @param {Object} rowid @param {Object} backG
 */
StaticGrid.prototype.setRowBackGround = function (rowid, backG) {
    let rowObj = this.getRowObjById(rowid);
    try {
        rowObj.className = "";
        rowObj.style.background = backG;
    } catch (e) {
    }
};

/*
 * 设置行双击动作 @param {Object} fn @memberOf {TypeName}
 */
StaticGrid.prototype.setRowDbclick = function (fn) {
    this.rowDbclick = fn;
    let rows = this.element.rows;
    for (let i = 1; i < rows.length; i++) {
        rows[i].ondblclick = function () {
            fn(this);
        };
    }
};

/*
 * 设置编辑状态 @param {Object} click{dbclick:跟双击行事件会有冲突}
 */
StaticGrid.prototype.setEditMode = function (click) {
    var rows = this.element.rows;
    for (var i = 1; i < rows.length; i++) {
        var cells = rows[i].cells;
        for (var j = 0; j < cells.length; j++) {
            var gridObj = this.Dom.StaticGrid;
            if (click === "dbclick") {
                cells[j].ondblclick = function () {
                    gridObj.Edit(this);
                };
            } else {
                if (click)
                    cells[j].onclick = function () {
                        gridObj.Edit(this);
                    };
                else
                    cells[j].onclick = null;
            }
        }
    }
};

/*
 * 编辑 @param {Object} obj
 */
StaticGrid.prototype.Edit = function (obj) {
    if (obj.childNodes && obj.childNodes[0].tagName === "INPUT") {
        return;
    }
    let ovalue = obj.innerHTML;
    let Einput = document.createElement("input");
    Einput.type = "text";
    Einput.style.width = "100%";
    Einput.value = ovalue;
    obj.innerHTML = "";
    obj.appendChild(Einput);
    let gridObj = this.Dom.StaticGrid;
    Einput.onblur = function () {
        gridObj.Edited(Einput, obj);
    };
    Einput.focus();
};

/*
 * 根据rowid获取行Obj{Element} @param {Object} rId @memberOf {TypeName} @return
 * {TypeName}
 */
StaticGrid.prototype.getRowObjById = function (rId) {
    let rows = this.element.rows;
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].id === rId) {
            return rows[i];
        }
    }
};

/*
 * 编辑完成 @param {Object} ipt @param {Object} obj
 */
StaticGrid.prototype.Edited = function (ipt, obj) {
    try {
        let nvalue = ipt.value;
        let column = this.element.rows[0].cells[obj.cellIndex].id;
        let rowid = obj.parentNode.id;
        this.setValue(rowid, column, nvalue);
    } catch (e) {
        alert("编辑失败! m:" + e.message);
    }
};

/*
 * 获取位置 @memberOf {TypeName} @return {TypeName}
 */
StaticGrid.prototype.getScrollWed = function () {
    return [this.Dom.scrollLeft, this.Dom.scrollTop];
};

/*
 * 定位(grid滚动条) @param {Object} ar @memberOf {TypeName} [scrollLeft,scrollTop]
 */
StaticGrid.prototype.setScrollWed = function (ar) {
    try {
        this.Dom.scrollLeft = ar[0];
        this.Dom.scrollTop = ar[1];
    } catch (e) {
    }
};

/*
 * 选中指定行{行ID} @param {Object} rId
 */
StaticGrid.prototype.selectRowById = function (rId) {
    let cuRow = this.getRowObjById(rId);
    try {
        cuRow.click();
    } catch (e) {
    }
};

/*
 * 检查rowid是否已存在 @param {string} rowid @return {boolean}
 */
StaticGrid.prototype.checkRowId = function (rowid) {
    let rows = this.element.rows;
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].id == rowid) {
            return true;
        }
    }
    return false;
};

/*
 * 获取所有行的ID @return {string} 符号','分割 {rowid不允许出现英文逗号 }
 */
StaticGrid.prototype.getRowIds = function () {
    if (this.data.length === 0)
        return "";
    let reStr = "";
    for (let i = 0; i < this.data.length; i++) {
        if (i > 0)
            reStr += "," + this.data[i].rowid;
        else
            reStr += this.data[i].rowid;
    }
    return reStr;
};

/*
 * 将数据转换成 字符型 有利于数据提交之类 @return {String}
 */
StaticGrid.prototype.dataToString = function () {
    if (this.data.length === 0)
        return "";
    let reStr = "[";
    for (let i = 0; i < this.data.length; i++) {
        if (i > 0)
            reStr += ",{";
        else
            reStr += "{";
        let lineData = this.data[i];
        let s = 0;
        for (let k in lineData) {
            if (s > 0)
                reStr += ",\"" + k + "\":\"" + lineData[k] + "\"";
            else
                reStr += "\"" + k + "\":\"" + lineData[k] + "\"";
            s++;
        }
        reStr += "}";
    }
    reStr += "]";
    return reStr;
};

// =================================拖拽操作begin=============================================\\
StaticGrid.prototype.initTable = function (_tr) {
    this.element = document.getElementById(this.id + "_Table");
    var _line = window.document.createElement("DIV");
    _line.id = this.id + "_splitLine";
    _line.style.position = "absolute";
    _line.style.backgroundColor = "#c5c5c5";
    _line.style.width = 1;
    document.body.appendChild(_line);
    this.element.splitLine = _line;
    this.element.splitLine.style.display = "none";
    window.element = this.element;
    addEvent(_tr, "mousedown", this.fnMousedown, false);
    addEvent(_tr, "mousemove", this.fnMousemove, false);
    addEvent(_tr, "selectstart", fnCancel, false);
    addEvent(window, "mouseup", this.fnMouseup, false);
    addEvent(window, "mousemove", this.fnMouseMove, false);
};
StaticGrid.prototype.fnMouseMove = function () {
    if (!element.splitlocked)
        return;
    StaticGrid.prototype.fnMousemove();
};
StaticGrid.prototype.fnMousemove = function (event) {
    event = event ? event : (window.event ? window.event : null);
    var oEl = event.srcElement ? event.srcElement : event.target;
    element.splitLine.style.left = mouseCoords(event).x;
    element.splitLine.style.top = getTop(element);
    element.splitLine.style.height = element.parentNode.clientHeight;
    if (element.splitlocked)
        return;
    if (!IfSplitLocation(event, oEl))
        return;
};
StaticGrid.prototype.fnMousedown = function (event) {
    addEvent(window.document, "mouseup", StaticGrid.prototype.fnMouseup, false);
    addEvent(window.document, "mousemove", StaticGrid.prototype.fnMouseMove,
        false);
    event = event ? event : (window.event ? window.event : null);
    var oEl = event.srcElement ? event.srcElement : event.target;
    var innerElement = oEl.innerHTML;
    if (oEl.tagName == "INPUT") {
        return;
    }
    if (IfSplitLocation(event, oEl)) {
        element.splitLine.style.display = "";
        element.splitlocked = true;
        element.style.cursor = 'col-resize';
        addEvent(window.document, "selectstart", fnCancel, true);
    }
};
StaticGrid.prototype.fnMouseup = function () {
    element.splitLine.style.display = "none";
    element.splitlocked = false;
    element.style.cursor = 'default';
    document.body.style.cursor = 'default';
    if (element.curResizeTD != null) {
        var otd = element.curResizeTD;
        var otdLeft = getLeft(otd);
        var cuLeft = parseInt(element.splitLine.style.left);
        cuLeft = cuLeft
            + otd.parentNode.parentNode.parentNode.parentNode.scrollLeft
            - otd.parentNode.parentNode.parentNode.parentNode.clientLeft;
        var otdwidth = cuLeft - otdLeft;
        if (otdwidth < 5)
            otdwidth = 5;// TODO： 拖拽不能小於5 拖太小会出现不固定宽度
        otd.style.width = otdwidth;
        removeEvent(window.document, "selectstart", fnCancel, true);
    }
};
var fnCancel = function (event) {
    event = event ? event : (window.event ? window.event : null);
    setReturnValueFalse(event);
    return false;
};

/*
 * 添加事件 @param {Object} elm @param {Object} evType @param {Object} fn @param
 * {Object} useCapture @return {TypeName}
 */
function addEvent(elm, evType, fn, useCapture) {
    try {
        elm['on' + evType] = fn;
    } catch (e) {
        if (elm.addEventListener) {
            elm.addEventListener(evType, fn, useCapture);
            return true;
        } else if (elm.attachEvent) {
            var r = elm.attachEvent('on' + evType, fn);
            return r;
        }
    }
}

/*
 * 移除事件 @param {Object} obj @param {Object} type @param {Object} fn @param
 * {Object} cap
 */
function removeEvent(obj, type, fn, cap) {
    var cap = cap || false;
    if (obj.removeEventListener) {
        obj.removeEventListener(type, fn, cap);
    } else {
        obj.detachEvent("on" + type, fn);
    }
}

/*
 * 获取鼠标位置 @param {Object} ev @return {TypeName}
 */
function mouseCoords(ev) {
    if (ev.pageX || ev.pageY) {
        return {
            x: ev.pageX,
            y: ev.pageY
        };
    }
    return {
        x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
        y: ev.clientY + document.body.scrollTop - document.body.clientTop
    };
}

function IfSplitLocation(event, oEl) {
    if (oEl.tagName === "DIV") {
        oEl = oEl.parentNode;
    }
    if (oEl.tagName === "TD") {
        let offelayerX = event.offsetX ? event.offsetX : event.layerX;
        if (!event.offsetX)
            offelayerX = offelayerX - getLeft(oEl);
        if (oEl.cellIndex < 0) {
            element.curResizeTD = null;
            document.body.style.cursor = 'default';
            element.style.cursor = 'default';
            return;
        } else if (Math.abs(offelayerX - oEl.clientWidth) <= 5) {
            element.curResizeTD = oEl;
            document.body.style.cursor = 'col-resize';
            element.style.cursor = 'col-resize';
        } else {
            element.curResizeTD = null;
            document.body.style.cursor = 'default';
            element.style.cursor = 'default';
            return false;
        }
    }
    return true;
}

function getTop(e) {
    let t = e.offsetTop;
    while (e = e.offsetParent) {
        t += e.offsetTop;
    }
    return t;
}

function getLeft(e) {
    let l = e.offsetLeft;
    while (e = e.offsetParent) {
        l += e.offsetLeft;
    }
    return l;
}

function setReturnValueFalse(event) {
    if (document.all) {
        window.event.returnValue = false;
    } else {
        event.preventDefault();
    }
}

// ================================拖拽操作end======================================================\\
try {
    var $rp = $dpjspath.replace("/common/js/", "/");
    if (!checkPathisHave($rp + "common/css/grid.css")) {
        createStyleSheet($rp + "common/css/grid.css");
    }
} catch (e) {
}