// ===================================== 图形元素 start===========================================================
Justep.graphics = {};

function setStyle(element, style) {
	for ( var prop in style) {
		if (prop == "bound") {
			var bound = style[prop];
			element.style.width = bound.w + "px";
			element.style.height = bound.h + "px";
			element.style.top = bound.y + "px";
			element.style.left = bound.x + "px";
		} else {
			element.style[prop] = style[prop];
		}
	}
}

function containInLine(x, y, line) {
	var d1 = distance({
		x : line.x1,
		y : line.y1
	}, {
		x : x,
		y : y
	});
	var d2 = distance({
		x : line.x2,
		y : line.y2
	}, {
		x : x,
		y : y
	});
	var d = distance({
		x : line.x2,
		y : line.y2
	}, {
		x : line.x1,
		y : line.y1
	});
	var offset = Math.abs(d - d1 - d2);
	if (offset <= 0.6) {
		return true;
	} else {
		return false;
	}
}
function containInLine_4CClick(x, y, line) {
	var d1 = distance({
		x : line.x1,
		y : line.y1
	}, {
		x : x,
		y : y
	});
	var d2 = distance({
		x : line.x2,
		y : line.y2
	}, {
		x : x,
		y : y
	});
	var d = distance({
		x : line.x2,
		y : line.y2
	}, {
		x : line.x1,
		y : line.y1
	});
	var offset = Math.abs(d - d1 - d2);
	if (offset <= 3.0) {
		return true;
	} else {
		return false;
	}
}

function distance(a, b) {
	var offX = a.x - b.x;
	var offY = a.y - b.y;
	return Math.sqrt(offX * offX + offY * offY);
}

/**
 * 基本图形.
 */
Justep.graphics.Figure = function(config) {
	this.selectable = true;
	config = config || {};
	Justep.apply(this, config);
	this.id = this.id || Justep.genaGUID();
	Justep.graphics.Figure.superclass.constructor.call(this);
	this.properties = {};
};

Justep.extend(Justep.graphics.Figure, Justep.util.Observable, {
	/**
	 * 设置属性值.
	 */
	setProperty : function(k, v) {
		this.properties[k] = v;
		this.setDirty(true);
	},

	/**
	 * 根据属性名获取属性值
	 */
	getProperty : function(k) {
		return properties[k];
	},

	setDirty : function(isDirty) {
		if (this.canvas) {
			this.canvas.dirty = true;
		}
	}
});

/**
 * 矩形.
 */
Justep.graphics.Rectangle = function(config) {
	Justep.graphics.Rectangle.superclass.constructor.call(this, Justep.apply(
			config, {
				type : config.type || 'Rectangle'
			}));
	this.bound = this.bound || {};

	this.bound = {
		x : this.bound.x || 10,
		y : this.bound.y || 10,
		w : (this.bound.w || 100),
		h : (this.bound.h || 30)
	};
	this.visible = config.visible != false ? true : false;
	this.selectable = config.selectable != true ? false : true;
	this.bgColor = this.bgColor;
	this.boxes = [];
	this.ports = [];// 端口
	this.isRebuild = false;
};

