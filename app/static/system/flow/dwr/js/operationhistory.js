var OperationHistory = {
	init : function() {
		window.undocentent = [];
		window.redocentent = [];
		window.undoredoidx = 0;
		window.modeljson = "";
	},
	execute : function(operation) {
		operation.execute();
		window.undocentent[window.undocentent.length] = operation;
		window.redocentent = [];
	},
	undo : function() {
		if (window.undocentent.length > 0) {
			var adx = window.undocentent.length - 1;
			window.undocentent[adx].undo();
			window.redocentent[window.redocentent.length] = window.undocentent[adx];
			window.undocentent.splice(adx, 1);
		}
	},
	redo : function() {
		if (window.redocentent.length > 0) {
			var indx = window.redocentent.length - 1;
			window.redocentent[indx].redo();
			window.undocentent[window.undocentent.length] = window.redocentent[indx];
			window.redocentent.splice(indx, 1);
		}
	},
	canundo : function() {
		return window.undocentent.length > 0;
	},
	canredo : function() {
		return window.redocentent.length > 0;
	}
};

OperationHistory.init();

var AbstractOperation = function(bfjsonstr, afjsonstr) {
	this.bfjsonstr = bfjsonstr;
	this.afjsonstr = afjsonstr;
	this.execute = function() {
	};
	this.undo = function() {
		pageDataInited(this.bfjsonstr);
	};
	this.redo = function() {
		pageDataInited(this.afjsonstr);
	};
};

var pageDataInited = function(sources) {
	try {
		sources = sources.toString().decodeSpechars();
		var j = JSON.decode(sources);
		drow_init(j.id, j.name, j);
	} catch (e) {
		try {
			var j = JSON.decode(sources);
			drow_init(j.id, j.name);
		} catch (e) {
			alert("模型加载失败!");
		}
	}
};

var editModelchange = function() {
	var group = document.getElementById('group');
	var Love = group.bindClass;
	if (window.modeljson != "" && window.modeljson != Love.toJson()) {
		OperationHistory.execute(new AbstractOperation(window.modeljson, Love
				.toJson()));
	}
	window.modeljson = Love.toJson();
}