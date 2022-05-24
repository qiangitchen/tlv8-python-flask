var data = new tlv8.Data();
data.setTable("SA_FLOWDRAWLG");
data.setDbkey("system");

/* 创建树 */
var param = {
	cell : {
		id : "SID",// 设置构建树的id
		name : "SNAME",// 树显示的名称
		parent : "SPARENT",// 表示树的层级
		other : "SPROCESSID,SPROCESSNAME,SCODE,SIDPATH,SCODEPATH,SNAMEPATH",
		tableName : "SA_FLOWFOLDER",// 对应的表名
		databaseName : "system",// 数据库
		rootFilter : "SPARENT is null" // 跟节点条件
	// orderby : "SSEQUENCE asc" //排序字段
	}
};
// 设置树的属性
var setting = {
	view : {
		addHoverDom : addHoverDom,
		removeHoverDom : removeHoverDom,
		selectedMulti : false, // 设置是否允许同时选中多个节点。默认值: true
		autoCancelSelected : false,
		dblClickExpand : true
	},
	data : {
		simpleData : {
			enable : true
		}
	},
	async : {
		enable : true,
		url : "TreeSelectAction",
		autoParam : [ "id=currenid" ],
		type : "post"
	},
	isquickPosition : {
		enable : true, // 是否有快速查询框
		url : "QuickTreeAction",
		quickCells : "SCODE,SNAME",// 用于快速查询的字段
		path : "SFID"// 查询路径字段
	},
	edit : {
		enable : true,
		editNameSelectAll : false
	},
	callback : {
		beforeDrag : beforeDrag,
		beforeRemove : beforeRemove,
		beforeRename : beforeRename,
		onRemove : onRemove,
		onRename : afterEditName,
		onClick : onClick
	}
};

function onClick(event, treeId, treeNode, clickFlag) {
	// alert("单击：" + treeNode.id);
	document.getElementById("tree_folder_form").rowid = treeNode.id;
	document.getElementById("processListGrid_div").grid.refreshData();
	if (!treeNode.children) {
		document.getElementById("processListGrid_div").grid.settoolbar(true,
				"no", "no", "no");
	}
}

function beforeDrag(treeId, treeNodes) {
	return false;
}

var newCount = 0;
function addHoverDom(treeId, treeNode) {
	var sprocessid = treeNode.SPROCESSID;
	if (sprocessid && sprocessid != "") {
		return true;
	}
	var sObj = $("#" + treeNode.tId + "_span");
	if (treeNode.editNameFlag || $("#addBtn_" + treeNode.id).length > 0)
		return;
	var addStr = "<button type='button' class='add' id='addBtn_" + treeNode.id
			+ "' title='新增子节点' onfocus='this.blur();'></button>";
	sObj.append(addStr);
	var btn = $("#addBtn_" + treeNode.id);
	if (btn)
		btn.bind("click", function() {
			newCount++;
			var zTree = $.fn.zTree.getZTreeObj("tree_folder");
			var newid = new UUID().toString();
			var newCode = treeNode.SCODE + (newCount);
			var newName = "新增节点" + (newCount);
			var newSIDPATH = treeNode.SIDPATH + "/" + newid;
			var newSCODEPATH = treeNode.SCODEPATH + "/" + newCode;
			var newSNAMEPATH = treeNode.SNAMEPATH + "/" + newName;
			var param = new tlv8.RequestParam();
			param.set("id", newid);
			param.set("pid", treeNode.id);
			param.set("scode", newCode);
			param.set("name", newName);
			param.set("sidpath", newSIDPATH);
			param.set("scodepath", newSCODEPATH);
			param.set("snamepath", newSNAMEPATH);
			var r = tlv8.XMLHttpRequest("insertflwFolderAction", param,
					"post", true, null);
			zTree.addNodes(treeNode, {
				id : newid,
				pId : treeNode.id,
				name : newName,
				SCODE : newCode,
				SIDPATH : newSIDPATH,
				SCODEPATH : newSCODEPATH,
				SNAMEPATH : newSNAMEPATH
			});
			return false;
		});
};
function removeHoverDom(treeId, treeNode) {
	$("#addBtn_" + treeNode.id).unbind().remove();
};

function beforeRename(treeId, treeNode, newName) {
	if (newName.length == 0) {
		alert("节点名称不能为空.");
		var zTree = $.fn.zTree.getZTreeObj("tree_folder");
		setTimeout(function() {
			zTree.editName(treeNode);
		}, 10);
		return false;
	}
	return true;
}

/*
 * 编辑目录文件 @param {Object} treeId @param {Object} treeNode
 */
