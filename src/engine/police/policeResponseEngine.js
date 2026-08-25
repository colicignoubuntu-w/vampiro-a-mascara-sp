/*
  ========================================
  POLICE RESPONSE ENGINE
  ========================================

  Controla chamadas policiais provocadas
  por acontecimentos no mundo.

  Este sistema NÃO decide se alguém
  chamou a polícia.

  Essa decisão pertence a sistemas como:
  - combatExposureEngine
  - masqueradeEngine

  Aqui controlamos:
  - chamada registrada;
  - local da ocorrência;
  - horário da chamada;
  - tempo estimado de resposta;
  - chegada da polícia;
  - fuga do personagem antes da chegada.
*/

function safeNumber(
  value,
  fallback = 0
) {
  const number =
    Number(value)

  return Number.isFinite(number)
    ? number
    : fallback
}

function clamp(
  value,
  minimum,
  maximum
) {
  return Math.max(
    minimum,
    Math.min(
      maximum,
      value
    )
  )
}

/*
  ========================================
  TEMPO DO MUNDO
  ========================================
*/

function getWorldMinutes(
  game
) {
  const day =
    safeNumber(
      game?.world?.day,
      1
    )

  const hour =
    safeNumber(
      game?.world?.hour,
      0
    )

  const minute =
    safeNumber(
      game?.world?.minute,
      0
    )

  return (
    (day * 1440) +
    (hour * 60) +
    minute
  )
}

/*
  ========================================
  LOCAL
  ========================================
*/

function getLocation(
  game
) {
  return (
    game?.world?.location ??
    {}
  )
}

function getLocationId(
  game
) {
  return (
    getLocation(game)?.id ??
    null
  )
}

function getPolicePresence(
  game
) {
  return clamp(
    safeNumber(
      getLocation(game)
        ?.policePresence,
      0
    ),
    0,
    1
  )
}

/*
  ========================================
  TEMPO DE RESPOSTA
  ========================================

  policePresence alto:
  resposta mais rápida.

  policePresence baixo:
  resposta mais demorada.

  policePresence 0:
  nenhuma resposta automática.
*/

export function calculatePoliceResponseMinutes(
  game,
  options = {}
) {
  const explicitPresence =
    options.policePresence

  const policePresence =
    explicitPresence !==
    undefined
      ? clamp(
          safeNumber(
            explicitPresence,
            0
          ),
          0,
          1
        )
      : getPolicePresence(game)

  if (
    policePresence <= 0
  ) {
    return null
  }

  /*
    Aproximação:

    presença 1.0
    -> aproximadamente 2–4 minutos

    presença 0.8
    -> aproximadamente 3–6 minutos

    presença 0.5
    -> aproximadamente 6–10 minutos

    presença 0.2
    -> aproximadamente 10–16 minutos
  */

  const minimum =
    Math.round(
      2 +
      (1 - policePresence) *
        8
    )

  const maximum =
    Math.round(
      4 +
      (1 - policePresence) *
        14
    )

  return (
    minimum +
    Math.floor(
      Math.random() *
        Math.max(
          1,
          maximum -
            minimum +
            1
        )
    )
  )
}

/*
  ========================================
  ESTADO
  ========================================
*/

export function getPoliceResponseState(
  game
) {
  return (
    game?.policeResponse ?? {
      active: false,

      status:
        'none',

      locationId:
        null,

      locationName:
        null,

      calledAt:
        null,

      arrivalAt:
        null,

      responseMinutes:
        null,

      reason:
        null,

      severity:
        'normal',

      playerLeftScene:
        false,

      arrived:
        false,
    }
  )
}

/*
  ========================================
  REGISTRAR CHAMADA
  ========================================
*/

export function createPoliceResponse(
  game,
  options = {}
) {
  const current =
    getPoliceResponseState(
      game
    )

  /*
    Não substitui uma ocorrência
    policial já ativa.

    Posteriormente podemos permitir
    múltiplas chamadas simultâneas.
  */

  if (
    current.active &&
    current.status !==
      'resolved'
  ) {
    return game
  }

  const location =
    getLocation(game)

  const policePresence =
    options.policePresence !==
    undefined
      ? clamp(
          safeNumber(
            options.policePresence,
            0
          ),
          0,
          1
        )
      : getPolicePresence(game)

  /*
    Lugar sem presença policial
    configurada não gera resposta.

    Exemplos:
    subterrâneo Sabbat,
    esconderijo secreto,
    túnel abandonado etc.
  */

  if (
    policePresence <= 0
  ) {
    return game
  }

  const responseMinutes =
    calculatePoliceResponseMinutes(
      game,
      {
        policePresence,
      }
    )

  if (
    responseMinutes === null
  ) {
    return game
  }

  const now =
    getWorldMinutes(
      game
    )

  const locationId =
    options.locationId ??
    location?.id ??
    null

  const locationName =
    options.locationName ??
    location?.name ??
    'Local desconhecido'

  const reason =
    options.reason ??
    'disturbance'

  const severity =
    options.severity ??
    'normal'

  const policeResponse = {
    active:
      true,

    status:
      'responding',

    locationId,

    locationName,

    calledAt:
      now,

    arrivalAt:
      now +
      responseMinutes,

    responseMinutes,

    reason,

    severity,

    policePresence,

    playerLeftScene:
      false,

    arrived:
      false,
  }

  return {
    ...game,

    policeResponse,

    history: [
      ...(game?.history ??
        []),

      {
        type:
          'police-called',

        locationId,

        locationName,

        reason,

        severity,

        policePresence,

        responseMinutes,

        calledAt:
          now,

        timestamp:
          new Date()
            .toISOString(),
      },
    ],
  }
}

