/*-------------------------------------------------------------------------------*\
|  Subject:  J YJsf 树组件
|  Author:   刘兵、陈乾
 *  CopyRight:www.tulinxian.com
|  Created:  2011-3-27
|  Version:  v1.2.3
|  Created:  2015-6-27
|  Version:  v2.2
\*-------------------------------------------------------------------------------*/

function Jtree() {
	this.tree;
	this.setting;
	this.treeId;
	this.zNodes;
	this.param;
}

/**
 * 继承zTree基本方法
 * 
 * @param {Object}
 *            node
 * @memberOf {TypeName}
 */
Jtree.prototype = {
	setting : this.setting,
	cancelSelectedNode : function(node) {
		this.tree.cancelSelectedNode(node);
	},
	expandAll : function(expandFlag) {
		this.tree.expandAll(expandFlag);
	},
	expandNode : function(node, expandFlag, sonSign, focus, callbackFlag) {
		return this.tree.expandNode(node, expandFlag, sonSign, focus,
				callbackFlag);
	},
	getNodes : function() {
		return this.tree.getNodes();
	},
	getNodeByParam : function(key, value, parentNode) {
		return this.tree.getNodeByParam(key, value, parentNode);
	},
	getNodeByTId : function(tId) {
		return this.tree.getNodeByTId(tId);
	},
	getNodesByParam : function(key, value, parentNode) {
		return this.tree.getNodesByParam(key, value, parentNode);
	},
	getNodesByParamFuzzy : function(key, value, parentNode) {
		return this.tree.getNodesByParamFuzzy(key, value, parentNode);
	},
	getNodeIndex : function(node) {
		return this.tree.getNodeIndex(node);
	},
	getSelectedNodes : function() {
		return this.tree.getSelectedNodes();
	},
	isSelectedNode : function(node) {
		return this.tree.isSelectedNode(node);
	},
	reAsyncChildNodes : function(parentNode, reloadType, isSilent) {
		return this.tree.reAsyncChildNodes(parentNode, reloadType, isSilent);
	},
	refresh : function() {
		this.tree.refresh();
	},
	selectNode : function(node, addFlag) {
		this.tree.selectNode(node, addFlag);
	},
	transformTozTreeNodes : function(simpleNodes) {
		return this.tree.transformTozTreeNodes(simpleNodes);
	},
	transformToArray : function(nodes) {
		return this.tree.transformToArray(nodes);
	},
	updateNode : function(node, checkTypeFlag) {
		this.tree.updateNode(node, checkTypeFlag);
	},
	getCaches : function() {
		return this.tree.getCaches();
	},
	getSetting : function() {
		return this.tree.getSetting();
	}
};
Jtree.prototype.get = function(treeID) {
	return JtreeMap.get(treeID);
};
/*
 * 字符串类似比较 @param {Object} str @memberOf {TypeName} @return {TypeName}
 */
String.prototype.like = function(str) {
	if (this.indexOf(str) > -1)
		return true;
	return false;
};
function quickPosition(event, obj) {
	var treeID = obj.id.substring(0, obj.id.indexOf("_quicktext"));
	if (event.keyCode == 13) {
		var Jtree_ext = document.getElementById(treeID).Jtree;
		Jtree_ext.quickPosition(obj.value);
	}
}
/**
 * 初始化方法
 * 
 * @param {Object}
 *            treebody
 * @param {Object}
 *            aetting
 * @param {Object}
 *            param {action:action,table:table,cell,cell}cell(id,parent,name)必须有
 */
