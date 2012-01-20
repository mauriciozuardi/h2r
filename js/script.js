//globals
//timeline
initDate = 0;
timeline = [];
dotSelected = {};
//eventos
createdDots = 0;
eventDotInstances = [];
dotsZuadas = [];
destaques = [];
MIN_WIDTH = 960;
//balloon
nSlideImgs = 0;
selectedSlideImgIndex = 0;
SLIDESHOW_IMG_W = 324;
//home
PHRASE_SNAP_FACTOR = .2;
IDEAL_SINOPSE_CHAR_COUNT = 425;


//começa qdo carregar o DOM
$(init);

//confere se tem algo na URL
URLvars = customGetUrlVars();
sID = URLvars.sID ? URLvars.sID : "s1";

//config e debug
showDateDetails = false;
timeMarksStr = "";

// function countTo(n){
// 	var numero = "";
// 	var numeros = "";
// 	var nDecimais = (parseInt(n)).toString().length;
// 	for (var i=1; i <= n; i++){
// 		var iDecimais = i.toString().length;
// 		var numero = "";
// 		for (var j=1; j<=(nDecimais - iDecimais); j++){
// 			numero += "0";
// 		}
// 		numero += i;
// 		numeros += numero + '\n';
// 	}
// 	
// 	$('#header').html("<textarea cols='30' rows='10'>" + numeros + "</textarea>");
// 	$('#output').val(numeros);
// 	// console.log(n + " (" + nDecimais + ")");
// 	// $('#header').html("<p>" + n + " (" + nDecimais + ")</p>");
// }

function init(){
	console.log(['URLparts', [window.location.host, window.location.search, window.location.hash]]);
	
	initNow = Date.now(); //ms desde 01 Jan 1970
	initDate = new Date();
	resizeBg();
	
	//aplica os cliques "fixos" do balloon
	$('.balloon.top .fechar').click(function(event){fechaBalloon(event);});
	$('#slideshow-controls .previous').click(function(event){prevSlideImg(event)});
	$('#slideshow-controls .next').click(function(event){nextSlideImg(event)});
	
	//ajusta a altura do body no resize
	$(window).resize(function(event){
		resizeBg();
		resizeTimeline();
		resizeEventWindow();
		resizeEvents();
		recenterBalloon();
	});
	
	$(window).scroll(function(){
		resizeBg();
		resizeTimeline();
		resizeEventWindow();
		resizeEvents();
		recenterBalloon();
  });
}

// function onPullDownChange(element){
// 	// https://spreadsheets.google.com/feeds/list/0AnLIuvvW8l93dEp2UkxfOS1PVE02OFlpS1Btc2g5U0E/4/public/basic?alt=json&q=Afetos
// 	var query = "&q=" + element.val();
// 	query = encodeURI(query);
// 	$.getJSON("https://spreadsheets.google.com/feeds/list/" + s[sID].key + "/4/public/basic?alt=json" + query, function(json){mostraRetorno(json)});
// }

function onPullDownOqueChange(element){
	var searchWord = element.val();
	reloadWithSearch(searchWord);
}

function onPullDownOndeChange(element){
	var searchWord = ondeID(element.val());
	reloadWithSearch(searchWord);
}

function onPullDownQuemChange(element){
	var searchWord = element.val();
	// if(nomeEhID(searchWord)){
	// 	reloadWithSearch(searchWord);
	// } else {
	// 	console.log('ops');
	// 	var id = nomeID(searchWord);
	// 	id ? reloadWithSearch(id) : console.log('ERRO : nome não deveria estar no pulldown');
	// }
	reloadWithSearch(searchWord);
}

// function nomeEhID(nome){
// 	return p[string_to_slug(nome)];
// }
// 
// function nomeID(nomeNaoID){
// 	var possivelSlug = string_to_slug(nomeNaoID)
// 	for (var i in a[sID]){
// 		var nomes = a[sID][i].quem;
// 		if(nomes){
// 			nomes = nomes.split(', ');
// 			for(var j in nomes){
// 				if(possivelSlug == string_to_slug(nomes[j])){
// 					console.log('ACHEI! ' + nomeNaoID + ' : ' + i);
// 					return i;
// 				}			
// 			}
// 		}
// 	}
// 	return undefined;
// }

function ondeID(ondeName){
	var o = string_to_slug(ondeName)
	for (var i in e){
		if(o == string_to_slug(e[i].nome)){
			// console.log(ondeName + ' : ' + i);
			return i;
		}
	}
}

function newURLSearch(searchWord){
	searchWord = encodeURI(searchWord);
	var search = window.location.search.toString().split('q=');
	// console.log(search);
	var firstChar = (search[0] == "" || search[0] == '?') ? '?' : '&';
	var newSearch = firstChar + 'q=' + searchWord;
	// console.log(newSearch);
	return newSearch;
}

function reloadWithSearch(searchWord){
	var URL = window.location.toString().split('?');
	if(URL[1]){
		var search = URL[1].split('&');
		var searchThatShouldStay = "";
		for(var i in search){
			if(search[i].substr(0,2) != 'q='){
				(searchThatShouldStay == "") ? searchThatShouldStay = "?" : null;
				searchThatShouldStay += search[i];
			}
		}
	} else {
		searchThatShouldStay = "";
	}

	// console.log(search);
	window.location = URL[0] + searchThatShouldStay + newURLSearch(searchWord);
}

function mostraRetorno(json, id, URL){
	console.log(['As(json) ' + id, json, {'url':URL}]);
}

function updateHeader(){
	var html = "";
	
	(s[sID].esconderoque == '0') ? html += "<select class='oque'><option>o quê</option></select>"	: null;
	(s[sID].esconderonde == '0') ? html += "<select class='onde'><option>onde</option></select>"	: null;
	(s[sID].esconderquem == '0') ? html += "<select class='quem'><option>quem</option></select>"	: null;
	(URLvars.q)									 ? html += "<button type='submit' class='btn_home'>home</button>" : null;
	
	$('#header').html(html);
	incluiLogo();
	
	fillPullDown($('.oque'), 'tipo');
	fillPullDown($('.onde'), 'onde');
	fillPullDown($('.quem'), 'quem');
	
	//aplica os onChange() no header
	$('.oque').change(function(){ onPullDownOqueChange($(this)); });
	$('.onde').change(function(){ onPullDownOndeChange($(this)); });
	$('.quem').change(function(){ onPullDownQuemChange($(this)); });
	
	//aplica o click no botao
	(URLvars.q) ? $('.btn_home').click(homeClicked) : null;
}

// function voltarClicked(){
// 	window.history.back();
// 	// window.history.go(-1);
// }

function homeClicked(){
	//TITULO:   Resultado da busca o quê : expo  [home] <- não é um botão, é só um link.
	var URL = window.location.toString().split('?');
	var search = URL[1].split('&');
	var searchThatShouldStay = "";
	for(var i in search){
		if(search[i].substr(0,2) != 'q='){
			(searchThatShouldStay == "") ? searchThatShouldStay = "?" : null;
			searchThatShouldStay += search[i];
		}
	}
	// console.log(search);
	// console.log(URL[0] + searchThatShouldStay)
	window.location = URL[0] + searchThatShouldStay;
}