/*
  ========================================
  PERSONAGEM SAIU DO LOCAL
  ========================================
*/

export function markPlayerLeftPoliceScene(
  game
) {
  const response =
    getPoliceResponseState(
      game
    )

  if (
    !response.active ||
    response.status !==
      'responding'
  ) {
    return game
  }

  const currentLocationId =
    getLocationId(
      game
    )

  /*
    Se continua no mesmo local,
    nada acontece.
  */

  if (
    currentLocationId ===
    response.locationId
  ) {
    return game
  }

  return {
    ...game,

    policeResponse: {
      ...response,

      playerLeftScene:
        true,
    },
  }
}

/*
  ========================================
  VERIFICAR CHEGADA
  ========================================
*/

export function updatePoliceResponse(
  game
) {
  const response =
    getPoliceResponseState(
      game
    )

  if (
    !response.active ||
    response.status !==
      'responding'
  ) {
    return {
      game,

      event:
        null,
    }
  }

  const now =
    getWorldMinutes(
      game
    )

  /*
    Ainda não chegou a hora.
  */

  if (
    now <
    response.arrivalAt
  ) {
    return {
      game:
        markPlayerLeftPoliceScene(
          game
        ),

      event:
        null,
    }
  }

  const currentLocationId =
    getLocationId(
      game
    )

  const playerStillThere =
    currentLocationId ===
    response.locationId

  /*
    ======================================
    POLÍCIA CHEGOU E JOGADOR ESTÁ LÁ
    ======================================
  */

  if (
    playerStillThere
  ) {
    const updatedGame = {
      ...game,

      policeResponse: {
        ...response,

        status:
          'arrived',

        arrived:
          true,

        playerLeftScene:
          false,
      },

      history: [
        ...(game?.history ??
          []),

        {
          type:
            'police-arrival',

          locationId:
            response.locationId,

          playerPresent:
            true,

          reason:
            response.reason,

          timestamp:
            new Date()
              .toISOString(),
        },
      ],
    }

    return {
      game:
        updatedGame,

      event: {
        type:
          'police-arrival',

        locationId:
          response.locationId,

        locationName:
          response.locationName,

        severity:
          response.severity,

        reason:
          response.reason,

        playerPresent:
          true,
      },
    }
  }

  /*
    ======================================
    POLÍCIA CHEGOU, MAS JOGADOR FUGIU
    ======================================

    A ocorrência continua existindo.

    Isso permitirá posteriormente:
    - testemunhas;
    - investigação;
    - câmeras;
    - descrição do suspeito;
    - aumento de atenção policial.
  */

  const updatedGame = {
    ...game,

    policeResponse: {
      ...response,

      active:
        false,

      status:
        'arrived-after-player-left',

      arrived:
        true,

      playerLeftScene:
        true,
    },

    history: [
      ...(game?.history ??
        []),

      {
        type:
          'police-arrival',

        locationId:
          response.locationId,

        playerPresent:
          false,

        reason:
          response.reason,

        timestamp:
          new Date()
            .toISOString(),
      },
    ],
  }

  return {
    game:
      updatedGame,

    event: {
      type:
        'police-arrival-after-player-left',

      locationId:
        response.locationId,

      locationName:
        response.locationName,

      severity:
        response.severity,

      reason:
        response.reason,

      playerPresent:
        false,
    },
  }
}

/*
  ========================================
  ENCERRAR OCORRÊNCIA
  ========================================
*/

export function resolvePoliceResponse(
  game
) {
  const response =
    getPoliceResponseState(
      game
    )

  if (
    !response.active &&
    response.status ===
      'none'
  ) {
    return game
  }

  return {
    ...game,

    policeResponse: {
      ...response,

      active:
        false,

      status:
        'resolved',
    },
  }
}