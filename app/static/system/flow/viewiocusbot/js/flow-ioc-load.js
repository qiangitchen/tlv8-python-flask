/*
 * vml绘图主函数
 * @memberOf {TypeName} 
 * @return {TypeName} 
 */
function Group(id, name) {
	this.id = id;
	this.name = name;
	this.count = 0;
	this.nodes = [];
	this.lines = [];
	this.selectedObj = [];
	this.selectedLineFrom = [];
	this.selectedLineTo = [];
	this.mouseX = -1;
	this.mouseY = -1;
	this.mouseEndX = -1;
	this.mouseEndY = -1;
	this.action = null;
	this.lineFlag = null;
	this.multiSelect = false;
	this.ctrlKey = false;
	this.nodeMirror = null;
	this.lineMirror = null;
	this.bottomHeight = 10;
	this.rightWidth = 10;
	this.init = function() {
		var obj = document.getElementById('group');
		obj.innerHTML = "";
		obj.style.cursor = "default";
		obj.bindClass = this;
		if (!SVG.supported) {
			$("#svgdotview").remove();
		}
	};
	this.getObjectNum = function() {
		this.count++;
		return this.count;
	};
	this.point = function(flag) {
		if (flag == 'down') {
			this.mouseX = GroupEvent.getMouseX();
			this.mouseY = GroupEvent.getMouseY();
		} else if (flag == 'up') {
			this.mouseEndX = GroupEvent.getMouseX();
			this.mouseEndY = GroupEvent.getMouseY();
		}
	};
	this.getNodeById = function(ObjID) {
		var res = null;
		var nodeNum = this.nodes.length;
		for (var i = (nodeNum - 1); i >= 0; i--) {
			node = this.nodes[i];
			if (node.id == ObjID) {
				res = node;
				break;
			}
		}
		return res;
	};
	this.getLineById = function(ObjID) {
		var res = null;
		var lineNum = this.lines.length;
		for (var i = (lineNum - 1); i >= 0; i--) {
			line = this.lines[i];
			if (line.id == ObjID) {
				res = line;
				break;
			}
		}
		return res;
	};
	this.getEventNode = function(flag) {
		var res = null;
		var nodeNum = this.nodes.length;
		var node = null;
		var x;
		var y;
		if (flag == 'down') {
			x = this.mouseX;
			y = this.mouseY;
		} else if (flag == 'up') {
			x = this.mouseEndX;
			y = this.mouseEndY;
		}
		for (var i = (nodeNum - 1); i >= 0; i--) {
			node = this.nodes[i];
			if (node.pointInObj(x, y)) {
				res = node;
				break;
			}
		}
		return res;
	};
	this.getEventLine = function() {
		var res = null;
		var lineNum = this.lines.length;
		var line = null;
		var x = this.mouseX;
		var y = this.mouseY;
		var isStroke = -1;
		for (var i = (lineNum - 1); i >= 0; i--) {
			line = this.lines[i];
			if (line.pointInObj(x, y)) {
				if (res == null || line.obj.style.zIndex == '22') {
					res = null;
					res = GroupEvent.insertObjInArr(res, line);
					isStroke = line.pointInStroke(x, y);
					if (isStroke == 0) {
						this.selectedLineTo = [];
						this.selectedLineFrom = [];
						this.selectedLineTo = GroupEvent.insertObjInArr(
								this.selectedLineTo, line);
					} else if (isStroke == 1) {
						this.selectedLineTo = [];
						this.selectedLineFrom = [];
						this.selectedLineFrom = GroupEvent.insertObjInArr(
								this.selectedLineFrom, line);
					}
				}
			}
		}
		return res;
	};
	this.moveSelectedObj = function() {
		var x = GroupEvent.getMouseX();
		var y = GroupEvent.getMouseY();
		var num = this.selectedObj.length;
		var lineNum = this.lines.length;
		var line = null;
		for (var i = 0; i < num; i++) {
			this.selectedObj[i].move(x, y, this.mouseX, this.mouseY);
			for (var j = 0; j < lineNum; j++) {
				line = this.lines[j];
				if ((line.fromObj == this.selectedObj[i])
						|| (line.toObj == this.selectedObj[i])) {
					line.relink();
				}
			}
		}
	};
	this.moveSelectedObjEnd = function() {
		var num = this.selectedObj.length;
		for (var i = 0; i < num; i++) {
			this.selectedObj[i].moveEnd();
		}
	};
	this.moveLine = function() {
		var x = GroupEvent.getMouseX();
		var y = GroupEvent.getMouseY();
		var num = this.selectedLineTo.length;
		for (var i = 0; i < num; i++) {
			this.selectedLineTo[i].setTo(x, y, null);
		}
		num = this.selectedLineFrom.length;
		for (var i = 0; i < num; i++) {
			this.selectedLineFrom[i].setFrom(x, y, null);
		}
	};
	this.moveLineEnd = function(selNode) {
		var num = this.selectedLineTo.length;
		if (selNode != null) {
			for (var i = 0; i < num; i++) {
				if (this.fuckyou(this.selectedLineTo[i].fromObj, selNode)) {
					this.selectedLineTo[i].setTo(this.mouseEndX,
							this.mouseEndY, selNode);
					this.selectedLineTo[i].relink();
				} else {
					this.selectedLineTo[i].relink();
				}
			}
		} else {
			for (var i = 0; i < num; i++) {
				this.selectedLineTo[i].relink();
			}
		}
		this.selectedLineTo = [];
		num = this.selectedLineFrom.length;
		if (selNode != null) {
			for (var i = 0; i < num; i++) {
				if (this.fuckyou(selNode, this.selectedLineFrom[i].toObj)) {
					this.selectedLineFrom[i].setFrom(this.mouseEndX,
							this.mouseEndY, selNode);
					this.selectedLineFrom[i].relink();
				} else {
					this.selectedLineFrom[i].relink();
				}
			}
		} else {
			for (var i = 0; i < num; i++) {
				this.selectedLineFrom[i].relink();
			}
		}
		this.selectedLineFrom = [];
	};
	this.drawLineEnd = function(selNode) {
		if (selNode != null) {
			this.drawMirrorLineTo(selNode);
			if (this.fuckyou(this.lineMirror.fromObj, this.lineMirror.toObj)) {
				var line = new PolyLine();
				line.init();
				line.setShape(this.lineFlag);
				line.link(this.lineMirror);
				this.clearSelected();
			}
		}
		this.lineMirror.setDisplay('none');
	};
	this.drawMirrorLineFrom = function(selObj) {
		this.lineMirror.setFrom(this.mouseX, this.mouseY, selObj);
		this.lineMirror.setTo(this.mouseX, this.mouseY, selObj);
		this.lineMirror.setDisplay('');
	};
	this.drawMirrorLineTo = function(selObj) {
		var x = GroupEvent.getMouseX();
		var y = GroupEvent.getMouseY();
		this.lineMirror.setTo(x, y, selObj);
	};
	this.drawMirrorNodeStart = function() {
		this.multiSelect = false;
		this.nodeMirror.setLeft(GroupEvent.getX(this.mouseX));
		this.nodeMirror.setTop(GroupEvent.getY(this.mouseY));
		this.nodeMirror.setHeight(0);
		this.nodeMirror.setWidth(0);
	};
	this.drawMirrorNode = function() {
		var x = GroupEvent.getMouseX();
		var y = GroupEvent.getMouseY();
		this.nodeMirror.setWidth(Math.abs(GroupEvent.getX(x)
				- GroupEvent.getX(this.mouseX)));
		this.nodeMirror.setHeight(Math.abs(GroupEvent.getY(y)
				- GroupEvent.getY(this.mouseY)));
		if (GroupEvent.getX(x) < GroupEvent.getX(this.mouseX)) {
			this.nodeMirror.setLeft(GroupEvent.getX(x));
		}
		if (GroupEvent.getY(y) < GroupEvent.getY(this.mouseY)) {
			this.nodeMirror.setTop(GroupEvent.getY(y));
		}
		this.nodeMirror.setDisplay('');
	};
	this.drawMirrorNodeEnd = function() {
		this.nodeMirror.setDisplay('none');
		if (this.embodyObj())
			this.multiSelect = true;
	};
	this.embodyObj = function() {
		var res = false;
		var x1 = this.nodeMirror.left;
		var x2 = this.nodeMirror.left + this.nodeMirror.width;
		var y1 = this.nodeMirror.top;
		var y2 = this.nodeMirror.top + this.nodeMirror.height;
		var nodeNum = this.nodes.length;
		var lineNum = this.lines.length;
		var node = null;
		var line = null;
		for (var i = 0; i < nodeNum; i++) {
			node = this.nodes[i];
			if ((x1 <= node.left) && (x2 >= (node.left + node.width))
					&& (y1 <= node.top) && (y2 >= (node.top + node.height))) {
				node.setSelected();
				this.selectedObj = GroupEvent.insertObjInArr(this.selectedObj,
						node);
				node.x = 0;
				node.y = 0;
				node.mouseX = node.left;
				node.mouseY = node.top;
				res = true;
			}
		}
		for (var i = 0; i < lineNum; i++) {
			line = this.lines[i];
			if ((x1 <= Math.min(line.fromX, line.toX))
					&& (x2 >= Math.max(line.fromX, line.toX))
					&& (y1 <= Math.min(line.fromY, line.toY))
					&& (y2 >= Math.max(line.fromY, line.toY))) {
				line.setSelected();
				this.selectedObj = GroupEvent.insertObjInArr(this.selectedObj,
						line);
				res = true;
			}
		}
		return res;
	};
	this.fuckyou = function(fromObj, toObj) {
		var res = true;// 展示时不限制连线数
		return res;
	};
	this.clearSelected = function() {
		var num = this.selectedObj.length;
		for (var i = 0; i < num; i++) {
			this.selectedObj[i].clearSelected();
		}
		this.selectedObj = [];
	};
	this.selectAll = function() {
		this.selectedObj = [];
		var num = this.nodes.length;
		var obj = null;
		for (var i = 0; i < num; i++) {
			obj = this.nodes[i];
			obj.setSelected();
			this.selectedObj = GroupEvent.insertObjInArr(this.selectedObj, obj);
			obj.x = 0;
			obj.y = 0;
			obj.mouseX = obj.left;
			obj.mouseY = obj.top;
		}
		num = this.lines.length;
		obj = null;
		for (var i = 0; i < num; i++) {
			obj = this.lines[i];
			obj.setSelected();
			this.selectedObj = GroupEvent.insertObjInArr(this.selectedObj, obj);
		}
	};
	this.removeSelected = function() {
		var num = this.nodes.length;
		var obj = null;
		var arr = new Array();
		var count = 0;
		for (var i = 0; i < num; i++) {
			obj = this.nodes[i];
			if (obj.selected) {
				obj.remove();
			} else {
				arr[count] = obj;
				count++;
			}
		}
		this.nodes = arr;
		num = this.lines.length;
		obj = null;
		arr = new Array();
		var count = 0;
		for (var i = 0; i < num; i++) {
			obj = this.lines[i];
			if (obj.selected) {
				obj.remove();
			} else {
				arr[count] = obj;
				count++;
			}
		}
		this.lines = arr;
		this.selectedObj = [];
	};
	this.setGroupArea = function() {
		var obj = document.getElementById('group');
		var maxWidth = -1;
		var maxHeight = -1;
		var num = this.nodes.length;
		var node = null;
		for (var i = 0; i < num; i++) {
			node = this.nodes[i];
			if (maxWidth < (node.left + node.width)) {
				maxWidth = node.left + node.width;
			}
			if (maxHeight < (node.top + node.height)) {
				maxHeight = node.top + node.height;
			}
		}
		if (maxHeight > document.body.clientHeight) {
			obj.style.height = (maxHeight + this.bottomHeight) + 'px';
		} else {
			obj.style.height = '100%';
		}
		if (maxWidth > document.body.clientWidth) {
			obj.style.width = (maxWidth + this.rightWidth) + 'px';
		} else {
			obj.style.width = '100%';
		}
	};
	this.toJson = function() {
		var jNodes = [];
		var nodeNum = this.nodes.length;
		for (var i = 0; i < nodeNum; i++) {
			GroupEvent.insertObjInArr(jNodes, this.nodes[i].toJson());
		}
		var jLines = [];
		var lineNum = this.lines.length;
		for (var i = 0; i < lineNum; i++) {
			GroupEvent.insertObjInArr(jLines, this.lines[i].toJson());
		}
		var json = {
			id : this.id,
			name : this.name,
			count : this.count,
			nodes : jNodes,
			lines : jLines
		};
		return JSON.encode(json);
	};
	this.jsonTo = function(json) {
		if (!json) {
			return;
		}
		this.id = json.id;
		this.name = json.name;
		this.count = json.count;
		var jNodes = json.nodes;
		var nodeNum = jNodes.length;
		var node = null;
		for (var i = 0; i < nodeNum; i++) {
			switch (jNodes[i].shape) {
			case 'img': {
				node = new NodeImg();
				break;
			}
			case 'oval': {
				node = new NodeOval();
				break;
			}
			case 'shape': {
				node = new Condition();
				break;
			}
			default:
				node = new Node();
				break;
			}
			node.jsonTo(jNodes[i]);
			node.init();
		}
		var jLines = json.lines;
		var lineNum = jLines.length;
		var line = null;
		for (var i = 0; i < lineNum; i++) {
			switch (jLines[i].shape) {
			default:
				line = new PolyLine();
				break;
			}
			line.jsonTo(jLines[i]);
		}
	};
	this.setProp = function(selObj, flag) {
		return;
		var win = document.getElementById('propWin');
		win.setAttribute('selected', selObj);
		win.setAttribute('type', flag);
		for (var i = 0; i < Prop.panels.length; i++) {
			var panel = document.getElementById(Prop.panels[i].id);
			if (flag == Prop.panels[i].flag) {
				win.t.innerHTML = Prop.panels[i].title;
				panel.style.display = '';
				var tabs = panel.getAttribute('tabs');
				if (tabs)
					tabs.setSelected();
				if (selObj)
					selObj.setProperty(flag);
			} else {
				panel.style.display = 'none';
			}
		}
	};
};

/*
 * 特殊字符编码
 */
String.prototype.encodeSpechars = function() {
	var str = this;
	str = str.toString().replaceAll("<", "#lt;");
	str = str.replaceAll(">", "#gt;");
	str = str.replaceAll("&nbsp;", "#160;");
	str = str.replaceAll("'", "#apos;");
	return str;
};
/*
 * 特殊字符反编码
 */
String.prototype.decodeSpechars = function() {
	var str = this;
	str = str.toString().replaceAll("#lt;", "<");
	str = str.replaceAll("#gt;", ">");
	str = str.replaceAll("#160;", "&nbsp;");
	str = str.replaceAll("#apos;", "'");
	return str;
};

function drow_init(processID, processName, json) {
	var g = new Group(processID, processName);
	g.init(); // 初始化画布
	g.setGroupArea();

	// 加载流程图
	if (json && typeof json == "string") {
		json = json.toString().decodeSpechars();
		var j = JSON.parse(json);
		g.jsonTo(j);
	} else if (json) {
		g.jsonTo(json);
	}
	
}