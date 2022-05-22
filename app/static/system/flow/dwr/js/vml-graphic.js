/*|=========================================//
 **|流程图基础图形
 **|vml
 **|========================================*/

/*
 *直线
 */
function Line() {
	this.id = 'line_';
	this.name = 'New Line';
	this.number = -1;
	this.type = 'line';
	this.shape = 'line';
	this.selected = false;
	this.fromX = -1;
	this.fromY = -1;
	this.toX = -1;
	this.toY = -1;
	this.textFlag = true;
	this.mirrorFlag = false;
	this.obj = null;
	this.strokeObj = null;
	this.textObj = null;
	this.fromObj = null;
	this.toObj = null;
	this.init = function() {
		var groupObj = document.getElementById('group');
		var obj = document.createElement('v:line');
		groupObj.appendChild(obj);
		obj.title = this.name;
		obj.from = '0,0';
		obj.to = '0,0';
		obj.strokecolor = 'blue';
		obj.strokeweight = '1';
		obj.filled = 'false';
		obj.style.position = 'absolute';
		obj.style.zIndex = '1';
		obj.style.cursor = 'hand';
		this.obj = obj;
		var strokeObj = document.createElement('v:stroke');
		obj.appendChild(strokeObj);
		strokeObj.endArrow = "Classic";
		this.strokeObj = strokeObj;
		if (this.textFlag && (this.name.indexOf("line_") < 0)
				&& (this.name.indexOf("New") < 0)) {
			var textObj = document.createElement('v:textbox');
			textObj.inset = '10pt,1pt,5pt,5pt';
			textObj.style.textAlign = 'center';
			textObj.style.verticalAlign = 'bottom';
			textObj.style.color = 'blue';
			textObj.style.fontSize = '9pt';
			textObj.innerHTML = this.name;
			obj.appendChild(textObj);
			this.textObj = textObj;
		}
		if (!this.mirrorFlag) {
			var Love = groupObj.bindClass;
			this.number = Love.getObjectNum();
			this.id = this.id + this.number;
			obj.id = this.id;
			Love.lines[Love.lines.length] = this;
		}
	};
	this.setFrom = function(x, y, obj) {
		this.fromX = GroupEvent.getX(x);
		this.fromY = GroupEvent.getY(y);
		if (obj)
			this.fromObj = obj;
		this.obj.from = this.fromX + ',' + this.fromY;
	};
	this.setTo = function(x, y, obj) {
		this.toX = GroupEvent.getX(x);
		this.toY = GroupEvent.getY(y);
		if (obj)
			this.toObj = obj;
		this.obj.to = this.toX + ',' + this.toY;
	};
	this.setDisplay = function(flag) {
		this.obj.style.display = flag;
	};
	this.link = function(lineMirror) {
		this.fromObj = lineMirror.fromObj;
		this.toObj = lineMirror.toObj;
		this.relink();
		this.fromObj.clearSelected();
	};
	this.relink = function() {
		var fromDots = this.fromObj.getDots();
		var toDots = this.toObj.getDots();
		var fromDotNum = fromDots.length;
		var toDotNum = toDots.length;
		var lineLen = -1;
		var fromDot;
		var toDot;
		for (var i = 0; i < fromDotNum; i++) {
			for (var j = 0; j < toDotNum; j++) {
				if (lineLen < 0) {
					lineLen = this.getLineLength(fromDots[i].x, fromDots[i].y,
							toDots[j].x, toDots[j].y);
					fromDot = fromDots[i];
					toDot = toDots[j];
				} else if (lineLen > this.getLineLength(fromDots[i].x,
						fromDots[i].y, toDots[j].x, toDots[j].y)) {
					lineLen = this.getLineLength(fromDots[i].x, fromDots[i].y,
							toDots[j].x, toDots[j].y);
					fromDot = fromDots[i];
					toDot = toDots[j];
				}
			}
		}
		this.fromX = fromDot.x;
		this.fromY = fromDot.y;
		this.toX = toDot.x;
		this.toY = toDot.y;
		this.obj.from = this.fromX + ',' + this.fromY;
		this.obj.to = this.toX + ',' + this.toY;
	};
	this.getLineLength = function(x1, y1, x2, y2) {
		return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
	};
	this.pointInObj = function(x, y) {
		var res = false;
		x = GroupEvent.getX(x);
		y = GroupEvent.getY(y);
		var x1 = this.fromX;
		var x2 = this.toX;
		var y1 = this.fromY;
		var y2 = this.toY;
		var x21 = x2 - x1;
		var y21 = y2 - y1;
		if (x21 == 0) {
			res = (Math.abs(x - x1) < 5) && (Math.min(y1, y2) <= y)
					&& (Math.max(y1, y2) >= y);
		} else if (y21 == 0) {
			res = (Math.abs(y - y1) < 5) && (Math.min(x1, x2) <= x)
					&& (Math.max(x1, x2) >= x);
		} else {
			res = (Math.min(y1, y2) <= y)
					&& (Math.max(y1, y2) >= y)
					&& (Math.min(x1, x2) <= x)
					&& (Math.max(x1, x2) >= x)
					&& ((Math.abs(Math.floor((x21 / y21) * (y - y1) + x1 - x)) < 5) || (Math
							.abs(Math.floor((y21 / x21) * (x - x1) + y1 - y)) < 5));
		}
		return res;
	};
	this.pointInStroke = function(x, y) {
		var res = -1;
		x = GroupEvent.getX(x);
		y = GroupEvent.getY(y);
		var x1 = this.fromX;
		var x2 = this.toX;
		var y1 = this.fromY;
		var y2 = this.toY;
		if ((Math.abs(x2 - x) < 6) && (Math.abs(y2 - y) < 6))
			res = 0;
		if ((Math.abs(x1 - x) < 6) && (Math.abs(y1 - y) < 6))
			res = 1;
		return res;
	};
	this.setSelected = function() {
		this.obj.strokecolor = 'green';
		if (this.textObj)
			this.textObj.style.color = 'green';
		this.selected = true;
		this.obj.style.zIndex = '22';
	};
	this.move = function() {
	};
	this.moveEnd = function() {
	};
	this.setMoveSelected = function() {
		this.obj.strokecolor = 'red';
		if (this.textObj)
			this.textObj.style.color = 'green';
		this.selected = true;
		this.obj.style.zIndex = '22';
	};
	this.clearSelected = function() {
		this.obj.strokecolor = 'blue';
		if (this.textObj)
			this.textObj.style.color = 'blue';
		this.selected = false;
		this.obj.style.zIndex = '2';
	};
	this.setPassed = function() {// 经过
		this.obj.strokecolor = 'green';
		if (this.textObj)
			this.textObj.style.color = 'green';
	};
	this.setPassBack = function() {// 回退
		this.obj.strokecolor = 'red';
		if (this.textObj)
			this.textObj.style.color = 'red';
	};
	this.remove = function() {
		var group = document.getElementById('group');
		group.removeChild(this.obj);
	};
}

