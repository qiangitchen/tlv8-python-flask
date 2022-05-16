/*
/*
 * JPolite Core Features and Functions
 */
if (!$.jpolite) $.jpolite = {};
$.extend($.jpolite, {
	getTab : function(tId){
		//return $.indexpageTabs.getTabById(tId);
	},
	addTab : function(tid, p){
		//layui.index.openTabsPage(p.url, p.name, tid);
		var checkTab = layui.miniTab.check(tid);
      if (!checkTab) {
            layui.miniTab.create({
                tabId: tid,
                href: p.url,
                title: p.name,
                isIframe: false,
                maxTabNum: 20,
            });
        }
      layui.miniTab.change(tid);
	},
	getTabID : function(){
		return $(".layuimini-tab .layui-tab-title li.layui-this").attr('lay-id');
	},
	removeTab : function(tId){
		if('layuiminiHomeTab'==tId)return;
		//layui.index.removeTabsPage(tId);
		layui.miniTab.delete(tId);
	},
	gotoTab : function(tId){
		//$.indexpageTabs.setActiveTab(tId);
		layui.miniTab.change(tId);
	},
	//初始化导航标签
	init: function(options){
		//初始化连接Portal信息；
		$.jpolite.clientInfo.init();
		
		this.Content.init(s.widgetSortable);
		//初始化桌面信息
		this.clientInfo.initClientInfo();
	},
	//初始化用户信息与服务器信息
	clientInfo:{
	    init:function(options){
	    	var o ={};
			$.extend(o,options,{
				url:cpath+"/system/User/initPortalInfo",
				async:false,
				type:"POST",
				dataFilter: function(data, type){
					var items = window["eval"]("(" + data+ ")");
					return items;
				},
				error:function(XMLHttpRequest, textStatus, errorThrown){
					//alert("error");
				},
				success:function(data, textStatus){
					var datainfo = window["eval"]("(" + data[0].data + ")");
					$.extend($.jpolite.clientInfo, datainfo);
					$.jpolite.clientInfo.orgfullname = datainfo.orgFullName;
					$.jpolite.clientInfo.personname = datainfo.personName;
				}
			});
			$.ajax(o);
		},
		initClientInfo:function(){
			//$("#footer_status_info").html($.jpolite.clientInfo.personfname);
			$("#username_layout").html($.jpolite.clientInfo.personname);
		}
	}
});
