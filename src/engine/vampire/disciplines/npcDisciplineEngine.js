const CLAN_DISCIPLINES = {
  brujah: [
    'celerity',
    'potency',
    'presence',
  ],

  gangrel: [
    'animalism',
    'fortitude',
    'protean',
  ],

  malkavian: [
    'auspex',
    'dementia',
    'obfuscate',
  ],

  nosferatu: [
    'animalism',
    'obfuscate',
    'potency',
  ],

  toreador: [
    'auspex',
    'celerity',
    'presence',
  ],

  tremere: [
    'auspex',
    'dominate',
    'thaumaturgy',
  ],

  ventrue: [
    'dominate',
    'fortitude',
    'presence',
  ],
}

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

function normalizeClan(
  value
) {
  return String(
    value ?? ''
  )
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      ''
    )
}

function normalizeGeneration(
  value
) {
  if (
    typeof value ===
    'number'
  ) {
    return Math.max(
      1,
      Math.round(
        value
      )
    )
  }

  const match =
    String(
      value ?? ''
    ).match(
      /\d+/
    )

  if (!match) {
    return 13
  }

  return Math.max(
    1,
    safeNumber(
      match[0],
      13
    )
  )
}

export function getNpcClanDisciplines(
  clan
) {
  return (
    CLAN_DISCIPLINES[
      normalizeClan(
        clan
      )
    ] ?? []
  )
}

export function getNpcGeneration(
  enemy
) {
  return normalizeGeneration(
    enemy?.generation
  )
}

