import {
  getWeapon,
} from '../../../data/items'

import {
  getEnemyMovementScores,
  getEnemyPreferredDistance,
} from '../movementTacticsEngine'

function safeNumber(
  value,
  fallback = 0
) {
  const parsed =
    Number(value)

  return Number.isNaN(
    parsed
  )
    ? fallback
    : parsed
}

function clamp(
  value,
  min,
  max
) {
  return Math.min(
    max,
    Math.max(
      min,
      value
    )
  )
}

function isVampire(
  enemy
) {
  return Boolean(
    enemy?.vampire ||
    enemy?.type ===
      'vampire'
  )
}

function getHealthRatio(
  enemy
) {
  const health =
    enemy?.health ??
    {}

  const maximum =
    Math.max(
      1,
      safeNumber(
        health.maximum,
        7
      )
    )

  const damage =
    safeNumber(
      health.bashing,
      0
    ) +
    safeNumber(
      health.lethal,
      0
    ) +
    safeNumber(
      health.aggravated,
      0
    )

  return clamp(
    1 -
      damage /
        maximum,
    0,
    1
  )
}

function getBloodRatio(
  enemy
) {
  const maximum =
    Math.max(
      1,
      safeNumber(
        enemy?.blood
          ?.maximum,
        10
      )
    )

  const current =
    Math.max(
      0,
      safeNumber(
        enemy?.blood
          ?.current,
        maximum
      )
    )

  return clamp(
    current /
      maximum,
    0,
    1
  )
}

function getDistance(
  combat
) {
  return (
    combat?.distance ??
    combat?.environment
      ?.distance ??
    'close'
  )
}

function getWeaponData(
  enemy
) {
  /*
    Garras da Besta são tratadas
    como arma natural mesmo que não
    estejam no catálogo de itens.
  */

  if (
    enemy?.status
      ?.feralClaws
  ) {
    return {
      id:
        'feralClaws',

      name:
        'Garras da Besta',

      category:
        'natural',

      damageType:
        'aggravated',

      damageMode:
        'strength',

      damageBonus: 1,

      attackAbility:
        'brawl',
    }
  }

  return (
    getWeapon(
      enemy?.weaponId ??
      'fists'
    ) ??
    getWeapon(
      'fists'
    )
  )
}

function getLoadedAmmo(
  enemy,
  weapon
) {
  if (
    weapon?.category !==
    'firearm'
  ) {
    return null
  }

  return Math.max(
    0,
    safeNumber(
      enemy?.ammo
        ?.loaded,
      weapon?.ammunition
        ?.magazine ??
        0
    )
  )
}

function getReserveAmmo(
  enemy
) {
  return Math.max(
    0,
    safeNumber(
      enemy?.ammo
        ?.reserve,
      0
    )
  )
}

function getDisciplineLevel(
  enemy,
  discipline
) {
  return Math.max(
    0,
    safeNumber(
      enemy?.disciplines
        ?.[discipline],
      0
    )
  )
}

function addScore(
  scores,
  id,
  score,
  reason
) {
  if (
    !scores[id]
  ) {
    scores[id] = {
      id,

      score: 0,

      reasons: [],
    }
  }

  scores[id].score +=
    score

  if (reason) {
    scores[id]
      .reasons
      .push(
        reason
      )
  }
}

