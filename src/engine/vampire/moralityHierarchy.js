/*
  ============================================
  HIERARQUIA DE HUMANIDADE
  ============================================

  Quanto MAIOR a Humanidade, maior a
  sensibilidade moral do personagem.

  Um ato exige teste quando:

  nível do ato <= Humanidade atual

  Exemplo:

  Humanidade 7
  - roubo, nível 7 -> testa
  - assassinato, nível 3 -> testa

  Humanidade 4
  - roubo, nível 7 -> não testa
  - assassinato, nível 3 -> testa

  Isso representa a erosão progressiva
  da moral humana.
*/

export const HUMANITY_HIERARCHY = {
  selfishThought: {
    id: 'selfishThought',

    level: 10,

    label:
      'Impulso egoísta',

    description:
      'Pensamentos ou impulsos profundamente egoístas que entram em conflito com uma consciência humana extremamente elevada.',
  },

  minorSelfishAct: {
    id: 'minorSelfishAct',

    level: 9,

    label:
      'Ato egoísta menor',

    description:
      'Usar alguém, agir deliberadamente por puro egoísmo ou causar um prejuízo pequeno por interesse próprio.',
  },

  accidentalInjury: {
    id: 'accidentalInjury',

    level: 8,

    label:
      'Ferir alguém por negligência',

    description:
      'Outra pessoa sofre porque o personagem foi irresponsável, imprudente ou indiferente às consequências.',
  },

  theft: {
    id: 'theft',

    level: 7,

    label:
      'Roubo ou exploração deliberada',

    description:
      'Tomar aquilo que pertence a outra pessoa ou explorá-la conscientemente para benefício próprio.',
  },

  seriousNegligence: {
    id: 'seriousNegligence',

    level: 6,

    label:
      'Dano grave por irresponsabilidade',

    description:
      'Uma escolha imprudente provoca sofrimento grave, risco sério ou consequências que poderiam ter sido evitadas.',
  },

  intentionalHarm: {
    id: 'intentionalHarm',

    level: 5,

    label:
      'Crueldade deliberada',

    description:
      'Ferir, humilhar ou causar sofrimento conscientemente quando havia outra opção.',
  },

  passionateViolence: {
    id: 'passionateViolence',

    level: 4,

    label:
      'Violência grave',

    description:
      'Ferir gravemente ou colocar uma vida em risco por raiva, vingança, descontrole ou interesse próprio.',
  },

  killing: {
    id: 'killing',

    level: 3,

    label:
      'Matar',

    description:
      'Tirar deliberadamente uma vida ou continuar uma ação sabendo que ela provavelmente causará a morte.',
  },

  casualKilling: {
    id: 'casualKilling',

    level: 2,

    label:
      'Matar sem consideração',

    description:
      'Tratar uma vida como descartável, matar por conveniência ou demonstrar indiferença completa à morte causada.',
  },

  monstrousAct: {
    id: 'monstrousAct',

    level: 1,

    label:
      'Ato monstruoso',

    description:
      'Crueldade extrema realizada sem remorso, prazer deliberado no sofrimento ou comportamento que quase abandona por completo qualquer moral humana.',
  },
}

/*
  Retorna um item da hierarquia.
*/

export function getHumanityViolation(
  violationId
) {
  if (!violationId) {
    return null
  }

  return (
    HUMANITY_HIERARCHY[
      violationId
    ] ?? null
  )
}

/*
  Determina se o ato ainda viola
  a moral do personagem.

  Exemplo:

  Humanidade 7
  Killing nível 3
  3 <= 7 = testa.

  Humanidade 4
  Theft nível 7
  7 <= 4 = falso.
*/

export function shouldCheckHumanity({
  humanity,
  violationLevel,
}) {
  const currentHumanity =
    Number(
      humanity ?? 0
    )

  const level =
    Number(
      violationLevel ?? 0
    )

  if (
    currentHumanity <= 0 ||
    level <= 0
  ) {
    return false
  }

  return (
    level <=
    currentHumanity
  )
}

