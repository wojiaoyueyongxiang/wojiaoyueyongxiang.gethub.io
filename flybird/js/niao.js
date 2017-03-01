function game(){
	var flyWrap = document.getElementById("flyWrap");
	var start = document.getElementById("start"); // 开始按钮
	var head = document.getElementById("head"); // 头部图片
	var btns = document.getElementById("btns");
	var flyBird = document.getElementById("flyBird"); // 小鸟 div
	var slider = document.getElementById("slider"); // 滚动条
	var flyBirdImg = flyBird.firstElementChild; // 小鸟图片
	var pipeWrap = document.getElementById('pipeWrap');//管道
	var pipeWrap = document.getElementById("pipeWrap");// 管道的容器
	var scoreDiv = document.getElementById('score'); // 分数的div
	var gameOverDiv = document.getElementById('gameOver');
	var over = gameOverDiv.children[0];
	var message = gameOverDiv.children[1];
	var okButton = gameOverDiv.children[2];
	var gameMusic = document.getElementById('game_music');
	var bullet = document.getElementById('bullet');
	var gameEndMusic =document.getElementById('gameEndMusic');





	var downTimer = null; // 小鸟下落的定时器
	var crashTimer = null;//碰撞检测定时器
	var upTimer = null;//小鸟上升的定时器
	var pipeTimer = null;//管道的定时器
	//定义小鸟移动的速度
	var speed = 0;
	var maxSpeed = 8;
	var scoreNumber = 0; //记录小鸟的分数
	
	// 小鸟下落的处理函数
	function birdDown(){
		flyBirdImg.src = "img/down_bird1.png"
		speed+=0.3;
		if(speed >= maxSpeed){
			speed = maxSpeed;
		}
		flyBird.style.top = flyBird.offsetTop +speed+'px';
	}
	// 游戏结束
	function gameOver(){

		// 播放结束音乐
		gameMusic.pause();
		gameEndMusic.play();
		clearInterval(downTimer);
		clearInterval(crashTimer);
		clearInterval(upTimer);
		clearInterval(pipeTimer);
		var lis = pipeWrap.getElementsByTagName('li');
		for(var i =0; i< lis.length;i++){
			// 清除管道移动的所有定时器
			clearInterval(lis[i].appearTimer);
		}
		start.onclick = null;
		flyWrap.onclick = null;
		alert('哈哈哈,好笨哦!')
		gameOverDiv.style.display = "block";
		okButton.onclick =function(){
			// 刷新
			window.location.reload();
		}
	}
	// 检测两个矩形是否发生碰撞
	function isCrash(obj1,obj2){
		var l1 = obj1.parentNode.offsetLeft;
		var t1 = obj1.offsetTop;
		var r1 = l1+obj1.offsetWidth;
		var b1 = t1+obj1.offsetHeight;
		
		var l2 = obj2.offsetLeft;
		var t2 = obj2.offsetTop;
		var r2 = l2 + obj2.offsetWidth;
		var b2 = t2 + obj2.offsetHeight;
		if(l1 > r2 || t1 > b2 || r1 < l2 || b1 < t2){
			return false;
		}
		return true;
	}


	
	// 碰撞检测函数
	function crashCheck(){
		// 1.小鸟跟地板和天花板碰撞
		if(flyBird.offsetTop <= 0 || flyBird.offsetTop+flyBird.offsetHeight>=slider.offsetTop){
			// 游戏结束
			gameOver();
		}
		// 2.小鸟跟管道碰撞
		var lis = pipeWrap.getElementsByTagName('li');
		for(var i = 0;i < lis.length; i++){
			var son1 = lis[i].children[0];
			var son2 = lis[i].children[1];
			var isTop =isCrash(son1,flyBird);
			var isBottom = isCrash(son2,flyBird);
			if(isTop || isBottom){
				// 游戏结束
				gameOver();
			}
		}
	}
	//随机函数
	function randNumber(min,max){
		return parseInt(Math.random()*(max-min+1)+min);
	}

	// 加分函数
	function addScore(){
		scoreNumber++;
		// 把scoreNumber 转化为字符串
		var scoreStr = String(scoreNumber);
		// 首先清除原有的数字
		scoreDiv.innerHTML = null;
		for(var i =0; i<scoreStr.length; i++){
			var num = scoreStr[i];
			var img = document.createElement('img');
			img.src = "img/"+num+".jpg";
			scoreDiv.appendChild(img);
		}
	}




	function createPipe(){
		var li = document.createElement('li');
		li.className = "pipe";
		var topHeight = randNumber(50,200);
		var bottomHeight = 300-topHeight;
		li.innerHTML="<div class='pipeTop' style='height:"+topHeight+"px'><div></div></div>"+"<div class='pipeBottom' style='height:"+bottomHeight+"px'>"+"<div></div></div>"
		pipeWrap.appendChild(li);

		// 标记 如果这个 li 的lock 为false,代表它没有被记录过分数,如果为true 的代表已经记录一次分数,不可再次加分
		li.lock = false;


		// li 的出现定时器
		li.appearTimer =setInterval(function(){
			var liLeft = li.offsetLeft -3;
			if(liLeft <=-70){
				// 删除LI,并且清除定时器
				clearInterval(li.appearTimer);
				pipeWrap.removeChild(li);
			}
			li.style.left = liLeft + 'px';
			if(li.offsetLeft + li.offsetWidth< flyBird.offsetLeft && li.lock == false){
				li.lock = true;
				// 加分
				addScore();
			}
		},30)
	}

	// 开始游戏
	function gameStart(){
		head.style.display = "none";
		btns.style.display = "none";
		flyBird.style.display = "block";
		
		// 播放音乐
		gameMusic.play();

		// 小鸟下落
		downTimer = setInterval(birdDown,30);
		// 碰撞检测
		crashTimer = setInterval(crashCheck,20)
		// 出现管道
		pipeTimer = setInterval(createPipe,3000);
	}
	
	// 点击 wrap 的处理函数
	function birdUp(){
		// 播放点击音乐
		bullet.pause();
		if(bullet.pause){
			bullet.play();
		}
		

		// 清除下落的定时器
		clearInterval(downTimer);
		clearInterval(upTimer); // 如果点击速度比较快,上一次移动过程没有完毕,则直接结束他	
		speed = maxSpeed;

		// 更换小鸟为上升图片
		flyBirdImg.src= "img/up_bird1.png"
		upTimer = setInterval(function(){
			speed -=0.7;
			if(speed <= 0){
				clearInterval(upTimer);
				downTimer = setInterval(birdDown,30);
			} 
			flyBird.style.top = flyBird.offsetTop - speed+'px';
		},30)
	}



	// 初始入口函数
	function init(){
		// 1、给开始按钮绑定事件
		start.onclick = function(event){
			var ev = event || window.event;
			var ev = event || window.event;
			if(ev.stopPropagation){
				ev.stopPropagation();
			}else{
				ev.cancelBubble = true;
			}
			 gameStart();
			 // 2.给 wrap 绑定点击事件,点击的时候,小鸟可以向上移动
			flyWrap.onclick =function(){
				birdUp();
			}
		}
		
	}
	init();
	
}
game();