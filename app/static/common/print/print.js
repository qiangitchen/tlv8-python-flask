/**
 * 表单页面打印管理器.
 */
try {
    if (!tlv8) {
        tlv8 = {};
    }
} catch (e) {
    tlv8 = {};
}
tlv8.HtmlPrint = {
    settings: {popClose: true},
    /**
     * 获取要打印区域的html内容.
     */
    getHtml: function (formId) {
        var html = "";
        for (var i = 0; i < formId.length; i++) {
            html += $("<div></div>").append($("#" + formId[i]).clone()).html();
        }
        var self = this;
        var tmp = document.createElement('div');
        $(tmp).html(html);
        //self.transPrintForm(tmp);
        self.transHtml(tmp);
        html = $(tmp).html();
        return html;
    },

    getHead: function () {
        var head = "<head><title>" + this.settings.popTitle + "</title>";
        $(document)
            .find("link")
            .filter(function () {
                return $(this).attr("rel").toLowerCase() == "stylesheet";
            }).each(
            function () {
                head += '<link type="text/css" rel="stylesheet" href="' + $(
                    this).attr("href") + '" >';
            });
        head += "</head>";
        return head;
    },

    getActiveX: function (isPreview) {
        return (window.event && isPreview) ? "<OBJECT id=wb height=0 width=0 classid=CLSID:8856F961-340A-11D0-A96B-00C04FD705A2 name=wb></OBJECT>"
            : "";
    },

    /**
     * 打印表单.
     */
    printForm: function (formId, appendHtml, closeWin) {
        this.executePrintout(formId, appendHtml, closeWin, false);
    },
    /** 打印预览 * */
    printpreview: function (formId, appendHtml, closeWin) {
        this.executePrintout(formId, appendHtml, closeWin, true);
    },

    /** 执行打印输出 * */
    executePrintout: function (formId, appendHtml, closeWin, isPreview, options) {
        if (!formId) {
            layui.layer.alert("没有指定target-id");
            return;
        }
        var modes = {
            iframe: "iframe",
            popup: "popup"
        };
        var defaults = {
            mode: modes.popup,
            popHt: 500,
            popWd: 400,
            popX: 200,
            popY: 200,
            popTitle: '',
            popClose: false
        };
        var settings = {};
        $.extend(settings, defaults, options);

        this.settings = settings;
        if (closeWin)
            settings.popClose = closeWin;

        var writeDoc;
        var printWindow;
        switch (settings.mode) {
            case modes.iframe:
                var f = new this.Iframe();
                writeDoc = f.doc;
                printWindow = f.contentWindow || f;
                break;
            case modes.popup:
                printWindow = new this.Popup();
                writeDoc = printWindow.doc;
        }
        writeDoc.open();
        writeDoc
            .write("<html>"
                + this.getHead()
                + "<body "
                + ((window.event && isPreview) ? "onload='try{wb.execWB(7,1);}catch(e){alert(\"ActiveX未能正常加载\");}'"
                    : "") + ">" + this.getActiveX(isPreview)
                + this.getHtml(formId) + (appendHtml || '') + "</body>"
                + "</html>");
        writeDoc.close();

        printWindow.focus();

        printWindow.onload = function(){
            printWindow.print();
            printWindow.close();
        };

        // setTimeout(function(){
        //     printWindow.print();
        //     printWindow.close();
        // },1000);
    },

    Iframe: function () {
        var frameId = "print_html_frame";
        var iframeStyle = 'border:0;position:absolute;width:0px;height:0px;left:0px;top:0px;';
        var iframe;

        try {
            iframe = document.createElement('iframe');
            document.body.appendChild(iframe);
            $(iframe).attr({
                style: iframeStyle,
                id: frameId,
                src: "",
                name: "hhhh"
            });
            iframe.doc = null;
            iframe.doc = iframe.contentDocument ? iframe.contentDocument
                : (iframe.contentWindow ? iframe.contentWindow.document
                    : iframe.document);
        } catch (e) {
            throw e;
        }

        if (iframe.doc == null)
            throw "不能发现文档";

        return iframe;
    },

    Popup: function () {
        var windowAttr = "location=yes,statusbar=no,directories=no,menubar=no,titlebar=no,toolbar=no,dependent=no";
        //windowAttr += ",width=" + settings.popWd + ",height=" + settings.popHt;
        //windowAttr += ",resizable=yes,screenX=" + settings.popX + ",screenY=" + settings.popY + ",personalbar=no,scrollbars=no";

        var newWin = window.open("", "_blank", windowAttr);

        newWin.doc = newWin.document;

        return newWin;
    },

    /**
     * 打开预览窗口.
     */
    openPreviewWindow: function (htmlContent, appendHtml, isFlowChart,
                                 closeWin, isPreview) {
        var tempDiv = document.getElementById('tempId');
        if (!tempDiv) {
            tempDiv = document.createElement('div');
        }

        var self = this;
        tempDiv.innerHTML = "<div>" + htmlContent + "</div>";
        if (!isFlowChart) {
            var childNodes = tempDiv.childNodes;
            for (var i = 0; i < childNodes.length; i++) {
                self.transPrintForm(childNodes[i]);
            }
        }

        var win = window.open('', '', "");
        var style = '<style>.xforms-label .xforms-value{color: #333333; font-family: "宋体", "Arial"; font-size: 10pt}' + 'body { color: #333333; font-family: "宋体", "Arial"; font-size: 10pt}\n' + 'td { color: #333333; font-family: "宋体", "Arial"; font-size: 10pt}\n' + '.hdrcell{TEXT-ALIGN: center;} .PageNext{page-break-after: always;}</style>';

        win.document
            .write("<html><head><title></title>"
                + style
                + "</head><body "
                + (isPreview ? "onload='wb.execwb(7,1);'" : "")
                + ">"
                + (isPreview ? "<OBJECT id=wb height=0 width=0 classid=CLSID:8856F961-340A-11D0-A96B-00C04FD705A2 name=wb></OBJECT>"
                    : "") + "<div>" + tempDiv.innerHTML
                + (appendHtml || '') + "</div></body></html>");
        html = null;
        self = null;
        win.focus();
        win.document.close();

        if (!isPreview) {
            win.print();
        }

        if (closeWin) {
            win.close();
        }
    },

    transHtml: function (node) {
        var self = this;

        if (!window.event) {
            $(node)
                .find("iframe")
                .each(
                    function () {
                        this.parentNode.style.cssText = "word-break:break-all;font-size:13px;";
                        //this.parentNode.innerHTML = window.frames[this.id].document.frames[0].document.body.innerHTML || "&nbsp;";
                        this.parentNode.innerHTML = $(this).get(0).document.frames[0].document.body.innerHTML
                            || "&nbsp;";
                    });
        }

        $(node).find("input").each(function () {
            this.setAttribute("readonly", "true");
        });

        $(node)
            .find("textarea")
            .each(
                function () {
                    this.parentNode.style.cssText = "word-break:break-all;font-size:13px;";
                    this.parentNode.innerHTML = this.value ? self
                        .replaceAll(self
                                ._dhx_encoding(("" + this.value)),
                            "\n", "<br/>") : "&nbsp;";
                });

        $(node).find("table").each(function () {
            self.clearHtmlEvent(this);
        });

        $(node).find("div").each(function () {
            self.clearHtmlEvent(this);
        });

        $(node).find("span").each(function () {
            self.clearHtmlEvent(this);
        });

        //grid
        $(node).find(".gridbox").each(function () {
            self.combineJSGrid(this);
        });

        $(node).find("button").each(function () {
            this.parentNode.innerHTML = "&nbsp;";
        });
    },

    clearHtmlEvent: function (node) {
        if (node.onmouseover) {
            node.onmouseover = null;
        }
        if (node.onmouseout) {
            node.onmouseout = null;
        }

        if (node.onclick) {
            node.onclick = null;
        }
    },

    /**
     * 转换表单元素，主要是使用div来代替表单组件以及去掉图片.
     */
    transPrintForm: function (parentNode) {
        var node = parentNode.firstChild;
        while (node) {
            if (node.tagName == 'DIV') {

                if (node.getAttribute('component') == '/UI/system/components/toolbars.xml#toolbars') {
                    node.parentNode.parentNode.innerHTML = "";
                } else if (node.getAttribute('component') == '/UI/system/components_client/toolbars.xml#toolbars') {
                    this.resetTrHeight(node, 1);
                    node.parentNode.innerHTML = "";
                } else if (node.className.indexOf('gridbox') != -1) {
                    this.combineJSGrid(node);
                } else if (node.getAttribute('component') == '/UI/system/components/grid.xml#grid') {
                    alert(1);
                    node.parentNode.style.borderLeft = "#c0c0c0 1px solid";
                    node.parentNode.style.verticalAlign = "top";
                    this.combineOpsGrid(node)
                } else {
                    if (node.innerHTML == '') {
                        var nextNode = node.nextSibling;
                        if (nextNode) {

                        }
                        node.parentNode.removeChild(node);
                        node = nextNode;
                        continue;
                    } else {
                        this.transPrintForm(node);
                    }
                }
            } else {
                this.transFormItem(node);
            }

            if (node.onmouseover) {
                node.onmouseover = null;
            }
            if (node.onmouseout) {
                node.onmouseout = null;
            }
            node = node.nextSibling;
        }
    },

    transFormItem: function (node) {
        if (node.tagName == 'INPUT') {
            node.parentNode.style.textAlign = node.style.textAlign;
            if (node.getAttribute('type') == 'button') {
                node.parentNode.innerHTML = "&nbsp;";
            } else {
                var nextNode = node.nextSibling;
                if (nextNode) {
                    if (nextNode.tagName == 'IFRAME') { // 处理富文本
                        node.parentNode.style.fontSize = "13px";
                        node.parentNode.innerHTML = window.frames[nextNode.id].document.frames[0].document.body.innerHTML
                            || "&nbsp;";
                        ;
                    } else {
                        node.parentNode.style.fontSize = "13px";
                        node.parentNode.innerHTML = node.value ? ("" + node.value)
                                ._dhx_encoding()
                            : "&nbsp;";
                    }
                } else { // 普通input处理
                    node.parentNode.style.fontSize = "13px";

                    node.parentNode.innerHTML = node.value ? ("" + node.value)
                        ._dhx_encoding() : "&nbsp;";
                }
            }
        } else if (node.tagName == 'TEXTAREA') {
            node.parentNode.innerHTML = node.value ? ("" + node.value)
                ._dhx_encoding().replaceAll("\n", "<br/>") : "&nbsp;";
        } else if (node.tagName == 'BUTTON') {
            node.parentNode.innerHTML = "&nbsp;";
        } else if (node.tagName == 'LABEL') {
            node.innerHTML = "&nbsp;";
        } else {
            this.transPrintForm(node);
        }
    },

    findTableByClsName: function (node, clsName) {
        if (node.tagName == 'TABLE' && node.className
            && node.className.indexOf(clsName) != -1) {
            return node;
        }
        if (node.tagName == 'TABLE' && node.parentNode.className == clsName) {
            return node;
        } else {
            var cNodes = node.childNodes;
            for (var i = 0; cNodes.length > i; i++) {
                var tb = this.findTableByClsName(cNodes[i], clsName);
                if (tb) {
                    return tb;
                }
            }
        }
    },

    combineOpsGrid: function (grid) {
        return;
        var headTable = this.findTableByClsName(grid,
            "justep-grid-board-scroll-head");
        var dataTable = this.findTableByClsName(grid,
            "justep-grid-board-scroll-content");
        this.combineGrid(headTable, dataTable);
    },

    /**
     * js grid.
     */
    combineJSGrid: function (grid) {
        var headTable = this.findTableByClsName(grid, "hdr");
        var dataTable = this.findTableByClsName(grid, "obj");
        var footTable = this.findTableByClsName(grid, "ftr");
        this.resetTrHeight(headTable);
        this.resetTrHeight(dataTable);
        this.combineGrid(headTable, dataTable, footTable);
        this.clearGridBlankBlock(grid);
    },

    clearGridBlankBlock: function (table) {
        var childNodes = table.childNodes;
        for (var i = 0; i < childNodes.length; i++) {
            if (childNodes[i].tagName == 'DIV') {
                if (childNodes[i].innerHTML == "") {
                    childNodes[i].style.display = "none";
                }

                if (childNodes[i].className == "objbox") {
                    if (window.event) {
                        childNodes[i].style.removeAttribute("height");
                    } else {
                        childNodes[i].style.removeProperty("height");
                    }
                }
            }
        }
    },

    resetTrHeight: function (e, h) {
        var pNode = e.parentNode;
        while (pNode) {
            if (pNode.style) {
                pNode.style.overFlow = "";
            }
            if (pNode.tagName == 'TR') {
                pNode.height = h || "";
                break;
            }
            pNode = pNode.parentNode;
        }
    },

    /**
     * 把grid的的表头和表体合并.
     */
    combineGrid: function (hdTable, dataTable, footTable) {
        var rows = hdTable.rows;
        var hdTR;
        for (var i = rows.length - 1; i >= 0; i--) {
            var r = rows[i];
            r.parentNode.removeChild(r);
            if (r.style.position == 'absolute' || r.style.height == 'auto') {
                hdTR = r;
            } else {
                dataTable.firstChild.insertBefore(r, dataTable.rows[0]);
            }
        }
        //去掉grid head中没用的tr
        hdTable.parentNode.innerHTML = "";

        if (dataTable) {
            var hdCells = hdTR.childNodes;
            var removeRows = [];
            var rows = dataTable.rows;
            for (var i = 0; i < rows.length; i++) {
                if (rows[i].style.position == 'absolute'
                    || rows[i].style.height == 'auto') {
                    removeRows.push(rows[i]);
                } else {
                    var cells = rows[i].cells;
                    for (var j = 0; j < cells.length; j++) {
                        cells[j].style.cssText = "word-break:break-all;border:solid #999;border-width:0px 1px 1px 0px;padding-left:2px;";
                        if (hdCells[j] && hdCells[j].style.width == "0px") {
                            cells[j].style.display = "none";
                            continue;
                        } else if (hdCells[j]) {
                            cells[j].width = hdCells[j].style.width;
                        }
                        this.transFormItem(cells[j]);// .innerHTML = "ww";
                        if (!cells[j].innerHTML) {
                            cells[j].innerHTML = "&nbsp;"
                        }

                    }
                }
            }
            for (var i = 0; i < removeRows.length; i++) {
                removeRows[i].parentNode.removeChild(removeRows[i]);
            }
            removeRows = null;
        }
        if (footTable) {
            var rows = footTable.rows;
            var rowBuf = [];
            for (var i = 0; i < rows.length; i++) {
                var r = rows[i];
                if (r.style.position != 'absolute') {
                    rowBuf.push(r);
                }
            }

            for (var i = 0; i < rowBuf.length; i++) {
                dataTable.firstChild.appendChild(rowBuf[i]);
                var tdNodes = rowBuf[i].childNodes;
                for (var j = 0; j < tdNodes.length; j++) {
                    tdNodes[j].style.cssText = "BORDER-RIGHT: #999 1px solid; BORDER-TOP:0px; PADDING-LEFT: 1px; BORDER-LEFT: #999 0px solid; WORD-BREAK: break-all; BORDER-BOTTOM: #999 1px solid";
                }
            }
            footTable.parentNode.innerHTML = "";

            var rows = dataTable.rows;
            var lastRow = rows[rows.length - 1];
            var tdNodes = lastRow.childNodes;
            for (var i = 0; i < tdNodes.length; i++) {
                // tdNodes[i].style.cssText ="BORDER-RIGHT: #999 1px solid;
                // BORDER-TOP: #999 0px solid; PADDING-LEFT: 2px; BORDER-LEFT:
                // #999 0px solid; WORD-BREAK: break-all; BORDER-BOTTOM: #999
                // 1px solid";
            }
        }

        dataTable.style.cssText = dataTable.style.cssText
            + ";font-size:13px;border-collapse:collapse;  border:solid #999; border-width:1px 0 0 1px; ";

        // BORDER-RIGHT: #999 1px solid; BORDER-TOP: #999 0px solid;
        // PADDING-LEFT: 2px; BORDER-LEFT: #999 0px solid; WORD-BREAK:
        // break-all; BORDER-BOTTOM: #999 1px solid
        // alert(rows[rows.length-1]);
        // prompt(null,dataTable.outerHTML);
    },

    _dhx_encoding: function (str) {
        var res = "";
        for (var i = 0; i < str.length; i++) {
            var ch = str.charAt(i);

            if (ch == '>') {
                res += "&gt;";
            } else if (ch == '<') {
                res += "&lt;";
            } else if (ch == '&') {
                res += "&amp;";
            } else {
                // res += ch;
                var c = str.charCodeAt(i);
                res += c >= 160 ? "&#" + c + ";" : str.charAt(i);
            }
        }

        return res;
    },

    replaceAll: function (str, s1, s2) {
        return str.replace(new RegExp(s1, "gm"), s2);
    }
}