function fillPullDown(el, campo){
	//percorre todas as atividades procurando tipos diferentes
	var encontrados = [];
	var encontrados_ids = [];
	
	// console.log('fillPullDown : pré-loops');
	
	for(var sID_ in s){
		// console.log(sID_);
		for (var i in pd[sID_]){
			// console.log(i);
			if(pd[sID_][i][campo]){
				var variosNoMesmoCampo = pd[sID_][i][campo].split(', ');
				for (var j in variosNoMesmoCampo){
					if(campo == 'onde'){
						var valor = e[variosNoMesmoCampo[j]].nome;
					} else {
						var valor = variosNoMesmoCampo[j];					
					}
					if(!existe(valor, encontrados)){
						encontrados.push(valor);
						encontrados_ids.push(i);
					}
				}
			}
		}
	}
	// console.log('fillPullDown : fim dos loops');
	
	//exclui os que não aparecem no CA
	// var excluidos = [];
	// for(var i in encontrados){
	// 	// console.log(encontrados_ids[i] + ":" + encontrados[i]);
	// 	if(!existe(encontrados_ids[i], excluidos) && !atividadeListadaEmAlgumCA(encontrados_ids[i])){
	// 		console.log('excluindo [ ' + campo + ':' + encontrados_ids[i] + ':' + encontrados[i] + ' ]. Não aparece em nenhum CA.');
	// 		encontrados.splice(i,1);
	// 		excluidos.push(encontrados_ids.splice(i,1));
	// 	}
	// }
	
	
	// //seleciona o pull-down de acordo com a query
	// for(var i in encontrados){
	// 	console.log('testando ' + URLvars.q +' : '+ encontrados_ids[i] +' : '+ encontrados[i]);
	// 	if(encontrados[i] == URLvars.q || encontrados_ids[i] == URLvars.q){
	// 		var elementValue = encontrados[i];
	// 		console.log('Já sei! Você procurou por ' + elementValue);
	// 		break;
	// 	}
	// }
	
	//coloca em ordem alfabética
	encontrados.sort(compareAlphabet);
	
	//esconde se só tiver uma opção
	if(encontrados.length == 1){
		el.css('display','none');
	}
	
	//enfia o valor inicial no começo
	encontrados.unshift(el.val());
	// console.log(encontrados);
	
	//muda o HTML de acordo com os tipos encontrados
	var html = ""
	for (var i in encontrados){
		html += "<option>" + encontrados[i] + "</option>";
	}
	el.html(html);
}

function existe(value, array){
	// console.log(['checando se ' + value + ' existe no array', array]);
	for (var i in array){
		if(array[i] == value){ return true }
	}
	return false;
}

function incluiLogo(){
	$("<img src='./img/" + imgName + "' alt=''/>").appendTo('#header');
}

function resizeBg(){
	$('#bg-photo').css('height', $(window).height() + $(window).scrollTop());
}

function recenterBalloon(){
	var balloon = $('#balloon');
	var minTop = $('#header').outerHeight(true);
	var top = Math.floor(Math.max(minTop, (($('#events').outerHeight(true))-balloon.outerHeight(false))/2));
	var left = Math.floor((Math.max(MIN_WIDTH, $(window).width()) - balloon.outerWidth(false))/2);
	balloon.css('top', top);
	balloon.css('left', left);
}

function criaTimelineArray(){
	//trata os nomes e datas
	timeline = timeMarksStr.split('|');
	for (var i in timeline){
		timeline[i] = timeline[i].split('=');		
		var obj = {};
		obj.htmlLabel = timeline[i][0];
		obj.dateStr = timeline[i][1];
		timeline[i] = obj;
	}
	updateTimelineDates();
}

function refazTimeline(){
	var datas = {};
	datas.menor = 1.7976931348623157E+10308; //infinito
	datas.maior = 0;
	
	for(var sID_ in s){
		for(var i in a[sID_]){
			var atividade = a[sID_][i];
			// if(atividade.dvi && atividade.dvf && atividadeListadaEmAlgumCA(atividade.id)){
			// !atividadeListadaEmAlgumCA(atividade.id) ? console.log(atividade.id + ' não aparece em CA.') : null;
			if(atividade.dvi && atividade.dvf){
				//guarda os recordistas
				(atividade.dvi < datas.menor) ? datas.aMenor = atividade : null;
				(atividade.dvf > datas.maior) ? datas.aMaior = atividade : null;
				//atualiza a maior e a menor
				datas.menor = Math.min(atividade.dvi, datas.menor);
				datas.maior = Math.max(atividade.dvf, datas.maior);
			}
		}
	}
	
	//converte os datevalues em datas
	datas.menor = dvToDate(datas.menor);
	datas.maior = dvToDate(datas.maior);
	console.log(["Extremos da timeline customizada", datas]);
	
	var aI = datas.menor.getFullYear();
	var aF = datas.maior.getFullYear();
	var dA = aF - aI;
	var mI = datas.menor.getMonth();
	var mF = datas.maior.getMonth();
	
	if(dA > 0){
		//tem mais de um ano entre as datas
		var nM = (dA*12) - mI + mF;
	} else {
		//está tudo dentro do mesmo ano
		var nM = mF - mI;
	}
	
	// console.log(nM);
	var mesCurto = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
	timeline = [];
	
	for(var i=0; i<=nM+1; i++){
		var currentMonth = (mI + i)%12;
		var currentYear = aI + Math.floor( (mI+i)/12 );
		// var mostraAno = (i==0 || currentMonth == 0) ? " " + currentYear : "";
		var mostraAno = " " + currentYear;
		var timelineItem = {}
		timelineItem.date = new Date(currentYear,currentMonth,1);
		timelineItem.htmlLabel = mesCurto[currentMonth] + mostraAno;
		timeline.push(timelineItem);
	}
	// console.log("Mostrando eventos entre [" + datas.menor.toString() + "] e [" + datas.maior.toString() + "]")
}

function atividadeListadaEmAlgumCA(id, sID_){
	sID_ = sID_ ? sID_ : sID;
	for(var i in ca[sID_]){
		// console.log(i)
		var visiveis = ca[sID_][i].atividades.split(', ');
		// console.log(visiveis);
		for(var j in visiveis){
			// console.log('comparando ' + visiveis[j] + ' e ' + id);
			if(visiveis[j] == id){
				console.log(id + " aparece listada no " + ca[sID_][i].id);
				return ca[sID_][i].id;
			}
		}
	}
	console.log(id + " NAO aparece listada nos CAs carregados em " + sID_ + ".");
	return false;
}

function escreveData(date){
	// var semana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab" ];
	var mesCurto = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
	var str = date.getDate() + " de " + mesCurto[date.getMonth()] + ". de " + date.getFullYear()
	return str;
}

