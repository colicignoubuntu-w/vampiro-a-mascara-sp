import {
  getCombatActions,
  getHealthInfo,
} from '../../engine/combat/combatEngine'

import './CombatPanel.css'

function getBoost(
  game,
  key
) {
  return (
    game?.combatBoosts
      ?.[key] ?? 0
  )
}

export default function CombatPanel({
  game,
  combat,
  onAction,
  onFinish,
  onBoost,
}) {
  if (!combat) {
    return null
  }

  const actions =
    getCombatActions(
      combat
    )

  const playerDamage =
    game?.health
      ?.currentLevel ?? 0

  const playerHealth =
    getHealthInfo(
      playerDamage
    )

  const enemyDamage =
    combat.enemy
      ?.health
      ?.damage ?? 0

  const enemyMaximum =
    combat.enemy
      ?.health
      ?.maximum ?? 7

  const enemyRemaining =
    Math.max(
      0,
      enemyMaximum -
        enemyDamage
    )

  const blood =
    game?.blood
      ?.current ?? 0

  const strength =
    game?.attributes
      ?.physical
      ?.strength ?? 0

  const dexterity =
    game?.attributes
      ?.physical
      ?.dexterity ?? 0

  const stamina =
    game?.attributes
      ?.physical
      ?.stamina ?? 0

  return (
    <div className="combat-overlay">
      <section className="combat-panel">
        <header className="combat-header">
          <span>
            COMBATE
          </span>

          <h2>
            {combat.enemy.name}
          </h2>

          <p>
            Turno {combat.round}
          </p>
        </header>

        <div className="combat-initiative">
          <div>
            <span>
              SUA INICIATIVA
            </span>

            <strong>
              {
                combat
                  .playerInitiative
                  .total
              }
            </strong>
          </div>

          <div
            className={
              combat.playerActsFirst
                ? 'combat-first player'
                : 'combat-first enemy'
            }
          >
            <span>
              AGE PRIMEIRO
            </span>

            <strong>
              {combat.playerActsFirst
                ? 'VOCÊ'
                : combat.enemy.name}
            </strong>
          </div>

          <div>
            <span>
              INICIATIVA INIMIGA
            </span>

            <strong>
              {
                combat
                  .enemyInitiative
                  .total
              }
            </strong>
          </div>
        </div>

        <div className="combat-health-grid">
          <section className="combat-health-card">
            <span>
              VOCÊ
            </span>

            <strong>
              {playerHealth.label}
            </strong>

            <div className="combat-health-boxes">
              {Array.from({
                length: 7,
              }).map(
                (
                  _,
                  index
                ) => (
                  <span
                    key={
                      `player-${index}`
                    }
                    className={
                      index <
                      playerDamage
                        ? 'damaged'
                        : ''
                    }
                  >
                    {index <
                    playerDamage
                      ? '×'
                      : ''}
                  </span>
                )
              )}
            </div>

            {playerHealth.penalty !==
              0 &&
              playerHealth.penalty !==
                null && (
              <p>
                Penalidade:
                {' '}
                {
                  playerHealth
                    .penalty
                }
              </p>
            )}
          </section>

          <section className="combat-health-card enemy">
            <span>
              {
                combat.enemy
                  .name
              }
            </span>

            <strong>
              {enemyRemaining >
              0
                ? 'Em combate'
                : 'Incapacitado'}
            </strong>

            <div className="combat-health-boxes">
              {Array.from({
                length:
                  enemyMaximum,
              }).map(
                (
                  _,
                  index
                ) => (
                  <span
                    key={
                      `enemy-${index}`
                    }
                    className={
                      index <
                      enemyDamage
                        ? 'damaged'
                        : ''
                    }
                  >
                    {index <
                    enemyDamage
                      ? '×'
                      : ''}
                  </span>
                )
              )}
            </div>
          </section>
        </div>

        {combat.status ===
          'active' && (
          <section className="combat-blood-boost">
            <div className="combat-blood-header">
              <div>
                <span>
                  SANGUE
                </span>

                <strong>
                  {blood}
                </strong>
              </div>

              <small>
                1 ponto por aumento
              </small>
            </div>

            <p>
              Gaste sangue para aumentar
              temporariamente um Atributo
              Físico durante o combate.
            </p>

            <div className="combat-boost-grid">
              <button
                type="button"
                disabled={
                  blood <= 0
                }
                onClick={() =>
                  onBoost(
                    'strength'
                  )
                }
              >
                <span>
                  Força
                </span>

                <strong>
                  {strength}
                  {getBoost(
                    game,
                    'strength'
                  ) > 0 &&
                    ` + ${getBoost(
                      game,
                      'strength'
                    )}`}
                </strong>
              </button>

              <button
                type="button"
                disabled={
                  blood <= 0
                }
                onClick={() =>
                  onBoost(
                    'dexterity'
                  )
                }
              >
                <span>
                  Destreza
                </span>

                <strong>
                  {dexterity}
                  {getBoost(
                    game,
                    'dexterity'
                  ) > 0 &&
                    ` + ${getBoost(
                      game,
                      'dexterity'
                    )}`}
                </strong>
              </button>

              <button
                type="button"
                disabled={
                  blood <= 0
                }
                onClick={() =>
                  onBoost(
                    'stamina'
                  )
                }
              >
                <span>
                  Vigor
                </span>

                <strong>
                  {stamina}
                  {getBoost(
                    game,
                    'stamina'
                  ) > 0 &&
                    ` + ${getBoost(
                      game,
                      'stamina'
                    )}`}
                </strong>
              </button>
            </div>
          </section>
        )}

        {combat.grapple
          ?.active && (
          <div className="combat-grapple-status">
            <span>
              AGARRÃO
            </span>

            <strong>
              {combat.grapple
                .controller ===
              'player'
                ? `Você está controlando ${combat.enemy.name}.`
                : `${combat.enemy.name} está controlando você.`}
            </strong>
          </div>
        )}

        <div className="combat-log">
          <span className="combat-section-title">
            AÇÕES
          </span>

          <div className="combat-log-content">
            {(combat.log ?? [])
              .slice(-14)
              .map(
                (
                  entry,
                  index
                ) => (
                  <p
                    key={
                      `combat-log-${index}`
                    }
                    className={
                      `combat-log-${entry.type}`
                    }
                  >
                    {entry.text}
                  </p>
                )
              )}
          </div>
        </div>

        {combat.status ===
          'active' && (
          <div className="combat-actions">
            <span className="combat-section-title">
              SUA AÇÃO
            </span>

            {actions.map(
              (action) => (
                <button
                  key={
                    action.id
                  }
                  type="button"
                  disabled={
                    action.disabled
                  }
                  onClick={() =>
                    onAction(
                      action.id
                    )
                  }
                >
                  <strong>
                    {
                      action.label
                    }
                  </strong>

                  <small>
                    {
                      action.description
                    }
                  </small>
                </button>
              )
            )}
          </div>
        )}

        {combat.status ===
          'finished' && (
          <div
            className={
              `combat-ending ${combat.winner}`
            }
          >
            <span>
              COMBATE ENCERRADO
            </span>

            <strong>
              {combat.winner ===
              'player'
                ? 'VITÓRIA'
                : combat.winner ===
                    'escaped'
                  ? 'VOCÊ ESCAPOU'
                  : 'INCAPACITADO'}
            </strong>

            <button
              type="button"
              onClick={
                onFinish
              }
            >
              Continuar
            </button>
          </div>
        )}
      </section>
    </div>
  )
}