Justep
		.extend(
				Justep.graphics.Rectangle,
				Justep.graphics.Figure,
				{

					paint : function() {
						if (!this.element) {
							this.rebuildBoundByScale();
							this.element = document.createElement("DIV");
							this.border = this.bgColor != 'NULL' ? this.bgColor
									: "black";
							this.bgColor = this.bgColor != 'NULL' ? this.bgColor
									: null;

							setStyle(this.element, {
								display : this.visible ? "" : "none",
								overflow : "hidden",
								position : "absolute",
								backgroundColor : this.bgColor,
								bound : this.bound,
								border : "1px solid " + this.border
							});
							this.canvas.container.appendChild(this.element);
							this.element.figure = this;

							this.updatePortPos();
							for (var i = 0, l = this.ports.length; i < l; i++) {
								this.canvas.add(this.ports[i]);
							}
							if (this.text) {
								this.setText(this.text);
							}
						}
					},
					getCenter : function() {
						return {
							x : this.bound.x + this.bound.w / 2,
							y : this.bound.y + this.bound.h / 2
						};
					},
					/**
					 * 根据当前比例重新构造bound.
					 */
					rebuildBoundByScale : function() {
						if (!this.isRebuild
								&& !this.disenableRebuildBoundByScale) {
							var scale = this.canvas.scale;
							this.bound.w = this.bound.w * scale;
							this.bound.h = this.bound.h * scale;
							this.isRebuild = true;
						}
					},

					/**
					 * 设置文本.
					 */
					setText : function(text) {
						this.text = text;
						if (this.element) {
							if (!this.textSpan) {
								this.textSpan = document.createElement("div");
								var textBound = this._calcuTextBound(text);
								setStyle(this.textSpan, {
									fontFamily : '宋体',
									fontSize : '9pt',
									textAlign : 'center',
									filter : "alpha(opacity=60)",
									position : "absolute"
								});
								this.canvas.container
										.appendChild(this.textSpan);
								this.textSpan.style.top = textBound.y + "px";
								this.textSpan.style.left = textBound.x + "px";
								// this.textSpan.style.height =
								// textBound.h+"px";
								this.textSpan.figure = this;
							} else {
								this.updateTextPos();
							}
							this.textSpan.innerHTML = text;
							this.updateFlagTextPos();
						}
					},

					/**
					 * 设置标识文本.
					 */
					setFlagText : function(text) {
						this.flagText = text;
						if (this.element) {
							if (!this.flagTextSpan) {
								this.flagTextSpan = document
										.createElement("span");
								var textBound = this._calcuFlagTextBound(text);
								setStyle(this.flagTextSpan, {
									fontFamily : '宋体',
									fontSize : '9pt',
									textAlign : 'center',
									filter : "alpha(opacity=60)",
									lineHeight : "16px",
									overflow : "hidden",
									position : "absolute",
									bound : textBound
								});
								this.canvas.container
										.appendChild(this.flagTextSpan);
								this.flagTextSpan.figure = this;
							} else {
								this.updateFlagTextPos();
							}
							this.flagTextSpan.innerHTML = text;
						}
					},

					/**
					 * 设置背景颜色.
					 */
					setBGColor : function(color) {
						this.bgColor = color;
						if (!this.element.getEventSource) { // html div类型的图形
							this.element.style.backgroupColor = this.bgColor;
						} else { // dojo 类型的图形
							this.element.setFill(this.bgColor);
						}
					},

					_calcuTextBound : function(text) {
						var tempDiv = document.createElement("span");
						tempDiv.style.position = "absolute";
						tempDiv.style.top = "-100px";
						document.body.appendChild(tempDiv);
						// tempDiv.style.display="block";

						tempDiv.innerHTML = text;
						var offsetW = tempDiv.offsetWidth + 4;
						var offsetH = tempDiv.offsetHeight + 1;
						// /document.getElementById("p1").innerHTML = text;
						// var offsetW =
						// document.getElementById("p1").offsetWidth +4;
						offsetW = offsetW == 4 ? 120 : offsetW;
						offsetH = offsetH == 1 ? 20 : offsetH;
						var cx = this.bound.x + this.bound.w / 2;
						var cy = this.bound.y + this.bound.h / 2;
						document.body.removeChild(tempDiv);
						tempDiv = null;
						// return
						// {x:cx-offsetW/2+2,y:cy-(offsetH/3),w:offsetW,h:offsetH}
						if (window.ActiveXObject) {
							return {
								x : this.bound.x + (this.bound.w - offsetW) / 2
										+ 3,
								y : this.bound.y + (this.bound.h - offsetH) / 2
										+ 2,
								w : offsetW,
								h : offsetH
							};
						} else {
							return {
								x : this.bound.x + (this.bound.w - offsetW) / 2,
								y : this.bound.y + (this.bound.h - offsetH) / 2,
								w : offsetW,
								h : offsetH
							};
						}
					},
					updateTextPos : function() {
						if (this.textSpan) {
							var textBound = this._calcuTextBound(this.text);
							this.textSpan.style.top = textBound.y + "px";
							this.textSpan.style.left = textBound.x + "px";
						}
					},
					_calcuFlagTextBound : function(text) {
						this.tempDiv = document.createElement("span");
						this.canvas.container.appendChild(this.tempDiv);
						// tempDiv.style.display="block";

						this.tempDiv.innerHTML = text;
						var offsetW = this.tempDiv.offsetWidth + 4;
						// /document.getElementById("p1").innerHTML = text;
						// var offsetW =
						// document.getElementById("p1").offsetWidth +4;
						offsetW = offsetW == 4 ? 120 : offsetW;
						var cx = this.bound.x + this.bound.w / 2;
						var cy = this.bound.y + this.bound.h / 2;
						this.canvas.container.removeChild(this.tempDiv);
						return {
							x : cx - offsetW / 2 + 2,
							y : cy - 8,
							w : offsetW,
							h : 20
						};
					},
					updateFlagTextPos : function() {
						if (this.flagTextSpan) {
							var textBound = this
									._calcuFlagTextBound(this.flagText);
							setStyle(this.flagTextSpan, {
								bound : textBound
							});

						}
					},

					dispose : function(autoDestroy) {
						this.canvas.remove(this);
						if (this.element) {
							if (this.textSpan) {
								this.canvas.container
										.removeChild(this.textSpan);
							}
							if (this.flagTextSpan) {
								this.canvas.container
										.removeChild(this.flagTextSpan);
							}
							for (var i = 0, l = this.ports.length; i < l; i++) {
								this.ports[i].dispose();
							}
							if (!this.element.getEventSource) { // html div类型的图形
								this.element.figure = null;
								this.canvas.container.removeChild(this.element);
							} else { // dojo 类型的图形
								this.element.figure = null;
								this.element.getEventSource().figure = null;
								// delete this.element.getEventSource().figure;
								this.canvas.surface.remove(this.element);
							}
							this.element = null;
							this.textSpan = null;
							this.flagTextSpan = null;
							if (autoDestroy) {
								for ( var p in this) {
									this[p] = null;
									delete this[p];
								}
							}
						}
					},
					setBound : function(bound) {
						var offset = this.calcuOffset(bound);
						this.bound = Justep.apply(this.bound, bound);
						if (this.element) {
							if (!this.element.getEventSource) {
								setStyle(this.element, {
									bound : this.bound
								});
							} else {
								var points = this.calcuPoints();
								this.element.setShape(points);
							}
						}
						this.updateBoxPos(offset);
						this.updatePortPos();
						this.updateTextPos();
						this.updateFlagTextPos();
					},
					addPort : function(port) {
						port.owner = this;
						this.ports.push(port);
						if (this.element) {
							port.updatePos();
							this.canvas.add(port);
						}
					},
					getPortByPos : function(x, y, portType) {
						for (var i = 0, l = this.ports.length; i < l; i++) {
							var bound = this.ports[i].bound;
							if (this.containInRect(x, y, bound)) {
								if (this.ports[i].portType == portType
										|| this.ports[i].portType == 'Port') {
									return this.ports[i];
								}
							}
						}
					},
					getPort : function(portType, dir) {
						portType = portType == "InPort" ? 'OutPort' : 'Inport';
						var port = null;
						for (var i = 0, l = this.ports.length; i < l; i++) {
							if (this.ports[i].portType != portType) {
								port = this.ports[i];
								if (this.ports[i].direction == dir) {
									return this.ports[i];
								}
							}
						}
						return port;
					},
					containInRect : function(x, y, rect) {
						if (x >= rect.x && x <= rect.x + rect.w && y >= rect.y
								&& y <= rect.y + rect.h) {
							return true;
						}
						return false;
					},
					applyTransform : function(offset) {
						this.bound.x += offset.dx;
						this.bound.y += offset.dy;
						if (this.element) {
							if (!this.element.getEventSource) {
								setStyle(this.element, {
									bound : this.bound
								});
							} else {
								this.element.applyTransform(offset);
							}
							this.updateBoxPos(offset);
							this.updatePortPos();
							this.updateTextPos();
							this.updateFlagTextPos();
						}
					},
					calcuOffset : function(bound) {
						var offset = {
							dx : 0,
							dy : 0
						};
						if (bound.x) {
							offset.dx = bound.x - this.bound.x;
						}
						if (bound.y) {
							offset.dy = bound.y - this.bound.y;
						}
						return offset;
					},
					cloneFigure : function(config) {
						var newFg = new Justep.graphics[this.type](Justep
								.apply({
									bound : this.bound,
									disenableRebuildBoundByScale : true
								}, config));
						this.canvas.add(newFg);
						return newFg;
					},
					setSelect : function() {
						if (this.boxes.length > 0) {
							return;
						}
						var x = this.bound.x, y = this.bound.y, w = this.bound.w, h = this.bound.h;

						this.createBox(x + (w / 2) - 2, y - 2, "n-resize", 'n');
						this.createBox(x - 2 + w, y + (h / 2) - 2, "e-resize",
								'e');
						this.createBox(x - 2, y + (h / 2) - 2, "w-resize", 'w');
						this.createBox(x - 2 + (w / 2), y + h - 2, "s-resize",
								's');

						this.createBox(x - 2, y - 2, "nw-resize", 'wn');
						this.createBox(x + w - 2, y - 2, "ne-resize", 'ne');
						this.createBox(x - 2, y + h - 2, "ne-resize", 'sw');
						this.createBox(x - 2 + w, y + h - 2, "nw-resize", 'es');
					},
					clearSelect : function() {
						for (var i = 0; i < this.boxes.length; i++) {
							this.boxes[i].dispose();
						}
						this.boxes = [];
					},
					createBox : function(x, y, cursor, dir) {
						var config = {
							owner : this,
							x : x,
							y : y,
							cursor : cursor,
							direction : dir
						};
						var box = new Justep.graphics.Box(config);
						this.boxes.push(box);
						this.canvas.add(box);
					},
					updateBoxPos : function(offset) {
						if (this.boxes && this.boxes.length > 0) {
							var x = this.bound.x, y = this.bound.y, w = this.bound.w, h = this.bound.h;
							for (var i = 0; i < this.boxes.length; i++) {
								var box = this.boxes[i];
								switch (box.direction) {
								case 'e':
									box.setBound({
										x : x + w,
										y : y + (h / 2)
									});
									break;
								case 'w':
									box.setBound({
										x : x,
										y : y + (h / 2)
									});
									break;
								case 's':
									box.setBound({
										x : x + (w / 2),
										y : y + h
									});
									break;
								case 'n':
									box.setBound({
										x : x + (w / 2),
										y : y
									});
									break;
								case 'wn':
									box.setBound({
										x : x,
										y : y
									});
									break;
								case 'ne':
									box.setBound({
										x : x + w,
										y : y
									});
									break;
								case 'sw':
									box.setBound({
										x : x,
										y : y + h
									});
									break;
								case 'es':
									box.setBound({
										x : x + w,
										y : y + h
									});
									break;
								}
							}
						}
					},
					updatePortPos : function() {
						if (this.ports) {
							for (var i = 0, l = this.ports.length; i < l; i++) {
								this.ports[i].updatePos();
							}
						}
					},
					setPortVisible : function(visible, portType) {
						if (this.ports) {
							for (var i = 0, l = this.ports.length; i < l; i++) {
								if (portType) {
									if (this.ports[i].portType == portType
											|| this.ports[i].portType == 'Port') {
										this.ports[i].setVisible(visible);
									}
								} else {
									this.ports[i].setVisible(visible);
								}
							}
						}
					},
					setVisible : function(visible) {
						this.visible = visible;
						if (visible) {
							this.element.style.display = "";
						} else {
							this.element.style.display = "none";
						}
					},
					highLight : function(color) {
						if (color) {
							this.element.setFill(color);
							this.element.setStroke(color);
						} else {
							this.element.setStroke("red");
							this.element.setFill("yellow");
						}
						if (this.textSpan) {
							var style = this.textSpan.style;
							// style.fontWeight='bold';
							style.filter = '';// "alpha(opacity=60)" String
							style.color = '#FFFFFF';
						}
					}
				});

