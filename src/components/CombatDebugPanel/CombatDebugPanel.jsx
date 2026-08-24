import {
  getEnemyAiDebug,
} from '../../engine/combat/ai/enemyCombatAI'

import {
  getNpcDisciplineCombatProfile,
} from '../../engine/vampire/disciplines/npcDisciplineEngine'

import './CombatDebugPanel.css'

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

function percent(
  value
) {
  return `${Math.round(
    safeNumber(
      value,
      0
    ) * 100
  )}%`
}

function getFrenzyLabel(
  frenzy
) {
  if (
    !frenzy?.active
  ) {
    return 'Não'
  }

  if (
    frenzy.type ===
    'fear'
  ) {
    return 'Rötschreck'
  }

  if (
    frenzy.type ===
    'violent'
  ) {
    return 'Violência'
  }

  return 'Ativo'
}

function getDistanceLabel(
  distance
) {
  if (
    distance === 'close'
  ) {
    return 'Curta'
  }

  if (
    distance === 'medium'
  ) {
    return 'Média'
  }

  if (
    distance === 'far'
  ) {
    return 'Longa'
  }

  return distance ?? '—'
}

function getPersonalityLabel(
  personality
) {
  const labels = {
    balanced:
      'Equilibrado',

    aggressive:
      'Agressivo',

    coward:
      'Covarde',

    ranged:
      'Distância',

    predator:
      'Predador',
  }

  return (
    labels[
      personality
    ] ??
    personality ??
    '—'
  )
}