export function getNpcDisciplineLevel(
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

export function isNpcDisciplineInClan(
  enemy,
  discipline
) {
  return getNpcClanDisciplines(
    enemy?.clan
  ).includes(
    discipline
  )
}

/*
  ========================================
  LIMITES POR GERAÇÃO

  Este motor usa uma escala prática para
  limitar nível máximo de Disciplina dos
  NPCs no jogo.

  Quanto menor a geração, maior o teto.
  ========================================
*/

export function getNpcGenerationDisciplineCap(
  generation
) {
  const gen =
    normalizeGeneration(
      generation
    )

  if (gen <= 5) {
    return 8
  }

  if (gen <= 7) {
    return 7
  }

  if (gen === 8) {
    return 6
  }

  if (gen === 9) {
    return 5
  }

  if (gen === 10) {
    return 5
  }

  if (gen === 11) {
    return 4
  }

  if (gen === 12) {
    return 3
  }

  return 3
}

export function normalizeNpcDisciplines(
  enemy
) {
  const generation =
    getNpcGeneration(
      enemy
    )

  const cap =
    getNpcGenerationDisciplineCap(
      generation
    )

  const disciplines = {}

  for (
    const [
      id,
      rawLevel,
    ] of Object.entries(
      enemy?.disciplines ??
      {}
    )
  ) {
    disciplines[id] =
      Math.max(
        0,
        Math.min(
          cap,
          safeNumber(
            rawLevel,
            0
          )
        )
      )
  }

  return disciplines
}

/*
  ========================================
  PASSIVAS
  ========================================
*/

export function getNpcPotencyBonus(
  enemy
) {
  const level =
    getNpcDisciplineLevel(
      enemy,
      'potency'
    )

  return {
    active:
      level > 0,

    level,

    strengthBonus:
      level,

    damageBonus:
      level,
  }
}

export function getNpcFortitudeBonus(
  enemy
) {
  const level =
    getNpcDisciplineLevel(
      enemy,
      'fortitude'
    )

  return {
    active:
      level > 0,

    level,

    soakBonus:
      level,

    aggravatedSoakDice:
      level,
  }
}

export function getNpcCelerityLevel(
  enemy
) {
  return getNpcDisciplineLevel(
    enemy,
    'celerity'
  )
}

/*
  ========================================
  DOMINAÇÃO E GERAÇÃO

  Regra do motor:
  um vampiro não consegue Dominar outro
  vampiro de geração menor que a sua.

  Exemplo:

  atacante 10ª geração
  alvo 8ª geração
  → alvo é mais antigo/forte
  → Dominação falha automaticamente.
  ========================================
*/

export function canNpcDominateTarget({
  attacker,
  target,
}) {
  const dominate =
    getNpcDisciplineLevel(
      attacker,
      'dominate'
    )

  if (
    dominate <= 0
  ) {
    return {
      allowed: false,

      reason:
        'O NPC não possui Dominação.',
    }
  }

  const targetIsVampire =
    Boolean(
      target?.vampire ||
      target?.type ===
        'vampire'
    )

  if (!targetIsVampire) {
    return {
      allowed: true,

      reason:
        null,
    }
  }

  const attackerGeneration =
    normalizeGeneration(
      attacker?.generation
    )

  const targetGeneration =
    normalizeGeneration(
      target?.generation
    )

  if (
    targetGeneration <
    attackerGeneration
  ) {
    return {
      allowed: false,

      reason:
        `Dominação não afeta um vampiro de geração mais baixa (${targetGeneration}ª).`,
    }
  }

  return {
    allowed: true,

    reason:
      null,
  }
}

/*
  ========================================
  FORÇA EFETIVA
  ========================================
*/

export function getNpcEffectiveStrength(
  enemy
) {
  const base =
    Math.max(
      0,
      safeNumber(
        enemy?.attributes
          ?.strength,
        0
      )
    )

  const potency =
    getNpcPotencyBonus(
      enemy
    )

  return {
    base,

    potency:
      potency.strengthBonus,

    total:
      base +
      potency.strengthBonus,
  }
}

/*
  ========================================
  ABSORÇÃO
  ========================================
*/

export function getNpcDisciplineSoak(
  enemy,
  damageType
) {
  const fortitude =
    getNpcFortitudeBonus(
      enemy
    )

  if (
    damageType ===
    'aggravated'
  ) {
    return {
      fortitude:
        fortitude.aggravatedSoakDice,

      total:
        fortitude.aggravatedSoakDice,
    }
  }

  return {
    fortitude:
      fortitude.soakBonus,

    total:
      fortitude.soakBonus,
  }
}

/*
  ========================================
  CELERIDADE — ESTADO DE TURNO DO NPC
  ========================================
*/

export function activateNpcCelerity(
  enemy
) {
  const level =
    getNpcCelerityLevel(
      enemy
    )

  if (
    level <= 0
  ) {
    return enemy
  }

  return {
    ...enemy,

    status: {
      ...(enemy.status ??
        {}),

      celerityActive:
        true,

      celerityLevel:
        level,

      celerityActionsRemaining:
        level,
    },
  }
}

export function consumeNpcCelerityAction(
  enemy
) {
  const current =
    Math.max(
      0,
      safeNumber(
        enemy?.status
          ?.celerityActionsRemaining,
        0
      )
    )

  if (
    current <= 0
  ) {
    return enemy
  }

  return {
    ...enemy,

    status: {
      ...(enemy.status ??
        {}),

      celerityActionsRemaining:
        current - 1,

      celerityActive:
        current - 1 > 0,
    },
  }
}

export function resetNpcCelerityForRound(
  enemy
) {
  const level =
    getNpcCelerityLevel(
      enemy
    )

  if (
    !enemy?.status
      ?.celerityActive ||
    level <= 0
  ) {
    return enemy
  }

  return {
    ...enemy,

    status: {
      ...(enemy.status ??
        {}),

      celerityLevel:
        level,

      celerityActionsRemaining:
        level,
    },
  }
}

/*
  ========================================
  PERFIL COMPLETO
  ========================================
*/

export function getNpcDisciplineCombatProfile(
  enemy
) {
  const generation =
    getNpcGeneration(
      enemy
    )

  return {
    clan:
      normalizeClan(
        enemy?.clan
      ),

    generation,

    cap:
      getNpcGenerationDisciplineCap(
        generation
      ),

    clanDisciplines:
      getNpcClanDisciplines(
        enemy?.clan
      ),

    disciplines:
      normalizeNpcDisciplines(
        enemy
      ),

    potency:
      getNpcPotencyBonus(
        enemy
      ),

    fortitude:
      getNpcFortitudeBonus(
        enemy
      ),

    celerity:
      {
        level:
          getNpcCelerityLevel(
            enemy
          ),

        active:
          Boolean(
            enemy?.status
              ?.celerityActive
          ),

        actionsRemaining:
          Math.max(
            0,
            safeNumber(
              enemy?.status
                ?.celerityActionsRemaining,
              0
            )
          ),
      },
  }
}

export {
  CLAN_DISCIPLINES,
}

export default {
  CLAN_DISCIPLINES,

  getNpcClanDisciplines,
  getNpcGeneration,
  getNpcDisciplineLevel,

  isNpcDisciplineInClan,

  getNpcGenerationDisciplineCap,
  normalizeNpcDisciplines,

  getNpcPotencyBonus,
  getNpcFortitudeBonus,
  getNpcCelerityLevel,

  canNpcDominateTarget,

  getNpcEffectiveStrength,
  getNpcDisciplineSoak,

  activateNpcCelerity,
  consumeNpcCelerityAction,
  resetNpcCelerityForRound,

  getNpcDisciplineCombatProfile,
}