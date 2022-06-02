/*
 * 因为我们需要合并js文件，这样dojo的文件加载机制就会遇到文件路径问题
 * 这个文件是就为了解决这个问题写的，在合并的时候合并在需要使用动态加载文件之前就可以
 */
 
(function(){
	var d = dojo;
	if(document && document.getElementsByTagName){
		var scripts = document.getElementsByTagName("script");
		var rePkg = /processChart(\.xd)?\.js([\?\.]|$)/i;
		for(var i = 0; i < scripts.length; i++){
			var src = scripts[i].getAttribute("src");
			if(!src){ continue; }
			var m = src.match(rePkg);
			if(m){
				djConfig["baseUrl"] = src.substring(0, m.index) + "dojo/dojo/";
				var cfg = scripts[i].getAttribute("djConfig");
				if(cfg){
					var cfgo = eval("({ "+cfg+" })");
					for(var x in cfgo){
						djConfig[x] = cfgo[x];
					}
				}
				break;
			}
		}
	}
	d.baseUrl = djConfig["baseUrl"];
})();
