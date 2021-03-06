function cellsToObjects(json){
	var tabela = [];
	var dados = {};
	$.each(json.feed.entry, function(index, item){
		var match = item.title.$t.match(/^([a-zA-Z]+)([0-9]+)$/)
		var linha = parseInt(match[2])-1;
		var coluna = match[1].charCodeAt(0) - 'A'.charCodeAt(0);
		if (typeof tabela[linha] == "undefined"){tabela[linha]=[]};
		tabela[linha][coluna] = item.content.$t; 
	});
	$.each(tabela, function(index, item){
		if (index==0){return;}
		var linha = {};
		$.each(tabela[0], function(index, key){
			linha[key] = item[index];
		});
		//se tem id, usa
		if(linha.id){
			dados[linha.id] = linha;
		} else if(linha.nome){
			//senão usa o nome como id
			var slug = string_to_slug(linha.nome);
			dados[slug] = linha;
			dados[slug].id = slug;
		}
	});
	return dados;
}

function listToObjects(json){
	//IMPORTANTE: PRIMEIRA COLUNA DA SHEET PRECISA ESTAR VAZIA
	var entry = json.feed.entry;
	var arr = [];
	//varre as entries, parseando a string
	for(var i in entry){
		var obj = {}
		var string = entry[i].content.$t;
		var colunas = string.split(', ');
		for(var j in colunas){
			colunas[j] = colunas[j].split(': ');
			colunas[j][1] = colunas[j][1] ? colunas[j][1].replace(/¥Ω/g, ',') : undefined;
			colunas[j][1] = colunas[j][1] ? colunas[j][1].replace(/¢£/g, ':') : undefined;
			colunas[j][1] = colunas[j][1] ? colunas[j][1].replace(/•≈/g, '\n') : undefined;
			obj[colunas[j][0]] = colunas[j][1];
		}
		arr.push(obj);
	}
	
	//converte o array num objeto com os ids(ou nomes) como identificador
	var dados = {};
	for(var i in arr){
		if(arr[i].id){
			dados[arr[i].id] = arr[i];
		} else if(arr[i].nome) {
			dados[string_to_slug(arr[i].nome)] = arr[i];
		}
	}
	
	// DEBUG
	// for(var i in dados){
	// 	if(dados[i].dvi){
	// 		dados[i].DEBUG_di_from_dvi = dvToDate(dados[i].dvi);
	// 		dados[i].DEBUG_dvi_from_di = dateToDv(dados[i].DEBUG_di_from_dvi);
	// 		var testDi = dateToGoogleStr(dados[i].DEBUG_di_from_dvi);
	// 		(testDi != dados[i].datainicial) ? console.log(i + ' : ' + dados[i].datainicial + ' - ' + testDi) : null;
	// 		
	// 		dados[i].DEBUG_df_from_dvf = dvToDate(dados[i].dvf);
	// 		dados[i].DEBUG_dvf_from_df = dateToDv(dados[i].DEBUG_df_from_dvf);
	// 		var testDf = dateToGoogleStr(dados[i].DEBUG_df_from_dvf);
	// 		(testDf != dados[i].datafinal) ? console.log(i + ' : ' + dados[i].datafinal + ' - ' + testDf) : null;
	// 	}
	// }
	
	return dados;
}

OFFSET_DV2DATE = 2*60*60 //2h em segundos
// OFFSET_DV2DATE = 0;

function dvToDate(dv){
	return new Date((OFFSET_DV2DATE + parseInt(dv))*1000);
}

function dateToDv(date){
	return Math.round(date.getTime()/1000 - OFFSET_DV2DATE);
}

function string_to_slug(str) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();
  
  // remove accents, swap ñ for n, etc
  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  var to   = "aaaaeeeeiiiioooouuuunc------";
  for (var i=0, l=from.length ; i<l ; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes

  return str;
}

function listaEspacos(root) {
	e = listToObjects(root);
	console.log(["Espaços", e]);
	finishedRequests ++;
	drawDotsIfYouCan();
}

function listaPessoas(root) {
	p = listToObjects(root);
	console.log(["Pessoas", p]);
	finishedRequests ++;
	drawDotsIfYouCan();
}

function listaSites(root) {
	s = listToObjects(root);
	finishedRequests ++;
	
	//ajusta o logo do header e as marcas da timeline
	imgName = s[sID].logo;
	timeMarksStr = s[sID].timeline;
		
	//inclui o logo
	try {incluiLogo()}
	catch(err){}
		
	//cria o array 'timeline'
	try {criaTimelineArray()}
	catch(err){}
	
	// console.log(timeline);
	!URLvars.q ? console.log("Mostrando eventos entre [" + timeline[0].date.toString() + "] e [" + timeline[timeline.length-1].date.toString() + "]") : null;
	console.log(["Sites", s]);
		
	//carrega CAs e atividades
	chamaUmOuMaisSites();

	// if(){
		//chama os pulldowns, de todos os sites (versão simplificada do feed)
		for(var i in s){
			var context = {};
			context.id = s[i].id;
			chamaPullDownInfo(context);
		}
	// }
}

function chamaUmOuMaisSites(){
	//decide se vai carregar os JSONS de um 'site' ou de todos
	if(URLvars.q){
		//é busca, confere em tudo
		for(var i in s){
			var context = {};
			context.id = s[i].id;
			chamaConjuntos(context);
			chamaAtividades(context);
		}
	} else {
		// confere só em uma
		var context = {};
		context.id = s[sID].id;
		chamaConjuntos(context);
		chamaAtividades(context);
	}
}

