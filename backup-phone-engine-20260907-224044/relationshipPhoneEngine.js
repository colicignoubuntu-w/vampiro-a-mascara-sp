import { RELATIONSHIP_NPCS } from '../../data/npcs/relationships/index.js'
import {
  adjustRelationshipMetric,
  getRelationshipState,
  setRelationshipContact,
} from './relationshipModel'

import {
  relationshipMemoryDialogueHint,
} from './relationshipMemoryEngine'

const DAY = 1440

export const RELATIONSHIP_PHONE_ACTIONS = {
  message: 'Mensagem',
  call: 'Ligar',
  invite: 'Convidar para sair',
  help: 'Pedir ajuda',
  blood: 'Pedir sangue',
}

export function relationshipPhoneMinutes(world) {
  return (
    ((world?.day ?? 1) - 1) * DAY +
    (world?.hour ?? 0) * 60 +
    (world?.minute ?? 0)
  )
}

function addPhoneEntry(
  game,
  {
    npcId,
    sender,
    text,
    kind = 'message',
    direction = 'incoming',
    at,
  }
) {
  const currentPhone =
    game?.livelihood?.phone ?? []

  const now =
    at ??
    relationshipPhoneMinutes(
      game?.world
    )

  const entry = {
    id:
      `relationship-phone:${npcId}:${now}:${currentPhone.length}`,

    npcId,
    sender,
    text,
    kind,
    direction,
    at: now,
    read:
      direction === 'outgoing',
  }

  return {
    ...game,

    livelihood: {
      ...(game.livelihood ?? {}),
      phone: [
        ...currentPhone,
        entry,
      ],
    },
  }
}

function addMemory(
  game,
  npcId,
  {
    id,
    type,
    text,
    weight = 1,
  }
) {
  const state =
    getRelationshipState(
      game,
      npcId
    )

  if (!state) {
    return game
  }

  const at =
    relationshipPhoneMinutes(
      game.world
    )

  return {
    ...game,

    relationships: {
      ...(game.relationships ?? {}),

      [npcId]: {
        ...state,

        memories: [
          ...(state.memories ?? []),

          {
            id:
              `${id}:${at}`,

            type,
            text,
            weight,
            at,
          },
        ],
      },
    },
  }
}

function isBusy(game) {
  return Boolean(
    game?.livelihood?.active ||
    game?.livelihood?.crime ||
    game?.livelihood?.workEvent ||
    game?.flags?.humanityCheckRequired
  )
}

export function relationshipPhoneActionReason(
  game,
  npcId,
  action
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
    return 'Contato desconhecido.'
  }

  if (
    !state.contact?.known
  ) {
    return 'Você ainda não tem o número dessa pessoa.'
  }

  if (
    state.contact?.blocked
  ) {
    return 'Essa pessoa bloqueou seu contato.'
  }

  if (isBusy(game)) {
    return 'Resolva a atividade em andamento antes de usar o celular.'
  }

  const m =
    state.relationshipMetrics ?? {}

  if (
    action === 'invite' &&
    ['enemy', 'hostile'].includes(
      state.status
    )
  ) {
    return 'A relação está hostil demais para um convite casual.'
  }

  if (
    action === 'help' &&
    (
      (m.trust ?? 0) < 20 ||
      (m.anger ?? 0) >= 75
    )
  ) {
    return 'A relação ainda não tem confiança suficiente para pedir ajuda.'
  }

  if (action === 'blood') {
    const knows =
      Boolean(
        state.flags?.knowsVampire ||
        state.flags?.knowsTruth ||
        state.flags?.knowsUndead ||
        state.flags?.bloodDonor
      ) ||
      (
        state.influence
          ?.bloodBond ??
        0
      ) > 0

    if (!knows) {
      return 'Essa pessoa ainda não sabe o suficiente para entender esse pedido.'
    }

    if (
      (m.trust ?? 0) < 45 &&
      (
        state.influence
          ?.bloodBond ??
        0
      ) < 2
    ) {
      return 'Ela não confia o bastante em você para esse tipo de pedido.'
    }

    if (
      (m.safety ?? 0) < 10 &&
      (
        state.influence
          ?.bloodBond ??
        0
      ) === 0
    ) {
      return 'Ela não se sente segura o bastante com você.'
    }
  }

  return null
}

