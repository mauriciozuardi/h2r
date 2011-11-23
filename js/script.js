//globals
//timeline
initDate = 0;
timeline = [];
//eventos
createdEvents = 0;
eventDotInstances = [];

//começa qdo carregar o DOM
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
	
	//
	incluiLogo();
	drawTimeline();
	resizeBg();
	resizeEvents();
	drawHomeEvents();
	
	//ajusta a altura do body no resize
	$(window).resize(function (event){
		resizeBg();
		resizeEvents();
		resizeTimeline()
	});
}

function incluiLogo(){
	//considerando receber imgName do helena.js
	$("<img src='./img/" + imgName + "' alt='Logo Agenda de Fotografia'/>").appendTo('#header');
}

function resizeBg(){
	$('#bgPhoto').css('height', $(window).height());
}

function drawTimeline(){
	//trata os nomes e datas
	
	//considerando q recebo essa string do helena.js (futuramente do php)
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
		//considerando receber showDateDetails do helena.js (futuramente: sempre false)
		if(showDateDetails){
			//debug
			var html = "<div class='line l" + i + "'><spam><spam class='bullet'>|</spam>" + timeline[i].htmlLabel.replace(/ /g, '&nbsp;') + " " + timeline[i].date.toDateString() + "</br></br>" + timeline[i].date.toTimeString() + "</spam></div>";
		} else {
			//produção
			var html = "<div class='line l" + i + "'><spam><spam class='bullet'>|</spam>" + timeline[i].htmlLabel.replace(/ /g, '&nbsp;') + "</spam></div>";
		}
		//inclui o elemento no html, dentro do div #timelineGrid
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
	// var date		= initDate.getDate();
	var weekday = initDate.getDay();
	// var hours		= initDate.getHours();
	// var minutes	= initDate.getMinutes();
	// var seconds	= initDate.getSeconds();
	
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
				break;
			case "último finde":
				//calcula a quantidade de dias até o próximo final de semana e define a data
				if(weekday > 0 && weekday < 6){
						//se não está no final de semana
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
				//calcula a quantidade de dias até o próximo final de semana e define a data
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
				break;
			default:
				//parte do princípio que a string refere-se a uma data (e está corretamente formatada) e substitui de volta os &nbsp; por espaço.			
				timeline[i].date = new Date (timeline[i].dateStr); // "January 6, 1972 16:05:00"
				break;
		}
		// console.log(timeline[i].htmlLabel + " : " + timeline[i].date.toDateString());
	}
}

function EventDot(eventData){
	//init values
	//Legenda Visual  :   a:apagado; p:pequeno; g:grande; s:selecionado; b:balloon; d:desaparecendo; 
	this.id							= createdEvents; createdEvents++;
	this.dataInicial		= (eventData.dataInicial) ? new Date(eventData.dataInicial) : new Date();
	this.dataFinal			= (eventData.dataFinal) ? new Date(eventData.dataFinal) : new Date();
	this.visual					= (eventData.visual) ? eventData.visual : "p"; //refere-se ao visual da bolinha na timeline.
	this.onde						= (eventData.onde) ? eventData.onde : "lugar sem nome";
	this.quem						= (eventData.quem) ? eventData.quem : "pessoa sem nome";
	this.oque						= (eventData.oque) ? eventData.oque : "atividade sem nome";
	// this.oqueTipo				= (eventData.oqueTipo) ? eventData.oqueTipo : "atividade indefinida";
	this.separador			= (eventData.separador) ? eventData.separador : " // ";
	this.textoHome			= (eventData.textoHome) ? eventData.textoHome : "Lorem ipsum ..";
			
	//check-in
	eventDotInstances.push(this);
}

EventDot.resizeThemAll = function(){
	
}

EventDot.killThemAll = function(){
	//remove os elemento do HTML
	//reseta a lista de instâncias
}

