showDateDetails = false;
imgName = "logo-agenda-de-fotografia.png";

// timeMarksStr = "mês passado|último finde|ontem|hoje|amanhã|próximo finde|mês que vem|fim do mundo=December 21, 2012 12:06:00";
// aDay = "July 14, 1977 22:41:03";
timeMarksStr = "mês passado|último finde|ontem|hoje|amanhã|próximo finde|mês que vem";
aDay = "hoje";

function criaEventos(){
	var e = {};
	//Legenda Visual  :   a:apagado; p:pequeno; g:grande; s:selecionado; b:balloon; d:desaparecendo; 
	
	e.dataInicial			= "October 10, 2011 00:00:00";
	e.dataFinal				= "November 1, 2011 00:00:00";
	e.visual					= "a";
	e.onde						= "Dconcept";
	e.quem						= "Samuel Jackson";
	e.oque						= "Pulp Fiction";
	e.oqueTipo				= "Exposição";
	e.textoHome				= "Yeah, I like animals better than people sometimes... Especially dogs. Dogs are the best. Every time you come home, they act like they haven't seen you in a year. And the good thing about dogs... is they got different dogs for different people. Like pit bulls. The dog of dogs. Pit bull can be the right man's best friend... or the wrong man's worst enemy. You going to give me a dog for a pet, give me a pit bull. Give me... Raoul. Right, Omar? Give me Raoul.";
	new EventDot(e);
	
	e.dataInicial			= "November 21, 2011 21:30:00";
	e.dataFinal				= "November 27, 2011 19:00:00";
	e.visual					= "p";
	e.onde						= "Centro Cultural São Paulo";
	e.quem						= "Carlos Dadoorian Jr.";
	e.oque						= "Pele Nua";
	e.oqueTipo				= "Exposição";
	e.textoHome				= "André não assina a autoria das fotografias apresentadas, se apropria das imagens, das lembranças e dos documentos de outro tempo e, com interferências, trabalha o conceito da memória e o apagamento que ele carrega com o tempo.";
	new EventDot(e);
	
	e.dataInicial			= "November 23, 2011 10:30:00";
	e.dataFinal				= "November 25, 2011 12:00:00";
	e.visual					= "g";
	e.onde						= "Fauna Galeria";
	e.quem						= "Eduardo Muranaka";
	e.oque						= "Fotografia na virada do século";
	e.oqueTipo				= "Palestra";
	e.textoHome				= "Now that there is the Tec-9, a crappy spray gun from South Miami. This gun is advertised as the most popular gun in American crime. Do you believe that shit? It actually says that in the little book that comes with it: the most popular gun in American crime. Like they're actually proud of that shit.";
	new EventDot(e);
	
	e.dataInicial			= "November 21, 2011 21:30:00";
	e.dataFinal				= "November 27, 2011 19:00:00";
	e.visual					= "s";
	e.onde						= "Escritório de Fotografia Luiz Porchat";
	e.quem						= "Juán Cabro Soarez";
	e.oque						= "Hermandad?";
	e.oqueTipo				= "Exposição";
	e.textoHome				= "Now that we know who you are, I know who I am. I'm not a mistake! It all makes sense! In a comic, you know how you can tell who the arch-villain's going to be? He's the exact opposite of the hero. And most times they're friends, like you and me! I should've known way back when... You know why, David? Because of the kids. They called me Mr Glass.\n\nNow that we know who you are, I know who I am. I'm not a mistake! It all makes sense! In a comic, you know how you can tell who the arch-villain's going to be? He's the exact opposite of the hero. And most times they're friends, like you and me! I should've known way back when... You know why, David? Because of the kids. They called me Mr Glass.\n\nNormally, both your asses would be dead as fucking fried chicken, but you happen to pull this shit while I'm in a transitional period so I don't wanna kill you, I wanna help you. But I can't give you this case, it don't belong to me. Besides, I've already been through too much shit this morning over this case to hand it over to your dumb ass.\n\nYou think water moves fast? You should see ice. It moves like it has a mind. Like it knows it killed the world once and got a taste for murder. After the avalanche, it took us a week to climb out. Now, I don't know exactly when we turned on each other, but I know that seven of us survived the slide... and only five made it out. Now we took an oath, that I'm breaking now. We said we'd say it was the snow that killed the other two, but it wasn't. Nature is lethal but it doesn't hold a candle to man.";
	new EventDot(e);
}