import {
  getWeapon,
} from '../../../data/items'

function safeNumber(value, fallback = 0) {
  const parsed = Number(value)
  return Number.isNaN(parsed) ? fallback : parsed
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function isVampire(enemy) {
  return Boolean(
    enemy?.vampire ||
    enemy?.type === 'vampire'
  )
}

function getHealthRatio(enemy) {
  const health = enemy?.health ?? {}
  const maximum = Math.max(1, safeNumber(health.maximum, 7))
  const damage =
    safeNumber(health.bashing, 0) +
    safeNumber(health.lethal, 0) +
    safeNumber(health.aggravated, 0)

  return clamp(
    1 - damage / maximum,
    0,
    1
  )
}

function getBloodRatio(enemy) {
  const maximum =
    Math.max(
      1,
      safeNumber(
        enemy?.blood?.maximum,
        10
      )
    )

  return clamp(
    safeNumber(
      enemy?.blood?.current,
      maximum
    ) / maximum,
    0,
    1
  )
}

function getDistance(combat) {
  return (
    combat?.distance ??
    combat?.environment?.distance ??
    'close'
  )
}

function getWeaponData(enemy) {
  return (
    getWeapon(
      enemy?.weaponId ??
      'fists'
    ) ??
    getWeapon('fists')
  )
}

function getLoadedAmmo(enemy, weapon) {
  if (
    weapon?.category !==
    'firearm'
  ) {
    return null
  }

  return Math.max(
    0,
    safeNumber(
      enemy?.ammo?.loaded,
      weapon?.ammunition?.magazine ??
        0
    )
  )
}

function getReserveAmmo(enemy) {
  return Math.max(
    0,
    safeNumber(
      enemy?.ammo?.reserve,
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
      enemy?.disciplines?.[discipline],
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
  if (!scores[id]) {
    scores[id] = {
      id,
      score: 0,
      reasons: [],
    }
  }

  scores[id].score += score

  if (reason) {
    scores[id].reasons.push(
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
    combat.status !== 'active'
  ) {
    return []
  }

  const enemy = combat.enemy
  const scores = {}

  const vampire =
    isVampire(enemy)

  const healthRatio =
    getHealthRatio(enemy)

  const bloodRatio =
    getBloodRatio(enemy)

  const distance =
    getDistance(combat)

  const personality =
    enemy.combatPersonality ??
    'balanced'

  const frenzy =
    enemy?.status?.frenzy

  const weapon =
    getWeaponData(enemy)

  const firearm =
    weapon?.category ===
    'firearm'

  const loadedAmmo =
    getLoadedAmmo(
      enemy,
      weapon
    )

  const reserveAmmo =
    getReserveAmmo(enemy)

  const controlsGrapple =
    Boolean(
      combat?.grapple?.active &&
      combat?.grapple?.controller ===
        'enemy'
    )

  /*
    Frenesi tem prioridade absoluta.
  */

  if (frenzy?.active) {
    if (
      frenzy.type === 'fear'
    ) {
      return [
        {
          id: 'escape',
          score: 999,
          reasons: [
            'Rötschreck força fuga.',
          ],
        },
      ]
    }

    if (
      vampire &&
      bloodRatio <= 0.3
    ) {
      return [
        {
          id:
            controlsGrapple
              ? 'bite'
              : 'grapple',

          score: 999,

          reasons: [
            controlsGrapple
              ? 'A presa está dominada e a Besta quer vitae.'
              : 'A Besta quer agarrar a presa para beber.',
          ],
        },
      ]
    }

    return [
      {
        id: 'melee',
        score: 900,
        reasons: [
          'Frenesi violento elimina cautela.',
        ],
      },
    ]
  }

  /*
    Sobrevivência.
  */

  if (
    healthRatio <= 0.2
  ) {
    addScore(
      scores,
      'escape',
      personality ===
        'aggressive'
        ? 25
        : 75,
      'Ferimentos críticos.'
    )
  }

  /*
    Arma de fogo.
  */

  if (firearm) {
    if (
      loadedAmmo <= 0 &&
      reserveAmmo > 0
    ) {
      addScore(
        scores,
        'reload',
        100,
        'Arma descarregada.'
      )
    }

    if (
      loadedAmmo > 0
    ) {
      addScore(
        scores,
        'shoot',
        distance === 'far'
          ? 70
          : distance === 'medium'
            ? 55
            : 30,
        'Arma de fogo disponível.'
      )
    }

    if (
      loadedAmmo <= 0 &&
      reserveAmmo <= 0
    ) {
      addScore(
        scores,
        'melee',
        65,
        'Sem munição.'
      )
    }
  }

  /*
    Distância.
  */

  if (
    distance === 'close'
  ) {
    addScore(
      scores,
      'melee',
      35,
      'Curta distância.'
    )

    addScore(
      scores,
      'grapple',
      18,
      'O alvo está ao alcance.'
    )
  } else if (
    !firearm ||
    loadedAmmo <= 0
  ) {
    addScore(
      scores,
      'advance',
      45,
      'Precisa reduzir a distância.'
    )
  }

  /*
    Vampiros.
  */

  if (vampire) {
    if (controlsGrapple) {
      addScore(
        scores,
        'bite',
        bloodRatio <= 0.5
          ? 85
          : 40,
        'O alvo já está agarrado.'
      )
    } else if (
      bloodRatio <= 0.35 &&
      distance === 'close'
    ) {
      addScore(
        scores,
        'grapple',
        75,
        'Fome severa incentiva alimentação.'
      )
    }

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
        35,
        'Celeridade aumenta a pressão ofensiva.'
      )
    }

    if (
      getDisciplineLevel(
        enemy,
        'protean'
      ) >= 2 &&
      !enemy?.status
        ?.feralClaws &&
      distance === 'close'
    ) {
      addScore(
        scores,
        'discipline_feral_claws',
        48,
        'Garras da Besta aumentam a letalidade.'
      )
    }

    if (
      getDisciplineLevel(
        enemy,
        'presence'
      ) >= 2 &&
      healthRatio <= 0.55
    ) {
      addScore(
        scores,
        'discipline_dread_gaze',
        42,
        'Olhar Aterrorizante pode encerrar o confronto.'
      )
    }

    if (
      getDisciplineLevel(
        enemy,
        'dominate'
      ) >= 1
    ) {
      addScore(
        scores,
        'discipline_dominate',
        28,
        'Dominação pode neutralizar o oponente.'
      )
    }
  }

  /*
    Personalidade.
  */

  if (
    personality === 'aggressive'
  ) {
    addScore(
      scores,
      'melee',
      25,
      'Perfil agressivo.'
    )

    addScore(
      scores,
      'grapple',
      12,
      'Perfil agressivo.'
    )
  }

  if (
    personality === 'coward'
  ) {
    addScore(
      scores,
      'escape',
      35,
      'Perfil covarde.'
    )
  }

  if (
    personality === 'ranged'
  ) {
    addScore(
      scores,
      'shoot',
      25,
      'Prefere combate à distância.'
    )
  }

  if (
    personality === 'predator'
  ) {
    addScore(
      scores,
      'grapple',
      25,
      'Predador prefere dominar a presa.'
    )

    if (vampire) {
      addScore(
        scores,
        'bite',
        controlsGrapple
          ? 30
          : 5,
        'Predador vampírico procura sangue.'
      )
    }
  }

  /*
    Segurança: sempre há ação ofensiva.
  */

  if (!firearm) {
    addScore(
      scores,
      'melee',
      20,
      'Ataque padrão.'
    )
  }

  return Object.values(scores)
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
    ranked.length === 0
  ) {
    return {
      id: 'melee',
      score: 0,
      reasons: [
        'Ação padrão.',
      ],
      ranked: [],
    }
  }

  const topScore =
    ranked[0].score

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
  return {
    enemy:
      combat?.enemy?.name ??
      null,

    healthRatio:
      getHealthRatio(
        combat?.enemy
      ),

    bloodRatio:
      getBloodRatio(
        combat?.enemy
      ),

    distance:
      getDistance(
        combat
      ),

    personality:
      combat?.enemy
        ?.combatPersonality ??
      'balanced',

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