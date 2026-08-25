import {
  notifyDiceRoll,
} from '../dice/diceRollEvents'

/*
  ========================================
  COMBAT EXPOSURE ENGINE
  ========================================

  Controla as consequências públicas
  provocadas por um combate.

  Este sistema NÃO controla:
  - dano;
  - respingos de sangue;
  - frenesi;
  - Máscara diretamente.

  Ele controla:
  - barulho;
  - atenção pública;
  - testemunhas;
  - risco de polícia;
  - gravidade pública do combate.

  A localização pode definir:

  exposure.publicAccess
  exposure.crowdLevel
  exposure.policePresence
  exposure.soundIsolation
  exposure.hostilePresence

  REGRA IMPORTANTE:

  publicAccess: false
  crowdLevel: 0
  policePresence: 0

  significa que NÃO existem testemunhas
  civis nem resposta policial normal.

  Exemplo:
  - subterrâneo Sabbat;
  - refúgio;
  - bunker;
  - área secreta;
  - esgotos Nosferatu.
*/

function safeNumber(
  value,
  fallback = 0
) {
  const number =
    Number(value)

  return Number.isFinite(
    number
  )
    ? number
    : fallback
}

function clamp(
  value,
  minimum = 0,
  maximum = 1
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
  LOCALIZAÇÃO
  ========================================
*/

function getLocationData(
  game
) {
  return (
    game?.world
      ?.location ??
    {}
  )
}

function getLocationExposure(
  game,
  combat
) {
  const location =
    getLocationData(
      game
    )

  /*
    O environment do combate pode
    sobrescrever dados da localização.

    Isso permite, por exemplo:

    combate na Paulista
    mas dentro de um porão fechado.

    Nesse caso a cena pode definir
    environment.exposure.
  */

  const combatExposure =
    combat?.environment
      ?.exposure ??
    {}

  const locationExposure =
    location?.exposure ??
    {}

  return {
    publicAccess:
      combatExposure
        .publicAccess ??
      locationExposure
        .publicAccess ??
      true,

    crowdLevel:
      clamp(
        safeNumber(
          combatExposure
            .crowdLevel ??
          locationExposure
            .crowdLevel ??
          combat?.environment
            ?.crowdLevel ??
          location
            ?.crowdLevel,
          0
        )
      ),

    policePresence:
      clamp(
        safeNumber(
          combatExposure
            .policePresence ??
          locationExposure
            .policePresence ??
          combat?.environment
            ?.policePresence ??
          location
            ?.policePresence,
          0
        )
      ),

    soundIsolation:
      clamp(
        safeNumber(
          combatExposure
            .soundIsolation ??
          locationExposure
            .soundIsolation,
          0
        )
      ),

    hostilePresence:
      clamp(
        safeNumber(
          combatExposure
            .hostilePresence ??
          locationExposure
            .hostilePresence,
          0
        )
      ),
  }
}

/*
  ========================================
  ACESSO PÚBLICO
  ========================================
*/

export function isCombatPublic(
  game,
  combat
) {
  return Boolean(
    getLocationExposure(
      game,
      combat
    )
      .publicAccess
  )
}

export function getCombatCrowdLevel(
  game,
  combat
) {
  const exposure =
    getLocationExposure(
      game,
      combat
    )

  if (
    !exposure.publicAccess
  ) {
    return 0
  }

  return exposure.crowdLevel
}

export function getCombatPolicePresence(
  game,
  combat
) {
  const exposure =
    getLocationExposure(
      game,
      combat
    )

  if (
    !exposure.publicAccess
  ) {
    return 0
  }

  return exposure
    .policePresence
}

export function getCombatSoundIsolation(
  game,
  combat
) {
  return (
    getLocationExposure(
      game,
      combat
    )
      .soundIsolation
  )
}

export function getCombatHostilePresence(
  game,
  combat
) {
  return (
    getLocationExposure(
      game,
      combat
    )
      .hostilePresence
  )
}

/*
  ========================================
  CLASSIFICAÇÃO DA ARMA
  ========================================
*/

export function getWeaponExposureType(
  weapon
) {
  const sourceType =
    String(
      weapon?.sourceType ??
      'unarmed'
    )
      .toLowerCase()

  if (
    sourceType ===
    'firearm'
  ) {
    return 'firearm'
  }

  if (
    sourceType ===
      'blade' ||
    sourceType ===
      'stake'
  ) {
    return 'lethal-melee'
  }

  if (
    sourceType ===
    'blunt'
  ) {
    return 'blunt'
  }

  if (
    sourceType ===
      'supernatural' ||
    sourceType ===
      'vampire-bite'
  ) {
    return 'supernatural'
  }

  return 'unarmed'
}

/*
  ========================================
  BARULHO BASE
  ========================================
*/

export function getWeaponNoise(
  weapon
) {
  const type =
    getWeaponExposureType(
      weapon
    )

  switch (type) {
    case 'firearm':
      return 1

    case 'blunt':
      return 0.35

    case 'lethal-melee':
      return 0.25

    case 'supernatural':
      return 0.2

    case 'unarmed':
    default:
      return 0.15
  }
}

/*
  ========================================
  BARULHO EFETIVO
  ========================================

  soundIsolation:

  0.0
  som se espalha normalmente.

  1.0
  isolamento extremo.

  Um tiro continua sendo muito barulhento,
  mas pode não alcançar ninguém fora do
  local se a área estiver isolada.
*/

export function getEffectiveCombatNoise({
  game,
  combat,
  weapon,
}) {
  const baseNoise =
    getWeaponNoise(
      weapon
    )

  const isolation =
    getCombatSoundIsolation(
      game,
      combat
    )

  return clamp(
    baseNoise *
      (
        1 -
        isolation
      )
  )
}

/*
  ========================================
  VIOLÊNCIA VISÍVEL
  ========================================
*/

export function getViolenceSeverity({
  weapon,
  damageInflicted = 0,
  defeated = false,
}) {
  const type =
    getWeaponExposureType(
      weapon
    )

  const damage =
    Math.max(
      0,
      safeNumber(
        damageInflicted,
        0
      )
    )

  let severity =
    0.1

  if (
    type ===
    'unarmed'
  ) {
    severity =
      0.2
  }

  if (
    type ===
    'blunt'
  ) {
    severity =
      0.35
  }

  if (
    type ===
    'lethal-melee'
  ) {
    severity =
      0.55
  }

  if (
    type ===
    'firearm'
  ) {
    severity =
      0.8
  }

  if (
    type ===
    'supernatural'
  ) {
    severity =
      0.9
  }

  severity +=
    Math.min(
      0.25,
      damage * 0.05
    )

  if (
    defeated
  ) {
    severity +=
      0.15
  }

  return clamp(
    severity
  )
}

/*
  ========================================
  TESTEMUNHAS CIVIS
  ========================================
*/

export function calculateWitnessChance({
  game,
  combat,
  weapon,
  damageInflicted = 0,
  defeated = false,
}) {
  /*
    Lugar privado/secreto:

    nenhuma testemunha civil externa.
  */

  if (
    !isCombatPublic(
      game,
      combat
    )
  ) {
    return 0
  }

  const crowd =
    getCombatCrowdLevel(
      game,
      combat
    )

  /*
    Ninguém por perto significa
    literalmente 0%.
  */

  if (
    crowd <= 0
  ) {
    return 0
  }

  const noise =
    getEffectiveCombatNoise({
      game,
      combat,
      weapon,
    })

  const violence =
    getViolenceSeverity({
      weapon,
      damageInflicted,
      defeated,
    })

  /*
    Quanto mais gente:
    maior a chance.

    O barulho ajuda a chamar atenção.

    A violência visível também importa.
  */

  const chance =
    (
      crowd *
      0.65
    ) +
    (
      noise *
      0.20
    ) +
    (
      violence *
      0.15
    )

  return clamp(
    chance
  )
}

/*
  ========================================
  POLÍCIA
  ========================================
*/

export function calculatePoliceAlertChance({
  game,
  combat,
  weapon,
  damageInflicted = 0,
  defeated = false,
  witnessed = false,
}) {
  /*
    Sem acesso público:
    polícia normal não é chamada.
  */

  if (
    !isCombatPublic(
      game,
      combat
    )
  ) {
    return 0
  }

  const policePresence =
    getCombatPolicePresence(
      game,
      combat
    )

  if (
    policePresence <= 0
  ) {
    return 0
  }

  const noise =
    getEffectiveCombatNoise({
      game,
      combat,
      weapon,
    })

  const violence =
    getViolenceSeverity({
      weapon,
      damageInflicted,
      defeated,
    })

  let chance =
    (
      policePresence *
      0.35
    ) +
    (
      noise *
      0.30
    ) +
    (
      violence *
      0.15
    )

  /*
    Se alguém presenciou,
    cresce muito a chance de chamada.
  */

  if (
    witnessed
  ) {
    chance +=
      0.20
  }

  return clamp(
    chance
  )
}

/*
  ========================================
  ALERTA INTERNO
  ========================================

  Não é polícia.

  Serve para:

  - Sabbat;
  - seguranças;
  - vampiros inimigos;
  - cultistas;
  - guardas internos.

  Ainda não vamos gerar encontros
  automaticamente.

  Apenas calculamos a chance.
*/

export function calculateHostileAlertChance({
  game,
  combat,
  weapon,
  damageInflicted = 0,
}) {
  const hostilePresence =
    getCombatHostilePresence(
      game,
      combat
    )

  if (
    hostilePresence <= 0
  ) {
    return 0
  }

  const noise =
    getEffectiveCombatNoise({
      game,
      combat,
      weapon,
    })

  const violence =
    getViolenceSeverity({
      weapon,
      damageInflicted,
    })

  const chance =
    (
      hostilePresence *
      0.60
    ) +
    (
      noise *
      0.30
    ) +
    (
      violence *
      0.10
    )

  return clamp(
    chance
  )
}

/*
  ========================================
  ROLAGEM
  ========================================
*/

function rollChance(
  chance
) {
  return (
    Math.random() <
    clamp(
      chance
    )
  )
}

/*
  ========================================
  NÍVEL DE EXPOSIÇÃO
  ========================================
*/

function getExposureLevel({
  witnessed,
  policeAlerted,
  hostileAlerted,
  weapon,
}) {
  if (
    policeAlerted
  ) {
    return 'critical'
  }

  if (
    hostileAlerted
  ) {
    return 'hostile'
  }

  if (
    witnessed &&
    getWeaponExposureType(
      weapon
    ) ===
      'firearm'
  ) {
    return 'high'
  }

  if (
    witnessed
  ) {
    return 'medium'
  }

  return 'low'
}

/*
  ========================================
  TEXTO
  ========================================
*/

function buildExposureMessages({
  game,
  combat,
  weapon,
  witnessed,
  policeAlerted,
  hostileAlerted,
}) {
  const messages =
    []

  const type =
    getWeaponExposureType(
      weapon
    )

  const effectiveNoise =
    getEffectiveCombatNoise({
      game,
      combat,
      weapon,
    })

  /*
    Só diz que o estampido ecoa
    externamente quando realmente
    existe propagação relevante.
  */

  if (
    type ===
      'firearm' &&
    effectiveNoise >
      0.15
  ) {
    messages.push(
      'O estampido da arma ecoa pela região.'
    )
  }

  if (
    witnessed
  ) {
    messages.push(
      'Há pessoas próximas que perceberam a violência.'
    )
  }

  if (
    witnessed &&
    type ===
      'firearm'
  ) {
    messages.push(
      'Algumas testemunhas procuram abrigo enquanto outras tentam entender de onde vieram os disparos.'
    )
  }

  if (
    policeAlerted
  ) {
    messages.push(
      'A violência chamou atenção suficiente para provocar uma possível resposta policial.'
    )
  }

  if (
    hostileAlerted
  ) {
    messages.push(
      'O barulho pode ter alertado outras presenças hostis dentro da área.'
    )
  }

  return messages
}

/*
  ========================================
  FUNÇÃO PRINCIPAL
  ========================================
*/

export function rollCombatExposure({
  game,
  combat,
  weapon,
  damageInflicted = 0,
  defeated = false,
}) {
  const publicAccess =
    isCombatPublic(
      game,
      combat
    )

  const witnessChance =
    calculateWitnessChance({
      game,
      combat,
      weapon,
      damageInflicted,
      defeated,
    })

  const witnessed =
    witnessChance >
      0
      ? rollChance(
          witnessChance
        )
      : false

  const policeChance =
    calculatePoliceAlertChance({
      game,
      combat,
      weapon,
      damageInflicted,
      defeated,
      witnessed,
    })

  const policeAlerted =
    policeChance >
      0
      ? rollChance(
          policeChance
        )
      : false

  const hostileChance =
    calculateHostileAlertChance({
      game,
      combat,
      weapon,
      damageInflicted,
    })

  const hostileAlerted =
    hostileChance >
      0
      ? rollChance(
          hostileChance
        )
      : false

  if (
    witnessed ||
    policeAlerted ||
    hostileAlerted
  ) {
    notifyDiceRoll(
      'combat-witness'
    )
  }

  const level =
    getExposureLevel({
      witnessed,
      policeAlerted,
      hostileAlerted,
      weapon,
    })

  return {
    publicAccess,

    witnessed,

    policeAlerted,

    hostileAlerted,

    level,

    witnessChance,

    policeChance,

    hostileChance,

    crowdLevel:
      getCombatCrowdLevel(
        game,
        combat
      ),

    policePresence:
      getCombatPolicePresence(
        game,
        combat
      ),

    soundIsolation:
      getCombatSoundIsolation(
        game,
        combat
      ),

    hostilePresence:
      getCombatHostilePresence(
        game,
        combat
      ),

    noise:
      getEffectiveCombatNoise({
        game,
        combat,
        weapon,
      }),

    weaponType:
      getWeaponExposureType(
        weapon
      ),

    messages:
      buildExposureMessages({
        game,
        combat,
        weapon,
        witnessed,
        policeAlerted,
        hostileAlerted,
      }),
  }
}

export default {
  isCombatPublic,
  getCombatCrowdLevel,
  getCombatPolicePresence,
  getCombatSoundIsolation,
  getCombatHostilePresence,
  getWeaponExposureType,
  getWeaponNoise,
  getEffectiveCombatNoise,
  getViolenceSeverity,
  calculateWitnessChance,
  calculatePoliceAlertChance,
  calculateHostileAlertChance,
  rollCombatExposure,
}
