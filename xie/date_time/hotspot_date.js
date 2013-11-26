function hotspot_date(inputObj){
        this.inputObj = inputObj;
        this.map = document.createElement('div');
        this.mainFrame = document.createElement('div');
        this.nowMonth = document.createElement("font");
        this.nowYear = document.createElement("font");
        this.week_date = new Array('日','一','二','三','四','五','六');
        this.timer = null;
        this.lifeTime = true;
        //单格宽度
        this.width = 25;
        //总宽度
        this.countWidth = 25 * 7;
        //关闭日历
        this.closed = function(){
                this.map.parentNode.removeChild(this.map);
        }
        
        //创建日期地图
        this.createMap = function(){
                this.map.style.cssText = "width:"+this.countWidth+"px;border:1px solid #AAA;position:absolute;background-color:#fef;font-size:12px;z-index:100";
                this.map.setAttribute('id','Hotspot_Date');

                var title = document.createElement("div");
                title.style.cssText = "height:12px;font-weight:bold;border-bottom:1px solid #AAA;padding:5px 2px;";
                this.prevYear = document.createElement("div");
                this.prevYear.style.cssText = "width:20px;height:12px;float:left;cursor:pointer; padding:0px; ";
                this.prevYear.innerHTML = "《";
                this.prevYear.alt = "上一年";
                this.prevYear.title = "上一年";
                
                this.nextYear = document.createElement("div");
                this.nextYear.style.cssText = "width:10px;height:12px;float:left;cursor:pointer; ";
                this.nextYear.innerHTML = "》";
                this.nextYear.alt = "下一年";
                this.nextYear.title = "下一年";

                this.prevMonth = document.createElement("div");
                this.prevMonth.style.cssText = "width:10px;height:12px;float:left;cursor:pointer; padding:0px; ";
                this.prevMonth.innerHTML = "-";
                this.prevMonth.alt = "上一月";
                this.prevMonth.title = "上一月";
                
                this.nextMonth = document.createElement("div");
                this.nextMonth.style.cssText = "width:20px;height:12px;float:left;cursor:pointer;";
                this.nextMonth.innerHTML = "+";
                this.nextMonth.alt = "下一月";
                this.nextMonth.title = "下一月";
                
                this.nowDate = document.createElement("div");
                this.nowDate.style.cssText = "width:"+(this.countWidth - 66)+"px;height:12px;float:left;text-align:center;font-size:12px; padding:0px; margin:0px";

                this.nowYear.style.fontSize = "12px";
                this.nowYear.setAttribute('id','nowYear');
                var date = new Date();
                this.nowYear.innerHTML = date.getFullYear();
                this.nowMonth.innerHTML = date.getMonth()+1;
                this.nowMonth.setAttribute('id','nowMonth');
                this.nowMonth.style.fontSize = "12px";
                this.nowDate.appendChild(this.nowYear);
                this.nowDate.appendChild(document.createTextNode("年"));
                this.nowDate.appendChild(this.nowMonth);
                this.nowDate.appendChild(document.createTextNode("月"));
                
                title.appendChild(this.prevYear);
                title.appendChild(this.prevMonth);
                title.appendChild(this.nowDate);
                title.appendChild(this.nextMonth);
                title.appendChild(this.nextYear);
                this.map.appendChild(title);
                //星期
                var week = document.createElement("div");
                week.style.cssText = "height:12px;font-weight:bold;border-bottom:1px solid #AAA;padding:5px 0px;background-color:#ccf; ";
                for(var i = 0;i<7;i++){
                        var day = document.createElement('div');
                        day.style.cssText = "height:12px; width:"+(this.width - 6)+"px; text-algin:center;float:left;padding-left:6px;";
                        day.innerHTML = this.week_date[i];
                        week.appendChild(day);
                }
                var day = document.createElement('div');
                day.style.cssText = "clear:both;";
                week.appendChild(day);
                this.map.appendChild(week);
                //主体来内容
                this.map.appendChild(this.mainFrame);
                //今天关闭
                var footer = document.createElement("div");
                footer.style.cssText = "height:12px;font-weight:bold;border-top:1px solid #AAA;padding:5px 0px;background-color:#ccf;";
                this.today = document.createElement("div");
                this.today.style.cssText = "height:12px; width:"+(this.countWidth - 35)+"px; float:left; font-weight:blod;cursor:pointer;padding-left:5px;";
                this.today.innerHTML = "今天";
                
                this.closeWin = document.createElement("div");
                this.closeWin.style.cssText = "height:12px; width:30px; float:left; font-weight:blod;cursor:pointer;"
                this.closeWin.innerHTML = "关闭";
                footer.appendChild(this.today);
                footer.appendChild(this.closeWin);
                this.map.appendChild(footer);
                var nowObj = this;
                
                //上一月
                this.prevMonth.onclick = function(){
                        var y = parseInt(nowObj.nowYear.innerHTML);        
                        var m = parseInt(nowObj.nowMonth.innerHTML);
                        if(m == 1){
                                m = 12;        
                                y--;
                        }else{
                                m --;
                        }
                        nowObj.loadDay(y,m);
                }
                //下一月
                this.nextMonth.onclick = function(){
                        var y = parseInt(nowObj.nowYear.innerHTML);        
                        var m = parseInt(nowObj.nowMonth.innerHTML);
                        if(m == 12){
                                m = 1;        
                                y++;
                        }else{
                                m ++;
                        }
                        
                        nowObj.loadDay(y,m);
                }
                //上一年
                this.prevYear.onclick = function(){
                        var y = parseInt(nowObj.nowYear.innerHTML);        
                        var m = parseInt(nowObj.nowMonth.innerHTML);
                        y --;
                        nowObj.loadDay(y,m);
                }
                //下一年
                this.nextYear.onclick = function(){
                        var y = parseInt(nowObj.nowYear.innerHTML);        
                        var m = parseInt(nowObj.nowMonth.innerHTML);
                        y++;
                        nowObj.loadDay(y,m);
                }
                //关闭
                this.closeWin.onclick = function(){
                        nowObj.map.parentNode.removeChild(nowObj.map);        
                }
                //今天
                this.today.onclick = function(){
                        var now = new Date();
                        nowObj.loadDay(now.getFullYear(),now.getMonth()+1);        
                }
                return this.map;
        }
        //加载日期
        this.loadDay = function(year,month){

                //清除已月的日期
                this.mainFrame.innerHTML = "";
                //设置当前年
                var pNode = this.nowYear.parentNode;
                pNode.innerHTML = '';
                this.nowYear = document.createElement('font');
                this.nowYear.innerHTML = year;
                this.nowYear.style.fontSize = "12px";
                pNode.appendChild(this.nowYear);
                pNode.appendChild(document.createTextNode('年'));
                //设置当前月
                this.nowMonth = document.createElement('font');
                this.nowMonth.innerHTML = month;
                this.nowMonth.style.fontSize = "12px";
                pNode.appendChild(this.nowMonth);
                pNode.appendChild(document.createTextNode('月'));
                
                var date = new Date(year,month-1,1,0,0,0);
                //获取当前月的第一天
                var week = date.getDay();
                //获取上一月的最后一天
                date.setTime(date.getTime()-3600000*24);
                var lastday = date.getDate();
                var prevmonth = date.getMonth() + 1;
                var nowYear = year;
                //获取本月的最后一天
                if(month == 12){
                        date.setFullYear(year+1);
                        date.setMonth(0);
                        date.setDate(1);
                        date.setTime(date.getTime()-3600000*24);
                        var nowlastday = date.getDate();
                        var nextmonth = 1;
                }else{
                        var now = new Date(year,month,1)
                        now.setTime(now.getTime()-3600000*24);
                        var nowlastday = now.getDate();
                        var nextmonth = month+1;
                }
                //总共显示的日期数
                var num = (nowlastday+week)%7;
                num > 0 && (num = 7 - num);
                var len = num + nowlastday+week;
                
                var days = new Array();
                var prevStart = lastday - week+1;
                var nowStart = 1;
                var nextStart = 1;
                var element1 = this.map;
                var input = this.inputObj;
                this.mainFrame.style.height = (len/7)*22 + 'px';
                this.mainFrame.style.overFlow = "hidden";
                for(var i = 0;i<len;i++){
                        days[i] = document.createElement('div');
                        days[i].style.cssText = "height:12px; width:"+(this.width-16)+"px; text-algin:center;float:left;padding:5px 8px;cursor:pointer;background-color:#ffc";
                        if(i < week){
                                if(prevmonth == 12) nowYear = year - 1;
                                days[i].style.color = "#ccc";
                                days[i].innerHTML = prevStart;
                                days[i].className =  nowYear + '-' + prevmonth;
                                prevStart++;
                                var newmonth = prevmonth;
                        }else if(nowStart <= nowlastday){
                                var now = new Date();
                                if(year == now.getFullYear() && month == now.getMonth() + 1 && nowStart == now.getDate()){
                                        days[i].style.backgroundColor = "#FF3";        
                                }
                                
                                days[i].innerHTML = nowStart < 10 ? '&nbsp;' + nowStart : nowStart;
                                nowStart++;
                                days[i].className =  year + '-' +month;
                        }else{
                                if(nextmonth == 1) nowYear = parseInt(year) + 1;
                                days[i].style.color = "#ccc";
                                days[i].innerHTML = nextStart < 10 ? '&nbsp;' + nextStart : nextStart;
                                nextStart++;
                                days[i].className =  nowYear + '-' + nextmonth;
                        }
                        days[i].onmouseover = function(){
                                this.style.backgroundColor = "#eef";        
                        }
                        days[i].onmouseout = function(){
                                this.style.backgroundColor = "#ffc";
                                var now = new Date();
                                if(year == now.getFullYear() && this.className == now.getMonth() + 1 && this.innerHTML == now.getDate()){
                                        this.style.backgroundColor = "#FF3";        
                                }
                        }
                        days[i].onclick = function(){
                                input.value = this.className + '-' + this.innerHTML.replace('&nbsp;','');                                         element1.parentNode.removeChild(element1);
                        }
                        this.mainFrame.appendChild(days[i]);
                }
                var clear = document.createElement('div');
                clear.style.cssText = "clear:both";
                this.mainFrame.appendChild(clear);
                
        }
        //加载日历
        this.loaded = function(){
                if(document.getElementById('Hotspot_Date') != null){
                        document.getElementById('Hotspot_Date').parentNode.removeChild(document.getElementById('Hotspot_Date'));
                }
                this.inputObj.parentNode.appendChild(this.createMap());
                //加载日期
                if(this.inputObj.value != '' ){
                        var data = this.inputObj.value.split('-');
                        var y = data[0];
                        var m = data[1];
                }
                var date = new Date();
                if(isNaN(y)) y = date.getFullYear();
                if(isNaN(m)) m = date.getMonth() + 1;
                this.loadDay(y,m);
                
        }
        var nowObj = this;
        var elem1 = this.map;
        this.map.onmouseover = function(){
                nowObj.lifeTime = true;
        }
        this.map.onmouseout = function(){
                nowObj.lifeTime = false;
                inputObj.focus();
        }
        this.inputObj.onmouseover = function(){
                nowObj.lifeTime = true;
        }
        this.inputObj.onmouseout = function(){
                nowObj.lifeTime = false;
                this.focus();
        }
        this.inputObj.onblur = function(){
                if(nowObj.lifeTime) return;
                elem1.parentNode.removeChild(elem1);
        }
        
        this.loaded();

        
}
