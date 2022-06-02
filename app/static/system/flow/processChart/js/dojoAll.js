/*=================dojo.js================*/
/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/

/*
	This is an optimized version of Dojo, built for deployment and not for
	development. To get sources and documentation, please visit:

		http://dojotoolkit.org
*/

(function(){var _1=null;if((_1||(typeof djConfig!="undefined"&&djConfig.scopeMap))&&(typeof window!="undefined")){var _2="",_3="",_4="",_5={},_6={};_1=_1||djConfig.scopeMap;for(var i=0;i<_1.length;i++){var _7=_1[i];_2+="var "+_7[0]+" = {}; "+_7[1]+" = "+_7[0]+";"+_7[1]+"._scopeName = '"+_7[1]+"';";_3+=(i==0?"":",")+_7[0];_4+=(i==0?"":",")+_7[1];_5[_7[0]]=_7[1];_6[_7[1]]=_7[0];}eval(_2+"dojo._scopeArgs = ["+_4+"];");dojo._scopePrefixArgs=_3;dojo._scopePrefix="(function("+_3+"){";dojo._scopeSuffix="})("+_4+")";dojo._scopeMap=_5;dojo._scopeMapRev=_6;}(function(){if(typeof this["loadFirebugConsole"]=="function"){this["loadFirebugConsole"]();}else{this.console=this.console||{};var cn=["assert","count","debug","dir","dirxml","error","group","groupEnd","info","profile","profileEnd","time","timeEnd","trace","warn","log"];var i=0,tn;while((tn=cn[i++])){if(!console[tn]){(function(){var _8=tn+"";console[_8]=("log" in console)?function(){var a=Array.apply({},arguments);a.unshift(_8+":");console["log"](a.join(" "));}:function(){};console[_8]._fake=true;})();}}}if(typeof dojo=="undefined"){dojo={_scopeName:"dojo",_scopePrefix:"",_scopePrefixArgs:"",_scopeSuffix:"",_scopeMap:{},_scopeMapRev:{}};}var d=dojo;if(typeof dijit=="undefined"){dijit={_scopeName:"dijit"};}if(typeof dojox=="undefined"){dojox={_scopeName:"dojox"};}if(!d._scopeArgs){d._scopeArgs=[dojo,dijit,dojox];}d.global=this;d.config={isDebug:false,debugAtAllCosts:false};var _9=typeof djConfig!="undefined"?djConfig:typeof dojoConfig!="undefined"?dojoConfig:null;if(_9){for(var c in _9){d.config[c]=_9[c];}}dojo.locale=d.config.locale;var _a="$Rev: 24595 $".match(/\d+/);dojo.version={major:1,minor:6,patch:1,flag:"",revision:_a?+_a[0]:NaN,toString:function(){with(d.version){return major+"."+minor+"."+patch+flag+" ("+revision+")";}}};if(typeof OpenAjax!="undefined"){OpenAjax.hub.registerLibrary(dojo._scopeName,"http://dojotoolkit.org",d.version.toString());}var _b,_c,_d={};for(var i in {toString:1}){_b=[];break;}dojo._extraNames=_b=_b||["hasOwnProperty","valueOf","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","constructor"];_c=_b.length;dojo._mixin=function(_e,_f){var _10,s,i;for(_10 in _f){s=_f[_10];if(!(_10 in _e)||(_e[_10]!==s&&(!(_10 in _d)||_d[_10]!==s))){_e[_10]=s;}}if(_c&&_f){for(i=0;i<_c;++i){_10=_b[i];s=_f[_10];if(!(_10 in _e)||(_e[_10]!==s&&(!(_10 in _d)||_d[_10]!==s))){_e[_10]=s;}}}return _e;};dojo.mixin=function(obj,_11){if(!obj){obj={};}for(var i=1,l=arguments.length;i<l;i++){d._mixin(obj,arguments[i]);}return obj;};dojo._getProp=function(_12,_13,_14){var obj=_14||d.global;for(var i=0,p;obj&&(p=_12[i]);i++){if(i==0&&d._scopeMap[p]){p=d._scopeMap[p];}obj=(p in obj?obj[p]:(_13?obj[p]={}:undefined));}return obj;};dojo.setObject=function(_15,_16,_17){var _18=_15.split("."),p=_18.pop(),obj=d._getProp(_18,true,_17);return obj&&p?(obj[p]=_16):undefined;};dojo.getObject=function(_19,_1a,_1b){return d._getProp(_19.split("."),_1a,_1b);};dojo.exists=function(_1c,obj){return d.getObject(_1c,false,obj)!==undefined;};dojo["eval"]=function(_1d){return d.global.eval?d.global.eval(_1d):eval(_1d);};d.deprecated=d.experimental=function(){};})();(function(){var d=dojo,_1e;d.mixin(d,{_loadedModules:{},_inFlightCount:0,_hasResource:{},_modulePrefixes:{dojo:{name:"dojo",value:"."},doh:{name:"doh",value:"../util/doh"},tests:{name:"tests",value:"tests"}},_moduleHasPrefix:function(_1f){var mp=d._modulePrefixes;return !!(mp[_1f]&&mp[_1f].value);},_getModulePrefix:function(_20){var mp=d._modulePrefixes;if(d._moduleHasPrefix(_20)){return mp[_20].value;}return _20;},_loadedUrls:[],_postLoad:false,_loaders:[],_unloaders:[],_loadNotifying:false});dojo._loadPath=function(_21,_22,cb){var uri=((_21.charAt(0)=="/"||_21.match(/^\w+:/))?"":d.baseUrl)+_21;try{_1e=_22;return !_22?d._loadUri(uri,cb):d._loadUriAndCheck(uri,_22,cb);}catch(e){console.error(e);return false;}finally{_1e=null;}};dojo._loadUri=function(uri,cb){if(d._loadedUrls[uri]){return true;}d._inFlightCount++;var _23=d._getText(uri,true);if(_23){d._loadedUrls[uri]=true;d._loadedUrls.push(uri);if(cb){_23=/^define\(/.test(_23)?_23:"("+_23+")";}else{_23=d._scopePrefix+_23+d._scopeSuffix;}if(!d.isIE){_23+="\r\n//@ sourceURL="+uri;}var _24=d["eval"](_23);if(cb){cb(_24);}}if(--d._inFlightCount==0&&d._postLoad&&d._loaders.length){setTimeout(function(){if(d._inFlightCount==0){d._callLoaded();}},0);}return !!_23;};dojo._loadUriAndCheck=function(uri,_25,cb){var ok=false;try{ok=d._loadUri(uri,cb);}catch(e){console.error("failed loading "+uri+" with error: "+e);}return !!(ok&&d._loadedModules[_25]);};dojo.loaded=function(){d._loadNotifying=true;d._postLoad=true;var mll=d._loaders;d._loaders=[];for(var x=0;x<mll.length;x++){mll[x]();}d._loadNotifying=false;if(d._postLoad&&d._inFlightCount==0&&mll.length){d._callLoaded();}};dojo.unloaded=function(){var mll=d._unloaders;while(mll.length){(mll.pop())();}};d._onto=function(arr,obj,fn){if(!fn){arr.push(obj);}else{if(fn){var _26=(typeof fn=="string")?obj[fn]:fn;arr.push(function(){_26.call(obj);});}}};dojo.ready=dojo.addOnLoad=function(obj,_27){d._onto(d._loaders,obj,_27);if(d._postLoad&&d._inFlightCount==0&&!d._loadNotifying){d._callLoaded();}};var dca=d.config.addOnLoad;if(dca){d.addOnLoad[(dca instanceof Array?"apply":"call")](d,dca);}dojo._modulesLoaded=function(){if(d._postLoad){return;}if(d._inFlightCount>0){console.warn("files still in flight!");return;}d._callLoaded();};dojo._callLoaded=function(){if(typeof setTimeout=="object"||(d.config.useXDomain&&d.isOpera)){setTimeout(d.isAIR?function(){d.loaded();}:d._scopeName+".loaded();",0);}else{d.loaded();}};dojo._getModuleSymbols=function(_28){var _29=_28.split(".");for(var i=_29.length;i>0;i--){var _2a=_29.slice(0,i).join(".");if(i==1&&!d._moduleHasPrefix(_2a)){_29[0]="../"+_29[0];}else{var _2b=d._getModulePrefix(_2a);if(_2b!=_2a){_29.splice(0,i,_2b);break;}}}return _29;};dojo._global_omit_module_check=false;dojo.loadInit=function(_2c){_2c();};dojo._loadModule=dojo.require=function(_2d,_2e){_2e=d._global_omit_module_check||_2e;var _2f=d._loadedModules[_2d];if(_2f){return _2f;}var _30=d._getModuleSymbols(_2d).join("/")+".js";var _31=!_2e?_2d:null;var ok=d._loadPath(_30,_31);if(!ok&&!_2e){throw new Error("Could not load '"+_2d+"'; last tried '"+_30+"'");}if(!_2e&&!d._isXDomain){_2f=d._loadedModules[_2d];if(!_2f){throw new Error("symbol '"+_2d+"' is not defined after loading '"+_30+"'");}}return _2f;};dojo.provide=function(_32){_32=_32+"";return (d._loadedModules[_32]=d.getObject(_32,true));};dojo.platformRequire=function(_33){var _34=_33.common||[];var _35=_34.concat(_33[d._name]||_33["default"]||[]);for(var x=0;x<_35.length;x++){var _36=_35[x];if(_36.constructor==Array){d._loadModule.apply(d,_36);}else{d._loadModule(_36);}}};dojo.requireIf=function(_37,_38){if(_37===true){var _39=[];for(var i=1;i<arguments.length;i++){_39.push(arguments[i]);}d.require.apply(d,_39);}};dojo.requireAfterIf=d.requireIf;dojo.registerModulePath=function(_3a,_3b){d._modulePrefixes[_3a]={name:_3a,value:_3b};};dojo.requireLocalization=function(_3c,_3d,_3e,_3f){d.require("dojo.i18n");d.i18n._requireLocalization.apply(d.hostenv,arguments);};var ore=new RegExp("^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?$"),ire=new RegExp("^((([^\\[:]+):)?([^@]+)@)?(\\[([^\\]]+)\\]|([^\\[:]*))(:([0-9]+))?$");dojo._Url=function(){var n=null,_40=arguments,uri=[_40[0]];for(var i=1;i<_40.length;i++){if(!_40[i]){continue;}var _41=new d._Url(_40[i]+""),_42=new d._Url(uri[0]+"");if(_41.path==""&&!_41.scheme&&!_41.authority&&!_41.query){if(_41.fragment!=n){_42.fragment=_41.fragment;}_41=_42;}else{if(!_41.scheme){_41.scheme=_42.scheme;if(!_41.authority){_41.authority=_42.authority;if(_41.path.charAt(0)!="/"){var _43=_42.path.substring(0,_42.path.lastIndexOf("/")+1)+_41.path;var _44=_43.split("/");for(var j=0;j<_44.length;j++){if(_44[j]=="."){if(j==_44.length-1){_44[j]="";}else{_44.splice(j,1);j--;}}else{if(j>0&&!(j==1&&_44[0]=="")&&_44[j]==".."&&_44[j-1]!=".."){if(j==(_44.length-1)){_44.splice(j,1);_44[j-1]="";}else{_44.splice(j-1,2);j-=2;}}}}_41.path=_44.join("/");}}}}uri=[];if(_41.scheme){uri.push(_41.scheme,":");}if(_41.authority){uri.push("//",_41.authority);}uri.push(_41.path);if(_41.query){uri.push("?",_41.query);}if(_41.fragment){uri.push("#",_41.fragment);}}this.uri=uri.join("");var r=this.uri.match(ore);this.scheme=r[2]||(r[1]?"":n);this.authority=r[4]||(r[3]?"":n);this.path=r[5];this.query=r[7]||(r[6]?"":n);this.fragment=r[9]||(r[8]?"":n);if(this.authority!=n){r=this.authority.match(ire);this.user=r[3]||n;this.password=r[4]||n;this.host=r[6]||r[7];this.port=r[9]||n;}};dojo._Url.prototype.toString=function(){return this.uri;};dojo.moduleUrl=function(_45,url){var loc=d._getModuleSymbols(_45).join("/");if(!loc){return null;}if(loc.lastIndexOf("/")!=loc.length-1){loc+="/";}var _46=loc.indexOf(":");if(loc.charAt(0)!="/"&&(_46==-1||_46>loc.indexOf("/"))){loc=d.baseUrl+loc;}return new d._Url(loc,url);};})();if(typeof window!="undefined"){dojo.isBrowser=true;dojo._name="browser";(function(){var d=dojo;if(document&&document.getElementsByTagName){var _47=document.getElementsByTagName("script");var _48=/dojo(\.xd)?\.js(\W|$)/i;for(var i=0;i<_47.length;i++){var src=_47[i].getAttribute("src");if(!src){continue;}var m=src.match(_48);if(m){if(!d.config.baseUrl){d.config.baseUrl=src.substring(0,m.index);}var cfg=(_47[i].getAttribute("djConfig")||_47[i].getAttribute("data-dojo-config"));if(cfg){var _49=eval("({ "+cfg+" })");for(var x in _49){dojo.config[x]=_49[x];}}break;}}}d.baseUrl=d.config.baseUrl;var n=navigator;var dua=n.userAgent,dav=n.appVersion,tv=parseFloat(dav);if(dua.indexOf("Opera")>=0){d.isOpera=tv;}if(dua.indexOf("AdobeAIR")>=0){d.isAIR=1;}d.isKhtml=(dav.indexOf("Konqueror")>=0)?tv:0;d.isWebKit=parseFloat(dua.split("WebKit/")[1])||undefined;d.isChrome=parseFloat(dua.split("Chrome/")[1])||undefined;d.isMac=dav.indexOf("Macintosh")>=0;var _4a=Math.max(dav.indexOf("WebKit"),dav.indexOf("Safari"),0);if(_4a&&!dojo.isChrome){d.isSafari=parseFloat(dav.split("Version/")[1]);if(!d.isSafari||parseFloat(dav.substr(_4a+7))<=419.3){d.isSafari=2;}}if(dua.indexOf("Gecko")>=0&&!d.isKhtml&&!d.isWebKit){d.isMozilla=d.isMoz=tv;}if(d.isMoz){d.isFF=parseFloat(dua.split("Firefox/")[1]||dua.split("Minefield/")[1])||undefined;}if(document.all&&!d.isOpera){d.isIE=parseFloat(dav.split("MSIE ")[1])||undefined;var _4b=document.documentMode;if(_4b&&_4b!=5&&Math.floor(d.isIE)!=_4b){d.isIE=_4b;}}if(dojo.isIE&&window.location.protocol==="file:"){dojo.config.ieForceActiveXXhr=true;}d.isQuirks=document.compatMode=="BackCompat";d.locale=dojo.config.locale||(d.isIE?n.userLanguage:n.language).toLowerCase();d._XMLHTTP_PROGIDS=["Msxml2.XMLHTTP","Microsoft.XMLHTTP","Msxml2.XMLHTTP.4.0"];d._xhrObj=function(){var _4c,_4d;if(!dojo.isIE||!dojo.config.ieForceActiveXXhr){try{_4c=new XMLHttpRequest();}catch(e){}}if(!_4c){for(var i=0;i<3;++i){var _4e=d._XMLHTTP_PROGIDS[i];try{_4c=new ActiveXObject(_4e);}catch(e){_4d=e;}if(_4c){d._XMLHTTP_PROGIDS=[_4e];break;}}}if(!_4c){throw new Error("XMLHTTP not available: "+_4d);}return _4c;};d._isDocumentOk=function(_4f){var _50=_4f.status||0,lp=location.protocol;return (_50>=200&&_50<300)||_50==304||_50==1223||(!_50&&(lp=="file:"||lp=="chrome:"||lp=="chrome-extension:"||lp=="app:"));};var _51=window.location+"";var _52=document.getElementsByTagName("base");var _53=(_52&&_52.length>0);d._getText=function(uri,_54){var _55=d._xhrObj();if(!_53&&dojo._Url){uri=(new dojo._Url(_51,uri)).toString();}if(d.config.cacheBust){uri+="";uri+=(uri.indexOf("?")==-1?"?":"&")+String(d.config.cacheBust).replace(/\W+/g,"");}_55.open("GET",uri,false);try{_55.send(null);if(!d._isDocumentOk(_55)){var err=Error("Unable to load "+uri+" status:"+_55.status);err.status=_55.status;err.responseText=_55.responseText;throw err;}}catch(e){if(_54){return null;}throw e;}return _55.responseText;};var _56=window;var _57=function(_58,fp){var _59=_56.attachEvent||_56.addEventListener;_58=_56.attachEvent?_58:_58.substring(2);_59(_58,function(){fp.apply(_56,arguments);},false);};d._windowUnloaders=[];d.windowUnloaded=function(){var mll=d._windowUnloaders;while(mll.length){(mll.pop())();}d=null;};var _5a=0;d.addOnWindowUnload=function(obj,_5b){d._onto(d._windowUnloaders,obj,_5b);if(!_5a){_5a=1;_57("onunload",d.windowUnloaded);}};var _5c=0;d.addOnUnload=function(obj,_5d){d._onto(d._unloaders,obj,_5d);if(!_5c){_5c=1;_57("onbeforeunload",dojo.unloaded);}};})();dojo._initFired=false;dojo._loadInit=function(e){if(dojo._scrollIntervalId){clearInterval(dojo._scrollIntervalId);dojo._scrollIntervalId=0;}if(!dojo._initFired){dojo._initFired=true;if(!dojo.config.afterOnLoad&&window.detachEvent){window.detachEvent("onload",dojo._loadInit);}if(dojo._inFlightCount==0){dojo._modulesLoaded();}}};if(!dojo.config.afterOnLoad){if(document.addEventListener){document.addEventListener("DOMContentLoaded",dojo._loadInit,false);window.addEventListener("load",dojo._loadInit,false);}else{if(window.attachEvent){window.attachEvent("onload",dojo._loadInit);if(!dojo.config.skipIeDomLoaded&&self===self.top){dojo._scrollIntervalId=setInterval(function(){try{if(document.body){document.documentElement.doScroll("left");dojo._loadInit();}}catch(e){}},30);}}}}if(dojo.isIE){try{(function(){document.namespaces.add("v","urn:schemas-microsoft-com:vml");var _5e=["*","group","roundrect","oval","shape","rect","imagedata","path","textpath","text"],i=0,l=1,s=document.createStyleSheet();if(dojo.isIE>=8){i=1;l=_5e.length;}for(;i<l;++i){s.addRule("v\\:"+_5e[i],"behavior:url(#default#VML); display:inline-block");}})();}catch(e){}}}(function(){var mp=dojo.config["modulePaths"];if(mp){for(var _5f in mp){dojo.registerModulePath(_5f,mp[_5f]);}}})();if(dojo.config.isDebug){dojo.require("dojo._firebug.firebug");}if(dojo.config.debugAtAllCosts){dojo.require("dojo._base._loader.loader_debug");dojo.require("dojo.i18n");}if(!dojo._hasResource["dojo._base.lang"]){dojo._hasResource["dojo._base.lang"]=true;dojo.provide("dojo._base.lang");(function(){var d=dojo,_60=Object.prototype.toString;dojo.isString=function(it){return (typeof it=="string"||it instanceof String);};dojo.isArray=function(it){return it&&(it instanceof Array||typeof it=="array");};dojo.isFunction=function(it){return _60.call(it)==="[object Function]";};dojo.isObject=function(it){return it!==undefined&&(it===null||typeof it=="object"||d.isArray(it)||d.isFunction(it));};dojo.isArrayLike=function(it){return it&&it!==undefined&&!d.isString(it)&&!d.isFunction(it)&&!(it.tagName&&it.tagName.toLowerCase()=="form")&&(d.isArray(it)||isFinite(it.length));};dojo.isAlien=function(it){return it&&!d.isFunction(it)&&/\{\s*\[native code\]\s*\}/.test(String(it));};dojo.extend=function(_61,_62){for(var i=1,l=arguments.length;i<l;i++){d._mixin(_61.prototype,arguments[i]);}return _61;};dojo._hitchArgs=function(_63,_64){var pre=d._toArray(arguments,2);var _65=d.isString(_64);return function(){var _66=d._toArray(arguments);var f=_65?(_63||d.global)[_64]:_64;return f&&f.apply(_63||this,pre.concat(_66));};};dojo.hitch=function(_67,_68){if(arguments.length>2){return d._hitchArgs.apply(d,arguments);}if(!_68){_68=_67;_67=null;}if(d.isString(_68)){_67=_67||d.global;if(!_67[_68]){throw (["dojo.hitch: scope[\"",_68,"\"] is null (scope=\"",_67,"\")"].join(""));}return function(){return _67[_68].apply(_67,arguments||[]);};}return !_67?_68:function(){return _68.apply(_67,arguments||[]);};};dojo.delegate=dojo._delegate=(function(){function TMP(){};return function(obj,_69){TMP.prototype=obj;var tmp=new TMP();TMP.prototype=null;if(_69){d._mixin(tmp,_69);}return tmp;};})();var _6a=function(obj,_6b,_6c){return (_6c||[]).concat(Array.prototype.slice.call(obj,_6b||0));};var _6d=function(obj,_6e,_6f){var arr=_6f||[];for(var x=_6e||0;x<obj.length;x++){arr.push(obj[x]);}return arr;};dojo._toArray=d.isIE?function(obj){return ((obj.item)?_6d:_6a).apply(this,arguments);}:_6a;dojo.partial=function(_70){var arr=[null];return d.hitch.apply(d,arr.concat(d._toArray(arguments)));};var _71=d._extraNames,_72=_71.length,_73={};dojo.clone=function(o){if(!o||typeof o!="object"||d.isFunction(o)){return o;}if(o.nodeType&&"cloneNode" in o){return o.cloneNode(true);}if(o instanceof Date){return new Date(o.getTime());}if(o instanceof RegExp){return new RegExp(o);}var r,i,l,s,_74;if(d.isArray(o)){r=[];for(i=0,l=o.length;i<l;++i){if(i in o){r.push(d.clone(o[i]));}}}else{r=o.constructor?new o.constructor():{};}for(_74 in o){s=o[_74];if(!(_74 in r)||(r[_74]!==s&&(!(_74 in _73)||_73[_74]!==s))){r[_74]=d.clone(s);}}if(_72){for(i=0;i<_72;++i){_74=_71[i];s=o[_74];if(!(_74 in r)||(r[_74]!==s&&(!(_74 in _73)||_73[_74]!==s))){r[_74]=s;}}}return r;};dojo.trim=String.prototype.trim?function(str){return str.trim();}:function(str){return str.replace(/^\s\s*/,"").replace(/\s\s*$/,"");};var _75=/\{([^\}]+)\}/g;dojo.replace=function(_76,map,_77){return _76.replace(_77||_75,d.isFunction(map)?map:function(_78,k){return d.getObject(k,false,map);});};})();}if(!dojo._hasResource["dojo._base.array"]){dojo._hasResource["dojo._base.array"]=true;dojo.provide("dojo._base.array");(function(){var _79=function(arr,obj,cb){return [(typeof arr=="string")?arr.split(""):arr,obj||dojo.global,(typeof cb=="string")?new Function("item","index","array",cb):cb];};var _7a=function(_7b,arr,_7c,_7d){var _7e=_79(arr,_7d,_7c);arr=_7e[0];for(var i=0,l=arr.length;i<l;++i){var _7f=!!_7e[2].call(_7e[1],arr[i],i,arr);if(_7b^_7f){return _7f;}}return _7b;};dojo.mixin(dojo,{indexOf:function(_80,_81,_82,_83){var _84=1,end=_80.length||0,i=0;if(_83){i=end-1;_84=end=-1;}if(_82!=undefined){i=_82;}if((_83&&i>end)||i<end){for(;i!=end;i+=_84){if(_80[i]==_81){return i;}}}return -1;},lastIndexOf:function(_85,_86,_87){return dojo.indexOf(_85,_86,_87,true);},forEach:function(arr,_88,_89){if(!arr||!arr.length){return;}var _8a=_79(arr,_89,_88);arr=_8a[0];for(var i=0,l=arr.length;i<l;++i){_8a[2].call(_8a[1],arr[i],i,arr);}},every:function(arr,_8b,_8c){return _7a(true,arr,_8b,_8c);},some:function(arr,_8d,_8e){return _7a(false,arr,_8d,_8e);},map:function(arr,_8f,_90){var _91=_79(arr,_90,_8f);arr=_91[0];var _92=(arguments[3]?(new arguments[3]()):[]);for(var i=0,l=arr.length;i<l;++i){_92.push(_91[2].call(_91[1],arr[i],i,arr));}return _92;},filter:function(arr,_93,_94){var _95=_79(arr,_94,_93);arr=_95[0];var _96=[];for(var i=0,l=arr.length;i<l;++i){if(_95[2].call(_95[1],arr[i],i,arr)){_96.push(arr[i]);}}return _96;}});})();}if(!dojo._hasResource["dojo._base.declare"]){dojo._hasResource["dojo._base.declare"]=true;dojo.provide("dojo._base.declare");(function(){var d=dojo,mix=d._mixin,op=Object.prototype,_97=op.toString,_98=new Function,_99=0,_9a="constructor";function err(msg,cls){throw new Error("declare"+(cls?" "+cls:"")+": "+msg);};function _9b(_9c,_9d){var _9e=[],_9f=[{cls:0,refs:[]}],_a0={},_a1=1,l=_9c.length,i=0,j,lin,_a2,top,_a3,rec,_a4,_a5;for(;i<l;++i){_a2=_9c[i];if(!_a2){err("mixin #"+i+" is unknown. Did you use dojo.require to pull it in?",_9d);}else{if(_97.call(_a2)!="[object Function]"){err("mixin #"+i+" is not a callable constructor.",_9d);}}lin=_a2._meta?_a2._meta.bases:[_a2];top=0;for(j=lin.length-1;j>=0;--j){_a3=lin[j].prototype;if(!_a3.hasOwnProperty("declaredClass")){_a3.declaredClass="uniqName_"+(_99++);}_a4=_a3.declaredClass;if(!_a0.hasOwnProperty(_a4)){_a0[_a4]={count:0,refs:[],cls:lin[j]};++_a1;}rec=_a0[_a4];if(top&&top!==rec){rec.refs.push(top);++top.count;}top=rec;}++top.count;_9f[0].refs.push(top);}while(_9f.length){top=_9f.pop();_9e.push(top.cls);--_a1;while(_a5=top.refs,_a5.length==1){top=_a5[0];if(!top||--top.count){top=0;break;}_9e.push(top.cls);--_a1;}if(top){for(i=0,l=_a5.length;i<l;++i){top=_a5[i];if(!--top.count){_9f.push(top);}}}}if(_a1){err("can't build consistent linearization",_9d);}_a2=_9c[0];_9e[0]=_a2?_a2._meta&&_a2===_9e[_9e.length-_a2._meta.bases.length]?_a2._meta.bases.length:1:0;return _9e;};function _a6(_a7,a,f){var _a8,_a9,_aa,_ab,_ac,_ad,_ae,opf,pos,_af=this._inherited=this._inherited||{};if(typeof _a7=="string"){_a8=_a7;_a7=a;a=f;}f=0;_ab=_a7.callee;_a8=_a8||_ab.nom;if(!_a8){err("can't deduce a name to call inherited()",this.declaredClass);}_ac=this.constructor._meta;_aa=_ac.bases;pos=_af.p;if(_a8!=_9a){if(_af.c!==_ab){pos=0;_ad=_aa[0];_ac=_ad._meta;if(_ac.hidden[_a8]!==_ab){_a9=_ac.chains;if(_a9&&typeof _a9[_a8]=="string"){err("calling chained method with inherited: "+_a8,this.declaredClass);}do{_ac=_ad._meta;_ae=_ad.prototype;if(_ac&&(_ae[_a8]===_ab&&_ae.hasOwnProperty(_a8)||_ac.hidden[_a8]===_ab)){break;}}while(_ad=_aa[++pos]);pos=_ad?pos:-1;}}_ad=_aa[++pos];if(_ad){_ae=_ad.prototype;if(_ad._meta&&_ae.hasOwnProperty(_a8)){f=_ae[_a8];}else{opf=op[_a8];do{_ae=_ad.prototype;f=_ae[_a8];if(f&&(_ad._meta?_ae.hasOwnProperty(_a8):f!==opf)){break;}}while(_ad=_aa[++pos]);}}f=_ad&&f||op[_a8];}else{if(_af.c!==_ab){pos=0;_ac=_aa[0]._meta;if(_ac&&_ac.ctor!==_ab){_a9=_ac.chains;if(!_a9||_a9.constructor!=="manual"){err("calling chained constructor with inherited",this.declaredClass);}while(_ad=_aa[++pos]){_ac=_ad._meta;if(_ac&&_ac.ctor===_ab){break;}}pos=_ad?pos:-1;}}while(_ad=_aa[++pos]){_ac=_ad._meta;f=_ac?_ac.ctor:_ad;if(f){break;}}f=_ad&&f;}_af.c=f;_af.p=pos;if(f){return a===true?f:f.apply(this,a||_a7);}};function _b0(_b1,_b2){if(typeof _b1=="string"){return this.inherited(_b1,_b2,true);}return this.inherited(_b1,true);};function _b3(cls){var _b4=this.constructor._meta.bases;for(var i=0,l=_b4.length;i<l;++i){if(_b4[i]===cls){return true;}}return this instanceof cls;};function _b5(_b6,_b7){var _b8,i=0,l=d._extraNames.length;for(_b8 in _b7){if(_b8!=_9a&&_b7.hasOwnProperty(_b8)){_b6[_b8]=_b7[_b8];}}for(;i<l;++i){_b8=d._extraNames[i];if(_b8!=_9a&&_b7.hasOwnProperty(_b8)){_b6[_b8]=_b7[_b8];}}};function _b9(_ba,_bb){var _bc,t,i=0,l=d._extraNames.length;for(_bc in _bb){t=_bb[_bc];if((t!==op[_bc]||!(_bc in op))&&_bc!=_9a){if(_97.call(t)=="[object Function]"){t.nom=_bc;}_ba[_bc]=t;}}for(;i<l;++i){_bc=d._extraNames[i];t=_bb[_bc];if((t!==op[_bc]||!(_bc in op))&&_bc!=_9a){if(_97.call(t)=="[object Function]"){t.nom=_bc;}_ba[_bc]=t;}}return _ba;};function _bd(_be){_b9(this.prototype,_be);return this;};function _bf(_c0,_c1){return function(){var a=arguments,_c2=a,a0=a[0],f,i,m,l=_c0.length,_c3;if(!(this instanceof a.callee)){return _c4(a);}if(_c1&&(a0&&a0.preamble||this.preamble)){_c3=new Array(_c0.length);_c3[0]=a;for(i=0;;){a0=a[0];if(a0){f=a0.preamble;if(f){a=f.apply(this,a)||a;}}f=_c0[i].prototype;f=f.hasOwnProperty("preamble")&&f.preamble;if(f){a=f.apply(this,a)||a;}if(++i==l){break;}_c3[i]=a;}}for(i=l-1;i>=0;--i){f=_c0[i];m=f._meta;f=m?m.ctor:f;if(f){f.apply(this,_c3?_c3[i]:a);}}f=this.postscript;if(f){f.apply(this,_c2);}};};function _c5(_c6,_c7){return function(){var a=arguments,t=a,a0=a[0],f;if(!(this instanceof a.callee)){return _c4(a);}if(_c7){if(a0){f=a0.preamble;if(f){t=f.apply(this,t)||t;}}f=this.preamble;if(f){f.apply(this,t);}}if(_c6){_c6.apply(this,a);}f=this.postscript;if(f){f.apply(this,a);}};};function _c8(_c9){return function(){var a=arguments,i=0,f,m;if(!(this instanceof a.callee)){return _c4(a);}for(;f=_c9[i];++i){m=f._meta;f=m?m.ctor:f;if(f){f.apply(this,a);break;}}f=this.postscript;if(f){f.apply(this,a);}};};function _ca(_cb,_cc,_cd){return function(){var b,m,f,i=0,_ce=1;if(_cd){i=_cc.length-1;_ce=-1;}for(;b=_cc[i];i+=_ce){m=b._meta;f=(m?m.hidden:b.prototype)[_cb];if(f){f.apply(this,arguments);}}};};function _cf(_d0){_98.prototype=_d0.prototype;var t=new _98;_98.prototype=null;return t;};function _c4(_d1){var _d2=_d1.callee,t=_cf(_d2);_d2.apply(t,_d1);return t;};d.declare=function(_d3,_d4,_d5){if(typeof _d3!="string"){_d5=_d4;_d4=_d3;_d3="";}_d5=_d5||{};var _d6,i,t,_d7,_d8,_d9,_da,_db=1,_dc=_d4;if(_97.call(_d4)=="[object Array]"){_d9=_9b(_d4,_d3);t=_d9[0];_db=_d9.length-t;_d4=_d9[_db];}else{_d9=[0];if(_d4){if(_97.call(_d4)=="[object Function]"){t=_d4._meta;_d9=_d9.concat(t?t.bases:_d4);}else{err("base class is not a callable constructor.",_d3);}}else{if(_d4!==null){err("unknown base class. Did you use dojo.require to pull it in?",_d3);}}}if(_d4){for(i=_db-1;;--i){_d6=_cf(_d4);if(!i){break;}t=_d9[i];(t._meta?_b5:mix)(_d6,t.prototype);_d7=new Function;_d7.superclass=_d4;_d7.prototype=_d6;_d4=_d6.constructor=_d7;}}else{_d6={};}_b9(_d6,_d5);t=_d5.constructor;if(t!==op.constructor){t.nom=_9a;_d6.constructor=t;}for(i=_db-1;i;--i){t=_d9[i]._meta;if(t&&t.chains){_da=mix(_da||{},t.chains);}}if(_d6["-chains-"]){_da=mix(_da||{},_d6["-chains-"]);}t=!_da||!_da.hasOwnProperty(_9a);_d9[0]=_d7=(_da&&_da.constructor==="manual")?_c8(_d9):(_d9.length==1?_c5(_d5.constructor,t):_bf(_d9,t));_d7._meta={bases:_d9,hidden:_d5,chains:_da,parents:_dc,ctor:_d5.constructor};_d7.superclass=_d4&&_d4.prototype;_d7.extend=_bd;_d7.prototype=_d6;_d6.constructor=_d7;_d6.getInherited=_b0;_d6.inherited=_a6;_d6.isInstanceOf=_b3;if(_d3){_d6.declaredClass=_d3;d.setObject(_d3,_d7);}if(_da){for(_d8 in _da){if(_d6[_d8]&&typeof _da[_d8]=="string"&&_d8!=_9a){t=_d6[_d8]=_ca(_d8,_d9,_da[_d8]==="after");t.nom=_d8;}}}return _d7;};d.safeMixin=_b9;})();}if(!dojo._hasResource["dojo._base.connect"]){dojo._hasResource["dojo._base.connect"]=true;dojo.provide("dojo._base.connect");dojo._listener={getDispatcher:function(){return function(){var ap=Array.prototype,c=arguments.callee,ls=c._listeners,t=c.target,r=t&&t.apply(this,arguments),i,lls=[].concat(ls);for(i in lls){if(!(i in ap)){lls[i].apply(this,arguments);}}return r;};},add:function(_dd,_de,_df){_dd=_dd||dojo.global;var f=_dd[_de];if(!f||!f._listeners){var d=dojo._listener.getDispatcher();d.target=f;d._listeners=[];f=_dd[_de]=d;}return f._listeners.push(_df);},remove:function(_e0,_e1,_e2){var f=(_e0||dojo.global)[_e1];if(f&&f._listeners&&_e2--){delete f._listeners[_e2];}}};dojo.connect=function(obj,_e3,_e4,_e5,_e6){var a=arguments,_e7=[],i=0;_e7.push(dojo.isString(a[0])?null:a[i++],a[i++]);var a1=a[i+1];_e7.push(dojo.isString(a1)||dojo.isFunction(a1)?a[i++]:null,a[i++]);for(var l=a.length;i<l;i++){_e7.push(a[i]);}return dojo._connect.apply(this,_e7);};dojo._connect=function(obj,_e8,_e9,_ea){var l=dojo._listener,h=l.add(obj,_e8,dojo.hitch(_e9,_ea));return [obj,_e8,h,l];};dojo.disconnect=function(_eb){if(_eb&&_eb[0]!==undefined){dojo._disconnect.apply(this,_eb);delete _eb[0];}};dojo._disconnect=function(obj,_ec,_ed,_ee){_ee.remove(obj,_ec,_ed);};dojo._topics={};dojo.subscribe=function(_ef,_f0,_f1){return [_ef,dojo._listener.add(dojo._topics,_ef,dojo.hitch(_f0,_f1))];};dojo.unsubscribe=function(_f2){if(_f2){dojo._listener.remove(dojo._topics,_f2[0],_f2[1]);}};dojo.publish=function(_f3,_f4){var f=dojo._topics[_f3];if(f){f.apply(this,_f4||[]);}};dojo.connectPublisher=function(_f5,obj,_f6){var pf=function(){dojo.publish(_f5,arguments);};return _f6?dojo.connect(obj,_f6,pf):dojo.connect(obj,pf);};}if(!dojo._hasResource["dojo._base.Deferred"]){dojo._hasResource["dojo._base.Deferred"]=true;dojo.provide("dojo._base.Deferred");(function(){var _f7=function(){};var _f8=Object.freeze||function(){};dojo.Deferred=function(_f9){var _fa,_fb,_fc,_fd,_fe;var _ff=(this.promise={});function _100(_101){if(_fb){throw new Error("This deferred has already been resolved");}_fa=_101;_fb=true;_102();};function _102(){var _103;while(!_103&&_fe){var _104=_fe;_fe=_fe.next;if((_103=(_104.progress==_f7))){_fb=false;}var func=(_fc?_104.error:_104.resolved);if(func){try{var _105=func(_fa);if(_105&&typeof _105.then==="function"){_105.then(dojo.hitch(_104.deferred,"resolve"),dojo.hitch(_104.deferred,"reject"));continue;}var _106=_103&&_105===undefined;if(_103&&!_106){_fc=_105 instanceof Error;}_104.deferred[_106&&_fc?"reject":"resolve"](_106?_fa:_105);}catch(e){_104.deferred.reject(e);}}else{if(_fc){_104.deferred.reject(_fa);}else{_104.deferred.resolve(_fa);}}}};this.resolve=this.callback=function(_107){this.fired=0;this.results=[_107,null];_100(_107);};this.reject=this.errback=function(_108){_fc=true;this.fired=1;_100(_108);this.results=[null,_108];if(!_108||_108.log!==false){(dojo.config.deferredOnError||function(x){console.error(x);})(_108);}};this.progress=function(_109){var _10a=_fe;while(_10a){var _10b=_10a.progress;_10b&&_10b(_109);_10a=_10a.next;}};this.addCallbacks=function(_10c,_10d){this.then(_10c,_10d,_f7);return this;};this.then=_ff.then=function(_10e,_10f,_110){var _111=_110==_f7?this:new dojo.Deferred(_ff.cancel);var _112={resolved:_10e,error:_10f,progress:_110,deferred:_111};if(_fe){_fd=_fd.next=_112;}else{_fe=_fd=_112;}if(_fb){_102();}return _111.promise;};var _113=this;this.cancel=_ff.cancel=function(){if(!_fb){var _114=_f9&&_f9(_113);if(!_fb){if(!(_114 instanceof Error)){_114=new Error(_114);}_114.log=false;_113.reject(_114);}}};_f8(_ff);};dojo.extend(dojo.Deferred,{addCallback:function(_115){return this.addCallbacks(dojo.hitch.apply(dojo,arguments));},addErrback:function(_116){return this.addCallbacks(null,dojo.hitch.apply(dojo,arguments));},addBoth:function(_117){var _118=dojo.hitch.apply(dojo,arguments);return this.addCallbacks(_118,_118);},fired:-1});})();dojo.when=function(_119,_11a,_11b,_11c){if(_119&&typeof _119.then==="function"){return _119.then(_11a,_11b,_11c);}return _11a(_119);};}if(!dojo._hasResource["dojo._base.json"]){dojo._hasResource["dojo._base.json"]=true;dojo.provide("dojo._base.json");dojo.fromJson=function(json){return eval("("+json+")");};dojo._escapeString=function(str){return ("\""+str.replace(/(["\\])/g,"\\$1")+"\"").replace(/[\f]/g,"\\f").replace(/[\b]/g,"\\b").replace(/[\n]/g,"\\n").replace(/[\t]/g,"\\t").replace(/[\r]/g,"\\r");};dojo.toJsonIndentStr="\t";dojo.toJson=function(it,_11d,_11e){if(it===undefined){return "undefined";}var _11f=typeof it;if(_11f=="number"||_11f=="boolean"){return it+"";}if(it===null){return "null";}if(dojo.isString(it)){return dojo._escapeString(it);}var _120=arguments.callee;var _121;_11e=_11e||"";var _122=_11d?_11e+dojo.toJsonIndentStr:"";var tf=it.__json__||it.json;if(dojo.isFunction(tf)){_121=tf.call(it);if(it!==_121){return _120(_121,_11d,_122);}}if(it.nodeType&&it.cloneNode){throw new Error("Can't serialize DOM nodes");}var sep=_11d?" ":"";var _123=_11d?"\n":"";if(dojo.isArray(it)){var res=dojo.map(it,function(obj){var val=_120(obj,_11d,_122);if(typeof val!="string"){val="undefined";}return _123+_122+val;});return "["+res.join(","+sep)+_123+_11e+"]";}if(_11f=="function"){return null;}var _124=[],key;for(key in it){var _125,val;if(typeof key=="number"){_125="\""+key+"\"";}else{if(typeof key=="string"){_125=dojo._escapeString(key);}else{continue;}}val=_120(it[key],_11d,_122);if(typeof val!="string"){continue;}_124.push(_123+_122+_125+":"+sep+val);}return "{"+_124.join(","+sep)+_123+_11e+"}";};}if(!dojo._hasResource["dojo._base.Color"]){dojo._hasResource["dojo._base.Color"]=true;dojo.provide("dojo._base.Color");(function(){var d=dojo;dojo.Color=function(_126){if(_126){this.setColor(_126);}};dojo.Color.named={black:[0,0,0],silver:[192,192,192],gray:[128,128,128],white:[255,255,255],maroon:[128,0,0],red:[255,0,0],purple:[128,0,128],fuchsia:[255,0,255],green:[0,128,0],lime:[0,255,0],olive:[128,128,0],yellow:[255,255,0],navy:[0,0,128],blue:[0,0,255],teal:[0,128,128],aqua:[0,255,255],transparent:d.config.transparentColor||[255,255,255]};dojo.extend(dojo.Color,{r:255,g:255,b:255,a:1,_set:function(r,g,b,a){var t=this;t.r=r;t.g=g;t.b=b;t.a=a;},setColor:function(_127){if(d.isString(_127)){d.colorFromString(_127,this);}else{if(d.isArray(_127)){d.colorFromArray(_127,this);}else{this._set(_127.r,_127.g,_127.b,_127.a);if(!(_127 instanceof d.Color)){this.sanitize();}}}return this;},sanitize:function(){return this;},toRgb:function(){var t=this;return [t.r,t.g,t.b];},toRgba:function(){var t=this;return [t.r,t.g,t.b,t.a];},toHex:function(){var arr=d.map(["r","g","b"],function(x){var s=this[x].toString(16);return s.length<2?"0"+s:s;},this);return "#"+arr.join("");},toCss:function(_128){var t=this,rgb=t.r+", "+t.g+", "+t.b;return (_128?"rgba("+rgb+", "+t.a:"rgb("+rgb)+")";},toString:function(){return this.toCss(true);}});dojo.blendColors=function(_129,end,_12a,obj){var t=obj||new d.Color();d.forEach(["r","g","b","a"],function(x){t[x]=_129[x]+(end[x]-_129[x])*_12a;if(x!="a"){t[x]=Math.round(t[x]);}});return t.sanitize();};dojo.colorFromRgb=function(_12b,obj){var m=_12b.toLowerCase().match(/^rgba?\(([\s\.,0-9]+)\)/);return m&&dojo.colorFromArray(m[1].split(/\s*,\s*/),obj);};dojo.colorFromHex=function(_12c,obj){var t=obj||new d.Color(),bits=(_12c.length==4)?4:8,mask=(1<<bits)-1;_12c=Number("0x"+_12c.substr(1));if(isNaN(_12c)){return null;}d.forEach(["b","g","r"],function(x){var c=_12c&mask;_12c>>=bits;t[x]=bits==4?17*c:c;});t.a=1;return t;};dojo.colorFromArray=function(a,obj){var t=obj||new d.Color();t._set(Number(a[0]),Number(a[1]),Number(a[2]),Number(a[3]));if(isNaN(t.a)){t.a=1;}return t.sanitize();};dojo.colorFromString=function(str,obj){var a=d.Color.named[str];return a&&d.colorFromArray(a,obj)||d.colorFromRgb(str,obj)||d.colorFromHex(str,obj);};})();}if(!dojo._hasResource["dojo._base.window"]){dojo._hasResource["dojo._base.window"]=true;dojo.provide("dojo._base.window");dojo.doc=window["document"]||null;dojo.body=function(){return dojo.doc.body||dojo.doc.getElementsByTagName("body")[0];};dojo.setContext=function(_12d,_12e){dojo.global=_12d;dojo.doc=_12e;};dojo.withGlobal=function(_12f,_130,_131,_132){var _133=dojo.global;try{dojo.global=_12f;return dojo.withDoc.call(null,_12f.document,_130,_131,_132);}finally{dojo.global=_133;}};dojo.withDoc=function(_134,_135,_136,_137){var _138=dojo.doc,_139=dojo._bodyLtr,oldQ=dojo.isQuirks;try{dojo.doc=_134;delete dojo._bodyLtr;dojo.isQuirks=dojo.doc.compatMode=="BackCompat";if(_136&&typeof _135=="string"){_135=_136[_135];}return _135.apply(_136,_137||[]);}finally{dojo.doc=_138;delete dojo._bodyLtr;if(_139!==undefined){dojo._bodyLtr=_139;}dojo.isQuirks=oldQ;}};}if(!dojo._hasResource["dojo._base.event"]){dojo._hasResource["dojo._base.event"]=true;dojo.provide("dojo._base.event");(function(){var del=(dojo._event_listener={add:function(node,name,fp){if(!node){return;}name=del._normalizeEventName(name);fp=del._fixCallback(name,fp);if(!dojo.isIE&&(name=="mouseenter"||name=="mouseleave")){var ofp=fp;name=(name=="mouseenter")?"mouseover":"mouseout";fp=function(e){if(!dojo.isDescendant(e.relatedTarget,node)){return ofp.call(this,e);}};}node.addEventListener(name,fp,false);return fp;},remove:function(node,_13a,_13b){if(node){_13a=del._normalizeEventName(_13a);if(!dojo.isIE&&(_13a=="mouseenter"||_13a=="mouseleave")){_13a=(_13a=="mouseenter")?"mouseover":"mouseout";}node.removeEventListener(_13a,_13b,false);}},_normalizeEventName:function(name){return name.slice(0,2)=="on"?name.slice(2):name;},_fixCallback:function(name,fp){return name!="keypress"?fp:function(e){return fp.call(this,del._fixEvent(e,this));};},_fixEvent:function(evt,_13c){switch(evt.type){case "keypress":del._setKeyChar(evt);break;}return evt;},_setKeyChar:function(evt){evt.keyChar=evt.charCode>=32?String.fromCharCode(evt.charCode):"";evt.charOrCode=evt.keyChar||evt.keyCode;},_punctMap:{106:42,111:47,186:59,187:43,188:44,189:45,190:46,191:47,192:96,219:91,220:92,221:93,222:39}});dojo.fixEvent=function(evt,_13d){return del._fixEvent(evt,_13d);};dojo.stopEvent=function(evt){if(!evt){return;/*zmh add*/};evt.preventDefault();evt.stopPropagation();};var _13e=dojo._listener;dojo._connect=function(obj,_13f,_140,_141,_142){var _143=obj&&(obj.nodeType||obj.attachEvent||obj.addEventListener);var lid=_143?(_142?2:1):0,l=[dojo._listener,del,_13e][lid];var h=l.add(obj,_13f,dojo.hitch(_140,_141));return [obj,_13f,h,lid];};dojo._disconnect=function(obj,_144,_145,_146){([dojo._listener,del,_13e][_146]).remove(obj,_144,_145);};dojo.keys={BACKSPACE:8,TAB:9,CLEAR:12,ENTER:13,SHIFT:16,CTRL:17,ALT:18,META:dojo.isSafari?91:224,PAUSE:19,CAPS_LOCK:20,ESCAPE:27,SPACE:32,PAGE_UP:33,PAGE_DOWN:34,END:35,HOME:36,LEFT_ARROW:37,UP_ARROW:38,RIGHT_ARROW:39,DOWN_ARROW:40,INSERT:45,DELETE:46,HELP:47,LEFT_WINDOW:91,RIGHT_WINDOW:92,SELECT:93,NUMPAD_0:96,NUMPAD_1:97,NUMPAD_2:98,NUMPAD_3:99,NUMPAD_4:100,NUMPAD_5:101,NUMPAD_6:102,NUMPAD_7:103,NUMPAD_8:104,NUMPAD_9:105,NUMPAD_MULTIPLY:106,NUMPAD_PLUS:107,NUMPAD_ENTER:108,NUMPAD_MINUS:109,NUMPAD_PERIOD:110,NUMPAD_DIVIDE:111,F1:112,F2:113,F3:114,F4:115,F5:116,F6:117,F7:118,F8:119,F9:120,F10:121,F11:122,F12:123,F13:124,F14:125,F15:126,NUM_LOCK:144,SCROLL_LOCK:145,copyKey:dojo.isMac&&!dojo.isAIR?(dojo.isSafari?91:224):17};var _147=dojo.isMac?"metaKey":"ctrlKey";dojo.isCopyKey=function(e){return e[_147];};if(dojo.isIE<9||(dojo.isIE&&dojo.isQuirks)){dojo.mouseButtons={LEFT:1,MIDDLE:4,RIGHT:2,isButton:function(e,_148){return e.button&_148;},isLeft:function(e){return e.button&1;},isMiddle:function(e){return e.button&4;},isRight:function(e){return e.button&2;}};}else{dojo.mouseButtons={LEFT:0,MIDDLE:1,RIGHT:2,isButton:function(e,_149){return e.button==_149;},isLeft:function(e){return e.button==0;},isMiddle:function(e){return e.button==1;},isRight:function(e){return e.button==2;}};}if(dojo.isIE){var _14a=function(e,code){try{return (e.keyCode=code);}catch(e){return 0;}};var iel=dojo._listener;var _14b=(dojo._ieListenersName="_"+dojo._scopeName+"_listeners");if(!dojo.config._allow_leaks){_13e=iel=dojo._ie_listener={handlers:[],add:function(_14c,_14d,_14e){_14c=_14c||dojo.global;var f=_14c[_14d];if(!f||!f[_14b]){var d=dojo._getIeDispatcher();d.target=f&&(ieh.push(f)-1);d[_14b]=[];f=_14c[_14d]=d;}return f[_14b].push(ieh.push(_14e)-1);},remove:function(_14f,_150,_151){var f=(_14f||dojo.global)[_150],l=f&&f[_14b];if(f&&l&&_151--){delete ieh[l[_151]];delete l[_151];}}};var ieh=iel.handlers;}dojo.mixin(del,{add:function(node,_152,fp){if(!node){return;}_152=del._normalizeEventName(_152);if(_152=="onkeypress"){var kd=node.onkeydown;if(!kd||!kd[_14b]||!kd._stealthKeydownHandle){var h=del.add(node,"onkeydown",del._stealthKeyDown);kd=node.onkeydown;kd._stealthKeydownHandle=h;kd._stealthKeydownRefs=1;}else{kd._stealthKeydownRefs++;}}return iel.add(node,_152,del._fixCallback(fp));},remove:function(node,_153,_154){_153=del._normalizeEventName(_153);iel.remove(node,_153,_154);if(_153=="onkeypress"){var kd=node.onkeydown;if(--kd._stealthKeydownRefs<=0){iel.remove(node,"onkeydown",kd._stealthKeydownHandle);delete kd._stealthKeydownHandle;}}},_normalizeEventName:function(_155){return _155.slice(0,2)!="on"?"on"+_155:_155;},_nop:function(){},_fixEvent:function(evt,_156){if(!evt){var w=_156&&(_156.ownerDocument||_156.document||_156).parentWindow||window;evt=w.event;}if(!evt){return (evt);}evt.target=evt.srcElement;evt.currentTarget=(_156||evt.srcElement);evt.layerX=evt.offsetX;evt.layerY=evt.offsetY;var se=evt.srcElement,doc=(se&&se.ownerDocument)||document;var _157=((dojo.isIE<6)||(doc["compatMode"]=="BackCompat"))?doc.body:doc.documentElement;var _158=dojo._getIeDocumentElementOffset();evt.pageX=evt.clientX+dojo._fixIeBiDiScrollLeft(_157.scrollLeft||0)-_158.x;evt.pageY=evt.clientY+(_157.scrollTop||0)-_158.y;if(evt.type=="mouseover"){evt.relatedTarget=evt.fromElement;}if(evt.type=="mouseout"){evt.relatedTarget=evt.toElement;}if(dojo.isIE<9||dojo.isQuirks){evt.stopPropagation=del._stopPropagation;evt.preventDefault=del._preventDefault;}return del._fixKeys(evt);},_fixKeys:function(evt){switch(evt.type){case "keypress":var c=("charCode" in evt?evt.charCode:evt.keyCode);if(c==10){c=0;evt.keyCode=13;}else{if(c==13||c==27){c=0;}else{if(c==3){c=99;}}}evt.charCode=c;del._setKeyChar(evt);break;}return evt;},_stealthKeyDown:function(evt){var kp=evt.currentTarget.onkeypress;if(!kp||!kp[_14b]){return;}var k=evt.keyCode;var _159=(k!=13||(dojo.isIE>=9&&!dojo.isQuirks))&&k!=32&&k!=27&&(k<48||k>90)&&(k<96||k>111)&&(k<186||k>192)&&(k<219||k>222);if(_159||evt.ctrlKey){var c=_159?0:k;if(evt.ctrlKey){if(k==3||k==13){return;}else{if(c>95&&c<106){c-=48;}else{if((!evt.shiftKey)&&(c>=65&&c<=90)){c+=32;}else{c=del._punctMap[c]||c;}}}}var faux=del._synthesizeEvent(evt,{type:"keypress",faux:true,charCode:c});kp.call(evt.currentTarget,faux);if(dojo.isIE<9||(dojo.isIE&&dojo.isQuirks)){evt.cancelBubble=faux.cancelBubble;}evt.returnValue=faux.returnValue;_14a(evt,faux.keyCode);}},_stopPropagation:function(){this.cancelBubble=true;},_preventDefault:function(){this.bubbledKeyCode=this.keyCode;if(this.ctrlKey){_14a(this,0);}this.returnValue=false;}});dojo.stopEvent=(dojo.isIE<9||dojo.isQuirks)?function(evt){evt=evt||window.event;del._stopPropagation.call(evt);del._preventDefault.call(evt);}:dojo.stopEvent;}del._synthesizeEvent=function(evt,_15a){var faux=dojo.mixin({},evt,_15a);del._setKeyChar(faux);faux.preventDefault=function(){evt.preventDefault();};faux.stopPropagation=function(){evt.stopPropagation();};return faux;};if(dojo.isOpera){dojo.mixin(del,{_fixEvent:function(evt,_15b){switch(evt.type){case "keypress":var c=evt.which;if(c==3){c=99;}c=c<41&&!evt.shiftKey?0:c;if(evt.ctrlKey&&!evt.shiftKey&&c>=65&&c<=90){c+=32;}return del._synthesizeEvent(evt,{charCode:c});}return evt;}});}if(dojo.isWebKit){del._add=del.add;del._remove=del.remove;dojo.mixin(del,{add:function(node,_15c,fp){if(!node){return;}var _15d=del._add(node,_15c,fp);if(del._normalizeEventName(_15c)=="keypress"){_15d._stealthKeyDownHandle=del._add(node,"keydown",function(evt){var k=evt.keyCode;var _15e=k!=13&&k!=32&&(k<48||k>90)&&(k<96||k>111)&&(k<186||k>192)&&(k<219||k>222);if(_15e||evt.ctrlKey){var c=_15e?0:k;if(evt.ctrlKey){if(k==3||k==13){return;}else{if(c>95&&c<106){c-=48;}else{if(!evt.shiftKey&&c>=65&&c<=90){c+=32;}else{c=del._punctMap[c]||c;}}}}var faux=del._synthesizeEvent(evt,{type:"keypress",faux:true,charCode:c});fp.call(evt.currentTarget,faux);}});}return _15d;},remove:function(node,_15f,_160){if(node){if(_160._stealthKeyDownHandle){del._remove(node,"keydown",_160._stealthKeyDownHandle);}del._remove(node,_15f,_160);}},_fixEvent:function(evt,_161){switch(evt.type){case "keypress":if(evt.faux){return evt;}var c=evt.charCode;c=c>=32?c:0;return del._synthesizeEvent(evt,{charCode:c,faux:true});}return evt;}});}})();if(dojo.isIE){dojo._ieDispatcher=function(args,_162){var ap=Array.prototype,h=dojo._ie_listener.handlers,c=args.callee,ls=c[dojo._ieListenersName],t=h[c.target];var r=t&&t.apply(_162,args);var lls=[].concat(ls);for(var i in lls){var f=h[lls[i]];if(!(i in ap)&&f){f.apply(_162,args);}}return r;};dojo._getIeDispatcher=function(){return new Function(dojo._scopeName+"._ieDispatcher(arguments, this)");};dojo._event_listener._fixCallback=function(fp){var f=dojo._event_listener._fixEvent;return function(e){return fp.call(this,f(e,this));};};}}if(!dojo._hasResource["dojo._base.html"]){dojo._hasResource["dojo._base.html"]=true;dojo.provide("dojo._base.html");try{document.execCommand("BackgroundImageCache",false,true);}catch(e){}if(dojo.isIE){dojo.byId=function(id,doc){if(typeof id!="string"){return id;}var _163=doc||dojo.doc,te=_163.getElementById(id);if(te&&(te.attributes.id.value==id||te.id==id)){return te;}else{var eles=_163.all[id];if(!eles||eles.nodeName){eles=[eles];}var i=0;while((te=eles[i++])){if((te.attributes&&te.attributes.id&&te.attributes.id.value==id)||te.id==id){return te;}}}};}else{dojo.byId=function(id,doc){return ((typeof id=="string")?(doc||dojo.doc).getElementById(id):id)||null;};}(function(){var d=dojo;var byId=d.byId;var _164=null,_165;d.addOnWindowUnload(function(){_164=null;});dojo._destroyElement=dojo.destroy=function(node){node=byId(node);try{var doc=node.ownerDocument;if(!_164||_165!=doc){_164=doc.createElement("div");_165=doc;}_164.appendChild(node.parentNode?node.parentNode.removeChild(node):node);_164.innerHTML="";}catch(e){}};dojo.isDescendant=function(node,_166){try{node=byId(node);_166=byId(_166);while(node){if(node==_166){return true;}node=node.parentNode;}}catch(e){}return false;};dojo.setSelectable=function(node,_167){node=byId(node);if(d.isMozilla){node.style.MozUserSelect=_167?"":"none";}else{if(d.isKhtml||d.isWebKit){node.style.KhtmlUserSelect=_167?"auto":"none";}else{if(d.isIE){var v=(node.unselectable=_167?"":"on");d.query("*",node).forEach("item.unselectable = '"+v+"'");}}}};var _168=function(node,ref){var _169=ref.parentNode;if(_169){_169.insertBefore(node,ref);}};var _16a=function(node,ref){var _16b=ref.parentNode;if(_16b){if(_16b.lastChild==ref){_16b.appendChild(node);}else{_16b.insertBefore(node,ref.nextSibling);}}};dojo.place=function(node,_16c,_16d){_16c=byId(_16c);if(typeof node=="string"){node=/^\s*</.test(node)?d._toDom(node,_16c.ownerDocument):byId(node);}if(typeof _16d=="number"){var cn=_16c.childNodes;if(!cn.length||cn.length<=_16d){_16c.appendChild(node);}else{_168(node,cn[_16d<0?0:_16d]);}}else{switch(_16d){case "before":_168(node,_16c);break;case "after":_16a(node,_16c);break;case "replace":_16c.parentNode.replaceChild(node,_16c);break;case "only":d.empty(_16c);_16c.appendChild(node);break;case "first":if(_16c.firstChild){_168(node,_16c.firstChild);break;}default:_16c.appendChild(node);}}return node;};dojo.boxModel="content-box";if(d.isIE){d.boxModel=document.compatMode=="BackCompat"?"border-box":"content-box";}var gcs;if(d.isWebKit){gcs=function(node){var s;if(node.nodeType==1){var dv=node.ownerDocument.defaultView;s=dv.getComputedStyle(node,null);if(!s&&node.style){node.style.display="";s=dv.getComputedStyle(node,null);}}return s||{};};}else{if(d.isIE){gcs=function(node){return node.nodeType==1?node.currentStyle:{};};}else{gcs=function(node){return node.nodeType==1?node.ownerDocument.defaultView.getComputedStyle(node,null):{};};}}dojo.getComputedStyle=gcs;if(!d.isIE){d._toPixelValue=function(_16e,_16f){return parseFloat(_16f)||0;};}else{d._toPixelValue=function(_170,_171){if(!_171){return 0;}if(_171=="medium"){return 4;}if(_171.slice&&_171.slice(-2)=="px"){return parseFloat(_171);}with(_170){var _172=style.left;var _173=runtimeStyle.left;runtimeStyle.left=currentStyle.left;try{style.left=_171;_171=style.pixelLeft;}catch(e){_171=0;}style.left=_172;runtimeStyle.left=_173;}return _171;};}var px=d._toPixelValue;var astr="DXImageTransform.Microsoft.Alpha";var af=function(n,f){try{return n.filters.item(astr);}catch(e){return f?{}:null;}};dojo._getOpacity=d.isIE<9?function(node){try{return af(node).Opacity/100;}catch(e){return 1;}}:function(node){return gcs(node).opacity;};dojo._setOpacity=d.isIE<9?function(node,_174){var ov=_174*100,_175=_174==1;node.style.zoom=_175?"":1;if(!af(node)){if(_175){return _174;}node.style.filter+=" progid:"+astr+"(Opacity="+ov+")";}else{af(node,1).Opacity=ov;}af(node,1).Enabled=!_175;if(node.nodeName.toLowerCase()=="tr"){d.query("> td",node).forEach(function(i){d._setOpacity(i,_174);});}return _174;}:function(node,_176){return node.style.opacity=_176;};var _177={left:true,top:true};var _178=/margin|padding|width|height|max|min|offset/;var _179=function(node,type,_17a){type=type.toLowerCase();if(d.isIE){if(_17a=="auto"){if(type=="height"){return node.offsetHeight;}if(type=="width"){return node.offsetWidth;}}if(type=="fontweight"){switch(_17a){case 700:return "bold";case 400:default:return "normal";}}}if(!(type in _177)){_177[type]=_178.test(type);}return _177[type]?px(node,_17a):_17a;};var _17b=d.isIE?"styleFloat":"cssFloat",_17c={"cssFloat":_17b,"styleFloat":_17b,"float":_17b};dojo.style=function(node,_17d,_17e){var n=byId(node),args=arguments.length,op=(_17d=="opacity");_17d=_17c[_17d]||_17d;if(args==3){return op?d._setOpacity(n,_17e):n.style[_17d]=_17e;}if(args==2&&op){return d._getOpacity(n);}var s=gcs(n);if(args==2&&typeof _17d!="string"){for(var x in _17d){d.style(node,x,_17d[x]);}return s;}return (args==1)?s:_179(n,_17d,s[_17d]||n.style[_17d]);};dojo._getPadExtents=function(n,_17f){var s=_17f||gcs(n),l=px(n,s.paddingLeft),t=px(n,s.paddingTop);return {l:l,t:t,w:l+px(n,s.paddingRight),h:t+px(n,s.paddingBottom)};};dojo._getBorderExtents=function(n,_180){var ne="none",s=_180||gcs(n),bl=(s.borderLeftStyle!=ne?px(n,s.borderLeftWidth):0),bt=(s.borderTopStyle!=ne?px(n,s.borderTopWidth):0);return {l:bl,t:bt,w:bl+(s.borderRightStyle!=ne?px(n,s.borderRightWidth):0),h:bt+(s.borderBottomStyle!=ne?px(n,s.borderBottomWidth):0)};};dojo._getPadBorderExtents=function(n,_181){var s=_181||gcs(n),p=d._getPadExtents(n,s),b=d._getBorderExtents(n,s);return {l:p.l+b.l,t:p.t+b.t,w:p.w+b.w,h:p.h+b.h};};dojo._getMarginExtents=function(n,_182){var s=_182||gcs(n),l=px(n,s.marginLeft),t=px(n,s.marginTop),r=px(n,s.marginRight),b=px(n,s.marginBottom);if(d.isWebKit&&(s.position!="absolute")){r=l;}return {l:l,t:t,w:l+r,h:t+b};};dojo._getMarginBox=function(node,_183){var s=_183||gcs(node),me=d._getMarginExtents(node,s);var l=node.offsetLeft-me.l,t=node.offsetTop-me.t,p=node.parentNode;if(d.isMoz){var sl=parseFloat(s.left),st=parseFloat(s.top);if(!isNaN(sl)&&!isNaN(st)){l=sl,t=st;}else{if(p&&p.style){var pcs=gcs(p);if(pcs.overflow!="visible"){var be=d._getBorderExtents(p,pcs);l+=be.l,t+=be.t;}}}}else{if(d.isOpera||(d.isIE>7&&!d.isQuirks)){if(p){be=d._getBorderExtents(p);l-=be.l;t-=be.t;}}}return {l:l,t:t,w:node.offsetWidth+me.w,h:node.offsetHeight+me.h};};dojo._getMarginSize=function(node,_184){node=byId(node);var me=d._getMarginExtents(node,_184||gcs(node));var size=node.getBoundingClientRect();return {w:(size.right-size.left)+me.w,h:(size.bottom-size.top)+me.h};};dojo._getContentBox=function(node,_185){var s=_185||gcs(node),pe=d._getPadExtents(node,s),be=d._getBorderExtents(node,s),w=node.clientWidth,h;if(!w){w=node.offsetWidth,h=node.offsetHeight;}else{h=node.clientHeight,be.w=be.h=0;}if(d.isOpera){pe.l+=be.l;pe.t+=be.t;}return {l:pe.l,t:pe.t,w:w-pe.w-be.w,h:h-pe.h-be.h};};dojo._getBorderBox=function(node,_186){var s=_186||gcs(node),pe=d._getPadExtents(node,s),cb=d._getContentBox(node,s);return {l:cb.l-pe.l,t:cb.t-pe.t,w:cb.w+pe.w,h:cb.h+pe.h};};dojo._setBox=function(node,l,t,w,h,u){u=u||"px";var s=node.style;if(!isNaN(l)){s.left=l+u;}if(!isNaN(t)){s.top=t+u;}if(w>=0){s.width=w+u;}if(h>=0){s.height=h+u;}};dojo._isButtonTag=function(node){return node.tagName=="BUTTON"||node.tagName=="INPUT"&&(node.getAttribute("type")||"").toUpperCase()=="BUTTON";};dojo._usesBorderBox=function(node){var n=node.tagName;return d.boxModel=="border-box"||n=="TABLE"||d._isButtonTag(node);};dojo._setContentSize=function(node,_187,_188,_189){if(d._usesBorderBox(node)){var pb=d._getPadBorderExtents(node,_189);if(_187>=0){_187+=pb.w;}if(_188>=0){_188+=pb.h;}}d._setBox(node,NaN,NaN,_187,_188);};dojo._setMarginBox=function(node,_18a,_18b,_18c,_18d,_18e){var s=_18e||gcs(node),bb=d._usesBorderBox(node),pb=bb?_18f:d._getPadBorderExtents(node,s);if(d.isWebKit){if(d._isButtonTag(node)){var ns=node.style;if(_18c>=0&&!ns.width){ns.width="4px";}if(_18d>=0&&!ns.height){ns.height="4px";}}}var mb=d._getMarginExtents(node,s);if(_18c>=0){_18c=Math.max(_18c-pb.w-mb.w,0);}if(_18d>=0){_18d=Math.max(_18d-pb.h-mb.h,0);}d._setBox(node,_18a,_18b,_18c,_18d);};var _18f={l:0,t:0,w:0,h:0};dojo.marginBox=function(node,box){var n=byId(node),s=gcs(n),b=box;return !b?d._getMarginBox(n,s):d._setMarginBox(n,b.l,b.t,b.w,b.h,s);};dojo.contentBox=function(node,box){var n=byId(node),s=gcs(n),b=box;return !b?d._getContentBox(n,s):d._setContentSize(n,b.w,b.h,s);};var _190=function(node,prop){if(!(node=(node||0).parentNode)){return 0;}var val,_191=0,_192=d.body();while(node&&node.style){if(gcs(node).position=="fixed"){return 0;}val=node[prop];if(val){_191+=val-0;if(node==_192){break;}}node=node.parentNode;}return _191;};dojo._docScroll=function(){var n=d.global;return "pageXOffset" in n?{x:n.pageXOffset,y:n.pageYOffset}:(n=d.isQuirks?d.doc.body:d.doc.documentElement,{x:d._fixIeBiDiScrollLeft(n.scrollLeft||0),y:n.scrollTop||0});};dojo._isBodyLtr=function(){return "_bodyLtr" in d?d._bodyLtr:d._bodyLtr=(d.body().dir||d.doc.documentElement.dir||"ltr").toLowerCase()=="ltr";};dojo._getIeDocumentElementOffset=function(){var de=d.doc.documentElement;if(d.isIE<8){var r=de.getBoundingClientRect();var l=r.left,t=r.top;if(d.isIE<7){l+=de.clientLeft;t+=de.clientTop;}return {x:l<0?0:l,y:t<0?0:t};}else{return {x:0,y:0};}};dojo._fixIeBiDiScrollLeft=function(_193){var ie=d.isIE;if(ie&&!d._isBodyLtr()){var qk=d.isQuirks,de=qk?d.doc.body:d.doc.documentElement;if(ie==6&&!qk&&d.global.frameElement&&de.scrollHeight>de.clientHeight){_193+=de.clientLeft;}return (ie<8||qk)?(_193+de.clientWidth-de.scrollWidth):-_193;}return _193;};dojo._abs=dojo.position=function(node,_194){node=byId(node);var db=d.body(),dh=db.parentNode,ret=node.getBoundingClientRect();ret={x:ret.left,y:ret.top,w:ret.right-ret.left,h:ret.bottom-ret.top};if(d.isIE){var _195=d._getIeDocumentElementOffset();ret.x-=_195.x+(d.isQuirks?db.clientLeft+db.offsetLeft:0);ret.y-=_195.y+(d.isQuirks?db.clientTop+db.offsetTop:0);}else{if(d.isFF==3){var cs=gcs(dh);ret.x-=px(dh,cs.marginLeft)+px(dh,cs.borderLeftWidth);ret.y-=px(dh,cs.marginTop)+px(dh,cs.borderTopWidth);}}if(_194){var _196=d._docScroll();ret.x+=_196.x;ret.y+=_196.y;}return ret;};dojo.coords=function(node,_197){var n=byId(node),s=gcs(n),mb=d._getMarginBox(n,s);var abs=d.position(n,_197);mb.x=abs.x;mb.y=abs.y;return mb;};var _198={"class":"className","for":"htmlFor",tabindex:"tabIndex",readonly:"readOnly",colspan:"colSpan",frameborder:"frameBorder",rowspan:"rowSpan",valuetype:"valueType"},_199={classname:"class",htmlfor:"for",tabindex:"tabIndex",readonly:"readOnly"},_19a={innerHTML:1,className:1,htmlFor:d.isIE,value:1};var _19b=function(name){return _199[name.toLowerCase()]||name;};var _19c=function(node,name){var attr=node.getAttributeNode&&node.getAttributeNode(name);return attr&&attr.specified;};dojo.hasAttr=function(node,name){var lc=name.toLowerCase();return _19a[_198[lc]||name]||_19c(byId(node),_199[lc]||name);};var _19d={},_19e=0,_19f=dojo._scopeName+"attrid",_1a0={col:1,colgroup:1,table:1,tbody:1,tfoot:1,thead:1,tr:1,title:1};dojo.attr=function(node,name,_1a1){node=byId(node);var args=arguments.length,prop;if(args==2&&typeof name!="string"){for(var x in name){d.attr(node,x,name[x]);}return node;}var lc=name.toLowerCase(),_1a2=_198[lc]||name,_1a3=_19a[_1a2],_1a4=_199[lc]||name;if(args==3){do{if(_1a2=="style"&&typeof _1a1!="string"){d.style(node,_1a1);break;}if(_1a2=="innerHTML"){if(d.isIE&&node.tagName.toLowerCase() in _1a0){d.empty(node);node.appendChild(d._toDom(_1a1,node.ownerDocument));}else{node[_1a2]=_1a1;}break;}if(d.isFunction(_1a1)){var _1a5=d.attr(node,_19f);if(!_1a5){_1a5=_19e++;d.attr(node,_19f,_1a5);}if(!_19d[_1a5]){_19d[_1a5]={};}var h=_19d[_1a5][_1a2];if(h){d.disconnect(h);}else{try{delete node[_1a2];}catch(e){}}_19d[_1a5][_1a2]=d.connect(node,_1a2,_1a1);break;}if(_1a3||typeof _1a1=="boolean"){node[_1a2]=_1a1;break;}node.setAttribute(_1a4,_1a1);}while(false);return node;}_1a1=node[_1a2];if(_1a3&&typeof _1a1!="undefined"){return _1a1;}if(_1a2!="href"&&(typeof _1a1=="boolean"||d.isFunction(_1a1))){return _1a1;}return _19c(node,_1a4)?node.getAttribute(_1a4):null;};dojo.removeAttr=function(node,name){byId(node).removeAttribute(_19b(name));};dojo.getNodeProp=function(node,name){node=byId(node);var lc=name.toLowerCase(),_1a6=_198[lc]||name;if((_1a6 in node)&&_1a6!="href"){return node[_1a6];}var _1a7=_199[lc]||name;return _19c(node,_1a7)?node.getAttribute(_1a7):null;};dojo.create=function(tag,_1a8,_1a9,pos){var doc=d.doc;if(_1a9){_1a9=byId(_1a9);doc=_1a9.ownerDocument;}if(typeof tag=="string"){tag=doc.createElement(tag);}if(_1a8){d.attr(tag,_1a8);}if(_1a9){d.place(tag,_1a9,pos);}return tag;};d.empty=d.isIE?function(node){node=byId(node);for(var c;c=node.lastChild;){d.destroy(c);}}:function(node){byId(node).innerHTML="";};var _1aa={option:["select"],tbody:["table"],thead:["table"],tfoot:["table"],tr:["table","tbody"],td:["table","tbody","tr"],th:["table","thead","tr"],legend:["fieldset"],caption:["table"],colgroup:["table"],col:["table","colgroup"],li:["ul"]},_1ab=/<\s*([\w\:]+)/,_1ac={},_1ad=0,_1ae="__"+d._scopeName+"ToDomId";for(var _1af in _1aa){if(_1aa.hasOwnProperty(_1af)){var tw=_1aa[_1af];tw.pre=_1af=="option"?"<select multiple=\"multiple\">":"<"+tw.join("><")+">";tw.post="</"+tw.reverse().join("></")+">";}}d._toDom=function(frag,doc){doc=doc||d.doc;var _1b0=doc[_1ae];if(!_1b0){doc[_1ae]=_1b0=++_1ad+"";_1ac[_1b0]=doc.createElement("div");}frag+="";var _1b1=frag.match(_1ab),tag=_1b1?_1b1[1].toLowerCase():"",_1b2=_1ac[_1b0],wrap,i,fc,df;if(_1b1&&_1aa[tag]){wrap=_1aa[tag];_1b2.innerHTML=wrap.pre+frag+wrap.post;for(i=wrap.length;i;--i){_1b2=_1b2.firstChild;}}else{_1b2.innerHTML=frag;}if(_1b2.childNodes.length==1){return _1b2.removeChild(_1b2.firstChild);}df=doc.createDocumentFragment();while(fc=_1b2.firstChild){df.appendChild(fc);}return df;};var _1b3="className";dojo.hasClass=function(node,_1b4){return ((" "+byId(node)[_1b3]+" ").indexOf(" "+_1b4+" ")>=0);};var _1b5=/\s+/,a1=[""],_1b6={},_1b7=function(s){if(typeof s=="string"||s instanceof String){if(s.indexOf(" ")<0){a1[0]=s;return a1;}else{return s.split(_1b5);}}return s||"";};dojo.addClass=function(node,_1b8){node=byId(node);_1b8=_1b7(_1b8);var cls=node[_1b3],_1b9;cls=cls?" "+cls+" ":" ";_1b9=cls.length;for(var i=0,len=_1b8.length,c;i<len;++i){c=_1b8[i];if(c&&cls.indexOf(" "+c+" ")<0){cls+=c+" ";}}if(_1b9<cls.length){node[_1b3]=cls.substr(1,cls.length-2);}};dojo.removeClass=function(node,_1ba){node=byId(node);var cls;if(_1ba!==undefined){_1ba=_1b7(_1ba);cls=" "+node[_1b3]+" ";for(var i=0,len=_1ba.length;i<len;++i){cls=cls.replace(" "+_1ba[i]+" "," ");}cls=d.trim(cls);}else{cls="";}if(node[_1b3]!=cls){node[_1b3]=cls;}};dojo.replaceClass=function(node,_1bb,_1bc){node=byId(node);_1b6.className=node.className;dojo.removeClass(_1b6,_1bc);dojo.addClass(_1b6,_1bb);if(node.className!==_1b6.className){node.className=_1b6.className;}};dojo.toggleClass=function(node,_1bd,_1be){if(_1be===undefined){_1be=!d.hasClass(node,_1bd);}d[_1be?"addClass":"removeClass"](node,_1bd);};})();}if(!dojo._hasResource["dojo._base.NodeList"]){dojo._hasResource["dojo._base.NodeList"]=true;dojo.provide("dojo._base.NodeList");(function(){var d=dojo;var ap=Array.prototype,aps=ap.slice,apc=ap.concat;var tnl=function(a,_1bf,_1c0){if(!a.sort){a=aps.call(a,0);}var ctor=_1c0||this._NodeListCtor||d._NodeListCtor;a.constructor=ctor;dojo._mixin(a,ctor.prototype);a._NodeListCtor=ctor;return _1bf?a._stash(_1bf):a;};var _1c1=function(f,a,o){a=[0].concat(aps.call(a,0));o=o||d.global;return function(node){a[0]=node;return f.apply(o,a);};};var _1c2=function(f,o){return function(){this.forEach(_1c1(f,arguments,o));return this;};};var _1c3=function(f,o){return function(){return this.map(_1c1(f,arguments,o));};};var _1c4=function(f,o){return function(){return this.filter(_1c1(f,arguments,o));};};var _1c5=function(f,g,o){return function(){var a=arguments,body=_1c1(f,a,o);if(g.call(o||d.global,a)){return this.map(body);}this.forEach(body);return this;};};var _1c6=function(a){return a.length==1&&(typeof a[0]=="string");};var _1c7=function(node){var p=node.parentNode;if(p){p.removeChild(node);}};dojo.NodeList=function(){return tnl(Array.apply(null,arguments));};d._NodeListCtor=d.NodeList;var nl=d.NodeList,nlp=nl.prototype;nl._wrap=nlp._wrap=tnl;nl._adaptAsMap=_1c3;nl._adaptAsForEach=_1c2;nl._adaptAsFilter=_1c4;nl._adaptWithCondition=_1c5;d.forEach(["slice","splice"],function(name){var f=ap[name];nlp[name]=function(){return this._wrap(f.apply(this,arguments),name=="slice"?this:null);};});d.forEach(["indexOf","lastIndexOf","every","some"],function(name){var f=d[name];nlp[name]=function(){return f.apply(d,[this].concat(aps.call(arguments,0)));};});d.forEach(["attr","style"],function(name){nlp[name]=_1c5(d[name],_1c6);});d.forEach(["connect","addClass","removeClass","replaceClass","toggleClass","empty","removeAttr"],function(name){nlp[name]=_1c2(d[name]);});dojo.extend(dojo.NodeList,{_normalize:function(_1c8,_1c9){var _1ca=_1c8.parse===true?true:false;if(typeof _1c8.template=="string"){var _1cb=_1c8.templateFunc||(dojo.string&&dojo.string.substitute);_1c8=_1cb?_1cb(_1c8.template,_1c8):_1c8;}var type=(typeof _1c8);if(type=="string"||type=="number"){_1c8=dojo._toDom(_1c8,(_1c9&&_1c9.ownerDocument));if(_1c8.nodeType==11){_1c8=dojo._toArray(_1c8.childNodes);}else{_1c8=[_1c8];}}else{if(!dojo.isArrayLike(_1c8)){_1c8=[_1c8];}else{if(!dojo.isArray(_1c8)){_1c8=dojo._toArray(_1c8);}}}if(_1ca){_1c8._runParse=true;}return _1c8;},_cloneNode:function(node){return node.cloneNode(true);},_place:function(ary,_1cc,_1cd,_1ce){if(_1cc.nodeType!=1&&_1cd=="only"){return;}var _1cf=_1cc,_1d0;var _1d1=ary.length;for(var i=_1d1-1;i>=0;i--){var node=(_1ce?this._cloneNode(ary[i]):ary[i]);if(ary._runParse&&dojo.parser&&dojo.parser.parse){if(!_1d0){_1d0=_1cf.ownerDocument.createElement("div");}_1d0.appendChild(node);dojo.parser.parse(_1d0);node=_1d0.firstChild;while(_1d0.firstChild){_1d0.removeChild(_1d0.firstChild);}}if(i==_1d1-1){dojo.place(node,_1cf,_1cd);}else{_1cf.parentNode.insertBefore(node,_1cf);}_1cf=node;}},_stash:function(_1d2){this._parent=_1d2;return this;},end:function(){if(this._parent){return this._parent;}else{return new this._NodeListCtor();}},concat:function(item){var t=d.isArray(this)?this:aps.call(this,0),m=d.map(arguments,function(a){return a&&!d.isArray(a)&&(typeof NodeList!="undefined"&&a.constructor===NodeList||a.constructor===this._NodeListCtor)?aps.call(a,0):a;});return this._wrap(apc.apply(t,m),this);},map:function(func,obj){return this._wrap(d.map(this,func,obj),this);},forEach:function(_1d3,_1d4){d.forEach(this,_1d3,_1d4);return this;},coords:_1c3(d.coords),position:_1c3(d.position),place:function(_1d5,_1d6){var item=d.query(_1d5)[0];return this.forEach(function(node){d.place(node,item,_1d6);});},orphan:function(_1d7){return (_1d7?d._filterQueryResult(this,_1d7):this).forEach(_1c7);},adopt:function(_1d8,_1d9){return d.query(_1d8).place(this[0],_1d9)._stash(this);},query:function(_1da){if(!_1da){return this;}var ret=this.map(function(node){return d.query(_1da,node).filter(function(_1db){return _1db!==undefined;});});return this._wrap(apc.apply([],ret),this);},filter:function(_1dc){var a=arguments,_1dd=this,_1de=0;if(typeof _1dc=="string"){_1dd=d._filterQueryResult(this,a[0]);if(a.length==1){return _1dd._stash(this);}_1de=1;}return this._wrap(d.filter(_1dd,a[_1de],a[_1de+1]),this);},addContent:function(_1df,_1e0){_1df=this._normalize(_1df,this[0]);for(var i=0,node;(node=this[i]);i++){this._place(_1df,node,_1e0,i>0);}return this;},instantiate:function(_1e1,_1e2){var c=d.isFunction(_1e1)?_1e1:d.getObject(_1e1);_1e2=_1e2||{};return this.forEach(function(node){new c(_1e2,node);});},at:function(){var t=new this._NodeListCtor();d.forEach(arguments,function(i){if(i<0){i=this.length+i;}if(this[i]){t.push(this[i]);}},this);return t._stash(this);}});nl.events=["blur","focus","change","click","error","keydown","keypress","keyup","load","mousedown","mouseenter","mouseleave","mousemove","mouseout","mouseover","mouseup","submit"];d.forEach(nl.events,function(evt){var _1e3="on"+evt;nlp[_1e3]=function(a,b){return this.connect(_1e3,a,b);};});})();}if(!dojo._hasResource["dojo._base.query"]){dojo._hasResource["dojo._base.query"]=true;(function(){var _1e4=function(d){var trim=d.trim;var each=d.forEach;var qlc=(d._NodeListCtor=d.NodeList);var _1e5=function(){return d.doc;};var _1e6=((d.isWebKit||d.isMozilla)&&((_1e5().compatMode)=="BackCompat"));var _1e7=!!_1e5().firstChild["children"]?"children":"childNodes";var _1e8=">~+";var _1e9=false;var _1ea=function(){return true;};var _1eb=function(_1ec){if(_1e8.indexOf(_1ec.slice(-1))>=0){_1ec+=" * ";}else{_1ec+=" ";}var ts=function(s,e){return trim(_1ec.slice(s,e));};var _1ed=[];var _1ee=-1,_1ef=-1,_1f0=-1,_1f1=-1,_1f2=-1,inId=-1,_1f3=-1,lc="",cc="",_1f4;var x=0,ql=_1ec.length,_1f5=null,_1f6=null;var _1f7=function(){if(_1f3>=0){var tv=(_1f3==x)?null:ts(_1f3,x);_1f5[(_1e8.indexOf(tv)<0)?"tag":"oper"]=tv;_1f3=-1;}};var _1f8=function(){if(inId>=0){_1f5.id=ts(inId,x).replace(/\\/g,"");inId=-1;}};var _1f9=function(){if(_1f2>=0){_1f5.classes.push(ts(_1f2+1,x).replace(/\\/g,""));_1f2=-1;}};var _1fa=function(){_1f8();_1f7();_1f9();};var _1fb=function(){_1fa();if(_1f1>=0){_1f5.pseudos.push({name:ts(_1f1+1,x)});}_1f5.loops=(_1f5.pseudos.length||_1f5.attrs.length||_1f5.classes.length);_1f5.oquery=_1f5.query=ts(_1f4,x);_1f5.otag=_1f5.tag=(_1f5["oper"])?null:(_1f5.tag||"*");if(_1f5.tag){_1f5.tag=_1f5.tag.toUpperCase();}if(_1ed.length&&(_1ed[_1ed.length-1].oper)){_1f5.infixOper=_1ed.pop();_1f5.query=_1f5.infixOper.query+" "+_1f5.query;}_1ed.push(_1f5);_1f5=null;};for(;lc=cc,cc=_1ec.charAt(x),x<ql;x++){if(lc=="\\"){continue;}if(!_1f5){_1f4=x;_1f5={query:null,pseudos:[],attrs:[],classes:[],tag:null,oper:null,id:null,getTag:function(){return (_1e9)?this.otag:this.tag;}};_1f3=x;}if(_1ee>=0){if(cc=="]"){if(!_1f6.attr){_1f6.attr=ts(_1ee+1,x);}else{_1f6.matchFor=ts((_1f0||_1ee+1),x);}var cmf=_1f6.matchFor;if(cmf){if((cmf.charAt(0)=="\"")||(cmf.charAt(0)=="'")){_1f6.matchFor=cmf.slice(1,-1);}}_1f5.attrs.push(_1f6);_1f6=null;_1ee=_1f0=-1;}else{if(cc=="="){var _1fc=("|~^$*".indexOf(lc)>=0)?lc:"";_1f6.type=_1fc+cc;_1f6.attr=ts(_1ee+1,x-_1fc.length);_1f0=x+1;}}}else{if(_1ef>=0){if(cc==")"){if(_1f1>=0){_1f6.value=ts(_1ef+1,x);}_1f1=_1ef=-1;}}else{if(cc=="#"){_1fa();inId=x+1;}else{if(cc=="."){_1fa();_1f2=x;}else{if(cc==":"){_1fa();_1f1=x;}else{if(cc=="["){_1fa();_1ee=x;_1f6={};}else{if(cc=="("){if(_1f1>=0){_1f6={name:ts(_1f1+1,x),value:null};_1f5.pseudos.push(_1f6);}_1ef=x;}else{if((cc==" ")&&(lc!=cc)){_1fb();}}}}}}}}}return _1ed;};var _1fd=function(_1fe,_1ff){if(!_1fe){return _1ff;}if(!_1ff){return _1fe;}return function(){return _1fe.apply(window,arguments)&&_1ff.apply(window,arguments);};};var _200=function(i,arr){var r=arr||[];if(i){r.push(i);}return r;};var _201=function(n){return (1==n.nodeType);};var _202="";var _203=function(elem,attr){if(!elem){return _202;}if(attr=="class"){return elem.className||_202;}if(attr=="for"){return elem.htmlFor||_202;}if(attr=="style"){return elem.style.cssText||_202;}return (_1e9?elem.getAttribute(attr):elem.getAttribute(attr,2))||_202;};var _204={"*=":function(attr,_205){return function(elem){return (_203(elem,attr).indexOf(_205)>=0);};},"^=":function(attr,_206){return function(elem){return (_203(elem,attr).indexOf(_206)==0);};},"$=":function(attr,_207){var tval=" "+_207;return function(elem){var ea=" "+_203(elem,attr);return (ea.lastIndexOf(_207)==(ea.length-_207.length));};},"~=":function(attr,_208){var tval=" "+_208+" ";return function(elem){var ea=" "+_203(elem,attr)+" ";return (ea.indexOf(tval)>=0);};},"|=":function(attr,_209){var _20a=" "+_209+"-";return function(elem){var ea=" "+_203(elem,attr);return ((ea==_209)||(ea.indexOf(_20a)==0));};},"=":function(attr,_20b){return function(elem){return (_203(elem,attr)==_20b);};}};var _20c=(typeof _1e5().firstChild.nextElementSibling=="undefined");var _20d=!_20c?"nextElementSibling":"nextSibling";var _20e=!_20c?"previousElementSibling":"previousSibling";var _20f=(_20c?_201:_1ea);var _210=function(node){while(node=node[_20e]){if(_20f(node)){return false;}}return true;};var _211=function(node){while(node=node[_20d]){if(_20f(node)){return false;}}return true;};var _212=function(node){var root=node.parentNode;var i=0,tret=root[_1e7],ci=(node["_i"]||-1),cl=(root["_l"]||-1);if(!tret){return -1;}var l=tret.length;if(cl==l&&ci>=0&&cl>=0){return ci;}root["_l"]=l;ci=-1;for(var te=root["firstElementChild"]||root["firstChild"];te;te=te[_20d]){if(_20f(te)){te["_i"]=++i;if(node===te){ci=i;}}}return ci;};var _213=function(elem){return !((_212(elem))%2);};var _214=function(elem){return ((_212(elem))%2);};var _215={"checked":function(name,_216){return function(elem){return !!("checked" in elem?elem.checked:elem.selected);};},"first-child":function(){return _210;},"last-child":function(){return _211;},"only-child":function(name,_217){return function(node){if(!_210(node)){return false;}if(!_211(node)){return false;}return true;};},"empty":function(name,_218){return function(elem){var cn=elem.childNodes;var cnl=elem.childNodes.length;for(var x=cnl-1;x>=0;x--){var nt=cn[x].nodeType;if((nt===1)||(nt==3)){return false;}}return true;};},"contains":function(name,_219){var cz=_219.charAt(0);if(cz=="\""||cz=="'"){_219=_219.slice(1,-1);}return function(elem){return (elem.innerHTML.indexOf(_219)>=0);};},"not":function(name,_21a){var p=_1eb(_21a)[0];var _21b={el:1};if(p.tag!="*"){_21b.tag=1;}if(!p.classes.length){_21b.classes=1;}var ntf=_21c(p,_21b);return function(elem){return (!ntf(elem));};},"nth-child":function(name,_21d){var pi=parseInt;if(_21d=="odd"){return _214;}else{if(_21d=="even"){return _213;}}if(_21d.indexOf("n")!=-1){var _21e=_21d.split("n",2);var pred=_21e[0]?((_21e[0]=="-")?-1:pi(_21e[0])):1;var idx=_21e[1]?pi(_21e[1]):0;var lb=0,ub=-1;if(pred>0){if(idx<0){idx=(idx%pred)&&(pred+(idx%pred));}else{if(idx>0){if(idx>=pred){lb=idx-idx%pred;}idx=idx%pred;}}}else{if(pred<0){pred*=-1;if(idx>0){ub=idx;idx=idx%pred;}}}if(pred>0){return function(elem){var i=_212(elem);return (i>=lb)&&(ub<0||i<=ub)&&((i%pred)==idx);};}else{_21d=idx;}}var _21f=pi(_21d);return function(elem){return (_212(elem)==_21f);};}};var _220=(d.isIE<9||(dojo.isIE&&dojo.isQuirks))?function(cond){var clc=cond.toLowerCase();if(clc=="class"){cond="className";}return function(elem){return (_1e9?elem.getAttribute(cond):elem[cond]||elem[clc]);};}:function(cond){return function(elem){return (elem&&elem.getAttribute&&elem.hasAttribute(cond));};};var _21c=function(_221,_222){if(!_221){return _1ea;}_222=_222||{};var ff=null;if(!("el" in _222)){ff=_1fd(ff,_201);}if(!("tag" in _222)){if(_221.tag!="*"){ff=_1fd(ff,function(elem){return (elem&&(elem.tagName==_221.getTag()));});}}if(!("classes" in _222)){each(_221.classes,function(_223,idx,arr){var re=new RegExp("(?:^|\\s)"+_223+"(?:\\s|$)");ff=_1fd(ff,function(elem){return re.test(elem.className);});ff.count=idx;});}if(!("pseudos" in _222)){each(_221.pseudos,function(_224){var pn=_224.name;if(_215[pn]){ff=_1fd(ff,_215[pn](pn,_224.value));}});}if(!("attrs" in _222)){each(_221.attrs,function(attr){var _225;var a=attr.attr;if(attr.type&&_204[attr.type]){_225=_204[attr.type](a,attr.matchFor);}else{if(a.length){_225=_220(a);}}if(_225){ff=_1fd(ff,_225);}});}if(!("id" in _222)){if(_221.id){ff=_1fd(ff,function(elem){return (!!elem&&(elem.id==_221.id));});}}if(!ff){if(!("default" in _222)){ff=_1ea;}}return ff;};var _226=function(_227){return function(node,ret,bag){while(node=node[_20d]){if(_20c&&(!_201(node))){continue;}if((!bag||_228(node,bag))&&_227(node)){ret.push(node);}break;}return ret;};};var _229=function(_22a){return function(root,ret,bag){var te=root[_20d];while(te){if(_20f(te)){if(bag&&!_228(te,bag)){break;}if(_22a(te)){ret.push(te);}}te=te[_20d];}return ret;};};var _22b=function(_22c){_22c=_22c||_1ea;return function(root,ret,bag){var te,x=0,tret=root[_1e7];while(te=tret[x++]){if(_20f(te)&&(!bag||_228(te,bag))&&(_22c(te,x))){ret.push(te);}}return ret;};};var _22d=function(node,root){var pn=node.parentNode;while(pn){if(pn==root){break;}pn=pn.parentNode;}return !!pn;};var _22e={};var _22f=function(_230){var _231=_22e[_230.query];if(_231){return _231;}var io=_230.infixOper;var oper=(io?io.oper:"");var _232=_21c(_230,{el:1});var qt=_230.tag;var _233=("*"==qt);var ecs=_1e5()["getElementsByClassName"];if(!oper){if(_230.id){_232=(!_230.loops&&_233)?_1ea:_21c(_230,{el:1,id:1});_231=function(root,arr){var te=d.byId(_230.id,(root.ownerDocument||root));if(!te||!_232(te)){return;}if(9==root.nodeType){return _200(te,arr);}else{if(_22d(te,root)){return _200(te,arr);}}};}else{if(ecs&&/\{\s*\[native code\]\s*\}/.test(String(ecs))&&_230.classes.length&&!_1e6){_232=_21c(_230,{el:1,classes:1,id:1});var _234=_230.classes.join(" ");_231=function(root,arr,bag){var ret=_200(0,arr),te,x=0;var tret=root.getElementsByClassName(_234);while((te=tret[x++])){if(_232(te,root)&&_228(te,bag)){ret.push(te);}}return ret;};}else{if(!_233&&!_230.loops){_231=function(root,arr,bag){var ret=_200(0,arr),te,x=0;var tret=root.getElementsByTagName(_230.getTag());while((te=tret[x++])){if(_228(te,bag)){ret.push(te);}}return ret;};}else{_232=_21c(_230,{el:1,tag:1,id:1});_231=function(root,arr,bag){var ret=_200(0,arr),te,x=0;var tret=root.getElementsByTagName(_230.getTag());while((te=tret[x++])){if(_232(te,root)&&_228(te,bag)){ret.push(te);}}return ret;};}}}}else{var _235={el:1};if(_233){_235.tag=1;}_232=_21c(_230,_235);if("+"==oper){_231=_226(_232);}else{if("~"==oper){_231=_229(_232);}else{if(">"==oper){_231=_22b(_232);}}}}return _22e[_230.query]=_231;};var _236=function(root,_237){var _238=_200(root),qp,x,te,qpl=_237.length,bag,ret;for(var i=0;i<qpl;i++){ret=[];qp=_237[i];x=_238.length-1;if(x>0){bag={};ret.nozip=true;}var gef=_22f(qp);for(var j=0;(te=_238[j]);j++){gef(te,ret,bag);}if(!ret.length){break;}_238=ret;}return ret;};var _239={},_23a={};var _23b=function(_23c){var _23d=_1eb(trim(_23c));if(_23d.length==1){var tef=_22f(_23d[0]);return function(root){var r=tef(root,new qlc());if(r){r.nozip=true;}return r;};}return function(root){return _236(root,_23d);};};var nua=navigator.userAgent;var wk="WebKit/";var _23e=(d.isWebKit&&(nua.indexOf(wk)>0)&&(parseFloat(nua.split(wk)[1])>528));var _23f=d.isIE?"commentStrip":"nozip";var qsa="querySelectorAll";var _240=(!!_1e5()[qsa]&&(!d.isSafari||(d.isSafari>3.1)||_23e));var _241=/n\+\d|([^ ])?([>~+])([^ =])?/g;var _242=function(_243,pre,ch,post){return ch?(pre?pre+" ":"")+ch+(post?" "+post:""):_243;};var _244=function(_245,_246){_245=_245.replace(_241,_242);if(_240){var _247=_23a[_245];if(_247&&!_246){return _247;}}var _248=_239[_245];if(_248){return _248;}var qcz=_245.charAt(0);var _249=(-1==_245.indexOf(" "));if((_245.indexOf("#")>=0)&&(_249)){_246=true;}var _24a=(_240&&(!_246)&&(_1e8.indexOf(qcz)==-1)&&(!d.isIE||(_245.indexOf(":")==-1))&&(!(_1e6&&(_245.indexOf(".")>=0)))&&(_245.indexOf(":contains")==-1)&&(_245.indexOf(":checked")==-1)&&(_245.indexOf("|=")==-1));if(_24a){var tq=(_1e8.indexOf(_245.charAt(_245.length-1))>=0)?(_245+" *"):_245;return _23a[_245]=function(root){try{if(!((9==root.nodeType)||_249)){throw "";}var r=root[qsa](tq);r[_23f]=true;return r;}catch(e){return _244(_245,true)(root);}};}else{var _24b=_245.split(/\s*,\s*/);return _239[_245]=((_24b.length<2)?_23b(_245):function(root){var _24c=0,ret=[],tp;while((tp=_24b[_24c++])){ret=ret.concat(_23b(tp)(root));}return ret;});}};var _24d=0;var _24e=d.isIE?function(node){if(_1e9){return (node.getAttribute("_uid")||node.setAttribute("_uid",++_24d)||_24d);}else{return node.uniqueID;}}:function(node){return (node._uid||(node._uid=++_24d));};var _228=function(node,bag){if(!bag){return 1;}var id=_24e(node);if(!bag[id]){return bag[id]=1;}return 0;};var _24f="_zipIdx";var _250=function(arr){if(arr&&arr.nozip){return (qlc._wrap)?qlc._wrap(arr):arr;}var ret=new qlc();if(!arr||!arr.length){return ret;}if(arr[0]){ret.push(arr[0]);}if(arr.length<2){return ret;}_24d++;if(d.isIE&&_1e9){var _251=_24d+"";arr[0].setAttribute(_24f,_251);for(var x=1,te;te=arr[x];x++){if(arr[x].getAttribute(_24f)!=_251){ret.push(te);}te.setAttribute(_24f,_251);}}else{if(d.isIE&&arr.commentStrip){try{for(var x=1,te;te=arr[x];x++){if(_201(te)){ret.push(te);}}}catch(e){}}else{if(arr[0]){arr[0][_24f]=_24d;}for(var x=1,te;te=arr[x];x++){if(arr[x][_24f]!=_24d){ret.push(te);}te[_24f]=_24d;}}}return ret;};d.query=function(_252,root){qlc=d._NodeListCtor;if(!_252){return new qlc();}if(_252.constructor==qlc){return _252;}if(typeof _252!="string"){return new qlc(_252);}if(typeof root=="string"){root=d.byId(root);if(!root){return new qlc();}}root=root||_1e5();var od=root.ownerDocument||root.documentElement;_1e9=(root.contentType&&root.contentType=="application/xml")||(d.isOpera&&(root.doctype||od.toString()=="[object XMLDocument]"))||(!!od)&&(d.isIE?od.xml:(root.xmlVersion||od.xmlVersion));var r=_244(_252)(root);if(r&&r.nozip&&!qlc._wrap){return r;}return _250(r);};d.query.pseudos=_215;d._filterQueryResult=function(_253,_254,root){var _255=new d._NodeListCtor(),_256=_1eb(_254),_257=(_256.length==1&&!/[^\w#\.]/.test(_254))?_21c(_256[0]):function(node){return dojo.query(_254,root).indexOf(node)!=-1;};for(var x=0,te;te=_253[x];x++){if(_257(te)){_255.push(te);}}return _255;};};var _258=function(){acme={trim:function(str){str=str.replace(/^\s+/,"");for(var i=str.length-1;i>=0;i--){if(/\S/.test(str.charAt(i))){str=str.substring(0,i+1);break;}}return str;},forEach:function(arr,_259,_25a){if(!arr||!arr.length){return;}for(var i=0,l=arr.length;i<l;++i){_259.call(_25a||window,arr[i],i,arr);}},byId:function(id,doc){if(typeof id=="string"){return (doc||document).getElementById(id);}else{return id;}},doc:document,NodeList:Array};var n=navigator;var dua=n.userAgent;var dav=n.appVersion;var tv=parseFloat(dav);acme.isOpera=(dua.indexOf("Opera")>=0)?tv:undefined;acme.isKhtml=(dav.indexOf("Konqueror")>=0)?tv:undefined;acme.isWebKit=parseFloat(dua.split("WebKit/")[1])||undefined;acme.isChrome=parseFloat(dua.split("Chrome/")[1])||undefined;var _25b=Math.max(dav.indexOf("WebKit"),dav.indexOf("Safari"),0);if(_25b&&!acme.isChrome){acme.isSafari=parseFloat(dav.split("Version/")[1]);if(!acme.isSafari||parseFloat(dav.substr(_25b+7))<=419.3){acme.isSafari=2;}}if(document.all&&!acme.isOpera){acme.isIE=parseFloat(dav.split("MSIE ")[1])||undefined;}Array._wrap=function(arr){return arr;};return acme;};if(this["dojo"]){dojo.provide("dojo._base.query");_1e4(this["queryPortability"]||this["acme"]||dojo);}else{_1e4(this["queryPortability"]||this["acme"]||_258());}})();}if(!dojo._hasResource["dojo._base.xhr"]){dojo._hasResource["dojo._base.xhr"]=true;dojo.provide("dojo._base.xhr");(function(){var _25c=dojo,cfg=_25c.config;function _25d(obj,name,_25e){if(_25e===null){return;}var val=obj[name];if(typeof val=="string"){obj[name]=[val,_25e];}else{if(_25c.isArray(val)){val.push(_25e);}else{obj[name]=_25e;}}};dojo.fieldToObject=function(_25f){var ret=null;var item=_25c.byId(_25f);if(item){var _260=item.name;var type=(item.type||"").toLowerCase();if(_260&&type&&!item.disabled){if(type=="radio"||type=="checkbox"){if(item.checked){ret=item.value;}}else{if(item.multiple){ret=[];_25c.query("option",item).forEach(function(opt){if(opt.selected){ret.push(opt.value);}});}else{ret=item.value;}}}}return ret;};dojo.formToObject=function(_261){var ret={};var _262="file|submit|image|reset|button|";_25c.forEach(dojo.byId(_261).elements,function(item){var _263=item.name;var type=(item.type||"").toLowerCase();if(_263&&type&&_262.indexOf(type)==-1&&!item.disabled){_25d(ret,_263,_25c.fieldToObject(item));if(type=="image"){ret[_263+".x"]=ret[_263+".y"]=ret[_263].x=ret[_263].y=0;}}});return ret;};dojo.objectToQuery=function(map){var enc=encodeURIComponent;var _264=[];var _265={};for(var name in map){var _266=map[name];if(_266!=_265[name]){var _267=enc(name)+"=";if(_25c.isArray(_266)){for(var i=0;i<_266.length;i++){_264.push(_267+enc(_266[i]));}}else{_264.push(_267+enc(_266));}}}return _264.join("&");};dojo.formToQuery=function(_268){return _25c.objectToQuery(_25c.formToObject(_268));};dojo.formToJson=function(_269,_26a){return _25c.toJson(_25c.formToObject(_269),_26a);};dojo.queryToObject=function(str){var ret={};var qp=str.split("&");var dec=decodeURIComponent;_25c.forEach(qp,function(item){if(item.length){var _26b=item.split("=");var name=dec(_26b.shift());var val=dec(_26b.join("="));if(typeof ret[name]=="string"){ret[name]=[ret[name]];}if(_25c.isArray(ret[name])){ret[name].push(val);}else{ret[name]=val;}}});return ret;};dojo._blockAsync=false;var _26c=_25c._contentHandlers=dojo.contentHandlers={text:function(xhr){return xhr.responseText;},json:function(xhr){return _25c.fromJson(xhr.responseText||null);},"json-comment-filtered":function(xhr){if(!dojo.config.useCommentedJson){console.warn("Consider using the standard mimetype:application/json."+" json-commenting can introduce security issues. To"+" decrease the chances of hijacking, use the standard the 'json' handler and"+" prefix your json with: {}&&\n"+"Use djConfig.useCommentedJson=true to turn off this message.");}var _26d=xhr.responseText;var _26e=_26d.indexOf("/*");var _26f=_26d.lastIndexOf("*/");if(_26e==-1||_26f==-1){throw new Error("JSON was not comment filtered");}return _25c.fromJson(_26d.substring(_26e+2,_26f));},javascript:function(xhr){return _25c.eval(xhr.responseText);},xml:function(xhr){var _270=xhr.responseXML;if(_25c.isIE&&(!_270||!_270.documentElement)){var ms=function(n){return "MSXML"+n+".DOMDocument";};var dp=["Microsoft.XMLDOM",ms(6),ms(4),ms(3),ms(2)];_25c.some(dp,function(p){try{var dom=new ActiveXObject(p);dom.async=false;dom.loadXML(xhr.responseText);_270=dom;}catch(e){return false;}return true;});}return _270;},"json-comment-optional":function(xhr){if(xhr.responseText&&/^[^{\[]*\/\*/.test(xhr.responseText)){return _26c["json-comment-filtered"](xhr);}else{return _26c["json"](xhr);}}};dojo._ioSetArgs=function(args,_271,_272,_273){var _274={args:args,url:args.url};var _275=null;if(args.form){var form=_25c.byId(args.form);var _276=form.getAttributeNode("action");_274.url=_274.url||(_276?_276.value:null);_275=_25c.formToObject(form);}var _277=[{}];if(_275){_277.push(_275);}if(args.content){_277.push(args.content);}if(args.preventCache){_277.push({"dojo.preventCache":new Date().valueOf()});}_274.query=_25c.objectToQuery(_25c.mixin.apply(null,_277));_274.handleAs=args.handleAs||"text";var d=new _25c.Deferred(_271);d.addCallbacks(_272,function(_278){return _273(_278,d);});var ld=args.load;if(ld&&_25c.isFunction(ld)){d.addCallback(function(_279){return ld.call(args,_279,_274);});}var err=args.error;if(err&&_25c.isFunction(err)){d.addErrback(function(_27a){return err.call(args,_27a,_274);});}var _27b=args.handle;if(_27b&&_25c.isFunction(_27b)){d.addBoth(function(_27c){return _27b.call(args,_27c,_274);});}if(cfg.ioPublish&&_25c.publish&&_274.args.ioPublish!==false){d.addCallbacks(function(res){_25c.publish("/dojo/io/load",[d,res]);return res;},function(res){_25c.publish("/dojo/io/error",[d,res]);return res;});d.addBoth(function(res){_25c.publish("/dojo/io/done",[d,res]);return res;});}d.ioArgs=_274;return d;};var _27d=function(dfd){dfd.canceled=true;var xhr=dfd.ioArgs.xhr;var _27e=typeof xhr.abort;if(_27e=="function"||_27e=="object"||_27e=="unknown"){xhr.abort();}var err=dfd.ioArgs.error;if(!err){err=new Error("xhr cancelled");err.dojoType="cancel";}return err;};var _27f=function(dfd){var ret=_26c[dfd.ioArgs.handleAs](dfd.ioArgs.xhr);return ret===undefined?null:ret;};var _280=function(_281,dfd){if(!dfd.ioArgs.args.failOk){console.error(_281);}return _281;};var _282=null;var _283=[];var _284=0;var _285=function(dfd){if(_284<=0){_284=0;if(cfg.ioPublish&&_25c.publish&&(!dfd||dfd&&dfd.ioArgs.args.ioPublish!==false)){_25c.publish("/dojo/io/stop");}}};var _286=function(){var now=(new Date()).getTime();if(!_25c._blockAsync){for(var i=0,tif;i<_283.length&&(tif=_283[i]);i++){var dfd=tif.dfd;var func=function(){if(!dfd||dfd.canceled||!tif.validCheck(dfd)){_283.splice(i--,1);_284-=1;}else{if(tif.ioCheck(dfd)){_283.splice(i--,1);tif.resHandle(dfd);_284-=1;}else{if(dfd.startTime){if(dfd.startTime+(dfd.ioArgs.args.timeout||0)<now){_283.splice(i--,1);var err=new Error("timeout exceeded");err.dojoType="timeout";dfd.errback(err);dfd.cancel();_284-=1;}}}}};if(dojo.config.debugAtAllCosts){func.call(this);}else{try{func.call(this);}catch(e){dfd.errback(e);}}}}_285(dfd);if(!_283.length){clearInterval(_282);_282=null;return;}};dojo._ioCancelAll=function(){try{_25c.forEach(_283,function(i){try{i.dfd.cancel();}catch(e){}});}catch(e){}};if(_25c.isIE){_25c.addOnWindowUnload(_25c._ioCancelAll);}_25c._ioNotifyStart=function(dfd){if(cfg.ioPublish&&_25c.publish&&dfd.ioArgs.args.ioPublish!==false){if(!_284){_25c.publish("/dojo/io/start");}_284+=1;_25c.publish("/dojo/io/send",[dfd]);}};_25c._ioWatch=function(dfd,_287,_288,_289){var args=dfd.ioArgs.args;if(args.timeout){dfd.startTime=(new Date()).getTime();}_283.push({dfd:dfd,validCheck:_287,ioCheck:_288,resHandle:_289});if(!_282){_282=setInterval(_286,50);}if(args.sync){_286();}};var _28a="application/x-www-form-urlencoded";var _28b=function(dfd){return dfd.ioArgs.xhr.readyState;};var _28c=function(dfd){return 4==dfd.ioArgs.xhr.readyState;};var _28d=function(dfd){var xhr=dfd.ioArgs.xhr;if(_25c._isDocumentOk(xhr)){dfd.callback(dfd);}else{var err=new Error("Unable to load "+dfd.ioArgs.url+" status:"+xhr.status);err.status=xhr.status;err.responseText=xhr.responseText;dfd.errback(err);}};dojo._ioAddQueryToUrl=function(_28e){if(_28e.query.length){_28e.url+=(_28e.url.indexOf("?")==-1?"?":"&")+_28e.query;_28e.query=null;}};dojo.xhr=function(_28f,args,_290){var dfd=_25c._ioSetArgs(args,_27d,_27f,_280);var _291=dfd.ioArgs;var xhr=_291.xhr=_25c._xhrObj(_291.args);if(!xhr){dfd.cancel();return dfd;}if("postData" in args){_291.query=args.postData;}else{if("putData" in args){_291.query=args.putData;}else{if("rawBody" in args){_291.query=args.rawBody;}else{if((arguments.length>2&&!_290)||"POST|PUT".indexOf(_28f.toUpperCase())==-1){_25c._ioAddQueryToUrl(_291);}}}}xhr.open(_28f,_291.url,args.sync!==true,args.user||undefined,args.password||undefined);if(args.headers){for(var hdr in args.headers){if(hdr.toLowerCase()==="content-type"&&!args.contentType){args.contentType=args.headers[hdr];}else{if(args.headers[hdr]){xhr.setRequestHeader(hdr,args.headers[hdr]);}}}}xhr.setRequestHeader("Content-Type",args.contentType||_28a);if(!args.headers||!("X-Requested-With" in args.headers)){xhr.setRequestHeader("X-Requested-With","XMLHttpRequest");}_25c._ioNotifyStart(dfd);if(dojo.config.debugAtAllCosts){xhr.send(_291.query);}else{try{xhr.send(_291.query);}catch(e){_291.error=e;dfd.cancel();}}_25c._ioWatch(dfd,_28b,_28c,_28d);xhr=null;return dfd;};dojo.xhrGet=function(args){return _25c.xhr("GET",args);};dojo.rawXhrPost=dojo.xhrPost=function(args){return _25c.xhr("POST",args,true);};dojo.rawXhrPut=dojo.xhrPut=function(args){return _25c.xhr("PUT",args,true);};dojo.xhrDelete=function(args){return _25c.xhr("DELETE",args);};})();}if(!dojo._hasResource["dojo._base.fx"]){dojo._hasResource["dojo._base.fx"]=true;dojo.provide("dojo._base.fx");(function(){var d=dojo;var _292=d._mixin;dojo._Line=function(_293,end){this.start=_293;this.end=end;};dojo._Line.prototype.getValue=function(n){return ((this.end-this.start)*n)+this.start;};dojo.Animation=function(args){_292(this,args);if(d.isArray(this.curve)){this.curve=new d._Line(this.curve[0],this.curve[1]);}};d._Animation=d.Animation;d.extend(dojo.Animation,{duration:350,repeat:0,rate:20,_percent:0,_startRepeatCount:0,_getStep:function(){var _294=this._percent,_295=this.easing;return _295?_295(_294):_294;},_fire:function(evt,args){var a=args||[];if(this[evt]){if(d.config.debugAtAllCosts){this[evt].apply(this,a);}else{try{this[evt].apply(this,a);}catch(e){console.error("exception in animation handler for:",evt);console.error(e);}}}return this;},play:function(_296,_297){var _298=this;if(_298._delayTimer){_298._clearTimer();}if(_297){_298._stopTimer();_298._active=_298._paused=false;_298._percent=0;}else{if(_298._active&&!_298._paused){return _298;}}_298._fire("beforeBegin",[_298.node]);var de=_296||_298.delay,_299=dojo.hitch(_298,"_play",_297);if(de>0){_298._delayTimer=setTimeout(_299,de);return _298;}_299();return _298;},_play:function(_29a){var _29b=this;if(_29b._delayTimer){_29b._clearTimer();}_29b._startTime=new Date().valueOf();if(_29b._paused){_29b._startTime-=_29b.duration*_29b._percent;}_29b._active=true;_29b._paused=false;var _29c=_29b.curve.getValue(_29b._getStep());if(!_29b._percent){if(!_29b._startRepeatCount){_29b._startRepeatCount=_29b.repeat;}_29b._fire("onBegin",[_29c]);}_29b._fire("onPlay",[_29c]);_29b._cycle();return _29b;},pause:function(){var _29d=this;if(_29d._delayTimer){_29d._clearTimer();}_29d._stopTimer();if(!_29d._active){return _29d;}_29d._paused=true;_29d._fire("onPause",[_29d.curve.getValue(_29d._getStep())]);return _29d;},gotoPercent:function(_29e,_29f){var _2a0=this;_2a0._stopTimer();_2a0._active=_2a0._paused=true;_2a0._percent=_29e;if(_29f){_2a0.play();}return _2a0;},stop:function(_2a1){var _2a2=this;if(_2a2._delayTimer){_2a2._clearTimer();}if(!_2a2._timer){return _2a2;}_2a2._stopTimer();if(_2a1){_2a2._percent=1;}_2a2._fire("onStop",[_2a2.curve.getValue(_2a2._getStep())]);_2a2._active=_2a2._paused=false;return _2a2;},status:function(){if(this._active){return this._paused?"paused":"playing";}return "stopped";},_cycle:function(){var _2a3=this;if(_2a3._active){var curr=new Date().valueOf();var step=(curr-_2a3._startTime)/(_2a3.duration);if(step>=1){step=1;}_2a3._percent=step;if(_2a3.easing){step=_2a3.easing(step);}_2a3._fire("onAnimate",[_2a3.curve.getValue(step)]);if(_2a3._percent<1){_2a3._startTimer();}else{_2a3._active=false;if(_2a3.repeat>0){_2a3.repeat--;_2a3.play(null,true);}else{if(_2a3.repeat==-1){_2a3.play(null,true);}else{if(_2a3._startRepeatCount){_2a3.repeat=_2a3._startRepeatCount;_2a3._startRepeatCount=0;}}}_2a3._percent=0;_2a3._fire("onEnd",[_2a3.node]);!_2a3.repeat&&_2a3._stopTimer();}}return _2a3;},_clearTimer:function(){clearTimeout(this._delayTimer);delete this._delayTimer;}});var ctr=0,_2a4=null,_2a5={run:function(){}};d.extend(d.Animation,{_startTimer:function(){if(!this._timer){this._timer=d.connect(_2a5,"run",this,"_cycle");ctr++;}if(!_2a4){_2a4=setInterval(d.hitch(_2a5,"run"),this.rate);}},_stopTimer:function(){if(this._timer){d.disconnect(this._timer);this._timer=null;ctr--;}if(ctr<=0){clearInterval(_2a4);_2a4=null;ctr=0;}}});var _2a6=d.isIE?function(node){var ns=node.style;if(!ns.width.length&&d.style(node,"width")=="auto"){ns.width="auto";}}:function(){};dojo._fade=function(args){args.node=d.byId(args.node);var _2a7=_292({properties:{}},args),_2a8=(_2a7.properties.opacity={});_2a8.start=!("start" in _2a7)?function(){return +d.style(_2a7.node,"opacity")||0;}:_2a7.start;_2a8.end=_2a7.end;var anim=d.animateProperty(_2a7);d.connect(anim,"beforeBegin",d.partial(_2a6,_2a7.node));return anim;};dojo.fadeIn=function(args){return d._fade(_292({end:1},args));};dojo.fadeOut=function(args){return d._fade(_292({end:0},args));};dojo._defaultEasing=function(n){return 0.5+((Math.sin((n+1.5)*Math.PI))/2);};var _2a9=function(_2aa){this._properties=_2aa;for(var p in _2aa){var prop=_2aa[p];if(prop.start instanceof d.Color){prop.tempColor=new d.Color();}}};_2a9.prototype.getValue=function(r){var ret={};for(var p in this._properties){var prop=this._properties[p],_2ab=prop.start;if(_2ab instanceof d.Color){ret[p]=d.blendColors(_2ab,prop.end,r,prop.tempColor).toCss();}else{if(!d.isArray(_2ab)){ret[p]=((prop.end-_2ab)*r)+_2ab+(p!="opacity"?prop.units||"px":0);}}}return ret;};dojo.animateProperty=function(args){var n=args.node=d.byId(args.node);if(!args.easing){args.easing=d._defaultEasing;}var anim=new d.Animation(args);d.connect(anim,"beforeBegin",anim,function(){var pm={};for(var p in this.properties){if(p=="width"||p=="height"){this.node.display="block";}var prop=this.properties[p];if(d.isFunction(prop)){prop=prop(n);}prop=pm[p]=_292({},(d.isObject(prop)?prop:{end:prop}));if(d.isFunction(prop.start)){prop.start=prop.start(n);}if(d.isFunction(prop.end)){prop.end=prop.end(n);}var _2ac=(p.toLowerCase().indexOf("color")>=0);function _2ad(node,p){var v={height:node.offsetHeight,width:node.offsetWidth}[p];if(v!==undefined){return v;}v=d.style(node,p);return (p=="opacity")?+v:(_2ac?v:parseFloat(v));};if(!("end" in prop)){prop.end=_2ad(n,p);}else{if(!("start" in prop)){prop.start=_2ad(n,p);}}if(_2ac){prop.start=new d.Color(prop.start);prop.end=new d.Color(prop.end);}else{prop.start=(p=="opacity")?+prop.start:parseFloat(prop.start);}}this.curve=new _2a9(pm);});d.connect(anim,"onAnimate",d.hitch(d,"style",anim.node));return anim;};dojo.anim=function(node,_2ae,_2af,_2b0,_2b1,_2b2){return d.animateProperty({node:node,duration:_2af||d.Animation.prototype.duration,properties:_2ae,easing:_2b0,onEnd:_2b1}).play(_2b2||0);};})();}if(!dojo._hasResource["dojo._base.browser"]){dojo._hasResource["dojo._base.browser"]=true;dojo.provide("dojo._base.browser");dojo.forEach(dojo.config.require,function(i){dojo["require"](i);});}if(!dojo._hasResource["dojo._base"]){dojo._hasResource["dojo._base"]=true;dojo.provide("dojo._base");}if(dojo.isBrowser&&(document.readyState==="complete"||dojo.config.afterOnLoad)){window.setTimeout(dojo._loadInit,100);}})();
 
/*=========_base.js========*/
/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
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
var _b=dojo.create("div",{style:{position:"absolute",left:"0",top:"-100px",width:"30px",height:"1000em",borderWidth:"0",margin:"0",padding:"0",outline:"none",lineHeight:"1",overflow:"hidden"}},dojo.body());
for(var p in _a){
_b.style.fontSize=p;
_a[p]=Math.round(_b.offsetHeight*12/16)*16/12/1000;
}
dojo.body().removeChild(_b);
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
_e=dojo.create("div",{style:{position:"absolute",top:"-10000px",left:"0"}},dojo.body());
}
m=_e;
m.className="";
s=m.style;
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
},switchTo:function(_22){
var ns=dojox.gfx[_22];
if(ns){
dojo.forEach(["Group","Rect","Ellipse","Circle","Line","Polyline","Image","Text","Path","TextPath","Surface","createSurface"],function(_23){
dojox.gfx[_23]=ns[_23];
});
}
}});
}


/*=========matrix.js========*/
/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
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


/*=========shape.js========*/
/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.gfx.shape"]){
dojo._hasResource["dojox.gfx.shape"]=true;
dojo.provide("dojox.gfx.shape");
dojo.require("dojox.gfx._base");
dojo.declare("dojox.gfx.shape.Shape",null,{constructor:function(){
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
dojo.extend(dojox.gfx.shape.Shape,dojox.gfx.shape._eventsProcessing);
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
dojo.declare("dojox.gfx.shape.Rect",dojox.gfx.shape.Shape,{constructor:function(_1a){
this.shape=dojox.gfx.getDefault("Rect");
this.rawNode=_1a;
},getBoundingBox:function(){
return this.shape;
}});
dojo.declare("dojox.gfx.shape.Ellipse",dojox.gfx.shape.Shape,{constructor:function(_1b){
this.shape=dojox.gfx.getDefault("Ellipse");
this.rawNode=_1b;
},getBoundingBox:function(){
if(!this.bbox){
var _1c=this.shape;
this.bbox={x:_1c.cx-_1c.rx,y:_1c.cy-_1c.ry,width:2*_1c.rx,height:2*_1c.ry};
}
return this.bbox;
}});
dojo.declare("dojox.gfx.shape.Circle",dojox.gfx.shape.Shape,{constructor:function(_1d){
this.shape=dojox.gfx.getDefault("Circle");
this.rawNode=_1d;
},getBoundingBox:function(){
if(!this.bbox){
var _1e=this.shape;
this.bbox={x:_1e.cx-_1e.r,y:_1e.cy-_1e.r,width:2*_1e.r,height:2*_1e.r};
}
return this.bbox;
}});
dojo.declare("dojox.gfx.shape.Line",dojox.gfx.shape.Shape,{constructor:function(_1f){
this.shape=dojox.gfx.getDefault("Line");
this.rawNode=_1f;
},getBoundingBox:function(){
if(!this.bbox){
var _20=this.shape;
this.bbox={x:Math.min(_20.x1,_20.x2),y:Math.min(_20.y1,_20.y2),width:Math.abs(_20.x2-_20.x1),height:Math.abs(_20.y2-_20.y1)};
}
return this.bbox;
}});
dojo.declare("dojox.gfx.shape.Polyline",dojox.gfx.shape.Shape,{constructor:function(_21){
this.shape=dojox.gfx.getDefault("Polyline");
this.rawNode=_21;
},setShape:function(_22,_23){
if(_22&&_22 instanceof Array){
this.inherited(arguments,[{points:_22}]);
if(_23&&this.shape.points.length){
this.shape.points.push(this.shape.points[0]);
}
}else{
this.inherited(arguments,[_22]);
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
dojo.declare("dojox.gfx.shape.Image",dojox.gfx.shape.Shape,{constructor:function(_26){
this.shape=dojox.gfx.getDefault("Image");
this.rawNode=_26;
},getBoundingBox:function(){
return this.shape;
},setStroke:function(){
return this;
},setFill:function(){
return this;
}});
dojo.declare("dojox.gfx.shape.Text",dojox.gfx.shape.Shape,{constructor:function(_27){
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


/*=========path.js========*/
/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.gfx.path"]){
dojo._hasResource["dojox.gfx.path"]=true;
dojo.provide("dojox.gfx.path");
dojo.require("dojox.gfx.matrix");
dojo.require("dojox.gfx.shape");
dojo.declare("dojox.gfx.path.Path",dojox.gfx.shape.Shape,{constructor:function(_1){
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
return this.inherited(arguments);
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
this.inherited(arguments,[typeof _1e=="string"?{path:_1e}:_1e]);
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


/*=========grdient.js========*/
/*
Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
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

 

/*=========gfx.js========*/
/*
Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
Available via Academic Free License >= 2.1 OR the modified BSD license.
see: http://dojotoolkit.org/license for details
*/

/*
This is an optimized version of Dojo, built for deployment and not for
development. To get sources and documentation, please visit:

	http://dojotoolkit.org
*/

if(!dojo._hasResource["dojox.gfx.matrix"]){dojo._hasResource["dojox.gfx.matrix"]=true;dojo.provide("dojox.gfx.matrix");(function(){var m=dojox.gfx.matrix;var _1={};m._degToRad=function(_2){return _1[_2]||(_1[_2]=(Math.PI*_2/180));};m._radToDeg=function(_3){return _3/Math.PI*180;};m.Matrix2D=function(_4){if(_4){if(typeof _4=="number"){this.xx=this.yy=_4;}else{if(_4 instanceof Array){if(_4.length>0){var _5=m.normalize(_4[0]);for(var i=1;i<_4.length;++i){var l=_5,r=dojox.gfx.matrix.normalize(_4[i]);_5=new m.Matrix2D();_5.xx=l.xx*r.xx+l.xy*r.yx;_5.xy=l.xx*r.xy+l.xy*r.yy;_5.yx=l.yx*r.xx+l.yy*r.yx;_5.yy=l.yx*r.xy+l.yy*r.yy;_5.dx=l.xx*r.dx+l.xy*r.dy+l.dx;_5.dy=l.yx*r.dx+l.yy*r.dy+l.dy;}dojo.mixin(this,_5);}}else{dojo.mixin(this,_4);}}}};dojo.extend(m.Matrix2D,{xx:1,xy:0,yx:0,yy:1,dx:0,dy:0});dojo.mixin(m,{identity:new m.Matrix2D(),flipX:new m.Matrix2D({xx:-1}),flipY:new m.Matrix2D({yy:-1}),flipXY:new m.Matrix2D({xx:-1,yy:-1}),translate:function(a,b){if(arguments.length>1){return new m.Matrix2D({dx:a,dy:b});}return new m.Matrix2D({dx:a.x,dy:a.y});},scale:function(a,b){if(arguments.length>1){return new m.Matrix2D({xx:a,yy:b});}if(typeof a=="number"){return new m.Matrix2D({xx:a,yy:a});}return new m.Matrix2D({xx:a.x,yy:a.y});},rotate:function(_6){var c=Math.cos(_6);var s=Math.sin(_6);return new m.Matrix2D({xx:c,xy:-s,yx:s,yy:c});},rotateg:function(_7){return m.rotate(m._degToRad(_7));},skewX:function(_8){return new m.Matrix2D({xy:Math.tan(_8)});},skewXg:function(_9){return m.skewX(m._degToRad(_9));},skewY:function(_a){return new m.Matrix2D({yx:Math.tan(_a)});},skewYg:function(_b){return m.skewY(m._degToRad(_b));},reflect:function(a,b){if(arguments.length==1){b=a.y;a=a.x;}var a2=a*a,b2=b*b,n2=a2+b2,xy=2*a*b/n2;return new m.Matrix2D({xx:2*a2/n2-1,xy:xy,yx:xy,yy:2*b2/n2-1});},project:function(a,b){if(arguments.length==1){b=a.y;a=a.x;}var a2=a*a,b2=b*b,n2=a2+b2,xy=a*b/n2;return new m.Matrix2D({xx:a2/n2,xy:xy,yx:xy,yy:b2/n2});},normalize:function(_c){return (_c instanceof m.Matrix2D)?_c:new m.Matrix2D(_c);},clone:function(_d){var _e=new m.Matrix2D();for(var i in _d){if(typeof (_d[i])=="number"&&typeof (_e[i])=="number"&&_e[i]!=_d[i]){_e[i]=_d[i];}}return _e;},invert:function(_f){var M=m.normalize(_f),D=M.xx*M.yy-M.xy*M.yx,M=new m.Matrix2D({xx:M.yy/D,xy:-M.xy/D,yx:-M.yx/D,yy:M.xx/D,dx:(M.xy*M.dy-M.yy*M.dx)/D,dy:(M.yx*M.dx-M.xx*M.dy)/D});return M;},_multiplyPoint:function(_10,x,y){return {x:_10.xx*x+_10.xy*y+_10.dx,y:_10.yx*x+_10.yy*y+_10.dy};},multiplyPoint:function(_11,a,b){var M=m.normalize(_11);if(typeof a=="number"&&typeof b=="number"){return m._multiplyPoint(M,a,b);}return m._multiplyPoint(M,a.x,a.y);},multiply:function(_12){var M=m.normalize(_12);for(var i=1;i<arguments.length;++i){var l=M,r=m.normalize(arguments[i]);M=new m.Matrix2D();M.xx=l.xx*r.xx+l.xy*r.yx;M.xy=l.xx*r.xy+l.xy*r.yy;M.yx=l.yx*r.xx+l.yy*r.yx;M.yy=l.yx*r.xy+l.yy*r.yy;M.dx=l.xx*r.dx+l.xy*r.dy+l.dx;M.dy=l.yx*r.dx+l.yy*r.dy+l.dy;}return M;},_sandwich:function(_13,x,y){return m.multiply(m.translate(x,y),_13,m.translate(-x,-y));},scaleAt:function(a,b,c,d){switch(arguments.length){case 4:return m._sandwich(m.scale(a,b),c,d);case 3:if(typeof c=="number"){return m._sandwich(m.scale(a),b,c);}return m._sandwich(m.scale(a,b),c.x,c.y);}return m._sandwich(m.scale(a),b.x,b.y);},rotateAt:function(_14,a,b){if(arguments.length>2){return m._sandwich(m.rotate(_14),a,b);}return m._sandwich(m.rotate(_14),a.x,a.y);},rotategAt:function(_15,a,b){if(arguments.length>2){return m._sandwich(m.rotateg(_15),a,b);}return m._sandwich(m.rotateg(_15),a.x,a.y);},skewXAt:function(_16,a,b){if(arguments.length>2){return m._sandwich(m.skewX(_16),a,b);}return m._sandwich(m.skewX(_16),a.x,a.y);},skewXgAt:function(_17,a,b){if(arguments.length>2){return m._sandwich(m.skewXg(_17),a,b);}return m._sandwich(m.skewXg(_17),a.x,a.y);},skewYAt:function(_18,a,b){if(arguments.length>2){return m._sandwich(m.skewY(_18),a,b);}return m._sandwich(m.skewY(_18),a.x,a.y);},skewYgAt:function(_19,a,b){if(arguments.length>2){return m._sandwich(m.skewYg(_19),a,b);}return m._sandwich(m.skewYg(_19),a.x,a.y);}});})();dojox.gfx.Matrix2D=dojox.gfx.matrix.Matrix2D;}if(!dojo._hasResource["dojox.gfx._base"]){dojo._hasResource["dojox.gfx._base"]=true;dojo.provide("dojox.gfx._base");(function(){var g=dojox.gfx,b=g._base;g._hasClass=function(_1a,_1b){var cls=_1a.getAttribute("className");return cls&&(" "+cls+" ").indexOf(" "+_1b+" ")>=0;};g._addClass=function(_1c,_1d){var cls=_1c.getAttribute("className")||"";if(!cls||(" "+cls+" ").indexOf(" "+_1d+" ")<0){_1c.setAttribute("className",cls+(cls?" ":"")+_1d);}};g._removeClass=function(_1e,_1f){var cls=_1e.getAttribute("className");if(cls){_1e.setAttribute("className",cls.replace(new RegExp("(^|\\s+)"+_1f+"(\\s+|$)"),"$1$2"));}};b._getFontMeasurements=function(){var _20={"1em":0,"1ex":0,"100%":0,"12pt":0,"16px":0,"xx-small":0,"x-small":0,"small":0,"medium":0,"large":0,"x-large":0,"xx-large":0};if(dojo.isIE){dojo.doc.documentElement.style.fontSize="100%";}var div=dojo.create("div",{style:{position:"absolute",left:"0",top:"-100px",width:"30px",height:"1000em",borderWidth:"0",margin:"0",padding:"0",outline:"none",lineHeight:"1",overflow:"hidden"}},dojo.body());for(var p in _20){div.style.fontSize=p;_20[p]=Math.round(div.offsetHeight*12/16)*16/12/1000;}dojo.body().removeChild(div);return _20;};var _21=null;b._getCachedFontMeasurements=function(_22){if(_22||!_21){_21=b._getFontMeasurements();}return _21;};var _23=null,_24={};b._getTextBox=function(_25,_26,_27){var m,s,al=arguments.length;if(!_23){_23=dojo.create("div",{style:{position:"absolute",top:"-10000px",left:"0"}},dojo.body());}m=_23;m.className="";s=m.style;s.borderWidth="0";s.margin="0";s.padding="0";s.outline="0";if(al>1&&_26){for(var i in _26){if(i in _24){continue;}s[i]=_26[i];}}if(al>2&&_27){m.className=_27;}m.innerHTML=_25;if(m["getBoundingClientRect"]){var bcr=m.getBoundingClientRect();return {l:bcr.left,t:bcr.top,w:bcr.width||(bcr.right-bcr.left),h:bcr.height||(bcr.bottom-bcr.top)};}else{return dojo.marginBox(m);}};var _28=0;b._getUniqueId=function(){var id;do{id=dojo._scopeName+"Unique"+(++_28);}while(dojo.byId(id));return id;};})();dojo.mixin(dojox.gfx,{defaultPath:{type:"path",path:""},defaultPolyline:{type:"polyline",points:[]},defaultRect:{type:"rect",x:0,y:0,width:100,height:100,r:0},defaultEllipse:{type:"ellipse",cx:0,cy:0,rx:200,ry:100},defaultCircle:{type:"circle",cx:0,cy:0,r:100},defaultLine:{type:"line",x1:0,y1:0,x2:100,y2:100},defaultImage:{type:"image",x:0,y:0,width:0,height:0,src:""},defaultText:{type:"text",x:0,y:0,text:"",align:"start",decoration:"none",rotated:false,kerning:true},defaultTextPath:{type:"textpath",text:"",align:"start",decoration:"none",rotated:false,kerning:true},defaultStroke:{type:"stroke",color:"black",style:"solid",width:1,cap:"butt",join:4},defaultLinearGradient:{type:"linear",x1:0,y1:0,x2:100,y2:100,colors:[{offset:0,color:"black"},{offset:1,color:"white"}]},defaultRadialGradient:{type:"radial",cx:0,cy:0,r:100,colors:[{offset:0,color:"black"},{offset:1,color:"white"}]},defaultPattern:{type:"pattern",x:0,y:0,width:0,height:0,src:""},defaultFont:{type:"font",style:"normal",variant:"normal",weight:"normal",size:"10pt",family:"serif"},getDefault:(function(){var _29={};return function(_2a){var t=_29[_2a];if(t){return new t();}t=_29[_2a]=new Function;t.prototype=dojox.gfx["default"+_2a];return new t();};})(),normalizeColor:function(_2b){return (_2b instanceof dojo.Color)?_2b:new dojo.Color(_2b);},normalizeParameters:function(_2c,_2d){if(_2d){var _2e={};for(var x in _2c){if(x in _2d&&!(x in _2e)){_2c[x]=_2d[x];}}}return _2c;},makeParameters:function(_2f,_30){if(!_30){return dojo.delegate(_2f);}var _31={};for(var i in _2f){if(!(i in _31)){_31[i]=dojo.clone((i in _30)?_30[i]:_2f[i]);}}return _31;},formatNumber:function(x,_32){var val=x.toString();if(val.indexOf("e")>=0){val=x.toFixed(4);}else{var _33=val.indexOf(".");if(_33>=0&&val.length-_33>5){val=x.toFixed(4);}}if(x<0){return val;}return _32?" "+val:val;},makeFontString:function(_34){return _34.style+" "+_34.variant+" "+_34.weight+" "+_34.size+" "+_34.family;},splitFontString:function(str){var _35=dojox.gfx.getDefault("Font");var t=str.split(/\s+/);do{if(t.length<5){break;}_35.style=t[0];_35.variant=t[1];_35.weight=t[2];var i=t[3].indexOf("/");_35.size=i<0?t[3]:t[3].substring(0,i);var j=4;if(i<0){if(t[4]=="/"){j=6;}else{if(t[4].charAt(0)=="/"){j=5;}}}if(j<t.length){_35.family=t.slice(j).join(" ");}}while(false);return _35;},cm_in_pt:72/2.54,mm_in_pt:7.2/2.54,px_in_pt:function(){return dojox.gfx._base._getCachedFontMeasurements()["12pt"]/12;},pt2px:function(len){return len*dojox.gfx.px_in_pt();},px2pt:function(len){return len/dojox.gfx.px_in_pt();},normalizedLength:function(len){if(len.length==0){return 0;}if(len.length>2){var _36=dojox.gfx.px_in_pt();var val=parseFloat(len);switch(len.slice(-2)){case "px":return val;case "pt":return val*_36;case "in":return val*72*_36;case "pc":return val*12*_36;case "mm":return val*dojox.gfx.mm_in_pt*_36;case "cm":return val*dojox.gfx.cm_in_pt*_36;}}return parseFloat(len);},pathVmlRegExp:/([A-Za-z]+)|(\d+(\.\d+)?)|(\.\d+)|(-\d+(\.\d+)?)|(-\.\d+)/g,pathSvgRegExp:/([A-Za-z])|(\d+(\.\d+)?)|(\.\d+)|(-\d+(\.\d+)?)|(-\.\d+)/g,equalSources:function(a,b){return a&&b&&a==b;},switchTo:function(_37){var ns=dojox.gfx[_37];if(ns){dojo.forEach(["Group","Rect","Ellipse","Circle","Line","Polyline","Image","Text","Path","TextPath","Surface","createSurface"],function(_38){dojox.gfx[_38]=ns[_38];});}}});}if(!dojo._hasResource["dojox.gfx"]){dojo._hasResource["dojox.gfx"]=true;dojo.provide("dojox.gfx");dojo.loadInit(function(){var gfx=dojo.getObject("dojox.gfx",true),sl,_39,_3a;while(!gfx.renderer){if(dojo.config.forceGfxRenderer){dojox.gfx.renderer=dojo.config.forceGfxRenderer;break;}var _3b=(typeof dojo.config.gfxRenderer=="string"?dojo.config.gfxRenderer:"svg,vml,canvas,silverlight").split(",");for(var i=0;i<_3b.length;++i){switch(_3b[i]){case "svg":if("SVGAngle" in dojo.global){dojox.gfx.renderer="svg";}break;case "vml":if(dojo.isIE){dojox.gfx.renderer="vml";}break;case "silverlight":try{if(dojo.isIE){sl=new ActiveXObject("AgControl.AgControl");if(sl&&sl.IsVersionSupported("1.0")){_39=true;}}else{if(navigator.plugins["Silverlight Plug-In"]){_39=true;}}}catch(e){_39=false;}finally{sl=null;}if(_39){dojox.gfx.renderer="silverlight";}break;case "canvas":if(dojo.global.CanvasRenderingContext2D){dojox.gfx.renderer="canvas";}break;}if(gfx.renderer){break;}}break;}if(dojo.config.isDebug){}if(gfx[gfx.renderer]){gfx.switchTo(gfx.renderer);}else{gfx.loadAndSwitch=gfx.renderer;/*dojo["require"]("dojox.gfx."+gfx.renderer);*/}});}

/*=========arc.js========*/
/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.gfx.arc"]){
dojo._hasResource["dojox.gfx.arc"]=true;
dojo.provide("dojox.gfx.arc");
dojo.require("dojox.gfx.matrix");
(function(){
var m=dojox.gfx.matrix,_1=2*Math.PI,_2=Math.PI/4,_3=Math.PI/8,_4=_2+_3,_5=_6(_3);
function _6(_7){
var _8=Math.cos(_7),_9=Math.sin(_7),p2={x:_8+(4/3)*(1-_8),y:_9-(4/3)*_8*(1-_8)/_9};
return {s:{x:_8,y:-_9},c1:{x:p2.x,y:-p2.y},c2:p2,e:{x:_8,y:_9}};
};
dojox.gfx.arc={unitArcAsBezier:_6,curvePI4:_5,arcAsBezier:function(_a,rx,ry,_b,_c,_d,x,y){
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
_16+=_1;
}else{
if(_16>_1){
_16-=_1;
}
}
var _17=_3,_18=_5,_19=_d?_17:-_17,_1a=[];
for(var _1b=_16;_1b>0;_1b-=_2){
if(_1b<_4){
_17=_1b/2;
_18=_6(_17);
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
}};
})();
}

 
/*=========fx.js========*/
/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.gfx.fx"]){
dojo._hasResource["dojox.gfx.fx"]=true;
dojo.provide("dojox.gfx.fx");
dojo.require("dojox.gfx.matrix");
(function(){
var d=dojo,g=dojox.gfx,m=g.matrix;
function _1(_2,_3){
this.start=_2,this.end=_3;
};
_1.prototype.getValue=function(r){
return (this.end-this.start)*r+this.start;
};
function _4(_5,_6,_7){
this.start=_5,this.end=_6;
this.units=_7;
};
_4.prototype.getValue=function(r){
return (this.end-this.start)*r+this.start+this.units;
};
function _8(_9,_a){
this.start=_9,this.end=_a;
this.temp=new dojo.Color();
};
_8.prototype.getValue=function(r){
return d.blendColors(this.start,this.end,r,this.temp);
};
function _b(_c){
this.values=_c;
this.length=_c.length;
};
_b.prototype.getValue=function(r){
return this.values[Math.min(Math.floor(r*this.length),this.length-1)];
};
function _d(_e,_f){
this.values=_e;
this.def=_f?_f:{};
};
_d.prototype.getValue=function(r){
var ret=dojo.clone(this.def);
for(var i in this.values){
ret[i]=this.values[i].getValue(r);
}
return ret;
};
function _10(_11,_12){
this.stack=_11;
this.original=_12;
};
_10.prototype.getValue=function(r){
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
};
var _14=new d.Color(0,0,0,0);
function _15(_16,obj,_17,def){
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
function _1a(_1b,obj,_1c,def){
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
 

/*=========utils.js========*/
/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
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


/*=========svg.js========*/
/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
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
_1.useSvgWeb=(typeof window.svgweb!="undefined");
function _2(ns,_3){
if(dojo.doc.createElementNS){
return dojo.doc.createElementNS(ns,_3);
}else{
return dojo.doc.createElement(_3);
}
};
function _4(_5){
if(_1.useSvgWeb){
return dojo.doc.createTextNode(_5,true);
}else{
return dojo.doc.createTextNode(_5);
}
};
function _6(){
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
d.declare("dojox.gfx.svg.Shape",gs.Shape,{setFill:function(_8){
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
dojo.declare("dojox.gfx.svg.Group",_1.Shape,{constructor:function(){
gs.Container._init.call(this);
},setRawNode:function(_16){
this.rawNode=_16;
}});
_1.Group.nodeType="g";
dojo.declare("dojox.gfx.svg.Rect",[_1.Shape,gs.Rect],{setShape:function(_17){
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
_1.Rect.nodeType="rect";
dojo.declare("dojox.gfx.svg.Ellipse",[_1.Shape,gs.Ellipse],{});
_1.Ellipse.nodeType="ellipse";
dojo.declare("dojox.gfx.svg.Circle",[_1.Shape,gs.Circle],{});
_1.Circle.nodeType="circle";
dojo.declare("dojox.gfx.svg.Line",[_1.Shape,gs.Line],{});
_1.Line.nodeType="line";
dojo.declare("dojox.gfx.svg.Polyline",[_1.Shape,gs.Polyline],{setShape:function(_18,_19){
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
_1.Polyline.nodeType="polyline";
dojo.declare("dojox.gfx.svg.Image",[_1.Shape,gs.Image],{setShape:function(_1b){
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
_1.Image.nodeType="image";
dojo.declare("dojox.gfx.svg.Text",[_1.Shape,gs.Text],{setShape:function(_1d){
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
_1.Text.nodeType="text";
dojo.declare("dojox.gfx.svg.Path",[_1.Shape,g.path.Path],{_updateWithSegment:function(_23){
this.inherited(arguments);
if(typeof (this.shape.path)=="string"){
this.rawNode.setAttribute("d",this.shape.path);
}
},setShape:function(_24){
this.inherited(arguments);
if(this.shape.path){
this.rawNode.setAttribute("d",this.shape.path);
}else{
this.rawNode.removeAttribute("d");
}
return this;
}});
_1.Path.nodeType="path";
dojo.declare("dojox.gfx.svg.TextPath",[_1.Shape,g.path.TextPath],{_updateWithSegment:function(_25){
this.inherited(arguments);
this._setTextPath();
},setShape:function(_26){
this.inherited(arguments);
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
_1.TextPath.nodeType="text";
dojo.declare("dojox.gfx.svg.Surface",gs.Surface,{constructor:function(){
gs.Container._init.call(this);
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
_1.createSurface=function(_2c,_2d,_2e){
var s=new _1.Surface();
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
var _30={_setFont:function(){
var f=this.fontStyle;
this.rawNode.setAttribute("font-style",f.style);
this.rawNode.setAttribute("font-variant",f.variant);
this.rawNode.setAttribute("font-weight",f.weight);
this.rawNode.setAttribute("font-size",f.size);
this.rawNode.setAttribute("font-family",f.family);
}};
var C=gs.Container,_31={openBatch:function(){
this.fragment=_6();
},closeBatch:function(){
if(this.fragment){
this.rawNode.appendChild(this.fragment);
delete this.fragment;
}
},add:function(_32){
if(this!=_32.getParent()){
if(this.fragment){
this.fragment.appendChild(_32.rawNode);
}else{
this.rawNode.appendChild(_32.rawNode);
}
C.add.apply(this,arguments);
}
return this;
},remove:function(_33,_34){
if(this==_33.getParent()){
if(this.rawNode==_33.rawNode.parentNode){
this.rawNode.removeChild(_33.rawNode);
}
if(this.fragment&&this.fragment==_33.rawNode.parentNode){
this.fragment.removeChild(_33.rawNode);
}
C.remove.apply(this,arguments);
}
return this;
},clear:function(){
var r=this.rawNode;
while(r.lastChild){
r.removeChild(r.lastChild);
}
var _35=this.defNode;
if(_35){
while(_35.lastChild){
_35.removeChild(_35.lastChild);
}
r.appendChild(_35);
}
return C.clear.apply(this,arguments);
},_moveChildToFront:C._moveChildToFront,_moveChildToBack:C._moveChildToBack};
var _36={createObject:function(_37,_38){
if(!this.rawNode){
return null;
}
var _39=new _37(),_3a=_2(_1.xmlns.svg,_37.nodeType);
_39.setRawNode(_3a);
_39.setShape(_38);
this.add(_39);
return _39;
}};
d.extend(_1.Text,_30);
d.extend(_1.TextPath,_30);
d.extend(_1.Group,_31);
d.extend(_1.Group,gs.Creator);
d.extend(_1.Group,_36);
d.extend(_1.Surface,_31);
d.extend(_1.Surface,gs.Creator);
d.extend(_1.Surface,_36);
if(_1.useSvgWeb){
_1.createSurface=function(_3b,_3c,_3d){
var s=new _1.Surface();
if(!_3c||!_3d){
var pos=d.position(_3b);
_3c=_3c||pos.w;
_3d=_3d||pos.h;
}
_3b=d.byId(_3b);
var id=_3b.id?_3b.id+"_svgweb":g._base._getUniqueId();
var _3e=_2(_1.xmlns.svg,"svg");
_3e.id=id;
_3e.setAttribute("width",_3c);
_3e.setAttribute("height",_3d);
svgweb.appendChild(_3e,_3b);
_3e.addEventListener("SVGLoad",function(){
s.rawNode=this;
s.isLoaded=true;
var _3f=_2(_1.xmlns.svg,"defs");
s.rawNode.appendChild(_3f);
s.defNode=_3f;
if(s.onLoad){
s.onLoad(s);
}
},false);
s.isLoaded=false;
return s;
};
_1.Surface.extend({destroy:function(){
var _40=this.rawNode;
svgweb.removeChild(_40,_40.parentNode);
}});
var _41={connect:function(_42,_43,_44){
if(_42.substring(0,2)==="on"){
_42=_42.substring(2);
}
if(arguments.length==2){
_44=_43;
}else{
_44=d.hitch(_43,_44);
}
this.getEventSource().addEventListener(_42,_44,false);
return [this,_42,_44];
},disconnect:function(_45){
this.getEventSource().removeEventListener(_45[1],_45[2],false);
delete _45[0];
}};
dojo.extend(_1.Shape,_41);
dojo.extend(_1.Surface,_41);
}
if(g.loadAndSwitch==="svg"){
g.switchTo("svg");
delete g.loadAndSwitch;
}
})();
}


/*=========vml.js========*/
/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.gfx.vml"]){
dojo._hasResource["dojox.gfx.vml"] = true;
dojo.provide("dojox.gfx.vml");
//dojo.require("dojox.gfx._base");
//dojo.require("dojox.gfx.shape");
//dojo.require("dojox.gfx.path");
//dojo.require("dojox.gfx.arc");
//dojo.require("dojox.gfx.gradient");
(function() {
	var d = dojo, g = dojox.gfx, m = g.matrix, gs = g.shape, _1 = g.vml;  
	_1.xmlns = "urn:schemas-microsoft-com:vml";
	_1.text_alignment = {
		start : "left",
		middle : "center",
		end : "right"
	}; 
	_1._parseFloat = function(_2) {
		return _2.match(/^\d+f$/i) ? parseInt(_2) / 65536 : parseFloat(_2);
	};
	_1._bool = {
		"t" : 1,
		"true" : 1
	};
	d
			.declare(
					"dojox.gfx.vml.Shape",
					gs.Shape,
					{
						setFill : function(_3) {
							if (!_3) {
								this.fillStyle = null;
								this.rawNode.filled = "f";
								return this;
							}
							var i, f, fo, a, s;
							if (typeof _3 == "object" && "type" in _3) {
								switch (_3.type) {
								case "linear":
									var _4 = this._getRealMatrix(), _5 = this
											.getBoundingBox(), _6 = this._getRealBBox ? this
											._getRealBBox()
											: this.getTransformedBoundingBox();
									s = [];
									if (this.fillStyle !== _3) {
										this.fillStyle = g.makeParameters(
												g.defaultLinearGradient, _3);
									}
									f = g.gradient.project(_4, this.fillStyle,
											{
												x : _5.x,
												y : _5.y
											}, {
												x : _5.x + _5.width,
												y : _5.y + _5.height
											}, _6[0], _6[2]);
									a = f.colors;
									if (a[0].offset.toFixed(5) != "0.00000") {
										s.push("0 "
												+ g.normalizeColor(a[0].color)
														.toHex());
									}
									for (i = 0; i < a.length; ++i) {
										s.push(a[i].offset.toFixed(5)
												+ " "
												+ g.normalizeColor(a[i].color)
														.toHex());
									}
									i = a.length - 1;
									if (a[i].offset.toFixed(5) != "1.00000") {
										s.push("1 "
												+ g.normalizeColor(a[i].color)
														.toHex());
									}
									fo = this.rawNode.fill;
									fo.colors.value = s.join(";");
									fo.method = "sigma";
									fo.type = "gradient";
									fo.angle = (270 - m._radToDeg(f.angle)) % 360;
									fo.on = true;
									break;
								case "radial":
									f = g.makeParameters(
											g.defaultRadialGradient, _3);
									this.fillStyle = f;
									var l = parseFloat(this.rawNode.style.left), t = parseFloat(this.rawNode.style.top), w = parseFloat(this.rawNode.style.width), h = parseFloat(this.rawNode.style.height), c = isNaN(w) ? 1
											: 2 * f.r / w;
									a = [];
									if (f.colors[0].offset > 0) {
										a
												.push({
													offset : 1,
													color : g
															.normalizeColor(f.colors[0].color)
												});
									}
									d.forEach(f.colors, function(v, i) {
										a.push({
											offset : 1 - v.offset * c,
											color : g.normalizeColor(v.color)
										});
									});
									i = a.length - 1;
									while (i >= 0 && a[i].offset < 0) {
										--i;
									}
									if (i < a.length - 1) {
										var q = a[i], p = a[i + 1];
										p.color = d
												.blendColors(
														q.color,
														p.color,
														q.offset
																/ (q.offset - p.offset));
										p.offset = 0;
										while (a.length - i > 2) {
											a.pop();
										}
									}
									i = a.length - 1, s = [];
									if (a[i].offset > 0) {
										s.push("0 " + a[i].color.toHex());
									}
									for (; i >= 0; --i) {
										s.push(a[i].offset.toFixed(5) + " "
												+ a[i].color.toHex());
									}
									fo = this.rawNode.fill;
									fo.colors.value = s.join(";");
									fo.method = "sigma";
									fo.type = "gradientradial";
									if (isNaN(w) || isNaN(h) || isNaN(l)
											|| isNaN(t)) {
										fo.focusposition = "0.5 0.5";
									} else {
										fo.focusposition = ((f.cx - l) / w)
												.toFixed(5)
												+ " "
												+ ((f.cy - t) / h).toFixed(5);
									}
									fo.focussize = "0 0";
									fo.on = true;
									break;
								case "pattern":
									f = g.makeParameters(g.defaultPattern, _3);
									this.fillStyle = f;
									fo = this.rawNode.fill;
									fo.type = "tile";
									fo.src = f.src;
									if (f.width && f.height) {
										fo.size.x = g.px2pt(f.width);
										fo.size.y = g.px2pt(f.height);
									}
									fo.alignShape = "f";
									fo.position.x = 0;
									fo.position.y = 0;
									fo.origin.x = f.width ? f.x / f.width : 0;
									fo.origin.y = f.height ? f.y / f.height : 0;
									fo.on = true;
									break;
								}
								this.rawNode.fill.opacity = 1;
								return this;
							}
							this.fillStyle = g.normalizeColor(_3);
							fo = this.rawNode.fill;
							if (!fo) {
								fo = this.rawNode.ownerDocument
										.createElement("v:fill");
							}
							fo.method = "any";
							fo.type = "solid";
							fo.opacity = this.fillStyle.a;
							var _7 = this.rawNode.filters["DXImageTransform.Microsoft.Alpha"];
							if (_7) {
								_7.opacity = Math.round(this.fillStyle.a * 100);
							}
							this.rawNode.fillcolor = this.fillStyle.toHex();
							this.rawNode.filled = true;
							return this;
						},
						setStroke : function(_8) {
							if (!_8) {
								this.strokeStyle = null;
								this.rawNode.stroked = "f";
								return this;
							}
							if (typeof _8 == "string" || d.isArray(_8)
									|| _8 instanceof d.Color) {
								_8 = {
									color : _8
								};
							}
							var s = this.strokeStyle = g.makeParameters(
									g.defaultStroke, _8);
							s.color = g.normalizeColor(s.color);
							var rn = this.rawNode;
							rn.stroked = true;
							rn.strokecolor = s.color.toCss();
							rn.strokeweight = s.width + "px";
							if (rn.stroke) {
								rn.stroke.opacity = s.color.a;
								rn.stroke.endcap = this._translate(
										this._capMap, s.cap);
								if (typeof s.join == "number") {
									rn.stroke.joinstyle = "miter";
									rn.stroke.miterlimit = s.join;
								} else {
									rn.stroke.joinstyle = s.join;
								}
								rn.stroke.dashstyle = s.style == "none" ? "Solid"
										: s.style;
							}
							return this;
						},
						_capMap : {
							butt : "flat"
						},
						_capMapReversed : {
							flat : "butt"
						},
						_translate : function(_9, _a) {
							return (_a in _9) ? _9[_a] : _a;
						},
						_applyTransform : function() {
							var _b = this._getRealMatrix();
							if (_b) {
								var _c = this.rawNode.skew;
								if (typeof _c == "undefined") {
									for ( var i = 0; i < this.rawNode.childNodes.length; ++i) {
										if (this.rawNode.childNodes[i].tagName == "skew") {
											_c = this.rawNode.childNodes[i];
											break;
										}
									}
								}
								if (_c) {
									_c.on = "f";
									var mt = _b.xx.toFixed(8) + " "
											+ _b.xy.toFixed(8) + " "
											+ _b.yx.toFixed(8) + " "
											+ _b.yy.toFixed(8) + " 0 0", _d = Math
											.floor(_b.dx).toFixed()
											+ "px "
											+ Math.floor(_b.dy).toFixed()
											+ "px", s = this.rawNode.style, l = parseFloat(s.left), t = parseFloat(s.top), w = parseFloat(s.width), h = parseFloat(s.height);
									if (isNaN(l)) {
										l = 0;
									}
									if (isNaN(t)) {
										t = 0;
									}
									if (isNaN(w) || !w) {
										w = 1;
									}
									if (isNaN(h) || !h) {
										h = 1;
									}
									var _e = (-l / w - 0.5).toFixed(8) + " "
											+ (-t / h - 0.5).toFixed(8);
									_c.matrix = mt;
									_c.origin = _e;
									_c.offset = _d;
									_c.on = true;
								}
							}
							if (this.fillStyle
									&& this.fillStyle.type == "linear") {
								this.setFill(this.fillStyle);
							}
							return this;
						},
						_setDimensions : function(_f, _10) {
							return this;
						},
						setRawNode : function(_11) {
							_11.stroked = "f";
							_11.filled = "f";
							this.rawNode = _11;
						},
						_moveToFront : function() {
							this.rawNode.parentNode.appendChild(this.rawNode);
							return this;
						},
						_moveToBack : function() {
							var r = this.rawNode, p = r.parentNode, n = p.firstChild;
							p.insertBefore(r, n);
							if (n.tagName == "rect") {
								n.swapNode(r);
							}
							return this;
						},
						_getRealMatrix : function() {
							return this.parentMatrix ? new g.Matrix2D([
									this.parentMatrix, this.matrix ])
									: this.matrix;
						}
					});
	dojo.declare("dojox.gfx.vml.Group", _1.Shape, {
		constructor : function() {
			gs.Container._init.call(this);
		},
		_applyTransform : function() {
			var _12 = this._getRealMatrix();
			for ( var i = 0; i < this.children.length; ++i) {
				this.children[i]._updateParentMatrix(_12);
			}
			return this;
		},
		_setDimensions : function(_13, _14) {
			var r = this.rawNode, rs = r.style, bs = this.bgNode.style;
			rs.width = _13;
			rs.height = _14;
			r.coordsize = _13 + " " + _14;
			bs.width = _13;
			bs.height = _14;
			for ( var i = 0; i < this.children.length; ++i) {
				this.children[i]._setDimensions(_13, _14);
			}
			return this;
		}
	});
	_1.Group.nodeType = "group";
	dojo.declare("dojox.gfx.vml.Rect", [ _1.Shape, gs.Rect ],
			{
				setShape : function(_15) {
					var _16 = this.shape = g.makeParameters(this.shape, _15);
					this.bbox = null;
					var r = Math.min(
							1,
							(_16.r / Math.min(parseFloat(_16.width),
									parseFloat(_16.height)))).toFixed(8);
					var _17 = this.rawNode.parentNode, _18 = null;
					if (_17) {
						if (_17.lastChild !== this.rawNode) {
							for ( var i = 0; i < _17.childNodes.length; ++i) {
								if (_17.childNodes[i] === this.rawNode) {
									_18 = _17.childNodes[i + 1];
									break;
								}
							}
						}
						_17.removeChild(this.rawNode);
					}
					if (d.isIE > 7) {
						var _19 = this.rawNode.ownerDocument
								.createElement("v:roundrect");
						_19.arcsize = r;
						_19.style.display = "inline-block";
						this.rawNode = _19;
					} else {
						this.rawNode.arcsize = r;
					}
					if (_17) {
						if (_18) {
							_17.insertBefore(this.rawNode, _18);
						} else {
							_17.appendChild(this.rawNode);
						}
					}
					var _1a = this.rawNode.style;
					_1a.left = _16.x.toFixed();
					_1a.top = _16.y.toFixed();
					_1a.width = (typeof _16.width == "string" && _16.width
							.indexOf("%") >= 0) ? _16.width : _16.width
							.toFixed();
					_1a.height = (typeof _16.width == "string" && _16.height
							.indexOf("%") >= 0) ? _16.height : _16.height
							.toFixed();
					return this.setTransform(this.matrix).setFill(
							this.fillStyle).setStroke(this.strokeStyle);
				}
			});
	_1.Rect.nodeType = "roundrect";
	dojo.declare("dojox.gfx.vml.Ellipse", [ _1.Shape, gs.Ellipse ], {
		setShape : function(_1b) {
			var _1c = this.shape = g.makeParameters(this.shape, _1b);
			this.bbox = null;
			var _1d = this.rawNode.style;
			_1d.left = (_1c.cx - _1c.rx).toFixed();
			_1d.top = (_1c.cy - _1c.ry).toFixed();
			_1d.width = (_1c.rx * 2).toFixed();
			_1d.height = (_1c.ry * 2).toFixed();
			return this.setTransform(this.matrix);
		}
	});
	_1.Ellipse.nodeType = "oval";
	dojo.declare("dojox.gfx.vml.Circle", [ _1.Shape, gs.Circle ], {
		setShape : function(_1e) {
			var _1f = this.shape = g.makeParameters(this.shape, _1e);
			this.bbox = null;
			var _20 = this.rawNode.style;
			_20.left = (_1f.cx - _1f.r).toFixed();
			_20.top = (_1f.cy - _1f.r).toFixed();
			_20.width = (_1f.r * 2).toFixed();
			_20.height = (_1f.r * 2).toFixed();
			return this;
		}
	});
	_1.Circle.nodeType = "oval";
	dojo.declare("dojox.gfx.vml.Line", [ _1.Shape, gs.Line ], {
		constructor : function(_21) {
			if (_21) {
				_21.setAttribute("dojoGfxType", "line");
			}
		},
		setShape : function(_22) {
			var _23 = this.shape = g.makeParameters(this.shape, _22);
			this.bbox = null;
			this.rawNode.path.v = "m" + _23.x1.toFixed() + " "
					+ _23.y1.toFixed() + "l" + _23.x2.toFixed() + " "
					+ _23.y2.toFixed() + "e";
			return this.setTransform(this.matrix);
		}
	});
	_1.Line.nodeType = "shape";
	dojo.declare("dojox.gfx.vml.Polyline", [ _1.Shape, gs.Polyline ], {
		constructor : function(_24) {
			if (_24) {
				_24.setAttribute("dojoGfxType", "polyline");
			}
		},
		setShape : function(_25, _26) {
			if (_25 && _25 instanceof Array) {
				this.shape = g.makeParameters(this.shape, {
					points : _25
				});
				if (_26 && this.shape.points.length) {
					this.shape.points.push(this.shape.points[0]);
				}
			} else {
				this.shape = g.makeParameters(this.shape, _25);
			}
			this.bbox = null;
			this._normalizePoints();
			var _27 = [], p = this.shape.points;
			if (p.length > 0) {
				_27.push("m");
				_27.push(p[0].x.toFixed(), p[0].y.toFixed());
				if (p.length > 1) {
					_27.push("l");
					for ( var i = 1; i < p.length; ++i) {
						_27.push(p[i].x.toFixed(), p[i].y.toFixed());
					}
				}
			}
			_27.push("e");
			this.rawNode.path.v = _27.join(" ");
			return this.setTransform(this.matrix);
		}
	});
	_1.Polyline.nodeType = "shape";
	dojo
			.declare(
					"dojox.gfx.vml.Image",
					[ _1.Shape, gs.Image ],
					{
						setShape : function(_28) {
							var _29 = this.shape = g.makeParameters(this.shape,
									_28);
							this.bbox = null;
							this.rawNode.firstChild.src = _29.src;
							return this.setTransform(this.matrix);
						},
						_applyTransform : function() {
							var _2a = this._getRealMatrix(), _2b = this.rawNode, s = _2b.style, _2c = this.shape;
							if (_2a) {
								_2a = m.multiply(_2a, {
									dx : _2c.x,
									dy : _2c.y
								});
							} else {
								_2a = m.normalize({
									dx : _2c.x,
									dy : _2c.y
								});
							}
							if (_2a.xy == 0 && _2a.yx == 0 && _2a.xx > 0
									&& _2a.yy > 0) {
								s.filter = "";
								s.width = Math.floor(_2a.xx * _2c.width);
								s.height = Math.floor(_2a.yy * _2c.height);
								s.left = Math.floor(_2a.dx);
								s.top = Math.floor(_2a.dy);
							} else {
								var ps = _2b.parentNode.style;
								s.left = "0px";
								s.top = "0px";
								s.width = ps.width;
								s.height = ps.height;
								_2a = m.multiply(_2a, {
									xx : _2c.width / parseInt(s.width),
									yy : _2c.height / parseInt(s.height)
								});
								var f = _2b.filters["DXImageTransform.Microsoft.Matrix"];
								if (f) {
									f.M11 = _2a.xx;
									f.M12 = _2a.xy;
									f.M21 = _2a.yx;
									f.M22 = _2a.yy;
									f.Dx = _2a.dx;
									f.Dy = _2a.dy;
								} else {
									s.filter = "progid:DXImageTransform.Microsoft.Matrix(M11="
											+ _2a.xx
											+ ", M12="
											+ _2a.xy
											+ ", M21="
											+ _2a.yx
											+ ", M22="
											+ _2a.yy
											+ ", Dx="
											+ _2a.dx
											+ ", Dy=" + _2a.dy + ")";
								}
							}
							return this;
						},
						_setDimensions : function(_2d, _2e) {
							var r = this.rawNode, f = r.filters["DXImageTransform.Microsoft.Matrix"];
							if (f) {
								var s = r.style;
								s.width = _2d;
								s.height = _2e;
								return this._applyTransform();
							}
							return this;
						}
					});
	_1.Image.nodeType = "rect";
	dojo
			.declare(
					"dojox.gfx.vml.Text",
					[ _1.Shape, gs.Text ],
					{
						constructor : function(_2f) {
							if (_2f) {
								_2f.setAttribute("dojoGfxType", "text");
							}
							this.fontStyle = null;
						},
						_alignment : {
							start : "left",
							middle : "center",
							end : "right"
						},
						setShape : function(_30) {
							this.shape = g.makeParameters(this.shape, _30);
							this.bbox = null;
							var r = this.rawNode, s = this.shape, x = s.x, y = s.y
									.toFixed(), _31;
							switch (s.align) {
							case "middle":
								x -= 5;
								break;
							case "end":
								x -= 10;
								break;
							}
							_31 = "m" + x.toFixed() + "," + y + "l"
									+ (x + 10).toFixed() + "," + y + "e";
							var p = null, t = null, c = r.childNodes;
							for ( var i = 0; i < c.length; ++i) {
								var tag = c[i].tagName;
								if (tag == "path") {
									p = c[i];
									if (t) {
										break;
									}
								} else {
									if (tag == "textpath") {
										t = c[i];
										if (p) {
											break;
										}
									}
								}
							}
							if (!p) {
								p = r.ownerDocument.createElement("v:path");
								r.appendChild(p);
							}
							if (!t) {
								t = r.ownerDocument.createElement("v:textpath");
								r.appendChild(t);
							}
							p.v = _31;
							p.textPathOk = true;
							t.on = true;
							var a = _1.text_alignment[s.align];
							t.style["v-text-align"] = a ? a : "left";
							t.style["text-decoration"] = s.decoration;
							t.style["v-rotate-letters"] = s.rotated;
							t.style["v-text-kern"] = s.kerning;
							t.string = s.text;
							return this.setTransform(this.matrix);
						},
						_setFont : function() {
							var f = this.fontStyle, c = this.rawNode.childNodes;
							for ( var i = 0; i < c.length; ++i) {
								if (c[i].tagName == "textpath") {
									c[i].style.font = g.makeFontString(f);
									break;
								}
							}
							this.setTransform(this.matrix);
						},
						_getRealMatrix : function() {
							var _32 = this.inherited(arguments);
							if (_32) {
								_32 = m
										.multiply(
												_32,
												{
													dy : -g
															.normalizedLength(this.fontStyle ? this.fontStyle.size
																	: "10pt") * 0.35
												});
							}
							return _32;
						},
						getTextWidth : function() {
							var _33 = this.rawNode, _34 = _33.style.display;
							_33.style.display = "inline";
							var _35 = g
									.pt2px(parseFloat(_33.currentStyle.width));
							_33.style.display = _34;
							return _35;
						}
					});
	_1.Text.nodeType = "shape";
	dojo
			.declare(
					"dojox.gfx.vml.Path",
					[ _1.Shape, g.path.Path ],
					{
						constructor : function(_36) {
							if (_36 && !_36.getAttribute("dojoGfxType")) {
								_36.setAttribute("dojoGfxType", "path");
							}
							this.vmlPath = "";
							this.lastControl = {};
						},
						_updateWithSegment : function(_37) {
							var _38 = d.clone(this.last);
							this.inherited(arguments);
							if (arguments.length > 1) {
								return;
							}
							var _39 = this[this.renderers[_37.action]]
									(_37, _38);
							if (typeof this.vmlPath == "string") {
								this.vmlPath += _39.join("");
								this.rawNode.path.v = this.vmlPath + " r0,0 e";
							} else {
								Array.prototype.push.apply(this.vmlPath, _39);
							}
						},
						setShape : function(_3a) {
							this.vmlPath = [];
							this.lastControl.type = "";
							this.inherited(arguments);
							this.vmlPath = this.vmlPath.join("");
							this.rawNode.path.v = this.vmlPath + " r0,0 e";
							return this;
						},
						_pathVmlToSvgMap : {
							m : "M",
							l : "L",
							t : "m",
							r : "l",
							c : "C",
							v : "c",
							qb : "Q",
							x : "z",
							e : ""
						},
						renderers : {
							M : "_moveToA",
							m : "_moveToR",
							L : "_lineToA",
							l : "_lineToR",
							H : "_hLineToA",
							h : "_hLineToR",
							V : "_vLineToA",
							v : "_vLineToR",
							C : "_curveToA",
							c : "_curveToR",
							S : "_smoothCurveToA",
							s : "_smoothCurveToR",
							Q : "_qCurveToA",
							q : "_qCurveToR",
							T : "_qSmoothCurveToA",
							t : "_qSmoothCurveToR",
							A : "_arcTo",
							a : "_arcTo",
							Z : "_closePath",
							z : "_closePath"
						},
						_addArgs : function(_3b, _3c, _3d, _3e) {
							var n = _3c instanceof Array ? _3c : _3c.args;
							for ( var i = _3d; i < _3e; ++i) {
								_3b.push(" ", n[i].toFixed());
							}
						},
						_adjustRelCrd : function(_3f, _40, _41) {
							var n = _40 instanceof Array ? _40 : _40.args, l = n.length, _42 = new Array(
									l), i = 0, x = _3f.x, y = _3f.y;
							if (typeof x != "number") {
								_42[0] = x = n[0];
								_42[1] = y = n[1];
								i = 2;
							}
							if (typeof _41 == "number" && _41 != 2) {
								var j = _41;
								while (j <= l) {
									for (; i < j; i += 2) {
										_42[i] = x + n[i];
										_42[i + 1] = y + n[i + 1];
									}
									x = _42[j - 2];
									y = _42[j - 1];
									j += _41;
								}
							} else {
								for (; i < l; i += 2) {
									_42[i] = (x += n[i]);
									_42[i + 1] = (y += n[i + 1]);
								}
							}
							return _42;
						},
						_adjustRelPos : function(_43, _44) {
							var n = _44 instanceof Array ? _44 : _44.args, l = n.length, _45 = new Array(
									l);
							for ( var i = 0; i < l; ++i) {
								_45[i] = (_43 += n[i]);
							}
							return _45;
						},
						_moveToA : function(_46) {
							var p = [ " m" ], n = _46 instanceof Array ? _46
									: _46.args, l = n.length;
							this._addArgs(p, n, 0, 2);
							if (l > 2) {
								p.push(" l");
								this._addArgs(p, n, 2, l);
							}
							this.lastControl.type = "";
							return p;
						},
						_moveToR : function(_47, _48) {
							return this._moveToA(this._adjustRelCrd(_48, _47));
						},
						_lineToA : function(_49) {
							var p = [ " l" ], n = _49 instanceof Array ? _49
									: _49.args;
							this._addArgs(p, n, 0, n.length);
							this.lastControl.type = "";
							return p;
						},
						_lineToR : function(_4a, _4b) {
							return this._lineToA(this._adjustRelCrd(_4b, _4a));
						},
						_hLineToA : function(_4c, _4d) {
							var p = [ " l" ], y = " " + _4d.y.toFixed(), n = _4c instanceof Array ? _4c
									: _4c.args, l = n.length;
							for ( var i = 0; i < l; ++i) {
								p.push(" ", n[i].toFixed(), y);
							}
							this.lastControl.type = "";
							return p;
						},
						_hLineToR : function(_4e, _4f) {
							return this._hLineToA(this
									._adjustRelPos(_4f.x, _4e), _4f);
						},
						_vLineToA : function(_50, _51) {
							var p = [ " l" ], x = " " + _51.x.toFixed(), n = _50 instanceof Array ? _50
									: _50.args, l = n.length;
							for ( var i = 0; i < l; ++i) {
								p.push(x, " ", n[i].toFixed());
							}
							this.lastControl.type = "";
							return p;
						},
						_vLineToR : function(_52, _53) {
							return this._vLineToA(this
									._adjustRelPos(_53.y, _52), _53);
						},
						_curveToA : function(_54) {
							var p = [], n = _54 instanceof Array ? _54
									: _54.args, l = n.length, lc = this.lastControl;
							for ( var i = 0; i < l; i += 6) {
								p.push(" c");
								this._addArgs(p, n, i, i + 6);
							}
							lc.x = n[l - 4];
							lc.y = n[l - 3];
							lc.type = "C";
							return p;
						},
						_curveToR : function(_55, _56) {
							return this._curveToA(this._adjustRelCrd(_56, _55,
									6));
						},
						_smoothCurveToA : function(_57, _58) {
							var p = [], n = _57 instanceof Array ? _57
									: _57.args, l = n.length, lc = this.lastControl, i = 0;
							if (lc.type != "C") {
								p.push(" c");
								this._addArgs(p, [ _58.x, _58.y ], 0, 2);
								this._addArgs(p, n, 0, 4);
								lc.x = n[0];
								lc.y = n[1];
								lc.type = "C";
								i = 4;
							}
							for (; i < l; i += 4) {
								p.push(" c");
								this._addArgs(p, [ 2 * _58.x - lc.x,
										2 * _58.y - lc.y ], 0, 2);
								this._addArgs(p, n, i, i + 4);
								lc.x = n[i];
								lc.y = n[i + 1];
							}
							return p;
						},
						_smoothCurveToR : function(_59, _5a) {
							return this._smoothCurveToA(this._adjustRelCrd(_5a,
									_59, 4), _5a);
						},
						_qCurveToA : function(_5b) {
							var p = [], n = _5b instanceof Array ? _5b
									: _5b.args, l = n.length, lc = this.lastControl;
							for ( var i = 0; i < l; i += 4) {
								p.push(" qb");
								this._addArgs(p, n, i, i + 4);
							}
							lc.x = n[l - 4];
							lc.y = n[l - 3];
							lc.type = "Q";
							return p;
						},
						_qCurveToR : function(_5c, _5d) {
							return this._qCurveToA(this._adjustRelCrd(_5d, _5c,
									4));
						},
						_qSmoothCurveToA : function(_5e, _5f) {
							var p = [], n = _5e instanceof Array ? _5e
									: _5e.args, l = n.length, lc = this.lastControl, i = 0;
							if (lc.type != "Q") {
								p.push(" qb");
								this._addArgs(p,
										[ lc.x = _5f.x, lc.y = _5f.y ], 0, 2);
								lc.type = "Q";
								this._addArgs(p, n, 0, 2);
								i = 2;
							}
							for (; i < l; i += 2) {
								p.push(" qb");
								this._addArgs(p, [ lc.x = 2 * _5f.x - lc.x,
										lc.y = 2 * _5f.y - lc.y ], 0, 2);
								this._addArgs(p, n, i, i + 2);
							}
							return p;
						},
						_qSmoothCurveToR : function(_60, _61) {
							return this._qSmoothCurveToA(this._adjustRelCrd(
									_61, _60, 2), _61);
						},
						_arcTo : function(_62, _63) {
							var p = [], n = _62.args, l = n.length, _64 = _62.action == "a";
							for ( var i = 0; i < l; i += 7) {
								var x1 = n[i + 5], y1 = n[i + 6];
								if (_64) {
									x1 += _63.x;
									y1 += _63.y;
								}
								var _65 = g.arc.arcAsBezier(_63, n[i],
										n[i + 1], n[i + 2], n[i + 3] ? 1 : 0,
										n[i + 4] ? 1 : 0, x1, y1);
								for ( var j = 0; j < _65.length; ++j) {
									p.push(" c");
									var t = _65[j];
									this._addArgs(p, t, 0, t.length);
									this._updateBBox(t[0], t[1]);
									this._updateBBox(t[2], t[3]);
									this._updateBBox(t[4], t[5]);
								}
								_63.x = x1;
								_63.y = y1;
							}
							this.lastControl.type = "";
							return p;
						},
						_closePath : function() {
							this.lastControl.type = "";
							return [ "x" ];
						}
					});
	_1.Path.nodeType = "shape";
	dojo
			.declare(
					"dojox.gfx.vml.TextPath",
					[ _1.Path, g.path.TextPath ],
					{
						constructor : function(_66) {
							if (_66) {
								_66.setAttribute("dojoGfxType", "textpath");
							}
							this.fontStyle = null;
							if (!("text" in this)) {
								this.text = d.clone(g.defaultTextPath);
							}
							if (!("fontStyle" in this)) {
								this.fontStyle = d.clone(g.defaultFont);
							}
						},
						setText : function(_67) {
							this.text = g.makeParameters(this.text,
									typeof _67 == "string" ? {
										text : _67
									} : _67);
							this._setText();
							return this;
						},
						setFont : function(_68) {
							this.fontStyle = typeof _68 == "string" ? g
									.splitFontString(_68) : g.makeParameters(
									g.defaultFont, _68);
							this._setFont();
							return this;
						},
						_setText : function() {
							this.bbox = null;
							var r = this.rawNode, s = this.text, p = null, t = null, c = r.childNodes;
							for ( var i = 0; i < c.length; ++i) {
								var tag = c[i].tagName;
								if (tag == "path") {
									p = c[i];
									if (t) {
										break;
									}
								} else {
									if (tag == "textpath") {
										t = c[i];
										if (p) {
											break;
										}
									}
								}
							}
							if (!p) {
								p = this.rawNode.ownerDocument
										.createElement("v:path");
								r.appendChild(p);
							}
							if (!t) {
								t = this.rawNode.ownerDocument
										.createElement("v:textpath");
								r.appendChild(t);
							}
							p.textPathOk = true;
							t.on = true;
							var a = _1.text_alignment[s.align];
							t.style["v-text-align"] = a ? a : "left";
							t.style["text-decoration"] = s.decoration;
							t.style["v-rotate-letters"] = s.rotated;
							t.style["v-text-kern"] = s.kerning;
							t.string = s.text;
						},
						_setFont : function() {
							var f = this.fontStyle, c = this.rawNode.childNodes;
							for ( var i = 0; i < c.length; ++i) {
								if (c[i].tagName == "textpath") {
									c[i].style.font = g.makeFontString(f);
									break;
								}
							}
						}
					});
	_1.TextPath.nodeType = "shape";
	dojo
			.declare(
					"dojox.gfx.vml.Surface",
					gs.Surface,
					{
						constructor : function() {
							gs.Container._init.call(this);
						},
						setDimensions : function(_69, _6a) {
							this.width = g.normalizedLength(_69);
							this.height = g.normalizedLength(_6a);
							if (!this.rawNode) {
								return this;
							}
							var cs = this.clipNode.style, r = this.rawNode, rs = r.style, bs = this.bgNode.style, ps = this._parent.style, i;
							ps.width = _69;
							ps.height = _6a;
							cs.width = _69;
							cs.height = _6a;
							cs.clip = "rect(0px " + _69 + "px " + _6a
									+ "px 0px)";
							rs.width = _69;
							rs.height = _6a;
							r.coordsize = _69 + " " + _6a;
							bs.width = _69;
							bs.height = _6a;
							for (i = 0; i < this.children.length; ++i) {
								this.children[i]._setDimensions(_69, _6a);
							}
							return this;
						},
						getDimensions : function() {
							var t = this.rawNode ? {
								width : g
										.normalizedLength(this.rawNode.style.width),
								height : g
										.normalizedLength(this.rawNode.style.height)
							}
									: null;
							if (t.width <= 0) {
								t.width = this.width;
							}
							if (t.height <= 0) {
								t.height = this.height;
							}
							return t;
						}
					});
	_1.createSurface = function(_6b, _6c, _6d) {
		if (!_6c && !_6d) {
			var pos = d.position(_6b);
			_6c = _6c || pos.w;
			_6d = _6d || pos.h;
		}
		if (typeof _6c == "number") {
			_6c = _6c + "px";
		}
		if (typeof _6d == "number") {
			_6d = _6d + "px";
		}
		var s = new _1.Surface(), p = d.byId(_6b), c = s.clipNode = p.ownerDocument
				.createElement("div"), r = s.rawNode = p.ownerDocument
				.createElement("v:group"), cs = c.style, rs = r.style;
		if (d.isIE > 7) {
			rs.display = "inline-block";
		}
		s._parent = p;
		s._nodes.push(c);
		p.style.width = _6c;
		p.style.height = _6d;
		cs.position = "absolute";
		cs.width = _6c;
		cs.height = _6d;
		cs.clip = "rect(0px " + _6c + " " + _6d + " 0px)";
		rs.position = "absolute";
		rs.width = _6c;
		rs.height = _6d;
		r.coordsize = (_6c === "100%" ? _6c : parseFloat(_6c)) + " "
				+ (_6d === "100%" ? _6d : parseFloat(_6d));
		r.coordorigin = "0 0";
		var b = s.bgNode = r.ownerDocument.createElement("v:rect"), bs = b.style;
		bs.left = bs.top = 0;
		bs.width = rs.width;
		bs.height = rs.height;
		b.filled = b.stroked = "f";
		r.appendChild(b);
		c.appendChild(r);
		p.appendChild(c);
		s.width = g.normalizedLength(_6c);
		s.height = g.normalizedLength(_6d);
		return s;
	};
	function _6e(_6f, f, o) {
		o = o || d.global;
		f.call(o, _6f);
		if (_6f instanceof g.Surface || _6f instanceof g.Group) {
			d.forEach(_6f.children, function(_70) {
				_6e(_70, f, o);
			});
		}
	}
	;
	var C = gs.Container, _71 = {
		add : function(_72) {
			if (this != _72.getParent()) {
				var _73 = _72.getParent();
				if (_73) {
					_73.remove(_72);
				}
				this.rawNode.appendChild(_72.rawNode);
				C.add.apply(this, arguments);
				_6e(this, function(s) {
					if (typeof (s.getFont) == "function") {
						s.setShape(s.getShape());
						s.setFont(s.getFont());
					}
					if (typeof (s.setFill) == "function") {
						s.setFill(s.getFill());
						s.setStroke(s.getStroke());
					}
				});
			}
			return this;
		},
		remove : function(_74, _75) {
			if (this == _74.getParent()) {
				if (this.rawNode == _74.rawNode.parentNode) {
					this.rawNode.removeChild(_74.rawNode);
				}
				C.remove.apply(this, arguments);
			}
			return this;
		},
		clear : function() {
			var r = this.rawNode;
			while (r.firstChild != r.lastChild) {
				if (r.firstChild != this.bgNode) {
					r.removeChild(r.firstChild);
				}
				if (r.lastChild != this.bgNode) {
					r.removeChild(r.lastChild);
				}
			}
			return C.clear.apply(this, arguments);
		},
		_moveChildToFront : C._moveChildToFront,
		_moveChildToBack : C._moveChildToBack
	};
	var _76 = {
		createGroup : function() {
			var _77 = this.createObject(_1.Group, null);
			var r = _77.rawNode.ownerDocument.createElement("v:rect");
			r.style.left = r.style.top = 0;
			r.style.width = _77.rawNode.style.width;
			r.style.height = _77.rawNode.style.height;
			r.filled = r.stroked = "f";
			_77.rawNode.appendChild(r);
			_77.bgNode = r;
			return _77;
		},
		createImage : function(_78) {
			if (!this.rawNode) {
				return null;
			}
			var _79 = new _1.Image(), doc = this.rawNode.ownerDocument, _7a = doc
					.createElement("v:rect");
			_7a.stroked = "f";
			_7a.style.width = this.rawNode.style.width;
			_7a.style.height = this.rawNode.style.height;
			var img = doc.createElement("v:imagedata");
			_7a.appendChild(img);
			_79.setRawNode(_7a);
			this.rawNode.appendChild(_7a);
			_79.setShape(_78);
			this.add(_79);
			return _79;
		},
		createRect : function(_7b) {
			if (!this.rawNode) {
				return null;
			}
			var _7c = new _1.Rect, _7d = this.rawNode.ownerDocument
					.createElement("v:roundrect");
			if (d.isIE > 7) {
				_7d.style.display = "inline-block";
			}
			_7c.setRawNode(_7d);
			this.rawNode.appendChild(_7d);
			_7c.setShape(_7b);
			this.add(_7c);
			return _7c;
		},
		createObject : function(_7e, _7f) {
			if (!this.rawNode) {
				return null;
			}
			var _80 = new _7e(), _81 = this.rawNode.ownerDocument
					.createElement("v:" + _7e.nodeType);
			_80.setRawNode(_81);
			this.rawNode.appendChild(_81);
			switch (_7e) {
			case _1.Group:
			case _1.Line:
			case _1.Polyline:
			case _1.Image:
			case _1.Text:
			case _1.Path:
			case _1.TextPath:
				this._overrideSize(_81);
			}
			_80.setShape(_7f);
			this.add(_80);
			return _80;
		},
		_overrideSize : function(_82) {
			var s = this.rawNode.style, w = s.width, h = s.height;
			_82.style.width = w;
			_82.style.height = h;
			_82.coordsize = parseInt(w) + " " + parseInt(h);
		}
	};
	d.extend(_1.Group, _71);
	d.extend(_1.Group, gs.Creator);
	d.extend(_1.Group, _76);
	d.extend(_1.Surface, _71);
	d.extend(_1.Surface, gs.Creator);
	d.extend(_1.Surface, _76);
	if (g.loadAndSwitch === "vml") {
		g.switchTo("vml");
		delete g.loadAndSwitch;
	}

})();
}
 