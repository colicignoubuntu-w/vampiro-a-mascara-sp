/*
  ========================================
  BLOOD SPLATTER ENGINE
  ========================================

  Controla sangue visível provocado
  por combate.

  Este sistema NÃO cuida da Máscara.

  Ele apenas altera:

  game.appearance.bodyBlood
  game.appearance.clothesBlood

  O sistema de Máscara já existente
  detectará isso posteriormente.

  REGRA IMPORTANTE:

  Vampiros não geram respingos de sangue
  visível ao serem feridos.

  Portanto:

  humano / animal
  -> pode gerar sangue

  vampiro
  -> nunca gera respingo
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

function randomPercent() {
  return (
    Math.random() *
    100
  )
}

/*
  ========================================
  DISTÂNCIA
  ========================================
*/

function normalizeDistance(
  distance
) {
  const value =
    String(
      distance ??
      ''
    )
      .trim()
      .toLowerCase()

  if (
    [
      'close',
      'melee',
      'curta',
      'curto',
      'short',
    ].includes(
      value
    )
  ) {
    return 'close'
  }

  if (
    [
      'medium',
      'media',
      'média',
      'medio',
      'médio',
    ].includes(
      value
    )
  ) {
    return 'medium'
  }

  if (
    [
      'long',
      'far',
      'longa',
      'longo',
    ].includes(
      value
    )
  ) {
    return 'long'
  }

  return value ||
    'close'
}

/*
  ========================================
  APARÊNCIA
  ========================================
*/

function getCurrentAppearance(
  game
) {
  return {
    bodyBlood:
      clamp(
        safeNumber(
          game?.appearance
            ?.bodyBlood,
          0
        ),
        0,
        3
      ),

    clothesBlood:
      clamp(
        safeNumber(
          game?.appearance
            ?.clothesBlood,
          0
        ),
        0,
        3
      ),
  }
}

function applyBloodLevel({
  game,
  bodyIncrease = 0,
  clothesIncrease = 0,
}) {
  if (!game) {
    return game
  }

  const current =
    getCurrentAppearance(
      game
    )

  const bodyBlood =
    clamp(
      current.bodyBlood +
        bodyIncrease,
      0,
      3
    )

  const clothesBlood =
    clamp(
      current.clothesBlood +
        clothesIncrease,
      0,
      3
    )

  const visiblyBloody =
    bodyBlood > 0 ||
    clothesBlood > 0

  return {
    ...game,

    appearance: {
      ...(game.appearance ??
        {}),

      bodyBlood,

      clothesBlood,

      clean:
        !visiblyBloody,

      visiblyBloody,
    },
  }
}

/*
  ========================================
  CLASSIFICAÇÃO DA ARMA
  ========================================
*/

function getWeaponBloodProfile(
  weapon
) {
  const sourceType =
    String(
      weapon?.sourceType ??
      ''
    )
      .toLowerCase()

  const category =
    String(
      weapon?.category ??
      ''
    )
      .toLowerCase()

  const id =
    String(
      weapon?.id ??
      ''
    )
      .toLowerCase()

  /*
    Armas cortantes.
  */

  if (
    sourceType ===
      'blade' ||
    [
      'knife',
      'machete',
      'axe',
    ].includes(
      id
    )
  ) {
    return 'blade'
  }

  /*
    Mordida vampírica.
  */

  if (
    sourceType ===
      'vampire-bite' ||
    id ===
      'vampirebite' ||
    id ===
      'bite'
  ) {
    return 'bite'
  }

  /*
    Garras.
  */

  if (
    sourceType ===
      'supernatural' ||
    id.includes(
      'claw'
    )
  ) {
    return 'claws'
  }

  /*
    Armas de fogo.
  */

  if (
    category ===
      'firearm' ||
    sourceType ===
      'firearm'
  ) {
    if (
      id.includes(
        'shotgun'
      )
    ) {
      return 'shotgun'
    }

    return 'firearm'
  }

  /*
    Estaca.
  */

  if (
    category ===
      'stake' ||
    sourceType ===
      'stake'
  ) {
    return 'stake'
  }

  /*
    Objetos contundentes.
  */

  if (
    sourceType ===
      'blunt'
  ) {
    return 'blunt'
  }

  /*
    Socos e chutes.
  */

  if (
    category ===
      'unarmed' ||
    sourceType ===
      'unarmed'
  ) {
    return 'unarmed'
  }

  return 'other'
}

/*
  ========================================
  ALVO PODE GERAR SANGUE?
  ========================================
*/

function targetCanBleed(
  targetType
) {
  const normalized =
    String(
      targetType ??
      ''
    )
      .trim()
      .toLowerCase()

  /*
    Vampiros não geram respingo
    visível neste sistema.
  */

  if (
    normalized ===
      'vampire'
  ) {
    return false
  }

  /*
    Para humanos, animais e outros
    alvos ainda não classificados,
    permitimos a mecânica.

    Depois podemos criar regras
    específicas para lobisomens,
    carniçais, espíritos etc.
  */

  return true
}

/*
  ========================================
  RESPINGO DA VÍTIMA NO ATACANTE
  ========================================

  Exemplo:

  jogador esfaqueia um humano
  -> sangue do humano pode atingir jogador.

  jogador esfaqueia um vampiro
  -> não gera sangue visível.
*/

