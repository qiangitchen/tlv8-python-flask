//====================== dojo ================================
/*
	Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/

/*
	This is an optimized version of Dojo, built for deployment and not for
	development. To get sources and documentation, please visit:

		http://dojotoolkit.org
*/

(function(){var _1=null;if((_1||(typeof djConfig!="undefined"&&djConfig.scopeMap))&&(typeof window!="undefined")){var _2="",_3="",_4="",_5={},_6={};_1=_1||djConfig.scopeMap;for(var i=0;i<_1.length;i++){var _7=_1[i];_2+="var "+_7[0]+" = {}; "+_7[1]+" = "+_7[0]+";"+_7[1]+"._scopeName = '"+_7[1]+"';";_3+=(i==0?"":",")+_7[0];_4+=(i==0?"":",")+_7[1];_5[_7[0]]=_7[1];_6[_7[1]]=_7[0];}eval(_2+"dojo._scopeArgs = ["+_4+"];");dojo._scopePrefixArgs=_3;dojo._scopePrefix="(function("+_3+"){";dojo._scopeSuffix="})("+_4+")";dojo._scopeMap=_5;dojo._scopeMapRev=_6;}(function(){if(typeof this["loadFirebugConsole"]=="function"){this["loadFirebugConsole"]();}else{this.console=this.console||{};var cn=["assert","count","debug","dir","dirxml","error","group","groupEnd","info","profile","profileEnd","time","timeEnd","trace","warn","log"];var i=0,tn;while((tn=cn[i++])){if(!console[tn]){(function(){var _8=tn+"";console[_8]=("log" in console)?function(){var a=Array.apply({},arguments);a.unshift(_8+":");console["log"](a.join(" "));}:function(){};console[_8]._fake=true;})();}}}if(typeof dojo=="undefined"){dojo={_scopeName:"dojo",_scopePrefix:"",_scopePrefixArgs:"",_scopeSuffix:"",_scopeMap:{},_scopeMapRev:{}};}var d=dojo;if(typeof dijit=="undefined"){dijit={_scopeName:"dijit"};}if(typeof dojox=="undefined"){dojox={_scopeName:"dojox"};}if(!d._scopeArgs){d._scopeArgs=[dojo,dijit,dojox];}d.global=this;d.config={isDebug:false,debugAtAllCosts:false};if(typeof djConfig!="undefined"){for(var _9 in djConfig){d.config[_9]=djConfig[_9];}}dojo.locale=d.config.locale;var _a="$Rev: 22734 $".match(/\d+/);dojo.version={major:1,minor:5,patch:1,flag:"",revision:_a?+_a[0]:NaN,toString:function(){with(d.version){return major+"."+minor+"."+patch+flag+" ("+revision+")";}}};if(typeof OpenAjax!="undefined"){OpenAjax.hub.registerLibrary(dojo._scopeName,"http://dojotoolkit.org",d.version.toString());}var _b,_c,_d={};for(var i in {toString:1}){_b=[];break;}dojo._extraNames=_b=_b||["hasOwnProperty","valueOf","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","constructor"];_c=_b.length;dojo._mixin=function(_e,_f){var _10,s,i;for(_10 in _f){s=_f[_10];if(!(_10 in _e)||(_e[_10]!==s&&(!(_10 in _d)||_d[_10]!==s))){_e[_10]=s;}}if(_c&&_f){for(i=0;i<_c;++i){_10=_b[i];s=_f[_10];if(!(_10 in _e)||(_e[_10]!==s&&(!(_10 in _d)||_d[_10]!==s))){_e[_10]=s;}}}return _e;};dojo.mixin=function(obj,_11){if(!obj){obj={};}for(var i=1,l=arguments.length;i<l;i++){d._mixin(obj,arguments[i]);}return obj;};dojo._getProp=function(_12,_13,_14){var obj=_14||d.global;for(var i=0,p;obj&&(p=_12[i]);i++){if(i==0&&d._scopeMap[p]){p=d._scopeMap[p];}obj=(p in obj?obj[p]:(_13?obj[p]={}:undefined));}return obj;};dojo.setObject=function(_15,_16,_17){var _18=_15.split("."),p=_18.pop(),obj=d._getProp(_18,true,_17);return obj&&p?(obj[p]=_16):undefined;};dojo.getObject=function(_19,_1a,_1b){return d._getProp(_19.split("."),_1a,_1b);};dojo.exists=function(_1c,obj){return !!d.getObject(_1c,false,obj);};dojo["eval"]=function(_1d){return d.global.eval?d.global.eval(_1d):eval(_1d);};d.deprecated=d.experimental=function(){};})();(function(){var d=dojo;d.mixin(d,{_loadedModules:{},_inFlightCount:0,_hasResource:{},_modulePrefixes:{dojo:{name:"dojo",value:"."},doh:{name:"doh",value:"../util/doh"},tests:{name:"tests",value:"tests"}},_moduleHasPrefix:function(_1e){var mp=d._modulePrefixes;return !!(mp[_1e]&&mp[_1e].value);},_getModulePrefix:function(_1f){var mp=d._modulePrefixes;if(d._moduleHasPrefix(_1f)){return mp[_1f].value;}return _1f;},_loadedUrls:[],_postLoad:false,_loaders:[],_unloaders:[],_loadNotifying:false});dojo._loadPath=function(_20,_21,cb){var uri=((_20.charAt(0)=="/"||_20.match(/^\w+:/))?"":d.baseUrl)+_20;try{return !_21?d._loadUri(uri,cb):d._loadUriAndCheck(uri,_21,cb);}catch(e){console.error(e);return false;}};dojo._loadUri=function(uri,cb){if(d._loadedUrls[uri]){return true;}d._inFlightCount++;var _22=d._getText(uri,true);if(_22){d._loadedUrls[uri]=true;d._loadedUrls.push(uri);if(cb){_22="("+_22+")";}else{_22=d._scopePrefix+_22+d._scopeSuffix;}if(!d.isIE){_22+="\r\n//@ sourceURL="+uri;}var _23=d["eval"](_22);if(cb){cb(_23);}}if(--d._inFlightCount==0&&d._postLoad&&d._loaders.length){setTimeout(function(){if(d._inFlightCount==0){d._callLoaded();}},0);}return !!_22;};dojo._loadUriAndCheck=function(uri,_24,cb){var ok=false;try{ok=d._loadUri(uri,cb);}catch(e){console.error("failed loading "+uri+" with error: "+e);}return !!(ok&&d._loadedModules[_24]);};dojo.loaded=function(){d._loadNotifying=true;d._postLoad=true;var mll=d._loaders;d._loaders=[];for(var x=0;x<mll.length;x++){mll[x]();}d._loadNotifying=false;if(d._postLoad&&d._inFlightCount==0&&mll.length){d._callLoaded();}};dojo.unloaded=function(){var mll=d._unloaders;while(mll.length){(mll.pop())();}};d._onto=function(arr,obj,fn){if(!fn){arr.push(obj);}else{if(fn){var _25=(typeof fn=="string")?obj[fn]:fn;arr.push(function(){_25.call(obj);});}}};dojo.ready=dojo.addOnLoad=function(obj,_26){d._onto(d._loaders,obj,_26);if(d._postLoad&&d._inFlightCount==0&&!d._loadNotifying){d._callLoaded();}};var dca=d.config.addOnLoad;if(dca){d.addOnLoad[(dca instanceof Array?"apply":"call")](d,dca);}dojo._modulesLoaded=function(){if(d._postLoad){return;}if(d._inFlightCount>0){console.warn("files still in flight!");return;}d._callLoaded();};dojo._callLoaded=function(){if(typeof setTimeout=="object"||(d.config.useXDomain&&d.isOpera)){setTimeout(d.isAIR?function(){d.loaded();}:d._scopeName+".loaded();",0);}else{d.loaded();}};dojo._getModuleSymbols=function(_27){var _28=_27.split(".");for(var i=_28.length;i>0;i--){var _29=_28.slice(0,i).join(".");if(i==1&&!d._moduleHasPrefix(_29)){_28[0]="../"+_28[0];}else{var _2a=d._getModulePrefix(_29);if(_2a!=_29){_28.splice(0,i,_2a);break;}}}return _28;};dojo._global_omit_module_check=false;dojo.loadInit=function(_2b){_2b();};dojo._loadModule=dojo.require=function(_2c,_2d){_2d=d._global_omit_module_check||_2d;var _2e=d._loadedModules[_2c];if(_2e){return _2e;}var _2f=d._getModuleSymbols(_2c).join("/")+".js";var _30=!_2d?_2c:null;var ok=d._loadPath(_2f,_30);if(!ok&&!_2d){throw new Error("Could not load '"+_2c+"'; last tried '"+_2f+"'");}if(!_2d&&!d._isXDomain){_2e=d._loadedModules[_2c];if(!_2e){throw new Error("symbol '"+_2c+"' is not defined after loading '"+_2f+"'");}}return _2e;};dojo.provide=function(_31){_31=_31+"";return (d._loadedModules[_31]=d.getObject(_31,true));};dojo.platformRequire=function(_32){var _33=_32.common||[];var _34=_33.concat(_32[d._name]||_32["default"]||[]);for(var x=0;x<_34.length;x++){var _35=_34[x];if(_35.constructor==Array){d._loadModule.apply(d,_35);}else{d._loadModule(_35);}}};dojo.requireIf=function(_36,_37){if(_36===true){var _38=[];for(var i=1;i<arguments.length;i++){_38.push(arguments[i]);}d.require.apply(d,_38);}};dojo.requireAfterIf=d.requireIf;dojo.registerModulePath=function(_39,_3a){d._modulePrefixes[_39]={name:_39,value:_3a};};dojo.requireLocalization=function(_3b,_3c,_3d,_3e){d.require("dojo.i18n");d.i18n._requireLocalization.apply(d.hostenv,arguments);};var ore=new RegExp("^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?$"),ire=new RegExp("^((([^\\[:]+):)?([^@]+)@)?(\\[([^\\]]+)\\]|([^\\[:]*))(:([0-9]+))?$");dojo._Url=function(){var n=null,_3f=arguments,uri=[_3f[0]];for(var i=1;i<_3f.length;i++){if(!_3f[i]){continue;}var _40=new d._Url(_3f[i]+""),_41=new d._Url(uri[0]+"");if(_40.path==""&&!_40.scheme&&!_40.authority&&!_40.query){if(_40.fragment!=n){_41.fragment=_40.fragment;}_40=_41;}else{if(!_40.scheme){_40.scheme=_41.scheme;if(!_40.authority){_40.authority=_41.authority;if(_40.path.charAt(0)!="/"){var _42=_41.path.substring(0,_41.path.lastIndexOf("/")+1)+_40.path;var _43=_42.split("/");for(var j=0;j<_43.length;j++){if(_43[j]=="."){if(j==_43.length-1){_43[j]="";}else{_43.splice(j,1);j--;}}else{if(j>0&&!(j==1&&_43[0]=="")&&_43[j]==".."&&_43[j-1]!=".."){if(j==(_43.length-1)){_43.splice(j,1);_43[j-1]="";}else{_43.splice(j-1,2);j-=2;}}}}_40.path=_43.join("/");}}}}uri=[];if(_40.scheme){uri.push(_40.scheme,":");}if(_40.authority){uri.push("//",_40.authority);}uri.push(_40.path);if(_40.query){uri.push("?",_40.query);}if(_40.fragment){uri.push("#",_40.fragment);}}this.uri=uri.join("");var r=this.uri.match(ore);this.scheme=r[2]||(r[1]?"":n);this.authority=r[4]||(r[3]?"":n);this.path=r[5];this.query=r[7]||(r[6]?"":n);this.fragment=r[9]||(r[8]?"":n);if(this.authority!=n){r=this.authority.match(ire);this.user=r[3]||n;this.password=r[4]||n;this.host=r[6]||r[7];this.port=r[9]||n;}};dojo._Url.prototype.toString=function(){return this.uri;};dojo.moduleUrl=function(_44,url){var loc=d._getModuleSymbols(_44).join("/");if(!loc){return null;}if(loc.lastIndexOf("/")!=loc.length-1){loc+="/";}var _45=loc.indexOf(":");if(loc.charAt(0)!="/"&&(_45==-1||_45>loc.indexOf("/"))){loc=d.baseUrl+loc;}return new d._Url(loc,url);};})();if(typeof window!="undefined"){dojo.isBrowser=true;dojo._name="browser";(function(){var d=dojo;if(document&&document.getElementsByTagName){var _46=document.getElementsByTagName("script");var _47=/dojo(\.xd)?\.js(\W|$)/i;for(var i=0;i<_46.length;i++){var src=_46[i].getAttribute("src");if(!src){continue;}var m=src.match(_47);if(m){if(!d.config.baseUrl){d.config.baseUrl=src.substring(0,m.index);}var cfg=_46[i].getAttribute("djConfig");if(cfg){var _48=eval("({ "+cfg+" })");for(var x in _48){dojo.config[x]=_48[x];}}break;}}}d.baseUrl=d.config.baseUrl;var n=navigator;var dua=n.userAgent,dav=n.appVersion,tv=parseFloat(dav);if(dua.indexOf("Opera")>=0){d.isOpera=tv;}if(dua.indexOf("AdobeAIR")>=0){d.isAIR=1;}d.isKhtml=(dav.indexOf("Konqueror")>=0)?tv:0;d.isWebKit=parseFloat(dua.split("WebKit/")[1])||undefined;d.isChrome=parseFloat(dua.split("Chrome/")[1])||undefined;d.isMac=dav.indexOf("Macintosh")>=0;var _49=Math.max(dav.indexOf("WebKit"),dav.indexOf("Safari"),0);if(_49&&!dojo.isChrome){d.isSafari=parseFloat(dav.split("Version/")[1]);if(!d.isSafari||parseFloat(dav.substr(_49+7))<=419.3){d.isSafari=2;}}if(dua.indexOf("Gecko")>=0&&!d.isKhtml&&!d.isWebKit){d.isMozilla=d.isMoz=tv;}if(d.isMoz){d.isFF=parseFloat(dua.split("Firefox/")[1]||dua.split("Minefield/")[1])||undefined;}if(document.all&&!d.isOpera){d.isIE=parseFloat(dav.split("MSIE ")[1])||undefined;var _4a=document.documentMode;if(_4a&&_4a!=5&&Math.floor(d.isIE)!=_4a){d.isIE=_4a;}}if(dojo.isIE&&window.location.protocol==="file:"){dojo.config.ieForceActiveXXhr=true;}d.isQuirks=document.compatMode=="BackCompat";d.locale=dojo.config.locale||(d.isIE?n.userLanguage:n.language).toLowerCase();d._XMLHTTP_PROGIDS=["Msxml2.XMLHTTP","Microsoft.XMLHTTP","Msxml2.XMLHTTP.4.0"];d._xhrObj=function(){var _4b,_4c;if(!dojo.isIE||!dojo.config.ieForceActiveXXhr){try{_4b=new XMLHttpRequest();}catch(e){}}if(!_4b){for(var i=0;i<3;++i){var _4d=d._XMLHTTP_PROGIDS[i];try{_4b=new ActiveXObject(_4d);}catch(e){_4c=e;}if(_4b){d._XMLHTTP_PROGIDS=[_4d];break;}}}if(!_4b){throw new Error("XMLHTTP not available: "+_4c);}return _4b;};d._isDocumentOk=function(_4e){var _4f=_4e.status||0,lp=location.protocol;return (_4f>=200&&_4f<300)||_4f==304||_4f==1223||(!_4f&&(lp=="file:"||lp=="chrome:"||lp=="chrome-extension:"||lp=="app:"));};var _50=window.location+"";var _51=document.getElementsByTagName("base");var _52=(_51&&_51.length>0);d._getText=function(uri,_53){var _54=d._xhrObj();if(!_52&&dojo._Url){uri=(new dojo._Url(_50,uri)).toString();}if(d.config.cacheBust){uri+="";uri+=(uri.indexOf("?")==-1?"?":"&")+String(d.config.cacheBust).replace(/\W+/g,"");}_54.open("GET",uri,false);try{_54.send(null);if(!d._isDocumentOk(_54)){var err=Error("Unable to load "+uri+" status:"+_54.status);err.status=_54.status;err.responseText=_54.responseText;throw err;}}catch(e){if(_53){return null;}throw e;}return _54.responseText;};var _55=window;var _56=function(_57,fp){var _58=_55.attachEvent||_55.addEventListener;_57=_55.attachEvent?_57:_57.substring(2);_58(_57,function(){fp.apply(_55,arguments);},false);};d._windowUnloaders=[];d.windowUnloaded=function(){var mll=d._windowUnloaders;while(mll.length){(mll.pop())();}d=null;};var _59=0;d.addOnWindowUnload=function(obj,_5a){d._onto(d._windowUnloaders,obj,_5a);if(!_59){_59=1;_56("onunload",d.windowUnloaded);}};var _5b=0;d.addOnUnload=function(obj,_5c){d._onto(d._unloaders,obj,_5c);if(!_5b){_5b=1;_56("onbeforeunload",dojo.unloaded);}};})();dojo._initFired=false;dojo._loadInit=function(e){if(dojo._scrollIntervalId){clearInterval(dojo._scrollIntervalId);dojo._scrollIntervalId=0;}if(!dojo._initFired){dojo._initFired=true;if(!dojo.config.afterOnLoad&&window.detachEvent){window.detachEvent("onload",dojo._loadInit);}if(dojo._inFlightCount==0){dojo._modulesLoaded();}}};if(!dojo.config.afterOnLoad){if(document.addEventListener){document.addEventListener("DOMContentLoaded",dojo._loadInit,false);window.addEventListener("load",dojo._loadInit,false);}else{if(window.attachEvent){window.attachEvent("onload",dojo._loadInit);if(!dojo.config.skipIeDomLoaded&&self===self.top){dojo._scrollIntervalId=setInterval(function(){try{if(document.body){document.documentElement.doScroll("left");dojo._loadInit();}}catch(e){}},30);}}}}if(dojo.isIE){try{(function(){document.namespaces.add("v","urn:schemas-microsoft-com:vml");var _5d=["*","group","roundrect","oval","shape","rect","imagedata","path","textpath","text"],i=0,l=1,s=document.createStyleSheet();if(dojo.isIE>=8){i=1;l=_5d.length;}for(;i<l;++i){s.addRule("v\\:"+_5d[i],"behavior:url(#default#VML); display:inline-block");}})();}catch(e){}}}(function(){var mp=dojo.config["modulePaths"];if(mp){for(var _5e in mp){dojo.registerModulePath(_5e,mp[_5e]);}}})();if(dojo.config.isDebug){dojo.require("dojo._firebug.firebug");}if(dojo.config.debugAtAllCosts){dojo.config.useXDomain=true;dojo.require("dojo._base._loader.loader_xd");dojo.require("dojo._base._loader.loader_debug");dojo.require("dojo.i18n");}if(!dojo._hasResource["dojo._base.lang"]){dojo._hasResource["dojo._base.lang"]=true;dojo.provide("dojo._base.lang");(function(){var d=dojo,_5f=Object.prototype.toString;dojo.isString=function(it){return (typeof it=="string"||it instanceof String);};dojo.isArray=function(it){return it&&(it instanceof Array||typeof it=="array");};dojo.isFunction=function(it){return _5f.call(it)==="[object Function]";};dojo.isObject=function(it){return it!==undefined&&(it===null||typeof it=="object"||d.isArray(it)||d.isFunction(it));};dojo.isArrayLike=function(it){return it&&it!==undefined&&!d.isString(it)&&!d.isFunction(it)&&!(it.tagName&&it.tagName.toLowerCase()=="form")&&(d.isArray(it)||isFinite(it.length));};dojo.isAlien=function(it){return it&&!d.isFunction(it)&&/\{\s*\[native code\]\s*\}/.test(String(it));};dojo.extend=function(_60,_61){for(var i=1,l=arguments.length;i<l;i++){d._mixin(_60.prototype,arguments[i]);}return _60;};dojo._hitchArgs=function(_62,_63){var pre=d._toArray(arguments,2);var _64=d.isString(_63);return function(){var _65=d._toArray(arguments);var f=_64?(_62||d.global)[_63]:_63;return f&&f.apply(_62||this,pre.concat(_65));};};dojo.hitch=function(_66,_67){if(arguments.length>2){return d._hitchArgs.apply(d,arguments);}if(!_67){_67=_66;_66=null;}if(d.isString(_67)){_66=_66||d.global;if(!_66[_67]){throw (["dojo.hitch: scope[\"",_67,"\"] is null (scope=\"",_66,"\")"].join(""));}return function(){return _66[_67].apply(_66,arguments||[]);};}return !_66?_67:function(){return _67.apply(_66,arguments||[]);};};dojo.delegate=dojo._delegate=(function(){function TMP(){};return function(obj,_68){TMP.prototype=obj;var tmp=new TMP();TMP.prototype=null;if(_68){d._mixin(tmp,_68);}return tmp;};})();var _69=function(obj,_6a,_6b){return (_6b||[]).concat(Array.prototype.slice.call(obj,_6a||0));};var _6c=function(obj,_6d,_6e){var arr=_6e||[];for(var x=_6d||0;x<obj.length;x++){arr.push(obj[x]);}return arr;};dojo._toArray=d.isIE?function(obj){return ((obj.item)?_6c:_69).apply(this,arguments);}:_69;dojo.partial=function(_6f){var arr=[null];return d.hitch.apply(d,arr.concat(d._toArray(arguments)));};var _70=d._extraNames,_71=_70.length,_72={};dojo.clone=function(o){if(!o||typeof o!="object"||d.isFunction(o)){return o;}if(o.nodeType&&"cloneNode" in o){return o.cloneNode(true);}if(o instanceof Date){return new Date(o.getTime());}var r,i,l,s,_73;if(d.isArray(o)){r=[];for(i=0,l=o.length;i<l;++i){if(i in o){r.push(d.clone(o[i]));}}}else{r=o.constructor?new o.constructor():{};}for(_73 in o){s=o[_73];if(!(_73 in r)||(r[_73]!==s&&(!(_73 in _72)||_72[_73]!==s))){r[_73]=d.clone(s);}}if(_71){for(i=0;i<_71;++i){_73=_70[i];s=o[_73];if(!(_73 in r)||(r[_73]!==s&&(!(_73 in _72)||_72[_73]!==s))){r[_73]=s;}}}return r;};dojo.trim=String.prototype.trim?function(str){return str.trim();}:function(str){return str.replace(/^\s\s*/,"").replace(/\s\s*$/,"");};var _74=/\{([^\}]+)\}/g;dojo.replace=function(_75,map,_76){return _75.replace(_76||_74,d.isFunction(map)?map:function(_77,k){return d.getObject(k,false,map);});};})();}if(!dojo._hasResource["dojo._base.array"]){dojo._hasResource["dojo._base.array"]=true;dojo.provide("dojo._base.array");(function(){var _78=function(arr,obj,cb){return [(typeof arr=="string")?arr.split(""):arr,obj||dojo.global,(typeof cb=="string")?new Function("item","index","array",cb):cb];};var _79=function(_7a,arr,_7b,_7c){var _7d=_78(arr,_7c,_7b);arr=_7d[0];for(var i=0,l=arr.length;i<l;++i){var _7e=!!_7d[2].call(_7d[1],arr[i],i,arr);if(_7a^_7e){return _7e;}}return _7a;};dojo.mixin(dojo,{indexOf:function(_7f,_80,_81,_82){var _83=1,end=_7f.length||0,i=0;if(_82){i=end-1;_83=end=-1;}if(_81!=undefined){i=_81;}if((_82&&i>end)||i<end){for(;i!=end;i+=_83){if(_7f[i]==_80){return i;}}}return -1;},lastIndexOf:function(_84,_85,_86){return dojo.indexOf(_84,_85,_86,true);},forEach:function(arr,_87,_88){if(!arr||!arr.length){return;}var _89=_78(arr,_88,_87);arr=_89[0];for(var i=0,l=arr.length;i<l;++i){_89[2].call(_89[1],arr[i],i,arr);}},every:function(arr,_8a,_8b){return _79(true,arr,_8a,_8b);},some:function(arr,_8c,_8d){return _79(false,arr,_8c,_8d);},map:function(arr,_8e,_8f){var _90=_78(arr,_8f,_8e);arr=_90[0];var _91=(arguments[3]?(new arguments[3]()):[]);for(var i=0,l=arr.length;i<l;++i){_91.push(_90[2].call(_90[1],arr[i],i,arr));}return _91;},filter:function(arr,_92,_93){var _94=_78(arr,_93,_92);arr=_94[0];var _95=[];for(var i=0,l=arr.length;i<l;++i){if(_94[2].call(_94[1],arr[i],i,arr)){_95.push(arr[i]);}}return _95;}});})();}if(!dojo._hasResource["dojo._base.declare"]){dojo._hasResource["dojo._base.declare"]=true;dojo.provide("dojo._base.declare");(function(){var d=dojo,mix=d._mixin,op=Object.prototype,_96=op.toString,_97=new Function,_98=0,_99="constructor";function err(msg){throw new Error("declare: "+msg);};function _9a(_9b){var _9c=[],_9d=[{cls:0,refs:[]}],_9e={},_9f=1,l=_9b.length,i=0,j,lin,_a0,top,_a1,rec,_a2,_a3;for(;i<l;++i){_a0=_9b[i];if(!_a0){err("mixin #"+i+" is unknown. Did you use dojo.require to pull it in?");}else{if(_96.call(_a0)!="[object Function]"){err("mixin #"+i+" is not a callable constructor.");}}lin=_a0._meta?_a0._meta.bases:[_a0];top=0;for(j=lin.length-1;j>=0;--j){_a1=lin[j].prototype;if(!_a1.hasOwnProperty("declaredClass")){_a1.declaredClass="uniqName_"+(_98++);}_a2=_a1.declaredClass;if(!_9e.hasOwnProperty(_a2)){_9e[_a2]={count:0,refs:[],cls:lin[j]};++_9f;}rec=_9e[_a2];if(top&&top!==rec){rec.refs.push(top);++top.count;}top=rec;}++top.count;_9d[0].refs.push(top);}while(_9d.length){top=_9d.pop();_9c.push(top.cls);--_9f;while(_a3=top.refs,_a3.length==1){top=_a3[0];if(!top||--top.count){top=0;break;}_9c.push(top.cls);--_9f;}if(top){for(i=0,l=_a3.length;i<l;++i){top=_a3[i];if(!--top.count){_9d.push(top);}}}}if(_9f){err("can't build consistent linearization");}_a0=_9b[0];_9c[0]=_a0?_a0._meta&&_a0===_9c[_9c.length-_a0._meta.bases.length]?_a0._meta.bases.length:1:0;return _9c;};function _a4(_a5,a,f){var _a6,_a7,_a8,_a9,_aa,_ab,_ac,opf,pos,_ad=this._inherited=this._inherited||{};if(typeof _a5=="string"){_a6=_a5;_a5=a;a=f;}f=0;_a9=_a5.callee;_a6=_a6||_a9.nom;if(!_a6){err("can't deduce a name to call inherited()");}_aa=this.constructor._meta;_a8=_aa.bases;pos=_ad.p;if(_a6!=_99){if(_ad.c!==_a9){pos=0;_ab=_a8[0];_aa=_ab._meta;if(_aa.hidden[_a6]!==_a9){_a7=_aa.chains;if(_a7&&typeof _a7[_a6]=="string"){err("calling chained method with inherited: "+_a6);}do{_aa=_ab._meta;_ac=_ab.prototype;if(_aa&&(_ac[_a6]===_a9&&_ac.hasOwnProperty(_a6)||_aa.hidden[_a6]===_a9)){break;}}while(_ab=_a8[++pos]);pos=_ab?pos:-1;}}_ab=_a8[++pos];if(_ab){_ac=_ab.prototype;if(_ab._meta&&_ac.hasOwnProperty(_a6)){f=_ac[_a6];}else{opf=op[_a6];do{_ac=_ab.prototype;f=_ac[_a6];if(f&&(_ab._meta?_ac.hasOwnProperty(_a6):f!==opf)){break;}}while(_ab=_a8[++pos]);}}f=_ab&&f||op[_a6];}else{if(_ad.c!==_a9){pos=0;_aa=_a8[0]._meta;if(_aa&&_aa.ctor!==_a9){_a7=_aa.chains;if(!_a7||_a7.constructor!=="manual"){err("calling chained constructor with inherited");}while(_ab=_a8[++pos]){_aa=_ab._meta;if(_aa&&_aa.ctor===_a9){break;}}pos=_ab?pos:-1;}}while(_ab=_a8[++pos]){_aa=_ab._meta;f=_aa?_aa.ctor:_ab;if(f){break;}}f=_ab&&f;}_ad.c=f;_ad.p=pos;if(f){return a===true?f:f.apply(this,a||_a5);}};function _ae(_af,_b0){if(typeof _af=="string"){return this.inherited(_af,_b0,true);}return this.inherited(_af,true);};function _b1(cls){var _b2=this.constructor._meta.bases;for(var i=0,l=_b2.length;i<l;++i){if(_b2[i]===cls){return true;}}return this instanceof cls;};function _b3(_b4,_b5){var _b6,i=0,l=d._extraNames.length;for(_b6 in _b5){if(_b6!=_99&&_b5.hasOwnProperty(_b6)){_b4[_b6]=_b5[_b6];}}for(;i<l;++i){_b6=d._extraNames[i];if(_b6!=_99&&_b5.hasOwnProperty(_b6)){_b4[_b6]=_b5[_b6];}}};function _b7(_b8,_b9){var _ba,t,i=0,l=d._extraNames.length;for(_ba in _b9){t=_b9[_ba];if((t!==op[_ba]||!(_ba in op))&&_ba!=_99){if(_96.call(t)=="[object Function]"){t.nom=_ba;}_b8[_ba]=t;}}for(;i<l;++i){_ba=d._extraNames[i];t=_b9[_ba];if((t!==op[_ba]||!(_ba in op))&&_ba!=_99){if(_96.call(t)=="[object Function]"){t.nom=_ba;}_b8[_ba]=t;}}return _b8;};function _bb(_bc){_b7(this.prototype,_bc);return this;};function _bd(_be,_bf){return function(){var a=arguments,_c0=a,a0=a[0],f,i,m,l=_be.length,_c1;if(!(this instanceof a.callee)){return _c2(a);}if(_bf&&(a0&&a0.preamble||this.preamble)){_c1=new Array(_be.length);_c1[0]=a;for(i=0;;){a0=a[0];if(a0){f=a0.preamble;if(f){a=f.apply(this,a)||a;}}f=_be[i].prototype;f=f.hasOwnProperty("preamble")&&f.preamble;if(f){a=f.apply(this,a)||a;}if(++i==l){break;}_c1[i]=a;}}for(i=l-1;i>=0;--i){f=_be[i];m=f._meta;f=m?m.ctor:f;if(f){f.apply(this,_c1?_c1[i]:a);}}f=this.postscript;if(f){f.apply(this,_c0);}};};function _c3(_c4,_c5){return function(){var a=arguments,t=a,a0=a[0],f;if(!(this instanceof a.callee)){return _c2(a);}if(_c5){if(a0){f=a0.preamble;if(f){t=f.apply(this,t)||t;}}f=this.preamble;if(f){f.apply(this,t);}}if(_c4){_c4.apply(this,a);}f=this.postscript;if(f){f.apply(this,a);}};};function _c6(_c7){return function(){var a=arguments,i=0,f,m;if(!(this instanceof a.callee)){return _c2(a);}for(;f=_c7[i];++i){m=f._meta;f=m?m.ctor:f;if(f){f.apply(this,a);break;}}f=this.postscript;if(f){f.apply(this,a);}};};function _c8(_c9,_ca,_cb){return function(){var b,m,f,i=0,_cc=1;if(_cb){i=_ca.length-1;_cc=-1;}for(;b=_ca[i];i+=_cc){m=b._meta;f=(m?m.hidden:b.prototype)[_c9];if(f){f.apply(this,arguments);}}};};function _cd(_ce){_97.prototype=_ce.prototype;var t=new _97;_97.prototype=null;return t;};function _c2(_cf){var _d0=_cf.callee,t=_cd(_d0);_d0.apply(t,_cf);return t;};d.declare=function(_d1,_d2,_d3){if(typeof _d1!="string"){_d3=_d2;_d2=_d1;_d1="";}_d3=_d3||{};var _d4,i,t,_d5,_d6,_d7,_d8,_d9=1,_da=_d2;if(_96.call(_d2)=="[object Array]"){_d7=_9a(_d2);t=_d7[0];_d9=_d7.length-t;_d2=_d7[_d9];}else{_d7=[0];if(_d2){if(_96.call(_d2)=="[object Function]"){t=_d2._meta;_d7=_d7.concat(t?t.bases:_d2);}else{err("base class is not a callable constructor.");}}else{if(_d2!==null){err("unknown base class. Did you use dojo.require to pull it in?");}}}if(_d2){for(i=_d9-1;;--i){_d4=_cd(_d2);if(!i){break;}t=_d7[i];(t._meta?_b3:mix)(_d4,t.prototype);_d5=new Function;_d5.superclass=_d2;_d5.prototype=_d4;_d2=_d4.constructor=_d5;}}else{_d4={};}_b7(_d4,_d3);t=_d3.constructor;if(t!==op.constructor){t.nom=_99;_d4.constructor=t;}for(i=_d9-1;i;--i){t=_d7[i]._meta;if(t&&t.chains){_d8=mix(_d8||{},t.chains);}}if(_d4["-chains-"]){_d8=mix(_d8||{},_d4["-chains-"]);}t=!_d8||!_d8.hasOwnProperty(_99);_d7[0]=_d5=(_d8&&_d8.constructor==="manual")?_c6(_d7):(_d7.length==1?_c3(_d3.constructor,t):_bd(_d7,t));_d5._meta={bases:_d7,hidden:_d3,chains:_d8,parents:_da,ctor:_d3.constructor};_d5.superclass=_d2&&_d2.prototype;_d5.extend=_bb;_d5.prototype=_d4;_d4.constructor=_d5;_d4.getInherited=_ae;_d4.inherited=_a4;_d4.isInstanceOf=_b1;if(_d1){_d4.declaredClass=_d1;d.setObject(_d1,_d5);}if(_d8){for(_d6 in _d8){if(_d4[_d6]&&typeof _d8[_d6]=="string"&&_d6!=_99){t=_d4[_d6]=_c8(_d6,_d7,_d8[_d6]==="after");t.nom=_d6;}}}return _d5;};d.safeMixin=_b7;})();}if(!dojo._hasResource["dojo._base.connect"]){dojo._hasResource["dojo._base.connect"]=true;dojo.provide("dojo._base.connect");dojo._listener={getDispatcher:function(){return function(){var ap=Array.prototype,c=arguments.callee,ls=c._listeners,t=c.target;var r=t&&t.apply(this,arguments);var i,lls;lls=[].concat(ls);for(i in lls){if(!(i in ap)){lls[i].apply(this,arguments);}}return r;};},add:function(_db,_dc,_dd){_db=_db||dojo.global;var f=_db[_dc];if(!f||!f._listeners){var d=dojo._listener.getDispatcher();d.target=f;d._listeners=[];f=_db[_dc]=d;}return f._listeners.push(_dd);},remove:function(_de,_df,_e0){var f=(_de||dojo.global)[_df];if(f&&f._listeners&&_e0--){delete f._listeners[_e0];}}};dojo.connect=function(obj,_e1,_e2,_e3,_e4){var a=arguments,_e5=[],i=0;_e5.push(dojo.isString(a[0])?null:a[i++],a[i++]);var a1=a[i+1];_e5.push(dojo.isString(a1)||dojo.isFunction(a1)?a[i++]:null,a[i++]);for(var l=a.length;i<l;i++){_e5.push(a[i]);}return dojo._connect.apply(this,_e5);};dojo._connect=function(obj,_e6,_e7,_e8){var l=dojo._listener,h=l.add(obj,_e6,dojo.hitch(_e7,_e8));return [obj,_e6,h,l];};dojo.disconnect=function(_e9){if(_e9&&_e9[0]!==undefined){dojo._disconnect.apply(this,_e9);delete _e9[0];}};dojo._disconnect=function(obj,_ea,_eb,_ec){_ec.remove(obj,_ea,_eb);};dojo._topics={};dojo.subscribe=function(_ed,_ee,_ef){return [_ed,dojo._listener.add(dojo._topics,_ed,dojo.hitch(_ee,_ef))];};dojo.unsubscribe=function(_f0){if(_f0){dojo._listener.remove(dojo._topics,_f0[0],_f0[1]);}};dojo.publish=function(_f1,_f2){var f=dojo._topics[_f1];if(f){f.apply(this,_f2||[]);}};dojo.connectPublisher=function(_f3,obj,_f4){var pf=function(){dojo.publish(_f3,arguments);};return _f4?dojo.connect(obj,_f4,pf):dojo.connect(obj,pf);};}if(!dojo._hasResource["dojo._base.Deferred"]){dojo._hasResource["dojo._base.Deferred"]=true;dojo.provide("dojo._base.Deferred");(function(){var _f5=function(){};var _f6=Object.freeze||function(){};dojo.Deferred=function(_f7){var _f8,_f9,_fa,_fb,_fc;var _fd=this.promise={};function _fe(_ff){if(_f9){throw new Error("This deferred has already been resolved");}_f8=_ff;_f9=true;_100();};function _100(){var _101;while(!_101&&_fc){var _102=_fc;_fc=_fc.next;if(_101=(_102.progress==_f5)){_f9=false;}var func=(_fa?_102.error:_102.resolved);if(func){try{var _103=func(_f8);if(_103&&typeof _103.then==="function"){_103.then(dojo.hitch(_102.deferred,"resolve"),dojo.hitch(_102.deferred,"reject"));continue;}var _104=_101&&_103===undefined;_102.deferred[_104&&_fa?"reject":"resolve"](_104?_f8:_103);}catch(e){_102.deferred.reject(e);}}else{if(_fa){_102.deferred.reject(_f8);}else{_102.deferred.resolve(_f8);}}}};this.resolve=this.callback=function(_105){this.fired=0;this.results=[_105,null];_fe(_105);};this.reject=this.errback=function(_106){_fa=true;this.fired=1;_fe(_106);this.results=[null,_106];if(!_106||_106.log!==false){(dojo.config.deferredOnError||function(x){console.error(x);})(_106);}};this.progress=function(_107){var _108=_fc;while(_108){var _109=_108.progress;_109&&_109(_107);_108=_108.next;}};this.addCallbacks=function(_10a,_10b){this.then(_10a,_10b,_f5);return this;};this.then=_fd.then=function(_10c,_10d,_10e){var _10f=_10e==_f5?this:new dojo.Deferred(_fd.cancel);var _110={resolved:_10c,error:_10d,progress:_10e,deferred:_10f};if(_fc){_fb=_fb.next=_110;}else{_fc=_fb=_110;}if(_f9){_100();}return _10f.promise;};var _111=this;this.cancel=_fd.cancel=function(){if(!_f9){var _112=_f7&&_f7(_111);if(!_f9){if(!(_112 instanceof Error)){_112=new Error(_112);}_112.log=false;_111.reject(_112);}}};_f6(_fd);};dojo.extend(dojo.Deferred,{addCallback:function(_113){return this.addCallbacks(dojo.hitch.apply(dojo,arguments));},addErrback:function(_114){return this.addCallbacks(null,dojo.hitch.apply(dojo,arguments));},addBoth:function(_115){var _116=dojo.hitch.apply(dojo,arguments);return this.addCallbacks(_116,_116);},fired:-1});})();dojo.when=function(_117,_118,_119,_11a){if(_117&&typeof _117.then==="function"){return _117.then(_118,_119,_11a);}return _118(_117);};}if(!dojo._hasResource["dojo._base.json"]){dojo._hasResource["dojo._base.json"]=true;dojo.provide("dojo._base.json");dojo.fromJson=function(json){return eval("("+json+")");};dojo._escapeString=function(str){return ("\""+str.replace(/(["\\])/g,"\\$1")+"\"").replace(/[\f]/g,"\\f").replace(/[\b]/g,"\\b").replace(/[\n]/g,"\\n").replace(/[\t]/g,"\\t").replace(/[\r]/g,"\\r");};dojo.toJsonIndentStr="\t";dojo.toJson=function(it,_11b,_11c){if(it===undefined){return "undefined";}var _11d=typeof it;if(_11d=="number"||_11d=="boolean"){return it+"";}if(it===null){return "null";}if(dojo.isString(it)){return dojo._escapeString(it);}var _11e=arguments.callee;var _11f;_11c=_11c||"";var _120=_11b?_11c+dojo.toJsonIndentStr:"";var tf=it.__json__||it.json;if(dojo.isFunction(tf)){_11f=tf.call(it);if(it!==_11f){return _11e(_11f,_11b,_120);}}if(it.nodeType&&it.cloneNode){throw new Error("Can't serialize DOM nodes");}var sep=_11b?" ":"";var _121=_11b?"\n":"";if(dojo.isArray(it)){var res=dojo.map(it,function(obj){var val=_11e(obj,_11b,_120);if(typeof val!="string"){val="undefined";}return _121+_120+val;});return "["+res.join(","+sep)+_121+_11c+"]";}if(_11d=="function"){return null;}var _122=[],key;for(key in it){var _123,val;if(typeof key=="number"){_123="\""+key+"\"";}else{if(typeof key=="string"){_123=dojo._escapeString(key);}else{continue;}}val=_11e(it[key],_11b,_120);if(typeof val!="string"){continue;}_122.push(_121+_120+_123+":"+sep+val);}return "{"+_122.join(","+sep)+_121+_11c+"}";};}if(!dojo._hasResource["dojo._base.Color"]){dojo._hasResource["dojo._base.Color"]=true;dojo.provide("dojo._base.Color");(function(){var d=dojo;dojo.Color=function(_124){if(_124){this.setColor(_124);}};dojo.Color.named={black:[0,0,0],silver:[192,192,192],gray:[128,128,128],white:[255,255,255],maroon:[128,0,0],red:[255,0,0],purple:[128,0,128],fuchsia:[255,0,255],green:[0,128,0],lime:[0,255,0],olive:[128,128,0],yellow:[255,255,0],navy:[0,0,128],blue:[0,0,255],teal:[0,128,128],aqua:[0,255,255],transparent:d.config.transparentColor||[255,255,255]};dojo.extend(dojo.Color,{r:255,g:255,b:255,a:1,_set:function(r,g,b,a){var t=this;t.r=r;t.g=g;t.b=b;t.a=a;},setColor:function(_125){if(d.isString(_125)){d.colorFromString(_125,this);}else{if(d.isArray(_125)){d.colorFromArray(_125,this);}else{this._set(_125.r,_125.g,_125.b,_125.a);if(!(_125 instanceof d.Color)){this.sanitize();}}}return this;},sanitize:function(){return this;},toRgb:function(){var t=this;return [t.r,t.g,t.b];},toRgba:function(){var t=this;return [t.r,t.g,t.b,t.a];},toHex:function(){var arr=d.map(["r","g","b"],function(x){var s=this[x].toString(16);return s.length<2?"0"+s:s;},this);return "#"+arr.join("");},toCss:function(_126){var t=this,rgb=t.r+", "+t.g+", "+t.b;return (_126?"rgba("+rgb+", "+t.a:"rgb("+rgb)+")";},toString:function(){return this.toCss(true);}});dojo.blendColors=function(_127,end,_128,obj){var t=obj||new d.Color();d.forEach(["r","g","b","a"],function(x){t[x]=_127[x]+(end[x]-_127[x])*_128;if(x!="a"){t[x]=Math.round(t[x]);}});return t.sanitize();};dojo.colorFromRgb=function(_129,obj){var m=_129.toLowerCase().match(/^rgba?\(([\s\.,0-9]+)\)/);return m&&dojo.colorFromArray(m[1].split(/\s*,\s*/),obj);};dojo.colorFromHex=function(_12a,obj){var t=obj||new d.Color(),bits=(_12a.length==4)?4:8,mask=(1<<bits)-1;_12a=Number("0x"+_12a.substr(1));if(isNaN(_12a)){return null;}d.forEach(["b","g","r"],function(x){var c=_12a&mask;_12a>>=bits;t[x]=bits==4?17*c:c;});t.a=1;return t;};dojo.colorFromArray=function(a,obj){var t=obj||new d.Color();t._set(Number(a[0]),Number(a[1]),Number(a[2]),Number(a[3]));if(isNaN(t.a)){t.a=1;}return t.sanitize();};dojo.colorFromString=function(str,obj){var a=d.Color.named[str];return a&&d.colorFromArray(a,obj)||d.colorFromRgb(str,obj)||d.colorFromHex(str,obj);};})();}if(!dojo._hasResource["dojo._base"]){dojo._hasResource["dojo._base"]=true;dojo.provide("dojo._base");}if(!dojo._hasResource["dojo._base.window"]){dojo._hasResource["dojo._base.window"]=true;dojo.provide("dojo._base.window");dojo.doc=window["document"]||null;dojo.body=function(){return dojo.doc.body||dojo.doc.getElementsByTagName("body")[0];};dojo.setContext=function(_12b,_12c){dojo.global=_12b;dojo.doc=_12c;};dojo.withGlobal=function(_12d,_12e,_12f,_130){var _131=dojo.global;try{dojo.global=_12d;return dojo.withDoc.call(null,_12d.document,_12e,_12f,_130);}finally{dojo.global=_131;}};dojo.withDoc=function(_132,_133,_134,_135){var _136=dojo.doc,_137=dojo._bodyLtr,oldQ=dojo.isQuirks;try{dojo.doc=_132;delete dojo._bodyLtr;dojo.isQuirks=dojo.doc.compatMode=="BackCompat";if(_134&&typeof _133=="string"){_133=_134[_133];}return _133.apply(_134,_135||[]);}finally{dojo.doc=_136;delete dojo._bodyLtr;if(_137!==undefined){dojo._bodyLtr=_137;}dojo.isQuirks=oldQ;}};}if(!dojo._hasResource["dojo._base.event"]){dojo._hasResource["dojo._base.event"]=true;dojo.provide("dojo._base.event");(function(){var del=(dojo._event_listener={add:function(node,name,fp){if(!node){return;}name=del._normalizeEventName(name);fp=del._fixCallback(name,fp);var _138=name;if(!dojo.isIE&&(name=="mouseenter"||name=="mouseleave")){var ofp=fp;name=(name=="mouseenter")?"mouseover":"mouseout";fp=function(e){if(!dojo.isDescendant(e.relatedTarget,node)){return ofp.call(this,e);}};}node.addEventListener(name,fp,false);return fp;},remove:function(node,_139,_13a){if(node){_139=del._normalizeEventName(_139);if(!dojo.isIE&&(_139=="mouseenter"||_139=="mouseleave")){_139=(_139=="mouseenter")?"mouseover":"mouseout";}node.removeEventListener(_139,_13a,false);}},_normalizeEventName:function(name){return name.slice(0,2)=="on"?name.slice(2):name;},_fixCallback:function(name,fp){return name!="keypress"?fp:function(e){return fp.call(this,del._fixEvent(e,this));};},_fixEvent:function(evt,_13b){switch(evt.type){case "keypress":del._setKeyChar(evt);break;}return evt;},_setKeyChar:function(evt){evt.keyChar=evt.charCode?String.fromCharCode(evt.charCode):"";evt.charOrCode=evt.keyChar||evt.keyCode;},_punctMap:{106:42,111:47,186:59,187:43,188:44,189:45,190:46,191:47,192:96,219:91,220:92,221:93,222:39}});dojo.fixEvent=function(evt,_13c){return del._fixEvent(evt,_13c);};dojo.stopEvent=function(evt){evt.preventDefault();evt.stopPropagation();};var _13d=dojo._listener;dojo._connect=function(obj,_13e,_13f,_140,_141){var _142=obj&&(obj.nodeType||obj.attachEvent||obj.addEventListener);var lid=_142?(_141?2:1):0,l=[dojo._listener,del,_13d][lid];var h=l.add(obj,_13e,dojo.hitch(_13f,_140));return [obj,_13e,h,lid];};dojo._disconnect=function(obj,_143,_144,_145){([dojo._listener,del,_13d][_145]).remove(obj,_143,_144);};dojo.keys={BACKSPACE:8,TAB:9,CLEAR:12,ENTER:13,SHIFT:16,CTRL:17,ALT:18,META:dojo.isSafari?91:224,PAUSE:19,CAPS_LOCK:20,ESCAPE:27,SPACE:32,PAGE_UP:33,PAGE_DOWN:34,END:35,HOME:36,LEFT_ARROW:37,UP_ARROW:38,RIGHT_ARROW:39,DOWN_ARROW:40,INSERT:45,DELETE:46,HELP:47,LEFT_WINDOW:91,RIGHT_WINDOW:92,SELECT:93,NUMPAD_0:96,NUMPAD_1:97,NUMPAD_2:98,NUMPAD_3:99,NUMPAD_4:100,NUMPAD_5:101,NUMPAD_6:102,NUMPAD_7:103,NUMPAD_8:104,NUMPAD_9:105,NUMPAD_MULTIPLY:106,NUMPAD_PLUS:107,NUMPAD_ENTER:108,NUMPAD_MINUS:109,NUMPAD_PERIOD:110,NUMPAD_DIVIDE:111,F1:112,F2:113,F3:114,F4:115,F5:116,F6:117,F7:118,F8:119,F9:120,F10:121,F11:122,F12:123,F13:124,F14:125,F15:126,NUM_LOCK:144,SCROLL_LOCK:145,copyKey:dojo.isMac&&!dojo.isAIR?(dojo.isSafari?91:224):17};var _146=dojo.isMac?"metaKey":"ctrlKey";dojo.isCopyKey=function(e){return e[_146];};if(dojo.isIE){dojo.mouseButtons={LEFT:1,MIDDLE:4,RIGHT:2,isButton:function(e,_147){return e.button&_147;},isLeft:function(e){return e.button&1;},isMiddle:function(e){return e.button&4;},isRight:function(e){return e.button&2;}};}else{dojo.mouseButtons={LEFT:0,MIDDLE:1,RIGHT:2,isButton:function(e,_148){return e.button==_148;},isLeft:function(e){return e.button==0;},isMiddle:function(e){return e.button==1;},isRight:function(e){return e.button==2;}};}if(dojo.isIE){var _149=function(e,code){try{return (e.keyCode=code);}catch(e){return 0;}};var iel=dojo._listener;var _14a=(dojo._ieListenersName="_"+dojo._scopeName+"_listeners");if(!dojo.config._allow_leaks){_13d=iel=dojo._ie_listener={handlers:[],add:function(_14b,_14c,_14d){_14b=_14b||dojo.global;var f=_14b[_14c];if(!f||!f[_14a]){var d=dojo._getIeDispatcher();d.target=f&&(ieh.push(f)-1);d[_14a]=[];f=_14b[_14c]=d;}return f[_14a].push(ieh.push(_14d)-1);},remove:function(_14e,_14f,_150){var f=(_14e||dojo.global)[_14f],l=f&&f[_14a];if(f&&l&&_150--){delete ieh[l[_150]];delete l[_150];}}};var ieh=iel.handlers;}dojo.mixin(del,{add:function(node,_151,fp){if(!node){return;}_151=del._normalizeEventName(_151);if(_151=="onkeypress"){var kd=node.onkeydown;if(!kd||!kd[_14a]||!kd._stealthKeydownHandle){var h=del.add(node,"onkeydown",del._stealthKeyDown);kd=node.onkeydown;kd._stealthKeydownHandle=h;kd._stealthKeydownRefs=1;}else{kd._stealthKeydownRefs++;}}return iel.add(node,_151,del._fixCallback(fp));},remove:function(node,_152,_153){_152=del._normalizeEventName(_152);iel.remove(node,_152,_153);if(_152=="onkeypress"){var kd=node.onkeydown;if(--kd._stealthKeydownRefs<=0){iel.remove(node,"onkeydown",kd._stealthKeydownHandle);delete kd._stealthKeydownHandle;}}},_normalizeEventName:function(_154){return _154.slice(0,2)!="on"?"on"+_154:_154;},_nop:function(){},_fixEvent:function(evt,_155){if(!evt){var w=_155&&(_155.ownerDocument||_155.document||_155).parentWindow||window;evt=w.event;}if(!evt){return (evt);}evt.target=evt.srcElement;evt.currentTarget=(_155||evt.srcElement);evt.layerX=evt.offsetX;evt.layerY=evt.offsetY;var se=evt.srcElement,doc=(se&&se.ownerDocument)||document;var _156=((dojo.isIE<6)||(doc["compatMode"]=="BackCompat"))?doc.body:doc.documentElement;var _157=dojo._getIeDocumentElementOffset();evt.pageX=evt.clientX+dojo._fixIeBiDiScrollLeft(_156.scrollLeft||0)-_157.x;evt.pageY=evt.clientY+(_156.scrollTop||0)-_157.y;if(evt.type=="mouseover"){evt.relatedTarget=evt.fromElement;}if(evt.type=="mouseout"){evt.relatedTarget=evt.toElement;}evt.stopPropagation=del._stopPropagation;evt.preventDefault=del._preventDefault;return del._fixKeys(evt);},_fixKeys:function(evt){switch(evt.type){case "keypress":var c=("charCode" in evt?evt.charCode:evt.keyCode);if(c==10){c=0;evt.keyCode=13;}else{if(c==13||c==27){c=0;}else{if(c==3){c=99;}}}evt.charCode=c;del._setKeyChar(evt);break;}return evt;},_stealthKeyDown:function(evt){var kp=evt.currentTarget.onkeypress;if(!kp||!kp[_14a]){return;}var k=evt.keyCode;var _158=k!=13&&k!=32&&k!=27&&(k<48||k>90)&&(k<96||k>111)&&(k<186||k>192)&&(k<219||k>222);if(_158||evt.ctrlKey){var c=_158?0:k;if(evt.ctrlKey){if(k==3||k==13){return;}else{if(c>95&&c<106){c-=48;}else{if((!evt.shiftKey)&&(c>=65&&c<=90)){c+=32;}else{c=del._punctMap[c]||c;}}}}var faux=del._synthesizeEvent(evt,{type:"keypress",faux:true,charCode:c});kp.call(evt.currentTarget,faux);evt.cancelBubble=faux.cancelBubble;evt.returnValue=faux.returnValue;_149(evt,faux.keyCode);}},_stopPropagation:function(){this.cancelBubble=true;},_preventDefault:function(){this.bubbledKeyCode=this.keyCode;if(this.ctrlKey){_149(this,0);}this.returnValue=false;}});dojo.stopEvent=function(evt){evt=evt||window.event;del._stopPropagation.call(evt);del._preventDefault.call(evt);};}del._synthesizeEvent=function(evt,_159){var faux=dojo.mixin({},evt,_159);del._setKeyChar(faux);faux.preventDefault=function(){evt.preventDefault();};faux.stopPropagation=function(){evt.stopPropagation();};return faux;};if(dojo.isOpera){dojo.mixin(del,{_fixEvent:function(evt,_15a){switch(evt.type){case "keypress":var c=evt.which;if(c==3){c=99;}c=c<41&&!evt.shiftKey?0:c;if(evt.ctrlKey&&!evt.shiftKey&&c>=65&&c<=90){c+=32;}return del._synthesizeEvent(evt,{charCode:c});}return evt;}});}if(dojo.isWebKit){del._add=del.add;del._remove=del.remove;dojo.mixin(del,{add:function(node,_15b,fp){if(!node){return;}var _15c=del._add(node,_15b,fp);if(del._normalizeEventName(_15b)=="keypress"){_15c._stealthKeyDownHandle=del._add(node,"keydown",function(evt){var k=evt.keyCode;var _15d=k!=13&&k!=32&&(k<48||k>90)&&(k<96||k>111)&&(k<186||k>192)&&(k<219||k>222);if(_15d||evt.ctrlKey){var c=_15d?0:k;if(evt.ctrlKey){if(k==3||k==13){return;}else{if(c>95&&c<106){c-=48;}else{if(!evt.shiftKey&&c>=65&&c<=90){c+=32;}else{c=del._punctMap[c]||c;}}}}var faux=del._synthesizeEvent(evt,{type:"keypress",faux:true,charCode:c});fp.call(evt.currentTarget,faux);}});}return _15c;},remove:function(node,_15e,_15f){if(node){if(_15f._stealthKeyDownHandle){del._remove(node,"keydown",_15f._stealthKeyDownHandle);}del._remove(node,_15e,_15f);}},_fixEvent:function(evt,_160){switch(evt.type){case "keypress":if(evt.faux){return evt;}var c=evt.charCode;c=c>=32?c:0;return del._synthesizeEvent(evt,{charCode:c,faux:true});}return evt;}});}})();if(dojo.isIE){dojo._ieDispatcher=function(args,_161){var ap=Array.prototype,h=dojo._ie_listener.handlers,c=args.callee,ls=c[dojo._ieListenersName],t=h[c.target];var r=t&&t.apply(_161,args);var lls=[].concat(ls);for(var i in lls){var f=h[lls[i]];if(!(i in ap)&&f){f.apply(_161,args);}}return r;};dojo._getIeDispatcher=function(){return new Function(dojo._scopeName+"._ieDispatcher(arguments, this)");};dojo._event_listener._fixCallback=function(fp){var f=dojo._event_listener._fixEvent;return function(e){return fp.call(this,f(e,this));};};}}if(!dojo._hasResource["dojo._base.html"]){dojo._hasResource["dojo._base.html"]=true;dojo.provide("dojo._base.html");try{document.execCommand("BackgroundImageCache",false,true);}catch(e){}if(dojo.isIE||dojo.isOpera){dojo.byId=function(id,doc){if(typeof id!="string"){return id;}var _162=doc||dojo.doc,te=_162.getElementById(id);if(te&&(te.attributes.id.value==id||te.id==id)){return te;}else{var eles=_162.all[id];if(!eles||eles.nodeName){eles=[eles];}var i=0;while((te=eles[i++])){if((te.attributes&&te.attributes.id&&te.attributes.id.value==id)||te.id==id){return te;}}}};}else{dojo.byId=function(id,doc){return (typeof id=="string")?(doc||dojo.doc).getElementById(id):id;};}(function(){var d=dojo;var byId=d.byId;var _163=null,_164;d.addOnWindowUnload(function(){_163=null;});dojo._destroyElement=dojo.destroy=function(node){node=byId(node);try{var doc=node.ownerDocument;if(!_163||_164!=doc){_163=doc.createElement("div");_164=doc;}_163.appendChild(node.parentNode?node.parentNode.removeChild(node):node);_163.innerHTML="";}catch(e){}};dojo.isDescendant=function(node,_165){try{node=byId(node);_165=byId(_165);while(node){if(node==_165){return true;}node=node.parentNode;}}catch(e){}return false;};dojo.setSelectable=function(node,_166){node=byId(node);if(d.isMozilla){node.style.MozUserSelect=_166?"":"none";}else{if(d.isKhtml||d.isWebKit){node.style.KhtmlUserSelect=_166?"auto":"none";}else{if(d.isIE){var v=(node.unselectable=_166?"":"on");d.query("*",node).forEach("item.unselectable = '"+v+"'");}}}};var _167=function(node,ref){var _168=ref.parentNode;if(_168){_168.insertBefore(node,ref);}};var _169=function(node,ref){var _16a=ref.parentNode;if(_16a){if(_16a.lastChild==ref){_16a.appendChild(node);}else{_16a.insertBefore(node,ref.nextSibling);}}};dojo.place=function(node,_16b,_16c){_16b=byId(_16b);if(typeof node=="string"){node=node.charAt(0)=="<"?d._toDom(node,_16b.ownerDocument):byId(node);}if(typeof _16c=="number"){var cn=_16b.childNodes;if(!cn.length||cn.length<=_16c){_16b.appendChild(node);}else{_167(node,cn[_16c<0?0:_16c]);}}else{switch(_16c){case "before":_167(node,_16b);break;case "after":_169(node,_16b);break;case "replace":_16b.parentNode.replaceChild(node,_16b);break;case "only":d.empty(_16b);_16b.appendChild(node);break;case "first":if(_16b.firstChild){_167(node,_16b.firstChild);break;}default:_16b.appendChild(node);}}return node;};dojo.boxModel="content-box";if(d.isIE){d.boxModel=document.compatMode=="BackCompat"?"border-box":"content-box";}var gcs;if(d.isWebKit){gcs=function(node){var s;if(node.nodeType==1){var dv=node.ownerDocument.defaultView;s=dv.getComputedStyle(node,null);if(!s&&node.style){node.style.display="";s=dv.getComputedStyle(node,null);}}return s||{};};}else{if(d.isIE){gcs=function(node){return node.nodeType==1?node.currentStyle:{};};}else{gcs=function(node){return node.nodeType==1?node.ownerDocument.defaultView.getComputedStyle(node,null):{};};}}dojo.getComputedStyle=gcs;if(!d.isIE){d._toPixelValue=function(_16d,_16e){return parseFloat(_16e)||0;};}else{d._toPixelValue=function(_16f,_170){if(!_170){return 0;}if(_170=="medium"){return 4;}if(_170.slice&&_170.slice(-2)=="px"){return parseFloat(_170);}with(_16f){var _171=style.left;var _172=runtimeStyle.left;runtimeStyle.left=currentStyle.left;try{style.left=_170;_170=style.pixelLeft;}catch(e){_170=0;}style.left=_171;runtimeStyle.left=_172;}return _170;};}var px=d._toPixelValue;var astr="DXImageTransform.Microsoft.Alpha";var af=function(n,f){try{return n.filters.item(astr);}catch(e){return f?{}:null;}};dojo._getOpacity=d.isIE?function(node){try{return af(node).Opacity/100;}catch(e){return 1;}}:function(node){return gcs(node).opacity;};dojo._setOpacity=d.isIE?function(node,_173){var ov=_173*100,_174=_173==1;node.style.zoom=_174?"":1;if(!af(node)){if(_174){return _173;}node.style.filter+=" progid:"+astr+"(Opacity="+ov+")";}else{af(node,1).Opacity=ov;}af(node,1).Enabled=!_174;if(node.nodeName.toLowerCase()=="tr"){d.query("> td",node).forEach(function(i){d._setOpacity(i,_173);});}return _173;}:function(node,_175){return node.style.opacity=_175;};var _176={left:true,top:true};var _177=/margin|padding|width|height|max|min|offset/;var _178=function(node,type,_179){type=type.toLowerCase();if(d.isIE){if(_179=="auto"){if(type=="height"){return node.offsetHeight;}if(type=="width"){return node.offsetWidth;}}if(type=="fontweight"){switch(_179){case 700:return "bold";case 400:default:return "normal";}}}if(!(type in _176)){_176[type]=_177.test(type);}return _176[type]?px(node,_179):_179;};var _17a=d.isIE?"styleFloat":"cssFloat",_17b={"cssFloat":_17a,"styleFloat":_17a,"float":_17a};dojo.style=function(node,_17c,_17d){var n=byId(node),args=arguments.length,op=(_17c=="opacity");_17c=_17b[_17c]||_17c;if(args==3){return op?d._setOpacity(n,_17d):n.style[_17c]=_17d;}if(args==2&&op){return d._getOpacity(n);}var s=gcs(n);if(args==2&&typeof _17c!="string"){for(var x in _17c){d.style(node,x,_17c[x]);}return s;}return (args==1)?s:_178(n,_17c,s[_17c]||n.style[_17c]);};dojo._getPadExtents=function(n,_17e){var s=_17e||gcs(n),l=px(n,s.paddingLeft),t=px(n,s.paddingTop);return {l:l,t:t,w:l+px(n,s.paddingRight),h:t+px(n,s.paddingBottom)};};dojo._getBorderExtents=function(n,_17f){var ne="none",s=_17f||gcs(n),bl=(s.borderLeftStyle!=ne?px(n,s.borderLeftWidth):0),bt=(s.borderTopStyle!=ne?px(n,s.borderTopWidth):0);return {l:bl,t:bt,w:bl+(s.borderRightStyle!=ne?px(n,s.borderRightWidth):0),h:bt+(s.borderBottomStyle!=ne?px(n,s.borderBottomWidth):0)};};dojo._getPadBorderExtents=function(n,_180){var s=_180||gcs(n),p=d._getPadExtents(n,s),b=d._getBorderExtents(n,s);return {l:p.l+b.l,t:p.t+b.t,w:p.w+b.w,h:p.h+b.h};};dojo._getMarginExtents=function(n,_181){var s=_181||gcs(n),l=px(n,s.marginLeft),t=px(n,s.marginTop),r=px(n,s.marginRight),b=px(n,s.marginBottom);if(d.isWebKit&&(s.position!="absolute")){r=l;}return {l:l,t:t,w:l+r,h:t+b};};dojo._getMarginBox=function(node,_182){var s=_182||gcs(node),me=d._getMarginExtents(node,s);var l=node.offsetLeft-me.l,t=node.offsetTop-me.t,p=node.parentNode;if(d.isMoz){var sl=parseFloat(s.left),st=parseFloat(s.top);if(!isNaN(sl)&&!isNaN(st)){l=sl,t=st;}else{if(p&&p.style){var pcs=gcs(p);if(pcs.overflow!="visible"){var be=d._getBorderExtents(p,pcs);l+=be.l,t+=be.t;}}}}else{if(d.isOpera||(d.isIE>7&&!d.isQuirks)){if(p){be=d._getBorderExtents(p);l-=be.l;t-=be.t;}}}return {l:l,t:t,w:node.offsetWidth+me.w,h:node.offsetHeight+me.h};};dojo._getContentBox=function(node,_183){var s=_183||gcs(node),pe=d._getPadExtents(node,s),be=d._getBorderExtents(node,s),w=node.clientWidth,h;if(!w){w=node.offsetWidth,h=node.offsetHeight;}else{h=node.clientHeight,be.w=be.h=0;}if(d.isOpera){pe.l+=be.l;pe.t+=be.t;}return {l:pe.l,t:pe.t,w:w-pe.w-be.w,h:h-pe.h-be.h};};dojo._getBorderBox=function(node,_184){var s=_184||gcs(node),pe=d._getPadExtents(node,s),cb=d._getContentBox(node,s);return {l:cb.l-pe.l,t:cb.t-pe.t,w:cb.w+pe.w,h:cb.h+pe.h};};dojo._setBox=function(node,l,t,w,h,u){u=u||"px";var s=node.style;if(!isNaN(l)){s.left=l+u;}if(!isNaN(t)){s.top=t+u;}if(w>=0){s.width=w+u;}if(h>=0){s.height=h+u;}};dojo._isButtonTag=function(node){return node.tagName=="BUTTON"||node.tagName=="INPUT"&&(node.getAttribute("type")||"").toUpperCase()=="BUTTON";};dojo._usesBorderBox=function(node){var n=node.tagName;return d.boxModel=="border-box"||n=="TABLE"||d._isButtonTag(node);};dojo._setContentSize=function(node,_185,_186,_187){if(d._usesBorderBox(node)){var pb=d._getPadBorderExtents(node,_187);if(_185>=0){_185+=pb.w;}if(_186>=0){_186+=pb.h;}}d._setBox(node,NaN,NaN,_185,_186);};dojo._setMarginBox=function(node,_188,_189,_18a,_18b,_18c){var s=_18c||gcs(node),bb=d._usesBorderBox(node),pb=bb?_18d:d._getPadBorderExtents(node,s);if(d.isWebKit){if(d._isButtonTag(node)){var ns=node.style;if(_18a>=0&&!ns.width){ns.width="4px";}if(_18b>=0&&!ns.height){ns.height="4px";}}}var mb=d._getMarginExtents(node,s);if(_18a>=0){_18a=Math.max(_18a-pb.w-mb.w,0);}if(_18b>=0){_18b=Math.max(_18b-pb.h-mb.h,0);}d._setBox(node,_188,_189,_18a,_18b);};var _18d={l:0,t:0,w:0,h:0};dojo.marginBox=function(node,box){var n=byId(node),s=gcs(n),b=box;return !b?d._getMarginBox(n,s):d._setMarginBox(n,b.l,b.t,b.w,b.h,s);};dojo.contentBox=function(node,box){var n=byId(node),s=gcs(n),b=box;return !b?d._getContentBox(n,s):d._setContentSize(n,b.w,b.h,s);};var _18e=function(node,prop){if(!(node=(node||0).parentNode)){return 0;}var val,_18f=0,_190=d.body();while(node&&node.style){if(gcs(node).position=="fixed"){return 0;}val=node[prop];if(val){_18f+=val-0;if(node==_190){break;}}node=node.parentNode;}return _18f;};dojo._docScroll=function(){var n=d.global;return "pageXOffset" in n?{x:n.pageXOffset,y:n.pageYOffset}:(n=d.doc.documentElement,n.clientHeight?{x:d._fixIeBiDiScrollLeft(n.scrollLeft),y:n.scrollTop}:(n=d.body(),{x:n.scrollLeft||0,y:n.scrollTop||0}));};dojo._isBodyLtr=function(){return "_bodyLtr" in d?d._bodyLtr:d._bodyLtr=(d.body().dir||d.doc.documentElement.dir||"ltr").toLowerCase()=="ltr";};dojo._getIeDocumentElementOffset=function(){var de=d.doc.documentElement;if(d.isIE<8){var r=de.getBoundingClientRect();var l=r.left,t=r.top;if(d.isIE<7){l+=de.clientLeft;t+=de.clientTop;}return {x:l<0?0:l,y:t<0?0:t};}else{return {x:0,y:0};}};dojo._fixIeBiDiScrollLeft=function(_191){var dd=d.doc;if(d.isIE<8&&!d._isBodyLtr()){var de=d.isQuirks?dd.body:dd.documentElement;return _191+de.clientWidth-de.scrollWidth;}return _191;};dojo._abs=dojo.position=function(node,_192){var db=d.body(),dh=db.parentNode,ret;node=byId(node);if(node["getBoundingClientRect"]){ret=node.getBoundingClientRect();ret={x:ret.left,y:ret.top,w:ret.right-ret.left,h:ret.bottom-ret.top};if(d.isIE){var _193=d._getIeDocumentElementOffset();ret.x-=_193.x+(d.isQuirks?db.clientLeft+db.offsetLeft:0);ret.y-=_193.y+(d.isQuirks?db.clientTop+db.offsetTop:0);}else{if(d.isFF==3){var cs=gcs(dh);ret.x-=px(dh,cs.marginLeft)+px(dh,cs.borderLeftWidth);ret.y-=px(dh,cs.marginTop)+px(dh,cs.borderTopWidth);}}}else{ret={x:0,y:0,w:node.offsetWidth,h:node.offsetHeight};if(node["offsetParent"]){ret.x-=_18e(node,"scrollLeft");ret.y-=_18e(node,"scrollTop");var _194=node;do{var n=_194.offsetLeft,t=_194.offsetTop;ret.x+=isNaN(n)?0:n;ret.y+=isNaN(t)?0:t;cs=gcs(_194);if(_194!=node){if(d.isMoz){ret.x+=2*px(_194,cs.borderLeftWidth);ret.y+=2*px(_194,cs.borderTopWidth);}else{ret.x+=px(_194,cs.borderLeftWidth);ret.y+=px(_194,cs.borderTopWidth);}}if(d.isMoz&&cs.position=="static"){var _195=_194.parentNode;while(_195!=_194.offsetParent){var pcs=gcs(_195);if(pcs.position=="static"){ret.x+=px(_194,pcs.borderLeftWidth);ret.y+=px(_194,pcs.borderTopWidth);}_195=_195.parentNode;}}_194=_194.offsetParent;}while((_194!=dh)&&_194);}else{if(node.x&&node.y){ret.x+=isNaN(node.x)?0:node.x;ret.y+=isNaN(node.y)?0:node.y;}}}if(_192){var _196=d._docScroll();ret.x+=_196.x;ret.y+=_196.y;}return ret;};dojo.coords=function(node,_197){var n=byId(node),s=gcs(n),mb=d._getMarginBox(n,s);var abs=d.position(n,_197);mb.x=abs.x;mb.y=abs.y;return mb;};var _198={"class":"className","for":"htmlFor",tabindex:"tabIndex",readonly:"readOnly",colspan:"colSpan",frameborder:"frameBorder",rowspan:"rowSpan",valuetype:"valueType"},_199={classname:"class",htmlfor:"for",tabindex:"tabIndex",readonly:"readOnly"},_19a={innerHTML:1,className:1,htmlFor:d.isIE,value:1};var _19b=function(name){return _199[name.toLowerCase()]||name;};var _19c=function(node,name){var attr=node.getAttributeNode&&node.getAttributeNode(name);return attr&&attr.specified;};dojo.hasAttr=function(node,name){var lc=name.toLowerCase();return _19a[_198[lc]||name]||_19c(byId(node),_199[lc]||name);};var _19d={},_19e=0,_19f=dojo._scopeName+"attrid",_1a0={col:1,colgroup:1,table:1,tbody:1,tfoot:1,thead:1,tr:1,title:1};dojo.attr=function(node,name,_1a1){node=byId(node);var args=arguments.length,prop;if(args==2&&typeof name!="string"){for(var x in name){d.attr(node,x,name[x]);}return node;}var lc=name.toLowerCase(),_1a2=_198[lc]||name,_1a3=_19a[_1a2],_1a4=_199[lc]||name;if(args==3){do{if(_1a2=="style"&&typeof _1a1!="string"){d.style(node,_1a1);break;}if(_1a2=="innerHTML"){if(d.isIE&&node.tagName.toLowerCase() in _1a0){d.empty(node);node.appendChild(d._toDom(_1a1,node.ownerDocument));}else{node[_1a2]=_1a1;}break;}if(d.isFunction(_1a1)){var _1a5=d.attr(node,_19f);if(!_1a5){_1a5=_19e++;d.attr(node,_19f,_1a5);}if(!_19d[_1a5]){_19d[_1a5]={};}var h=_19d[_1a5][_1a2];if(h){d.disconnect(h);}else{try{delete node[_1a2];}catch(e){}}_19d[_1a5][_1a2]=d.connect(node,_1a2,_1a1);break;}if(_1a3||typeof _1a1=="boolean"){node[_1a2]=_1a1;break;}node.setAttribute(_1a4,_1a1);}while(false);return node;}_1a1=node[_1a2];if(_1a3&&typeof _1a1!="undefined"){return _1a1;}if(_1a2!="href"&&(typeof _1a1=="boolean"||d.isFunction(_1a1))){return _1a1;}return _19c(node,_1a4)?node.getAttribute(_1a4):null;};dojo.removeAttr=function(node,name){byId(node).removeAttribute(_19b(name));};dojo.getNodeProp=function(node,name){node=byId(node);var lc=name.toLowerCase(),_1a6=_198[lc]||name;if((_1a6 in node)&&_1a6!="href"){return node[_1a6];}var _1a7=_199[lc]||name;return _19c(node,_1a7)?node.getAttribute(_1a7):null;};dojo.create=function(tag,_1a8,_1a9,pos){var doc=d.doc;if(_1a9){_1a9=byId(_1a9);doc=_1a9.ownerDocument;}if(typeof tag=="string"){tag=doc.createElement(tag);}if(_1a8){d.attr(tag,_1a8);}if(_1a9){d.place(tag,_1a9,pos);}return tag;};d.empty=d.isIE?function(node){node=byId(node);for(var c;c=node.lastChild;){d.destroy(c);}}:function(node){byId(node).innerHTML="";};var _1aa={option:["select"],tbody:["table"],thead:["table"],tfoot:["table"],tr:["table","tbody"],td:["table","tbody","tr"],th:["table","thead","tr"],legend:["fieldset"],caption:["table"],colgroup:["table"],col:["table","colgroup"],li:["ul"]},_1ab=/<\s*([\w\:]+)/,_1ac={},_1ad=0,_1ae="__"+d._scopeName+"ToDomId";for(var _1af in _1aa){var tw=_1aa[_1af];tw.pre=_1af=="option"?"<select multiple=\"multiple\">":"<"+tw.join("><")+">";tw.post="</"+tw.reverse().join("></")+">";}d._toDom=function(frag,doc){doc=doc||d.doc;var _1b0=doc[_1ae];if(!_1b0){doc[_1ae]=_1b0=++_1ad+"";_1ac[_1b0]=doc.createElement("div");}frag+="";var _1b1=frag.match(_1ab),tag=_1b1?_1b1[1].toLowerCase():"",_1b2=_1ac[_1b0],wrap,i,fc,df;if(_1b1&&_1aa[tag]){wrap=_1aa[tag];_1b2.innerHTML=wrap.pre+frag+wrap.post;for(i=wrap.length;i;--i){_1b2=_1b2.firstChild;}}else{_1b2.innerHTML=frag;}if(_1b2.childNodes.length==1){return _1b2.removeChild(_1b2.firstChild);}df=doc.createDocumentFragment();while(fc=_1b2.firstChild){df.appendChild(fc);}return df;};var _1b3="className";dojo.hasClass=function(node,_1b4){return ((" "+byId(node)[_1b3]+" ").indexOf(" "+_1b4+" ")>=0);};var _1b5=/\s+/,a1=[""],_1b6=function(s){if(typeof s=="string"||s instanceof String){if(s.indexOf(" ")<0){a1[0]=s;return a1;}else{return s.split(_1b5);}}return s||"";};dojo.addClass=function(node,_1b7){node=byId(node);_1b7=_1b6(_1b7);var cls=node[_1b3],_1b8;cls=cls?" "+cls+" ":" ";_1b8=cls.length;for(var i=0,len=_1b7.length,c;i<len;++i){c=_1b7[i];if(c&&cls.indexOf(" "+c+" ")<0){cls+=c+" ";}}if(_1b8<cls.length){node[_1b3]=cls.substr(1,cls.length-2);}};dojo.removeClass=function(node,_1b9){node=byId(node);var cls;if(_1b9!==undefined){_1b9=_1b6(_1b9);cls=" "+node[_1b3]+" ";for(var i=0,len=_1b9.length;i<len;++i){cls=cls.replace(" "+_1b9[i]+" "," ");}cls=d.trim(cls);}else{cls="";}if(node[_1b3]!=cls){node[_1b3]=cls;}};dojo.toggleClass=function(node,_1ba,_1bb){if(_1bb===undefined){_1bb=!d.hasClass(node,_1ba);}d[_1bb?"addClass":"removeClass"](node,_1ba);};})();}if(!dojo._hasResource["dojo._base.NodeList"]){dojo._hasResource["dojo._base.NodeList"]=true;dojo.provide("dojo._base.NodeList");(function(){var d=dojo;var ap=Array.prototype,aps=ap.slice,apc=ap.concat;var tnl=function(a,_1bc,_1bd){if(!a.sort){a=aps.call(a,0);}var ctor=_1bd||this._NodeListCtor||d._NodeListCtor;a.constructor=ctor;dojo._mixin(a,ctor.prototype);a._NodeListCtor=ctor;return _1bc?a._stash(_1bc):a;};var _1be=function(f,a,o){a=[0].concat(aps.call(a,0));o=o||d.global;return function(node){a[0]=node;return f.apply(o,a);};};var _1bf=function(f,o){return function(){this.forEach(_1be(f,arguments,o));return this;};};var _1c0=function(f,o){return function(){return this.map(_1be(f,arguments,o));};};var _1c1=function(f,o){return function(){return this.filter(_1be(f,arguments,o));};};var _1c2=function(f,g,o){return function(){var a=arguments,body=_1be(f,a,o);if(g.call(o||d.global,a)){return this.map(body);}this.forEach(body);return this;};};var _1c3=function(a){return a.length==1&&(typeof a[0]=="string");};var _1c4=function(node){var p=node.parentNode;if(p){p.removeChild(node);}};dojo.NodeList=function(){return tnl(Array.apply(null,arguments));};d._NodeListCtor=d.NodeList;var nl=d.NodeList,nlp=nl.prototype;nl._wrap=nlp._wrap=tnl;nl._adaptAsMap=_1c0;nl._adaptAsForEach=_1bf;nl._adaptAsFilter=_1c1;nl._adaptWithCondition=_1c2;d.forEach(["slice","splice"],function(name){var f=ap[name];nlp[name]=function(){return this._wrap(f.apply(this,arguments),name=="slice"?this:null);};});d.forEach(["indexOf","lastIndexOf","every","some"],function(name){var f=d[name];nlp[name]=function(){return f.apply(d,[this].concat(aps.call(arguments,0)));};});d.forEach(["attr","style"],function(name){nlp[name]=_1c2(d[name],_1c3);});d.forEach(["connect","addClass","removeClass","toggleClass","empty","removeAttr"],function(name){nlp[name]=_1bf(d[name]);});dojo.extend(dojo.NodeList,{_normalize:function(_1c5,_1c6){var _1c7=_1c5.parse===true?true:false;if(typeof _1c5.template=="string"){var _1c8=_1c5.templateFunc||(dojo.string&&dojo.string.substitute);_1c5=_1c8?_1c8(_1c5.template,_1c5):_1c5;}var type=(typeof _1c5);if(type=="string"||type=="number"){_1c5=dojo._toDom(_1c5,(_1c6&&_1c6.ownerDocument));if(_1c5.nodeType==11){_1c5=dojo._toArray(_1c5.childNodes);}else{_1c5=[_1c5];}}else{if(!dojo.isArrayLike(_1c5)){_1c5=[_1c5];}else{if(!dojo.isArray(_1c5)){_1c5=dojo._toArray(_1c5);}}}if(_1c7){_1c5._runParse=true;}return _1c5;},_cloneNode:function(node){return node.cloneNode(true);},_place:function(ary,_1c9,_1ca,_1cb){if(_1c9.nodeType!=1&&_1ca=="only"){return;}var _1cc=_1c9,_1cd;var _1ce=ary.length;for(var i=_1ce-1;i>=0;i--){var node=(_1cb?this._cloneNode(ary[i]):ary[i]);if(ary._runParse&&dojo.parser&&dojo.parser.parse){if(!_1cd){_1cd=_1cc.ownerDocument.createElement("div");}_1cd.appendChild(node);dojo.parser.parse(_1cd);node=_1cd.firstChild;while(_1cd.firstChild){_1cd.removeChild(_1cd.firstChild);}}if(i==_1ce-1){dojo.place(node,_1cc,_1ca);}else{_1cc.parentNode.insertBefore(node,_1cc);}_1cc=node;}},_stash:function(_1cf){this._parent=_1cf;return this;},end:function(){if(this._parent){return this._parent;}else{return new this._NodeListCtor();}},concat:function(item){var t=d.isArray(this)?this:aps.call(this,0),m=d.map(arguments,function(a){return a&&!d.isArray(a)&&(typeof NodeList!="undefined"&&a.constructor===NodeList||a.constructor===this._NodeListCtor)?aps.call(a,0):a;});return this._wrap(apc.apply(t,m),this);},map:function(func,obj){return this._wrap(d.map(this,func,obj),this);},forEach:function(_1d0,_1d1){d.forEach(this,_1d0,_1d1);return this;},coords:_1c0(d.coords),position:_1c0(d.position),place:function(_1d2,_1d3){var item=d.query(_1d2)[0];return this.forEach(function(node){d.place(node,item,_1d3);});},orphan:function(_1d4){return (_1d4?d._filterQueryResult(this,_1d4):this).forEach(_1c4);},adopt:function(_1d5,_1d6){return d.query(_1d5).place(this[0],_1d6)._stash(this);},query:function(_1d7){if(!_1d7){return this;}var ret=this.map(function(node){return d.query(_1d7,node).filter(function(_1d8){return _1d8!==undefined;});});return this._wrap(apc.apply([],ret),this);},filter:function(_1d9){var a=arguments,_1da=this,_1db=0;if(typeof _1d9=="string"){_1da=d._filterQueryResult(this,a[0]);if(a.length==1){return _1da._stash(this);}_1db=1;}return this._wrap(d.filter(_1da,a[_1db],a[_1db+1]),this);},addContent:function(_1dc,_1dd){_1dc=this._normalize(_1dc,this[0]);for(var i=0,node;node=this[i];i++){this._place(_1dc,node,_1dd,i>0);}return this;},instantiate:function(_1de,_1df){var c=d.isFunction(_1de)?_1de:d.getObject(_1de);_1df=_1df||{};return this.forEach(function(node){new c(_1df,node);});},at:function(){var t=new this._NodeListCtor();d.forEach(arguments,function(i){if(i<0){i=this.length+i;}if(this[i]){t.push(this[i]);}},this);return t._stash(this);}});nl.events=["blur","focus","change","click","error","keydown","keypress","keyup","load","mousedown","mouseenter","mouseleave","mousemove","mouseout","mouseover","mouseup","submit"];d.forEach(nl.events,function(evt){var _1e0="on"+evt;nlp[_1e0]=function(a,b){return this.connect(_1e0,a,b);};});})();}if(!dojo._hasResource["dojo._base.query"]){dojo._hasResource["dojo._base.query"]=true;if(typeof dojo!="undefined"){dojo.provide("dojo._base.query");}(function(d){var trim=d.trim;var each=d.forEach;var qlc=d._NodeListCtor=d.NodeList;var _1e1=function(){return d.doc;};var _1e2=((d.isWebKit||d.isMozilla)&&((_1e1().compatMode)=="BackCompat"));var _1e3=!!_1e1().firstChild["children"]?"children":"childNodes";var _1e4=">~+";var _1e5=false;var _1e6=function(){return true;};var _1e7=function(_1e8){if(_1e4.indexOf(_1e8.slice(-1))>=0){_1e8+=" * ";}else{_1e8+=" ";}var ts=function(s,e){return trim(_1e8.slice(s,e));};var _1e9=[];var _1ea=-1,_1eb=-1,_1ec=-1,_1ed=-1,_1ee=-1,inId=-1,_1ef=-1,lc="",cc="",_1f0;var x=0,ql=_1e8.length,_1f1=null,_1f2=null;var _1f3=function(){if(_1ef>=0){var tv=(_1ef==x)?null:ts(_1ef,x);_1f1[(_1e4.indexOf(tv)<0)?"tag":"oper"]=tv;_1ef=-1;}};var _1f4=function(){if(inId>=0){_1f1.id=ts(inId,x).replace(/\\/g,"");inId=-1;}};var _1f5=function(){if(_1ee>=0){_1f1.classes.push(ts(_1ee+1,x).replace(/\\/g,""));_1ee=-1;}};var _1f6=function(){_1f4();_1f3();_1f5();};var _1f7=function(){_1f6();if(_1ed>=0){_1f1.pseudos.push({name:ts(_1ed+1,x)});}_1f1.loops=(_1f1.pseudos.length||_1f1.attrs.length||_1f1.classes.length);_1f1.oquery=_1f1.query=ts(_1f0,x);_1f1.otag=_1f1.tag=(_1f1["oper"])?null:(_1f1.tag||"*");if(_1f1.tag){_1f1.tag=_1f1.tag.toUpperCase();}if(_1e9.length&&(_1e9[_1e9.length-1].oper)){_1f1.infixOper=_1e9.pop();_1f1.query=_1f1.infixOper.query+" "+_1f1.query;}_1e9.push(_1f1);_1f1=null;};for(;lc=cc,cc=_1e8.charAt(x),x<ql;x++){if(lc=="\\"){continue;}if(!_1f1){_1f0=x;_1f1={query:null,pseudos:[],attrs:[],classes:[],tag:null,oper:null,id:null,getTag:function(){return (_1e5)?this.otag:this.tag;}};_1ef=x;}if(_1ea>=0){if(cc=="]"){if(!_1f2.attr){_1f2.attr=ts(_1ea+1,x);}else{_1f2.matchFor=ts((_1ec||_1ea+1),x);}var cmf=_1f2.matchFor;if(cmf){if((cmf.charAt(0)=="\"")||(cmf.charAt(0)=="'")){_1f2.matchFor=cmf.slice(1,-1);}}_1f1.attrs.push(_1f2);_1f2=null;_1ea=_1ec=-1;}else{if(cc=="="){var _1f8=("|~^$*".indexOf(lc)>=0)?lc:"";_1f2.type=_1f8+cc;_1f2.attr=ts(_1ea+1,x-_1f8.length);_1ec=x+1;}}}else{if(_1eb>=0){if(cc==")"){if(_1ed>=0){_1f2.value=ts(_1eb+1,x);}_1ed=_1eb=-1;}}else{if(cc=="#"){_1f6();inId=x+1;}else{if(cc=="."){_1f6();_1ee=x;}else{if(cc==":"){_1f6();_1ed=x;}else{if(cc=="["){_1f6();_1ea=x;_1f2={};}else{if(cc=="("){if(_1ed>=0){_1f2={name:ts(_1ed+1,x),value:null};_1f1.pseudos.push(_1f2);}_1eb=x;}else{if((cc==" ")&&(lc!=cc)){_1f7();}}}}}}}}}return _1e9;};var _1f9=function(_1fa,_1fb){if(!_1fa){return _1fb;}if(!_1fb){return _1fa;}return function(){return _1fa.apply(window,arguments)&&_1fb.apply(window,arguments);};};var _1fc=function(i,arr){var r=arr||[];if(i){r.push(i);}return r;};var _1fd=function(n){return (1==n.nodeType);};var _1fe="";var _1ff=function(elem,attr){if(!elem){return _1fe;}if(attr=="class"){return elem.className||_1fe;}if(attr=="for"){return elem.htmlFor||_1fe;}if(attr=="style"){return elem.style.cssText||_1fe;}return (_1e5?elem.getAttribute(attr):elem.getAttribute(attr,2))||_1fe;};var _200={"*=":function(attr,_201){return function(elem){return (_1ff(elem,attr).indexOf(_201)>=0);};},"^=":function(attr,_202){return function(elem){return (_1ff(elem,attr).indexOf(_202)==0);};},"$=":function(attr,_203){var tval=" "+_203;return function(elem){var ea=" "+_1ff(elem,attr);return (ea.lastIndexOf(_203)==(ea.length-_203.length));};},"~=":function(attr,_204){var tval=" "+_204+" ";return function(elem){var ea=" "+_1ff(elem,attr)+" ";return (ea.indexOf(tval)>=0);};},"|=":function(attr,_205){var _206=" "+_205+"-";return function(elem){var ea=" "+_1ff(elem,attr);return ((ea==_205)||(ea.indexOf(_206)==0));};},"=":function(attr,_207){return function(elem){return (_1ff(elem,attr)==_207);};}};var _208=(typeof _1e1().firstChild.nextElementSibling=="undefined");var _209=!_208?"nextElementSibling":"nextSibling";var _20a=!_208?"previousElementSibling":"previousSibling";var _20b=(_208?_1fd:_1e6);var _20c=function(node){while(node=node[_20a]){if(_20b(node)){return false;}}return true;};var _20d=function(node){while(node=node[_209]){if(_20b(node)){return false;}}return true;};var _20e=function(node){var root=node.parentNode;var i=0,tret=root[_1e3],ci=(node["_i"]||-1),cl=(root["_l"]||-1);if(!tret){return -1;}var l=tret.length;if(cl==l&&ci>=0&&cl>=0){return ci;}root["_l"]=l;ci=-1;for(var te=root["firstElementChild"]||root["firstChild"];te;te=te[_209]){if(_20b(te)){te["_i"]=++i;if(node===te){ci=i;}}}return ci;};var _20f=function(elem){return !((_20e(elem))%2);};var _210=function(elem){return ((_20e(elem))%2);};var _211={"checked":function(name,_212){return function(elem){return !!("checked" in elem?elem.checked:elem.selected);};},"first-child":function(){return _20c;},"last-child":function(){return _20d;},"only-child":function(name,_213){return function(node){if(!_20c(node)){return false;}if(!_20d(node)){return false;}return true;};},"empty":function(name,_214){return function(elem){var cn=elem.childNodes;var cnl=elem.childNodes.length;for(var x=cnl-1;x>=0;x--){var nt=cn[x].nodeType;if((nt===1)||(nt==3)){return false;}}return true;};},"contains":function(name,_215){var cz=_215.charAt(0);if(cz=="\""||cz=="'"){_215=_215.slice(1,-1);}return function(elem){return (elem.innerHTML.indexOf(_215)>=0);};},"not":function(name,_216){var p=_1e7(_216)[0];var _217={el:1};if(p.tag!="*"){_217.tag=1;}if(!p.classes.length){_217.classes=1;}var ntf=_218(p,_217);return function(elem){return (!ntf(elem));};},"nth-child":function(name,_219){var pi=parseInt;if(_219=="odd"){return _210;}else{if(_219=="even"){return _20f;}}if(_219.indexOf("n")!=-1){var _21a=_219.split("n",2);var pred=_21a[0]?((_21a[0]=="-")?-1:pi(_21a[0])):1;var idx=_21a[1]?pi(_21a[1]):0;var lb=0,ub=-1;if(pred>0){if(idx<0){idx=(idx%pred)&&(pred+(idx%pred));}else{if(idx>0){if(idx>=pred){lb=idx-idx%pred;}idx=idx%pred;}}}else{if(pred<0){pred*=-1;if(idx>0){ub=idx;idx=idx%pred;}}}if(pred>0){return function(elem){var i=_20e(elem);return (i>=lb)&&(ub<0||i<=ub)&&((i%pred)==idx);};}else{_219=idx;}}var _21b=pi(_219);return function(elem){return (_20e(elem)==_21b);};}};var _21c=(d.isIE)?function(cond){var clc=cond.toLowerCase();if(clc=="class"){cond="className";}return function(elem){return (_1e5?elem.getAttribute(cond):elem[cond]||elem[clc]);};}:function(cond){return function(elem){return (elem&&elem.getAttribute&&elem.hasAttribute(cond));};};var _218=function(_21d,_21e){if(!_21d){return _1e6;}_21e=_21e||{};var ff=null;if(!("el" in _21e)){ff=_1f9(ff,_1fd);}if(!("tag" in _21e)){if(_21d.tag!="*"){ff=_1f9(ff,function(elem){return (elem&&(elem.tagName==_21d.getTag()));});}}if(!("classes" in _21e)){each(_21d.classes,function(_21f,idx,arr){var re=new RegExp("(?:^|\\s)"+_21f+"(?:\\s|$)");ff=_1f9(ff,function(elem){return re.test(elem.className);});ff.count=idx;});}if(!("pseudos" in _21e)){each(_21d.pseudos,function(_220){var pn=_220.name;if(_211[pn]){ff=_1f9(ff,_211[pn](pn,_220.value));}});}if(!("attrs" in _21e)){each(_21d.attrs,function(attr){var _221;var a=attr.attr;if(attr.type&&_200[attr.type]){_221=_200[attr.type](a,attr.matchFor);}else{if(a.length){_221=_21c(a);}}if(_221){ff=_1f9(ff,_221);}});}if(!("id" in _21e)){if(_21d.id){ff=_1f9(ff,function(elem){return (!!elem&&(elem.id==_21d.id));});}}if(!ff){if(!("default" in _21e)){ff=_1e6;}}return ff;};var _222=function(_223){return function(node,ret,bag){while(node=node[_209]){if(_208&&(!_1fd(node))){continue;}if((!bag||_224(node,bag))&&_223(node)){ret.push(node);}break;}return ret;};};var _225=function(_226){return function(root,ret,bag){var te=root[_209];while(te){if(_20b(te)){if(bag&&!_224(te,bag)){break;}if(_226(te)){ret.push(te);}}te=te[_209];}return ret;};};var _227=function(_228){_228=_228||_1e6;return function(root,ret,bag){var te,x=0,tret=root[_1e3];while(te=tret[x++]){if(_20b(te)&&(!bag||_224(te,bag))&&(_228(te,x))){ret.push(te);}}return ret;};};var _229=function(node,root){var pn=node.parentNode;while(pn){if(pn==root){break;}pn=pn.parentNode;}return !!pn;};var _22a={};var _22b=function(_22c){var _22d=_22a[_22c.query];if(_22d){return _22d;}var io=_22c.infixOper;var oper=(io?io.oper:"");var _22e=_218(_22c,{el:1});var qt=_22c.tag;var _22f=("*"==qt);var ecs=_1e1()["getElementsByClassName"];if(!oper){if(_22c.id){_22e=(!_22c.loops&&_22f)?_1e6:_218(_22c,{el:1,id:1});_22d=function(root,arr){var te=d.byId(_22c.id,(root.ownerDocument||root));if(!te||!_22e(te)){return;}if(9==root.nodeType){return _1fc(te,arr);}else{if(_229(te,root)){return _1fc(te,arr);}}};}else{if(ecs&&/\{\s*\[native code\]\s*\}/.test(String(ecs))&&_22c.classes.length&&!_1e2){_22e=_218(_22c,{el:1,classes:1,id:1});var _230=_22c.classes.join(" ");_22d=function(root,arr,bag){var ret=_1fc(0,arr),te,x=0;var tret=root.getElementsByClassName(_230);while((te=tret[x++])){if(_22e(te,root)&&_224(te,bag)){ret.push(te);}}return ret;};}else{if(!_22f&&!_22c.loops){_22d=function(root,arr,bag){var ret=_1fc(0,arr),te,x=0;var tret=root.getElementsByTagName(_22c.getTag());while((te=tret[x++])){if(_224(te,bag)){ret.push(te);}}return ret;};}else{_22e=_218(_22c,{el:1,tag:1,id:1});_22d=function(root,arr,bag){var ret=_1fc(0,arr),te,x=0;var tret=root.getElementsByTagName(_22c.getTag());while((te=tret[x++])){if(_22e(te,root)&&_224(te,bag)){ret.push(te);}}return ret;};}}}}else{var _231={el:1};if(_22f){_231.tag=1;}_22e=_218(_22c,_231);if("+"==oper){_22d=_222(_22e);}else{if("~"==oper){_22d=_225(_22e);}else{if(">"==oper){_22d=_227(_22e);}}}}return _22a[_22c.query]=_22d;};var _232=function(root,_233){var _234=_1fc(root),qp,x,te,qpl=_233.length,bag,ret;for(var i=0;i<qpl;i++){ret=[];qp=_233[i];x=_234.length-1;if(x>0){bag={};ret.nozip=true;}var gef=_22b(qp);for(var j=0;(te=_234[j]);j++){gef(te,ret,bag);}if(!ret.length){break;}_234=ret;}return ret;};var _235={},_236={};var _237=function(_238){var _239=_1e7(trim(_238));if(_239.length==1){var tef=_22b(_239[0]);return function(root){var r=tef(root,new qlc());if(r){r.nozip=true;}return r;};}return function(root){return _232(root,_239);};};var nua=navigator.userAgent;var wk="WebKit/";var _23a=(d.isWebKit&&(nua.indexOf(wk)>0)&&(parseFloat(nua.split(wk)[1])>528));var _23b=d.isIE?"commentStrip":"nozip";var qsa="querySelectorAll";var _23c=(!!_1e1()[qsa]&&(!d.isSafari||(d.isSafari>3.1)||_23a));var _23d=/n\+\d|([^ ])?([>~+])([^ =])?/g;var _23e=function(_23f,pre,ch,post){return ch?(pre?pre+" ":"")+ch+(post?" "+post:""):_23f;};var _240=function(_241,_242){_241=_241.replace(_23d,_23e);if(_23c){var _243=_236[_241];if(_243&&!_242){return _243;}}var _244=_235[_241];if(_244){return _244;}var qcz=_241.charAt(0);var _245=(-1==_241.indexOf(" "));if((_241.indexOf("#")>=0)&&(_245)){_242=true;}var _246=(_23c&&(!_242)&&(_1e4.indexOf(qcz)==-1)&&(!d.isIE||(_241.indexOf(":")==-1))&&(!(_1e2&&(_241.indexOf(".")>=0)))&&(_241.indexOf(":contains")==-1)&&(_241.indexOf(":checked")==-1)&&(_241.indexOf("|=")==-1));if(_246){var tq=(_1e4.indexOf(_241.charAt(_241.length-1))>=0)?(_241+" *"):_241;return _236[_241]=function(root){try{if(!((9==root.nodeType)||_245)){throw "";}var r=root[qsa](tq);r[_23b]=true;return r;}catch(e){return _240(_241,true)(root);}};}else{var _247=_241.split(/\s*,\s*/);return _235[_241]=((_247.length<2)?_237(_241):function(root){var _248=0,ret=[],tp;while((tp=_247[_248++])){ret=ret.concat(_237(tp)(root));}return ret;});}};var _249=0;var _24a=d.isIE?function(node){if(_1e5){return (node.getAttribute("_uid")||node.setAttribute("_uid",++_249)||_249);}else{return node.uniqueID;}}:function(node){return (node._uid||(node._uid=++_249));};var _224=function(node,bag){if(!bag){return 1;}var id=_24a(node);if(!bag[id]){return bag[id]=1;}return 0;};var _24b="_zipIdx";var _24c=function(arr){if(arr&&arr.nozip){return (qlc._wrap)?qlc._wrap(arr):arr;}var ret=new qlc();if(!arr||!arr.length){return ret;}if(arr[0]){ret.push(arr[0]);}if(arr.length<2){return ret;}_249++;if(d.isIE&&_1e5){var _24d=_249+"";arr[0].setAttribute(_24b,_24d);for(var x=1,te;te=arr[x];x++){if(arr[x].getAttribute(_24b)!=_24d){ret.push(te);}te.setAttribute(_24b,_24d);}}else{if(d.isIE&&arr.commentStrip){try{for(var x=1,te;te=arr[x];x++){if(_1fd(te)){ret.push(te);}}}catch(e){}}else{if(arr[0]){arr[0][_24b]=_249;}for(var x=1,te;te=arr[x];x++){if(arr[x][_24b]!=_249){ret.push(te);}te[_24b]=_249;}}}return ret;};d.query=function(_24e,root){qlc=d._NodeListCtor;if(!_24e){return new qlc();}if(_24e.constructor==qlc){return _24e;}if(typeof _24e!="string"){return new qlc(_24e);}if(typeof root=="string"){root=d.byId(root);if(!root){return new qlc();}}root=root||_1e1();var od=root.ownerDocument||root.documentElement;_1e5=(root.contentType&&root.contentType=="application/xml")||(d.isOpera&&(root.doctype||od.toString()=="[object XMLDocument]"))||(!!od)&&(d.isIE?od.xml:(root.xmlVersion||od.xmlVersion));var r=_240(_24e)(root);if(r&&r.nozip&&!qlc._wrap){return r;}return _24c(r);};d.query.pseudos=_211;d._filterQueryResult=function(_24f,_250){var _251=new d._NodeListCtor();var _252=_218(_1e7(_250)[0]);for(var x=0,te;te=_24f[x];x++){if(_252(te)){_251.push(te);}}return _251;};})(this["queryPortability"]||this["acme"]||dojo);}if(!dojo._hasResource["dojo._base.xhr"]){dojo._hasResource["dojo._base.xhr"]=true;dojo.provide("dojo._base.xhr");(function(){var _253=dojo,cfg=_253.config;function _254(obj,name,_255){if(_255===null){return;}var val=obj[name];if(typeof val=="string"){obj[name]=[val,_255];}else{if(_253.isArray(val)){val.push(_255);}else{obj[name]=_255;}}};dojo.fieldToObject=function(_256){var ret=null;var item=_253.byId(_256);if(item){var _257=item.name;var type=(item.type||"").toLowerCase();if(_257&&type&&!item.disabled){if(type=="radio"||type=="checkbox"){if(item.checked){ret=item.value;}}else{if(item.multiple){ret=[];_253.query("option",item).forEach(function(opt){if(opt.selected){ret.push(opt.value);}});}else{ret=item.value;}}}}return ret;};dojo.formToObject=function(_258){var ret={};var _259="file|submit|image|reset|button|";_253.forEach(dojo.byId(_258).elements,function(item){var _25a=item.name;var type=(item.type||"").toLowerCase();if(_25a&&type&&_259.indexOf(type)==-1&&!item.disabled){_254(ret,_25a,_253.fieldToObject(item));if(type=="image"){ret[_25a+".x"]=ret[_25a+".y"]=ret[_25a].x=ret[_25a].y=0;}}});return ret;};dojo.objectToQuery=function(map){var enc=encodeURIComponent;var _25b=[];var _25c={};for(var name in map){var _25d=map[name];if(_25d!=_25c[name]){var _25e=enc(name)+"=";if(_253.isArray(_25d)){for(var i=0;i<_25d.length;i++){_25b.push(_25e+enc(_25d[i]));}}else{_25b.push(_25e+enc(_25d));}}}return _25b.join("&");};dojo.formToQuery=function(_25f){return _253.objectToQuery(_253.formToObject(_25f));};dojo.formToJson=function(_260,_261){return _253.toJson(_253.formToObject(_260),_261);};dojo.queryToObject=function(str){var ret={};var qp=str.split("&");var dec=decodeURIComponent;_253.forEach(qp,function(item){if(item.length){var _262=item.split("=");var name=dec(_262.shift());var val=dec(_262.join("="));if(typeof ret[name]=="string"){ret[name]=[ret[name]];}if(_253.isArray(ret[name])){ret[name].push(val);}else{ret[name]=val;}}});return ret;};dojo._blockAsync=false;var _263=_253._contentHandlers=dojo.contentHandlers={text:function(xhr){return xhr.responseText;},json:function(xhr){return _253.fromJson(xhr.responseText||null);},"json-comment-filtered":function(xhr){if(!dojo.config.useCommentedJson){console.warn("Consider using the standard mimetype:application/json."+" json-commenting can introduce security issues. To"+" decrease the chances of hijacking, use the standard the 'json' handler and"+" prefix your json with: {}&&\n"+"Use djConfig.useCommentedJson=true to turn off this message.");}var _264=xhr.responseText;var _265=_264.indexOf("/*");var _266=_264.lastIndexOf("*/");if(_265==-1||_266==-1){throw new Error("JSON was not comment filtered");}return _253.fromJson(_264.substring(_265+2,_266));},javascript:function(xhr){return _253.eval(xhr.responseText);},xml:function(xhr){var _267=xhr.responseXML;if(_253.isIE&&(!_267||!_267.documentElement)){var ms=function(n){return "MSXML"+n+".DOMDocument";};var dp=["Microsoft.XMLDOM",ms(6),ms(4),ms(3),ms(2)];_253.some(dp,function(p){try{var dom=new ActiveXObject(p);dom.async=false;dom.loadXML(xhr.responseText);_267=dom;}catch(e){return false;}return true;});}return _267;},"json-comment-optional":function(xhr){if(xhr.responseText&&/^[^{\[]*\/\*/.test(xhr.responseText)){return _263["json-comment-filtered"](xhr);}else{return _263["json"](xhr);}}};dojo._ioSetArgs=function(args,_268,_269,_26a){var _26b={args:args,url:args.url};var _26c=null;if(args.form){var form=_253.byId(args.form);var _26d=form.getAttributeNode("action");_26b.url=_26b.url||(_26d?_26d.value:null);_26c=_253.formToObject(form);}var _26e=[{}];if(_26c){_26e.push(_26c);}if(args.content){_26e.push(args.content);}if(args.preventCache){_26e.push({"dojo.preventCache":new Date().valueOf()});}_26b.query=_253.objectToQuery(_253.mixin.apply(null,_26e));_26b.handleAs=args.handleAs||"text";var d=new _253.Deferred(_268);d.addCallbacks(_269,function(_26f){return _26a(_26f,d);});var ld=args.load;if(ld&&_253.isFunction(ld)){d.addCallback(function(_270){return ld.call(args,_270,_26b);});}var err=args.error;if(err&&_253.isFunction(err)){d.addErrback(function(_271){return err.call(args,_271,_26b);});}var _272=args.handle;if(_272&&_253.isFunction(_272)){d.addBoth(function(_273){return _272.call(args,_273,_26b);});}if(cfg.ioPublish&&_253.publish&&_26b.args.ioPublish!==false){d.addCallbacks(function(res){_253.publish("/dojo/io/load",[d,res]);return res;},function(res){_253.publish("/dojo/io/error",[d,res]);return res;});d.addBoth(function(res){_253.publish("/dojo/io/done",[d,res]);return res;});}d.ioArgs=_26b;return d;};var _274=function(dfd){dfd.canceled=true;var xhr=dfd.ioArgs.xhr;var _275=typeof xhr.abort;if(_275=="function"||_275=="object"||_275=="unknown"){xhr.abort();}var err=dfd.ioArgs.error;if(!err){err=new Error("xhr cancelled");err.dojoType="cancel";}return err;};var _276=function(dfd){var ret=_263[dfd.ioArgs.handleAs](dfd.ioArgs.xhr);return ret===undefined?null:ret;};var _277=function(_278,dfd){if(!dfd.ioArgs.args.failOk){console.error(_278);}return _278;};var _279=null;var _27a=[];var _27b=0;var _27c=function(dfd){if(_27b<=0){_27b=0;if(cfg.ioPublish&&_253.publish&&(!dfd||dfd&&dfd.ioArgs.args.ioPublish!==false)){_253.publish("/dojo/io/stop");}}};var _27d=function(){var now=(new Date()).getTime();if(!_253._blockAsync){for(var i=0,tif;i<_27a.length&&(tif=_27a[i]);i++){var dfd=tif.dfd;var func=function(){if(!dfd||dfd.canceled||!tif.validCheck(dfd)){_27a.splice(i--,1);_27b-=1;}else{if(tif.ioCheck(dfd)){_27a.splice(i--,1);tif.resHandle(dfd);_27b-=1;}else{if(dfd.startTime){if(dfd.startTime+(dfd.ioArgs.args.timeout||0)<now){_27a.splice(i--,1);var err=new Error("timeout exceeded");err.dojoType="timeout";dfd.errback(err);dfd.cancel();_27b-=1;}}}}};if(dojo.config.debugAtAllCosts){func.call(this);}else{try{func.call(this);}catch(e){dfd.errback(e);}}}}_27c(dfd);if(!_27a.length){clearInterval(_279);_279=null;return;}};dojo._ioCancelAll=function(){try{_253.forEach(_27a,function(i){try{i.dfd.cancel();}catch(e){}});}catch(e){}};if(_253.isIE){_253.addOnWindowUnload(_253._ioCancelAll);}_253._ioNotifyStart=function(dfd){if(cfg.ioPublish&&_253.publish&&dfd.ioArgs.args.ioPublish!==false){if(!_27b){_253.publish("/dojo/io/start");}_27b+=1;_253.publish("/dojo/io/send",[dfd]);}};_253._ioWatch=function(dfd,_27e,_27f,_280){var args=dfd.ioArgs.args;if(args.timeout){dfd.startTime=(new Date()).getTime();}_27a.push({dfd:dfd,validCheck:_27e,ioCheck:_27f,resHandle:_280});if(!_279){_279=setInterval(_27d,50);}if(args.sync){_27d();}};var _281="application/x-www-form-urlencoded";var _282=function(dfd){return dfd.ioArgs.xhr.readyState;};var _283=function(dfd){return 4==dfd.ioArgs.xhr.readyState;};var _284=function(dfd){var xhr=dfd.ioArgs.xhr;if(_253._isDocumentOk(xhr)){dfd.callback(dfd);}else{var err=new Error("Unable to load "+dfd.ioArgs.url+" status:"+xhr.status);err.status=xhr.status;err.responseText=xhr.responseText;dfd.errback(err);}};dojo._ioAddQueryToUrl=function(_285){if(_285.query.length){_285.url+=(_285.url.indexOf("?")==-1?"?":"&")+_285.query;_285.query=null;}};dojo.xhr=function(_286,args,_287){var dfd=_253._ioSetArgs(args,_274,_276,_277);var _288=dfd.ioArgs;var xhr=_288.xhr=_253._xhrObj(_288.args);if(!xhr){dfd.cancel();return dfd;}if("postData" in args){_288.query=args.postData;}else{if("putData" in args){_288.query=args.putData;}else{if("rawBody" in args){_288.query=args.rawBody;}else{if((arguments.length>2&&!_287)||"POST|PUT".indexOf(_286.toUpperCase())==-1){_253._ioAddQueryToUrl(_288);}}}}xhr.open(_286,_288.url,args.sync!==true,args.user||undefined,args.password||undefined);if(args.headers){for(var hdr in args.headers){if(hdr.toLowerCase()==="content-type"&&!args.contentType){args.contentType=args.headers[hdr];}else{if(args.headers[hdr]){xhr.setRequestHeader(hdr,args.headers[hdr]);}}}}xhr.setRequestHeader("Content-Type",args.contentType||_281);if(!args.headers||!("X-Requested-With" in args.headers)){xhr.setRequestHeader("X-Requested-With","XMLHttpRequest");}_253._ioNotifyStart(dfd);if(dojo.config.debugAtAllCosts){xhr.send(_288.query);}else{try{xhr.send(_288.query);}catch(e){_288.error=e;dfd.cancel();}}_253._ioWatch(dfd,_282,_283,_284);xhr=null;return dfd;};dojo.xhrGet=function(args){return _253.xhr("GET",args);};dojo.rawXhrPost=dojo.xhrPost=function(args){return _253.xhr("POST",args,true);};dojo.rawXhrPut=dojo.xhrPut=function(args){return _253.xhr("PUT",args,true);};dojo.xhrDelete=function(args){return _253.xhr("DELETE",args);};})();}if(!dojo._hasResource["dojo._base.fx"]){dojo._hasResource["dojo._base.fx"]=true;dojo.provide("dojo._base.fx");(function(){var d=dojo;var _289=d._mixin;dojo._Line=function(_28a,end){this.start=_28a;this.end=end;};dojo._Line.prototype.getValue=function(n){return ((this.end-this.start)*n)+this.start;};dojo.Animation=function(args){_289(this,args);if(d.isArray(this.curve)){this.curve=new d._Line(this.curve[0],this.curve[1]);}};d._Animation=d.Animation;d.extend(dojo.Animation,{duration:350,repeat:0,rate:20,_percent:0,_startRepeatCount:0,_getStep:function(){var _28b=this._percent,_28c=this.easing;return _28c?_28c(_28b):_28b;},_fire:function(evt,args){var a=args||[];if(this[evt]){if(d.config.debugAtAllCosts){this[evt].apply(this,a);}else{try{this[evt].apply(this,a);}catch(e){console.error("exception in animation handler for:",evt);console.error(e);}}}return this;},play:function(_28d,_28e){var _28f=this;if(_28f._delayTimer){_28f._clearTimer();}if(_28e){_28f._stopTimer();_28f._active=_28f._paused=false;_28f._percent=0;}else{if(_28f._active&&!_28f._paused){return _28f;}}_28f._fire("beforeBegin",[_28f.node]);var de=_28d||_28f.delay,_290=dojo.hitch(_28f,"_play",_28e);if(de>0){_28f._delayTimer=setTimeout(_290,de);return _28f;}_290();return _28f;},_play:function(_291){var _292=this;if(_292._delayTimer){_292._clearTimer();}_292._startTime=new Date().valueOf();if(_292._paused){_292._startTime-=_292.duration*_292._percent;}_292._active=true;_292._paused=false;var _293=_292.curve.getValue(_292._getStep());if(!_292._percent){if(!_292._startRepeatCount){_292._startRepeatCount=_292.repeat;}_292._fire("onBegin",[_293]);}_292._fire("onPlay",[_293]);_292._cycle();return _292;},pause:function(){var _294=this;if(_294._delayTimer){_294._clearTimer();}_294._stopTimer();if(!_294._active){return _294;}_294._paused=true;_294._fire("onPause",[_294.curve.getValue(_294._getStep())]);return _294;},gotoPercent:function(_295,_296){var _297=this;_297._stopTimer();_297._active=_297._paused=true;_297._percent=_295;if(_296){_297.play();}return _297;},stop:function(_298){var _299=this;if(_299._delayTimer){_299._clearTimer();}if(!_299._timer){return _299;}_299._stopTimer();if(_298){_299._percent=1;}_299._fire("onStop",[_299.curve.getValue(_299._getStep())]);_299._active=_299._paused=false;return _299;},status:function(){if(this._active){return this._paused?"paused":"playing";}return "stopped";},_cycle:function(){var _29a=this;if(_29a._active){var curr=new Date().valueOf();var step=(curr-_29a._startTime)/(_29a.duration);if(step>=1){step=1;}_29a._percent=step;if(_29a.easing){step=_29a.easing(step);}_29a._fire("onAnimate",[_29a.curve.getValue(step)]);if(_29a._percent<1){_29a._startTimer();}else{_29a._active=false;if(_29a.repeat>0){_29a.repeat--;_29a.play(null,true);}else{if(_29a.repeat==-1){_29a.play(null,true);}else{if(_29a._startRepeatCount){_29a.repeat=_29a._startRepeatCount;_29a._startRepeatCount=0;}}}_29a._percent=0;_29a._fire("onEnd",[_29a.node]);!_29a.repeat&&_29a._stopTimer();}}return _29a;},_clearTimer:function(){clearTimeout(this._delayTimer);delete this._delayTimer;}});var ctr=0,_29b=null,_29c={run:function(){}};d.extend(d.Animation,{_startTimer:function(){if(!this._timer){this._timer=d.connect(_29c,"run",this,"_cycle");ctr++;}if(!_29b){_29b=setInterval(d.hitch(_29c,"run"),this.rate);}},_stopTimer:function(){if(this._timer){d.disconnect(this._timer);this._timer=null;ctr--;}if(ctr<=0){clearInterval(_29b);_29b=null;ctr=0;}}});var _29d=d.isIE?function(node){var ns=node.style;if(!ns.width.length&&d.style(node,"width")=="auto"){ns.width="auto";}}:function(){};dojo._fade=function(args){args.node=d.byId(args.node);var _29e=_289({properties:{}},args),_29f=(_29e.properties.opacity={});_29f.start=!("start" in _29e)?function(){return +d.style(_29e.node,"opacity")||0;}:_29e.start;_29f.end=_29e.end;var anim=d.animateProperty(_29e);d.connect(anim,"beforeBegin",d.partial(_29d,_29e.node));return anim;};dojo.fadeIn=function(args){return d._fade(_289({end:1},args));};dojo.fadeOut=function(args){return d._fade(_289({end:0},args));};dojo._defaultEasing=function(n){return 0.5+((Math.sin((n+1.5)*Math.PI))/2);};var _2a0=function(_2a1){this._properties=_2a1;for(var p in _2a1){var prop=_2a1[p];if(prop.start instanceof d.Color){prop.tempColor=new d.Color();}}};_2a0.prototype.getValue=function(r){var ret={};for(var p in this._properties){var prop=this._properties[p],_2a2=prop.start;if(_2a2 instanceof d.Color){ret[p]=d.blendColors(_2a2,prop.end,r,prop.tempColor).toCss();}else{if(!d.isArray(_2a2)){ret[p]=((prop.end-_2a2)*r)+_2a2+(p!="opacity"?prop.units||"px":0);}}}return ret;};dojo.animateProperty=function(args){var n=args.node=d.byId(args.node);if(!args.easing){args.easing=d._defaultEasing;}var anim=new d.Animation(args);d.connect(anim,"beforeBegin",anim,function(){var pm={};for(var p in this.properties){if(p=="width"||p=="height"){this.node.display="block";}var prop=this.properties[p];if(d.isFunction(prop)){prop=prop(n);}prop=pm[p]=_289({},(d.isObject(prop)?prop:{end:prop}));if(d.isFunction(prop.start)){prop.start=prop.start(n);}if(d.isFunction(prop.end)){prop.end=prop.end(n);}var _2a3=(p.toLowerCase().indexOf("color")>=0);function _2a4(node,p){var v={height:node.offsetHeight,width:node.offsetWidth}[p];if(v!==undefined){return v;}v=d.style(node,p);return (p=="opacity")?+v:(_2a3?v:parseFloat(v));};if(!("end" in prop)){prop.end=_2a4(n,p);}else{if(!("start" in prop)){prop.start=_2a4(n,p);}}if(_2a3){prop.start=new d.Color(prop.start);prop.end=new d.Color(prop.end);}else{prop.start=(p=="opacity")?+prop.start:parseFloat(prop.start);}}this.curve=new _2a0(pm);});d.connect(anim,"onAnimate",d.hitch(d,"style",anim.node));return anim;};dojo.anim=function(node,_2a5,_2a6,_2a7,_2a8,_2a9){return d.animateProperty({node:node,duration:_2a6||d.Animation.prototype.duration,properties:_2a5,easing:_2a7,onEnd:_2a8}).play(_2a9||0);};})();}if(!dojo._hasResource["dojo._base.browser"]){dojo._hasResource["dojo._base.browser"]=true;dojo.provide("dojo._base.browser");dojo.forEach(dojo.config.require,function(i){dojo["require"](i);});}if(dojo.isBrowser&&(document.readyState==="complete"||dojo.config.afterOnLoad)){window.setTimeout(dojo._loadInit,100);}})();

//==========_base.js ==========//
/*
Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
Available via Academic Free License >= 2.1 OR the modified BSD license.
see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.gfx._base"]){
dojo._hasResource["dojox.gfx._base"]=true;
dojo.provide("dojox.gfx._base");
(function(){
var g=dojox.gfx,b=g._base;
g._hasClass=function(_1,_2){
var _3=_1.getAttribute("className");
return _3&&(" "+_3+" ").indexOf(" "+_2+" ")>=0;
};
g._addClass=function(_4,_5){
var _6=_4.getAttribute("className")||"";
if(!_6||(" "+_6+" ").indexOf(" "+_5+" ")<0){
_4.setAttribute("className",_6+(_6?" ":"")+_5);
}
};
g._removeClass=function(_7,_8){
var _9=_7.getAttribute("className");
if(_9){
_7.setAttribute("className",_9.replace(new RegExp("(^|\\s+)"+_8+"(\\s+|$)"),"$1$2"));
}
};
b._getFontMeasurements=function(){
var _a={"1em":0,"1ex":0,"100%":0,"12pt":0,"16px":0,"xx-small":0,"x-small":0,"small":0,"medium":0,"large":0,"x-large":0,"xx-large":0};
if(dojo.isIE){
dojo.doc.documentElement.style.fontSize="100%";
}
var _b=dojo.doc.createElement("div");
var s=_b.style;
s.position="absolute";
s.top="-100px";
s.left="0px";
s.width="30px";
s.height="1000em";
s.borderWidth="0px";
s.margin="0px";
s.padding="0px";
s.outline="none";
s.lineHeight="1";
s.overflow="hidden";
dojo.body().appendChild(_b);
for(var p in _a){
_b.style.fontSize=p;
_a[p]=Math.round(_b.offsetHeight*12/16)*16/12/1000;
}
dojo.body().removeChild(_b);
_b=null;
return _a;
};
var _c=null;
b._getCachedFontMeasurements=function(_d){
if(_d||!_c){
_c=b._getFontMeasurements();
}
return _c;
};
var _e=null,_f={};
b._getTextBox=function(_10,_11,_12){
var m,s,al=arguments.length;
if(!_e){
m=_e=dojo.doc.createElement("div");
s=m.style;
s.position="absolute";
s.top="-10000px";
s.left="0";
dojo.body().appendChild(m);
}else{
m=_e;
s=m.style;
}
m.className="";
s.borderWidth="0";
s.margin="0";
s.padding="0";
s.outline="0";
if(al>1&&_11){
for(var i in _11){
if(i in _f){
continue;
}
s[i]=_11[i];
}
}
if(al>2&&_12){
m.className=_12;
}
m.innerHTML=_10;
if(m["getBoundingClientRect"]){
var bcr=m.getBoundingClientRect();
return {l:bcr.left,t:bcr.top,w:bcr.width||(bcr.right-bcr.left),h:bcr.height||(bcr.bottom-bcr.top)};
}else{
return dojo.marginBox(m);
}
};
var _13=0;
b._getUniqueId=function(){
var id;
do{
id=dojo._scopeName+"Unique"+(++_13);
}while(dojo.byId(id));
return id;
};
})();
dojo.mixin(dojox.gfx,{defaultPath:{type:"path",path:""},defaultPolyline:{type:"polyline",points:[]},defaultRect:{type:"rect",x:0,y:0,width:100,height:100,r:0},defaultEllipse:{type:"ellipse",cx:0,cy:0,rx:200,ry:100},defaultCircle:{type:"circle",cx:0,cy:0,r:100},defaultLine:{type:"line",x1:0,y1:0,x2:100,y2:100},defaultImage:{type:"image",x:0,y:0,width:0,height:0,src:""},defaultText:{type:"text",x:0,y:0,text:"",align:"start",decoration:"none",rotated:false,kerning:true},defaultTextPath:{type:"textpath",text:"",align:"start",decoration:"none",rotated:false,kerning:true},defaultStroke:{type:"stroke",color:"black",style:"solid",width:1,cap:"butt",join:4},defaultLinearGradient:{type:"linear",x1:0,y1:0,x2:100,y2:100,colors:[{offset:0,color:"black"},{offset:1,color:"white"}]},defaultRadialGradient:{type:"radial",cx:0,cy:0,r:100,colors:[{offset:0,color:"black"},{offset:1,color:"white"}]},defaultPattern:{type:"pattern",x:0,y:0,width:0,height:0,src:""},defaultFont:{type:"font",style:"normal",variant:"normal",weight:"normal",size:"10pt",family:"serif"},getDefault:(function(){
var _14={};
return function(_15){
var t=_14[_15];
if(t){
return new t();
}
t=_14[_15]=new Function;
t.prototype=dojox.gfx["default"+_15];
return new t();
};
})(),normalizeColor:function(_16){
return (_16 instanceof dojo.Color)?_16:new dojo.Color(_16);
},normalizeParameters:function(_17,_18){
if(_18){
var _19={};
for(var x in _17){
if(x in _18&&!(x in _19)){
_17[x]=_18[x];
}
}
}
return _17;
},makeParameters:function(_1a,_1b){
if(!_1b){
return dojo.delegate(_1a);
}
var _1c={};
for(var i in _1a){
if(!(i in _1c)){
_1c[i]=dojo.clone((i in _1b)?_1b[i]:_1a[i]);
}
}
return _1c;
},formatNumber:function(x,_1d){
var val=x.toString();
if(val.indexOf("e")>=0){
val=x.toFixed(4);
}else{
var _1e=val.indexOf(".");
if(_1e>=0&&val.length-_1e>5){
val=x.toFixed(4);
}
}
if(x<0){
return val;
}
return _1d?" "+val:val;
},makeFontString:function(_1f){
return _1f.style+" "+_1f.variant+" "+_1f.weight+" "+_1f.size+" "+_1f.family;
},splitFontString:function(str){
var _20=dojox.gfx.getDefault("Font");
var t=str.split(/\s+/);
do{
if(t.length<5){
break;
}
_20.style=t[0];
_20.variant=t[1];
_20.weight=t[2];
var i=t[3].indexOf("/");
_20.size=i<0?t[3]:t[3].substring(0,i);
var j=4;
if(i<0){
if(t[4]=="/"){
j=6;
}else{
if(t[4].charAt(0)=="/"){
j=5;
}
}
}
if(j<t.length){
_20.family=t.slice(j).join(" ");
}
}while(false);
return _20;
},cm_in_pt:72/2.54,mm_in_pt:7.2/2.54,px_in_pt:function(){
return dojox.gfx._base._getCachedFontMeasurements()["12pt"]/12;
},pt2px:function(len){
return len*dojox.gfx.px_in_pt();
},px2pt:function(len){
return len/dojox.gfx.px_in_pt();
},normalizedLength:function(len){
if(len.length==0){
return 0;
}
if(len.length>2){
var _21=dojox.gfx.px_in_pt();
var val=parseFloat(len);
switch(len.slice(-2)){
case "px":
return val;
case "pt":
return val*_21;
case "in":
return val*72*_21;
case "pc":
return val*12*_21;
case "mm":
return val*dojox.gfx.mm_in_pt*_21;
case "cm":
return val*dojox.gfx.cm_in_pt*_21;
}
}
return parseFloat(len);
},pathVmlRegExp:/([A-Za-z]+)|(\d+(\.\d+)?)|(\.\d+)|(-\d+(\.\d+)?)|(-\.\d+)/g,pathSvgRegExp:/([A-Za-z])|(\d+(\.\d+)?)|(\.\d+)|(-\d+(\.\d+)?)|(-\.\d+)/g,equalSources:function(a,b){
return a&&b&&a==b;
}});
}


//=============matrix.js================//
/*
Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
Available via Academic Free License >= 2.1 OR the modified BSD license.
see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.gfx.matrix"]){
dojo._hasResource["dojox.gfx.matrix"]=true;
dojo.provide("dojox.gfx.matrix");
(function(){
var m=dojox.gfx.matrix;
var _1={};
m._degToRad=function(_2){
return _1[_2]||(_1[_2]=(Math.PI*_2/180));
};
m._radToDeg=function(_3){
return _3/Math.PI*180;
};
m.Matrix2D=function(_4){
if(_4){
if(typeof _4=="number"){
this.xx=this.yy=_4;
}else{
if(_4 instanceof Array){
if(_4.length>0){
var _5=m.normalize(_4[0]);
for(var i=1;i<_4.length;++i){
var l=_5,r=dojox.gfx.matrix.normalize(_4[i]);
_5=new m.Matrix2D();
_5.xx=l.xx*r.xx+l.xy*r.yx;
_5.xy=l.xx*r.xy+l.xy*r.yy;
_5.yx=l.yx*r.xx+l.yy*r.yx;
_5.yy=l.yx*r.xy+l.yy*r.yy;
_5.dx=l.xx*r.dx+l.xy*r.dy+l.dx;
_5.dy=l.yx*r.dx+l.yy*r.dy+l.dy;
}
dojo.mixin(this,_5);
}
}else{
dojo.mixin(this,_4);
}
}
}
};
dojo.extend(m.Matrix2D,{xx:1,xy:0,yx:0,yy:1,dx:0,dy:0});
dojo.mixin(m,{identity:new m.Matrix2D(),flipX:new m.Matrix2D({xx:-1}),flipY:new m.Matrix2D({yy:-1}),flipXY:new m.Matrix2D({xx:-1,yy:-1}),translate:function(a,b){
if(arguments.length>1){
return new m.Matrix2D({dx:a,dy:b});
}
return new m.Matrix2D({dx:a.x,dy:a.y});
},scale:function(a,b){
if(arguments.length>1){
return new m.Matrix2D({xx:a,yy:b});
}
if(typeof a=="number"){
return new m.Matrix2D({xx:a,yy:a});
}
return new m.Matrix2D({xx:a.x,yy:a.y});
},rotate:function(_6){
var c=Math.cos(_6);
var s=Math.sin(_6);
return new m.Matrix2D({xx:c,xy:-s,yx:s,yy:c});
},rotateg:function(_7){
return m.rotate(m._degToRad(_7));
},skewX:function(_8){
return new m.Matrix2D({xy:Math.tan(_8)});
},skewXg:function(_9){
return m.skewX(m._degToRad(_9));
},skewY:function(_a){
return new m.Matrix2D({yx:Math.tan(_a)});
},skewYg:function(_b){
return m.skewY(m._degToRad(_b));
},reflect:function(a,b){
if(arguments.length==1){
b=a.y;
a=a.x;
}
var a2=a*a,b2=b*b,n2=a2+b2,xy=2*a*b/n2;
return new m.Matrix2D({xx:2*a2/n2-1,xy:xy,yx:xy,yy:2*b2/n2-1});
},project:function(a,b){
if(arguments.length==1){
b=a.y;
a=a.x;
}
var a2=a*a,b2=b*b,n2=a2+b2,xy=a*b/n2;
return new m.Matrix2D({xx:a2/n2,xy:xy,yx:xy,yy:b2/n2});
},normalize:function(_c){
return (_c instanceof m.Matrix2D)?_c:new m.Matrix2D(_c);
},clone:function(_d){
var _e=new m.Matrix2D();
for(var i in _d){
if(typeof (_d[i])=="number"&&typeof (_e[i])=="number"&&_e[i]!=_d[i]){
_e[i]=_d[i];
}
}
return _e;
},invert:function(_f){
var M=m.normalize(_f),D=M.xx*M.yy-M.xy*M.yx,M=new m.Matrix2D({xx:M.yy/D,xy:-M.xy/D,yx:-M.yx/D,yy:M.xx/D,dx:(M.xy*M.dy-M.yy*M.dx)/D,dy:(M.yx*M.dx-M.xx*M.dy)/D});
return M;
},_multiplyPoint:function(_10,x,y){
return {x:_10.xx*x+_10.xy*y+_10.dx,y:_10.yx*x+_10.yy*y+_10.dy};
},multiplyPoint:function(_11,a,b){
var M=m.normalize(_11);
if(typeof a=="number"&&typeof b=="number"){
return m._multiplyPoint(M,a,b);
}
return m._multiplyPoint(M,a.x,a.y);
},multiply:function(_12){
var M=m.normalize(_12);
for(var i=1;i<arguments.length;++i){
var l=M,r=m.normalize(arguments[i]);
M=new m.Matrix2D();
M.xx=l.xx*r.xx+l.xy*r.yx;
M.xy=l.xx*r.xy+l.xy*r.yy;
M.yx=l.yx*r.xx+l.yy*r.yx;
M.yy=l.yx*r.xy+l.yy*r.yy;
M.dx=l.xx*r.dx+l.xy*r.dy+l.dx;
M.dy=l.yx*r.dx+l.yy*r.dy+l.dy;
}
return M;
},_sandwich:function(_13,x,y){
return m.multiply(m.translate(x,y),_13,m.translate(-x,-y));
},scaleAt:function(a,b,c,d){
switch(arguments.length){
case 4:
return m._sandwich(m.scale(a,b),c,d);
case 3:
if(typeof c=="number"){
return m._sandwich(m.scale(a),b,c);
}
return m._sandwich(m.scale(a,b),c.x,c.y);
}
return m._sandwich(m.scale(a),b.x,b.y);
},rotateAt:function(_14,a,b){
if(arguments.length>2){
return m._sandwich(m.rotate(_14),a,b);
}
return m._sandwich(m.rotate(_14),a.x,a.y);
},rotategAt:function(_15,a,b){
if(arguments.length>2){
return m._sandwich(m.rotateg(_15),a,b);
}
return m._sandwich(m.rotateg(_15),a.x,a.y);
},skewXAt:function(_16,a,b){
if(arguments.length>2){
return m._sandwich(m.skewX(_16),a,b);
}
return m._sandwich(m.skewX(_16),a.x,a.y);
},skewXgAt:function(_17,a,b){
if(arguments.length>2){
return m._sandwich(m.skewXg(_17),a,b);
}
return m._sandwich(m.skewXg(_17),a.x,a.y);
},skewYAt:function(_18,a,b){
if(arguments.length>2){
return m._sandwich(m.skewY(_18),a,b);
}
return m._sandwich(m.skewY(_18),a.x,a.y);
},skewYgAt:function(_19,a,b){
if(arguments.length>2){
return m._sandwich(m.skewYg(_19),a,b);
}
return m._sandwich(m.skewYg(_19),a.x,a.y);
}});
})();
dojox.gfx.Matrix2D=dojox.gfx.matrix.Matrix2D;
}
 
 //===================shape.js==============//
/*
Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
Available via Academic Free License >= 2.1 OR the modified BSD license.
see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.gfx.shape"]){
dojo._hasResource["dojox.gfx.shape"]=true;
dojo.provide("dojox.gfx.shape");
dojo.require("dojox.gfx._base");
dojo.declare("dojox.gfx.Shape",null,{constructor:function(){
this.rawNode=null;
this.shape=null;
this.matrix=null;
this.fillStyle=null;
this.strokeStyle=null;
this.bbox=null;
this.parent=null;
this.parentMatrix=null;
},getNode:function(){
return this.rawNode;
},getShape:function(){
return this.shape;
},getTransform:function(){
return this.matrix;
},getFill:function(){
return this.fillStyle;
},getStroke:function(){
return this.strokeStyle;
},getParent:function(){
return this.parent;
},getBoundingBox:function(){
return this.bbox;
},getTransformedBoundingBox:function(){
var b=this.getBoundingBox();
if(!b){
return null;
}
var m=this._getRealMatrix();
gm=dojox.gfx.matrix;
return [gm.multiplyPoint(m,b.x,b.y),gm.multiplyPoint(m,b.x+b.width,b.y),gm.multiplyPoint(m,b.x+b.width,b.y+b.height),gm.multiplyPoint(m,b.x,b.y+b.height)];
},getEventSource:function(){
return this.rawNode;
},setShape:function(_1){
this.shape=dojox.gfx.makeParameters(this.shape,_1);
this.bbox=null;
return this;
},setFill:function(_2){
if(!_2){
this.fillStyle=null;
return this;
}
var f=null;
if(typeof (_2)=="object"&&"type" in _2){
switch(_2.type){
case "linear":
f=dojox.gfx.makeParameters(dojox.gfx.defaultLinearGradient,_2);
break;
case "radial":
f=dojox.gfx.makeParameters(dojox.gfx.defaultRadialGradient,_2);
break;
case "pattern":
f=dojox.gfx.makeParameters(dojox.gfx.defaultPattern,_2);
break;
}
}else{
f=dojox.gfx.normalizeColor(_2);
}
this.fillStyle=f;
return this;
},setStroke:function(_3){
if(!_3){
this.strokeStyle=null;
return this;
}
if(typeof _3=="string"||dojo.isArray(_3)||_3 instanceof dojo.Color){
_3={color:_3};
}
var s=this.strokeStyle=dojox.gfx.makeParameters(dojox.gfx.defaultStroke,_3);
s.color=dojox.gfx.normalizeColor(s.color);
return this;
},setTransform:function(_4){
this.matrix=dojox.gfx.matrix.clone(_4?dojox.gfx.matrix.normalize(_4):dojox.gfx.matrix.identity);
return this._applyTransform();
},_applyTransform:function(){
return this;
},moveToFront:function(){
var p=this.getParent();
if(p){
p._moveChildToFront(this);
this._moveToFront();
}
return this;
},moveToBack:function(){
var p=this.getParent();
if(p){
p._moveChildToBack(this);
this._moveToBack();
}
return this;
},_moveToFront:function(){
},_moveToBack:function(){
},applyRightTransform:function(_5){
return _5?this.setTransform([this.matrix,_5]):this;
},applyLeftTransform:function(_6){
return _6?this.setTransform([_6,this.matrix]):this;
},applyTransform:function(_7){
return _7?this.setTransform([this.matrix,_7]):this;
},removeShape:function(_8){
if(this.parent){
this.parent.remove(this,_8);
}
return this;
},_setParent:function(_9,_a){
this.parent=_9;
return this._updateParentMatrix(_a);
},_updateParentMatrix:function(_b){
this.parentMatrix=_b?dojox.gfx.matrix.clone(_b):null;
return this._applyTransform();
},_getRealMatrix:function(){
var m=this.matrix;
var p=this.parent;
while(p){
if(p.matrix){
m=dojox.gfx.matrix.multiply(p.matrix,m);
}
p=p.parent;
}
return m;
}});
dojox.gfx.shape._eventsProcessing={connect:function(_c,_d,_e){
return arguments.length>2?dojo.connect(this.getEventSource(),_c,_d,_e):dojo.connect(this.getEventSource(),_c,_d);
},disconnect:function(_f){
dojo.disconnect(_f);
}};
dojo.extend(dojox.gfx.Shape,dojox.gfx.shape._eventsProcessing);
dojox.gfx.shape.Container={_init:function(){
this.children=[];
},openBatch:function(){
},closeBatch:function(){
},add:function(_10){
var _11=_10.getParent();
if(_11){
_11.remove(_10,true);
}
this.children.push(_10);
return _10._setParent(this,this._getRealMatrix());
},remove:function(_12,_13){
for(var i=0;i<this.children.length;++i){
if(this.children[i]==_12){
if(_13){
}else{
_12.parent=null;
_12.parentMatrix=null;
}
this.children.splice(i,1);
break;
}
}
return this;
},clear:function(){
this.children=[];
return this;
},_moveChildToFront:function(_14){
for(var i=0;i<this.children.length;++i){
if(this.children[i]==_14){
this.children.splice(i,1);
this.children.push(_14);
break;
}
}
return this;
},_moveChildToBack:function(_15){
for(var i=0;i<this.children.length;++i){
if(this.children[i]==_15){
this.children.splice(i,1);
this.children.unshift(_15);
break;
}
}
return this;
}};
dojo.declare("dojox.gfx.shape.Surface",null,{constructor:function(){
this.rawNode=null;
this._parent=null;
this._nodes=[];
this._events=[];
},destroy:function(){
dojo.forEach(this._nodes,dojo.destroy);
this._nodes=[];
dojo.forEach(this._events,dojo.disconnect);
this._events=[];
this.rawNode=null;
if(dojo.isIE){
while(this._parent.lastChild){
dojo.destroy(this._parent.lastChild);
}
}else{
this._parent.innerHTML="";
}
this._parent=null;
},getEventSource:function(){
return this.rawNode;
},_getRealMatrix:function(){
return null;
},isLoaded:true,onLoad:function(_16){
},whenLoaded:function(_17,_18){
var f=dojo.hitch(_17,_18);
if(this.isLoaded){
f(this);
}else{
var h=dojo.connect(this,"onLoad",function(_19){
dojo.disconnect(h);
f(_19);
});
}
}});
dojo.extend(dojox.gfx.shape.Surface,dojox.gfx.shape._eventsProcessing);
dojo.declare("dojox.gfx.Point",null,{});
dojo.declare("dojox.gfx.Rectangle",null,{});
dojo.declare("dojox.gfx.shape.Rect",dojox.gfx.Shape,{constructor:function(_1a){
this.shape=dojox.gfx.getDefault("Rect");
this.rawNode=_1a;
},getBoundingBox:function(){
return this.shape;
}});
dojo.declare("dojox.gfx.shape.Ellipse",dojox.gfx.Shape,{constructor:function(_1b){
this.shape=dojox.gfx.getDefault("Ellipse");
this.rawNode=_1b;
},getBoundingBox:function(){
if(!this.bbox){
var _1c=this.shape;
this.bbox={x:_1c.cx-_1c.rx,y:_1c.cy-_1c.ry,width:2*_1c.rx,height:2*_1c.ry};
}
return this.bbox;
}});
dojo.declare("dojox.gfx.shape.Circle",dojox.gfx.Shape,{constructor:function(_1d){
this.shape=dojox.gfx.getDefault("Circle");
this.rawNode=_1d;
},getBoundingBox:function(){
if(!this.bbox){
var _1e=this.shape;
this.bbox={x:_1e.cx-_1e.r,y:_1e.cy-_1e.r,width:2*_1e.r,height:2*_1e.r};
}
return this.bbox;
}});
dojo.declare("dojox.gfx.shape.Line",dojox.gfx.Shape,{constructor:function(_1f){
this.shape=dojox.gfx.getDefault("Line");
this.rawNode=_1f;
},getBoundingBox:function(){
if(!this.bbox){
var _20=this.shape;
this.bbox={x:Math.min(_20.x1,_20.x2),y:Math.min(_20.y1,_20.y2),width:Math.abs(_20.x2-_20.x1),height:Math.abs(_20.y2-_20.y1)};
}
return this.bbox;
}});
dojo.declare("dojox.gfx.shape.Polyline",dojox.gfx.Shape,{constructor:function(_21){
this.shape=dojox.gfx.getDefault("Polyline");
this.rawNode=_21;
},setShape:function(_22,_23){
if(_22&&_22 instanceof Array){
dojox.gfx.Shape.prototype.setShape.call(this,{points:_22});
if(_23&&this.shape.points.length){
this.shape.points.push(this.shape.points[0]);
}
}else{
dojox.gfx.Shape.prototype.setShape.call(this,_22);
}
return this;
},_normalizePoints:function(){
var p=this.shape.points,l=p&&p.length;
if(l&&typeof p[0]=="number"){
var _24=[];
for(var i=0;i<l;i+=2){
_24.push({x:p[i],y:p[i+1]});
}
this.shape.points=_24;
}
},getBoundingBox:function(){
if(!this.bbox&&this.shape.points.length){
var p=this.shape.points;
var l=p.length;
var t=p[0];
var _25={l:t.x,t:t.y,r:t.x,b:t.y};
for(var i=1;i<l;++i){
t=p[i];
if(_25.l>t.x){
_25.l=t.x;
}
if(_25.r<t.x){
_25.r=t.x;
}
if(_25.t>t.y){
_25.t=t.y;
}
if(_25.b<t.y){
_25.b=t.y;
}
}
this.bbox={x:_25.l,y:_25.t,width:_25.r-_25.l,height:_25.b-_25.t};
}
return this.bbox;
}});
dojo.declare("dojox.gfx.shape.Image",dojox.gfx.Shape,{constructor:function(_26){
this.shape=dojox.gfx.getDefault("Image");
this.rawNode=_26;
},getBoundingBox:function(){
return this.shape;
},setStroke:function(){
return this;
},setFill:function(){
return this;
}});
dojo.declare("dojox.gfx.shape.Text",dojox.gfx.Shape,{constructor:function(_27){
this.fontStyle=null;
this.shape=dojox.gfx.getDefault("Text");
this.rawNode=_27;
},getFont:function(){
return this.fontStyle;
},setFont:function(_28){
this.fontStyle=typeof _28=="string"?dojox.gfx.splitFontString(_28):dojox.gfx.makeParameters(dojox.gfx.defaultFont,_28);
this._setFont();
return this;
}});
dojox.gfx.shape.Creator={createShape:function(_29){
var gfx=dojox.gfx;
switch(_29.type){
case gfx.defaultPath.type:
return this.createPath(_29);
case gfx.defaultRect.type:
return this.createRect(_29);
case gfx.defaultCircle.type:
return this.createCircle(_29);
case gfx.defaultEllipse.type:
return this.createEllipse(_29);
case gfx.defaultLine.type:
return this.createLine(_29);
case gfx.defaultPolyline.type:
return this.createPolyline(_29);
case gfx.defaultImage.type:
return this.createImage(_29);
case gfx.defaultText.type:
return this.createText(_29);
case gfx.defaultTextPath.type:
return this.createTextPath(_29);
}
return null;
},createGroup:function(){
return this.createObject(dojox.gfx.Group);
},createRect:function(_2a){
return this.createObject(dojox.gfx.Rect,_2a);
},createEllipse:function(_2b){
return this.createObject(dojox.gfx.Ellipse,_2b);
},createCircle:function(_2c){
return this.createObject(dojox.gfx.Circle,_2c);
},createLine:function(_2d){
return this.createObject(dojox.gfx.Line,_2d);
},createPolyline:function(_2e){
return this.createObject(dojox.gfx.Polyline,_2e);
},createImage:function(_2f){
return this.createObject(dojox.gfx.Image,_2f);
},createText:function(_30){
return this.createObject(dojox.gfx.Text,_30);
},createPath:function(_31){
return this.createObject(dojox.gfx.Path,_31);
},createTextPath:function(_32){
return this.createObject(dojox.gfx.TextPath,{}).setText(_32);
},createObject:function(_33,_34){
return null;
}};
}


 //================path.js==============//
/*
Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
Available via Academic Free License >= 2.1 OR the modified BSD license.
see: http://dojotoolkit.org/license for details
*/
 

if(!dojo._hasResource["dojox.gfx.path"]){
dojo._hasResource["dojox.gfx.path"]=true;
dojo.provide("dojox.gfx.path");
dojo.require("dojox.gfx.matrix");
dojo.require("dojox.gfx.shape");
dojo.declare("dojox.gfx.path.Path",dojox.gfx.Shape,{constructor:function(_1){
this.shape=dojo.clone(dojox.gfx.defaultPath);
this.segments=[];
this.tbbox=null;
this.absolute=true;
this.last={};
this.rawNode=_1;
this.segmented=false;
},setAbsoluteMode:function(_2){
this._confirmSegmented();
this.absolute=typeof _2=="string"?(_2=="absolute"):_2;
return this;
},getAbsoluteMode:function(){
this._confirmSegmented();
return this.absolute;
},getBoundingBox:function(){
this._confirmSegmented();
return (this.bbox&&("l" in this.bbox))?{x:this.bbox.l,y:this.bbox.t,width:this.bbox.r-this.bbox.l,height:this.bbox.b-this.bbox.t}:null;
},_getRealBBox:function(){
this._confirmSegmented();
if(this.tbbox){
return this.tbbox;
}
var _3=this.bbox,_4=this._getRealMatrix();
this.bbox=null;
for(var i=0,_5=this.segments.length;i<_5;++i){
this._updateWithSegment(this.segments[i],_4);
}
var t=this.bbox;
this.bbox=_3;
this.tbbox=t?[{x:t.l,y:t.t},{x:t.r,y:t.t},{x:t.r,y:t.b},{x:t.l,y:t.b}]:null;
return this.tbbox;
},getLastPosition:function(){
this._confirmSegmented();
return "x" in this.last?this.last:null;
},_applyTransform:function(){
this.tbbox=null;
return dojox.gfx.Shape.prototype._applyTransform.call(this);
},_updateBBox:function(x,y,_6){
if(_6){
var t=dojox.gfx.matrix.multiplyPoint(_6,x,y);
x=t.x;
y=t.y;
}
if(this.bbox&&("l" in this.bbox)){
if(this.bbox.l>x){
this.bbox.l=x;
}
if(this.bbox.r<x){
this.bbox.r=x;
}
if(this.bbox.t>y){
this.bbox.t=y;
}
if(this.bbox.b<y){
this.bbox.b=y;
}
}else{
this.bbox={l:x,b:y,r:x,t:y};
}
},_updateWithSegment:function(_7,_8){
var n=_7.args,l=n.length;
switch(_7.action){
case "M":
case "L":
case "C":
case "S":
case "Q":
case "T":
for(var i=0;i<l;i+=2){
this._updateBBox(n[i],n[i+1],_8);
}
this.last.x=n[l-2];
this.last.y=n[l-1];
this.absolute=true;
break;
case "H":
for(var i=0;i<l;++i){
this._updateBBox(n[i],this.last.y,_8);
}
this.last.x=n[l-1];
this.absolute=true;
break;
case "V":
for(var i=0;i<l;++i){
this._updateBBox(this.last.x,n[i],_8);
}
this.last.y=n[l-1];
this.absolute=true;
break;
case "m":
var _9=0;
if(!("x" in this.last)){
this._updateBBox(this.last.x=n[0],this.last.y=n[1],_8);
_9=2;
}
for(var i=_9;i<l;i+=2){
this._updateBBox(this.last.x+=n[i],this.last.y+=n[i+1],_8);
}
this.absolute=false;
break;
case "l":
case "t":
for(var i=0;i<l;i+=2){
this._updateBBox(this.last.x+=n[i],this.last.y+=n[i+1],_8);
}
this.absolute=false;
break;
case "h":
for(var i=0;i<l;++i){
this._updateBBox(this.last.x+=n[i],this.last.y,_8);
}
this.absolute=false;
break;
case "v":
for(var i=0;i<l;++i){
this._updateBBox(this.last.x,this.last.y+=n[i],_8);
}
this.absolute=false;
break;
case "c":
for(var i=0;i<l;i+=6){
this._updateBBox(this.last.x+n[i],this.last.y+n[i+1],_8);
this._updateBBox(this.last.x+n[i+2],this.last.y+n[i+3],_8);
this._updateBBox(this.last.x+=n[i+4],this.last.y+=n[i+5],_8);
}
this.absolute=false;
break;
case "s":
case "q":
for(var i=0;i<l;i+=4){
this._updateBBox(this.last.x+n[i],this.last.y+n[i+1],_8);
this._updateBBox(this.last.x+=n[i+2],this.last.y+=n[i+3],_8);
}
this.absolute=false;
break;
case "A":
for(var i=0;i<l;i+=7){
this._updateBBox(n[i+5],n[i+6],_8);
}
this.last.x=n[l-2];
this.last.y=n[l-1];
this.absolute=true;
break;
case "a":
for(var i=0;i<l;i+=7){
this._updateBBox(this.last.x+=n[i+5],this.last.y+=n[i+6],_8);
}
this.absolute=false;
break;
}
var _a=[_7.action];
for(var i=0;i<l;++i){
_a.push(dojox.gfx.formatNumber(n[i],true));
}
if(typeof this.shape.path=="string"){
this.shape.path+=_a.join("");
}else{
Array.prototype.push.apply(this.shape.path,_a);
}
},_validSegments:{m:2,l:2,h:1,v:1,c:6,s:4,q:4,t:2,a:7,z:0},_pushSegment:function(_b,_c){
this.tbbox=null;
var _d=this._validSegments[_b.toLowerCase()];
if(typeof _d=="number"){
if(_d){
if(_c.length>=_d){
var _e={action:_b,args:_c.slice(0,_c.length-_c.length%_d)};
this.segments.push(_e);
this._updateWithSegment(_e);
}
}else{
var _e={action:_b,args:[]};
this.segments.push(_e);
this._updateWithSegment(_e);
}
}
},_collectArgs:function(_f,_10){
for(var i=0;i<_10.length;++i){
var t=_10[i];
if(typeof t=="boolean"){
_f.push(t?1:0);
}else{
if(typeof t=="number"){
_f.push(t);
}else{
if(t instanceof Array){
this._collectArgs(_f,t);
}else{
if("x" in t&&"y" in t){
_f.push(t.x,t.y);
}
}
}
}
}
},moveTo:function(){
this._confirmSegmented();
var _11=[];
this._collectArgs(_11,arguments);
this._pushSegment(this.absolute?"M":"m",_11);
return this;
},lineTo:function(){
this._confirmSegmented();
var _12=[];
this._collectArgs(_12,arguments);
this._pushSegment(this.absolute?"L":"l",_12);
return this;
},hLineTo:function(){
this._confirmSegmented();
var _13=[];
this._collectArgs(_13,arguments);
this._pushSegment(this.absolute?"H":"h",_13);
return this;
},vLineTo:function(){
this._confirmSegmented();
var _14=[];
this._collectArgs(_14,arguments);
this._pushSegment(this.absolute?"V":"v",_14);
return this;
},curveTo:function(){
this._confirmSegmented();
var _15=[];
this._collectArgs(_15,arguments);
this._pushSegment(this.absolute?"C":"c",_15);
return this;
},smoothCurveTo:function(){
this._confirmSegmented();
var _16=[];
this._collectArgs(_16,arguments);
this._pushSegment(this.absolute?"S":"s",_16);
return this;
},qCurveTo:function(){
this._confirmSegmented();
var _17=[];
this._collectArgs(_17,arguments);
this._pushSegment(this.absolute?"Q":"q",_17);
return this;
},qSmoothCurveTo:function(){
this._confirmSegmented();
var _18=[];
this._collectArgs(_18,arguments);
this._pushSegment(this.absolute?"T":"t",_18);
return this;
},arcTo:function(){
this._confirmSegmented();
var _19=[];
this._collectArgs(_19,arguments);
this._pushSegment(this.absolute?"A":"a",_19);
return this;
},closePath:function(){
this._confirmSegmented();
this._pushSegment("Z",[]);
return this;
},_confirmSegmented:function(){
if(!this.segmented){
var _1a=this.shape.path;
this.shape.path=[];
this._setPath(_1a);
this.shape.path=this.shape.path.join("");
this.segmented=true;
}
},_setPath:function(_1b){
var p=dojo.isArray(_1b)?_1b:_1b.match(dojox.gfx.pathSvgRegExp);
this.segments=[];
this.absolute=true;
this.bbox={};
this.last={};
if(!p){
return;
}
var _1c="",_1d=[],l=p.length;
for(var i=0;i<l;++i){
var t=p[i],x=parseFloat(t);
if(isNaN(x)){
if(_1c){
this._pushSegment(_1c,_1d);
}
_1d=[];
_1c=t;
}else{
_1d.push(x);
}
}
this._pushSegment(_1c,_1d);
},setShape:function(_1e){
dojox.gfx.Shape.prototype.setShape.call(this,typeof _1e=="string"?{path:_1e}:_1e);
this.segmented=false;
this.segments=[];
if(!dojox.gfx.lazyPathSegmentation){
this._confirmSegmented();
}
return this;
},_2PI:Math.PI*2});
dojo.declare("dojox.gfx.path.TextPath",dojox.gfx.path.Path,{constructor:function(_1f){
if(!("text" in this)){
this.text=dojo.clone(dojox.gfx.defaultTextPath);
}
if(!("fontStyle" in this)){
this.fontStyle=dojo.clone(dojox.gfx.defaultFont);
}
},getText:function(){
return this.text;
},setText:function(_20){
this.text=dojox.gfx.makeParameters(this.text,typeof _20=="string"?{text:_20}:_20);
this._setText();
return this;
},getFont:function(){
return this.fontStyle;
},setFont:function(_21){
this.fontStyle=typeof _21=="string"?dojox.gfx.splitFontString(_21):dojox.gfx.makeParameters(dojox.gfx.defaultFont,_21);
this._setFont();
return this;
}});
}


//=================grdient.js=======================//
/*
Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
Available via Academic Free License >= 2.1 OR the modified BSD license.
see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.gfx.gradient"]){
dojo._hasResource["dojox.gfx.gradient"]=true;
dojo.provide("dojox.gfx.gradient");
dojo.require("dojox.gfx.matrix");
(function(){
var d=dojo,m=dojox.gfx.matrix,C=d.Color;
dojox.gfx.gradient.rescale=function(_1,_2,to){
var _3=_1.length,_4=(to<_2),_5;
if(_4){
var _6=_2;
_2=to;
to=_6;
}
if(!_3){
return [];
}
if(to<=_1[0].offset){
_5=[{offset:0,color:_1[0].color},{offset:1,color:_1[0].color}];
}else{
if(_2>=_1[_3-1].offset){
_5=[{offset:0,color:_1[_3-1].color},{offset:1,color:_1[_3-1].color}];
}else{
var _7=to-_2,_8,_9,i;
_5=[];
if(_2<0){
_5.push({offset:0,color:new C(_1[0].color)});
}
for(i=0;i<_3;++i){
_8=_1[i];
if(_8.offset>=_2){
break;
}
}
if(i){
_9=_1[i-1];
_5.push({offset:0,color:d.blendColors(new C(_9.color),new C(_8.color),(_2-_9.offset)/(_8.offset-_9.offset))});
}else{
_5.push({offset:0,color:new C(_8.color)});
}
for(;i<_3;++i){
_8=_1[i];
if(_8.offset>=to){
break;
}
_5.push({offset:(_8.offset-_2)/_7,color:new C(_8.color)});
}
if(i<_3){
_9=_1[i-1];
_5.push({offset:1,color:d.blendColors(new C(_9.color),new C(_8.color),(to-_9.offset)/(_8.offset-_9.offset))});
}else{
_5.push({offset:1,color:new C(_1[_3-1].color)});
}
}
}
if(_4){
_5.reverse();
for(i=0,_3=_5.length;i<_3;++i){
_8=_5[i];
_8.offset=1-_8.offset;
}
}
return _5;
};
function _a(x,y,_b,_c,_d,_e){
var r=m.multiplyPoint(_b,x,y),p=m.multiplyPoint(_c,r);
return {r:r,p:p,o:m.multiplyPoint(_d,p).x/_e};
};
function _f(a,b){
return a.o-b.o;
};
dojox.gfx.gradient.project=function(_10,_11,tl,rb,ttl,trb){
_10=_10||m.identity;
var f1=m.multiplyPoint(_10,_11.x1,_11.y1),f2=m.multiplyPoint(_10,_11.x2,_11.y2),_12=Math.atan2(f2.y-f1.y,f2.x-f1.x),_13=m.project(f2.x-f1.x,f2.y-f1.y),pf1=m.multiplyPoint(_13,f1),pf2=m.multiplyPoint(_13,f2),_14=new m.Matrix2D([m.rotate(-_12),{dx:-pf1.x,dy:-pf1.y}]),_15=m.multiplyPoint(_14,pf2).x,_16=[_a(tl.x,tl.y,_10,_13,_14,_15),_a(rb.x,rb.y,_10,_13,_14,_15),_a(tl.x,rb.y,_10,_13,_14,_15),_a(rb.x,tl.y,_10,_13,_14,_15)].sort(_f),_17=_16[0].o,to=_16[3].o,_18=dojox.gfx.gradient.rescale(_11.colors,_17,to),_19=Math.atan2(_16[3].r.y-_16[0].r.y,_16[3].r.x-_16[0].r.x);
return {type:"linear",x1:_16[0].p.x,y1:_16[0].p.y,x2:_16[3].p.x,y2:_16[3].p.y,colors:_18,angle:_12};
};
})();
}

//=======================gfx.js======================//

/*
Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
Available via Academic Free License >= 2.1 OR the modified BSD license.
see: http://dojotoolkit.org/license for details
*/

/*
This is an optimized version of Dojo, built for deployment and not for
development. To get sources and documentation, please visit:

http://dojotoolkit.org
*/

if (!dojo._hasResource["dojox.gfx.matrix"]) {
dojo._hasResource["dojox.gfx.matrix"] = true;
dojo.provide("dojox.gfx.matrix");
(function() {
	var m = dojox.gfx.matrix;
	var _1 = {};
	m._degToRad = function(_2) {
		return _1[_2] || (_1[_2] = (Math.PI * _2 / 180));
	};
	m._radToDeg = function(_3) {
		return _3 / Math.PI * 180;
	};
	m.Matrix2D = function(_4) {
		if (_4) {
			if (typeof _4 == "number") {
				this.xx = this.yy = _4;
			} else {
				if (_4 instanceof Array) {
					if (_4.length > 0) {
						var _5 = m.normalize(_4[0]);
						for ( var i = 1; i < _4.length; ++i) {
							var l = _5, r = dojox.gfx.matrix
									.normalize(_4[i]);
							_5 = new m.Matrix2D();
							_5.xx = l.xx * r.xx + l.xy * r.yx;
							_5.xy = l.xx * r.xy + l.xy * r.yy;
							_5.yx = l.yx * r.xx + l.yy * r.yx;
							_5.yy = l.yx * r.xy + l.yy * r.yy;
							_5.dx = l.xx * r.dx + l.xy * r.dy + l.dx;
							_5.dy = l.yx * r.dx + l.yy * r.dy + l.dy;
						}
						dojo.mixin(this, _5);
					}
				} else {
					dojo.mixin(this, _4);
				}
			}
		}
	};
	dojo.extend(m.Matrix2D, {
		xx : 1,
		xy : 0,
		yx : 0,
		yy : 1,
		dx : 0,
		dy : 0
	});
	dojo
			.mixin(
					m,
					{
						identity : new m.Matrix2D(),
						flipX : new m.Matrix2D({
							xx : -1
						}),
						flipY : new m.Matrix2D({
							yy : -1
						}),
						flipXY : new m.Matrix2D({
							xx : -1,
							yy : -1
						}),
						translate : function(a, b) {
							if (arguments.length > 1) {
								return new m.Matrix2D({
									dx : a,
									dy : b
								});
							}
							return new m.Matrix2D({
								dx : a.x,
								dy : a.y
							});
						},
						scale : function(a, b) {
							if (arguments.length > 1) {
								return new m.Matrix2D({
									xx : a,
									yy : b
								});
							}
							if (typeof a == "number") {
								return new m.Matrix2D({
									xx : a,
									yy : a
								});
							}
							return new m.Matrix2D({
								xx : a.x,
								yy : a.y
							});
						},
						rotate : function(_6) {
							var c = Math.cos(_6);
							var s = Math.sin(_6);
							return new m.Matrix2D({
								xx : c,
								xy : -s,
								yx : s,
								yy : c
							});
						},
						rotateg : function(_7) {
							return m.rotate(m._degToRad(_7));
						},
						skewX : function(_8) {
							return new m.Matrix2D({
								xy : Math.tan(_8)
							});
						},
						skewXg : function(_9) {
							return m.skewX(m._degToRad(_9));
						},
						skewY : function(_a) {
							return new m.Matrix2D({
								yx : Math.tan(_a)
							});
						},
						skewYg : function(_b) {
							return m.skewY(m._degToRad(_b));
						},
						reflect : function(a, b) {
							if (arguments.length == 1) {
								b = a.y;
								a = a.x;
							}
							var a2 = a * a, b2 = b * b, n2 = a2 + b2, xy = 2
									* a * b / n2;
							return new m.Matrix2D({
								xx : 2 * a2 / n2 - 1,
								xy : xy,
								yx : xy,
								yy : 2 * b2 / n2 - 1
							});
						},
						project : function(a, b) {
							if (arguments.length == 1) {
								b = a.y;
								a = a.x;
							}
							var a2 = a * a, b2 = b * b, n2 = a2 + b2, xy = a
									* b / n2;
							return new m.Matrix2D({
								xx : a2 / n2,
								xy : xy,
								yx : xy,
								yy : b2 / n2
							});
						},
						normalize : function(_c) {
							return (_c instanceof m.Matrix2D) ? _c
									: new m.Matrix2D(_c);
						},
						clone : function(_d) {
							var _e = new m.Matrix2D();
							for ( var i in _d) {
								if (typeof (_d[i]) == "number"
										&& typeof (_e[i]) == "number"
										&& _e[i] != _d[i]) {
									_e[i] = _d[i];
								}
							}
							return _e;
						},
						invert : function(_f) {
							var M = m.normalize(_f), D = M.xx * M.yy - M.xy
									* M.yx, M = new m.Matrix2D({
								xx : M.yy / D,
								xy : -M.xy / D,
								yx : -M.yx / D,
								yy : M.xx / D,
								dx : (M.xy * M.dy - M.yy * M.dx) / D,
								dy : (M.yx * M.dx - M.xx * M.dy) / D
							});
							return M;
						},
						_multiplyPoint : function(_10, x, y) {
							return {
								x : _10.xx * x + _10.xy * y + _10.dx,
								y : _10.yx * x + _10.yy * y + _10.dy
							};
						},
						multiplyPoint : function(_11, a, b) {
							var M = m.normalize(_11);
							if (typeof a == "number"
									&& typeof b == "number") {
								return m._multiplyPoint(M, a, b);
							}
							return m._multiplyPoint(M, a.x, a.y);
						},
						multiply : function(_12) {
							var M = m.normalize(_12);
							for ( var i = 1; i < arguments.length; ++i) {
								var l = M, r = m.normalize(arguments[i]);
								M = new m.Matrix2D();
								M.xx = l.xx * r.xx + l.xy * r.yx;
								M.xy = l.xx * r.xy + l.xy * r.yy;
								M.yx = l.yx * r.xx + l.yy * r.yx;
								M.yy = l.yx * r.xy + l.yy * r.yy;
								M.dx = l.xx * r.dx + l.xy * r.dy + l.dx;
								M.dy = l.yx * r.dx + l.yy * r.dy + l.dy;
							}
							return M;
						},
						_sandwich : function(_13, x, y) {
							return m.multiply(m.translate(x, y), _13, m
									.translate(-x, -y));
						},
						scaleAt : function(a, b, c, d) {
							switch (arguments.length) {
							case 4:
								return m._sandwich(m.scale(a, b), c, d);
							case 3:
								if (typeof c == "number") {
									return m._sandwich(m.scale(a), b, c);
								}
								return m._sandwich(m.scale(a, b), c.x, c.y);
							}
							return m._sandwich(m.scale(a), b.x, b.y);
						},
						rotateAt : function(_14, a, b) {
							if (arguments.length > 2) {
								return m._sandwich(m.rotate(_14), a, b);
							}
							return m._sandwich(m.rotate(_14), a.x, a.y);
						},
						rotategAt : function(_15, a, b) {
							if (arguments.length > 2) {
								return m._sandwich(m.rotateg(_15), a, b);
							}
							return m._sandwich(m.rotateg(_15), a.x, a.y);
						},
						skewXAt : function(_16, a, b) {
							if (arguments.length > 2) {
								return m._sandwich(m.skewX(_16), a, b);
							}
							return m._sandwich(m.skewX(_16), a.x, a.y);
						},
						skewXgAt : function(_17, a, b) {
							if (arguments.length > 2) {
								return m._sandwich(m.skewXg(_17), a, b);
							}
							return m._sandwich(m.skewXg(_17), a.x, a.y);
						},
						skewYAt : function(_18, a, b) {
							if (arguments.length > 2) {
								return m._sandwich(m.skewY(_18), a, b);
							}
							return m._sandwich(m.skewY(_18), a.x, a.y);
						},
						skewYgAt : function(_19, a, b) {
							if (arguments.length > 2) {
								return m._sandwich(m.skewYg(_19), a, b);
							}
							return m._sandwich(m.skewYg(_19), a.x, a.y);
						}
					});
})();
dojox.gfx.Matrix2D = dojox.gfx.matrix.Matrix2D;
}
 
if (!dojo._hasResource["dojox.gfx._base"]) {
dojo._hasResource["dojox.gfx._base"] = true;
dojo.provide("dojox.gfx._base");
(function() {
	var g = dojox.gfx, b = g._base;
	g._hasClass = function(_1a, _1b) {
		var cls = _1a.getAttribute("className");
		return cls && (" " + cls + " ").indexOf(" " + _1b + " ") >= 0;
	};
	g._addClass = function(_1c, _1d) {
		var cls = _1c.getAttribute("className") || "";
		if (!cls || (" " + cls + " ").indexOf(" " + _1d + " ") < 0) {
			_1c.setAttribute("className", cls + (cls ? " " : "") + _1d);
		}
	};
	g._removeClass = function(_1e, _1f) {
		var cls = _1e.getAttribute("className");
		if (cls) {
			_1e.setAttribute("className", cls.replace(new RegExp("(^|\\s+)"
					+ _1f + "(\\s+|$)"), "$1$2"));
		}
	};
	b._getFontMeasurements = function() {
		var _20 = {
			"1em" : 0,
			"1ex" : 0,
			"100%" : 0,
			"12pt" : 0,
			"16px" : 0,
			"xx-small" : 0,
			"x-small" : 0,
			"small" : 0,
			"medium" : 0,
			"large" : 0,
			"x-large" : 0,
			"xx-large" : 0
		};
		if (dojo.isIE) {
			dojo.doc.documentElement.style.fontSize = "100%";
		}
		var div = dojo.doc.createElement("div");
		var s = div.style;
		s.position = "absolute";
		s.top = "-100px";
		s.left = "0px";
		s.width = "30px";
		s.height = "1000em";
		s.borderWidth = "0px";
		s.margin = "0px";
		s.padding = "0px";
		s.outline = "none";
		s.lineHeight = "1";
		s.overflow = "hidden";
		dojo.body().appendChild(div);
		for ( var p in _20) {
			div.style.fontSize = p;
			_20[p] = Math.round(div.offsetHeight * 12 / 16) * 16 / 12 / 1000;
		}
		dojo.body().removeChild(div);
		div = null;
		return _20;
	};
	var _21 = null;
	b._getCachedFontMeasurements = function(_22) {
		if (_22 || !_21) {
			_21 = b._getFontMeasurements();
		}
		return _21;
	};
	var _23 = null, _24 = {};
	b._getTextBox = function(_25, _26, _27) {
		var m, s, al = arguments.length;
		if (!_23) {
			m = _23 = dojo.doc.createElement("div");
			s = m.style;
			s.position = "absolute";
			s.top = "-10000px";
			s.left = "0";
			dojo.body().appendChild(m);
		} else {
			m = _23;
			s = m.style;
		}
		m.className = "";
		s.borderWidth = "0";
		s.margin = "0";
		s.padding = "0";
		s.outline = "0";
		if (al > 1 && _26) {
			for ( var i in _26) {
				if (i in _24) {
					continue;
				}
				s[i] = _26[i];
			}
		}
		if (al > 2 && _27) {
			m.className = _27;
		}
		m.innerHTML = _25;
		if (m["getBoundingClientRect"]) {
			var bcr = m.getBoundingClientRect();
			return {
				l : bcr.left,
				t : bcr.top,
				w : bcr.width || (bcr.right - bcr.left),
				h : bcr.height || (bcr.bottom - bcr.top)
			};
		} else {
			return dojo.marginBox(m);
		}
	};
	var _28 = 0;
	b._getUniqueId = function() {
		var id;
		do {
			id = dojo._scopeName + "Unique" + (++_28);
		} while (dojo.byId(id));
		return id;
	};
})();
dojo
		.mixin(
				dojox.gfx,
				{
					defaultPath : {
						type : "path",
						path : ""
					},
					defaultPolyline : {
						type : "polyline",
						points : []
					},
					defaultRect : {
						type : "rect",
						x : 0,
						y : 0,
						width : 100,
						height : 100,
						r : 0
					},
					defaultEllipse : {
						type : "ellipse",
						cx : 0,
						cy : 0,
						rx : 200,
						ry : 100
					},
					defaultCircle : {
						type : "circle",
						cx : 0,
						cy : 0,
						r : 100
					},
					defaultLine : {
						type : "line",
						x1 : 0,
						y1 : 0,
						x2 : 100,
						y2 : 100
					},
					defaultImage : {
						type : "image",
						x : 0,
						y : 0,
						width : 0,
						height : 0,
						src : ""
					},
					defaultText : {
						type : "text",
						x : 0,
						y : 0,
						text : "",
						align : "start",
						decoration : "none",
						rotated : false,
						kerning : true
					},
					defaultTextPath : {
						type : "textpath",
						text : "",
						align : "start",
						decoration : "none",
						rotated : false,
						kerning : true
					},
					defaultStroke : {
						type : "stroke",
						color : "black",
						style : "solid",
						width : 1,
						cap : "butt",
						join : 4
					},
					defaultLinearGradient : {
						type : "linear",
						x1 : 0,
						y1 : 0,
						x2 : 100,
						y2 : 100,
						colors : [ {
							offset : 0,
							color : "black"
						}, {
							offset : 1,
							color : "white"
						} ]
					},
					defaultRadialGradient : {
						type : "radial",
						cx : 0,
						cy : 0,
						r : 100,
						colors : [ {
							offset : 0,
							color : "black"
						}, {
							offset : 1,
							color : "white"
						} ]
					},
					defaultPattern : {
						type : "pattern",
						x : 0,
						y : 0,
						width : 0,
						height : 0,
						src : ""
					},
					defaultFont : {
						type : "font",
						style : "normal",
						variant : "normal",
						weight : "normal",
						size : "10pt",
						family : "serif"
					},
					getDefault : (function() {
						var _29 = {};
						return function(_2a) {
							var t = _29[_2a];
							if (t) {
								return new t();
							}
							t = _29[_2a] = new Function;
							t.prototype = dojox.gfx["default" + _2a];
							return new t();
						};
					})(),
					normalizeColor : function(_2b) {
						return (_2b instanceof dojo.Color) ? _2b
								: new dojo.Color(_2b);
					},
					normalizeParameters : function(_2c, _2d) {
						if (_2d) {
							var _2e = {};
							for ( var x in _2c) {
								if (x in _2d && !(x in _2e)) {
									_2c[x] = _2d[x];
								}
							}
						}
						return _2c;
					},
					makeParameters : function(_2f, _30) {
						if (!_30) {
							return dojo.delegate(_2f);
						}
						var _31 = {};
						for ( var i in _2f) {
							if (!(i in _31)) {
								_31[i] = dojo.clone((i in _30) ? _30[i]
										: _2f[i]);
							}
						}
						return _31;
					},
					formatNumber : function(x, _32) {
						var val = x.toString();
						if (val.indexOf("e") >= 0) {
							val = x.toFixed(4);
						} else {
							var _33 = val.indexOf(".");
							if (_33 >= 0 && val.length - _33 > 5) {
								val = x.toFixed(4);
							}
						}
						if (x < 0) {
							return val;
						}
						return _32 ? " " + val : val;
					},
					makeFontString : function(_34) {
						return _34.style + " " + _34.variant + " "
								+ _34.weight + " " + _34.size + " "
								+ _34.family;
					},
					splitFontString : function(str) {
						var _35 = dojox.gfx.getDefault("Font");
						var t = str.split(/\s+/);
						do {
							if (t.length < 5) {
								break;
							}
							_35.style = t[0];
							_35.variant = t[1];
							_35.weight = t[2];
							var i = t[3].indexOf("/");
							_35.size = i < 0 ? t[3] : t[3].substring(0, i);
							var j = 4;
							if (i < 0) {
								if (t[4] == "/") {
									j = 6;
								} else {
									if (t[4].charAt(0) == "/") {
										j = 5;
									}
								}
							}
							if (j < t.length) {
								_35.family = t.slice(j).join(" ");
							}
						} while (false);
						return _35;
					},
					cm_in_pt : 72 / 2.54,
					mm_in_pt : 7.2 / 2.54,
					px_in_pt : function() {
						return dojox.gfx._base._getCachedFontMeasurements()["12pt"] / 12;
					},
					pt2px : function(len) {
						return len * dojox.gfx.px_in_pt();
					},
					px2pt : function(len) {
						return len / dojox.gfx.px_in_pt();
					},
					normalizedLength : function(len) {
						if (len.length == 0) {
							return 0;
						}
						if (len.length > 2) {
							var _36 = dojox.gfx.px_in_pt();
							var val = parseFloat(len);
							switch (len.slice(-2)) {
							case "px":
								return val;
							case "pt":
								return val * _36;
							case "in":
								return val * 72 * _36;
							case "pc":
								return val * 12 * _36;
							case "mm":
								return val * dojox.gfx.mm_in_pt * _36;
							case "cm":
								return val * dojox.gfx.cm_in_pt * _36;
							}
						}
						return parseFloat(len);
					},
					pathVmlRegExp : /([A-Za-z]+)|(\d+(\.\d+)?)|(\.\d+)|(-\d+(\.\d+)?)|(-\.\d+)/g,
					pathSvgRegExp : /([A-Za-z])|(\d+(\.\d+)?)|(\.\d+)|(-\d+(\.\d+)?)|(-\.\d+)/g,
					equalSources : function(a, b) {
						return a && b && a == b;
					}
				});
}
 
if (!dojo._hasResource["dojox.gfx"]) { 
dojo._hasResource["dojox.gfx"] = true;
dojo.provide("dojox.gfx");
dojo
		.loadInit(function() {
			var gfx = dojo.getObject("dojox.gfx", true), sl, _37, _38;
			if (!gfx.renderer) {
				if (dojo.config.forceGfxRenderer) {
					dojox.gfx.renderer = dojo.config.forceGfxRenderer;
					return;
				}
				var _39 = (typeof dojo.config.gfxRenderer == "string" ? dojo.config.gfxRenderer
						: "svg,vml,silverlight,canvas").split(",");
				var ua = navigator.userAgent, _3a = 0, _3b = 0;
				if (dojo.isSafari >= 3) {
					if (ua.indexOf("iPhone") >= 0
							|| ua.indexOf("iPod") >= 0) {
						_38 = ua
								.match(/Version\/(\d(\.\d)?(\.\d)?)\sMobile\/([^\s]*)\s?/);
						if (_38) {
							_3a = parseInt(_38[4].substr(0, 3), 16);
						}
					}
				}
				if (dojo.isWebKit) {
					if (!_3a) {
						_38 = ua.match(/Android\s+(\d+\.\d+)/);
						if (_38) {
							_3b = parseFloat(_38[1]);
						}
					}
				}
				for ( var i = 0; i < _39.length; ++i) {
					switch (_39[i]) {
					case "svg":
						if (!dojo.isIE && (!_3a || _3a >= 1521) && !_3b
								&& !dojo.isAIR) {
							dojox.gfx.renderer = "svg";
						}
						break;
					case "vml":
						if (dojo.isIE) {
							dojox.gfx.renderer = "vml";
						}
						break;
					case "silverlight":
						try {
							if (dojo.isIE) {
								sl = new ActiveXObject(
										"AgControl.AgControl");
								if (sl && sl.IsVersionSupported("1.0")) {
									_37 = true;
								}
							} else {
								if (navigator.plugins["Silverlight Plug-In"]) {
									_37 = true;
								}
							}
						} catch (e) {
							_37 = false;
						} finally {
							sl = null;
						}
						if (_37) {
							dojox.gfx.renderer = "silverlight";
						}
						break;
					case "canvas":
						if (!dojo.isIE) {
							dojox.gfx.renderer = "canvas";
						}
						break;
					}
					if (dojox.gfx.renderer) {
						break;
					}
				}
				if (dojo.config.isDebug) {
				}
			}
		});

		 /*
		dojo.requireIf(dojox.gfx.renderer == "svg", "dojox.gfx.svg");
dojo.requireIf(dojox.gfx.renderer == "vml", "dojox.gfx.vml");
dojo
		.requireIf(dojox.gfx.renderer == "silverlight",
				"dojox.gfx.silverlight");
dojo.requireIf(dojox.gfx.renderer == "canvas", "dojox.gfx.canvas");*/
}

  
//==========================arc.js===============================//
/*
Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
Available via Academic Free License >= 2.1 OR the modified BSD license.
see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.gfx.arc"]){
dojo._hasResource["dojox.gfx.arc"]=true;
dojo.provide("dojox.gfx.arc");
dojo.require("dojox.gfx.matrix");
(function(){
var m=dojox.gfx.matrix,_1=function(_2){
var _3=Math.cos(_2),_4=Math.sin(_2),p2={x:_3+(4/3)*(1-_3),y:_4-(4/3)*_3*(1-_3)/_4};
return {s:{x:_3,y:-_4},c1:{x:p2.x,y:-p2.y},c2:p2,e:{x:_3,y:_4}};
},_5=2*Math.PI,_6=Math.PI/4,_7=Math.PI/8,_8=_6+_7,_9=_1(_7);
dojo.mixin(dojox.gfx.arc,{unitArcAsBezier:_1,curvePI4:_9,arcAsBezier:function(_a,rx,ry,_b,_c,_d,x,y){
_c=Boolean(_c);
_d=Boolean(_d);
var _e=m._degToRad(_b),_f=rx*rx,ry2=ry*ry,pa=m.multiplyPoint(m.rotate(-_e),{x:(_a.x-x)/2,y:(_a.y-y)/2}),_10=pa.x*pa.x,_11=pa.y*pa.y,c1=Math.sqrt((_f*ry2-_f*_11-ry2*_10)/(_f*_11+ry2*_10));
if(isNaN(c1)){
c1=0;
}
var ca={x:c1*rx*pa.y/ry,y:-c1*ry*pa.x/rx};
if(_c==_d){
ca={x:-ca.x,y:-ca.y};
}
var c=m.multiplyPoint([m.translate((_a.x+x)/2,(_a.y+y)/2),m.rotate(_e)],ca);
var _12=m.normalize([m.translate(c.x,c.y),m.rotate(_e),m.scale(rx,ry)]);
var _13=m.invert(_12),sp=m.multiplyPoint(_13,_a),ep=m.multiplyPoint(_13,x,y),_14=Math.atan2(sp.y,sp.x),_15=Math.atan2(ep.y,ep.x),_16=_14-_15;
if(_d){
_16=-_16;
}
if(_16<0){
_16+=_5;
}else{
if(_16>_5){
_16-=_5;
}
}
var _17=_7,_18=_9,_19=_d?_17:-_17,_1a=[];
for(var _1b=_16;_1b>0;_1b-=_6){
if(_1b<_8){
_17=_1b/2;
_18=_1(_17);
_19=_d?_17:-_17;
_1b=0;
}
var c1,c2,e,M=m.normalize([_12,m.rotate(_14+_19)]);
if(_d){
c1=m.multiplyPoint(M,_18.c1);
c2=m.multiplyPoint(M,_18.c2);
e=m.multiplyPoint(M,_18.e);
}else{
c1=m.multiplyPoint(M,_18.c2);
c2=m.multiplyPoint(M,_18.c1);
e=m.multiplyPoint(M,_18.s);
}
_1a.push([c1.x,c1.y,c2.x,c2.y,e.x,e.y]);
_14+=2*_19;
}
return _1a;
}});
})();
}
//===================fx.js==================//
/*
Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
Available via Academic Free License >= 2.1 OR the modified BSD license.
see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.gfx.fx"]){
dojo._hasResource["dojox.gfx.fx"]=true;
dojo.provide("dojox.gfx.fx");
dojo.require("dojox.gfx.matrix");
(function(){
var d=dojo,g=dojox.gfx,m=g.matrix;
var _1=function(_2,_3){
this.start=_2,this.end=_3;
};
d.extend(_1,{getValue:function(r){
return (this.end-this.start)*r+this.start;
}});
var _4=function(_5,_6,_7){
this.start=_5,this.end=_6;
this.units=_7;
};
d.extend(_4,{getValue:function(r){
return (this.end-this.start)*r+this.start+this.units;
}});
var _8=function(_9,_a){
this.start=_9,this.end=_a;
this.temp=new dojo.Color();
};
d.extend(_8,{getValue:function(r){
return d.blendColors(this.start,this.end,r,this.temp);
}});
var _b=function(_c){
this.values=_c;
this.length=_c.length;
};
d.extend(_b,{getValue:function(r){
return this.values[Math.min(Math.floor(r*this.length),this.length-1)];
}});
var _d=function(_e,_f){
this.values=_e;
this.def=_f?_f:{};
};
d.extend(_d,{getValue:function(r){
var ret=dojo.clone(this.def);
for(var i in this.values){
ret[i]=this.values[i].getValue(r);
}
return ret;
}});
var _10=function(_11,_12){
this.stack=_11;
this.original=_12;
};
d.extend(_10,{getValue:function(r){
var ret=[];
dojo.forEach(this.stack,function(t){
if(t instanceof m.Matrix2D){
ret.push(t);
return;
}
if(t.name=="original"&&this.original){
ret.push(this.original);
return;
}
if(!(t.name in m)){
return;
}
var f=m[t.name];
if(typeof f!="function"){
ret.push(f);
return;
}
var val=dojo.map(t.start,function(v,i){
return (t.end[i]-v)*r+v;
}),_13=f.apply(m,val);
if(_13 instanceof m.Matrix2D){
ret.push(_13);
}
},this);
return ret;
}});
var _14=new d.Color(0,0,0,0);
var _15=function(_16,obj,_17,def){
if(_16.values){
return new _b(_16.values);
}
var _18,_19,end;
if(_16.start){
_19=g.normalizeColor(_16.start);
}else{
_19=_18=obj?(_17?obj[_17]:obj):def;
}
if(_16.end){
end=g.normalizeColor(_16.end);
}else{
if(!_18){
_18=obj?(_17?obj[_17]:obj):def;
}
end=_18;
}
return new _8(_19,end);
};
var _1a=function(_1b,obj,_1c,def){
if(_1b.values){
return new _b(_1b.values);
}
var _1d,_1e,end;
if(_1b.start){
_1e=_1b.start;
}else{
_1e=_1d=obj?obj[_1c]:def;
}
if(_1b.end){
end=_1b.end;
}else{
if(typeof _1d!="number"){
_1d=obj?obj[_1c]:def;
}
end=_1d;
}
return new _1(_1e,end);
};
g.fx.animateStroke=function(_1f){
if(!_1f.easing){
_1f.easing=d._defaultEasing;
}
var _20=new d.Animation(_1f),_21=_1f.shape,_22;
d.connect(_20,"beforeBegin",_20,function(){
_22=_21.getStroke();
var _23=_1f.color,_24={},_25,_26,end;
if(_23){
_24.color=_15(_23,_22,"color",_14);
}
_23=_1f.style;
if(_23&&_23.values){
_24.style=new _b(_23.values);
}
_23=_1f.width;
if(_23){
_24.width=_1a(_23,_22,"width",1);
}
_23=_1f.cap;
if(_23&&_23.values){
_24.cap=new _b(_23.values);
}
_23=_1f.join;
if(_23){
if(_23.values){
_24.join=new _b(_23.values);
}else{
_26=_23.start?_23.start:(_22&&_22.join||0);
end=_23.end?_23.end:(_22&&_22.join||0);
if(typeof _26=="number"&&typeof end=="number"){
_24.join=new _1(_26,end);
}
}
}
this.curve=new _d(_24,_22);
});
d.connect(_20,"onAnimate",_21,"setStroke");
return _20;
};
g.fx.animateFill=function(_27){
if(!_27.easing){
_27.easing=d._defaultEasing;
}
var _28=new d.Animation(_27),_29=_27.shape,_2a;
d.connect(_28,"beforeBegin",_28,function(){
_2a=_29.getFill();
var _2b=_27.color,_2c={};
if(_2b){
this.curve=_15(_2b,_2a,"",_14);
}
});
d.connect(_28,"onAnimate",_29,"setFill");
return _28;
};
g.fx.animateFont=function(_2d){
if(!_2d.easing){
_2d.easing=d._defaultEasing;
}
var _2e=new d.Animation(_2d),_2f=_2d.shape,_30;
d.connect(_2e,"beforeBegin",_2e,function(){
_30=_2f.getFont();
var _31=_2d.style,_32={},_33,_34,end;
if(_31&&_31.values){
_32.style=new _b(_31.values);
}
_31=_2d.variant;
if(_31&&_31.values){
_32.variant=new _b(_31.values);
}
_31=_2d.weight;
if(_31&&_31.values){
_32.weight=new _b(_31.values);
}
_31=_2d.family;
if(_31&&_31.values){
_32.family=new _b(_31.values);
}
_31=_2d.size;
if(_31&&_31.units){
_34=parseFloat(_31.start?_31.start:(_2f.font&&_2f.font.size||"0"));
end=parseFloat(_31.end?_31.end:(_2f.font&&_2f.font.size||"0"));
_32.size=new _4(_34,end,_31.units);
}
this.curve=new _d(_32,_30);
});
d.connect(_2e,"onAnimate",_2f,"setFont");
return _2e;
};
g.fx.animateTransform=function(_35){
if(!_35.easing){
_35.easing=d._defaultEasing;
}
var _36=new d.Animation(_35),_37=_35.shape,_38;
d.connect(_36,"beforeBegin",_36,function(){
_38=_37.getTransform();
this.curve=new _10(_35.transform,_38);
});
d.connect(_36,"onAnimate",_37,"setTransform");
return _36;
};
})();
}
//==========utils.js==================//
/*
Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
Available via Academic Free License >= 2.1 OR the modified BSD license.
see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.gfx.utils"]){
dojo._hasResource["dojox.gfx.utils"]=true;
dojo.provide("dojox.gfx.utils");
dojo.require("dojox.gfx");
(function(){
var d=dojo,g=dojox.gfx,gu=g.utils;
dojo.mixin(gu,{forEach:function(_1,f,o){
o=o||d.global;
f.call(o,_1);
if(_1 instanceof g.Surface||_1 instanceof g.Group){
d.forEach(_1.children,function(_2){
gu.forEach(_2,f,o);
});
}
},serialize:function(_3){
var t={},v,_4=_3 instanceof g.Surface;
if(_4||_3 instanceof g.Group){
t.children=d.map(_3.children,gu.serialize);
if(_4){
return t.children;
}
}else{
t.shape=_3.getShape();
}
if(_3.getTransform){
v=_3.getTransform();
if(v){
t.transform=v;
}
}
if(_3.getStroke){
v=_3.getStroke();
if(v){
t.stroke=v;
}
}
if(_3.getFill){
v=_3.getFill();
if(v){
t.fill=v;
}
}
if(_3.getFont){
v=_3.getFont();
if(v){
t.font=v;
}
}
return t;
},toJson:function(_5,_6){
return d.toJson(gu.serialize(_5),_6);
},deserialize:function(_7,_8){
if(_8 instanceof Array){
return d.map(_8,d.hitch(null,gu.deserialize,_7));
}
var _9=("shape" in _8)?_7.createShape(_8.shape):_7.createGroup();
if("transform" in _8){
_9.setTransform(_8.transform);
}
if("stroke" in _8){
_9.setStroke(_8.stroke);
}
if("fill" in _8){
_9.setFill(_8.fill);
}
if("font" in _8){
_9.setFont(_8.font);
}
if("children" in _8){
d.forEach(_8.children,d.hitch(null,gu.deserialize,_9));
}
return _9;
},fromJson:function(_a,_b){
return gu.deserialize(_a,d.fromJson(_b));
},toSvg:function(_c){
var _d=new dojo.Deferred();
if(dojox.gfx.renderer==="svg"){
try{
var _e=gu._cleanSvg(gu._innerXML(_c.rawNode));
_d.callback(_e);
}
catch(e){
_d.errback(e);
}
}else{
if(!gu._initSvgSerializerDeferred){
gu._initSvgSerializer();
}
var _f=dojox.gfx.utils.toJson(_c);
var _10=function(){
try{
var _11=_c.getDimensions();
var _12=_11.width;
var _13=_11.height;
var _14=gu._gfxSvgProxy.document.createElement("div");
gu._gfxSvgProxy.document.body.appendChild(_14);
dojo.withDoc(gu._gfxSvgProxy.document,function(){
dojo.style(_14,"width",_12);
dojo.style(_14,"height",_13);
},this);
var ts=gu._gfxSvgProxy[dojox._scopeName].gfx.createSurface(_14,_12,_13);
var _15=function(_16){
try{
gu._gfxSvgProxy[dojox._scopeName].gfx.utils.fromJson(_16,_f);
var svg=gu._cleanSvg(_14.innerHTML);
_16.clear();
_16.destroy();
gu._gfxSvgProxy.document.body.removeChild(_14);
_d.callback(svg);
}
catch(e){
_d.errback(e);
}
};
ts.whenLoaded(null,_15);
}
catch(ex){
_d.errback(ex);
}
};
if(gu._initSvgSerializerDeferred.fired>0){
_10();
}else{
gu._initSvgSerializerDeferred.addCallback(_10);
}
}
return _d;
},_gfxSvgProxy:null,_initSvgSerializerDeferred:null,_svgSerializerInitialized:function(){
gu._initSvgSerializerDeferred.callback(true);
},_initSvgSerializer:function(){
if(!gu._initSvgSerializerDeferred){
gu._initSvgSerializerDeferred=new dojo.Deferred();
var f=dojo.doc.createElement("iframe");
dojo.style(f,{display:"none",position:"absolute",width:"1em",height:"1em",top:"-10000px"});
var _17;
if(dojo.isIE){
f.onreadystatechange=function(){
if(f.contentWindow.document.readyState=="complete"){
f.onreadystatechange=function(){
};
_17=setInterval(function(){
if(f.contentWindow[dojo._scopeName]&&f.contentWindow[dojox._scopeName].gfx&&f.contentWindow[dojox._scopeName].gfx.utils){
clearInterval(_17);
f.contentWindow.parent[dojox._scopeName].gfx.utils._gfxSvgProxy=f.contentWindow;
f.contentWindow.parent[dojox._scopeName].gfx.utils._svgSerializerInitialized();
}
},50);
}
};
}else{
f.onload=function(){
f.onload=function(){
};
_17=setInterval(function(){
if(f.contentWindow[dojo._scopeName]&&f.contentWindow[dojox._scopeName].gfx&&f.contentWindow[dojox._scopeName].gfx.utils){
clearInterval(_17);
f.contentWindow.parent[dojox._scopeName].gfx.utils._gfxSvgProxy=f.contentWindow;
f.contentWindow.parent[dojox._scopeName].gfx.utils._svgSerializerInitialized();
}
},50);
};
}
var uri=(dojo.config["dojoxGfxSvgProxyFrameUrl"]||dojo.moduleUrl("dojox","gfx/resources/gfxSvgProxyFrame.html"));
f.setAttribute("src",uri);
dojo.body().appendChild(f);
}
},_innerXML:function(_18){
if(_18.innerXML){
return _18.innerXML;
}else{
if(_18.xml){
return _18.xml;
}else{
if(typeof XMLSerializer!="undefined"){
return (new XMLSerializer()).serializeToString(_18);
}
}
}
return null;
},_cleanSvg:function(svg){
if(svg){
if(svg.indexOf("xmlns=\"http://www.w3.org/2000/svg\"")==-1){
svg=svg.substring(4,svg.length);
svg="<svg xmlns=\"http://www.w3.org/2000/svg\""+svg;
}
svg=svg.replace(/\bdojoGfx\w*\s*=\s*(['"])\w*\1/g,"");
}
return svg;
}});
})();
}
//==============svg.js====================//
/*
Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
Available via Academic Free License >= 2.1 OR the modified BSD license.
see: http://dojotoolkit.org/license for details
*/


if(dojox.gfx.renderer=='svg' && !dojo._hasResource["dojox.gfx.svg"]){
dojo._hasResource["dojox.gfx.svg"]=true;
dojo.provide("dojox.gfx.svg");
dojo.require("dojox.gfx._base");
dojo.require("dojox.gfx.shape");
dojo.require("dojox.gfx.path");
(function(){
var d=dojo,g=dojox.gfx,gs=g.shape,_1=g.svg;
_1.useSvgWeb=(typeof (window.svgweb)!=="undefined");
var _2=function(ns,_3){
if(dojo.doc.createElementNS){
return dojo.doc.createElementNS(ns,_3);
}else{
return dojo.doc.createElement(_3);
}
};
var _4=function(_5){
if(_1.useSvgWeb){
return dojo.doc.createTextNode(_5,true);
}else{
return dojo.doc.createTextNode(_5);
}
};
var _6=function(){
if(_1.useSvgWeb){
return dojo.doc.createDocumentFragment(true);
}else{
return dojo.doc.createDocumentFragment();
}
};
_1.xmlns={xlink:"http://www.w3.org/1999/xlink",svg:"http://www.w3.org/2000/svg"};
_1.getRef=function(_7){
if(!_7||_7=="none"){
return null;
}
if(_7.match(/^url\(#.+\)$/)){
return d.byId(_7.slice(5,-1));
}
if(_7.match(/^#dojoUnique\d+$/)){
return d.byId(_7.slice(1));
}
return null;
};
_1.dasharray={solid:"none",shortdash:[4,1],shortdot:[1,1],shortdashdot:[4,1,1,1],shortdashdotdot:[4,1,1,1,1,1],dot:[1,3],dash:[4,3],longdash:[8,3],dashdot:[4,3,1,3],longdashdot:[8,3,1,3],longdashdotdot:[8,3,1,3,1,3]};
d.extend(g.Shape,{setFill:function(_8){
if(!_8){
this.fillStyle=null;
this.rawNode.setAttribute("fill","none");
this.rawNode.setAttribute("fill-opacity",0);
return this;
}
var f;
var _9=function(x){
this.setAttribute(x,f[x].toFixed(8));
};
if(typeof (_8)=="object"&&"type" in _8){
switch(_8.type){
case "linear":
f=g.makeParameters(g.defaultLinearGradient,_8);
var _a=this._setFillObject(f,"linearGradient");
d.forEach(["x1","y1","x2","y2"],_9,_a);
break;
case "radial":
f=g.makeParameters(g.defaultRadialGradient,_8);
var _a=this._setFillObject(f,"radialGradient");
d.forEach(["cx","cy","r"],_9,_a);
break;
case "pattern":
f=g.makeParameters(g.defaultPattern,_8);
var _b=this._setFillObject(f,"pattern");
d.forEach(["x","y","width","height"],_9,_b);
break;
}
this.fillStyle=f;
return this;
}
var f=g.normalizeColor(_8);
this.fillStyle=f;
this.rawNode.setAttribute("fill",f.toCss());
this.rawNode.setAttribute("fill-opacity",f.a);
this.rawNode.setAttribute("fill-rule","evenodd");
return this;
},setStroke:function(_c){
var rn=this.rawNode;
if(!_c){
this.strokeStyle=null;
rn.setAttribute("stroke","none");
rn.setAttribute("stroke-opacity",0);
return this;
}
if(typeof _c=="string"||d.isArray(_c)||_c instanceof d.Color){
_c={color:_c};
}
var s=this.strokeStyle=g.makeParameters(g.defaultStroke,_c);
s.color=g.normalizeColor(s.color);
if(s){
rn.setAttribute("stroke",s.color.toCss());
rn.setAttribute("stroke-opacity",s.color.a);
rn.setAttribute("stroke-width",s.width);
rn.setAttribute("stroke-linecap",s.cap);
if(typeof s.join=="number"){
rn.setAttribute("stroke-linejoin","miter");
rn.setAttribute("stroke-miterlimit",s.join);
}else{
rn.setAttribute("stroke-linejoin",s.join);
}
var da=s.style.toLowerCase();
if(da in _1.dasharray){
da=_1.dasharray[da];
}
if(da instanceof Array){
da=d._toArray(da);
for(var i=0;i<da.length;++i){
da[i]*=s.width;
}
if(s.cap!="butt"){
for(var i=0;i<da.length;i+=2){
da[i]-=s.width;
if(da[i]<1){
da[i]=1;
}
}
for(var i=1;i<da.length;i+=2){
da[i]+=s.width;
}
}
da=da.join(",");
}
rn.setAttribute("stroke-dasharray",da);
rn.setAttribute("dojoGfxStrokeStyle",s.style);
}
return this;
},_getParentSurface:function(){
var _d=this.parent;
for(;_d&&!(_d instanceof g.Surface);_d=_d.parent){
}
return _d;
},_setFillObject:function(f,_e){
var _f=_1.xmlns.svg;
this.fillStyle=f;
var _10=this._getParentSurface(),_11=_10.defNode,_12=this.rawNode.getAttribute("fill"),ref=_1.getRef(_12);
if(ref){
_12=ref;
if(_12.tagName.toLowerCase()!=_e.toLowerCase()){
var id=_12.id;
_12.parentNode.removeChild(_12);
_12=_2(_f,_e);
_12.setAttribute("id",id);
_11.appendChild(_12);
}else{
while(_12.childNodes.length){
_12.removeChild(_12.lastChild);
}
}
}else{
_12=_2(_f,_e);
_12.setAttribute("id",g._base._getUniqueId());
_11.appendChild(_12);
}
if(_e=="pattern"){
_12.setAttribute("patternUnits","userSpaceOnUse");
var img=_2(_f,"image");
img.setAttribute("x",0);
img.setAttribute("y",0);
img.setAttribute("width",f.width.toFixed(8));
img.setAttribute("height",f.height.toFixed(8));
img.setAttributeNS(_1.xmlns.xlink,"xlink:href",f.src);
_12.appendChild(img);
}else{
_12.setAttribute("gradientUnits","userSpaceOnUse");
for(var i=0;i<f.colors.length;++i){
var c=f.colors[i],t=_2(_f,"stop"),cc=c.color=g.normalizeColor(c.color);
t.setAttribute("offset",c.offset.toFixed(8));
t.setAttribute("stop-color",cc.toCss());
t.setAttribute("stop-opacity",cc.a);
_12.appendChild(t);
}
}
this.rawNode.setAttribute("fill","url(#"+_12.getAttribute("id")+")");
this.rawNode.removeAttribute("fill-opacity");
this.rawNode.setAttribute("fill-rule","evenodd");
return _12;
},_applyTransform:function(){
var _13=this.matrix;
if(_13){
var tm=this.matrix;
this.rawNode.setAttribute("transform","matrix("+tm.xx.toFixed(8)+","+tm.yx.toFixed(8)+","+tm.xy.toFixed(8)+","+tm.yy.toFixed(8)+","+tm.dx.toFixed(8)+","+tm.dy.toFixed(8)+")");
}else{
this.rawNode.removeAttribute("transform");
}
return this;
},setRawNode:function(_14){
var r=this.rawNode=_14;
if(this.shape.type!="image"){
r.setAttribute("fill","none");
}
r.setAttribute("fill-opacity",0);
r.setAttribute("stroke","none");
r.setAttribute("stroke-opacity",0);
r.setAttribute("stroke-width",1);
r.setAttribute("stroke-linecap","butt");
r.setAttribute("stroke-linejoin","miter");
r.setAttribute("stroke-miterlimit",4);
},setShape:function(_15){
this.shape=g.makeParameters(this.shape,_15);
for(var i in this.shape){
if(i!="type"){
this.rawNode.setAttribute(i,this.shape[i]);
}
}
this.bbox=null;
return this;
},_moveToFront:function(){
this.rawNode.parentNode.appendChild(this.rawNode);
return this;
},_moveToBack:function(){
this.rawNode.parentNode.insertBefore(this.rawNode,this.rawNode.parentNode.firstChild);
return this;
}});
dojo.declare("dojox.gfx.Group",g.Shape,{constructor:function(){
_1.Container._init.call(this);
},setRawNode:function(_16){
this.rawNode=_16;
}});
g.Group.nodeType="g";
dojo.declare("dojox.gfx.Rect",gs.Rect,{setShape:function(_17){
this.shape=g.makeParameters(this.shape,_17);
this.bbox=null;
for(var i in this.shape){
if(i!="type"&&i!="r"){
this.rawNode.setAttribute(i,this.shape[i]);
}
}
if(this.shape.r){
this.rawNode.setAttribute("ry",this.shape.r);
this.rawNode.setAttribute("rx",this.shape.r);
}
return this;
}});
g.Rect.nodeType="rect";
g.Ellipse=gs.Ellipse;
g.Ellipse.nodeType="ellipse";
g.Circle=gs.Circle;
g.Circle.nodeType="circle";
g.Line=gs.Line;
g.Line.nodeType="line";
dojo.declare("dojox.gfx.Polyline",gs.Polyline,{setShape:function(_18,_19){
if(_18&&_18 instanceof Array){
this.shape=g.makeParameters(this.shape,{points:_18});
if(_19&&this.shape.points.length){
this.shape.points.push(this.shape.points[0]);
}
}else{
this.shape=g.makeParameters(this.shape,_18);
}
this.bbox=null;
this._normalizePoints();
var _1a=[],p=this.shape.points;
for(var i=0;i<p.length;++i){
_1a.push(p[i].x.toFixed(8),p[i].y.toFixed(8));
}
this.rawNode.setAttribute("points",_1a.join(" "));
return this;
}});
g.Polyline.nodeType="polyline";
dojo.declare("dojox.gfx.Image",gs.Image,{setShape:function(_1b){
this.shape=g.makeParameters(this.shape,_1b);
this.bbox=null;
var _1c=this.rawNode;
for(var i in this.shape){
if(i!="type"&&i!="src"){
_1c.setAttribute(i,this.shape[i]);
}
}
_1c.setAttribute("preserveAspectRatio","none");
_1c.setAttributeNS(_1.xmlns.xlink,"xlink:href",this.shape.src);
return this;
}});
g.Image.nodeType="image";
dojo.declare("dojox.gfx.Text",gs.Text,{setShape:function(_1d){
this.shape=g.makeParameters(this.shape,_1d);
this.bbox=null;
var r=this.rawNode,s=this.shape;
r.setAttribute("x",s.x);
r.setAttribute("y",s.y);
r.setAttribute("text-anchor",s.align);
r.setAttribute("text-decoration",s.decoration);
r.setAttribute("rotate",s.rotated?90:0);
r.setAttribute("kerning",s.kerning?"auto":0);
r.setAttribute("text-rendering","optimizeLegibility");
if(r.firstChild){
r.firstChild.nodeValue=s.text;
}else{
r.appendChild(_4(s.text));
}
return this;
},getTextWidth:function(){
var _1e=this.rawNode,_1f=_1e.parentNode,_20=_1e.cloneNode(true);
_20.style.visibility="hidden";
var _21=0,_22=_20.firstChild.nodeValue;
_1f.appendChild(_20);
if(_22!=""){
while(!_21){
if(_20.getBBox){
_21=parseInt(_20.getBBox().width);
}else{
_21=68;
}
}
}
_1f.removeChild(_20);
return _21;
}});
g.Text.nodeType="text";
dojo.declare("dojox.gfx.Path",g.path.Path,{_updateWithSegment:function(_23){
g.Path.superclass._updateWithSegment.apply(this,arguments);
if(typeof (this.shape.path)=="string"){
this.rawNode.setAttribute("d",this.shape.path);
}
},setShape:function(_24){
g.Path.superclass.setShape.apply(this,arguments);
try{
this.rawNode.setAttribute("d",this.shape.path);
}catch (e) {
}
return this;
}});
g.Path.nodeType="path";
dojo.declare("dojox.gfx.TextPath",g.path.TextPath,{_updateWithSegment:function(_25){
g.Path.superclass._updateWithSegment.apply(this,arguments);
this._setTextPath();
},setShape:function(_26){
g.Path.superclass.setShape.apply(this,arguments);
this._setTextPath();
return this;
},_setTextPath:function(){
if(typeof this.shape.path!="string"){
return;
}
var r=this.rawNode;
if(!r.firstChild){
var tp=_2(_1.xmlns.svg,"textPath"),tx=_4("");
tp.appendChild(tx);
r.appendChild(tp);
}
var ref=r.firstChild.getAttributeNS(_1.xmlns.xlink,"href"),_27=ref&&_1.getRef(ref);
if(!_27){
var _28=this._getParentSurface();
if(_28){
var _29=_28.defNode;
_27=_2(_1.xmlns.svg,"path");
var id=g._base._getUniqueId();
_27.setAttribute("id",id);
_29.appendChild(_27);
r.firstChild.setAttributeNS(_1.xmlns.xlink,"xlink:href","#"+id);
}
}
if(_27){
_27.setAttribute("d",this.shape.path);
}
},_setText:function(){
var r=this.rawNode;
if(!r.firstChild){
var tp=_2(_1.xmlns.svg,"textPath"),tx=_4("");
tp.appendChild(tx);
r.appendChild(tp);
}
r=r.firstChild;
var t=this.text;
r.setAttribute("alignment-baseline","middle");
switch(t.align){
case "middle":
r.setAttribute("text-anchor","middle");
r.setAttribute("startOffset","50%");
break;
case "end":
r.setAttribute("text-anchor","end");
r.setAttribute("startOffset","100%");
break;
default:
r.setAttribute("text-anchor","start");
r.setAttribute("startOffset","0%");
break;
}
r.setAttribute("baseline-shift","0.5ex");
r.setAttribute("text-decoration",t.decoration);
r.setAttribute("rotate",t.rotated?90:0);
r.setAttribute("kerning",t.kerning?"auto":0);
r.firstChild.data=t.text;
}});
g.TextPath.nodeType="text";
dojo.declare("dojox.gfx.Surface",gs.Surface,{constructor:function(){
_1.Container._init.call(this);
},destroy:function(){
this.defNode=null;
this.inherited(arguments);
},setDimensions:function(_2a,_2b){
if(!this.rawNode){
return this;
}
this.rawNode.setAttribute("width",_2a);
this.rawNode.setAttribute("height",_2b);
return this;
},getDimensions:function(){
var t=this.rawNode?{width:g.normalizedLength(this.rawNode.getAttribute("width")),height:g.normalizedLength(this.rawNode.getAttribute("height"))}:null;
return t;
}});
g.createSurface=function(_2c,_2d,_2e){
var s=new g.Surface();
s.rawNode=_2(_1.xmlns.svg,"svg");
if(_2d){
s.rawNode.setAttribute("width",_2d);
}
if(_2e){
s.rawNode.setAttribute("height",_2e);
}
var _2f=_2(_1.xmlns.svg,"defs");
s.rawNode.appendChild(_2f);
s.defNode=_2f;
s._parent=d.byId(_2c);
s._parent.appendChild(s.rawNode);
return s;
};
_1.Font={_setFont:function(){
var f=this.fontStyle;
this.rawNode.setAttribute("font-style",f.style);
this.rawNode.setAttribute("font-variant",f.variant);
this.rawNode.setAttribute("font-weight",f.weight);
this.rawNode.setAttribute("font-size",f.size);
this.rawNode.setAttribute("font-family",f.family);
}};
_1.Container={_init:function(){
gs.Container._init.call(this);
},openBatch:function(){
this.fragment=_6();
},closeBatch:function(){
if(this.fragment){
this.rawNode.appendChild(this.fragment);
delete this.fragment;
}
},add:function(_30){
if(this!=_30.getParent()){
if(this.fragment){
this.fragment.appendChild(_30.rawNode);
}else{
this.rawNode.appendChild(_30.rawNode);
}
gs.Container.add.apply(this,arguments);
}
return this;
},remove:function(_31,_32){
if(this==_31.getParent()){
if(this.rawNode==_31.rawNode.parentNode){
this.rawNode.removeChild(_31.rawNode);
}
if(this.fragment&&this.fragment==_31.rawNode.parentNode){
this.fragment.removeChild(_31.rawNode);
}
gs.Container.remove.apply(this,arguments);
}
return this;
},clear:function(){
var r=this.rawNode;
while(r.lastChild){
r.removeChild(r.lastChild);
}
var _33=this.defNode;
if(_33){
while(_33.lastChild){
_33.removeChild(_33.lastChild);
}
r.appendChild(_33);
}
return gs.Container.clear.apply(this,arguments);
},_moveChildToFront:gs.Container._moveChildToFront,_moveChildToBack:gs.Container._moveChildToBack};
d.mixin(gs.Creator,{createObject:function(_34,_35){
if(!this.rawNode){
return null;
}
var _36=new _34(),_37=_2(_1.xmlns.svg,_34.nodeType);
_36.setRawNode(_37);
_36.setShape(_35);
this.add(_36);
return _36;
}});
d.extend(g.Text,_1.Font);
d.extend(g.TextPath,_1.Font);
d.extend(g.Group,_1.Container);
d.extend(g.Group,gs.Creator);
d.extend(g.Surface,_1.Container);
d.extend(g.Surface,gs.Creator);
if(_1.useSvgWeb){
g.createSurface=function(_38,_39,_3a){
var s=new g.Surface();
if(!_39||!_3a){
var pos=d.position(_38);
_39=_39||pos.w;
_3a=_3a||pos.h;
}
_38=d.byId(_38);
var id=_38.id?_38.id+"_svgweb":g._base._getUniqueId();
var _3b=_2(_1.xmlns.svg,"svg");
_3b.id=id;
_3b.setAttribute("width",_39);
_3b.setAttribute("height",_3a);
svgweb.appendChild(_3b,_38);
_3b.addEventListener("SVGLoad",function(){
s.rawNode=this;
s.isLoaded=true;
var _3c=_2(_1.xmlns.svg,"defs");
s.rawNode.appendChild(_3c);
s.defNode=_3c;
if(s.onLoad){
s.onLoad(s);
}
},false);
s.isLoaded=false;
return s;
};
dojo.extend(dojox.gfx.shape.Surface,{destroy:function(){
var _3d=this.rawNode;
svgweb.removeChild(_3d,_3d.parentNode);
}});
gs._eventsProcessing.connect=function(_3e,_3f,_40){
if(_3e.substring(0,2)==="on"){
_3e=_3e.substring(2);
}
if(arguments.length==2){
_40=_3f;
}else{
_40=d.hitch(_3f,_40);
}
this.getEventSource().addEventListener(_3e,_40,false);
return [this,_3e,_40];
};
gs._eventsProcessing.disconnect=function(_41){
this.getEventSource().removeEventListener(_41[1],_41[2],false);
delete _41[0];
};
dojo.extend(dojox.gfx.Shape,dojox.gfx.shape._eventsProcessing);
dojo.extend(dojox.gfx.shape.Surface,dojox.gfx.shape._eventsProcessing);
}
})();
}
//======================vml====================//
/*
Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
Available via Academic Free License >= 2.1 OR the modified BSD license.
see: http://dojotoolkit.org/license for details
*/


if(dojox.gfx.renderer=='vml' && !dojo._hasResource["dojox.gfx.vml"]){
dojo._hasResource["dojox.gfx.vml"]=true;
dojo.provide("dojox.gfx.vml");
dojo.require("dojox.gfx._base");
dojo.require("dojox.gfx.shape");
dojo.require("dojox.gfx.path");
dojo.require("dojox.gfx.arc");
dojo.require("dojox.gfx.gradient");
(function(){
var d=dojo,g=dojox.gfx,m=g.matrix,gs=g.shape,_1=g.vml;
_1.xmlns="urn:schemas-microsoft-com:vml";
_1.text_alignment={start:"left",middle:"center",end:"right"};
_1._parseFloat=function(_2){
return _2.match(/^\d+f$/i)?parseInt(_2)/65536:parseFloat(_2);
};
_1._bool={"t":1,"true":1};
d.extend(g.Shape,{setFill:function(_3){
if(!_3){
this.fillStyle=null;
this.rawNode.filled="f";
return this;
}
var i,f,fo,a,s;
if(typeof _3=="object"&&"type" in _3){
switch(_3.type){
case "linear":
var _4=this._getRealMatrix(),_5=this.getBoundingBox(),_6=this._getRealBBox?this._getRealBBox():this.getTransformedBoundingBox();
s=[];
if(this.fillStyle!==_3){
this.fillStyle=g.makeParameters(g.defaultLinearGradient,_3);
}
f=g.gradient.project(_4,this.fillStyle,{x:_5.x,y:_5.y},{x:_5.x+_5.width,y:_5.y+_5.height},_6[0],_6[2]);
a=f.colors;
if(a[0].offset.toFixed(5)!="0.00000"){
s.push("0 "+g.normalizeColor(a[0].color).toHex());
}
for(i=0;i<a.length;++i){
s.push(a[i].offset.toFixed(5)+" "+g.normalizeColor(a[i].color).toHex());
}
i=a.length-1;
if(a[i].offset.toFixed(5)!="1.00000"){
s.push("1 "+g.normalizeColor(a[i].color).toHex());
}
fo=this.rawNode.fill;
fo.colors.value=s.join(";");
fo.method="sigma";
fo.type="gradient";
fo.angle=(270-m._radToDeg(f.angle))%360;
fo.on=true;
break;
case "radial":
f=g.makeParameters(g.defaultRadialGradient,_3);
this.fillStyle=f;
var l=parseFloat(this.rawNode.style.left),t=parseFloat(this.rawNode.style.top),w=parseFloat(this.rawNode.style.width),h=parseFloat(this.rawNode.style.height),c=isNaN(w)?1:2*f.r/w;
a=[];
if(f.colors[0].offset>0){
a.push({offset:1,color:g.normalizeColor(f.colors[0].color)});
}
d.forEach(f.colors,function(v,i){
a.push({offset:1-v.offset*c,color:g.normalizeColor(v.color)});
});
i=a.length-1;
while(i>=0&&a[i].offset<0){
--i;
}
if(i<a.length-1){
var q=a[i],p=a[i+1];
p.color=d.blendColors(q.color,p.color,q.offset/(q.offset-p.offset));
p.offset=0;
while(a.length-i>2){
a.pop();
}
}
i=a.length-1,s=[];
if(a[i].offset>0){
s.push("0 "+a[i].color.toHex());
}
for(;i>=0;--i){
s.push(a[i].offset.toFixed(5)+" "+a[i].color.toHex());
}
fo=this.rawNode.fill;
fo.colors.value=s.join(";");
fo.method="sigma";
fo.type="gradientradial";
if(isNaN(w)||isNaN(h)||isNaN(l)||isNaN(t)){
fo.focusposition="0.5 0.5";
}else{
fo.focusposition=((f.cx-l)/w).toFixed(5)+" "+((f.cy-t)/h).toFixed(5);
}
fo.focussize="0 0";
fo.on=true;
break;
case "pattern":
f=g.makeParameters(g.defaultPattern,_3);
this.fillStyle=f;
fo=this.rawNode.fill;
fo.type="tile";
fo.src=f.src;
if(f.width&&f.height){
fo.size.x=g.px2pt(f.width);
fo.size.y=g.px2pt(f.height);
}
fo.alignShape="f";
fo.position.x=0;
fo.position.y=0;
fo.origin.x=f.width?f.x/f.width:0;
fo.origin.y=f.height?f.y/f.height:0;
fo.on=true;
break;
}
this.rawNode.fill.opacity=1;
return this;
}
this.fillStyle=g.normalizeColor(_3);
fo=this.rawNode.fill;
if(!fo){
fo=this.rawNode.ownerDocument.createElement("v:fill");
}
fo.method="any";
fo.type="solid";
fo.opacity=this.fillStyle.a;
this.rawNode.fillcolor=this.fillStyle.toHex();
this.rawNode.filled=true;
return this;
},setStroke:function(_7){
if(!_7){
this.strokeStyle=null;
this.rawNode.stroked="f";
return this;
}
if(typeof _7=="string"||d.isArray(_7)||_7 instanceof d.Color){
_7={color:_7};
}
var s=this.strokeStyle=g.makeParameters(g.defaultStroke,_7);
s.color=g.normalizeColor(s.color);
var rn=this.rawNode;
rn.stroked=true;
rn.strokecolor=s.color.toCss();
rn.strokeweight=s.width+"px";
if(rn.stroke){
rn.stroke.opacity=s.color.a;
rn.stroke.endcap=this._translate(this._capMap,s.cap);
if(typeof s.join=="number"){
rn.stroke.joinstyle="miter";
rn.stroke.miterlimit=s.join;
}else{
rn.stroke.joinstyle=s.join;
}
rn.stroke.dashstyle=s.style=="none"?"Solid":s.style;
}
return this;
},_capMap:{butt:"flat"},_capMapReversed:{flat:"butt"},_translate:function(_8,_9){
return (_9 in _8)?_8[_9]:_9;
},_applyTransform:function(){
var _a=this._getRealMatrix();
if(_a){
var _b=this.rawNode.skew;
if(typeof _b=="undefined"){
for(var i=0;i<this.rawNode.childNodes.length;++i){
if(this.rawNode.childNodes[i].tagName=="skew"){
_b=this.rawNode.childNodes[i];
break;
}
}
}
if(_b){
_b.on="f";
var mt=_a.xx.toFixed(8)+" "+_a.xy.toFixed(8)+" "+_a.yx.toFixed(8)+" "+_a.yy.toFixed(8)+" 0 0",_c=Math.floor(_a.dx).toFixed()+"px "+Math.floor(_a.dy).toFixed()+"px",s=this.rawNode.style,l=parseFloat(s.left),t=parseFloat(s.top),w=parseFloat(s.width),h=parseFloat(s.height);
if(isNaN(l)){
l=0;
}
if(isNaN(t)){
t=0;
}
if(isNaN(w)||!w){
w=1;
}
if(isNaN(h)||!h){
h=1;
}
var _d=(-l/w-0.5).toFixed(8)+" "+(-t/h-0.5).toFixed(8);
_b.matrix=mt;
_b.origin=_d;
_b.offset=_c;
_b.on=true;
}
}
if(this.fillStyle&&this.fillStyle.type=="linear"){
this.setFill(this.fillStyle);
}
return this;
},_setDimensions:function(_e,_f){
return this;
},setRawNode:function(_10){
_10.stroked="f";
_10.filled="f";
this.rawNode=_10;
},_moveToFront:function(){
this.rawNode.parentNode.appendChild(this.rawNode);
return this;
},_moveToBack:function(){
var r=this.rawNode,p=r.parentNode,n=p.firstChild;
p.insertBefore(r,n);
if(n.tagName=="rect"){
n.swapNode(r);
}
return this;
},_getRealMatrix:function(){
return this.parentMatrix?new g.Matrix2D([this.parentMatrix,this.matrix]):this.matrix;
}});
dojo.declare("dojox.gfx.Group",g.Shape,{constructor:function(){
_1.Container._init.call(this);
},_applyTransform:function(){
var _11=this._getRealMatrix();
for(var i=0;i<this.children.length;++i){
this.children[i]._updateParentMatrix(_11);
}
return this;
},_setDimensions:function(_12,_13){
var r=this.rawNode,rs=r.style,bs=this.bgNode.style;
rs.width=_12;
rs.height=_13;
r.coordsize=_12+" "+_13;
bs.width=_12;
bs.height=_13;
for(var i=0;i<this.children.length;++i){
this.children[i]._setDimensions(_12,_13);
}
return this;
}});
g.Group.nodeType="group";
dojo.declare("dojox.gfx.Rect",gs.Rect,{setShape:function(_14){
var _15=this.shape=g.makeParameters(this.shape,_14);
this.bbox=null;
var r=Math.min(1,(_15.r/Math.min(parseFloat(_15.width),parseFloat(_15.height)))).toFixed(8);
var _16=this.rawNode.parentNode,_17=null;
if(_16){
if(_16.lastChild!==this.rawNode){
for(var i=0;i<_16.childNodes.length;++i){
if(_16.childNodes[i]===this.rawNode){
_17=_16.childNodes[i+1];
break;
}
}
}
_16.removeChild(this.rawNode);
}
if(d.isIE>7){
var _18=this.rawNode.ownerDocument.createElement("v:roundrect");
_18.arcsize=r;
_18.style.display="inline-block";
this.rawNode=_18;
}else{
this.rawNode.arcsize=r;
}
if(_16){
if(_17){
_16.insertBefore(this.rawNode,_17);
}else{
_16.appendChild(this.rawNode);
}
}
var _19=this.rawNode.style;
_19.left=_15.x.toFixed();
_19.top=_15.y.toFixed();
_19.width=(typeof _15.width=="string"&&_15.width.indexOf("%")>=0)?_15.width:_15.width.toFixed();
_19.height=(typeof _15.width=="string"&&_15.height.indexOf("%")>=0)?_15.height:_15.height.toFixed();
return this.setTransform(this.matrix).setFill(this.fillStyle).setStroke(this.strokeStyle);
}});
g.Rect.nodeType="roundrect";
dojo.declare("dojox.gfx.Ellipse",gs.Ellipse,{setShape:function(_1a){
var _1b=this.shape=g.makeParameters(this.shape,_1a);
this.bbox=null;
var _1c=this.rawNode.style;
_1c.left=(_1b.cx-_1b.rx).toFixed();
_1c.top=(_1b.cy-_1b.ry).toFixed();
_1c.width=(_1b.rx*2).toFixed();
_1c.height=(_1b.ry*2).toFixed();
return this.setTransform(this.matrix);
}});
g.Ellipse.nodeType="oval";
dojo.declare("dojox.gfx.Circle",gs.Circle,{setShape:function(_1d){
var _1e=this.shape=g.makeParameters(this.shape,_1d);
this.bbox=null;
var _1f=this.rawNode.style;
_1f.left=(_1e.cx-_1e.r).toFixed();
_1f.top=(_1e.cy-_1e.r).toFixed();
_1f.width=(_1e.r*2).toFixed();
_1f.height=(_1e.r*2).toFixed();
return this;
}});
g.Circle.nodeType="oval";
dojo.declare("dojox.gfx.Line",gs.Line,{constructor:function(_20){
if(_20){
_20.setAttribute("dojoGfxType","line");
}
},setShape:function(_21){
var _22=this.shape=g.makeParameters(this.shape,_21);
this.bbox=null;
this.rawNode.path.v="m"+_22.x1.toFixed()+" "+_22.y1.toFixed()+"l"+_22.x2.toFixed()+" "+_22.y2.toFixed()+"e";
return this.setTransform(this.matrix);
}});
g.Line.nodeType="shape";
dojo.declare("dojox.gfx.Polyline",gs.Polyline,{constructor:function(_23){
if(_23){
_23.setAttribute("dojoGfxType","polyline");
}
},setShape:function(_24,_25){
if(_24&&_24 instanceof Array){
this.shape=g.makeParameters(this.shape,{points:_24});
if(_25&&this.shape.points.length){
this.shape.points.push(this.shape.points[0]);
}
}else{
this.shape=g.makeParameters(this.shape,_24);
}
this.bbox=null;
this._normalizePoints();
var _26=[],p=this.shape.points;
if(p.length>0){
_26.push("m");
_26.push(p[0].x.toFixed(),p[0].y.toFixed());
if(p.length>1){
_26.push("l");
for(var i=1;i<p.length;++i){
_26.push(p[i].x.toFixed(),p[i].y.toFixed());
}
}
}
_26.push("e");
this.rawNode.path.v=_26.join(" ");
return this.setTransform(this.matrix);
}});
g.Polyline.nodeType="shape";
dojo.declare("dojox.gfx.Image",gs.Image,{setShape:function(_27){
var _28=this.shape=g.makeParameters(this.shape,_27);
this.bbox=null;
this.rawNode.firstChild.src=_28.src;
return this.setTransform(this.matrix);
},_applyTransform:function(){
var _29=this._getRealMatrix(),_2a=this.rawNode,s=_2a.style,_2b=this.shape;
if(_29){
_29=m.multiply(_29,{dx:_2b.x,dy:_2b.y});
}else{
_29=m.normalize({dx:_2b.x,dy:_2b.y});
}
if(_29.xy==0&&_29.yx==0&&_29.xx>0&&_29.yy>0){
s.filter="";
s.width=Math.floor(_29.xx*_2b.width);
s.height=Math.floor(_29.yy*_2b.height);
s.left=Math.floor(_29.dx);
s.top=Math.floor(_29.dy);
}else{
var ps=_2a.parentNode.style;
s.left="0px";
s.top="0px";
s.width=ps.width;
s.height=ps.height;
_29=m.multiply(_29,{xx:_2b.width/parseInt(s.width),yy:_2b.height/parseInt(s.height)});
var f=_2a.filters["DXImageTransform.Microsoft.Matrix"];
if(f){
f.M11=_29.xx;
f.M12=_29.xy;
f.M21=_29.yx;
f.M22=_29.yy;
f.Dx=_29.dx;
f.Dy=_29.dy;
}else{
s.filter="progid:DXImageTransform.Microsoft.Matrix(M11="+_29.xx+", M12="+_29.xy+", M21="+_29.yx+", M22="+_29.yy+", Dx="+_29.dx+", Dy="+_29.dy+")";
}
}
return this;
},_setDimensions:function(_2c,_2d){
var r=this.rawNode,f=r.filters["DXImageTransform.Microsoft.Matrix"];
if(f){
var s=r.style;
s.width=_2c;
s.height=_2d;
return this._applyTransform();
}
return this;
}});
g.Image.nodeType="rect";
dojo.declare("dojox.gfx.Text",gs.Text,{constructor:function(_2e){
if(_2e){
_2e.setAttribute("dojoGfxType","text");
}
this.fontStyle=null;
},_alignment:{start:"left",middle:"center",end:"right"},setShape:function(_2f){
this.shape=g.makeParameters(this.shape,_2f);
this.bbox=null;
var r=this.rawNode,s=this.shape,x=s.x,y=s.y.toFixed(),_30;
switch(s.align){
case "middle":
x-=5;
break;
case "end":
x-=10;
break;
}
_30="m"+x.toFixed()+","+y+"l"+(x+10).toFixed()+","+y+"e";
var p=null,t=null,c=r.childNodes;
for(var i=0;i<c.length;++i){
var tag=c[i].tagName;
if(tag=="path"){
p=c[i];
if(t){
break;
}
}else{
if(tag=="textpath"){
t=c[i];
if(p){
break;
}
}
}
}
if(!p){
p=r.ownerDocument.createElement("v:path");
r.appendChild(p);
}
if(!t){
t=r.ownerDocument.createElement("v:textpath");
r.appendChild(t);
}
p.v=_30;
p.textPathOk=true;
t.on=true;
var a=_1.text_alignment[s.align];
t.style["v-text-align"]=a?a:"left";
t.style["text-decoration"]=s.decoration;
t.style["v-rotate-letters"]=s.rotated;
t.style["v-text-kern"]=s.kerning;
t.string=s.text;
return this.setTransform(this.matrix);
},_setFont:function(){
var f=this.fontStyle,c=this.rawNode.childNodes;
for(var i=0;i<c.length;++i){
if(c[i].tagName=="textpath"){
c[i].style.font=g.makeFontString(f);
break;
}
}
this.setTransform(this.matrix);
},_getRealMatrix:function(){
var _31=g.Shape.prototype._getRealMatrix.call(this);
if(_31){
_31=m.multiply(_31,{dy:-g.normalizedLength(this.fontStyle?this.fontStyle.size:"10pt")*0.35});
}
return _31;
},getTextWidth:function(){
var _32=this.rawNode,_33=_32.style.display;
_32.style.display="inline";
var _34=g.pt2px(parseFloat(_32.currentStyle.width));
_32.style.display=_33;
return _34;
}});
g.Text.nodeType="shape";
dojo.declare("dojox.gfx.Path",g.path.Path,{constructor:function(_35){
if(_35&&!_35.getAttribute("dojoGfxType")){
_35.setAttribute("dojoGfxType","path");
}
this.vmlPath="";
this.lastControl={};
},_updateWithSegment:function(_36){
var _37=d.clone(this.last);
g.Path.superclass._updateWithSegment.apply(this,arguments);
if(arguments.length>1){
return;
}
var _38=this[this.renderers[_36.action]](_36,_37);
if(typeof this.vmlPath=="string"){
this.vmlPath+=_38.join("");
this.rawNode.path.v=this.vmlPath+" r0,0 e";
}else{
Array.prototype.push.apply(this.vmlPath,_38);
}
},setShape:function(_39){
this.vmlPath=[];
this.lastControl.type="";
g.Path.superclass.setShape.apply(this,arguments);
this.vmlPath=this.vmlPath.join("");
this.rawNode.path.v=this.vmlPath+" r0,0 e";
return this;
},_pathVmlToSvgMap:{m:"M",l:"L",t:"m",r:"l",c:"C",v:"c",qb:"Q",x:"z",e:""},renderers:{M:"_moveToA",m:"_moveToR",L:"_lineToA",l:"_lineToR",H:"_hLineToA",h:"_hLineToR",V:"_vLineToA",v:"_vLineToR",C:"_curveToA",c:"_curveToR",S:"_smoothCurveToA",s:"_smoothCurveToR",Q:"_qCurveToA",q:"_qCurveToR",T:"_qSmoothCurveToA",t:"_qSmoothCurveToR",A:"_arcTo",a:"_arcTo",Z:"_closePath",z:"_closePath"},_addArgs:function(_3a,_3b,_3c,_3d){
var n=_3b instanceof Array?_3b:_3b.args;
for(var i=_3c;i<_3d;++i){
_3a.push(" ",n[i].toFixed());
}
},_adjustRelCrd:function(_3e,_3f,_40){
var n=_3f instanceof Array?_3f:_3f.args,l=n.length,_41=new Array(l),i=0,x=_3e.x,y=_3e.y;
if(typeof x!="number"){
_41[0]=x=n[0];
_41[1]=y=n[1];
i=2;
}
if(typeof _40=="number"&&_40!=2){
var j=_40;
while(j<=l){
for(;i<j;i+=2){
_41[i]=x+n[i];
_41[i+1]=y+n[i+1];
}
x=_41[j-2];
y=_41[j-1];
j+=_40;
}
}else{
for(;i<l;i+=2){
_41[i]=(x+=n[i]);
_41[i+1]=(y+=n[i+1]);
}
}
return _41;
},_adjustRelPos:function(_42,_43){
var n=_43 instanceof Array?_43:_43.args,l=n.length,_44=new Array(l);
for(var i=0;i<l;++i){
_44[i]=(_42+=n[i]);
}
return _44;
},_moveToA:function(_45){
var p=[" m"],n=_45 instanceof Array?_45:_45.args,l=n.length;
this._addArgs(p,n,0,2);
if(l>2){
p.push(" l");
this._addArgs(p,n,2,l);
}
this.lastControl.type="";
return p;
},_moveToR:function(_46,_47){
return this._moveToA(this._adjustRelCrd(_47,_46));
},_lineToA:function(_48){
var p=[" l"],n=_48 instanceof Array?_48:_48.args;
this._addArgs(p,n,0,n.length);
this.lastControl.type="";
return p;
},_lineToR:function(_49,_4a){
return this._lineToA(this._adjustRelCrd(_4a,_49));
},_hLineToA:function(_4b,_4c){
var p=[" l"],y=" "+_4c.y.toFixed(),n=_4b instanceof Array?_4b:_4b.args,l=n.length;
for(var i=0;i<l;++i){
p.push(" ",n[i].toFixed(),y);
}
this.lastControl.type="";
return p;
},_hLineToR:function(_4d,_4e){
return this._hLineToA(this._adjustRelPos(_4e.x,_4d),_4e);
},_vLineToA:function(_4f,_50){
var p=[" l"],x=" "+_50.x.toFixed(),n=_4f instanceof Array?_4f:_4f.args,l=n.length;
for(var i=0;i<l;++i){
p.push(x," ",n[i].toFixed());
}
this.lastControl.type="";
return p;
},_vLineToR:function(_51,_52){
return this._vLineToA(this._adjustRelPos(_52.y,_51),_52);
},_curveToA:function(_53){
var p=[],n=_53 instanceof Array?_53:_53.args,l=n.length,lc=this.lastControl;
for(var i=0;i<l;i+=6){
p.push(" c");
this._addArgs(p,n,i,i+6);
}
lc.x=n[l-4];
lc.y=n[l-3];
lc.type="C";
return p;
},_curveToR:function(_54,_55){
return this._curveToA(this._adjustRelCrd(_55,_54,6));
},_smoothCurveToA:function(_56,_57){
var p=[],n=_56 instanceof Array?_56:_56.args,l=n.length,lc=this.lastControl,i=0;
if(lc.type!="C"){
p.push(" c");
this._addArgs(p,[_57.x,_57.y],0,2);
this._addArgs(p,n,0,4);
lc.x=n[0];
lc.y=n[1];
lc.type="C";
i=4;
}
for(;i<l;i+=4){
p.push(" c");
this._addArgs(p,[2*_57.x-lc.x,2*_57.y-lc.y],0,2);
this._addArgs(p,n,i,i+4);
lc.x=n[i];
lc.y=n[i+1];
}
return p;
},_smoothCurveToR:function(_58,_59){
return this._smoothCurveToA(this._adjustRelCrd(_59,_58,4),_59);
},_qCurveToA:function(_5a){
var p=[],n=_5a instanceof Array?_5a:_5a.args,l=n.length,lc=this.lastControl;
for(var i=0;i<l;i+=4){
p.push(" qb");
this._addArgs(p,n,i,i+4);
}
lc.x=n[l-4];
lc.y=n[l-3];
lc.type="Q";
return p;
},_qCurveToR:function(_5b,_5c){
return this._qCurveToA(this._adjustRelCrd(_5c,_5b,4));
},_qSmoothCurveToA:function(_5d,_5e){
var p=[],n=_5d instanceof Array?_5d:_5d.args,l=n.length,lc=this.lastControl,i=0;
if(lc.type!="Q"){
p.push(" qb");
this._addArgs(p,[lc.x=_5e.x,lc.y=_5e.y],0,2);
lc.type="Q";
this._addArgs(p,n,0,2);
i=2;
}
for(;i<l;i+=2){
p.push(" qb");
this._addArgs(p,[lc.x=2*_5e.x-lc.x,lc.y=2*_5e.y-lc.y],0,2);
this._addArgs(p,n,i,i+2);
}
return p;
},_qSmoothCurveToR:function(_5f,_60){
return this._qSmoothCurveToA(this._adjustRelCrd(_60,_5f,2),_60);
},_arcTo:function(_61,_62){
var p=[],n=_61.args,l=n.length,_63=_61.action=="a";
for(var i=0;i<l;i+=7){
var x1=n[i+5],y1=n[i+6];
if(_63){
x1+=_62.x;
y1+=_62.y;
}
var _64=g.arc.arcAsBezier(_62,n[i],n[i+1],n[i+2],n[i+3]?1:0,n[i+4]?1:0,x1,y1);
for(var j=0;j<_64.length;++j){
p.push(" c");
var t=_64[j];
this._addArgs(p,t,0,t.length);
this._updateBBox(t[0],t[1]);
this._updateBBox(t[2],t[3]);
this._updateBBox(t[4],t[5]);
}
_62.x=x1;
_62.y=y1;
}
this.lastControl.type="";
return p;
},_closePath:function(){
this.lastControl.type="";
return ["x"];
}});
g.Path.nodeType="shape";
dojo.declare("dojox.gfx.TextPath",g.Path,{constructor:function(_65){
if(_65){
_65.setAttribute("dojoGfxType","textpath");
}
this.fontStyle=null;
if(!("text" in this)){
this.text=d.clone(g.defaultTextPath);
}
if(!("fontStyle" in this)){
this.fontStyle=d.clone(g.defaultFont);
}
},setText:function(_66){
this.text=g.makeParameters(this.text,typeof _66=="string"?{text:_66}:_66);
this._setText();
return this;
},setFont:function(_67){
this.fontStyle=typeof _67=="string"?g.splitFontString(_67):g.makeParameters(g.defaultFont,_67);
this._setFont();
return this;
},_setText:function(){
this.bbox=null;
var r=this.rawNode,s=this.text,p=null,t=null,c=r.childNodes;
for(var i=0;i<c.length;++i){
var tag=c[i].tagName;
if(tag=="path"){
p=c[i];
if(t){
break;
}
}else{
if(tag=="textpath"){
t=c[i];
if(p){
break;
}
}
}
}
if(!p){
p=this.rawNode.ownerDocument.createElement("v:path");
r.appendChild(p);
}
if(!t){
t=this.rawNode.ownerDocument.createElement("v:textpath");
r.appendChild(t);
}
p.textPathOk=true;
t.on=true;
var a=_1.text_alignment[s.align];
t.style["v-text-align"]=a?a:"left";
t.style["text-decoration"]=s.decoration;
t.style["v-rotate-letters"]=s.rotated;
t.style["v-text-kern"]=s.kerning;
t.string=s.text;
},_setFont:function(){
var f=this.fontStyle,c=this.rawNode.childNodes;
for(var i=0;i<c.length;++i){
if(c[i].tagName=="textpath"){
c[i].style.font=g.makeFontString(f);
break;
}
}
}});
g.TextPath.nodeType="shape";
dojo.declare("dojox.gfx.Surface",gs.Surface,{constructor:function(){
_1.Container._init.call(this);
},setDimensions:function(_68,_69){
this.width=g.normalizedLength(_68);
this.height=g.normalizedLength(_69);
if(!this.rawNode){
return this;
}
var cs=this.clipNode.style,r=this.rawNode,rs=r.style,bs=this.bgNode.style,ps=this._parent.style,i;
//zmh 修改ie8下style的值不能设置负数问题
//ps.width=_68;
//ps.height=_69;
//cs.width=_68;
//cs.height=_69;
//cs.clip="rect(0px "+_68+"px "+_69+"px 0px)";
//rs.width=_68;
//rs.height=_69;
//r.coordsize=_68+" "+_69;
//bs.width=_68;
//bs.height=_69;
ps.width=_68<0?0:_68;
ps.height=_69<0?0:_69;
cs.width=_68<0?0:_68
cs.height=_69<0?0:_69;
cs.clip="rect(0px "+_68+"px "+_69+"px 0px)";
rs.width=_68<0?0:_68;
rs.height=_69<0?0:_69;
r.coordsize=_68+" "+_69;
bs.width=_68<0?0:_68;
bs.height=_69<0?0:_69;
 
for(i=0;i<this.children.length;++i){
this.children[i]._setDimensions(_68,_69);
}
return this;
},getDimensions:function(){
var t=this.rawNode?{width:g.normalizedLength(this.rawNode.style.width),height:g.normalizedLength(this.rawNode.style.height)}:null;
if(t.width<=0){
t.width=this.width;
}
if(t.height<=0){
t.height=this.height;
}
return t;
}});
g.createSurface=function(_6a,_6b,_6c){
if(!_6b&&!_6c){
var pos=d.position(_6a);
_6b=_6b||pos.w;
_6c=_6c||pos.h;
}
if(typeof _6b=="number"){
_6b=_6b+"px";
}
if(typeof _6c=="number"){
_6c=_6c+"px";
}
var s=new g.Surface(),p=d.byId(_6a),c=s.clipNode=p.ownerDocument.createElement("div"),r=s.rawNode=p.ownerDocument.createElement("v:group"),cs=c.style,rs=r.style;
if(d.isIE>7){
rs.display="inline-block";
}
s._parent=p;
s._nodes.push(c);
p.style.width=_6b;
p.style.height=_6c;
cs.position="absolute";
cs.width=_6b;
cs.height=_6c;
cs.clip="rect(0px "+_6b+" "+_6c+" 0px)";
rs.position="absolute";
rs.width=_6b;
rs.height=_6c;
r.coordsize=(_6b==="100%"?_6b:parseFloat(_6b))+" "+(_6c==="100%"?_6c:parseFloat(_6c));
r.coordorigin="0 0";
var b=s.bgNode=r.ownerDocument.createElement("v:rect"),bs=b.style;
bs.left=bs.top=0;
bs.width=rs.width;
bs.height=rs.height;
b.filled=b.stroked="f";
r.appendChild(b);
c.appendChild(r);
p.appendChild(c);
s.width=g.normalizedLength(_6b);
s.height=g.normalizedLength(_6c);
return s;
};
_1.Container={_init:function(){
gs.Container._init.call(this);
},add:function(_6d){
if(this!=_6d.getParent()){
this.rawNode.appendChild(_6d.rawNode);
if(!_6d.getParent()){
_6d.setFill(_6d.getFill());
_6d.setStroke(_6d.getStroke());
}
gs.Container.add.apply(this,arguments);
}
return this;
},remove:function(_6e,_6f){
if(this==_6e.getParent()){
if(this.rawNode==_6e.rawNode.parentNode){
this.rawNode.removeChild(_6e.rawNode);
}
gs.Container.remove.apply(this,arguments);
}
return this;
},clear:function(){
var r=this.rawNode;
while(r.firstChild!=r.lastChild){
if(r.firstChild!=this.bgNode){
r.removeChild(r.firstChild);
}
if(r.lastChild!=this.bgNode){
r.removeChild(r.lastChild);
}
}
return gs.Container.clear.apply(this,arguments);
},_moveChildToFront:gs.Container._moveChildToFront,_moveChildToBack:gs.Container._moveChildToBack};
dojo.mixin(gs.Creator,{createGroup:function(){
var _70=this.createObject(g.Group,null);
var r=_70.rawNode.ownerDocument.createElement("v:rect");
r.style.left=r.style.top=0;
r.style.width=_70.rawNode.style.width;
r.style.height=_70.rawNode.style.height;
r.filled=r.stroked="f";
_70.rawNode.appendChild(r);
_70.bgNode=r;
return _70;
},createImage:function(_71){
if(!this.rawNode){
return null;
}
var _72=new g.Image(),doc=this.rawNode.ownerDocument,_73=doc.createElement("v:rect");
_73.stroked="f";
_73.style.width=this.rawNode.style.width;
_73.style.height=this.rawNode.style.height;
var img=doc.createElement("v:imagedata");
_73.appendChild(img);
_72.setRawNode(_73);
this.rawNode.appendChild(_73);
_72.setShape(_71);
this.add(_72);
return _72;
},createRect:function(_74){
if(!this.rawNode){
return null;
}
var _75=new g.Rect,_76=this.rawNode.ownerDocument.createElement("v:roundrect");
if(d.isIE>7){
_76.style.display="inline-block";
}
_75.setRawNode(_76);
this.rawNode.appendChild(_76);
_75.setShape(_74);
this.add(_75);
return _75;
},createObject:function(_77,_78){
if(!this.rawNode){
return null;
}
var _79=new _77(),_7a=this.rawNode.ownerDocument.createElement("v:"+_77.nodeType);
_79.setRawNode(_7a);
this.rawNode.appendChild(_7a);
switch(_77){
case g.Group:
case g.Line:
case g.Polyline:
case g.Image:
case g.Text:
case g.Path:
case g.TextPath:
this._overrideSize(_7a);
}
_79.setShape(_78);
this.add(_79);
return _79;
},_overrideSize:function(_7b){
var s=this.rawNode.style,w=s.width,h=s.height;
_7b.style.width=w;
_7b.style.height=h;
_7b.coordsize=parseInt(w)+" "+parseInt(h);
}});
d.extend(g.Group,_1.Container);
d.extend(g.Group,gs.Creator);
d.extend(g.Surface,_1.Container);
d.extend(g.Surface,gs.Creator);
})();
 
}
//=========================== dojo end ======================
var msgCount = 0;
var footer = document.getElementById("footer");
var msgPanel
function print(msg) {
	msgCount++;
	if (!footer) {
		footer = document.getElementById("footer");
		footer.innerHTML = "<textarea id=\"msgEditor\" wrap=\"off\" style=\"width:100%;height:200px\" name=\"textarea1\"> </textarea>";
		msgPanel = document.getElementById("msgEditor");
	}
	msgPanel.value += msg + "\n";
	msgPanel.doScroll("scrollbarPageDown");

}
//字符串函数扩展.
String.prototype.endWith = function(str) {
	if (str == null || str == "" || this.length == 0
			|| str.length > this.length)
		return false;
	if (this.substring(this.length - str.length) == str)
		return true;
	else
		return false;
	return true;
}
String.prototype.trim = function() {      
    //return this.replace(/[(^\s+)(\s+$)]/g,"");//會把字符串中間的空白符也去掉      
    //return this.replace(/^\s+|\s+$/g,""); //      
    return this.replace(/^\s+/g,"").replace(/\s+$/g,"");      
}   
String.prototype.startWith = function(str) {
	if (str == null || str == "" || this.length == 0
			|| str.length > this.length)
		return false;
	if (this.substr(0, str.length) == str)
		return true;
	else
		return false;
	return true;
}

String.prototype.replaceAll = function(s1, s2) {
	return this.replace(new RegExp(s1, "gm"), s2);
}  

String.prototype.contains = function(substr,isIgnoreCase)
 {
 	var that = this; 
	if (isIgnoreCase) {
		that = this.toLowerCase();
		substr = substr.toLowerCase();
	}
	var startChar = substr.substring(0, 1);
	var strLen = substr.length;
	for (var j = 0,l=that.length - strLen + 1; j < l; j++) {
		if (that.charAt(j) == startChar)// 如果匹配起始字符,开始查找
		{
			if (that.substring(j, j + strLen) == substr)// 如果从j开始的字符与str匹配，那ok
			{
				return true;
			}
		}
	}
	return false;
}


Justep = {};
Justep.data = {};
Justep.util = {};
Justep.coms = {};

Justep.apply = function(o, c, defaults) {
	if (defaults) {
		// no "this" reference for friendly out of scope calls
		Justep.apply(o, defaults);
	}
	if (o && c && typeof c == 'object') {
		for (var p in c) {
			o[p] = c[p];
		}
	}
	return o;
};

Justep.apply(Justep, {
	count:0,
	extend : function() {

		var io = function(o) {
			for (var m in o) {
				this[m] = o[m];
			}
		};
		var oc = Object.prototype.constructor;

		return function(sb, sp, overrides) {
			if (typeof sp == 'object') {
				overrides = sp;
				sp = sb;
				sb = overrides.constructor != oc
						? overrides.constructor
						: function() {
							sp.apply(this, arguments);
						};
			}
			var F = function() {
			}, sbp, spp = sp.prototype;
			F.prototype = spp;
			sbp = sb.prototype = new F();
			sbp.constructor = sb;
			sb.superclass = spp;
			if (spp.constructor == oc) {
				spp.constructor = sp;
			}
			sb.override = function(o) {
				Justep.override(sb, o);
			};
			sbp.override = io;
			Justep.override(sb, overrides);
			return sb;
		};
	}(),

	override : function(origclass, overrides) {
		if (overrides) {
			var p = origclass.prototype;
			for (var method in overrides) {
				p[method] = overrides[method];
			}
		}
	},
	isEmpty : function(v, allowBlank) {
		return v === null || v === undefined
				|| (!allowBlank ? v === '' : false);
	},

	value : function(v, defaultValue, allowBlank) {
		return Justep.isEmpty(v, allowBlank) ? defaultValue : v;
	},
	isEmpty:function(v,allowBlank){
		return v===null||v===undefined||(!allowBlank?v==="":false)
	},
	isArray : function(v) {
		return v && typeof v.pop == 'function';
	},
	getCom : function(id) {
		return Justep.coms[id];
	},
	genaGUID:function(){
		return "id_"+(new Date()).getTime()+""+(this.count++);
	}
});

var Browser = {
	MO : (typeof(document.implementation) != "undefined"
			&& typeof(document.implementation.createDocument) != "undefined" && typeof(HTMLDocument) != "undefined"),
	IE : window.ActiveXObject ? true : false,
	FF : (navigator.userAgent.toLowerCase().indexOf("firefox") > -1),
	OP : (navigator.userAgent.toLowerCase().indexOf("opera") > -1),
	Event : function(e) {
		if (this.IE)
			return window.event;
		else if (this.FF)
			return e;
	}
}

var EventUtil = new Object;

EventUtil.addListener = function(oTarget, sEventType, handler,owner) {
	var eventHandler = handler;
	if (owner) {
		// 在这里重新定义一个处理函数
		eventHandler = function(e) {
			handler.call(owner, e);
		}
	}
	// firefox情况下
	if (oTarget.addEventListener) {
		oTarget.addEventListener(sEventType, eventHandler, false);
	}
	// IE下
	else if (oTarget.attachEvent) {
		oTarget.attachEvent("on" + sEventType, eventHandler);
	} else {
		oTarget["on" + sEventType] = eventHandler;
	}
};
EventUtil.on = EventUtil.addListener;

EventUtil.removeListener = function (oTarget, sEventType, fnHandler) {
     if (oTarget.removeEventListener) {
         oTarget.removeEventListener(sEventType, fnHandler, false);
     } else if (oTarget.detachEvent) {
         oTarget.detachEvent("on" + sEventType, fnHandler);
     } else {
         oTarget["on" + sEventType] = null;
     }
};

EventUtil.formatEvent = function(oEvent) {
	// isIE和isWin引用到一个js文件，判断浏览器和操作系统类型
	if (Browser.IE) {
		oEvent.charCode = (oEvent.type == "keypress") ? oEvent.keyCode : 0;
		// IE只支持冒泡，不支持捕获
		oEvent.eventPhase = 2;
		oEvent.isChar = (oEvent.charCode > 0);
		oEvent.pageX = oEvent.clientX + document.body.scrollLeft;
		oEvent.pageY = oEvent.clientY + document.body.scrollTop;
		// 阻止事件的默认行为
		oEvent.preventDefault = function() {
			this.returnValue = false;
		};

		// 将toElement,fromElement转化为标准的relatedTarget
		if (oEvent.type == "mouseout") {
			oEvent.relatedTarget = oEvent.toElement;
		} else if (oEvent.type == "mouseover") {
			oEvent.relatedTarget = oEvent.fromElement;
		}
		// 取消冒泡
		oEvent.stopPropagation = function() {
			this.cancelBubble = true;
		};

		oEvent.target = oEvent.srcElement;
		// 添加事件发生时间属性，IE没有
		oEvent.time = (new Date).getTime();
	}
	return oEvent;
};

EventUtil.getEvent = function() {
	return window.event;
	if (window.event) {
		// 格式化IE的事件
		return this.formatEvent(window.event);
	} else {
		return EventUtil.getEvent.caller.arguments[0];
	}
};