// 矩形环节
function Node() {
	this.id = 'bizActivity';
	this.name = 'New bizActivity';
	this.number = -1;
	this.type = 'node';
	this.shape = 'rect';
	this.property = null;
	this.selected = false;
	this.left = 300;
	this.top = 80;
	this.width = 100;
	this.height = 40;
	this.mouseX = -1;
	this.mouseY = -1;
	this.x = -1;
	this.y = -1;
	this.strokeFlag = false;
	this.shadowFlag = true;
	this.textFlag = true;
	this.mirrorFlag = false;
	this.obj = null;
	this.shadowObj = null;
	this.textObj = null;
	this.strokeObj = null;
	this.init = function() {
		var groupObj = document.getElementById('group');
		var obj = document.createElement('v:rect');
		obj.strokecolor = 'blue';
		obj.strokeweight = '1';
		groupObj.appendChild(obj);
		obj.id = this.id;
		obj.title = this.name;
		var dpix = js_getDPIx();
		$(obj).css("position", 'absolute');
		$(obj).css("left", this.left + "px");
		$(obj).css("top", this.top + "px");
		$(obj).css("width", (this.width * dpix[0]) + "px");
		$(obj).css("height", (this.height * dpix[1]) + "px");
		$(obj).css("cursor", "default");
		$(obj).css("z-index", 1);
		this.obj = obj;
		if (this.shadowFlag) {
			var shadowObj = document.createElement('v:shadow');
			shadowObj.on = 'T';
			shadowObj.type = 'single';
			shadowObj.color = '#b3b3b3';
			shadowObj.offset = '2px,2px';
			obj.appendChild(shadowObj);
			this.shadowObj = shadowObj;
		}
		if (this.strokeFlag) {
			var strokeObj = document.createElement('v:stroke');
			obj.appendChild(strokeObj);
			this.strokeObj = strokeObj;
		}
		if (this.textFlag) {
			var textObj = document.createElement('v:textbox');
			textObj.inset = '2pt,5pt,2pt,5pt';
			textObj.id = this.id + "_Label";
			textObj.style.textAlign = 'center';
			textObj.style.color = '#000000';
			textObj.style.fontSize = '9pt';
			textObj.style.lineHeight = '18pt';
			textObj.innerHTML = this.name;
			obj.appendChild(textObj);
			this.textObj = textObj;
		}
		if (!this.mirrorFlag) {
			var Love = groupObj.bindClass;
			if (this.number < 0) {
				this.number = Love.getObjectNum();
				this.id = this.id + this.number;
				obj.id = this.id;
				this.name = this.id;
				this.obj.title = this.id;
				this.textObj.innerHTML = this.id;
			}
			Love.nodes[Love.nodes.length] = this;
		}
		obj.node = this;
		$(obj).resizable(
				{
					maxWidth : 800,
					maxHeight : 600,
					minWidth : 100,
					minHeight : 40,
					onResize : function(e) {
						this.action = Love.action;
						var Love = groupObj.bindClass;
						Love.action = "resizeNode";
						Love.drawMirrorNodeEnd();
					},
					onStopResize : function(e) {
						this.node.width = $(this).width();
						this.node.height = $(this).height();
						var Love = groupObj.bindClass;
						for (var j = 0; j < Love.lines.length; j++) {
							line = Love.lines[j];
							if ((line.fromObj == this.node)
									|| (line.toObj == this.node)) {
								line.relink();
							}
						}
						Love.action = this.action;
					}
				});
	};
	this.setDisplay = function(flag) {
		this.obj.style.display = flag;
	};
	this.pointInObj = function(x, y) {
		var res = false;
		x = GroupEvent.getX(x);
		y = GroupEvent.getY(y);
		var x1 = this.left;
		var x2 = x1 + this.width;
		var y1 = this.top;
		var y2 = y1 + this.height;
		if ((x >= x1) && (x <= x2) && (y >= y1) && (y <= y2)) {
			this.mouseX = x;
			this.mouseY = y;
			this.x = x - this.obj.offsetLeft;
			this.y = y - this.obj.offsetTop;
			res = true;
		}
		return res;
	};
	this.move = function(x, y, mouseX, mouseY) {
		this.left = GroupEvent.getX(x) - this.x - GroupEvent.getX(mouseX)
				+ this.mouseX;
		this.top = GroupEvent.getY(y) - this.y - GroupEvent.getY(mouseY)
				+ this.mouseY;
		this.obj.style.left = this.left + 'px';
		this.obj.style.top = this.top + 'px';
		this.obj.style.cursor = 'move';
	};
	this.moveEnd = function() {
		this.x = 0;
		this.y = 0;
		this.mouseX = this.left;
		this.mouseY = this.top;
		this.obj.style.cursor = 'hand';
	};
	this.setSelected = function() {
		if (this.shadowFlag) {
			this.shadowObj.color = 'green';
		}
		$(this.obj).css("z-index", 99999);
		this.obj.strokecolor = 'green';
		this.textObj.style.color = 'green';
		this.selected = true;
	};
	this.clearSelected = function() {
		if (this.shadowFlag) {
			this.shadowObj.color = '#b3b3b3';
		}
		$(this.obj).css("z-index", 1);
		this.obj.strokecolor = 'blue';
		this.textObj.style.color = 'blue';
		this.selected = false;
	};
	this.setPassed = function() {// 经过
		if (this.shadowFlag) {
			this.shadowObj.color = 'green';
		}
		this.obj.strokecolor = 'green';
		if (this.textObj)
			this.textObj.style.color = 'green';
	};
	this.setPassOn = function() {// 当前
		if (this.shadowFlag) {
			this.shadowObj.color = 'blue';
		}
		this.obj.strokecolor = 'blue';
		if (this.textObj)
			this.textObj.style.color = 'blue';
	};
	this.remove = function() {
		var group = document.getElementById('group');
		var Love = group.getAttribute('bindClass');
		var arr = new Array();
		var count = 0;
		for (var j = 0; j < Love.lines.length; j++) {
			var line = Love.lines[j];
			if ((line.fromObj == this) || (line.toObj == this)) {
				line.remove();
			} else {
				arr[count] = line;
				count++;
			}
		}
		Love.lines = arr;
		group.removeChild(this.obj);
	};
	this.setLeft = function(n) {
		this.left = n;
		this.obj.style.left = n;
	};
	this.setTop = function(n) {
		this.top = n;
		this.obj.style.top = n;
	};
	this.setWidth = function(n) {
		this.width = n;
		this.obj.style.width = n;
	};
	this.setHeight = function(n) {
		this.height = n;
		this.obj.style.height = n;
	};
	this.getDots = function() {
		var l = this.left;
		var t = this.top;
		var w = this.width;
		var h = this.height;
		var dots = new Array();
		var dot;
		dots[dots.length] = {
			x : l,
			y : t + h / 2
		};
		dots[dots.length] = {
			x : l + w,
			y : t + h / 2
		};
		dots[dots.length] = {
			x : l + w / 2,
			y : t
		};
		dots[dots.length] = {
			x : l + w / 2,
			y : t + h
		};
		dots[dots.length] = {
			x : l,
			y : t
		};
		dots[dots.length] = {
			x : l + w,
			y : t
		};
		dots[dots.length] = {
			x : l,
			y : t + h
		};
		dots[dots.length] = {
			x : l + w,
			y : t + h
		};
		return dots;
	};
	this.setProperty = function(type) {
		Prop.clear();
		$("#" + type + '_p_id').val(this.id);
		$("#" + type + '_p_name').val(this.name);
		if (this.property) {
			var num = this.property.length;
			for (var i = 0; i < num; i++) {
				switch (this.property[i].text) {
				case 'span':
					try {
						$("#" + this.property[i].id).text(
								this.property[i].value);
					} catch (e) {
						$("#" + this.property[i].id)
								.val(this.property[i].value);
					}
					break;
				default:
					try {
						$("#" + this.property[i].id)
								.val(this.property[i].value);
					} catch (e) {
					}
					break;
				}
			}
		}
	};
	this.getProperty = function(property) {
		this.property = property;
		this.name = property.n_p_name;
		this.title = this.name;
	};
	this.toJson = function() {
		var json = {
			id : this.id,
			name : this.name,
			type : this.type,
			shape : this.shape,
			number : this.number,
			left : this.left,
			top : this.top,
			width : this.width,
			height : this.height,
			property : this.property
		};
		return json;
	};
	this.jsonTo = function(json) {
		this.id = json.id;
		this.name = json.name;
		this.type = json.type;
		this.shape = json.shape;
		this.number = json.number;
		this.left = json.left;
		this.top = json.top;
		this.width = json.width;
		this.height = json.height;
		this.property = json.property;
	};
}

