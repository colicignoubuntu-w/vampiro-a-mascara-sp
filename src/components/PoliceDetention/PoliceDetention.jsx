import {
  useState,
} from 'react'

import {
  activateBlush,
  isBlushActive,
} from '../../engine/blush/blushEngine'

import {
  addMinutes,
} from '../../utils/gameState'
import {
  audioEngine,
} from '../../engine/audio/audioEngine'

import './PoliceDetention.css'

function rollD10() {
  return (
    Math.floor(
      Math.random() * 10
    ) + 1
  )
}

function rollPool(
  pool,
  difficulty
) {
  const safePool =
    Math.max(
      1,
      Number(pool) || 1
    )

  const dice =
    Array.from({
      length:
        safePool,
    }).map(
      () => rollD10()
    )

  const rawSuccesses =
    dice.filter(
      (die) =>
        die >= difficulty
    ).length

  const ones =
    dice.filter(
      (die) =>
        die === 1
    ).length

  const successes =
    Math.max(
      0,
      rawSuccesses -
        ones
    )

  let result =
    'failure'

  if (
    successes > 0
  ) {
    result =
      'success'
  } else if (
    ones > 0 &&
    rawSuccesses === 0
  ) {
    result =
      'botch'
  }

  return {
    dice,

    pool:
      safePool,

    difficulty,

    successes,

    ones,

    result,
  }
}

