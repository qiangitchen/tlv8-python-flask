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
	this.slock = true;
	this.init = function() {
		var obj = document.getElementById('group');
		obj.innerHTML = "";
		obj.style.cursor = "default";
		obj.bindClass = this;
		obj.onmousedown = GroupEvent.mouseDown;
		obj.onmousemove = GroupEvent.mouseMove;
		obj.onmouseup = GroupEvent.mouseUp;
		obj.onkeydown = GroupEvent.keyDown;
		obj.onkeyup = GroupEvent.keyUp;
		this.lineMirror = new Line();
		this.lineMirror.textFlag = false;
		this.lineMirror.mirrorFlag = true;
		this.lineMirror.init();
		this.lineMirror.setDisplay('none');
		this.lineMirror.strokeObj.dashStyle = 'dashdot';
		this.lineMirror.obj.strokecolor = '#000000';
		this.nodeMirror = new Node();
		this.nodeMirror.strokeFlag = true;
		this.nodeMirror.shadowFlag = false;
		this.nodeMirror.textFlag = false;
		this.nodeMirror.mirrorFlag = true;
		this.nodeMirror.init();
		this.nodeMirror.setDisplay('none');
		this.nodeMirror.obj.strokecolor = 'black';
		this.nodeMirror.obj.style.zIndex = '100';
		this.nodeMirror.obj.filled = false;
		this.nodeMirror.strokeObj.dashstyle = 'dot';
	};
	this.getObjectNum = function() {
		this.count++;
		return this.count;
	};
	this.point = function(flag,event) {
		if (flag == 'down') {
			this.mouseX = GroupEvent.getMouseX(event);
			this.mouseY = GroupEvent.getMouseY(event);
		} else if (flag == 'up') {
			this.mouseEndX = GroupEvent.getMouseX(event);
			this.mouseEndY = GroupEvent.getMouseY(event);
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
	this.getNodesById = function(ObjID) {
		var res = [];
		var nodeNum = this.nodes.length;
		for (var i = (nodeNum - 1); i >= 0; i--) {
			node = this.nodes[i];
			if (node.id.indexOf(ObjID)>-1) {
				res.push(node);
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
	this.moveSelectedObj = function(event) {
		if (this.slock) {
			return;
		}
		var x = GroupEvent.getMouseX(event);
		var y = GroupEvent.getMouseY(event);
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
	this.relinkObj = function(node) {
		var lineNum = this.lines.length;
		var line = null;
		for (var j = 0; j < lineNum; j++) {
			line = this.lines[j];
			if ((line.fromObj == node) || (line.toObj == node)) {
				line.relink();
			}
		}
	};
	this.moveSelectedObjEnd = function() {
		if (this.slock) {
			return;
		}
		var num = this.selectedObj.length;
		for (var i = 0; i < num; i++) {
			this.selectedObj[i].moveEnd();
		}
	};
	this.moveSelectedLine = function(event) {
		if (this.slock) {
			return;
		}
		var x = GroupEvent.getMouseX(event);
		var y = GroupEvent.getMouseY(event);
		var num = this.selectedObj.length;
		for (var i = 0; i < num; i++) {
			this.selectedObj[i].move(x, y, this.mouseX, this.mouseY);
		}
	};
	this.moveSelectedLineEnd = function(event) {
		if (this.slock) {
			return;
		}
		var x = GroupEvent.getMouseX(event);
		var y = GroupEvent.getMouseY(event);
		var num = this.selectedObj.length;
		for (var i = 0; i < num; i++) {
			this.selectedObj[i].moveEnd(x, y, this.mouseX, this.mouseY);
		}
	};
	this.setSelected = function(node) {
		try {
			node.setSelected();
			this.selectedObj.push(node);
			// alert($(document.body).width());
		} catch (e) {
		}
	};
	this.moveLine = function(event) {
		if (this.slock) {
			return;
		}
		var x = GroupEvent.getMouseX(event);
		var y = GroupEvent.getMouseY(event);
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
		if (this.slock) {
			return;
		}
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
	this.drawMirrorLineTo = function(selObj,event) {
		var x = GroupEvent.getMouseX(event);
		var y = GroupEvent.getMouseY(event);
		this.lineMirror.setTo(x, y, selObj);
	};
	this.drawMirrorNodeStart = function() {
		this.multiSelect = false;
		this.nodeMirror.setLeft(GroupEvent.getX(this.mouseX));
		this.nodeMirror.setTop(GroupEvent.getY(this.mouseY));
		this.nodeMirror.setHeight(0);
		this.nodeMirror.setWidth(0);
	};
	this.drawMirrorNode = function(event) {
		var x = GroupEvent.getMouseX(event);
		var y = GroupEvent.getMouseY(event);
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
		var res = true;
		if (fromObj == toObj) {
			res = false;
		}
		var len = this.lines.length;
		var line = null;
		for (var i = 0; i < len; i++) {
			line = this.lines[i];
			if ((line.fromObj == fromObj) && (line.toObj == toObj)) {
				res = false;
				alert("两点之间已经存在连接！");
				break;
			}
		}
		return res;
	};
	this.clearSelected = function() {
		var num = this.selectedObj.length;
		for (var i = 0; i < num; i++) {
			try{
				this.selectedObj[i].clearSelected();
			}catch(e){
			}
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
				try {
					document.title = JSON.stringify({action:'EditorCallJava',option:'remove',data:obj.id});
					//window.EditorCallJava('remove', obj.id);
				} catch (e) {
				}
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
	this.getSelectedNode = function() {
		var num = this.nodes.length;
		var obj = null;
		var arr = new Array();
		var count = 0;
		for (var i = 0; i < num; i++) {
			obj = this.nodes[i];
			if (obj.selected) {
				arr[count] = obj;
				count++;
			}
		}
		return arr;
	};
	this.getSelectedLine = function() {
		var num = this.lines.length;
		var obj = null;
		var arr = new Array();
		var count = 0;
		for (var i = 0; i < num; i++) {
			obj = this.lines[i];
			if (obj.selected) {
				arr[count] = obj;
				count++;
			}
		}
		return arr;
	};
	this.haveSelected = function() {
		var selNodes = this.getSelectedNode();
		var selLines = this.getSelectedLine();
		return selNodes.length > 0 || selLines.length > 0;
	};
	this.setGroupArea = function() {
		var obj = document.getElementById('group');
		var maxWidth = 2000;
		var maxHeight = 2000;
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
		return JSONC.encode(json);
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
		document.title = JSON.stringify({action:'dataInitedCall'});
		//window.dataInitedCall(JSONC.encode(json));
	};
	this.setProp = function(selObj, flag) {
		var win = document.getElementById('propWin');
		win.selected = selObj;
		win.type = flag;
		for (var i = 0; i < Prop.panels.length; i++) {
			var panel = document.getElementById(Prop.panels[i].id);
			if (flag == Prop.panels[i].flag) {
				win.t.innerHTML = Prop.panels[i].title;
				panel.style.display = '';
				var tabs = panel.tabs;
				if (tabs)
					tabs.setSelected();
				if (selObj)
					selObj.setProperty(flag);
			} else {
				panel.style.display = 'none';
			}
		}
	};
	this.eventStart = function(event) {
		if (this.ctrlKey) {
			this.multiSelect = true;
		}
		var selNode = this.getEventNode('down');
		var selLine = this.getEventLine();
		if (!this.multiSelect) {
			this.clearSelected();
		}
		if (selNode != null) {
			if (selNode.type == "condition") {
				this.setProp(selNode, 'c');
			} else {
				this.setProp(selNode, 'n');
			}
			if (!GroupEvent.isInArr(this.selectedObj, selNode)) {
				if (!this.ctrlKey) {
					this.multiSelect = false;
					this.clearSelected();
				}
				selNode.setSelected();
				this.selectedObj = GroupEvent.insertObjInArr(this.selectedObj,
						selNode);
			} else {
				if (this.ctrlKey) {
					selNode.clearSelected();
					this.selectedObj = GroupEvent.removeObjInArr(
							this.selectedObj, selNode);
				}
			}
			if (this.lineFlag == null) {
				this.action = 'nodedown';
			} else if (this.lineFlag != null) {
				this.action = 'drawline';
				this.drawMirrorLineFrom(selNode);
			}
		} else if (selLine != null) {
			this.setProp(selLine[selLine.length - 1], 'l');
			for (var i = 0; i < selLine.length; i++) {
				if (!GroupEvent.isInArr(this.selectedObj, selLine[i])) {
					if (!this.ctrlKey) {
						this.multiSelect = false;
					}
					selLine[i].setSelected();
					this.selectedObj = GroupEvent.insertObjInArr(
							this.selectedObj, selLine[i]);
				} else {
					if (this.ctrlKey) {
						selLine[i].clearSelected();
						this.selectedObj = GroupEvent.removeObjInArr(
								this.selectedObj, selLine[i]);
					}
				}
			}
			if (this.selectedLineTo.length > 0) {
				this.action = 'moveline';
				for (var i = 0; i < this.selectedLineTo.length; i++) {
					this.selectedLineTo[i].setMoveSelected();
				}
			}
			if (this.selectedLineFrom.length > 0) {
				this.action = 'moveline';
				for (var i = 0; i < this.selectedLineFrom.length; i++) {
					this.selectedLineFrom[i].setMoveSelected();
				}
			}
			if (this.selectedLineTo.length == 0
					&& this.selectedLineFrom.length == 0) {
				if (this.lineFlag == null) {
					this.action = 'linedown';
				}
			}
		} else {
			this.setProp(null, 'help');
			this.action = 'blankdown';
			if (!this.ctrlKey) {
				this.clearSelected();
				this.drawMirrorNodeStart();
			}
		}
	};
};
var GroupEvent = {
	mouseDown : function(event) {
		var group = document.getElementById('group');
		var Love = group.bindClass;
		try{
			document.selection.empty();
		}catch (e) {
		}
		Love.point('down',event);
		Love.eventStart(event);
		return false;
	},
	mouseMove : function(event) {
		var group = document.getElementById('group');
		var Love = group.bindClass;
		if (Love.action != null) {
			switch (Love.action) {
			case "nodedown":
				Love.moveSelectedObj(event);
				break;
			case "linedown":
				Love.moveSelectedLine(event);
				break;
			case "drawline":
				Love.drawMirrorLineTo(null,event);
				break;
			case "moveline":
				Love.moveLine(null,event);
				break;
			case "blankdown":
				Love.drawMirrorNode(event);
				break;
			default:
			}
		}
		return false;
	},
	mouseUp : function(event) {
		var group = document.getElementById('group');
		var Love = group.bindClass;
		if (Love.action != null) {
			Love.point('up',event);
			var selNode = Love.getEventNode('up');
			switch (Love.action) {
			case "nodedown":
				Love.moveSelectedObjEnd();
				break;
			case "linedown":
				Love.moveSelectedLineEnd(event);
				break;
			case "drawline":
				Love.drawLineEnd(selNode, event);
				break;
			case "moveline":
				Love.moveLineEnd(selNode);
				break;
			case "blankdown":
				Love.drawMirrorNodeEnd();
				break;
			default:
			}
		}
		Love.setGroupArea();
		Love.action = null;
		document.title = JSON.stringify({action:'designChangeCall'});
		//window.designChangeCall(Love.toJson());
		var selectedNode = Love.getSelectedNode();
		var selectedLine = Love.getSelectedLine();
		if (selectedNode.length == 1) {
			document.title = JSON.stringify({action:'selectedCall',data:selectedNode[0].id});
			//window.selectedCall(JSONC.encode(selectedNode[0].toJson()));
		} else if (selectedLine.length == 1) {
			document.title = JSON.stringify({action:'selectedCall',data:selectedLine[0].id});
			//window.selectedCall(JSONC.encode(selectedLine[0].toJson()));
		} else {
			document.title = JSON.stringify({action:'selectedCall',data:'cancel'});
			//window.selectedCall("cancel");
		}
		return false;
	},
	keyDown : function(event) {
		event = event || window.event;
		var group = document.getElementById('group');
		var Love = group.bindClass;
		if (event.ctrlKey)
			Love.ctrlKey = true;
		switch (event.keyCode) {
		case 46:// Delete
			Love.removeSelected();
			break;
		case 65:// a[A]
			if (event.ctrlKey) {
				Love.selectAll();
				Love.multiSelect = true;
				window.event.returnValue = false;
				return false;
			}
			break;
		/*
		 * case 83:// s[S] if (window.event.ctrlKey) { // MenuAction.save(); }
		 * break;
		 */
		case 40:// ↓
			if (Love.slock) {
				return true;
			}
			if (Love.selectedObj.length>0) {
				var num = Love.selectedObj.length;
				var lineNum = Love.lines.length;
				var line = null;
				for (var i = 0; i < num; i++) {
					try {
						var o_t = Love.selectedObj[i].top;
						Love.selectedObj[i].setTop(o_t + 1);
						Love.relinkObj(Love.selectedObj[i]);
					} catch (e) {
					}
				}
				window.event.returnValue = false;
				return false;
			}
			break;
		case 38:// ↑
			if (Love.slock) {
				return true;
			}
			if (Love.selectedObj.length>0) {
				var num = Love.selectedObj.length;
				var lineNum = Love.lines.length;
				var line = null;
				for (var i = 0; i < num; i++) {
					try {
						var o_t = Love.selectedObj[i].top;
						Love.selectedObj[i].setTop(o_t - 1);
						Love.relinkObj(Love.selectedObj[i]);
					} catch (e) {
					}
				}
				window.event.returnValue = false;
				return false;
			}
			break;
		case 39:// →
			if (Love.slock) {
				return true;
			}
			if (Love.selectedObj.length>0) {
				var num = Love.selectedObj.length;
				var lineNum = Love.lines.length;
				var line = null;
				for (var i = 0; i < num; i++) {
					try {
						var o_l = Love.selectedObj[i].left;
						Love.selectedObj[i].setLeft(o_l + 1);
						Love.relinkObj(Love.selectedObj[i]);
					} catch (e) {
					}
				}
				window.event.returnValue = false;
				return false;
			}
			break;
		case 37:// ←
			if (Love.slock) {
				return true;
			}
			if (Love.selectedObj.length>0) {
				var num = Love.selectedObj.length;
				var lineNum = Love.lines.length;
				var line = null;
				for (var i = 0; i < num; i++) {
					try {
						var o_l = Love.selectedObj[i].left;
						Love.selectedObj[i].setLeft(o_l - 1);
						Love.relinkObj(Love.selectedObj[i]);
					} catch (e) {
					}
				}
				window.event.returnValue = false;
				return false;
			}
			break;
		default:
		}
	},
	keyUp : function(event) {
		var group = document.getElementById('group');
		var Love = group.bindClass;
		Love.ctrlKey = false;
		document.title = JSON.stringify({action:'designChangeCall'});
		//window.designChangeCall(Love.toJson());
	},
	getX : function(x) {
		return (x + document.body.scrollLeft);
	},
	getY : function(y) {
		return (y + document.body.scrollTop);
	},
	getMouseX : function(event) {
		var e = event || window.event;
		if (e.pageX) {
			return e.pageX + document.getElementById("drawView").scrollLeft;
		} else {
			return e.clientX + document.body.scrollLeft - document.body.clientLeft + document.getElementById("drawView").scrollLeft;
		}
	},
	getMouseY : function(event) {
		var e = event || window.event;
		if (e.pageY) {
			return e.pageY + document.getElementById("drawView").scrollTop;
		} else {
			return e.clientY + document.body.scrollTop - document.body.clientTop + document.getElementById("drawView").scrollTop;
		}
	},
	isIE : function() {
		var agent = navigator.userAgent.toLowerCase();
		return agent.indexOf("msie") > 0;
	},
	getBrowserInfo : function() {
		var agent = navigator.userAgent.toLowerCase();
		var regStr_ie = /msie [\d.]+;/gi;
		var regStr_ff = /firefox\/[\d.]+/gi;
		var regStr_chrome = /chrome\/[\d.]+/gi;
		var regStr_saf = /safari\/[\d.]+/gi;
		// IE
		if (agent.indexOf("msie") > 0) {
			return agent.match(regStr_ie);
		}
		// firefox
		if (agent.indexOf("firefox") > 0) {
			return agent.match(regStr_ff);
		}
		// Chrome
		if (agent.indexOf("chrome") > 0) {
			return agent.match(regStr_chrome);
		}
		// Safari
		if (agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0) {
			return agent.match(regStr_saf);
		}
	},
	insertObjInArr : function(arr, s) {
		if (arr == null)
			arr = [];
		arr[arr.length] = s;
		return arr;
	},
	removeObjInArr : function(arr, s) {
		var tArr = null;
		var count = 0;
		if (arr != null) {
			tArr = [];
			var num = arr.length;
			for (var i = 0; i < num; i++) {
				if (arr[i] != s) {
					tArr[count] = arr[i];
					count++;
				}
			}
		}
		return tArr;
	},
	isInArr : function(arr, s) {
		var res = false;
		if (arr != null) {
			var num = arr.length;
			for (var i = 0; i < num; i++) {
				if (arr[i] == s) {
					res = true;
					break;
				}
			}
		}
		return res;
	}
};

function Menu() {
	this.id = 'menu';
	this.left = 0;
	this.top = 0;
	this.height = 30;
	this.width = 300;
	this.selected = false;
	this.obj = null;
	this.menuObj = null;
	this.x = -1;
	this.y = -1;
	this.img = new Array('folder.gif', 'save.gif', 'start.gif', 'end.gif',
			'node.gif', 'member.gif', 'fork.gif', 'forward.gif',
			'drop-yes.gif', 'delete.gif', 'grid.gif', 'checkvalidity.gif');
	this.text = new Array('打开', '保存', '开始环节', '结束环节', '环节（长方形）', '环节（图片）',
			'条件分支', '路径（直线）', '路径（折线）', '删除', '网格', '帮助');
	this.action = new Array('MenuAction.open()', 'MenuAction.save()',
			'MenuAction.start()', 'MenuAction.end()', 'MenuAction.nodeRect()',
			'MenuAction.nodeImg()', 'MenuAction.fork()',
			'if(MenuAction.line(true)) MenuAction.changeStyle(this)',
			'if(MenuAction.polyline(true)) MenuAction.changeStyle(this)',
			'MenuAction.remove()', 'MenuAction.grid()', 'MenuAction.showHelp()');
	this.init = function() {
		var toolObj = document.getElementById('tool');
		toolObj.innerHTML = "";
		var obj = document.createElement('div');
		toolObj.appendChild(obj);
		toolObj.appendChild(this.createMenu());
		obj.id = 'movebar';
		obj.bindClass = this;
		this.obj = obj;
		obj.onmousedown = MenuEvent.mouseDown;
		obj.onmousemove = MenuEvent.mouseMove;
		obj.onmouseup = MenuEvent.mouseUp;
		obj.style.position = 'absolute';
		obj.style.left = this.left;
		obj.style.top = this.top;
		var td = document.createElement('div');
		td.innerHTML = '&nbsp;&nbsp;';
		obj.appendChild(td);
	};
	this.hide = function() {
		try {
			document.getElementById("movebar").style.display = "none";
		} catch (e) {
		}
	};
	this.createMenu = function() {
		var obj = document.createElement('div');
		this.menuObj = obj;
		obj.id = this.id;
		obj.style.position = 'absolute';
		obj.style.height = this.height;
		obj.style.left = this.left;
		obj.style.top = this.top;
		var tobj = document.createElement('table');
		obj.appendChild(tobj);
		var tb = document.createElement('tbody');
		tobj.appendChild(tb);
		var tr = document.createElement('tr');
		tb.appendChild(tr);
		var td = null;
		for (var i = 0; i < this.img.length; i++) {
			td = document.createElement('td');
			tr.appendChild(td);
			td.innerHTML = '<span onmousemove="MenuAction.over(this)" onmouseout="MenuAction.out(this)" onclick="'
					+ this.action[i]
					+ '">&nbsp;<img src="img/'
					+ this.img[i]
					+ '"/>'
					+ this.text[i]
					+ '</span><img src="img/grid-blue-split.gif"/>';
		}
		return obj;
	};
	this.down = function(event) {
		var x = GroupEvent.getMouseX(event);
		var y = GroupEvent.getMouseY(event);
		x = GroupEvent.getX(x);
		y = GroupEvent.getY(y);
		this.x = x - this.obj.offsetLeft;
		this.y = y - this.obj.offsetTop;
		this.selected = true;
	};
	this.move = function(event) {
		if (this.selected) {
			var x = GroupEvent.getMouseX(event);
			var y = GroupEvent.getMouseY(event);
			this.left = GroupEvent.getX(x) - this.x;
			this.top = GroupEvent.getY(y) - this.y;
			this.obj.style.left = this.left + 'px';
			this.obj.style.top = this.top + 'px';
			this.menuObj.style.left = (this.left) + 'px';
			this.menuObj.style.top = this.top + 'px';
		}
	};
	this.up = function() {
		this.selected = false;
		if (this.left < 0) {
			this.left = 0;
			this.obj.style.left = this.left + 'px';
			this.menuObj.style.left = (this.left) + 'px';
		}
		if (this.top < 0) {
			this.top = 0;
			this.obj.style.top = this.top + 'px';
			this.menuObj.style.top = this.top + 'px';
		}
	};
};
var MenuEvent = {
	mouseDown : function(event) {
		var menu = document.getElementById('movebar');
		var menuClass = menu.bindClass;
		menu.setCapture();
		menuClass.down(event);
	},
	mouseMove : function(event) {
		var menu = document.getElementById('movebar');
		var menuClass = menu.bindClass;
		menuClass.move(event);
		return false;
	},
	mouseUp : function(event) {
		var menu = document.getElementById('movebar');
		var menuClass = menu.bindClass;
		menuClass.up(event);
		try{
			menu.releaseCapture();
			document.getElementById('group').focus();
		}catch(e){
		}
	}
};
var MenuAction = {
	open : function() {
		justep.yn.portal.dailog.openDailog("打开流程",
				"/flw/dwr/dialog/process-select.html", 666, 350,
				function(rdata) {
					drow_init(rdata.id, rdata.name, rdata.jsonStr);
				});
	},
	save : function() {
		var group = document.getElementById('group');
		var Love = group.bindClass;
		// clipboardData.setData("Text", Love.toJson());
		var param = new justep.yn.RequestParam();
		param.set("sprocessid", Love.id);
		param.set("sprocessname", Love.name);
		param.set("sdrawlg", document.getElementById("group").innerHTML);
		param.set("sprocessacty", Love.toJson().toString().encodeSpechars());
		justep.yn.XMLHttpRequest("saveFlowDrawLGAction", param, "post", true,
				function(r) {
					sAlert("保存成功!");
				});
	},
	adposation : "down",
	setAdposation : function(sw) {
		MenuAction.adposation = sw;
	},
	autoLine : function(n) { // 自动连线
		var groupObj = document.getElementById('group');
		var Love = groupObj.bindClass;
		var sldNode = Love.getSelectedNode();
		try {
			var snode;
			if (sldNode.length > 0) {
				snode = sldNode[sldNode.length - 1];
				var asw = MenuAction.adposation;
				var l, t;
				if (asw == "down") {
					if (snode.type == "node") {
						if (n.type == "end") {
							l = snode.left + (snode.width / 2) - 20;
							t = snode.top + snode.height + 20;
						} else {
							l = snode.left;
							t = snode.top + snode.height + 20;
						}
					} else {
						l = snode.left - snode.width + 10;
						t = snode.top + snode.height + 20;
					}
				} else if (asw == "right") {
					if (snode.type == "node") {
						t = snode.top;
						l = snode.left + snode.width + 20;
					} else {
						t = snode.top;
						l = snode.left + snode.width + 20;
					}
				} else if (asw == "left") {
					if (snode.type == "node") {
						t = snode.top;
						l = snode.left - snode.width - 20;
					} else {
						t = snode.top;
						l = snode.left - snode.width - 20;
					}
				} else if (asw == "up") {
					if (snode.type == "node") {
						if (n.type == "end") {
							l = snode.left + (snode.width / 2) - 20;
							t = snode.top - snode.height - 20;
						} else {
							l = snode.left;
							t = snode.top - snode.height - 20;
						}
					} else {
						l = snode.left - (snode.width) + 10;
						t = snode.top - snode.height - 20;
					}
				}
				n.left = l;
				n.top = t;
				n.init();
				var ln = new PolyLine();// 创建连线
				ln.init();
				ln.setShape("line");
				ln.link({
					fromObj : snode,
					toObj : n
				});
			} else {
				n.init();
			}
		} catch (e) {
		}
		Love.clearSelected();// 取消选中
		Love.setSelected(n); // 选中当前环节
	},
	start : function() {
		var n = new NodeOval();
		n.setName("开始");
		// n.init();
		this.autoLine(n);
		document.title = JSON.stringify({action:'EditorCallJava',option:'add',data:JSONC.encode(n.toJson())});
		//window.EditorCallJava('add', JSONC.encode(n.toJson()));
		var groupObj = document.getElementById('group');
		var Love = groupObj.bindClass;
		document.title = JSON.stringify({action:'designChangeCall'});
		//window.designChangeCall(Love.toJson());
	},
	end : function() {
		var n = new NodeOval();
		n.setType('end');
		n.setName("结束");
		// n.init();
		this.autoLine(n);
		document.title = JSON.stringify({action:'EditorCallJava',option:'add',data:JSONC.encode(n.toJson())});
		//window.EditorCallJava('add', JSONC.encode(n.toJson()));
		var groupObj = document.getElementById('group');
		var Love = groupObj.bindClass;
		document.title = JSON.stringify({action:'designChangeCall'});
		//window.designChangeCall(Love.toJson());
	},
	nodeRect : function() {
		var n = new Node();
		// n.init();
		this.autoLine(n);
		document.title = JSON.stringify({action:'EditorCallJava',option:'add',data:JSONC.encode(n.toJson())});
		//window.EditorCallJava('add', JSONC.encode(n.toJson()));
		var groupObj = document.getElementById('group');
		var Love = groupObj.bindClass;
		document.title = JSON.stringify({action:'designChangeCall'});
		//window.designChangeCall(Love.toJson());
	},
	nodeImg : function() {
		var n = new NodeImg();
		n.init();
		document.title = JSON.stringify({action:'EditorCallJava',option:'add',data:JSONC.encode(n.toJson())});
		//window.EditorCallJava('add', JSONC.encode(n.toJson()));
		var groupObj = document.getElementById('group');
		var Love = groupObj.bindClass;
		document.title = JSON.stringify({action:'designChangeCall'});
		//window.designChangeCall(Love.toJson());
	},
	fork : function() {
		var n = new Condition();
		// n.init();
		this.autoLine(n);
		document.title = JSON.stringify({action:'EditorCallJava',option:'add',data:JSONC.encode(n.toJson())});
		//window.EditorCallJava('add', JSONC.encode(n.toJson()));
		var groupObj = document.getElementById('group');
		var Love = groupObj.bindClass;
		document.title = JSON.stringify({action:'designChangeCall'});
		//window.designChangeCall(Love.toJson());
	},
	line : function(cansele) {
		var group = document.getElementById('group');
		var Love = group.bindClass;
		if (cansele) {
			Love.lineFlag = 'line';
		} else {
			Love.lineFlag = null;
		}
		return true;
	},
	polyline : function(cansele) {
		var group = document.getElementById('group');
		var Love = group.bindClass;
		if (cansele) {
			Love.lineFlag = 'polyline';
		} else {
			Love.lineFlag = null;
		}
		return true;
	},
	remove : function() {
		var group = document.getElementById('group');
		var Love = group.bindClass;
		Love.removeSelected();
		document.title = JSON.stringify({action:'designChangeCall'});
		//window.designChangeCall(Love.toJson());
	},
	grid : function() {
		var obj = document.body.style.backgroundImage;
		if (obj == '')
			document.body.style.backgroundImage = 'url(img/bg.jpg)';
		else
			document.body.style.backgroundImage = '';
	},
	setLock : function(lockstate) {
		var group = document.getElementById('group');
		var Love = group.bindClass;
		Love.slock = lockstate;
	},
	changeStyle : function(obj) {
		if (obj.style.color == '')
			obj.style.color = '#ffffff';
		else
			obj.style.color = '';
	},
	over : function(obj) {
		obj.style.backgroundColor = '#A8D0F9';
	},
	out : function(obj) {
		obj.style.backgroundColor = '';
	},
	showHelp : function() {
		var w = new Window();
		w.show();
	}
};

/*
 * 选择执行页面
 */
function selectexePage() {
	/*
	 * justep.yn.portal.dailog.openDailog("选择执行页面",
	 * "/system/role/func-tree-select.html", "300", "300", function(data) { var
	 * win = document.getElementById('propWin'); var kSet = data.keySet(); var
	 * sURL; for (k in kSet) { sURL = kSet[k]; }
	 * document.getElementById(win.type + '_p_exepage').value = sURL; });
	 */
}
/*
 * 选择执行人
 */
function selectexePerson() {
	/*
	 * justep.yn.portal.dailog .openDailog( "选择执行人",
	 * "/comon/SelectDialogPsn/SelectChPsm.html", "500", "400", function(data) {
	 * var win = document.getElementById('propWin');
	 * document.getElementById(win.type + '_p_roleID').innerHTML = data.id;
	 * document.getElementById(win.type + '_p_role').innerHTML = data.name; });
	 */
}
/*
 * 环节标题
 */
function selectexeLabel() {
	/*
	 * var win = document.getElementById('propWin'); var Olexpression =
	 * document.getElementById(win.type + '_p_label').value; if (Olexpression) {
	 * Olexpression = justep.yn.encodeURIComponent(Olexpression.toString()
	 * .decodeSpechars()); } else { Olexpression = ""; } var url =
	 * "/flw/dwr/dialog/expression-editer.html?Olexpression=" + Olexpression;
	 * justep.yn.portal.dailog.openDailog("环节标题-表达式编辑器", url, 700, 460,
	 * function( data) { try { $("#" + win.type + '_p_label').val(data ? data :
	 * ""); } catch (e) { } });
	 */
}
/*
 * 选择执行人范围
 */
function selectRange() {
	/*
	 * var win = document.getElementById('propWin'); var Olexpression =
	 * document.getElementById(win.type + '_p_group').innerHTML; if
	 * (Olexpression) { Olexpression =
	 * justep.yn.encodeURIComponent(Olexpression.toString() .decodeSpechars()); }
	 * else { Olexpression = ""; } justep.yn.portal.dailog .openDailog(
	 * "表达式编辑器", "/flw/dwr/dialog/expression-editer.html?Olexpression=" +
	 * Olexpression, "600", "450", function(data) { try {
	 * document.getElementById(win.type + '_p_group').innerHTML = data ? data :
	 * ""; } catch (e) { } });
	 */
}

// 转发规则
function selectRangeTran() {
	/*
	 * var win = document.getElementById('propWin'); var Olexpression =
	 * document.getElementById(win.type + '_r_transe').innerHTML; if
	 * (Olexpression) { Olexpression =
	 * justep.yn.encodeURIComponent(Olexpression.toString() .decodeSpechars()); }
	 * else { Olexpression = ""; } var url =
	 * "/flw/dwr/dialog/expression-editer.html?Olexpression=" + Olexpression;
	 * justep.yn.portal.dailog.openDailog("转发规则-表达式编辑器", url, 700, 460,
	 * function( data) { try { $("#" + win.type + '_r_transe').html(data ? data :
	 * ""); } catch (e) { } });
	 */
}

/*
 * 编辑条件表达式
 */
function selectConditionExpression() {
	/*
	 * var win = document.getElementById('propWin'); var Olexpression =
	 * document.getElementById(win.type + '_p_expression').value; if
	 * (Olexpression) { Olexpression =
	 * justep.yn.encodeURIComponent(Olexpression.toString() .decodeSpechars()); }
	 * else { Olexpression = ""; } justep.yn.portal.dailog .openDailog(
	 * "表达式编辑器",
	 * "/flw/dwr/dialog/expression-editer.html?operatType=condition&Olexpression=" +
	 * Olexpression, "600", "450", function(data) { try {
	 * document.getElementById(win.type + '_p_expression').value = data ? data :
	 * ""; } catch (e) { } });
	 */
};

var Prop = {
	nodes : [ [ {
		subject : '环节ID',
		id : 'n_p_id',
		text : 'input'
	}, {
		subject : '环节名称',
		id : 'n_p_name',
		text : 'input'
	}, {
		subject : '执行页面',
		id : 'n_p_exepage',
		text : 'input',
		btn : {
			click : selectexePage,
			hide : true
		}
	}, {
		subject : '环节标题',
		id : 'n_p_label',
		text : 'input',
		btn : {
			click : selectexeLabel,
			hide : true
		}
	}, {
		subject : '环节描述',
		id : 'n_p_desc',
		text : 'textarea'
	} ], [ {
		subject : '群组',
		id : 'n_p_group',
		text : 'span',
		btn : {
			click : selectRange,
			hide : true
		}
	}, {
		subject : '处理人ID',
		id : 'n_p_roleID',
		text : 'span',
		btn : {
			click : selectexePerson,
			hide : true
		}
	}, {
		subject : '处理人',
		id : 'n_p_role',
		text : 'span',
		btn : {
			click : selectexePerson,
			hide : true
		}
	}, {
		subject : '抢占模式',
		id : 'n_r_grab',
		text : 'select',
		options : [ {
			text : '打开时抢占',
			id : 'whenOpen'
		}, {
			text : '执行时抢占',
			id : 'whenExt'
		}, {
			text : '共同模式',
			id : 'together'
		} ]
	}, {
		subject : '共同方式',
		id : 'n_r_grabway',
		text : 'select',
		options : [ {
			text : '合并',
			id : 'merge'
		}, {
			text : '分支',
			id : 'branch'
		} ]
	} ], [ {
		subject : '流程控制者',
		id : 'n_p_in',
		text : 'input'
	}, {
		subject : '回退到指定环节',
		id : 'n_p_back',
		text : 'input'
	}, {
		subject : '转发规则',
		id : 'n_r_transe',
		text : 'span',
		btn : {
			click : selectRangeTran,
			hide : true
		}
	}, {
		subject : '流转确认',
		id : 'n_t_queryt',
		text : 'select',
		options : [ {
			text : '是',
			id : 'yes'
		}, {
			text : '否',
			id : 'no'
		} ]
	} ], [ {
		subject : '环节办理时限',
		id : 'n_p_time',
		text : 'input'
	}, {
		subject : '通知方式',
		id : 'n_p_timetype',
		text : 'input'
	} ], [ {
		subject : '启动前调用',
		id : 'n_p_call1',
		text : 'input'
	}, {
		subject : '启动后调用',
		id : 'n_p_call2',
		text : 'input'
	}, {
		subject : '进行中调用',
		id : 'n_p_call3',
		text : 'input'
	}, {
		subject : '完成前调用',
		id : 'n_p_call4',
		text : 'input'
	}, {
		subject : '完成后调用',
		id : 'n_p_call5',
		text : 'input'
	} ] ],
	conditions : [ [ {
		subject : '条件ID',
		id : 'c_p_id',
		text : 'span'
	}, {
		subject : '条件名称',
		id : 'c_p_name',
		text : 'input'
	}, {
		subject : '条件表达式',
		id : 'c_p_expression',
		text : 'input',
		btn : {
			click : selectConditionExpression,
			hide : true
		}
	}, {
		subject : '为真时输出',
		id : 'c_p_trueOut',
		text : 'select',
		options : [],
		Events : [ {
			id : 'onfocus',
			action : function(event) {
				var win = document.getElementById('propWin');
				win.bindClass.creatDomConditionSelect(this);
			}
		} ]
	}, {
		subject : '为假时输出',
		id : 'c_p_falseOut',
		text : 'select',
		options : [],
		Events : [ {
			id : 'onfocus',
			action : function() {
				var win = document.getElementById('propWin');
				win.bindClass.creatDomConditionSelect(this);
			}
		} ]
	} ] ],
	lines : [ [ {
		subject : 'ID',
		id : 'l_p_id',
		text : 'span'
	}, {
		subject : '名称',
		id : 'l_p_name',
		text : 'input'
	}, {
		subject : '上一环节',
		id : 'l_p_pre',
		text : 'span'
	}, {
		subject : '下一环节',
		id : 'l_p_next',
		text : 'span'
	} ] ],
	panels : [
			{
				flag : 'help',
				id : 'help',
				type : 0,
				title : '帮助',
				body : '1.环节可用鼠标拖拽<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;鼠标选中环节后不释放，拖拽鼠标，环节将随鼠标移动，释放鼠标后，环节不再移动。<br>'
						+ '2.路径的两个端点可以通过鼠标拖拽，改变路径指向的环节<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;鼠标选中路径的端点后不释放，拖拽鼠标，路径被选中的端点将鼠标移动，在选中的环节释放鼠标后，路径被选中的端点将指向该选中的环节。<br>'
						+ '3.ctrl+a，全选。<br>4.按住ctrl，鼠标选中对象，可以多选。<br>5.delete，删除选中对象。<br>6.使用鼠标多选<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;鼠标点击空白处不释放，拖拽鼠标，会出现一个长方形虚框，虚框的范围随着鼠标移动而变化，虚框范围内的对象将被选中。'
						+ '<br>'
			}, {
				flag : 'n',
				id : 'n_prop_panel',
				type : 1,
				title : '环节',
				tabs : [ {
					id : '常规',
					val : 0,
					type : 'nodes'
				}, {
					id : '执行',
					val : 1,
					type : 'nodes'
				}, {
					id : '控制',
					val : 2,
					type : 'nodes'
				}, {
					id : '时限',
					val : 3,
					type : 'nodes'
				}, {
					id : '调用',
					val : 4,
					type : 'nodes'
				} ]
			}, {
				flag : 'c',
				id : 'c_prop_panel',
				type : 1,
				title : '环节',
				tabs : [ {
					id : '常规',
					val : 0,
					type : 'conditions'
				} ]
			}, {
				flag : 'l',
				id : 'l_prop_panel',
				type : 1,
				title : '路径',
				tabs : [ {
					id : '基本',
					val : 0,
					type : 'lines'
				} ]
			} ],
	clear : function() {
		for (var i = 0; i < this.nodes.length; i++) {
			var obj = this.nodes[i];
			for (var j = 0; j < obj.length; j++) {
				switch (obj[j].text) {
				case 'span':
					$("#"+obj[j].id).html('');
					break;
				default:
					$("#"+obj[j].id).val('');
					break;
				}
			}
		}
		for (var i = 0; i < this.lines.length; i++) {
			var obj = this.lines[i];
			for (var j = 0; j < obj.length; j++) {
				switch (obj[j].text) {
				case 'span':
					$("#"+obj[j].id).html('');
					break;
				default:
					$("#"+obj[j].id).val('');
					break;
				}
			}
		}
	},
	setProperty : function(type) {
		var objs = null;
		if (type == 'n')
			objs = this.nodes;
		else if (type == 'c')
			objs = this.conditions;
		else
			objs = this.lines;
		var arr = [];
		for (var i = 0; i < objs.length; i++) {
			var obj = objs[i];
			for (var j = 0; j < obj.length; j++) {
				var v = null;
				switch (obj[j].text) {
				case 'span':
					v = $("#"+obj[j].id).html();
					break;
				default:
					v = $("#"+obj[j].id).val();
					break;
				}
				if (v) {
					v = v.toString().encodeSpechars();
				}
				var json = {
					id : obj[j].id,
					text : obj[j].text,
					value : v
				};
				arr[arr.length] = json;
			}
		}
		return arr;
	}
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

JSONC = new function() {
	this.decode = function() {
		var filter, result, self, tmp;
		if ($$("toString")) {
			switch (arguments.length) {
			case 2:
				self = arguments[0];
				filter = arguments[1];
				break;
			case 1:
				if ($[typeof arguments[0]](arguments[0]) === Function) {
					self = this;
					filter = arguments[0];
				} else
					self = arguments[0];
				break;
			default:
				self = this;
				break;
			}
			;
			if (rc.test(self)) {
				try {
					result = e("(".concat(self, ")"));
					if (filter && result !== null
							&& (tmp = $[typeof result](result))
							&& (tmp === Array || tmp === Object)) {
						for (self in result)
							result[self] = v(self, result) ? filter(self,
									result[self]) : result[self];
					}
				} catch (z) {
				}
			} else {
				throw new Error("bad data");
			}
		}
		;
		return result;
	};
	this.encode = function() {
		var self = arguments.length ? arguments[0] : this, result, tmp;
		if (self === null)
			result = "null";
		else if (self !== undefined && (tmp = $[typeof self](self))) {
			switch (tmp) {
			case Array:
				result = [];
				for (var i = 0, j = 0, k = self.length; j < k; j++) {
					if (self[j] !== undefined && (tmp = JSONC.encode(self[j])))
						result[i++] = tmp;
				}
				;
				result = "[".concat(result.join(","), "]");
				break;
			case Boolean:
				result = String(self);
				break;
			case Date:
				result = '"'.concat(self.getFullYear(), '-',
						d(self.getMonth() + 1), '-', d(self.getDate()), 'T',
						d(self.getHours()), ':', d(self.getMinutes()), ':',
						d(self.getSeconds()), '"');
				break;
			case Function:
				break;
			case Number:
				result = isFinite(self) ? String(self) : "null";
				break;
			case String:
				result = '"'.concat(self.replace(rs, s).replace(ru, u), '"');
				break;
			default:
				var i = 0, key;
				result = [];
				for (key in self) {
					if (self[key] !== undefined
							&& (tmp = JSONC.encode(self[key])))
						result[i++] = '"'.concat(key.replace(rs, s).replace(ru,
								u), '":', tmp);
				}
				;
				result = "{".concat(result.join(","), "}");
				break;
			}
		}
		;
		return result;
	};
	this.toDate = function() {
		var self = arguments.length ? arguments[0] : this, result;
		if (rd.test(self)) {
			result = new Date;
			result.setHours(i(self, 11, 2));
			result.setMinutes(i(self, 14, 2));
			result.setSeconds(i(self, 17, 2));
			result.setMonth(i(self, 5, 2) - 1);
			result.setDate(i(self, 8, 2));
			result.setFullYear(i(self, 0, 4));
		} else if (rt.test(self))
			result = new Date(self * 1000);
		return result;
	};
	var c = {
		"\b" : "b",
		"\t" : "t",
		"\n" : "n",
		"\f" : "f",
		"\r" : "r",
		'"' : '"',
		"\\" : "\\",
		"/" : "/"
	}, d = function(n) {
		return n < 10 ? "0".concat(n) : n;
	}, e = function(c, f, e) {
		e = eval;
		delete eval;
		if (typeof eval === "undefined")
			eval = e;
		f = eval("" + c);
		eval = e;
		return f;
	}, i = function(e, p, l) {
		return 1 * e.substr(p, l);
	}, p = [ "", "000", "00", "0", "" ], rc = null, rd = /^[0-9]{4}\-[0-9]{2}\-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}$/, rs = /(\x5c|\x2F|\x22|[\x0c-\x0d]|[\x08-\x0a])/g, rt = /^([0-9]+|[0-9]+[,\.][0-9]{1,3})$/, ru = /([\x00-\x07]|\x0b|[\x0e-\x1f])/g, s = function(
			i, d) {
		return "\\".concat(c[d]);
	}, u = function(i, d) {
		var n = d.charCodeAt(0).toString(16);
		return "\\u".concat(p[n.length], n);
	}, v = function(k, v) {
		return $[typeof result](result) !== Function
				&& (v.hasOwnProperty ? v.hasOwnProperty(k)
						: v.constructor.prototype[k] !== v[k]);
	}, $ = {
		"boolean" : function() {
			return Boolean;
		},
		"function" : function() {
			return Function;
		},
		"number" : function() {
			return Number;
		},
		"object" : function(o) {
			return o instanceof o.constructor ? o.constructor : null;
		},
		"string" : function() {
			return String;
		},
		"undefined" : function() {
			return null;
		}
	}, $$ = function(m) {
		function $(c, t) {
			t = c[m];
			delete c[m];
			try {
				e(c);
			} catch (z) {
				c[m] = t;
				return 1;
			}
		}
		;
		return $(Array) && $(Object);
	};
	try {
		rc = new RegExp(
				'^("(\\\\.|[^"\\\\\\n\\r])*?"|[,:{}\\[\\]0-9.\\-+Eaeflnr-u \\n\\r\\t])+?$');
	} catch (z) {
		rc = /^(true|false|null|\[.*\]|\{.*\}|".*"|\d+|\d+\.\d+)$/;
	}
};

function Window() {
	this.id = 'propWin';
	this.left = 100;
	this.top = 30;
	this.height = 300;
	this.width = 400;
	this.title = '帮助';
	this.selected = false;
	this.x = -1;
	this.y = -1;
	this.obj = null;
	this.objBody = null;
	this.init = function() {
		try {
			document.getElementById("propWin").parentNode.removeChild(document
					.getElementById("propWin"));
		} catch (e) {
		}
		// var toolObj = document.getElementById('tool');
		var win = document.createElement('div');
		document.body.appendChild(win);
		this.obj = win;
		win.bindClass = this;
		win.id = this.id;
		win.style.position = 'absolute';
		win.style.left = this.left;
		win.style.top = this.top;
		win.style.width = this.width;
		win.className = 'x-window';
		var s = '<div class="x-window-tl">';
		s += '<div class="x-window-tr"> ';
		s += '<div id="a1" class="x-window-tc"><div class="x-tool-close"></div><span>标题</span>';
		s += '</div> ';
		s += ' </div> ';
		s += '</div> ';
		s += '<div class="x-window-ml"> ';
		s += ' <div class="x-window-mr"> ';
		s += ' <div class="x-window-mc"> ';
		s += ' </div> ';
		s += ' </div> ';
		s += '</div> ';
		s += '<div class="x-window-bl"> ';
		s += '<div class="x-window-br"> ';
		s += '<div class="x-window-bc"> ';
		s += '</div> ';
		s += '</div> ';
		s += '</div>';
		win.appendChild(this.createTop());
		win.appendChild(this.createMiddle());
		win.appendChild(this.createBottom());
	};
	this.creatDomConditionSelect = function(obj) {
		var group = document.getElementById('group');
		var Love = group.bindClass;
		var win = document.getElementById('propWin');
		var currentObjID = win.selected.id;
		var Lines = Love.lines;
		var optionsArray = new Array();
		for ( var i in Lines) {
			if (Lines[i].fromObj.id == currentObjID) {
				var djson = {
					id : Lines[i].toObj.id,
					name : Lines[i].toObj.name
				};
				optionsArray.push(djson);
			}
		}
		for (var j = 0; j < optionsArray.length; j++) {
			obj.options[j] = new Option(optionsArray[j].name,
					optionsArray[j].id);
		}
	};
	this.createTop = function() {
		var l = document.createElement('div');
		l.className = 'x-window-tl';
		var r = document.createElement('div');
		r.className = 'x-window-tr';
		l.appendChild(r);
		var c = document.createElement('div');
		c.className = 'x-window-tc';
		r.appendChild(c);
		c.pid = this.id;
		c.onmousedown = WindowEvent.mouseDown;
		c.onmousemove = WindowEvent.mouseMove;
		c.onmouseup = WindowEvent.mouseUp;
		var closeObj = document.createElement('div');
		closeObj.className = 'x-tool-close';
		c.appendChild(closeObj);
		closeObj.pid = this.id;
		closeObj.onclick = function() {
			var p = document.getElementById(this.pid);
			p.style.display = 'none';
		};
		var title = document.createElement('span');
		title.innerHTML = this.title;
		this.obj.t = title;
		c.appendChild(title);
		return l;
	};
	this.createMiddle = function() {
		var l = document.createElement('div');
		l.className = 'x-window-ml';
		var r = document.createElement('div');
		r.className = 'x-window-mr';
		l.appendChild(r);
		var c = document.createElement('div');
		c.className = 'x-window-mc';
		r.appendChild(c);
		for (var i = 0; i < Prop.panels.length; i++) {
			var panel = document.createElement('div');
			panel.id = Prop.panels[i].id;
			if (i > 0)
				panel.style.display = 'none';
			c.appendChild(panel);
			if (Prop.panels[i].type == 1) {
				var tabs = new TabPanel();
				tabs.init();
				panel.appendChild(tabs.obj);
				panel.tabs = tabs;
				for (var j = 0; j < Prop.panels[i].tabs.length; j++) {
					var tab = new Tab();
					tab
							.init(
									Prop.panels[i].tabs[j].id,
									Prop[Prop.panels[i].tabs[j].type][Prop.panels[i].tabs[j].val]);
					tabs.appendFuck(tab);
					panel.appendChild(tab.bObj);
					if (j == 0)
						tabs.setSelected(tab);
				}
			} else {
				panel.innerHTML = Prop.panels[i].body;
			}
		}
		return l;
	};
	this.createBottom = function() {
		var l = document.createElement('div');
		l.className = 'x-window-bl';
		var r = document.createElement('div');
		r.className = 'x-window-br';
		l.appendChild(r);
		var c = document.createElement('div');
		c.className = 'x-window-bc';
		r.appendChild(c);
		var ba = document.createElement('button');
		ba.pid = this.id;
		c.appendChild(ba);
		ba.className = 'btn';
		ba.value = '应用';
		ba.onclick = function() {
			var win = document.getElementById('propWin');
			var obj = win.selected;
			if (obj) {
				var type = win.type;
				if (obj) {
					obj.property = Prop.setProperty(type);
				}
				if (type == "n") {
					obj.id = $("#" + type + '_p_id').val();
				}
				obj.name = document.getElementById(type + '_p_name').value;
				if (obj.textObj)
					obj.textObj.innerHTML = obj.name;
				obj.obj.title = obj.name;
			}
		};
		var b = document.createElement('button');
		b.pid = this.id;
		c.appendChild(b);
		b.className = 'btn';
		b.value = '关闭';
		b.onclick = function() {
			var p = document.getElementById(this.pid);
			p.style.display = 'none';
		};
		return l;
	};
	this.show = function() {
		try {
			var p = document.getElementById("propWin");
			p.style.display = "";
		} catch (e) {
			this.init();
		}
	};
	this.hide = function() {
		try {
			var p = document.getElementById("propWin");
			p.style.display = "none";
		} catch (e) {
		}
	};
	this.down = function(event) {
		var x = GroupEvent.getMouseX(event);
		var y = GroupEvent.getMouseY(event);
		x = GroupEvent.getX(x);
		y = GroupEvent.getY(y);
		this.x = x - this.obj.offsetLeft;
		this.y = y - this.obj.offsetTop;
		this.selected = true;
	};
	this.move = function(event) {
		if (this.selected) {
			var x = GroupEvent.getMouseX(event);
			var y = GroupEvent.getMouseY(event);
			this.left = GroupEvent.getX(x) - this.x;
			this.top = GroupEvent.getY(y) - this.y;
			this.obj.style.left = this.left + 'px';
			this.obj.style.top = this.top + 'px';
		}
	};
	this.up = function() {
		this.selected = false;
		if (this.left < 3) {
			this.left = 10;
			this.obj.style.left = this.left + 'px';
		}
		if (this.top < 3) {
			this.top = 3;
			this.obj.style.top = this.top + 'px';
		}
	};
};
var WindowEvent = {
	mouseDown : function(event) {
		var win = document.getElementById(this.pid);
		this.setCapture();
		var winClass = win.bindClass;
		winClass.down(event);
	},
	mouseMove : function(event) {
		var win = document.getElementById(this.pid);
		var winClass = win.bindClass;
		winClass.move(event);
		return false;
	},
	mouseUp : function(event) {
		var win = document.getElementById(this.pid);
		var winClass = win.bindClass;
		winClass.up(event);
		this.releaseCapture();
		document.getElementById('group').focus();
	}
};
function TabPanel() {
	this.tabs = [];
	this.obj = null;
	this.ulObj = null;
	this.selected = null;
	this.init = function() {
		var obj = document.createElement('div');
		obj.className = 'x-tab-panel-header';
		obj.bindClass = this;
		var wrapObj = document.createElement('div');
		wrapObj.className = 'x-tab-strip-top';
		obj.appendChild(wrapObj);
		var topObj = document.createElement('div');
		topObj.className = 'x-tab-strip-wrap';
		wrapObj.appendChild(topObj);
		var ulObj = document.createElement('ul');
		topObj.appendChild(ulObj);
		this.obj = obj;
		this.ulObj = ulObj;
	};
	this.appendFuck = function(tab) {
		this.ulObj.appendChild(tab.obj);
		tab.obj.pObj = this.obj;
		this.tabs[this.tabs.length] = tab;
	};
	this.setSelected = function(tab) {
		if (!tab) {
			tab = this.tabs[0];
		}
		if (this.selected) {
			this.selected.obj.className = '';
			this.selected.bObj.className = 'x-tab-panel-body';
		}
		this.selected = tab;
		tab.obj.className = 'x-tab-strip-active';
		tab.bObj.className = 'x-tab-panel-body-show';
	};
};
function Tab() {
	this.obj = null;
	this.bObj = null;
	this.init = function(title, content) {
		var obj = document.createElement('li');
		obj.bindClass = this;
		this.obj = obj;
		obj.onclick = function() {
			var tabsClass = this.pObj.bindClass;
			tabsClass.selected.obj.className = '';
			tabsClass.selected.bObj.className = 'x-tab-panel-body';
			tabsClass.selected = this.bindClass;
			this.className = 'x-tab-strip-active';
			this.bObj.className = 'x-tab-panel-body-show';
		};
		var l = document.createElement('div');
		l.className = 'x-tab-left';
		obj.appendChild(l);
		var r = document.createElement('div');
		r.className = 'x-tab-right';
		l.appendChild(r);
		var c = document.createElement('div');
		c.className = 'x-tab-middle';
		r.appendChild(c);
		c.innerHTML = title;
		var bObj = document.createElement('div');
		bObj.className = 'x-tab-panel-body';
		this.bObj = bObj;
		this.obj.bObj = bObj;
		this.createBody(bObj, content);
	};
	this.createBody = function(pobj, content) {
		for (var i = 0; i < content.length; i++) {
			var json = content[i];
			var obj = document.createElement('div');
			pobj.appendChild(obj);
			var hObj = document.createElement('span');
			obj.appendChild(hObj);
			hObj.innerHTML = json.subject + '：';
			hObj.style.width = '120px';
			hObj.style.textAlign = 'center';
			var bObj = document.createElement(json.text);
			obj.appendChild(bObj);
			bObj.id = json.id;
			bObj.className = 'x-form-field';
			switch (json.text) {
			case 'select':
				for (var j = 0; j < json.options.length; j++) {
					bObj.options[j] = new Option(json.options[j].text,
							json.options[j].id);
				}
				break;
			case 'textarea':
				bObj.rows = 6;
				break;
			default:
			}
			if (json.Events) {
				for ( var k in json.Events) {
					bObj[json.Events[k].id] = json.Events[k].action;
				}
			}
			if (json.btn) {
				var btn = document.createElement('img');
				btn.src = 'img/drop-add.gif';
				btn.style.border = "1px solid #eee";
				btn.style.cursor = 'hand';
				btn.onmouseover = function(event) {
					this.style.border = "1px solid gray";
				};
				btn.onmouseout = function(event) {
					this.style.border = "1px solid #eee";
				};
				btn.onclick = json.btn.click;
				obj.appendChild(btn);
			}
		}
	};
}

function drow_init(processID, processName, json) {
	var g = new Group(processID, processName);
	g.init(); // 初始化画布
	g.setGroupArea();
	// var m = new Menu();
	// m.init();//初始化菜单
	var w = new Window();
	w.left = screen.availWidth - 430;
	w.init();// 初始化提示窗
	w.hide();

	// 加载流程图
	if (json && typeof json == "string") {
		// json = json.toString().decodeSpechars();
		var j = JSONC.decode(json);
		g.jsonTo(j);
	} else if (json) {
		g.jsonTo(json);
	} else {
		// window.dataInitedCall("empty");
	}
}

function pageDataInited(sources){
	try{
		var j = JSONC.decode(deCode(sources));
		drow_init(j.id,j.name,j);
	}catch(e){
		try{
			var j = JSONC.decode(deCode(sources));
			drow_init(j.id,j.name);
		}catch(e){
			alert("模型加载失败!");
		}
	}
};
function lookResourse(){
	window.EditorCallJava("回调测试... ...");
};
function selectSinglNodeById(nodeid){
	var groupObj = document.getElementById('group');
	var Love = groupObj.bindClass;
	var node = Love.getNodeById(nodeid);
	if(node){
		Love.clearSelected();
		Love.setSelected(node);
		node.obj.focus();
		// ‘焦点’移动到元素位置
		$("#drawView").animate({scrollTop:node.top - ($(document.body).height()/2) + "px",scrollLeft:node.left - ($(document.body).width()/2) + "px"}, 10);
		return;
	}
	var line = Love.getLineById(nodeid);
	if(line){
		Love.clearSelected();
		Love.setSelected(line);
		line.fromObj.obj.focus();
		line.toObj.obj.focus();
		// ‘焦点’移动到元素位置
		$("#drawView").animate({scrollTop:line.fromObj.top - ($(document.body).height()/2) + "px",scrollLeft:line.fromObj.left - ($(document.body).width()/2) + "px"}, 10);
	}
};
function removeSinglNodeById(nodeid){
	var groupObj = document.getElementById('group');
	var Love = groupObj.bindClass;
	var node = Love.getNodeById(nodeid);
	if(node){
		Love.clearSelected();
		Love.setSelected(node);
		// node.remove();
		Love.removeSelected();
	}
	var line = Love.getLineById(nodeid);
	if(line){
		Love.clearSelected();
		Love.setSelected(line);
		Love.removeSelected();
	}
	document.title = JSON.stringify({action:'designChangeCall'});
	//window.designChangeCall(Love.toJson());
};	
function setSelObjectProperty(objid,properStr){
	var groupObj = document.getElementById('group');
	var Love = groupObj.bindClass;
	var node = Love.getNodeById(objid);
	properStr = deCode(properStr);
	if(node!=null){
		node.property = JSONC.decode(properStr);
	}else{
		var line = Love.getLineById(objid);
		if(line!=null){
			line.property = JSONC.decode(properStr);
		}
	}
	document.title = JSON.stringify({action:'designChangeCall'});
	//window.designChangeCall(Love.toJson());
};
function setSelObjectName(objid,newname){
	var groupObj = document.getElementById('group');
	var Love = groupObj.bindClass;
	var node = Love.getNodeById(objid);
	newname = deCode(newname);
	if(node!=null){
		node.name = newname;
		if (node.textObj)
			node.textObj.innerHTML = newname;
		node.obj.title = newname;
	}else{
		var line = Love.getLineById(objid);
		if(line!=null){
			line.name = newname;
			if (line.textObj)
			line.textObj.innerHTML = newname;
			line.obj.title = newname;
		}
	}
	document.title = JSON.stringify({action:'designChangeCall'});
	//window.designChangeCall(Love.toJson());
};
function JavaCreatDomConditionSelect(objid){
	var group = document.getElementById('group');
	var Love = group.bindClass;
	var Lines = Love.lines;
	var optionsArray = new Array();
	for ( var i in Lines) {
		if (Lines[i].fromObj.id == objid) {
			var djson = {
				id : Lines[i].toObj.id,
				name : Lines[i].toObj.name
			};
			optionsArray.push(djson);
		}
	}
	document.title = JSON.stringify({action:'EditorCallJava',option:'setDomConditionSelect',data:JSONC.encode(optionsArray)});
	//window.EditorCallJava('setDomConditionSelect',JSONC.encode(optionsArray));
	return JSONC.encode(optionsArray);
};
function JavaevIsselected(){
	var group = document.getElementById('group');
	var Love = group.bindClass;
	document.title = JSON.stringify({action:'EditorCallJava',option:'setDeleteActionEnable',data:(Love.getSelectedNode().length>0 || Love.getSelectedLine().length>0)});
	//window.EditorCallJava("setDeleteActionEnable", Love.getSelectedNode().length>0 || Love.getSelectedLine().length>0);
};
function JavaparseNode(jsonstr){
	var groupObj = document.getElementById('group');
	var Love = groupObj.bindClass;
	var json = JSONC.decode(jsonstr);
	var hasnodelen = Love.getNodesById(json.id).length;
	if(hasnodelen > 0){
		json.id = json.id + "_" + hasnodelen;
	}
	json.name = json.name + "_" + hasnodelen;
	switch (json.shape) {
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
	node.jsonTo(json);
	node.left = Love.mouseX;
	node.top = Love.mouseY;
	node.init();
	document.title = JSON.stringify({action:'EditorCallJava',option:'add',data:JSONC.encode(node.toJson())});
	//window.EditorCallJava('add', JSONC.encode(node.toJson()));
	document.title = JSON.stringify({action:'designChangeCall'});
	//window.designChangeCall(Love.toJson());
};

function getPageDataJson(){
	var groupObj = document.getElementById('group');
	var Love = groupObj.bindClass;
	var jsonstr = Love.toJson();
	return jsonstr;
}