import {
  useState,
} from 'react'

import {
  getReactionChoices,
  getReactionResultText,
  resolveReactionChoice,
} from '../../engine/masquerade/masqueradeEngine'

import './MasqueradeEvent.css'

export default function MasqueradeEvent({
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
    chosenChoice,
    setChosenChoice,
  ] = useState(null)

  const choices =
    getReactionChoices(
      event
    )

  function choose(
    choice
  ) {
    const result =
      resolveReactionChoice(
        game,
        event,
        choice
      )

    setChosenChoice(
      choice
    )

    setResolution(
      result
    )

    onGameChange(
      result.game
    )
  }

  return (
    <div className="masquerade-event-overlay">
      <section className="masquerade-event-modal">
        <span className="masquerade-event-kicker">
          MÁSCARA
        </span>

        <h2>
          {event.title}
        </h2>

        {!resolution && (
          <>
            <p className="masquerade-event-text">
              {event.text}
            </p>

            {event.dialogue && (
              <blockquote>
                {
                  event.dialogue
                }
              </blockquote>
            )}

            <div className="masquerade-event-choices">
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
                    <span>
                      {
                        index + 1
                      }
                    </span>

                    <strong>
                      {
                        choice.label
                      }
                    </strong>
                  </button>
                )
              )}
            </div>
          </>
        )}

        {resolution && (
          <>
            {resolution.roll && (
              <div className="masquerade-roll">
                <div className="masquerade-roll-info">
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

                <div className="masquerade-dice">
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
              </div>
            )}

            <div
              className={
                `masquerade-resolution ${resolution.result}`
              }
            >
              <span>
                {
                  resolution.result ===
                  'success'
                    ? 'SUCESSO'
                    : resolution.result ===
                        'botch'
                      ? 'FALHA CRÍTICA'
                      : 'FALHA'
                }
              </span>

              <p>
                {
                  getReactionResultText(
                    event,
                    chosenChoice,
                    resolution.result
                  )
                }
              </p>
            </div>

            <Consequences
              resolution={
                resolution
              }
            />

            <button
              type="button"
              className="primary-button masquerade-continue"
              onClick={() =>
                onClose(
                  resolution
                )
              }
            >
              Continuar
            </button>
          </>
        )}
      </section>
    </div>
  )
}

function Consequences({
  resolution,
}) {
  const c =
    resolution
      ?.consequences

  if (!c) {
    return null
  }

  const hasAny =
    c.suspicionGain > 0 ||
    c.policeGain > 0 ||
    c.violationGain > 0 ||
    c.witnessAdded ||
    c.evidenceAdded

  if (!hasAny) {
    return (
      <div className="masquerade-consequences clean">
        <strong>
          CONSEQUÊNCIAS
        </strong>

        <p>
          Nenhuma consequência
          persistente adicional.
        </p>
      </div>
    )
  }

  return (
    <div className="masquerade-consequences">
      <strong>
        CONSEQUÊNCIAS
      </strong>

      {c.suspicionGain >
        0 && (
        <p>
          Suspeita:
          {' '}
          {c.suspicionBefore}
          {' → '}
          {c.suspicionAfter}
        </p>
      )}

      {c.policeGain >
        0 && (
        <p>
          Atenção policial:
          {' '}
          {c.policeBefore}
          {' → '}
          {c.policeAfter}
        </p>
      )}

      {c.violationGain >
        0 && (
        <p>
          Violações da Máscara:
          {' '}
          {c.violationsBefore}
          {' → '}
          {c.violationsAfter}
        </p>
      )}

      {c.witnessAdded && (
        <p>
          Nova testemunha registrada.
        </p>
      )}

      {c.evidenceAdded && (
        <p>
          Nova evidência registrada.
        </p>
      )}
    </div>
  )
}