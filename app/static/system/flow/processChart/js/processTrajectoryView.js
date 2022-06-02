typeof JustepFlowTrack=='undefined'?JustepFlowTrack={}:JustepFlowTrack;
/**
 * 流程轨迹视图,用于运行时浏览流程图.
 */
Justep.ProcessTrajectoryView = function(config){
	Justep.apply(this,config);
	this.initBindGrahics();
	Justep.ProcessTrajectoryView.superclass.constructor.call(this,config);
};

Justep.extend(Justep.ProcessTrajectoryView, Justep.graphics.Canvas, {
    ME: { START_PLACE: 0, END_PLACE: 1, ACTIVITY_STATIC: 2, ACTIVITY_BUSINESS: 3, PLACE_XOR: 4, ACTIVITY_CONDITION: 5 },
    initBindGrahics: function() {
        this.bind = { start: 'Circle', end: 'Circle', conditionBranch: 'Rhombus', businessActivity: 'DojoRectangle',
            conditionActivity: 'Triangular', and: 'Circle', xor: 'Circle', connection: "Connection", subProcess: 'Hexagon', autoActivity: 'Trapezoid'
        };
    },
    resetData: function() {
        var figures = this.figures;
        this.lines = {};
        for (var p in figures) {
            figures[p].dispose();
        }
    },
    /**
    * 加载模型数据.
    */
    initData: function(modelData) {

        if (!modelData || modelData == '') {
            this.resetData();
            return;
        }
        this.resetData();
        this.itemCount = {};
        this.modelData = modelData || {};
        var mainData = this.modelData.processMainData || {};
        this.connections = {};
        for (var p in mainData) {
            var data = mainData[p];
            if (data.style && data.type != 'connection') {

                var gType = this.bind[data.type];
                if (gType) {
                    data.style.id = p;
                    var figure = new Justep.graphics[gType](data.style);
                    this.add(figure);
                    this.initRectFigure(data, figure);

                    if (data.type == 'start') {
                        this.start = figure;
                    } else if (data.type == 'end') {
                        this.end = figure;
                    }
                }
            } else if (data.type == 'connection') {
                this.connections[p] = data;
            }
        }

        for (var p in this.connections) {
            var data = this.connections[p];
            var source = this.figures[data.sourceNode];
            var target = this.figures[data.targetNode];
            if (!source || !target) {
                continue;
            }
            data.style.id = p;
            data.style.text = data.text;
            var figure = new Justep.graphics.Connection(data.style || {});

            this.add(figure);
            this.lines[figure.id] = figure;
            data.targetNode = target.id;
            data.sourceNode = source.id;
            figure.binding = "connection";
            if (source) {
                var outPort = source.getPort('OutPort', data.style.outPortDir);
                figure.setOutPort(outPort);
            }
            if (target) {
                var inPort = target.getPort('InPort', data.style.inPortDir);
                figure.setInPort(inPort);

            }
            if(data.LABEL&&figure.setText){
            	figure.setText(data.LABEL);
            }
        }
        var maxBottom=0,maxRight=0;
        for(var p in this.figures){
        	var fg = this.figures[p];
        	if(fg.calcuPoints){
        	   var points = fg.calcuPoints();
        	   if(points.cx){
        		   maxRight = Math.max(maxRight,points.cx+points.r);
        		   maxBottom = Math.max(maxBottom,points.cy+points.r);
        	   }else{
	        	   for(var i = 0,l=points.length;i<l;i++){
	        		   maxRight = Math.max(maxRight,points[i].x);
	        		   maxBottom = Math.max(maxBottom,points[i].y);
	        	   }
        	   }
        	}
        }
        var self = this; 
        self.surface.setDimensions(maxRight+5,maxBottom);  
    
    },
    initRectFigure: function(meData, figure) {
        var type = meData.type;
        switch (type) {
            case 'start':
                figure.addPort(this.createPort('s', { portType: 'OutPort' }));
                figure.addPort(this.createPort('w', { portType: 'InPort' }));
                figure.addPort(this.createPort('e', { portType: 'InPort' }));
                break;
            case 'conditionActivity':
                figure.addPort(this.createPort('n', { portType: 'InPort' }));
                figure.addPort(this.createPort('s', { portType: 'OutPort' }));
                break;
            case 'businessActivity':
            case 'conditionBranch':
            case 'and':
            case 'xor':
            case 'subProcess':
            case 'autoActivity':
                figure.addPort(this.createPort('n', { portType: 'InPort' }));
                figure.addPort(this.createPort('w'));
                figure.addPort(this.createPort('e'));
                figure.addPort(this.createPort('s'));
                if (type == 'and') {
                } else if (type == 'xor') {
                }
                break;
            case 'end':
                figure.addPort(this.createPort('n', { portType: 'InPort' }));
                figure.addPort(this.createPort('w', { portType: 'InPort' }));
                figure.addPort(this.createPort('e', { portType: 'InPort' }));
                figure.addPort(this.createPort('s', { portType: 'InPort' }));
        }
        if (meData.LABEL) {
            figure.setText(meData.LABEL);
        }
        figure.binding = meData.type;
    },
    createPort: function(pos, config) {
        config = config || {};
        switch (pos) {
            case 'n':
                return new Justep.graphics.Port(Justep.apply(config, { direction: Justep.PortDirection.UP, visible: false, calcuFun: function(ownerBound) {
                    var bound = this.bound;
                    bound.x = ownerBound.x - 5 + ownerBound.w / 2;
                    bound.y = ownerBound.y - 5;
                    return bound;
                }
                }));
            case 'e':
                return new Justep.graphics.Port(Justep.apply(config, { direction: Justep.PortDirection.RIGHT, visible: false, calcuFun: function(ownerBound) {
                    var bound = this.bound;
                    bound.x = ownerBound.x - 5 + ownerBound.w;
                    bound.y = ownerBound.y - 5 + ownerBound.h / 2;
                    return bound;
                }
                }));
            case 's':
                return new Justep.graphics.Port(Justep.apply(config, { direction: Justep.PortDirection.DOWN, visible: false, calcuFun: function(ownerBound) {
                    var bound = this.bound;
                    bound.x = ownerBound.x - 5 + ownerBound.w / 2; ;
                    bound.y = ownerBound.y - 5 + ownerBound.h;
                    return bound;
                }
                }));
            case 'w':
                return new Justep.graphics.Port(Justep.apply(config, { direction: Justep.PortDirection.LEFT, visible: false, calcuFun: function(ownerBound) {
                    var bound = this.bound;
                    bound.x = ownerBound.x - 5;
                    bound.y = ownerBound.y - 5 + ownerBound.h / 2;
                    return bound;
                }
                }));
        }
    },
    markLivingActivity: function(activities) {
        this.livingActivities = []; //这里面存的是图形对像
        if (activities) {
            for (var i = 0; i < activities.length; i++) {
                var activity = activities[i];
                var figure = this.getFigureByName(activity);
                if (figure) {
                    figure.highLight(this.livingActivityColor);
                    this.livingActivities.push(figure);
                }
            }
        }
        if (this.livingActivities.length != 0) {
            this.highLightStart2Waiting(this.livingActivities);
        }
    },
    markPausedActivity: function(activities) {
        this.pausedActivities = []; //这里面存的是图形对像
        if (activities) {
            for (var i = 0; i < activities.length; i++) {
                var activity = activities[i];
                var figure = this.getFigureByName(activity);
                if (figure) {
                    figure.highLight(this.pausedActivityColor);
                    this.pausedActivities.push(figure);
                }
            }
        }
        if (this.pausedActivities.length != 0) {
            this.highLightStart2Waiting(this.pausedActivities);
        }
    },
    markAbortActivity: function(activities) {
        this.abortActivities = []; //这里面存的是图形对像
        if (activities) {
            for (var i = 0; i < activities.length; i++) {
                var activity = activities[i];
                var figure = this.getFigureByName(activity);
                if (figure) {
                    figure.highLight(this.abortActivityColor);
                    this.abortActivities.push(figure);
                }
            }
        }
        
        if (this.abortActivities.length != 0) {
            this.highLightStart2Waiting(this.abortActivities);
        }
        
    },
    
    /*hcr: 解决and之后环节结束但没有标记的问题*/
    markFinishedActivity: function(activities){
    	this.finishedActivity = [];
    	if (activities){
            for (var i = 0; i < activities.length; i++) {
                var activity = activities[i];
                var figure = this.getFigureByName(activity);
                if (figure) {
                	figure.highLight(this.flowOutColor);
                    this.finishedActivity.push(figure);
                }
            }
    	}
    	
        if (this.finishedActivity.length != 0) {
            this.highLightStart2Waiting(this.finishedActivity);
        }
    },
    
    highLightStart2Waiting: function(activities) {
        var figures = this.figures;
        if(activities){
	        for (var i = 0, l = activities.length; i < l; i++) {
	            var activity = activities[i];
	            var lines = this.lines;
	            for (var id in lines) {
	                var line = lines[id];
	                if (line.inPort && line.outPort && (line.outPort.owner == this.start)
						&& (line.inPort.owner == activity)) {
							
						this.start.highLight(this.flowOutColor);
	                    line.highLight(this.flowOutColor);
	                }
	            }
	        }
        }
    },
    getFigureByName: function(name) {
        name = getSymbolName(name);
        if(!this.modelData)return;
        var mainData = this.modelData.processMainData;
        for (var id in mainData) {
            if (mainData[id].name == name) {
                return this.figures[id];
            }
        }
    },

    markBackFlowConnections: function(backCouples, color) {
        if (backCouples) {
            for (var back in backCouples) {
                var backCouple = backCouples[back];
                var source = this.getFigureByName(backCouple[0]);
                var target = this.getFigureByName(backCouple[1]);
                if (source && target) {
                    var figure = new Justep.graphics.Connection({});
                    this.add(figure);
                    figure.binding = "connection";
                    if (source) {
                        var outPort = source.getPort('OutPort', Justep.PortDirection.RIGHT);
                        figure.setOutPort(outPort);
                    }
                    if (target) {
                        var inPort = target.getPort('InPort', Justep.PortDirection.RIGHT);
                        figure.setInPort(inPort);
                    }
                    figure.highLight(color);
                    figure.outPort.owner.highLight(color);
                }
            }
        }
    },
    /**
    * [[a,b],[b,c],[c,d]]
    */
    markFlowOutConnections: function(flewActivities, color) {
        this.highlightedConnections = [];
        if (flewActivities) {
            for (var i = 0; i < flewActivities.length; i++) {
                var flewConnection = flewActivities[i];
                for (var j in this.lines) {
                    var connection = this.lines[j];
                    if (((connection.type == "Connection") && (flewConnection[1]))) {
                        var connectionSource = connection.outPort.owner;
                        var connectionTarget = connection.inPort.owner;
                        var source = this.getFigureByName(getSymbolName(flewConnection[0]));
                        var target = this.getFigureByName(getSymbolName(flewConnection[1]));
                        if ((((connectionSource == this.start)
									&& (connectionTarget == source))
									|| ((connectionSource == source)
									&& (connectionTarget == target)))) {
                            connection.highLight(color);
                            connectionSource.highLight(color);//zmh
                            //connectionTarget.highLight(color);
                            this.highlightedConnections.push(flewConnection);
                        } else {// connectionSource.highLight(color);
                            // escape the START END XOR AND node.
                            // for out of the shape collection
                            this.highLightConnectionSplitWithNode(flewConnection, color);

                        }
                    }
                }
            }
            if(true)return;
            if (this.livingActivities.length == 0 && this.abortActivities.length == 0) {
                for (var i = 0; i < this.highlightedConnections.length; i++) {
                    var connection = this.highlightedConnections[i];
                    // 没有活动的环节时，连接已经高亮的线的目标到结束，如有这样的目标和结束直接连接的话。
                    var connectionArrays = [];
                    var exclude = [];
                    this.backTraceRoute(this.lines, this.getFigureByName(getSymbolName(connection[1])), this.end, connectionArrays, exclude);
                    for (var i = 0; i < connectionArrays.length; i++) {
                        var line = connectionArrays[i];
                        line.highLight(color);
                    }
                }
            }

        }
    },
    
    /*hcr: 添加返回值，解决流程并没有结束时结束标记不对的问题*/
    highLightConnectionSplitWithNode: function(flewConections, color) {
        if ((!flewConections) || (!flewConections[0]) || (!flewConections[1]))
            return false;
        var source = this.getFigureByName(getSymbolName(flewConections[0]));
        var target = this.getFigureByName(getSymbolName(flewConections[1]));
        var connectionArrays = [];
        var exclude = [];
        var hightLighted = false;
        this.backTraceRoute(this.lines, source, target, connectionArrays, exclude);
        for (var i = 0; i < connectionArrays.length; i++) {
            var line = connectionArrays[i];
            line.highLight(color);
            if(line.element.moveToFront){
            	line.element.moveToFront(); //zmh add
            }
            if(color){
              line.outPort.owner.highLight(color); // zmh add
            }else{
            	line.inPort.owner.highLight("green");
            }
            hightLighted = true;
        }
        if (hightLighted) {
            this.highlightedConnections.push(flewConections);
            return true;
        }else{
        	return false;
        }
    },

	/**
	回溯寻路
	**/
    backTraceRoute: function(lines/*所有路线*/, source/*源*/, target/*目标*/, routs/*结果路线*/, exclude/*排除的路线*/) {
        if (!exclude) {
            exclude = [];
        }
        for (var lineId in lines) {
            var line = lines[lineId];
            if (this.containsInArray(exclude, line)) 
            	continue;
            var sourceNode = line.outPort.owner;
            var targetNode = line.inPort.owner;
            if (sourceNode == source) {
                routs.push(line);
                exclude.push(line);
                if (targetNode == target)
                    return true;
                else {
                    if (targetNode.type == 'DojoRectangle')
                        routs.pop();
                    else {
                        var result = this.backTraceRoute(lines, targetNode, target, routs, exclude);
                        if (!result) 
                            routs.pop();
                        else 
                            return true;
                    }
                }
            }
        }
    },
    containsInArray: function(array, element) {
    	if (!array){
    		return false;
    	}
    	
        for (var i = 0; i < array.length; i++) {
            var item = array[i];
            if (item == element) return item;
        }
    },
    isNotFinished : function(activity){
    	//TODO
    	if(this.containsInArray(this.livingActivities,activity)
    	||this.containsInArray(this.abortActivities,activity)
    	||this.containsInArray(this.pausedActivities,activity)){
    		return true;
    	}
    	return false;
    },
    highLightLastActivity2End: function(last, color) {
    	
        if (this.livingActivities.length == 0 && this.abortActivities.length == 0) {
            if (last && last.length != 0) {
            	var isEnd = true;
            	for (var i = 0; i < last.length; i++) {
            		if (!this.isNotFinished(this.getFigureByName(last[i]))){
		            	isEnd = this.highLightConnectionSplitWithNode([last[i], this.modelData.processMainData[this.end.id].name],color);
		            	
            	 	}else{
            	 		isEnd = false;
            	 	}
            	 	
            	}
            	 
            	if (isEnd)
					this.end.highLight(color);
            }
            
        }
    },
    
    
    
    loadData: function(data) {
        var jsondata = data;
        switch (typeof data) {
            case 'undefined':
                break;
            case 'string':
                jsondata = eval('(' + data + ')');
                break;
            case 'boolean':
                break;
            case 'number':
                break;
            case 'object':
                break;
        }
        //			var jsondata = data;
        //			var jsondata = eval('(' + data + ')');
        this.initData(jsondata.gMeta);
        this.bot = jsondata.botChart;
        this.addTrack(jsondata.otherMeta);
        this.resizeSurface();

    },
    addTrack: function(otherMeta) {
        if (otherMeta) {
            this.flowOutColor = 'green';
            this.backFlowColor = 'red';
            this.abortActivityColor = '#ff6666';
			this.livingActivityColor = '#0080FF';
			this.pausedActivityColor = 'yellow';
           	

			/* 原来的逻辑
            this.markPausedActivity(otherMeta.paused); // end
            this.markAbortActivity(otherMeta.aborts);
            this.markFlowOutConnections(otherMeta.flowTrack, this.flowOutColor);
            this.markLivingActivity(otherMeta.livings); // end zmh 
            this.highLightLastActivity2End(otherMeta.lasts, this.flowOutColor);
            this.markBackFlowConnections(otherMeta.backTrack, this.backFlowColor);
           */ 

			this.markFinishedActivity(otherMeta.finisheds); //hcr 解决and之后有环节结束但没有标记的问题
			
			this.markPausedActivity(otherMeta.suspends); // end
            this.markAbortActivity(otherMeta.aborts);
            this.markFlowOutConnections(otherMeta.flowTrack, this.flowOutColor);
            this.markBackFlowConnections(otherMeta.backTrack, this.backFlowColor);
          
            //hcr: 将活动环节的画法放到最后，保证同一个环节是多种状态时，优先活动状态
            this.markLivingActivity(otherMeta.livings); // end zmh 
            this.highLightLastActivity2End(otherMeta.lasts, this.flowOutColor);
        }
    },
    getBotInfoByActivity : function(activity) {
		var result = [];
		if (!this.bot)
			return;
		for (var i = 0, l = this.bot.length; i < l; i++) {
			var singleBot = this.bot[i];
			if (singleBot.activity
					&& activity == getSymbolName(singleBot.activity)) {
				result.push(singleBot);
			}
		}
		return result;
	},
	createBotHint : function(botInfo) {
		var event = window.event;

		var bound = {
				x : event.x+this.scrollLeft,
				y : event.y+5+this.scrollTop
		};
		if(!$.browser.msie){
			bound.y -= $(this.container).offset().top;
		}
		//bound = this.checkFigureFullDisplay(bound,botInfo); //zmh 屏蔽
		for (var i = 0, l = botInfo.length; i < l; i++) {
			var singleBot = botInfo[i];
			// create
			var baud = new Justep.graphics.BaudTips({
				bound : bound,
				data : singleBot,
				bgColor:'#ddeeff',
				border:'red'
			});
			
			var offset = this.container.clientHeight+this.scrollTop - event.y;
			this.add(baud);
			var sh = baud.element.scrollHeight;
			if(sh>this.container.clientHeight){
				//baud.element.style.height = (this.container.clientHeight-10)+"px";
				
				bound.h = (this.container.clientHeight-10);
			//	bound.y = 50;
				bound.y = this.scrollTop;//(sh - offset)+5; alert(bound.y);
				baud.setBound(bound);
				baud.element.style.overflowY = "auto"; 
			}else if(offset<sh){ //zmh add
				bound.h = sh;
				bound.y -= (sh - offset)+5;
				baud.setBound(bound);
			} 
			//alert(baud.bound.h);
			//bound.y += baud.bound.h+2;  //zmh 屏蔽
			//baud.setBound(bound);  //zmh 屏蔽
		}
		this.showing = true;
		
	},
	checkFigureFullDisplay:function(bound,figures){
		var maxX = bound.x;
		var maxY = bound.y;
		var count = figures.length;
		for (var i = 0; i < count; i++) {
			maxY += 102;
			//maxX += ??
		}
		if(this.isJsVersionX5){
			if(maxY>this.container.parentNode.clientHeight-20){
				bound.y = this.container.parentNode.clientHeight-(102*count);
			}else{
				//
			}
		}else{
			if(maxY>this.container.clientHeight-20){
				bound.y = this.container.clientHeight-(102*count);
			}else{
				bound.y = bound.y-20;//only 30px?
			}
		}
		//alert(this.container.parentNode.clientHeight);
//		if(maxY>this.container.parentNode.clientHeight-20){
//			bound.y = this.container.parentNode.clientHeight-(102*count);
//		}
		return bound;
	},
	removeAllBotHint:function(){
		var figures = this.figures;
        this.lines = {};
        for (var p in figures) {
        	if(figures[p].type=='BaudTips'){
	            figures[p].dispose();
        	}
        }
	},
	showTips : function() {
		if(this.showing)return;
		var event = window.event;
		var figure = event.srcElement.figure;
		if (!figure)
			return;
		if (!figure.binding)
			return;
		if (figure.binding != 'businessActivity')
			return;
		var activityName = this.modelData.processMainData[figure.id].name;
		 var singleBot = this.getBotInfoByActivity(activityName);
//		var singleBot = [{
//			id : 1,
//			ahead : [],
//			next : [2],
//			name : '标题的得到的的得到的1',
//			executor : '王文岩',
//			executordepartment : '项目三组',
//			status : '测试状态1',
//			createtime : '2009-08-21 17:45:20',
//			executetime : '2009-08-21 17:55:20'
//		},{
//			id : 1,
//			ahead : [],
//			next : [2],
//			name : '标题的得到的的得到的1',
//			executor : '王文岩',
//			executordepartment : '项目三组',
//			status : '测试状态1',
//			createtime : '2009-08-21 17:45:20',
//			executetime : '2009-08-21 17:55:20'
//		}];
		if (!singleBot || singleBot.length == 0)
			return;
		this.createBotHint(singleBot);
	},
	removeTips : function() {
		this.removeAllBotHint();
	},
	containsInBound : function(coord,bound){
		return ((coord.x>bound.x)&&(coord.x<bound.x+bound.w)
			&&(coord.y>bound.y)&&(coord.y<bound.y+bound.h));
	},
	mouseover : function() { 
		// add tips
		var event = window.event;
		var figure = event.srcElement.figure;
		if(figure&&figure.bound){
			this.showTips();
		}
		dojo.stopEvent(event);
	},
	mouseout : function() {
		// remove tips
		var event = window.event;
		//this.removeTips();
		dojo.stopEvent(event);
	},
	mouseInFigure:function(){
		var event = window.event;
 		var figure = event.srcElement.figure;
		if (figure&&figure.type=='DojoRectangle'){
			if(!this.showing){
				this.showTips();
				this.showing = true;
			}
		}
	},
	mouseOutFigure:function(){
		var event = window.event;
 		var figure = event.srcElement.figure;
		if(figure&&figure.type=='BaudTips'){
			return;
		}
		var self = this;
		self.removeTips();
		self.showing = false;
	},
	mouseMove : function() { 
		var event = window.event;
 		var figure = event.srcElement.figure;
		if(figure&&figure.bound){ 
			var bound = figure.bound;
			var coord = {x:event.x,y:event.y};
			var overFigure = this.containsInBound(coord,bound);
			if(overFigure)
				this.mouseInFigure();
		}else{
			this.mouseOutFigure();
		}
		dojo.stopEvent(event);
	}/*,
	
	mouseDown : function() {
		var event = window.event;
		dojo.stopEvent(event);
	},
	mouseUp : function() {
		var event = window.event;
		dojo.stopEvent(event);
	},
	dbclick : function() {
		var event = window.event;
		dojo.stopEvent(event);
	},
	keyDown : function() {
		var event = window.event;
		dojo.stopEvent(event);
	},
	documentMouseUp : function() {
		var event = window.event;
		dojo.stopEvent(event);
	}*/
});
 
