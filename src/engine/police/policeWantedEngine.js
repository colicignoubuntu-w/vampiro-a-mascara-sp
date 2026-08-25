import {
  notifyDiceRoll,
} from '../dice/diceRollEvents'

/*
  ========================================
  POLICE WANTED ENGINE
  ========================================

  Controla o estado de procura policial
  depois de fugas, violência, testemunhas
  e uso sobrenatural percebido.

  Níveis:
  0 = Nenhum
  1 = Atenção local
  2 = Procurando suspeito
  3 = Busca ativa
  4 = Alta prioridade
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

function getWorldMinutes(
  game
) {
  const day =
    Math.max(
      1,
      safeNumber(
        game?.world?.day,
        1
      )
    )

  const hour =
    clamp(
      safeNumber(
        game?.world?.hour,
        0
      ),
      0,
      23
    )

  const minute =
    clamp(
      safeNumber(
        game?.world?.minute,
        0
      ),
      0,
      59
    )

  return (
    ((day - 1) * 24 * 60) +
    (hour * 60) +
    minute
  )
}

function getCurrentLocation(
  game
) {
  return (
    game?.world?.location ??
    null
  )
}

export const POLICE_WANTED_LEVELS = {
  NONE: 0,
  LOCAL_ATTENTION: 1,
  SUSPECT_SEARCH: 2,
  ACTIVE_SEARCH: 3,
  HIGH_PRIORITY: 4,
}

export function getPoliceWantedLevelLabel(
  level
) {
  const normalizedLevel =
    clamp(
      safeNumber(
        level,
        0
      ),
      0,
      4
    )

  switch (normalizedLevel) {
    case 1:
      return 'Atenção local'

    case 2:
      return 'Procurando suspeito'

    case 3:
      return 'Busca ativa'

    case 4:
      return 'Alta prioridade'

    case 0:
    default:
      return 'Nenhuma procura'
  }
}

export function getPoliceWantedState(
  game
) {
  const current =
    game?.policeWanted ??
    {}

  const level =
    clamp(
      safeNumber(
        current.level,
        0
      ),
      0,
      4
    )

  return {
    active:
      Boolean(
        current.active &&
        level > 0
      ),

    level,

    label:
      getPoliceWantedLevelLabel(
        level
      ),

    startedAt:
      current.startedAt ??
      null,

    lastEscalatedAt:
      current.lastEscalatedAt ??
      null,

    lastDecayAt:
      current.lastDecayAt ??
      null,

    sourceLocationId:
      current.sourceLocationId ??
      null,

    sourceLocationName:
      current.sourceLocationName ??
      null,

    descriptionQuality:
      clamp(
        safeNumber(
          current.descriptionQuality,
          0
        ),
        0,
        1
      ),

    cameraEvidence:
      Boolean(
        current.cameraEvidence
      ),

    witnessEvidence:
      Boolean(
        current.witnessEvidence
      ),

    supernaturalEvidence:
      Boolean(
        current.supernaturalEvidence
      ),

    violenceAgainstPolice:
      Boolean(
        current.violenceAgainstPolice
      ),

    escapedPolice:
      Boolean(
        current.escapedPolice
      ),

    lastReason:
      current.lastReason ??
      null,

    notes:
      Array.isArray(
        current.notes
      )
        ? current.notes
        : [],
  }
}

function calculateInitialWantedLevel({
  escapedPolice = false,
  violenceAgainstPolice = false,
  supernaturalSeen = false,
  cameraEvidence = false,
  witnessEvidence = false,
}) {
  let level = 0

  if (escapedPolice) {
    level =
      Math.max(
        level,
        1
      )
  }

  if (
    witnessEvidence ||
    cameraEvidence
  ) {
    level =
      Math.max(
        level,
        2
      )
  }

  if (
    violenceAgainstPolice
  ) {
    level =
      Math.max(
        level,
        3
      )
  }

  if (
    supernaturalSeen
  ) {
    level =
      Math.max(
        level,
        3
      )
  }

  if (
    violenceAgainstPolice &&
    supernaturalSeen
  ) {
    level = 4
  }

  return level
}

function calculateDescriptionQuality({
  escapeMethod,
  cameraEvidence,
  witnessEvidence,
  supernaturalSeen,
}) {
  if (
    escapeMethod ===
    'obfuscation'
  ) {
    return 0.1
  }

  let quality = 0.25

  if (witnessEvidence) {
    quality += 0.25
  }

  if (cameraEvidence) {
    quality += 0.35
  }

  if (supernaturalSeen) {
    quality += 0.1
  }

  if (
    escapeMethod ===
    'celerity'
  ) {
    quality -= 0.15
  }

  return clamp(
    quality,
    0,
    1
  )
}

export function createPoliceWantedState(
  game,
  options = {}
) {
  if (!game) {
    return game
  }

  const now =
    getWorldMinutes(
      game
    )

  const location =
    getCurrentLocation(
      game
    )

  const escapedPolice =
    options.escapedPolice !==
      undefined
      ? Boolean(
          options.escapedPolice
        )
      : Boolean(
          game?.flags?.escapedPolice
        )

  const violenceAgainstPolice =
    options.violenceAgainstPolice !==
      undefined
      ? Boolean(
          options.violenceAgainstPolice
        )
      : Boolean(
          game?.flags?.policeViolence
        )

  const supernaturalSeen =
    options.supernaturalSeen !==
      undefined
      ? Boolean(
          options.supernaturalSeen
        )
      : Boolean(
          game?.flags
            ?.policeWitnessedSupernatural
        )

  const cameraEvidence =
    Boolean(
      options.cameraEvidence
    )

  const witnessEvidence =
    options.witnessEvidence !==
      undefined
      ? Boolean(
          options.witnessEvidence
        )
      : Boolean(
          escapedPolice ||
          violenceAgainstPolice ||
          supernaturalSeen
        )

  const escapeMethod =
    options.escapeMethod ??
    game?.flags
      ?.policeEscapeMethod ??
    null

  const calculatedLevel =
    calculateInitialWantedLevel({
      escapedPolice,
      violenceAgainstPolice,
      supernaturalSeen,
      cameraEvidence,
      witnessEvidence,
    })

  const level =
    clamp(
      safeNumber(
        options.level,
        calculatedLevel
      ),
      0,
      4
    )

  if (
    level <= 0
  ) {
    return {
      ...game,

      policeWanted: {
        active: false,
        level: 0,
        startedAt: null,
        lastEscalatedAt: null,
        lastDecayAt: null,
        sourceLocationId: null,
        sourceLocationName: null,
        descriptionQuality: 0,
        cameraEvidence: false,
        witnessEvidence: false,
        supernaturalEvidence: false,
        violenceAgainstPolice: false,
        escapedPolice: false,
        lastReason: null,
        notes: [],
      },
    }
  }

  const state = {
    active: true,

    level,

    startedAt:
      now,

    lastEscalatedAt:
      now,

    lastDecayAt:
      now,

    sourceLocationId:
      options.locationId ??
      location?.id ??
      null,

    sourceLocationName:
      options.locationName ??
      location?.name ??
      'Local desconhecido',

    descriptionQuality:
      calculateDescriptionQuality({
        escapeMethod,
        cameraEvidence,
        witnessEvidence,
        supernaturalSeen,
      }),

    cameraEvidence,

    witnessEvidence,

    supernaturalEvidence:
      supernaturalSeen,

    violenceAgainstPolice,

    escapedPolice,

    lastReason:
      options.reason ??
      (
        supernaturalSeen
          ? 'supernatural-seen'
          : violenceAgainstPolice
            ? 'violence-against-police'
            : escapedPolice
              ? 'escaped-police'
              : 'police-interest'
      ),

    notes: [
      ...(Array.isArray(
        options.notes
      )
        ? options.notes
        : []),

      ...(escapeMethod
        ? [
            `Método de fuga: ${escapeMethod}`,
          ]
        : []),
    ],
  }

  return {
    ...game,

    policeWanted:
      state,

    history: [
      ...(game?.history ?? []),

      {
        type:
          'police-wanted-started',

        level:
          state.level,

        reason:
          state.lastReason,

        locationId:
          state.sourceLocationId,

        descriptionQuality:
          state.descriptionQuality,

        supernaturalEvidence:
          state.supernaturalEvidence,

        violenceAgainstPolice:
          state.violenceAgainstPolice,

        timestamp:
          new Date()
            .toISOString(),
      },
    ],
  }
}

export function increasePoliceWantedLevel(
  game,
  options = {}
) {
  if (!game) {
    return game
  }

  const current =
    getPoliceWantedState(
      game
    )

  const now =
    getWorldMinutes(
      game
    )

  const amount =
    Math.max(
      1,
      safeNumber(
        options.amount,
        1
      )
    )

  const nextLevel =
    clamp(
      current.level +
        amount,
      0,
      4
    )

  return {
    ...game,

    policeWanted: {
      ...current,

      active:
        nextLevel > 0,

      level:
        nextLevel,

      lastEscalatedAt:
        now,

      lastReason:
        options.reason ??
        current.lastReason ??
        'police-escalation',
    },

    history: [
      ...(game?.history ?? []),

      {
        type:
          'police-wanted-increased',

        fromLevel:
          current.level,

        toLevel:
          nextLevel,

        reason:
          options.reason ??
          null,

        timestamp:
          new Date()
            .toISOString(),
      },
    ],
  }
}

export function decreasePoliceWantedLevel(
  game,
  options = {}
) {
  if (!game) {
    return game
  }

  const current =
    getPoliceWantedState(
      game
    )

  if (
    !current.active ||
    current.level <= 0
  ) {
    return game
  }

  const now =
    getWorldMinutes(
      game
    )

  const amount =
    Math.max(
      1,
      safeNumber(
        options.amount,
        1
      )
    )

  const nextLevel =
    clamp(
      current.level -
        amount,
      0,
      4
    )

  return {
    ...game,

    policeWanted: {
      ...current,

      active:
        nextLevel > 0,

      level:
        nextLevel,

      lastDecayAt:
        now,

      lastReason:
        options.reason ??
        current.lastReason,
    },

    history: [
      ...(game?.history ?? []),

      {
        type:
          'police-wanted-decreased',

        fromLevel:
          current.level,

        toLevel:
          nextLevel,

        reason:
          options.reason ??
          null,

        timestamp:
          new Date()
            .toISOString(),
      },
    ],
  }
}

export function clearPoliceWanted(
  game,
  options = {}
) {
  if (!game) {
    return game
  }

  const current =
    getPoliceWantedState(
      game
    )

  return {
    ...game,

    policeWanted: {
      ...current,

      active:
        false,

      level:
        0,

      lastReason:
        options.reason ??
        'cleared',
    },

    history: [
      ...(game?.history ?? []),

      {
        type:
          'police-wanted-cleared',

        previousLevel:
          current.level,

        reason:
          options.reason ??
          'cleared',

        timestamp:
          new Date()
            .toISOString(),
      },
    ],
  }
}

export function getWantedDecayMinutes(
  level
) {
  /*
    A procura policial não deve sumir
    depois de poucas viagens.

    Os tempos abaixo representam quanto
    tempo SEM novos incidentes é necessário
    para cair apenas UM nível.

    Nível 1: 12 horas
    Nível 2: 24 horas
    Nível 3: 48 horas
    Nível 4: 72 horas
  */

  switch (
    clamp(
      safeNumber(
        level,
        0
      ),
      0,
      4
    )
  ) {
    case 1:
      return 720

    case 2:
      return 1440

    case 3:
      return 2880

    case 4:
      return 4320

    default:
      return null
  }
}