Justep.graphics.DojoRectangle = function(config) {
	Justep.graphics.DojoRectangle.superclass.constructor.call(this, Justep
			.apply(config, {
				type : config.type || 'DojoRectangle'
			}));
};

Justep
		.extend(
				Justep.graphics.DojoRectangle,
				Justep.graphics.Rectangle,
				{
					paint : function(createMethod) {
						if (!this.element) {
							this.rebuildBoundByScale();
							var points = this.calcuPoints();
							this.border = this.border || "black";
							this.bgColor = this.bgColor || "#FFFFFF";
							this.bgColor = this.bgColor != 'NULL' ? this.bgColor
									: null;
							createMethod = createMethod || 'createPolyline';
							this.element = this.canvas.surface[createMethod]
									(points);
							if (this.visible) {
								this.element.setFill(this.bgColor).setStroke(
										this.border);
							}
							this.element.getEventSource().figure = this;

							this.updatePortPos();
							for (var i = 0, l = this.ports.length; i < l; i++) {
								this.canvas.add(this.ports[i]);
							}
							if (this.text) {
								this.setText(this.text);
							}
						}
					},

					/**
					 * 
					 */
					calcuPoints : function() {
						var poinits = [];
						var x = this.bound.x, y = this.bound.y, w = this.bound.w, h = this.bound.h;
						poinits.push({
							x : x,
							y : y
						});
						poinits.push({
							x : x + w,
							y : y
						});
						poinits.push({
							x : x + w,
							y : y + h
						});
						poinits.push({
							x : x,
							y : y + h
						});
						poinits.push({
							x : x,
							y : y
						});
						return poinits;
					}
				});

/**
 * 三角型.
 */
Justep.graphics.Triangular = function(config) {
	var bound = config.bound || {};
	Justep.graphics.Rhombus.superclass.constructor.call(this, Justep.apply(
			config, {
				type : config.type || 'Triangular',
				bound : {
					x : bound.x,
					y : bound.y,
					w : bound.w || 100,
					h : bound.h || 35
				}
			}));
};

Justep
		.extend(
				Justep.graphics.Triangular,
				Justep.graphics.DojoRectangle,
				{
					direction : 'd', /* 三角形的方向,默认为项 */

					_calcuTextBound : function(text) {
						var bound = Justep.graphics.Triangular.superclass._calcuTextBound
								.call(this, text);
						bound.y -= 8;
						return bound;
					},
					/**
					 * 根据方向和区域范围计算三角形的坐标点.
					 */
					calcuPoints : function() {
						var poinits = [];
						var x = this.bound.x, y = this.bound.y, w = this.bound.w, h = this.bound.h;
						switch (this.direction) { // 三角形方向
						case 'd': // 向下
							poinits.push({
								x : x,
								y : y
							});
							poinits.push({
								x : x + w,
								y : y
							});
							poinits.push({
								x : x + w / 2,
								y : y + h
							});
							poinits.push({
								x : x,
								y : y
							});
						}
						return poinits;
					}
				});

/**
 * 菱形.
 */
Justep.graphics.Rhombus = function(config) {
	var bound = config.bound || {};
	Justep.graphics.Rhombus.superclass.constructor.call(this, Justep.apply(
			config, {
				type : config.type || 'Rhombus',
				bound : {
					x : bound.x,
					y : bound.y,
					w : bound.w || 100,
					h : bound.h || 35
				}
			}));
};

Justep
		.extend(
				Justep.graphics.Rhombus,
				Justep.graphics.DojoRectangle,
				{
					calcuPoints : function() {
						var poinits = [];
						var x = this.bound.x, y = this.bound.y, w = this.bound.w, h = this.bound.h;
						poinits.push({
							x : x,
							y : y + h / 2
						});
						poinits.push({
							x : x + w / 2,
							y : y
						});
						poinits.push({
							x : x + w,
							y : y + h / 2
						});
						poinits.push({
							x : x + w / 2,
							y : y + h
						});
						poinits.push({
							x : x,
							y : y + h / 2
						});
						return poinits;
					}
				});

/**
 * 六边形.
 */
Justep.graphics.Hexagon = function(config) {
	var bound = config.bound || {};
	Justep.graphics.Hexagon.superclass.constructor.call(this, Justep.apply(
			config, {
				type : config.type || 'Hexagon',
				bound : {
					x : bound.x,
					y : bound.y,
					w : bound.w || 100,
					h : bound.h || 35
				}
			}));
};

Justep
		.extend(
				Justep.graphics.Hexagon,
				Justep.graphics.DojoRectangle,
				{
					calcuPoints : function() {
						var poinits = [];
						var x = this.bound.x, y = this.bound.y, w = this.bound.w, h = this.bound.h;
						poinits.push({
							x : x,
							y : y + h / 2
						});
						poinits.push({
							x : x + w / 4,
							y : y
						});
						poinits.push({
							x : x + w * 3 / 4,
							y : y
						});
						poinits.push({
							x : x + w,
							y : y + h / 2
						});
						poinits.push({
							x : x + w * 3 / 4,
							y : y + h
						});
						poinits.push({
							x : x + w / 4,
							y : y + h
						});
						poinits.push({
							x : x,
							y : y + h / 2
						});
						return poinits;
					}
				});
/**
 * 梯形.
 */
Justep.graphics.Trapezoid = function(config) {
	var bound = config.bound || {};
	Justep.graphics.Trapezoid.superclass.constructor.call(this, Justep.apply(
			config, {
				type : config.type || 'Trapezoid',
				bound : {
					x : bound.x,
					y : bound.y,
					w : bound.w || 100,
					h : bound.h || 35
				}
			}));
};

Justep
		.extend(
				Justep.graphics.Trapezoid,
				Justep.graphics.DojoRectangle,
				{
					calcuPoints : function() {
						var poinits = [];
						var x = this.bound.x, y = this.bound.y, w = this.bound.w, h = this.bound.h;
						poinits.push({
							x : x,
							y : y
						});
						poinits.push({
							x : x + w,
							y : y
						});
						poinits.push({
							x : x + w * 3 / 4,
							y : y + h
						});
						poinits.push({
							x : x + w / 4,
							y : y + h
						});
						poinits.push({
							x : x,
							y : y
						});
						return poinits;
					}
				});

