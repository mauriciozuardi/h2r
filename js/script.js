//globals
//timeline
initDate = 0;
timeline = [];
//eventos
createdDots = 0;
eventDotInstances = [];

//começa qdo carregar o DOM
$(init);

//confere se tem algo na URL
URLvars = getUrlVars();
sID = URLvars.sID;

//config e debug
showDateDetails = false;
imgName = "";
timeMarksStr = "";
aDay = "hoje";

function init(){
	//que dia/hora são?
	if(aDay != 'hoje'){
		initDate = new Date(aDay);
		initNow = initDate.getTime();
	} else {
		initNow = Date.now(); //ms desde 01 Jan 1970
		initDate = new Date();
	}
	
	//
	incluiLogo();
	resizeBg();
	// drawTimeline();		//<-- vai desenhar qdo carregar a planilha "Sites"
	// drawHomeEvents();	//<-- vai desenhar qdo acabar de carregar tudo (JSONFromSpreadsheetToJSObjects.js cuida disso)
	resizeEventWindow();
	
	//ajusta a altura do body no resize
	$(window).resize(function (event){
		resizeBg();
		resizeTimeline();
		resizeEventWindow();
		resizeEvents();
	});
}

function incluiLogo(){
	//vem do config/debug (acima)
	$("<img src='./img/" + imgName + "' alt=''/>").appendTo('#header');
}

function resizeBg(){
	$('#bgPhoto').css('height', $(window).height());
}

function drawTimeline(){
	//trata os nomes e datas
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
		//showDateDetails vem do config/debug (acima)
		if(showDateDetails){
			//debug
			var html = "<div class='line l" + i + "'><span><span class='bullet'>|</span>" + timeline[i].htmlLabel.replace(/ /g, '&nbsp;') + " " + "</br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br>" + timeline[i].date.toDateString() + "</br></br>" + timeline[i].date.toTimeString() + "</span></div>";
		} else {
			//produção
			var html = "<div class='line l" + i + "'><span><span class='bullet'>|</span>" + timeline[i].htmlLabel.replace(/ /g, '&nbsp;') + "</span></div>";
		}
		//inclui o elemento no html, dentro do div #timelineGrid
		$(html).appendTo('#timelineGrid');
	}
	
	//inclui a linha tracejada
	var html = "<div class='line t'></div>";
	//inclui o elemento no html, dentro do div #timelineGrid
	$(html).appendTo('#timelineNow');
	
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
	//ajusta linhas normais
	safeMargin = 30;
	for(var i in timeline){
		//define
		var str = '.line.l' + i;
		var element = $(str);
		var w = Math.max(960, $(window).width());
		var step = ((w - (2*safeMargin))/timeline.length);
		var position = Math.floor(safeMargin + i * step + (step/2));
		//armazena
		timeline[i].position = position;
		//aplica na tela
		element.css('left', position);
	}
	
	//ajusta a linha tracejada
	$('.line.t').css('left', dateToPosition(Date.now()))
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
				//parte do princípio que a string refere-se a uma data (corretamente formatada) e substitui de volta os &nbsp; por espaço.
				timeline[i].date = new Date (timeline[i].dateStr); // "January 6, 1972 16:05:00"
				break;
		}
		// console.log(timeline[i].htmlLabel + " : " + timeline[i].date.toDateString());
	}
}