export function updatePoliceWantedDecay(
  game
) {
  if (!game) {
    return game
  }

  const current =
    getPoliceWantedState(
      game
    )

  if (
    !current.active ||
    current.level <= 0
  ) {
    return game
  }

  const requiredMinutes =
    getWantedDecayMinutes(
      current.level
    )

  if (
    requiredMinutes ===
    null
  ) {
    return game
  }

  const now =
    getWorldMinutes(
      game
    )

  const reference =
    Math.max(
      safeNumber(
        current.lastEscalatedAt,
        0
      ),

      safeNumber(
        current.lastDecayAt,
        0
      ),

      safeNumber(
        current.startedAt,
        0
      )
    )

  if (
    now - reference <
    requiredMinutes
  ) {
    return game
  }

  return decreasePoliceWantedLevel(
    game,
    {
      amount: 1,

      reason:
        'time-decay',
    }
  )
}

export function getPoliceEncounterChance(
  game,
  options = {}
) {
  const wanted =
    getPoliceWantedState(
      game
    )

  if (
    !wanted.active ||
    wanted.level <= 0
  ) {
    return 0
  }

  const policePresence =
    clamp(
      safeNumber(
        options.policePresence,
        game?.world
          ?.location
          ?.policePresence ??
        0
      ),
      0,
      1
    )

  if (
    policePresence <= 0
  ) {
    return 0
  }

  /*
    Chance base por verificação.

    A intenção é que estar procurado tenha
    efeito perceptível no jogo, sem tornar
    toda viagem uma abordagem automática.
  */

  const baseByLevel = {
    1: 0.12,
    2: 0.28,
    3: 0.45,
    4: 0.65,
  }

  let chance =
    (
      baseByLevel[
        wanted.level
      ] ??
      0
    ) *
    (
      0.5 +
      policePresence
    )

  chance +=
    wanted.descriptionQuality *
    0.12

  if (
    wanted.cameraEvidence
  ) {
    chance +=
      0.08
  }

  if (
    wanted.violenceAgainstPolice
  ) {
    chance +=
      0.1
  }

  if (
    wanted.supernaturalEvidence
  ) {
    chance +=
      0.05
  }

  return clamp(
    chance,
    0,
    0.95
  )
}