/**
 * 正圆形.
 */
Justep.graphics.Circle = function(config) {
	var bound = config.bound || {};
	Justep.graphics.Circle.superclass.constructor.call(this, Justep.apply(
			config, {
				type : config.type || 'Circle',
				bound : {
					x : bound.x,
					y : bound.y,
					w : bound.w || 40,
					h : bound.h || 40
				}
			}));
};

Justep.extend(Justep.graphics.Circle, Justep.graphics.Rectangle, {
	direction : 'd', /* 三角形的方向,默认为项 */

	paint : function() {
		Justep.graphics.Triangular.superclass.paint.call(this, 'createCircle');
	},

	/**
	 * 根据区域范围计算圆心与半径.
	 */
	calcuPoints : function() {
		var poinits = {
			cx : this.bound.x + this.bound.w / 2,
			cy : this.bound.y + this.bound.h / 2,
			r : Math.max(this.bound.w, this.bound.h) / 2
		};
		// this.bound =
		// {x:poinits.cx-poinits.r,y:poinits.cy-poinits.r,w:poinits.r*2,h:2*poinits.r};
		return poinits;
	}
});

/**
 * 小正方形
 */
Justep.graphics.Box = function(config) {
	config = {
		bound : {
			x : config.x + 2,
			y : config.y + 2,
			w : 6,
			h : 6
		},
		owner : config.owner,
		bgColor : 'green',
		border : 'green',
		cursor : config.cursor,
		direction : config.direction
	};
	Justep.graphics.Box.superclass.constructor.call(this, Justep.apply(config,
			{
				type : 'Box'
			}));
};

Justep.extend(Justep.graphics.Box, Justep.graphics.Rectangle, {
	rebuildBoundByScale : function() {
	}
});

/**
 * 端口方向。
 */
Justep.PortDirection = {
	UP : 0,
	RIGHT : 1,
	DOWN : 2,
	LEFT : 3
};

/**
 * 端口图形，用做于连接线的锚点..
 */
Justep.graphics.Port = function(config) {
	var r = config.r || 4;
	Justep.graphics.Port.superclass.constructor.call(this, Justep.apply(config,
			{
				type : config.type || 'Port',
				bgColor : [ 0, 0, 255, 0.5 ],
				bound : {
					x : config.x,
					y : config.y,
					w : r * 2,
					h : r * 2
				}
			}));
	this.position = {
		x : this.bound.x,
		y : this.bound.y
	};
	this.addEvents('positionChanged', 'dispose');
	this.portType = config.portType || 'Port';
	this.connectionCount = 0;
};

Justep.extend(Justep.graphics.Port, Justep.graphics.Circle, {
	setVisible : function(visible) {
		if (visible == this.visible) {
			return;
		}
		if (!visible && this.element) {
			this.element.setFill(null);
			this.element.setStroke(null);
		} else if (!this.visible && visible) {
			this.element.setFill(this.bgColor);
			this.element.setStroke(this.border);
			this.element.moveToFront();
		}
		this.visible = visible;
		if (visible) {
			if (this.owner) {
				this.owner.setPortVisible(true, this.portType);
			}
		}
	},
	rebuildBoundByScale : function() {
	},
	/** 统计连接线的数量 * */
	addConnectionCount : function(count) {
		this.connectionCount += count;
		if (this.connectionCount == 0) {
			this.portType = "Port";
		}
	},

	/**
	 * 设置高亮显示
	 */
	setHighLight : function(highLight) {
		if (highLight && !this.highLightPort) {
			var points = this.calcuPoints();
			points.x -= 10;
			points.y -= 10;
			points.r += 5;
			this.highLightPort = this.canvas.surface.createCircle(points);
			this.highLightPort.setFill([ 245, 123, 255, 0.5 ]);
			this.highLightPort.getEventSource().figure = this;
		} else if (!highLight && this.highLightPort) {
			this.canvas.surface.remove(this.highLightPort);
			this.highLightPort = null;
		}
	},

	dispose : function() {
		this.fireEvent("dispose", this);
		Justep.graphics.Triangular.superclass.dispose.call(this);
	},

	updatePos : function() {
		if (this.calcuFun) {
			var bound = this.calcuFun.call(this, this.owner.bound);
			this.setBound(bound);
			this.fireEvent("positionChanged", this, bound);
		}
	}
});

/**
 * 直线。
 */
Justep.graphics.Line = function(config) {
	this.points = config.points || [ {
		x : 0,
		y : 0
	}, {
		x : 0,
		y : 0
	} ];
	Justep.graphics.Line.superclass.constructor.call(this, Justep.apply(config,
			{
				type : config.type || 'Line'
			}));
	this.boxes = [];
	this.sn = (Justep.graphics._connCount++);
};

Justep.extend(Justep.graphics.Line, Justep.graphics.Figure, {
	paint : function() {
		if (!this.element) {
			this.router = new ManhattanConnectionRouter();
			var points = this.calcuPoints();
			this.border = this.border || [ 0, 0, 255, 0.5 ];
			this.element = this.canvas.surface.createLine(points).setStroke({
				style : 'ShortDash',
				color : this.border
			});
			this.element.getEventSource().figure = this;
		}
	},
	dispose : function() {
		this.canvas.remove(this);
		if (this.element) {
			this.element.getEventSource().figure = null;
			this.canvas.surface.remove(this.element);
			for ( var p in this) {
				this[p] = null;
			}
		}
	},
	setShape : function(points) {
		this.points = points;
		if (this.element) {
			var points = this.calcuPoints();
			this.element.setShape(points);
		}
	},
	setPoint : function(idx, newPoint) {
		this.points[idx] = newPoint;
		this.setShape(this.points);
	},
	calcuPoints : function() {
		if (this.points) {
			return {
				x1 : this.points[0].x,
				y1 : this.points[0].y,
				x2 : this.points[1].x,
				y2 : this.points[1].y
			};
		}
		return {
			x1 : 0,
			y1 : 0,
			x2 : 12,
			y2 : 12
		};
	}
});

/**
 * 连接线.
 */
Justep.graphics._connCount = 0;
Justep.graphics.Connection = function(config) {
	this.points = config.points || [ {
		x : 0,
		y : 0
	}, {
		x : 0,
		y : 0
	} ];
	Justep.graphics.Connection.superclass.constructor.call(this, Justep.apply(
			config, {
				type : config.type || 'Connection'
			}));
	this.boxes = [];
	this.text = config.text;
	this.sn = (Justep.graphics._connCount++);
};

