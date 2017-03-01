function rollFun(){
	var wheel = document.getElementById('wheel');
	var content = document.getElementById('two');
	var timing = document.getElementsByTagName('timing');
	var lis = document.getElementsByTagName('li');
	var imgs = content.getElementsByTagName('img');
	var bgcl = document.getElementById('bgcl');
	var cl=['rgb(2,115,225)','rgb(255,104,69)','rgb(42,170,173)','rgb(204,177,148)','rgb(177,196,197)','rgb(219,153,152)','rgb(234,219,212)','rgb(255,197,199)','rgb(253,249,240)']
	content.style.width = imgs.length*wheel.offsetWidth+'px';
	for(var i = 0;i<lis.length;i++){
		lis[i].index = i;	
		lis[i].onmouseover = function(){
			var currenIndex = this.index;
			content.style.left = 700 * currenIndex * -1+'px';
			imgs[currenIndex].className ='animated fadeInLeft timing';
			bgcl.style.background = cl[currenIndex];
			bgcl.className = 'animated fadeInRight timing';
		}
		lis[i].onmouseout = function(){
			var currenIndex = this.index;
			imgs[currenIndex].className ='';
			bgcl.className = '';
		}
		
	}
}
rollFun();
