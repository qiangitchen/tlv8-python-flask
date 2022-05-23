/**
 * Desktop Extension for jQuery EasyUI
 * version: 1.0.1
 */
(function($){
	var TASKID = 1;

	function buildDesktop(target){
		var state = $(target).data('desktop');
		var opts = state.options;
		$(target).width($(window).width());
		$(target).height($(window).height());
		$(window).resize(function(){
			$(target).width($(window).width());
			$(target).height($(window).height());
		});
		$(target).css("overflow","hidden");
		$(target).addClass('desktop').layout({
			fit:true
		});
		$(target).layout('add', {
			region: 'south',
			bodyCls: 'desktop-taskbar',
			border: false
		});
		$(target).layout('add', {
			region: 'center',
			bodyCls: 'desktop-wall',
			border: false,
			onResize: function(){
				// rangeApps(target)
			}
		});
		$(target).layout('panel', 'center').css("overflow","hidden");
		state.taskbar = $(target).layout('panel', 'south');
		state.taskbar.css("overflow","hidden");
		state.taskbar.append('<div class="desktop-taskbar-mask"></div><div class="desktop-start"></div><div class="desktop-tasks"></div>');
		if (opts.wallpaper){
			$(target).desktop('setWallpaper', opts.wallpaper);
		}
		if (opts.buttons){
			$(opts.buttons).addClass('desktop-buttons').appendTo(state.taskbar);
		}
		var taskmenu = $('<div id="task_menu" class="easyui-menu" style="width:120px;">'
				+'<div id="max">最大化</div>'
				+'<div id="res">还原</div>'
				+'<div id="min">最小化</div>'
				+'<div id="close" data-options="iconCls:\'icon-cancel\'">关闭</div>'
				+'</div>').appendTo(state.taskbar);
		taskmenu.menu({});
	}
	function buildStartMenu(target){
		var state = $(target).data('desktop');
		var opts = state.options;
		var start = state.taskbar.children('.desktop-start');
		state.menu = $('<div class="desktop-menu"></div>').appendTo('body');
		state.menu.menu({
			width: 200,
			height: 'auto',
			minHeight: 200,
			noline: true,
			alignTo: start
		});
		_buildMenu(null, opts.menus);
		start.bind('click', function(){
			state.menu.menu('show');
		});

		function _buildMenu(pmenu, menus){
			if (menus && menus.length){
				var parent = pmenu ? state.menu.menu('findItem', pmenu.text) : null;
				$.map(menus, function(menu){
					var submenu = $.extend({}, menu, {
						parent: parent?parent.target:null,
						onclick: function(){
							try{
								if(menu.handler){
									menu.handler(menu);
								}
							}catch (e) {
							}
						}
					});
					state.menu.menu('appendItem', submenu);
					_buildMenu(submenu, submenu.menus);
				});
			}
		}
	}
	function buildTimer(target){
		var state = $(target).data('desktop');
		var opts = state.options;
		var timer = $('<div class="desktop-timer">&nbsp;</div>').appendTo(state.taskbar);
		var setTime = function(){
			timer.html(opts.timer())
		}
		setTime();
		setInterval(function(){
			setTime();
		},30000);
	}
	function buildApps(target){
		var opts = $(target).desktop('options');
		var wall = $(target).layout('panel', 'center');
		for(var i=0; i<opts.apps.length; i++){
			var app = opts.apps[i];
			var shortcut = $('<div class="desktop-app"><div class="desktop-app-mask"></div></div>').appendTo(wall);
			var img = $('<img class="desktop-app-icon">').appendTo(shortcut);
			img.attr('src', app.icon);
			$('<div class="desktop-app-name"></div>').html(app.name).appendTo(shortcut);
			app.shortcut = shortcut;
			shortcut.unbind('.desktop').bind('click.desktop', {app:app}, function(e){
				if (opts.isDragAction){
					opts.isDragAction = false;
					return;
				}
				openApp(target, e.data.app);
			});
			app.shortcut.draggable({ 
				app: app,
				cursor: 'pointer',
				onStopDrag: function(e){
					opts.isDragAction = true;
					var dragOpts = $(this).draggable('options');
					dragOpts.app.shortcutLeft = e.data.left;
					dragOpts.app.shortcutTop = e.data.top;
				}
			});
		}
		rangeApps(target)
	}

	function rangeApps(target){
		var opts = $(target).desktop('options');
		// var apps = $.extend([], opts.apps);
		var apps = [];
		for(var i=0; i<opts.apps.length; i++){
			var app = opts.apps[i];
			if (!app.shortcutLeft && !app.shortcutTop){
				apps.push(app);
			}
		}
		var wall = $(target).layout('panel', 'center');
		var wallHeight = wall.height();
		var rows = Math.floor((wall.height()-20)/(opts.shortcutSize+10));
		var rowspan = (wall.height()-20-opts.shortcutSize*rows)/(rows-1);
		if (rowspan > 20){
			rowspan = 20;
		}
		var left = 10,top = 10;
		for(var i=0; i<apps.length; i++){
			if(i>0 && i%rows==0){
				left += opts.shortcutSize + rowspan;
				top = 10;
			}else{
				if(i>0){
					top += opts.shortcutSize + rowspan;
				}
			}
			$(apps[i].shortcut).css({left:left,top:top});
		}
	}

	function minApp(target, app){
		if (!app.win || !app.win.is(':visible')){
			return;
		}
		var opts = app.win.dialog('options');
		opts.originalLeft = opts.left;
		opts.originalTop = opts.top;
		opts.originalWidth = opts.width;
		opts.originalHeight = opts.height;
		var taskOffset = app.task.offset();
		app.win.dialog('open');
		app.win.dialog('dialog').animate({
			left: taskOffset.left,
			top: taskOffset.top,
			width: $(app.task).width(),
			height: $(app.task).height()
		}, function(){
			app.win.dialog('dialog').hide();
		});
	}

	function restoreApp(target, app){
		if (!app.win || app.win.is(':visible')){
			return;
		}
		var opts = app.win.dialog('options');
		app.win.dialog('open');
		app.win.dialog('dialog').show().animate({
			left: opts.originalLeft||opts.left,
			top: opts.originalTop||opts.top,
			width: opts.originalWidth||opts.width,
			height: opts.originalHeight||opts.height
		});
		$('body').attr("cwin",app.id);
	}

	function openApp(target, app){
		var state = $(target).data('desktop');
		var opts = state.options;
		if(app.url && app.url!=""){
			var framecontent = "<div style='width:100%;height:100%;padding:2px;'>"
				+ "<iframe scrolling='auto' frameborder='0' "
				+ " class='portal_body_frame' id='"
				+ app.id
				+ "' " 
				+ " src='"+app.url+"' "
				+ " style='width:100%;height:100%;overflow:auto;'/></div>";
			app.content = framecontent;
		}
		if (app.win){
			restoreApp(target, app);
			return;
		}
		var winOpts = $.extend({
			cls: 'desktop-window',
			headerCls: 'desktop-window-header',
			app: app,
			inline: true,
			shadow: false,
			closed: true,
			border: 'thin',
			title: app.name,
			iconCls: 'desktop-default-icon',
			width: opts.winWidth,
			height: opts.winHeight,
			collapsible: false,
			minimizable: false,
			maximizable: true,
			resizable: true,
			tools: [{
				iconCls: 'panel-tool-min',
				handler: function(){
					minApp(target, app);
				}
			}],
			onClose: function(){
				$('#'+app.taskId).remove();
				$(this).dialog('destroy');
				app.win = null;
			},
			onMove: function(){
				var opt = $(this).dialog('options');
				app.left = opt.left;
				app.top = opt.top;
			},
			onResize: function(){
				var opt = $(this).dialog('options');
				app.width = opt.width;
				app.height = opt.height;
			}

		}, app);
		app.win = $('<div id="'+app.id+'"></div>').appendTo($(target).layout('panel', 'center'));
		app.win.dialog(winOpts);
		app.win.dialog('body').css("overflow","hidden");
		var header = app.win.dialog('header');
		if (app.icon){
			header.find('.panel-icon').attr('class','panel-icon').html('<img src="'+app.icon+'">');
		}
		header.bind('dblclick.desktop', function(){
			if (app.win.dialog('options').maximized){
				app.win.dialog('restore');
			} else {
				app.win.dialog('maximize');
			}
		});
		header.find('.panel-tool').children('a').removeAttr('href').css('cursor','pointer');
		app.win.dialog('open');
		app.taskId = 'desktop_task'+(TASKID++);
		app.task = $('<div class="desktop-task"><div class="desktop-task-mask"></div></div>').appendTo(state.taskbar.children('.desktop-tasks'));
		if (app.icon){
			$('<img class="desktop-task-icon">').attr('src', app.icon).appendTo(app.task);
		} else {
			$('<span class="desktop-task-icon desktop-default-icon"></span>').appendTo(app.task);
		}
		$('<span class="desktop-task-name"></span>').html(app.name).appendTo(app.task);
		app.task.attr('id',app.taskId).bind('click', function(){
			if (app.win.is(':visible')){
				minApp(target, app);
			} else {
				restoreApp(target, app);
			}
		});
		app.task.bind('contextmenu', function(e) {
			$('#task_menu').menu({
				onClick: function(item){
					console.log(item);
					if(item.id=="max"){
						app.win.dialog('maximize');
					}
					if(item.id=="res"){
						app.win.dialog('restore');
					}
					if(item.id=="min"){
						minApp(target, app);
					}
					if(item.id=="close"){
						app.win.dialog('close');
					}
				}
			});
			$('#task_menu').menu('show', {
				left : e.pageX,
				top : e.pageY
			});
			return false;
		});
		if(app.children){
			var wall = app.win.dialog('body');
			wall.css("overflow","auto");
			wall.css("position","relative");
			var left = 10, top = 10;
			for(var i=0; i<app.children.length; i++){
				var capp = app.children[i];
				capp.name = capp.label;
				if(!capp.initico){
					capp.icon = capp.icon ? ("images/icon/" + capp.icon) : "images/icon/normal.png";
					capp.initico = true;
				}
				if (capp.url && capp.url != "" && !capp.initfun) {
					capp = $.X.parseFunc(capp);
					capp.url = $.X.createFunc(capp);
					capp.id = $.X.getFuncID(capp);
					capp.width = Math.min($(window).width()-20,1200);
					capp.height = Math.min($(window).height()-40,660);
					capp.initfun = true;
				}
				var shortcut = $('<div class="desktop-app"><div class="desktop-app-mask"></div></div>').appendTo(wall);
				var img = $('<img class="desktop-app-icon">').appendTo(shortcut);
				img.attr('src', capp.icon);
				$('<div class="desktop-app-name" style="color:#000;"></div>').html(capp.name).appendTo(shortcut);
				if(i>0 && i%6==0){
					left = 10;
					top += 90;
				}else if(i>0){
					left += 90;
				}
				shortcut.css('left',left);
				shortcut.css('top',top);
				shortcut.data("app", capp);
				shortcut.click(function(){
					$('body').desktop('openApp',$(this).data("app"));
				});
			}
		}
		$('body').attr("cwin",app.id);
	}

	$.fn.desktop = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.desktop.methods[options];
			if (method){
				return method(this, param);
			}
		}
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'desktop');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'desktop', {
					options: $.extend({}, $.fn.desktop.defaults, $.fn.desktop.parseOptions(this), options)
				});
			}
			buildDesktop(this);
			buildStartMenu(this);
			buildTimer(this);
			buildApps(this);
		});

	};
	$.fn.desktop.methods = {
		options: function(jq){
			return jq.data('desktop').options;
		},
		openApp: function(jq, app){
			return jq.each(function(){
				openApp(this, app)
			});
		},
		setWallpaper: function(jq, wallpaper){
			return jq.each(function(){
				$(this).desktop('options').wallpaper = wallpaper;
				$(this).css({
					backgroundImage: 'url("'+wallpaper+'")'
				});
			});
		},
		getOpenedApps: function(jq){
			return $.map(jq.layout('panel','center').children('.desktop-window'), function(win){
				var opts = $(win).children('.window-body').dialog('options');
				return opts.app;
			});
		}
	};
	$.fn.desktop.parseOptions = function(target){
		return $.extend({}, {

		});
	};
	$.fn.desktop.defaults = {
		shortcutSize: 90,
		apps: [],
		menus: [],
		winWidth: 600,
		winHeight: 300,
		wallpaper: null,
		buttons: null,
		timer: function(){
			var now = new Date();
			var h = now.getHours();
			var m = now.getMinutes();
			var ampm = h >= 12 ? 'PM' : 'AM';
			h = h % 12;
			m = m < 10 ? '0'+m : m;
			return (h+':'+m+' '+ampm);
		}
	};
})(jQuery);