// 菱形图形
function Condition() {
	this.id = 'condition_';
	this.name = 'New Condition';
	this.number = -1;
	this.type = 'condition';
	this.shape = 'shape';
	this.property = null;
	this.selected = false;
	this.left = 300;
	this.top = 80;
	this.width = 120;
	this.height = 50;
	this.mouseX = -1;
	this.mouseY = -1;
	this.x = -1;
	this.y = -1;
	this.strokeFlag = false;
	this.shadowFlag = true;
	this.textFlag = true;
	this.mirrorFlag = false;
	this.obj = null;
	this.shadowObj = null;
	this.textObj = null;
	this.strokeObj = null;
	this.init = function() {
		var groupObj = document.getElementById('group');
		var obj = document.createElement('v:shape');
		obj.id = this.id;
		obj.coordsize = "100,100";
		obj.fillcolor = "white";
		obj.path = "m 0,50 l 0,50,50,100,100,50,50,0 x e";
		groupObj.appendChild(obj);
		obj.strokecolor = 'blue';
		obj.strokeweight = '1';
		obj.title = this.name;
		var dpix = js_getDPIx();
		obj.style.position = 'absolute';
		obj.style.left = this.left + "px";
		obj.style.top = this.top + "px";
		obj.style.width = (this.width * dpix[0]) + "px";
		obj.style.height = (this.height * dpix[1]) + "px";
		obj.style.cursor = 'hand';
		obj.style.zIndex = '1';
		this.obj = obj;
		if (this.shadowFlag) {
			var shadowObj = document.createElement('v:shadow');
			shadowObj.on = 'T';
			shadowObj.type = 'single';
			shadowObj.color = '#b3b3b3';
			shadowObj.offset = '2px,2px';
			obj.appendChild(shadowObj);
			this.shadowObj = shadowObj;
		}
		if (this.strokeFlag) {
			var strokeObj = document.createElement('v:stroke');
			obj.appendChild(strokeObj);
			this.strokeObj = strokeObj;
		}
		if (this.textFlag) {
			var textObj = document.createElement('v:textbox');
			textObj.inset = '2pt,12pt,2pt,12pt';
			textObj.style.textAlign = 'center';
			textObj.style.color = 'blue';
			textObj.style.fontSize = '12px';
			textObj.innerHTML = this.name;
			obj.appendChild(textObj);
			this.textObj = textObj;
		}
		if (!this.mirrorFlag) {
			var Love = groupObj.bindClass;
			if (this.number < 0) {
				this.number = Love.getObjectNum();
				this.id = this.id + this.number;
				obj.id = this.id;
				this.name = this.id;
				this.obj.title = this.id;
				this.textObj.innerHTML = this.id;
			}
			Love.nodes[Love.nodes.length] = this;
		}
	};
	this.setDisplay = function(flag) {
		this.obj.style.display = flag;
	};
	this.pointInObj = function(x, y) {
		var res = false;
		x = GroupEvent.getX(x);
		y = GroupEvent.getY(y);
		var x1 = this.left;
		var x2 = x1 + this.width;
		var y1 = this.top;
		var y2 = y1 + this.height;
		if ((x >= x1) && (x <= x2) && (y >= y1) && (y <= y2)) {
			this.mouseX = x;
			this.mouseY = y;
			this.x = x - this.obj.offsetLeft;
			this.y = y - this.obj.offsetTop;
			res = true;
		}
		return res;
	};
	this.move = function(x, y, mouseX, mouseY) {
		this.left = GroupEvent.getX(x) - this.x - GroupEvent.getX(mouseX)
				+ this.mouseX;
		this.top = GroupEvent.getY(y) - this.y - GroupEvent.getY(mouseY)
				+ this.mouseY;
		this.obj.style.left = this.left + 'px';
		this.obj.style.top = this.top + 'px';
		this.obj.style.cursor = 'move';
	};
	this.moveEnd = function() {
		this.x = 0;
		this.y = 0;
		this.mouseX = this.left;
		this.mouseY = this.top;
		this.obj.style.cursor = 'hand';
	};
	this.setSelected = function() {
		if (this.shadowFlag)
			this.shadowObj.color = 'green';
		if (this.obj.shape) {
			this.obj.shape.stroke({
				color : 'green'
			});
		}
		this.obj.strokecolor = 'green';
		this.textObj.style.color = 'green';
		this.selected = true;
	};
	this.clearSelected = function() {
		if (this.shadowFlag)
			this.shadowObj.color = '#b3b3b3';
		if (this.obj.shape) {
			this.obj.shape.stroke({
				color : 'blue'
			});
		}
		this.obj.strokecolor = 'blue';
		this.textObj.style.color = 'blue';
		this.selected = false;
	};
	this.setPassed = function() {// 经过
		if (this.shadowFlag)
			this.shadowObj.color = 'green';
		if (this.obj.shape) {
			this.obj.shape.stroke({
				color : 'green'
			});
		}
		this.obj.strokecolor = 'green';
		if (this.textObj)
			this.textObj.style.color = 'green';
	};
	this.setPassOn = function() {// 当前
		if (this.shadowFlag)
			this.shadowObj.color = 'blue';
		if (this.obj.shape) {
			this.obj.shape.stroke({
				color : 'blue'
			});
		}
		this.obj.strokecolor = 'blue';
		if (this.textObj)
			this.textObj.style.color = 'blue';
	};
	this.remove = function() {
		var group = document.getElementById('group');
		var Love = group.getAttribute('bindClass');
		var arr = new Array();
		var count = 0;
		for (var j = 0; j < Love.lines.length; j++) {
			var line = Love.lines[j];
			if ((line.fromObj == this) || (line.toObj == this)) {
				line.remove();
			} else {
				arr[count] = line;
				count++;
			}
		}
		Love.lines = arr;
		group.removeChild(this.obj);
	};
	this.setLeft = function(n) {
		this.left = n;
		this.obj.style.left = n;
	};
	this.setTop = function(n) {
		this.top = n;
		this.obj.style.top = n;
	};
	this.setWidth = function(n) {
		this.width = n;
		this.obj.style.width = n;
	};
	this.setHeight = function(n) {
		this.height = n;
		this.obj.style.height = n;
	};
	this.getDots = function() {
		var l = this.left;
		var t = this.top;
		var w = this.width;
		var h = this.height;
		var dots = new Array();
		var dot;
		dots[dots.length] = {
			x : l,
			y : t + h / 2
		};
		dots[dots.length] = {
			x : l + w,
			y : t + h / 2
		};
		dots[dots.length] = {
			x : l + w / 2,
			y : t
		};
		dots[dots.length] = {
			x : l + w / 2,
			y : t + h
		};
		dots[dots.length] = {
			x : l,
			y : t
		};
		dots[dots.length] = {
			x : l + w,
			y : t
		};
		dots[dots.length] = {
			x : l,
			y : t + h
		};
		dots[dots.length] = {
			x : l + w,
			y : t + h
		};
		return dots;
	};
	this.setProperty = function(type) {
		Prop.clear();
		$("#" + type + '_p_id').text(this.id);
		$("#" + type + '_p_name').val(this.name);
		if (this.property) {
			var num = this.property.length;
			for (var i = 0; i < num; i++) {
				switch (this.property[i].text) {
				case 'span':
					$("#" + this.property[i].id).text(this.property[i].value);
					break;
				case 'select':
					try {
						var Selecttext = document.getElementById("group").bindClass
								.getNodeById(this.property[i].value).name;
						document.getElementById(this.property[i].id).options[0] = new Option(
								Selecttext, this.property[i].value);
						document.getElementById(this.property[i].id).value = this.property[i].value;
					} catch (e) {
					}
					break;
				default:
					try {
						document.getElementById(this.property[i].id).value = this.property[i].value;
					} catch (e) {
					}
					break;
				}
			}
		}
	};
	this.getProperty = function(property) {
		this.property = property;
		this.name = property.n_p_name;
		this.title = this.name;
	};
	this.toJson = function() {
		var json = {
			id : this.id,
			name : this.name,
			type : this.type,
			shape : this.shape,
			number : this.number,
			left : this.left,
			top : this.top,
			width : this.width,
			height : this.height,
			property : this.property
		};
		return json;
	};
	this.jsonTo = function(json) {
		this.id = json.id;
		this.name = json.name;
		this.type = json.type;
		this.shape = json.shape;
		this.number = json.number;
		this.left = json.left;
		this.top = json.top;
		this.width = json.width;
		this.height = json.height;
		this.property = json.property;
	};
}

