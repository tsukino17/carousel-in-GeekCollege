//全局帮助函数 获取dom
var g = function (selector) {
    if (selector.indexOf('.') == 0) {
        selector = selector.replace('.', '');
        return document.getElementsByClassName(selector);
    } else if (selector.indexOf('#') == 0) {
        selector = selector.replace('#', '');
        return document.getElementById(selector);
    } else {
        return document.getElementsByTagName(selector);
    }
};
//lazySliderObject 对象
lazySliderObject = function (element, obj) {
    //获取slider容器
    this.element = g(element);
    //slider配置
    this.config = obj.config;
    //slider的数据
    this.data = obj.data;
    //计时器
    this.play = '';
    //计时器进度条
    this.progress = '';
    //定义slider图片区域模板
    this.tpl_main = '\<div class="main-item {{direction}}" id="tpl_item_{{id}}"\>\<img class="main-item-pic" src="img/{{img}}" alt="{{alt}}"\>\<div class="caption"\>\<h1\>{{h1}}\</h1\>\<h2\>{{h2}}\</h2\>\</div\>\</div\>';
    //定义slider控制区域模板
    this.tpl_ctrl = '\<div id="tpl_ctrl_{{id}}" class="ctrl-item"\>\<img src="img/{{img}}" alt="{{alt}}"\>\</div\>';
    //执行初始化操作
    this._init();
};

lazySliderObject.prototype = {
    constructor: lazySliderObject,
    //初始化操作
    _init: function () {
        var _self = this;
        //初始化画布容器
        this._initCanvas();
        //将slider写入html
        this._addSlider(_self._adjustPicMargin);
        //调整图片垂直居中
        setTimeout(function () {
            _self._adjustPicMargin();
        }, 200);
        this.switchPicture(1);
        this._adjustCtrlWidth();
        this._initEvent();
        this._autoPlay(this.config.autoplay);
    },
    //初始化slider画布容器
    _initCanvas: function () {
        this.element.style.width = this.config.width + 'px';
        this.element.style.height = this.config.height + 'px';
    },
    //根据按钮的数量动态调整控制按钮的宽度
    _adjustCtrlWidth: function () {
        var c = g('.ctrl-item');
        for (var i = 0; i < c.length; i++) {
            c[i].style.width = (this.config.width * 0.95 - this.data.length) / this.data.length + 'px';
        }
    },
    //调整图片的上边距以使其在容器中垂直居中显示
    _adjustPicMargin: function () {
        var pic = g('.main-item-pic');
        for (var i = 0; i < pic.length; i++) {
            pic[i].style.marginTop = (-1 * pic[i].clientHeight / 2) + 'px';
        }
    },
    //向画布中添加slider 填充模板的操作
    _addSlider: function () {
        var _out_main = [];
        var _out_ctrl = [];
        for (var i=0 ;i<this.data.length;i++) {
            //生成图片区域的html
            var _html_main = this.tpl_main
                .replace(/{{id}}/g,i+1)//id
                .replace(/{{img}}/g, this.data[i].img)//img
                .replace(/{{alt}}/g, this.data[i].alt)//img
                .replace(/{{h1}}/g, this.data[i].h1)
                .replace(/{{h2}}/g, this.data[i].h2)
                .replace(/{{direction}}/g, ['', 'main-item-right'][i % 2]);
            //生成控制区域html
            var _html_ctrl = this.tpl_ctrl
                .replace(/{{id}}/g, i+1)//id
                .replace(/{{img}}/g, this.data[i].img);
            _out_main.push(_html_main);
            _out_ctrl.push(_html_ctrl);
        }
        //写入dom
        this.element.innerHTML = '\<div class="slider"\>\<!--slider图片区域--\>\<div class="main" id="tpl_main"\>' + _out_main.join('') + '\</div\>\<!--进度条--\>\<div class="slider-progress"\>\</div\>\<!--控制区域--\>\<div class="ctrl" id="tpl_ctrl"\>' + _out_ctrl.join('') + '\</div\>\</div\>';
    },
    //切换图片
    switchPicture: function (id) {
        var main = g('#tpl_item_' + id);
        var ctrl = g('#tpl_ctrl_' + id);
        var clear_main = g('.main-item');
        var clear_ctrl = g('.ctrl-item');
        //清除所有聚焦的slider
        for (var i = 0; i < clear_main.length; i++) {
            clear_main[i].className = clear_main[i].className.replace(' main-item_active', '');
            clear_ctrl[i].className = clear_ctrl[i].className.replace(' ctrl-item_active', '');
        }
        //设置聚焦
        main.className += ' main-item_active';
        ctrl.className += ' ctrl-item_active';
    },
    //初始化控制点击事件
    _initEvent: function () {
        var ctrl = g('.ctrl-item');
        var _self = this;
        for (var i = 0; i < ctrl.length; i++) {
            ctrl[i].onclick = function () {
                _self.switchPicture(this.getAttribute('id').replace(/tpl_ctrl_/g, ''));
            };
            ctrl[i].onmouseover = function () {
                _self._autoPlay(false);
            };
            ctrl[i].onmouseleave = function () {
                _self._autoPlay(true);
            };
        }
    },
    //自动播放
    _autoPlay: function (option) {
        if (option) {
            var _self = this;
            var id = 1;
            var direction = 1;
            this.play = setInterval(function () {
                if (direction) {
                    id++;
                } else {
                    id--;
                }
                if (id >= _self.data.length)
                    direction = 0;
                if (id <= 1)
                    direction = 1;
                _self.switchPicture(id);
                console.log(id);
            }, _self.config.delay||2000);
        }
        if (!option) {
            clearInterval(this.play);
        }
    }
};
//实例化lazySliderObject
function lazySlider(element, data) {
    return lazySlider = new lazySliderObject(element, data);
}