function afterEditName(event, treeId, treeNode) {
	// alert(treeNode.name);
	var pathnames = treeNode.SNAMEPATH.split("/");
	pathnames[pathnames.length - 1] = treeNode.name;
	treeNode.SPROCESSNAME = treeNode.name;
	var param = new tlv8.RequestParam();
	param.set("id", treeNode.id);
	param.set("name", treeNode.name);
	param.set("sprocessid", treeNode.SPROCESSID);
	param.set("sprocessname", treeNode.SPROCESSNAME);
	param.set("snamepath", pathnames.join("/"));
	var r = tlv8.XMLHttpRequest("editflwFolderAction", param, "post",
			true, null);
}

function beforeRemove(treeId, treeNode) {
	if (treeNode.id == "root") {
		alert("跟目录不能删除!");
		return false;
	}
	var zTree = $.fn.zTree.getZTreeObj("tree_folder");
	zTree.selectNode(treeNode);
	return confirm("确认删除 节点 -- " + treeNode.name + " 吗？");
}
function onRemove(e, treeId, treeNode) {
	var param = new tlv8.RequestParam();
	param.set("id", treeNode.id);
	param.set("name", treeNode.name);
	param.set("sidpath", treeNode.SIDPATH);
	param.set("sprocessid", treeNode.SPROCESSID);
	var r = tlv8.XMLHttpRequest("deleteflwFolderAction", param, "post",
			true, function() {
				clear_draw_board();
			});
}

/*
 * 初始化
 */
function initBody() {
	var det = document.getElementById("processListGrid_div");
	var labelid = "No,SPROCESSNAME,SPROCESSID,FENABLED";
	var labels = "No.,流程名称,流程ID,状态";
	var datatype = "ro,string,string,html:getEnabledStatus";
	var labelwidth = "40,120,240,80";
	var dataAction = {
		"queryAction" : "getGridAction",
		"savAction" : "saveAction",
		"deleteAction" : "deleteAction"
	};
	var maingrid = new tlv8.createGrid(det, labelid, labels, labelwidth,
			dataAction, "100%", "100%", data, 10, "", "tree_folder_form",
			"SFOLDERID", datatype, "false", "true");
	maingrid.grid.seteditModel(true);
	maingrid.grid.settoolbar("readonly", "readonly", true, "readonly");
	// maingrid.grid.refreshData();
	var spsncode = tlv8.Context.getCurrentPersonCode();
	if (spsncode == "SYSTEM") {
		maingrid.grid.insertSelfBar("生效/失效", "64px",
				"setEnabledStatus(this,1)",
				cpath+"/comon/image/toolbar/enable.png");
		maingrid.grid
				.insertSelfBar("", "5px", "",
						cpath+"/comon/image/toolbar/standard_toolbar/standard/compart.gif");

	}
}

function setEnabledStatus(obj, status) {
	if (status == 1) {
		obj.src = cpath+"/comon/image/toolbar/disable.png";
		var actGrid = document.getElementById("processListGrid_div").grid;
		actGrid.setValueByName("FENABLED", actGrid.CurrentRowId, 1);
		actGrid.saveData();
		obj.onclick = function(event) {
			setEnabledStatus(this, 0);
		};
	} else {
		obj.src = cpath+"/comon/image/toolbar/enable.png";
		var actGrid = document.getElementById("processListGrid_div").grid;
		actGrid.setValueByName("FENABLED", actGrid.CurrentRowId, 0);
		actGrid.saveData();
		obj.onclick = function(event) {
			setEnabledStatus(this, 1);
		};
	}
}

/*
 * 生效状态 @param {Object} event
 */
function getEnabledStatus(event) {
	if (event.value == "1")
		return "1-生效";
	else
		return "0-失效";
}

/*
 * 新增之后事件 @param {Object} event
 */
function afterInertGrid(event) {
	var cGrid = event || document.getElementById("processListGrid_div").grid;
	cGrid.setValueByName("SPROCESSID", cGrid.CurrentRowId, new UUID()
			.toString());
	cGrid.setValueByName("SPROCESSACTY", cGrid.CurrentRowId, " ");
}

function onselectedGrid(event) {
	var status = event.getValueByName("FENABLED", event.CurrentRowId);
	if (status == "1") {
		event.settoolbar(true, "readonly", true, "readonly");
		event.setrowState(event.CurrentRowId, "readonly");
	} else {
		event.settoolbar(true, true, true, true);
	}
}

/*
 * 确定返回 @param {Object} param
 */
function dailogEngin(param) {
	var cGrid = document.getElementById("processListGrid_div").grid;
	var id = cGrid.getValueByName("SPROCESSID", cGrid.CurrentRowId);
	var name = cGrid.getValueByName("SPROCESSNAME", cGrid.CurrentRowId);
	return {
		id : id,
		name : name
	};
}