function drawTimeline(){
	// console.log('drawTimeline');
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
		//inclui o elemento no html, dentro do div #timeline-grid
		$(html).appendTo('#timeline-grid');
	}
	
	//inclui a linha tracejada
	var html = "<div class='line t'></div>";
	//inclui o elemento no html, dentro do div #timeline-grid
	$(html).appendTo('#timeline-now');
	
	//ajusta a altura das linhas
	$('.line').css('height', $(window).height());
	
	//posiciona as linhas no eixo x
	ajustaLinhas();
}

function resizeTimeline(){
	//ajusta altura da linha
	$('.line').css('height', $(window).height() + $(window).scrollTop());
	
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
		var w = Math.max(MIN_WIDTH, $(window).width());
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
	var atalho = ca.atividades.split(", ")[0];
	// console.log(['a.' + ca.siteId + '.' + atalho,a[ca.siteId][atalho]]);
	if(a[ca.siteId][atalho]){
		//falta alguma informação crítica?
		if(!ca.id){ return undefined }
		if(!ca.atividades){ return undefined }
		if(!ca.siteId){ return undefined }

		//ID
		this.id = ca.siteId + "-" + ca.id;
		this.i = eventDotInstances.length; //posição no array
		// console.log(this.i + " : " + this.id);

		//VISUAL
		if(atalho && a[ca.siteId][atalho].visual){
			var visual = a[ca.siteId][atalho].visual;
		} else {
			var visual = "p";
		}
		this.visual = visual;
		// console.log(this.visual);

		//ONDE < default para Agenda
		if(atalho){
			//senão, procura o atalho para a atividade em questão e confere quantos espaços tem
			var espacos = a[ca.siteId][atalho].onde;
			if(espacos){
				espacos = espacos.split(", ");
				if (espacos.length > 0){
					var nomeLocal = e[espacos[0]].nome;
				} else {
					var nomeLocal = "-";
				}
			} else {
				var nomeLocal = "-";
			}
		} else {
			//senão, assume que não foi cadastrado
			var nomeLocal = "-";
		}
		this.onde = nomeLocal;
		// console.log(this.onde);

		//O QUÊ < default para os sites
		if(atalho){
			//senão, procura o atalho para a atividade em questão e usa o nome dela
			var nomeAtividade = a[ca.siteId][atalho].nome;
		} else {
			//senão, assume que não foi cadastrado
			var nomeAtividade = "-";
		}
		this.oque = nomeAtividade;
		// console.log(this.oque);

		//QUEM
		if(atalho){
			//senão, procura o atalho para a atividade em questão e confere quantas pessoas tem listadas
			var pessoas = a[ca.siteId][atalho].quem;
			if(pessoas){
				pessoas = pessoas.split(", ");
				if (pessoas.length > 0){
					var nomePessoa = pessoas[0]; //pessoas não tem ID, o ID é o próprio nome (pedido da Helena)
				} else {
					var nomePessoa = "-";
				}
			} else {
				var nomePessoa = "-"
			}

		} else {
			//senão, assume que não foi cadastrado
			var nomePessoa = "-";
		}
		this.quem = nomePessoa;
		// console.log(this.quem);

		//DATAS
		//descobre o range de datas entre as atividades listadas
		// console.log(ca.atividades);
		if(ca.atividades){
			var arrAtividades = ca.atividades.split(', ');
		} else if (atalho){
			var arrAtividades = [atalho];
		}

		// console.log(arrAtividades);
		if(arrAtividades){
			var datas = comparaDatasDasAtividades(ca, arrAtividades);
			// console.log(datas);
			if(datas.corrupted){
				// var datas = {};
				// datas.menor = Date.now();
				// datas.maior = Date.now();
				console.log(atalho + ': data corrompida');
				return undefined;
			}
		} else {
			// var datas = {};
			// datas.menor = Date.now();
			// datas.maior = Date.now();
			console.log(atalho + ': data corrompida');
			return undefined;
		}

		//armazena as datas escolhidas
		this.dataInicial	= new Date(datas.menor);
		this.dataFinal		= new Date(datas.maior);
		
		// //empurrra uma hora e pouco pra frente para evitar problemas com horário de verão
		// if(this.dataInicial.getDate() == 1 || this.dataFinal.getDate() == 1){
		// 	var TAPEIA_VERAO = 90*60*1000;
		// 	this.dataInicial = (this.dataInicial.getDate() == 1) ? new Date(this.dataInicial.getTime()	+ TAPEIA_VERAO) : this.dataInicial;
		// 	this.dataFinal	 = (this.dataFinal.getDate() == 1) 	 ? new Date(this.dataFinal.getTime()		+ TAPEIA_VERAO) : this.dataFinal;
		// 	console.log(ca.id + "> " + this.dataInicial.toString() + "  ||  " + this.dataFinal.toString());
		// } else {
		// 	console.log(ca.id + ": " + this.dataInicial.toString() + "  ||  " + this.dataFinal.toString());			
		// }
		
		//OUTROS
		//avisa que ainda não recebeu a função de clique (para não anexar 2x)
		this.semClique = true;

		//check-in
		// eventDotInstances.push(this);
	} else {
		console.log(atalho + ' não existe em a.'+ ca.siteId);
		return undefined;
	}
}

function comparaDatasDasAtividades(ca, arrAtividades){
	var datas = {};
	datas.menor = 1.7976931348623157E+10308; //infinito
	datas.maior = 0;
	// console.log(arrAtividades);
	for (var i in arrAtividades){
		// (a[ca.siteId][arrAtividades[i]]) ? console.log(arrAtividades[i] + ' OK!') : console.log('pulando ' + arrAtividades[i]);
		if(a[ca.siteId][arrAtividades[i]]){
			// console.log(a[ca.siteId][arrAtividades[i]]);
			//descobre os candidatos
			var ci = a[ca.siteId][arrAtividades[i]].datainicial;
			var cf = a[ca.siteId][arrAtividades[i]].datafinal;
		
			//confere se a data foi cadastrada na planilha (banco)
			if(!ci || !cf){ datas.corrupted = true; return datas }
		
			//converte a data do google para a data do js
			var candidatoInicial	= googleDateToDate(ci);
			var candidatoFinal		= googleDateToDate(cf);
		 
			//confere se está tudo ok com o retorno do googleDateToDate
			if(!candidatoInicial || !candidatoFinal){ datas.corrupted = true; return datas }
		
			//vê se o candidato é maior ou menor que os anteriores
			datas.menor = Math.min(candidatoInicial.getTime(), datas.menor);
			datas.maior = Math.max(candidatoFinal.getTime(), datas.maior);
		}
	}
	return datas;
}