function EventDot(ca){
	//ca = id, nome, atalho, tipo, visual, onde, titulomanual, tituloempixels, sinopse, sobre, credito, site, imagens e atividades
	
	//DEFAULTS
	
	// this.id							= createdDots; createdDots++;
	this.id = ca.siteId + "-" + ca.id;
	
	// this.visual					= (eventData.visual) ? eventData.visual : "p"; //refere-se ao visual da bolinha na timeline.
	this.visual = (ca.visual) ? ca.visual : "p";
	// this.visual = "g";
	
	// this.onde						= (eventData.onde) ? eventData.onde : "lugar sem nome";
	if(ca.onde){
		//se cadastrou o nome do local (para o caso de acontecer em todas as Starbucks, por exemplo)
		var nomeLocal = ca.onde;
	} else if(ca.atalho){
		//senão, procura o atalho para a atividade em questão (para o caso de ser um grupo de uma atividade só)
		var nomeLocal = ca.atalho; //< se existir, confere se tem um espaço só e usa o nome
	} else {
		//senão, assume que não foi cadastrado
		var nomeLocal = "CADASTRAR LOCAL";
	}
	this.onde = nomeLocal;
	
	// this.quem						= (eventData.quem) ? eventData.quem : "pessoa sem nome";
	// this.oque						= (eventData.oque) ? eventData.oque : "atividade sem nome";
	// this.oqueTipo				= (eventData.oqueTipo) ? eventData.oqueTipo : "atividade indefinida";
	// this.separador			= (eventData.separador) ? eventData.separador : " // ";
	// this.textoHome			= (eventData.textoHome) ? eventData.textoHome : "Lorem ipsum ..";
	
	//descobre o range
	// console.log(ca.atividades);
	var arrAtividades = ca.atividades.split(', ');
	for (var i in arrAtividades){
		// console.log(i);
		// console.log(a[ca.siteId][arrAtividades[i]]);
		this.dataInicial	= googleDateToDate(a[ca.siteId][arrAtividades[i]].datainicial);
		this.dataFinal		= googleDateToDate(a[ca.siteId][arrAtividades[i]].datafinal);
	}
	
	//check-in
	eventDotInstances.push(this);
}

function googleDateToDate(gDate){
	//fatia a string de data do Google
	var a = gDate.split(" "); //separa 0:data 1:hora
	a[0] = a[0].split("/"); //separa 0:mês 1:dia 2:ano
	if(a.length == 2){
		a[1] = a[1].split(":"); //separa 0:horas 1:minutos 2:segundos
		var h = a[1][0];
		var m = a[1][1];
		var s = a[1][2];
	} else {
		var h = 0;
		var m = 0;
		var s = 0;
	}
	
	var date = new Date(parseInt(a[0][2]), parseInt(a[0][0])-1, parseInt(a[0][1]), parseInt(h), parseInt(m), parseInt(s), 0);
	// console.log(date.toDateString());
	return date;
}

EventDot.killThemAll = function(){
	//remove os elemento do HTML
	//reseta a lista de instâncias
}