Jtree.prototype.JtreeCount = 1;
Jtree.prototype.Jtreeid;// 树的Id
Jtree.prototype.Jtreename;// 显示数的名称
Jtree.prototype.Jtreeparent;// 树的层级
Jtree.prototype.Jtreeother;
Jtree.prototype.tableName;// 表名
Jtree.prototype.databaseName;
var rowid = "";
var torowid = "";
Jtree.prototype.init = function(treebody, setting, param) {
	if (!checkPathisHave($dpcsspath + "toolbar.main.css"))
		createStyleSheet($dpcsspath + "toolbar.main.css");
	if (!checkPathisHave($dpjspath + "jquery/jquery.ztree.core-3.1.js"))
		createJSSheet($dpjspath + "jquery/jquery.ztree.core-3.1.js");
	// if (!checkPathisHave($dpjspath + "jquery/jquery.ztree.excheck-3.1.js"))
	// createJSSheet($dpjspath + "jquery/jquery.ztree.excheck-3.1.js");
	// if (!checkPathisHave($dpjspath + "jquery/jquery.ztree.exedit-3.1.js"))
	// createJSSheet($dpjspath + "jquery/jquery.ztree.exedit-3.1.js");
	this.treeId = treebody;
	var exeJtree = this;
	if (setting.isquickPosition.enable && setting.isquickPosition.url
			&& setting.isquickPosition.enable != "") {
		var treeHTML = '<table style="width:100%;height:100%;table-layout:fixed;"><tr height="30px">'
				+ '<td align="left" style="padding-left:5px;">'
				+ '<input type="text" id="'
				+ treebody
				+ '_quicktext" onkeydown="quickPosition(event,this)" style="width:100%;border:1px solid #ddd;height:25px;"/>';
		treeHTML += " </td><td align='left' width='40px'><a id='"
				+ treebody
				+ "_quickbutton' href='javascript:void(0)' class='toobar_item' align='left' "
				+ "style='margin-left: 1px; width:36px;height:25px;float:left;text-align:left;'><img src='"
				+ $dpimgpath
				+ "toolbar/search.gif' title='查询' style='font-size:12px'/></a></td></tr>";
		var streeheight = $("#" + treebody).parent().height() - 30;
		if(streeheight > 0){
			streeheight = streeheight + "px";
		}else{
			streeheight = "100%";
		}
		treeHTML += "<tr><td colspan='2' valign='top'>"
				+ "<div style='width:100%; height:" + streeheight
				+ "; overflow: auto;'>";
		document.getElementById(treebody).parentNode.style.overFlow = "hidden";
		document.getElementById(treebody).parentNode.innerHTML = treeHTML
				+ document.getElementById(treebody).parentNode.innerHTML
				+ "</div></td></tr></table>";
		$("#" + treebody + "_quickbutton").unbind('click');
		$("#" + treebody + "_quickbutton").bind('click', function() {
			exeJtree.quickPosition($("#" + treebody + "_quicktext").val());
		});
	}

	setting = setting ? setting : {
		data : {
			simpleData : {
				enable : true
			}
		},
		callback : {
			beforeClick : beforeClick
		},
		async : {
			enable : false,
			url : "",
			autoParam : null
		}
	};
	var action = "TreeSelectAction";
	// 提取构建树的字段
	this.Jtreeid = param.cell.id;
	this.Jtreename = param.cell.name;
	this.Jtreeparent = param.cell.parent;
	this.Jtreeother = param.cell.other;
	this.tableName = param.cell.tableName;
	this.databaseName = param.cell.databaseName;
	this.param = param;
	var str = "{\"id\":\"" + this.Jtreeid + "\",\"name\":\"" + this.Jtreename
			+ "\",\"parent\":\"" + this.Jtreeparent + "\",\"other\":\""
			+ this.Jtreeother + "\",\"tableName\":\"" + this.tableName
			+ "\",\"databaseName\":\"" + this.databaseName
			+ "\",\"rootFilter\":\""
			+ (param.cell.rootFilter ? param.cell.rootFilter : "")
			+ "\",\"filter\":\"" + (param.cell.filter ? param.cell.filter : "")
			+ "\"}";
	// end
	if (!setting.async.enable && !param) {
		alert("param:不能为空!");
		return;
	} else if (setting.async.enable) {
		action = setting.async.url;
		// sql=param.sql;
	} else if (param && typeof param == "object" && param.action) {
		action = param.action;
	}
	// alert(action);

	var pams = new tlv8.RequestParam();
	pams.set("params", str);
	pams.set("orderby", param.cell.orderby ? param.cell.orderby : "");
	$("#" + treebody).html(
			"<img src='"+cpath+"/comon/css/zTreeStyle/img/loading.gif'/>");
	action = (action.startWith(cpath)?action:(cpath+"/"+action));
	setting.async.url = action;
	tlv8.XMLHttpRequest(action, pams, "post", false, function(data) {
		try {
			var zNodes = data.jsonResult;
			if(typeof zNodes == "string"){
				zNodes = window.eval("("+zNodes+")");
			}
			exeJtree.zNodes = zNodes;
			exeJtree.setting = setting;// Jtree.tree.getSetting();
			document.getElementById(treebody).Jtree = exeJtree;
			document.getElementById(treebody).setting = setting;
			document.getElementById(treebody).param = param;
			exeJtree.tree = $.fn.zTree.init($("#" + treebody), setting, zNodes, param);
		} catch (e) {
			//console.log(e);
		}
	});
};

// 回调函数集
function beforeDrag(treeId, treeNodes) {
	for (var i = 0, l = treeNodes.length; i < l; i++) {
		rowid = treeNodes[i].id;
	}
	return true;
}
function zTreeBeforeDrop(treeId, treeNodes, targetNode, moveType) {
	torowid = targetNode.id;
	var param = document.getElementById(treeId).param;
	var pm = new tlv8.RequestParam();
	pm.set("result", param.cell.id + "," + param.cell.name + ","
			+ param.cell.parent + "," + param.cell.tableName + ","
			+ param.cell.databaseName);
	pm.set("rowid", rowid);
	pm.set("torowid", torowid);
	tlv8.XMLHttpRequest(cpath+"/JtreeDropAction", pm, "post", true, null);
	return true;

}
// 点击删除动作
function zTreeBeforeRemove(treeId, treeNode) {
	var param = document.getElementById(treeId).param;
	var delpm = new tlv8.RequestParam();
	delpm.set("delCount", param.cell.id + "," + param.cell.name + ","
			+ param.cell.parent + "," + param.cell.tableName + ","
			+ param.cell.databaseName);
	delpm.set("rowid", treeNode.id);
	tlv8.XMLHttpRequest(cpath+"/JtreeDropAction", delpm, "post", true, null);
}
// 点击编辑按钮后的操作