// 图片图形
function NodeImg() {
	this.id = 'bizActivity';
	this.name = 'New bizActivity';
	this.number = -1;
	this.type = 'node';
	this.shape = 'img';
	this.property = null;
	this.selected = false;
	this.left = 300;
	this.top = 80;
	this.width = 75;
	this.height = 70;
	this.imgHeight = 35;
	this.imgWidth = 35;
	this.textHeight = 35;
	this.textWidth = 75;
	this.imgDLeft = 20;
	this.textDTop = 40;
	this.mouseX = -1;
	this.mouseY = -1;
	this.x = -1;
	this.y = -1;
	this.strokeFlag = false;
	this.shadowFlag = true;
	this.textFlag = true;
	this.mirrorFlag = false;
	this.obj = null;
	this.shadowObj = null;
	this.textObj = null;
	this.strokeObj = null;
	this.init = function() {
		var groupObj = document.getElementById('group');
		var obj = document.createElement('img');
		obj.src = 'img/img.gif';
		groupObj.appendChild(obj);
		obj.title = this.name;
		obj.style.position = 'absolute';
		obj.style.left = this.left + this.imgDLeft;
		obj.style.top = this.top;
		obj.style.width = this.imgWidth;
		obj.style.height = this.imgHeight;
		obj.style.cursor = 'hand';
		obj.style.zIndex = '1';
		this.obj = obj;
		if (this.textFlag) {
			var textObj = document.createElement('div');
			textObj.style.backgroundColor = '#CEDEF0';
			textObj.style.position = 'absolute';
			textObj.style.left = this.left;
			textObj.style.top = this.top + this.textDTop;
			textObj.style.width = this.textWidth;
			textObj.style.height = this.textHeight;
			textObj.style.textAlign = 'center';
			textObj.style.fontSize = '9pt';
			textObj.style.wordBreak = 'break-all';
			textObj.style.overflow = 'hidden';
			textObj.style.zIndex = '0';
			textObj.innerHTML = this.name;
			textObj.style.zIndex = '1';
			groupObj.appendChild(textObj);
			this.textObj = textObj;
		}
		if (!this.mirrorFlag) {
			var Love = groupObj.bindClass;
			if (this.number < 0) {
				this.number = Love.getObjectNum();
				this.id = this.id + this.number;
				obj.id = this.id;
				this.name = this.id;
				this.obj.title = this.id;
				if (this.textObj)
					this.textObj.innerHTML = this.id;
			}
			Love.nodes[Love.nodes.length] = this;
		}
	};
	this.setDisplay = function(flag) {
		this.obj.style.display = flag;
		this.textObj.style.display = flag;
	};
	this.pointInObj = function(x, y) {
		var res = false;
		x = GroupEvent.getX(x);
		y = GroupEvent.getY(y);
		var x1 = this.left + this.imgDLeft;
		var x2 = x1 + this.imgWidth;
		var y1 = this.top;
		var y2 = y1 + this.imgHeight;
		if ((x >= x1) && (x <= x2) && (y >= y1) && (y <= y2)) {
			this.mouseX = x;
			this.mouseY = y;
			this.x = x - this.obj.offsetLeft + this.imgDLeft;
			this.y = y - this.obj.offsetTop;
			res = true;
		}
		return res;
	};
	this.move = function(x, y, mouseX, mouseY) {
		this.left = GroupEvent.getX(x) - this.x - GroupEvent.getX(mouseX)
				+ this.mouseX;
		this.top = GroupEvent.getY(y) - this.y - GroupEvent.getY(mouseY)
				+ this.mouseY;
		this.obj.style.left = this.left + this.imgDLeft;
		this.obj.style.top = this.top;
		this.textObj.style.left = this.left;
		this.textObj.style.top = this.top + this.textDTop;
		this.obj.style.cursor = 'move';
	};
	this.moveEnd = function() {
		this.x = 0;
		this.y = 0;
		this.mouseX = this.left;
		this.mouseY = this.top;
		this.obj.style.cursor = 'hand';
	};
	this.setSelected = function() {
		this.textObj.style.backgroundColor = 'green';
		this.textObj.style.color = '#ffffff';
		this.selected = true;
	};
	this.clearSelected = function() {
		this.textObj.style.backgroundColor = '#CEDEF0';
		this.textObj.style.color = '';
		this.selected = false;
	};
	this.remove = function() {
		var group = document.getElementById('group');
		var Love = group.getAttribute('bindClass');
		var arr = new Array();
		var count = 0;
		for (var j = 0; j < Love.lines.length; j++) {
			var line = Love.lines[j];
			if ((line.fromObj == this) || (line.toObj == this)) {
				line.remove();
			} else {
				arr[count] = line;
				count++;
			}
		}
		Love.lines = arr;
		group.removeChild(this.obj);
		group.removeChild(this.textObj);
	};
	this.setLeft = function(n) {
		this.left = n;
		this.obj.style.left = this.left + this.imgDLeft;
		this.textObj.style.left = this.left;
	};
	this.setTop = function(n) {
		this.top = n;
		this.obj.style.top = this.top;
		this.textObj.style.top = this.top + this.textDTop;
	};
	this.setWidth = function(n) {
		this.width = n;
		this.obj.style.width = n;
	};
	this.setHeight = function(n) {
		this.height = n;
		this.obj.style.height = n;
	};
	this.getDots = function() {
		var l = this.left;
		var t = this.top;
		var w = this.width;
		var h = this.height;
		var dots = new Array();
		var dot;
		dots[dots.length] = {
			x : l + this.imgDLeft,
			y : t + this.imgHeight / 2
		};
		dots[dots.length] = {
			x : l + this.imgDLeft + this.imgWidth,
			y : t + this.imgHeight / 2
		};
		dots[dots.length] = {
			x : l + w / 2,
			y : t
		};
		dots[dots.length] = {
			x : l + w / 2,
			y : t + h
		};
		return dots;
	};
	this.setProperty = function(type) {
		Prop.clear();
		document.getElementById(type + '_p_id').value = this.id;
		document.getElementById(type + '_p_name').value = this.name;
		if (this.property) {
			var num = this.property.length;
			for (var i = 0; i < num; i++) {
				switch (this.property[i].text) {
				case 'span':
					document.getElementById(this.property[i].id).innerHTML = this.property[i].value;
					break;
				default:
					try {
						document.getElementById(this.property[i].id).value = this.property[i].value;
					} catch (e) {
					}
					break;
				}
			}
		}
	};
	this.getProperty = function(property) {
		this.property = property;
		this.name = property.n_p_name;
		this.title = this.name;
	};
	this.toJson = function() {
		var json = {
			id : this.id,
			name : this.name,
			type : this.type,
			shape : this.shape,
			number : this.number,
			left : this.left,
			top : this.top,
			width : this.width,
			height : this.height,
			property : this.property
		};
		return json;
	};
	this.jsonTo = function(json) {
		this.id = json.id;
		this.name = json.name;
		this.type = json.type;
		this.shape = json.shape;
		this.number = json.number;
		this.left = json.left;
		this.top = json.top;
		this.width = json.width;
		this.height = json.height;
		this.property = json.property;
	};
}

