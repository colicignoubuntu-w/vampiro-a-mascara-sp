import {
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  createPortal,
} from 'react-dom'

import {
  RELATIONSHIP_NPCS,
} from '../../data/npcs/relationships/index.js'

import {
  relationshipPresentation,
} from '../../engine/relationships/relationshipModel'

import {
  relationshipAvailability,
  relationshipChoiceReason,
  relationshipState,
  performRelationshipChoice,
  prepareRelationshipTest,
  rollRelationshipTest,
  resolveRelationshipTest,
} from '../../engine/relationships/relationshipEngine'

import {
  reconcileRelationships,
  relationshipMinutes,
} from '../../engine/relationships/relationshipClock'

import {
  formatCalendarDate,
} from '../../engine/time/timeEngine'

import './Relationships.css'

const date = minutes =>
  `${formatCalendarDate({
    day:
      Math.floor(
        minutes / 1440
      ) + 1,
  })} · ${String(
    Math.floor(
      minutes / 60
    ) % 24
  ).padStart(
    2,
    '0'
  )}:${String(
    minutes % 60
  ).padStart(
    2,
    '0'
  )}`

function sceneBackground(
  scene
) {
  const place =
    String(
      scene?.place ??
      ''
    )
      .toLowerCase()

  if (
    place.includes(
      'último gole'
    ) ||
    place.includes(
      'ultimo gole'
    )
  ) {
    return '/images/locations/ultimo-gole/main.jpg'
  }

  if (
    place.includes(
      'vesuvius'
    )
  ) {
    return '/images/locations/vesuvius.jpg'
  }

  if (
    place.includes(
      'asylum'
    )
  ) {
    return '/images/locations/asylum.jpg'
  }

  if (
    place.includes(
      'pinheiros'
    )
  ) {
    return '/images/locations/pinheiros.jpg'
  }

  return null
}

function TestPanel({
  pending,
  roll,
  onRoll,
  onContinue,
  onCancel,
}) {
  const result =
    roll?.result ===
    'success'
      ? 'Sucesso'
      : roll?.result ===
          'botch'
        ? 'Falha crítica'
        : 'Falha'

  return (
    <section className="relationships-test relationships-test-story">
      <small>
        TESTE DE RELAÇÃO
      </small>

      <h3>
        {pending.label}
      </h3>

      <p>
        {pending.traitLabel}
        :
        {' '}
        <strong>
          {pending.pool}
        </strong>

        {' · '}

        Dificuldade:
        {' '}

        <strong>
          {pending.difficulty}
        </strong>
      </p>

      {!roll ? (
        <div className="relationships-story-choices">
          <button
            type="button"
            onClick={
              onRoll
            }
          >
            Rolar teste
          </button>

          <button
            type="button"
            onClick={
              onCancel
            }
          >
            Cancelar
          </button>
        </div>
      ) : (
        <>
          <div
            className="relationships-test-dice"
            aria-label={
              `Dados: ${roll.dice.join(
                ', '
              )}`
            }
          >
            {roll.dice.map(
              (
                die,
                index
              ) => (
                <span
                  key={
                    `${die}:${index}`
                  }
                >
                  {die}
                </span>
              )
            )}
          </div>

          <p
            className={
              roll.result ===
              'success'
                ? 'relationships-result'
                : 'relationships-alert'
            }
            role="status"
          >
            <strong>
              {result}
            </strong>

            {' · '}

            {roll.successes}
            {' '}
            sucesso
            {
              roll.successes ===
              1
                ? ''
                : 's'
            }
          </p>

          <button
            type="button"
            className="relationships-story-continue"
            onClick={
              onContinue
            }
          >
            Continuar
          </button>
        </>
      )}
    </section>
  )
}