export function rollPoliceWantedEncounter(
  game,
  options = {}
) {
  const chance =
    getPoliceEncounterChance(
      game,
      options
    )

  const triggered =
    Math.random() <
    chance

  if (triggered) {
    notifyDiceRoll(
      'police-encounter'
    )
  }

  return {
    triggered,

    chance,

    wanted:
      getPoliceWantedState(
        game
      ),
  }
}


/*
  ========================================
  RECONHECIMENTO POLICIAL
  ========================================

  Esta etapa é diferente da chance de
  ENCONTRAR a polícia.

  Primeiro rollPoliceWantedEncounter()
  decide se uma viatura/guarnição cruza
  com o personagem.

  Depois rollPoliceRecognition() decide
  se os policiais ligam aquela pessoa à
  descrição da ocorrência anterior.
*/

export function getPoliceRecognitionChance(
  game,
  options = {}
) {
  const wanted =
    getPoliceWantedState(
      game
    )

  if (
    !wanted.active ||
    wanted.level <= 0
  ) {
    return 0
  }

  /*
    Chance básica de reconhecimento
    conforme a intensidade da procura.
  */

  const baseByLevel = {
    1: 0.08,
    2: 0.20,
    3: 0.38,
    4: 0.58,
  }

  let chance =
    baseByLevel[
      wanted.level
    ] ?? 0

  /*
    Quanto melhor a descrição,
    mais fácil comparar o personagem
    com o suspeito procurado.
  */

  chance +=
    wanted.descriptionQuality *
    0.28

  /*
    Câmeras e testemunhas tornam a
    identificação posterior mais forte.
  */

  if (
    wanted.cameraEvidence
  ) {
    chance +=
      0.16
  }

  if (
    wanted.witnessEvidence
  ) {
    chance +=
      0.10
  }

  /*
    Violência contra policiais aumenta
    muito a atenção dada ao suspeito.
  */

  if (
    wanted.violenceAgainstPolice
  ) {
    chance +=
      0.14
  }

  /*
    Evidência sobrenatural aumenta a
    prioridade da ocorrência, mas não
    necessariamente fornece um retrato
    perfeito do suspeito.
  */

  if (
    wanted.supernaturalEvidence
  ) {
    chance +=
      0.05
  }

  /*
    Modificadores opcionais da cena.

    disguise:
      personagem está disfarçado.

    changedClothes:
      trocou roupas após a ocorrência.

    poorLighting:
      iluminação ruim.

    closeInspection:
      policial está conferindo documento
      ou observando de perto.

    knownIdentity:
      a polícia já possui identidade
      nominal confirmada.
  */

  if (
    options.disguise
  ) {
    chance -=
      0.25
  }

  if (
    options.changedClothes
  ) {
    chance -=
      0.08
  }

  if (
    options.poorLighting
  ) {
    chance -=
      0.08
  }

  if (
    options.closeInspection
  ) {
    chance +=
      0.12
  }

  if (
    options.knownIdentity
  ) {
    chance +=
      0.30
  }

  return clamp(
    chance,
    0.02,
    0.98
  )
}

