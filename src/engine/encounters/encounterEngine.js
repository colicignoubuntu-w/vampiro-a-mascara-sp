import {
  getPoliceTravelModifier,
} from '../consequences/consequenceEngine'

function randomPercent() {
  return (
    Math.random() *
    100
  )
}

function clamp(
  value,
  min,
  max
) {
  return Math.max(
    min,
    Math.min(
      max,
      value
    )
  )
}

function getStreetwise(
  game
) {
  return (
    game.abilities
      ?.streetwise ?? 0
  )
}

function getWits(
  game
) {
  return (
    game.attributes
      ?.mental
      ?.wits ?? 1
  )
}

function getPoliceAttention(
  game
) {
  return Number(
    game.masquerade
      ?.policeAttention ?? 0
  )
}

function getEvidenceCount(
  game
) {
  const evidence =
    Array.isArray(
      game.masquerade
        ?.evidence
    )
      ? game.masquerade.evidence
      : []

  return evidence.filter(
    (item) =>
      item.active !== false
  ).length
}

/* ==========================================
   EVENTOS DE VIAGEM
========================================== */

export function rollTravelEncounter(
  game,
  travel
) {
  const streetwise =
    getStreetwise(game)

  const wits =
    getWits(game)

  const awarenessReduction =
    streetwise * 2 +
    wits

  /* ======================================
     RISCO DE ASSALTO
  ====================================== */

  const robberyChance =
    clamp(
      travel.risk.street *
        3 -
        awarenessReduction,
      0,
      80
    )

  /*
    Primeiro verificamos eventos
    de rua.
  */

  const robberyRoll =
    randomPercent()

  if (
    robberyRoll <
    robberyChance
  ) {
    return {
      type:
        'robbery',

      title:
        'Abordagem na rua',

      severity:
        travel.destination
          .danger,

      text:
        'Algumas pessoas parecem ter escolhido você como alvo. Seu instinto percebe a mudança de comportamento antes que elas terminem de cercá-lo.',
    }
  }

  /* ======================================
     POLÍCIA
  ====================================== */

  const policeAttention =
    getPoliceAttention(game)

  const persistentModifier =
    getPoliceTravelModifier(
      game
    )

  const evidence =
    getEvidenceCount(game)

  let policeChance =
    travel.risk.police *
      2.2

  policeChance +=
    persistentModifier

  /*
    Evidência aumenta discretamente
    a chance de você estar no radar.
  */

  policeChance +=
    evidence * 2

  policeChance =
    clamp(
      policeChance,
      0,
      85
    )

  const policeRoll =
    randomPercent()

  if (
    policeRoll <
    policeChance
  ) {
    /*
      Atenção baixa:
      abordagem normal.
    */

    if (
      policeAttention <= 2
    ) {
      return {
        type:
          'police',

        title:
          'Abordagem policial',

        severity:
          travel.destination
            .policePresence,

        text:
          'Uma viatura reduz a velocidade. Os policiais parecem ter escolhido você para uma abordagem de rotina.',
      }
    }

    /*
      Atenção moderada.
    */

    if (
      policeAttention <= 5
    ) {
      return {
        type:
          'police',

        title:
          'Policiais observam você',

        severity:
          policeAttention,

        text:
          'Uma viatura passa devagar demais. O policial no banco do passageiro olha para você duas vezes antes de pedir ao motorista que encoste.',
      }
    }

    /*
      Atenção alta.
    */

    if (
      policeAttention <= 8
    ) {
      return {
        type:
          'policeRecognition',

        title:
          'Você pode estar no radar',

        severity:
          policeAttention,

        text:
          'Uma viatura encosta. Antes mesmo de sair do carro, um dos policiais olha uma informação no celular e depois diretamente para você.',
      }
    }

    /*
      Atenção crítica.
    */

    return {
      type:
        'policeInvestigation',

      title:
        'Investigação policial',

      severity:
        policeAttention,

      text:
        'Duas viaturas aparecem quase juntas. Isso não parece mais uma coincidência nem uma abordagem de rotina.',
    }
  }

  return null
}