export function evaluateEnemyCombatActions(
  game,
  combat
) {
  if (
    !combat?.enemy ||
    combat.status !==
      'active'
  ) {
    return []
  }

  const enemy =
    combat.enemy

  const scores = {}

  const vampire =
    isVampire(
      enemy
    )

  const healthRatio =
    getHealthRatio(
      enemy
    )

  const bloodRatio =
    getBloodRatio(
      enemy
    )

  const distance =
    getDistance(
      combat
    )

  const preferredDistance =
    getEnemyPreferredDistance(
      combat
    )

  const movementScores =
    getEnemyMovementScores(
      combat
    )

  const personality =
    enemy
      .combatPersonality ??
    'balanced'

  const frenzy =
    enemy?.status
      ?.frenzy

  const weapon =
    getWeaponData(
      enemy
    )

  const firearm =
    weapon?.category ===
    'firearm'

  const loadedAmmo =
    getLoadedAmmo(
      enemy,
      weapon
    )

  const reserveAmmo =
    getReserveAmmo(
      enemy
    )

  const controlsGrapple =
    Boolean(
      combat?.grapple
        ?.active &&
      combat?.grapple
        ?.controller ===
        'enemy'
    )

  const enemyIsGrappled =
    Boolean(
      combat?.grapple
        ?.active &&
      combat?.grapple
        ?.controller ===
        'player'
    )

  /*
    ========================================
    FRENESI

    Frenesi ignora raciocínio tático.
    ========================================
  */

  if (
    frenzy?.active
  ) {
    if (
      frenzy.type ===
      'fear'
    ) {
      return [
        {
          id:
            'escape',

          score: 999,

          reasons: [
            'Rötschreck força fuga.',
          ],
        },
      ]
    }

    if (
      vampire &&
      bloodRatio <=
        0.3
    ) {
      if (
        controlsGrapple
      ) {
        return [
          {
            id:
              'bite',

            score: 999,

            reasons: [
              'A presa está dominada e a Besta quer vitae.',
            ],
          },
        ]
      }

      if (
        distance ===
        'close'
      ) {
        return [
          {
            id:
              'grapple',

            score: 999,

            reasons: [
              'A Besta quer agarrar a presa para beber.',
            ],
          },
        ]
      }

      return [
        {
          id:
            'advance',

          score: 999,

          reasons: [
            'A fome em frenesi força aproximação.',
          ],
        },
      ]
    }

    if (
      distance !==
      'close'
    ) {
      return [
        {
          id:
            'advance',

          score: 950,

          reasons: [
            'Frenesi violento força aproximação.',
          ],
        },
      ]
    }

    return [
      {
        id:
          'melee',

        score: 900,

        reasons: [
          'Frenesi violento elimina cautela.',
        ],
      },
    ]
  }

  /*
    ========================================
    AGARRÃO

    Um inimigo preso pelo jogador não
    deve tentar simplesmente correr.
    ========================================
  */

  if (
    enemyIsGrappled
  ) {
    addScore(
      scores,
      'melee',
      55,
      'Está agarrado e precisa reagir fisicamente.'
    )

    addScore(
      scores,
      'escape',
      25,
      'Tenta se libertar do controle.'
    )
  }

  /*
    ========================================
    SOBREVIVÊNCIA
    ========================================
  */

  if (
    healthRatio <=
    0.15
  ) {
    addScore(
      scores,
      'escape',
      personality ===
        'aggressive'
        ? 35
        : 100,
      'Ferimentos quase incapacitantes.'
    )
  } else if (
    healthRatio <=
    0.3
  ) {
    addScore(
      scores,
      'escape',
      personality ===
        'aggressive'
        ? 20
        : 65,
      'Ferimentos críticos.'
    )

    addScore(
      scores,
      'retreat',
      30,
      'Tenta criar espaço para sobreviver.'
    )
  }

  /*
    ========================================
    MOVIMENTO TÁTICO

    O motor separado define qual distância
    esse NPC prefere.
    ========================================
  */

  if (
    movementScores.advance >
    0
  ) {
    addScore(
      scores,
      'advance',
      movementScores.advance,
      `Distância preferida: ${preferredDistance}.`
    )
  }

  if (
    movementScores.retreat >
      0 &&
    !enemyIsGrappled
  ) {
    addScore(
      scores,
      'retreat',
      movementScores.retreat,
      `Distância preferida: ${preferredDistance}.`
    )
  }

  /*
    ========================================
    ARMA DE FOGO
    ========================================
  */

  if (firearm) {
    if (
      loadedAmmo <=
        0 &&
      reserveAmmo > 0
    ) {
      addScore(
        scores,
        'reload',
        100,
        'A arma está descarregada.'
      )
    }

    if (
      loadedAmmo > 0
    ) {
      if (
        distance ===
        'far'
      ) {
        addScore(
          scores,
          'shoot',
          65,
          'Possui arma de fogo e linha de tiro longa.'
        )
      }

      if (
        distance ===
        'medium'
      ) {
        addScore(
          scores,
          'shoot',
          75,
          'Distância média favorece disparos.'
        )
      }

      if (
        distance ===
        'close'
      ) {
        addScore(
          scores,
          'shoot',
          personality ===
            'ranged'
            ? 35
            : 25,
          'Ainda pode disparar a curta distância.'
        )
      }
    }

    if (
      loadedAmmo <=
        0 &&
      reserveAmmo <=
        0
    ) {
      addScore(
        scores,
        'melee',
        60,
        'Está sem munição.'
      )

      if (
        distance !==
        'close'
      ) {
        addScore(
          scores,
          'advance',
          60,
          'Sem munição, precisa aproximar-se.'
        )
      }
    }
  }

  /*
    ========================================
    CORPO A CORPO
    ========================================
  */

  if (
    distance ===
    'close'
  ) {
    addScore(
      scores,
      'melee',
      35,
      'O alvo está em curta distância.'
    )

    addScore(
      scores,
      'grapple',
      18,
      'O alvo está ao alcance para agarrar.'
    )
  } else if (
    !firearm
  ) {
    addScore(
      scores,
      'advance',
      55,
      'A arma atual exige aproximação.'
    )
  }

  /*
    ========================================
    VAMPIROS E FOME
    ========================================
  */

  if (vampire) {
    if (
      bloodRatio <=
      0.15
    ) {
      if (
        controlsGrapple
      ) {
        addScore(
          scores,
          'bite',
          120,
          'Fome crítica e presa já dominada.'
        )
      } else if (
        distance ===
        'close'
      ) {
        addScore(
          scores,
          'grapple',
          95,
          'Fome crítica: precisa capturar uma fonte de sangue.'
        )
      } else {
        addScore(
          scores,
          'advance',
          90,
          'Fome crítica força aproximação.'
        )
      }
    } else if (
      bloodRatio <=
      0.35
    ) {
      if (
        controlsGrapple
      ) {
        addScore(
          scores,
          'bite',
          85,
          'Pouca vitae e alvo já dominado.'
        )
      } else if (
        distance ===
        'close'
      ) {
        addScore(
          scores,
          'grapple',
          70,
          'Fome severa incentiva alimentação.'
        )
      } else {
        addScore(
          scores,
          'advance',
          50,
          'A fome incentiva aproximação.'
        )
      }
    }

    /*
      ========================================
      CELERIDADE
      ========================================
    */

    if (
      getDisciplineLevel(
        enemy,
        'celerity'
      ) > 0 &&
      !enemy?.status
        ?.celerityActive
    ) {
      addScore(
        scores,
        'discipline_celerity',
        personality ===
          'aggressive'
          ? 45
          : 35,
        'Celeridade concede vantagem de ações.'
      )
    }

    /*
      ========================================
      PROTEANISMO
      ========================================
    */

    if (
      getDisciplineLevel(
        enemy,
        'protean'
      ) >= 2 &&
      !enemy?.status
        ?.feralClaws
    ) {
      if (
        distance ===
        'close'
      ) {
        addScore(
          scores,
          'discipline_feral_claws',
          50,
          'Garras da Besta aumentam a letalidade corpo a corpo.'
        )
      } else if (
        personality ===
        'predator'
      ) {
        addScore(
          scores,
          'discipline_feral_claws',
          18,
          'Predador prepara as Garras antes de se aproximar.'
        )
      }
    }

    /*
      ========================================
      PRESENÇA
      ========================================
    */

    if (
      getDisciplineLevel(
        enemy,
        'presence'
      ) >= 2
    ) {
      let presenceScore =
        22

      if (
        healthRatio <=
        0.55
      ) {
        presenceScore +=
          25
      }

      if (
        personality ===
        'coward'
      ) {
        presenceScore +=
          15
      }

      addScore(
        scores,
        'discipline_dread_gaze',
        presenceScore,
        'Olhar Aterrorizante pode afastar ou neutralizar o adversário.'
      )
    }

    /*
      ========================================
      DOMINAÇÃO
      ========================================
    */

    if (
      getDisciplineLevel(
        enemy,
        'dominate'
      ) >= 1
    ) {
      let dominateScore =
        28

      if (
        personality ===
        'balanced'
      ) {
        dominateScore +=
          8
      }

      if (
        healthRatio <=
        0.5
      ) {
        dominateScore +=
          10
      }

      addScore(
        scores,
        'discipline_dominate',
        dominateScore,
        'Dominação pode neutralizar o adversário sem troca física.'
      )
    }
  }

  /*
    ========================================
    PERSONALIDADE — AGGRESSIVE
    ========================================
  */

  if (
    personality ===
    'aggressive'
  ) {
    if (
      distance ===
      'close'
    ) {
      addScore(
        scores,
        'melee',
        30,
        'Perfil agressivo favorece ataque direto.'
      )

      addScore(
        scores,
        'grapple',
        15,
        'Perfil agressivo aceita confronto físico.'
      )
    } else {
      addScore(
        scores,
        'advance',
        35,
        'Perfil agressivo tenta fechar distância.'
      )
    }

    addScore(
      scores,
      'retreat',
      -30,
      'Perfil agressivo evita recuar.'
    )

    addScore(
      scores,
      'escape',
      -25,
      'Perfil agressivo evita fugir.'
    )
  }

  /*
    ========================================
    PERSONALIDADE — RANGED
    ========================================
  */

  if (
    personality ===
    'ranged'
  ) {
    if (
      firearm &&
      loadedAmmo > 0
    ) {
      addScore(
        scores,
        'shoot',
        30,
        'Especialista em combate à distância.'
      )
    }

    if (
      distance ===
      'close'
    ) {
      addScore(
        scores,
        'retreat',
        55,
        'Especialista à distância quer sair do corpo a corpo.'
      )

      addScore(
        scores,
        'melee',
        -20,
        'Evita combate corpo a corpo.'
      )
    }

    if (
      distance ===
      'medium'
    ) {
      addScore(
        scores,
        'shoot',
        25,
        'Distância média é a posição ideal.'
      )
    }

    if (
      distance ===
      'far'
    ) {
      addScore(
        scores,
        'shoot',
        15,
        'Mantém distância segura.'
      )
    }
  }

  /*
    ========================================
    PERSONALIDADE — PREDATOR
    ========================================
  */

  if (
    personality ===
    'predator'
  ) {
    if (
      distance !==
      'close'
    ) {
      addScore(
        scores,
        'advance',
        45,
        'Predador busca proximidade com a presa.'
      )
    } else {
      addScore(
        scores,
        'grapple',
        30,
        'Predador prefere controlar fisicamente a presa.'
      )

      if (
        vampire &&
        controlsGrapple
      ) {
        addScore(
          scores,
          'bite',
          35,
          'Predador vampírico procura sangue.'
        )
      }
    }

    addScore(
      scores,
      'retreat',
      -25,
      'Predador evita abrir distância.'
    )
  }

  /*
    ========================================
    PERSONALIDADE — COWARD
    ========================================
  */

  if (
    personality ===
    'coward'
  ) {
    if (
      distance ===
      'close'
    ) {
      addScore(
        scores,
        'retreat',
        50,
        'Perfil covarde tenta criar distância.'
      )
    }

    if (
      healthRatio <=
      0.5
    ) {
      addScore(
        scores,
        'escape',
        50,
        'Ferimentos aumentam desejo de fugir.'
      )
    }

    if (
      firearm &&
      loadedAmmo > 0
    ) {
      addScore(
        scores,
        'shoot',
        15,
        'Prefere combater sem se aproximar.'
      )
    }
  }

  /*
    ========================================
    PERSONALIDADE — BALANCED
    ========================================
  */

  if (
    personality ===
    'balanced'
  ) {
    if (
      firearm &&
      distance ===
      'medium'
    ) {
      addScore(
        scores,
        'shoot',
        10,
        'Combate equilibrado favorece posição segura.'
      )
    }

    if (
      !firearm &&
      distance !==
      'close'
    ) {
      addScore(
        scores,
        'advance',
        20,
        'Precisa entrar no alcance da arma.'
      )
    }
  }

  /*
    ========================================
    EVITA MOVIMENTOS IMPOSSÍVEIS
    ========================================
  */

  if (
    distance ===
    'close'
  ) {
    if (
      scores.advance
    ) {
      scores.advance.score =
        -999

      scores.advance
        .reasons
        .push(
          'Já está na menor distância possível.'
        )
    }
  }

  if (
    distance ===
    'far'
  ) {
    if (
      scores.retreat
    ) {
      scores.retreat.score =
        -999

      scores.retreat
        .reasons
        .push(
          'Já está na maior distância possível.'
        )
    }
  }

  if (
    combat?.grapple
      ?.active
  ) {
    if (
      scores.retreat
    ) {
      scores.retreat.score =
        -999

      scores.retreat
        .reasons
        .push(
          'Agarrão impede recuo normal.'
        )
    }
  }

  /*
    ========================================
    SEGURANÇA

    Sempre deve existir pelo menos uma
    ação possível.
    ========================================
  */

  if (
    Object.keys(
      scores
    ).length === 0
  ) {
    addScore(
      scores,
      distance ===
        'close'
        ? 'melee'
        : 'advance',
      10,
      'Ação padrão.'
    )
  }

  return Object.values(
    scores
  )
    .filter(
      (action) =>
        action.score >
        -900
    )
    .sort(
      (a, b) =>
        b.score -
        a.score
    )
}