function reactionScore(state) {
  const m =
    state.relationshipMetrics ?? {}

  return (
    (m.trust ?? 0) * 0.28 +
    (m.affection ?? 0) * 0.22 +
    (m.happiness ?? 0) * 0.18 +
    (m.safety ?? 0) * 0.14 +
    (m.attraction ?? 0) * 0.08 +
    (m.dependency ?? 0) * 0.05 -
    (m.anger ?? 0) * 0.22 -
    (m.fear ?? 0) * 0.10 +
    (
      state.influence
        ?.bloodBond ??
      0
    ) * 12
  )
}

function npcReply(
  game,
  npcId,
  text,
  kind = 'message'
) {
  const npc =
    RELATIONSHIP_NPCS[npcId]

  return addPhoneEntry(
    game,
    {
      npcId,
      sender:
        npc?.name ??
        npcId,

      text,
      kind,
      direction:
        'incoming',
    }
  )
}

function playerEntry(
  game,
  npcId,
  text,
  kind = 'message'
) {
  return addPhoneEntry(
    game,
    {
      npcId,
      sender: 'Você',
      text,
      kind,
      direction:
        'outgoing',
    }
  )
}

function applyMetricPatch(
  game,
  npcId,
  patch
) {
  let next = game

  for (
    const [key, amount]
    of Object.entries(patch)
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

function nextNightAppointmentStart(
  game
) {
  const now =
    relationshipPhoneMinutes(
      game.world
    )

  const currentDay =
    Math.floor(
      now / DAY
    )

  const hour =
    game.world?.hour ?? 0

  // Se ainda é cedo na noite, permite um encontro mais tarde;
  // caso contrário marca para a noite seguinte.
  if (
    hour >= 18 &&
    hour < 21
  ) {
    return (
      currentDay * DAY +
      22 * 60 +
      30
    )
  }

  return (
    (currentDay + 1) * DAY +
    22 * 60 +
    30
  )
}

function appointmentConflict(
  game,
  start,
  end
) {
  const work =
    game?.livelihood
      ?.appointments ??
    []

  const relationship =
    game?.relationshipAppointments ??
    []

  return [
    ...work,
    ...relationship,
  ].some(
    appointment =>
      ![
        'cancelled',
        'excused',
        'missed',
      ].includes(
        appointment.status
      ) &&
      start <
        appointment.end &&
      end >
        appointment.start
  )
}

function appointmentPlace(
  game,
  npcId
) {
  const state =
    getRelationshipState(
      game,
      npcId
    )

  const npc =
    RELATIONSHIP_NPCS[npcId]

  const scene =
    npc
      ?.scenes
      ?.[state?.node]

  return (
    scene?.place ??
    npc?.role ??
    'São Paulo'
  )
}

function createRelationshipAppointment(
  game,
  npcId
) {
  const npc =
    RELATIONSHIP_NPCS[npcId]

  let start =
    nextNightAppointmentStart(
      game
    )

  let end =
    start + 120

  // Se houver conflito, tenta até sete noites seguintes.
  for (
    let attempt = 0;
    attempt < 7;
    attempt += 1
  ) {
    if (
      !appointmentConflict(
        game,
        start,
        end
      )
    ) {
      break
    }

    start += DAY
    end += DAY
  }

  if (
    appointmentConflict(
      game,
      start,
      end
    )
  ) {
    return {
      game,
      appointment: null,
    }
  }

  const appointment = {
    id:
      `relationship:${npcId}:${start}`,

    npcId,
    type:
      'relationship',

    title:
      `Encontrar ${npc.name}`,

    place:
      appointmentPlace(
        game,
        npcId
      ),

    start,
    end,

    status:
      'scheduled',
  }

  return {
    game: {
      ...game,

      relationshipAppointments: [
        ...(
          game
            .relationshipAppointments ??
          []
        ),
        appointment,
      ],
    },

    appointment,
  }
}

export function sendRelationshipMessage(
  input,
  npcId
) {
  const reason =
    relationshipPhoneActionReason(
      input,
      npcId,
      'message'
    )

  if (reason) {
    throw new Error(reason)
  }

  const state =
    getRelationshipState(
      input,
      npcId
    )

  const score =
    reactionScore(
      state
    )

  let game =
    playerEntry(
      input,
      npcId,
      'Oi. Está acordada?'
    )

  if (
    (state.relationshipMetrics?.anger ?? 0) >= 75
  ) {
    game =
      npcReply(
        game,
        npcId,
        'Estou. Mas não quero conversar agora.'
      )
  } else if (
    score >= 55
  ) {
    game =
      npcReply(
        game,
        npcId,
        'Estou. Pensei em você hoje. O que aconteceu?'
      )

    game =
      applyMetricPatch(
        game,
        npcId,
        {
          happiness: 2,
          affection: 1,
        }
      )
  } else if (
    score >= 15
  ) {
    game =
      npcReply(
        game,
        npcId,
        'Estou. Tudo bem por aí?'
      )
  } else {
    game =
      npcReply(
        game,
        npcId,
        'Vi sua mensagem. Fala.'
      )
  }

  return addMemory(
    game,
    npcId,
    {
      id:
        'phone-message',

      type:
        'contact',

      text:
        'Vocês trocaram mensagens.',

      weight: 1,
    }
  )
}

export function callRelationshipContact(
  input,
  npcId
) {
  const reason =
    relationshipPhoneActionReason(
      input,
      npcId,
      'call'
    )

  if (reason) {
    throw new Error(reason)
  }

  const state =
    getRelationshipState(
      input,
      npcId
    )

  const score =
    reactionScore(
      state
    )

  let game =
    playerEntry(
      input,
      npcId,
      'Ligação realizada.',
      'call'
    )

  if (
    (state.relationshipMetrics?.anger ?? 0) >= 80
  ) {
    game =
      npcReply(
        game,
        npcId,
        'Ligação recusada.',
        'call'
      )
  } else if (
    score >= 30
  ) {
    game =
      npcReply(
        game,
        npcId,
        'Ela atendeu. Vocês conversaram por alguns minutos.',
        'call'
      )

    game =
      applyMetricPatch(
        game,
        npcId,
        {
          trust: 1,
          happiness: 1,
        }
      )
  } else {
    game =
      npcReply(
        game,
        npcId,
        'Ela atendeu, mas a conversa foi curta.',
        'call'
      )
  }

  return addMemory(
    game,
    npcId,
    {
      id:
        'phone-call',

      type:
        'contact',

      text:
        'Vocês conversaram por telefone.',

      weight: 1,
    }
  )
}

export function inviteRelationshipContact(
  input,
  npcId
) {
  const reason =
    relationshipPhoneActionReason(
      input,
      npcId,
      'invite'
    )

  if (reason) {
    throw new Error(reason)
  }

  const state =
    getRelationshipState(
      input,
      npcId
    )

  const score =
    reactionScore(
      state
    )

  let game =
    playerEntry(
      input,
      npcId,
      'Quer sair comigo uma noite dessas?'
    )

  if (
    (state.relationshipMetrics?.anger ?? 0) >= 70
  ) {
    game =
      npcReply(
        game,
        npcId,
        'Agora não. Eu ainda estou com raiva de você.'
      )

    return addMemory(
      game,
      npcId,
      {
        id:
          'invite-refused-angry',

        type:
          'rejection',

        text:
          'Ela recusou um convite porque ainda estava com raiva.',

        weight: 4,
      }
    )
  }

  if (
    score < 0
  ) {
    game =
      npcReply(
        game,
        npcId,
        'Acho melhor não.'
      )

    return addMemory(
      game,
      npcId,
      {
        id:
          'invite-refused',

        type:
          'rejection',

        text:
          'Ela recusou um convite para sair.',

        weight: 2,
      }
    )
  }

  const result =
    createRelationshipAppointment(
      game,
      npcId
    )

  if (
    !result.appointment
  ) {
    return npcReply(
      game,
      npcId,
      'Quero, mas nossas agendas estão péssimas. A gente combina depois.'
    )
  }

  game =
    result.game

  const day =
    Math.floor(
      result.appointment.start /
      DAY
    ) + 1

  const time =
    result.appointment.start %
    DAY

  const hour =
    String(
      Math.floor(
        time / 60
      )
    ).padStart(
      2,
      '0'
    )

  const minute =
    String(
      time % 60
    ).padStart(
      2,
      '0'
    )

  game =
    npcReply(
      game,
      npcId,
      `Fechado. Dia ${day}, às ${hour}:${minute}.`
    )

  game =
    applyMetricPatch(
      game,
      npcId,
      {
        happiness:
          score >= 45
            ? 4
            : 2,

        affection:
          score >= 45
            ? 2
            : 1,
      }
    )

  return addMemory(
    game,
    npcId,
    {
      id:
        'date-scheduled',

      type:
        'positive',

      text:
        'Vocês marcaram um encontro pelo celular.',

      weight: 3,
    }
  )
}

export function askRelationshipHelp(
  input,
  npcId
) {
  const reason =
    relationshipPhoneActionReason(
      input,
      npcId,
      'help'
    )

  if (reason) {
    throw new Error(reason)
  }

  const state =
    getRelationshipState(
      input,
      npcId
    )

  const score =
    reactionScore(
      state
    )

  let game =
    playerEntry(
      input,
      npcId,
      'Preciso de uma ajuda. Posso contar com você?'
    )

  if (
    score >= 35
  ) {
    game =
      npcReply(
        game,
        npcId,
        'Pode. Me explica o que você precisa.'
      )

    game =
      applyMetricPatch(
        game,
        npcId,
        {
          trust: 1,
          dependency: 1,
        }
      )
  } else {
    game =
      npcReply(
        game,
        npcId,
        'Depende do que você está me pedindo.'
      )
  }

  return addMemory(
    game,
    npcId,
    {
      id:
        'asked-for-help',

      type:
        'request',

      text:
        'Você pediu ajuda pelo telefone.',

      weight: 2,
    }
  )
}

export function askRelationshipBlood(
  input,
  npcId
) {
  const reason =
    relationshipPhoneActionReason(
      input,
      npcId,
      'blood'
    )

  if (reason) {
    throw new Error(reason)
  }

  const state =
    getRelationshipState(
      input,
      npcId
    )

  const m =
    state.relationshipMetrics ??
    {}

  const bond =
    state.influence
      ?.bloodBond ??
    0

  let game =
    playerEntry(
      input,
      npcId,
      'Estou com fome. Preciso de sangue.'
    )

  const freely =
    (m.trust ?? 0) >= 65 &&
    (m.safety ?? 0) >= 40 &&
    (m.happiness ?? 0) >= -10 &&
    (m.anger ?? 0) < 45

  if (freely) {
    game =
      npcReply(
        game,
        npcId,
        'Está bem. Mas venha conversar comigo antes. Eu quero saber que você está no controle.'
      )

    game =
      applyMetricPatch(
        game,
        npcId,
        {
          trust: 1,
          safety: 1,
          happiness: -1,
        }
      )

    game =
      addMemory(
        game,
        npcId,
        {
          id:
            'blood-request-consented',

          type:
            'intimacy',

          text:
            'Ela aceitou conversar sobre doar sangue por vontade própria.',

          weight: 5,
        }
      )
  } else if (
    bond >= 2 ||
    (m.dependency ?? 0) >= 70
  ) {
    game =
      npcReply(
        game,
        npcId,
        '...Está bem. Onde você quer que eu vá?'
      )

    game =
      applyMetricPatch(
        game,
        npcId,
        {
          happiness: -4,
          safety: -5,
          fear: 2,
          dependency: 3,
        }
      )

    game =
      addMemory(
        game,
        npcId,
        {
          id:
            'blood-request-dependent',

          type:
            'coercive-dependency',

          text:
            'Ela aceitou um pedido de sangue enquanto havia dependência ou influência sobrenatural.',

          weight: 8,
        }
      )
  } else {
    game =
      npcReply(
        game,
        npcId,
        'Não. Hoje não.'
      )

    game =
      addMemory(
        game,
        npcId,
        {
          id:
            'blood-request-refused',

          type:
            'boundary',

          text:
            'Ela recusou um pedido de sangue.',

          weight: 4,
        }
      )
  }

  return game
}

export function performRelationshipPhoneAction(
  game,
  npcId,
  action
) {
  switch (action) {
    case 'message':
      return sendRelationshipMessage(
        game,
        npcId
      )

    case 'call':
      return callRelationshipContact(
        game,
        npcId
      )

    case 'invite':
      return inviteRelationshipContact(
        game,
        npcId
      )

    case 'help':
      return askRelationshipHelp(
        game,
        npcId
      )

    case 'blood':
      return askRelationshipBlood(
        game,
        npcId
      )

    default:
      throw new Error(
        'Ação de telefone desconhecida.'
      )
  }
}

export function dismissRelationshipAppointment(
  game,
  appointmentId
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
              status:
                'cancelled',
            }
          : appointment
    ),
  }
}

