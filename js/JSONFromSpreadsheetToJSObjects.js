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
	
	//carrega as outras tabelas (listadas em sites)
	for(var i in s){
		//define o contexto - info "hardcoded" (diferente para cada loop)
		var context = {};
		context.id = s[i].id;
		//chama o jason
		$.getJSON("https://spreadsheets.google.com/feeds/cells/" + s[i].key + "/1/public/basic?alt=json", $.proxy(listaConjuntosPrePreenchida, context));
		$.getJSON("https://spreadsheets.google.com/feeds/cells/" + s[i].key + "/2/public/basic?alt=json", $.proxy(listaAtividadesPrePreenchida, context));
		//avisa qtos JSON requests devemos esperar
		totalRequests += 2;
	}
}

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
	// console.log("..deixa eu ver: ("+ finishedRequests +"/"+totalRequests+")");
	if(allJSONLoaded()){
		// console.log("YES, I CAN! - (" + finishedRequests + ")");
		drawHomeEvents();
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