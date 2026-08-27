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
      'Janette Voerman surge entre a fumaça artificial antes que você consiga procurar qualquer outra pessoa. Vestida de vermelho e preto, ela recebe você como se já estivesse esperando. No andar superior, uma porta de vidro fosco leva ao escritório de sua irmã, Therese.',
    ],
    dialogue: { speaker: 'Janette Voerman', text: 'O que temos aqui? Uma coisinha deliciosa, recém-saída da vida e entrando na minha boate. Eu sou Janette. Therese é minha irmã — e vai garantir que você ouça o título completo dela depois.' },
    choices: [
      { id: 'meet_janette', text: 'Conversar com Janette sobre o Asylum e sua irmã', nextScene: 'janette_first', timeMinutes: 2, questEvents: [{ type: 'quest-start', questId: 'voerman_feud' }] },
      { id: 'leave_asylum', text: 'Voltar às ruas', nextScene: 'free_roam', timeMinutes: 1 },
    ],
  },
  janette_first: {
    id: 'janette_first', chapter: 'ASYLUM', title: 'Caos Certificável', location: asylum,
    narration: ['Janette recebe você como uma novidade deliciosa e descreve a irmã como uma tirana obcecada por respeitabilidade. Por trás das provocações, conhece cada funcionário e cada rumor do salão.'],
    dialogue: { speaker: 'Janette Voerman', text: 'Este pequeno caos gótico é metade meu. Minha irmã Therese cuida dos contratos, das contas e de fingir que eu sou apenas decoração. Vá ouvir a majestade dela e depois volte; quero saber qual mentira pareceu mais bonita.' },
    choices: [
      { id: 'ask_janette_asylum', text: '"O que o Asylum significa para você?"', nextScene: 'janette_asylum', timeMinutes: 3 },
      { id: 'ask_janette_therese', text: '"Por que você e Therese se odeiam?"', nextScene: 'janette_sister', timeMinutes: 3 },
      { id: 'flirt_with_janette', text: 'Entrar no jogo de sedução de Janette', nextScene: 'janette_flirt', timeMinutes: 3, flags: { flirtedWithJanette: true } },
      { id: 'meet_therese_after_janette', text: 'Ouvir Therese antes de tirar conclusões', nextScene: 'therese_after_janette', timeMinutes: 3 },
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
      'Nos registros de compra, a mesma assinatura aparece ora como Therese, ora como Janette. A caligrafia é idêntica. No quarto queimado, um pingente infantil se move sozinho sobre o assoalho.',
    ],
    choices: [{
      id: 'recover_ghost_pendant', text: 'Recolher o pingente, fotografar os documentos e voltar à cidade', nextScene: 'free_roam', timeMinutes: 20,
      flags: { voermanHandwritingMatch: true, ghostPendantRecovered: true }, questEvents: [
        { type: 'quest-objective-complete', questId: 'voerman_feud', objectiveId: 'investigate_hotel' },
        { type: 'quest-objective-complete', questId: 'voerman_feud', objectiveId: 'recover_pendant' },
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
}

export default cityNpcScenes
