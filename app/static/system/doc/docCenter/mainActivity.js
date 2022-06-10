var data = new tlv8.Data();
data.setTable("sa_docnode");
data.setDbkey("system");
data.setOrderby("screatetime desc");

/* 创建树 */
var param = {
	cell : {
		id : "sid",// 设置构建树的id
		name : "sdocname",// 树显示的名称
		parent : "sparentid",// 表示树的层级
		other : "skind,sdocpath,sdocdisplaypath,screatorname,snamespace,screatorfid",// "SFID,SFNAME,SORGKINDID",
		tableName : "sa_docnode",// 对应的表名
		databaseName : "system",// 数据库
		rootFilter : "sparentid is null",// 跟节点条件
		filter : "skind = 'dir'"
	},
	action : "TreeSelectAction"
};
// 设置树的属性
var setting = {
	view : {
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
		enable : false, // 是否有快速查询框
		url : "QuickTreeAction",
		path : "sdocpath"
	},
	callback : {
		onClick : treeselected
	}

};

var currenttreeNode = null;
var currenttreeID = null;
var currenttreeName = null;
var currenttreeSDOCPATH = null;
var currenttreeSDOCPATHName = null;
// 选中树
function treeselected(event, treeId, node) {
	let treeID = node.id;
	currenttreeNode = node;
	currenttreeID = treeID;
	currenttreeName = node.name;
	currenttreeSDOCPATH = node.sdocpath;
	currenttreeSDOCPATHName = node.sdocdisplaypath;
}

