function clamp(value, min, max) {
  return Math.max(
    min,
    Math.min(
      max,
      value
    )
  )
}

/* ==========================================
   ESTADO SEGURO DA MÁSCARA
========================================== */

function getMasquerade(game) {
  return {
    suspicion:
      Number(
        game?.masquerade
          ?.suspicion ?? 0
      ),

    policeAttention:
      Number(
        game?.masquerade
          ?.policeAttention ?? 0
      ),

    violations:
      Number(
        game?.masquerade
          ?.violations ?? 0
      ),

    witnesses:
      Array.isArray(
        game?.masquerade
          ?.witnesses
      )
        ? game.masquerade.witnesses
        : [],

    evidence:
      Array.isArray(
        game?.masquerade
          ?.evidence
      )
        ? game.masquerade.evidence
        : [],

    exposure:
      Number(
        game?.masquerade
          ?.exposure ?? 0
      ),
  }
}

/* ==========================================
   EVIDÊNCIAS ATIVAS
========================================== */

export function getActiveEvidence(game) {
  const masquerade =
    getMasquerade(game)

  return masquerade.evidence.filter(
    (item) =>
      item.active !== false
  )
}

/* ==========================================
   PRESSÃO COM O PASSAR DO TEMPO

   Vídeos são muito mais perigosos
   que uma testemunha isolada.

   exposure acumula "pressão".

   Ao atingir determinados valores,
   a suspeita/polícia aumentam.
========================================== */

export function processMasqueradeTime(
  game,
  minutes
) {
  if (!game) {
    return game
  }

  const elapsed =
    Math.max(
      0,
      Number(minutes) || 0
    )

  if (elapsed <= 0) {
    return game
  }

  const masquerade =
    getMasquerade(game)

  const activeEvidence =
    masquerade.evidence.filter(
      (item) =>
        item.active !== false
    )

  const videos =
    activeEvidence.filter(
      (item) =>
        item.type ===
        'phoneVideo'
    )

  const witnessCount =
    masquerade.witnesses.length

  /*
    Cada vídeo aumenta bastante
    a pressão.

    Testemunhas aumentam mais lentamente.
  */

  const pressurePerMinute =
    videos.length * 2 +
    witnessCount * 0.25

  if (
    pressurePerMinute <= 0
  ) {
    return game
  }

  const previousExposure =
    masquerade.exposure

  const totalExposure =
    previousExposure +
    elapsed *
      pressurePerMinute

  /*
    A cada 120 pontos de exposição
    ocorre uma consequência.

    Mantemos o resto acumulado.
  */

  const previousTicks =
    Math.floor(
      previousExposure / 120
    )

  const currentTicks =
    Math.floor(
      totalExposure / 120
    )

  const newTicks =
    Math.max(
      0,
      currentTicks -
        previousTicks
    )

  if (newTicks <= 0) {
    return {
      ...game,

      masquerade: {
        ...masquerade,

        exposure:
          totalExposure,
      },
    }
  }

  /*
    Limitamos a dois aumentos
    de uma vez para não explodir
    os números numa viagem longa.
  */

  const appliedTicks =
    Math.min(
      newTicks,
      2
    )

  let suspicionGain =
    appliedTicks

  let policeGain = 0

  /*
    Se existe vídeo circulando,
    parte da pressão chega à polícia.
  */

  if (
    videos.length > 0
  ) {
    policeGain =
      appliedTicks
  }

  const newSuspicion =
    clamp(
      masquerade.suspicion +
        suspicionGain,
      0,
      10
    )

  const newPolice =
    clamp(
      masquerade.policeAttention +
        policeGain,
      0,
      10
    )

  const historyEntry = {
    type:
      'masquerade-pressure',

    minutes:
      elapsed,

    activeEvidence:
      activeEvidence.length,

    videos:
      videos.length,

    witnesses:
      witnessCount,

    suspicionGain,

    policeGain,

    timestamp:
      new Date()
        .toISOString(),
  }

  return {
    ...game,

    masquerade: {
      ...masquerade,

      suspicion:
        newSuspicion,

      policeAttention:
        newPolice,

      exposure:
        totalExposure,
    },

    history: [
      ...(game.history ?? []),

      historyEntry,
    ],
  }
}

/* ==========================================
   ATENÇÃO POLICIAL EM VIAGENS
========================================== */

export function getPoliceTravelModifier(
  game
) {
  const attention =
    Number(
      game?.masquerade
        ?.policeAttention ?? 0
    )

  if (attention <= 0) {
    return 0
  }

  if (attention <= 2) {
    return 2
  }

  if (attention <= 5) {
    return 7
  }

  if (attention <= 8) {
    return 15
  }

  return 25
}

