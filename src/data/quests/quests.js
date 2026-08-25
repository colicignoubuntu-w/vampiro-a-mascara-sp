const quests = {
  livia_legacy: {
    id: 'livia_legacy',
    title: 'O Legado de Lívia',
    category: 'main',
    chapter: 'prologue',
    initialStatus: 'locked',

    descriptions: {
      default:
        'Lívia Vesper foi executada pela Camarilla por ter criado você sem autorização. Antes de morrer, ela deixou para trás seu apartamento e alguns pertences. Jack acredita que Lívia sabia que algo aconteceria com ela. O antigo apartamento pode ser o melhor lugar para começar.',

      reach_livia_apartment:
        'Você chegou ao apartamento de Lívia. O lugar permanece quase como ela deixou, mas cada objeto agora parece ter outro significado. Vasculhar o apartamento pode revelar por que sua criadora acreditava estar em perigo.',

      search_livia_apartment:
        'Os pertences de Lívia mostram que sua morte talvez não tenha sido tão simples quanto pareceu durante o julgamento. Entre roupas, documentos e objetos pessoais, existem sinais de que ela estava investigando algo em segredo.',

      find_livia_diary:
        'Os diários de Lívia registram preocupações que ela nunca revelou em voz alta. Há referências repetidas a desaparecimentos, hospitais de São Paulo e pessoas que ela acreditava estarem sendo observadas.',

      inspect_livia_computer:
        'O computador de Lívia contém informações fragmentadas sobre hospitais, desaparecimentos e movimentações noturnas. Algumas anotações coincidem com o que aparece nos diários. Falta descobrir o que unia todas essas pistas.',

      discover_hospital_connection:
        'Agora existe uma ligação clara entre as investigações de Lívia e uma série de desaparecimentos relacionados a hospitais da cidade. Sua execução deixou mais perguntas do que respostas.',
    },

    objectives: [
      {
        id: 'reach_livia_apartment',
        text: 'Chegar ao apartamento de Lívia.',
        required: true,
        hidden: false,
      },
      {
        id: 'search_livia_apartment',
        text: 'Vasculhar o apartamento.',
        required: true,
        hidden: false,
      },
      {
        id: 'find_livia_diary',
        text: 'Encontrar os diários de Lívia.',
        required: true,
        hidden: false,
      },
      {
        id: 'inspect_livia_computer',
        text: 'Investigar o computador.',
        required: true,
        hidden: false,
      },
      {
        id: 'discover_hospital_connection',
        text: 'Descobrir a ligação entre Lívia e os hospitais.',
        required: true,
        hidden: true,
      },
    ],

    rewards: {
      experience: 3,
      flags: {
        liviaLegacyCompleted: true,
      },
    },

    nextQuest: 'strange_hospitals',
  },

  first_hunt: {
    id: 'first_hunt',
    title: 'A Primeira Caçada',
    category: 'main',
    chapter: 'prologue',
    initialStatus: 'locked',

    descriptions: {
      default:
        'A fome é a primeira regra da nova existência. Jack pode explicar o básico, mas nenhuma explicação substitui a primeira caçada. Você precisa encontrar sangue sem chamar atenção para aquilo que se tornou.',

      find_first_victim:
        'Você encontrou alguém que pode servir de fonte de sangue. Agora precisa se aproximar sem transformar a caçada em uma cena pública.',

      approach_first_victim:
        'A vítima está ao seu alcance. O próximo passo é se alimentar e descobrir quanto controle ainda possui sobre a própria Besta.',

      feed_first_time:
        'Você finalmente provou sangue como vampiro. Sobreviver, porém, exige mais do que matar a fome: a vítima, a Máscara e sua própria Humanidade também importam.',
    },

    objectives: [
      {
        id: 'find_first_victim',
        text: 'Encontrar uma possível fonte de sangue.',
        required: true,
        hidden: false,
      },
      {
        id: 'approach_first_victim',
        text: 'Aproximar-se da vítima sem provocar uma cena.',
        required: true,
        hidden: false,
      },
      {
        id: 'feed_first_time',
        text: 'Alimentar-se pela primeira vez.',
        required: true,
        hidden: false,
      },
      {
        id: 'avoid_killing_first_victim',
        text: 'Evitar matar a vítima.',
        required: false,
        hidden: false,
      },
      {
        id: 'avoid_masquerade_breach',
        text: 'Não violar a Máscara durante a caçada.',
        required: false,
        hidden: false,
      },
    ],

    rewards: {
      experience: 2,
      flags: {
        completedFirstHunt: true,
      },
    },
  },

  strange_hospitals: {
    id: 'strange_hospitals',
    title: 'Os Mortos Não Dormem',
    category: 'main',
    chapter: 'chapter_2',
    initialStatus: 'locked',

    descriptions: {
      default:
        'As pistas deixadas por Lívia apontam para desaparecimentos ligados a hospitais e clínicas de São Paulo. O padrão é antigo demais para ser coincidência e discreto demais para ser obra de criminosos comuns.',

      learn_about_disappearances:
        'Os relatos de desaparecimento possuem elementos em comum. Algumas vítimas passaram por atendimento médico pouco antes de sumirem, e determinados nomes aparecem mais de uma vez nos registros.',

      identify_hospital:
        'Um hospital específico aparece repetidamente entre as pistas. Investigar o local durante a noite pode revelar quem está usando a instituição como cobertura.',

      investigate_hospital:
        'A investigação no hospital confirmou que existe uma operação clandestina em andamento. Pessoas são transportadas em horários irregulares e parte dos registros oficiais foi alterada.',

      discover_ambulance:
        'A ambulância suspeita é parte essencial da operação. Descobrir sua origem pode levar diretamente a quem coordena os desaparecimentos.',
    },

    objectives: [
      {
        id: 'learn_about_disappearances',
        text: 'Descobrir informações sobre os desaparecimentos.',
        required: true,
        hidden: false,
      },
      {
        id: 'identify_hospital',
        text: 'Identificar o hospital ligado aos desaparecimentos.',
        required: true,
        hidden: false,
      },
      {
        id: 'investigate_hospital',
        text: 'Investigar o hospital durante a noite.',
        required: true,
        hidden: false,
      },
      {
        id: 'discover_ambulance',
        text: 'Descobrir a origem da ambulância suspeita.',
        required: true,
        hidden: true,
      },
    ],

    rewards: {
      experience: 4,
      flags: {
        hospitalInvestigationCompleted: true,
      },
    },
  },

  vicente_information: {
    id: 'vicente_information',
    title: 'Predador Contra Predador',
    category: 'side',
    chapter: 'chapter_2',
    initialStatus: 'locked',

    descriptions: {
      default:
        'Vicente circula entre predadores e conhece movimentos da noite que poucos mortais perceberiam. Ele pode saber algo útil, mas não parece disposto a cooperar de graça.',

      find_vicente:
        'Você encontrou Vicente. Agora precisa conseguir a informação sem necessariamente transformar o encontro em uma luta.',

      get_information_from_vicente:
        'Vicente revelou parte do que sabe. A informação pode ajudar a ligar pessoas, locais e movimentações noturnas à investigação principal.',
    },

    objectives: [
      {
        id: 'find_vicente',
        text: 'Encontrar Vicente.',
        required: true,
        hidden: false,
      },
      {
        id: 'get_information_from_vicente',
        text: 'Conseguir informações de Vicente.',
        required: true,
        hidden: false,
      },
    ],

    rewards: {
      experience: 2,
      flags: {
        vicenteInformation: true,
      },
    },
  },
}

export function getQuestDefinition(
  questId
) {
  return quests[questId] ?? null
}

export function getAllQuestDefinitions() {
  return Object.values(quests)
}

export default quests