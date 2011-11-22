//globals
initDate = 0;
timeline = [];
timeTable = []; //relacionada à tabela acima

$(init);

function init(){
	//que dia/hora são?
	//considerando receber aDay do helena.js (futuramente usaremos só o else)
	if(aDay != 'hoje'){
		initDate = new Date(aDay);
		initNow = initDate.getTime();
	} else {
		initNow = Date.now(); //ms desde 01 Jan 1970
		initDate = new Date();
	}
	
	console.log(initDate.toDateString());
	// console.log(initDate.getFullYear());
	// console.log(initDate.getMonth());
	// console.log(initDate.getDate());
	// console.log(initDate.getHours());
	// console.log(initDate.getMinutes());
	// console.log(initDate.getSeconds());
	// console.log(initNow);
	// console.log(initDate.getDay());
	
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
	//trata os nomes e datas
	
	//considerando q recebo essa string do helena.js (futuramente do php)
	//timeMarksStr = 'mês passado|último finde|ontem|hoje|amanhã|próximo finde|mês que vem';
	//timeMarksStr = 'mês passado|último finde|ontem|hoje|amanhã|próximo finde|mês que vem|fim do mundo=December 21, 2012 00:00:00';
	
	timeline = timeMarksStr.split('|');
	for (var i in timeline){
		timeline[i] = timeline[i].split('=');		
		var obj = {};
		obj.htmlLabel = timeline[i][0] // afeta todas as instancias do caractere entre //g;
		obj.dateStr = timeline[i][1];
		timeline[i] = obj;
	}
	
	//
	updateTimelineDates();
	
	//cria os elementos
	for(var i in timeline){
		//produção
		// var html = "<div class='line l" + i + "'><spam><spam class='bullet'>•</spam>" + timeline[i].htmlLabel.replace(/ /g, '&nbsp;') + "</spam></div>";
		
		//debug
		var html = "<div class='line l" + i + "'><spam><spam class='bullet'>•</spam>" + timeline[i].htmlLabel.replace(/ /g, '&nbsp;') + " " + timeline[i].date.toDateString() + "</br></br>" + timeline[i].date.toTimeString() + "</spam></div>";
		$(html).appendTo('#timelineGrid');
	}
	
	//ajusta a altura das linhas
	$('.line').css('height', $(window).height());
	
	//posiciona as linhas no eixo x
	ajustaLinhas();
}

function resizeTimeline(){
	//ajusta altura da linha
	$('.line').css('height', $(window).height());
	
	//ajusta posição x das linhas
	ajustaLinhas();
}

function ajustaLinhas(){
	safeMargin = 30;
	for(var i in timeline){
		var str = '.line.l' + i;
		var element = $(str);
		var w = Math.max(960, $(window).width());
		var step = ((w - (2*safeMargin))/timeline.length);
		var position = Math.floor(safeMargin + i * step + (step/2));
		element.css('left', position);
	}
}

function updateTimelineDates(){
	var year		= initDate.getFullYear();
	var month		= initDate.getMonth();
	var date		= initDate.getDate();
	var weekday = initDate.getDay();
	var hours		= initDate.getHours();
	var minutes	= initDate.getMinutes();
	var seconds	= initDate.getSeconds();
	
	//cola (em milissegundos)
	//um segundo:	1000
	//um minuto:	1000*60
	//uma hora:		1000*60*60
	//um dia:			1000*60*60*24
	//uma semana:	1000*60*60*24*7
	//um mês: 		1000*60*60*24*7*28
	//						1000*60*60*24*7*29
	//						1000*60*60*24*7*30
	//						1000*60*60*24*7*31
	//um ano: 		1000*60*60*24*7*365
	//						1000*60*60*24*7*366
	
	var oneDayInMs = 1000*60*60*24;
	
	for(var i in timeline){
		switch (timeline[i].htmlLabel){
			case "mês passado":
				// se for janeiro, mês passado é dezembro!
				if(month == 0){
					month = 11;
					year --;
				} else {
					month --;
				}
				//armazena data
				timeline[i].date = new Date (year, month, 1, 0, 0, 0);
				//zera o relógio
				timeline[i].date.setHours(0);
				timeline[i].date.setMinutes(0);
				timeline[i].date.setSeconds(0);
				break;
			case "último finde":
				//se não está no final de semana
				if(weekday > 0 && weekday < 6){
					timeline[i].date = new Date (initNow - (oneDayInMs*(weekday+1)));
					} else if (weekday == 0){
						//se é domingo
						timeline[i].date = new Date (initNow - (oneDayInMs*7));
					} else if(weekday == 6){
						//se é sábado
						timeline[i].date = new Date (initNow - (oneDayInMs*6));
					}
					//zera o relógio
					timeline[i].date.setHours(0);
					timeline[i].date.setMinutes(0);
					timeline[i].date.setSeconds(0);
				break;
			case "ontem":
				timeline[i].date = new Date (initNow - oneDayInMs);
				//zera o relógio
				timeline[i].date.setHours(0);
				timeline[i].date.setMinutes(0);
				timeline[i].date.setSeconds(0);
				break;
			case "hoje":
				timeline[i].date = new Date (initNow);
				//zera o relógio
				timeline[i].date.setHours(0);
				timeline[i].date.setMinutes(0);
				timeline[i].date.setSeconds(0);
				break;
			case "amanhã":
				timeline[i].date = new Date (initNow + oneDayInMs);
				//zera o relógio
				timeline[i].date.setHours(0);
				timeline[i].date.setMinutes(0);
				timeline[i].date.setSeconds(0);
				break;
			case "próximo finde":
				// if(weekday > 0 && weekday < 6){
				// 	//se não está no final de semana
				// 	timeline[i].date = new Date (initNow + (oneDayInMs*(6-weekday)));
				// } else if (weekday == 0){
				// 	//se é domingo
				// 	timeline[i].date = new Date (initNow + (oneDayInMs*6));
				// } else if(weekday == 6){
				// 	//se é sábado
				// 	timeline[i].date = new Date (initNow + (oneDayInMs*7));
				// }
				
				//simplificação do código comentado acima
				if(weekday == 6){
					timeline[i].date = new Date (initNow + (oneDayInMs*7));
				} else {
					timeline[i].date = new Date (initNow + (oneDayInMs*(6-weekday)));
				}
				//zera o relógio
				timeline[i].date.setHours(0);
				timeline[i].date.setMinutes(0);
				timeline[i].date.setSeconds(0);
				break;
			case "mês que vem":
				// se for dezembro, mês que vem é dezembro!
				if(month == 11){
					month = 0;
					year ++;
				} else {
					month ++;
				}
				//armazena
				timeline[i].date = new Date (year, month+1, 1, 0, 0, 0);
				//zera o relógio
				timeline[i].date.setHours(0);
				timeline[i].date.setMinutes(0);
				timeline[i].date.setSeconds(0);
				break;
			default:
				//parte do princípio que a string refere-se a uma data (e está corretamente formatada) e substitui de volta os &nbsp; por espaço.			
				timeline[i].date = new Date (timeline[i].dateStr); // "January 6, 1972 16:05:00"
				break;
		}
		// console.log(timeline[i].htmlLabel + " : " + timeline[i].date.toDateString());
	}
}

function placeObj(element, startDate, endDate){	
	 
}

function drawEvents(){

}

function resizeEvents(){
	
}