EventDot.drawThemAll = function(){
	for(var i in eventDotInstances){
		var e = eventDotInstances[i];
		
		//cria o DIV com id com a bolinha, range e label dentro
		var html = "<div class='event e" + e.id + "'><spam class='range'><spam class='dot'></spam></spam><spam class='label'>" + e.onde + "</spam></div>";
		$(html).appendTo('#events');
		
		//aplica as classes baseado no status
		e.updateVisual();
		
		//debug
		console.log(eventDotInstances[i]);
	}
}

EventDot.prototype.updateVisual = function(){
	var div = $('div.e' + this.id);
	var dot = $('div.e' + this.id + ' .dot');
	var range = $('div.e' + this.id + ' .range');
	var label = $('div.e' + this.id + ' .label');
	var ml = 0;
	
	switch (this.visual){
		//apagado
		case "a":
			if(dot.hasClass('unselected'))	dot.removeClass('unselected');
			if(dot.hasClass('big'))					dot.removeClass('big');
			if(!dot.hasClass('disabled'))		dot.addClass('disabled');
			if(!range.hasClass('hidden'))		range.addClass('hidden');
			if(!range.hasClass('mini'))			range.addClass('mini');
			if(!label.hasClass('hidden'))		label.addClass('hidden');
		break;
		
		//pequeno
		case "p":
			if(dot.hasClass('unselected'))	dot.removeClass('unselected');
			if(dot.hasClass('big'))					dot.removeClass('big');
			if(dot.hasClass('disabled'))		dot.removeClass('disabled');
			if(range.hasClass('hidden'))		range.removeClass('hidden');
			if(!range.hasClass('mini'))			range.addClass('mini');
			if(!label.hasClass('hidden'))		label.addClass('hidden');
		break;
		
		//grande
		case "g":
			if(dot.hasClass('unselected'))	dot.removeClass('unselected');
			if(!dot.hasClass('big'))				dot.addClass('big');
			if(dot.hasClass('disabled'))		dot.removeClass('disabled');
			if(range.hasClass('hidden'))		range.removeClass('hidden');
			if(range.hasClass('mini'))			range.removeClass('mini');
			if(label.hasClass('hidden'))		label.removeClass('hidden');
			//centraliza texto em relação a bola
			ml = 15-((parseInt(label.css('width'))+20)/2); //15 = meia bola grande; 20 = 10+10 de padding lateral do label
			//considera o deslocamento da bola
			ml += parseInt(dot.css('margin-left'));
			//aplica
			label.css('margin-left', ml);
		break;
		
		//selecionado
		case "s":
			if(!dot.hasClass('unselected'))	dot.addClass('unselected');
			if(!dot.hasClass('big'))				dot.addClass('big');
			if(dot.hasClass('disabled'))		dot.removeClass('disabled');
			if(range.hasClass('hidden'))		range.removeClass('hidden');
			if(range.hasClass('mini'))			range.removeClass('mini');
			if(label.hasClass('hidden'))		label.removeClass('hidden');
			//centraliza texto em relação a bola
			ml = 15-((parseInt(label.css('width'))+20)/2); //15 = meia bola grande; 20 = 10+10 de padding lateral do label
			//considera o deslocamento da bola
			ml += parseInt(dot.css('margin-left'));
			//aplica
			label.css('margin-left', ml);
		break;
		
		//balloon
		case "b":
							// ** preencher **
		break;
		
		//desaparecendo
		case "d":
							// ** preencher **
		break;
	}
}

EventDot.prototype.die = function(){
	//remove o elemento do HTML
	//se remove da lista (check-out)
}

function drawHomeEvents(){
	criaEventos();
	EventDot.drawThemAll();
}

function resizeEvents(){
	//ajusta o tamanho do div q contém as instâncias de EventDot
	var marginTop = 50;
	$('#events').css('top', $('#header').height() + marginTop);
	$('#events').css('height', $(window).height() - $('#header').height() - $('#aboutInfo').height() - marginTop);
	
	//resize em todos
	
}