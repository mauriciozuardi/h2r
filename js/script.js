$(init);

function init(){
	//ajusta a altura do body no onload
	updateSizeAndPosition();
	//ajusta a altura do body no resize
	$(window).resize(function (event){
		updateSizeAndPosition();
	});	
}

function updateSizeAndPosition(){
	$('.bgPhoto').css('height', $(window).height());
}