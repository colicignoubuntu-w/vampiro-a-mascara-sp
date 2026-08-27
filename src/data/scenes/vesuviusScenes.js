const vesuviusLocation = {
  id: 'vesuvius',
  name: 'Vesuvius',
  district: 'Bela Vista',
}

const backToClub = {
  id: 'return_to_vesuvius_floor',
  text: 'Voltar ao salão do Vesuvius',
  nextScene: 'vesuvius_entrance',
  timeMinutes: 2,
}

const vesuviusScenes = {
  vesuvius_entrance: {
    id: 'vesuvius_entrance',
    chapter: 'VESUVIUS',
    title: 'Veludo e Fumaça',
    location: vesuviusLocation,
    narration: [
      'O Vesuvius pulsa sob um casarão reformado da Bela Vista. Graves abafados atravessam o piso, luzes cor de brasa recortam o palco e o veludo vermelho faz o salão parecer o interior de um coração.',
      'Entre executivos, turistas e criaturas da noite fingindo ser apenas clientes, uma bailarina observa você como se já soubesse seu nome. Ela desce do palco e aponta para a escada reservada. Catorze degraus levam ao mezanino.',
    ],
    dialogue: {
      speaker: 'Vi',
      text:
        'Veja só quem entrou. Aqui embaixo há olhos demais. Suba comigo — só catorze degraus. Lá em cima podemos ser nós mesmos.',
    },
    choices: [
      {
        id: 'follow_vi_upstairs',
        text: 'Subir com Vi',
        nextScene: 'vesuvius_vi_room',
        timeMinutes: 2,
        flags: { metVi: true },
      },
      {
        id: 'ask_vi_name',
        text: 'Perguntar o nome dela antes de subir',
        nextScene: 'vesuvius_vi_name',
        timeMinutes: 1,
        flags: { metVi: true },
      },
      {
        id: 'leave_vesuvius',
        text: 'Deixar o clube por enquanto',
        nextScene: 'free_roam',
        timeMinutes: 1,
      },
    ],
  },

  vesuvius_vi_name: {
    id: 'vesuvius_vi_name',
    chapter: 'VESUVIUS',
    title: 'Vi',
    location: vesuviusLocation,
    narration: [
      'Ela mede sua cautela com um sorriso que pode ser convite ou armadilha.',
    ],
    dialogue: {
      speaker: 'Vi',
      text:
        'Vi. Só deixo quem eu gosto inventar nomes maiores. Continue assim e talvez conquiste esse privilégio.',
    },
    choices: [
      {
        id: 'follow_vi_after_name',
        text: 'Acompanhar Vi ao mezanino',
        nextScene: 'vesuvius_vi_room',
        timeMinutes: 2,
      },
      backToClub,
    ],
  },

  vesuvius_vi_room: {
    id: 'vesuvius_vi_room',
    chapter: 'VESUVIUS',
    title: 'Longe dos Olhos',
    location: vesuviusLocation,
    narration: [
      'O camarim particular abafa a música. Vi fecha a porta, verifica uma câmera pequena sobre a penteadeira e só então abandona o sorriso profissional.',
    ],
    dialogue: {
      speaker: 'Vi',
      text:
        'Não quero estragar o momento, mas preciso de alguém discreto. Um homem chamado David Hatter transformou histórias que ouviu aqui em um roteiro de terror preciso demais. E eu tenho muito apreço por ele para deixar a Camarilla resolver isso à maneira dela.',
    },
    choices: [
      {
        id: 'ask_about_david_hatter',
        text: '"Quem é David Hatter?"',
        nextScene: 'vesuvius_david_problem',
        timeMinutes: 3,
      },
      {
        id: 'ask_why_vi_cares',
        text: '"Por que arriscar tanto por um mortal?"',
        nextScene: 'vesuvius_vi_humanity',
        timeMinutes: 3,
      },
      {
        id: 'ask_about_vi',
        text: '"Antes da missão, quero saber quem você é."',
        nextScene: 'vesuvius_vi_identity',
        timeMinutes: 3,
      },
      {
        id: 'ask_about_hunter',
        text: 'Perguntar se a vigilância sobre o clube está ligada ao roteiro',
        nextScene: 'vesuvius_hunter_details',
        timeMinutes: 3,
      },
      {
        id: 'refuse_vi_business',
        text: '"Não vim aqui para resolver seus problemas."',
        nextScene: 'vesuvius_vi_refusal',
        timeMinutes: 1,
      },
    ],
  },

  vesuvius_vi_humanity: {
    id: 'vesuvius_vi_humanity',
    chapter: 'VESUVIUS',
    title: 'Aquilo que Ainda Importa',
    location: vesuviusLocation,
    narration: [
      'Vi passa o dedo pela lombada de um livro sobre cinema deixado na penteadeira. O gesto não tem nada da personagem que ela interpreta no palco.',
      'Por trás da porta, a música continua. Ali dentro, porém, ela parece escutar apenas uma lembrança.',
    ],
    dialogue: {
      speaker: 'Vi',
      text: 'Porque David ainda cria coisas. Porque confia nas pessoas mesmo quando não deveria. Se começarmos a chamar toda vida mortal de dano colateral, a Besta já venceu — só ainda não tivemos coragem de admitir.',
    },
    choices: [
      { id: 'agree_vi_humanity', text: '"Preservar a Humanidade exige escolhas difíceis."', nextScene: 'vesuvius_david_problem', timeMinutes: 2, flags: { sharedViHumanityView: true } },
      { id: 'challenge_vi_humanity', text: '"Seu apreço pode colocar todos nós em risco."', nextScene: 'vesuvius_vi_mask_answer', timeMinutes: 2 },
      { id: 'ask_if_david_knows_vi', text: '"David sabe o que você realmente é?"', nextScene: 'vesuvius_vi_mask_answer', timeMinutes: 2 },
    ],
  },

  vesuvius_vi_mask_answer: {
    id: 'vesuvius_vi_mask_answer', chapter: 'VESUVIUS', title: 'A Linha da Máscara', location: vesuviusLocation,
    narration: ['Vi encara seu reflexo cercado por lâmpadas. Por um momento, é impossível saber se fala de David ou de si mesma.'],
    dialogue: { speaker: 'Vi', text: 'Ele não sabe. Acha que encontrou uma metáfora brilhante. A fonte dele é quem atravessou a linha. Quero o roteiro destruído e o traidor identificado; quero também que David acorde amanhã acreditando que seu maior problema ainda é encontrar um produtor.' },
    choices: [
      { id: 'accept_vi_boundaries', text: '"Roteiro e fonte. David permanece vivo."', nextScene: 'vesuvius_david_problem', timeMinutes: 1, flags: { understoodViTerms: true } },
      { id: 'ask_penalty_mask', text: '"E qual é a pena para a fonte?"', nextScene: 'vesuvius_vi_mask_penalty', timeMinutes: 1 },
    ],
  },

  vesuvius_vi_mask_penalty: {
    id: 'vesuvius_vi_mask_penalty', chapter: 'VESUVIUS', title: 'A Lei da Noite', location: vesuviusLocation,
    narration: ['O silêncio de Vi responde antes das palavras.'],
    dialogue: { speaker: 'Vi', text: 'Morte, segundo quase todas as facções. Não é minha lei, mas é a lei que mantém tochas longe das nossas portas. Descubra quem foi. Depois decida se deseja ser apenas o braço da lei ou alguma coisa melhor.' },
    choices: [{ id: 'take_hatter_case_after_penalty', text: 'Ouvir os detalhes sobre David', nextScene: 'vesuvius_david_problem', timeMinutes: 2 }],
  },

  vesuvius_vi_identity: {
    id: 'vesuvius_vi_identity', chapter: 'VESUVIUS', title: 'Um Nome Escolhido', location: vesuviusLocation,
    narration: ['A pergunta endurece algo no rosto dela. Vi fecha uma gaveta antes que você veja a fotografia guardada lá dentro.'],
    dialogue: { speaker: 'Vi', text: 'A moça que eu fui tinha outro nome. Era ingênua, imperfeita e morreu na noite do Abraço. Não escondo meu passado; apenas me recuso a deixá-lo escolher quem sou agora. Vi é o nome que sobreviveu.' },
    choices: [
      { id: 'respect_vi_name', text: '"Então Vi é quem está diante de mim."', nextScene: 'vesuvius_vi_humanity', timeMinutes: 2, flags: { respectedViIdentity: true } },
      { id: 'ask_vi_clan', text: '"E o seu sangue?"', nextScene: 'vesuvius_vi_blood', timeMinutes: 2 },
      { id: 'push_vi_past', text: 'Insistir em saber o nome anterior', nextScene: 'vesuvius_vi_rebukes', timeMinutes: 1, flags: { violatedViBoundary: true } },
    ],
  },

  vesuvius_vi_blood: {
    id: 'vesuvius_vi_blood', chapter: 'VESUVIUS', title: 'Sangue de Duas Faces', location: vesuviusLocation,
    narration: ['Vi inclina a cabeça, como se uma segunda conversa acontecesse em algum lugar que você não consegue ouvir.'],
    dialogue: { speaker: 'Vi', text: 'Malkaviana. Nosso sangue encontra rachaduras onde os outros enxergam paredes. Às vezes vemos a verdade; às vezes a verdade olha de volta. É melhor não confundir sedução com distração.' },
    choices: [{ id: 'return_to_david_from_blood', text: 'Perguntar como isso se liga a David', nextScene: 'vesuvius_david_problem', timeMinutes: 2 }],
  },

  vesuvius_vi_rebukes: {
    id: 'vesuvius_vi_rebukes', chapter: 'VESUVIUS', title: 'Deixe os Mortos', location: vesuviusLocation,
    narration: ['A temperatura da conversa cai. Vi abre a porta do camarim e o som do clube invade o espaço.'],
    dialogue: { speaker: 'Vi', text: 'Eu disse que aquele nome pertence a uma garota morta. Deixe os mortos descansarem. Se ainda quer ajudar David, falaremos dele — não dela.' },
    choices: [{ id: 'apologize_vi', text: 'Pedir desculpas e voltar ao assunto de David', nextScene: 'vesuvius_david_problem', timeMinutes: 2, flags: { apologizedToVi: true } }, backToClub],
  },

  vesuvius_vi_refusal: {
    id: 'vesuvius_vi_refusal',
    chapter: 'VESUVIUS',
    title: 'Uma Porta Aberta',
    location: vesuviusLocation,
    narration: ['Vi não tenta bloquear a porta. A decepção dela parece sincera — ou muito bem ensaiada.'],
    dialogue: {
      speaker: 'Vi',
      text:
        'Não vou obrigar você. Nunca precisei. Se mudar de ideia, sabe onde me encontrar.',
    },
    choices: [backToClub],
  },

  vesuvius_hunter_details: {
    id: 'vesuvius_hunter_details',
    chapter: 'VESUVIUS',
    title: 'Castidade',
    location: vesuviusLocation,
    narration: [
      'Vi explica que encontrou uma arma e anotações no armário de uma funcionária. Ela a demitiu, mas a mulher reapareceu em outro clube da Augusta e continua observando o Vesuvius.',
    ],
    dialogue: {
      speaker: 'Vi',
      text:
        'Ela dança como Castidade: loira no topo, um coração partido tatuado nas costas. Afaste-a de mim, mas não machuque inocentes. Sem plateia, sem Disciplina diante de testemunhas. Minha consciência não aceita “danos colaterais”.',
    },
    choices: [
      {
        id: 'accept_hunter_job',
        text: 'Aceitar procurar Castidade',
        nextScene: 'vesuvius_chastity_choice',
        timeMinutes: 25,
        flags: { viHunterJobAccepted: true },
        questEvents: [
          { type: 'quest-start', questId: 'vi_hunter' },
          { type: 'quest-objective-complete', questId: 'vi_hunter', objectiveId: 'find_chastity' },
        ],
      },
      {
        id: 'decline_hunter_job',
        text: 'Recusar o serviço',
        nextScene: 'vesuvius_vi_refusal',
        timeMinutes: 1,
      },
    ],
  },

  vesuvius_david_horror: {
    id: 'vesuvius_david_horror', chapter: 'VESUVIUS', title: 'O Artesão do Medo',
    location: { id: 'lucky_star_motel', name: 'Motel Estrela da Sorte', district: 'Centro' },
    narration: ['David abandona o miojo e fala com as mãos, empilhando referências, enquadramentos e monstros como se montasse um altar.'],
    dialogue: { speaker: 'David Hatter', text: 'Terror não é sangue jogado na lente. É entrar num quarto escuro e perceber que alguma coisa conhece você melhor do que você mesmo. Quero reinventar o vampiro: nada de alho e capa. Sociedade, política, fome e gente fingindo humanidade.' },
    choices: [
      { id: 'praise_david_craft', text: 'Elogiar a ideia e pedir para ler o roteiro', nextScene: 'vesuvius_david_investigation', timeMinutes: 3, flags: { gainedDavidTrust: true } },
      { id: 'question_david_accuracy', text: '"Isso parece específico demais para imaginação."', nextScene: 'vesuvius_david_research', timeMinutes: 2 },
    ],
  },

  vesuvius_david_research: {
    id: 'vesuvius_david_research', chapter: 'VESUVIUS', title: 'O Consultor',
    location: { id: 'lucky_star_motel', name: 'Motel Estrela da Sorte', district: 'Centro' },
    narration: ['O entusiasmo de David vacila. Ele olha para a câmera da recepção e baixa a voz.'],
    dialogue: { speaker: 'David Hatter', text: 'Tenho um consultor. Ele se chama Adder — ou diz que se chama. Aparece tarde, nunca come, conhece túneis e fala de príncipes como se fossem chefes do crime. Achei que fosse método de ator. Agora você está me deixando nervoso.' },
    choices: [
      { id: 'protect_david_cooperation', text: 'Dizer que Adder pode estar usando David e pedir sua ajuda', nextScene: 'vesuvius_david_investigation', timeMinutes: 3, flags: { davidVolunteeredClues: true } },
      { id: 'pressure_david_cooperation', text: 'Pressioná-lo a entregar roteiro, registros e horários', nextScene: 'vesuvius_david_investigation', timeMinutes: 2, flags: { davidFearsPlayer: true } },
    ],
  },

  vesuvius_chastity_choice: {
    id: 'vesuvius_chastity_choice',
    chapter: 'VESUVIUS',
    title: 'A Caçadora',
    location: {
      id: 'augusta_nightclub',
      name: 'Clube da Augusta',
      district: 'Consolação',
    },
    narration: [
      'Você encontra Castidade no fim do expediente. A tatuagem confirma a descrição. Espera até que as outras bailarinas saiam e a aborda no corredor de serviço, longe do público.',
      'Ela não implora. Diz que há monstros no Vesuvius e que, cedo ou tarde, alguém irá provar isso.',
    ],
    choices: [
      {
        id: 'drive_chastity_away',
        text: 'Intimidá-la e obrigá-la a deixar São Paulo',
        nextScene: 'vesuvius_hunter_return_merciful',
        timeMinutes: 12,
        flags: { chastitySpared: true, chastityGone: true },
        questEvents: [
          { type: 'quest-objective-complete', questId: 'vi_hunter', objectiveId: 'deal_with_chastity' },
          { type: 'quest-objective-complete', questId: 'vi_hunter', objectiveId: 'avoid_innocent_casualties' },
        ],
      },
      {
        id: 'kill_chastity_quietly',
        text: 'Eliminar Castidade sem testemunhas',
        nextScene: 'vesuvius_hunter_return_lethal',
        timeMinutes: 10,
        flags: { chastityKilled: true, chastityGone: true },
        questEvents: [
          { type: 'quest-objective-complete', questId: 'vi_hunter', objectiveId: 'deal_with_chastity' },
          { type: 'quest-objective-complete', questId: 'vi_hunter', objectiveId: 'avoid_innocent_casualties' },
        ],
      },
    ],
  },

  vesuvius_hunter_return_merciful: {
    id: 'vesuvius_hunter_return_merciful',
    chapter: 'VESUVIUS',
    title: 'Sem Sangue nas Mãos',
    location: vesuviusLocation,
    narration: ['Vi escuta o relato inteiro antes de permitir que o alívio apareça em seu rosto.'],
    dialogue: {
      speaker: 'Vi',
      text:
        'Você salvou minha vida sem tomar a dela. Talvez a verdade seja cruel, mas nós não precisamos ser. Eu não vou esquecer isso.',
    },
    choices: [
      {
        id: 'hear_about_david_after_mercy',
        text: 'Perguntar se há outra coisa preocupando Vi',
        nextScene: 'vesuvius_david_problem',
        timeMinutes: 3,
        flags: { viApprovedHunterMethod: true },
        questEvents: [
          { type: 'quest-objective-complete', questId: 'vi_hunter', objectiveId: 'report_to_vi' },
          { type: 'quest-complete', questId: 'vi_hunter' },
        ],
      },
      backToClub,
    ],
  },

  vesuvius_hunter_return_lethal: {
    id: 'vesuvius_hunter_return_lethal',
    chapter: 'VESUVIUS',
    title: 'O Peso da Solução',
    location: vesuviusLocation,
    narration: ['O sorriso de Vi desaparece quando você confirma a morte.'],
    dialogue: {
      speaker: 'Vi',
      text:
        'Ela sabia que estava em guerra, mas ainda era uma vida. Não chame isso de baixa aceitável. Agradeço por ter me protegido; só não espere que eu ache bonito.',
    },
    choices: [
      {
        id: 'hear_about_david_after_killing',
        text: 'Mudar de assunto e perguntar pelo clube',
        nextScene: 'vesuvius_david_problem',
        timeMinutes: 3,
        questEvents: [
          { type: 'quest-objective-complete', questId: 'vi_hunter', objectiveId: 'report_to_vi' },
          { type: 'quest-complete', questId: 'vi_hunter' },
        ],
      },
      backToClub,
    ],
  },

  vesuvius_david_problem: {
    id: 'vesuvius_david_problem',
    chapter: 'VESUVIUS',
    title: 'David Hatter',
    location: vesuviusLocation,
    narration: [
      'Vi pega debaixo da penteadeira um cartão amassado do Motel Estrela da Sorte. No verso, há notas sobre um roteiro de terror chamado Feras Interiores.',
      'David passou anos estudando filmes antigos, hóspedes estranhos e o comportamento das pessoas que atravessam a madrugada. Para Vi, ele não é apenas uma ameaça à Máscara: é um mortal criativo cuja vida ainda possui valor.',
    ],
    dialogue: {
      speaker: 'Vi',
      text:
        'David Hatter administra um motel e escreve filmes de terror. Vem aqui há anos para observar gente e buscar histórias. O novo roteiro dele descreve nossa sociedade com detalhes demais para coincidência. Pegue o texto, descubra quem falou e preserve a Máscara. Mas não toque em David. Tenho verdadeiro apreço por aquela mente preciosa.',
    },
    choices: [
      {
        id: 'accept_hatter_job',
        text: 'Prometer que David permanecerá vivo',
        nextScene: 'free_roam',
        timeMinutes: 2,
        flags: { promisedToSpareDavid: true, luckyStarUnlocked: true },
        questEvents: [{ type: 'quest-start', questId: 'vi_hatter' }],
      },
      backToClub,
    ],
  },

  vesuvius_david_meeting: {
    id: 'vesuvius_david_meeting',
    chapter: 'VESUVIUS',
    title: 'Feras Interiores',
    location: {
      id: 'lucky_star_motel',
      name: 'Motel Estrela da Sorte',
      district: 'Centro',
    },
    narration: [
      'David guarda a recepção vazia com um copo de refrigerante genérico e um pote de miojo. Cartazes de filmes de terror antigos cobrem a parede atrás dele. Basta mencionar cinema para abrir um sorriso e retirar de uma gaveta centenas de páginas encadernadas.',
    ],
    dialogue: {
      speaker: 'David Hatter',
      text:
        'É sobre sociedades secretas, monstros anciãos e gente tentando controlar a fera interior. Meu consultor diz que finalmente está autêntico. Produtor nenhum vai conseguir ignorar.',
    },
    choices: [
      {
        id: 'ask_david_about_horror',
        text: 'Perguntar o que torna um filme de terror realmente assustador',
        nextScene: 'vesuvius_david_horror',
        timeMinutes: 4,
      },
      {
        id: 'ask_david_research',
        text: 'Perguntar como ele pesquisou sociedades vampíricas',
        nextScene: 'vesuvius_david_research',
        timeMinutes: 4,
      },
      {
        id: 'buy_david_script',
        text: 'Oferecer dinheiro pelo roteiro e pelo nome do consultor',
        nextScene: 'vesuvius_david_investigation',
        timeMinutes: 8,
        flags: { davidPaidForScript: true },
      },
      {
        id: 'appeal_to_david',
        text: 'Convencê-lo de que o consultor está usando seu talento',
        nextScene: 'vesuvius_david_investigation',
        timeMinutes: 10,
        flags: { davidPersuaded: true },
      },
    ],
  },

  vesuvius_david_investigation: {
    id: 'vesuvius_david_investigation',
    chapter: 'VESUVIUS',
    title: 'Notas de Rodapé',
    location: {
      id: 'lucky_star_motel',
      name: 'Motel Estrela da Sorte',
      district: 'Centro',
    },
    narration: [
      'David permite que você examine o manuscrito, mas insiste que nunca anotou o nome verdadeiro do consultor. As margens contêm correções em tinta violeta, horários e referências a túneis de manutenção sob a Estação da Luz.',
      'No livro de hóspedes, a mesma pessoa visitou David em todas as noites das correções. Pagava em dinheiro, assinava apenas “A.” e telefonava sempre de um orelhão próximo à estação.',
    ],
    choices: [
      {
        id: 'compare_script_guest_log',
        text: 'Comparar datas do roteiro, livro de hóspedes e chamadas',
        nextScene: 'vesuvius_david_source',
        timeMinutes: 12,
        flags: {
          davidGuestLogChecked: true,
          hatterScriptRecovered: true,
        },
        questEvents: [
          { type: 'quest-objective-complete', questId: 'vi_hatter', objectiveId: 'recover_script' },
        ],
      },
    ],
  },

  vesuvius_david_source: {
    id: 'vesuvius_david_source',
    chapter: 'VESUVIUS',
    title: 'A Fonte',
    location: {
      id: 'lucky_star_motel',
      name: 'Motel Estrela da Sorte',
      district: 'Centro',
    },
    narration: [
      'O cruzamento das datas prevê a próxima ligação. Você espera junto ao orelhão da Luz e segue o visitante até um túnel desativado. David o chama de Adder; ele é um Membro jovem que transformou segredos da noite em pesquisa para o roteiro.',
    ],
    dialogue: {
      speaker: 'Adder',
      text:
        'David achava que era ficção. Eu só queria que alguém registrasse como isto realmente funciona. Você vai me executar por algumas páginas?',
    },
    choices: [
      {
        id: 'protect_david_and_mask',
        text: 'Obrigar Adder a desaparecer e manter David fora disso',
        nextScene: 'free_roam',
        timeMinutes: 2,
        flags: { davidSpared: true, adderExiled: true, adderIdentified: true },
        questEvents: [
          { type: 'quest-objective-complete', questId: 'vi_hatter', objectiveId: 'identify_source' },
          { type: 'quest-objective-complete', questId: 'vi_hatter', objectiveId: 'spare_david' },
        ],
      },
      {
        id: 'execute_adder',
        text: 'Executar Adder pela violação da Máscara',
        nextScene: 'free_roam',
        timeMinutes: 10,
        flags: { davidSpared: true, adderKilled: true, adderIdentified: true },
        questEvents: [
          { type: 'quest-objective-complete', questId: 'vi_hatter', objectiveId: 'identify_source' },
          { type: 'quest-objective-complete', questId: 'vi_hatter', objectiveId: 'spare_david' },
        ],
      },
    ],
  },

  vesuvius_hatter_return: {
    id: 'vesuvius_hatter_return',
    chapter: 'VESUVIUS',
    title: 'Páginas Mortas',
    location: vesuviusLocation,
    narration: [
      'Vi segura o roteiro com as duas mãos. Por um instante, parece incapaz de destruir o produto da alma de alguém que admira. Então oferece as páginas a você.',
    ],
    dialogue: {
      speaker: 'Vi',
      text:
        'Eu sei o que precisa ser feito. Só não consigo rasgar tudo com minhas próprias mãos. Faça por mim — e diga que David está bem.',
    },
    choices: [
      {
        id: 'destroy_hatter_script',
        text: 'Rasgar o roteiro e confirmar que David está vivo',
        nextScene: 'vesuvius_vi_confidante',
        timeMinutes: 4,
        flags: { hatterScriptDestroyed: true },
        questEvents: [
          { type: 'quest-objective-complete', questId: 'vi_hatter', objectiveId: 'report_hatter' },
          { type: 'quest-complete', questId: 'vi_hatter' },
        ],
      },
    ],
  },

  vesuvius_vi_confidante: {
    id: 'vesuvius_vi_confidante',
    chapter: 'VESUVIUS',
    title: 'A Linda Garota',
    location: vesuviusLocation,
    narration: [
      'As páginas caem na lixeira em tiras. Vi fecha a tampa, aproxima-se e ajeita sua roupa com uma intimidade cuidadosa.',
    ],
    dialogue: {
      speaker: 'Vi',
      text:
        'Você protegeu o que eu ainda tento preservar em mim. É raro nesta cidade. Quando precisar de um lugar longe da Jihad, venha me encontrar depois do décimo quarto degrau.',
    },
    choices: [
      {
        id: 'finish_vi_story',
        text: 'Despedir-se de Vi e voltar à noite',
        nextScene: 'free_roam',
        timeMinutes: 2,
        flags: { completedViStory: true },
      },
    ],
  },
}

export default vesuviusScenes
