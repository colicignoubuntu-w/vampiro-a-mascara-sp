/*
  Cenas exclusivas do Asylum.
  Jeanette e Therese dividem a mesma cadeia: cada decisão tomada
  com uma delas altera o contexto e o tom da conversa com a outra.
*/

const asylum = {
  id: 'asylum',
  name: 'Asylum',
  district: 'Consolação',
  visual: {
    background:
      '/images/asylum/asylum-interior.png',
  },
}
const gallery = { id: 'gallery_noir', name: 'Galeria Noir', district: 'Jardins' }
const oceanHouse = { id: 'ocean_house_sp', name: 'Ocean House Hotel', district: 'Santos' }
const surfside = { id: 'surfside_diner', name: 'Surfside Diner', district: 'Santa Monica' }

const voermanScenes = {
  asylum_entrance: {
    id: 'asylum_entrance', chapter: 'ASYLUM', title: 'Duas Donas', location: asylum,
    narration: [
      'O Asylum ocupa um antigo teatro da Rua Augusta. Velas elétricas, ferro retorcido, fumaça e cortinas negras transformam a pista em uma catedral gótica.',
      'Jeanette Voerman surge entre a fumaça antes que você possa procurar outra pessoa. No andar superior, uma porta de vidro fosco leva ao escritório de Therese.',
    ],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Ora, ora... o que temos aqui? Mais um brinquedinho delicioso, recém-saído da vida e entrando direto no meu clube. Você cheira a novo, patinho. Como amaciante em grama artificial recém-cortada. Eu não estou assustando você, estou?' },
    choices: [{ id: 'meet_jeanette', text: '"Quem é você?"', nextScene: 'janette_identity', timeMinutes: 2 }, { id: 'janette_second_reply', text: '"Você sempre recebe desconhecidos desse jeito?"', nextScene: 'janette_firehose', timeMinutes: 2 }, { id: 'janette_cold_reply', text: '"Não estou interessado."', nextScene: 'janette_cold', timeMinutes: 2 }, { id: 'janette_flirt_reply', text: '"Está tentando me seduzir?"', nextScene: 'janette_flirt', timeMinutes: 2 }],
  },
  janette_first: {
    id: 'janette_first', chapter: 'ASYLUM', title: 'Caos Certificável', location: asylum,
    narration: ['Jeanette o observa de cima a baixo, divertida demais para que o gesto pareça inocente. A música e as luzes vermelhas do Asylum escondem a tensão por trás do sorriso dela.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Meu nome é Jeanette. Este pedacinho de caos comprimido dentro de uma gargalhada certificadamente insana é meu clube. Então, gatinho: o que você quer de mim?' },
    choices: [{ id: 'first_ask_identity', text: '"Quem é você?"', nextScene: 'janette_identity', timeMinutes: 2 }, { id: 'first_ask_club', text: '"Esse lugar é seu?"', nextScene: 'janette_club', timeMinutes: 2 }, { id: 'first_ask_therese', text: '"Onde está Therese?"', nextScene: 'janette_therese_tease', timeMinutes: 2 }, { id: 'first_ask_bertram', text: '"Preciso encontrar Bertram Tung."', nextScene: 'janette_bertram', timeMinutes: 2 }],
  },
  janette_identity: {
    id: 'janette_identity', chapter: 'ASYLUM', title: 'Quem É Aquela Garota?', location: asylum,
    narration: ['Ela se aproxima como se estivesse prestes a contar um segredo para a pista inteira.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Eu sou aquele arrepio descendo pela sua coluna quando todas as luzes se apagam. Sou o nome escrito nas paredes dos banheiros masculinos. Quando faço biquinho, o mundo inteiro tenta me fazer sorrir. E todo mundo sempre acaba perguntando a mesma coisa: quem é aquela garota?' },
    choices: [{ id: 'ask_club_after_identity', text: '"Esse lugar é seu?"', nextScene: 'janette_club', timeMinutes: 2 }, { id: 'ask_bertram_after_identity', text: '"Preciso encontrar Bertram Tung."', nextScene: 'janette_bertram', timeMinutes: 2 }, { id: 'ask_therese_after_identity', text: '"Onde está Therese?"', nextScene: 'janette_therese_tease', timeMinutes: 2 }],
  },
  janette_firehose: {
    id: 'janette_firehose', chapter: 'ASYLUM', title: 'Fogo em Veludo', location: asylum,
    narration: ['Jeanette bate palmas uma vez, satisfeita com a resposta.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Posso perceber que nós dois vamos nos dar muito bem. Como mangueiras de incêndio quando alguém abre a válvula. Quando somos ligados, sempre acaba aparecendo fogo.' },
    choices: [{ id: 'flirt_after_firehose', text: 'Entrar no jogo dela', nextScene: 'janette_flirt', timeMinutes: 2, flags: { flirtedWithJanette: true } }, { id: 'bertram_after_firehose', text: '"Preciso encontrar Bertram Tung."', nextScene: 'janette_bertram', timeMinutes: 2 }],
  },
  janette_cold: {
    id: 'janette_cold', chapter: 'ASYLUM', title: 'Vinagre', location: asylum,
    narration: ['Ela faz uma expressão teatral de decepção, mas os olhos avaliam sua reação.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Que pena. Eu estava justamente pensando numa panquequinha deliciosa que entrou no meu clube, mas aparentemente alguém mergulhou você em vinagre.' },
    choices: [{ id: 'janette_hostile_name', text: '"Só diga seu nome."', nextScene: 'janette_hostile', timeMinutes: 2, flags: { annoyedJanette: true } }, { id: 'bertram_after_cold', text: '"Preciso encontrar Bertram Tung."', nextScene: 'janette_bertram', timeMinutes: 2 }],
  },
  janette_flirt: {
    id: 'janette_flirt', chapter: 'ASYLUM', title: 'Curiosidade', location: asylum,
    narration: ['Jeanette reduz a distância entre vocês até que a conversa pareça íntima e perigosamente pública.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Você não está nem um pouquinho curioso sobre mim? Vamos, não seja tímido. Diga a coisa certa e talvez eu abra minha alma para você. Ou alguma outra coisa.' },
    choices: [{ id: 'ask_club_after_flirt', text: '"Esse lugar é seu?"', nextScene: 'janette_club', timeMinutes: 2 }, { id: 'ask_bertram_after_flirt', text: '"Preciso encontrar Bertram Tung."', nextScene: 'janette_bertram', timeMinutes: 2 }, { id: 'ask_therese_after_flirt', text: 'Perguntar por Therese', nextScene: 'janette_therese_tease', timeMinutes: 2 }],
  },
  janette_hostile: {
    id: 'janette_hostile', chapter: 'ASYLUM', title: 'Dentes Atrás do Sorriso', location: asylum,
    narration: ['O sorriso desaparece por segundos demais para ser apenas teatro.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Jeanette. Este é meu clube. E seria melhor você aprender a brincar direito, porque posso ser extremamente divertida quando alguém não está se esforçando para me irritar.' },
    choices: [{ id: 'bertram_after_hostility', text: '"Preciso encontrar Bertram Tung."', nextScene: 'janette_bertram', timeMinutes: 2 }, { id: 'leave_asylum_hostile', text: 'Deixar o Asylum', nextScene: 'free_roam', timeMinutes: 1 }],
  },
  janette_club: {
    id: 'janette_club', chapter: 'ASYLUM', title: 'Caos Certificável', location: asylum,
    narration: ['Ela abre os braços, indicando a pista como se apresentasse um reino particular.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Meu nome é Jeanette. E esse pedacinho de caos comprimido dentro de uma gargalhada certificadamente insana é meu clube. Therese cuida dos contratos e finge que eu sou decoração. Eu cuido das pessoas que ainda sabem se divertir.' },
    choices: [{ id: 'ask_therese_after_club', text: '"Por que você e Therese se odeiam?"', nextScene: 'janette_therese_tease', timeMinutes: 2 }, { id: 'ask_bertram_after_club', text: '"Preciso encontrar Bertram Tung."', nextScene: 'janette_bertram', timeMinutes: 2 }],
  },
  janette_therese_tease: {
    id: 'janette_therese_tease', chapter: 'ASYLUM', title: 'Sua Majestade Real', location: asylum,
    narration: ['O humor dela afia. Pela primeira vez, a provocação parece uma defesa.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Therese é a responsável, a inteligente, a favorita. Duas vidas ouvindo que sou uma vergonha, uma boneca incapaz de amarrar os próprios sapatos. Ela está lá em cima, fazendo demonstrações públicas de como os lábios dela se encaixam perfeitamente no traseiro da Camarilla.' },
    choices: [{ id: 'sympathize_jeanette', text: 'Reconhecer que Therese a diminui', nextScene: 'janette_bertram', timeMinutes: 2, flags: { sympathizedWithJanette: true } }, { id: 'question_jeanette', text: '"Ser maltratada não torna você inocente."', nextScene: 'janette_bertram', timeMinutes: 2 }],
  },
  janette_bertram: {
    id: 'janette_bertram', chapter: 'ASYLUM', title: 'O Preço de uma Pista', location: asylum,
    narration: ['Ao ouvir o nome, Jeanette deixa de parecer entediada. A mudança é rápida, mas real.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Ah... isso é complicado. Passei algumas noites com Bertram e, de repente, Therese começou a tratá-lo como se ele fosse a peste. Paranoia e Therese dividem a mesma cama há mais tempo do que consigo lembrar. Existe uma coisinha que você poderia fazer por nós enquanto espera.' },
    choices: [{ id: 'ask_gallery_job', text: '"O que você quer?"', nextScene: 'janette_gallery_offer', timeMinutes: 2 }, { id: 'refuse_gallery_job', text: '"Não vou trabalhar para você."', nextScene: 'janette_refusal', timeMinutes: 2 }],
  },
  janette_refusal: {
    id: 'janette_refusal', chapter: 'ASYLUM', title: 'Sem Mel Para Você', location: asylum,
    narration: ['Jeanette cruza os braços. A pose é infantil apenas até você perceber que ela não está brincando.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Então vá embora. E Bertram nunca vai ajudar você. Pode fingir que adora cada palavra que sai da minha boca e me ajudar, ou pode voltar para o Príncipe carregando a própria cabeça nas mãos.' },
    choices: [{ id: 'reconsider_gallery_job', text: 'Reconsiderar o favor', nextScene: 'janette_gallery_offer', timeMinutes: 1 }, { id: 'leave_asylum_refusal', text: 'Deixar o Asylum', nextScene: 'free_roam', timeMinutes: 1 }],
  },
  janette_gallery_offer: {
    id: 'janette_gallery_offer', chapter: 'ASYLUM', title: 'Uma Noite na Galeria', location: asylum,
    narration: ['Jeanette tira uma faca fina da bolsa e a deixa sobre o balcão entre vocês.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Conhece a Galeria Noir? Há um evento beneficente. Um Membro está usando a festa para criar seu próprio círculo de poder. Vá até lá, dê alguns bons cortes nas pinturas, não seja pego e não transforme aquilo num massacre. Ah, pegue também a caixa de doações. Você estará roubando de um ladrão.' },
    choices: [{ id: 'accept_gallery_job', text: 'Aceitar a missão e pegar a faca', nextScene: 'free_roam', timeMinutes: 3, flags: { galleryNoirUnlocked: true, janetteGalleryAccepted: true }, questEvents: [{ type: 'quest-start', questId: 'voerman_feud' }, { type: 'quest-objective-complete', questId: 'voerman_feud', objectiveId: 'meet_jeanette' }] }, { id: 'ask_gallery_risk', text: '"Não quero criar inimigos."', nextScene: 'janette_gallery_risk', timeMinutes: 2 }],
  },
  janette_gallery_risk: {
    id: 'janette_gallery_risk', chapter: 'ASYLUM', title: 'Inimigos', location: asylum,
    narration: ['Jeanette ri como se a preocupação fosse um acessório especialmente adorável.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Você ainda não precisa de mais inimigos. Espere alguns anos; eles aparecem sozinhos. Agora: museu, pinturas, faca. Depois venha me visitar. Quero ouvir todos os detalhes.' },
    choices: [{ id: 'accept_gallery_after_risk', text: 'Aceitar a missão', nextScene: 'free_roam', timeMinutes: 2, flags: { galleryNoirUnlocked: true, janetteGalleryAccepted: true }, questEvents: [{ type: 'quest-start', questId: 'voerman_feud' }, { type: 'quest-objective-complete', questId: 'voerman_feud', objectiveId: 'meet_jeanette' }] }],
  },
  gallery_noir_infiltration: {
    id: 'gallery_noir_infiltration', chapter: 'ASYLUM', title: 'A Galeria Noir', location: gallery,
    narration: ['A Galeria Noir está cheia de taças, sorrisos treinados e quadros caros. A caixa de doações fica perto do palco; as obras principais ficam sem vigilância por poucos segundos de cada vez.'],
    choices: [{ id: 'sabotage_gallery_clean', text: 'Cortar as pinturas, pegar a caixa e sair sem chamar atenção', nextScene: 'free_roam', timeMinutes: 12, flags: { galleryPaintingsSlashed: true, galleryDonationBoxStolen: true, gallerySabotageResolved: true, gallerySabotageClean: true }, questEvents: [{ type: 'quest-objective-complete', questId: 'voerman_feud', objectiveId: 'sabotage_gallery' }, { type: 'quest-objective-complete', questId: 'voerman_feud', objectiveId: 'steal_donation_box' }, { type: 'quest-objective-complete', questId: 'voerman_feud', objectiveId: 'avoid_gallery_casualties' }, { type: 'quest-objective-complete', questId: 'voerman_feud', objectiveId: 'avoid_gallery_exposure' }] }, { id: 'sabotage_gallery_seen', text: 'Cortar as pinturas e fugir da segurança', nextScene: 'free_roam', timeMinutes: 10, flags: { galleryPaintingsSlashed: true, gallerySabotageResolved: true, gallerySabotageWitnessed: true }, questEvents: [{ type: 'quest-objective-complete', questId: 'voerman_feud', objectiveId: 'sabotage_gallery' }] }],
  },
  therese_gallery_confrontation: {
    id: 'therese_gallery_confrontation', chapter: 'ASYLUM', title: 'O Preço da Galeria', location: asylum,
    narration: ['Therese recebe você atrás da mesa. A notícia da Galeria Noir chegou antes de você.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Entre, por favor. Peço desculpas pela vulgaridade da minha irmã, caso ela tenha deixado você desconfortável. Jeanette é escandalosa sem o menor pudor. E agora seu pequeno espetáculo destruiu o meu evento. A Camarilla está observando esta cidade, e você acabou de tornar minha competência uma dúvida pública.' },
    choices: [{ id: 'blame_jeanette_gallery', text: '"Jeanette me pediu para fazer aquilo."', nextScene: 'therese_tung_politics', timeMinutes: 3 }, { id: 'repair_gallery_damage', text: '"Quero reparar o dano."', nextScene: 'therese_tung_politics', timeMinutes: 3 }, { id: 'ask_therese_sister', text: '"Jeanette disse que o clube também é dela."', nextScene: 'therese_about_jeanette', timeMinutes: 2 }],
  },
  therese_about_jeanette: {
    id: 'therese_about_jeanette', chapter: 'ASYLUM', title: 'A Versão de Therese', location: asylum,
    narration: ['Therese olha para a porta como se a irmã ainda estivesse do outro lado, ouvindo.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Bobagem. Jeanette tem problemas que ainda está tentando superar: ciúmes, sobretudo. Ela é o espetáculo grotesco que mantenho para satisfazer a curiosidade dos clientes. Sabe lidar com eles, admito. Mas a capacidade administrativa dela é equivalente à de uma criança de quatro anos recebendo dinheiro dentro de uma loja.' },
    choices: [{ id: 'ask_tung_after_therese', text: '"Estou procurando Bertram Tung."', nextScene: 'therese_tung_politics', timeMinutes: 2 }, { id: 'back_to_therese_gallery', text: 'Voltar ao assunto da galeria', nextScene: 'therese_tung_politics', timeMinutes: 1 }],
  },
  therese_tung_politics: {
    id: 'therese_tung_politics', chapter: 'ASYLUM', title: 'Política', location: asylum,
    narration: ['A expressão de Therese endurece quando você menciona Tung.'],
    dialogue: { speaker: 'Therese Voerman', text: 'O exílio de Tung é voluntário. Posso garantir isso. Prefiro que ele acredite que desejo destruí-lo; enquanto acredita nisso, permanece escondido e não sabota meus negócios. As ações dele fazem parecer que sou incapaz de controlar a cidade. E a Camarilla está observando. Preciso que ela reconheça oficialmente a minha administração de Santa Monica.' },
    choices: [{ id: 'ask_ocean_offer', text: '"Então você não quer matá-lo?"', nextScene: 'therese_ocean_offer', timeMinutes: 3 }, { id: 'call_therese_paranoid', text: '"Isso parece paranoia."', nextScene: 'therese_ocean_offer', timeMinutes: 2 }],
  },
  therese_ocean_offer: {
    id: 'therese_ocean_offer', chapter: 'ASYLUM', title: 'O Fantasma do Ocean House', location: asylum,
    narration: ['A irritação de Therese dá lugar a uma frieza prática. Um mapa do litoral já está aberto sobre a mesa.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Estou disposta a informar que minhas divergências com Tung foram esquecidas, mas quero algo em troca. O Ocean House é uma propriedade na qual pretendo investir. Há uma presença inconveniente lá. Fantasmas, lobisomens e coisas piores dividem a noite conosco. Encontre um objeto pessoal do espírito e traga-o para mim.' },
    choices: [{ id: 'ask_ocean_danger', text: '"O hotel é perigoso?"', nextScene: 'therese_ocean_danger', timeMinutes: 2 }, { id: 'accept_ocean_house', text: 'Aceitar a chave e o trabalho', nextScene: 'free_roam', timeMinutes: 3, flags: { gallerySabotageReported: true, oceanHouseUnlocked: true }, questEvents: [{ type: 'quest-objective-complete', questId: 'voerman_feud', objectiveId: 'meet_therese' }] }],
  },
  therese_ocean_danger: {
    id: 'therese_ocean_danger', chapter: 'ASYLUM', title: 'Perfeitamente Inofensivo', location: asylum,
    narration: ['Therese quase sorri ao ouvir a pergunta.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Não seja ridículo. Fantasmas são perfeitamente inofensivos. Entretanto, três equipes de construção já se recusaram a retornar ao prédio. Ficaram... assustadas. Esta chave abre o portão do túnel nos esgotos. Se precisar desmontar o prédio inteiro para encontrar o objeto, faça isso.' },
    choices: [{ id: 'accept_ocean_after_warning', text: 'Pegar a chave do Ocean House', nextScene: 'free_roam', timeMinutes: 2, flags: { gallerySabotageReported: true, oceanHouseUnlocked: true }, questEvents: [{ type: 'quest-objective-complete', questId: 'voerman_feud', objectiveId: 'meet_therese' }] }],
  },
  ocean_house_investigation: {
    id: 'ocean_house_investigation', chapter: 'ASYLUM', title: 'Ocean House Hotel', location: oceanHouse,
    narration: ['O hotel conserva marcas de incêndio e um frio que não pertence ao litoral. No quarto queimado, um pingente infantil se move sozinho sobre o assoalho.'],
    choices: [{ id: 'recover_ghost_pendant', text: 'Recolher o pingente e voltar à cidade', nextScene: 'free_roam', timeMinutes: 20, flags: { oceanSpiritObjectRecovered: true }, questEvents: [{ type: 'quest-objective-complete', questId: 'voerman_feud', objectiveId: 'investigate_ocean_house' }] }],
  },
  voerman_ocean_return: {
    id: 'voerman_ocean_return', chapter: 'ASYLUM', title: 'O Objeto do Espírito', location: asylum,
    narration: ['No Asylum, tanto Jeanette quanto Therese têm motivos para desejar o pingente — e para mentir sobre ele.'],
    dialogue: { speaker: 'Narrador', text: 'A quem você entrega o objeto encontrado no Ocean House?' },
    choices: [{ id: 'deliver_ocean_to_therese', text: 'Entregar o objeto a Therese', nextScene: 'therese_ocean_success', timeMinutes: 3 }, { id: 'deliver_ocean_to_jeanette', text: 'Procurar Jeanette antes de Therese', nextScene: 'janette_ocean_offer', timeMinutes: 3 }],
  },
  therese_ocean_success: {
    id: 'therese_ocean_success', chapter: 'ASYLUM', title: 'A Parte do Acordo', location: asylum,
    narration: ['Therese pega o pingente com cuidado calculado. Por um segundo, a satisfação dela parece genuína.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Excelente. Talvez eu tenha julgado sua competência cedo demais. Considerarei nossa parte do acordo cumprida. Agora há outra questão: fiz ameaças vazias contra Jeanette, e ela está se escondendo. Encontre-a no Surfside Diner, na cabine dos fundos perto dos telefones, e diga que não pretendo machucá-la.' },
    choices: [{ id: 'accept_surfside_mediation', text: 'Aceitar mediar entre as irmãs', nextScene: 'free_roam', timeMinutes: 2, flags: { oceanHouseReturned: true, oceanObjectGivenToTherese: true, surfsideMeetingUnlocked: true }, questEvents: [{ type: 'quest-objective-complete', questId: 'voerman_feud', objectiveId: 'return_ocean_object' }] }],
  },
  janette_ocean_offer: {
    id: 'janette_ocean_offer', chapter: 'ASYLUM', title: 'Uma Lembrança Para o Mar', location: asylum,
    narration: ['Jeanette reconhece o pingente e seu sorriso perde a leveza por um instante.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Therese quer isso para transformar um pesadelo em investimento. Entregue para mim. Há coisas que não devem ficar presas a uma propriedade. Eu mesma vou garantir que o oceano cuide dele.' },
    choices: [{ id: 'trust_jeanette_ocean', text: 'Entregar o objeto a Jeanette', nextScene: 'therese_ocean_betrayal', timeMinutes: 3, flags: { oceanHouseReturned: true, oceanObjectGivenToJeanette: true } }, { id: 'change_mind_therese_ocean', text: 'Mudar de ideia e entregar a Therese', nextScene: 'therese_ocean_success', timeMinutes: 2 }],
  },
  therese_ocean_betrayal: {
    id: 'therese_ocean_betrayal', chapter: 'ASYLUM', title: 'A Propriedade Inútil', location: asylum,
    narration: ['Quando Therese descobre o que aconteceu, ela se levanta tão rápido que a cadeira atinge a parede.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Como pôde entregar a ela o objeto do hotel? Jeanette o jogou no Pacífico. Agora não posso remover o espírito e a propriedade tornou-se inútil. Ainda assim, encontre-a no Surfside Diner. Quero resolver isso antes que ela transforme mais alguém em peça do jogo.' },
    choices: [{ id: 'accept_surfside_after_betrayal', text: 'Ir ao Surfside Diner', nextScene: 'free_roam', timeMinutes: 2, flags: { surfsideMeetingUnlocked: true, thereseAngryAtPlayer: true }, questEvents: [{ type: 'quest-objective-complete', questId: 'voerman_feud', objectiveId: 'return_ocean_object' }] }],
  },
  surfside_wait_jeanette: {
    id: 'surfside_wait_jeanette', chapter: 'ASYLUM', title: 'Irmãs', location: surfside,
    narration: ['A cabine dos fundos fica ao lado de dois telefones públicos. Jeanette chega olhando por cima do ombro, como se esperasse que a própria sombra fosse Therese.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Therese mandou você? Ela disse que não vai me machucar? Engraçado. As últimas ameaças dela envolviam fogo e os meus lençóis de cetim.' },
    choices: [{ id: 'reassure_jeanette', text: 'Assegurar que Therese quer conversar, não atacá-la', nextScene: 'surfside_jeanette_agrees', timeMinutes: 4 }, { id: 'pressure_jeanette', text: 'Exigir que ela volte ao Asylum', nextScene: 'surfside_jeanette_agrees', timeMinutes: 3, flags: { annoyedJanette: true } }],
  },
  surfside_jeanette_agrees: {
    id: 'surfside_jeanette_agrees', chapter: 'ASYLUM', title: 'Uma Promessa Incômoda', location: surfside,
    narration: ['Jeanette demora a responder. Depois encosta a mão no telefone sem usá-lo.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Tudo bem. Vou voltar. Mas se ela tentar me controlar, vou fazer um escândalo tão grande que a Camarilla inteira vai precisar de terapia. Diga a ela que estou indo porque sou generosa. E porque sou irmã dela.' },
    choices: [{ id: 'return_to_therese', text: 'Voltar ao Asylum e avisar Therese', nextScene: 'free_roam', timeMinutes: 2, flags: { jeanetteAgreedToMeet: true }, questEvents: [{ type: 'quest-objective-complete', questId: 'voerman_feud', objectiveId: 'reconcile_sisters' }] }],
  },
  therese_reconciliation_return: {
    id: 'therese_reconciliation_return', chapter: 'ASYLUM', title: 'A Trégua Possível', location: asylum,
    narration: ['Therese escuta em silêncio quando você diz que Jeanette vai voltar. O alívio dela é mínimo, mas existe.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Obrigada. Jeanette é minha irmã e minha cria; eu não aceitaria que algo acontecesse com ela. Quanto a Tung: a disputa está encerrada. Ele pode sair do esconderijo. Procure os túneis sob o Centro e diga que não veio a mando de Therese.' },
    choices: [{ id: 'finish_voerman_chain', text: 'Guardar a pista de Bertram e deixar o Asylum', nextScene: 'free_roam', timeMinutes: 2, flags: { voermanReconciliationResolved: true, bertramLeadUnlocked: true }, questEvents: [{ type: 'quest-objective-complete', questId: 'voerman_feud', objectiveId: 'resolve_tung_dispute' }, { type: 'quest-complete', questId: 'voerman_feud' }] }],
  },
}

export default voermanScenes
