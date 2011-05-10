var browser = {
    IE:navigator.userAgent.indexOf('MSIE') > -1,
    Opera:!!window.opera,
    WebKit:navigator.userAgent.indexOf("AppleWebKit/") > -1,
    Gecko:navigator.userAgent.indexOf("Gecko") > -1 && navigator.userAgent.indexOf("KHTML")==-1,
    MobileSafari:!!navigator.userAgent.match(/Apple.*Mobile.*Safari/)
}

var Bind = function(obj, fun, args){
    return function(){
        return fun.apply(obj, args||[]);
    }
}

// 设置cookie
var setCookie = function(name, val, t){
    var exp = new Date();
    exp.setTime(exp.getTime() + (t * 1000));
    document.cookie = name + "=" + escape(val) + ";expires="+ exp.toGMTString() + ";path=/";
}
// 获得cookie
var getCookie = function(name) {
    var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
    if ( arr != null) {
        return unescape(arr[2]);
    } else {
        return "";
    }
}

// 删除cookie
var delCookie = function(name) {
    var cval = getCookie(name);
    if ( cval != null ) document.cookie = name + "=" + cval + ";expires=Thu, 01-Jan-1970 00:00:01 GMT";
}

/**
 * 
 * 处理暂停
 *
 * @param int s 暂停单位秒
 */
var sleep = function(s) {

    var is_sleep = true;
    var startTime = new Date().getTime();
    while( is_sleep ){
        new Date().getTime() - startTime > s * 1000 ? is_sleep = false : '';
    }

}

var IFbeforeunload = {
    info: ["\u60a8\u5bf9\u8bcd\u6761\u5185\u5bb9\u7684\u4fee\u6539\u8fd8\u6ca1\u6709\u8fdb\u884c\u4fdd\u5b58\uff01", "\u60a8\u5bf9\u8bcd\u6761\u5185\u5bb9\u7684\u4fee\u6539\u5c1a\u672a\u53d1\u5e03\uff01"],
    set:function(){
        var b = this.info[0];
        window.onbeforeunload = function(d) {
            d = d || window.event;
            if ( browser.WebKit ) {
                return b;
            } else {
                d.returnValue = b;
            }
        }
    },
    clear:function(){
        window.onbeforeunload = function(){};
    }
}

