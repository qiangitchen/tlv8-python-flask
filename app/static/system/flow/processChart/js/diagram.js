/**
 * 图
 */
Diagram = function () {
    this.data = [];
    this.canvas = {};
    this.config = {};
};

Diagram.prototype = {
    setCanvas: function (canvas) {
        this.canvas = canvas;
    },
    setData: function (data) {
        this.data = data;
    },
    setConfig: function (config) {
        this.config = config;
        if (!this.config)
            this.config = {
                bgColor: 'NULL',
                bound: {
                    x: 10,
                    y: 10,
                    w: 256,
                    h: 110
                }
            }; // no effact!
    }
};
/**
 * 波特图
 */
Baud = function () {
    this.chain = [];
    this.setConfig({
        bgColor: '#ddeeff'
    });
};

Baud.prototype = new Diagram();

/**
 * 绘制波特图
 */
Baud.prototype.draw = function () {
    if (this.data) {
        let first = this.first();
        if (!first) {
            return;
        }
        var firstBound = this.config.bound || {
            x: 10,
            y: 10,
            w: 256,
            h: 110
        };// EFFECTIVE
        var baud1 = this.newBaudRectangle(firstBound, true);
        baud1.setData(first);
        baud1.id = first.id;
        this.canvas.add(baud1);
        var firstId = first.id;
        this.chain[firstId] = baud1;
        var next = first.next;
        this.layout(firstBound, next);
        this.connect(baud1, next);
    }
};
/**
 * 链接波特框
 */
Baud.prototype.connect = function (aheadBaud, next) {
    let l = next.length;
    for (let i = 0; i < l; i++) {
        let refId = next[i];
        let data = this.find(refId);
        if (data) {
            let baud2 = this.chain[refId];
            this.newConnection(aheadBaud, baud2);
            this.connect(baud2, data.next);
        }
    }
};
/**
 * 创建一个链接
 */
Baud.prototype.newConnection = function (one, two) {
    let conn = new Justep.graphics.Connection({
        bgColor: 'NULL',
        points: [{
            x: 0,
            y: 0
        }, {
            x: 12,
            y: 12
        }]
    });
    if (one && two) {
        conn.id = one.id + "_" + two.id;
        this.canvas.add(conn);
        conn.setOutPort(one.getPort('OutPort', Justep.PortDirection.RIGHT));
        conn.setInPort(two.getPort('InPort', Justep.PortDirection.LEFT));
    }
};
/**
 * 递归布局波特框
 */
Baud.prototype.layout = function (aheadBound, next) {
    let l = next.length;
    for (let i = 0; i < l; i++) {
        let refId = next[i];
        if (this.chain[refId])
            continue;
        let data = this.find(refId);
        if (data) {
            let bound = {
                x: aheadBound.x + aheadBound.w + 20,
//				y : aheadBound.y + i * (aheadBound.h + aheadBound.y / 2 + 20),
                y: aheadBound.y + i * (aheadBound.h + 40),
                w: aheadBound.w,
                h: aheadBound.h
            };
            let baud = this.newBaudRectangle(bound);
            baud.setData(data);
            baud.id = data.id;
            this.canvas.add(baud);
            this.chain[refId] = baud;
            this.layout(bound, data.next);
        }
    }
};
/**
 * 查找某个id的波特框的数据
 */
Baud.prototype.find = function (refId) {
    if (this.data) {
        for (let obj in this.data) {
            let id = this.data[obj].id;
            if (id === refId)
                return this.data[obj];
        }
    }
};
/**
 * 查找第一个波特框的数据
 */
Baud.prototype.first = function () {
    if (this.data) {
        for (let obj in this.data) {
            let ahead = this.data[obj].ahead;
            if (!ahead) {
                return this.data[obj];
            } else {
                if (ahead.length == 0)
                    return this.data[obj];
            }
        }
    }
};
/**
 * 创建一个波特框
 */
Baud.prototype.newBaudRectangle = function (recBound, isFirst) {
    let bgColor = this.config.bgColor || 'NULL';
    let baud = new Justep.graphics.BaudRectangle({
        bgColor: bgColor,
        bound: recBound,
        filter: 'alpha(opacity=80)'
    });
    baud.addPort(new Justep.graphics.Port({
        type: 'OutPort',
        direction: Justep.PortDirection.RIGHT,
        visible: false,
        calcuFun: function (ownerBound) {
            var bound = this.bound;
            bound.x = ownerBound.x - 5 + ownerBound.w;
            bound.y = ownerBound.y - 5 + ownerBound.h / 2;
            return bound;
        }
    }));
    if (isFirst)
        return baud;
    baud.addPort(new Justep.graphics.Port({
        type: 'InPort',
        direction: Justep.PortDirection.LEFT,
        visible: false,
        calcuFun: function (ownerBound) {
            var bound = this.bound;
            bound.x = ownerBound.x - 5;
            bound.y = ownerBound.y - 5 + ownerBound.h / 2;
            return bound;
        }
    }));

    return baud;
};

Baud.prototype.reset = function () {
    this.chain = [];
    let figures = this.canvas.figures;
    for (let p in figures) {
        figures[p].dispose();
    }
};
Baud.prototype.loadData = function (data) {
    if (!data || data === '' || data.length === 0) {
        this.canvas.resizeSurface();
        this.reset();
        return;
    }
    this.reset();
    this.data = data;
    this.draw();
    let figures = this.canvas.figures;
    let maxH = 0, maxW = 0;
    for (let p in figures) {
        if (figures[p].bound) {
            maxW = Math.max(maxW, figures[p].bound.x + figures[p].bound.w);
            maxH = Math.max(maxH, figures[p].bound.y + figures[p].bound.h);
        } else if (figures[p].points) {
            let points = figures[p].points;
            for (let i = 0, l = points.length; i < l; i++) {
                maxW = Math.max(maxW, points[i].x);
                maxH = Math.max(maxH, points[i].y);
            }
        }
    }
    this.canvas.surface.setDimensions(maxW + 50, maxH);
    this.canvas.resizeSurface();
};

function formatDate(s) {
    if (!s || s === '')
        return '';
    try {
        s = s.trim();
        if (s === '')
            return '';
        let yyyy = s.substring(0, 4) || '';
        let MM = s.substring(5, 7) || '';
        let dd = s.substring(8, 10) || '';
        let hh = s.substring(11, 13) || '';
        let mm = s.substring(14, 16) || '';
        let ss = s.substring(17, 19) || '';
        // var testDate = "2009-09-24T16:01:51.000Z";
        // return yyyy+"年"+MM+"月"+dd+"日"+hh+"时"+mm+"分"+ss+"秒";
        return yyyy + "-" + MM + "-" + dd + " " + hh + ":" + mm + ":" + ss;// +"秒";
    } catch (e) {
        return '';
    }
}
