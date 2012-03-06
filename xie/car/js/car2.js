/**************����Cookie�ĸ�����************/
function cookie(){
	/*
	*	���ù���ʱ�������
	*/
	this.overTime = 3600*24*1000;	//����ʱ��,Ĭ��Ϊһ��
	/*
		�洢cookie
	*/
	this.setCookie = function(name,str){
		var date = new Date();
		date.setTime(date.getTime() + this.overTime);
		document.cookie = name + '=' + escape(str) + ';expires=' + date.toGMTString() + ';path=/';
   		
	}
	/*
		ɾ��cookie
	*/
	this.delCookie = function(name){
		var date = new Date();
		date.setTime(date.getTime() - 3600);
		document.cookie = name + '=;expires=' + date.toGMTString() + ';path=/';
   	}
	/*
		��ȡcookie
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
	*	��ȡ����cookie
	*	��������	
	*/
	this.getAllCookie = function(name){
		var alldata = unescape(document.cookie).split(';');
		return alldata;
	}
	/*
	*	�޸�cookie
	*/
	this.updateCookie = function(name,str){
		this.delCookie(name);
		this.setCookie(name,str);
	}
}


/***************ԭ�ͼ̳�cookie��*************/
car.prototype = new cookie();


/*******************���ﳵ��******************/
function car(obj){
	/*
	*	��ȡĬ������
	*/
	if(typeof obj.time == 'undefined'){
		this.overTime = 3600*24*1000;			//Ĭ��Ϊ1�����
	}else{
		this.overTime = obj.time;
	}

	/*
	*	��ȡcookie����
	*/
	if(typeof obj.name == 'undefined'){
		this.name = "goodscar";			//Ĭ��Ϊ1�����
	}else{
		this.name = obj.name;
	}
	
	/*
	*	������Ʒ
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
	*	ɾ��������Ʒ
	*/
	this.delAllGoods = function(){
		this.delCookie(this.name);
	}
	/*
	*	ɾ����Ʒ
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
	*	�޸���Ʒ����
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
	*	��ȡ��Ʒ�б�
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
	*	�ҳ���Ӧ��Ʒ�������λ��
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
	*	������ת�����ַ���
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


	