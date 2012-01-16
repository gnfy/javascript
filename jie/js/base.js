/**
 * description   : 基本js类库
 * Filename      : base.js
 * Create time   : 2012-01-11 17:18:28
 * Last modified : 2012-01-13 17:44:03
 * License       : MIT, GPL
 * ********************************************
 */
(function(window){
    var span_dom,                           // 菜单DOM
        img_width = 205,                    // 列表图片宽度
        page = 1,                           // 当前页码
        page_size = 10,                     // 一页显示多少条
        index = 0,                          // 当前所在菜单的序号
        col_num = 1,                        // 当前窗口显示的列数
        content_dom,                        // 显示列表的容器DOM
        col_width = 240,                    // 单列的宽度
        line_letter = 17,                   // 单行显示的字数
        letter_height = 16,                 // 单行的高度
        col_space = 21,                     // 列间隙
        history_data = new Array(),         // 历史数据记录
        history_length = 40,                // 最大的历史记录
        space_border = 6,                   // 列表内容离边框的距离
        cover_dom,                          // 大图显示遮照层DOM
        photo_dom,                          // 大图显示的DOM
        photo_desc = 0,                     // 当前状态上是否是大图模式 0 => 不是(默认)
        photo_index = -1,                   // 当前大图的序号
        new_item = 1,                       // 是否还有新的条目 1 => 有(默认)
        get_data_status = 0,                // 页面新数据的状态 0 => 获取数据未完成(默认)
        base_url = 'http://jie.spriteapp.com/web/',                     // 基本URL
        loading_html = '<img src="image/loading.gif" border="0px"/>',   // 页面加载时,状态条显示的内容
        no_loading_html = '没有更新的条目了，请稍后再试...';            // 无新数据时,状态条显示的内容
    /**
     * 绑定事件
     *
     * @param   object      dom     要绑定事件的对象
     * @param   string      type    要绑定事件的类型
     * @param   function    fun     要绑定事件的方法
     */
    function addEvent(dom, type, fun) {
        if (dom.addEventListener) {
            dom.addEventListener(type, fun, false);
        } else {
            dom.attachEvent('on' + type, fun);
        }
    }
    /**
     * 根据ID获得对象
     *
     * @param   string      val     对象的ID
     * @return  object              对应ID的对象
     */
    function G(val) {
        return document.getElementById(val);
    }
    /**
     * 根据标签名称获得对象
     *
     * @param   string      val     标签的名称
     * @param   object      dom     限定的对象
     * @return  array               返回对应标签对象的数组
     */
    function GTN(val, dom) {
        var dom = dom || window.document;
        return dom.getElementsByTagName(val);
    }
    /**
     * 根据样式名称获得对象
     *
     * @param   string      val     样式名称
     * @param   object      dom     限定的对象
     * @param   string      tag     限定的标签名称
     * @param   array               返回对应样式名称对象的数组
     */
    function GCN(val, dom, tag) {
        var dom = dom || window.document;
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
            var _dom    = _t == '*' ? dom.childNodes : GTN(tag, dom);
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
    }
    /**
     * 创建元素
     *
     * @param   string      tag     标签的名称
     * @return  object              标签对应的对象
     */
    function CE(tag) {
        return document.createElement(tag);
    }
    /**
     * 获得或设置 元素的属性
     *
     * @param   object      object  对象
     * @param   string      type    元素的属性
     * @param   string      val     值(可选，若有则是设置，若无则是获得)
     * @return  mix                 执行后返回值或者当前对象
     */
    function attr(dom, type, val) {
        if (val) {
            dom.setAttribute(type, val);
            return dom;
        } else {
            return dom.getAttribute(type);
        }
    }
    /**
     * 页面改变大小事件
     */
    window.onresize = function() {
        setColInfo();
        setContentWidth();
    }
    /**
     * 页面加载后初始化事件
     */
    window.onload = function() {
        var menu_dom = G('top_menu');
        content_dom  = G('content');
        cover_dom    = G('photo_cover');
        photo_dom    = G('photo');
        loading_dom  = G('loading');
        span_dom     = GTN('span', menu_dom);
        setColInfo();
        addEvent(menu_dom, 'click', changeTag);
        addEvent(cover_dom, 'click', jie.hidePhoto);
        // 监听键盘事件
        addEvent(window.document, 'keydown', function( evt ) {
            if (photo_desc == 1) {
                var kc_val  = evt.keyCode;
                if ( kc_val == 37 || kc_val == 39 ) {
                    var target  = evt.target || evt.srcElement;
                    var no_html = /(?:input|textarea)/i;
                    if ( !no_html.test( target.nodeName ) ) {
                        if (kc_val == 37) {
                            if (photo_index > 0) {
                                changePhotoIndex(1);
                            } else {
                                alert('Sorry, 已到第一张图片了!');
                            }
                        } else {
                            if (photo_index < (history_data.length - 1)) {
                                changePhotoIndex(2);
                            } else {
                                alert('Sorry, 已到最后一张图片了!');
                            }
                        }
                    }
                }
            }
        });
        history_length  = jie.history;
        loading_html    = jie.loading_html;
        no_loading_html = jie.no_loading_html;
        base_url        = jie.base_url;
        loading_dom.innerHTML = loading_html;
        // 设置容器宽度
        setContentWidth();
        // 获得页面数据
        setData();
    }
    /**
     * 鼠标样式
     *
     * @param   event   evt     windows事件
     * @param   object  dom     监听鼠标事件的对象
     */
    function photoCursor(evt, dom) {
        var photopos = getPos(dom);
        if ( evt ) {
            var w_v = dom.offsetWidth || dom.style.width;
            nx = ( parseInt( evt.clientX ) - photopos.left ) / w_v;
            var r_cursor ='url(' + base_url + 'image/right.cur), auto'; 
            var l_cursor ='url(' + base_url + 'image/left.cur), auto'; 
            var _cursor;
            if( nx > 0.5 ) {
                _cursor = photo_index == (history_data.length - 1) ? l_cursor : r_cursor;
            } else {
                _cursor = photo_index == 0 ? r_cursor : l_cursor;
            }
            dom.style.cursor = _cursor;
        }
    }
    /**
     * 相册点击
     *
     * @param   event   evt     windows事件
     * @param   object  dom     监听事件的对象
     */
    function photoClick(evt, dom) {
        var photopos = getPos(dom);
        if ( evt ) {
            var w_v = dom.offsetWidth || dom.style.width;
            nx = ( parseInt( evt.clientX ) - photopos.left ) / w_v;
            var _type;
            if( nx > 0.5 ) {
                _type = photo_index == (history_data.length - 1) ? 1 : 2;
            } else {
                _type = photo_index == 0 ? 2 : 1;
            }
            changePhotoIndex(_type);
        }
    }
    /**
     * 上一张或下一张相册显示
     *
     * @param   string  type    显示的类型 1 => 上一张, 2 => 下一张 (默认)
     */
    function changePhotoIndex(type) {
        var val = type || 2;
        var index = val == 1 ? photo_index - 1 : photo_index + 1;
        jie.showDesc(index);
    }
    /**
     * 切换标签
     */
    function changeTag(event) {
        var t_dom   = event.target || event.srcElement;
        if (t_dom.tagName.toLowerCase() == 'span') {
            var this_index;
            for (var i in span_dom) {
                if (t_dom == span_dom[i]) {
                    this_index = i;
                    span_dom[i].className = 'current';
                } else {
                    span_dom[i].className = '';
                }
            }
            if ( this_index != index ) {
                new_item = 1;
                content_dom.innerHTML = '';
                content_dom.style.height = '0px';
                history_data = new Array();
                loading_dom.innerHTML = loading_html;
                setData(this_index, 1);
            }
        }
    }
    /**
     * 设置数据
     *
     * @param   string      val     要获得的数据的标识
     * @param   int         p       要显示的页码
     */
    var top_arr = new Array();
    function setData(val, p) {
        var data_url = base_url + 'getData.php';
        var val      = val || 0;
        page         = p || 1;
        get_data_status = 0;
        ajax.request({
            url     : data_url,
            data    : 'type='+val+'&page='+page,
            dataType: 'json',
            success : function(data) {
                page_size = data.length;
                if ( page_size > 0 ) {
                    var h_len = history_data.length;
                    var is_reflow = 1;
                    if (h_len >= history_length) {
                        history_data.splice(0, page_size);
                        is_reflow = 2;
                    }
                    for (var i = 0; i < page_size; i++) {
                        history_data.push(data[i]);
                    }
                    if ( val != index ) {
                        is_reflow = 2;
                        index = val;
                    }
                    showData(is_reflow);
                } else {
                    new_item = 0;
                    loading_dom.innerHTML = no_loading_html;
                    if (val != index) {
                        index = val;
                    }
                }
            }
        });
    }
    /**
     * 显示数据
     *
     * @param   string      val     显示的方式. 1 => 显示最新的数据(默认)，2 => 重构所有的数据
     */
    function showData(val) {
        var val  = val || 1;
        var len = history_data.length;
        if (val == 1) {
            //content_dom.innerHTML += JSONToHTMLString(len - page_size);
            JSONToHTMLObject(len-page_size);
        } else {
            top_arr = new Array();
            //content_dom.innerHTML  = JSONToHTMLString(0);
            content_dom.innerHTML  = '';
            JSONToHTMLObject(0);
        }
        content_dom.style.height = top_arr[0] > 0 ? getArrayMax(top_arr) + 'px' : '0px';
        // 数据获取状态成功
        get_data_status = 1;
    }
    /**
     * 将json数据转换成html字符串返回
     *
     * @param   int         index   要转换的数据开始位置
     * @return  string              转换后的html数据
     */
    function JSONToHTMLString(index) {
        var html = '';
        for (var i in history_data) {
            if ( i < index) {
                continue;
            }
            var to_h = getZoomSize(history_data[i].width, history_data[i].height, img_width);
            var s_w  = parseInt((img_width + space_border * 2 - 41) / 2);
            var s_h  = parseInt((to_h - 34 + space_border) / 2);
            var step = i % col_num;
            var l_v  = step * col_width; 
            top_arr[step] = top_arr[step] > 0 ? top_arr[step] : 0;
            var t_v  = top_arr[step];
            html    += '<div class="col" style="top:'+t_v+'px;left:'+l_v+'px;animation:col_an'+step+' 2s;-webkit-animation:col_an'+step+' 2s;-moz-animation:col_an'+step+' 2s">';
            html    += '<div class="desc">';
            html    += '<a href="javascript:void(0);" onmouseover="jie.showHideSee(this, 1)" onmouseout="jie.showHideSee(this, 2)" onclick="jie.showDesc('+i+')"><img src="image/see.png" border="0px" class="see" style="top:'+s_h+'px;left:'+s_w+'px"/>';
            html    += '<img src="'+history_data[i].image2+'" border="0px" width="'+img_width+'px" height="'+to_h+'px"/></a>';
            html    += '<div class="forward"><a href="javascript:void(0);">转发</a></div>';
            html    += '<div>'+history_data[i].text+'</div>';
            html    += '</div></div>';
            var t_h = Math.ceil(history_data[i].text.length / line_letter) * letter_height;
            top_arr[step] += to_h + t_h + 60;
        }
        return html;
    }
    /**
     * 将JSON数据转换成html对象
     *
     * @param   int     index   要转换数据的开始位置
     */
    function JSONToHTMLObject(index) {
        for (var i in history_data) {
            if ( i < index) {
                continue;
            }
            var to_h = getZoomSize(history_data[i].width, history_data[i].height, img_width);
            var s_w  = parseInt((img_width + space_border * 2 - 41) / 2);
            var s_h  = parseInt((to_h - 34 + space_border) / 2);
            var step = i % col_num;
            var l_v  = step * col_width; 
            top_arr[step] = top_arr[step] > 0 ? top_arr[step] : 0;
            var t_v  = top_arr[step];
            var _div = CE('div');
            _div.className = 'col';
            _div.style.cssText = 'top:'+t_v+'px;left:'+l_v+'px;animation:col_an'+step+' 2s;-webkit-animation:col_an'+step+' 2s;-moz-animation:col_an'+step+' 2s';
            var html = '';
            html    += '<div class="desc">';
            html    += '<a href="javascript:void(0);" onmouseover="jie.showHideSee(this, 1)" onmouseout="jie.showHideSee(this, 2)" onclick="jie.showDesc('+i+')"><img src="image/see.png" border="0px" class="see" style="top:'+s_h+'px;left:'+s_w+'px"/>';
            html    += '<img src="'+history_data[i].image2+'" border="0px" width="'+img_width+'px" height="'+to_h+'px"/></a>';
            html    += '<div class="forward"><a href="javascript:void(0);" onclick="jie.forword('+i+')">转发</a></div>';
            html    += '<div>'+history_data[i].text+'</div>';
            html    += '</div>';
            _div.innerHTML = html;
            content_dom.appendChild(_div);
            top_arr[step] += _div.offsetHeight + col_space;
        }
    }
    /**
     * 数组排序
     *
     * @param   array   arr     要排序的数组
     * @return  array           排序后的数组
     */
    function sortArray(arr) {
        var _arr = [];
        var _a2  = [];
        for (var i in arr) {
            _arr[i] = arr[i];
        }
        _arr.sort(function(a,b){return a - b});
        for (var i in _arr) {
            for (var j in arr) {
                if (_arr[i] == arr[j]) {
                    _a2.push(j);
                }
            }
        }
    }
    /**
     * 获得缩放后的高
     *
     * @param   int     src_w   源尺寸-宽
     * @param   int     src_h   源尺寸-高
     * @param   int     to_w    缩放-宽
     * @return  int             缩放-高
     */
    function getZoomSize(src_w, src_h, to_w) {
        return parseInt(src_h * to_w / src_w);
    }
    /**
     * 获得页面可见区域的高宽
     *
     * @return  array   size[0] => 宽度, size[1] => 高度
     */
    function getBodySize() {
        var size = new Array();
        if (document.documentElement) {
            size[0] = document.documentElement.clientWidth;
            size[1] = document.documentElement.clientHeight;
        } else {
            size[0] = document.body.clientWidth;
            size[1] = document.body.clientHeight;
        }
        return size;
    }
    /**
     * 获得元素位置
     *
     * @param   object  dom     要获得位置元素的对象
     */
    function getPos(dom) {
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
    }
    /**
     * 获得页面滚动的高度
     */
    function getScrollTop() {
        return document.documentElement.scrollTop || window.pageYoffset || document.body.scrollTop;
    }
    /**
     * 设置内容页面的宽度
     */
    function setContentWidth() {
        content_dom.style.width = (col_num * col_width - col_space) + 'px';
    }
    /**
     * 设置单列信息
     */
    function setColInfo() {
        var size    = getBodySize();
        var div_w   = size[0] * 0.8;
        var _col_n  = Math.floor(div_w / col_width);
        _col_n      = _col_n > 0 ? ( _col_n > 5 ? 5 : _col_n ) : 1; 
        if (history_data.length > 0 && _col_n != col_num) {
            col_num = _col_n;
            changeColOffset();
        } else {
            col_num = _col_n;
        }
    }
    /**
     * 窗口大小改变时自适应
     */
    function changeColOffset() {
        top_arr = new Array();
        var div_dom = GCN('col', content_dom);
        for (var i = 0, max = div_dom.length; i < max; i++) {
            var step = i % col_num;
            var l_v  = step * col_width; 
            top_arr[step] = top_arr[step] > 0 ? top_arr[step] : 0;
            var t_v  = top_arr[step];
            div_dom[i].style.top = t_v + 'px';
            div_dom[i].style.left= l_v + 'px';
            top_arr[step] += div_dom[i].offsetHeight + col_space;
        }
        content_dom.style.height = top_arr[0] > 0 ? getArrayMax(top_arr) + 'px' : '0px';
    }
    /**
     * 页面滚动事件
     */
    window.onscroll = function() {
        if ( photo_desc == 1 ) {
        } else {
            if ( new_item == get_data_status == 1) {
                var size = getBodySize();
                var s_h  = getScrollTop();
                var m_h  = top_arr[0] > 0 ? getArrayMax(top_arr) : size[1];
                var _h   = size[1] * 0.05;
                if (size[1] + s_h >= m_h + _h) {
                    setData(index, page + 1);
                }
            }
        }
    }
    /**
     * 获得数组中最大的数字
     *
     * @param   array   arr     源数组
     * @return  int             数组中最大的数字
     */
    function getArrayMax(arr) {
        return Math.max.apply({}, arr);
    }
    /**
     * 外部调用的js
     */
    var jie = {
        history: history_length, loading_html : loading_html, no_loading_html : no_loading_html, base_url : base_url,
        /**
         * 显示/隐藏 查看大图
         *
         * @param   object  dom     当前a标签的对象
         * @param   int     val     显示的标识, 1 => 显示(默认), 2 => 隐藏
         */
        showHideSee: function(dom, val) {
            var val = val || 1;
            var img_dom = GTN('img', dom);
            img_dom[0].style.display = val == 1 ? 'block' : 'none';
        },

        /**
         * 显示详情
         *
         * @param   int     index   要显示的位置
         */
        showDesc: function(index) {
            var size    = getBodySize();
            var t_v     = getScrollTop();
            cover_dom.style.cssText = 'width:' + size[0] + 'px;height:' + size[1] + 'px;display:block;top:' + t_v + 'px';
            document.body.style.cssText = 'width:' + size[0] + 'px;height:' + size[1] + 'px;overflow:hidden;';
            var l_v = parseInt((parseInt(size[0]) - parseInt(history_data[index].width))/2);
            var w_v = parseInt(history_data[index].width) + 80;
            var h_v = parseInt(history_data[index].height);
            var html = '<div style="width:' + history_data[index].width + 'px;margin:0 auto;">';
            html += '<div style="text-align:center;line-height:30px;">可用键盘的<span style="color:#f80"> → </span>和<span style="color:#f80"> ← </span>切换图片</div>';
            html += '<img src="' + history_data[index].image1 + '" style="width:' + history_data[index].width + 'px" onmousemove="jie.photoCursor(event, this)" onclick="jie.photoClick(event, this)"/>';
            html += '<div>' + history_data[index].text + '</div>';
            html += '</div>';
            photo_dom.innerHTML = html;
            var l_h = Math.ceil(history_data[index].text.length / line_letter) * letter_height;
            var t_h = h_v + l_h + 10;
            var _h  = parseInt(size[1] * 0.8);
            _h      = t_h > _h ? _h : t_h;
            var p_h = parseInt(t_v + (size[1] - _h) / 2);
            photo_dom.style.cssText = 'display:block;top:' + p_h + 'px;left:' + l_v + 'px;width:' + w_v + 'px;height:' + _h + 'px';
            photo_index = index;
            photo_desc = 1;
        },
        /**
         * 隐藏相册
         */
        hidePhoto: function() {
            cover_dom.style.cssText = 'display:none';
            photo_dom.style.cssText = 'display:none';
            photo_desc = 0;
            document.body.style.cssText = 'overflow:auto';
        },
        photoCursor: photoCursor,
        photoClick: photoClick,
        /**
         * 转发代码
         */
        forword: function(index) {
            var _url    = 'http://v.t.sina.com.cn/share/share.php?title=' + encodeURIComponent(history_data[index].text);
            _url       += '&url=' + encodeURIComponent(history_data[index].url) + '&rcontent=';
            _url       += '&pic=' + encodeURIComponent(history_data[index].image1);
            window.open(_url, '_blank', 'scrollbars=no,width=600,height=450,left=75,top=20,status=no,resizable=yes');
        }
    }
    window.jie = jie;
})(window)