export function chooseEnemyCombatAction(
  game,
  combat
) {
  const ranked =
    evaluateEnemyCombatActions(
      game,
      combat
    )

  if (
    ranked.length ===
    0
  ) {
    return {
      id:
        getDistance(
          combat
        ) ===
        'close'
          ? 'melee'
          : 'advance',

      score: 0,

      reasons: [
        'Ação padrão.',
      ],

      ranked: [],
    }
  }

  /*
    Não escolhemos sempre exatamente
    o primeiro colocado.

    Qualquer ação até 8 pontos abaixo
    da melhor pode ser escolhida.

    Isso evita NPCs totalmente previsíveis.
  */

  const topScore =
    ranked[0]
      .score

  const candidates =
    ranked.filter(
      (entry) =>
        entry.score >=
        topScore - 8
    )

  const selected =
    candidates[
      Math.floor(
        Math.random() *
        candidates.length
      )
    ]

  return {
    ...selected,

    ranked,
  }
}

export function getEnemyAiDebug(
  game,
  combat
) {
  const enemy =
    combat?.enemy

  const weapon =
    getWeaponData(
      enemy
    )

  const movement =
    getEnemyMovementScores(
      combat
    )

  return {
    enemy:
      enemy?.name ??
      null,

    clan:
      enemy?.clan ??
      null,

    generation:
      enemy
        ?.generation ??
      null,

    personality:
      enemy
        ?.combatPersonality ??
      'balanced',

    healthRatio:
      getHealthRatio(
        enemy
      ),

    bloodRatio:
      getBloodRatio(
        enemy
      ),

    distance:
      getDistance(
        combat
      ),

    preferredDistance:
      getEnemyPreferredDistance(
        combat
      ),

    vampire:
      isVampire(
        enemy
      ),

    weapon:
      weapon?.id ??
      null,

    weaponName:
      weapon?.name ??
      null,

    loadedAmmo:
      getLoadedAmmo(
        enemy,
        weapon
      ),

    reserveAmmo:
      getReserveAmmo(
        enemy
      ),

    frenzy:
      enemy?.status
        ?.frenzy ??
      null,

    grapple: {
      active:
        Boolean(
          combat?.grapple
            ?.active
        ),

      controller:
        combat?.grapple
          ?.controller ??
        null,
    },

    movement,

    ranked:
      evaluateEnemyCombatActions(
        game,
        combat
      ),
  }
}

export default {
  evaluateEnemyCombatActions,
  chooseEnemyCombatAction,
  getEnemyAiDebug,
}