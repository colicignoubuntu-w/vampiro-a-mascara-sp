import {
  getAllArmor,
  getAllWeapons,
  getArmor,
  getWeapon,
} from '../../data/items'

import {
  getCombatActions,
  getCombatHealthSlots,
  getHealthInfo,
} from '../../engine/combat/combatEngine'

import {
  getLoadedAmmo,
  getReserveAmmo,
} from '../../engine/combat/ammoEngine'

import {
  getTotalDamage,
} from '../../engine/combat/damageEngine'

import './CombatPanel.css'

function hasItem(
  game,
  id
) {
  return Boolean(
    game?.inventory
      ?.some(
        (item) =>
          item.id === id &&
          (
            item.quantity ??
            1
          ) > 0
      )
  )
}

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
  onEquipWeapon,
  onEquipArmor,
  onReload,
}) {
  if (!combat) {
    return null
  }

  const actions =
    getCombatActions(
      game,
      combat
    )

  const healthSlots =
    getCombatHealthSlots(
      game?.health
    )

  const playerDamage =
    getTotalDamage(
      game?.health
    )

  const playerHealth =
    getHealthInfo(
      game?.health
    )

  const enemyDamage =
    getTotalDamage(
      combat.enemy
        ?.health
    )

  const enemyHealth =
    getHealthInfo(
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

  const equippedWeapon =
    getWeapon(
      game?.equipment
        ?.weapon ??
        'fists'
    )

  const equippedArmor =
    getArmor(
      game?.equipment
        ?.armor ??
        'none'
    )

  const loadedAmmo =
    equippedWeapon
      ?.category ===
      'firearm'
      ? getLoadedAmmo(
          game,
          equippedWeapon.id
        )
      : null

  const reserveAmmo =
    equippedWeapon
      ?.category ===
      'firearm'
      ? getReserveAmmo(
          game,
          equippedWeapon
            .ammunition
            ?.ammoType
        )
      : null

  const magazine =
    equippedWeapon
      ?.ammunition
      ?.magazine ?? 0

  const availableWeapons =
    getAllWeapons()
      .filter(
        (weapon) => {
          if (
            weapon.id ===
              'fists' ||
            weapon.id ===
              'kick'
          ) {
            return false
          }

          if (
            weapon.category ===
            'natural'
          ) {
            return false
          }

          return hasItem(
            game,
            weapon.id
          )
        }
      )

  const availableArmor =
    getAllArmor()
      .filter(
        (armor) =>
          armor.id ===
            'none' ||
          hasItem(
            game,
            armor.id
          )
      )

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
              {healthSlots.map(
                (
                  slot,
                  index
                ) => (
                  <span
                    key={
                      `player-health-${index}`
                    }
                    className={
                      `combat-health-slot ${slot.type}`
                    }
                  >
                    {slot.symbol}
                  </span>
                )
              )}
            </div>

            <div className="combat-damage-legend">
              <span>
                / Contusão
              </span>

              <span>
                X Letal
              </span>

              <span>
                * Agravado
              </span>
            </div>

            <small>
              Dano total:
              {' '}
              {playerDamage}/7
            </small>

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
              {combat.enemy.name}
            </span>

            <strong>
              {enemyHealth.label}
            </strong>

            <div className="combat-health-boxes">
              {getCombatHealthSlots(
                combat.enemy
                  .health
              ).map(
                (
                  slot,
                  index
                ) => (
                  <span
                    key={
                      `enemy-health-${index}`
                    }
                    className={
                      `combat-health-slot ${slot.type}`
                    }
                  >
                    {slot.symbol}
                  </span>
                )
              )}
            </div>

            <small>
              Dano total:
              {' '}
              {enemyDamage}/
              {
                combat.enemy
                  .health
                  .maximum
              }
            </small>

            {combat.enemy
              ?.status
              ?.staked && (
              <p className="combat-staked">
                ESTACADO · PARALISADO
              </p>
            )}
          </section>
        </div>

        {combat.status ===
          'active' && (
          <section className="combat-equipment">
            <span className="combat-section-title">
              EQUIPAMENTO
            </span>

            <div className="combat-equipped-summary">
              <div>
                <span>
                  ARMA
                </span>

                <strong>
                  {
                    equippedWeapon
                      ?.name ??
                    'Punhos'
                  }
                </strong>

                {equippedWeapon
                  ?.category ===
                  'firearm' && (
                  <>
                    <small>
                      Carregador:
                      {' '}
                      {loadedAmmo}
                      /
                      {magazine}
                    </small>

                    <small>
                      Reserva:
                      {' '}
                      {reserveAmmo}
                    </small>

                    <button
                      type="button"
                      disabled={
                        loadedAmmo >=
                          magazine ||
                        reserveAmmo <= 0
                      }
                      onClick={
                        onReload
                      }
                    >
                      Recarregar
                    </button>
                  </>
                )}
              </div>

              <div>
                <span>
                  PROTEÇÃO
                </span>

                <strong>
                  {
                    equippedArmor
                      ?.name ??
                    'Sem Armadura'
                  }
                </strong>

                {equippedArmor
                  ?.dexterityPenalty >
                  0 && (
                  <small>
                    Destreza -
                    {
                      equippedArmor
                        .dexterityPenalty
                    }
                  </small>
                )}
              </div>
            </div>

            <div className="combat-equipment-columns">
              <div>
                <span className="combat-equipment-label">
                  ARMAS DISPONÍVEIS
                </span>

                <button
                  type="button"
                  className={
                    (
                      game?.equipment
                        ?.weapon ??
                      'fists'
                    ) ===
                    'fists'
                      ? 'selected'
                      : ''
                  }
                  onClick={() =>
                    onEquipWeapon(
                      'fists'
                    )
                  }
                >
                  Punhos
                </button>

                {availableWeapons.map(
                  (weapon) => {
                    const ammo =
                      weapon.category ===
                        'firearm'
                        ? getLoadedAmmo(
                            game,
                            weapon.id
                          )
                        : null

                    const reserve =
                      weapon.category ===
                        'firearm'
                        ? getReserveAmmo(
                            game,
                            weapon
                              .ammunition
                              ?.ammoType
                          )
                        : null

                    return (
                      <button
                        key={
                          weapon.id
                        }
                        type="button"
                        className={
                          game
                            ?.equipment
                            ?.weapon ===
                          weapon.id
                            ? 'selected'
                            : ''
                        }
                        onClick={() =>
                          onEquipWeapon(
                            weapon.id
                          )
                        }
                      >
                        <strong>
                          {weapon.name}
                        </strong>

                        <small>
                          {weapon.damageType}

                          {weapon.category ===
                            'firearm' &&
                            ` · ${ammo}/${weapon.ammunition?.magazine ?? 0} · reserva ${reserve}`}
                        </small>
                      </button>
                    )
                  }
                )}
              </div>

              <div>
                <span className="combat-equipment-label">
                  ARMADURA
                </span>

                {availableArmor.map(
                  (armor) => (
                    <button
                      key={
                        armor.id
                      }
                      type="button"
                      className={
                        (
                          game
                            ?.equipment
                            ?.armor ??
                          'none'
                        ) ===
                        armor.id
                          ? 'selected'
                          : ''
                      }
                      onClick={() =>
                        onEquipArmor(
                          armor.id
                        )
                      }
                    >
                      <strong>
                        {armor.name}
                      </strong>

                      <small>
                        Contusão{' '}
                        {
                          armor
                            .protection
                            .bashing
                        }
                        {' · '}
                        Letal{' '}
                        {
                          armor
                            .protection
                            .lethal
                        }
                      </small>
                    </button>
                  )
                )}
              </div>
            </div>
          </section>
        )}

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
              Você está controlando
              {' '}
              {combat.enemy.name}.
            </strong>
          </div>
        )}

        <div className="combat-log">
          <span className="combat-section-title">
            AÇÕES
          </span>

          <div className="combat-log-content">
            {(combat.log ?? [])
              .slice(-18)
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
                    {action.label}
                  </strong>

                  <small>
                    {action.description}
                  </small>
                </button>
              )
            )}
          </div>
        )}

        {combat.status ===
          'finished' && (
          <div className="combat-ending">
            <span>
              COMBATE ENCERRADO
            </span>

            <strong>
              {combat.endingReason ===
              'staked'
                ? 'VAMPIRO PARALISADO'
                : combat.winner ===
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