/* ==========================================
   NÍVEL DE RESPOSTA DA CAMARILLA
========================================== */

export function calculateCamarillaLevel(
  game
) {
  const suspicion =
    Number(
      game?.masquerade
        ?.suspicion ?? 0
    )

  const violations =
    Number(
      game?.masquerade
        ?.violations ?? 0
    )

  const police =
    Number(
      game?.masquerade
        ?.policeAttention ?? 0
    )

  /*
    NÍVEL 4
    crise séria.
  */

  if (
    violations >= 4 ||
    suspicion >= 10
  ) {
    return 4
  }

  /*
    NÍVEL 3
    Xerife começa a agir.
  */

  if (
    violations >= 3 ||
    police >= 8 ||
    suspicion >= 9
  ) {
    return 3
  }

  /*
    NÍVEL 2
    convocação.
  */

  if (
    violations >= 2 ||
    suspicion >= 7 ||
    police >= 6
  ) {
    return 2
  }

  /*
    NÍVEL 1
    aviso.
  */

  if (
    violations >= 1 ||
    suspicion >= 5 ||
    police >= 4
  ) {
    return 1
  }

  return 0
}

/* ==========================================
   EVENTO DA CAMARILLA

   Só aparece se o novo nível for
   maior do que o nível que o jogador
   já recebeu anteriormente.
========================================== */

export function getCamarillaResponse(
  game
) {
  if (!game) {
    return null
  }

  const currentLevel =
    calculateCamarillaLevel(
      game
    )

  const alreadyHandled =
    Number(
      game.flags
        ?.camarillaResponseLevel ??
        0
    )

  if (
    currentLevel <= 0 ||
    currentLevel <=
      alreadyHandled
  ) {
    return null
  }

  if (currentLevel === 1) {
    return {
      id:
        'camarilla-warning',

      level: 1,

      title:
        'Um aviso da Camarilla',

      speaker:
        'Mensagem desconhecida',

      text:
        'Seu telefone vibra. A mensagem não possui identificação.',

      dialogue:
        'Você está chamando atenção demais. São Paulo é grande, mas não grande o suficiente para esconder um idiota para sempre. Limpe sua bagunça antes que alguém faça isso por você.',

      consequence:
        'A Camarilla percebeu suas atividades.',
    }
  }

  if (currentLevel === 2) {
    return {
      id:
        'camarilla-summons',

      level: 2,

      title:
        'Convocação',

      speaker:
        'Camarilla',

      text:
        'Uma nova mensagem chega. Desta vez não existe qualquer tentativa de parecer um conselho.',

      dialogue:
        'Sua presença foi requisitada. Isso não é um convite. Apresente-se quando for chamado e venha preparado para explicar por que mortais estão fazendo perguntas demais.',

      consequence:
        'Você foi oficialmente colocado sob observação.',
    }
  }

  if (currentLevel === 3) {
    return {
      id:
        'sheriff-warning',

      level: 3,

      title:
        'O Xerife está observando',

      speaker:
        'Contato da Camarilla',

      text:
        'Você recebe apenas uma frase. O remetente apaga a mensagem poucos segundos depois.',

      dialogue:
        'O Xerife perguntou por você.',

      consequence:
        'O Xerife agora acompanha seus erros.',
    }
  }

  return {
    id:
      'prince-crisis',

    level: 4,

    title:
      'A paciência do Príncipe terminou',

    speaker:
      'Camarilla',

    text:
      'A mensagem é curta demais para ser interpretada como ameaça. Não precisa ser.',

    dialogue:
      'Apresente-se à Corte. Imediatamente.',

    consequence:
      'Sua sobrevivência política está em risco.',
  }
}

/* ==========================================
   CONFIRMAR QUE O EVENTO FOI VISTO
========================================== */

export function acknowledgeCamarillaResponse(
  game,
  event
) {
  if (
    !game ||
    !event
  ) {
    return game
  }

  const flags = {
    ...(game.flags ?? {}),

    camarillaResponseLevel:
      Math.max(
        Number(
          game.flags
            ?.camarillaResponseLevel ??
            0
        ),

        event.level
      ),
  }

  if (
    event.level >= 2
  ) {
    flags.camarillaSummoned =
      true
  }

  if (
    event.level >= 3
  ) {
    flags.sheriffWatching =
      true
  }

  if (
    event.level >= 4
  ) {
    flags.princeDispleased =
      true
  }

  return {
    ...game,

    flags,

    history: [
      ...(game.history ?? []),

      {
        type:
          'camarilla-response',

        level:
          event.level,

        eventId:
          event.id,

        timestamp:
          new Date()
            .toISOString(),
      },
    ],
  }
}