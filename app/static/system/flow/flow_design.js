/**
 * 属性对象
 * @constructor
 */
var PropertyElement = function (data) {
    this.data = data;
    this.id;
    this.label;
    this.inputType;
    this.value;
    this.button;
    try {
        this.id = data.id;
        this.label = data.text;
        this.inputType;
        this.value = data.value;
        this.button;
    } catch (e) {
    }
}
/**
 * 活动环节属性类
 * @constructor
 */
var NodePropertys = function (data) {
    this.data = data;
    this.reslist = [];
    this.getProperty = function () {
        if (typeof this.data == "string") {
            this.data = JSON.parse(this.data);
        }
        for (var i = 0; i < this.data.length; i++) {

        }
    };
};