export function markRelationshipAppointmentDone(
  game,
  appointmentId
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
              status:
                'completed',
            }
          : appointment
    ),
  }
}

// Gancho simples para futuros eventos automáticos.
// Pode ser chamado sempre que o relógio avança.
export function reconcileRelationshipPhone(
  game
) {
  if (!game) {
    return game
  }

  const now =
    relationshipPhoneMinutes(
      game.world
    )

  const appointments =
    game
      .relationshipAppointments ??
    []

  let next = {
    ...game,

    relationshipAppointments:
      appointments.map(
        appointment => {
          if (
            appointment.status ===
              'scheduled' &&
            now >
              appointment.end
          ) {
            return {
              ...appointment,
              status:
                'missed',
            }
          }

          return appointment
        }
      ),
  }

  // Mensagem automática apenas uma vez quando um encontro é perdido.
  for (
    const appointment
    of next.relationshipAppointments
  ) {
    if (
      appointment.status !==
      'missed'
    ) {
      continue
    }

    const marker =
      `missed-appointment:${appointment.id}`

    if (
      next
        .flags
        ?.[marker]
    ) {
      continue
    }

    const npc =
      RELATIONSHIP_NPCS[
        appointment.npcId
      ]

    if (!npc) {
      continue
    }

    next =
      npcReply(
        next,
        appointment.npcId,
        'Você não apareceu. Eu fiquei esperando.'
      )

    next =
      applyMetricPatch(
        next,
        appointment.npcId,
        {
          trust: -8,
          happiness: -12,
          anger: 12,
          safety: -5,
        }
      )

    next =
      addMemory(
        next,
        appointment.npcId,
        {
          id:
            'stood-up',

          type:
            'betrayal',

          text:
            'Você marcou um encontro e não apareceu.',

          weight: 10,
        }
      )

    next = {
      ...next,

      flags: {
        ...(next.flags ?? {}),

        [marker]:
          true,
      },
    }
  }

  const calendarDay =
    game.world?.day ?? 1

  const hour =
    game.world?.hour ?? 0

  // Iniciativa simples e determinística:
  // no máximo uma mensagem espontânea por NPC por dia,
  // apenas depois das 21h.
  if (hour >= 21) {
    for (
      const npcId
      of Object.keys(
        RELATIONSHIP_NPCS
      )
    ) {
      const state =
        getRelationshipState(
          next,
          npcId
        )

      if (
        !state?.contact?.known ||
        state.contact.blocked
      ) {
        continue
      }

      const marker =
        `relationship-initiative:${npcId}:${calendarDay}`

      if (
        next.flags?.[marker]
      ) {
        continue
      }

      const metrics =
        state.relationshipMetrics ??
        {}

      const closeEnough =
        [
          'friendship',
          'intimate',
          'dating',
        ].includes(
          state.status
        ) ||
        (metrics.affection ?? 0) >= 55 ||
        (metrics.trust ?? 0) >= 60

      const upset =
        (metrics.anger ?? 0) >= 65 ||
        (
          (metrics.happiness ?? 0) <= -45 &&
          (metrics.affection ?? 0) >= 35
        )

      if (
        !closeEnough &&
        !upset
      ) {
        continue
      }

      let message = null

      if (
        (metrics.anger ?? 0) >= 75
      ) {
        message =
          'A gente precisa conversar. Não vou fingir que está tudo bem.'
      } else if (
        (metrics.happiness ?? 0) <= -50 &&
        (metrics.affection ?? 0) >= 40
      ) {
        message =
          'Eu ainda me importo com você. É justamente por isso que isso está me machucando.'
      } else if (
        state.status === 'dating' &&
        (metrics.affection ?? 0) >= 70
      ) {
        message =
          'Você vai aparecer hoje? Queria te ver.'
      } else if (
        (metrics.trust ?? 0) >= 70
      ) {
        message =
          'Está tudo bem por aí? Você sumiu.'
      } else if (
        closeEnough
      ) {
        message =
          'Oi. Está acordado?'
      }

      if (!message) {
        continue
      }

      next =
        npcReply(
          next,
          npcId,
          message
        )

      next = {
        ...next,

        flags: {
          ...(next.flags ?? {}),
          [marker]: true,
        },
      }
    }
  }

  return next
}

export function grantRelationshipContact(
  game,
  npcId,
  number = null
) {
  return setRelationshipContact(
    game,
    npcId,
    {
      known: true,
      number,
      blocked: false,
    }
  )
}
