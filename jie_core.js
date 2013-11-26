/**
 * ********************************************
 * Description   : 不得姐相关脚本
 * Filename      : jie_core.js
 * Create time   : 2012-02-21 18:33:46
 * Last modified : 2012-03-02 11:01:04
 * License       : MIT, GPL
 * ********************************************
 */
(function() {
    var content_dom,                        // 窗口DOM对象
        img_width       = 206,              // 图片的宽度
        col_width       = 245,              // 单列的宽度
        col_space       = 15,               // 单列的间隙
        col_num         = 4,                // 当前的列数
        history_data    = new Array(),      // 历史数据
        history_length  = 40,               // 最大的历史记录
        top_arr         = new Array(),      // top的信息
        base_url        = '',               // 基本URL
        cover_dom,                          // 遮照层的DOM
        window_dom,                         // 弹窗层的DOM
        tag_sel_arr     = new Array(),      // 已选标签的内容
        new_item        = 1,                // 是否还有新的条目 1 => 有(默认)
        continue_loading_status = 1,        // 是否可以继续加载, 1 => 可以, 2 => 不行
        get_data_status = 0,                // 页面新数据的状态 0 => 获取数据未完成(默认), 1 => 获得数据完成
        order_value     = 0,                // 排序方式
        page            = 1,                // 页码
        item_length     = 10,               // 一页显示多少条
        maxid           = 0,                // 最大的ID
        nav_index       = 0,                // 导航位置, 0 => 默认首页
        next_page_dom,                      // 翻页的对象
        page_url,                           // 基本的翻页的URL
        tag_add_api,                        // 标签添加的接口
        tag_img_api,                        // 标签图片的接口
        tag_data,                           // 标签的数据
        home_page_url,                      // 个人中心URL
        animation_time  = 2                 // 动画的时间
    ;
    var jie_core = {
        content_id      : 'content',
        content_dom     : content_dom,
        init_data       : [],
        tag_img_api     : tag_img_api,
        tag_add_api     : tag_add_api,
        tag_data        : tag_data,
        base_url        : base_url,
        animation_time  : animation_time,
        cover_dom       : cover_dom,
        window_dom      : window_dom,
        order_value     : order_value,
        maxid           : maxid, 
        history_data    : history_data,
        history_length  : history_length,
        next_page_dom   : next_page_dom,
        page_url        : page_url,
        img_width       : img_width,
        col_width       : col_width,
        col_space       : col_space,
        col_num         : col_num,
        base_data_url   : page_url,
        top_arr         : top_arr,
        tag_sel_arr     : tag_sel_arr,
        item_length     : item_length,
        page            : page,
        get_data_status : get_data_status,
        nav_index       : nav_index,
        home_page_url   : home_page_url,
        continue_loading_status : continue_loading_status,
        /**
         * 初始化
         */
        init : function () {
            base_url        = this.base_url;
            cover_dom       = this.cover_dom;
            window_dom      = this.window_dom;
            animation_time  = this.animation_time;
            order_value     = this.order_value;
            maxid           = this.maxid;
            history_length  = this.history_length;
            next_page_dom   = this.next_page_dom;
            col_space       = this.col_space;
            col_width       = this.col_width;
            col_num         = this.col_num;
            img_width       = this.img_width;
            page_url        = this.page_url;
            tag_img_api     = this.tag_img_api;
            tag_add_api     = this.tag_add_api;
            tag_data        = this.tag_data;
            nav_index       = this.nav_index;
            home_page_url   = this.home_page_url;
            page            = parseInt(this.page);
            this.history_data    = new Array();
            for (var i in this.init_data) {
                this.history_data.push(this.init_data[i]);
            }
        },
        /**
         * 运行
         */
        run : function () {
            this.init();
            content_dom     = gScript.G(this.content_id);
            // 绑定事件
            gScript.addEvent(cover_dom, 'click', this.hideCover);
            // 重构分页
            createTurnPageHTML();
            showData(2, this.history_data);
        },
        /**
         * 显示当前标签的状态
         *
         * @param   int     val     显示的标识符, 1 => 显示，2 => 隐藏
         * @param   object  dom     操作对象 
         */
        showCol : function(val, dom) {
            var _dom = gScript.GCN('fucen', dom)[0];
            if (val == 1) {
                dom.className       = 'content-left';
                _dom.style.display  =  'block';
            } else {
                dom.className       = 'content-left1';
                _dom.style.display  =  'none';
            }
        },
        /**
         * 显示隐藏分享
         *
         * @param   int     _val    ID标识
         * @param   int     _type   显示标识
         */
        showHideShare : function(_val, _type) {
            var fc_dom  = gScript.G('fucen_' + _val);
            var fc1_dom = gScript.G('fucen1_' + _val);
            if (_type == 1) {
                fc_dom.style.display    = 'none';
                fc1_dom.style.display   = '';
            } else {
                fc1_dom.style.display   = 'none';
                fc_dom.style.display    = '';
            }
        },
        /**
         * 转发代码
         *
         * @param   int     _mid    微博ID
         * @param   string  _url    URL
         */
        forward : function(_mid, _did, _url) {
            var user_info   = this.getUserInfo();
            if (user_info   == '' || user_info.length < 60) {
                checkLogin();
            } else {
                var src_data = this.history_data;
                for (var i in src_data) {
                    if (src_data[i].id == _did) {
                        var _data   = src_data[i];
                    }
                }
                var size    = gScript.getBodySize();
                var t_v     = gScript.getScrollTop();
                var l_v     = parseInt((parseInt(size[0]) - 430)/2);
                var p_h     = parseInt(t_v + 20);
                var _size   = gScript.getZoomSize({w:_data.width, h:_data.height}, {w:168, h:229});
                cover_dom.style.cssText     = 'width:' + size[0] + 'px;height:' + size[1] + 'px;display:block;top:' + t_v + 'px';
                document.body.style.cssText = 'width:' + size[0] + 'px;height:' + size[1] + 'px;overflow:hidden;';
                var html    = '<div class="zhuanfa"><div class="zhuanfa1">';
                html       += '<p class="biaotbg"><span>转发</span><a href="javascript:void(0)" onclick="jie_core.hideCover()"><img src="images/grayx.png" /></a></p>';
                html       += '<div class="zf-center clesryl">';
                html       += '<div class="zf-left floatl"><img src="'+_data.image2+'" width="'+_size[0]+'px" height="'+_size[1]+'px"/></div>';
                html       += '<div class="zf-right floatr">';
                html       += '<select size="1" class="xl" id="forward_to"><option value="sina">转发到新浪微博</option></select>';
                html       += '<input type="hidden" value="'+_url+'" id="forward_base_url"/>';
                html       += '<input type="hidden" value="'+_mid+'" id="forward_mid"/>';
                html       += '<input type="hidden" value="'+_did+'" id="forward_id"/>';
                html       += '<textarea class="text1" id="forward_txt"></textarea>';
                html       += '<div id="forward_notice" class="forward_notice"></div>';
                html       += '<input  type="button" value="" class="zfan" onclick="jie_core.forward_act()" id="forward_submit"/>';
                html       += '<input type="button" value="关闭" onclick="jie_core.hideCover()" style="display:none" id="forward_close"/>';
                html       += '</div></div></div></div>';
                window_dom.innerHTML        = html;
                window_dom.style.cssText    = 'display:block;overflow:hidden;left:'+l_v+'px;top:'+p_h+'px';
            }
        },
        /**
         * 转发操作
         */
        forward_act : function() {
            var user_info   = this.getUserInfo();
            if (user_info   == '' || user_info.length < 60) {
                checkLogin();
            } else {
                var _url        = gScript.G('forward_base_url').value;
                var _did        = gScript.G('forward_id').value;
                var _mid        = gScript.G('forward_mid').value;
                var _txt        = gScript.G('forward_txt').value;
                var _n_dom      = gScript.G('forward_notice');
                var data_url    = '/api/repost_sina.php';
                var _data       = {id: _mid, text : _txt + ' 转发自(@百思不得姐应用) ' + _url + 'detail-' + _did + '.html'};
                _n_dom.innerHTML= '';
                var _close_dom  = gScript.G('forward_close');
                var _submit_dom = gScript.G('forward_submit');
                gAjax.request({
                        url     : data_url,
                        data    : _data,
                        dataType: 'json',
                        method  : 'post',
                        success : function(ret) {
                            if (ret == 0) {
                                _n_dom.innerHTML = '转发成功';
                                _close_dom.style.cssText    = 'display:block;margin-left:78px;';
                                _submit_dom.style.cssText   = 'display:none;';
                            } else if (ret == 1) {
                                _n_dom.innerHTML = '请不要重复转发该微博';
                                _close_dom.style.cssText    = 'display:block;margin-left:78px;';
                                _submit_dom.style.cssText   = 'display:none;';
                            } else if (ret == 2) {
                                _n_dom.innerHTML = '要转发的微博已被作者删除，无法继续转发';
                                _close_dom.style.cssText    = 'display:block;margin-left:78px;';
                                _submit_dom.style.cssText   = 'display:none;';
                            } else if (ret == 3 || ret == 4) {
                                this.clearUserInfo();
                                checkLogin();
                            } else {
                                _n_dom.innerHTML = '转发失败';
                            }
                        }
                    });
            }
        },
        /**
         * 隐藏遮照DIV
         */
        hideCover : function() {
            cover_dom.style.cssText = 'display:none';
            window_dom.style.cssText = 'display:none';
            document.body.style.cssText = 'overflow:auto';
        },
        /**
         * 评价初始化
         *
         * @param   int     val     当前记录的序号
         */
        pj_init : function(val) {
            checkLogin();
            var _data   = jie_core.history_data[val];
            var size    = gScript.getBodySize();
            var t_v     = gScript.getScrollTop();
            var l_v     = parseInt((parseInt(size[0]) - 620)/2);
            var p_h     = parseInt(t_v + 20);
            var _size   = gScript.getZoomSize({w:_data.width, h:_data.height}, {w:200, h:300});
            gScript.G('pj_data_index').value = val;
            gScript.G('pj_img').src     = _data.image2;
            gScript.G('pj_img').style.cssText = 'width:'+_size[0]+'px;height:'+_size[1]+'px';
            cover_dom.style.cssText     = 'width:' + size[0] + 'px;height:' + size[1] + 'px;display:block;top:' + t_v + 'px';
            document.body.style.cssText = 'width:' + size[0] + 'px;height:' + size[1] + 'px;overflow:hidden;';
            // 创建美女标签
            createGirlTag();
            tag_sel_arr = new Array();
            window_dom.style.cssText    = 'display:block;overflow:hidden;left:'+l_v+'px;top:'+p_h+'px';
        },
        /**
         * 添加自定义标签
         */
        addTag : function() {
            var dom  = gScript.G('add_tag');
            var _tag = dom.value;
            var _add = 0;
            for (var i in tag_rank) {
                if (tag_rank[i] == _tag) {
                    _add = 1;
                    break;
                }
            }
            var msg         = '';
            var notice_dom  = gScript.G('common_notice');
            if (_add == 0) {
                if (_tag.length > 0) {
                    var _dom        = gScript.CE('span');
                    _dom.innerHTML  = '<input type="button" value="'+_tag+'" class="pj_tag" onclick="jie_core.tag_sel(\''+_tag+'\', this)" style="background:#c60"/>';
                    dom.value       = '';
                    this.tag_sel_arr.push(_tag);
                    tag_rank.push(_tag);
                    dom.parentNode.insertBefore(_dom, dom);
                } else {
                    msg = '请不要添加空的标签';
                }
            } else {
                msg = '该标签已被添加过了,请不要重复添加';
            }
            if (msg.length > 0 && notice_dom) {
                notice_dom.innerHTML = '<div>'+msg+'</div>';
                showCommonNotice();
            }
        },
        /**
         * 翻页
         *
         * @param   int     _val    翻页标识 1 => 上一页, 2 => 下－页
         */
        turnPage : function(_val) {
            var _page   = _val == 1 ? page - 1 : page + 1;
            _page       = _page > 0 ? _page : 1;
            location.href = getURL(this.page_url, _page);
        },
        /**
         * 动作操作
         *
         * @param   string  _act    操作内容
         * @param   int     _did    贴子ID
         * @param   int     _mid    微博ID
         * @param   int     _uid    用户ID
         * @param   object  _dom    当前操作的dom
         */
        dong_act : function(_act, _did, _mid, _uid, _dom) {
            var user_info   = this.getUserInfo();
            if (user_info   == '' || user_info.length < 60) {
                checkLogin();
            } else {
                var _type = 3;
                if (_act == 'favorite_create') {
                    _type   = 4;
                    _act    = favorite_type == 0 ? 'create' : 'destroy';
                } else if (_act == 'favorite_destroy') {
                    _type   = 4;
                    _act    = 'destroy';
                    _act    = favorite_type == 1 ? 'destroy' : 'create';
                }
                var data_url    = '/api/data.php';
                gAjax.request({
                    url     : data_url,
                    data    : {text: _act, did: _did, mid: _mid, uid: _uid, type: _type},
                    dataType: 'json',
                        method  : 'post',
                        success : function(ret) {
                            var notice_dom = gScript.G('common_notice');
                            if (ret == 0) {
                                var msg = '操作成功';
                                if (_act == 'love') {
                                    var love_dom        = gScript.G('love_num_' + _did);
                                    if (love_dom) {
                                        love_dom.innerHTML  = parseInt(love_dom.innerHTML) + 1;
                                    }
                                    msg = '喜欢成功';
                                    var _status_dom = gScript.GN('love_status_' + _did);
                                    for (var i in _status_dom) {
                                        _status_dom[i].innerHTML = '<img src="images/sypl_1.png"/>';
                                    }
                                    if (_dom) {
                                        if (love_dom) {
                                        } else {
                                            _dom.innerHTML = '<img src="images/sy2_1.jpg"/>';
                                        }
                                    }
                                } else if (_act == 'ding') {
                                    msg = '已成功送Ta上首页';
                                    if (_dom) {
                                        _dom.innerHTML = '<img src="images/sy1_1.jpg"/>';
                                    }
                                }
                            } else if (ret == -5) {
                                var msg = '请不要重复操作!';
                                if (_act == 'love') {
                                    msg = '已经喜欢过了，写个评论吧!';
                                    var love_dom        = gScript.G('love_num_' + _did);
                                    var _status_dom     = gScript.GN('love_status_' + _did);
                                    for (var i in _status_dom) {
                                        _status_dom[i].innerHTML = '<img src="images/sypl_1.png"/>';
                                    }
                                    if (_dom) {
                                        if (love_dom) {
                                        } else {
                                            _dom.innerHTML  = '<img src="images/sy2_1.jpg"/>';
                                        }
                                    }
                                } else if (_act == 'ding') {
                                    msg = '已经推过首页';
                                    if (_dom) {
                                        _dom.innerHTML = '<img src="images/sy1_1.jpg"/>';
                                    }
                                }
                            } else {
                                var msg = '操作失败';
                            }
                            if (notice_dom) {
                                notice_dom.innerHTML = '<div>'+msg+'</div>';
                                showCommonNotice();
                            }
                        }
                });
            }
        },
        /**
         * 获得数据
         */
        getData : function() {
            var data_url    =  getURL(this.base_data_url, page);
            get_data_status = 0;
            var _data = this.history_data;
            gAjax.request({
                url     : data_url,
                dataType: 'json',
                success : function(ret) {
                    item_length = ret.length;
                    if (item_length > 0) {
                        for (var i in ret) {
                            _data.push(ret[i]);
                        }
                        var _len = _data.length;
                        if (_len >= history_length) {
                            continue_loading_status = 2;
                            next_page_dom.style.display = 'block';
                        }
                        showData(1, _data);
                    } else {
                        new_item = 0;
                    }
                }
            });
        },
        /**
         * 评价操作
         *
         * @param   int     _val    评价类别 1 => 评论, 2 => 标签
         */
        pj_act : function(_val) {
            var user_info   = this.getUserInfo();
            var detail_info = gScript.getCookie('bdj_user_info_detail');
            if (user_info   == '' || user_info.length < 60 || detail_info == '') {
                if (confirm("由于我们的操作需要登录到新浪微博授权\n是否立即授权？")) {
                    window.open('http://demo.budejie.com/api/sso.php?act=login');
                }
            } else {
                var _n_dom              = gScript.G('pj_notice');
                var _b_dom              = gScript.G('pj_act_btn');
                _b_dom.style.cssText    = 'display:none;';
                var notice_dom          = gScript.G('common_notice');
                _n_dom.innerHTML        = '<img src="/images/loading.gif" />';
                var _msg    = '';
                var _data;
                var data_url= '/api/data.php';
                var _mid    = gScript.G('pj_mid').value;
                var _did    = gScript.G('pj_did').value;
                if (_val == 1) {
                    var cmt = gScript.G('pj_content').value;
                    cmt     = cmt || '';
                    _data   = {text: cmt, did: _did, mid: _mid, type: _val};
                } else if (_val == 2) {
                    var cmt = gScript.G('pj_content').value;
                    cmt     = cmt || '';
                    _data   = {text: cmt, did: _did, mid: _mid, type: _val};
                }
                if (cmt.length > 0) {
                    gAjax.request({
                        url     : data_url,
                        data    : _data,
                        dataType: 'json',
                        method  : 'post',
                        success : function(ret) {
                            if (ret == 0) {
                                _msg = '评价成功';
                                // 创建评论
                                createCmt(cmt);
                                gScript.G('pj_content').value = '';
                            } else if (ret == -5) {
                                _msg = '请不要重复评价';
                                gScript.G('pj_content').value = '';
                            } else {
                                _msg = '评价失败';
                            }
                            _n_dom.innerHTML = '';
                            _b_dom.style.cssText = 'display:block';
                            if (_msg.length > 0 && notice_dom) {
                                notice_dom.innerHTML = '<div>'+_msg+'</div>';
                                showCommonNotice();
                            }
                        }
                    });
                } else {
                    _b_dom.style.cssText = 'display:block';
                    _n_dom.innerHTML = '';
                    _msg = '没有填写任何评论信息!';
                    if (_msg.length > 0 && notice_dom) {
                        notice_dom.innerHTML = '<div>'+_msg+'</div>';
                        showCommonNotice();
                    }
                }
            }
        },
        /**
         * 鼠标的样式
         *
         * @param   event   evt     window事件
         * @param   object  dom     监听鼠标事件
         */
        photoCursor: function(evt, dom) {
            var photopos = gScript.getPos(dom);
            if (evt) {
                var w_v = dom.offsetWidth || dom.style.width;
                var nx  = (parseInt(evt.clientX) - photopos.left) / w_v;
                var r_c = 'url(/images/right.cur), auto';
                var l_c = 'url(/images/left.cur), auto';
                dom.style.cursor = nx > 0.5 ? r_c : l_c;
            }
        },
        /**
         * 相册点击
         *
         * @param   event   evt     window事件
         * @param   object  dom     监听事件对象
         */
        photoClick : function(evt, dom) {
            var photopos = gScript.getPos(dom);
            if (evt) {
                var w_v = dom.offsetWidth || dom.style.width;
                var nx  = ( parseInt( evt.clientX ) - photopos.left) / w_v;
                var _val;
                if (nx > 0.5) {
                    _val = next_page_id > 0 ? next_page_id : last_page_id;
                } else {
                    _val = last_page_id > 0 ? last_page_id : next_page_id;
                }
                change_page(_val);
            }
        },
        /**
         * 方向键事件
         *
         * @param   event   evt     window事件
         */
        change_key : function(evt) {
            var kc_val = evt.keyCode || window.event.keyCode;
            if (kc_val == 37 || kc_val == 39) {
                var target = evt.target || evt.srcElement;
                var no_html = /(?:input|textarea)/i;
                if (!no_html.test(target.nodeName)) {
                    var msg = '';
                    var notice_dom = gScript.G('common_notice');
                    if (kc_val == 39){
                        if (next_page_id) {
                            change_page(next_page_id);
                        } else {
                            msg = "最后一条数据";
                        }
                    } else {
                        if (last_page_id) {
                            change_page(last_page_id);
                        } else {
                            msg = "最后一条数据";
                        }
                    }
                    if (msg.length > 0 && notice_dom) {
                        notice_dom.innerHTML = '<div>'+msg+'</div>';
                        showCommonNotice();
                    }
                }
            }
        },
        /**
         * 创建美女操作的标签
         *
         * @param   int     _val    标签的数量
         */
        createActTag : function(_val) {
            if (tag_data) {
                var len  = _val >= 0 ? _val : tag_data.length;
                var html = '';
                for (var i = 0; i < len; i++) {
                    html += '<li><a href="javascript:void(0)" onclick="jie_core.tagSelect(\''+tag_data[i]+'\', this)"><img src="'+this.tag_img_api+'?text='+tag_data[i]+'&type=0"/></a></li>';
                }
                gScript.G('act_tag').innerHTML = html;
            }
        },
        /**
         * 重构美女已获得的标签
         */
        reloadGirlTag : function () {
            var p_dom = gScript.G('tag_table');
            for (var i in tag_sel_arr) {
                var li_dom = gScript.CE('li');
                var num = 1;
                for (var a in has_tag) {
                    if (tag_sel_arr[i] == a) {
                        num += parseInt(has_tag[a]);
                    }
                }
                li_dom.innerHTML = '<a href="javascript:void(0)"><img src="'+this.tag_img_api+'?text='+tag_sel_arr[i]+'&type=1"></a><br>('+num+')';
                p_dom.insertBefore(li_dom, p_dom.firstChild);
            }
        },
        /**
         * 改变标签
         *
         * @param   string  _val    标签内容
         * @param   object  _dom    标签的DOM
         */
        tagSelect : function (_val, _dom) {
            var img_dom = gScript.GTN('img', _dom)[0];
            var _has    = 1;
            var _type   = 1;
            for (var i in tag_sel_arr) {
                if (tag_sel_arr[i] == _val) {
                    _has = 2;
                    tag_sel_arr.splice(i, 1);
                    _type = 0;
                }
            }
            var tag_len = tag_sel_arr.length;
            if (tag_len < 3) {
                if (_has == 1) {
                    tag_sel_arr.push(_val);
                }
                img_dom.src = tag_img_api + '?text=' + _val + '&type=' + _type;
            } else {
                var msg = '一次最多只可评3个标签';
                var notice_dom = gScript.G('common_notice');
                if (notice_dom) {
                    notice_dom.innerHTML = '<div>'+msg+'</div>';
                    showCommonNotice();
                }
            }
        },
        /**
         * 分享代码
         *
         * @param   string  _val    分享数据ID标识
         * @param   string  _type   分享到哪儿
         */
        shareTo : function (_val, _type) {
            var _data;
            for (var i in this.history_data) {
                if (this.history_data[i].id == _val) {
                    _data = this.history_data[i];
                }
            }
            var _title  = encodeURIComponent(_data.text);
            var _url    = encodeURIComponent(this.base_url + 'detail-' + _data.id + '.html');
            var _pic    = _data.image2;
            var _appkey = '';
            if (_type == 'weibo') {
                var _url = 'http://v.t.sina.com.cn/share/share.php?appkey=' + _appkey + '&url=' + _url + '&title=' + _title + '&pic=' + _pic;
            } else if (_type == 'tqq') {
                var _url = 'http://share.v.t.qq.com/index.php?c=share&a=index&url=' + _url + '&appkey=' + _appkey + '&pic=' + _pic + '&title=' + _title;
            } else if (_type == 'qzone') {
                var _url = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + _url + '&title=' + _title + '&pics=' + _pic;
            } else if (_type == 'renren') {
                var _url = 'http://share.renren.com/share/buttonshare.do?link=' + _url + '&title=' + _title + '&pic=' + _pic;
            } else if (_type == 'kaixin') {
                var _url = 'http://www.kaixin001.com/repaste/share.php?rtitle=' + _title + '&rurl=' + _url + '&rcontent=';
            }
            window.open(_url);
        },
        /**
         * 提交标签
         *
         * @param   int     _did        帖子ID
         * @param   int     _mid        微博ID
         * @param   int     _uid        帖子用户ID
         */
        tagSubmit : function(_did, _mid, _uid) {
            var user_info   = this.getUserInfo();
            if (user_info   == '' || user_info.length < 60) {
                checkLogin();
            } else {
                var notice_dom  = gScript.G('common_notice');
                var msg         = '';
                if (tag_type == 0) {
                    var _this   = this;
                    var _len    = tag_sel_arr.length;
                    if (_len > 0) {
                        var data_url = tag_add_api;
                        var _tag = '';
                        for (var i in tag_sel_arr) {
                            _tag += _tag == '' ? tag_sel_arr[i] : '##' + tag_sel_arr[i];
                        }
                        gAjax.request({
                            url     : data_url,
                            data    : {text: _tag, did : _did, mid : _mid, uid : _uid},
                            dataType: 'json',
                            method  : 'post',
                            success : function(ret) {
                                if (ret == 0) {
                                    tag_type = 1;
                                    // 重构女孩标签
                                    _this.reloadGirlTag();
                                    msg = '添加成功';
                                } else if (ret == -5) {
                                    msg = '不要重复添加相同标签';
                                }else if (ret == -7) {
                                    msg = '登录或授权失效';
                                    this.clearUserInfo();
                                    checkLogin();
                                } else {
                                    msg = '添加失败,用户需要重新登录或授权';
                                    this.clearUserInfo();
                                    checkLogin();
                                }
                                if ( msg.length > 0 && notice_dom) {
                                    notice_dom.innerHTML = '<div>'+msg+'</div>';
                                    showCommonNotice();
                                }
                            }
                        });
                    } else {
                        msg = '添加选择要添加的标签';
                    }
                } else {
                    msg = '你已经添加过标签了';
                }
                if ( msg.length > 0 && notice_dom) {
                    notice_dom.innerHTML = '<div>'+msg+'</div>';
                    showCommonNotice();
                }
            }
        },
        /**
         * 获得用户信息
         */
        getUserInfo  : function() {
            return gScript.getCookie('bdj_user_info');
        },
        /**
         * 清空用户信息
         */
        clearUserInfo : function() {
            gScript.setCookie('bdj_user_info', '', -10, '.budejie.com');
        },
        /**
         * 显示/隐藏 分享
         *
         * @param   int     _val    元素ID
         * @param   int     _type   显示的类别
         */
        showBox : function(_val, _type) {
            var _box = 'share_box_';
            for (var i = 1; i < 3; i++) {
                gScript.G(_box + i + '_' + _val).style.display = i == _type ? 'block' : 'none';
            }
        },
        /**
         * 重构用户头像
         */
        reloadUserImg : function() {
            var default_arr = gScript.getCookie('bdj_user_info_detail').split('#');
            if (default_arr[1]) {
                gScript.G('user_default_img').src = default_arr[1];
            }
        },
        /**
         * 页面滚动时调用
         */
        onscroll : function() {
            if ( continue_loading_status == 1 ) {
                if ( new_item == 1 && get_data_status == 1) {
                    var size = gScript.getBodySize();
                    var s_h  = gScript.getScrollTop();
                    var m_h  = top_arr[0] > 0 ? gScript.getArrayMin(top_arr) : size[1];
                    if (size[1] + s_h >= m_h) {
                        page += 1;
                        this.getData();
                    }
                }
            }
        }
    };
    window.jie_core = jie_core;
    /**
     * 创建评论
     *
     * @param   string      _cmt    评论内容
     */
    function createCmt(_cmt) {
        var _dom = gScript.G('pj_div');
        if (_dom) {
            var html        = '';
            var detail_info = gScript.getCookie('bdj_user_info_detail');
            var detail_arr  = detail_info.split('#');
            var user_img    = detail_arr[1].length > 0 ? detail_arr[1] : 'images/jieimg.jpg';
            var _div        = gScript.CE('div');
            var _uname      = decodeURI(detail_arr[0]);
            if (nav_index == 3) {
                _div.className = 'c-top1 clesryl';
                html += '<div class="c-top-left floatl">';
                html += '<p><img src="'+user_img+'"/></p>';
                html += '</div>';
                html += '<div class="c-top-right1 floatr">';
                html += '<div class="ctop">';
                html += '<p class="nic1"><a href="javascript:void(0)">'+_uname+'</a><span>刚刚</span></p>';
                html += '</div>';
                html += '<p class="nic2">'+_cmt+'</p>';
                html += '</div>';
            } else {
                _div.className = 'c-top1yl clesryl';
                html += '<div class="c-top-leftyl floatl">';
                html += '<p><img src="'+user_img+'"/></p>';
                html += '</div>';
                html += '<div class="c-top-right1yl floatr">';
                html += '<div class="ctopyl">';
                html += '<p class="nic1"><a href="javascript:void(0)">'+_uname+'</a><span>刚刚</span></p>';
                html += '</div>';
                html += '<p class="nic2">'+_cmt+'</p>';
                html += '</div>';
            }
            _div.innerHTML = html;
            gScript.insertAfter(_div, _dom);
        }
    }
    /**
     * 设置单列信息
     */
    function setColInfo() {
        var size    = gScript.getBodySize();
        var div_w   = size[0] * 0.8;
        var _col_n  = Math.floor(div_w / col_width);
        _col_n      = _col_n > 0 ? ( _col_n > 5 ? 5 : _col_n ) : 1; 
        if (jie_core.history_data.length > 0 && _col_n != col_num) {
            col_num = _col_n;
            //changeColOffset();
        } else {
            col_num = _col_n;
        }
    }
    /**
     * 改变链接
     *
     * @param   string  _val    页面的ID
     */
    function change_page(_val) {
        location.href = jie_core.base_url + 'detail-' + _val + '.html';
    }
    /**
     * 获得读取数据的URL
     *
     * @param   string  _url    格式化的URL
     * @param   string  _val    要替换的内容
     */
    function getURL(_url, _val) {
        return _url.replace('%page%', _val);
    }
    /**
     * 重构分页
     */
    function createTurnPageHTML() {
        next_page_dom.style.cssText = 'display:none';
        next_page_dom.innerHTML = '<input type="button" value="上一页" onclick="jie_core.turnPage(1)"/><input type="button" value="下一页" onclick="jie_core.turnPage(2)"/>';
    }
    /**
     * 将JSON数据转换成html对象
     *
     * @param   int     start_index     要转换数据的开始位置
     * @param   object  _data           要显示的数据
     */
    function JSONToHTMLObject(start_index, _data) {
        var _txt_width      = col_num == 3 ? 290 : 208;
        var _col_width      = parseInt(img_width) + 20;
        for (var i in _data) {
            if ( i < start_index) {
                continue;
            }
            var to_size = gScript.getZoomSize({w:_data[i].width, h:_data[i].height}, {w:img_width});
            var to_h    = parseInt(to_size[1]);
            if (top_arr.length == col_num) {
                var step = gScript.getArrayMinIndex(top_arr);
            } else {
                var step = i % col_num;
            }
            var l_v  = step * col_width; 
            top_arr[step] = top_arr[step] > 0 ? top_arr[step] : 0;
            var t_v     = top_arr[step];
            var _div    = gScript.CE('div');
            _div.className      = 'col';
            _div.style.cssText  = 'position:absolute;top:'+t_v+'px;left:'+l_v+'px;animation:col_an'+step+'_'+col_num+' '+animation_time+'s;-webkit-animation:col_an'+step+'_'+col_num+' '+animation_time+'s;-moz-animation:col_an'+step+'_'+col_num+' '+animation_time+'s';
            var html    = '<div onmouseover="jie_core.showCol(1, this)" onmouseout="jie_core.showCol(2, this)" class="content-left1">';
            if (nav_index != 3) {
                html       += '<div class="pl clearyl" style="width:'+img_width+'px">';
                html       += '<div style="width:'+_txt_width+'px;padding-left:6px;"><a style="color:#000" href="'+base_url+'detail-'+_data[i].id+'.html" target="_blank">'+_data[i].text+'</a></div>';
                html       += '</div>';
            }
            html       += '<p class="wmmv"><a href="'+base_url+'detail-'+_data[i].id+'.html" target="_blank"><img src="'+_data[i].image2+'" width="'+img_width+'px" height="'+to_h+'px"></a></p>';
            if (nav_index == 3) {
                html       += '<div class="wanm">';
                var _tag    = _data[i].tag.split('|');
                html       += _tag[0].length > 0 ? '<p><img src="'+tag_img_api+'?text='+_tag[0]+'&type=1"></p>' : '<p></p>';
                html       += '<p class="sy-xin"><img src="images/xin.jpg"></p>';
                html       += '<p><span class="red" id="love_num_'+_data[i].id+'">'+_data[i].love+'</span></p>';
                html       += '<p><span class="gray">热度</span></p>';
                html       += '<p class="sy-sz">'+_data[i].hot+'</p>';
                html       += '</div>';
                html       += '<div class="pl clearyl">';
                var _a_html = _data[i].user_id > 0 ? ' href="'+home_page_url + _data[i].user_id + '.html" target="_blank"' : ' href="javascript:void(0)"';
                html       += '<div style="width:'+_txt_width+'px;padding-left:6px;"><a'+_a_html+'>'+_data[i].name+':</a><a style="color:#000" href="'+base_url+'detail-'+_data[i].id+'.html" target="_blank">'+_data[i].text+'</a></div>';
                html       += '</div>';
            }
            html       += '<p class="fucen" style="display:none" id="fucen_'+_data[i].id+'">';
            html       += '<a href="javascript:void(0)" onmouseover="jie_core.showHideShare('+_data[i].id+', 1)"><img src="images/syzf.png"/></a>'; 
            if (location.href.indexOf('pretty.budejie.com') >= 0) {
                html   += '<a name="love_status_'+_data[i].id+'" href="javascript:void(0)" onclick="jie_core.dong_act(\'love\', '+_data[i].id+', '+_data[i].mid+', '+ _data[i].user_id +', this)"><img src="images/sypl.png"/></a>';
            }
            html       += '</p>';
            html       += '<div class="fucen1" id="fucen1_'+_data[i].id+'" style="display:none">';
            html       += '<p class="xf3" onmouseout="jie_core.showHideShare('+_data[i].id+', 2)" onmouseover="jie_core.showHideShare('+_data[i].id+', 1)">';
            html       += '<a onclick="jie_core.shareTo('+_data[i].id+', \'weibo\')" href="javascript:void(0)" title="分享到新浪微博"><img src="images/sina.jpg"></a>';
            html       += '<a onclick="jie_core.shareTo('+_data[i].id+', \'tqq\')" href="javascript:void(0)" title="分享到腾讯微博"><img src="images/gtx.jpg"></a>';
            html       += '<a onclick="jie_core.shareTo('+_data[i].id+', \'renren\')" href="javascript:void(0)" title="分享到人人网"><img src="images/grr.jpg"></a>';
            html       += '<a onclick="jie_core.shareTo('+_data[i].id+', \'kaixin\')" href="javascript:void(0)" title="分享到开心网"><img src="images/gkx.jpg"></a>';
            html       += '</p>';
            if (location.href.indexOf('pretty.budejie.com') >= 0) {
                html       += '<p><a name="love_status_'+_data[i].id+'" href="javascript:void(0)" onclick="jie_core.dong_act(\'love\', '+_data[i].id+', '+_data[i].mid+', '+ _data[i].user_id +', this)"><img src="images/sypl.png"/></a></p>';
            }
            html       += '</div>';
            html       += '<div class="addtime_text">发布时间:'+_data[i].addtime+'</div>';
            html       += '</div>';
            _div.innerHTML  = html;
            content_dom.appendChild(_div);
            var child_dom = gScript.GTN('div', _div);
            child_dom[0].style.cssText = 'height:' + _div.offsetHeight + 'px;width:' +_col_width+ 'px';
            top_arr[step] += _div.offsetHeight + col_space;
        }
    }
    /**
     * 获得女孩的标签
     *
     * @param   string      _str    女孩的标签
     * @param   int         _len    获得标签的数量
     * @return  array               标签的数组
     */
    function getGirlTag(_str, _len) {
        var tag_arr = _str.split('|');
        var max     = _len || tag_arr.length;
        var _arr    = new Array();
        for (var i = 0; i < max; i++) {
            _arr.push(tag_arr[i]);
        }
        return _arr;
    }
    /**
     * 创建女孩标签
     *
     * @param   string  _str    要创建的女孩标签
     * @param   int     _len    个数
     * @return  string          字符串
     */
    function createGirlHaveTag(_str, _len) {
        var tag_arr = _str.split('|');
        var max     = _len || tag_arr.length;
        var _arr    = new Array();
        var html    = '';
        for (var i = 0; i < max; i++) {
            html    += '<a href="'+base_url+'tag_list-'+encodeURIComponent(tag_arr[i])+'.html">'+tag_arr[i]+'</a>';
        }
        return html;
    }
    /**
     * 显示数据
     *
     * @param   string      val     显示的方式. 1 => 显示最新的数据(默认)，2 => 重构所有的数据
     * @param   object      _data   要显示的数据
     */
    function showData(val, _data) {
        var val     = val || 1;
        var len     = _data.length;
        if (val == 1) {
            JSONToHTMLObject(len-item_length, _data);
        } else {
            top_arr = new Array();
            content_dom.innerHTML  = '';
            JSONToHTMLObject(0, _data);
        }
        content_dom.style.height = top_arr[0] > 0 ? gScript.getArrayMax(top_arr) + 'px' : '0px';
        // 数据获取状态成功
        get_data_status = 1;
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
        content_dom.style.height = top_arr[0] > 0 ? gScript.getArrayMax(top_arr) + 'px' : '0px';
    }
    /**
     * 生成动态标签
     *
     * @return  string  标签元素的字符串
     */
    function createGirlTag() {
        var html = '';
        for (var i in tag_rank) {
            if ( i > 1) {
                html += '<input type="button" value="'+tag_rank[i]+'" class="pj_tag" onclick="jie_core.tag_sel(\''+tag_rank[i]+'\', this)"/>';
            }
        }
        html += '<input type="text" id="add_tag" style="width:70px;height:22px;border:1px solid #ddd;border-top:2px solid #ddd;border-bottom:2px solid #ddd"/><input type="button" value="自定义" onclick="jie_core.addTag()"/>';
        gScript.G('girl_tag_rank').innerHTML = html;
    }
    /**
     * 验证用户登录
     *
     * @return  mix     若登录成功，则返回用户信息的字符串，否则返回false
     */
    function checkLogin() {
        var user_info = jie_core.getUserInfo();
        if (user_info == '' || user_info.length < 60) {
            if (confirm("由于我们的操作需要登录到新浪微博授权\n是否立即授权？")) {
                window.open('http://demo.budejie.com/api/sso.php?act=login');
            }
        }
    }
})()