function getSymbolName(s) {
	if (!s)
		return "";
		s = s+"";
	if (s.indexOf('.') == -1) {
		s = s.match(/[^\/]+$/);
	} else {
		s = s.match(/[^\/]+(?=\.)/);
	}
	//s = getSymbolName1(s+"");
	return s;
};
// ///////////start draw...

function __wfLoadTrack(id, g_data) {
	if (document.getElementById(id)) {
		if(!JustepFlowTrack[id]){
            JustepFlowTrack[id] = new Justep.ProcessTrajectoryView({id:id});
		};
		JustepFlowTrack[id].loadData(g_data);
	};
};
//外部调用入口.
//var canvas;
function __wfLoadBot(id, g_data) {
	if(document.getElementById(id)){
		if(!JustepFlowTrack[id]){
			JustepFlowTrack[id] = new Baud();
	      	JustepFlowTrack[id].setCanvas(new Justep.graphics.Canvas({id:id}));
		}
      	var jsondata = eval('(' + g_data + ')');
      	if (jsondata == null){
			jsondata = {};
		}      	
      	JustepFlowTrack[id].loadData(jsondata.botChart);
	}

};

//function __wfLoadGantt(id) {
//	if (id) {
//		// XXX
//	};
//};
function __wfLoadData(g_obj) {
	if (g_obj) {
		if (g_obj.g_data) {
			__wfLoadTrack(g_obj.track, g_obj.g_data);
			__wfLoadBot(g_obj.bot, g_obj.g_data);
		}
	};
};
function getIE1(e) {
	var t = e.offsetTop;
	var l = e.offsetLeft;
	while (e = e.offsetParent) {
		t += e.offsetTop;
		l += e.offsetLeft;
	}
	return {top:t,left:l};
	 
}
function fixTabbarSize(tabbarNode){
	if(tabbarNode){
		JustepFlowTrack[tabbarNode.id] = tabbarNode;
	}
	var flowtrack1,diagram;
	for(var id in JustepFlowTrack){
		if(id.startWith('track_')){
			flowtrack1 = JustepFlowTrack[id];
		}
		if(id.startWith('bot_')){
			diagram = JustepFlowTrack[id];
		}
	};
	if(flowtrack1){
		 var p = getIE1(flowtrack1.container.parentNode);
		 if(tabbarNode){
		 	flowtrack1.isJsVersionX5 = true;
			diagram.isJsVersionX5 = true;
			 if(JustepFlowTrack[tabbarNode.id]){
				 JustepFlowTrack[tabbarNode.id].xfElement.tabBar.setSize(document.body.clientWidth,document.body.clientHeight-p.top+20);
			 }
		 }
		 flowtrack1.container.style.width = (document.body.clientWidth-15)+"px";
		 flowtrack1.container.style.height = (document.body.clientHeight-p.top-50)+'px';
		 if(diagram){
			 diagram.canvas.container.style.width = (document.body.clientWidth-15)+"px";
			 diagram.canvas.container.style.height = (document.body.clientHeight-p.top-50)+'px';
		 }
	}
}
