/**
 * ********************************************
 * Description   : 基本JS类库
 * Filename      : common.js
 * Create time   : 2012-02-17 17:25:16
 * Last modified : 2012-02-17 17:25:16
 * License       : MIT, GPL
 * ********************************************
 */
(function(){
    var document    = window.document,
        navigator   = window.navigator,
        location    = window.location;
    if (typeof(gScript) == 'undefined') {
        var gScript = {
            /**
             * 根据ID获得对象
             *
             * @param   string  _id     对象的ID
             * @return  object          对应ID的对象
             */
            G: function(_id) {
                return document.getElementById(_id);
            },
            /**
             * 绑定事件
             *
             * @param   object      dom     要绑定事件的对象
             * @param   string      type    要绑定事件的类型
             * @param   function    fun     要绑定事件的方法
             */
            addEvent: function(dom, type, fun) {
                if (dom.addEventListener) {
                    dom.addEventListener(type, fun, false);
                } else {
                    dom.attachEvent('on' + type, fun);
                }
            },
            /**
             * 根据名称获得对象
             *
             * @param   string      val     对象的名称
             * @return  array               对应名称的对象集合
             */
            GN : function(val) {
                return document.getElementsByName(val);
            },
            /**
             * 根据标签名称获得对象
             *
             * @param   string      val     标签的名称
             * @param   object      dom     限定的对象
             * @return  array               返回对应标签对象的数组
             */
            GTN : function(val, dom) {
                var dom = dom || window.document;
                return dom.getElementsByTagName(val);
            },
            /**
             * 根据样式名称获得对象
             *
             * @param   string      val     样式名称
             * @param   object      dom     限定的对象
             * @param   string      tag     限定的标签名称
             * @param   array               返回对应样式名称对象的数组
             */
            GCN : function (val, dom, tag) {
                var dom = dom || window.document.body;
                var _t  = tag || '*';
                var ret = new Array();
                if (document.getElementsByClassName) {
                    var nodes = dom.getElementsByClassName(val);
                    if (_t != '*') {
                        for (var i in nodes) {
                            if ( node.tagName == _t.toUpperCase() ) {
                                ret.push(nodes[i]);
                            }
                        }
                    } else {
                        ret = nodes;
                    }
                } else {
                    var classes = val.split(' ');
                    var _dom    = _t == '*' ? this.getChildNodes(dom) : GTN(tag, dom);
                    var patterns    = [];
                    for (var i in classes) {
                        patterns.push(eval('/(?:(^|\\s)' + classes[i] + '(\\s|$))/'));
                    }
                    for (var i = 0, _len = _dom.length; i < _len; i++) {
                        var match = false;
                        for (var a in patterns) {
                            match = patterns[a].test(_dom[i].className);
                            if (!match) break;
                        }
                        if (match) ret.push(_dom[i]);
                    }
                }
                return ret;
            },
            /**
             * 获得一个节点下所有节点
             *
             * @param   object  _dom    源节点
             * @return  array           所有子节点
             */
            getChildNodes : function(_dom) {
                var _ele = new Array(), _dom = _dom || window.document.body;

                /**
                 * 获得子节点
                 *
                 * @param   object  _dom    源
                 */
                function getNodesItem(_dom) {
                    _ele.push(_dom);
                    var _child = _dom.childNodes;
                    for (var i = 0, _max = _child.length; i < _max; i++) {
                        if (_child[i].nodeType == 1) {
                            getNodesItem(_child[i]);
                        }
                    }
                }
                getNodesItem(_dom);
                _ele.shift();
                return _ele;
            },
            /**
             * 在一个元素后面插入一个元素
             *
             * @param   object  new_dom     新添加的元素对象
             * @param   object  src_dom     源元素对象 
             */
            insertAfter : function(new_dom, src_dom) {
                var p_dom = src_dom.parentNode;
                if (p_dom.lastChild == src_dom) {
                    p_dom.appendChild(new_dom);
                } else {
                    p_dom.insertBefore(new_dom, src_dom.nextSibling);
                }            
            },
            /**
             * 创建元素
             *
             * @param   string      tag     标签的名称
             * @return  object              标签对应的对象
             */
            CE : function(tag) {
                return document.createElement(tag);
            },
            /**
             * 获得或设置 元素的属性
             *
             * @param   object      object  对象
             * @param   string      type    元素的属性
             * @param   string      val     值(可选，若有则是设置，若无则是获得)
             * @return  mix                 执行后返回值或者当前对象
             */
            attr : function(dom, type, val) {
                if (val) {
                    dom.setAttribute(type, val);
                    return dom;
                } else {
                    return dom.getAttribute(type);
                }
            },
            /**
             * 字符串长度(汉字2,英文1)
             * 
             * @param   string  str     源字符
             * @return  int             字符串的长度
             */
            getTrueLength : function(str) {
                var len = 0;
                for (var i = 0, max = str.length; i < max; i++) {
                    var char_code = str.charCodeAt(i);
                    if (char_code >= 0 && char_code <= 254) {
                        len += 1;
                    } else {
                        len += 2;
                    }
                }
                return len;
            },
            /**
             * 获得数组中最大的数字
             *
             * @param   array   arr     源数组
             * @return  int             数组中最大的数字
             */
            getArrayMax : function(arr) {
                return Math.max.apply({}, arr);
            },
            /**
             * 获得数组中最小的数字
             *
             * @param   array   arr     源数组
             * @return  int             数组中最小的数字
             */
            getArrayMin : function(arr) {
                return Math.min.apply({}, arr);
            },
            /**
             * 获得缩放后的尺寸
             *
             * @param   object  _src    源尺寸: _src.w = > 宽, _src.h => 高
             * @param   object  _to     缩放尺寸: _to.w => 宽, _to.h => 高
             * @reutrn	array			缩放后的尺寸
             */
            getZoomSize : function(_src, _to) {
                var to_w = _to.w || 0, to_h = _to.h || 0, _w, _h;
                if (to_w == 0 && to_h == 0) {
                    _w = _src.w;
                    _h = _src.h;
                } else if ( to_w == 0 ) {
                    _w = _src.w * to_h / _src.h;
                    _h = to_h;
                } else if ( to_h == 0 ) {
                    _w = to_w;
                    _h = _src.h * to_w / _src.w;
                } else {
                    var _src_p  = _src.w / _src.h;
                    var _to_p   = to_w / to_h;
                    if (_src_p > _to_p) {
                        _w = to_w;
                        _h = _src.h * to_w / _src.w;
                    } else if (_src_p < _to_p) {
                        _w = _src.w * to_h / _src.h;
                        _h = to_h;
                    } else {
                        _w = to_w;
                        _h = to_h;
                    }
                }
                return [_w, _h];
            },
            /**
             * 获得页面可见区域的高宽
             *
             * @return  array   size[0] => 宽度, size[1] => 高度
             */
            getBodySize : function() {
                var size = new Array();
                if (document.documentElement) {
                    size[0] = document.documentElement.clientWidth;
                    size[1] = document.documentElement.clientHeight;
                } else {
                    size[0] = document.body.clientWidth;
                    size[1] = document.body.clientHeight;
                }
                return size;
            },
            /**
             * 获得元素位置
             *
             * @param   object  dom     要获得位置元素的对象
             */
            getPos : function(dom) {
                if ( arguments.length != 1 || dom == null ) {
                    return null;
                }
                var offsetTop = dom.offsetTop;
                var offsetLeft = dom.offsetLeft;
                while( dom = dom.offsetParent ) {
                    if ( dom.style.position == 'absolute' || ( dom.style.overflow != 'visible' && dom.style.overflow != '' ) ) {
                        break;
                    }
                    offsetTop += dom.offsetTop;
                    offsetLeft += dom.offsetLeft;
                }
                return {top : offsetTop, left : offsetLeft};
            },
            /**
             * 获得页面滚动的高度
             */
            getScrollTop : function() {
                return document.documentElement.scrollTop || window.pageYoffset || document.body.scrollTop;
            },
            /**
             * 设置cookie
             *
             * @param   string  name    cookie名称
             * @param   string  val     cookie值
             * @param   int     t       cookie有效时间
             * @param   string  domain  cookie有效域
             */
            setCookie: function(name, val, t, domain){
                var exp = new Date();
                exp.setTime(exp.getTime() + (t * 1000));
                var _d = '';
                if (domain) {
                    _d = ';domain=' + domain;
                }
                document.cookie = name + "=" + escape(val) + ";expires="+ exp.toGMTString() + ";path=/" + _d;
            },
            /**
             * 获得cookie
             *
             * @param   string  name    要获得cookie的名称
             */
            getCookie: function(name) {
                var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
                if ( arr != null) {
                    return unescape(arr[2]);
                } else {
                    return "";
                }
            },
            /**
             * 删除cookie
             *
             * @param   string  name    要删除的cookie名称
             */
            delCookie: function(name) {
                var cval = this.getCookie(name);
                if ( cval != null ) {
                    cval = '';
                    document.cookie = name + "=" + cval + ";expires=Thu, 01-Jan-1970 00:00:01 GMT";
                }
            },
            /**
             * 获得数组中最小的值的位置
             *
             * @param   array   arr     源数组
             * @return  int             数组的下标
             */
            getArrayMinIndex : function(arr) {
                var _a = this.getArrayMin(arr);
                for (var i in arr) {
                    if (arr[i] == _a) {
                        return i;
                    }
                }
            },
            /**
             * 克隆对象
             *
             * @param   object  obj     要克隆的对象
             * @return  object          克隆后的对象
             */
            clone : function(obj) {
                var objClone = obj.constructor == Object ? new obj.constructor() : new obj.constructor(obj.valueOf());
                for (var key in obj) {
                    if (objClone[key] != obj[key]) {
                        if (typeof(obj[key]) == 'object') {
                            objClone[key] = this.clone(obj[key]);
                        } else {
                            objClone[key] = obj[key];
                        }
                    }
                }
                objClone.toString   = obj.toString;
                objClone.valueOf    = obj.valueOf;
                return objClone;
            }
        }
        window.gScript = gScript;
    }
})();
