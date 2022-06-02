/**
 * 基本画布,只有添加和删除图形的功能.
 */
Justep.graphics.BaseCanvas = function(config) {
	Justep.apply(this, config);
	Justep.graphics.BaseCanvas.superclass.constructor.call(this);
	if (this.id) {
		this.setViewPort(this.id);
	}
	;
	this.figures = {}; // 存储图形对象
	this.scale = 1;
	this.addEvents('clickCreateFigure', 'remove', 'connectionChangePort',
			'selectionchange', 'containerFocused');
};
Justep.extend(Justep.graphics.BaseCanvas, Justep.util.Observable, {
	/**
	 * 设置画图视图区.
	 */
	setViewPort : function(divId) {
		if (!this.surface) {
			this.container = dojo.byId(divId);

			this.container.style.position = "relative";
			this.containerPos = dojo.coords(this.container, true);
			this.container.style.overflow = "auto";
			this.container.style.display = "none";

			this.surface = dojox.gfx.createSurface(this.container, 180, 400);
		}
		;
	},
	resizeSurface : function() {
		var self = this;
		self.container.style.height = "100%";
		self.container.style.width = "100%";
		setTimeout(function() {
			self.container.style.display = "block";
			var figures = self.figures;
			for ( var p in figures) {
				var fg = figures[p];
				if (fg && fg.updateTextPos) {
					fg.updateTextPos();
				}
			}
			self = null;
		}, 1);
	},
	/**
	 * 添加一个图形.
	 */
	add : function(figure) {
		figure.canvas = this;
		this.figures[figure.id] = figure;
		figure.paint();
	},
	/**
	 * 删除一个图形.
	 */
	remove : function(figure) {
		var id = figure.id;
		var type = figure.type;
		if (this.selections[figure.id]) {
			this.unSelection(figure);
		}
		delete this.figures[figure.id];
		if (type != 'Box' && type != 'Port' && type != 'InPort'
				&& type != 'OutPort') {
			this.fireEvent('remove', figure);
		}
	}
});

/**
 * 扩展基本画布，添加了图形选择，移动，改变大小等功能.
 */
Justep.graphics.Canvas = function(config) {
	Justep.graphics.Canvas.superclass.constructor.call(this, config);
	this.selections = {}; // 存储选择的图形对象
	this.ghostFigures = {}; // 影图
	this.moveOffset = {
		x : 0,
		y : 0
	};
	this.lastPosition = {
		x : 0,
		y : 0
	};
	this.scrollLeft = 0;
	this.scrollTop = 0;

	this.installListener();

	if (typeof (JustepGC) != "undefined") {
		if (typeof (JustepGC.addRef) == "function") {
			JustepGC.addRef(this, dispose1);
		}
	} else if (typeof (ORBEON) != "undefined") {
		if (typeof (ORBEON.util) != "undefined") {
			if (typeof (ORBEON.util.Utils) != "undefined") {
				if (typeof (ORBEON.util.Utils.addRef) == "function") {
					ORBEON.util.Utils.addRef(this, dispose1);
				}
			}
		}
	}
};

function dispose1(obj) {
	for ( var p in obj.figures) {
		obj.figures[p].dispose();
	}

	for ( var p in obj) {
		obj[p] = null;
	}
}

