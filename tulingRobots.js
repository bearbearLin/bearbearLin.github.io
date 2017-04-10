$(function(){
	function appendtalk(showdate){//创建插入机器人聊天信息的方法,只需要改变的是每个聊天栏里返回的内容，所以用showdate传入参数
		var robots=$("<span />",{class:"robots"}).html('秃秃');//机器人的名字
		var leftarrow=$("<span />",{class:"leftarrow"});//每一句聊天项的那个小箭头
		var spanleft=$("<span />",{class:"robotstalk"}).html(showdate);//用于存放机器人返回的信息,聊天栏里的内容
		var li=$("<li />").css({textAlign:"left"}).appendTo($("#talkBar")).append(robots).append(leftarrow).append(spanleft);//插入返回信息
		return li;//为了能够像jQuery那样进行链式操作，返回创建的li对象
	}
	function post(){
		$.ajax({//发送请求
			url:"http://www.tuling123.com/openapi/api",
			type:"POST",
			dataType:"json",
			data:{//要发送过去的参数
				"key":"6c75134ae3574be7ac97267396c0a92b",
				"info":$("#inputBar input").val(),//发过去的信息
				"userid":1234//用户id，机器人上下文聊天的标记
			},
			success:function(data){
				console.log(data)
				// console.log(data.list[0].detailurl)
				var spanright=$("<span />",{class:"usertalk"}).html($("#inputBar input").val())//用于存放用户输入的聊天内容
				var rightarrow=$("<span />",{class:"rightarrow"});//每一句聊天项的那个小箭头
				var user=$("<span />",{class:"user"}).html('你');//用户显示栏
				$("<li />").css({textAlign:"right"}).appendTo($("#talkBar")).append(user).append(spanright).append(rightarrow);//插入聊天内容
				if(data.code===100000){//文本类数据
					var text=data.text;
					appendtalk(text);
				}else if(data.code===200000){//链接类数据
					// console.log(data.url)
					var urldate='<p><a href="'+data.url+'" target="_blank">'+$("#inputBar input").val()+'</a></p>';
					appendtalk(urldate);
				}else if(data.code==302000){//新闻类数据
					// console.log(data.list.length)
					$("#popBox ul").html("");//清空之前蒙层里的东西
					var newtitle='<a href="javascript:void(0)">'+data.text+'</a>';
					var spanleft=$("<span />",{class:"robotstalk"}).html(newtitle);
					appendtalk(newtitle).on("click",function(e){//插入新闻聊天内容并绑定事件，点击产生蒙层及新闻列表
						for(var i=0;i<data.list.length;i++){
							var newdate='<h2>'+data.list[i].article+'</h2>'+
										'<p><a href="'+data.list[i].detailurl+'" target="_blank"><img src="'+data.list[i].icon+'"></a></p>'
							$("<li />").html(newdate).appendTo($("#popBox ul"));
						}
						$("#popBox").fadeIn();//蒙层淡入
						e.stopPropagation();//阻止冒泡
					})
				}else if(data.code==308000){//餐谱类数据
					$("#popBox ul").html("");//清空之前蒙层里的东西
					var foodtitle='<a href="javascript:void(0)">'+$("#inputBar input").val()+'的做法</a>'
					var spanleft=$("<span />",{class:"robotstalk"}).html(foodtitle);
					appendtalk(foodtitle).on("click",function(e){//点击链接弹出蒙层，列出详细的菜单信息
						for(var j=0;j<data.list.length;j++){
							var foodlist='<h2>'+data.list[j].name+'</h2>'+
										'<p><a href="'+data.list[j].detailurl+'" target="_blank">主要材料:'+data.list[j].info+'</a></p>';
							$("<li />").html(foodlist).css({textAlign:"center"}).appendTo("#popBox ul")
						}
						$("#popBox").fadeIn();//蒙层淡入
						e.stopPropagation();//阻止冒泡
					})
				}else {
					$("<li />").html(data.text).appendTo($("#talkBar"));
				}
				var sTop=$("#talkBar").scrollTop();
				if($("#talkBar")[0].scrollHeight>$("#talkBar").outerHeight(true)){//判断最后一条聊天信息是否已超出聊天框的高度
					$("#talkBar").animate({//超出高度滚动调自动向下滚动
						scrollTop:sTop+200
					},100)
				}
				$("#inputBar input").val("");
			}
		})
	}
	$("#inputBar button").on("click",function(){
		if($("#inputBar input").val()==""){
			alert("请输入信息")
		}else{
			post();//点击发送按钮发送请求
		}
	});
	$("#inputBar input").on("keypress",function(e){
		
		if(e.keyCode==13){
			if($("#inputBar input").val()==""){
				alert("请输入信息")
			}else{
				post();//输入框输入回车发送请求	
			}
		}
	})
	$("#btn").on("click",function(e){
		$("#popBox").fadeIn();
		e.stopPropagation();
	})
	$("#popBox").on("click","h2",function(e){//取消蒙层里面内容的冒泡，只有在点击空白处时蒙层才消失
		e.stopPropagation();
	})
	$("#popBox").on("click","p",function(e){//取消蒙层里面内容的冒泡，只有在点击空白处时蒙层才消失
		e.stopPropagation();
	})
	$(window).on("click",function(){
		$("#inputBar input").focus()//取消蒙层后自动聚焦在输入栏里
		$("#popBox").fadeOut()
	})
	$("#popBox").on("scroll",function(){
		console.log(1);
		if($("#popBox").scrollTop()>100){
			$(".gotop").css({display:"block"});
		}else{
			$(".gotop").css({display:"none"});
		}
	})
	$(".gotop").on("click",function(e){
		$("#popBox").animate({
			scrollTop:0
		})
		e.stopPropagation()
	})
})