/**
 * 常用js方法封装类
 *
 * Last modify: 2011-07-29 15:37:12
 *
 * example:
 * IF_common.GTN(name, [dom])    获得元素name为name的对象
 *                              若要限制指定容器内的，dom为容器的对象
 */
var IF_common = {
    /**
     * 根据标签获得对象
     *
     * @param   string  tag     标签名称
     * @param   object  dom     限定的对象
     * @return  object          获得的对象
     */
    GTN: function (tag, dom) {
        var obj = dom || window.document;
        return obj.getElementsByTagName(tag);
    },
    /**
     * 根据ID获得对象
     *
     * @param   string  id      要获得对象的ID
     * @return  object          获得的对象
     */
    GID: function (id) {
        var obj = window.document;
        return obj.getElementById(id);
    },
    /**
     * 根据名称获得对象
     *
     * @param   string  name    要获得对象的name
     * @return  object          获得的对象
     */
    GN: function (name) {
        var obj = window.document;
        return obj.getElementsByName(name);
    },
    /**
     * 获得对象的样式
     * 
     * @param   object  dom     要获得样式的对象
     * @param   string  val     要获得样式的名称
     * @return  mix             获得的样式内容或样式对象
     */
    getCss: function( dom, val ) {
        var css = dom.currentStyle || document.defaultView.getComputedStyle(dom,null);
        if ( val ) {
            css = css[val];
        }
        return css;
    },
    /**
     * 创建元素
     *
     * @param   string  tag     创建元素的标签
     * @return  object          创建元素的对象
     */
    CE: function(tag){ 
           return document.createElement(tag);
    },
    /**
     * 删除元素
     *
     * @param   object  dom     要删除的元素
     */
    DE: function(dom) {
        dom.parentNode.removeChild(dom);
    },
    /**
     * 在某元素后面添加元素
     *
     * @param   object  new_dom 要添加的元素
     * @param   object  org_dom 指定的元素
     */
    insertAfter: function(new_dom, org_dom) {
        var p_dom = org_dom.parentNode;
        if (p_dom.lastChild == org_dom) {
            p_dom.appendChild(new_dom);
        } else {
            p_dom.insertBefore(new_dom, org_dom.nextSibling);
        }
        return new_dom;
    },
    /**
     * 根据下标删除数组元素
     *
     * @param   string  index   数组下标
     * @param   array   arr     要删除的数组
     * @return  array           删除完成后的数组
     */
    delArrayByIndex: function (arr, index) {
        var index = index || 0;
        var tmp_arr = new Array();
        for (var i in arr) {
            if (i != index) {
                tmp_arr[i] = arr[i];
            }
        }
        arr = null;
        return tmp_arr;
    },
    /**
     * 数组去重
     *
     * @param   array   arr     要去重复的数组
     * @param   int     type    是否保留重复的值 1 => 保留(默认), 2 => 不保留
     * @return  array           去重后的数组
     */
    arrayUnique: function(arr, type) {
        var tmp_arr = new Array();
        var t = type || 1;
        for (var i in arr) {
            if (t == 1) {
                tmp_arr[arr[i]] = arr[i];
            } else {
                if (tmp_arr[arr[i]]) {
                    tmp_arr = this.delArrayByIndex(tmp_arr, arr[i]);
                } else {
                    tmp_arr[arr[i]] = arr[i];
                }
            }
        }
        arr = new Array();
        for (var i in tmp_arr) {
            arr.push(i);
        }
        return arr;
    },
    /**
     * 数组排序
     *
     * @param   array   arr     要排序的数组
     * @param   string  type    排序方式, asc => 升序(默认), desc => 倒序, rand => 随机
     * @return  array           排序后的数组
     */
    arraySort: function(arr, type) {
        var self = this;
        var t = type || 'asc';
        t = t.toLowerCase();
        return t == 'rand' ? arr.sort(self.sort_rand) : arr.sort(self.cmp);
    },
    /**
     * 两个元素比较大小, a - b
     *
     * @param   int     a       要比较的第一个值
     * @param   int     b       要比较的第二个值
     * @param   int     type    asc => a - b(默认), desc => b - a;
     * @return  int             两个数之间的差值
     */
    cmp: function(a, b, type) {
        var t = type || 'asc';
        t = t.toLowerCase();
        return t == 'asc' ? a - b : b - a;
    },
    /**
     * 数组随机排序方法
     */
    sort_rand: function() {
        return Math.random() > 0.5 ? -1 : 1;
    },
    /**
     * 元素属性 ---- 若有属性值，则为设置属性值，否则为获得属性值
     * 
     * @param   object  dom     元素的对象
     * @param   string  type    属性名称
     * @param   string  val     属性值
     */
    attr: function(dom, type, val){
        if (val) {
            dom.setAttribute(type, val);
            return this;
        } else {
            return dom.getAttribute(type);
        }
    },
    /**
     * 设置cookie
     *
     * @param   string  name    cookie名称
     * @param   string  val     cookie值
     * @param   int     t       cookie有效时间
     */
    setCookie: function(name, val, t){
        var exp = new Date();
        exp.setTime(exp.getTime() + (t * 1000));
        document.cookie = name + "=" + escape(val) + ";expires="+ exp.toGMTString() + ";path=/";
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
     * 将unix时间转换成字符器时间
     *
     * @param   int     t   时间
     */
    intToTime: function(t) {
        t = t * 1000;
        var d = new Date(t);
        return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    },
    /**
     * 获得当前的unix时间
     */
    getIntTime: function() {
        var d = new Date();
        return Date.parse(d)/1000;;
    },
    /**
     * 动态加载js
     *
     * @param   string  url     要加载的地址
     */
    loadScript: function(url) {
        // 超时
        var istimeout = 1;
        var ahead   = document.head || this.GTN( "head" )[0] || document.documentElement;
        var ascript = this.CE('script');
        ascript.src = url;
        ascript.type= 'text/javascript';
        ahead.appendChild(ascript);
        ascript.onload = ascript.onreadystatechange = function() {
            if( !ascript.readyState || /loaded|complete/.test( ascript.readyState ) ) {
                istimeout = 2;
                ahead.removeChild(ascript);
            }
        }
        if (istimeout == 2) {
            alert('加载失败....');
        }
    },
    /**
     * 复制文本
     *
     * @param   string  txt     要复制的内容
     */
    copyToClipboard: function( txt ) {
        if(window.clipboardData) {
            window.clipboardData.clearData();
            window.clipboardData.setData("Text", txt);
            return true;
        } else if (window.netscape) {
            var is_config = 1;
            try {
                netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
            } catch (e) {
                alert("被浏览器拒绝！/n请在浏览器地址栏输入'about:config'并回车/n然后将'signed.applets.codebase_principal_support'设置为'true'");
                is_config = 2;
            }
            if ( is_config == 2 ) {
                return false;
            }
            var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
            if ( !clip ) {
                alert('当前浏览器不支持复制操作！');
                return false;
            }
            var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
            if ( !trans ) {
                alert('当前浏览器不支持复制操作！');
                return false;
            }
            trans.addDataFlavor('text/unicode');
            var str = new Object();
            var len = new Object();
            var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
            var copytext = txt;
            str.data = copytext;
            trans.setTransferData( "text/unicode", str, copytext.length * 2 );
            var clipid = Components.interfaces.nsIClipboard;
            clip.setData(trans, null, clipid.kGlobalClipboard);
            return true;
        } else {
            alert('当前浏览器不支持复制操作！');
            return false;
        }
    },
    /**
     * 获得页面当前的高度
     */
    getScrollTop: function () {
        return document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
    },
    /**
     * 页面顶部滚动效果
     *
     * @param   int     val     要滚动到的高度
     * @param   int     t       滚动时间
     */
    scrollPageTop: function (val, t) {
        var self    = this;
        var t_top   = self.getScrollTop();
        if ( t_top != val ) {
            var t_val   = val - t_top;
            var step    = Math.ceil( t_top + ( t_val * 0.1 ) );
            window.scrollTo( 0, step );
            var timer   = setTimeout( function() { self.scrollPageTop(val, t * 0.9) }, t * 0.1 );
        } else {
            clearTimeout(timer);
        }
    },
    /**
     * 动画效果
     *
     * @param   object  obj         参数对象
     *                  obj.dom     动画效果的对象
     *                  obj.from    对象的原尺寸, obj.from.w 宽度, obj.from.h 高度
     *                  obj.to      对象要变化的尺寸, obj.to.w 宽度, obj.to.h 高度
     *                  obj.time    动画效果的时间, 默认 600 = 0.6 秒
     *                  obj.type    动画效果的类型, 默认 show, 显示
     */
    animate: function (obj) {
        var self    = this;
        var dom     = obj.dom;
        var from    = obj.from  || '';
        var to      = obj.to    || '';
        var time    = obj.time  || 600;
        var type    = obj.type  || 'show';
        var o_w     = dom.clientWidth;
        var o_h     = dom.clientHeight;
        var t_w     = typeof (to.w) == 'undefined' ? o_w : to.w;
        var t_h     = typeof (to.h) == 'undefined' ? o_h : to.h;
        if ( o_w != t_w || o_h != t_h ) {
            if ( o_w != t_w ) {
                var n_w = 0.9 * o_w + t_w * 0.1;
                n_w = type == 'show' ? Math.ceil(n_w) : Math.floor(n_w);
                dom.style.width = n_w + 'px';
            }
            if ( o_h != t_h ) {
                var n_h = 0.9 * o_h + t_h * 0.1;
                n_h = type == 'show' ? Math.ceil(n_h) : Math.floor(n_h);
                dom.style.height= n_h + 'px';
            }
            var param = {'dom':dom, 'from':from, 'to':to, 'time': time * 0.9, 'type': type};
            setTimeout(function(){ self.animate(param) }, time * 0.1);
        } else {
            if ( type == 'hide' ) {
                dom.style.display   = 'none';
                var org_w           = obj.from.w;
                var org_h           = obj.from.h;
                dom.style.width     = org_w + 'px';
                dom.style.height    = org_h + 'px';
            }
        }
    },
    /**
     * 元素显示
     *
     * @param   mix     id      元素ID或对象
     * @param   int     time    时间
     */
    show: function (id, time) {
        var dom = typeof( id ) == 'object' ? id : document.getElementById(id);
        var css = this.getCss(dom, 'display');
        time    = time || 0;
        if ( time > 0 ) {
            if ( css == 'none' ) {
                dom.style.display   = 'block';
                var org_h           = dom.clientHeight;
                var org_w           = dom.clientWidth;
                dom.style.width     = '0px';
                dom.style.height    = '0px';
                this.animate({'dom':dom, 'to':{'w': org_w, 'h': org_h}, 'time': time, 'type': 'show'});
                var child   = dom.childNodes;
                var max     = child.length;
                for ( var i = 0; i < max; i++ ) {
                    if ( child[i].nodeType == 1 ) {
                        this.show(child[i], time);
                    }
                }
            } else if ( typeof(id) == 'object' ) {
                var org_h           = dom.clientHeight;
                var org_w           = dom.clientWidth;
                dom.style.width     = '0px';
                dom.style.height    = '0px';
                this.animate({'dom':dom, 'to':{'w': org_w, 'h': org_h}, 'time': time, 'type': 'show'});
                var child   = dom.childNodes;
                var max     = child.length;
                for ( var i = 0; i < max; i++ ) {
                    if ( child[i].nodeType == 1 ) {
                        this.show(child[i], time);
                    }
                }
            }
        } else {
            if ( css == 'none' ) {
                dom.style.display   = 'block';
            }
        }
    },
    /**
     * 元素隐藏
     *
     * @param   mix     id      元素ID或对象
     * @param   int     time    时间
     */
    hide: function (id, time) {
        var dom = typeof( id ) == 'object' ? id : document.getElementById(id);
        var css = this.getCss(dom, 'display');
        time    = time || 0;
        if ( time > 0 ) {
            if ( css != 'none' ) {
                var child   = dom.childNodes;
                var max     = child.length;
                for ( var i = 0; i < max; i++ ) {
                    if ( child[i].nodeType == 1 ) {
                        this.hide(child[i], time);
                    }
                }
                var org_h   = dom.clientHeight;
                var org_w   = dom.clientWidth;
                this.animate({'dom':dom, 'from':{'w': org_w, 'h': org_h}, 'to':{'w': 0, 'h': 0}, 'time': time, 'type': 'hide'});
            } else if ( typeof(id) == 'object' ) {
                var child   = dom.childNodes;
                var max     = child.length;
                for ( var i = 0; i < max; i++ ) {
                    if ( child[i].nodeType == 1 ) {
                        this.hide(child[i], time);
                    }
                }
                var org_h   = dom.clientHeight;
                var org_w   = dom.clientWidth;
                this.animate({'dom':dom, 'from':{'w': org_w, 'h': org_h}, 'to':{'w': 0, 'h': 0}, 'time': time, 'type': 'hide'});
            }
        } else {
            dom.style.display = 'none';
        }
    }
};

/**
 * 浏览器判定
 */
var browser = {
    IE:navigator.userAgent.indexOf('MSIE') > -1,
    Opera:!!window.opera,
    WebKit:navigator.userAgent.indexOf("AppleWebKit/") > -1,
    Gecko:navigator.userAgent.indexOf("Gecko") > -1 && navigator.userAgent.indexOf("KHTML")==-1,
    MobileSafari:!!navigator.userAgent.match(/Apple.*Mobile.*Safari/)
}
