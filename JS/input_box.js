/**
 *el:存放内容的容器
 *setting：{
 *类型  type："text|password",
 *个数  num:"",
 *鼠标 mouseflag:true|false,
 *样式  style:{},
* */
var DigitalInputBox = function (el, setting) {
    this.el = $(el);
    var defaultreg = /^\d*\.{0,1}\d{0,2}$/;
    this.reg = (setting.regobj == "undefined" || setting.regobj == "") ? defaultreg : setting.regobj;
    this.type = setting.type;
    this.num = setting.num;
    this.mouseflag = setting.mouseover ? true : false;
    this.autofocus = setting.autofocus ? true : false;
    this.defaultStyle = {
        width: '150px',
        height: '30px',
        border: '1px solid #ccc',
        margin: '20px'
    };
    Object.assign(this.defaultStyle, setting.style);
};
DigitalInputBox.prototype.init = function () {
    var self = this;
    var str = '';
    for (var i = 0; i < self.num; i++) {
        str += `<input type="${self.type}" style="width: ${self.defaultStyle.width};height: ${self.defaultStyle.height};border:${self.defaultStyle.border};margin:${self.defaultStyle.margin}">`
    }
    self.el.append(str);
    if(self.autofocus){
        self.el.children("input").eq(0).focus();
    }
    self.el.children("input").each(function (index, item) {
        var newValue;
        item.oninput = function (e) {
            var flag = self.reg.test(this.value);
            if(this.value == ""){
                self.el.children("input").eq(index).focus();
                return;
            }
            if (flag) {
                newValue = this.value;
                this.onkeydown = function (e) {
                    console.log(e)
                    if (e.keyCode == 13) {
                        self.el.children("input").eq(index + 1).focus();
                    } else if (e.keyCode == 8 || e.keyCode == 46) {
                        if (this.value == "") {
                            if (index == 0) {
                                return;
                            } else {
                                self.el.children("input").eq(index - 1).focus();
                            }
                        }
                    }
                }
            } else {
                if (newValue) {
                    this.value = newValue
                } else {
                    this.value = this.value.replace(e.data, "");
                }
            }
        };
        if (self.mouseflag) {
            item.onmouseover = function (e) {
                this.setAttribute("title", "我是第" + (index + 1) + "个")
            }
        }
        item.onblur = function (e) {
            if(this.value == "" || this.value == "undefined"){
                self.el.children("input").eq(index).focus();
            }else{
                this.setAttribute("value", this.value);
            }
            console.log(this.value)
        }
    })
};
DigitalInputBox.prototype.getValue = function () {
    var self = this;
    var arr = [];
    self.el.children("input").each(function (index, item) {
        var obj = {};
        obj.index = index + 1;
        obj.value = item.value;
        arr.push(obj);
    });
    return arr;
};
DigitalInputBox.prototype.clearValue = function () {
    var self = this;
    self.el.children("input").each(function () {
        this.value = ''
    });
};
