var ExpressionEditer = {};
var zNodes = [], folderTree, paramGrid, currentNode;

/*
 * 插入表达式编辑框
 * @param {Object} str
 */
ExpressionEditer.insertText = function(str) {
	var obj = document.getElementById("epressionEditerArea");
	if (document.selection) {
		obj.focus();
		var sel = document.selection.createRange();
		sel.text = str;
	} else if (typeof obj.selectionStart === 'number'
			&& typeof obj.selectionEnd === 'number') {
		var startPos = obj.selectionStart;
		var endPos = obj.selectionEnd;
		var tmpStr = obj.value;
		obj.value = tmpStr.substring(0, startPos) + str
				+ tmpStr.substring(endPos, tmpStr.length);
	} else {
		obj.value += str;
	}
};

/*
 * 快速加入
 * @param {Object} obj
 */
ExpressionEditer.quick_func_exp = function(obj) {
	ExpressionEditer.insertText(obj.name);
};

/*
 * 添加
 */
ExpressionEditer.addExpression = function() {
	if (!currentNode) {
		mAlert("没有选中需要添加的表达式!");
		return;
	}
	var sExpression = currentNode.id + "(";
	var paranarray = paramGrid.getDatas();
	for ( var i in paranarray) {
		sExpression += '"' + paranarray[i].Value + '"';
		if (i < paranarray.length - 1)
			sExpression += ",";
	}
	sExpression += ")";
	ExpressionEditer.insertText(sExpression);
};

/*
 * 清空表达式
 */
ExpressionEditer.clearExpression = function() {
	document.getElementById("epressionEditerArea").innerHTML = "";
};

/*
 * 检查表达式
 */
ExpressionEditer.checkExpression = function() {
	$.messager.alert("提示","检查通过.");
};

/*
 * 树配置
 * @memberOf {TypeName} 
 */
var setting = {
	view : {
		selectedMulti : false
	},
	edit : {
		enable : false,
		editNameSelectAll : false
	},
	data : {
		simpleData : {
			enable : true
		}
	},
	callback : {
		onClick : TreeonClick
	}
};
function initExpTree() {
	var param = new tlv8.RequestParam();
	var r = tlv8.XMLHttpRequest("GetExpressionTreeAction", param, "post",
			true, function(r) {
				try {
					zNodes = r.data;
					folderTree = $.fn.zTree.init($("#FlowFoldertreeNode"),
							setting, zNodes);
				} catch (e) {
					alert(e.message);
				}
			});
}
/*
 * 选中树节点事件
 * @param {Object} event
 * @param {Object} treeId
 * @param {Object} treeNode
 * @param {Object} clickFlag
 */
function TreeonClick(event, treeId, treeNode, clickFlag) {
	currentNode = treeNode;
	if (treeNode.helper) {
		$("#helperView").html(treeNode.helper);
	} else {
		$("#helperView").html("");
	}
	var paramList = null;
	if (treeNode.param) {
		paramList = new Array();
		var params = treeNode.param.split(",");
		var paramvalues = treeNode.paramvalue.split(",");
		for ( var i = 0; i < params.length; i++) {
			var djson = {};
			if (params[i] && params[i] != "") {
				djson.Name = params[i];
				var pvalue = "";
				try {
					pvalue = paramvalues[i];
				} catch (e) {
				}
				djson.Value = pvalue;
				paramList.push(djson);
			}
		}
	}
	paramGrid.addItem(paramList);
}

/*
 * 页面加载
 * @memberOf {TypeName} 
 */
$(document)
		.ready(
				function() {
					initExpTree();
					paramGrid = new simpleGrid();
					paramGrid.init("parameterList");
					var operatType = tlv8.RequestURLParam
							.getParam("operatType");
					var Olexpression = tlv8.RequestURLParam
							.getParam("Olexpression");
					if (!operatType) {
						document.getElementById("itemForm").disabled = true;
					} else {
						$(".queckItem").bind("click", function() {
							ExpressionEditer.quick_func_exp(this);
						});
					}
					if (Olexpression) {
						document.getElementById("epressionEditerArea").value = tlv8
								.decodeURIComponent(Olexpression);
					}
				});

/*
 * 确定返回
 */
function dailogEngin() {
	var reData = document.getElementById("epressionEditerArea").value;
	if (reData)
		return reData;
	else
		return "";
}
