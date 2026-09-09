/*
  Cadeia expandida de Jeanette e Therese Voerman.
  Compatível com o formato atual de scenes do projeto.
*/

const asylum = {
  id: 'asylum',
  name: 'Asylum',
  district: 'Consolação',
  visual: {
    backgroundVideo: {
      provider: 'youtube',
      id: '0Bj3wmjsVLg',
      title: 'Asylum',
      startSeconds: 0,
    },
  },
}

const gallery = { id: 'gallery_noir', name: 'Galeria Noir', district: 'Jardins' }
const oceanHouse = { id: 'ocean_house_sp', name: 'Ocean House Hotel', district: 'Santos' }
const surfside = { id: 'surfside_diner', name: 'Surfside Diner', district: 'Santa Monica' }

const voermanScenes = {
  asylum_lobby: {
    id: 'asylum_lobby', chapter: 'ASYLUM', title: 'Uma noite no Asylum', location: asylum,
    narration: [
      'O grave atravessa as portas do antigo teatro. Na pista, luzes vermelhas recortam a fumaça; junto ao balcão, clientes tentam conversar acima da música.',
      'O salão continua movimentado. Você pode procurar uma das donas ou voltar para as ruas, sem iniciar uma conversa.',
    ],
    dialogue: null,
    choices: [],
  },
  asylum_entrance: {
    id: 'asylum_entrance', chapter: 'ASYLUM', title: 'Duas Donas', location: asylum,
    narration: [
      'O Asylum ocupa um antigo teatro da Rua Augusta. Ferro retorcido, cortinas negras, fumaça e luzes vermelhas transformam a pista numa catedral profana.',
      'Jeanette Voerman surge entre a fumaça antes que você consiga procurar qualquer outra pessoa. No andar superior, uma porta de vidro fosco leva ao escritório de Therese.',
    ],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Ora, ora... o que temos aqui? Mais um brinquedinho recém-saído da vida e entrando direto no meu clube. Você cheira a novo, patinho. Eu não estou assustando você, estou?' },
    choices: [
      { id: 'meet_identity', text: '"Quem é você?"', nextScene: 'janette_identity', timeMinutes: 2, flags: { metJanette: true, voermanChainStarted: true } },
      { id: 'meet_flirt', text: '"Está tentando me seduzir?"', nextScene: 'janette_flirt', timeMinutes: 2, flags: { metJanette: true, flirtedWithJanette: true } },
      { id: 'meet_cold', text: '"Não estou interessado."', nextScene: 'janette_cold', timeMinutes: 2, flags: { metJanette: true, annoyedJanette: true } },
      { id: 'meet_therese', text: '"Estou procurando Therese."', nextScene: 'janette_therese', timeMinutes: 2, flags: { metJanette: true } },
    ],
  },

  janette_identity: {
    id: 'janette_identity', chapter: 'ASYLUM', title: 'Quem É Aquela Garota?', location: asylum,
    narration: ['Jeanette se aproxima como se estivesse prestes a contar um segredo que gostaria que todos ouvissem.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Jeanette. A garota sobre quem todos perguntam, mesmo quando sabem que seria melhor não perguntar.' },
    choices: [
      { id: 'identity_club', text: '"O Asylum é seu?"', nextScene: 'janette_club', timeMinutes: 2 },
      { id: 'identity_therese', text: '"E Therese?"', nextScene: 'janette_therese', timeMinutes: 2 },
      { id: 'identity_tung', text: '"Preciso encontrar Bertram Tung."', nextScene: 'janette_tung', timeMinutes: 2, flags: { askedJanetteAboutTung: true } },
      { id: 'identity_interest', text: '"Por que está tão interessada em mim?"', nextScene: 'janette_interest', timeMinutes: 2 },
    ],
  },

  janette_flirt: {
    id: 'janette_flirt', chapter: 'ASYLUM', title: 'Curiosidade', location: asylum,
    visual: { characters: { 'Jeanette Voerman': { src: '/images/npcs/janette-voerman/seductive.png', alt: 'Jeanette Voerman' } } },
    narration: ['Jeanette reduz a distância até a conversa parecer íntima demais para um lugar tão cheio.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Você não está nem um pouquinho curioso sobre mim? Diga a coisa certa e talvez eu abra minha alma. Ou alguma outra porta.' },
    choices: [
      { id: 'flirt_play', text: '"Talvez eu esteja curioso."', nextScene: 'janette_interest', timeMinutes: 2, flags: { janetteInterestRaised: true } },
      { id: 'flirt_therese', text: '"Estou curioso sobre sua irmã."', nextScene: 'janette_therese', timeMinutes: 2 },
      { id: 'flirt_tung', text: '"Estou curioso sobre Bertram Tung."', nextScene: 'janette_tung', timeMinutes: 2 },
    ],
  },

  janette_cold: {
    id: 'janette_cold', chapter: 'ASYLUM', title: 'Vinagre', location: asylum,
    narration: ['Ela faz uma expressão teatral de decepção, mas os olhos ficam frios.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Que pena. Algumas coisas parecem doces até a primeira mordida.' },
    choices: [
      { id: 'cold_name', text: '"Só diga seu nome."', nextScene: 'janette_hostile', timeMinutes: 2 },
      { id: 'cold_soften', text: '"Talvez eu tenha começado mal."', nextScene: 'janette_identity', timeMinutes: 2, flags: { apologizedToJanette: true } },
      { id: 'cold_tung', text: '"Bertram Tung."', nextScene: 'janette_tung', timeMinutes: 2 },
    ],
  },

  janette_hostile: {
    id: 'janette_hostile', chapter: 'ASYLUM', title: 'Dentes Atrás do Sorriso', location: asylum,
    narration: ['O sorriso desaparece por tempo demais para parecer brincadeira.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Jeanette. Este é meu clube. E seria melhor aprender a brincar direito.' },
    choices: [
      { id: 'hostile_tung', text: '"Ótimo. Agora Bertram."', nextScene: 'janette_tung_hostile', timeMinutes: 2 },
      { id: 'hostile_leave', text: 'Deixar o Asylum.', nextScene: 'free_roam', timeMinutes: 1 },
    ],
  },

  janette_interest: {
    id: 'janette_interest', chapter: 'ASYLUM', title: 'Recém-Morto', location: asylum,
    narration: ['O olhar dela fica mais atento do que sedutor.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Você ainda não aprendeu quem deve odiar, quem deve obedecer e quais mentiras precisa fingir que acredita. Isso torna você interessante.' },
    choices: [
      { id: 'interest_camarilla', text: '"Está falando da Camarilla?"', nextScene: 'janette_camarilla', timeMinutes: 2 },
      { id: 'interest_therese', text: '"Está falando de Therese?"', nextScene: 'janette_therese', timeMinutes: 2 },
      { id: 'interest_tung', text: '"Estou tentando decidir o que acreditar sobre Tung."', nextScene: 'janette_tung', timeMinutes: 2 },
    ],
  },

  janette_club: {
    id: 'janette_club', chapter: 'ASYLUM', title: 'Caos Certificável', location: asylum,
    narration: ['Jeanette abre os braços como se apresentasse um reino particular.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Therese cuida dos contratos e finge que eu sou decoração. Eu cuido das pessoas. Curiosamente, são elas que mantêm uma boate viva.' },
    choices: [
      { id: 'club_ownership', text: '"Então o clube pertence às duas?"', nextScene: 'janette_ownership', timeMinutes: 2 },
      { id: 'club_hate', text: '"Por que vocês se odeiam?"', nextScene: 'janette_therese', timeMinutes: 2 },
      { id: 'club_tung', text: '"E Bertram?"', nextScene: 'janette_tung', timeMinutes: 2 },
    ],
  },

  janette_ownership: {
    id: 'janette_ownership', chapter: 'ASYLUM', title: 'Duas Assinaturas', location: asylum,
    narration: ['O humor dela muda quando a conversa passa de charme para propriedade.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'No papel, Therese adora explicar como tudo é dela. No mundo real, metade das pessoas entra por minha causa.' },
    choices: [
      { id: 'ownership_sympathy', text: '"Parece que ela apaga sua participação."', nextScene: 'janette_hurt', timeMinutes: 2, flags: { sympathizedWithJanette: true } },
      { id: 'ownership_challenge', text: '"Atrair clientes não é administrar um negócio."', nextScene: 'janette_defensive', timeMinutes: 2, flags: { challengedJanette: true } },
      { id: 'ownership_therese', text: '"Vou ouvir a versão dela."', nextScene: 'therese_first', timeMinutes: 2 },
    ],
  },

  janette_therese: {
    id: 'janette_therese', chapter: 'ASYLUM', title: 'Sua Majestade', location: asylum,
    narration: ['A provocação fica mais afiada quando o nome de Therese aparece.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Therese é a responsável. A inteligente. A favorita. A bem-sucedida. Pelo menos é assim que ela conta a história.' },
    choices: [
      { id: 'therese_hate', text: '"Por que vocês se odeiam?"', nextScene: 'janette_hurt', timeMinutes: 2 },
      { id: 'therese_twins', text: '"Vocês são mesmo gêmeas?"', nextScene: 'janette_twins', timeMinutes: 2 },
      { id: 'therese_camarilla', text: '"Por que a Camarilla importa tanto para ela?"', nextScene: 'janette_camarilla', timeMinutes: 2 },
      { id: 'therese_tung', text: '"Onde Tung entra nisso?"', nextScene: 'janette_tung', timeMinutes: 2 },
    ],
  },

  janette_hurt: {
    id: 'janette_hurt', chapter: 'ASYLUM', title: 'A Favorita', location: asylum,
    narration: ['Por um momento, a pose provocadora desmonta.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Ela sempre foi a favorita. A que fazia tudo certo. Eu era a coisa que precisava ser escondida, corrigida ou perdoada.' },
    choices: [
      { id: 'hurt_father', text: '"Favorita de quem?"', nextScene: 'janette_father', timeMinutes: 2 },
      { id: 'hurt_tung', text: '"Bertram ficou do seu lado?"', nextScene: 'janette_tung_relationship', timeMinutes: 2 },
      { id: 'hurt_therese', text: '"Vou falar com Therese."', nextScene: 'therese_first', timeMinutes: 2 },
    ],
  },

  janette_defensive: {
    id: 'janette_defensive', chapter: 'ASYLUM', title: 'Não Sou Inocente', location: asylum,
    narration: ['Jeanette sorri, mas não há leveza.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Eu nunca disse que sou inocente. Só não aceite a versão de Therese como se fosse escritura.' },
    choices: [
      { id: 'def_tung', text: '"Então me conte sua versão sobre Tung."', nextScene: 'janette_tung', timeMinutes: 2 },
      { id: 'def_father', text: '"O que aconteceu na família de vocês?"', nextScene: 'janette_father', timeMinutes: 2 },
      { id: 'def_therese', text: '"Vou ouvir Therese."', nextScene: 'therese_first', timeMinutes: 2 },
    ],
  },

  janette_twins: {
    id: 'janette_twins', chapter: 'ASYLUM', title: 'Gêmeas', location: asylum,
    narration: ['Ela responde rápido demais.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Idênticas. Pelo menos por fora. Por dentro, somos dois lados de uma moeda que nunca parou de girar.' },
    choices: [
      { id: 'twins_difference', text: '"Qual a maior diferença entre vocês?"', nextScene: 'janette_twins_difference', timeMinutes: 2 },
      { id: 'twins_strange', text: '"Você fala como se não fossem duas pessoas."', nextScene: 'janette_janus', timeMinutes: 2, flags: { noticedVoermanContradiction: true } },
      { id: 'twins_therese', text: '"Vou perguntar a Therese."', nextScene: 'therese_first', timeMinutes: 2 },
    ],
  },

  janette_twins_difference: {
    id: 'janette_twins_difference', chapter: 'ASYLUM', title: 'Morder ou Servir', location: asylum,
    narration: ['Jeanette mostra discretamente os dentes.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Therese precisa que tudo seja limpo, controlado, servido num copo. Eu prefiro sentir os dentes entrando.' },
    choices: [
      { id: 'twinsdiff_tung', text: '"E Bertram prefere qual de vocês?"', nextScene: 'janette_tung_relationship', timeMinutes: 2 },
      { id: 'twinsdiff_therese', text: '"Vou subir."', nextScene: 'therese_first', timeMinutes: 2 },
    ],
  },

  janette_janus: {
    id: 'janette_janus', chapter: 'ASYLUM', title: 'Janus', location: asylum,
    narration: ['Jeanette fica quieta por tempo demais.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Duas faces não deixam de ser duas faces só porque pertencem à mesma moeda, gatinho.' },
    choices: [
      { id: 'janus_press', text: '"Isso não respondeu minha pergunta."', nextScene: 'janette_janus_end', timeMinutes: 2 },
      { id: 'janus_tung', text: '"Tudo bem. Tung."', nextScene: 'janette_tung', timeMinutes: 2 },
    ],
  },

  janette_janus_end: {
    id: 'janette_janus_end', chapter: 'ASYLUM', title: 'Não É Hora', location: asylum,
    narration: ['O sorriso retorna como uma porta sendo fechada.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Não respondi. E foi de propósito.' },
    choices: [
      { id: 'janusend_tung', text: '"Então Bertram."', nextScene: 'janette_tung', timeMinutes: 2 },
      { id: 'janusend_therese', text: '"Vou falar com Therese."', nextScene: 'therese_first', timeMinutes: 2 },
    ],
  },

  janette_father: {
    id: 'janette_father', chapter: 'ASYLUM', title: 'Pai', location: asylum,
    narration: ['A mudança é imediata.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Therese aprendeu cedo como ser aquilo que nosso pai queria. Eu aprendi cedo que algumas pessoas chamam controle de amor.' },
    choices: [
      { id: 'father_press', text: '"O que ele fez?"', nextScene: 'janette_father_end', timeMinutes: 2 },
      { id: 'father_stop', text: '"Não precisa continuar."', nextScene: 'janette_tung', timeMinutes: 2 },
    ],
  },

  janette_father_end: {
    id: 'janette_father_end', chapter: 'ASYLUM', title: 'Coisas Que Não Morrem', location: asylum,
    narration: ['Ela não responde diretamente.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Algumas famílias deixam heranças. Outras deixam quartos que você continua tentando sair mesmo décadas depois de morrer.' },
    choices: [
      { id: 'fatherend_therese', text: '"Therese fala dele do mesmo jeito?"', nextScene: 'therese_first', timeMinutes: 2 },
      { id: 'fatherend_tung', text: '"Mudando de assunto. Tung."', nextScene: 'janette_tung', timeMinutes: 2 },
    ],
  },

  janette_camarilla: {
    id: 'janette_camarilla', chapter: 'ASYLUM', title: 'Aprovação', location: asylum,
    narration: ['Jeanette olha para o andar superior.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Therese quer que a Camarilla diga em voz alta que esta cidade é dela. Não basta mandar. Ela quer ser reconhecida.' },
    choices: [
      { id: 'camarilla_bad', text: '"E isso é ruim?"', nextScene: 'janette_camarilla_end', timeMinutes: 2 },
      { id: 'camarilla_tung', text: '"Tung ameaça isso?"', nextScene: 'janette_tung', timeMinutes: 2 },
      { id: 'camarilla_therese', text: '"Quero ouvir isso dela."', nextScene: 'therese_first', timeMinutes: 2 },
    ],
  },

  janette_camarilla_end: {
    id: 'janette_camarilla_end', chapter: 'ASYLUM', title: 'Coleira de Veludo', location: asylum,
    narration: ['Jeanette dá de ombros.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Só acho engraçado quando alguém chama uma coleira de coroa porque o veludo combina com a roupa.' },
    choices: [
      { id: 'camend_tung', text: '"E Bertram?"', nextScene: 'janette_tung', timeMinutes: 2 },
      { id: 'camend_therese', text: '"Vou falar com Therese."', nextScene: 'therese_first', timeMinutes: 2 },
    ],
  },

  janette_tung: {
    id: 'janette_tung', chapter: 'ASYLUM', title: 'Bertram Tung', location: asylum,
    narration: ['Ao ouvir o nome, Jeanette deixa de parecer entediada.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Passei algumas noites com Bertram e, de repente, Therese decidiu que ele era a peste. Ela chama de política. Eu chamo de paranoia.' },
    choices: [
      { id: 'tung_relationship', text: '"Que tipo de relação vocês têm?"', nextScene: 'janette_tung_relationship', timeMinutes: 2 },
      { id: 'tung_therese', text: '"Por que Therese o quer escondido?"', nextScene: 'janette_tung_therese', timeMinutes: 2 },
      { id: 'tung_location', text: '"Onde ele está?"', nextScene: 'janette_tung_location', timeMinutes: 2 },
      { id: 'tung_help', text: '"Pode me ajudar a chegar até ele?"', nextScene: 'janette_gallery_offer', timeMinutes: 2 },
    ],
  },

  janette_tung_hostile: {
    id: 'janette_tung_hostile', chapter: 'ASYLUM', title: 'Informação Tem Preço', location: asylum,
    narration: ['Jeanette cruza os braços.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Precisa de Bertram? Que coincidência. Você precisa de pessoas que acabou de fazer questão de não gostar.' },
    choices: [
      { id: 'tunghost_apologize', text: '"Certo. Eu fui grosseiro."', nextScene: 'janette_tung', timeMinutes: 2 },
      { id: 'tunghost_location', text: '"Só diga onde ele está."', nextScene: 'janette_tung_location', timeMinutes: 2 },
    ],
  },

  janette_tung_relationship: {
    id: 'janette_tung_relationship', chapter: 'ASYLUM', title: 'A Bela e a Fera', location: asylum,
    narration: ['Ela sorri com satisfação calculada.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Bertram é inteligente, desagradável, feio como pecado e muito menos previsível do que Therese gostaria.' },
    choices: [
      { id: 'tungrel_romance', text: '"Vocês são amantes?"', nextScene: 'janette_tung_romance', timeMinutes: 2 },
      { id: 'tungrel_conspiracy', text: '"Therese acha que vocês conspiram?"', nextScene: 'janette_tung_therese', timeMinutes: 2 },
      { id: 'tungrel_location', text: '"Ainda preciso encontrá-lo."', nextScene: 'janette_tung_location', timeMinutes: 2 },
    ],
  },

  janette_tung_romance: {
    id: 'janette_tung_romance', chapter: 'ASYLUM', title: 'Rumores', location: asylum,
    narration: ['Jeanette sorri.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Algumas noites são mais interessantes quando ninguém define exatamente o que aconteceu nelas.' },
    choices: [
      { id: 'romance_conspiracy', text: '"Então não há conspiração?"', nextScene: 'janette_tung_therese', timeMinutes: 2 },
      { id: 'romance_location', text: '"Onde ele está?"', nextScene: 'janette_tung_location', timeMinutes: 2 },
    ],
  },

  janette_tung_therese: {
    id: 'janette_tung_therese', chapter: 'ASYLUM', title: 'Paranoia', location: asylum,
    narration: ['Jeanette tamborila os dedos no balcão.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Therese acredita que Bertram compromete a autoridade dela. Talvez comprometa. Mas qualquer pessoa que não obedece parece ameaça quando alguém vive de controle.' },
    choices: [
      { id: 'tungtherese_business', text: '"Ele sabotou negócios dela?"', nextScene: 'janette_tung_business', timeMinutes: 2 },
      { id: 'tungtherese_location', text: '"Onde ele está?"', nextScene: 'janette_tung_location', timeMinutes: 2 },
      { id: 'tungtherese_ask', text: '"Vou perguntar a Therese."', nextScene: 'therese_first', timeMinutes: 2 },
    ],
  },

  janette_tung_business: {
    id: 'janette_tung_business', chapter: 'ASYLUM', title: 'Negócios', location: asylum,
    narration: ['Jeanette hesita.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Therese diz que sim. Um negócio imobiliário caiu, investidores recuaram e Bertram estava perto demais para ela considerar coincidência.' },
    choices: [
      { id: 'tungbusiness_honest', text: '"Então você não sabe."', nextScene: 'janette_tung_location', timeMinutes: 2 },
      { id: 'tungbusiness_therese', text: '"Quero ouvir a versão dela."', nextScene: 'therese_first', timeMinutes: 2 },
    ],
  },

  janette_tung_location: {
    id: 'janette_tung_location', chapter: 'ASYLUM', title: 'Escondido', location: asylum,
    narration: ['Jeanette mede você com o olhar.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Mesmo se eu soubesse exatamente onde ele está, Bertram não sairia enquanto acreditar que Therese pretende destruí-lo.' },
    choices: [
      { id: 'location_deal', text: '"Então preciso encerrar a disputa."', nextScene: 'janette_gallery_offer', timeMinutes: 2 },
      { id: 'location_therese', text: '"Vou falar com Therese."', nextScene: 'therese_first', timeMinutes: 2 },
    ],
  },

  janette_gallery_offer: {
    id: 'janette_gallery_offer', chapter: 'ASYLUM', title: 'Uma Noite na Galeria', location: asylum,
    narration: ['Jeanette tira uma faca fina da bolsa e a deixa sobre o balcão.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Galeria Noir. Evento beneficente, gente influente e um Membro montando seu próprio círculo de poder. Quero que você estrague a noite.' },
    choices: [
      { id: 'gallery_details', text: '"O que exatamente devo fazer?"', nextScene: 'janette_gallery_details', timeMinutes: 2 },
      { id: 'gallery_motive', text: '"Por que isso importa para você?"', nextScene: 'janette_gallery_motive', timeMinutes: 2 },
      { id: 'gallery_refuse', text: '"Não vou fazer isso."', nextScene: 'janette_gallery_refusal', timeMinutes: 2 },
    ],
  },

  janette_gallery_motive: {
    id: 'janette_gallery_motive', chapter: 'ASYLUM', title: 'Poder', location: asylum,
    narration: ['O tom continua leve, mas a resposta revela cálculo político.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Territórios mudam quando favores, dinheiro e pessoas começam a fluir para outro centro. Uma festa hoje pode virar uma corte em seis meses.' },
    choices: [
      { id: 'motive_smart', text: '"Você entende mais de política do que finge."', nextScene: 'janette_gallery_smart', timeMinutes: 2 },
      { id: 'motive_details', text: '"Explique a missão."', nextScene: 'janette_gallery_details', timeMinutes: 2 },
    ],
  },

  janette_gallery_smart: {
    id: 'janette_gallery_smart', chapter: 'ASYLUM', title: 'A Piada', location: asylum,
    narration: ['Jeanette ergue uma sobrancelha.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Não conte para Therese. Ela investiu duas vidas na ideia de que eu sou a irmã burra.' },
    choices: [
      { id: 'smart_details', text: '"O trabalho."', nextScene: 'janette_gallery_details', timeMinutes: 2 },
      { id: 'smart_therese', text: '"Talvez eu conte."', nextScene: 'therese_first', timeMinutes: 2 },
    ],
  },

  janette_gallery_details: {
    id: 'janette_gallery_details', chapter: 'ASYLUM', title: 'A Faca', location: asylum,
    narration: ['Jeanette empurra a faca na sua direção.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Corte as obras principais. Não seja pego. Não transforme aquilo num massacre. Se encontrar a caixa de doações, pode levá-la também.' },
    choices: [
      { id: 'details_charity', text: '"E a caridade?"', nextScene: 'janette_gallery_charity', timeMinutes: 2 },
      { id: 'details_kill', text: '"Por que não matar os seguranças?"', nextScene: 'janette_gallery_casualties', timeMinutes: 2 },
      { id: 'details_accept', text: 'Aceitar e pegar a faca.', nextScene: 'free_roam', timeMinutes: 3, flags: { galleryNoirUnlocked: true, janetteGalleryAccepted: true, janetteGalleryKnifeReceived: true } },
    ],
  },

  janette_gallery_charity: {
    id: 'janette_gallery_charity', chapter: 'ASYLUM', title: 'Caridade', location: asylum,
    narration: ['Jeanette ri sem humor.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'O dinheiro não termina onde a placa diz. Pode deixar a caixa se isso ajuda sua consciência. As pinturas são o que importa.' },
    choices: [
      { id: 'charity_accept', text: 'Aceitar.', nextScene: 'free_roam', timeMinutes: 2, flags: { galleryNoirUnlocked: true, janetteGalleryAccepted: true, janetteGalleryKnifeReceived: true } },
    ],
  },

  janette_gallery_casualties: {
    id: 'janette_gallery_casualties', chapter: 'ASYLUM', title: 'Não É Um Massacre', location: asylum,
    narration: ['A expressão dela endurece.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Cadáveres chamam polícia, caçadores, Príncipe e perguntas. Pedi vandalismo, não guerra.' },
    choices: [
      { id: 'casualties_accept', text: 'Aceitar.', nextScene: 'free_roam', timeMinutes: 2, flags: { galleryNoirUnlocked: true, janetteGalleryAccepted: true, janetteGalleryKnifeReceived: true } },
    ],
  },

  janette_gallery_refusal: {
    id: 'janette_gallery_refusal', chapter: 'ASYLUM', title: 'Sem Mel', location: asylum,
    narration: ['Jeanette cruza os braços.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Recuse, se quiser. Só não confunda liberdade de escolha com ausência de consequências.' },
    choices: [
      { id: 'refusal_reconsider', text: '"Certo. Explique de novo."', nextScene: 'janette_gallery_details', timeMinutes: 1 },
      { id: 'refusal_therese', text: '"Vou negociar com Therese."', nextScene: 'therese_first', timeMinutes: 2 },
      { id: 'refusal_leave', text: 'Sair.', nextScene: 'free_roam', timeMinutes: 1 },
    ],
  },

  gallery_noir_infiltration: {
    id: 'gallery_noir_infiltration', chapter: 'ASYLUM', title: 'Galeria Noir', location: gallery,
    narration: [
      'A galeria está cheia de taças, sorrisos treinados e conversas políticas disfarçadas de banalidades.',
      'Dois seguranças privados circulam em padrões regulares. A caixa de doações fica próxima ao palco.',
    ],
    choices: [
      { id: 'gallery_observe', text: 'Observar os seguranças.', nextScene: 'gallery_observe', timeMinutes: 5 },
      { id: 'gallery_direct', text: 'Ir direto às pinturas.', nextScene: 'gallery_direct', timeMinutes: 3 },
      { id: 'gallery_leave', text: 'Desistir.', nextScene: 'free_roam', timeMinutes: 2 },
    ],
  },

  gallery_observe: {
    id: 'gallery_observe', chapter: 'ASYLUM', title: 'Padrões', location: gallery,
    narration: ['Há uma janela curta em que os dois seguranças desaparecem do salão principal.'],
    choices: [
      { id: 'observe_clean', text: 'Cortar as pinturas e sair pelos fundos.', nextScene: 'gallery_clean', timeMinutes: 8, flags: { galleryPaintingsSlashed: true, gallerySabotageResolved: true, gallerySabotageClean: true, galleryNoCasualties: true } },
      { id: 'observe_box', text: 'Cortar as pinturas e pegar a caixa.', nextScene: 'gallery_full', timeMinutes: 10, flags: { galleryPaintingsSlashed: true, galleryDonationBoxStolen: true, gallerySabotageResolved: true, gallerySabotageClean: true, galleryNoCasualties: true } },
    ],
  },

  gallery_direct: {
    id: 'gallery_direct', chapter: 'ASYLUM', title: 'Rápido Demais', location: gallery,
    narration: ['A primeira tela rasga. Na segunda, um segurança percebe o movimento.'],
    choices: [
      { id: 'direct_flee', text: 'Terminar e fugir.', nextScene: 'gallery_seen', timeMinutes: 6, flags: { galleryPaintingsSlashed: true, gallerySabotageResolved: true, gallerySabotageWitnessed: true } },
      { id: 'direct_abort', text: 'Abandonar e fugir.', nextScene: 'free_roam', timeMinutes: 4, flags: { galleryJobFailed: true } },
    ],
  },

  gallery_clean: {
    id: 'gallery_clean', chapter: 'ASYLUM', title: 'Cortes Limpos', location: gallery,
    narration: ['Quando os primeiros gritos começam, você já está do lado de fora.'],
    dialogue: { speaker: 'Narrador', text: 'A sabotagem foi concluída sem exposição.' },
    choices: [{ id: 'clean_return', text: 'Voltar à cidade.', nextScene: 'janette_gallery_return', timeMinutes: 3 }],
  },

  gallery_full: {
    id: 'gallery_full', chapter: 'ASYLUM', title: 'Arte e Caridade', location: gallery,
    narration: ['As obras ficam arruinadas. A caixa de doações desaparece com você.'],
    dialogue: { speaker: 'Narrador', text: 'Jeanette conseguiu tudo que pediu.' },
    choices: [{ id: 'full_return', text: 'Voltar à cidade.', nextScene: 'janette_gallery_return', timeMinutes: 3 }],
  },

  gallery_seen: {
    id: 'gallery_seen', chapter: 'ASYLUM', title: 'Testemunhas', location: gallery,
    narration: ['Você escapa, mas alguém viu seu rosto e suas roupas.'],
    dialogue: { speaker: 'Narrador', text: 'A missão foi cumprida, mas não foi limpa.' },
    choices: [{ id: 'seen_return', text: 'Voltar à cidade.', nextScene: 'janette_gallery_return_seen', timeMinutes: 3 }],
  },

  janette_gallery_return: {
    id: 'janette_gallery_return', chapter: 'ASYLUM', title: 'Bom Trabalho', location: asylum,
    narration: ['Jeanette percebe sua chegada antes que você consiga chamá-la.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Você voltou sem polícia e sem cadáveres. Estou impressionada.' },
    choices: [
      { id: 'return_box', text: '"Também trouxe a caixa."', nextScene: 'janette_gallery_after', timeMinutes: 2 },
      { id: 'return_tung', text: '"Agora cumpra sua parte sobre Tung."', nextScene: 'janette_gallery_after', timeMinutes: 2 },
      { id: 'return_suspicion', text: '"Você não me contou tudo."', nextScene: 'janette_gallery_calledout', timeMinutes: 2 },
    ],
  },

  janette_gallery_return_seen: {
    id: 'janette_gallery_return_seen', chapter: 'ASYLUM', title: 'Quase Limpo', location: asylum,
    narration: ['Jeanette nota a tensão em você.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'As pinturas estão arruinadas, você está vivo e alguém provavelmente consegue descrever sua roupa. Poderia ter sido pior.' },
    choices: [
      { id: 'seen_angry', text: '"Você disse que seria simples."', nextScene: 'janette_gallery_calledout', timeMinutes: 2 },
      { id: 'seen_tung', text: '"Já fiz o trabalho. E Tung?"', nextScene: 'janette_gallery_after', timeMinutes: 2 },
    ],
  },

  janette_gallery_calledout: {
    id: 'janette_gallery_calledout', chapter: 'ASYLUM', title: 'O Que Eu Não Disse', location: asylum,
    narration: ['Jeanette não pergunta o que você descobriu.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Eu disse o que precisava para você fazer o trabalho. Se contasse cada detalhe político, você ainda estaria decidindo qual pecado parecia mais educado.' },
    choices: [
      { id: 'calledout_therese', text: '"Era um evento de Therese, não era?"', nextScene: 'janette_gallery_admission', timeMinutes: 2 },
      { id: 'calledout_tung', text: '"Chega. Quero Tung."', nextScene: 'janette_gallery_after', timeMinutes: 2 },
    ],
  },

  janette_gallery_admission: {
    id: 'janette_gallery_admission', chapter: 'ASYLUM', title: 'Irmãs', location: asylum,
    narration: ['Jeanette não demonstra culpa.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Sim. Parte do evento era dela. Agora entende por que seria menos divertido se eu começasse por isso.' },
    choices: [
      { id: 'admission_used', text: '"Você me usou."', nextScene: 'janette_gallery_after', timeMinutes: 2, flags: { realizedJanetteUsedPlayer: true } },
      { id: 'admission_tung', text: '"Quero o que foi prometido."', nextScene: 'janette_gallery_after', timeMinutes: 2 },
    ],
  },

  janette_gallery_after: {
    id: 'janette_gallery_after', chapter: 'ASYLUM', title: 'Depois da Galeria', location: asylum,
    narration: ['Jeanette se apoia no balcão.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Therese provavelmente já está decidindo como me punir. Se quer Tung, vai precisar falar com ela.' },
    choices: [
      { id: 'after_therese', text: 'Subir para falar com Therese.', nextScene: 'therese_gallery_confrontation', timeMinutes: 2 },
    ],
  },

  therese_first: {
    id: 'therese_first', chapter: 'ASYLUM', title: 'A Outra Irmã', location: asylum,
    narration: ['O escritório de Therese parece pertencer a outro edifício. Tudo está organizado e silencioso.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Entre, por favor. Peço desculpas pela vulgaridade da minha irmã. Jeanette é escandalosa sem o menor pudor.' },
    choices: [
      { id: 'first_jeanette', text: '"Jeanette disse que o clube também é dela."', nextScene: 'therese_about_jeanette', timeMinutes: 2 },
      { id: 'first_city', text: '"Você manda nesta cidade?"', nextScene: 'therese_city', timeMinutes: 2 },
      { id: 'first_tung', text: '"Estou procurando Bertram Tung."', nextScene: 'therese_tung', timeMinutes: 2 },
    ],
  },

  therese_about_jeanette: {
    id: 'therese_about_jeanette', chapter: 'ASYLUM', title: 'A Versão de Therese', location: asylum,
    narration: ['Therese olha brevemente para a porta.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Jeanette confunde atenção com participação. É excelente com a clientela, admito. Mas administrar este lugar exige mais do que ser lembrada.' },
    choices: [
      { id: 'about_hate', text: '"Você fala dela como se a desprezasse."', nextScene: 'therese_about_jeanette_2', timeMinutes: 2 },
      { id: 'about_ownership', text: '"Ela diz que você apaga o que ela faz."', nextScene: 'therese_control', timeMinutes: 2 },
      { id: 'about_tung', text: '"Ela também chamou você de paranoica por causa de Tung."', nextScene: 'therese_tung', timeMinutes: 2 },
    ],
  },

  therese_about_jeanette_2: {
    id: 'therese_about_jeanette_2', chapter: 'ASYLUM', title: 'Tolerância', location: asylum,
    narration: ['Therese não reage ao tom da acusação.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Jeanette é impulsiva e talentosa em transformar consequências em problemas de outras pessoas. Isso não significa que eu não me importe com ela.' },
    choices: [
      { id: 'about2_care', text: '"Então por que tanta distância?"', nextScene: 'therese_sire', timeMinutes: 2 },
      { id: 'about2_father', text: '"Ela falou sobre o pai de vocês."', nextScene: 'therese_father', timeMinutes: 2 },
      { id: 'about2_tung', text: '"E Tung?"', nextScene: 'therese_tung', timeMinutes: 2 },
    ],
  },

  therese_sire: {
    id: 'therese_sire', chapter: 'ASYLUM', title: 'Irmã e Cria', location: asylum,
    narration: ['A resposta vem mais devagar.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Jeanette é minha irmã. E minha cria. Essas responsabilidades não se tornam mais simples porque ela prefere tratá-las como piada.' },
    choices: [
      { id: 'sire_twins', text: '"Você a Abraçou? Mas ela diz que vocês são gêmeas."', nextScene: 'therese_twins', timeMinutes: 2, flags: { noticedVoermanContradiction: true } },
      { id: 'sire_tung', text: '"Voltemos a Tung."', nextScene: 'therese_tung', timeMinutes: 2 },
    ],
  },

  therese_twins: {
    id: 'therese_twins', chapter: 'ASYLUM', title: 'Não É da Sua Conta', location: asylum,
    narration: ['Pela primeira vez, Therese parece irritada por uma pergunta pessoal.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Nossa história familiar é complexa. Você não precisa compreendê-la para cumprir o motivo que o trouxe aqui.' },
    choices: [
      { id: 'twins_press', text: '"Isso não faz sentido."', nextScene: 'therese_twins_end', timeMinutes: 2 },
      { id: 'twins_tung', text: '"Certo. Tung."', nextScene: 'therese_tung', timeMinutes: 2 },
    ],
  },

  therese_twins_end: {
    id: 'therese_twins_end', chapter: 'ASYLUM', title: 'Limites', location: asylum,
    narration: ['Therese se inclina para frente.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Aprenda a distinguir mistério de informação que simplesmente não lhe pertence.' },
    choices: [
      { id: 'twinsend_tung', text: '"Então Tung."', nextScene: 'therese_tung', timeMinutes: 2 },
    ],
  },

  therese_control: {
    id: 'therese_control', chapter: 'ASYLUM', title: 'Controle', location: asylum,
    narration: ['Therese não levanta a voz.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Controle é uma palavra que pessoas irresponsáveis usam quando alguém impede que suas decisões prejudiquem todos ao redor.' },
    choices: [
      { id: 'control_tung', text: '"É assim que justifica Tung?"', nextScene: 'therese_tung', timeMinutes: 2 },
      { id: 'control_city', text: '"E a cidade?"', nextScene: 'therese_city', timeMinutes: 2 },
    ],
  },

  therese_city: {
    id: 'therese_city', chapter: 'ASYLUM', title: 'Administração', location: asylum,
    narration: ['Therese assume um tom profissional.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Esta região precisa de uma autoridade reconhecida. Eu administro negócios, mantenho acordos e evito que conflitos chamem atenção mortal.' },
    choices: [
      { id: 'city_prince', text: '"Você quer ser Príncipe?"', nextScene: 'therese_ambition', timeMinutes: 2 },
      { id: 'city_camarilla', text: '"Então precisa da Camarilla."', nextScene: 'therese_camarilla', timeMinutes: 2 },
      { id: 'city_tung', text: '"E Tung ameaça sua imagem."', nextScene: 'therese_tung', timeMinutes: 2 },
    ],
  },

  therese_ambition: {
    id: 'therese_ambition', chapter: 'ASYLUM', title: 'Ambição', location: asylum,
    narration: ['Therese não nega.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Se existir uma posição que eu esteja preparada para ocupar, não vou fingir desinteresse para parecer humilde.' },
    choices: [
      { id: 'ambition_camarilla', text: '"Então quer reconhecimento oficial."', nextScene: 'therese_camarilla', timeMinutes: 2 },
      { id: 'ambition_tung', text: '"Por isso Tung é um problema."', nextScene: 'therese_tung', timeMinutes: 2 },
    ],
  },

  therese_camarilla: {
    id: 'therese_camarilla', chapter: 'ASYLUM', title: 'Legitimidade', location: asylum,
    narration: ['A resposta vem sem hesitação.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Preciso que a Camarilla reconheça oficialmente minha administração. Enquanto rivais sabotam negócios sem consequência, minha posição parece provisória.' },
    choices: [
      { id: 'camarilla_tung', text: '"Está falando de Tung."', nextScene: 'therese_tung', timeMinutes: 2 },
      { id: 'camarilla_business', text: '"Que negócio foi sabotado?"', nextScene: 'therese_tung_business', timeMinutes: 2 },
    ],
  },

  therese_tung: {
    id: 'therese_tung', chapter: 'ASYLUM', title: 'O Exílio de Tung', location: asylum,
    narration: ['A expressão de Therese endurece.'],
    dialogue: { speaker: 'Therese Voerman', text: 'O exílio de Tung é autoimposto. Ele permanece escondido porque sabe que não tolero interferência nos meus assuntos.' },
    choices: [
      { id: 'tung_kill', text: '"Você realmente pretende matá-lo?"', nextScene: 'therese_tung_threat', timeMinutes: 2 },
      { id: 'tung_business', text: '"Ele sabotou seus negócios?"', nextScene: 'therese_tung_business', timeMinutes: 2 },
      { id: 'tung_deal', text: '"O que você quer para encerrar isso?"', nextScene: 'therese_ocean_offer', timeMinutes: 2 },
    ],
  },

  therese_tung_threat: {
    id: 'therese_tung_threat', chapter: 'ASYLUM', title: 'Uma Ameaça Útil', location: asylum,
    narration: ['Therese responde sem constrangimento.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Prefiro que ele acredite que sim. Enquanto pensa que pretendo destruí-lo, permanece escondido e não interfere.' },
    choices: [
      { id: 'threat_deal', text: '"Então retire a ameaça."', nextScene: 'therese_ocean_offer', timeMinutes: 2 },
      { id: 'threat_authority', text: '"Então é sobre autoridade."', nextScene: 'therese_camarilla', timeMinutes: 2 },
    ],
  },

  therese_tung_business: {
    id: 'therese_tung_business', chapter: 'ASYLUM', title: 'Propriedade Perdida', location: asylum,
    narration: ['A irritação parece mais concreta quando fala de dinheiro.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Eu negociava participação numa propriedade estratégica. Informações vazaram, parceiros recuaram e Tung estava ligado a quem se beneficiou.' },
    choices: [
      { id: 'business_proof', text: '"Mas não consegue provar."', nextScene: 'therese_tung_evidence', timeMinutes: 2 },
      { id: 'business_other', text: '"Você tem outros investimentos?"', nextScene: 'therese_ocean_offer', timeMinutes: 2 },
    ],
  },

  therese_tung_evidence: {
    id: 'therese_tung_evidence', chapter: 'ASYLUM', title: 'Provas', location: asylum,
    narration: ['Therese recosta na cadeira.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Tenho coincidências suficientes para não tratá-las como coincidências.' },
    choices: [
      { id: 'evidence_deal', text: '"Ainda preciso encontrá-lo."', nextScene: 'therese_ocean_offer', timeMinutes: 2 },
    ],
  },

  therese_ocean_offer: {
    id: 'therese_ocean_offer', chapter: 'ASYLUM', title: 'Uma Troca', location: asylum,
    narration: ['Therese abre um mapa sobre a mesa.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Posso considerar minhas divergências com Tung encerradas. Em troca, você resolverá um problema no Ocean House Hotel.' },
    choices: [
      { id: 'ocean_problem', text: '"Que problema?"', nextScene: 'therese_ocean_ghost', timeMinutes: 2 },
      { id: 'ocean_price', text: '"Só isso basta?"', nextScene: 'therese_ocean_value', timeMinutes: 2 },
      { id: 'ocean_refuse', text: '"Não trabalho para você."', nextScene: 'therese_ocean_refusal', timeMinutes: 2 },
    ],
  },

  therese_ocean_value: {
    id: 'therese_ocean_value', chapter: 'ASYLUM', title: 'Valor', location: asylum,
    narration: ['Therese não disfarça o cálculo.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Não é perdão. É custo. Se resolver um problema que vale mais para mim do que manter Tung escondido, a decisão é simples.' },
    choices: [
      { id: 'value_problem', text: '"Explique."', nextScene: 'therese_ocean_ghost', timeMinutes: 2 },
    ],
  },

  therese_ocean_ghost: {
    id: 'therese_ocean_ghost', chapter: 'ASYLUM', title: 'Ocean House', location: asylum,
    narration: ['Therese aponta para a propriedade no mapa.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Três equipes de construção se recusaram a continuar. Relatam fenômenos que sugerem uma presença espiritual.' },
    choices: [
      { id: 'ghost_exist', text: '"Fantasmas existem?"', nextScene: 'therese_ocean_supernatural', timeMinutes: 2 },
      { id: 'ghost_history', text: '"O que aconteceu no hotel?"', nextScene: 'therese_ocean_history', timeMinutes: 2 },
      { id: 'ghost_task', text: '"O que quer que eu encontre?"', nextScene: 'therese_ocean_object', timeMinutes: 2 },
    ],
  },

  therese_ocean_supernatural: {
    id: 'therese_ocean_supernatural', chapter: 'ASYLUM', title: 'O Mundo Ficou Maior', location: asylum,
    narration: ['Therese parece impaciente com sua surpresa.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Fantasmas existem. Lobisomens existem. Sua morte não o tornou especialista no sobrenatural.' },
    choices: [
      { id: 'supernatural_object', text: '"O que preciso trazer?"', nextScene: 'therese_ocean_object', timeMinutes: 2 },
    ],
  },

  therese_ocean_history: {
    id: 'therese_ocean_history', chapter: 'ASYLUM', title: 'História Queimada', location: asylum,
    narration: ['Therese consulta uma anotação.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Houve uma morte violenta e um incêndio. Portas se fecham, objetos se movem e alguns juram ter visto uma mulher nos corredores.' },
    choices: [
      { id: 'history_object', text: '"Como pretende removê-la?"', nextScene: 'therese_ocean_object', timeMinutes: 2 },
    ],
  },

  therese_ocean_object: {
    id: 'therese_ocean_object', chapter: 'ASYLUM', title: 'Objeto Pessoal', location: asylum,
    narration: ['Therese coloca uma chave sobre a mesa.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Encontre um objeto pessoal ligado ao espírito e traga para mim. Esta chave abre o túnel de acesso pelos esgotos.' },
    choices: [
      { id: 'object_word', text: '"E depois encerra a disputa?"', nextScene: 'therese_ocean_word', timeMinutes: 2 },
      { id: 'object_accept', text: 'Pegar a chave e aceitar.', nextScene: 'free_roam', timeMinutes: 3, flags: { oceanHouseUnlocked: true, oceanHouseAccepted: true, oceanHouseKeyReceived: true } },
    ],
  },

  therese_ocean_word: {
    id: 'therese_ocean_word', chapter: 'ASYLUM', title: 'Minha Palavra', location: asylum,
    narration: ['Therese responde sem hesitar.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Se cumprir sua parte, cumprirei a minha.' },
    choices: [
      { id: 'word_accept', text: 'Pegar a chave.', nextScene: 'free_roam', timeMinutes: 2, flags: { oceanHouseUnlocked: true, oceanHouseAccepted: true, oceanHouseKeyReceived: true, theresePromisedTungTruce: true } },
    ],
  },

  therese_ocean_refusal: {
    id: 'therese_ocean_refusal', chapter: 'ASYLUM', title: 'Escolhas', location: asylum,
    narration: ['Therese não tenta impedir que você recuse.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Pode recusar. Apenas não espere que eu resolva o problema de Tung gratuitamente.' },
    choices: [
      { id: 'refusal_reconsider', text: '"Certo. Eu aceito."', nextScene: 'therese_ocean_object', timeMinutes: 1 },
      { id: 'refusal_leave', text: 'Sair.', nextScene: 'free_roam', timeMinutes: 1 },
    ],
  },

  ocean_house_investigation: {
    id: 'ocean_house_investigation', chapter: 'ASYLUM', title: 'Ocean House Hotel', location: oceanHouse,
    narration: [
      'O hotel conserva marcas de incêndio e um frio que não combina com o litoral.',
      'Um corredor leva aos quartos queimados. Outro desce para áreas de serviço parcialmente alagadas.',
    ],
    choices: [
      { id: 'ocean_rooms', text: 'Investigar os quartos.', nextScene: 'ocean_house_rooms', timeMinutes: 8 },
      { id: 'ocean_service', text: 'Investigar a área de serviço.', nextScene: 'ocean_house_service', timeMinutes: 8 },
      { id: 'ocean_leave', text: 'Sair por enquanto.', nextScene: 'free_roam', timeMinutes: 4 },
    ],
  },

  ocean_house_rooms: {
    id: 'ocean_house_rooms', chapter: 'ASYLUM', title: 'O Quarto', location: oceanHouse,
    narration: ['Uma fotografia parcialmente queimada mostra uma mulher diante do hotel. Uma porta bate no corredor quando você toca a moldura.'],
    choices: [
      { id: 'rooms_continue', text: 'Continuar procurando.', nextScene: 'ocean_house_pendant', timeMinutes: 5 },
    ],
  },

  ocean_house_service: {
    id: 'ocean_house_service', chapter: 'ASYLUM', title: 'Água Fria', location: oceanHouse,
    narration: ['Documentos antigos citam uma morte, uma criança e pertences nunca reclamados.'],
    choices: [
      { id: 'service_continue', text: 'Procurar os pertences.', nextScene: 'ocean_house_pendant', timeMinutes: 5 },
    ],
  },

  ocean_house_pendant: {
    id: 'ocean_house_pendant', chapter: 'ASYLUM', title: 'O Pingente', location: oceanHouse,
    narration: ['Um pequeno pingente infantil está sobre o assoalho. Quando você se aproxima, a temperatura cai.'],
    choices: [
      { id: 'pendant_take', text: 'Recolher o pingente.', nextScene: 'ocean_house_escape', timeMinutes: 3, flags: { oceanSpiritObjectRecovered: true, oceanPendantRecovered: true } },
      { id: 'pendant_leave', text: 'Deixar o objeto.', nextScene: 'free_roam', timeMinutes: 4 },
    ],
  },

  ocean_house_escape: {
    id: 'ocean_house_escape', chapter: 'ASYLUM', title: 'Saída', location: oceanHouse,
    narration: ['No instante em que o pingente deixa o chão, alguma coisa atravessa o corredor. O caminho de volta parece mais longo.'],
    dialogue: { speaker: 'Narrador', text: 'Você conseguiu o objeto. Agora precisa decidir em quem confiar.' },
    choices: [{ id: 'escape_return', text: 'Voltar ao Asylum.', nextScene: 'voerman_ocean_return', timeMinutes: 5 }],
  },

  voerman_ocean_return: {
    id: 'voerman_ocean_return', chapter: 'ASYLUM', title: 'O Objeto do Espírito', location: asylum,
    narration: ['Therese está no escritório. Jeanette está no andar de baixo.'],
    dialogue: { speaker: 'Narrador', text: 'Com quem você fala primeiro?' },
    choices: [
      { id: 'return_therese', text: 'Procurar Therese.', nextScene: 'therese_ocean_return', timeMinutes: 2 },
      { id: 'return_jeanette', text: 'Procurar Jeanette.', nextScene: 'janette_ocean_intercept', timeMinutes: 2 },
    ],
  },

  janette_ocean_intercept: {
    id: 'janette_ocean_intercept', chapter: 'ASYLUM', title: 'Antes de Subir', location: asylum,
    narration: ['Jeanette percebe imediatamente que você trouxe alguma coisa.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Então voltou inteiro. Therese pediu alguma lembrancinha?' },
    choices: [
      { id: 'intercept_show', text: 'Mostrar o pingente.', nextScene: 'janette_ocean_object', timeMinutes: 2 },
      { id: 'intercept_hide', text: '"Isso é entre mim e Therese."', nextScene: 'therese_ocean_return', timeMinutes: 2 },
      { id: 'intercept_why', text: '"Por que você se importa?"', nextScene: 'janette_ocean_motive', timeMinutes: 2 },
    ],
  },

  janette_ocean_motive: {
    id: 'janette_ocean_motive', chapter: 'ASYLUM', title: 'Memórias Não São Imóveis', location: asylum,
    narration: ['O tom provocador diminui.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Therese olha para um lugar assombrado e vê metros quadrados desperdiçados. Talvez aquela coisa esteja presa por um motivo.' },
    choices: [
      { id: 'motive_object', text: '"O que faria com o pingente?"', nextScene: 'janette_ocean_object', timeMinutes: 2 },
      { id: 'motive_therese', text: '"Vou ouvir Therese."', nextScene: 'therese_ocean_return', timeMinutes: 2 },
    ],
  },

  janette_ocean_object: {
    id: 'janette_ocean_object', chapter: 'ASYLUM', title: 'Uma Lembrança Para o Mar', location: asylum,
    narration: ['Jeanette observa o pingente com seriedade incomum.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Me dê isso. Eu tiro o objeto do alcance de Therese e do hotel. O mar pode ficar com ele.' },
    choices: [
      { id: 'object_give', text: 'Entregar a Jeanette.', nextScene: 'janette_ocean_destroy', timeMinutes: 2, flags: { oceanObjectGivenToJanette: true, trustedJanetteOverTherese: true } },
      { id: 'object_question', text: '"Como sei que não é só para prejudicar Therese?"', nextScene: 'janette_ocean_honesty', timeMinutes: 2 },
      { id: 'object_refuse', text: '"Fiz um acordo com Therese."', nextScene: 'therese_ocean_return', timeMinutes: 2 },
    ],
  },

  janette_ocean_honesty: {
    id: 'janette_ocean_honesty', chapter: 'ASYLUM', title: 'Motivos Misturados', location: asylum,
    narration: ['Jeanette sorri de lado.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Talvez eu queira libertar um fantasma. Talvez queira irritar minha irmã. Talvez as duas coisas sejam verdade.' },
    choices: [
      { id: 'honesty_give', text: 'Entregar o pingente.', nextScene: 'janette_ocean_destroy', timeMinutes: 2 },
      { id: 'honesty_therese', text: 'Procurar Therese.', nextScene: 'therese_ocean_return', timeMinutes: 2 },
    ],
  },

  janette_ocean_destroy: {
    id: 'janette_ocean_destroy', chapter: 'ASYLUM', title: 'O Pacífico', location: asylum,
    narration: ['Jeanette fecha a mão sobre o pingente.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Quando terminar aqui, isso vai estar no fundo do oceano.' },
    choices: [{ id: 'destroy_continue', text: 'Encerrar a conversa.', nextScene: 'therese_ocean_betrayal', timeMinutes: 2, flags: { oceanObjectDestroyed: true } }],
  },

  therese_ocean_return: {
    id: 'therese_ocean_return', chapter: 'ASYLUM', title: 'A Parte do Acordo', location: asylum,
    narration: ['Therese olha para suas mãos antes de perguntar.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Você encontrou alguma coisa?' },
    choices: [
      { id: 'return_give', text: 'Entregar o pingente.', nextScene: 'therese_ocean_success', timeMinutes: 2, flags: { oceanObjectGivenToTherese: true, keptWordToTherese: true } },
      { id: 'return_ask', text: '"O que fará com ele?"', nextScene: 'therese_ocean_intent', timeMinutes: 2 },
      { id: 'return_lie', text: '"Não encontrei nada útil."', nextScene: 'therese_ocean_suspicious', timeMinutes: 2 },
    ],
  },

  therese_ocean_intent: {
    id: 'therese_ocean_intent', chapter: 'ASYLUM', title: 'Método', location: asylum,
    narration: ['Therese não se surpreende.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Vou confirmar a ligação com a manifestação e contratar quem possa removê-la de maneira definitiva.' },
    choices: [
      { id: 'intent_give', text: 'Entregar o pingente.', nextScene: 'therese_ocean_success', timeMinutes: 2 },
      { id: 'intent_keep', text: '"Ainda não."', nextScene: 'free_roam', timeMinutes: 1 },
    ],
  },

  therese_ocean_suspicious: {
    id: 'therese_ocean_suspicious', chapter: 'ASYLUM', title: 'Uma Resposta Ruim', location: asylum,
    narration: ['Therese fica em silêncio.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Espero que seja incompetência. A alternativa seria mais desagradável.' },
    choices: [
      { id: 'suspicious_confess', text: '"Eu encontrei o pingente."', nextScene: 'therese_ocean_intent', timeMinutes: 1 },
      { id: 'suspicious_leave', text: 'Manter a mentira.', nextScene: 'free_roam', timeMinutes: 1, flags: { thereseDistrustsPlayer: true } },
    ],
  },

  therese_ocean_success: {
    id: 'therese_ocean_success', chapter: 'ASYLUM', title: 'Acordo Cumprido', location: asylum,
    narration: ['Therese pega o pingente com cuidado.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Você cumpriu sua parte. Considerarei a disputa com Tung encerrada. Mas ele não acreditará nisso enquanto Jeanette achar que pretendo agir contra ela.' },
    choices: [
      { id: 'success_why', text: '"Por que Jeanette acha isso?"', nextScene: 'therese_surfside_threat', timeMinutes: 2 },
      { id: 'success_job', text: '"O que quer que eu faça?"', nextScene: 'therese_surfside_offer', timeMinutes: 2 },
    ],
  },

  therese_ocean_betrayal: {
    id: 'therese_ocean_betrayal', chapter: 'ASYLUM', title: 'A Propriedade Inútil', location: asylum,
    narration: ['Therese levanta tão rápido que a cadeira atinge a parede.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Você entregou o objeto a Jeanette. Ela o jogou no oceano. Agora não posso remover a manifestação.' },
    choices: [
      { id: 'betrayal_blame', text: '"Ela me convenceu."', nextScene: 'therese_ocean_betrayal_2', timeMinutes: 2 },
      { id: 'betrayal_own', text: '"Foi minha decisão."', nextScene: 'therese_ocean_betrayal_respect', timeMinutes: 2 },
      { id: 'betrayal_fix', text: '"Como corrijo isso?"', nextScene: 'therese_surfside_threat', timeMinutes: 2 },
    ],
  },

  therese_ocean_betrayal_2: {
    id: 'therese_ocean_betrayal_2', chapter: 'ASYLUM', title: 'Usado', location: asylum,
    narration: ['Therese volta a falar mais baixo.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Você não é a primeira pessoa usada por Jeanette. Isso explica. Não absolve.' },
    choices: [{ id: 'betrayal2_fix', text: '"Dê uma chance de reparar."', nextScene: 'therese_surfside_threat', timeMinutes: 2 }],
  },

  therese_ocean_betrayal_respect: {
    id: 'therese_ocean_betrayal_respect', chapter: 'ASYLUM', title: 'Responsabilidade', location: asylum,
    narration: ['Therese parece surpresa.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Ao menos assume responsabilidade. Isso o diferencia dela.' },
    choices: [{ id: 'respect_fix', text: '"Ainda quero resolver Tung."', nextScene: 'therese_surfside_threat', timeMinutes: 2 }],
  },

  therese_gallery_confrontation: {
    id: 'therese_gallery_confrontation', chapter: 'ASYLUM', title: 'O Preço da Galeria', location: asylum,
    narration: ['A notícia da Galeria Noir chegou antes de você.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Aquele era meu evento. Você realmente acreditou que eu não descobriria?' },
    choices: [
      { id: 'confront_blame', text: '"Jeanette me enganou."', nextScene: 'therese_gallery_blame', timeMinutes: 2 },
      { id: 'confront_own', text: '"A decisão foi minha."', nextScene: 'therese_gallery_own', timeMinutes: 2 },
      { id: 'confront_repair', text: '"Quero reparar o dano."', nextScene: 'therese_gallery_repair', timeMinutes: 2 },
    ],
  },

  therese_gallery_blame: {
    id: 'therese_gallery_blame', chapter: 'ASYLUM', title: 'Não É Desculpa', location: asylum,
    narration: ['Therese demonstra irritação, mas não surpresa.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Jeanette transforma pessoas em extensões dos próprios impulsos. Ainda assim, você segurou a faca.' },
    choices: [{ id: 'blame_repair', text: '"Então me dê uma forma de consertar."', nextScene: 'therese_gallery_repair', timeMinutes: 2 }],
  },

  therese_gallery_own: {
    id: 'therese_gallery_own', chapter: 'ASYLUM', title: 'Assumir', location: asylum,
    narration: ['Therese considera a resposta.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Ao menos não tenta esconder sua participação atrás da minha irmã.' },
    choices: [{ id: 'own_repair', text: '"Posso reparar?"', nextScene: 'therese_gallery_repair', timeMinutes: 2 }],
  },

  therese_gallery_repair: {
    id: 'therese_gallery_repair', chapter: 'ASYLUM', title: 'Uma Segunda Chance', location: asylum,
    narration: ['Therese respira devagar.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Jeanette interpretou uma discussão recente como ameaça real. Tung certamente já sabe. Enquanto isso continuar, ele presumirá que qualquer trégua é armadilha.' },
    choices: [
      { id: 'repair_threat', text: '"Que ameaça?"', nextScene: 'therese_surfside_threat', timeMinutes: 2 },
      { id: 'repair_job', text: '"O que faço?"', nextScene: 'therese_surfside_offer', timeMinutes: 2 },
    ],
  },

  therese_surfside_threat: {
    id: 'therese_surfside_threat', chapter: 'ASYLUM', title: 'Ameaças no Calor do Momento', location: asylum,
    narration: ['Therese escolhe cada palavra.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Durante uma discussão, fiz ameaças envolvendo fogo. Foram ditas no calor do momento. Jeanette decidiu tratá-las como intenção real.' },
    choices: [
      { id: 'threat_ironic', text: '"Você ameaçou queimá-la e está surpresa?"', nextScene: 'therese_surfside_defense', timeMinutes: 2 },
      { id: 'threat_care', text: '"Você realmente não quer machucá-la?"', nextScene: 'therese_surfside_care', timeMinutes: 2 },
      { id: 'threat_job', text: '"Onde ela está?"', nextScene: 'therese_surfside_offer', timeMinutes: 2 },
    ],
  },

  therese_surfside_defense: {
    id: 'therese_surfside_defense', chapter: 'ASYLUM', title: 'Calor do Momento', location: asylum,
    narration: ['Therese parece irritada consigo mesma.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Não disse que foi sensato. Disse que não era literal.' },
    choices: [
      { id: 'defense_care', text: '"Então diga: quer Jeanette viva?"', nextScene: 'therese_surfside_care', timeMinutes: 2 },
      { id: 'defense_job', text: '"Onde encontro ela?"', nextScene: 'therese_surfside_offer', timeMinutes: 2 },
    ],
  },

  therese_surfside_care: {
    id: 'therese_surfside_care', chapter: 'ASYLUM', title: 'Quero Minha Irmã de Volta', location: asylum,
    narration: ['O silêncio antes da resposta é revelador.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Jeanette é minha irmã. Minha cria. Por mais que me provoque, eu não aceitaria sua destruição.' },
    choices: [
      { id: 'care_job', text: '"Onde ela está?"', nextScene: 'therese_surfside_offer', timeMinutes: 2 },
      { id: 'care_father', text: '"Ela diz que o problema começou com seu pai."', nextScene: 'therese_father', timeMinutes: 2 },
    ],
  },

  therese_surfside_offer: {
    id: 'therese_surfside_offer', chapter: 'ASYLUM', title: 'Surfside Diner', location: asylum,
    narration: ['Therese escreve um endereço.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Jeanette deve estar no Surfside Diner, na cabine dos fundos perto dos telefones. Diga que não pretendo agir contra ela e convença-a a voltar.' },
    choices: [
      { id: 'surf_accept', text: 'Aceitar a mediação.', nextScene: 'surfside_wait_jeanette', timeMinutes: 2, flags: { surfsideMeetingUnlocked: true, voermanMediationAccepted: true } },
      { id: 'surf_refuse', text: '"Não sou terapeuta de família."', nextScene: 'therese_surfside_refusal', timeMinutes: 2 },
    ],
  },

  therese_surfside_refusal: {
    id: 'therese_surfside_refusal', chapter: 'ASYLUM', title: 'Não É Terapia', location: asylum,
    narration: ['Therese não acha graça.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Nem eu pedi terapia. Pedi que entregue uma mensagem que também resolve seu problema com Tung.' },
    choices: [
      { id: 'surfref_accept', text: '"Tudo bem."', nextScene: 'surfside_wait_jeanette', timeMinutes: 2, flags: { surfsideMeetingUnlocked: true } },
      { id: 'surfref_leave', text: '"Então Tung pode esperar."', nextScene: 'free_roam', timeMinutes: 1 },
    ],
  },

  surfside_wait_jeanette: {
    id: 'surfside_wait_jeanette', chapter: 'ASYLUM', title: 'Irmãs', location: surfside,
    narration: ['Jeanette chega olhando por cima do ombro. Aqui, longe do Asylum, parece menos segura.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Therese mandou você? Ela disse que não vai me machucar? Que reconfortante.' },
    choices: [
      { id: 'surf_reassure', text: '"Ela quer conversar, não atacar você."', nextScene: 'surfside_doubt', timeMinutes: 2 },
      { id: 'surf_honest', text: '"Ela ameaçou você, mas admite que perdeu o controle."', nextScene: 'surfside_honesty', timeMinutes: 2 },
      { id: 'surf_pressure', text: '"Volte. Tung não sai do esconderijo assim."', nextScene: 'surfside_pressure', timeMinutes: 2 },
      { id: 'surf_fear', text: '"Você acha mesmo que ela mataria você?"', nextScene: 'surfside_fear', timeMinutes: 2 },
    ],
  },

  surfside_doubt: {
    id: 'surfside_doubt', chapter: 'ASYLUM', title: 'Promessas', location: surfside,
    narration: ['Jeanette olha para o telefone.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Therese é ótima em transformar ameaças em mal-entendidos depois que todo mundo já está com medo suficiente para obedecer.' },
    choices: [
      { id: 'doubt_neutral', text: '"Não precisa confiar. Só volte e escute."', nextScene: 'surfside_agrees', timeMinutes: 2 },
      { id: 'doubt_support', text: '"Se ela tentar alguma coisa, fico do seu lado."', nextScene: 'surfside_agrees', timeMinutes: 2 },
    ],
  },

  surfside_honesty: {
    id: 'surfside_honesty', chapter: 'ASYLUM', title: 'Pelo Menos Você Não Mentiu', location: surfside,
    narration: ['Jeanette observa você por alguns segundos.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Pelo menos você não chegou aqui dizendo que minha irmã virou santa.' },
    choices: [
      { id: 'honesty_return', text: '"Volte e resolva isso olhando para ela."', nextScene: 'surfside_agrees', timeMinutes: 2 },
      { id: 'honesty_father', text: '"Ela ainda reage ao assunto do seu pai."', nextScene: 'surfside_father', timeMinutes: 2 },
    ],
  },

  surfside_pressure: {
    id: 'surfside_pressure', chapter: 'ASYLUM', title: 'Não Sou Um Recado', location: surfside,
    narration: ['Jeanette perde o sorriso.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Therese aponta, você anda, Bertram sai do buraco e todo mundo chama de solução?' },
    choices: [
      { id: 'pressure_apologize', text: '"Falei como se você fosse objeto. Foi errado."', nextScene: 'surfside_agrees', timeMinutes: 2 },
      { id: 'pressure_double', text: '"É o resultado que importa."', nextScene: 'surfside_reluctant', timeMinutes: 2 },
    ],
  },

  surfside_fear: {
    id: 'surfside_fear', chapter: 'ASYLUM', title: 'Medo', location: surfside,
    narration: ['Jeanette demora para responder.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Therese consegue convencer a si mesma de quase qualquer coisa quando acredita que está protegendo ordem, autoridade ou família.' },
    choices: [
      { id: 'fear_return', text: '"Mesmo assim precisa falar com ela."', nextScene: 'surfside_agrees', timeMinutes: 2 },
    ],
  },

  surfside_father: {
    id: 'surfside_father', chapter: 'ASYLUM', title: 'A Ferida Antiga', location: surfside,
    narration: ['Jeanette desvia o olhar.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Ela ainda precisa acreditar que ele amava ela. Talvez precise disso mais do que precisa de mim.' },
    choices: [{ id: 'father_return', text: '"Então diga isso para ela."', nextScene: 'surfside_agrees', timeMinutes: 2 }],
  },

  surfside_reluctant: {
    id: 'surfside_reluctant', chapter: 'ASYLUM', title: 'Por Necessidade', location: surfside,
    narration: ['Jeanette se levanta.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Tudo bem. Vou voltar porque quero Tung fora dessa história, não porque vocês mandaram.' },
    choices: [{ id: 'reluctant_return', text: 'Voltar ao Asylum.', nextScene: 'therese_reconciliation_return', timeMinutes: 2, flags: { jeanetteAgreedToMeet: true, jeanetteReturnedReluctantly: true } }],
  },

  surfside_agrees: {
    id: 'surfside_agrees', chapter: 'ASYLUM', title: 'Uma Promessa Incômoda', location: surfside,
    narration: ['Jeanette passa o dedo pela borda do copo.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Tudo bem. Eu volto. Mas se ela tentar me transformar em criança obediente outra vez, vou fazer um escândalo.' },
    choices: [{ id: 'agrees_return', text: 'Voltar ao Asylum.', nextScene: 'therese_reconciliation_return', timeMinutes: 2, flags: { jeanetteAgreedToMeet: true } }],
  },

  therese_reconciliation_return: {
    id: 'therese_reconciliation_return', chapter: 'ASYLUM', title: 'Ela Vai Voltar', location: asylum,
    narration: ['Therese escuta em silêncio. O alívio é mínimo, mas existe.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Obrigada. Quando ela chegar, quero encerrar isso sem intermediários.' },
    choices: [
      { id: 'recon_wait', text: 'Esperar Jeanette.', nextScene: 'voerman_final_entrance', timeMinutes: 5 },
    ],
  },

  voerman_final_entrance: {
    id: 'voerman_final_entrance', chapter: 'ASYLUM', title: 'Duas Vozes', location: asylum,
    narration: ['Jeanette entra sem bater. Therese não se levanta. Durante alguns segundos, nenhuma olha para você.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Pronto. A filha desobediente voltou para a reunião de família.' },
    choices: [
      { id: 'final_silent', text: 'Ficar em silêncio.', nextScene: 'voerman_final_argument', timeMinutes: 2 },
      { id: 'final_mediate', text: '"Vocês precisam resolver isso diretamente."', nextScene: 'voerman_final_argument', timeMinutes: 2 },
    ],
  },

  voerman_final_argument: {
    id: 'voerman_final_argument', chapter: 'ASYLUM', title: 'Velhas Acusações', location: asylum,
    narration: ['Em poucos minutos, nenhuma das duas parece falar apenas sobre a discussão recente.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Você transforma situações administráveis em caos e arrasta outras pessoas para dentro.' },
    choices: [
      { id: 'argument_jeanette', text: '"Jeanette, responda sem provocar."', nextScene: 'voerman_final_jeanette', timeMinutes: 2 },
      { id: 'argument_therese', text: '"Therese, diga o que realmente quer dela."', nextScene: 'voerman_final_therese', timeMinutes: 2 },
      { id: 'argument_father', text: '"Isso começou muito antes de Tung ou do clube."', nextScene: 'voerman_final_father', timeMinutes: 2 },
    ],
  },

  voerman_final_jeanette: {
    id: 'voerman_final_jeanette', chapter: 'ASYLUM', title: 'A Versão de Jeanette', location: asylum,
    narration: ['Jeanette respira fundo.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Quero que ela pare de tratar tudo que faço como doença, erro ou provocação. Quero que admita que não é dona de mim.' },
    choices: [
      { id: 'finalj_therese', text: '"Therese?"', nextScene: 'voerman_final_therese', timeMinutes: 2 },
      { id: 'finalj_father', text: '"Isso é sobre seu pai também."', nextScene: 'voerman_final_father', timeMinutes: 2 },
    ],
  },

  voerman_final_therese: {
    id: 'voerman_final_therese', chapter: 'ASYLUM', title: 'A Versão de Therese', location: asylum,
    narration: ['Therese encara Jeanette.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Quero poder acreditar que, se eu virar as costas, ela não transformará ressentimento em desastre.' },
    choices: [
      { id: 'finalt_balance', text: '"Proteger não é controlar, e liberdade não é ausência de consequência."', nextScene: 'voerman_final_balance', timeMinutes: 2 },
      { id: 'finalt_father', text: '"Vocês continuam falando de algo muito mais antigo."', nextScene: 'voerman_final_father', timeMinutes: 2 },
    ],
  },

  voerman_final_father: {
    id: 'voerman_final_father', chapter: 'ASYLUM', title: 'Pai', location: asylum,
    narration: ['A palavra muda o ambiente. Jeanette perde parte do sorriso. Therese fica rígida.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Não fale sobre nosso pai.' },
    choices: [
      { id: 'father_backoff', text: '"Tudo bem. Voltemos ao presente."', nextScene: 'voerman_final_balance', timeMinutes: 2 },
      { id: 'father_press', text: '"É exatamente por isso que precisamos falar dele."', nextScene: 'voerman_final_father_2', timeMinutes: 2 },
    ],
  },

  voerman_final_father_2: {
    id: 'voerman_final_father_2', chapter: 'ASYLUM', title: 'A Ferida', location: asylum,
    narration: ['Jeanette fala antes que Therese interrompa.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Ela ainda precisa acreditar que ele amava ela. Que havia uma filha boa e uma filha ruim.' },
    choices: [
      { id: 'father2_therese', text: '"Therese, talvez Jeanette tenha vivido outra versão daquela casa."', nextScene: 'voerman_final_balance', timeMinutes: 2 },
      { id: 'father2_jeanette', text: '"Jeanette, usar isso para ferir Therese não resolve nada."', nextScene: 'voerman_final_balance', timeMinutes: 2 },
    ],
  },

  voerman_final_balance: {
    id: 'voerman_final_balance', chapter: 'ASYLUM', title: 'Escolher ou Conciliar', location: asylum,
    narration: ['As duas estão em silêncio.'],
    dialogue: { speaker: 'Narrador', text: 'Você pode tomar partido ou tentar impedir que uma destrua a outra.' },
    choices: [
      { id: 'balance_jeanette', text: '"Therese, você passou tempo demais tentando controlar Jeanette."', nextScene: 'voerman_support_jeanette', timeMinutes: 2 },
      { id: 'balance_therese', text: '"Jeanette, você transforma ressentimento em arma."', nextScene: 'voerman_support_therese', timeMinutes: 2 },
      { id: 'balance_reconcile', text: '"Parem de tentar vencer."', nextScene: 'voerman_reconcile', timeMinutes: 3 },
    ],
  },

  voerman_support_jeanette: {
    id: 'voerman_support_jeanette', chapter: 'ASYLUM', title: 'Jeanette', location: asylum,
    narration: ['Therese olha para você como se tivesse confirmado uma suspeita.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Então escolheu acreditar que ausência de limites é liberdade.' },
    choices: [
      { id: 'supportj_confirm', text: '"Escolhi acreditar que ela tem direito de existir sem sua permissão."', nextScene: 'voerman_outcome_jeanette', timeMinutes: 2, flags: { choseJanette: true, voermanConflictResolved: true } },
      { id: 'supportj_reconcile', text: '"Não. Ainda podem parar."', nextScene: 'voerman_reconcile', timeMinutes: 2 },
    ],
  },

  voerman_support_therese: {
    id: 'voerman_support_therese', chapter: 'ASYLUM', title: 'Therese', location: asylum,
    narration: ['Jeanette encara você. O sorriso desaparece.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'No fim todo mundo prefere a irmã que promete manter os móveis no lugar.' },
    choices: [
      { id: 'supportt_confirm', text: '"Escolhi alguém que assume consequências."', nextScene: 'voerman_outcome_therese', timeMinutes: 2, flags: { choseTherese: true, voermanConflictResolved: true } },
      { id: 'supportt_reconcile', text: '"Ainda não estou escolhendo uma de vocês."', nextScene: 'voerman_reconcile', timeMinutes: 2 },
    ],
  },

  voerman_reconcile: {
    id: 'voerman_reconcile', chapter: 'ASYLUM', title: 'Nenhuma Vence', location: asylum,
    narration: ['Nenhuma das duas gosta da resposta. Talvez seja um bom sinal.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'E como exatamente você imagina que isso funciona, gatinho?' },
    choices: [
      { id: 'reconcile_accountability', text: '"Jeanette admite quando usa pessoas. Therese admite quando chama controle de proteção."', nextScene: 'voerman_reconcile_2', timeMinutes: 3 },
      { id: 'reconcile_truth', text: '"Digam uma verdade que a outra não quer ouvir."', nextScene: 'voerman_reconcile_2', timeMinutes: 3 },
    ],
  },

  voerman_reconcile_2: {
    id: 'voerman_reconcile_2', chapter: 'ASYLUM', title: 'Uma Verdade Cada', location: asylum,
    narration: ['Therese olha para Jeanette. Jeanette não desvia.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Você transforma pessoas em ferramentas quando está com raiva de mim.' },
    choices: [
      { id: 'reconcile2_jeanette', text: '"Jeanette?"', nextScene: 'voerman_reconcile_3', timeMinutes: 2 },
    ],
  },

  voerman_reconcile_3: {
    id: 'voerman_reconcile_3', chapter: 'ASYLUM', title: 'A Outra Verdade', location: asylum,
    narration: ['Jeanette passa alguns segundos sem responder.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Eu faço isso. E você chama medo de responsabilidade porque admitir que está com medo faria você parecer fraca.' },
    choices: [
      { id: 'reconcile3_finish', text: '"Agora parem antes de destruir o que sobrou."', nextScene: 'voerman_outcome_reconciled', timeMinutes: 2, flags: { reconciledVoermans: true, voermanConflictResolved: true } },
    ],
  },

  voerman_outcome_jeanette: {
    id: 'voerman_outcome_jeanette', chapter: 'ASYLUM', title: 'Uma Face Permanece', location: asylum,
    narration: ['A discussão termina sem reconciliação. A ausência de Therese é mais estranha do que deveria ser.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Parece que finalmente ficou mais silencioso aqui.' },
    choices: [{ id: 'outj_tung', text: '"E Bertram?"', nextScene: 'voerman_tung_jeanette', timeMinutes: 2 }],
  },

  voerman_outcome_therese: {
    id: 'voerman_outcome_therese', chapter: 'ASYLUM', title: 'Ordem', location: asylum,
    narration: ['A discussão termina. Jeanette não volta a aparecer.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Isso terminou. Não pretendo discutir os detalhes.' },
    choices: [{ id: 'outt_tung', text: '"Então cumpra sua parte sobre Tung."', nextScene: 'voerman_tung_therese', timeMinutes: 2 }],
  },

  voerman_outcome_reconciled: {
    id: 'voerman_outcome_reconciled', chapter: 'ASYLUM', title: 'Duas Vozes, Uma Trégua', location: asylum,
    narration: ['Não existe abraço ou solução limpa. Existe um cessar-fogo frágil e desconfortável.'],
    dialogue: { speaker: 'Therese Voerman', text: 'A disputa com Tung está encerrada.' },
    choices: [{ id: 'outr_tung', text: '"Onde encontro Bertram?"', nextScene: 'voerman_tung_reconciled', timeMinutes: 2 }],
  },

  voerman_tung_jeanette: {
    id: 'voerman_tung_jeanette', chapter: 'ASYLUM', title: 'Bertram Está Livre', location: asylum,
    narration: ['Jeanette escreve uma indicação de acesso aos túneis.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Diga a Bertram que pode tirar a cabeça do buraco.' },
    choices: [{ id: 'tungj_finish', text: 'Guardar a pista e sair.', nextScene: 'free_roam', timeMinutes: 2, flags: { bertramLeadUnlocked: true, bertramFeudResolved: true } }],
  },

  voerman_tung_therese: {
    id: 'voerman_tung_therese', chapter: 'ASYLUM', title: 'A Palavra de Therese', location: asylum,
    narration: ['Therese escreve uma indicação dos túneis.'],
    dialogue: { speaker: 'Therese Voerman', text: 'A disputa terminou. Procure os túneis sob o Centro.' },
    choices: [{ id: 'tungt_finish', text: 'Guardar a pista e sair.', nextScene: 'free_roam', timeMinutes: 2, flags: { bertramLeadUnlocked: true, bertramFeudResolved: true } }],
  },

  voerman_tung_reconciled: {
    id: 'voerman_tung_reconciled', chapter: 'ASYLUM', title: 'Fim da Disputa', location: asylum,
    narration: ['Therese fornece a localização. Jeanette não contradiz.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Procure os túneis sob o Centro. Tung pode sair do esconderijo.' },
    choices: [{ id: 'tungr_finish', text: 'Guardar a pista e sair.', nextScene: 'free_roam', timeMinutes: 2, flags: { bertramLeadUnlocked: true, bertramFeudResolved: true, reconciledVoermans: true } }],
  },

  therese_father: {
    id: 'therese_father', chapter: 'ASYLUM', title: 'Não Fale Dele', location: asylum,
    narration: ['A reação é imediata e menos controlada do que qualquer discussão política.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Jeanette não tem direito de transformar nosso pai em outra de suas armas.' },
    choices: [
      { id: 'father_loved', text: '"Ela diz que você ainda acredita que ele amava você."', nextScene: 'therese_father_2', timeMinutes: 2 },
      { id: 'father_drop', text: '"Tudo bem. Não vou insistir."', nextScene: 'therese_tung', timeMinutes: 1 },
    ],
  },

  therese_father_2: {
    id: 'therese_father_2', chapter: 'ASYLUM', title: 'Ele Me Amava', location: asylum,
    narration: ['Therese fica imóvel.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Ele me amava. Jeanette prefere destruir qualquer lembrança que não combine com a versão dela.' },
    choices: [
      { id: 'father2_stop', text: '"Entendi."', nextScene: 'therese_tung', timeMinutes: 1 },
      { id: 'father2_challenge', text: '"Duas pessoas podem viver a mesma casa e sobreviver a versões diferentes dela."', nextScene: 'therese_tung', timeMinutes: 2, flags: { plantedReconciliationIdea: true } },
    ],
  },

  janette_malkavian: {
    id: 'janette_malkavian', chapter: 'ASYLUM', title: 'Duas Mentes', location: asylum,
    narration: ['Jeanette para de brincar por um instante.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Oh. Um Malkaviano. Duas mentes quebradas conseguem ouvir ruídos que pessoas inteiras confundem com silêncio.' },
    choices: [
      { id: 'malk_janus', text: '"Janus olha para mim com duas faces, mas eu só vejo um pescoço."', nextScene: 'janette_malkavian_janus', timeMinutes: 2 },
      { id: 'malk_tung', text: '"Só preciso de Tung."', nextScene: 'janette_tung', timeMinutes: 2 },
    ],
  },

  janette_malkavian_janus: {
    id: 'janette_malkavian_janus', chapter: 'ASYLUM', title: 'Janus Sorri', location: asylum,
    narration: ['O sorriso de Jeanette congela por um instante.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Janus. Duas faces, uma passagem. Você enxerga coisas desagradáveis quando olha de lado, não enxerga?' },
    choices: [
      { id: 'malk_press', text: '"Qual das duas está falando comigo agora?"', nextScene: 'janette_malkavian_end', timeMinutes: 2 },
      { id: 'malk_drop', text: '"Não importa. Ainda."', nextScene: 'janette_tung', timeMinutes: 2 },
    ],
  },

  janette_malkavian_end: {
    id: 'janette_malkavian_end', chapter: 'ASYLUM', title: 'A Face Mais Bonita', location: asylum,
    narration: ['Jeanette se aproxima e fala baixo.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'A mais bonita, obviamente. Não estrague a surpresa tentando abrir o presente pelo fundo.' },
    choices: [{ id: 'malkend_tung', text: '"Então guardo a pergunta."', nextScene: 'janette_tung', timeMinutes: 2 }],
  },
}

export default voermanScenes
