$(init);

function init(){
	//ajusta a altura do body no onload
	resizedBg();
	drawEvents();
	//ajusta a altura do body no resize
	$(window).resize(function (event){
		resizedBg();
		resizedEvents();
	});
}

function resizedBg(){
	$('.bgPhoto').css('height', $(window).height());
}

function drawEvents(){
	
}

function resizedEvents(){
	
}