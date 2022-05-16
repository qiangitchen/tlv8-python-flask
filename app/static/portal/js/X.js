/*
 * 以下为了兼容老版本
 */
if (!$.X)
	$.X = {};
// 解析为 $对象
$.X.parseFunc = function(func) {
	var p = {};
	if (typeof func == "string") {
		try {
			$.extend(p, window["eval"]("(" + func + ")"));
		} catch (e) {
			alert("$.X.parseFunc\n" + e.description + "\n" + func);
		}
	} else {
		$.extend(p, func);
	}
	return p;
};
// 为功能构建连接地址
$.X.createFunc = function(func) {
	var url = func.url;
	if((url.substring(0,4)).toLowerCase() !="http"){
		var serverPath = window.location.protocol + "//" + window.location.host + "/" + window.location.pathname.split("/")[1];
		url = serverPath + url;
	}
	if (url.indexOf("?") > 0) {
		url += "&language=zh_CN";
	} else {
		url += "?language=zh_CN";
	}
	if (func.process && func.process != "") {
		url += "&process=" + func.process;
	}
	if (func.activity && func.activity != "") {
		url += "&activity=" + func.activity;
	}
	return url;
};
// 把符号全部换成"_"
$.X.getFuncID = function(func) {
	var p = $.X.parseFunc(func);
	if (p.id && p.id != "") {
		return p.id;
	}
	return hex_md5(p.url);
};
$.X.runparentFunc = {};
// 页面打开
$.X.runFunc = function(func) {
	var p = $.X.parseFunc(func);
	p.url = $.X.createFunc(p);
	if (p.target == "_blank") {
		var funcURL = $.X.createFunc(p);
		window.open(funcURL);
	} else if (p.target == "_self" || p.target == "_top"
			|| p.target == "_parent") {
		var funcURL = $.X.createFunc(p);
		window.location.href = funcURL;
	} else if (p.target == "_dialog") {
		// window.Light.portal.showDialog(p.url, p.name, p.width || 600,
		// p.height || 400);
		var swop = "height="
				+ (screen.availHeight - 60)
				+ ",width="
				+ (screen.availWidth)
				+ "toolbar=no,menubar=no,status=no,location=no,top=0,left=0,resizable:yes,scrollbars=yes";
		window.open(p.url, p.name, swop);
	} else {
		var tid = $.X.getFuncID(p);
		if (p.url.indexOf("?") > 0) {
			p.url += "&tabId=" + tid;
		} else {
			p.url += "?tabId=" + tid;
		}
		//layui.index.openTabsPage(p.url, p.name, tid);
		$.jpolite.addTab(tid,p);
	}
	return true;
};

$.X.runpFuncFrame = function(sname, surl) {
	var navBarhtmls = [];
	navBarhtmls.push("<b>首页</b>");
	navBarhtmls.push(" >> <b>" + sname + "</b>");
	$("#navBarView").html(navBarhtmls.join(""));
	$("#mainFrame").attr("src", surl);
	$.X.runparentFunc = {
		name : sname,
		url : surl
	};
	var tid = $.X.getFuncID($.X.runparentFunc);
	$("#mainFrame").attr("tabid", tid);
};