function googleDateToDate(gDate){
	if(!gDate){ console.log("googleDateToDate() : parâmetro indefinido"); return undefined }
	
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

EventDot.drawThemAll = function(sortBy){
	//define o sort. Default é por data inicial.
	(sortBy == 'alfabetico') ? eventDotInstances.sort(compareAlphabet) : eventDotInstances.sort(compareDates);
	
	//percorre o array criando o HTML
	for(var i in eventDotInstances){
		var e = eventDotInstances[i];
		var labelTxt = e.oque;
		var past = (e.dataFinal.getTime() < Date.now() && s[sID].passadorelevante == '0') ? " past" : "";
		
		//cria o DIV com id com a bolinha, range e label dentro
		var html = "<div data-id='" + e.id + "' class='event " + e.id + past +"'><span data-id='" + e.id + "' class='range'><span data-id='" + e.id + "' data-i='" + e.i + "' class='dot" + past + "'></span></span><span data-i='" + e.i + "' class='label'>" + labelTxt + "<img src='./img/nano-balloon.gif' class='nano' /></span></div>";
		$(html).appendTo('#events');
		
		//aplica as classes baseado no status
		e.updateVisual();
		
		//inclui na lista de destaques se for o caso
		if(e.visual == 'g'){
			destaques.push(e);
		}
	}
	
	//se não tem destaque algum, marca todos os q estão rolando como g
	if(destaques.length == 0){
		for(var i in eventDotInstances){
			var e = eventDotInstances[i];
			// console.log(e);
			if(e.dataFinal.getTime() >= Date.now()){
				e.visual = 'g';
				e.updateVisual();
				destaques.push(e);
			}
		}
	}
	
	//se ainda assim não tiver nada rolando .. apela, marca todos!
	if(destaques.length == 0){
		for(var i in eventDotInstances){
			var e = eventDotInstances[i];
			e.visual = 'g';
			e.updateVisual();
			destaques.push(e);
		}
	}
	
	//aplica o mouse over nos labels
	$('.label').mouseover(function(event){
		$(event.target).addClass('over');
	});
		
	$('.label').mouseout(function(event){
		$(event.target).removeClass('over');
	});
	
	//volta o array para a ordem esperada (ordem de inclusão – que é a ordem crescente dos IDs)
	eventDotInstances.sort(compareIdStrings)
	console.log(["Destaques >", destaques]);
}

function compareDates(a,b){
	// console.log(a.dataInicial + " : " + b.dataInicial);
	return b.dataInicial - a.dataInicial;
}

function compareAlphabet(a,b){
	var sA = string_to_slug(a);
	var sB = string_to_slug(b);
	if (sA < sB) {return -1}
	if (sA > sB) {return 1}
	return 0;
}

// function compareOndeStrings(a,b){
// 	var sA = string_to_slug(a.onde);
// 	var sB = string_to_slug(b.onde);
// 	if (sA < sB) {return -1}
// 	if (sA > sB) {return 1}
// 	return 0;
// }

function compareIdStrings(a,b){
	var sA = string_to_slug(a.id);
	var sB = string_to_slug(b.id);
	if (sA < sB) {return -1}
	if (sA > sB) {return 1}
	return 0;
}

EventDot.prototype.updateVisual = function(){
	var div = $('div.' + this.id);
	var dot = $('div.' + this.id + ' .dot');
	var range = $('div.' + this.id + ' .range');
	var label = $('div.' + this.id + ' .label');
	var ml = 0;
	
	switch (this.visual){
		//pequeno
		case "p":
			if(dot.hasClass('selected'))		dot.removeClass('selected');
			if(dot.hasClass('big'))					dot.removeClass('big');
			if(!range.hasClass('mini'))			range.addClass('mini');
			if(!label.hasClass('mini'))			label.addClass('mini');
		break;
		
		//pequeno e selecionado
		case "ps":
			if(!dot.hasClass('selected'))		dot.addClass('selected');
			if(dot.hasClass('big'))					dot.removeClass('big');
			if(!range.hasClass('mini'))			range.addClass('mini');
			if(!label.hasClass('mini'))			label.addClass('mini');
			mudaFundo(this.id);
		break;
		
		//grande
		case "g":
			if(dot.hasClass('selected'))		dot.removeClass('selected');
			if(!dot.hasClass('big'))				dot.addClass('big');
			if(range.hasClass('mini'))			range.removeClass('mini');
			if(label.hasClass('mini'))			label.removeClass('mini');
		break;
		
		//grande e selecionado
		case "gs":
			if(!dot.hasClass('selected'))		dot.addClass('selected');
			if(!dot.hasClass('big'))				dot.addClass('big');
			if(range.hasClass('mini'))			range.removeClass('mini');
			if(label.hasClass('mini'))			label.removeClass('mini');
			mudaFundo(this.id);
		break;
	}
	
	this.posicionar();
}

EventDot.prototype.posicionar = function(){
	var div = $('div.' + this.id);
	var dot = $('div.' + this.id + ' .dot');
	var range = $('div.' + this.id + ' .range');
	var label = $('div.' + this.id + ' .label');
	
	var t = Date.now();
	var t0 = this.dataInicial.getTime();
	var t1 = this.dataFinal.getTime();
	
	var COMP_DOT_BIG = 5 - dot.outerWidth(false)/2;
	var COMP_DOT = 1;
	var FINE_TUNING = dot.hasClass('big') ? COMP_DOT_BIG : COMP_DOT;
	
	// //posiciona o começo do evento
	var x0 = dateToPosition(t0) + FINE_TUNING;
	div.css('margin-left', x0);
	
	//posiciona o fim do evento
	var x1 = dateToPosition(t1) + FINE_TUNING;
	
	var rangeEnd = x1-x0;
	var length = rangeEnd + dot.outerWidth(false);	//compensa o tamanho da bolinha
	range.css('width', length);
	
	//posiciona a bolinha, representando o progresso geral do evento
	t = (t < t0) ? t0 : t;
	t = (t > t1) ? t1 : t;
	var x = dateToPosition(t) + FINE_TUNING - x0;
	dot.css('margin-left', x);
	
	//posiciona o label
	ml = parseInt(dot.css('margin-left')) + dot.outerWidth(false) + 7;
	//aplica
	label.css('margin-left', ml);
	
	//anexa a função de clique (uma vez só!)
	if(this.semClique){
		range.click(function(event){dotOrRangeClicked(event);});
		label.click(function(event){labelClicked(event);});
		this.semClique = false;
	}
}

// EventDot.prototype.dateToPosition = function(t){
function dateToPosition(t){	
	if(t > timeline[timeline.length-1].date.getTime()){
		//se t for maior que a última marca da timeline
		return $(window).width() + 50;
		// return $(window).width();
	} else if(t == timeline[timeline.length-1].date.getTime()){
			//se t for igual a ultima marca
			return timeline[timeline.length-1].position + 1;
			// return $(window).width();
	} else if(t < timeline[0].date.getTime()){
		//se t for menor que a primeira marca da timeline
		return -50;
		// return 0;
	} else if(t == timeline[0].date.getTime()){
			//se t for igual a primeira marca da timeline
			return timeline[0].position + 1;
			// return 0;
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

function abreBalloonHash(){
	console.log('QUERO ABRIR! : ' + URLvars.sID_hash);
	var parte1 = URLvars.sID_hash.split('+');
	var parte2 = parte1[1].split('|');
	
	var idComposto_ = parte1[0];
	var aID_ = parte2[0];
	var skipIndex_ = parte2[1] ? parte2[1] : null;
	
	var d = procuraDot(idComposto_);
	if(d){
		selectDot(d.i);
		abreBalloon(idComposto_, aID_, skipIndex_);
	} else {
		selecionaDestaqueRandomico();
		console.log('ERRO: ' + idComposto_ + ' não existe em ' + sID);
	}
}

function procuraDot(idComposto_){
	for(var i in eventDotInstances){
		// console.log(eventDotInstances[i]);
		if(eventDotInstances[i].id == idComposto_){
			console.log('ACHEI!');
			return eventDotInstances[i];
			break;
		}
	}
	// return false;
}

function drawHomeEvents(){
	// console.log('drawHomeEvents');
	//aproveita e atualiza o conteúdo do pulldown
	updateHeader();
	//home events
	criaEventDotsHome();
	URLvars.q ? refazTimeline() : null;
	drawTimeline();

	// console.log(['eventDotInstances',eventDotInstances]);

	EventDot.drawThemAll();
	if(URLvars.sID_hash){
		abreBalloonHash();
	} else {
		selecionaDestaqueRandomico();
	}
	resizeEventWindow();
	recenterBalloon();
	moveFooter();
}

function selecionaDestaqueRandomico(){
	var r = Math.floor(destaques.length * Math.random());
	selectDot(destaques[r].i);
}

function criaEventDotsHome(){
	if(URLvars.q){
		for(i in s){
			criaDotsParaUmSite(i );
		}
	} else {
		criaDotsParaUmSite(sID);	
	}
}

function criaDotsParaUmSite(sID_){
	if(URLvars.q){
		//se é busca, procura direto nas atividades e preenche o CA se não existir
		var ondeProcurar = a[sID_];
		//recria o CA, baseado nos As q retornaram da busca
		var n = 0;
		for(var i in ondeProcurar){
			// console.log(i)
			var caMatch = atividadeListadaEmAlgumCA(i, sID_);
			// console.log(caMatch);
			if(!caMatch){
				console.log('caMatch undefined, criando ..');
				var id = 'cFORCEPS' + n;
				ca[sID_][id] = {};
				ca[sID_][id].id = id;
				ca[sID_][id].atividades = i;
				caMatch = id;
				n ++;
				console.log([sID_, caMatch]);
			}
		}
		(n > 0) ? console.log(['CA recriado',ca[sID_]]) : null;
		if(caMatch){
			// cria as EventDots
			for(var j in a[sID_]){
				var caToDot = ca[sID_][caMatch];
				caToDot.siteId = sID_;
				var dot = new EventDot(caToDot);
				console.log(['dot', dot]);
				(dot.dataInicial && dot.dataFinal) ? eventDotInstances.push(dot) : dotsZuadas.push(caToDot);
			}
		} else {
			console.log([sID_, caMatch]);
		}
	} else {
		// cria as EventDots
		for(var j in ca[sID_]){
			var caToDot = ca[sID_][j];
			caToDot.siteId = sID_;
			var dot = new EventDot(caToDot);
			(dot.dataInicial && dot.dataFinal) ? eventDotInstances.push(dot) : dotsZuadas.push(caToDot);
		}	
	}
	(dotsZuadas.length > 0) ? console.log(['Dot creation ERROR!', dotsZuadas]) : null;
}

eventsHeight = 0;
function resizeEventWindow(){
	//armazena o tamanho do div de eventos (para usar no scroll)
	// eventsHeight = (eventsHeight == 0) ? $('#events').height() : eventsHeight;
	eventsHeight = eventDotInstances.length * (26+2);
	// console.log(eventsHeight);
	
	//ajusta o tamanho do div q contém as instâncias de EventDot
	var MARGIN_TOP = 50;
	var AJUSTE = 5;
	var MARGIN_BOTTOM = 20;
	if($('#selected-info').hasClass('closed')){
		var h = $(window).height() - $('#header').outerHeight(true) - $('#about-info').outerHeight(true) - MARGIN_TOP - AJUSTE + $(window).scrollTop();
		var hs = eventsHeight + $('#about-info').outerHeight(true) + $('#header').outerHeight(true);
	} else {
		var h = $(window).height() - $('#header').outerHeight(true) - $('#about-info').outerHeight(true) - $('#selected-info').outerHeight(true) - MARGIN_TOP - AJUSTE + $(window).scrollTop();
		var hs = eventsHeight + $('#about-info').outerHeight(true) + $('#selected-info').outerHeight(true) + $('#header').outerHeight(true) ;
	}
	
	//aplica
	$('#events').css('top', $('#header').height() + MARGIN_TOP);
	$('#events').css('height', h);
	$('#events-scroller').css('height', hs + MARGIN_BOTTOM);
}

function resizeEvents(){
	//resize em todos
	for(var i in eventDotInstances){
		eventDotInstances[i].posicionar();
	}
}

function dotOrRangeClicked(event){
	//pega o elemento
	var element = $(event.target);
	var eventDot = eventDotInstances[element.data('i')];
	
	//altera o apontamento para dot se tiver clicado em range
	if(element.hasClass('range')){
		element = $('div.' + element.data('id') + ' .dot');
		eventDot = eventDotInstances[element.data('i')];
		rangeClicked(element, eventDot)
	} else {
		dotClicked(element, eventDot);
	}
}

function dotClicked(element, eventDot){
	selectDot(element.data('i'));
	mostraInfo();
}

function rangeClicked(element, eventDot){
	selectDot(element.data('i'));
	mostraInfo();
}

function selectDot(eventDotId){
	//atualiza o visual no modelo de dados
	for(var i in eventDotInstances){
		var eventDot = eventDotInstances[i];
		if(eventDotId == i){
			if(eventDot.visual.length == 1){
				//se tem só uma letra
				eventDot.visual += 's';
			}
			//atualiza a variável global
			dotSelected = eventDotInstances[i];
			// console.log(dotSelected);
		} else {
			if(eventDot.visual.length > 1){
				//tem mais que uma letra, pega só a primeira
				eventDot.visual = eventDot.visual.substr(0,1);
			}
		}
		//atualiza o visual na tela
		eventDot.updateVisual();
	}
}

URLtoShow = "";
actualURL = "";

function checkAndFadeIn(loadedURL){
	// console.log('checando ' + loadedURL);
	// if(loadedURL == URLtoShow){
	// 	//mostra
	// 	console.log('comecei o fade IN');
	// 	$('.fadeMe').show(0, function() {
	// 		console.log('acabei o fade IN');
	// 	});
	// 	actualURL = loadedURL;
	// } else {
	// 	//espera pq a outra já deve estar sendo carregada, usuário clicou mais rápido que o loading
	// }
}

function carregaBg(imgURL){
	// console.log('comecei o fade OUT');
	// if(actualURL != imgURL){
	// 	URLtoShow = imgURL;
	// 	$('.fadeMe').hide(0, function() {
	// 		console.log('acabei o fade OUT');
	// 		$('#bg-photo').smartBackgroundImage(imgURL, 'bg');
	// 	});
	// }
}

function mudaFundo(eventDotId){
	var id = eventDotId.split('-');
	var ed = ca[id[0]][id[1]]; //eventDot
	var atalho = ed.atividades.split(', ')[0];
	
	//MUDA O BG
	//encontra o nome da imagem (sempre a primeira se tiver mais de uma cadastrada)
	if(atalho && a[ed.siteId][atalho].imagens){
		var imgs = a[ed.siteId][atalho].imagens.split('\n');
	} else {
		var imgs = ["default-bg.png"];
	}
	
	var imgURL = "./img/" + encodeURI(imgs[0]);
	// carregaBg(imgURL);
	$('#bg-photo').smartBackgroundImage(imgURL, 'bg');
	// $('#bg-photo').css('backgroundImage', 'url('+imgURL+')' );
	
	//MUDA O NOME E O TEXTO
	//encontra o nome da atividade
	if(atalho && a[ed.siteId][atalho].nome){
		var nomeArr = a[ed.siteId][atalho].nome.split(' // ');
	} else {
		var nomeArr = ["sem nome"];
	}
	
	//encontra a sinopse
	if(atalho && a[ed.siteId][atalho].sobre){
		var sinopse = autoSinopse(a[ed.siteId][atalho].sobre);
	} else {
		var sinopse = ["-"];
	}
	
	//encontra o crédito
	if(atalho && a[ed.siteId][atalho].credito){
		var credito = a[ed.siteId][atalho].credito;
	} else {
		var credito = ["sem crédito"];
	}

	//escreve o HTML
	var remendo = "";
	// var html = "<h1>" + nomeArr[0].capitalize();
	var html = "<h1>" + nomeArr[0];
	if(nomeArr.length > 1){
		html += "<em> // " + nomeArr[1] + "</em>";
		remendo = "style='opacity:.6'"
	}
	html += "</h1>";
	html += "<image class='icon' src='./img/micro-balloon.png'" + remendo + "/>"
	html += "<image class='fechar' src='./img/fechar.png'" + remendo + "/>"
	html += "<p>" + sinopse + "</p>";
	html += "<h4>" + credito + "</h4>";
	$('#selected-info').html(html);
	
	//ativa os cliques da area de info
	$('#selected-info h1').click(function(event){infoClicked(event);});
	$('#selected-info .icon').click(function(event){infoClicked(event);});
	$('#selected-info p').click(function(event){infoClicked(event);});
	$('#selected-info .fechar').click(function(event){fechaInfo(event);});
}

function autoSinopse(bigText){
	//cropa o texto tentando não cortar frases no meio
	// PHRASE_SNAP_FACTOR = .2;
	// IDEAL_SINOPSE_CHAR_COUNT = 425;
	if(bigText.length < IDEAL_SINOPSE_CHAR_COUNT * (1 + PHRASE_SNAP_FACTOR)){
		// console.log(bigText.length + " de " + bigText.length);
		return bigText;
	} else {
		var frases = bigText.split('. ');
		var novoTexto = "";
		var i = 0;
		//aumenta até estar dentro da faixa mínima
		while (novoTexto.length < IDEAL_SINOPSE_CHAR_COUNT * (1 - PHRASE_SNAP_FACTOR)){
			novoTexto += frases[i] + ". "; i++;
		}
		//confere se não passou da faixa máxima
		if(novoTexto.length > IDEAL_SINOPSE_CHAR_COUNT * (1 + PHRASE_SNAP_FACTOR)){
			novoTexto = novoTexto.substr(0,IDEAL_SINOPSE_CHAR_COUNT) + " [...]";
		}
		
		// console.log(novoTexto.length + " de " + bigText.length);
		return novoTexto;
	}
}

function labelClicked(event){
	// console.log('labelClicked');
	//pega o elemento
	var element = $(event.target);
	var eventDot = eventDotInstances[element.data('i')];
	//
	selectDot(element.data('i'));
	fechaInfo();
	abreBalloon();
}

function infoClicked(event){
	// console.log('infoClicked');
	fechaInfo();
	abreBalloon();
}

function fechaInfo(){
	$('#selected-info').addClass('closed');
	resizeEventWindow();
}

function fechaBalloon(){
	$('#balloon').css('display', 'none');
	window.location.hash = "";
	window.location = window.location.toString().replace(/#/g,'');
	mostraInfo();
	resizeEventWindow()
}

function mostraInfo(){
	$('#selected-info').removeClass('closed');
	resizeEventWindow();
}

function abreBalloon(idComposto, aID, skipIndex){
	// console.log([idComposto, aID, skipIndex]);
	
	var cID = dotSelected.id.split('-');
	console.log(cID);
	var ca_ = ca[cID[0]][cID[1]];
	var atalho = ca_.atividades.split(', ')[0];
	
	skipIndex = skipIndex ? skipIndex : 0;
	
	var hash = "";
	hash += ca_.siteId + "-" + ca_.id;
	hash += aID ? "+" + aID : "+" + atalho;
	hash += skipIndex ? "|" + skipIndex : "";
	window.location.hash = hash;
	
	if(!ca_.siteinterno){
		//define quem é quem no jogo do bicho
		if(!idComposto){
			var a_ = a[ca_.siteId][atalho];
			if(!a_.onde){ alert("Precisa cadastrar ONDE ou esconder.") }
		} else {
			var a_ = a[ca_.siteId][aID];
			if(!a_.onde){ alert("Precisa cadastrar ONDE ou esconder.") }
		}

		//BALLOON TOP - INFO ESPAÇO
		desenhaBalloonTop(a_);

		//SLIDESHOW - imgs não podem conter espaço no nome
		html = "";
		if(a_.imagens){
			var imgs = a_.imagens.split('\n');
		} else {
			var imgs = ["default-img.png"];
		}
		//atualiza as globais e os controles
		selectedSlideImgIndex = 0;
		nSlideImgs = imgs.length;
		hideOrShowSlideshowControls();

		//escreve o HTML
		html += "<div id='slideshow-imgs'>";
		for(var i in imgs){
			html += "<div class='bg-cover slideshow-img' style='background-image: url(./img/" + encodeURI(imgs[i]) + ")'></div>";
		}
		html += "</div>";
		$('#slideshow').html(html);

		//MINI-BALLOON - INFO DA ATIVIDADE
		var di = googleDateToDate(a_.datainicial ? a_.datainicial : new Date());
		var df = googleDateToDate(a_.datafinal ? a_.datafinal : new Date());

		html = "";
		html += "<h2>" + a_.tipo + "</h2>";
		html += desenhaEstrelas(a_.estrelas);
		html += "<h1>" + a_.nome + "</h1>";
		html += a_.horario ? "<p><b>" + a_.horario + "</b></p>" : "<p><b>" + dataHelena(di, df) + "</b></p>"; 
		html += "<div id='sinopse'>";
		html += a_.sobre ? "<p>" + a_.sobre.replace(/\n/g, "<br />") + "</p>" : "<p>(cadastrar sinopse da atividade)</p>";
		html += "</div>";

		var variosQuem = a_.quem;
		// console.log("variosQuem: " + variosQuem);
		if(variosQuem != undefined){
		// console.log("variosQuem: " + variosQuem);
			variosQuem = variosQuem.split(', ');
			var quem = p[string_to_slug(variosQuem[0])];
			// console.log(["quem: ", quem]);
			if(quem != undefined){
				if(quem.bio){
					html += "<div id='bio' class='hidden'></div>";
					html += "<p><span class='fake-link'>Biografia</span>";
					html += quem.site ?  " // <a href='" + quem.site + "' target='_BLANK'>" + quem.site.replace('http://', '') + "</a></p>" : "</p>";
					$('#mini-balloon-body').html(html);
					$('#mini-balloon-body .fake-link').click(function(event){abreBio(event, quem);});
				} else {
					html += quem.site ? "<p><a href='" + quem.site + "' target='_BLANK'>" + quem.site.replace('http://', '') + "</a></p>" : "";
					$('#mini-balloon-body').html(html);
				}
			}	else {
					$('#mini-balloon-body').html(html);
			}
		}	else {
			$('#mini-balloon-body').html(html);
		}

		//MINI-BALLOON-FOOTER
		html = "";
		html += desenhaTwitter();
		html += desenhaFacebook();
		html += desenhaOpine();
		$('#mini-balloon-footer').html(html);
		$('#twitter').click(function(event){abreSocial(event,'t');});
		$('#facebook').click(function(event){abreSocial(event,'f');});

		//CROSS
		//reseta o HTML pré-existente
		$('#cross').html("");

		//recria o HTML
		if(ca_.atividades){
			var atividades = ca_.atividades.split(', ');
			var alphaStep = 80/atividades.length;
			var atividade = {};
			var nameParts = [];
			var imgs = ["default-img.png"];
			var str = "";
			var alpha = 0;
			var n = 0;

			// console.log(ca_.atividades);
			for (i in atividades){
				// console.log(skipIndex);
				if(i != skipIndex){
					var context = {};
					atividade = a[ca_.siteId][atividades[i]];
					if(atividade){
						nameParts = atividade.nome.split(' // ');
						imgs = atividade.imagens ? atividade.imagens.split('\n') : ["default-img.png"];
						// alpha = (100 - (alphaStep * n))/100; n ++;
						alpha = 1;

						html = "";
						html += "<div id='cross-" + i + "' class='balloon cross' style='background-color:rgba(255,255,255," + alpha + ")'>";
						html += "<div class='bg-cover cross-img' style='background-image: url(./img/" + encodeURI(imgs[0]) + ");'></div>";
						html += "<div class='reticencias' style='background-image: url(./img/reticencias.png);'></div>";
						html += "<h2>" + atividade.tipo + "</h2>";
						html += "<h1>" + nameParts[0];
						html += nameParts[1] ? "<em> // " + nameParts[1] + "</em></h1>" : "</h1>";
						html += "</div>";
						$('#cross').append(html);

						str = "#cross-" + i;
						context.atividade = atividades[i];
						context.id = ca_.siteId + "-" + ca_.id;
						context.skipIndex = i;
						$(str).click($.proxy(crossClicked, context));
					}	
				}
			}
		}

		//mostra
		$('#balloon').css('display', 'block');
		updateMiniBalloonFooterPosition();		
	} else {
		chamaURLinterna(ca_);
	}
}

function abreSocial(event, serviceCode){
	switch(serviceCode){
		case 't':
			var baseURL = "http://twitter.com/home?status=";
		break;
		case 'f':
			var baseURL = "http://www.facebook.com/share.php?u=";
		break;
		default:
		break;
	}
	var actualURL = window.location.toString();
	console.log(actualURL);
}


function chamaURLinterna(ca_){
	var siteID = ca_.siteinterno;
	var URL = "http://" + window.location.host.toString() + '?sID=' + siteID;
	URL += (window.location.hash) ? window.location.hash.toString() : "";
	console.log('SITE INTERNO: ' + URL);
	window.location = URL;
}

function desenhaBalloonTop(a_, todosEspacos, value){
	var index = 0;
	
	if(todosEspacos && value){
		//procura o index do espaço selecionado
		for(var i in todosEspacos){
			// console.log(todosEspacos);
			console.log('? ' + value);
			console.log('> ' + e[todosEspacos[i]].nome);
			if(string_to_slug(e[todosEspacos[i]].nome) == string_to_slug(value)){
				console.log('sim! Index: ' + index);
				index = i;
				break;
			} else {
				console.log('naum!');
			}
		}
	}
	// console.log('-');
	
	var e_ = e[a_.onde.split(', ')[index]];
	var espacos = a_.onde.split(", ");
	var dot = {};
	if (espacos.length == 1){
		dot.onde = e[espacos[index]].nome;
	} else if (espacos.length > 1){
		dot.onde = e[espacos[index]].nome;
		dot.todosEspacos = espacos;
	} else {
		dot.onde = "-";
	}
	
	if(e_.imagens){
		var imgEspaco = e_.imagens.split('\n')[index];
	} else {
		var imgEspaco = "default-thumb.png";
	}
	
	var nomeEspaco = "";
	if(dot.todosEspacos){
		var opcoes = "";
		for (var i in dot.todosEspacos){
			opcoes += "<option>" + e[dot.todosEspacos[i]].nome + "</option>";
		}
		nomeEspaco += "<select class='todosEspacos'><option>+</option>" + opcoes + "</select>";
	}
	nomeEspaco += e_.site ? "<a href='" + e_.site + "' target='_BLANK'>" + dot.onde + "</a>" : dot.onde;

	
	var linha1 = ""; //rua, bairro, cidade e mapa
	linha1 += e_.mapa ? "<a href='" + e_.mapa + "' target='_BLANK'>" : "";
	linha1 += e_.endereco;
	linha1 += e_.bairro ? " // " + e_.bairro.split(', ')[0] : "";
	linha1 += e_.cidade ? " // " + e_.cidade : "";
	linha1 += e_.mapa ? "<img src='./img/pin.gif' class='pin' /></a>" : "";
	
	
	var linha2 = ""; //fone, email e site
	if(e_.fone){
		var fone = e_.fone.replace(/\./g, ''); //exclui "."
		fone = fone.split(" "); //depois divide entre código de pais, área e telefone
		linha2 += "<a href='tel:+" + fone[0] + "-" + fone[1] + "-" + fone[2] + "'>" + e_.fone + "</a>";
	}
	// linha2 += e_.email ? " // <a href='mailto:" + e_.email + "'>" + e_.email + "</a>" : "";
	if(e_.email){
		if(e_.email.substr(0,7) == 'http://'){
			linha2 += " // <a href='" + e_.email + "' target='_BLANK'>contato</a>";
		} else {
			linha2 += " // <a href='mailto:" + e_.email + "' target='_BLANK'>" + e_.email + "</a>";
		}
	}
	linha2 += e_.site ? " // <a href='" + e_.site + "' target='_BLANK'>" + e_.site.replace('http://', '') + "</a>" : "";

	var linha3 = ""; //horário de funcionamento (opcional?)
	linha3 += e_.horario ? e_.horario.replace(/\n/g, ' // ') : "";
	
	var html = "";
	// html += "<img src='./img/" + imgEspaco + "' width='86' height='86'/><img src='./img/fechar.png' class='fechar'/>";
	html += "<div class='bg-cover thumb-espaco' style='background-image: url(./img/" + encodeURI(imgEspaco) + ");'></div><img src='./img/fechar.png' class='fechar'/>";
	html += "<div id='txt-block'><h1>" + nomeEspaco + "</h1><p class='first-p'>" + linha1 + "</p><p>" + linha2 + "</p>";
	html += linha3;
	
	
	
	$('#balloon-top').html(html);
	$('#balloon-top .fechar').click(function(event){fechaBalloon(event);});
	$('.todosEspacos').change(function(){desenhaBalloonTop(a_, dot.todosEspacos, $(this).val());});
}

function dataHelena(di, df){
	var str = "";
	// var semana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab" ];
	// var mesCurto = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
	var mesLongo = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
	var mesInicial = di.getMonth();
	var mesFinal = df.getMonth();
	var anoInicial = di.getFullYear();
	var anoFinal = df.getFullYear();

	if(anoInicial == anoFinal){
		if(mesInicial == mesFinal){
			//De 12 a 20 de Outubro
			str = "De " +horaComZero(di.getDate())+ " até " +horaComZero(df.getDate())+ " de " +mesLongo[mesInicial] + " de " + anoFinal;
		} else {
			//De 12 de Jan. a 15 de Out.
			str = "De " +horaComZero(di.getDate())+ " de " +mesLongo[mesInicial]+ " até " +horaComZero(df.getDate())+ " de " +mesLongo[mesFinal]+ " de " + anoFinal;
		}
	} else {
		//De 10 de Dez. 2011 a 15 Fev. 2012
		str = "De " +horaComZero(di.getDate())+ " de " +mesLongo[mesInicial]+ " " +anoInicial+ " até " +horaComZero(df.getDate())+ " de " +mesLongo[mesFinal]+ " de " + anoFinal;
	}
	return str;
}

function abreBio(event, quem){
	var bio = $('#bio');
	if(bio.hasClass('hidden')){
		$('#bio').html('<p>//</p><p>' + quem.bio + '<p>');
		$('#mini-balloon-body .fake-link').html("Fechar Bio");
	} else {
		$('#bio').html("");
		$('#mini-balloon-body .fake-link').html("Biografia");
	}
	//
	$('#bio').toggleClass('hidden');
	updateMiniBalloonFooterPosition();
}

function updateMiniBalloonFooterPosition(){
	//reposiciona o footer
	var top = 20 + $('#mini-balloon-body').outerHeight(false);
	$('#mini-balloon-footer').css('top', top);
	
	//ajusta o tamanho mínimo do balloon
	var minHeight = $('#mini-balloon-footer').outerHeight(false) + top - 20;
	$('#balloon-body').css('min-height', minHeight);
}

function desenhaEstrelas(nEstrelas){
	// console.log(nEstrelas);
	if(nEstrelas){
		var n = Math.round(parseFloat(nEstrelas));
		var str = "<div id='estrelas'>";
		for(var i=1; i<=5; i++){
			str += i <= n ? "<img src='./img/estrela-amarela.png'/>" : "<img src='./img/estrela-cinza.png'/>"
		}
		str += "</div>";
	} else {
		var str = "";
	}
	return str;
}

function desenhaOpine(){
	return "	<div id='opine'><p>Opine:</p><div id='estrelas-opine'><div class='estrela e1'></div><div class='estrela e2'></div><div class='estrela e3'></div><div class='estrela e4'></div><div class='estrela e5'></div></div></div>" ;
}

function desenhaTwitter(){
	//http://twitter.com/home?status= <add your link and/or text here>
	return "<div id='twitter'><img src='./img/btn_tweet.png'/></div>";
}

function desenhaFacebook(){
	//http://www.facebook.com/share.php?u= <add your link here>
	return "<div id='facebook'><img src='./img/btn_like.png'/></div>";
}

function crossClicked(event){
	// console.log(this.id);
	abreBalloon(this.id, this.atividade, this.skipIndex);
}

function nextSlideImg(){
	if(selectedSlideImgIndex < nSlideImgs-1){
		var element = $('#slideshow-imgs');
		var ml = parseInt(element.css('margin-left'));
		ml -= SLIDESHOW_IMG_W;
		element.css('margin-left', ml);
		selectedSlideImgIndex ++;
		hideOrShowSlideshowControls();
	}
}

function prevSlideImg(){
	if(selectedSlideImgIndex > 0){
		var element = $('#slideshow-imgs');
		var ml = parseInt(element.css('margin-left'));
		ml += SLIDESHOW_IMG_W;
		element.css('margin-left', ml);
		selectedSlideImgIndex --;
		hideOrShowSlideshowControls();
	}
}

function hideOrShowSlideshowControls(){
	if(nSlideImgs > 1){
		if(selectedSlideImgIndex == 0){
			$('#slideshow-controls .next').css('display', 'block');
			$('#slideshow-controls .previous').css('display', 'none');
		} else if(selectedSlideImgIndex == nSlideImgs-1){
			$('#slideshow-controls .next').css('display', 'none');
			$('#slideshow-controls .previous').css('display', 'block');
		} else {
			$('#slideshow-controls .next').css('display', 'block');
			$('#slideshow-controls .previous').css('display', 'block');	
		}
	} else {
		$('#slideshow-controls .next').css('display', 'none');
		$('#slideshow-controls .previous').css('display', 'none');
	}
}

function customGetUrlVars(){
	//original
	// var vars = [], hash;
	// var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	// for(var i = 0; i < hashes.length; i++){
	// 	hash = hashes[i].split('=');
	// 	vars.push(hash[0]);
	// 	vars[hash[0]] = hash[1];
	// }
	// return vars;
	
	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	//cria as variáveis comuns
	for(var i in hashes){
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		if(hash[1]){
			hash[1] = hash[1].split('#');
			vars[hash[0]] = hash[1][0];
			hash[1][1] ? vars[hash[0] + '_hash'] = hash[1][1] : null;
		}
	}
	//cria só a do #hash se não tiver outras
	if(hashes.length == 1){
		h = hashes.toString().split('#');
		vars.sID_hash = h[1];
	}
	return vars;
}

function horaComZero(n){
	return (n<10) ? "0" + n : n;
}

String.prototype.capitalize = function(){
	return this.replace( /(^|\s)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase(); } );
};

$.fn.smartBackgroundImage = function(url, callerID){
	var t = this;
	//create an img so the browser will download the image:
	$('<img />')
	.attr('src', url)
	.load(function(){ //attach onload to set background-image
		t.each(function(){
			console.log(url + ' CARREGOU');
			if(callerID){
				switch(callerID){
					case 'bg':
						checkAndFadeIn(url);
					break;
					default:
						null
					break;
				}
			}
			$(this).css('backgroundImage', 'url('+url+')' );
		});
	});
	return this;
}