Justep
		.extend(
				Justep.graphics.Canvas,
				Justep.graphics.BaseCanvas,
				{

					actionType : {
						READY_CREATE : 0,/* 创建 */
						CREATE : 1,/* 改变大小 */
						RESIZE : 2,/* 移动 */
						MOVE : 3,/* 选择 */
						SELECT : 4,
						READY_DRAG_SELECT : 5,
						DRAG_SELECT : 6,
						CHANGE_CONNECTION_SOURCE : 7,
						CHANGE_CONNECTION_TARGET : 8
					},// 对图形的操作类型

					/**
					 * 重新选择一个图形.
					 */
					setSelection : function(figure) {
						this.clearSelections();
						this.addSelection(figure);
					},
					/**
					 * 添加选择一个图形.
					 */
					addSelection : function(figure) {
						if (!figure) {
							return;
						}
						if (!this.selections[figure.id]) {
							this.selections[figure.id] = figure;
							figure.setSelect();
						}
						this.fireEvent('selectionchange', 'add', figure);
					},

					/**
					 * 清除所有选择.
					 */
					clearSelections : function() {
						for ( var p in this.selections) {
							this.selections[p].clearSelect();
						}
						this.selections = {};
					},
					/**
					 * 取消选择一个图形.
					 */
					unSelection : function(figure) {
						var id = figure.id;
						figure.clearSelect();
						delete this.selections[figure.id];
						this.fireEvent('selectionchange', 'unselect', id);
					},

					/**
					 * 执行选择.
					 */
					executeSelect : function(event, figure) {
						if (!figure) {
							return;
						}
						var count = this.getSelectionCount();
						if (event.type == 'mousedown') {
							if (count <= 1) {
								// *非Ctrl键的单选*/
								this.setSelection(figure);
							}
						} else {
							if (event.ctrlKey) {
								// if(this.selections[figure.id]){
								// this.unSelection(figure);
								// }else{
								// // *按下Ctrl键进行多选*/
								// this.addSelection(figure);
								// }
							} else if (count > 1 && event.button != 2) {
								this.setSelection(figure);
							}
						}
					},
					_calcuSelectBound : function() {
						var minX = 15000, minY = 15000, maxX = 0, maxY = 0;
						for ( var p in this.selections) {
							var figure = this.selections[p];
							if (figure instanceof Justep.graphics.Rectangle) {
								var bound = figure.bound;
								minX = bound.x < minX ? bound.x : minX;
								minY = bound.y < minY ? bound.y : minY;
								maxX = (bound.x + bound.w) > maxX ? (bound.x + bound.w)
										: maxX;
								maxY = (bound.y + bound.h) > maxX ? (bound.y + bound.h)
										: maxX;
							} else {
								var points = figure.points;
								for (var i = 0, l = points.length; i < l; i++) {
									if (points[i].x < minX) {
										minX = points[i].x;
									} else if (points[i].x > maxX) {
										maxX = points[i].x;
									}
									if (points[i].y < minY) {
										minY = points[i].y;
									} else if (points[i].y > maxY) {
										maxY = points[i].y;
									}
								}
							}
						}

						return {
							x : minX,
							y : minY,
							w : maxX - minX,
							h : maxY - minY
						};
					},
					/**
					 * 获取选择图形的个数.
					 */
					getSelectionCount : function() {
						var count = 0;
						for ( var p in this.selections) {
							count += 1;
						}
						return count;
					},
					showMenu : function(currentMenu, x, y) {
						this.currentMenu = currentMenu;
						currentMenu.showAt([ x, y ]);
					},
					/**
					 * 获取最近的连接线
					 */
					getNearConnection : function(x, y) {
						var connections = this.getAllConnections();
						for (var i = 0, l = connections.length; i < l; i++) {
							var points = connections[i].points;
							for (var j = 0, l1 = points.length - 1; j < l1; j++) {
								var p1 = points[j], p2 = points[j + 1];
								if (containInLine_4CClick(x, y, {
									x1 : p1.x,
									y1 : p1.y,
									x2 : p2.x,
									y2 : p2.y
								})) {
									return connections[i];
								}
							}
						}
					},
					/**
					 * 画布鼠标按下事件处理函数.
					 */
					mouseDown : function() {
						this.containerPos = dojo.coords(this.container, true);
						var event = window.event;
						var figure = event.srcElement.figure;
						this.mouseDownPos = {
							x : event.clientX,
							y : event.clientY
						}; // 鼠标按下的位置
						this.lastPosition = {
							x : event.clientX,
							y : event.clientY
						};
						if (this.currentMenu) {
							this.currentMenu.hide();
							this.currentMenu = null;
						}
						var x = event.clientX - this.containerPos.x;// +
																	// this.scrollLeft;
						var y = event.clientY - this.containerPos.y;// +
																	// this.scrollTop;

						/* 创建图形 */
						if (this.currentAction == this.actionType.READY_CREATE) {
							return;
							this.currentFigure = null;
							this.currentAction = this.actionType.CREATE;
							if (this.currentType != 'Connection') {
								this.currentFigure = new Justep.graphics[this.currentType](
										{
											bound : {
												y : y,
												x : x
											}
										});
								this.add(this.currentFigure);
							} else {
								if ((figure instanceof Justep.graphics.Port && (figure.portType != 'InPort'))
										|| this.fromPort) {// OutPort
									var tempFigure = new Justep.graphics[this.currentType](
											{
												points : [ {
													y : y,
													x : x
												}, {
													y : y,
													x : x
												} ]
											});
									this.add(tempFigure);
									tempFigure.setOutPort(this.fromPort);
									this.currentFigure = tempFigure;
								}
							}
							return;
						}

						/* 选择box时设置当前操作为改变图形的大小 */
						if (figure instanceof Justep.graphics.Box) {
							return;
							this.currentBox = figure;
							this.currentFigure = figure.owner;
							this.currentAction = this.actionType.RESIZE;
							if (this.currentFigure.type == 'Connection') {
								var idx = this.currentFigure.indexOfBox(figure);
								if (idx == 0) {
									this.currentAction = this.actionType.CHANGE_CONNECTION_SOURCE;
									this.currentBox = figure;
									this.currentBox.element.style.display = "none";
								} else if (idx > 0
										&& idx == (this.currentFigure.boxes.length - 1)) {
									this.currentAction = this.actionType.CHANGE_CONNECTION_TARGET;
									this.currentBox = figure;
									this.currentBox.element.style.display = "none";
								}
							} else {
								this.currentAction = this.actionType.RESIZE;
							}
							return;
						} else if (figure instanceof Justep.graphics.Port) {
							figure = figure.owner;
						}

						/* 如果图形存在则设置当前动作的选择图形 */
						if (figure) {
							if (this.dragLine && this.dragLine.id == figure) {
								this.currentAction = this.actionType.READY_DRAG_SELECT;
							} else {
								this.currentFigure = figure;
								this.executeSelect(event, figure);
								this.currentAction = this.actionType.SELECT;
								if (!event.ctrlKey && event.button != 2) {
									// this.container.style.cursor = "move";
								}
								if (figure.type == "Connection") {
									this.lineIndex = figure.getPointIndex({
										x : x,
										y : y
									});
								}
							}
						} else {
							var connection = this.getNearConnection(x, y);
							if (connection) {
								this.currentFigure = connection;
								this.lineIndex = connection.getPointIndex({
									x : x,
									y : y
								});
								this.executeSelect(event, connection);
								this.currentAction = this.actionType.SELECT;
								if (!event.ctrlKey && event.button != 2) {
									// this.container.style.cursor = "move";
								}
							} else {
								/* 鼠标点在非图形元素上时清除所有选择 */
								this.clearSelections();
								this.currentAction = this.actionType.READY_DRAG_SELECT;
								this.fireEvent('containerFocused');
							}
						}
						dojo.stopEvent(event);
					},
					docMouseUp : function() {
						this.mouseUp();
					},
					mouseUp : function() {
						var event = window.event;
						var figure = event.srcElement.figure;
						var x = event.clientX - this.containerPos.x;// +
																	// this.scrollLeft;
						var y = event.clientY - this.containerPos.y;// +
																	// this.scrollTop;
						switch (this.currentAction) {
						case this.actionType.MOVE:
							this.endMove();
							break;
						case this.actionType.RESIZE:
							this.endRezie();
							break;
						case this.actionType.SELECT:
							this.executeSelect(event, figure);
							break;
						case this.actionType.CREATE:
							this.endCreate(figure);
							break;
						case this.actionType.DRAG_SELECT:
						case this.actionType.READY_DRAG_SELECT:
							this.endDragSelect();
							break;
						case this.actionType.CHANGE_CONNECTION_SOURCE: // 移动开始端点
						case this.actionType.CHANGE_CONNECTION_TARGET: // 移动结束端点
							this.endChangeConnection(figure, x, y);
						}
						this.currentFigure = null;
						this.isStartResize = null;
						this.currentAction = null;
						dojo.stopEvent(event);
					},
					documentMouseUp : function() {
						if (this.currentAction == this.actionType.MOVE) {
							this.container.style.cursor = 'default';
							this.clearGhostFigures();
							this.currentAction = null;
							this.lineIndex = -1;
						} else if (this.currentAction == this.actionType.DRAG_SELECT) {
							this.endDragSelect();
						}
					},
					mouseMove : function(event) {
						var event = window.event;
						var changeConnection = this.currentAction == this.actionType.CHANGE_CONNECTION_SOURCE;
						if (this.currentAction == this.actionType.READY_CREATE
								|| changeConnection) {

							if (this.currentType == 'Connection'
									|| changeConnection) {
								var x = event.clientX - this.containerPos.x;// +
																			// (changeConnection?0:this.scrollLeft);
								var y = event.clientY - this.containerPos.y;// +
																			// (changeConnection?0:this.scrollTop);
								var isMovePort = false;

								var figure = event.srcElement.figure;
								if (changeConnection) {
									this.currentFigure.setPoint(0, {
										x : x,
										y : y + 5
									});
								}
								if (figure instanceof Justep.graphics.Port
										&& (figure.portType != 'InPort')) {// OutPort
									figure.setVisible(true);
									figure.setHighLight(true);
									this.fromPort = figure;
								} else if (figure instanceof Justep.graphics.Rectangle) {

									var port = figure.getPortByPos(x, y,
											'OutPort');
									if (port) {
										port.setHighLight(true);
										if (this.fromPort
												&& this.fromPort.id != port.id) {
											this.fromPort.setHighLight(false);
										}
										this.fromPort = port;
										isMovePort = true;
									}
									if (this.moveOverFigure
											&& this.moveOverFigure.id != figure.id) {
										this.moveOverFigure
												.setPortVisible(false);
									}
									figure.setPortVisible(true, 'OutPort');
									this.moveOverFigure = figure;
								} else if (this.moveOverFigure) {
									this.moveOverFigure.setPortVisible(false);
								}
								if (this.fromPort
										&& !(figure instanceof Justep.graphics.Port)
										&& !isMovePort) {
									this.fromPort.setHighLight(false);
								}
							}
							return;
						}
						changeConnection = this.currentAction == this.actionType.CHANGE_CONNECTION_TARGET;
						if (this.currentAction == this.actionType.CREATE
								|| changeConnection) {
							var x = event.clientX - this.containerPos.x;// +
																		// (changeConnection?0:this.scrollLeft);
							var y = event.clientY - this.containerPos.y;// +
																		// (changeConnection?0:this.scrollTop);
							if (this.currentType == 'Connection'
									|| changeConnection) {
								var figure = event.srcElement.figure;
								var isMovePort = false;
								if (this.toPort) {
									// this.toPort.setHighLight(false);
								}
								// this.toPort = null;
								if (this.currentFigure) {

									this.currentFigure
											.setPoint(
													this.currentFigure.points.length - 1,
													{
														x : x - 5,
														y : y - 5
													});
									if (figure instanceof Justep.graphics.Port
											&& figure.portType != 'OutPort') {// InPort
										if (changeConnection
												|| figure.id != this.fromPort.id) {
											figure.setVisible(true);
											figure.setHighLight(true);
											this.toPort = figure;
										}
									} else if (this.currentFigure
											&& figure instanceof Justep.graphics.Rectangle) {
										var x = event.clientX
												- this.containerPos.x;// +
																		// this.scrollLeft;
										var y = event.clientY
												- this.containerPos.y;// +
																		// this.scrollTop;
										var port = figure.getPortByPos(x, y,
												'InPort');
										if (port) {
											port.setHighLight(true);
											if (this.toPort
													&& this.toPort.id != port.id) {
												this.toPort.setHighLight(false);
											}
											this.toPort = port;
											isMovePort = true;
										}
										if (this.moveOverFigure
												&& this.moveOverFigure.id != figure.id) {
											this.moveOverFigure
													.setPortVisible(false);
										}
										figure.setPortVisible(true, 'InPort');
										this.moveOverFigure = figure;
									} else if (figure
											&& this.moveOverFigure
											&& figure.id != this.currentFigure.id) {
										this.moveOverFigure
												.setPortVisible(false);
									}
								}
								if (this.toPort
										&& !(figure instanceof Justep.graphics.Port)
										&& !isMovePort) {
									this.toPort.setHighLight(false);
								}
								if (!figure && this.moveOverFigure) {
									this.moveOverFigure.setPortVisible(false);
								}
							}
							return;
						}

						if (this.currentFigure) {
							var dx = event.clientX - this.lastPosition.x;
							var dy = event.clientY - this.lastPosition.y;
							switch (this.currentAction) {
							/* 移动图形 */
							case this.actionType.MOVE:
								this.moving(event, {
									dx : dx,
									dy : dy
								});
								break;
							/* 改变大小 */
							case this.actionType.RESIZE:
								if (this.isStartResize) {
									this.resizing(event, {
										dx : dx,
										dy : dy
									});
								} else {
									this.startResize(event);// 开始改变大小
								}
								break;
							/* 开始移动 */
							case this.actionType.SELECT:
								if ((Math.abs(event.clientX
										- this.mouseDownPos.x)) > 2
										|| (Math.abs(event.clientY
												- this.mouseDownPos.y)) > 2) {
									this.currentAction = this.actionType.MOVE;
									this.startMove(event);
								}
								break;
							case this.actionType.CHANGE_CONNECTION:

							}
						} else {// print("================="+333);
							var figure = event.srcElement.figure;
							this.container.style.cursor = 'default';
							if (figure instanceof Justep.graphics.Box) {
								this.container.style.cursor = figure.cursor;
							}
						}
						if (this.currentAction == this.actionType.DRAG_SELECT) {
							this.dragSelect(event);
						} else if (this.currentAction == this.actionType.READY_DRAG_SELECT) {
							if ((Math.abs(event.clientX - this.mouseDownPos.x)) > 2
									|| (Math.abs(event.clientY
											- this.mouseDownPos.y)) > 2) {
								this.startDragSelect(event);
								this.currentAction = this.actionType.DRAG_SELECT;
							}
						}
						this.lastPosition = {
							x : event.clientX,
							y : event.clientY
						};
						dojo.stopEvent(event);
					},

					dbclick : function() {
						var event = window.event;
						var figure = event.srcElement.figure;
						if (figure instanceof Justep.graphics.Connection) {
							var x = event.clientX - this.containerPos.x;// ;+
																		// this.scrollLeft;
							var y = event.clientY - this.containerPos.y;// +
																		// this.scrollTop;
							var p = {
								x : x,
								y : y
							};
							var idx = figure.getPointIndex(p);

							figure.addPoint(idx + 1, p);
							figure.addPoint(idx + 2, Justep.apply({}, p));
						} else if (figure instanceof Justep.graphics.Box
								&& figure.owner instanceof Justep.graphics.Connection) {
							var connFigure = figure.owner;
							var idx = connFigure.indexOfBox(figure);
							connFigure.removePoint(idx);
						}
					},

					keyDown : function() {
						var event = window.event;
						var dx = 0, dy = 0;
						var count = this.getSelectionsCount();
						if (count > 0) {
							switch (event.keyCode) {
							case 37:
								dx = -1;
								break;
							case 38:
								dy = -1;
								break;
							case 39:
								dx = 1;
								break;
							case 40:
								dy = 1;
								break;
							}
							if (dx != 0 || dy != 0) {
								for ( var p in this.selections) {
									var figure = this.selections[p];
									if (figure instanceof Justep.graphics.Rectangle) {
										var bound = Justep.apply({},
												figure.bound);
										bound.x += dx;
										bound.y += dy;
										figure.setBound(bound);
									}
								}
								this.transInterPointToArc();
								dojo.stopEvent(event);
							}
						}
						if (event.ctrlKey && this.cancelRedoMng) {
							if (event.keyCode == 90) { // cancel
								this.cancelRedoMng.cancel();
							} else if (event.keyCode == 89) { // redo
								this.cancelRedoMng.redo();
							}
						}
					},

					getSelectionsCount : function() {
						var count = 0;
						for ( var p in this.selections) {
							count++;
						}
						return count;
					},
					/**
					 * 放大与缩小
					 */
					zoom : function(scale) {
						this.scale = this.scale * scale;
						for ( var p in this.figures) {
							var figure = this.figures[p];
							if (figure instanceof Justep.graphics.Connection) {
								var points = figure.points;
								for (var i = 1; i < points.length - 1; i++) {
									// points[i].x =
									// Math.round(points[i].x*scale);
									// points[i].y =
									// Math.round(points[i].y*scale);
								}
								figure.setShape(points);
							}
						}
						for ( var p in this.figures) {
							var figure = this.figures[p];
							if (figure instanceof Justep.graphics.Rectangle
									&& !(figure instanceof Justep.graphics.Port)
									&& !(figure instanceof Justep.graphics.Box)) {
								var bound = figure.bound;
								for ( var p1 in bound) {
									bound[p1] = bound[p1] * scale;
								}
								figure.setBound(bound);
							}
						}
						for ( var p in this.selections) {
							this.selections[p].clearSelect();
							this.selections[p].setSelect();
						}
						this.transInterPointToArc();
					},
					/**
					 * 获得所有的连接线
					 */
					getAllConnections : function(sortBySN) {
						var conns = [];
						for ( var p in this.figures) {
							if (this.figures[p] instanceof Justep.graphics.Connection) {
								conns.push(this.figures[p]);
							}
						}
						if (sortBySN) {
							conns = conns.sort(function(f1, f2) {
								return (f1.sn > f2.sn) ? -1 : 1;
							});
						}
						return conns;
					},
					/**
					 * 把直角折线之间的交点转换成弧形.
					 */
					transInterPointToArc : function() {
						this.arcs = {};
						var connections = this.getAllConnections(true);
						for (var ii = 0, l = connections.length; ii < l; ii++) {
							var figure = connections[ii];
							var points = figure.points;
							var hasInterPoint = this.calcuInterPoint(figure,
									ii + 1, connections);
							if (hasInterPoint) {
								figure.setShape(points);
							}
						}
					},
					arcR : 4,
					/**
					 * 计算直角折线的交点.
					 */
					calcuInterPoint : function(figure, startIdx, connections) {
						var arcR = this.arcR;
						var hasInterPoint = false; // 是否有交点
						var points = figure.points;
						var l = connections.length;
						for (var j = 0; j < points.length - 1; j++) {
							if (points[j].attach) {
								points[j].attach = null;
								delete points[j].attach;
								hasInterPoint = true;
							}
							var minX = Math.min(points[j].x, points[j + 1].x), minY = Math
									.min(points[j].y, points[j + 1].y);
							var maxX = Math.max(points[j].x, points[j + 1].x), maxY = Math
									.max(points[j].y, points[j + 1].y);
							var dir = this.getLineDirection(points[j],
									points[j + 1]); // 方向
							for (var jj = startIdx; jj < l; jj++) { // 计算与下层折线的交点
								var tempPoints = connections[jj].points;
								if (points[j].x == points[j + 1].x) { // 竖线
									for (var n = 0; n < tempPoints.length - 1; n += 1) {
										if (tempPoints[n].y == tempPoints[n + 1].y
												&& (points[j].x > Math.min(
														tempPoints[n].x,
														tempPoints[n + 1].x) && points[j].x < Math
														.max(
																tempPoints[n].x,
																tempPoints[n + 1].x))
												&& (tempPoints[n].y > minY && tempPoints[n].y < maxY)) {
											points[j].attach = points[j].attach
													|| [];
											var x = points[j].x, y = tempPoints[n].y; // 交点
											var s = x + " " + (y - arcR) + " C"
													+ (x - arcR) + " "
													+ (y - arcR) + " "
													+ (x - arcR) + " "
													+ (y + arcR) + " " + x
													+ " " + (y + arcR); // 弧形路径
											if (dir == Justep.PortDirection.UP) {
												s = x + " " + (y + arcR) + " C"
														+ (x - arcR) + " "
														+ (y + arcR) + " "
														+ (x - arcR) + " "
														+ (y - arcR) + " " + x
														+ " " + (y - arcR); // 弧形路径
											}
											points[j].attach.push({
												v : s,
												pos : y,
												x : x,
												y : y
											});
											hasInterPoint = true;
										}
									}
								} else if (points[j].y == points[j + 1].y) { // 横线
									for (var n = 0; n < tempPoints.length - 1; n += 1) {
										if (tempPoints[n].x == tempPoints[n + 1].x
												&& (points[j].y > Math.min(
														tempPoints[n].y,
														tempPoints[n + 1].y) && points[j].y < Math
														.max(
																tempPoints[n].y,
																tempPoints[n + 1].y))
												&& (tempPoints[n].x > minX && tempPoints[n].x < maxX)) {
											points[j].attach = points[j].attach
													|| [];
											var x = tempPoints[n].x, y = points[j].y; // 交点
											var s = (x - arcR) + " " + y + " C"
													+ (x - arcR) + " "
													+ (y - arcR) + " "
													+ (x + arcR) + " "
													+ (y - arcR) + " "
													+ (x + arcR) + " " + y; // 弧形路径
											if (dir == Justep.PortDirection.LEFT) {
												s = (x + arcR) + " " + y + " C"
														+ (x + arcR) + " "
														+ (y - arcR) + " "
														+ (x - arcR) + " "
														+ (y - arcR) + " "
														+ (x - arcR) + " " + y;
											}
											points[j].attach.push({
												v : s,
												pos : x,
												x : x,
												y : y
											});
											hasInterPoint = true;
										}
									}
								}
							}//
							if (points[j].attach) {
								var attach = points[j].attach
										.sort(function(p1, p2) {
											if (dir == Justep.PortDirection.UP
													|| dir == Justep.PortDirection.LEFT) {
												return p1.pos > p2.pos ? -1 : 1;
											}
											return p1.pos > p2.pos ? 1 : -1;
										});
								var values = [];
								for (var i = 0; i < attach.length; i++) {
									values.push(attach[i].v);
								}
								points[j].attach = values.join(" L");
							}

						}
						return hasInterPoint;
					},
					getLineDirection : function(p1, p2) {
						if (p1.x == p2.x) {
							return (p2.y - p1.y > 0) ? Justep.PortDirection.DOWN
									: Justep.PortDirection.UP;

						} else if (p1.y == p2.y) {
							return (p2.x - p1.x > 0) ? Justep.PortDirection.RIGHT
									: Justep.PortDirection.LEFT;
						}
					},

					containerScroll : function() {
						var event = window.event;
						var target = event.srcElement;
						this.scrollLeft = target.scrollLeft;
						this.scrollTop = target.scrollTop;
					},
					startDragSelect : function(event) {
						if (!this.dragLine) {
							return;
							var x = event.clientX - this.containerPos.x
									+ this.scrollLeft;
							var y = event.clientY - this.containerPos.y
									+ this.scrollTop;
							this.dragLine = new Justep.graphics.DojoRectangle({
								bound : {
									x : x,
									y : y,
									w : 18,
									h : 18
								},
								bgColor : 'NULL',
								border : {
									style : "ShortDash",
									width : 1,
									color : [ 0, 0, 0, 0.3 ],
									cap : "round"
								}
							});
							this.add(this.dragLine);
						}
					},
					dragSelect : function(event) {
						if (this.dragLine) {
							var x = event.clientX - this.containerPos.x
									+ this.scrollLeft;
							var y = event.clientY - this.containerPos.y
									+ this.scrollTop;
							var bound = this.dragLine.bound;
							bound.w = x - bound.x;
							bound.h = y - bound.y;
							this.dragLine.setBound(bound);
						}
					},
					endDragSelect : function() {
						this.currentAction = null;
						if (this.dragLine) {
							var dgBound = this.dragLine.bound;
							var array = [];
							for ( var p in this.figures) {
								var figure = this.figures[p];
								if (figure instanceof Justep.graphics.Rectangle
										&& !(figure instanceof Justep.graphics.Box)
										&& !(figure instanceof Justep.graphics.Port)) {
									if (figure.id != this.dragLine.id) {
										if (this.containInBound(dgBound,
												figure.bound)) {
											array.push(figure);
										}
									}
								}
							}
							for (var i = 0, l = array.length; i < l; i++) {
								this.addSelection(array[i]);
							}
							array = null;
							this.dragLine.dispose();
							this.dragLine = null;
						}
					},
					getRegularBound : function(bound) {
						var x1 = bound.x + bound.w;
						var y1 = bound.y + bound.h;
						var minX = Math.min(bound.x, x1);
						var minY = Math.min(bound.y, y1);
						return {
							x : minX,
							y : minY,
							w : Math.abs(bound.w),
							h : Math.abs(bound.h)
						};
					},
					containInBound : function(sBound, tBound) {
						sBound = this.getRegularBound(sBound);
						return Math.abs((sBound.x + sBound.x + sBound.w)
								- (tBound.x + tBound.x + tBound.w)) < (sBound.x
								+ sBound.w + tBound.x + tBound.w - sBound.x - tBound.x)
								&& Math.abs((sBound.y + sBound.y + sBound.h)
										- (tBound.y + tBound.y + tBound.h)) < (sBound.y
										+ sBound.h
										+ tBound.y
										+ tBound.h
										- sBound.y - tBound.y);
					},

					/**
					 * 修改连线的连接点.
					 */
					endChangeConnection : function(figure, x, y) {
						var portName = this.currentAction == this.actionType.CHANGE_CONNECTION_SOURCE ? 'outPort'
								: 'inPort';
						var portType = this.currentAction == this.actionType.CHANGE_CONNECTION_SOURCE ? 'OutPort'
								: 'InPort';
						var portSetMethod = this.currentAction == this.actionType.CHANGE_CONNECTION_SOURCE ? 'setOutPort'
								: 'setInPort';

						var fireChanged = false;
						this.currentFigure[portName].owner
								.setPortVisible(false);
						this.currentFigure.clearSelect();
						var newPort;// = this.currentAction ==
									// this.actionType.CHANGE_CONNECTION_SOURCE?this.fromPort:this.toPort;
						if (figure instanceof Justep.graphics.Port) {
							newPort = figure;
							figure = newPort.owner;
						} else if (figure instanceof Justep.graphics.Rectangle) {
							// var p = this.currentAction ==
							// this.actionType.CHANGE_CONNECTION_SOURCE?this.currentFigure.points[0]:this.currentFigure.points[this.currentFigure.points.length-1];

							newPort = this.moveOverFigure.getPortByPos(x, y,
									portType);
						}
						if (newPort) {
							newPort.owner.setPortVisible(false);
							newPort.setHighLight(false);
						} else {
							newPort = this.currentFigure[portName];
						}
						if (this.currentFigure[portName].owner.id != newPort.owner.id) {
							fireChanged = true;
						}
						var oldPort = this.currentFigure[portName];
						oldPort.setHighLight(false);
						this.currentFigure[portSetMethod](newPort);
						this.currentFigure.setSelect();
						if (this.moveOverFigure) {
							this.moveOverFigure.setPortVisible(false);
							this.moveOverFigure = null;
						}
						// if(fireChanged){
						this.fireEvent('connectionChangePort',
								this.currentFigure, newPort, oldPort);
						// }
					},

					/**
					 * 准备绘制图形
					 */
					startReadyCreate : function(type) {
						if (type) {
							this.currentAction = this.actionType.READY_CREATE;
							this.currentType = type;
							this.container.style.cursor = "crosshair";
						} else {
							this.currentAction = null;
							this.currentType = null;
							this.container.style.cursor = 'default';
						}
					},
					/**
					 * 图形绘制结束.
					 */
					endCreate : function(figure) {
						if (this.currentType == 'Connection') {
							if (this.currentFigure
									&& figure
									&& (figure instanceof Justep.graphics.Port || this.toPort)
									&& figure.portType != 'OutPort') {// InPort
								this.currentFigure.setInPort(this.toPort);
							} else if (this.currentFigure) {
								this.currentFigure.dispose();
								this.currentFigure = null;
							}
						}
						if (this.moveOverFigure) {
							this.moveOverFigure.setPortVisible(false);
						}
						if (this.toPort) {
							this.toPort.setVisible(false);
							this.toPort.setHighLight(false);
							this.toPort = null;
						}
						if (this.fromPort) {
							this.fromPort.setVisible(false);
							this.fromPort.setHighLight(false);
							this.fromPort = null;
						}
						this.moveOverFigure = null;
						this.currentAction = null;
						this.container.style.cursor = 'default';
						if (this.currentFigure) {
							this.fireEvent('clickCreateFigure',
									this.currentFigure);
						}
					},
					startResize : function(event) {
						if ((Math.abs(event.clientX - this.mouseDownPos.x)) > 5
								|| (Math.abs(event.clientY
										- this.mouseDownPos.y)) > 5) {
							this.createGhostFigures();
							this.isStartResize = true;
						}
					},

					/**
					 * 拖动改变大小.
					 */
					resizing : function(event, offset) {
						for ( var p in this.ghostFigures) {
							var figure = this.ghostFigures[p];
							var bound = figure.bound;
							switch (this.currentBox.direction) {
							case 'e':
								bound.w += offset.dx;
								break;
							case 'w':
								bound.x += offset.dx;
								bound.w -= offset.dx;
								break;
							case 's':
								bound.h += offset.dy;
								break;
							case 'n':
								bound.y += offset.dy;
								bound.h -= offset.dy;
								break;
							case 'wn':
								bound.x += offset.dx;
								bound.y += offset.dy;
								bound.w -= offset.dx;
								bound.h -= offset.dy;
								break;
							case 'ne':
								bound.y += offset.dy;
								bound.w += offset.dx;
								bound.h -= offset.dy;
								break;
							case 'es':
								bound.w += offset.dx;
								bound.h += offset.dy;
								break;
							case 'sw':
								bound.x += offset.dx;
								bound.h += offset.dy;
								bound.w -= offset.dx;
							}
							figure.setBound(bound);
						}
					},

					endRezie : function(event) {
						this.container.style.cursor = 'default';
						this.clearGhostFigures();
					},

					startMove : function(event) {
						this.container.style.cursor = "move";
						if (this.currentFigure instanceof Justep.graphics.Connection) {
							var x = event.clientX - this.containerPos.x;// +
																		// this.scrollLeft;
							var y = event.clientY - this.containerPos.y;// +
																		// this.scrollTop;

							if (this.lineIndex > 0
									&& this.lineIndex < this.currentFigure.points.length - 2) {
								var points = this.currentFigure.points;
								this.ghostLine = new Justep.graphics.Line(
										{
											border : 'blue',
											points : [
													Justep
															.apply(
																	{},
																	points[this.lineIndex]),
													Justep
															.apply(
																	{},
																	points[this.lineIndex + 1]) ]
										});
								this.add(this.ghostLine);
							}
						} else {
							this.createGhostFigures();
						}
						this.selectBound = this._calcuSelectBound();
						document.body.unselectable = 'on';
						document.body.onselectstart = function() {
							return false;
						};
					},
					moving : function(event, offset) {
						if (!this.selectBound)
							return;
						var newX = this.selectBound.x + offset.dx;
						var newY = this.selectBound.y + offset.dy;
						if (newX > 2) {
							this.selectBound.x = newX;
						} else {
							offset.dx = 0;
						}
						if (newY > 2) {
							this.selectBound.y = newY;
						} else {
							offset.dy = 0;
						}
						if (this.currentFigure instanceof Justep.graphics.Connection) {
							var x = event.clientX - this.containerPos.x;// +
																		// this.scrollLeft;
							var y = event.clientY - this.containerPos.y;// +
																		// this.scrollTop;

							if (this.ghostLine) {
								var points = this.ghostLine.points;
								var p1 = points[0];
								var p2 = points[1];
								if (p1.x == p2.x) {
									p1.x += offset.dx;
									p2.x += offset.dx;
								} else if (p1.y == p2.y) {
									p1.y += offset.dy;
									p2.y += offset.dy;
								}
								p1.cusMove = true;
								p2.cusMove = true;
								this.ghostLine.setShape(points);
							}
						} else {
							for ( var p in this.ghostFigures) {
								var bound = Justep.apply({},
										this.ghostFigures[p].bound);
								bound.x = bound.x + offset.dx;
								bound.y = bound.y + offset.dy;
								// if(offset.dx && offset.dy){
								this.ghostFigures[p].setBound(bound);// .applyTransform(offset);//.setBound(bound);//
								// this.ghostFigures[p].owner.setBound(bound);
								// }
							}
						}
					},

					endMove : function(event) {
						this.container.style.cursor = 'default';
						this.clearGhostFigures();
						this.currentAction = null;
						this.lineIndex = -1;
						this.currentFigure = null;
						this.transInterPointToArc();
						document.body.unselectable = 'off';
						document.body.onselectstart = null;
					},

					createGhostFigures : function() {
						for ( var p in this.selections) {
							var figure = this.selections[p];
							if (figure instanceof Justep.graphics.BaudRectangle) {
								var cloneFigure = figure.cloneFigure({
									border : 'NULL',
									bgColor : '#DDEEFF'
								});
								cloneFigure.owner = figure;
								this.ghostFigures[cloneFigure.id] = cloneFigure;
							} else if (figure instanceof Justep.graphics.Rectangle) {
								var cloneFigure = figure.cloneFigure({
									border : 'NULL',
									bgColor : [ 0, 123, 255, 0.1 ]
								});
								cloneFigure.owner = figure;
								this.ghostFigures[cloneFigure.id] = cloneFigure;
							}
						}
					},

					clearGhostFigures : function() {
						var contents = [];
						for ( var p in this.ghostFigures) {
							var tempFg = this.ghostFigures[p];
							var owner = tempFg.owner;
							var bound = tempFg.bound;
							if (owner.type == 'Circle') {
								var poinits = {
									cx : bound.x + bound.w / 2,
									cy : bound.y + bound.h / 2,
									r : Math.max(bound.w, bound.h) / 2
								};
								bound = {
									x : poinits.cx - poinits.r,
									y : poinits.cy - poinits.r,
									w : poinits.r * 2,
									h : 2 * poinits.r
								};
							}
							contents.push({
								figureId : owner.id,
								value : Justep.apply({}, owner.bound)
							});
							owner.setBound(Justep.apply({}, bound));
							tempFg.dispose();
							delete this.ghostFigures[p];
						}

						if (this.ghostLine) {
							var points = this.currentFigure.points;
							contents.push({
								figureId : this.currentFigure.id,
								value : Justep.apply([], points)
							});
							points[this.lineIndex] = Justep
									.apply(this.ghostLine.points[0]);
							points[this.lineIndex + 1] = Justep
									.apply(this.ghostLine.points[1]);

							this.currentFigure.setShape(points);
							this.ghostLine.dispose();
							this.ghostLine = null;
						}
						if (contents.length > 0 && this.cancelRedoMng) {
							this.cancelRedoMng
									.cacheOpt('changeShape', contents);
						}
						this.ghostFigures = {};
					},
					click : function() {
						var event = window.event;
						dojo.stopEvent(event);
					},
					on : function(element, event, callback, owner) {
						function Listener(callback, owner, params) {
							if (owner && callback) {
								this.callback = function(e) {
									callback.call(owner, e, params);
								};
							} else {
								this.callback = callback;
							}
						}
						var linster = new Listener(callback, owner);
						dojo.connect(element, event, linster.callback);
					},
					mouseover : function() {
						var event = window.event;
						dojo.stopEvent(event);
					},
					mouseout : function() {
						var event = window.event;
						dojo.stopEvent(event);
					},
					installListener : function() {
						this.on(document, 'onmouseup', this.docMouseUp, this);
						this.on(this.container, "ondblclick", this.dbclick,
								this);
						this.on(this.container, 'onmousemove', this.mouseMove,
								this);
						this
								.on(this.container, 'onkeydown', this.keyDown,
										this);
						this.on(this.container.parentNode, 'onscroll',
								this.containerScroll, this);
						this.on(this.container, 'onscroll',
								this.containerScroll, this); // zmh

						dojo.connect(this.container, "ondragstart", dojo,
								"stopEvent");
						dojo.connect(this.container, "onselectstart", dojo,
								"stopEvent");

						this.on(document, 'onmouseup', this.documentMouseUp,
								this);

						this.on(this.container, "onclick", this.click, this);
						this.on(this.container, "onmouseover", this.mouseover,
								this);
						this.on(this.container, "onmouseout", this.mouseout,
								this);
					}
				});