const mercurioHome = { id: 'mercurio_apartment', name: 'Apartamento de Mercurio', district: 'Barra Funda' }
const asylum = { id: 'asylum', name: 'Asylum', district: 'Consolação' }

const cityNpcScenes = {
  mercurio_wounded: {
    id: 'mercurio_wounded', chapter: 'SUBMUNDO', title: 'O Homem no Sofá', location: mercurioHome,
    narration: [
      'A porta está destrancada. Mercurio jaz num sofá ensopado de sangue, com uma costela pressionando a pele e marcas de graxa nas calças. Um rastro escuro vem da garagem.',
      'Apesar dos ferimentos, ele afasta o telefone quando você se aproxima. O medo de policiais é menor que o medo de seu empregador.',
    ],
    dialogue: { speaker: 'Mercurio', text: 'Sem polícia. Roubaram o dinheiro e o Astrolite. Se descobrirem que estraguei a entrega, estou morto. Você não viu nada, entendeu?' },
    choices: [
      { id: 'inspect_mercurio_clothes', text: 'Examinar os resíduos nas roupas e o rastro da garagem', nextScene: 'mercurio_evidence', timeMinutes: 5, questEvents: [{ type: 'quest-start', questId: 'mercurio_astrolite' }] },
      { id: 'ask_mercurio_directly', text: 'Exigir o relato completo da negociação', nextScene: 'mercurio_evidence', timeMinutes: 4, questEvents: [{ type: 'quest-start', questId: 'mercurio_astrolite' }] },
      { id: 'ask_mercurio_vitae', text: '"Você é humano. Por que seu sangue está fechando as feridas?"', nextScene: 'mercurio_ghoul', timeMinutes: 3, questEvents: [{ type: 'quest-start', questId: 'mercurio_astrolite' }] },
      { id: 'help_mercurio_first', text: 'Estancar o sangramento antes de fazer perguntas', nextScene: 'mercurio_gratitude', timeMinutes: 5, flags: { aidedMercurio: true } },
      { id: 'leave_mercurio', text: 'Deixá-lo por enquanto', nextScene: 'free_roam', timeMinutes: 1 },
    ],
  },
  mercurio_ghoul: {
    id: 'mercurio_ghoul', chapter: 'SUBMUNDO', title: 'Um Homem Preso ao Sangue', location: mercurioHome,
    narration: ['Mercurio verifica a porta e baixa a voz. A vergonha pesa mais que a dor.'],
    dialogue: { speaker: 'Mercurio', text: 'Uma vez por mês recebo vitae. Ela cura, fortalece e impede o tempo de me alcançar. Tenho quase sessenta. Também transforma lealdade em corrente. Se meu patrono descobrir que perdi a carga, não haverá segunda chance.' },
    choices: [
      { id: 'ask_ghoul_price', text: '"Então você serve porque quer ou porque o sangue obriga?"', nextScene: 'mercurio_bond', timeMinutes: 2 },
      { id: 'promise_mercurio_silence', text: 'Prometer guardar o segredo e investigar', nextScene: 'mercurio_evidence', timeMinutes: 2, flags: { promisedMercurioSilence: true } },
    ],
  },
  mercurio_bond: {
    id: 'mercurio_bond', chapter: 'SUBMUNDO', title: 'Lealdade Escrita em Sangue', location: mercurioHome,
    narration: ['Ele ri, mas não existe humor no som.'],
    dialogue: { speaker: 'Mercurio', text: 'Depois de trinta anos, não sei onde termina a escolha e começa o vínculo. Sei apenas que a Camarilla me deu uma vida longa e pode tirá-la numa palavra. Você aprenderá que quase toda dádiva dos Membros vem com uma coleira.' },
    choices: [{ id: 'investigate_after_bond', text: 'Perguntar onde ocorreu a entrega', nextScene: 'mercurio_evidence', timeMinutes: 2 }],
  },
  mercurio_gratitude: {
    id: 'mercurio_gratitude', chapter: 'SUBMUNDO', title: 'Primeiro, Sobreviver', location: mercurioHome,
    narration: ['Você improvisa uma compressa. Mercurio continua desconfiado, mas para de tratar cada pergunta como ameaça.'],
    dialogue: { speaker: 'Mercurio', text: 'Não confunda gratidão com confiança. Mas você poderia ter me deixado vazando no sofá. Recupere o Astrolite e eu lhe mostro por que é útil ter um homem capaz de conseguir qualquer coisa nesta cidade.' },
    choices: [{ id: 'hear_mercurio_evidence', text: 'Ouvir o relato da emboscada', nextScene: 'mercurio_evidence', timeMinutes: 3, questEvents: [{ type: 'quest-start', questId: 'mercurio_astrolite' }] }],
  },
  mercurio_evidence: {
    id: 'mercurio_evidence', chapter: 'SUBMUNDO', title: 'Graxa, Areia e Pedágio', location: mercurioHome,
    narration: [
      'A graxa azul é usada por uma transportadora da Marginal Tietê. Um recibo de pedágio e areia industrial presa à barra da calça reduzem a busca a um conjunto de galpões perto da Ponte do Limão.',
    ],
    dialogue: { speaker: 'Mercurio', text: 'Dennis fabrica droga e, às vezes, explosivos. Quatro ou cinco homens. Recupere a carga e o dinheiro. Como fizer isso é problema seu.' },
    choices: [{
      id: 'trace_dennis', text: 'Cruzar o recibo com as transportadoras e marcar o galpão no mapa', nextScene: 'free_roam', timeMinutes: 12,
      flags: { dennisWarehouseUnlocked: true },
      questEvents: [
        { type: 'quest-objective-complete', questId: 'mercurio_astrolite', objectiveId: 'inspect_mercurio' },
        { type: 'quest-objective-complete', questId: 'mercurio_astrolite', objectiveId: 'trace_gang' },
      ],
    }],
  },
  mercurio_warehouse: {
    id: 'mercurio_warehouse', chapter: 'SUBMUNDO', title: 'O Galpão de Dennis',
    location: { id: 'dennis_warehouse', name: 'Galpão Clandestino', district: 'Limão' },
    narration: ['Uma ronda revela duas entradas, quatro homens armados e uma maleta reforçada sobre a bancada. Fios, detonadores e pacotes de anfetamina confirmam o endereço.'],
    choices: [
      { id: 'steal_astrolite', text: 'Cortar a energia, entrar pelos fundos e furtar a maleta', nextScene: 'free_roam', timeMinutes: 18, flags: { dennisGangSpared: true, astroliteRecovered: true }, questEvents: [{ type: 'quest-objective-complete', questId: 'mercurio_astrolite', objectiveId: 'recover_astrolite' }] },
      { id: 'threaten_dennis', text: 'Usar o nome da Camarilla para forçar a devolução', nextScene: 'free_roam', timeMinutes: 12, flags: { dennisIntimidated: true, astroliteRecovered: true }, questEvents: [{ type: 'quest-objective-complete', questId: 'mercurio_astrolite', objectiveId: 'recover_astrolite' }] },
    ],
  },
  mercurio_return: {
    id: 'mercurio_return', chapter: 'SUBMUNDO', title: 'Dívida de Sangue', location: mercurioHome,
    narration: ['Mercurio confere o lacre e o detonador antes de relaxar. A ferida já começou a fechar: vitae corre nas veias dele.'],
    dialogue: { speaker: 'Mercurio', text: 'Você salvou minha pele. Equipamento, armas, informação — eu consigo. E já que precisa entender esta cidade: procure as irmãs Voerman no Asylum. Therese controla o território; Janette transforma tudo em caos.' },
    choices: [{
      id: 'keep_mercurio_secret', text: 'Guardar o segredo e seguir a pista do Asylum', nextScene: 'asylum_entrance', timeMinutes: 20,
      flags: { keptMercurioSecret: true }, questEvents: [
        { type: 'quest-objective-complete', questId: 'mercurio_astrolite', objectiveId: 'report_mercurio' },
        { type: 'quest-complete', questId: 'mercurio_astrolite' },
      ],
    }],
  },
  asylum_entrance: {
    id: 'asylum_entrance', chapter: 'ASYLUM', title: 'Duas Donas', location: asylum,
    narration: [
      'O Asylum ocupa um antigo teatro da Rua Augusta. Vitrais falsos, velas elétricas, ferro retorcido e cortinas negras transformam o salão numa catedral gótica entregue à pista de dança.',
      'Jeanette Voerman surge entre a fumaça artificial antes que você consiga procurar qualquer outra pessoa. Vestida de vermelho e preto, ela recebe você como se já estivesse esperando. No andar superior, uma porta de vidro fosco leva ao escritório de sua irmã, Therese.',
    ],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Ora, ora... o que temos aqui? Mais um brinquedinho delicioso, recém-saído da vida e entrando direto no meu clube. Você cheira a novo, patinho. Eu não estou assustando você, estou?' },
    choices: [
      { id: 'meet_janette', text: 'Responder a Jeanette', nextScene: 'janette_first', timeMinutes: 2 },
      { id: 'leave_asylum', text: 'Voltar às ruas', nextScene: 'free_roam', timeMinutes: 1 },
    ],
  },
  janette_first: {
    id: 'janette_first', chapter: 'ASYLUM', title: 'Caos Certificável', location: asylum,
    narration: ['Jeanette o observa de cima a baixo, divertida demais para que o gesto pareça inocente. A música e as luzes vermelhas do Asylum escondem a tensão que existe por trás do sorriso dela.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Meu nome é Jeanette. E este pedacinho de caos comprimido dentro de uma gargalhada certificadamente insana é meu clube. Então, gatinho: o que você quer de mim?' },
    choices: [
      { id: 'ask_janette_identity', text: '"Quem é você?"', nextScene: 'janette_identity', timeMinutes: 2 },
      { id: 'ask_janette_club', text: '"Este lugar é seu?"', nextScene: 'janette_club', timeMinutes: 2 },
      { id: 'flirt_with_janette', text: '"Está tentando me seduzir?"', nextScene: 'janette_flirt', timeMinutes: 2, flags: { flirtedWithJanette: true } },
      { id: 'ask_bertram', text: '"Preciso encontrar Bertram."', nextScene: 'janette_bertram', timeMinutes: 2 },
      { id: 'hostile_janette', text: '"Só diga seu nome."', nextScene: 'janette_hostile', timeMinutes: 2, flags: { annoyedJanette: true } },
    ],
  },
  janette_asylum: {
    id: 'janette_asylum', chapter: 'ASYLUM', title: 'Uma Catedral para os Estranhos', location: asylum,
    narration: ['Janette contempla a pista como uma rainha observando um reino que só existe até o amanhecer.'],
    dialogue: { speaker: 'Janette Voerman', text: 'Aqui ninguém precisa fingir normalidade. Mortais vêm vestidos de monstros; monstros vêm vestidos de mortais. A música torna todos iguais por alguns minutos. Therese enxerga faturamento. Eu enxergo liberdade com iluminação vermelha.' },
    choices: [
      { id: 'ask_asylum_mask', text: '"Uma boate assim protege ou ameaça a Máscara?"', nextScene: 'janette_mask', timeMinutes: 2 },
      { id: 'go_therese_after_asylum', text: 'Subir para conhecer Therese', nextScene: 'therese_after_janette', timeMinutes: 3 },
    ],
  },
  janette_mask: {
    id: 'janette_mask', chapter: 'ASYLUM', title: 'Esconder à Vista de Todos', location: asylum,
    narration: ['Ela mostra as presas por apenas um instante. Um casal próximo aplaude, acreditando ser parte da fantasia.'],
    dialogue: { speaker: 'Janette Voerman', text: 'A melhor mentira é a verdade apresentada como espetáculo. Se alguém disser que viu uma vampira no Asylum, os amigos perguntarão o que bebeu. Therese chama isso de imprudência. Eu chamo de conhecer o público.' },
    choices: [{ id: 'meet_therese_after_mask', text: 'Levar essa versão ao escritório de Therese', nextScene: 'therese_after_janette', timeMinutes: 3 }],
  },
  janette_sister: {
    id: 'janette_sister', chapter: 'ASYLUM', title: 'A Filha Favorita', location: asylum,
    narration: ['O humor de Janette afia. Pela primeira vez, a provocação parece uma defesa.'],
    dialogue: { speaker: 'Janette Voerman', text: 'Ela sempre foi a responsável, a inteligente, a favorita. Duas vidas ouvindo que sou uma vergonha, uma boneca incapaz de amarrar os próprios sapatos. O Asylum também existe por minha causa, mas Therese prefere administrar até a memória dos outros.' },
    choices: [
      { id: 'sympathize_janette', text: 'Reconhecer que Therese a diminui', nextScene: 'therese_after_janette', timeMinutes: 3, flags: { sympathizedWithJanette: true } },
      { id: 'question_janette_innocence', text: '"Ser maltratada não torna você inocente."', nextScene: 'janette_respect', timeMinutes: 2 },
    ],
  },
  janette_respect: {
    id: 'janette_respect', chapter: 'ASYLUM', title: 'Dentes Atrás do Sorriso', location: asylum,
    narration: ['Janette sorri, desta vez sem doçura.'],
    dialogue: { speaker: 'Janette Voerman', text: 'Muito bem. Talvez você não seja outro brinquedo. Ouça Therese, mas repare no que ela omite quando estiver ocupada demais parecendo razoável.' },
    choices: [{ id: 'go_therese_with_warning', text: 'Entrar no escritório de Therese', nextScene: 'therese_after_janette', timeMinutes: 3 }],
  },
  janette_flirt: {
    id: 'janette_flirt', chapter: 'ASYLUM', title: 'Fogo em Veludo', location: asylum,
    narration: ['Janette se aproxima o bastante para que a conversa pareça íntima e pública ao mesmo tempo.'],
    dialogue: { speaker: 'Janette Voerman', text: 'Cuidado, docinho. No Asylum, desejo é moeda e distração. Eu posso gostar de você e ainda assim querer alguma coisa. As duas verdades cabem perfeitamente no mesmo vestido.' },
    choices: [
      { id: 'admire_janette_honesty', text: '"Ao menos você admite que manipula as pessoas."', nextScene: 'janette_respect', timeMinutes: 2 },
      { id: 'ask_what_janette_wants', text: '"O que você quer de mim?"', nextScene: 'janette_sister', timeMinutes: 2 },
    ],
  },
  therese_after_janette: {
    id: 'therese_after_janette', chapter: 'ASYLUM', title: 'A Versão de Therese', location: asylum,
    narration: ['Therese rebate cada acusação com contratos, contas e relatórios de prejuízo. A documentação é convincente, mas algumas assinaturas parecem familiares demais.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Janette atrai curiosos; eu impeço que o clube desmorone. Investigue o Hotel Mar Atlântico, recupere um objeto do espírito e talvez aprenda a diferença entre charme e competência.' },
    choices: [
      { id: 'ask_therese_authority', text: '"Por que sua autoridade depende desse imóvel?"', nextScene: 'therese_authority', timeMinutes: 3 },
      { id: 'ask_therese_janette', text: '"Janette diz que você tenta controlar até as memórias dela."', nextScene: 'therese_sister', timeMinutes: 3 },
      { id: 'ask_therese_ghost', text: '"Você realmente acredita em fantasmas?"', nextScene: 'therese_ghosts', timeMinutes: 3 },
      { id: 'compare_after_janette_first', text: 'Investigar os documentos e marcar o hotel no mapa', nextScene: 'free_roam', timeMinutes: 10, flags: { heardBothVoermans: true, oceanHouseUnlocked: true }, questEvents: [{ type: 'quest-objective-complete', questId: 'voerman_feud', objectiveId: 'meet_sisters' }] },
    ],
  },
  therese_authority: {
    id: 'therese_authority', chapter: 'ASYLUM', title: 'Legitimidade', location: asylum,
    narration: ['Therese alinha uma pasta que já estava perfeitamente alinhada.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Território não se governa com carisma. A Camarilla reconhece resultados: negócios estáveis, violações contidas, inimigos previsíveis. O hotel provaria que consigo transformar ruína em domínio. Minha irmã prefere transformar domínio em diversão.' },
    choices: [{ id: 'ask_therese_price', text: '"E quantas pessoas se tornam números nesse resultado?"', nextScene: 'therese_pragmatism', timeMinutes: 2 }, { id: 'accept_hotel_after_authority', text: 'Marcar o hotel no mapa', nextScene: 'free_roam', timeMinutes: 2, flags: { heardBothVoermans: true, oceanHouseUnlocked: true }, questEvents: [{ type: 'quest-objective-complete', questId: 'voerman_feud', objectiveId: 'meet_sisters' }] }],
  },
  therese_pragmatism: {
    id: 'therese_pragmatism', chapter: 'ASYLUM', title: 'O Preço da Ordem', location: asylum,
    narration: ['O olhar de Therese não vacila.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Previsibilidade salva mais vidas que sentimentalismo. Um domínio sem autoridade convida caçadores, Sabá e predadores incompetentes. Não confunda frieza com ausência de responsabilidade.' },
    choices: [{ id: 'investigate_therese_claim', text: 'Investigar se os fatos sustentam a justificativa', nextScene: 'free_roam', timeMinutes: 2, flags: { heardBothVoermans: true, oceanHouseUnlocked: true }, questEvents: [{ type: 'quest-objective-complete', questId: 'voerman_feud', objectiveId: 'meet_sisters' }] }],
  },
  therese_sister: {
    id: 'therese_sister', chapter: 'ASYLUM', title: 'A Irmã Irresponsável', location: asylum,
    narration: ['Therese fecha a pasta com força excessiva.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Janette chama limites de controle porque nunca suportou consequências. Ela seduz, provoca, sabota e deixa que eu recolha os cacos. Não é crueldade exigir que alguém responda pelo que faz.' },
    choices: [{ id: 'point_shared_handwriting', text: 'Observar que alguns documentos parecem escritos pela mesma pessoa', nextScene: 'therese_deflects', timeMinutes: 2 }, { id: 'investigate_sisters', text: 'Decidir verificar as duas versões no hotel', nextScene: 'free_roam', timeMinutes: 2, flags: { heardBothVoermans: true, oceanHouseUnlocked: true }, questEvents: [{ type: 'quest-objective-complete', questId: 'voerman_feud', objectiveId: 'meet_sisters' }] }],
  },
  therese_deflects: {
    id: 'therese_deflects', chapter: 'ASYLUM', title: 'Uma Semelhança Incômoda', location: asylum,
    narration: ['Por uma fração de segundo, Therese parece não reconhecer a própria assinatura.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Somos irmãs. Semelhanças são inevitáveis. Se pretende brincar de detetive, faça isso onde será útil: nos registros do Hotel Mar Atlântico.' },
    choices: [{ id: 'unlock_hotel_from_signature', text: 'Marcar o hotel no mapa e investigar a assinatura', nextScene: 'free_roam', timeMinutes: 2, flags: { heardBothVoermans: true, noticedVoermanSimilarity: true, oceanHouseUnlocked: true }, questEvents: [{ type: 'quest-objective-complete', questId: 'voerman_feud', objectiveId: 'meet_sisters' }] }],
  },
  therese_ghosts: {
    id: 'therese_ghosts', chapter: 'ASYLUM', title: 'Outros Mortos', location: asylum,
    narration: ['Therese responde como quem explica uma cláusula contratual desagradável.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Você é um cadáver que conversa e ainda pergunta se fantasmas existem? Lobisomens, espectros e coisas sem nomes dividem a noite conosco. Um objeto pessoal pode atrair ou expulsar um espírito. Preciso do pingente que ficou naquele hotel.' },
    choices: [{ id: 'accept_ghost_investigation', text: 'Marcar o Hotel Mar Atlântico no mapa', nextScene: 'free_roam', timeMinutes: 2, flags: { heardBothVoermans: true, oceanHouseUnlocked: true }, questEvents: [{ type: 'quest-objective-complete', questId: 'voerman_feud', objectiveId: 'meet_sisters' }] }],
  },
  therese_office: {
    id: 'therese_office', chapter: 'ASYLUM', title: 'A Administradora', location: asylum,
    narration: ['O escritório é austero e impecável. Mapas de imóveis cobrem a parede; vários registram sabotagens recentes atribuídas a Janette.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Minha irmã atrai clientes; minha lucidez mantém as portas abertas. Preciso remover uma presença do Hotel Mar Atlântico. Traga um objeto pessoal do espírito e talvez eu lhe diga quem está se escondendo de mim.' },
    choices: [{ id: 'hear_janette_version', text: 'Antes de aceitar, ouvir a versão de Janette', nextScene: 'janette_balcony', timeMinutes: 3 }],
  },
  janette_balcony: {
    id: 'janette_balcony', chapter: 'ASYLUM', title: 'A Outra Versão', location: asylum,
    narration: ['Janette gira um chaveiro no dedo e trata as acusações da irmã como uma piada antiga. Quando você menciona o hotel, o sorriso fica mais atento.'],
    dialogue: { speaker: 'Janette Voerman', text: 'Therese quer aquele prédio mais do que quer admitir. Vá brincar de caça-fantasmas, gatinho, mas investigue também os registros do imóvel. E se encontrar um pingente, não entregue antes de saber a quem ele pertence.' },
    choices: [{
      id: 'investigate_voerman_claims', text: 'Comparar os documentos e marcar o hotel no mapa', nextScene: 'free_roam', timeMinutes: 10,
      flags: { heardBothVoermans: true, oceanHouseUnlocked: true }, questEvents: [{ type: 'quest-objective-complete', questId: 'voerman_feud', objectiveId: 'meet_sisters' }],
    }],
  },
  ocean_house_investigation: {
    id: 'ocean_house_investigation', chapter: 'ASYLUM', title: 'Hotel Mar Atlântico',
    location: { id: 'ocean_house_sp', name: 'Hotel Mar Atlântico', district: 'Santos' },
    narration: [
      'O hotel fechado conserva marcas de incêndio e um frio que não pertence ao litoral. Recortes contam que uma mulher e a filha morreram ali; o marido foi encontrado com um machado.',
      'No quarto queimado, um pingente infantil se move sozinho sobre o assoalho. É o único objeto que parece resistir ao peso do lugar — e talvez a única coisa que Therese realmente precise.',
    ],
    choices: [{
      id: 'recover_ghost_pendant', text: 'Recolher o pingente e voltar à cidade', nextScene: 'free_roam', timeMinutes: 20,
      flags: { oceanSpiritObjectRecovered: true }, questEvents: [
        { type: 'quest-objective-complete', questId: 'voerman_feud', objectiveId: 'investigate_ocean_house' },
      ],
    }],
  },
  voerman_confrontation: {
    id: 'voerman_confrontation', chapter: 'ASYLUM', title: 'O Espelho Partido', location: asylum,
    narration: ['Therese e Janette esperam no escritório. Quando você coloca as fotografias e o pingente entre elas, as duas respondem ao mesmo tempo — e interrompem a frase no mesmo ponto.'],
    dialogue: { speaker: 'Therese e Janette', text: 'Você não tinha o direito de trazer aquilo para cá.' },
    choices: [
      { id: 'force_voerman_truce', text: 'Recusar-se a escolher um lado e exigir uma trégua', nextScene: 'voerman_truce', timeMinutes: 8, flags: { voermanTruce: true } },
      { id: 'give_pendant_therese', text: 'Entregar o pingente a Therese para exorcizar o hotel', nextScene: 'voerman_truce', timeMinutes: 5, flags: { sidedWithTherese: true } },
      { id: 'give_pendant_janette', text: 'Entregar o pingente a Janette para impedir o negócio', nextScene: 'voerman_truce', timeMinutes: 5, flags: { sidedWithJanette: true } },
    ],
  },
  voerman_truce: {
    id: 'voerman_truce', chapter: 'ASYLUM', title: 'Trégua', location: asylum,
    narration: ['A disputa não termina, mas o confronto revela que as irmãs compartilham lembranças, escrita e feridas impossíveis de separar. O conflito parece menos uma sociedade e mais uma mente em guerra consigo mesma.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Considere a questão encerrada por esta noite. O homem que procura atende por Bertram. Agora ele saberá que não pretendo caçá-lo.' },
    choices: [{
      id: 'finish_voerman_investigation', text: 'Guardar suas conclusões e deixar o Asylum', nextScene: 'free_roam', timeMinutes: 2,
      questEvents: [
        { type: 'quest-objective-complete', questId: 'voerman_feud', objectiveId: 'confront_sisters' },
        { type: 'quest-complete', questId: 'voerman_feud' },
      ],
    }],
  },
  janette_identity: {
    id: 'janette_identity', chapter: 'ASYLUM', title: 'Quem É Aquela Garota?', location: asylum,
    narration: ['Jeanette abre um sorriso que parece ensaiado para um palco e improvisado para uma armadilha.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Eu sou aquele arrepio descendo pela sua coluna quando todas as luzes se apagam. Sou o nome escrito nas paredes dos banheiros masculinos. Quando faço biquinho, o mundo inteiro tenta me fazer sorrir. E todo mundo sempre acaba perguntando: quem é aquela garota?' },
    choices: [{ id: 'ask_bertram_after_identity', text: '"Preciso encontrar Bertram."', nextScene: 'janette_bertram', timeMinutes: 2 }, { id: 'return_janette_first', text: 'Continuar a conversa', nextScene: 'janette_first', timeMinutes: 1 }],
  },
  janette_club: {
    id: 'janette_club', chapter: 'ASYLUM', title: 'Caos Certificável', location: asylum,
    narration: ['Ela abre os braços para a pista de dança, como se apresentasse uma obra de arte particularmente perigosa.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'É meu clube. Meu pedacinho de caos. Therese cuida dos contratos, das contas e de fingir que eu sou decoração. Eu cuido das pessoas que ainda sabem se divertir.' },
    choices: [{ id: 'ask_bertram_after_club', text: '"Preciso encontrar Bertram."', nextScene: 'janette_bertram', timeMinutes: 2 }, { id: 'return_janette_first_from_club', text: 'Mudar de assunto', nextScene: 'janette_first', timeMinutes: 1 }],
  },
  janette_hostile: {
    id: 'janette_hostile', chapter: 'ASYLUM', title: 'Dentes Atrás do Sorriso', location: asylum,
    narration: ['Por um instante, o sorriso desaparece. A música continua, mas parece menos acolhedora.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Jeanette. Este é meu clube. E seria melhor você aprender a brincar direito, porque posso ser extremamente divertida quando alguém não está se esforçando para me irritar.' },
    choices: [{ id: 'ask_bertram_after_hostility', text: '"Preciso encontrar Bertram."', nextScene: 'janette_bertram', timeMinutes: 2 }, { id: 'leave_asylum_after_hostility', text: 'Deixar o Asylum', nextScene: 'free_roam', timeMinutes: 1 }],
  },
  janette_bertram: {
    id: 'janette_bertram', chapter: 'ASYLUM', title: 'O Preço de uma Pista', location: asylum,
    narration: ['Ao ouvir o nome, Jeanette deixa de parecer apenas entediada. A mudança dura pouco, mas é real.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Ah... isso é complicado. Passei algumas noites com Bertram e, de repente, Therese começou a tratá-lo como se ele fosse a peste. Paranoia e Therese dividem a mesma cama há mais tempo do que consigo lembrar. Mas existe uma coisinha que você poderia fazer por nós enquanto espera.' },
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
    narration: ['Jeanette tira uma faca fina de dentro da bolsa e a deixa sobre o balcão entre vocês.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Conhece a Galeria Noir? Há um evento beneficente esta noite. Um Membro está usando a festa para criar seu próprio círculo de poder, e nós não podemos permitir isso. Vá até lá, dê alguns bons cortes nas pinturas, não seja pego e não transforme aquilo num massacre. Ah — pegue também a caixa de doações. Você estará roubando de um ladrão.' },
    choices: [{ id: 'accept_gallery_job', text: 'Aceitar a missão e pegar a faca', nextScene: 'free_roam', timeMinutes: 3, flags: { galleryNoirUnlocked: true, janetteGalleryAccepted: true }, questEvents: [{ type: 'quest-start', questId: 'voerman_feud' }, { type: 'quest-objective-complete', questId: 'voerman_feud', objectiveId: 'meet_jeanette' }] }, { id: 'ask_gallery_risk', text: '"Não quero criar inimigos."', nextScene: 'janette_gallery_risk', timeMinutes: 2 }],
  },
  janette_gallery_risk: {
    id: 'janette_gallery_risk', chapter: 'ASYLUM', title: 'Inimigos', location: asylum,
    narration: ['Jeanette dá uma risada curta, quase carinhosa.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Você ainda não precisa de mais inimigos. Espere alguns anos; eles aparecem sozinhos. Agora: museu, pinturas, faca. Depois venha me visitar. Quero ouvir todos os detalhes.' },
    choices: [{ id: 'accept_gallery_after_risk', text: 'Aceitar a missão', nextScene: 'free_roam', timeMinutes: 2, flags: { galleryNoirUnlocked: true, janetteGalleryAccepted: true }, questEvents: [{ type: 'quest-start', questId: 'voerman_feud' }, { type: 'quest-objective-complete', questId: 'voerman_feud', objectiveId: 'meet_jeanette' }] }, { id: 'leave_gallery_offer', text: 'Recusar por enquanto', nextScene: 'free_roam', timeMinutes: 1 }],
  },
  gallery_noir_infiltration: {
    id: 'gallery_noir_infiltration', chapter: 'ASYLUM', title: 'A Galeria Noir',
    location: { id: 'gallery_noir', name: 'Galeria Noir', district: 'Jardins' },
    narration: ['A Galeria Noir está cheia de taças, sorrisos treinados e quadros absurdamente caros. Políticos, empresários e colecionadores disputam espaço sob luzes brancas. A caixa de doações está perto do palco; as obras principais ficam sem vigilância por poucos segundos de cada vez.'],
    choices: [
      { id: 'sabotage_gallery_clean', text: 'Cortar as pinturas, pegar a caixa e sair sem chamar atenção', nextScene: 'free_roam', timeMinutes: 12, flags: { galleryPaintingsSlashed: true, galleryDonationBoxStolen: true, gallerySabotageResolved: true, gallerySabotageClean: true }, questEvents: [{ type: 'quest-objective-complete', questId: 'voerman_feud', objectiveId: 'sabotage_gallery' }, { type: 'quest-objective-complete', questId: 'voerman_feud', objectiveId: 'steal_donation_box' }, { type: 'quest-objective-complete', questId: 'voerman_feud', objectiveId: 'avoid_gallery_casualties' }, { type: 'quest-objective-complete', questId: 'voerman_feud', objectiveId: 'avoid_gallery_exposure' }] },
      { id: 'sabotage_gallery_seen', text: 'Cortar as pinturas e fugir antes que a segurança o detenha', nextScene: 'free_roam', timeMinutes: 10, flags: { galleryPaintingsSlashed: true, gallerySabotageResolved: true, gallerySabotageWitnessed: true }, questEvents: [{ type: 'quest-objective-complete', questId: 'voerman_feud', objectiveId: 'sabotage_gallery' }, { type: 'quest-objective-complete', questId: 'voerman_feud', objectiveId: 'avoid_gallery_casualties' }] },
      { id: 'sabotage_gallery_violent', text: 'Abrir caminho à força e destruir a exposição', nextScene: 'free_roam', timeMinutes: 8, flags: { galleryPaintingsSlashed: true, gallerySabotageResolved: true, galleryMasqueradeBreach: true }, questEvents: [{ type: 'quest-objective-complete', questId: 'voerman_feud', objectiveId: 'sabotage_gallery' }] },
    ],
  },
  janette_gallery_report: {
    id: 'janette_gallery_report', chapter: 'ASYLUM', title: 'Relatório de Vandalismo', location: asylum,
    narration: ['Jeanette encontra você antes mesmo de a porta do Asylum fechar. Os olhos dela vão para suas mãos, suas roupas e qualquer sinal de que a noite tenha dado errado.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Olha só quem voltou. Então? As pinturas sofreram? A caixa de doações encontrou um lar melhor? E, por favor, diga que você não confundiu vandalismo com uma declaração de guerra.' },
    choices: [{ id: 'report_clean_gallery', text: 'Relatar o resultado da galeria', nextScene: 'janette_gallery_resolution', timeMinutes: 3 }],
  },
  janette_gallery_resolution: {
    id: 'janette_gallery_resolution', chapter: 'ASYLUM', title: 'Uma Pista Para Bertram', location: asylum,
    narration: ['Jeanette ouve seu relato com prazer indisfarçável. Se houve discrição, ela aprova; se houve caos, ela ao menos aprecia os detalhes. Quando termina, o sorriso dela perde a leveza por um instante.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Muito bem, gatinho. A galeria vai sobreviver — o ego daquele Membro, talvez não. Quanto a Bertram: procure os túneis sob o Centro. Ele vai saber que você não veio a mando de Therese. Agora vê se não faz da cidade um incêndio antes de encontrá-lo.' },
    choices: [{ id: 'finish_gallery_job', text: 'Guardar a pista de Bertram e deixar o Asylum', nextScene: 'free_roam', timeMinutes: 2, flags: { gallerySabotageReported: true, bertramLeadUnlocked: true }, questEvents: [{ type: 'quest-objective-complete', questId: 'voerman_feud', objectiveId: 'report_to_jeanette' }, { type: 'quest-complete', questId: 'voerman_feud' }] }],
  },
  therese_gallery_confrontation: {
    id: 'therese_gallery_confrontation', chapter: 'ASYLUM', title: 'O Preço da Galeria', location: asylum,
    narration: ['Therese recebe você atrás da mesa, imóvel demais para parecer calma. A notícia da Galeria Noir chegou antes de você.'],
    dialogue: { speaker: 'Therese Voerman', text: 'A galeria. Aquele era o meu evento. Achou realmente que eu não descobriria? Você sabotou uma oportunidade de aumentar minha influência diante da Camarilla.' },
    choices: [{ id: 'blame_jeanette_gallery', text: '"Jeanette me pediu para fazer aquilo."', nextScene: 'therese_ocean_offer', timeMinutes: 3 }, { id: 'repair_gallery_damage', text: '"Quero reparar o dano."', nextScene: 'therese_ocean_offer', timeMinutes: 3 }, { id: 'deny_therese_debt', text: '"Não devo nada a você."', nextScene: 'therese_pressure', timeMinutes: 2 }],
  },
  therese_pressure: {
    id: 'therese_pressure', chapter: 'ASYLUM', title: 'Política', location: asylum,
    narration: ['Therese entrelaça os dedos e mede cada palavra antes de soltá-la.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Então não espere nada de mim, inclusive ajuda para encontrar Tung. Ele acredita que desejo matá-lo; prefiro que continue acreditando. Enquanto se esconde, não interfere nos meus negócios, e a Camarilla vê uma cidade sob controle. Isso se chama política.' },
    choices: [{ id: 'accept_therese_terms', text: 'Ouvir a proposta de Therese', nextScene: 'therese_ocean_offer', timeMinutes: 2 }, { id: 'leave_therese_pressure', text: 'Deixar o Asylum', nextScene: 'free_roam', timeMinutes: 1 }],
  },
  therese_ocean_offer: {
    id: 'therese_ocean_offer', chapter: 'ASYLUM', title: 'O Fantasma do Ocean House', location: asylum,
    narration: ['A irritação de Therese dá lugar a uma frieza prática. Um mapa do litoral já está aberto sobre a mesa.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Estou disposta a informar que minhas divergências com Tung foram esquecidas, mas quero algo em troca. O Ocean House é uma propriedade na qual pretendo investir. Há uma presença inconveniente lá. Fantasmas, lobisomens e coisas piores dividem a noite conosco. Encontre um objeto pessoal do espírito e traga-o para mim.' },
    choices: [{ id: 'ask_ocean_danger', text: '"O hotel é perigoso?"', nextScene: 'therese_ocean_danger', timeMinutes: 2 }, { id: 'accept_ocean_house', text: 'Aceitar a chave e o trabalho', nextScene: 'free_roam', timeMinutes: 3, flags: { gallerySabotageReported: true, oceanHouseUnlocked: true }, questEvents: [{ type: 'quest-objective-complete', questId: 'voerman_feud', objectiveId: 'meet_therese' }] }],
  },
  therese_ocean_danger: {
    id: 'therese_ocean_danger', chapter: 'ASYLUM', title: 'Perfeitamente Inofensivo', location: asylum,
    narration: ['Por um momento, Therese quase sorri.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Não seja ridículo. Fantasmas são perfeitamente inofensivos. Entretanto, três equipes de construção se recusaram a voltar ao prédio. Ficaram... assustadas. Esta chave abre o portão do túnel nos esgotos. Se precisar desmontar o prédio inteiro para encontrar o objeto, faça isso.' },
    choices: [{ id: 'accept_ocean_after_warning', text: 'Pegar a chave do Ocean House', nextScene: 'free_roam', timeMinutes: 2, flags: { gallerySabotageReported: true, oceanHouseUnlocked: true }, questEvents: [{ type: 'quest-objective-complete', questId: 'voerman_feud', objectiveId: 'meet_therese' }] }],
  },
  voerman_ocean_return: {
    id: 'voerman_ocean_return', chapter: 'ASYLUM', title: 'O Objeto do Espírito', location: asylum,
    narration: ['O pingente parece pesado demais para algo tão pequeno. No Asylum, tanto Jeanette quanto Therese poderiam ter motivos para desejá-lo — e para mentir sobre isso.'],
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
    id: 'janette_ocean_offer', chapter: 'ASYLUM', title: 'Um Lembrança Para o Mar', location: asylum,
    narration: ['Jeanette reconhece o pingente de imediato. O sorriso dela fica pequeno, quase triste, antes de recuperar a leveza usual.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Therese quer isso para transformar um pesadelo em investimento. Entregue para mim, gatinho. Há coisas que não devem ficar presas a uma propriedade. Eu mesma vou garantir que o oceano cuide dele.' },
    choices: [{ id: 'trust_jeanette_ocean', text: 'Entregar o objeto a Jeanette', nextScene: 'therese_ocean_betrayal', timeMinutes: 3, flags: { oceanHouseReturned: true, oceanObjectGivenToJeanette: true } }, { id: 'change_mind_therese_ocean', text: 'Mudar de ideia e entregar a Therese', nextScene: 'therese_ocean_success', timeMinutes: 2 }],
  },
  therese_ocean_betrayal: {
    id: 'therese_ocean_betrayal', chapter: 'ASYLUM', title: 'A Propriedade Inútil', location: asylum,
    narration: ['Quando Therese descobre o que aconteceu, ela se levanta tão rápido que a cadeira atinge a parede.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Você! Como pôde entregar a ela o objeto do hotel? Jeanette o jogou no Pacífico. Agora não posso remover o espírito e a propriedade tornou-se inútil. Ainda assim, se pretende corrigir esse desastre, encontre-a no Surfside Diner. Quero resolver isso antes que ela transforme mais alguém em peça do jogo.' },
    choices: [{ id: 'accept_surfside_after_betrayal', text: 'Ir ao Surfside Diner', nextScene: 'free_roam', timeMinutes: 2, flags: { surfsideMeetingUnlocked: true, thereseAngryAtPlayer: true }, questEvents: [{ type: 'quest-objective-complete', questId: 'voerman_feud', objectiveId: 'return_ocean_object' }] }],
  },
  surfside_wait_jeanette: {
    id: 'surfside_wait_jeanette', chapter: 'ASYLUM', title: 'Irmãs',
    location: { id: 'surfside_diner', name: 'Surfside Diner', district: 'Santa Monica' },
    narration: ['A cabine dos fundos fica ao lado de dois telefones públicos. Jeanette chega olhando por cima do ombro, como se esperasse que a própria sombra fosse Therese.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Therese mandou você? Ela disse que não vai me machucar? Engraçado. As últimas ameaças dela envolviam fogo e os meus lençóis de cetim.' },
    choices: [{ id: 'reassure_jeanette', text: 'Assegurar que Therese quer conversar, não atacá-la', nextScene: 'surfside_jeanette_agrees', timeMinutes: 4 }, { id: 'pressure_jeanette', text: 'Exigir que ela volte ao Asylum', nextScene: 'surfside_jeanette_agrees', timeMinutes: 3, flags: { annoyedJanette: true } }],
  },
  surfside_jeanette_agrees: {
    id: 'surfside_jeanette_agrees', chapter: 'ASYLUM', title: 'Uma Promessa Incômoda',
    location: { id: 'surfside_diner', name: 'Surfside Diner', district: 'Santa Monica' },
    narration: ['Jeanette demora a responder. Depois, encosta a mão no telefone sem usá-lo e solta o ar desnecessário de seus pulmões mortos.'],
    dialogue: { speaker: 'Jeanette Voerman', text: 'Tudo bem. Vou voltar. Mas se ela tentar me controlar, vou fazer um escândalo tão grande que a Camarilla inteira vai precisar de terapia. Diga a ela que estou indo porque sou generosa. E porque sou irmã dela.' },
    choices: [{ id: 'return_to_therese', text: 'Voltar ao Asylum e avisar Therese', nextScene: 'free_roam', timeMinutes: 2, flags: { jeanetteAgreedToMeet: true }, questEvents: [{ type: 'quest-objective-complete', questId: 'voerman_feud', objectiveId: 'reconcile_sisters' }] }],
  },
  therese_reconciliation_return: {
    id: 'therese_reconciliation_return', chapter: 'ASYLUM', title: 'A Trégua Possível', location: asylum,
    narration: ['Therese escuta em silêncio quando você diz que Jeanette vai voltar. O alívio dela é mínimo, mas existe — escondido atrás da postura impecável.'],
    dialogue: { speaker: 'Therese Voerman', text: 'Obrigada. Jeanette é minha irmã e minha cria; eu não aceitaria que algo acontecesse com ela. Quanto a Tung: a disputa está encerrada. Ele pode sair do esconderijo. Procure os túneis sob o Centro e diga que não veio a mando de Therese.' },
    choices: [{ id: 'finish_voerman_chain', text: 'Guardar a pista de Bertram e deixar o Asylum', nextScene: 'free_roam', timeMinutes: 2, flags: { voermanReconciliationResolved: true, bertramLeadUnlocked: true }, questEvents: [{ type: 'quest-objective-complete', questId: 'voerman_feud', objectiveId: 'resolve_tung_dispute' }, { type: 'quest-complete', questId: 'voerman_feud' }] }],
  },
}

export default cityNpcScenes