export default function PoliceDetention({
  game,
  onGameChange,
  onClose,
}) {
  const [
    stage,
    setStage,
  ] = useState(
    'initial'
  )

  const [
    message,
    setMessage,
  ] = useState(null)

  const [
    roll,
    setRoll,
  ] = useState(null)

  const blushActive =
    isBlushActive(
      game
    )

  function update(
    updatedGame
  ) {
    onGameChange(
      updatedGame
    )
  }

  function advance(
    minutes
  ) {
    return {
      ...game,

      world:
        addMinutes(
          game.world,
          minutes
        ),
    }
  }

  /* ==========================================
     RUBOR
  ========================================== */

  function useBlush() {
    const result =
      activateBlush(
        game
      )

    if (
      !result.success
    ) {
      setMessage(
        'Você não possui sangue suficiente para ativar o Rubor do Sangue.'
      )

      return
    }

    update(
      result.game
    )

    setMessage(
      `Você força vitae para a pele. O corpo recupera calor, cor e movimentos mais humanos. O efeito deve durar cerca de ${result.duration} minutos.`
    )
  }

  /* ==========================================
     COOPERAR
  ========================================== */

  function cooperate() {
    /*
      Sem Rubor:
      existe chance de o policial
      perceber temperatura e sinais
      corporais estranhos.
    */

    if (
      !blushActive
    ) {
      const perceptionRoll =
        Math.random() *
        100

      if (
        perceptionRoll < 65
      ) {
        setStage(
          'noticed'
        )

        setMessage(
          'Durante a revista, o policial segura seu pulso por alguns segundos. A expressão dele muda. Sua pele está fria demais.'
        )

        return
      }
    }

    let updatedGame =
      advance(10)

    updatedGame = {
      ...updatedGame,

      flags: {
        ...(updatedGame.flags ??
          {}),

        detainedByPolice:
          false,
      },

      masquerade: {
        ...(updatedGame.masquerade ??
          {}),

        policeAttention:
          Math.max(
            0,
            Number(
              updatedGame.masquerade
                ?.policeAttention ??
                0
            ) - 1
          ),
      },
    }

    update(
      updatedGame
    )

    setStage(
      'released'
    )

    setMessage(
      'A revista não encontra nada que justifique prolongar a detenção. Depois de alguns minutos, eles permitem que você siga.'
    )
  }

  /* ==========================================
     MENTIR SOBRE A CONDIÇÃO
  ========================================== */

  function lieAboutBody() {
    audioEngine.playSfx(
      'dice_roll'
    )

    const manipulation =
      game.attributes
        ?.social
        ?.manipulation ??
      1

    const subterfuge =
      game.abilities
        ?.subterfuge ??
      0

    const test =
      rollPool(
        manipulation +
          subterfuge,
        8
      )

    setRoll(
      test
    )

    if (
      test.result ===
      'success'
    ) {
      let updatedGame =
        advance(5)

      updatedGame = {
        ...updatedGame,

        flags: {
          ...(updatedGame.flags ??
            {}),

          detainedByPolice:
            false,
        },
      }

      update(
        updatedGame
      )

      setStage(
        'released'
      )

      setMessage(
        'Você inventa uma explicação médica convincente o suficiente para transformar a estranheza em constrangimento. O policial decide não insistir.'
      )

      return
    }

    if (
      test.result ===
      'botch'
    ) {
      const updatedGame = {
        ...advance(5),

        masquerade: {
          ...(game.masquerade ??
            {}),

          suspicion:
            Math.min(
              10,
              Number(
                game.masquerade
                  ?.suspicion ??
                  0
              ) + 2
            ),

          policeAttention:
            Math.min(
              10,
              Number(
                game.masquerade
                  ?.policeAttention ??
                  0
              ) + 2
            ),

          violations:
            Number(
              game.masquerade
                ?.violations ??
                0
            ),

          witnesses:
            game.masquerade
              ?.witnesses ??
            [],

          evidence:
            game.masquerade
              ?.evidence ??
            [],

          exposure:
            Number(
              game.masquerade
                ?.exposure ??
                0
            ),
        },
      }

      update(
        updatedGame
      )

      setStage(
        'station'
      )

      setMessage(
        'A história não convence. Agora os policiais querem levá-lo para a delegacia e descobrir exatamente quem você é.'
      )

      return
    }

    const updatedGame = {
      ...advance(5),

      masquerade: {
        ...(game.masquerade ??
          {}),

        policeAttention:
          Math.min(
            10,
            Number(
              game.masquerade
                ?.policeAttention ??
                0
            ) + 1
          ),
      },
    }

    update(
      updatedGame
    )

    setStage(
      'station'
    )

    setMessage(
      'O policial não acredita. A conversa termina com a ordem para entrar na viatura.'
    )
  }

  /* ==========================================
     FUGIR
  ========================================== */

  function flee() {
    audioEngine.playSfx(
      'dice_roll'
    )

    const dexterity =
      game.attributes
        ?.physical
        ?.dexterity ??
      1

    const athletics =
      game.abilities
        ?.athletics ??
      0

    const test =
      rollPool(
        dexterity +
          athletics,
        8
      )

    setRoll(
      test
    )

    if (
      test.result ===
      'success'
    ) {
      let updatedGame =
        advance(8)

      updatedGame = {
        ...updatedGame,

        flags: {
          ...(updatedGame.flags ??
            {}),

          detainedByPolice:
            false,

          escapedPolice:
            true,
        },

        masquerade: {
          ...(updatedGame.masquerade ??
            {}),

          suspicion:
            Math.min(
              10,
              Number(
                updatedGame.masquerade
                  ?.suspicion ??
                  0
              ) + 1
            ),

          policeAttention:
            Math.min(
              10,
              Number(
                updatedGame.masquerade
                  ?.policeAttention ??
                  0
              ) + 3
            ),
        },
      }

      update(
        updatedGame
      )

      setStage(
        'escaped'
      )

      setMessage(
        'Você aproveita uma abertura e corre. Quando os policiais percebem, você já virou a esquina. Sirenes começam a ecoar atrás de você.'
      )

      return
    }

    let updatedGame =
      advance(5)

    updatedGame = {
      ...updatedGame,

      masquerade: {
        ...(updatedGame.masquerade ??
          {}),

        policeAttention:
          Math.min(
            10,
            Number(
              updatedGame.masquerade
                ?.policeAttention ??
                0
            ) + 3
          ),
      },
    }

    update(
      updatedGame
    )

    setStage(
      'station'
    )

    setMessage(
      'Você tenta escapar, mas é contido antes de ganhar distância suficiente. Agora ninguém considera aquilo uma simples abordagem.'
    )
  }

  /* ==========================================
     DELEGACIA
  ========================================== */

  function goToStation() {
    let updatedGame =
      advance(25)

    updatedGame = {
      ...updatedGame,

      world: {
        ...updatedGame.world,

        location: {
          id:
            'police_station',

          name:
            'Delegacia',

          district:
            'São Paulo',
        },
      },

      flags: {
        ...(updatedGame.flags ??
          {}),

        atPoliceStation:
          true,

        detainedByPolice:
          true,
      },
    }

    update(
      updatedGame
    )

    onClose()
  }

  return (
    <div className="police-detention-overlay">
      <section className="police-detention-modal">
        <span className="police-detention-kicker">
          DETENÇÃO
        </span>

        <h2>
          Revista policial
        </h2>

        {stage ===
          'initial' && (
          <>
            <p>
              Um dos policiais pede
              para você colocar as
              mãos sobre o veículo.
              O outro começa a
              verificar seus dados.
            </p>

            <blockquote>
              — Fica tranquilo e
              coopera. Documento.
            </blockquote>

            <Status
              game={game}
            />

            {message && (
              <div className="police-detention-message">
                {message}
              </div>
            )}

            <div className="police-detention-actions">
              {!blushActive && (
                <button
                  type="button"
                  onClick={
                    useBlush
                  }
                >
                  <strong>
                    Ativar Rubor do Sangue
                  </strong>

                  <span>
                    Gastar 1 ponto de sangue
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={
                  cooperate
                }
              >
                <strong>
                  Cooperar com a revista
                </strong>

                <span>
                  Deixar o policial concluir
                </span>
              </button>

              <button
                type="button"
                onClick={
                  flee
                }
              >
                <strong>
                  Tentar fugir
                </strong>

                <span>
                  Destreza + Esportes
                </span>
              </button>
            </div>
          </>
        )}

        {stage ===
          'noticed' && (
          <>
            <p>
              O policial ainda está
              segurando seu pulso.
            </p>

            <blockquote>
              — Que porra... você está
              gelado. Você tá passando
              mal?
            </blockquote>

            <Status
              game={game}
            />

            {message && (
              <div className="police-detention-message">
                {message}
              </div>
            )}

            <div className="police-detention-actions">
              {!blushActive && (
                <button
                  type="button"
                  onClick={
                    useBlush
                  }
                >
                  <strong>
                    Ativar Rubor do Sangue
                  </strong>

                  <span>
                    Gastar 1 ponto de sangue
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={
                  lieAboutBody
                }
              >
                <strong>
                  Inventar uma condição médica
                </strong>

                <span>
                  Manipulação + Lábia
                </span>
              </button>

              <button
                type="button"
                onClick={
                  flee
                }
              >
                <strong>
                  Fugir
                </strong>

                <span>
                  Destreza + Esportes
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setStage(
                    'station'
                  )
                }
              >
                <strong>
                  Continuar cooperando
                </strong>

                <span>
                  Aceitar ser levado
                </span>
              </button>
            </div>
          </>
        )}

        {stage ===
          'station' && (
          <>
            <p>
              As algemas fecham nos
              seus pulsos.
            </p>

            <blockquote>
              — A gente resolve isso
              na delegacia.
            </blockquote>

            {message && (
              <div className="police-detention-message danger">
                {message}
              </div>
            )}

            <button
              type="button"
              className="primary-button police-detention-continue"
              onClick={
                goToStation
              }
            >
              Ir para a delegacia
            </button>
          </>
        )}

        {stage ===
          'released' && (
          <>
            <div className="police-detention-result success">
              <strong>
                LIBERADO
              </strong>

              <p>
                {message}
              </p>
            </div>

            <button
              type="button"
              className="primary-button police-detention-continue"
              onClick={
                onClose
              }
            >
              Continuar
            </button>
          </>
        )}

        {stage ===
          'escaped' && (
          <>
            <div className="police-detention-result danger">
              <strong>
                FUGA
              </strong>

              <p>
                {message}
              </p>
            </div>

            <button
              type="button"
              className="primary-button police-detention-continue"
              onClick={
                onClose
              }
            >
              Continuar
            </button>
          </>
        )}

        {roll && (
          <div className="police-detention-dice">
            {roll.dice.map(
              (
                die,
                index
              ) => (
                <span
                  key={
                    index
                  }
                  className={
                    die >=
                    roll.difficulty
                      ? 'success'
                      : die ===
                          1
                        ? 'one'
                        : ''
                  }
                >
                  {die}
                </span>
              )
            )}
          </div>
        )}
      </section>
    </div>
  )
}

function Status({
  game,
}) {
  const blush =
    isBlushActive(
      game
    )

  return (
    <div className="police-detention-status">
      <div>
        <span>
          Sangue
        </span>

        <strong>
          {
            game.blood
              ?.current ?? 0
          }
          /
          {
            game.blood
              ?.maximum ?? 0
          }
        </strong>
      </div>

      <div>
        <span>
          Rubor
        </span>

        <strong>
          {blush
            ? 'Ativo'
            : 'Inativo'}
        </strong>
      </div>

      <div>
        <span>
          Polícia
        </span>

        <strong>
          {
            game.masquerade
              ?.policeAttention ??
            0
          }
          /10
        </strong>
      </div>
    </div>
  )
}
