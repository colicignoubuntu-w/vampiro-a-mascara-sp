import {
  useState,
} from 'react'

import {
  getPoliceChoices,
  getPoliceResultText,
  resolvePoliceChoice,
} from '../../engine/police/policeEngine'

import './PoliceEncounter.css'

export default function PoliceEncounter({
  game,
  event,
  onGameChange,
  onClose,
}) {
  const [
    resolution,
    setResolution,
  ] = useState(null)

  const [
    intelligence,
    setIntelligence,
  ] = useState(null)

  const choices =
    getPoliceChoices(
      game,
      event
    )

  function choose(
    choice
  ) {
    const result =
      resolvePoliceChoice(
        game,
        event,
        choice
      )

    onGameChange(
      result.game
    )

    setResolution(
      result
    )

    if (
      result.intelligence
    ) {
      setIntelligence(
        result.intelligence
      )
    }
  }

  function continueResult() {
    if (
      !resolution
    ) {
      return
    }

    /*
      Raciocínio + Manha apenas
      oferece informação.

      Depois o jogador ainda precisa
      decidir como lidar com a polícia.
    */

    if (
      resolution.choice.id ===
        'analyze' &&
      !resolution.encounterFinished
    ) {
      setResolution(
        null
      )

      return
    }

    onClose(
      resolution
    )
  }

  const police =
    Number(
      game.masquerade
        ?.policeAttention ?? 0
    )

  return (
    <div className="police-encounter-overlay">
      <section className="police-encounter-modal">
        <span className="police-encounter-kicker">
          POLÍCIA
        </span>

        <h2>
          {event.title}
        </h2>

        {!resolution && (
          <>
            <p className="police-encounter-description">
              {event.text}
            </p>

            <blockquote>
              — Boa noite.
              {' '}
              Documento.
              {' '}
              Quero saber o que
              aconteceu aqui.
            </blockquote>

            {intelligence && (
              <div className="police-intelligence">
                <span>
                  SUA LEITURA DA SITUAÇÃO
                </span>

                <p>
                  {intelligence}
                </p>
              </div>
            )}

            <div className="police-current-state">
              <div>
                <span>
                  Atenção policial
                </span>

                <strong>
                  {police}/10
                </strong>
              </div>

              <div>
                <span>
                  Suspeita
                </span>

                <strong>
                  {
                    game.masquerade
                      ?.suspicion ??
                    0
                  }
                  /10
                </strong>
              </div>
            </div>

            <div className="police-choice-list">
              {choices.map(
                (
                  choice,
                  index
                ) => (
                  <button
                    key={
                      choice.id
                    }
                    type="button"
                    onClick={() =>
                      choose(
                        choice
                      )
                    }
                  >
                    <span className="police-choice-number">
                      {
                        index + 1
                      }
                    </span>

                    <div>
                      <strong>
                        {
                          choice.label
                        }
                      </strong>

                      <small>
                        {
                          choice.description
                        }
                      </small>
                    </div>

                    {choice.type ===
                      'discipline' && (
                      <span className="police-discipline-tag">
                        DISCIPLINA
                      </span>
                    )}
                  </button>
                )
              )}
            </div>
          </>
        )}

        {resolution && (
          <>
            <div className="police-test-info">
              <span>
                {
                  resolution
                    .roll
                    .attributeLabel
                }
                {' + '}
                {
                  resolution
                    .roll
                    .abilityLabel
                }
              </span>

              <strong>
                {
                  resolution
                    .roll
                    .pool
                }
                {' '}
                dados
              </strong>

              <small>
                Dificuldade{' '}
                {
                  resolution
                    .roll
                    .difficulty
                }
              </small>
            </div>

            <div className="police-dice">
              {resolution
                .roll
                .dice
                .map(
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
                        resolution
                          .roll
                          .difficulty
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

            <div
              className={
                `police-result ${resolution.result}`
              }
            >
              <strong>
                {
                  resolution.detained
                    ? 'DETIDO'
                    : resolution.result ===
                        'success'
                      ? 'SUCESSO'
                      : resolution.result ===
                          'botch'
                        ? 'FALHA CRÍTICA'
                        : 'FALHA'
                }
              </strong>

              <p>
                {
                  getPoliceResultText(
                    resolution
                  )
                }
              </p>
            </div>

            <PoliceConsequences
              resolution={
                resolution
              }
            />

            <button
              type="button"
              className="primary-button police-continue"
              onClick={
                continueResult
              }
            >
              {resolution.choice.id ===
                'analyze' &&
              !resolution.encounterFinished
                ? 'Escolher como agir'
                : 'Continuar'}
            </button>
          </>
        )}
      </section>
    </div>
  )
}

function PoliceConsequences({
  resolution,
}) {
  const c =
    resolution
      ?.consequences

  if (!c) {
    return null
  }

  const policeChanged =
    c.policeBefore !==
    c.policeAfter

  const suspicionChanged =
    c.suspicionBefore !==
    c.suspicionAfter

  const violationsChanged =
    c.violationsBefore !==
    c.violationsAfter

  if (
    !policeChanged &&
    !suspicionChanged &&
    !violationsChanged
  ) {
    return (
      <div className="police-consequences clean">
        <span>
          CONSEQUÊNCIAS
        </span>

        <p>
          Nenhuma mudança persistente
          imediata.
        </p>
      </div>
    )
  }

  return (
    <div className="police-consequences">
      <span>
        CONSEQUÊNCIAS
      </span>

      {policeChanged && (
        <p>
          Atenção policial:
          {' '}
          {c.policeBefore}
          {' → '}
          {c.policeAfter}
        </p>
      )}

      {suspicionChanged && (
        <p>
          Suspeita:
          {' '}
          {c.suspicionBefore}
          {' → '}
          {c.suspicionAfter}
        </p>
      )}

      {violationsChanged && (
        <p>
          Violações da Máscara:
          {' '}
          {c.violationsBefore}
          {' → '}
          {c.violationsAfter}
        </p>
      )}

      {resolution.escaped && (
        <p>
          Você fugiu de uma abordagem
          policial.
        </p>
      )}

      {resolution.detained && (
        <p>
          Você foi detido pela polícia.
        </p>
      )}
    </div>
  )
}