var IFeditor = {
    width:'600',
    height:'100',
    // 基本路径
    basePath:'',
    // 可重做的历史记录
    history_num:10,
    // 添加的链接
    link:'http://www.ifeng.com',
    iframe:null,
    if_doc:null,
    // 没有选择字符提示
    no_select_val:'\u6ca1\u6709\u9009\u62e9\u53ef\u64cd\u4f5c\u7684\u5b57\u7b26',
    // 文本域没有ID或Name
    text_no_attr:'\u6587\u672c\u57df\u7684id\u6216name\uff0c\u4e0d\u5b58\u5728\uff01',
    // 没有可以撤销的记录
    no_undo:'\u6ca1\u6709\u53ef\u4ee5\u64a4\u9500\u7684\u8bb0\u5f55',
    // 没有可以重做的记录
    no_redo:'\u6ca1\u6709\u53ef\u4ee5\u91cd\u505a\u7684\u8bb0\u5f55',
    // 弹出层标题背景色
    pop_title_bg:'#709CD2',
    // 遮照层透明度(FF 标准)
    pop_cover_opacity:0.6,
    toolbar_config:['undo', 'redo', 'bold', 'italic', 'underline', 'strikethrough', 'insertorderedlist', 'insertunorderedlist', 'h2', 'h3', 'link',  'image', 'flash', 'specialchar'],
    toolbar_base:{
        'undo'                : [null,'\u64a4\u9500','IF_btn_undo IF_btn_disable','IF_btn_undo_on','act'],
        'redo'                : [null,'\u91cd\u505a','IF_btn_redo IF_btn_disable','IF_btn_redo_on','act'],
        'bold'                : [null,'\u7c97\u4f53','IF_btn_bold IF_btn_orgin','IF_btn_bold_on','command'],
        'italic'              : [null,'\u659c\u4f53','IF_btn_italic IF_btn_orgin','IF_btn_italic_on','command'],
        'underline'           : [null,'\u4e0b\u5212\u7ebf','IF_btn_under IF_btn_orgin','IF_btn_under_on','command'],
        'strikethrough'       : [null,'\u5220\u9664\u7ebf','IF_btn_strk IF_btn_orgin','IF_btn_strk_on','command'],
        'insertorderedlist'   : [null,'\u6709\u5e8f\u5217\u8868','IF_btn_orderlist IF_btn_orgin','IF_btn_orderlist_on','command'],
        'insertunorderedlist' : [null,'\u65e0\u5e8f\u5217\u8868','IF_btn_unorderlist IF_btn_orgin','IF_btn_unorderlist_on','command'],
        'link'                : [null,'\u8d85\u94fe\u63a5','IF_btn_link IF_btn_orgin','IF_btn_link_on','exec'],
        'unlink'              : [null,'\u53d6\u6d88\u94fe\u63a5','IF_btn_unlink IF_btn_disable','IF_btn_unlink_on','exec'],
        'image'               : [null,'\u6dfb\u52a0\u56fe\u7247','IF_btn_img IF_btn_orgin','IF_btn_img_on','exec'],
        'table'               : [null,'\u6dfb\u52a0\u8868\u683c','IF_btn_table','IF_btn_table_on','exec'],
        'flash'               : [null,'\u6dfb\u52a0\u52a8\u753b','IF_btn_flash IF_btn_orgin','IF_btn_flash_on','exec'],
        'specialchar'         : [null,'\u7279\u6b8a\u7b26\u53f7','IF_btn_spe IF_btn_orgin','IF_btn_spe_on','exec'],
        'h2'                  : [null,'\u4e00\u7ea7\u6807\u9898','IF_btn_h1 IF_btn_orgin','IF_btn_h1_on','exec'],
        'h3'                  : [null,'\u4e8c\u7ea7\u6807\u9898','IF_btn_h2 IF_btn_orgin','IF_btn_h2_on','exec'],
        'font'                : [null,this.fontFamily,'IF_btn_font','IF_btn_font_on','command'],
        'fontsize'            : [null,this.fontsize,'IF_btn_fontsize','IF_btn_fontsize_on','command']
    },
    fontFamily:{
        'simsun'            : '\u5b8b\u4f53',
        'liuu'              : '\u96b6\u4e66',
        'kaiti_gbk'         : '\u6977\u4e66',
        'youyuan'           : '\u5e7c\u5706',
        'simhei'            : '\u9ed1\u4f53',
        'fangsong'          : '\u4eff\u5b8b',
        'comic sans ms'     : 'Comic Sans MS',
        'microsoft yahei'   : '\u96c5\u9ed1'
    },
    fontsize:{
        1:'特小',
        2:'很小',
        3:'小',
        4:'中',
        5:'大',
        6:'很大',
        7:'特大'
    },
    keyMaps:{
        CTRL_Z: 1000 + 90,
        CTRL_Y: 1000 + 89
    },

    // 根据ID获得元素对象
    G:function(val) { 
        return document.getElementById(val);  
    },
    // 根据标签名获得对象
    GBTN:function(val){
        return document.getElementsByTagName(val);
    },
    // 根据名称获得元素对象
    GBN:function(val){ 
        return document.getElementsByName(val);
    },
    // 创建元素
    CE:function(val){ 
        return document.createElement(val);
    },
    replace:function(val) {
        // 获得文本域
        var t = this.G(val) || this.GBN(val)[0];
        if (val == '' || t == undefined) {alert(IFeditor.text_no_attr);return false;};
        t.name = val;
        t.id = val;
        t.style.display='none';
        
        // 获得form
        var t_form  = IFeditor.getFormByObj(t); 
        var if_div = this.CE('div');
        if_div.style.width=parseInt(this.width)-2 + 'px';
        var tool_div = if_div.cloneNode(true);
        if_div.style.height=this.height + 'px';
        if_div.className = 'content b_d';
        tool_div.className = 'toolbar b_d';
        t.parentNode.insertBefore(if_div, t);
        this.attr(tool_div, 'event', 'tool_bar');
        t.parentNode.insertBefore(tool_div, if_div);
        
        // 创建iframe
        iframe = this.CE('iframe');
        this.iframe = iframe;
        iframe.frameBorder=0;
        iframe.style.width=parseInt(this.width)-2 + 'px';
        iframe.style.height=this.height + 'px';
        
        // 添加iframe
        if_div.appendChild(iframe);
        if_doc = browser.IE ? iframe.contentWindow.document : iframe.contentDocument;
        this.if_doc = if_doc;
        // --------------- 兼容IE FF 文本输入 ---------------
        if_doc.open();
        var div = '', t_val = '';
        
        if (t.value) {
            t_val = t.value;
        } else {
            t_val = '';
        }
        if (t_val) {
            div = t_val;
        } else {
            div = browser.IE ? '<div></div>' : '';
        }
        if_doc.write('<html><head><style>body{font-size:14px;word-wrap:break-word;}h2{border-bottom:1px solid #DEDFE1;font-size:18px;font-weight:bold;line-height:24px;margin:30px 0 20px;padding-bottom:6px;}h3{font-size:16px;line-height:22px;margin:10px 0;}a{color:#3366CC;text-decoration:underline;}</style></head><body>'+div+'</body></html>');
        if_doc.close();
        // --------------- 兼容IE FF 文本输入 ---------------
        if_doc.designMode = 'on';
        var is_format = 1;
        // 当编辑区域监听鼠标事件,应该绑定到iframe的对象上，才能兼容IE FF
        this.addEvent(if_doc, 'mousedown', function(){elm_state();});
        this.addEvent(if_doc, 'mouseup', function(){elm_state();});
        var elm_state = function() {
            is_format = 1;
            is_save = 1;
            var elm = ['bold', 'italic', 'underline', 'strikethrough', 'insertorderedlist', 'insertunorderedlist'];
            var Is = null;
            if (IFeditor.getCursorNode() == null) return false; 
            var _b = IFeditor.getCursorNode().nodeName;
            var spec_com = ['h2', 'h3', 'link'];
            if (_b == 'H2' || _b == 'A' || _b=='H3'){
                _b = _b.toLowerCase();
                is_format = _b;
                if (_b == 'a') {
                    if (IFeditor.toolbar_base['link'][0] != null) {
                        IFeditor.toolbar_base['link'][0].className = IFeditor.toolbar_base['unlink'][3];
                        IFeditor.attr(IFeditor.toolbar_base['link'][0], 'title', IFeditor.toolbar_base['unlink'][1]);
                        IFeditor.toolbar_base['link'][0].active = true;
                        IFeditor.toolbar_base['link'][0].parentNode.className = 'act_bg';
                    }
                } else {
                    if (IFeditor.toolbar_base[_b][0] != null) {
                        IFeditor.toolbar_base[_b][0].className = IFeditor.toolbar_base[_b][3];
                        IFeditor.toolbar_base[_b][0].active = true;
                        IFeditor.toolbar_base[_b][0].parentNode.className = 'act_bg';
                    }
                }
            } else {
            
                for(var i = 0, j = elm.length; i < j; i++){
                    if (IFeditor.toolbar_base[elm[i]][0] == null) continue;
                    Is = if_doc.queryCommandState(elm[i]);
                    IFeditor.toolbar_base[elm[i]][0].className = Is ? IFeditor.toolbar_base[elm[i]][3] : IFeditor.toolbar_base[elm[i]][2];
                    IFeditor.toolbar_base[elm[i]][0].active = Is;
                    IFeditor.toolbar_base[elm[i]][0].parentNode.className = Is ? 'act_bg'  : '';
                }
            
            }
        };
        // 编辑区域侦听键盘事件
        this.addEvent(if_doc, 'keydown', function(c){
            var a = IFeditor.keyMaps;
            var b = 0;
            var c = window.event || c;
            var d = c.keyCode || c.charCode || c.which;
            if ( c.ctrlKey || c.meateKey ) {
                 b += 1000;
            }
            b += d;
            switch (b) {
                case a.CTRL_Z:
                    // 由于浏览器本身会进行处理，因此延时处理，方案兼容IE，WebKit内核的浏览器
                    setTimeout(doUndo, 10);
                    break;
                case a.CTRL_Y:
                    setTimeout(doRedo, 10); 
                    break;
                default:
                    // 延时处理，方便兼容ctrl+c,ctrl+v,ctrl+x
                    setTimeout(is_input, 10);
                    break;
                
            }
        });
        // 生成工具栏
        for(var i = 0, j = this.toolbar_config.length; i < j; i++) {
            var div_span  = this.CE('div');
            var tool_span = this.CE('span');
            div_span.style.cssText = 'cursor:pointer;width:30px;height:30px;line-height:12px;float:left;margin-left:6px;text-align:center;';
            var tools = this.toolbar_config[i];
            tool_span.className = this.toolbar_base[tools][2];
            tool_span.innerHTML = '&nbsp;';
            if (tools != 'fontSize' && tools != 'fontFamily') {
                this.attr(div_span, 'title', this.toolbar_base[tools][1]).attr(div_span, 'command', this.toolbar_base[tools][4]+'@'+tools).attr(div_span, 'unselectable', 'on');
                this.attr(tool_span, 'title', this.toolbar_base[tools][1]).attr(tool_span, 'unselectable', 'on').attr(tool_span, 'command', this.toolbar_base[tools][4]+"@"+tools);
            }
            this.addEvent(div_span, 'mouseover', Bind(IFeditor, IFeditor.changeBgColor, [tool_span, 1]));
            this.addEvent(div_span, 'mouseout', Bind(IFeditor, IFeditor.changeBgColor, [tool_span,  2]));
            div_span.appendChild(tool_span);
            tool_div.appendChild(div_span);
            // 存放对象
            this.toolbar_base[tools][0] = tool_span; 
            tool_span = null;
            div_span  = null;
        }
        // 绑定事件
        this.addEvent(tool_div, 'click', function(){
            var e = arguments[0] || window.event, target = e.srcElement || e.target, c = IFeditor.attr(target, 'command').split('@');
            if ( c[0] != undefined ){
                switch (c[0]) {
                    case 'command':
                        is_save = 1;
                        IFeditor.command(c[1]);
                        elm_state();
                        break;
                    case 'act':
                        switch(c[1]){
                            case 'undo':
                                doUndo();
                                break;
                            case 'redo':
                                doRedo();
                                break;
                        };
                        break;
                    case 'exec':
                        is_save = 1;
                        switch(c[1]){
                            case 'link':
                                var n_name = IFeditor.getCursorNode().nodeName.toLowerCase();
                                if (n_name == 'a' && is_format == n_name) {
                                    cancelSpeCom();
                                    IFeditor.attr(IFeditor.toolbar_base['link'][0], 'title', IFeditor.toolbar_base['link'][1]);
                                } else {
                                    var href_val = IFeditor.getSelectedText();
                                    if (href_val != '') {
                                        var html = '<a href="'+IFeditor.link+'" target="_blank">'+href_val+'</a>';
                                        IFeditor.insertHTMLToIF(html);
                                    } else {
                                        alert(IFeditor.no_select_val);
                                    }
                                }
                                break;
                            case 'specialchar':
                                insertChar();  
                                break;
                            case 'flash':
                                insertFlash();
                                break;
                            case 'image':
                                insertImage();
                                break;
                            case 'h2':
                                if ( is_format == 'h2' ){
                                    cancelSpeCom();
                                } else {
                                    var h2_val = IFeditor.getSelectedText();
                                    if (h2_val != '') {
                                        var html = '<h2>'+IFeditor.getSelectedText()+'</h2>';
                                        IFeditor.insertHTMLToIF(html);
                                    } else {
                                        alert(IFeditor.no_select_val);
                                    }
                                }
                                break;
                            case 'h3':
                                if ( is_format == 'h3' ){
                                    cancelSpeCom();
                                } else {
                                    var h3_val = IFeditor.getSelectedText();
                                    if (h3_val != '') {
                                        var html = '<h3>'+h3_val+'</h3>';
                                        IFeditor.insertHTMLToIF(html);
                                    } else {
                                        alert(IFeditor.no_select_val);
                                    }
                                }
                                break;
                        };
                        break;
                }
            }
        });
        // 输入的状态判断
        var is_input = function() {
            // ------ 判断状态是否发生改变 start ------
            var if_val = IFeditor.if_doc.body.innerHTML.toLowerCase();
            if (if_val == '<div></div>' || if_val == '<br>' ) return;
            if (IFeditor.if_doc.body.innerHTML == t.value) return;
            // ------ 判断状态是否发生改变 end ------
            IFbeforeunload.set();
            is_save = 1;
            // 撤销提示(可操作)
            IFeditor.toolbar_base['undo'][0].className = IFeditor.toolbar_base['undo'][3];
            IFeditor.toolbar_base['undo'][0].parentNode.active = true;
        }

        // 取消特殊操作
        var cancelSpeCom = function() {
            var n_name = IFeditor.getCursorNode().nodeName.toLowerCase();
            var n_html = IFeditor.getCursorNode().innerHTML;
            var p_node = IFeditor.getCursorNode().parentNode;
            if (browser.WebKit) {
                
                var span = IFeditor.CE('span');
                span.innerHTML = n_html;
                p_node.insertBefore(span, IFeditor.getCursorNode());
                p_node.removeChild(IFeditor.getCursorNode());
                span = null;
                
            } else {
                p_node.removeChild(IFeditor.getCursorNode());
                IFeditor.insertHTMLToIF(n_html);
            }
            if (n_name == 'a') {
                n_name = 'link';
            }
            IFeditor.toolbar_base[n_name][0].className = IFeditor.toolbar_base[n_name][2];
            IFeditor.toolbar_base[n_name][0].active = false;
            IFeditor.toolbar_base[n_name][0].parentNode.className = '';
        }
        // 特殊符号
        var insertChar = function() {
            IFeditor.create_pop(IFeditor.basePath+'plugins/char.html', 500, 300, '\u7279\u6b8a\u7b26\u53f7'); 
        };
        // 添加动画
        var insertFlash = function(){
            IFeditor.create_pop(IFeditor.basePath+'plugins/flash.html', 510, 120, '\u6dfb\u52a0\u52a8\u753b');
        };
        // 添加图片
        var insertImage = function(){
            IFeditor.create_pop(IFeditor.basePath+'plugins/image.html', 560, 220, '\u6dfb\u52a0\u56fe\u7247');
        }
        
        // 将编辑器中的内容放入文本域中,有form时，提交时处理
        if ( t_form == null ) {
            this.addEvent(iframe.contentWindow, 'blur', function(){
                t.value = IFeditor.if_doc.body.innerHTML;
            });
        } else {
            this.addEvent(t_form, 'submit', function(){
                IFbeforeunload.clear();
                t.value = IFeditor.if_doc.body.innerHTML;
            });
        }
        
        // IE 鼠标切换，回到之前位置
        if ( browser.IE ) {
            var bookmark;
            // IE 失去焦点
            this.addEvent(iframe, 'beforedeactivate', function() { 
                var if_body = this.if_doc.body.innerHTML
                if (if_body.length > 0) {
                    var range = if_doc.selection.createRange();
                    bookmark = range.getBookmark();
                }
            });
            // IE 获得焦点
            this.addEvent(iframe, 'activate', function() { 
                if (bookmark) {
                    var range = if_doc.body.createTextRange();
                    range.moveToBookmark(bookmark);
                    range.select();
                    bookmark = null;
                }
            });
            
        };
        
        var is_save = 1;
        var un_num  = 0;
        var re_num  = 0;
        var restore = new Array();
        // 保存历史
        var saveHistory = function(){ 
            if ( un_num > 0 ) {
                if ( if_doc.body.innerHTML != restore[restore.length - 1] && is_save == 1 ) {
                    
                    if (restore.length >= IFeditor.history_num) {
                        restore.shift();
                    }
                    restore[restore.length] = if_doc.body.innerHTML;
                    un_num = restore.length;
                }
            } else {
               restore[un_num] = if_doc.body.innerHTML; 
               un_num++;
               // 撤销与重做 不可操作
               IFeditor.toolbar_base['undo'][0].parentNode.active = true;
               IFeditor.toolbar_base['redo'][0].parentNode.active = true;
            }
            setTimeout(saveHistory, 500);
        }
        setTimeout(saveHistory, 100);
        // 撤销操作
        var doUndo = function() {
            if (un_num > re_num && un_num > 1){
                re_num++;
                // 重做提示(可操作)
                IFeditor.toolbar_base['redo'][0].className=IFeditor.toolbar_base['redo'][3];
                IFeditor.toolbar_base['redo'][0].parentNode.active = false;
            } else {
                alert(IFeditor.no_undo);
            }
            is_save = 2;
            if (restore[restore.length-1-re_num] != undefined) {
                if_doc.body.innerHTML = restore[restore.length-1-re_num];
            }
            if ( re_num == un_num ){
                // 撤销提示(不可操作)
                IFeditor.toolbar_base['undo'][0].className = IFeditor.toolbar_base['undo'][2];
                IFeditor.toolbar_base['undo'][0].parentNode.className = '';
                IFeditor.toolbar_base['undo'][0].parentNode.active = true;
            }

        };
        // 重做操作
        var doRedo = function(){
            if ( re_num > 0 ) {
                re_num--;
                // 撤销提示(可操作)
                IFeditor.toolbar_base['undo'][0].className = IFeditor.toolbar_base['undo'][3];
                IFeditor.toolbar_base['undo'][0].parentNode.active = false;
            } else {
                alert(IFeditor.no_redo);
            }
            is_save = 2;
            if ( restore[restore.length-1-re_num] != undefined ) {
               if_doc.body.innerHTML = restore[restore.length-1-re_num];
            }
            if ( re_num == 0 ){
                // 重做提示(不可操作)
                IFeditor.toolbar_base['redo'][0].className=IFeditor.toolbar_base['redo'][2];
                IFeditor.toolbar_base['redo'][0].parentNode.className = '';
                IFeditor.toolbar_base['redo'][0].parentNode.active = true;
            }
        };
    },
    // 获得指定对象所属的form
    getFormByObj:function(obj){
        var f = null;
        if (obj.nodeName == 'form') return obj;
        while (obj) {
            if (obj.nodeName.toLowerCase() == 'form') {
                f = obj;
                obj = null;
                break; 
            }
            if (obj.nodeName.toLowerCase() == 'body') break;
            obj = obj.parentNode;
        }
        return f;
    },
    // 执行命令
    command:function(type, val){
        this.if_doc.execCommand(type, false, val);
        this.iframe.contentWindow.focus();
    },
    // 添加文本
    insertHTMLToIF:function(html){
        iframe.contentWindow.focus();
        // ------ 判断状态是否发生改变 end ------
        IFbeforeunload.set();
        if (browser.IE) {
            this.if_doc.selection.createRange().pasteHTML(html);
        } else {
            IFeditor.command('insertHTML', html);
        }
    },
    // 获得iframe编辑器里面的内容
    getEditorContent:function(){
        return IFeditor.if_doc.body.innerHTML;
    },
    // 设置编辑器里的内容
    setEditorContent:function(val) {
        IFeditor.if_doc.body.innerHTML = val;
    },
    // 获得选择文本
    getSelectedText:function(){
        if (browser.IE){
            return this.if_doc.selection.createRange().text;
        } else {
           return IFeditor.getMySelection();
        }
    },
    // 获得光标位置的所属的元素对象
    getCursorNode:function(){
        if(browser.IE){
            b=this.getRange();
            if(b){
                e=b.item?b.item(0):b.parentElement()
            }
            return e;
        } else {
            var a = this.getMySelection();
            if (browser.WebKit) {
                var b = this.getRange();
                if (b == null) return false;
                if (b.startContainer){
                    if (b.startContainer.nodeType == 3) {
                        return b.startContainer.parentNode;
                    } else if(b.startContainer.nodeType == 1) {
                        return b.startContainer;
                    }
                }
            } else {
                return a.anchorNode.parentNode;
            }
        }
    },
    // 获得Selection
    getMySelection:function() {
        if(this.iframe.contentWindow.getSelection){
            return this.iframe.contentWindow.getSelection()
        } else {
            return this.if_doc.selection;
        }
    },
    // 获得Range
    getRange:function() {
        var b = this.getMySelection();
        var a = null;
        if( b.getRangeAt ) {
            if (browser.WebKit) {
                if ( b.rangeCount > 0 ) {
                    a = b.getRangeAt(0);
                }
            } else {
                a=b.getRangeAt(0);
            }
        } else {
            if(b.baseNode) {
                a=this.if_doc.createRange();
                a.setStart(b.baseNode,b.baseOffset);
                a.setEnd(b.extentNode,b.extentOffset);
                if(a.collapsed) {
                    a.setStart(b.extentNode,b.extentOffset);
                    a.setEnd(b.baseNode,b.baseOffset);
                }
            } else {
                a=b.createRange();
            }
        }
        return a
    },
    getText:function() {
        var a=this.getRange();
        return a ? (browser.IE ? a.text : a.toString()):null
    },
    getSelectedElement:function() {
        var d=this.if_doc,c=null,b=null,a=true,e=null;
        if(browser.IE){
            b=this.getRange();
            if(b){
                e=b.item?b.item(0):b.parentElement()
            }
        } else {
            c=this.getMySelection();
            b=this.getRange();
            if(!c||!b){
                return null
            }
            if(browser.WebKit){
                if(b.startContainer){
                    a=false;
                    if(b.startContainer.nodeType==3){
                        e=b.startContainer.parentNode
                    } else {
                        if(b.startContainer.nodeType==1){
                            e=b.startContainer
                        } else {
                            a=true
                        }
                    }
                }
            }
            if(a){
                if(c.anchorNode&&(c.anchorNode.nodeType==3)){
                    if(c.anchorNode.parentNode){
                        e=c.anchorNode.parentNode;
                    }
                    if(c.anchorNode.nextSibling!=c.focusNode.nextSibling){
                        e=c.anchorNode.nextSibling;
                    }
                }
                if(!e) {
                    e=b.commonAncestorContainer;
                    if(!b.collapsed) {
                        if(b.startContainer==b.endContainer) {
                            if(b.startOffset-b.endOffset<2) {
                                if(b.startContainer.hasChildNodes()) {
                                    e=b.startContainer.childNodes[b.startOffset]
                                }
                            }
                        }
                    }
                }
            }
        }
        return e||this.if_doc.body
    },
    // 创建弹出层
    create_pop:function(url, w, h, t){
        var _body = this.GBTN('body')[0];
        var div = this.CE('div');
        var div_cover = div.cloneNode(true);
        var div_title = div.cloneNode(true);
        div_cover.id = 'IFeditor_pop_div_cover';
        div.id = 'IFeditor_pop_div';
        var IE_op = this.pop_cover_opacity * 100;
        div.style.cssText = 'overflow:hiden;position:absolute;top:120px;left:280px;text-align:center;border:1px solid #ddd;z-index:999;width:'+w;
        div_cover.style.cssText = 'position:absolute;top:0;left:0;z-index:998;width:100%;height:100%;background-color:#ddd;filter:alpha(opacity='+IE_op+');opacity:'+this.pop_cover_opacity+';';
        div_title.style.cssText = 'line-height:30px;background-color:'+this.pop_title_bg+';height:30px;width:'+w;
        var img_span = this.CE('span');
        t_span = img_span.cloneNode(true);
        t_span.style.cssText = 'float:left;text-align:left;text-align:left;margin-left:6px;font-weight:bold;';
        img_span.style.cssText = 'float:right;margin-right:6px;margin-top:6px;';
        t_span.innerHTML = t;
        var img = this.CE('img');
        this.attr(img, 'src', IFeditor.basePath+'images/close.gif').attr(img, 'border', '0').attr(img, 'title', '\u5173\u95ed');
        img_span.appendChild(img);
        img = null;
        div_title.appendChild(t_span);
        t_span = null;
        div_title.appendChild(img_span);
        img_span = null;
        div.appendChild(div_title);
        div_title = null;
        div_html = '<iframe src="'+url+'" width="'+w+'" height="'+h+'" frameborder="0"></iframe>';
        div.innerHTML += div_html;
        _body.appendChild(div_cover);
        _body.appendChild(div);
        // 侦听遮照层点击事件
        this.addEvent(div_cover, 'click', function(){ 
                IFeditor.destroy_pop();
        });
        // 侦听关闭事件
        this.addEvent(div, 'click', function(){ 
            var e = arguments[0] || window.event, target = e.srcElement || e.target;
            if ( IFeditor.attr(target, 'title') == '\u5173\u95ed') {
                IFeditor.destroy_pop();
            }
        });
    },
    // 销毁弹出层
    destroy_pop:function() {
        var _body = this.GBTN('body')[0];
        if (div_cover = this.G('IFeditor_pop_div_cover')) {
            div_cover.style.display = 'none';
            _body.removeChild(div_cover);
        }
        if (div = this.G('IFeditor_pop_div')) {
            div.style.display = 'none';
            _body.removeChild(div);
        }
        
    },
    // 获得或设置 元素属性
    attr:function(e, type, val){
        if (val) {
            e.setAttribute(type, val);
            return this;
        } else {
            return e.getAttribute(type);
        }
    },
    // 绑定元素事件
    addEvent:function(e, type, fun){
        if (browser.IE) {
            e.attachEvent('on'+type, fun);
        } else {
            e.addEventListener(type, fun, false);
        }
    },
    // 改变背景颜色
    changeBgColor:function(o, a){
        if (o.parentNode.active) return;
        o.parentNode.className = a == 1 ? 'act_bg' : '';
    }
}
