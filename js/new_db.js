function criaEventos(){
	var es = {}; //espaço
	var ev = {}; //evento
	var a  = {}; //atividade
	var p  = {}; //pessoa

	es.id							= "ev1";
	es.nome						= "Nome de Espaço";
	es.endereco				= "Av. Nossa Senhora das Graças, 2250";
	es.bairro					= "Ville de France";
	es.cidade					= "Itatiba";
	es.cep						=	"13257-000"; //validar
	es.mapa						= "http://g.co/maps/an3d8";
	es.horario				= "Seg-sex, blablablablabla";
	es.desde					= "1952";
	es.sobre					= "Lorem ipsum ..";
	es.site						= "www.galeria.com.br";
	es.email					= "contato@galeria.com.br";
	es.fones					= "tel:+55-11-92109266"; //mostrar na tela: +55 11 92109266
	es.imagens				= "img1.jpg,img2.png"; //a primeira img é sempre o thumb do balloon
	new Place(es);

	//Legenda Tipo (atividade)
	//fest:festivais; expo:exposições; proje:projeções; cur:cursos e workshops; edital:editais; enc:palestras e encontros; lanc:lançamentos;
	//Legenda Visual // a:apagado; p:pequeno; g:grande; s:selecionado; b:balloon; d:desaparecendo;

	ev.id							= "ev1";
	// ev.tipo					= "fest";
	ev.atividades			= "a1,a2,a3";
	ev.visual					= "s";
	// ev.sinopse				= "Lorem Ipsum (home) ..";
	// ev.info					= "Lorem Ipsum (balloon)..";
	// ev.dataInicial		= "November 28, 2011 19:30:00";
	// ev.dataFinal			= "January 21, 2012 18:00:00";
	new Event(ev);

	//Legenda Tipo (atividade)
	//fest:festivais; expo:exposições; proje:projeções; cur:cursos e workshops; edital:editais; enc:palestras e encontros; lanc:lançamentos;

	a.id							= "a1";
	a.nome						= "Nome da Atividade";
	a.tipo						= "fest";
	a.quem						= "p1,p2,p3";
	a.onde						= "es1";
	a.dataInicial			= "November 28, 2011 19:30:00";
	a.dataFinal				= "January 21, 2012 18:00:00";
	a.sinopse					= "Lorem Ipsum (home) ..";
	a.info						= "Lorem Ipsum (balloon)..";
	new Activity(a);

	//Legenda Tipo (pessoa)
	//art:artista; cur:curador; resp:responsável;

	p.id							= "p1";
	p.nome						= "Alexandre Belém";
	p.tipo						= "cur";
	p.bio							= "Lorem Ipsum";
	p.imagens 				= "img1.jpg,img2.jpg";
	p.site						= "www.sitepessoal.com.br";
	p.email						= "contato@sitepessoal.com.br";
	new Person(p);
}