function chamaAtividades(context){
	if(!URLvars.q){	
		//chamada nova, com query default (todas atividades dentro da timeline)
		var F = firstTimemark(true);
		var L = lastTimemark(true);
		var query = "&sq=!((dvi<="+F+" and dvf<="+F+") or (dvi>="+L+" and dvf>="+L+")) and publicar==1";
		query = encodeURI(query);
	} else {
		// usuário veio com URL filtrada
		var query = "&q=" + decodeURI(URLvars.q);
		query = encodeURI(query);
	}
	
	//define a URL
	context.URL = "https://spreadsheets.google.com/feeds/list/" + s[context.id].key + "/4/public/basic?alt=json" + query;
	
	// chama os As
	//https://spreadsheets.google.com/feeds/list/0AnLIuvvW8l93dEp2UkxfOS1PVE02OFlpS1Btc2g5U0E/4/public/basic?alt=json
	$.getJSON(context.URL, $.proxy(listaAtividadesPrePreenchida, context));
	
	//avisa qtos JSON requests devemos esperar
	totalRequests += 1;
}

function chamaConjuntos(context){
	$.getJSON("https://spreadsheets.google.com/feeds/list/" + s[context.id].key + "/3/public/basic?alt=json", $.proxy(listaConjuntosPrePreenchida, context));
	totalRequests += 1;
}

function chamaPullDownInfo(context){
	$.getJSON("https://spreadsheets.google.com/feeds/list/" + s[context.id].key + "/5/public/basic?alt=json&sq=publicar==1", $.proxy(listaPulldownsPrePreenchida, context));
	totalRequests += 1;
}

function firstTimemark(datavalue){
	var date = timeline[0].date;
	return datavalue ? dateToDv(date) : dateToGoogleStr(date);
}

function lastTimemark(datavalue){
	var date = timeline[timeline.length-1].date;
	return datavalue ? dateToDv(date) : dateToGoogleStr(date);
}

function dateToGoogleStr(date){
	var googleString = "";
	googleString += parseInt(date.getMonth()) + 1;
	googleString += "/" + date.getDate();
	googleString += "/" + date.getFullYear();	// 
		// googleString += " " + horaComZero(date.getHours());
		// googleString += ":" + horaComZero(date.getMinutes());
		// googleString += ":" + horaComZero(date.getSeconds());
	return googleString;
}

// function horaComZero(n){
// 	return (n<10) ? "0" + n : n;
// }

function listaConjuntosPrePreenchida(json){
	listaConjuntos(json, this.id);
	finishedRequests ++;
	drawDotsIfYouCan();
}

function listaAtividadesPrePreenchida(json){
	listaAtividades(json, this.id);
	try {mostraRetorno(json, this.id, this.URL)} catch(err){}
	finishedRequests ++;
	drawDotsIfYouCan();
}

function listaPulldownsPrePreenchida(json) {
	listaPulldowns(json, this.id);
	finishedRequests ++;
	drawDotsIfYouCan();
}

function listaPulldowns(root, parentId) {
	pd[s[parentId].id] = listToObjects(root);
	console.log([
		"PULLDOWNS : " + s[parentId].nome,
		pd[s[parentId].id],
		]);
}

function listaConjuntos(root, parentId) {
	ca[s[parentId].id] = listToObjects(root);
	console.log([
		"CAs : " + s[parentId].nome,
		ca[s[parentId].id],
		]);
}

function listaAtividades(root, parentId) {
	a[s[parentId].id] = listToObjects(root);
	console.log([
		"As  : " + s[parentId].nome,
		a[s[parentId].id]
		]);
}

function allJSONLoaded(){
	if(finishedRequests == totalRequests){
		return true;
	} else {
		return false;
	}
}

function drawDotsIfYouCan(){
	var loaded = allJSONLoaded();
	// console.log(finishedRequests + "/" + totalRequests);
	// loaded ? console.log("YES, I CAN!") : null;
	if(loaded){
		// if(URLvars.q){ try {refazTimeline()} catch(err){} }
		// try {drawTimeline()} catch(err){}
		try {drawHomeEvents()} catch(err){}			
	}
}

//globals
// e  = {};
// p  = {};
// s	 = {};
ca = {};
a  = {};
pd = {};

totalRequests = 0;
finishedRequests = 0;
imgName = "";

function loadJSONs(){
	//carrega os dados da tabela Geral e depois, baseado nos "sites", carrega Atividades e Conjuntos de Atividades.
	var key = "0AnLIuvvW8l93dGR4OEtlNFlXT0VYOG44UExyQXd5N2c"; //Geral
	$.getJSON("https://spreadsheets.google.com/feeds/list/" + key + "/4/public/basic?alt=json&sq=publicar==1", function(json){listaEspacos(json)});
	$.getJSON("https://spreadsheets.google.com/feeds/list/" + key + "/5/public/basic?alt=json&sq=publicar==1", function(json){listaPessoas(json)});
	$.getJSON("https://spreadsheets.google.com/feeds/list/" + key + "/6/public/basic?alt=json&sq=publicar==1", function(json){listaSites(json)});
	
	totalRequests += 3;
}

$(loadJSONs);