if (!jQuery) jQuery = {};
if (!jQuery.crossdomain) jQuery.crossdomain = {
	relayPage: window.location.href.replace(/\/[^\/]*$/, "/system/crossdomain.html"),
	sendToClient: function(iframe, cmd) {
		if (typeof iframe == "string")
			iframe = document.getElementById(iframe);
		if (iframe && (iframe.nodeName == "IFRAME")) {
			iframe.src = iframe.src.replace(/\#.*/g, "") + "#" + window.$crossdomain.server.relayPage + "|" + cmd;
		}
	},
	bindFromClient: function(fn) {
		if (!window._fn_crossdomain_server_) _fn_crossdomain_server_ = [];
		for (var i in window._fn_crossdomain_server_)
			if (window._fn_crossdomain_server_[i] == fn) return;
		window._fn_crossdomain_server_[window._fn_crossdomain_server_.length] = fn;
		if (!window._fn_crossdomain_listener_) {
			window._fn_crossdomain_listener_ = function(cmd) {
				for (var i in window._fn_crossdomain_server_)
					window._fn_crossdomain_server_[i].apply(window, [cmd]);
			}
		}
	},
	sendToServer: function(cmd) {
		if (!window._fn_crossdomain_url_) {
			window._fn_crossdomain_url_ = (window.location.hash && window.location.hash != "#") ?
				window.location.hash.replace(/\|.*$/, "").replace(/#/g, "") :
				window.$crossdomain.client.relayPage;
		}
		if (!window._fn_crossdomain_iframe_) {
			window._fn_crossdomain_iframe_ = document.createElement("IFRAME");
			window._fn_crossdomain_iframe_.style.display = "none";
			document.insertBefore(window._fn_crossdomain_iframe_);
		}
		window._fn_crossdomain_iframe_.src = window._fn_crossdomain_url_ + "#" + cmd;
	},
	bindFromServer: function(fn) {
		if (!window._fn_crossdomain_client_) window._fn_crossdomain_client_ = [];
		for (var i in window._fn_crossdomain_client_)
			if (window._fn_crossdomain_client_[i] == fn) return;
		window._fn_crossdomain_client_[window._fn_crossdomain_client_.length] = fn;
		if (!window._fn_crossdomain_timer_) {
			window._fn_crossdomain_timer_ = function() {
				if (window.location.hash && window.location.hash != "#" && !/.*\|$/.test(window.location.hash)) {
					var url = window.location.hash.replace(/\|.*$/, "").replace(/#/g, "");
					var cmd = window.location.hash.replace(/\#.*\|/, "");
					for (var i in window._fn_crossdomain_client_)
						window._fn_crossdomain_client_[i].apply(window, [cmd,url]);
					location.hash += "|";
				}
			}
			window.setInterval(window._fn_crossdomain_timer_,100);
		}
	}
};