// 圆形图形
function NodeOval() {
	this.id = 'Activity';
	this.name = '开始';
	this.number = -1;
	this.type = 'start';
	this.shape = 'oval';
	this.property = null;
	this.selected = false;
	this.left = 300;
	this.top = 80;
	this.width = 40;
	this.height = 40;
	this.mouseX = -1;
	this.mouseY = -1;
	this.x = -1;
	this.y = -1;
	this.strokeFlag = false;
	this.shadowFlag = true;
	this.textFlag = true;
	this.mirrorFlag = false;
	this.obj = null;
	this.shadowObj = null;
	this.textObj = null;
	this.strokeObj = null;
	this.init = function() {
		var groupObj = document.getElementById('group');
		var obj = document.createElement('v:oval');
		groupObj.appendChild(obj);
		if (this.type == 'start') {
			obj.fillcolor = '#33CC00';
			obj.strokecolor = '#33CC00';
		} else {
			obj.fillcolor = 'red';
			obj.strokecolor = 'red';
		}
		var dpix = js_getDPIx();
		obj.strokeweight = '1';
		obj.title = this.name;
		obj.style.position = 'absolute';
		obj.style.left = this.left + "px";
		obj.style.top = this.top + "px";
		obj.style.width = (this.width * dpix[0]) + "px";
		obj.style.height = (this.height * dpix[0]) + "px";
		obj.style.cursor = 'pointer';
		obj.style.zIndex = '1';
		this.obj = obj;
		if (this.shadowFlag) {
			var shadowObj = document.createElement('v:shadow');
			shadowObj.on = false;
			shadowObj.type = 'single';
			shadowObj.color = '#b3b3b3';
			shadowObj.offset = '3px,3px';
			obj.appendChild(shadowObj);
			this.shadowObj = shadowObj;
		}
		if (this.strokeFlag) {
			var strokeObj = document.createElement('v:stroke');
			obj.appendChild(strokeObj);
			this.strokeObj = strokeObj;
		}
		if (this.textFlag) {
			var textObj = document.createElement('v:textbox');
			textObj.inset = '2pt,5pt,2pt,5pt';
			textObj.style.textAlign = 'center';
			textObj.style.color = 'blue';
			textObj.style.fontSize = '9pt';
			textObj.innerHTML = this.name;
			obj.appendChild(textObj);
			this.textObj = textObj;
		}
		if (!this.mirrorFlag) {
			var Love = groupObj.bindClass;
			if (this.number < 0) {
				this.number = Love.getObjectNum();
				this.id = this.id + this.number;
				obj.id = this.id;
				this.obj.title = this.name;
				if (this.textObj)
					this.textObj.innerHTML = this.name;
			}
			Love.nodes[Love.nodes.length] = this;
		}
	};
	this.setType = function(type) {
		if (type)
			this.type = type;
	};
	this.setName = function(name) {
		if (name)
			this.name = name;
	};
	this.setDisplay = function(flag) {
		this.obj.style.display = flag;
	};
	this.pointInObj = function(x, y) {
		var res = false;
		x = GroupEvent.getX(x);
		y = GroupEvent.getY(y);
		var x1 = this.left;
		var x2 = x1 + this.width;
		var y1 = this.top;
		var y2 = y1 + this.height;
		var centerX = x1 + this.width / 2;
		var centerY = y1 + this.height / 2;
		var radius = this.width / 2;
		var d = (x - centerX) * (x - centerX) + (y - centerY) * (y - centerY);
		if ((radius * radius) > d) {
			this.mouseX = x;
			this.mouseY = y;
			this.x = x - this.obj.offsetLeft;
			this.y = y - this.obj.offsetTop;
			res = true;
		}
		return res;
	};
	this.move = function(x, y, mouseX, mouseY) {
		this.obj.style.left = GroupEvent.getX(x) - this.x
				- GroupEvent.getX(mouseX) + this.mouseX;
		this.obj.style.top = GroupEvent.getY(y) - this.y
				- GroupEvent.getY(mouseY) + this.mouseY;
		this.left = parseInt(this.obj.style.left);
		this.top = parseInt(this.obj.style.top);
		this.obj.style.cursor = 'move';
	};
	this.moveEnd = function() {
		this.x = 0;
		this.y = 0;
		this.mouseX = this.left;
		this.mouseY = this.top;
		this.obj.style.cursor = 'hand';
	};
	this.setSelected = function() {
		this.shadowObj.on = 'T';
		if (this.textObj)
			this.textObj.style.color = 'green';
		this.selected = true;
	};
	this.clearSelected = function() {
		this.shadowObj.on = false;
		if (this.textObj)
			this.textObj.style.color = 'blue';
		this.selected = false;
	};
	this.remove = function() {
		var group = document.getElementById('group');
		var Love = group.getAttribute('bindClass');
		var arr = new Array();
		var count = 0;
		for (var j = 0; j < Love.lines.length; j++) {
			var line = Love.lines[j];
			if ((line.fromObj == this) || (line.toObj == this)) {
				line.remove();
			} else {
				arr[count] = line;
				count++;
			}
		}
		Love.lines = arr;
		group.removeChild(this.obj);
	};
	this.setLeft = function(n) {
		this.left = n;
		this.obj.style.left = n;
	};
	this.setTop = function(n) {
		this.top = n;
		this.obj.style.top = n;
	};
	this.setWidth = function(n) {
		this.width = n;
		this.obj.style.width = n;
	};
	this.setHeight = function(n) {
		this.height = n;
		this.obj.style.height = n;
	};
	this.getDots = function() {
		var l = this.left;
		var t = this.top;
		var w = this.width;
		var h = this.height;
		var dots = new Array();
		var dot;
		dots[dots.length] = {
			x : l,
			y : t + h / 2
		};
		dots[dots.length] = {
			x : l + w,
			y : t + h / 2
		};
		dots[dots.length] = {
			x : l + w / 2,
			y : t
		};
		dots[dots.length] = {
			x : l + w / 2,
			y : t + h
		};
		return dots;
	};
	this.setProperty = function(type) {
		Prop.clear();
		$("#" + type + '_p_id').val(this.id);
		$("#" + type + '_p_name').val(this.name);
		if (this.property) {
			var num = this.property.length;
			for (var i = 0; i < num; i++) {
				switch (this.property[i].text) {
				case 'span':
					$("#" + this.property[i].id).text(this.property[i].value);
					break;
				default:
					$("#" + this.property[i].id).val(this.property[i].value);
					break;
				}
			}
		}
	};
	this.getProperty = function(property) {
		this.property = property;
		this.name = property.n_p_name;
		this.title = this.name;
	};
	this.toJson = function() {
		var json = {
			id : this.id,
			name : this.name,
			type : this.type,
			shape : this.shape,
			number : this.number,
			left : this.left,
			top : this.top,
			width : this.width,
			height : this.height,
			property : this.property
		};
		return json;
	};
	this.jsonTo = function(json) {
		this.id = json.id;
		this.name = json.name;
		this.type = json.type;
		this.shape = json.shape;
		this.number = json.number;
		this.left = json.left;
		this.top = json.top;
		this.width = json.width;
		this.height = json.height;
		this.property = json.property;
	};
}

