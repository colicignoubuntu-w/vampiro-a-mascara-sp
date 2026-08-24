const statusDefinitions = {
  alcoholLight: {
    id: 'alcoholLight',

    name: 'Efeito leve de álcool',

    durationMinutes: 30,

    modifiers: {
      social: 0,
      dexterity: -1,
      perception: -1,
    },
  },

  alcoholHeavy: {
    id: 'alcoholHeavy',

    name: 'Embriaguez pelo sangue',

    durationMinutes: 60,

    modifiers: {
      social: -1,
      dexterity: -2,
      perception: -1,
      wits: -1,
    },
  },

  stimulantBlood: {
    id: 'stimulantBlood',

    name: 'Estimulante no sangue',

    durationMinutes: 45,

    modifiers: {
      wits: 1,
      dexterity: 1,
      social: -1,
    },
  },

  sedativeBlood: {
    id: 'sedativeBlood',

    name: 'Sedativo no sangue',

    durationMinutes: 60,

    modifiers: {
      wits: -2,
      dexterity: -2,
      perception: -1,
    },
  },

  hallucinogenBlood: {
    id: 'hallucinogenBlood',

    name: 'Alucinógeno no sangue',

    durationMinutes: 50,

    modifiers: {
      perception: -2,
      wits: -1,
      social: -1,
    },
  },

  bloodbornePathogen: {
    id: 'bloodbornePathogen',

    name: 'Contaminação sanguínea',

    durationMinutes: 180,

    modifiers: {
      stamina: -1,
    },
  },
}

/* ==========================================
   CONVERTE O HORÁRIO DO JOGO EM MINUTOS

   Isso permite calcular quanto tempo
   falta para um efeito desaparecer.
========================================== */

function worldToMinutes(world) {
  const night =
    Number(
      world?.night ?? 1
    )

  const hour =
    Number(
      world?.hour ?? 0
    )

  const minute =
    Number(
      world?.minute ?? 0
    )

  return (
    (night - 1) * 24 * 60 +
    hour * 60 +
    minute
  )
}

/* ==========================================
   APLICAR STATUS
========================================== */

export function applyStatus(
  game,
  statusId
) {
  const definition =
    statusDefinitions[
      statusId
    ]

  if (!definition) {
    console.warn(
      `Status inexistente: ${statusId}`
    )

    return game
  }

  const currentStatuses =
    Array.isArray(
      game?.statuses
    )
      ? game.statuses
      : []

  const now =
    worldToMinutes(
      game?.world
    )

  const expiresAt =
    definition.durationMinutes ===
    null
      ? null
      : now +
        definition.durationMinutes

  const alreadyExists =
    currentStatuses.some(
      (status) =>
        status.id ===
        statusId
    )

  /*
    Se o personagem receber novamente
    o mesmo efeito, renovamos a duração.
  */

  if (alreadyExists) {
    const refreshedStatuses =
      currentStatuses.map(
        (status) => {
          if (
            status.id !==
            statusId
          ) {
            return status
          }

          return {
            ...definition,

            appliedAt:
              now,

            expiresAt,
          }
        }
      )

    return {
      ...game,

      statuses:
        refreshedStatuses,
    }
  }

  return {
    ...game,

    statuses: [
      ...currentStatuses,

      {
        ...definition,

        appliedAt:
          now,

        expiresAt,
      },
    ],
  }
}

/* ==========================================
   REMOVER STATUS EXPIRADOS

   ESTA É A FUNÇÃO QUE ESTAVA FALTANDO
   NO ERRO DO NAVEGADOR.
========================================== */

export function removeExpiredStatuses(
  game
) {
  if (!game) {
    return game
  }

  const currentStatuses =
    Array.isArray(
      game.statuses
    )
      ? game.statuses
      : []

  if (
    currentStatuses.length ===
    0
  ) {
    return game
  }

  const now =
    worldToMinutes(
      game.world
    )

  const activeStatuses =
    currentStatuses.filter(
      (status) => {
        /*
          Status sem expiresAt
          fica ativo permanentemente.
        */

        if (
          status.expiresAt ===
          null ||
          status.expiresAt ===
          undefined
        ) {
          return true
        }

        return (
          status.expiresAt >
          now
        )
      }
    )

  /*
    Se nada expirou, devolvemos
    exatamente o mesmo objeto.

    Isso também evita renderizações
    desnecessárias no React.
  */

  if (
    activeStatuses.length ===
    currentStatuses.length
  ) {
    return game
  }

  return {
    ...game,

    statuses:
      activeStatuses,
  }
}

/* ==========================================
   PEGAR MODIFICADOR TOTAL
========================================== */

export function getStatusModifier(
  game,
  type
) {
  const statuses =
    Array.isArray(
      game?.statuses
    )
      ? game.statuses
      : []

  return statuses.reduce(
    (
      total,
      status
    ) => {
      const modifier =
        status?.modifiers?.[
          type
        ] ?? 0

      return (
        total +
        modifier
      )
    },
    0
  )
}

/* ==========================================
   VERIFICAR STATUS
========================================== */

export function hasStatus(
  game,
  statusId
) {
  const statuses =
    Array.isArray(
      game?.statuses
    )
      ? game.statuses
      : []

  return statuses.some(
    (status) =>
      status.id ===
      statusId
  )
}

/* ==========================================
   TEMPO RESTANTE
========================================== */

export function getStatusTimeRemaining(
  game,
  status
) {
  if (!status) {
    return 0
  }

  if (
    status.expiresAt ===
    null ||
    status.expiresAt ===
    undefined
  ) {
    return null
  }

  const now =
    worldToMinutes(
      game?.world
    )

  return Math.max(
    0,
    status.expiresAt -
      now
  )
}

/* ==========================================
   REMOVER STATUS MANUALMENTE
========================================== */

export function removeStatus(
  game,
  statusId
) {
  const statuses =
    Array.isArray(
      game?.statuses
    )
      ? game.statuses
      : []

  return {
    ...game,

    statuses:
      statuses.filter(
        (status) =>
          status.id !==
          statusId
      ),
  }
}

/* ==========================================
   PEGAR TODOS OS STATUS ATIVOS
========================================== */

export function getActiveStatuses(
  game
) {
  const cleanedGame =
    removeExpiredStatuses(
      game
    )

  return Array.isArray(
    cleanedGame?.statuses
  )
    ? cleanedGame.statuses
    : []
}

/* ==========================================
   EXPORTA AS DEFINIÇÕES
========================================== */

export {
  statusDefinitions,
}