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
		dados[linha.id] = linha;
	});
	return dados;
}

function listaEspacos(root) {
	e = cellsToObjects(root);
	console.log(["Espaços", e]);
	finishedRequests ++;
	drawDotsIfYouCan();
}

function listaPessoas(root) {
	p = cellsToObjects(root);
	console.log(["Pessoas", p]);
	finishedRequests ++;
	drawDotsIfYouCan();
}

function listaSites(root) {
	s = cellsToObjects(root);
	console.log(["Sites", s]);
	finishedRequests ++;
	
	//decide se vai carregar os JSONS de um 'site' ou de todos
	var context = {};
	if(sID){
		// console.log("CHAMANDO " + sID.toUpperCase());
		//define o contexto
		context.id = s[sID].id;
		//chama o jason
		$.getJSON("https://spreadsheets.google.com/feeds/cells/" + s[sID].key + "/1/public/basic?alt=json", $.proxy(listaConjuntosPrePreenchida, context));
		$.getJSON("https://spreadsheets.google.com/feeds/cells/" + s[sID].key + "/2/public/basic?alt=json", $.proxy(listaAtividadesPrePreenchida, context));
		//avisa qtos JSON requests devemos esperar (2)
		totalRequests += 2;
	} else {
		// console.log("CHAMANDO TODAS");
		//carrega as outras tabelas (listadas em sites) CARREGA TUDO
		for(var i in s){
			//define o contexto - info "hardcoded" (diferente para cada loop)
			context.id = s[i].id;
			//define os parametros da URL (para restringir a quantidade de dados pela data)
			var paramURL = "https://spreadsheets.google.com/feeds/cells/" + s[i].key + "/2/public/basic?";
			// paramURL += encodeURI("(datafinal>" + firstTimemark() + "&&");
			// paramURL += encodeURI("datainicial<" + lastTimemark() + ")&");
			paramURL += "alt=json";
			//chama o jason
			$.getJSON("https://spreadsheets.google.com/feeds/cells/" + s[i].key + "/1/public/basic?alt=json", $.proxy(listaConjuntosPrePreenchida, context));
			$.getJSON( paramURL, $.proxy(listaAtividadesPrePreenchida, context));
			//avisa qtos JSON requests devemos esperar (2 pra cada loop)
			totalRequests += 2;
		}
	}
	
	//define a timeline seguindo o modelo abaixo
	//timeMarksStr = 'mês passado|último finde|ontem|hoje|amanhã|próximo finde|mês que vem|fim do mundo=December 21, 2012 00:00:00';
	if(sID){
		imgName = s[sID].logo;
		timeMarksStr = s[sID].timeline;
	} else {
		imgName = "logo-agenda-de-fotografia.png";
		timeMarksStr = "mês passado|último finde|ontem|hoje|amanhã|próximo finde|mês que vem";
	}
		
	//desenha a timeline
	try {drawTimeline()}
	catch(err){}
}

function firstTimemark(){
	return dateToGoogleStr(timeline[0].date);
}

function lastTimemark(){
	return dateToGoogleStr(timeline[timeline.length-1].date);
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
	ca[s[parentId].id] = cellsToObjects(root);
	console.log([
		"CAs : " + s[parentId].nome,
		ca[s[parentId].id]
		]);
}

function listaAtividades(root, parentId) {
	a[s[parentId].id] = cellsToObjects(root);
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
e  = {};
p  = {};
s	 = {};
ca = {};
a  = {};
totalRequests = 0;
finishedRequests = 0;

function init(){	
	//carrega os dados da tabela Geral e depois, baseado nos "sites", carrega Atividades e Conjuntos de Atividades.
	var key = "0AnLIuvvW8l93dGR4OEtlNFlXT0VYOG44UExyQXd5N2c"; //Geral
	$.getJSON("https://spreadsheets.google.com/feeds/cells/" + key + "/1/public/basic?alt=json", function(json){listaEspacos(json)});
	$.getJSON("https://spreadsheets.google.com/feeds/cells/" + key + "/2/public/basic?alt=json", function(json){listaPessoas(json)});
	$.getJSON("https://spreadsheets.google.com/feeds/cells/" + key + "/3/public/basic?alt=json", function(json){listaSites(json)});
	totalRequests += 3;
}

$(init);

//como passar parâmetros: https://spreadsheets.google.com/feeds/cells/0AnLIuvvW8l93dGR4OEtlNFlXT0VYOG44UExyQXd5N2c/1/public/basic?min-row=2&max-row=3&sq=desde%3E2003&alt=json