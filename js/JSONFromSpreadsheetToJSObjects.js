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
	
	//DEBUG
	// for(var i in dados){
	// 	if(dados[i].datainicial){
	// 		var dJS = datevalueToDate(dados[i].datevalueinicial);
	// 		dados[i].datainicialrecalculadaj = dJS.toString();
	// 		
	// 		var dG = googleDateToDate(dados[i].datainicial);
	// 		dados[i].datainicialrecalculadag = dG.toString();	
	// 		
	// 		var dv = dateToDatevalue(dG);
	// 		dados[i].datevalueinicia2 = dv.toString();	
	// 	}
	// }
	
	return dados;
}

OFFSET_DV2DATE = 2*60*60 //2h em segundos

function datevalueToDate(dv){
	if(!dv){ console.log("datevalueToDate() : cadê o dv?"); return undefined }
	return new Date((OFFSET_DV2DATE + parseInt(dv))*1000);
}

function dateToDatevalue(date){
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
		
	//desenha a timeline
	try {drawTimeline()}
	catch(err){}
	
	console.log("Mostrando eventos entre [" + timeline[0].date.toString() + "] e [" + timeline[timeline.length-1].date.toString() + "]");
	console.log(["Sites", s]);
	
	//decide se vai carregar os JSONS de um 'site' ou de todos
	var context = {};
	context.id = s[sID].id;
	
	//chamada nova
	$.getJSON("https://spreadsheets.google.com/feeds/list/" + s[sID].key + "/3/public/basic?alt=json", $.proxy(listaConjuntosPrePreenchida, context));
	
	//chamada nova, com query
	var F = firstTimemark(true);
	var L = lastTimemark(true);
	query = "&sq=!((dvi<"+F+" and dvf<"+F+") or (dvi>"+L+" and dvf>"+L+"))";
	query = encodeURI(query);
	
	//https://spreadsheets.google.com/feeds/list/0AnLIuvvW8l93dEp2UkxfOS1PVE02OFlpS1Btc2g5U0E/4/public/basic?alt=json
	$.getJSON("https://spreadsheets.google.com/feeds/list/" + s[sID].key + "/4/public/basic?alt=json" + query, $.proxy(listaAtividadesPrePreenchida, context));
	
	//avisa qtos JSON requests devemos esperar
	totalRequests += 2;
}

function firstTimemark(datavalue){
	var date = timeline[0].date;
	return datavalue ? dateToDatevalue(date) : dateToGoogleStr(date);
}

function lastTimemark(datavalue){
	var date = timeline[timeline.length-1].date;
	return datavalue ? dateToDatevalue(date) : dateToGoogleStr(date);
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
	finishedRequests ++;
	drawDotsIfYouCan();
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
	// console.log(finishedRequests + "/" + totalRequests);
	if(allJSONLoaded()){
		// console.log("YES, I CAN!");
		try {drawHomeEvents()}
		catch(err){}
	}
}

//globals
// e  = {};
// p  = {};
// s	 = {};
ca = {};
a  = {};
a_list  = {};

totalRequests = 0;
finishedRequests = 0;
imgName = "";

function loadJSONs(){
	//carrega os dados da tabela Geral e depois, baseado nos "sites", carrega Atividades e Conjuntos de Atividades.
	var key = "0AnLIuvvW8l93dGR4OEtlNFlXT0VYOG44UExyQXd5N2c"; //Geral
	$.getJSON("https://spreadsheets.google.com/feeds/list/" + key + "/4/public/basic?alt=json", function(json){listaEspacos(json)});
	$.getJSON("https://spreadsheets.google.com/feeds/list/" + key + "/5/public/basic?alt=json", function(json){listaPessoas(json)});
	$.getJSON("https://spreadsheets.google.com/feeds/list/" + key + "/6/public/basic?alt=json", function(json){listaSites(json)});
	
	totalRequests += 3;
}

$(loadJSONs);