Justep
		.extend(
				Justep.graphics.Connection,
				Justep.graphics.Figure,
				{
					innerCount : 0,
					paint : function() {
						if (!this.element) {// alert("==="+JSON.stringify(this.points));
							this.router = new ManhattanConnectionRouter();

							this.border = this.border || 'black';
							this.element = this.canvas.surface.createShape({
								type : "path"
							}).setStroke({
								color : this.border,
								width : 1
							});

							this.element.moveTo(this.points[0].x,
									this.points[0].y);
							for (var i = 1; i < this.points.length; i++) {
								this.element.lineTo(this.points[i].x,
										this.points[i].y);
							}
							this.element.getEventSource().figure = this;
							this.paintArrow();
							if (this.text) {
								this.setText(this.text);
							}
						}
					},
					highLight : function(color) {
						this.border = color;
						if (color) {
							this.element.setStroke(color);
							this.arrow.setStroke({
								color : color
							});
							this.arrow.setFill(color);
						} else {
							this.element.setStroke({
								color : 'green'
							});
							this.arrow.setStroke({
								color : 'green'
							});
							this.arrow.setFill('green');
						}
					},
					paintArrow : function() {
						if (this.inPort) {
							var offset = 9;
							var p0 = {
								x : this.points[this.points.length - 1].x,
								y : this.points[this.points.length - 1].y
							}, p1 = {}, p2 = {}, p4 = {
								x : p0.x,
								y : p0.y
							};
							switch (this.inPort.direction) {
							case Justep.PortDirection.DOWN:
								p1.x = p0.x - offset / 3;
								p2.x = p0.x + offset / 3;
								p1.y = p2.y = p0.y + offset;
								break;
							case Justep.PortDirection.UP:
								p1.x = p0.x - offset / 3;
								p2.x = p0.x + offset / 3;
								p1.y = p2.y = p0.y - offset;
								break;
							case Justep.PortDirection.LEFT:
								p1.y = p0.y - offset / 3;
								p2.y = p0.y + offset / 3;
								p1.x = p2.x = p0.x - offset;
								break;
							case Justep.PortDirection.RIGHT:
								p1.y = p0.y - offset / 3;
								p2.y = p0.y + offset / 3;
								p1.x = p2.x = p0.x + offset;
								break;
							}
							if (!this.arrow) {
								this.arrow = this.canvas.surface
										.createPolyline([ p0, p1, p2, p4 ])
										.setStroke("black").setFill("black");
								this.arrow.getEventSource().figure = this;
							} else {
								this.arrow.setShape([ p0, p1, p2, p4 ]);
							}
						}
					},

					setInPort : function(inPort) {
						if (!inPort) {// alert(Justep.graphics.Connection.prototype.setInPort.caller);
							return;
						}
						if (this.inPort) {
							this.removeCusPointFlag();
						}
						// alert("==111"+this.inPort);
						var bound = inPort.bound;
						// if(bound){
						if (inPort == this.inPort) {
							this.setPoint(this.points.length - 1, {
								x : bound.x + bound.w / 2,
								y : bound.y + bound.h / 2
							});
							return;
						}// alert("======="+JSON.stringify(this.points));
						// }
						if (this.inPort) {
							this.inPort.portType == 'Port';
							this.inPort.removeListener('positionChanged',
									this.positionChangedHandler, this);
							this.inPort.removeListener('dispose', this.dispose,
									this);
							this.inPort.addConnectionCount(-1);
						}
						inPort.portType = 'InPort';
						this.inPort = inPort;

						var hasCusMovePt = false;

						for (var i = 0, l = this.points.length; i < l; i++) {
							if (this.points[i].cusMove) {
								hasCusMovePt = true;
								break;
							}
						}
						if (!hasCusMovePt) {
							var bound = inPort.bound;
							this.points.push({
								x : bound.x + bound.w / 2,
								y : bound.y + bound.h / 2
							});
							this.points = this.router.route(this);
						}

						var conns = this.canvas.getAllConnections(true);
						this.canvas.calcuInterPoint(this, 1, conns);

						this.setShape(this.points);
						this.paintArrow();
						this.inPort.on('positionChanged',
								this.positionChangedHandler, this);
						this.inPort.on('dispose', this.dispose, this);
						this.inPort.addConnectionCount(1);
					},

					setOutPort : function(outPort) {
						if (this.outPort) {
							this.removeCusPointFlag();
						}
						var bound = outPort.bound;
						if (outPort == this.outPort) {
							this.setPoint(0, {
								x : bound.x + bound.w / 2,
								y : bound.y + bound.h / 2
							});
							return;
						}
						if (this.outPort) {
							this.outPort.portType == 'Port';
							this.outPort.removeListener('positionChanged',
									this.positionChangedHandler, this);
							this.outPort.removeListener('dispose',
									this.dispose, this);
							this.outPort.addConnectionCount(-1);
						}
						outPort.portType = 'OutPort';
						this.outPort = outPort;
						this.setPoint(0, {
							x : bound.x + bound.w / 2,
							y : bound.y + bound.h / 2
						});
						this.outPort.on('positionChanged',
								this.positionChangedHandler, this);
						this.outPort.on('dispose', this.dispose, this);
						this.outPort.addConnectionCount(1);
					},

					positionChangedHandler : function(port, bound) {
						if (port.portType == 'InPort') {
							this.setPoint(this.points.length - 1, {
								x : bound.x + bound.w / 2,
								y : bound.y + bound.h / 2
							});
						} else {
							this.setPoint(0, {
								x : bound.x + bound.w / 2,
								y : bound.y + bound.h / 2
							});
						}
					},
					removeCusPointFlag : function() {
						for (var i = 0, l = this.points.length; i < l; i++) {
							if (this.points[i].cusMove) {
								delete this.points[i].cusMove;
							}
						}
					},
					setPoint : function(idx, newPoint) {
						var dx = newPoint.x - this.points[idx].x;
						var dy = newPoint.y - this.points[idx].y;

						this.points[idx].x = newPoint.x;
						this.points[idx].y = newPoint.y;
						if (this.element) {

							if (this.inPort && this.outPort) {
								var hasCusMovePt = false;
								for (var i = 0, l = this.points.length; i < l; i++) {
									if (this.points[i].cusMove) {
										hasCusMovePt = true;
										break;
									}
								}
								if (!hasCusMovePt) {
									this.points = this.router.route(this);
								} else {
									var tempIdx = -1;
									var direction = this.inPort.direction;
									if (idx == this.points.length - 1) {
										tempIdx = idx - 1;
									} else {
										tempIdx = idx + 1;
										direction = this.outPort.direction;
									}
									switch (direction) {
									case Justep.PortDirection.UP:
									case Justep.PortDirection.DOWN:
										this.points[tempIdx].x += dx;
										break;
									case Justep.PortDirection.LEFT:
									case Justep.PortDirection.RIGHT:
										this.points[tempIdx].y += dy;
									}
								}
							}
							this.setShape(this.points);
						}
						this.paintArrow();
					},

					setShape : function(shape) {
						this.points = shape;
						var sPoints = [ "M" ];
						for (var i = 0; i < shape.length; i++) {

							sPoints.push(shape[i].x);
							sPoints.push(shape[i].y);
							if (shape[i].attach) {
								sPoints.push(shape[i].attach);
								sPoints.push(" L");
								// this.element.moveToFront();
							}
						}
						this.element.setShape(sPoints.join(" "));
						this.updateBoxPos();
						this.updateTextPos();
					},

					addPoint : function(idx, newPoint) {
						this.justPoint(idx, newPoint);
						this.points.splice(idx, 0, newPoint);
						if (this.element) {
							this.element.setShape(this.points);
							this.clearSelect();
							this.setSelect();

						}
					},

					removePoint : function(idx) {
						if (idx > 1 && idx < (this.points.length - 2)) {
							if (idx + 2 == (this.points.length - 1)) {
								idx -= 1;
							}
							if (idx - 1 == 0) {
								idx += 1;
							}
							var p1 = this.points[idx - 1], p2 = this.points[idx], p3 = this.points[idx + 1];
							if ((p1.x == p2.x && p1.y == p2.y)) {
								this.points.splice(idx - 1, 2);
							} else if ((p2.x == p3.x && p2.y == p3.y)) {
								this.points.splice(idx, 2);
							} else {
								var point = this.calcuNewPoint(p1, p2, p3);
								this.points.splice(idx - 1, 3, point);
							}
							this.clearSelect();
							this.setShape(this.points);
							this.setSelect();
						}
					},
					calcuNewPoint : function(p1, p2, p3) {
						var p = {};
						if (p1.x == p2.x && p2.y == p3.y) {
							p.x = p3.x;
							p.y = p1.y;
						} else if (p1.x < p2.x && p2.y < p3.y) {
							p.x = p1.x;
							p.y = p3.y;
						} else if (p1.x > p2.x && p2.y < p3.y) {
							p.x = p1.x;
							p.y = p3.y;
						} else if (p1.x < p2.x && p2.y > p3.y) {
							p.x = p1.x;
							p.y = p3.y;
						}
						return p;
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
					indexOfBox : function(box) {
						return this.boxes.indexOf(box);
					},
					justPoint : function(idx, newPoint) {
						var p1 = this.points[idx - 1];
						var p2 = this.points[idx];
						if (p1.x == p2.x) {
							newPoint.x = p1.x;
						} else if (p1.y == p2.y) {
							newPoint.y = p1.y;
						}
					},
					calcuPoints : function() {
						if (!this.points) {

						}
						return this.points;
					},
					dispose : function(autoDestroy) {
						if (this.inPort) {
							this.inPort.removeListener('positionChanged',
									this.positionChangedHandler, this);
							this.inPort.removeListener('dispose', this.dispose,
									this);
							this.inPort.addConnectionCount(-1);
							this.inPortOwnerId = this.inPort.owner.id;
							this.inPortDirection = this.inPort.direction;
						}
						if (this.outPort) {
							this.outPort.removeListener('positionChanged',
									this.positionChangedHandler, this);
							this.outPort.removeListener('dispose',
									this.dispose, this);
							this.outPort.addConnectionCount(-1);
							this.outPortOwnerId = this.outPort.owner.id;
							this.outPortDirection = this.outPort.direction;
						}
						this.canvas.remove(this);
						if (this.element) {
							this.inPort = null;
							this.outPort = null;
							this.element.getEventSource().figure = null;
							this.canvas.surface.remove(this.element);
							if (this.arrow) {
								this.canvas.surface.remove(this.arrow);
								this.arrow = null;
							}
							this.element = null;
							if (autoDestroy == true) {
								for ( var p in this) {
									this[p] = null;
								}
							}
						}
						if (this.textDiv) {
							this.textDiv.figure = null;
							this.textDiv.parentNode.removeChild(this.textDiv);
						}
					},
					setSelect : function() {
						if (this.boxes.length > 0) {
							return;
						}
						// for(var i = 0,l=this.points.length;i<l;i++){
						// this.createBox(this.points[i].x-2,this.points[i].y-2,"default");
						// }
						this.element.setStroke({
							color : 'red',
							width : 1.6
						});
					},
					clearSelect : function() {
						for (var i = 0; i < this.boxes.length; i++) {
							this.boxes[i].dispose();
						}
						this.boxes = [];
						this.element.setStroke({
							color : this.border,
							width : 1
						});
					},

					createBox : function(x, y, cursor) {
						var config = {
							owner : this,
							x : x,
							y : y,
							cursor : cursor
						};
						var box = new Justep.graphics.Box(config);
						this.boxes.push(box);
						this.canvas.add(box);
					},

					updateBoxPos : function() {
						if (this.boxes.length > 0) {
							for (var i = 0, l = this.points.length; i < l; i++) {
								if (this.boxes[i]) {
									var bound = this.boxes[i].bound;
									bound.x = this.points[i].x;
									bound.y = this.points[i].y;
									this.boxes[i].setBound(bound);
								}
							}
						}
					},
					getPointIndex : function(point) {
						var index = -1;
						for (var i = 0; i < this.points.length; i++) {
							if ((i + 1) < this.points.length) {
								var flag = containInLine(point.x, point.y, {
									x1 : this.points[i].x,
									y1 : this.points[i].y,
									x2 : this.points[i + 1].x,
									y2 : this.points[i + 1].y
								});
								if (flag == true) {
									index = i;
									break;
								}
							}
						}
						return index;
					},
					/**
					 * 设置文本.
					 */
					setText : function(text) {
						this.text = text;
						if (this.element) {
							var textBound = this._calcuTextBound();
							if (!this.textDiv) {
								this.textDiv = document.createElement("div");
								setStyle(this.textDiv, {
									fontFamily : '宋体',
									fontSize : '9pt',
									wordBreak : 'break-all',
									textAlign : 'center',
									filter : "alpha(opacity=60)",
									overflow : "hidden",
									position : "absolute",
									bound : textBound
								});
								this.canvas.container.appendChild(this.textDiv);
								this.textDiv.figure = this;
							} else {
								this.updateTextPos();
							}
							this.textDiv.innerHTML = text;
						}
					},
					updateTextPos : function() {
						if (this.textDiv) {
							var textBound = this._calcuTextBound(this.text);
							setStyle(this.textDiv, {
								bound : textBound
							});

						}
					},
					getTagLocationInPolyline : function() {
						var polyLinePoints = this.points;
						this.tagpointinpolyline = {
							begin : {
								x : 0,
								y : 0
							},
							end : {
								x : 0,
								y : 0
							}
						};
						var x1, y1, x2, y2;
						var resultP = {
							x : 0,
							y : 0
						};
						for (var i = 0; i < polyLinePoints.length - 1; i++) {
							if (this.tagpointinpolyline
									&& ((distance(this.tagpointinpolyline.end,
											this.tagpointinpolyline.begin)) < distance(
											polyLinePoints[i],
											polyLinePoints[i + 1]))) {
								this.tagpointinpolyline = {
									begin : polyLinePoints[i],
									end : polyLinePoints[i + 1]
								};
							}
							if (this.tagpointinpolyline) {
								resultP = this.getMidPoint(
										this.tagpointinpolyline.begin,
										this.tagpointinpolyline.end);
							}
							return resultP;
						}
					},
					_calcuTextBound : function(text) {
						var tempDiv = document.createElement("span");
						tempDiv.style.position = "absolute";
						tempDiv.style.top = "-100px";
						document.body.appendChild(tempDiv);
						// tempDiv.style.display="block";
						var bound = this.getTagLocationInPolyline();
						tempDiv.innerHTML = text;
						var offsetW = tempDiv.offsetWidth + 4;
						var offsetH = tempDiv.offsetHeight + 1;
						// /document.getElementById("p1").innerHTML = text;
						// var offsetW =
						// document.getElementById("p1").offsetWidth +4;
						offsetW = offsetW == 4 ? 120 : offsetW;
						offsetH = offsetH == 1 ? 20 : offsetH;
						var cx = bound.x;
						var cy = bound.y;
						document.body.removeChild(tempDiv);
						return {
							x : cx - offsetW / 2 + 2,
							y : cy - (offsetH / 3),
							w : offsetW,
							h : offsetH
						};
					},
					getMidPoint : function(p1, p2) {
						this.resultPoint = {
							x : 0,
							y : 0
						};
						this.resultPoint.x = (p1.x + p2.x) / 2;
						this.resultPoint.y = (p1.y + p2.y) / 2;
						return this.resultPoint;
					}
				});

/**
 * 流程轨迹图的提示框
 */
Justep.graphics.BaudTips = function(config) {
	config.bound = config.bound || {};
	config.bound.x = config.bound.x || 0;
	config.bound.y = config.bound.y || 0;
	config.bound.w = config.bound.w || 256;
	config.bound.h = config.bound.h || 110;
	Justep.graphics.BaudTips.superclass.constructor.call(this, Justep.apply(
			config, {
				type : config.type || 'BaudTips'
			}));
	this.data = config.data;
};
Justep
		.extend(
				Justep.graphics.BaudTips,
				Justep.graphics.Rectangle,
				{
					paint : function() {
						Justep.graphics.BaudTips.superclass.paint.call(this);
						var name = this.data.name || '';
						var executor = this.data.executor || '';
						var executordepartment = this.data.executordepartment
								|| '';
						var status = this.data.status || '';
						var createtime = this.data.createtime || '';
						var executetime = this.data.executetime || '';
						var style = ' style="padding: 1px 4px 1px 4px;border-bottom:1px solid black;font:bold 10pt;height:20px;width:75px"';
						var style0 = ' style="border-bottom:1px solid black;font:10pt;height:15px"';
						var style1 = ' style="padding: 1px 4px 1px 4px;font:bold 10pt;height:20px"';
						var style2 = ' style="font: 10pt;"';
						if (typeof executor == 'string') {
							executor = executordepartment + "/" + executor;
							this.element.innerHTML = '<table width="100%" border="0" cellpadding="0" cellspacing="0" style="table-layout:fixed">'
									+ '<tr><td'
									+ style
									+ '>标题:</td><td'
									+ style0
									+ '>'
									+ name
									+ '</td></tr>'
									+ '<tr><td'
									+ style1
									+ '>执行者:</td><td'
									+ style2
									+ '>'
									+ executor
									+ '</td></tr>'
									+
									// '<tr><td' + style1 + '>所属部门:</td><td' +
									// style2 + '>' + executordepartment +
									// '</td></tr>' +
									'<tr><td'
									+ style1
									+ '>状态:</td><td'
									+ style2
									+ '>'
									+ status
									+ '</td></tr>'
									+ '<tr><td'
									+ style1
									+ '>开始时间:</td><td'
									+ style2
									+ '>'
									+ formatDate(createtime)
									+ '</td></tr>'
									+ '<tr><td'
									+ style1
									+ '>结束时间:</td><td'
									+ style2
									+ '>'
									+ formatDate(executetime)
									+ '</td></tr>'
									+ '</table>';
							this.table = this.element.lastChild;

							var rows = this.table.rows;
							for (var i = 0, l = rows.length; i < l; i++) {
								rows[i].cells[0].figure = this;
								rows[i].cells[1].figure = this;
							}
							;
							for (var i = 0, l = rows.length; i < l; i++) {
								var cell = rows[i].cells[1];
								this.fixedCellLayout(cell);
							}
						} else {
							// debugger;
							// alert(typeof executor);
							// TODO MULTIPLY!
							var name = this.data.name || '';
							var executor = this.data.executor || '';
							var executordepartment = this.data.executordepartment
									|| '';
							var status = this.data.status || '';
							var createtime = this.data.createtime || '';
							var executetime = this.data.executetime || '';
							var hasTitle;
							var html = "";
							// hcr:
							style1 = ' style="padding: 1px 4px 1px 4px;font:bold 10pt;height:20px;width:75px"';

							for (var i = 0; i < executor.length; i++) {
								var subTask = executor[i];
								// var name = subTask.name || '';
								var owner = subTask.executor || '';
								var executordepartment = subTask.executordepartment
										|| '';
								var status = subTask.status || '';
								var createtime = subTask.createtime || '';
								var executetime = subTask.executetime || '';
								executetime = executetime.trim();
								if (executetime != '') {
									executetime = '<tr><td' + style1
											+ '>结束时间:</td><td' + style2 + '>'
											+ formatDate(executetime)
											+ '</td></tr>';
								}
								var subTitleStyle = ' style="border-bottom:1px solid black;font:10pt;height:0px"';
								//
								var sCaption = '<tr height=\"5\"><td' + style
										+ '></td><td' + subTitleStyle + '>'
										+ '</td></tr>';
								if (!hasTitle) {
									sCaption = '<tr><td' + style
											+ '>标题:</td><td' + style0 + '>'
											+ name + '</td></tr>';
								}
								hasTitle = true;
								owner = executordepartment + "/" + owner;
								//
								html += '<table width="100%" border="0" cellpadding="0" cellspacing="0" style="table-layout:fixed">'
										+
										// sCaption +
										// '<tr><td' + style + '>标题:</td><td' +
										// style0 + '>' + name + '</td></tr>' +
										'<tr><td'
										+ style1
										+ '>执行者:</td><td'
										+ style2
										+ '>'
										+ owner
										+ '</td></tr>'
										+
										// '<tr><td' + style1 + '>所属部门:</td><td'
										// + style2 + '>' + executordepartment +
										// '</td></tr>' +
										'<tr><td'
										+ style1
										+ '>状态:</td><td'
										+ style2
										+ '>'
										+ status
										+ '</td></tr>'
										+ '<tr><td'
										+ style1
										+ '>开始时间:</td><td'
										+ style2
										+ '>'
										+ formatDate(createtime)
										+ '</td></tr>'
										+ executetime
										+ '</table><hr/>';
								if (!executetime) {

								}
								this.element.innerHTML = html;
								// var table = this.element.lastChild;
								// var rows = table.rows;
								// for (var j = 0, l = rows.length; j < l; j++)
								// {
								// rows[j].cells[0].figure = this;
								// rows[j].cells[1].figure = this;
								// };
							}
							for (var i = 0; i < this.element.children.length; i++) {
								// var child = this.element.getChild(i);
								var table = this.element.children[i];
								if (table.tagName == "HR") {
									table.figure = this;
									continue;
								}
								var rows = table.rows;
								for (var j = 0, l = rows.length; j < l; j++) {
									rows[j].cells[0].figure = this;
									rows[j].cells[1].figure = this;
								}
								;
								for (var j = 0, l = rows.length; j < l; j++) {
									var cell = rows[j].cells[1];
									this.fixedCellLayout(cell);
								}

							}
							this.bound.h = this.element.scrollHeight
									|| (parseInt(this.element.style.height) * executor.length);
							this.element.style.height = this.bound.h + "px"; // zmh
							// alert(executor.length+"=="+this.element.scrollHeight+"==="+this.element.offsetHeight+"=="+this.element.style.height);
							// this.appendHeight(this.element,(100*(executor.length-1)));//5个子任务以内目前没有问题.
						}
					},
					fixedCellLayout : function(cell) {
						var txt = cell.innerHTML;
						var line = this.calculateTextLayout(txt);
						if (line > 1) {
							var delt = line * 9;
							this.appendHeight(cell, delt);
							this.appendHeight(this.element, delt);
						}
					},
					appendHeight : function(obj, delt) {
						var oldHeight = obj.style.height;
						if (!oldHeight || oldHeight == '')
							oldHeight = 20;
						else
							oldHeight = oldHeight.substring(0,
									oldHeight.length - 2);
						var newHeight = parseInt(oldHeight) + parseInt(delt);
						this.bound.h = newHeight;
						obj.style.height = newHeight;
					},
					calculateTextLayout : function(text) {
						return text.replace(/[^\x00-\xff]/g, "rr").length / 20;
					},
					setData : function(data) {
						this.data = data;
					}
				});
/**
 * 波特矩形
 */
Justep.graphics.BaudRectangle = function(config) {
	Justep.graphics.BaudRectangle.superclass.constructor.call(this, Justep
			.apply(config, {
				type : config.type || 'BaudRectangle'
			}));
};

Justep
		.extend(
				Justep.graphics.BaudRectangle,
				Justep.graphics.Rectangle,
				{
					paint : function() {
						Justep.graphics.BaudRectangle.superclass.paint
								.call(this);
						// debugger;
						var name = this.data.name || '';
						var executor = this.data.executor || '';
						var executordepartment = this.data.executordepartment
								|| '';
						var status = this.data.status || '';
						var createtime = this.data.createtime || '';
						var executetime = this.data.executetime || '';
						var style = ' style="padding: 1px 4px 1px 4px;border-bottom:1px solid black;font:bold 10pt;height:20px;width:75px"';
						var style0 = ' style="border-bottom:1px solid black;font:10pt;height:15px"';
						var style1 = ' style="padding: 1px 4px 1px 4px;font:bold 10pt;height:20px"';
						var style2 = ' style="font: 10pt;"';
						if (typeof executor == 'string') {
							executor = executordepartment + "/" + executor;
							this.element.innerHTML = '<table width="100%" border="0" cellpadding="0" cellspacing="0" style="table-layout:fixed">'
									+ '<tr><td'
									+ style
									+ '>标题:</td><td'
									+ style0
									+ '>'
									+ name
									+ '</td></tr>'
									+ '<tr><td'
									+ style1
									+ '>执行者:</td><td'
									+ style2
									+ '>'
									+ executor
									+ '</td></tr>'
									+
									// '<tr><td' + style1 + '>所属部门:</td><td' +
									// style2 + '>' + executordepartment +
									// '</td></tr>' +
									'<tr><td'
									+ style1
									+ '>状态:</td><td'
									+ style2
									+ '>'
									+ status
									+ '</td></tr>'
									+ '<tr><td'
									+ style1
									+ '>开始时间:</td><td'
									+ style2
									+ '>'
									+ formatDate(createtime)
									+ '</td></tr>'
									+ '<tr><td'
									+ style1
									+ '>结束时间:</td><td'
									+ style2
									+ '>'
									+ formatDate(executetime)
									+ '</td></tr>'
									+ '</table>';
							this.table = this.element.lastChild;

							var rows = this.table.rows;
							for (var i = 0, l = rows.length; i < l; i++) {
								rows[i].cells[0].figure = this;
								rows[i].cells[1].figure = this;
							}
							;
							for (var i = 0, l = rows.length; i < l; i++) {
								var cell = rows[i].cells[1];
								this.fixedCellLayout(cell);
							}
						} else {
							// debugger;
							// alert(typeof executor);
							// TODO MULTIPLY!
							var name = this.data.name || '';
							var executor = this.data.executor || '';
							var executordepartment = this.data.executordepartment
									|| '';
							var status = this.data.status || '';
							var createtime = this.data.createtime || '';
							var executetime = this.data.executetime || '';
							var hasTitle;

							// hcr:
							style1 = ' style="padding: 1px 4px 1px 4px;font:bold 10pt;height:20px;width:75px"';

							for (var i = 0; i < executor.length; i++) {
								var subTask = executor[i];
								// var name = subTask.name || '';
								var owner = subTask.executor || '';
								var executordepartment = subTask.executordepartment
										|| '';
								var status = subTask.status || '';
								var createtime = subTask.createtime || '';
								var executetime = subTask.executetime || '';
								executetime = executetime.trim();
								if (executetime != '') {
									executetime = '<tr><td' + style1
											+ '>结束时间:</td><td' + style2 + '>'
											+ formatDate(executetime)
											+ '</td></tr>';
								}
								var subTitleStyle = ' style="border-bottom:1px solid black;font:10pt;height:0px"';
								//
								var sCaption = '<tr height=\"5\"><td' + style
										+ '></td><td' + subTitleStyle + '>'
										+ '</td></tr>';
								if (!hasTitle) {
									sCaption = '<tr><td' + style
											+ '>标题:</td><td' + style0 + '>'
											+ name + '</td></tr>';
								}
								hasTitle = true;
								owner = executordepartment + "/" + owner;

								this.element.innerHTML += '<table width="100%" border="0" cellpadding="0" cellspacing="0" style="table-layout:fixed">'
										+ sCaption
										+
										// '<tr><td' + style + '>标题:</td><td' +
										// style0 + '>' + name + '</td></tr>' +
										'<tr><td'
										+ style1
										+ '>执行者:</td><td'
										+ style2
										+ '>'
										+ owner
										+ '</td></tr>'
										+
										// '<tr><td' + style1 + '>所属部门:</td><td'
										// + style2 + '>' + executordepartment +
										// '</td></tr>' +
										'<tr><td'
										+ style1
										+ '>状态:</td><td'
										+ style2
										+ '>'
										+ status
										+ '</td></tr>'
										+ '<tr><td'
										+ style1
										+ '>开始时间:</td><td'
										+ style2
										+ '>'
										+ formatDate(createtime)
										+ '</td></tr>'
										+ executetime
										+ '</table>';
								// var table = this.element.lastChild;
								// var rows = table.rows;
								// for (var j = 0, l = rows.length; j < l; j++)
								// {
								// rows[j].cells[0].figure = this;
								// rows[j].cells[1].figure = this;
								// };
							}

							for (var i = 0; i < this.element.children.length; i++) {
								// var child = this.element.getChild(i);
								var table = this.element.children[i];
								var rows = table.rows;
								for (var j = 0, l = rows.length; j < l; j++) {
									rows[j].cells[0].figure = this;
									rows[j].cells[1].figure = this;
								}
								;
								for (var j = 0, l = rows.length; j < l; j++) {
									var cell = rows[j].cells[1];
									this.fixedCellLayout(cell);
								}

							}
							this.bound.h = this.element.scrollHeight
									|| (parseInt(this.element.style.height) * executor.length);
							this.element.style.height = this.bound.h + "px"; // zmh
							// this.appendHeight(this.element,(100*(executor.length-1)));//5个子任务以内目前没有问题.
						}
					},
					fixedCellLayout : function(cell) {
						var txt = cell.innerHTML;
						var line = txt.replace(/[^\x00-\xff]/g, "rr").length / 20;// this.calculateTextLayout(txt);
						if (line > 1) {
							var delt = line * 9;
							this.appendHeight(cell, delt);
							this.appendHeight(this.element, delt);
						}
					},
					appendHeight : function(obj, delt) {
						var oldHeight = obj.style.height;
						if (!oldHeight || oldHeight == '')
							oldHeight = 20;
						else
							oldHeight = oldHeight.substring(0,
									oldHeight.length - 2);
						var newHeight = parseInt(oldHeight) + parseInt(delt);
						this.bound.h = newHeight;
						obj.style.height = newHeight;
					},
					calculateTextLayout : function(text) {
						this.tempDiv = document.createElement("span");
						this.canvas.container.appendChild(this.tempDiv);
						this.tempDiv.innerHTML = text;
						this.canvas.container.removeChild(this.tempDiv);
						var result = this.tempDiv.offsetWidth / 194;
						return Math.ceil(result);
					},
					setData : function(data) {
						this.data = data;
					},
					cloneFigure : function(config) {
						var newFg = new Justep.graphics.Rectangle(Justep.apply(
								{
									bound : this.bound,
									disenableRebuildBoundByScale : true
								}, config));
						this.canvas.add(newFg);
						return newFg;
					}
				});
// ===================================== 图形元素
// end===========================================================

