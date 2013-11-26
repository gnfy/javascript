/**
 * 搜索
 */
var searchByKw = (function(){
    var s_dom = 0;
    var s_url = '([$search_base_url])';
    var G = function (val, dom) {
        dom = typeof(dom) == 'object' ? dom : window.document;
        return dom.getElementById(val);
    }
    var bind = function(obj, type, fn) {
        if (obj.attachEvent) {
            obj['e'+type+fn] = fn;
            obj[type+fn] = function(){obj['e'+type+fn](window.event)}
            obj.attachEvent('on'+type, obj[type+fn]);
        } else {
            obj.addEventListener(type, fn, false);
        }
    }
    var search = function() {
        if (s_dom == 0) {
            s_dom = G('search_keyword');
        }
        var val = s_dom.value;
        if (val != '关键字' && val != '') {
            window.open(s_url + encodeURIComponent(val));
        } else {
            alert('请输入关键字!');
            s_dom.focus();
        }
    }
    if (s_dom == 0) {
        s_dom = G('search_keyword');
    }
    bind(s_dom, 'keypress', function(evt){
        if (evt.keyCode == 13) {
            search();
        }
    });
    return {run:search, G:G, bind:bind}
})();
