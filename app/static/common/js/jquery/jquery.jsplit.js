/**
 * 
 */

$.fn.extend({
	jsplit:function(j){
		return this.each(function(){
			var jun = {
				ID: "default",
				Max:"400px",
				Min:"60px",
				Align:"left",	//top right bottom left
				IsClose:false,
				AllowOpen: false,
				AllowClose: true,
				SplitAnimate: true,
				Fn:function(){}}
				
			j = j||{};
			j.ID = j.ID||jun.ID;
			j.Max = parseInt(j.Max)||parseInt(jun.Max);
			j.Min = parseInt(j.Min)||parseInt(jun.Min);
			j.Align = j.Align||jun.Align;
			j.IsClose = j.IsClose!=undefined ? j.IsClose : jun.IsClose;
			j.AllowOpen = j.AllowOpen!=undefined ? j.AllowOpen : jun.AllowOpen;
			j.AllowClose = j.AllowClose!=undefined ? j.AllowClose : jun.AllowClose;
			j.SplitAnimate = j.SplitAnimate!=undefined ? j.SplitAnimate : jun.SplitAnimate;
			j.Fn = j.Fn||jun.Fn;
			
			if(j.Min>j.Max){
				var amax=j.Max;
				j.Max = j.Min;
				j.Min = amax;
			};
			
			var _self = $(this);
			var Close = false;
			var IsLeftRight = j.Align=="left" || j.Align=="right";
			
			var class_owner = "jsplit_"+j.ID+"_owner";
			var class_client = "jsplit_"+j.ID+"_client";
			var class_split = "jsplit_"+j.ID+"_split";
			var class_button = "jsplit_"+j.ID+"_button";
			
			_self.addClass(class_owner).addClass("jsplit_owner");
			_self.wrapInner("<div class='jsplit_client "+class_client+"'></div>");
			_self.children("."+class_client).append("<div class='jsplit_split "+class_split+"' unselectable='on'><div class='jsplit_button "+class_button+"' unselectable='on'></div></div>");

			var jsplitc=_self.children("."+class_client);
			var jsplits=jsplitc.children("."+class_split);
			var jsplitb=jsplits.children("."+class_button);
			
			var size = Math.min(Math.max(IsLeftRight ? _self.width() : _self.height(), j.Min), j.Max);
			IsLeftRight ? _self.css({width:size}) : _self.css({height:size});
			_triggerEvent("move", size);
			
			if(j.IsClose!=false)_selfClose(true, 0);
			_self.hover(function(){
				if(Close==false)
					if (j.SplitAnimate) jsplits.stop().animate({opacity:0.85},200)
				},function(){
				if(Close==false)
					if (j.SplitAnimate) jsplits.stop().animate({opacity:0},2000)
			})
			jsplits.mousedown(function(e){
				if (!j.AllowOpen && _self.hasClass("off")) return true;
				if (!j.AllowClose && !_self.hasClass("off")) {return true;}
				_triggerEvent("down", size);
				var screen = IsLeftRight ? e.screenX : e.screenY;
				var s = IsLeftRight ? _self.width() : _self.height();
				$(document).mousemove(function(e2){
					curS = IsLeftRight ?
						(j.Align=="left" ? s + (e2.screenX - screen) : s - (e2.screenX - screen)) :
						(j.Align=="top" ? s + (e2.screenY - screen) : s - (e2.screenY - screen));
					if(curS<j.Min)curS=j.Min;
					if(curS>j.Max)curS=j.Max;
					IsLeftRight ? _self.css({width:curS}) : _self.css({height:curS});
					size = curS;
					_triggerEvent("move", size);
				});
				$(document).mouseup(function(){
					$(document).unbind("mousemove");
					$(document).unbind("mouseup");
					_triggerEvent("up", size);
				});
				_selfOpen();
				return false;
			});
			jsplits.dblclick(function(){
				return _selfClose();
			});
			jsplitb.click(function () {
				return _selfClose();
			}).hover(function(){$(this).addClass("hover");}, function(){$(this).removeClass("hover");});
			function _triggerEvent(state, size, duration){
				j['Fn'] && j['Fn'].call(_self.get(0), state, size, duration);
			}
			function _selfState(toggle, close){
				jsplitb.add(jsplits).add(jsplitc).add(_self).toggleClass("off");
				jsplitb.toggleClass(class_button + "_off").toggleClass("jsplit_button_off");
				
				toggle!==true && _triggerEvent("click");
				Close=close;
			}
			function _selfOpen(toggle, duration){
				if(Close==true){
					duration = typeof duration === "number" ? duration : 200;
					if (IsLeftRight) {
						if (j.Align=="left")
							jsplitc.animate({left:0},duration,function(){jsplitc.width("100%")});
						_self.animate({width:size},{duration:duration,complete:function(){_selfState(toggle, false)},step:function(now){_triggerEvent("move", now);}});
					} else {
						if (j.Align=="top")
							jsplitc.animate({top:0},duration,function(){jsplitc.height("100%")});
						_self.animate({height:size},{duration:duration,complete:function(){_selfState(toggle, false)},step:function(now){_triggerEvent("move", now);}});
					}
				}
				return false;
			}
			function _selfClose(toggle, duration){
				if(Close==false){
					if (j.SplitAnimate) jsplits.stop().animate({opacity:0},0);
					duration = typeof duration === "number" ? duration : 400;
					if (IsLeftRight) {
						var splitWidth = jsplits.width() + (parseInt(jsplits.css("margin-left")) || 0) + (parseInt(jsplits.css("margin-right")) || 0);
						if (j.Align=="left") {
							jsplitc.width(size);
							jsplitc.animate({left:(-size+splitWidth)},duration);
						}
						_self.animate({width:splitWidth},{duration:duration,step:function(now){_triggerEvent("move", now);}});
					} else {
						var splitHeight = jsplits.height() + (parseInt(jsplits.css("margin-top")) || 0) + (parseInt(jsplits.css("margin-bottom")) || 0);
						if (j.Align=="top") {
							jsplitc.height(size);
							jsplitc.animate({top:-size+splitHeight},duration);
						}
						_self.animate({height:splitHeight},{duration:duration,step:function(now){_triggerEvent("move", now);}});
					}
					_selfState(toggle, true);
				}
				return false;
			}
			_self.get(0).toggle = function(){
				return _self.hasClass("off") ? _selfOpen(true) : _selfClose(true); 
			};
			_self.get(0).open = function(){
				return _selfOpen(); 
			};
			_self.get(0).close = function(){
				return _selfClose(); 
			};
		});
	}
});
