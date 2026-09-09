import { RELATIONSHIP_NPCS } from '../../data/npcs/relationships/index.js'
import {
  adjustRelationshipMetric,
  getRelationshipState,
} from '../relationships/relationshipModel'
import {
  relationshipPhoneMinutes,
} from '../relationships/relationshipPhoneEngine'

export const ULTIMO_GOLE_AREAS = {
  main: {
    id: 'main',
    name: 'Salão principal',
    subtitle: 'Mesas, balcão e pista',
    background:
      '/images/locations/ultimo-gole/main.jpg',
    description:
      'O salão principal do Último Gole é estreito e comprido, tomado por mesas pequenas, jaquetas penduradas nas cadeiras e gente em pé onde já não cabe mais ninguém sentado. A música cobre boa parte das conversas. Ao fundo, o palco recebe equipamentos e cabos; perto do balcão, Duda acompanha pedidos e observa discretamente o movimento.',
    exits: [
      'stage',
      'bar',
      'stairs',
    ],
  },

  stage: {
    id: 'stage',
    name: 'Perto do palco',
    subtitle: 'Grade e lateral do palco',
    background:
      '/images/locations/ultimo-gole/stage.jpg',
    description:
      'Perto da grade o volume deixa de ser apenas música e vira vibração no peito. Fotógrafos se espremem nas laterais, músicos atravessam a cortina e clientes disputam os poucos espaços com visão limpa do palco. É onde Clara costuma trabalhar quando há show.',
    exits: [
      'main',
      'vip',
    ],
  },

  bar: {
    id: 'bar',
    name: 'Balcão',
    subtitle: 'Bebidas e conversas curtas',
    background:
      '/images/locations/ultimo-gole/bar.jpg',
    description:
      'O balcão corre por uma das paredes do salão. Garrafas ocupam prateleiras iluminadas por lâmpadas fracas e pedidos são gritados entre uma música e outra. Duda trabalha daqui e percebe mais do que demonstra.',
    exits: [
      'main',
      'stairs',
    ],
  },

  vip: {
    id: 'vip',
    name: 'Área VIP',
    subtitle: 'Camarote reservado',
    background:
      '/images/locations/ultimo-gole/vip.jpg',
    description:
      'Uma área elevada acompanha parte do palco. O som chega menos agressivo, há sofás gastos e mesas que não ficam disponíveis para qualquer cliente. Músicos, produtores, convidados de Caroline e alguns rostos recorrentes da noite passam por aqui.',
    exits: [
      'stage',
      'stairs',
    ],
  },

  stairs: {
    id: 'stairs',
    name: 'Escadas dos fundos',
    subtitle: 'Corredor de serviço',
    background:
      '/images/locations/ultimo-gole/stairs.jpg',
    description:
      'Uma porta próxima aos banheiros leva a um corredor de serviço e a uma escada estreita. Para cima fica a área reservada. Para baixo, a iluminação piora e uma segunda porta separa o bar público de uma parte que a maioria dos clientes nunca vê.',
    exits: [
      'main',
      'bar',
      'vip',
      'basement',
    ],
  },

  basement: {
    id: 'basement',
    name: 'Porão',
    subtitle: 'Área reservada aos Membros',
    background:
      '/images/locations/ultimo-gole/basement.jpg',
    description:
      'O porão não tenta parecer uma extensão do bar. As paredes de concreto permanecem expostas, o teto é baixo e o som do palco chega como uma pulsação distante. Há uma mesa grande, armários trancados, um refrigerador industrial e portas que levam a depósitos menores. Aqui, ninguém precisa fingir que certas conversas são humanas.',
    exits: [
      'stairs',
    ],
    vampireOnly: true,
  },
}

export function getUltimoGoleArea(areaId) {
  return (
    ULTIMO_GOLE_AREAS[
      areaId
    ] ??
    ULTIMO_GOLE_AREAS.main
  )
}

