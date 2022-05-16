layui.config({
  layimPath: '../../../../tlv8/resources/layim/' //配置 layim.js 所在目录
  ,layimAssetsPath: '../../../../tlv8/resources/layim/layim-assets/' //layim 资源文件所在目录
}).extend({
  layim: layui.cache.layimPath + 'layim' //配置 layim 组件所在的路径
}).use('layim', function(layim){ //加载组件
  
  //演示自动回复
  var autoReplay = [
    '您好，我现在有事不在，一会再和您联系。', 
    '你没发错吧？face[微笑] ',
    '这是一段演示消息 face[哈哈] ',
    '演示消息 face[心] face[心] face[心] ',
    'face[威武] face[威武] face[威武] face[威武] ',
    '<（@￣︶￣@）>',
    '你要和我说话？你真的要和我说话？你确定自己想说吗？你一定非说不可吗？那你说吧，这是自动回复。',
    'face[黑线]  你慢慢说，别急……',
    '(*^__^*) face[嘻嘻]'
  ];
  
  //基础配置
  layim.config({

    //初始化接口
    init: {
      url: '../layim/getUserList'
      ,data: {}
    }
    
    //查看群员接口
    ,members: {
      url: '../layim/getMembers'
      ,data: {}
    }
    
    //上传图片接口
    ,uploadImage: {
      url: '../layim/uploadImage' //（返回的数据格式见下文）
      ,type: '' //默认post
    } 
    
    //上传文件接口
    ,uploadFile: {
      url: '../layim/uploadFile' //（返回的数据格式见下文）
      ,type: '' //默认post
    }
    
    ,isAudio: true //开启聊天工具栏音频
    ,isVideo: true //开启聊天工具栏视频
    
    //扩展工具栏
    ,tool: [{
      alias: 'code'
      ,title: '代码'
      ,icon: '&#xe64e;'
    }]
    
    //,brief: true //是否简约模式（若开启则不显示主面板）
    
    ,title: '即时通讯' //自定义主面板最小化时的标题
    //,right: '100px' //主面板相对浏览器右侧距离
    //,minRight: '90px' //聊天面板最小化时相对浏览器右侧距离
    ,initSkin: '3.jpg' //1-5 设置初始背景
    //,skin: ['aaa.jpg'] //新增皮肤
    //,isfriend: false //是否开启好友
    //,isgroup: false //是否开启群组
    //,min: true //是否始终最小化主面板，默认false
    ,notice: true //是否开启桌面消息提醒，默认false
    //,voice: false //声音提醒，默认开启，声音文件为：default.mp3
    
//    ,msgbox: layui.cache.layimAssetsPath + 'html/msgbox.html' //消息盒子页面地址，若不开启，剔除该项即可
//    ,find: layui.cache.layimAssetsPath + 'html/find.html' //发现页面地址，若不开启，剔除该项即可
    ,chatLog: layui.cache.layimAssetsPath + 'html/chatlog.html' //聊天记录页面地址，若不开启，剔除该项即可
    
  });

  /*
  layim.chat({
    name: '自定义窗口-1'
    ,type: 'kefu'
    ,avatar: ''
    ,id: -1
  });
  layim.chat({
    name: '自定义窗口-2'
    ,type: 'kefu'
    ,avatar: ''
    ,id: -2
  });
  layim.setChatMin();*/

  //触发在线状态的切换事件
  layim.on('online', function(data){
    //console.log(data);
	  layim.websocket.send(JSON.stringify({type:'userstatus', data: status}));
  });
  
  //触发签名修改
  layim.on('sign', function(value){
    //console.log(value);
	  layer.msg(value);
  });

  //触发自定义工具栏点击，以添加代码为例
  layim.on('tool(code)', function(insert){
    layer.prompt({
      title: '插入代码'
      ,formType: 2
      ,shade: 0
    }, function(text, index){
      layer.close(index);
      insert('[pre class=layui-code]' + text + '[/pre]'); //将内容插入到编辑器
    });
  });
  
  layim.clearCache = function(){
	  var cache =  layui.layim.cache();
	  var local = layui.data('layim')[cache.mine.id]; //获取当前用户本地数据
	   
	  //这里以删除本地聊天记录为例
	  delete local.chatlog;
	   
	  //向localStorage同步数据
	  layui.data('layim', {
	    key: cache.mine.id
	    ,value: local
	  });
  };
  
  //记录好友在线状态
  layim.userSatusmap = new Map();
  
  //触发layim建立就绪
  layim.on('ready', function(res){
    //console.log(res.mine);
    //layim.msgbox(5); //模拟消息盒子有新消息，实际使用时，一般是动态获得
  
	  var lockReconnect = false;//避免重复连接
		var proto = window.location.protocol;
		var shost = window.location.host; //IE\u4e0d\u5141\u8bb8\u8de8\u57df
		var wsUrl = shost+'/tlv8/IM/websocket/'+res.mine.id;
		if(proto=="https:"){
			wsUrl = "wss://" + wsUrl;
		}else{
			wsUrl = "ws://" + wsUrl;
		}
		var websocket;
		
		function createWebSocket() {
	      try {
	    	  websocket = new WebSocket(wsUrl);
	          init();
	      } catch(e) {
	        //console.log('catch');
	        reconnect(wsUrl);
	      }
	    }
		
		function init() {
			//连接发生错误的回调方法
			websocket.onerror = function () {
				//layer.msg("WebSocket连接发生错误");
				reconnect(wsUrl);
			};
			
			//连接成功建立的回调方法
			websocket.onopen = function () {
				//layer.msg("WebSocket连接成功");
				heartCheck();
			};
			
			//接收到消息的回调方法
			websocket.onmessage = function (event) {
				var res = event.data;
				//console.log(res);
				//layer.msg(res);
				res = JSON.parse(res);
				if(res.emit === 'chatMessage'){
				   layim.getMessage(res.data); //res.data即你发送消息传递的数据（阅读：监听发送的消息）
				}else if(res.emit === 'userstatus'){
					layim.userSatusmap.put(res.data.id, res.data.status);
					layim.setFriendStatus(res.data.id, res.data.status);
					if(layim.currentchatid==res.data.id){
						if(res.data.status=="online"){
				    		layim.setChatStatus('<span style="color:green;">在线</span>');
				    	}else{
				    		layim.setChatStatus('<span style="color:#FF5722;">离线</span>');
				    	}
					}
				}
			};
			
			//连接关闭的回调方法
			websocket.onclose = function () {
				//layer.msg("WebSocket连接关闭");
				reconnect(wsUrl);
			};
			
			//监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
			window.onbeforeunload = function () {
				websocket.close();
			}
		
			layim.websocket = websocket;
		}
		
		var tt,chtt;
		function reconnect(url) {
	      if(lockReconnect) {
	        return;
	      };
	      lockReconnect = true;
	      //没连接上会一直重连，设置延迟避免请求过多
	      tt && clearTimeout(tt);
	      tt = setTimeout(function () {
	        createWebSocket(url);
	        lockReconnect = false;
	      }, 4000);
	    }
		
		createWebSocket(wsUrl);
		
		function heartCheck(){
			layim.websocket.send(JSON.stringify({type:'heartCheck', data: new Date().getTime()}));
			chtt && clearTimeout(chtt);
			chtt = setTimeout(heartCheck,3000);
		}
  });

  //触发发送消息
  layim.on('sendMessage', function(data){
	  
	layim.websocket.send(JSON.stringify({type:'chatMessage', data: data}));
    
	/*
	var To = data.to;
    //console.log(data);
    
    if(To.type === 'friend'){
      layim.setChatStatus('<span style="color:#FF5722;">对方正在输入。。。</span>');
    }
    
    //演示自动回复
    setTimeout(function(){
      var obj = {};
      if(To.type === 'group'){
        obj = {
          username: '模拟群员'+(Math.random()*100|0)
          ,avatar: layui.cache.layimAssetsPath + 'images/face/'+ (Math.random()*72|0) + '.gif'
          ,id: To.id
          ,type: To.type
          ,content: autoReplay[Math.random()*9|0]
        }
      } else {
        obj = {
          username: To.name
          ,avatar: To.avatar
          ,id: To.id
          ,type: To.type
          ,content: autoReplay[Math.random()*9|0]
        }
        layim.setChatStatus('<span style="color:#FF5722;">在线</span>');
      }
      layim.getMessage(obj);
    }, 1000);
    */
  });

  //触发查看群员
  layim.on('members', function(data){
    //console.log(data);
  });
  
  //触发聊天窗口的切换
  layim.on('chatChange', function(res){
    var type = res.data.type;
    //console.log(res.data.id)
    if(type === 'friend'){
      //模拟标注好友状态
      //layim.setChatStatus('<span style="color:#FF5722;">在线</span>');
      var status = layim.userSatusmap.get(res.data.id)||res.data.status;
      if(status=="online"){
    		layim.setChatStatus('<span style="color:green;">在线</span>');
      }else{
    		layim.setChatStatus('<span style="color:#FF5722;">离线</span>');
      }
    } else if(type === 'group'){
      //模拟系统消息
      /*layim.getMessage({
        system: true
        ,id: res.data.id
        ,type: "group"
        ,content: '模拟群员'+(Math.random()*100|0) + '加入群聊'
      });*/
    }
  });
  
  

});