function zTreeOnRename(event, treeId, treeNode) {
	var param = document.getElementById(treeId).param;
	var updatename = new tlv8.RequestParam();
	updatename.set("updCount", param.cell.id + "," + param.cell.name + ","
			+ param.cell.tableName + "," + param.cell.databaseName);
	updatename.set("rowid", treeNode.id);
	updatename.set("upname", treeNode.name);
	tlv8.XMLHttpRequest(cpath+"/JtreeDropAction", updatename, "post", true, null);
}

// end

/**
 * 快速定位
 * 
 * @param {Object}
 *            expandFlag
 * @memberOf {TypeName}
 */
Jtree.prototype.quickPosition = function(text) {
	if (!text || text == "")
		return;
	var qNode = new Array();
	try {
		var action = this.setting.isquickPosition.url ? this.setting.isquickPosition.url
				: "";
		var path = this.setting.isquickPosition.path ? this.setting.isquickPosition.path
				: "";
		var quickCells = this.setting.isquickPosition.quickCells ? this.setting.isquickPosition.quickCells
				: "";
		var param = new tlv8.RequestParam();
		var quicktext = this.Jtreeid
				+ ","
				+ this.Jtreename
				+ ","
				+ this.tableName
				+ ","
				+ this.databaseName
				+ ","
				+ this.Jtreeparent
				+ ","
				+ text
				+ ","
				+ path
				+ ","
				+ (this.param.cell.rootFilter ? this.param.cell.rootFilter : "")
				+ "," + (this.param.cell.filter ? this.param.cell.filter : "");
		param.set("quicktext", quicktext);
		param.set("quickCells", quickCells);
		param.set("cloums", this.Jtreeother);
		action = (action.startWith(cpath)?action:(cpath+"/"+action));
		var nodes = (this.setting.async.enable) ? (eval(tlv8
				.XMLHttpRequest(action, param, "post", false, null).jsonResult))
				: this.zNodes;
		qNode = nodes;
		if (qNode.length < 1) {
			alert("未找到[" + text + "]对应的内容!");
			return;
		}
		var node = qNode[0];

		var myparentsID = node[path].split("/");

		if (myparentsID.length < 1)
			return;
		if (myparentsID.length == 1) {
			if (node.id != "") {
				var snode = this.tree.getNodeByTId(node.id);
				if (snode && !snode.open)
					this.tree.expandNode(snode);
				node = snode;
			}
		} else {
			for (var i = 0; i < myparentsID.length; i++) {
				try {
					var nodeid = myparentsID[i].indexOf(".") > 0 ? myparentsID[i]
							.substring(0, myparentsID[i].indexOf("."))
							: myparentsID[i];
					if (nodeid != "") {
						var snode = this.tree.getNodeByTId(nodeid);
						if (!snode.open && i < myparentsID.length - 1)// 不展开最后一个节点
							this.tree.expandNode(snode);
						node = snode;
					}
				} catch (e) {
				}
			}
		}
		this.tree.selectNode(node);
	} catch (e) {
		alert("未找到[" + text + "]对应的内容!");
	}
};

// 刷新
Jtree.prototype.refreshJtree = function(panle, afcalback) {
	var action = this.setting.async.url;
	var str = "{\"id\":\"" + this.Jtreeid + "\",\"name\":\"" + this.Jtreename
			+ "\",\"parent\":\"" + this.Jtreeparent + "\",\"other\":\""
			+ this.Jtreeother + "\",\"tableName\":\"" + this.tableName
			+ "\",\"databaseName\":\"" + this.databaseName
			+ "\",\"rootFilter\":\""
			+ (this.param.cell.rootFilter ? this.param.cell.rootFilter : "")
			+ "\",\"filter\":\""
			+ (this.param.cell.filter ? this.param.cell.filter : "") + "\"}";
	var pamstens = new tlv8.RequestParam();
	pamstens.set("params", str);
	pamstens.set("orderby", this.param.cell.orderby ? this.param.cell.orderby
			: "");
	var Jtree_Ext = this;
	action = (action.startWith(cpath)?action:(cpath+"/"+action));
	tlv8.XMLHttpRequest(action, pamstens, "post", true, function(data) {
		var zNodes = data.jsonResult;
		if(typeof zNodes == "string"){
			zNodes = window.eval("("+zNodes+")");
		}
		$.fn.zTree.init($("#" + panle), Jtree_Ext.setting, zNodes,
				Jtree_Ext.param);
		Jtree_Ext.zNodes = zNodes;
		if (afcalback && typeof afcalback == "function") {
			afcalback(zNodes);
		}
	});
};