function RelationshipScene({
  npc,
  state,
  scene,
  current,
  selected,
  pendingTest,
  testRoll,
  error,
  onChoose,
  onRoll,
  onContinue,
  onCancelTest,
  onBack,
  onClose,
}) {
  const background =
    sceneBackground(
      scene
    )

  return (
    <section
      className="relationships-story-scene"
      style={
        background
          ? {
              '--relationships-scene-background':
                `url("${background}")`,
            }
          : undefined
      }
    >
      <div className="relationships-story-background" />
      <div className="relationships-story-overlay" />

      <header className="relationships-story-top">
        <button
          type="button"
          className="relationships-story-back"
          onClick={
            onBack
          }
        >
          ← Diário
        </button>

        <span>
          {scene.place}
        </span>

        <button
          type="button"
          className="relationships-story-close"
          onClick={
            onClose
          }
          aria-label="Fechar"
        >
          ×
        </button>
      </header>

      {npc.portrait && (
        <img
          className="relationships-story-character"
          src={
            npc.portrait
          }
          alt=""
          onError={(
            event
          ) => {
            event.currentTarget.hidden =
              true
          }}
        />
      )}

      <div className="relationships-story-content">
        <div className="relationships-story-heading">
          <span>
            RELACIONAMENTO
          </span>

          <h1>
            {scene.title}
          </h1>

          <small>
            {npc.name}
          </small>
        </div>

        <div className="relationships-story-narration">
          {scene.text.map(
            (
              paragraph,
              index
            ) => (
              <p
                key={
                  `${state.node}:${index}`
                }
              >
                {paragraph}
              </p>
            )
          )}
        </div>

        {state.journal.length >
          0 && (
          <div className="relationships-story-last-result">
            {
              state.journal
                .at(-1)
                .text
            }
          </div>
        )}

        {pendingTest ? (
          <TestPanel
            pending={
              pendingTest
            }
            roll={
              testRoll
            }
            onRoll={
              onRoll
            }
            onContinue={
              onContinue
            }
            onCancel={
              onCancelTest
            }
          />
        ) : (
          <div className="relationships-story-choices">
            {scene.choices.map(
              choice => {
                const unavailable =
                  relationshipChoiceReason(
                    current,
                    selected,
                    choice
                  )

                return (
                  <div
                    className="relationships-story-choice-wrap"
                    key={
                      choice.id
                    }
                  >
                    <button
                      type="button"
                      disabled={
                        Boolean(
                          unavailable
                        )
                      }
                      onClick={() =>
                        onChoose(
                          choice
                        )
                      }
                    >
                      {choice.test && (
                        <strong>
                          [
                          {
                            choice
                              .test
                              .label ??
                            'Teste'
                          }
                          ]
                          {' '}
                        </strong>
                      )}

                      <span>
                        {choice.text}
                      </span>

                      <small>
                        {
                          choice.minutes ??
                          15
                        }
                        {' '}
                        min
                      </small>
                    </button>

                    {unavailable && (
                      <small className="relationships-story-unavailable">
                        {
                          unavailable
                        }
                      </small>
                    )}
                  </div>
                )
              }
            )}
          </div>
        )}

        {error && (
          <p
            className="relationships-alert relationships-story-error"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    </section>
  )
}

export default function Relationships({
  game,
  onChange,
  blocked,
}) {
  const [
    open,
    setOpen,
  ] = useState(
    false
  )

  const [
    selected,
    setSelected,
  ] = useState(
    null
  )

  const [
    error,
    setError,
  ] = useState(
    ''
  )

  const [
    pendingTest,
    setPendingTest,
  ] = useState(
    null
  )

  const [
    testRoll,
    setTestRoll,
  ] = useState(
    null
  )

  const dialog =
    useRef(
      null
    )

  const current =
    reconcileRelationships(
      game
    )

  const now =
    relationshipMinutes(
      current.world
    )

  const available =
    Object.keys(
      RELATIONSHIP_NPCS
    ).filter(
      id =>
        !relationshipAvailability(
          current,
          id
        )
    )

  const npc =
    RELATIONSHIP_NPCS[
      selected
    ]

  const state =
    npc &&
    relationshipState(
      current,
      selected
    )

  const presentation =
    state
      ? relationshipPresentation(
          state
        )
      : null

  const scene =
    npc?.scenes[
      state?.node
    ]

  const reason =
    npc &&
    relationshipAvailability(
      current,
      selected
    )

  const interactiveScene =
    Boolean(
      npc &&
      state &&
      scene &&
      !state.completed &&
      !reason
    )

  const emergency =
    Object.values(
      current.relationships ??
      {}
    ).some(
      relationship =>
        relationship.deadlineAt ||
        (
          relationship.flags?.dead &&
          !relationship.completed
        )
    )

  useEffect(
    () => {
      if (
        !open ||
        blocked
      ) {
        return undefined
      }

      const element =
        dialog.current

      if (
        !element?.open
      ) {
        element?.showModal()
      }

      return () => {
        if (
          element?.open
        ) {
          element.close()
        }
      }
    },
    [
      open,
      blocked,
    ]
  )

  useEffect(
    () => {
      setPendingTest(
        null
      )

      setTestRoll(
        null
      )

      setError(
        ''
      )
    },
    [
      selected,
      state?.node,
    ]
  )

  function choose(
    choice
  ) {
    if (blocked) {
      return
    }

    try {
      if (
        choice.test
      ) {
        const prepared =
          prepareRelationshipTest(
            game,
            selected,
            state.node,
            choice.id
          )

        setPendingTest(
          prepared
        )

        setTestRoll(
          null
        )

        setError(
          ''
        )

        return
      }

      onChange(
        performRelationshipChoice(
          game,
          selected,
          state.node,
          choice.id
        )
      )

      setError(
        ''
      )
    } catch (
      err
    ) {
      setError(
        err.message
      )
    }
  }

  function rollTest() {
    try {
      setTestRoll(
        rollRelationshipTest(
          game,
          pendingTest
        )
      )

      setError(
        ''
      )
    } catch (
      err
    ) {
      setError(
        err.message
      )
    }
  }

  function continueTest() {
    try {
      onChange(
        resolveRelationshipTest(
          game,
          pendingTest,
          testRoll
        )
      )

      setPendingTest(
        null
      )

      setTestRoll(
        null
      )

      setError(
        ''
      )
    } catch (
      err
    ) {
      setError(
        err.message
      )
    }
  }

  function cancelTest() {
    if (testRoll) {
      return
    }

    setPendingTest(
      null
    )

    setError(
      ''
    )
  }

  function closeAll() {
    setSelected(
      null
    )

    setPendingTest(
      null
    )

    setTestRoll(
      null
    )

    setError(
      ''
    )

    setOpen(
      false
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={() =>
          setOpen(
            true
          )
        }
        aria-haspopup="dialog"
      >
        Relações

        {available.length >
          0
          ? ` (${available.length})`
          : ''}

        {emergency
          ? ' · Alerta'
          : ''}
      </button>

      {open &&
        !blocked &&
        createPortal(
          <dialog
            ref={
              dialog
            }
            className={[
              'relationships-dialog',
              interactiveScene
                ? 'relationships-dialog-story-mode'
                : '',
            ]
              .filter(
                Boolean
              )
              .join(
                ' '
              )}
            onCancel={(
              event
            ) => {
              event.preventDefault()

              closeAll()
            }}
            onClose={() =>
              setOpen(
                false
              )
            }
            aria-labelledby="relationships-title"
          >
            {interactiveScene ? (
              <RelationshipScene
                npc={
                  npc
                }
                state={
                  state
                }
                scene={
                  scene
                }
                current={
                  current
                }
                selected={
                  selected
                }
                pendingTest={
                  pendingTest
                }
                testRoll={
                  testRoll
                }
                error={
                  error
                }
                onChoose={
                  choose
                }
                onRoll={
                  rollTest
                }
                onContinue={
                  continueTest
                }
                onCancelTest={
                  cancelTest
                }
                onBack={() =>
                  setSelected(
                    null
                  )
                }
                onClose={
                  closeAll
                }
              />
            ) : (
              <div className="relationships-diary-shell">
                <header>
                  <div>
                    <small>
                      PESSOAS DA NOITE
                    </small>

                    <h2 id="relationships-title">
                      Encontros e relações
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={
                      closeAll
                    }
                  >
                    Fechar
                  </button>
                </header>

                <p>
                  Encontre as pessoas nos locais indicados. Escolhas, limites, testes e tempo mudam os próximos encontros.
                </p>

                {emergency && (
                  <p
                    className="relationships-alert"
                    role="status"
                  >
                    Há uma atualização urgente na história de Clara. Consulte o diário dela.
                  </p>
                )}

                <nav aria-label="Personagens">
                  {Object.values(
                    RELATIONSHIP_NPCS
                  ).map(
                    person => (
                      <button
                        key={
                          person.id
                        }
                        type="button"
                        aria-pressed={
                          selected ===
                          person.id
                        }
                        onClick={() => {
                          setSelected(
                            person.id
                          )

                          setError(
                            ''
                          )
                        }}
                      >
                        {
                          person.name.split(
                            ' '
                          )[0]
                        }

                        {
                          available.includes(
                            person.id
                          )
                            ? ' · Aqui'
                            : ''
                        }
                      </button>
                    )
                  )}
                </nav>

                {!npc && (
                  <div className="relationships-cards">
                    {Object.values(
                      RELATIONSHIP_NPCS
                    ).map(
                      person => (
                        <button
                          type="button"
                          key={
                            person.id
                          }
                          onClick={() =>
                            setSelected(
                              person.id
                            )
                          }
                        >
                          <img
                            src={
                              person.portrait
                            }
                            alt=""
                          />

                          <strong>
                            {
                              person.name
                            }
                          </strong>

                          <span>
                            {
                              person.role
                            }
                          </span>
                        </button>
                      )
                    )}
                  </div>
                )}

                {npc && (
                  <article>
                    <div className="relationships-profile">
                      <img
                        src={
                          npc.portrait
                        }
                        alt={
                          `Retrato de ${npc.name}`
                        }
                      />

                      <div>
                        <h3>
                          {npc.name}
                        </h3>

                        <p>
                          {npc.age}
                          {' '}
                          anos ·
                          {' '}
                          {npc.role}
                        </p>

                        {state.journal.length >
                          0 &&
                          presentation && (
                          <dl>
                            <div>
                              <dt>
                                Relação
                              </dt>

                              <dd>
                                {
                                  presentation.status
                                }
                              </dd>
                            </div>

                            <div>
                              <dt>
                                Estado emocional
                              </dt>

                              <dd>
                                {
                                  presentation.mood
                                }
                              </dd>
                            </div>

                            <div>
                              <dt>
                                Afeto
                              </dt>

                              <dd>
                                {
                                  presentation.affection
                                }
                              </dd>
                            </div>

                            <div>
                              <dt>
                                Confiança
                              </dt>

                              <dd>
                                {
                                  presentation.trust
                                }
                              </dd>
                            </div>

                            <div>
                              <dt>
                                Segurança
                              </dt>

                              <dd>
                                {
                                  presentation.safety
                                }
                              </dd>
                            </div>

                            {state.contact
                              ?.known && (
                              <div>
                                <dt>
                                  Contato
                                </dt>

                                <dd>
                                  {
                                    state.contact
                                      .blocked
                                      ? 'Bloqueado'
                                      : 'Número conhecido'
                                  }
                                </dd>
                              </div>
                            )}

                            {presentation
                              .bloodBond >
                              0 && (
                              <div>
                                <dt>
                                  Laço de Sangue
                                </dt>

                                <dd>
                                  {
                                    presentation.bloodBond
                                  }
                                  /3
                                </dd>
                              </div>
                            )}
                          </dl>
                        )}

                        {presentation
                          ?.bloodBond >
                          0 && (
                          <p>
                            O Laço de Sangue é influência sobrenatural. Ele não mede felicidade, confiança nem afeto genuíno.
                          </p>
                        )}
                      </div>
                    </div>

                    {state.deadlineAt && (
                      <p
                        className="relationships-alert"
                        role="status"
                      >
                        Ameaça ativa até
                        {' '}
                        {
                          date(
                            state.deadlineAt
                          )
                        }
                        . Faltam
                        {' '}
                        {
                          Math.max(
                            0,
                            Math.ceil(
                              (
                                state.deadlineAt -
                                now
                              ) /
                                60
                            )
                          )
                        }
                        {' '}
                        horas. Ajudar Clara a se proteger não exige um romance.
                      </p>
                    )}

                    {state.completed ? (
                      <section>
                        <h3>
                          Desfecho
                        </h3>

                        <p>
                          {
                            state.ending
                          }
                        </p>
                      </section>
                    ) : reason ? (
                      <section>
                        <h3>
                          Próximo encontro
                        </h3>

                        <p>
                          {
                            scene?.place ??
                            'Local ainda não definido'
                          }
                        </p>

                        <p>
                          {reason}
                        </p>

                        {state.readyAt >
                          now && (
                          <p>
                            Disponível a partir de
                            {' '}
                            {
                              date(
                                state.readyAt
                              )
                            }
                            . O calendário continua avançando quando você viaja, trabalha ou dorme.
                          </p>
                        )}
                      </section>
                    ) : null}

                    {error && (
                      <p
                        className="relationships-alert"
                        role="alert"
                      >
                        {error}
                      </p>
                    )}

                    {state.journal.length >
                      0 && (
                      <details>
                        <summary>
                          Diário de encontros (
                          {
                            state.journal.length
                          }
                          )
                        </summary>

                        {[
                          ...state.journal,
                        ]
                          .reverse()
                          .map(
                            (
                              entry,
                              index
                            ) => (
                              <section
                                className="relationships-entry"
                                key={
                                  `${entry.id}:${index}`
                                }
                              >
                                <small>
                                  {
                                    date(
                                      entry.at
                                    )
                                  }
                                </small>

                                <h4>
                                  {
                                    entry.title
                                  }
                                </h4>

                                <p>
                                  {
                                    entry.text
                                  }
                                </p>

                                {entry.test && (
                                  <small>
                                    {
                                      entry.test.label
                                    }
                                    :
                                    {' '}
                                    {
                                      entry.test.result ===
                                      'success'
                                        ? 'sucesso'
                                        : entry.test.result ===
                                            'botch'
                                          ? 'falha crítica'
                                          : 'falha'
                                    }
                                    {' · '}
                                    {
                                      entry.test.successes
                                    }
                                    {' '}
                                    sucesso
                                    {
                                      entry.test.successes ===
                                      1
                                        ? ''
                                        : 's'
                                    }
                                  </small>
                                )}
                              </section>
                            )
                          )}
                      </details>
                    )}
                  </article>
                )}
              </div>
            )}
          </dialog>,
          document.body
        )}
    </>
  )
}