export function applyAttackerBloodSplatter({
  game,
  weapon,
  damageInflicted,
  distance,
  targetType,
}) {
  /*
    Sem jogo ou sem dano real:
    não existe respingo.
  */

  if (
    !game ||
    safeNumber(
      damageInflicted,
      0
    ) <= 0
  ) {
    return {
      game,

      splattered:
        false,

      level:
        0,

      chance:
        0,

      roll:
        null,

      log:
        null,
    }
  }

  /*
    ========================================
    VAMPIROS NÃO GERAM RESPINGO
    ========================================
  */

  if (
    !targetCanBleed(
      targetType
    )
  ) {
    return {
      game,

      splattered:
        false,

      level:
        0,

      chance:
        0,

      roll:
        null,

      log:
        null,
    }
  }

  const damage =
    safeNumber(
      damageInflicted,
      0
    )

  const profile =
    getWeaponBloodProfile(
      weapon
    )

  const normalizedDistance =
    normalizeDistance(
      distance
    )

  let chance = 0

  let bodyIncrease = 0

  let clothesIncrease = 0

  /*
    ========================================
    FACA / FACÃO / MACHADO
    ========================================
  */

  if (
    profile ===
    'blade'
  ) {
    chance =
      50 +
      damage * 10

    bodyIncrease =
      damage >= 4
        ? 2
        : 1

    clothesIncrease =
      damage >= 3
        ? 2
        : 1
  }

  /*
    ========================================
    GARRAS
    ========================================
  */

  if (
    profile ===
    'claws'
  ) {
    chance =
      45 +
      damage * 10

    bodyIncrease =
      damage >= 4
        ? 2
        : 1

    clothesIncrease =
      damage >= 3
        ? 2
        : 1
  }

  /*
    ========================================
    MORDIDA
    ========================================
  */

  if (
    profile ===
    'bite'
  ) {
    chance =
      75 +
      damage * 5

    bodyIncrease =
      damage >= 3
        ? 2
        : 1

    clothesIncrease = 1
  }

  /*
    ========================================
    ESTACA
    ========================================
  */

  if (
    profile ===
    'stake'
  ) {
    chance =
      30 +
      damage * 8

    bodyIncrease = 1

    clothesIncrease = 1
  }

  /*
    ========================================
    ARMA DE FOGO
    ========================================
  */

  if (
    profile ===
      'firearm' ||
    profile ===
      'shotgun'
  ) {
    /*
      Curta distância:
      há chance real de sangue da vítima
      atingir o atirador.

      Média distância:
      risco bastante reduzido.

      Longa distância:
      risco mínimo.
    */

    if (
      normalizedDistance ===
      'close'
    ) {
      chance =
        profile ===
          'shotgun'
          ? 70
          : 45
    } else if (
      normalizedDistance ===
      'medium'
    ) {
      chance =
        profile ===
          'shotgun'
          ? 20
          : 10
    } else {
      chance =
        profile ===
          'shotgun'
          ? 8
          : 2
    }

    chance +=
      damage * 3

    bodyIncrease = 1

    clothesIncrease =
      damage >= 5 &&
      normalizedDistance ===
        'close'
        ? 2
        : 1
  }

  /*
    ========================================
    CONTUNDENTE
    ========================================

    Pancada pode abrir nariz,
    boca, sobrancelha etc.,
    mas não gera sangue sempre.
  */

  if (
    profile ===
    'blunt'
  ) {
    chance =
      damage >= 4
        ? 30
        : damage >= 2
          ? 15
          : 5

    bodyIncrease = 1

    clothesIncrease = 1
  }

  /*
    ========================================
    SOCO / CHUTE
    ========================================
  */

  if (
    profile ===
    'unarmed'
  ) {
    chance =
      damage >= 5
        ? 20
        : damage >= 3
          ? 10
          : 3

    bodyIncrease = 1

    clothesIncrease = 0
  }

  /*
    ========================================
    OUTROS ATAQUES
    ========================================
  */

  if (
    profile ===
    'other'
  ) {
    chance =
      damage >= 4
        ? 20
        : 5

    bodyIncrease = 1

    clothesIncrease = 1
  }

  chance =
    clamp(
      chance,
      0,
      95
    )

  const roll =
    randomPercent()

  /*
    Não houve respingo.
  */

  if (
    roll >= chance
  ) {
    return {
      game,

      splattered:
        false,

      level:
        0,

      chance,

      roll,

      log:
        null,
    }
  }

  const severity =
    Math.max(
      bodyIncrease,
      clothesIncrease
    )

  const updatedGame =
    applyBloodLevel({
      game,

      bodyIncrease,

      clothesIncrease,
    })

  let text =
    'Parte do sangue do ferimento atinge você.'

  if (
    severity >= 2
  ) {
    text =
      'O ferimento provoca um forte respingo de sangue, atingindo sua pele e suas roupas.'
  }

  return {
    game:
      updatedGame,

    splattered:
      true,

    level:
      severity,

    chance,

    roll,

    log: {
      type:
        'blood-splatter',

      text,
    },
  }
}

export default {
  applyAttackerBloodSplatter,
}