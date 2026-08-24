function worldToMinutes(world) {
  const night = Number(
    world?.night ?? 1
  )

  const hour = Number(
    world?.hour ?? 0
  )

  const minute = Number(
    world?.minute ?? 0
  )

  return (
    (night - 1) * 24 * 60 +
    hour * 60 +
    minute
  )
}

/* ==========================================
   RUBOR DO SANGUE
========================================== */

export function isBlushActive(
  game
) {
  if (!game) {
    return false
  }

  const active =
    Boolean(
      game.blush?.active
    )

  const expiresAt =
    game.blush?.expiresAt

  if (
    !active ||
    expiresAt === null ||
    expiresAt === undefined
  ) {
    return false
  }

  const now =
    worldToMinutes(
      game.world
    )

  return now < expiresAt
}

/* ==========================================
   DURAÇÃO
========================================== */

export function getBlushDuration(
  game
) {
  const humanity =
    Number(
      game?.humanity?.current ??
      7
    )

  if (humanity >= 8) {
    return 120
  }

  if (humanity >= 6) {
    return 90
  }

  if (humanity >= 4) {
    return 60
  }

  if (humanity >= 2) {
    return 45
  }

  return 30
}

/* ==========================================
   ATIVAR RUBOR
========================================== */

export function activateBlush(
  game
) {
  if (!game) {
    return {
      success: false,
      reason: 'no-game',
      game,
    }
  }

  const currentBlood =
    Number(
      game.blood?.current ??
      0
    )

  if (currentBlood < 1) {
    return {
      success: false,

      reason:
        'not-enough-blood',

      game,
    }
  }

  const now =
    worldToMinutes(
      game.world
    )

  const duration =
    getBlushDuration(
      game
    )

  const updatedGame = {
    ...game,

    blood: {
      ...(game.blood ?? {}),

      current:
        Math.max(
          0,
          currentBlood - 1
        ),
    },

    blush: {
      active: true,

      startedAt:
        now,

      expiresAt:
        now + duration,

      durationMinutes:
        duration,
    },

    history: [
      ...(game.history ?? []),

      {
        type:
          'blush-activated',

        bloodSpent: 1,

        durationMinutes:
          duration,

        timestamp:
          new Date()
            .toISOString(),
      },
    ],
  }

  return {
    success: true,

    reason: null,

    duration,

    game:
      updatedGame,
  }
}

/* ==========================================
   ATUALIZAR RUBOR
========================================== */

export function updateBlush(
  game
) {
  if (!game) {
    return game
  }

  if (
    !game.blush?.active
  ) {
    return game
  }

  const expiresAt =
    game.blush?.expiresAt

  if (
    expiresAt === null ||
    expiresAt === undefined
  ) {
    return {
      ...game,

      blush: {
        ...(game.blush ?? {}),

        active: false,
      },
    }
  }

  const now =
    worldToMinutes(
      game.world
    )

  if (now < expiresAt) {
    return game
  }

  return {
    ...game,

    blush: {
      ...(game.blush ?? {}),

      active: false,

      expiresAt: null,
    },

    history: [
      ...(game.history ?? []),

      {
        type:
          'blush-expired',

        timestamp:
          new Date()
            .toISOString(),
      },
    ],
  }
}

/* ==========================================
   TEMPO RESTANTE
========================================== */

export function getBlushTimeRemaining(
  game
) {
  if (
    !isBlushActive(
      game
    )
  ) {
    return 0
  }

  const now =
    worldToMinutes(
      game.world
    )

  const expiresAt =
    Number(
      game.blush?.expiresAt ??
      now
    )

  return Math.max(
    0,
    expiresAt - now
  )
}

/* ==========================================
   DESCRIÇÃO
========================================== */

export function getBlushDescription(
  game
) {
  if (
    isBlushActive(
      game
    )
  ) {
    return {
      active: true,

      label:
        'Rubor do Sangue ativo',

      description:
        'Sua pele recupera cor e calor. Você simula respiração e parece muito mais próximo de uma pessoa viva.',
    }
  }

  return {
    active: false,

    label:
      'Aparência cadavérica',

    description:
      'Sua pele está fria e sua respiração é apenas um hábito que você precisa lembrar de imitar.',
  }
}