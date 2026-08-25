import {
  useMemo,
  useState,
} from 'react'

import {
  getQuestDefinition,
} from '../../data/quests/quests'

import {
  getQuestNarrativeText,
  getQuestProgress,
} from '../../engine/quests/questEngine'

import './QuestPanel.css'

const TABS = [
  {
    id: 'main',
    label: 'PRINCIPAIS',
  },
  {
    id: 'side',
    label: 'SECUNDÁRIAS',
  },
  {
    id: 'completed',
    label: 'CONCLUÍDAS',
  },
]

function filterQuestStates(
  game,
  tab
) {
  const states =
    Object.values(
      game?.quests ??
        {}
    )

  if (
    tab ===
      'completed'
  ) {
    return states.filter(
      (quest) =>
        quest.status ===
        'completed'
    )
  }

  return states.filter(
    (quest) => {
      if (
        quest.status !==
        'active'
      ) {
        return false
      }

      const definition =
        getQuestDefinition(
          quest.id
        )

      return (
        definition
          ?.category ===
        tab
      )
    }
  )
}

export default function QuestPanel({
  game,
  onClose,
}) {
  const [
    tab,
    setTab,
  ] =
    useState(
      'main'
    )

  const questStates =
    useMemo(
      () =>
        filterQuestStates(
          game,
          tab
        ),
      [
        game,
        tab,
      ]
    )

  const experience =
    game?.experience ??
    {}

  return (
    <div className="quest-overlay">
      <section className="quest-panel">
        <header className="quest-header">
          <div>
            <span>
              CRÔNICA
            </span>

            <h2>
              Missões
            </h2>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
          >
            ×
          </button>
        </header>

        <section className="quest-experience">
          <div>
            <span>
              EXPERIÊNCIA DISPONÍVEL
            </span>

            <strong>
              {
                experience.current ??
                0
              }
            </strong>
          </div>

          <div>
            <span>
              TOTAL ADQUIRIDO
            </span>

            <strong>
              {
                experience.earned ??
                (
                  (
                    experience.current ??
                    0
                  ) +
                  (
                    experience.spent ??
                    0
                  )
                )
              }
            </strong>
          </div>
        </section>

        <nav className="quest-tabs">
          {TABS.map(
            (item) => (
              <button
                key={
                  item.id
                }
                type="button"
                className={
                  tab ===
                  item.id
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  setTab(
                    item.id
                  )
                }
              >
                {
                  item.label
                }
              </button>
            )
          )}
        </nav>

        <div className="quest-list">
          {questStates.length ===
            0 && (
            <div className="quest-empty">
              Nenhuma missão
              nesta categoria.
            </div>
          )}

          {questStates.map(
            (
              quest
            ) => {
              const definition =
                getQuestDefinition(
                  quest.id
                )

              if (
                !definition
              ) {
                return null
              }

              const progress =
                getQuestProgress(
                  game,
                  quest.id
                )

              const narrative =
                getQuestNarrativeText(
                  game,
                  quest.id
                )

              return (
                <article
                  key={
                    quest.id
                  }
                  className={
                    `quest-card quest-card--${quest.status}`
                  }
                >
                  <div className="quest-card-header">
                    <div>
                      <span>
                        {
                          definition.category ===
                          'main'
                            ? 'MISSÃO PRINCIPAL'
                            : 'MISSÃO SECUNDÁRIA'
                        }
                      </span>

                      <h3>
                        {
                          definition.title
                        }
                      </h3>
                    </div>

                    <strong>
                      {
                        progress.completed
                      }
                      /
                      {
                        progress.total
                      }
                    </strong>
                  </div>

                  <p className="quest-description">
                    {
                      narrative
                    }
                  </p>

                  <div className="quest-progress">
                    <div>
                      <span
                        style={{
                          width:
                            `${progress.percent}%`,
                        }}
                      />
                    </div>

                    <small>
                      {
                        progress.percent
                      }
                      %
                    </small>
                  </div>

                  <div className="quest-objectives">
                    {definition.objectives.map(
                      (
                        objective
                      ) => {
                        const state =
                          quest.objectives
                            ?.[objective.id]

                        if (
                          !state?.revealed
                        ) {
                          return (
                            <div
                              key={
                                objective.id
                              }
                              className="quest-objective secret"
                            >
                              <span>
                                ?
                              </span>

                              <p>
                                Objetivo desconhecido
                              </p>
                            </div>
                          )
                        }

                        return (
                          <div
                            key={
                              objective.id
                            }
                            className={
                              [
                                'quest-objective',

                                state.completed
                                  ? 'completed'
                                  : '',

                                state.failed
                                  ? 'failed'
                                  : '',
                              ]
                                .filter(
                                  Boolean
                                )
                                .join(
                                  ' '
                                )
                            }
                          >
                            <span>
                              {
                                state.completed
                                  ? '✓'
                                  : state.failed
                                    ? '×'
                                    : '○'
                              }
                            </span>

                            <p>
                              {
                                objective.text
                              }
                            </p>
                          </div>
                        )
                      }
                    )}
                  </div>

                  {definition.rewards
                    ?.experience >
                    0 && (
                    <footer>
                      Recompensa:
                      {' '}
                      +
                      {
                        definition.rewards
                          .experience
                      }
                      {' '}
                      XP

                      {quest.status ===
                        'completed' &&
                        definition.nextQuest && (
                        <span className="quest-next-mission">
                          NOVA MISSÃO PRINCIPAL DESBLOQUEADA
                        </span>
                      )}
                    </footer>
                  )}
                </article>
              )
            }
          )}
        </div>
      </section>
    </div>
  )
}
