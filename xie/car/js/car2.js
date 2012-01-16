/**************操作Cookie的根对象************/
function cookie(){
	/*
	*	设置过期时间的属性
	*/
	this.overTime = 3600*24*1000;	//过期时间,默认为一天
	/*
		存储cookie
	*/
	this.setCookie = function(name,str){
		var date = new Date();
		date.setTime(date.getTime() + this.overTime);
		document.cookie = name + '=' + escape(str) + ';expires=' + date.toGMTString() + ';path=/';
   		
	}
	/*
		删除cookie
	*/
	this.delCookie = function(name){
		var date = new Date();
		date.setTime(date.getTime() - 3600);
		document.cookie = name + '=;expires=' + date.toGMTString() + ';path=/';
   	}
	/*
		读取cookie
	*/
	this.getCookie = function(name){
		var alldata = unescape(document.cookie).split(';');
		if(alldata != ''){
			for(var i in alldata){
				if(alldata[i].search(name+'=') > -1){
					var goods = alldata[i].split('=');
					return goods[1];
				}
			}
		}
		return false;
	}
	/*
	*	读取所有cookie
	*	返回数组	
	*/
	this.getAllCookie = function(name){
		var alldata = unescape(document.cookie).split(';');
		return alldata;
	}
	/*
	*	修改cookie
	*/
	this.updateCookie = function(name,str){
		this.delCookie(name);
		this.setCookie(name,str);
	}
}


/***************原型继承cookie类*************/
car.prototype = new cookie();


/*******************购物车类******************/
function car(obj){
	/*
	*	获取默认期限
	*/
	if(typeof obj.time == 'undefined'){
		this.overTime = 3600*24*1000;			//默认为1天过期
	}else{
		this.overTime = obj.time;
	}

	/*
	*	获取cookie名字
	*/
	if(typeof obj.name == 'undefined'){
		this.name = "goodscar";			//默认为1天过期
	}else{
		this.name = obj.name;
	}
	
	/*
	*	增加商品
	*/
	this.addGoods = function(id,name,price,num,img){
		var data = this.getCookie(this.name);
		
		var obj = '';
		if(typeof data != 'undefined' && data != false){
			var obj_one = {"id":id,"name":name,"price":price,"num":num,"img":img};
			obj = eval(data);
			var key = this.getGoodsById(id,obj);
			if(key === false){
				obj.push(obj_one);
				this.updateCookie(this.name,this.jsonToString(obj));
			}else{
				return false;	
			}
		}else{
			obj = [{"id":id,"name":name,"price":price,"num":num,"img":img}];
			this.setCookie(this.name,this.jsonToString(obj));
		}
		return true;
	}
	/*
	*	删除所有商品
	*/
	this.delAllGoods = function(){
		this.delCookie(this.name);
	}
	/*
	*	删除商品
	*/
	this.delGoods = function(id){
		var data = this.getCookie(this.name);
		var obj = '';
		var key = -1;
		if(data != false){
			obj = eval(data);
			key = this.getGoodsById(id,obj);
			if(key !== false){
				if(key == 0){
					obj.shift();
				}else{
					for(var i = key;i<obj.length-1;i++){
						obj[i] = obj[parseInt(i)+1];
					}
					obj.pop();
				}
			}else{
				return false;	
			}
		}else{
			return false;
		}
		this.updateCookie(this.name,this.jsonToString(obj));
		return true;
	}
	/*
	*	修改商品数量
	*/
	this.updateGoods = function(id,num){
		
		var data = this.getCookie(this.name);
		var obj = '';
		if(data != false){
			obj = eval(data);
			var key = this.getGoodsById(id,obj);
			if(key !== false){
				obj[key].num = num;
			}
		}else{
			return false;	
		}
		this.updateCookie(this.name,this.jsonToString(obj));
		return true;
	}
	/*
	*	获取商品列表
	*/
	this.getGoods = function(){
		var data = this.getCookie(this.name);
		var obj = '';
		if(data != false){
			obj = eval(data);
			return obj;
		}else{
			return false;	
		}
		
	}
	
	/*
	*	找出对应商品在数组的位置
	*/
	this.getGoodsById = function(id,data){
		if(data !== false){
			for(var i in data){
				if(data[i].id == id){
					return i;	
				}	
			}
		}
		return false;
	}
	/*
	*	将数组转换成字符串
	*/
	this.jsonToString = function(data){
		var str = '[{';
		var charr = new Array();
		var n = 0;
		for(var i in data){
			if(typeof data.length == 'number'){
				var k = 0;
				var strarr = new Array();
				var chstr = '';
				if(typeof data[i] != 'undefined' ){
					for(var j in data[i]){
						strarr[k] = '"'+j+'":"'+data[i][j]+'"';
						k++;
					}
					charr[n] = strarr.join(',');
					n++;
				}
			}
		}
		str += charr.join('},{');
		str += '}]';
		return str;
	}

}


	