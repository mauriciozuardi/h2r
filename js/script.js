//globals
nLinhas = 0;

$(init);

function init(){
	//ajusta a altura do body no onload
	drawTimeline();
	resizeBg();
	//ajusta a altura do body no resize
	$(window).resize(function (event){
		resizeBg();
		resizeEvents();
		resizeTimeline()
	});
}

function resizeBg(){
	$('#bgPhoto').css('height', $(window).height());
	$('#photoCover').css('height', $(window).height());
}

function drawTimeline(){
	//trata os nomes e atualiza a quantidade de linhas
	tlLabels_str = 'mês passado,último finde,ontem,hoje,amanhã,próximo finde,mês que vem';
	tlLabels_str = tlLabels_str.replace(/ /g, '&nbsp;'); // afeta todas as instancias do caractere entre //g
	timelineLabels = tlLabels_str.split(',');
	nLinhas = timelineLabels.length;
	
	//cria os elementos
	for(var i in timelineLabels){
		var html = "<div class='line l" + i + "'><spam><spam class='bullet'>•</spam>" + timelineLabels[i] + "</spam></div>";
		$(html).appendTo('#timelineGrid');
	}
	
	//ajusta a altura das linhas
	// $('.line').css('top', $('#header').height());
	// $('.line').css('height', $(window).height() - $('#header').height());
	$('.line').css('height', $(window).height());
	
	//posiciona as linhas no eixo x
	ajustaLinhas();
}

function resizeTimeline(){
	//ajusta altura da linha
	// $('.line').css('top', $('#header').height());
	// $('.line').css('height', $(window).height() - $('#header').height());
	$('.line').css('height', $(window).height());
	
	//ajusta posição x das linhas
	ajustaLinhas();
}

function ajustaLinhas(){
	safeMargin = 30;
	for(var i=0; i<nLinhas; i++){
		var str = '.line.l' + i;
		var element = $(str);
		var w = Math.max(960, $(window).width());
		var step = ((w - (2*safeMargin))/nLinhas);
		var position = Math.floor(safeMargin + i * step + (step/2));
		element.css('left', position);		
	}
}

function drawEvents(){

}

function resizeEvents(){
	
}