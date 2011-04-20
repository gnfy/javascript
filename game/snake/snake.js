var snake = (function() {
    var s_dom = 0,
    timer,
    t_step = 0,
    l_step = 0,
    time_step = 400,
    snake_len = 0,
    f_dom = 0,
    f_top,
    f_left,
    last_key = 0,
    btn_dom = 0,
    sum_scores = 0,
    is_run = 1,
    snake_pos = new Array();
var step = {
    37:{t_step:0, l_step:-20},
    38:{t_step:-20, l_step:0},
    39:{t_step:0, l_step:20},
    40:{t_step:20, l_step:0}
};
/**
 * 根据ID获得对象
 *
 * @param   string  id  要获得对象的ID
 * @param   object  dom 限制的对象
 * @return  object
 */
var G = function(id, dom) {
    var dom = typeof(dom) == 'object' ? dom : window.document;
    return dom.getElementById(id);
}
/**
 * 创建元素
 *
 * @param   string  tag 要创建元素的标签名称
 * @return  object      创建好的对象
 */
var CE = function (tag) {
    return document.createElement(tag);
}
/**
 * 运行
 */
var run = function () {
    if (btn_dom == 0) {
        btn_dom = G('btn');
    }
    if (btn_dom.value == ' start ') {
        move();
    } else {
        pause();
    }
}
/**
 * 移动
 */
var move = function () {
    // 初始化蛇
    if (s_dom == 0) {
        s_dom = G('snake');
        s_dom.style.top     = '40px';
        s_dom.style.left    = '40px'
    }
    // 初始化食物
    if (f_dom == 0) {
        food_reload();
    }
    if (btn_dom == 0) {
        btn_dom = G('btn');
    }
    btn_dom.value = ' pause ';
    is_run = 2;
    var t_val = parseInt(s_dom.style.top);
    var l_val = parseInt(s_dom.style.left);
    if (t_val >= 0 && t_val <= 480 && l_val >= 0 && l_val <= 480) {
        t_n_val = t_val + t_step;
        l_n_val = l_val + l_step;
        snake_pos[0] = [t_val, l_val];
        // 移动蛇身
        if (snake_len > 0) {
            for (var i = 0; i < snake_len; i++) {
                var body_dom = G('snake'+i);
                snake_pos[i+1][0]   = parseInt(body_dom.style.top);
                snake_pos[i+1][1]   = parseInt(body_dom.style.left);
                body_dom.style.top  = snake_pos[i][0] + 'px';
                body_dom.style.left = snake_pos[i][1] + 'px';
            }
        }

        // 判断蛇头位置是否合法
        snake_check([t_n_val, l_n_val]);

        s_dom.style.top     = t_n_val + 'px';
        s_dom.style.left    = l_n_val + 'px';
        if (t_n_val == f_top && l_n_val == f_left) {
            // 吃食物
            snake_eat();
        }
        timer = setTimeout(move, time_step);
    } else {
        restart();
    }
}
/**
 * 暂停
 */
var pause = function () {
    if (btn_dom == 0) {
        btn_dom = G('btn');
    }
    btn_dom.value = ' start ';
    clearTimeout(timer);
    //clearInterval(timer);
}
/**
 * 监听键盘事件
 */
document.onkeydown = function () {
    var evt = window.event ? window.event : arguments[0];
    var k   = evt.keyCode;
    if (k >= 37 && k <= 40 && last_key != k && Math.abs(last_key - k) != 2) {
        pause();
        t_step      = step[k].t_step;
        l_step      = step[k].l_step;
        last_key    = k;
        //timer = setInterval(move, time_step);
        move();
    } else if (Math.abs(last_key - k) == 2) {   // 反方向暂停
        pause();
        last_key = 0;
    }
}
/**
 * 构建蛇身
 */
var snake_add = function() {
    var s_div = CE('div');
    s_div.setAttribute('id', 'snake'+snake_len);
    s_div.style.cssText = 'width:20px;height:20px;background-color:#0B0;position:absolute';
    s_div.style.top     = f_top + 'px';
    s_div.style.left    = f_left + 'px';
    if (s_dom == 0) {
        s_dom = G('snake');
    }
    s_dom.parentNode.appendChild(s_div);
    snake_len += 1;
    snake_pos[snake_len] = [f_top, f_left];
}
/**
 * 重构食物
 */
var food_reload = function() {
    if (f_dom == 0) {
        f_dom = G('food');
        f_dom.style.cssText = 'background-color:#F00';
    }
    f_top   = Math.floor((Math.random()*24))*20;
    f_left  = Math.floor((Math.random()*24))*20;
    f_dom.style.top     = f_top + 'px';
    f_dom.style.left    = f_left + 'px';
}
/**
 * 蛇吃食物
 */
var snake_eat = function() {
    snake_add();
    food_reload();
    scores_count();
    if (time_step > 0) {
        time_step += -20;
    }
}
/**
 * 判断蛇头位置是否合法
 *
 * @param   array   param   蛇头位置的数组
 */
var snake_check = function(param) {
    for (var i in snake_pos) {
        if (snake_pos[i].toString() == param.toString()) {
            restart();
            break;
        }
    }
}
/**
 * 重新开始
 */
var restart = function() {
    if (is_run == 2) {
        pause();
        alert('Game Over');
        if (s_dom == 0) {
            s_dom = G('snake');
        }
        p_dom = s_dom.parentNode;
        for (var i = 0; i < snake_len; i++) {
            var body_dom = G('snake'+i);
            p_dom.removeChild(body_dom);
        }
        snake_len   = 0;
        t_step      = 0,
        l_step      = 0,
        time_step   = 400,
        last_key    = 0;
        is_run      = 1;
        snake_pos   = new Array();
        s_dom.style.top     = '40px';
        s_dom.style.left    = '40px';

        // 重构食物
        food_reload();
    }

}
/**
 * 当前级别分数
 */
var level_scores = function() {
    var a = b = 1, scores = 0;
    for (var i = 0; i < snake_len; i++) {
        if (i <= 1) {
            scores = 1;
        } else {
            scores = a + b;
            a = b;
            b = scores;
        }
    }
    return scores;
}
/**
 * 计算分数
 */
var scores_count = function() {
    var l_s = level_scores();
    sum_scores += l_s; 
    G('scores').innerHTML   = sum_scores;
    G('level').innerHTML    = l_s;
}
return {run:run, restart:restart}
})();