export function canEnterUltimoGoleArea(
  game,
  areaId
) {
  const area =
    getUltimoGoleArea(
      areaId
    )

  if (
    area.vampireOnly &&
    !game?.vampire &&
    !game?.vampireState &&
    !game?.blood
  ) {
    return {
      allowed: false,
      reason:
        'A porta permanece fechada. Essa área não é aberta ao público.',
    }
  }

  return {
    allowed: true,
    reason: null,
  }
}

export function currentRelationshipAppointmentsAtUltimoGole(
  game
) {
  const now =
    relationshipPhoneMinutes(
      game?.world
    )

  return (
    game
      ?.relationshipAppointments ??
    []
  ).filter(
    appointment =>
      appointment.status ===
        'scheduled' &&
      now >=
        appointment.start -
          30 &&
      now <=
        appointment.end &&
      (
        String(
          appointment.place ??
          ''
        )
          .toLowerCase()
          .includes(
            'último gole'
          ) ||
        String(
          appointment.place ??
          ''
        )
          .toLowerCase()
          .includes(
            'ultimo gole'
          ) ||
        appointment.locationId ===
          'ultimo_gole'
      )
  )
}

export function getUltimoGolePresentRelationships(
  game,
  areaId
) {
  const appointments =
    currentRelationshipAppointmentsAtUltimoGole(
      game
    )

  return appointments
    .map(
      appointment => {
        const npc =
          RELATIONSHIP_NPCS[
            appointment.npcId
          ]

        if (!npc) {
          return null
        }

        const preferredArea =
          appointment.areaId ??
          (
            appointment.npcId ===
              'clara'
              ? 'stage'
              : 'main'
          )

        if (
          areaId !==
          preferredArea
        ) {
          return null
        }

        return {
          npcId:
            appointment.npcId,

          appointment,
          npc,
        }
      }
    )
    .filter(Boolean)
}

function updateAppointment(
  game,
  appointmentId,
  patch
) {
  return {
    ...game,

    relationshipAppointments: (
      game
        .relationshipAppointments ??
      []
    ).map(
      appointment =>
        appointment.id ===
        appointmentId
          ? {
              ...appointment,
              ...patch,
            }
          : appointment
    ),
  }
}

export function beginUltimoGoleMeeting(
  game,
  npcId,
  appointmentId
) {
  const state =
    getRelationshipState(
      game,
      npcId
    )

  const npc =
    RELATIONSHIP_NPCS[
      npcId
    ]

  if (
    !state ||
    !npc
  ) {
    return {
      game,
      encounter: null,
    }
  }

  const metrics =
    state.relationshipMetrics ??
    {}

  let line

  if (
    (metrics.anger ?? 0) >=
    70
  ) {
    line =
      'Ela já está ali quando você se aproxima. Guarda o celular e olha para você sem sorrir. “Você veio.”'
  } else if (
    state.status ===
      'dating' &&
    (metrics.affection ?? 0) >=
      60
  ) {
    line =
      'Ela percebe você entre as pessoas antes que você chegue perto. O rosto relaxa num sorriso discreto. “Achei que você ia chegar mais tarde.”'
  } else if (
    (metrics.trust ?? 0) >=
    45
  ) {
    line =
      'Ela interrompe o que estava fazendo quando percebe você. “Oi. Você conseguiu chegar.”'
  } else {
    line =
      'Ela reconhece você e se aproxima alguns passos. “Oi.”'
  }

  const updated =
    updateAppointment(
      game,
      appointmentId,
      {
        status:
          'arrived',
        arrivedAt:
          relationshipPhoneMinutes(
            game.world
          ),
      }
    )

  return {
    game: updated,

    encounter: {
      npcId,
      appointmentId,
      speaker:
        npc.name,
      portrait:
        npc.portrait,
      line,

      choices: [
        {
          id: 'how_are_you',
          text:
            'Perguntar como ela está.',
        },
        {
          id: 'find_table',
          text:
            'Procurar um lugar mais tranquilo para conversar.',
        },
        {
          id: 'show',
          text:
            'Ficar perto do palco com ela.',
        },
        {
          id: 'just_talk',
          text:
            'Só conversar um pouco.',
        },
        {
          id: 'end',
          text:
            'Encerrar o encontro mais cedo.',
        },
      ],
    },
  }
}