// 折线
function PolyLine() {
	this.id = 'line_';
	this.name = 'New Line';
	this.number = -1;
	this.type = 'line';
	this.shape = 'polyline';
	this.property = null;
	this.selected = false;
	this.fromX = -1;
	this.fromY = -1;
	this.toX = -1;
	this.toY = -1;
	this.polyDot = [];
	this.sfromX = 0;
	this.sfromY = 0;
	this.stoX = 0;
	this.stoY = 0;
	this.showpolyDot = [];
	this.textFlag = true;
	this.mirrorFlag = false;
	this.obj = null;
	this.strokeObj = null;
	this.textObj = null;
	this.fromObj = null;
	this.toObj = null;
	this.spwidth = 0;
	this.spheight = 0;
	this.init = function() {
		var groupObj = document.getElementById('group');
		var obj = document.createElement('v:polyline');
		groupObj.appendChild(obj);
		obj.title = this.name;
		obj.points.value = this.getPointsValue();
		obj.strokecolor = 'blue';
		obj.strokeweight = '1';
		obj.filled = 'false';
		obj.title = this.name;
		obj.style.position = 'absolute';
		obj.style.left = 0;
		obj.style.top = 0;
		obj.style.zIndex = 1;
		obj.style.cursor = 'hand';
		this.obj = obj;
		var strokeObj = document.createElement('v:stroke');
		obj.appendChild(strokeObj);
		strokeObj.endArrow = "Classic";
		this.strokeObj = strokeObj;
		if (this.textFlag && (this.name.indexOf("line_") < 0)
				&& (this.name.indexOf("New") < 0)) {
			var textObj = document.createElement('v:textbox');
			textObj.inset = '8pt,1pt,3pt,3pt';
			textObj.style.textAlign = 'center';
			textObj.style.verticalAlign = 'bottom';
			textObj.style.color = 'blue';
			textObj.style.fontSize = '9pt';
			textObj.innerHTML = this.name;
			obj.appendChild(textObj);
			this.textObj = textObj;
		}
		if (!this.mirrorFlag) {
			var Love = groupObj.bindClass;
			if (this.number < 0) {
				this.number = Love.getObjectNum();
				this.id = this.id + this.number;
				obj.id = this.id;
				this.name = this.id;
				this.obj.title = this.id;
			}
			Love.lines[Love.lines.length] = this;
		}
	};
	// 设置标题[标签]
	this.setTitle = function(title) {
		if (this.obj.textObj)
			this.obj.textObj.innerHTML = title;
	};
	this.setFrom = function(x, y, obj) {
		this.fromX = GroupEvent.getX(x);
		this.fromY = GroupEvent.getY(y);
		if (obj)
			this.fromObj = obj;
		this.polyDot = [];
		this.obj.points.value = this.getPointsValue();
	};
	this.setTo = function(x, y, obj) {
		this.toX = GroupEvent.getX(x);
		this.toY = GroupEvent.getY(y);
		if (obj)
			this.toObj = obj;
		this.polyDot = [];
		this.obj.points.value = this.getPointsValue();
	};
	this.setDisplay = function(flag) {
		this.obj.style.display = flag;
	};
	this.setShape = function(shape) {
		if (shape)
			this.shape = shape;
	};
	this.link = function(lineMirror) {
		this.fromObj = lineMirror.fromObj;
		this.toObj = lineMirror.toObj;
		this.spwidth += (lineMirror.spwidth) ? lineMirror.spwidth : 0;
		this.spheight += (lineMirror.spheight) ? lineMirror.spheight : 0;
		this.relink(this.spwidth, this.spheight);
		this.fromObj.clearSelected();
	};
	this.relink = function(spwidth, spheight) {
		var fromDots = this.fromObj.getDots();
		var toDots = this.toObj.getDots();
		switch (this.shape) {
		case 'polyline':
			this.relinkPolyline(fromDots, toDots, spwidth, spheight);
			break;
		case 'line':
			this.relinkLine(fromDots, toDots);
			break;
		default:
		}
	};
	this.relinkLine = function(fromDots, toDots) {
		var fromDotNum = fromDots.length;
		var toDotNum = toDots.length;
		var lineLen = -1;
		var fromDot;
		var toDot;
		for (var i = 0; i < fromDotNum; i++) {
			for (var j = 0; j < toDotNum; j++) {
				if (lineLen < 0) {
					lineLen = this.getLineLength(fromDots[i].x, fromDots[i].y,
							toDots[j].x, toDots[j].y);
					fromDot = fromDots[i];
					toDot = toDots[j];
				} else if (lineLen > this.getLineLength(fromDots[i].x,
						fromDots[i].y, toDots[j].x, toDots[j].y)) {
					lineLen = this.getLineLength(fromDots[i].x, fromDots[i].y,
							toDots[j].x, toDots[j].y);
					fromDot = fromDots[i];
					toDot = toDots[j];
				}
			}
		}
		this.fromX = fromDot.x;
		this.fromY = fromDot.y;
		this.toX = toDot.x;
		this.toY = toDot.y;
		this.sfromX = fromDot.x;
		this.sfromY = fromDot.y;
		this.stoX = toDot.x;
		this.stoY = toDot.y;
		var dpix = js_getDPIx();
		if (Math.abs(this.fromX - this.toX) > 0) {
			var dx = Math.abs(this.fromX - this.toX) * dpix[0];
			if (this.fromX > this.toX) {
				this.sfromX = this.toX + dx;
			} else {
				this.stoX = this.fromX + dx;
			}
		}
		if (Math.abs(this.fromY - this.toY) > 0) {
			var dy = Math.abs(this.fromY - this.toY) * dpix[1];
			if (this.fromY > this.toY) {
				this.sfromY = this.toY + dy;
			} else {
				this.stoY = this.fromY + dy;
			}
		}
		this.obj.points.value = this.getPointsValue();
	};
	this.relinkPolyline = function(fromDots, toDots, spwidth, spheight) {
		var fromDot;
		var toDot;
		this.polyDot = [];
		var xflag = -1;
		var yflag = -1;
		if (!spwidth)
			spwidth = 0;
		if (!spheight)
			spheight = 0;
		if ((this.fromObj.left + this.fromObj.width) < toDots[2].x) {
			fromDot = fromDots[1];
			toDot = toDots[0];
			xflag = 0;
		} else if (this.fromObj.left > toDots[2].x) {
			fromDot = fromDots[0];
			toDot = toDots[1];
			xflag = 1;
		} else {
			fromDot = fromDots[1];
			toDot = toDots[1];
			xflag = 2;
		}
		if (fromDots[0].y > toDots[3].y) {
			if (xflag == 2) {
				fromDot = fromDots[0];
				toDot = toDots[0];
				this.polyDot[0] = {
					x : Math.min(fromDot.x, toDot.x) - 30 + spwidth,
					y : fromDot.y
				};
				this.polyDot[1] = {
					x : Math.min(fromDot.x, toDot.x) - 30 + spwidth,
					y : toDot.y
				};
			} else {
				if (xflag == 0) {
					fromDot = fromDots[2];
					toDot = toDots[0];
					this.polyDot[0] = {
						x : fromDot.x,
						y : toDot.y
					};
				} else {
					fromDot = fromDots[0];
					toDot = toDots[3];
					this.polyDot[0] = {
						x : toDot.x,
						y : fromDot.y
					};
				}
			}
		} else if (fromDots[0].y < toDots[2].y) {
			if (xflag == 2) {
				this.polyDot[0] = {
					x : Math.max(fromDot.x, toDot.x) + 30 + spwidth,
					y : fromDot.y
				};
				this.polyDot[1] = {
					x : Math.max(fromDot.x, toDot.x) + 30 + spwidth,
					y : toDot.y
				};
			} else {
				if (xflag == 0) {
					fromDot = fromDots[1];
					toDot = toDots[2];
					this.polyDot[0] = {
						x : toDot.x,
						y : fromDot.y
					};
				} else {
					fromDot = fromDots[3];
					toDot = toDots[1];
					this.polyDot[0] = {
						x : fromDot.x,
						y : toDot.y
					};
				}
			}
		} else {
			if (xflag == 0) {
				fromDot = fromDots[2];
				toDot = toDots[2];
				this.polyDot[0] = {
					x : fromDot.x,
					y : Math.min(fromDot.y, toDot.y) - 20 + spheight
				};
				this.polyDot[1] = {
					x : toDot.x,
					y : Math.min(fromDot.y, toDot.y) - 20 + spheight
				};
			} else if (xflag == 1) {
				fromDot = fromDots[3];
				toDot = toDots[3];
				this.polyDot[0] = {
					x : fromDot.x,
					y : Math.max(fromDot.y, toDot.y) + 20 + spheight
				};
				this.polyDot[1] = {
					x : toDot.x,
					y : Math.max(fromDot.y, toDot.y) + 20 + spheight
				};
			}
		}
		this.fromX = fromDot.x;
		this.fromY = fromDot.y;
		this.toX = toDot.x;
		this.toY = toDot.y;
		this.sfromX = fromDot.x;
		this.sfromY = fromDot.y;
		this.stoX = toDot.x;
		this.stoY = toDot.y;
		this.showpolyDot = this.polyDot;
		var dpix = js_getDPIx();
		if (Math.abs(this.sfromX - this.stoX) > 0) {
			var dx = Math.abs(this.sfromX - this.stoX) * dpix[0];
			if (this.sfromX > this.stoX) {
				this.sfromX = this.stoX + dx;
			} else {
				this.stoX = this.sfromX + dx;
			}
		}
		if (Math.abs(this.sfromY - this.stoY) > 0) {
			var dy = Math.abs(this.sfromY - this.stoY) * dpix[1];
			if (this.sfromY > this.stoY) {
				this.sfromY = this.stoY + dy;
			} else {
				this.stoY = this.sfromY + dy;
			}
		}
		if (this.showpolyDot.length > 0) {
			if (Math.abs(this.showpolyDot[0].x - this.sfromX) > 0) {
				var dx = Math.abs(this.showpolyDot[0].x - this.sfromX)
						* dpix[0];
				if (this.showpolyDot[0].x > this.sfromX) {
					this.showpolyDot[0].x = this.sfromX + dx;
				}
			}
			if (Math.abs(this.showpolyDot[0].y - this.sfromY) > 0) {
				var dx = Math.abs(this.showpolyDot[0].y - this.sfromY)
						* dpix[0];
				if (this.showpolyDot[0].y > this.sfromY) {
					this.showpolyDot[0].y = this.sfromY + dx;
				}
			}
			if (Math.abs(this.showpolyDot[0].x - this.stoX) > 0) {
				var dx = Math.abs(this.showpolyDot[0].x - this.stoX) * dpix[0];
				if (this.showpolyDot[0].x > this.stoX) {
					this.showpolyDot[0].x = this.stoX + dx;
				}
			}
			if (Math.abs(this.showpolyDot[0].y - this.stoY) > 0) {
				var dx = Math.abs(this.showpolyDot[0].y - this.stoY) * dpix[1];
				if (this.showpolyDot[0].y > this.stoY) {
					this.showpolyDot[0].y = this.stoY + dx;
				}
			}
		}
		if (this.showpolyDot.length > 1) {
			if (Math.abs(this.showpolyDot[1].x - this.sfromX) > 0) {
				var dx = Math.abs(this.showpolyDot[1].x - this.sfromX)
						* dpix[0];
				if (this.showpolyDot[1].x > this.sfromX) {
					this.showpolyDot[1].x = this.sfromX + dx;
				}
			}
			if (Math.abs(this.showpolyDot[1].y - this.sfromY) > 0) {
				var dx = Math.abs(this.showpolyDot[1].y - this.sfromY)
						* dpix[0];
				if (this.showpolyDot[1].y > this.sfromY) {
					this.showpolyDot[1].y = this.sfromY + dx;
				}
			}
			if (Math.abs(this.showpolyDot[1].x - this.stoX) > 0) {
				var dx = Math.abs(this.showpolyDot[1].x - this.stoX) * dpix[0];
				if (this.showpolyDot[1].x > this.stoX) {
					this.showpolyDot[1].x = this.stoX + dx;
				}
			}
			if (Math.abs(this.showpolyDot[1].y - this.stoY) > 0) {
				var dx = Math.abs(this.showpolyDot[1].y - this.stoY) * dpix[1];
				if (this.showpolyDot[1].y > this.stoY) {
					this.showpolyDot[1].y = this.stoY + dx;
				}
			}
		}
		this.obj.points.value = this.getPointsValue();
	};
	this.getPointsValue = function() {
		var res = this.sfromX + ',' + this.sfromY;
		for (var i = 0; i < this.showpolyDot.length; i++) {
			res += ' ' + this.showpolyDot[i].x + ',' + this.showpolyDot[i].y;
		}
		res += ' ' + this.stoX + ',' + this.stoY;
		return res;
	};
	this.getLineLength = function(x1, y1, x2, y2) {
		return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
	};
	this.pointInObj = function(x, y) {
		var res = false;
		var dpix = js_getDPIx();
		x = GroupEvent.getX(x);
		y = GroupEvent.getY(y);
		var x1 = this.fromX;
		var y1 = this.fromY;
		var x2 = this.toX;
		var y2 = this.toY;
		var x21 = x2 - x1;
		var y21 = y2 - y1;
		switch (this.shape) {
		case 'polyline':
			for (var i = 0; i < this.polyDot.length; i++) {
				x2 = this.polyDot[i].x;
				y2 = this.polyDot[i].y;
				x21 = x2 - x1;
				y21 = y2 - y1;
				if (i == 1) {
					if (x1 > this.fromX) {
						x1 = (x1 - this.fromX) / dpix[0] + this.fromX;
					} 
					if (y1 > this.fromY) {
						y1 = (y1 - this.fromY) / dpix[1] + this.fromY;
					} 
				}
				if (x21 == 0) {
					if (y2 > y1) {
						y2 = (y2 - y1) / dpix[1] + y1;
					} else if (y1 > y2) {
						y1 = (y1 - y2) / dpix[1] + y2;
					}
					res = (Math.abs(x - x1) < 5) && (Math.min(y1, y2) <= y)
							&& (Math.max(y1, y2) >= y);
				} else if (y21 == 0) {
					if (x2 > x1) {
						x2 = (x2 - x1) / dpix[0] + x1;
					} else if (x1 > x2) {
						x1 = (x1 - x2) / dpix[0] + x2;
					}
					res = (Math.abs(y - y1) < 5) && (Math.min(x1, x2) <= x)
							&& (Math.max(x1, x2) >= x);
				}
				if (res)
					break;
				x1 = this.polyDot[i].x;
				y1 = this.polyDot[i].y;
			}
			if (!res) {
				x2 = this.toX;
				y2 = this.toY;
				if (x1 > this.fromX) {
					x1 = (x1 - this.fromX) / dpix[0] + this.fromX;
				} 
				if (y1 > this.fromY) {
					y1 = (y1 - this.fromY) / dpix[1] + this.fromY;
				}
				if (x1 > x2) {
					x1 = (x1 - x2) / dpix[0] + x2;
				} 
				if (y1 > y2) {
					y1 = (y1 - y2) / dpix[1] + y2;
				} 
				x21 = x2 - x1;
				y21 = y2 - y1;
				if (x21 == 0) {
					res = (Math.abs(x - x1) < 5) && (Math.min(y1, y2) <= y)
							&& (Math.max(y1, y2) >= y);
				} else if (y21 == 0) {
					res = (Math.abs(y - y1) < 5) && (Math.min(x1, x2) <= x)
							&& (Math.max(x1, x2) >= x);
				}
			}
			break;
		case 'line':
			if (x21 == 0) {
				res = (Math.abs(x - x1) < 5) && (Math.min(y1, y2) <= y)
						&& (Math.max(y1, y2) >= y);
			} else if (y21 == 0) {
				res = (Math.abs(y - y1) < 5) && (Math.min(x1, x2) <= x)
						&& (Math.max(x1, x2) >= x);
			} else {
				res = (Math.min(y1, y2) <= y)
						&& (Math.max(y1, y2) >= y)
						&& (Math.min(x1, x2) <= x)
						&& (Math.max(x1, x2) >= x)
						&& ((Math.abs(Math.floor((x21 / y21) * (y - y1) + x1
								- x)) < 5) || (Math.abs(Math.floor((y21 / x21)
								* (x - x1) + y1 - y)) < 5));
			}
			break;
		default:
		}
		return res;
	};
	this.pointInStroke = function(x, y) {
		var res = -1;
		x = GroupEvent.getX(x);
		y = GroupEvent.getY(y);
		var x1 = this.fromX;
		var x2 = this.toX;
		var y1 = this.fromY;
		var y2 = this.toY;
		if ((Math.abs(x2 - x) < 6) && (Math.abs(y2 - y) < 6))
			res = 0;
		if ((Math.abs(x1 - x) < 6) && (Math.abs(y1 - y) < 6))
			res = 1;
		return res;
	};
	this.setSelected = function() {
		this.obj.strokecolor = 'green';
		if (this.textObj)
			this.textObj.style.color = 'green';
		if (this.obj.pline) {
			this.obj.pline.stroke({
				color : 'green'
			});
		}
		this.selected = true;
		$(this.obj).css("z-index", 99999);
	};
	this.move = function(x, y, mouseX, mouseY) {
		this.obj.parentNode.style.cursor = 'move';
	};
	this.moveEnd = function(x, y, mouseX, mouseY) {
		this.obj.parentNode.style.cursor = 'band';
		var point = this.obj.points.value;
		var points = point.toString().split(",");
		if (points.length == 8) {
			var l = GroupEvent.getX(x) - GroupEvent.getX(mouseX);
			var t = GroupEvent.getY(y) - GroupEvent.getY(mouseY);
			var dpix = js_getDPIx();
			l = l / dpix[0];
			t = t / dpix[1];
			this.link({
				fromObj : this.fromObj,
				toObj : this.toObj,
				spwidth : l,
				spheight : t
			});
		}
	};
	this.transePoint = function(points) {
		var re = "";
		for (var i = 0; i < points.length; i++) {
			if (i > 0)
				re += ",";
			re += points[i];
		}
		return re;
	};
	this.setMoveSelected = function() {
		this.obj.strokecolor = 'red';
		if (this.textObj)
			this.textObj.style.color = 'green';
		if (this.obj.pline) {
			this.obj.pline.stroke({
				color : 'red'
			});
		}
		this.selected = true;
		this.obj.style.zIndex = '22';
	};
	this.clearSelected = function() {
		this.obj.strokecolor = 'blue';
		if (this.textObj)
			this.textObj.style.color = 'blue';
		if (this.obj.pline) {
			this.obj.pline.stroke({
				color : 'blue'
			});
		}
		this.selected = false;
		$(this.obj).css("z-index", 1);
	};
	this.remove = function() {
		var group = document.getElementById('group');
		group.removeChild(this.obj);
	};
	this.setProperty = function(type) {
		Prop.clear();
		document.getElementById(type + '_p_id').innerHTML = this.id;
		document.getElementById(type + '_p_name').value = this.name;
		document.getElementById(type + '_p_pre').innerHTML = this.fromObj.name;
		document.getElementById(type + '_p_next').innerHTML = this.toObj.name;
		if (this.property) {
			var num = this.property.length;
			for (var i = 0; i < num; i++) {
				switch (this.property[i].text) {
				case 'span':
					document.getElementById(this.property[i].id).innerHTML = this.property[i].value;
					break;
				default:
					document.getElementById(this.property[i].id).value = this.property[i].value;
					break;
				}
			}
		}
	};
	this.getProperty = function(property) {
		this.property = property;
		this.name = property.l_p_name;
		this.title = this.name;
	};
	this.toJson = function() {
		var json = {
			id : this.id,
			name : this.name,
			type : this.type,
			shape : this.shape,
			number : this.number,
			from : this.fromObj.id,
			to : this.toObj.id,
			fromx : this.fromX,
			fromy : this.fromY,
			tox : this.toX,
			toy : this.toY,
			spwidth : this.spwidth,
			spheight : this.spheight,
			polydot : this.polyDot,
			property : this.property
		};
		return json;
	};
	this.jsonTo = function(json) {
		this.id = json.id;
		this.name = json.name;
		this.type = json.type;
		this.shape = json.shape;
		this.number = json.number;
		this.fromX = json.fromx;
		this.fromY = json.fromy;
		this.toX = json.tox;
		this.toY = json.toy;
		this.polyDot = json.polydot;
		this.property = json.property;
		this.spwidth = json.spwidth ? json.spwidth : 0;
		this.spheight = json.spheight ? json.spheight : 0;
		var group = document.getElementById('group');
		var Love = group.bindClass;
		var nodes = Love.nodes;
		var nodeNum = nodes.length;
		var node = null;
		for (var i = 0; i < nodeNum; i++) {
			node = nodes[i];
			if (node.id == json.from) {
				this.fromObj = node;
			} else if (node.id == json.to) {
				this.toObj = node;
			}
		}
		this.init();
		this.relink(this.spwidth, this.spheight);
	};
}