/*
  Podemos usar a diferença entre
  Humanidade e gravidade do ato
  para variar a dificuldade.

  Quanto mais monstruoso o ato em
  comparação à Humanidade atual,
  mais difícil preservar a moral.
*/

export function getDegenerationDifficulty({
  humanity,
  violationLevel,
}) {
  const currentHumanity =
    Math.max(
      1,
      Number(
        humanity ?? 1
      )
    )

  const level =
    Math.max(
      1,
      Number(
        violationLevel ?? 1
      )
    )

  const difference =
    currentHumanity -
    level

  /*
    Ato exatamente no limite moral.
  */

  if (
    difference <= 0
  ) {
    return 6
  }

  /*
    Quanto mais abaixo do nível atual,
    mais grave é o ato.
  */

  if (
    difference === 1
  ) {
    return 7
  }

  if (
    difference === 2
  ) {
    return 8
  }

  return 9
}

/*
  Descobre automaticamente qual
  violação ocorreu usando as flags
  que nosso jogo já possui.
*/

export function detectViolationFromGame(
  game
) {
  const flags =
    game?.flags ?? {}

  /*
    Assassinato deliberado durante
    alimentação voluntária.
  */

  if (
    flags.killedHumanByFeeding
  ) {
    return {
      ...HUMANITY_HIERARCHY
        .killing,

      source:
        'killedHumanByFeeding',

      title:
        'Você matou enquanto se alimentava',

      memory:
        'Você sentiu a pulsação enfraquecer e ainda assim continuou bebendo.',
    }
  }

  /*
    Morte possível durante Frenesi.

    Por enquanto tratamos como violência
    grave. Quando confirmarmos que a
    vítima realmente morreu, podemos
    mudar dinamicamente para killing.
  */

  if (
    flags.possibleVictimDeath
  ) {
    return {
      ...HUMANITY_HIERARCHY
        .passionateViolence,

      source:
        'possibleVictimDeath',

      title:
        'A Besta pode ter levado alguém longe demais',

      memory:
        'As lembranças retornam em fragmentos: sangue, medo e alguém tentando escapar.',
    }
  }

  /*
    Ataque extremamente violento.
  */

  if (
    flags.violentAssault
  ) {
    return {
      ...HUMANITY_HIERARCHY
        .passionateViolence,

      source:
        'violentAssault',

      title:
        'Você causou violência grave',

      memory:
        'A raiva passou, mas as marcas do que você fez continuam ali.',
    }
  }

  /*
    Alimentação que deixa a pessoa
    perto da morte.
  */

  if (
    flags.endangeredHumanByFeeding
  ) {
    return {
      ...HUMANITY_HIERARCHY
        .intentionalHarm,

      source:
        'endangeredHumanByFeeding',

      title:
        'Você quase matou alguém para se alimentar',

      memory:
        'Você percebeu o corpo ficando fraco em seus braços.',
    }
  }

  /*
    Alimentação excessiva sem morte.
  */

  if (
    flags.seriouslyDrainedVictim
  ) {
    return {
      ...HUMANITY_HIERARCHY
        .seriousNegligence,

      source:
        'seriouslyDrainedVictim',

      title:
        'Você levou uma vítima longe demais',

      memory:
        'A vítima mal conseguia permanecer em pé quando você terminou.',
    }
  }

  /*
    Flag manual.

    Isso permite que cenas futuras
    determinem diretamente a violação:

    moralityViolation: 'theft'
  */

  if (
    flags.moralityViolation
  ) {
    const violation =
      getHumanityViolation(
        flags.moralityViolation
      )

    if (violation) {
      return {
        ...violation,

        source:
          'moralityViolation',

        title:
          flags.moralityViolationTitle ??
          violation.label,

        memory:
          flags.moralityViolationMemory ??
          violation.description,
      }
    }
  }

  return null
}