export default function CombatDebugPanel({
  game,
  combat,
  onClose,
}) {
  if (
    !game ||
    !combat
  ) {
    return null
  }

  const ai =
    getEnemyAiDebug(
      game,
      combat
    )

  const disciplineProfile =
    getNpcDisciplineCombatProfile(
      combat.enemy
    )

  const enemy =
    combat.enemy

  const status =
    enemy?.status ??
    {}

  const frenzy =
    status.frenzy

  const ranked =
    ai?.ranked ??
    []

  const topAction =
    ranked[0] ??
    null

  const health =
    enemy?.health ??
    {}

  const totalDamage =
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

  return (
    <aside className="combat-debug-panel">
      <header className="combat-debug-panel__header">
        <div>
          <span>
            DEV · DEBUG
          </span>

          <h2>
            Combat Engine
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

      <section className="combat-debug-section">
        <h3>
          NPC
        </h3>

        <div className="combat-debug-grid">
          <DebugValue
            label="Nome"
            value={
              enemy?.name
            }
          />

          <DebugValue
            label="Clã"
            value={
              enemy?.clan
            }
          />

          <DebugValue
            label="Geração"
            value={
              enemy?.generation
            }
          />

          <DebugValue
            label="Perfil"
            value={
              getPersonalityLabel(
                ai?.personality
              )
            }
          />
        </div>
      </section>

      <section className="combat-debug-section">
        <h3>
          Estado
        </h3>

        <div className="combat-debug-grid">
          <DebugValue
            label="Distância"
            value={
              getDistanceLabel(
                ai?.distance
              )
            }
          />

          <DebugValue
            label="Vida"
            value={
              percent(
                ai?.healthRatio
              )
            }
          />

          <DebugValue
            label="Dano"
            value={
              `${totalDamage}/${health.maximum ?? 7}`
            }
          />

          <DebugValue
            label="Sangue"
            value={
              `${enemy?.blood?.current ?? 0}/${enemy?.blood?.maximum ?? 0}`
            }
          />

          <DebugValue
            label="Reserva"
            value={
              percent(
                ai?.bloodRatio
              )
            }
          />

          <DebugValue
            label="Frenesi"
            value={
              getFrenzyLabel(
                frenzy
              )
            }
          />
        </div>
      </section>

      {frenzy?.active && (
        <section className="combat-debug-section combat-debug-section--danger">
          <h3>
            Besta
          </h3>

          <div className="combat-debug-grid">
            <DebugValue
              label="Tipo"
              value={
                frenzy.type
              }
            />

            <DebugValue
              label="Gatilho"
              value={
                frenzy.trigger
              }
            />

            <DebugValue
              label="Rodadas"
              value={
                frenzy.roundsRemaining
              }
            />

            <DebugValue
              label="Bônus ataque"
              value={
                frenzy.attackBonus ??
                0
              }
            />

            <DebugValue
              label="Falha crítica"
              value={
                frenzy.botch
                  ? 'Sim'
                  : 'Não'
              }
            />
          </div>
        </section>
      )}

      <section className="combat-debug-section">
        <h3>
          Disciplinas
        </h3>

        <div className="combat-debug-discipline-summary">
          <div>
            <span>
              Potência
            </span>

            <strong>
              {
                disciplineProfile
                  .potency
                  .level
              }
            </strong>
          </div>

          <div>
            <span>
              Fortitude
            </span>

            <strong>
              {
                disciplineProfile
                  .fortitude
                  .level
              }
            </strong>
          </div>

          <div>
            <span>
              Celeridade
            </span>

            <strong>
              {
                disciplineProfile
                  .celerity
                  .level
              }
            </strong>
          </div>

          <div>
            <span>
              Ações Cel.
            </span>

            <strong>
              {
                disciplineProfile
                  .celerity
                  .actionsRemaining
              }
            </strong>
          </div>
        </div>

        <div className="combat-debug-disciplines">
          {Object.entries(
            disciplineProfile
              .disciplines ??
              {}
          )
            .filter(
              ([
                ,
                level,
              ]) =>
                level > 0
            )
            .map(
              ([
                discipline,
                level,
              ]) => (
                <span
                  key={
                    discipline
                  }
                >
                  {discipline}
                  {' '}
                  {level}
                </span>
              )
            )}
        </div>
      </section>

      <section className="combat-debug-section">
        <h3>
          IA
        </h3>

        {topAction ? (
          <div className="combat-debug-choice">
            <span>
              PRÓXIMA AÇÃO MAIS PROVÁVEL
            </span>

            <strong>
              {
                topAction.id
              }
            </strong>

            <b>
              Pontuação:
              {' '}
              {
                topAction.score
              }
            </b>

            {(topAction.reasons ??
              []).map(
              (
                reason,
                index
              ) => (
                <p
                  key={
                    `top-reason-${index}`
                  }
                >
                  {reason}
                </p>
              )
            )}
          </div>
        ) : (
          <p className="combat-debug-empty">
            Nenhuma ação calculada.
          </p>
        )}

        <div className="combat-debug-ranking">
          {ranked.map(
            (
              action,
              index
            ) => (
              <article
                key={
                  action.id
                }
                className={
                  index === 0
                    ? 'combat-debug-action combat-debug-action--top'
                    : 'combat-debug-action'
                }
              >
                <div className="combat-debug-action__title">
                  <span>
                    #{index + 1}
                  </span>

                  <strong>
                    {
                      action.id
                    }
                  </strong>

                  <b>
                    {
                      action.score
                    }
                  </b>
                </div>

                {(action.reasons ??
                  []).map(
                  (
                    reason,
                    reasonIndex
                  ) => (
                    <small
                      key={
                        `${action.id}-${reasonIndex}`
                      }
                    >
                      {reason}
                    </small>
                  )
                )}
              </article>
            )
          )}
        </div>
      </section>

      <section className="combat-debug-section">
        <h3>
          Turno
        </h3>

        <div className="combat-debug-grid">
          <DebugValue
            label="Rodada"
            value={
              combat.round
            }
          />

          <DebugValue
            label="Jogador primeiro"
            value={
              combat.playerActsFirst
                ? 'Sim'
                : 'Não'
            }
          />

          <DebugValue
            label="Ações jogador"
            value={
              combat?.turn
                ?.playerActionsRemaining ??
              1
            }
          />

          <DebugValue
            label="Cel. jogador"
            value={
              combat?.turn
                ?.celerityActionsRemaining ??
              0
            }
          />

          <DebugValue
            label="NPC agiu"
            value={
              combat?.turn
                ?.enemyActed
                ? 'Sim'
                : 'Não'
            }
          />
        </div>
      </section>

      <section className="combat-debug-section">
        <h3>
          Status do NPC
        </h3>

        <div className="combat-debug-status">
          <Status
            label="Dominado"
            active={
              status.dominated
            }
          />

          <Status
            label="Medo"
            active={
              status.frightened
            }
          />

          <Status
            label="Demência"
            active={
              status.madness ||
              status.dementiaFear
            }
          />

          <Status
            label="Besta reprimida"
            active={
              status.beastQuelled
            }
          />

          <Status
            label="Garras"
            active={
              status.feralClaws
            }
          />

          <Status
            label="Celeridade"
            active={
              status.celerityActive
            }
          />
        </div>
      </section>

      <section className="combat-debug-section">
        <h3>
          Dados brutos
        </h3>

        <details>
          <summary>
            enemy.status
          </summary>

          <pre>
            {JSON.stringify(
              status,
              null,
              2
            )}
          </pre>
        </details>

        <details>
          <summary>
            combat.turn
          </summary>

          <pre>
            {JSON.stringify(
              combat.turn,
              null,
              2
            )}
          </pre>
        </details>

        <details>
          <summary>
            IA completa
          </summary>

          <pre>
            {JSON.stringify(
              ai,
              null,
              2
            )}
          </pre>
        </details>
      </section>
    </aside>
  )
}

function DebugValue({
  label,
  value,
}) {
  return (
    <div className="combat-debug-value">
      <span>
        {label}
      </span>

      <strong>
        {
          value ??
          '—'
        }
      </strong>
    </div>
  )
}

function Status({
  label,
  active,
}) {
  return (
    <span
      className={
        active
          ? 'combat-debug-status__item active'
          : 'combat-debug-status__item'
      }
    >
      {label}
    </span>
  )
}