function applyMetricPatch(
  game,
  npcId,
  patch
) {
  let next =
    game

  for (
    const [
      key,
      amount,
    ]
    of Object.entries(
      patch
    )
  ) {
    next =
      adjustRelationshipMetric(
        next,
        npcId,
        key,
        amount
      )
  }

  return next
}

export function resolveUltimoGoleMeetingChoice(
  game,
  encounter,
  choiceId
) {
  if (
    !encounter
  ) {
    return {
      game,
      encounter: null,
    }
  }

  const npcId =
    encounter.npcId

  const state =
    getRelationshipState(
      game,
      npcId
    )

  const npc =
    RELATIONSHIP_NPCS[
      npcId
    ]

  const metrics =
    state
      ?.relationshipMetrics ??
    {}

  let next =
    game

  let line =
    ''

  let areaId =
    null

  let finished =
    false

  switch (
    choiceId
  ) {
    case 'how_are_you':
      if (
        (metrics.anger ?? 0) >=
        65
      ) {
        line =
          '“Você quer a resposta curta ou a verdadeira?” Ela cruza os braços. “Porque eu ainda estou tentando decidir o que fazer com algumas coisas.”'
      } else if (
        (metrics.happiness ?? 0) <=
          -40 &&
        (metrics.affection ?? 0) >=
          35
      ) {
        line =
          'Ela demora um pouco antes de responder. “Eu não estou muito bem. Mas não queria cancelar.”'
      } else {
        line =
          '“Estou bem.” Ela olha para o palco por um instante. “Foi uma noite corrida. Agora melhorou um pouco.”'
      }

      next =
        applyMetricPatch(
          next,
          npcId,
          {
            trust: 1,
            happiness: 1,
          }
        )
      break

    case 'find_table':
      line =
        'Vocês procuram uma mesa menos exposta ao som do palco. A conversa deixa de competir com os amplificadores e passa a ocupar o espaço entre vocês.'

      areaId =
        'vip'

      next =
        applyMetricPatch(
          next,
          npcId,
          {
            trust: 2,
            happiness: 2,
          }
        )
      break

    case 'show':
      line =
        'Vocês ficam próximos à lateral do palco. Em alguns momentos não há como conversar; resta observar a banda, trocar comentários curtos e dividir o mesmo silêncio.'

      areaId =
        'stage'

      next =
        applyMetricPatch(
          next,
          npcId,
          {
            affection: 2,
            happiness: 3,
          }
        )
      break

    case 'just_talk':
      line =
        'A conversa não precisa de assunto importante. Trabalho, música, lugares da cidade e pequenas histórias ocupam alguns minutos. É justamente a falta de urgência que torna o momento diferente.'

      next =
        applyMetricPatch(
          next,
          npcId,
          {
            affection: 1,
            trust: 1,
            happiness: 2,
          }
        )
      break

    case 'end':
      line =
        (metrics.affection ?? 0) >=
          55
          ? '“Tudo bem.” Ela parece um pouco decepcionada, mas não insiste. “Me avisa quando chegar.”'
          : '“Tudo bem. A gente se fala.”'

      next =
        applyMetricPatch(
          next,
          npcId,
          {
            happiness: -2,
          }
        )

      finished =
        true
      break

    default:
      line =
        'A conversa continua por mais alguns minutos.'
  }

  if (
    finished
  ) {
    next =
      updateAppointment(
        next,
        encounter
          .appointmentId,
        {
          status:
            'completed',
          completedAt:
            relationshipPhoneMinutes(
              next.world
            ),
        }
      )
  }

  return {
    game:
      next,

    areaId,

    encounter: {
      ...encounter,
      line,
      choices:
        finished
          ? []
          : encounter.choices,
      finished,
    },
  }
}