EventDot.drawThemAll = function(){
	for(var i in eventDotInstances){
		var e = eventDotInstances[i];
		
		//cria o DIV com id com a bolinha, range e label dentro
		var html = "<div onclick='dotClicked' class='event e" + e.id + "'><span class='range'><span data-id='" + e.id + "' class='dot'></span></span><span class='label'>" + e.onde + "</span></div>";
		$(html).appendTo('#events');
		
		//aplica as classes baseado no status
		e.updateVisual();
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
			//força o tamanho do div
			div.css('height', dot.outerHeight('false'));
		break;
		
		//pequeno
		case "p":
			if(dot.hasClass('unselected'))	dot.removeClass('unselected');
			if(dot.hasClass('big'))					dot.removeClass('big');
			if(dot.hasClass('disabled'))		dot.removeClass('disabled');
			if(range.hasClass('hidden'))		range.removeClass('hidden');
			if(!range.hasClass('mini'))			range.addClass('mini');
			if(!label.hasClass('hidden'))		label.addClass('hidden');
			//força o tamanho do div
			div.css('height', dot.outerHeight('false'));
		break;
		
		//grande
		case "g":
			if(dot.hasClass('unselected'))	dot.removeClass('unselected');
			if(!dot.hasClass('big'))				dot.addClass('big');
			if(dot.hasClass('disabled'))		dot.removeClass('disabled');
			if(range.hasClass('hidden'))		range.removeClass('hidden');
			if(range.hasClass('mini'))			range.removeClass('mini');
			if(label.hasClass('hidden'))		label.removeClass('hidden');
			//força o tamanho do div
			div.css('height', (dot.outerHeight('false')+1));
		break;
		
		//selecionado
		case "s":
			if(!dot.hasClass('unselected'))	dot.addClass('unselected');
			if(!dot.hasClass('big'))				dot.addClass('big');
			if(dot.hasClass('disabled'))		dot.removeClass('disabled');
			if(range.hasClass('hidden'))		range.removeClass('hidden');
			if(range.hasClass('mini'))			range.removeClass('mini');
			if(label.hasClass('hidden'))		label.removeClass('hidden');
			//força o tamanho do div
			div.css('height', dot.outerHeight('false'));
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
	
	this.posicionar();
}

EventDot.prototype.posicionar = function(){
	var div = $('div.e' + this.id);
	var dot = $('div.e' + this.id + ' .dot');
	var range = $('div.e' + this.id + ' .range');
	var label = $('div.e' + this.id + ' .label');
	
	var t = Date.now();
	var t0 = this.dataInicial.getTime();
	var t1 = this.dataFinal.getTime();
	
	// //posiciona o começo do evento
	var x0 = dateToPosition(t0);
	x0 -= dot.outerWidth(false)/2;	//compensa o tamanho da bolinha
	div.css('margin-left', x0);
	
	//posiciona o fim do evento
	var x1 = dateToPosition(t1);
	var rangeEnd = x1-x0;
	var length = rangeEnd += dot.outerWidth(false)/2;	//compensa o tamanho da bolinha
	range.css('width', length);
	
	//posiciona a bolinha, representando o progresso geral do evento
	t = (t < t0) ? t0 : t;
	t = (t > t1) ? t1 : t;
	var x = dateToPosition(t) - x0;
	if(dot.hasClass('big')){
		x -= dot.outerWidth(false)/2;	//compensa o tamanho da bolinha grande
	} else {
		x -= (dot.outerWidth(false)/2) - 1;	//compensa o tamanho da bolinha pequena
	}
	dot.css('margin-left', x);
	
	//posiciona o label
	//centraliza texto em relação a bola
	// ml = (dot.outerWidth(false)/2)-(label.outerWidth(false)/2);
	//considera o deslocamento da bola
	// ml += parseInt(dot.css('margin-left'));
	ml = parseInt(dot.css('margin-left')) + dot.outerWidth(false) + 7;
	//aplica
	label.css('margin-left', ml);
}

// EventDot.prototype.dateToPosition = function(t){
function dateToPosition(t){	
	if(t >= timeline[timeline.length-1].date.getTime()){
		//se t for maior que a última marca da timeline
		return $(window).width() + 50;
	} else if(t < timeline[0].date.getTime()){
		//se t for menor que a primeira marca da timeline
		return -50;
	} else {
		//t está entre alguma das marcas
		//identifica o intervalo
		var t0, t1, index;
		for(var i=0; i < timeline.length-1; i++){
			t0 = timeline[i].date.getTime();
			t1 = timeline[i+1].date.getTime();
			if(t >= t0 && t < t1){
				index = i;
				break;
			}
		}
		//posiciona t
		var x0 = timeline[index].position;
		var x1 = timeline[index+1].position - 1;
		var xRange = x1 - x0;
		var timeRange = t1 - t0;
		var t0a1 = (t-t0)/timeRange;
		var ml = x0 + (xRange * t0a1);
		//retorna
		return Math.round(ml);
	}
}

EventDot.prototype.die = function(){
	//remove o elemento do HTML
	//se remove da lista (check-out)
}

function drawHomeEvents(){
	//criaEventos();//vem do db.js
	criaEventosHome();
	EventDot.drawThemAll();
}

function criaEventosHome(){
	//cria os elementos HTML
	if(sID){
		//varre os CAs do 'site' em questão
		for(var j in ca[sID]){
			//cria uma bolinha para cada
			// console.log(["ca." + sID + "." + j, ca[sID][j]]);
			var obj = ca[sID][j];
			obj.siteId = sID;
			new EventDot(obj);
		}		
	} else {
		//varre todos os CAs
		for (var i in s){
			for(var j in ca[s[i].id]){
				//cria uma bolinha para cada
				// console.log(["ca." + i + "." + j, ca[s[i].id][j]]);
				var obj = ca[s[i].id][j];
				obj.siteId = i;
				new EventDot(obj);
			}
		}
	}
	
	//prepara o clique
	// $('.dot').click(function (event){dotClicked(event);});
}

function resizeEventWindow(){
	//ajusta o tamanho do div q contém as instâncias de EventDot
	var marginTop = 50;
	$('#events').css('top', $('#header').height() + marginTop);
	$('#events').css('height', $(window).height() - $('#header').height() - $('#aboutInfo').height() - marginTop);
}

function resizeEvents(){
	//resize em todos
	for(var i in eventDotInstances){
		eventDotInstances[i].posicionar();
	}
}

function dotClicked(event){
	//pega o elemento
	element = $(event.target);
	console.log(element);
	// console.log(element.data('id'));
}

function getUrlVars(){
	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for(var i = 0; i < hashes.length; i++){
	  hash = hashes[i].split('=');
	  vars.push(hash[0]);
	  vars[hash[0]] = hash[1];
	}
	return vars;
}