export function rollPoliceRecognition(
  game,
  options = {}
) {
  const wanted =
    getPoliceWantedState(
      game
    )

  const chance =
    getPoliceRecognitionChance(
      game,
      options
    )

  if (
    !wanted.active ||
    wanted.level <= 0
  ) {
    return {
      recognized:
        false,

      chance:
        0,

      wanted,

      level:
        0,

      label:
        getPoliceWantedLevelLabel(
          0
        ),
    }
  }

  const roll =
    Math.random()

  const recognized =
    roll < chance

  if (recognized) {
    notifyDiceRoll(
      'police-recognition'
    )
  }

  return {
    recognized,

    chance,

    roll,

    wanted,

    level:
      wanted.level,

    label:
      wanted.label,
  }
}

/*
  Registra no save o resultado de uma
  tentativa de reconhecimento.

  Não altera automaticamente a cena.
  Game.jsx decidirá para onde seguir.
*/

export function registerPoliceRecognition(
  game,
  recognition
) {
  if (
    !game ||
    !recognition
  ) {
    return game
  }

  const recognized =
    Boolean(
      recognition.recognized
    )

  return {
    ...game,

    flags: {
      ...(game.flags ?? {}),

      policeRecognitionChecked:
        true,

      policeRecognizedPlayer:
        recognized,

      policeRecognitionChance:
        safeNumber(
          recognition.chance,
          0
        ),
    },

    history: [
      ...(game?.history ?? []),

      {
        type:
          'police-recognition',

        recognized,

        wantedLevel:
          recognition.level ??
          0,

        chance:
          safeNumber(
            recognition.chance,
            0
          ),

        roll:
          recognition.roll ??
          null,

        timestamp:
          new Date()
            .toISOString(),
      },
    ],
  }
}

export default {
  POLICE_WANTED_LEVELS,
  getPoliceWantedLevelLabel,
  getPoliceWantedState,
  createPoliceWantedState,
  increasePoliceWantedLevel,
  decreasePoliceWantedLevel,
  clearPoliceWanted,
  getWantedDecayMinutes,
  updatePoliceWantedDecay,
  getPoliceEncounterChance,
  rollPoliceWantedEncounter,
  getPoliceRecognitionChance,
  rollPoliceRecognition,
  registerPoliceRecognition,
}
