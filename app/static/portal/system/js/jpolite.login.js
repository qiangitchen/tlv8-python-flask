if (!$.jpolite) $.jpolite = {};
if (!$.jpolite.Login) $.jpolite.Login = {
	items: {},
	onGetUserCheckMsgBefore: null,
	onGetUserCheckMsgAfter: null,
	indexPage: "index.html",
	checkLogin: function(){
		$.jpolite.Data.system.User.check(function(data){
			if(data && data.status){
				window.location.href = window.location.href.replace(/login.*\.html.*/, $.jpolite.Login.indexPage);
			}
		});		
	},
	initUsernameInput: function(inputID){
		this.items.usernameInput = $("#" + inputID).keydown(function(event){
			if(event.keyCode==13){
				 $.jpolite.Login.doLogin();
				 return false;
			}	 
		});
	},
	initPasswordInput: function(inputID){
		this.items.passwordInput = $("#" + inputID).keydown(function(event){
			if(event.keyCode==13){
				 $.jpolite.Login.doLogin();
				 return false;
			}	 
		});
	},
	initLanguageInput: function(inputID){
		this.items.languageInput = $("#" + inputID).keydown(function(event){
			event.keyCode==13 && $.jpolite.Login.doLogin();
		});
	},
	initLoginButton: function(inputID){
		this.items.loginButton = $("#" + inputID).click(function(event){
			$.jpolite.Login.doLogin();
		});
	},
	initCancelButton: function(inputID){
		/*TODO::CG
		this.items.cancelButton = $("#" + inputID).click(function(event){
			window.location.reload();
		});
		var cancelElement = this.items.cancelButton.get(0);
		if (cancelElement) cancelElement.disabled = true;
		*/
	},
	//此处为验证图片的时间Js脚本初始化
	initCaptchaInput: function(inputID){
		this.items.captchaInput = $("#" + inputID).keydown(function(event){
			event.keyCode==13 && $.jpolite.Login.doLogin();
		});
	},
	initCaptchaImage: function(imageID, filename){
		$("#" + imageID).attr("src", cpath+"/captchaimage?t="+new Date().getTime());
		this.items.captchaImage = $("#" + imageID).click(function(event){
			filename = cpath+"/captchaimage?tmp="+new Date().getTime();
			$.jpolite.Login.items.captchaImage.removeAttr("src").attr("src", filename || "Kaptcha.jpg");
			if($.jpolite.Login.items.captchaInput)
				$.jpolite.Login.items.captchaInput.focus().select();
		});
	},
	initAgentSelect: function(selectID){
		this.items.agentSelect = $("#" + selectID).click(function(event){
			var username = $.trim($.jpolite.Login.items.usernameInput.val().toLowerCase());
			var password = $.jpolite.Login.items.passwordInput.val();
			var username_password = username + ";" + password;
			if($.jpolite.Login._old_username_password_ != username_password){
				$.jpolite.Login._old_username_password_ = username_password;
				var agentElement = $.jpolite.Login.items.agentSelect.get(0);
				if (agentElement) {
					agentElement.options.length = 1;
					$.jpolite.Data.system.User.getAgents(username, password, function(data){
						if(data && data.status && data.agents){
							for (var i in data.agents)
								agentElement.options.add(new Option(data.agents[i].name,data.agents[i].id));
						}
					});
				}
			}
		});
	},
	initHintLable: function(id){
		this.items.hintLable = $("#" + id);
	},
	initLoadingImage: function(id){
		this.items.loadingImage = $("#" + id);
	},
	initRememberCheckbox: function(checkboxID){
		this.items.rememberCheckbox = $("#" + checkboxID).change(function(event){
			$.cookie("tlv8_remember", $.jpolite.Login.items.rememberCheckbox.get(0).checked, {expires:7,path:'/'});
		});
	},
	initPasswordCheckbox: function(checkboxID){
		this.items.passwordCheckbox = $("#" + checkboxID).change(function(event){
			$.cookie("tlv8_password", $.jpolite.Login.items.passwordCheckbox.get(0).checked, {expires:7,path:'/'});
		});
	},
	initMaximize:function(checkboxID){
		$.cookie("justep-full-screen", "true");
		this.items.maximizeCheckbox = $("#"+checkboxID).change(function(){
			$.cookie("tlv8_full-screen", $.jpolite.Login.items.maximizeCheckbox.get(0).checked, {expires:7,path:'/'});
		});
	},
	initFromCookie: function(forced){
		var remember = forced || $.cookie("tlv8_remember")=="true";
		var rememberElement = this.items.rememberCheckbox ? this.items.rememberCheckbox.get(0) : null;
		if (rememberElement) rememberElement.checked = remember;
		if (remember) {
			$.jpolite.Login.items.usernameInput.val(CryptoJS.AESDecrypt($.cookie("tlv8_username")) || "");
			$.jpolite.Login.items.languageInput.val($.cookie("tlv8_language") || "");
		}
		var password = forced || $.cookie("justep_password")=="true";
		var rememberElement = this.items.passwordCheckbox ? this.items.passwordCheckbox.get(0) : null;
		if (rememberElement) rememberElement.checked = password;
		if(password){
			$.jpolite.Login.items.passwordInput.val(CryptoJS.AESDecrypt($.cookie("tlv8_password")) || "");
		}
		var maximize = $.cookie("tlv8_full-screen")=="true";
		var maximizeElement = this.items.maximizeCheckbox ? this.items.maximizeCheckbox.get(0) : null;
		if(maximizeElement) maximizeElement.checked = maximize;
	},
	initFocus: function(){
		$(this.items.usernameInput).val() ?
			$(this.items.passwordInput).focus() :
			$(this.items.usernameInput).focus();
		if(this.items.captchaInput){
			if($(this.items.usernameInput).val()&&$(this.items.passwordInput).val()){
				$(this.items.captchaInput).focus();
			}
		}
	},
	doGetDefaultCheckMsg: function(){
		if (this.onGetUserCheckMsgBefore) {
			var msg = this.onGetUserCheckMsgBefore();
			if (msg) return msg;
		}
		
		var username = $.trim($.jpolite.Login.items.usernameInput.val());
		if (username=="") {
			$.jpolite.Login.items.usernameInput.focus();
			return "请输入用户名！";
		}
		if(username.indexOf("'")>-1 || username.indexOf("=")>-1 || username.indexOf(">")>-1 || username.indexOf("<")>-1 || username.indexOf("!")>-1){
			$.jpolite.Login.items.usernameInput.focus();
			$.jpolite.Login.items.usernameInput.val("");
			return "请输入用户名！";
		}
			
		var password = $.jpolite.Login.items.passwordInput.val();
		if (password=="") {
			$.jpolite.Login.items.passwordInput.focus();
			return "请输入密码！";
		}
		
		if (this.onGetUserCheckMsgAfter) {
			return this.onGetUserCheckMsgAfter();
		}
	},
	doDisabledInput: function(b){
		for (var i in this.items) {
			var element = this.items[i].get(0);
			if (element) element.disabled = (this.items[i] == this.items.cancelButton ? !b : b);
		}
	},
	doSleep: function(n){
		var s = "您已经连续3次登录错误，请等待" + n + "秒重新登录！";
		$.jpolite.Login.items.hintLable && $.jpolite.Login.items.hintLable.text(s).show(); 
		if (--n >= 0) {
			setTimeout("$.jpolite.Login.doSleep(" + n + ")", 1000);
		} else {
			$.jpolite.Login.doDisabledInput(false);
			$.jpolite.Login.items.passwordInput && $.jpolite.Login.items.passwordInput.focus();
			$.jpolite.Login.items.hintLable && $.jpolite.Login.items.hintLable.text("").show();
		}
	},
	doLogin: function(){
		var msg = this.doGetDefaultCheckMsg();
		if (msg) {
			this.items.hintLable && this.items.hintLable.text(msg).show();
			return;
		}
		
		this.items.hintLable && this.items.hintLable.text("").hide();
		this.items.loadingImage && this.items.loadingImage.show();
		
		this.doDisabledInput(true);
		
		if (typeof $.jpolite.Login._error_count_ == "undefined")
			$.jpolite.Login._error_count_ = 0;
		
		//var username = CryptoJS.AESEncrypt($.trim(this.items.usernameInput.val().toLowerCase()));
		//var password = $.trim(this.items.passwordInput.val());
		var username = $.trim(this.items.usernameInput.val().toLowerCase());
		var password = $.trim(this.items.passwordInput.val());
		var language = "zh_CN";//this.items.languageInput.val();
		
		var captcha = this.items.captchaInput ? (this.items.captchaInput.val() || "") : "";
		var agent = this.items.agentSelect ? (this.items.agentSelect.val() || "") : "";
			
		$.jpolite.Data.system.User.login(username, hex_md5(password), {captcha:captcha,agent:agent,language:language}, function(data){
			if(data && data.status){
				$.cookie("tlv8_username", CryptoJS.AESEncrypt(username), {expires:7,path:'/'});
				$.cookie("tlv8_password", CryptoJS.AESEncrypt(password), {expires:7,path:'/'});
				$.cookie("tlv8_language", language);
				window.location.href = "/index?temp="+new Date().getTime();
				//luoting 判断登录的portel的主题类型 
				//var rebackFun=function(data){ 
				//	window.location.href = window.location.href.replace(/login.html.*/,"index.html?temp="+new Date().getTime());
				//};
				//$.jpolite.Data.send('sa/User/themeType',{},rebackFun,true);
			} else {
				$.jpolite.Login.items.captchaImage && $.jpolite.Login.items.captchaImage.click();
				$.jpolite.Login.items.loadingImage && $.jpolite.Login.items.loadingImage.hide();

				var k=data.msg;
				if (k) {
					var colon = k.indexOf(":");
					if (colon != -1) {
						k = k.substring(colon+1, k.length);
					}/*else{
						k="系统出错,请联系管理员";
					}*/
				}
				layer.msg(k);
				//$.jpolite.Login.items.hintLable && $.jpolite.Login.items.hintLable.text(k).show();
				$.jpolite.Login.items.passwordInput && $.jpolite.Login.items.passwordInput.val("").focus();
				$.jpolite.Login.items.captchaInput && $.jpolite.Login.items.captchaInput.val("");
				$.jpolite.Login._error_count_++;
				if ($.jpolite.Login._error_count_ == 3) {
					$.jpolite.Login._error_count_ = 0;
					setTimeout("$.jpolite.Login.doSleep(" + 10 + ")", 1000);
				} else {
					$.jpolite.Login.doDisabledInput(false);
					$.jpolite.Login.items.passwordInput && $.jpolite.Login.items.passwordInput.focus();
				}
			}
		});
	}
};