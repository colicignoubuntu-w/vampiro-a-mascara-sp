import {
  getBloodTurnState,
} from '../../engine/vampire/bloodTurnEngine'

import {
  getCombatActions,
  getCombatHealthSlots,
  getCombatRangeInfo,
  getHealthInfo,
} from '../../engine/combat/combatEngine'

import {
  getLoadedAmmo,
  getReserveAmmo,
} from '../../engine/combat/ammoEngine'

import {
  getTotalDamage,
} from '../../engine/combat/damageEngine'

import {
  getAllWeapons,
  getWeapon,
} from '../../data/items/weapons'

import {
  getAllArmor,
  getArmor,
} from '../../data/items/armor'

import './CombatPanel.css'

function hasItem(
  game,
  id
) {
  return Boolean(
    game?.inventory?.some(
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
      ?.[key] ??
    0
  )
}

function getDisciplineLabel(
  action
) {
  const labels = {
    celerity:
      'CELERIDADE',

    protean:
      'PROTEANISMO',

    auspex:
      'AUSPÍCIOS',

    presence:
      'PRESENÇA',

    dominate:
      'DOMINAÇÃO',

    dementia:
      'DEMÊNCIA',

    animalism:
      'ANIMALISMO',

    thaumaturgy:
      'TAUMATURGIA',

    potency:
      'POTÊNCIA',

    fortitude:
      'FORTITUDE',

    obfuscate:
      'OFUSCAÇÃO',
  }

  return (
    labels[
      action?.discipline
    ] ??
    action?.discipline
      ?.toUpperCase() ??
    'DISCIPLINA'
  )
}

function getDistanceClass(
  distance
) {
  if (
    distance ===
    'close'
  ) {
    return 'close'
  }

  if (
    distance ===
    'medium'
  ) {
    return 'medium'
  }

  if (
    distance ===
    'far'
  ) {
    return 'far'
  }

  return ''
}

function getDistanceDescription(
  distance
) {
  if (
    distance ===
    'close'
  ) {
    return (
      'Corpo a corpo disponível.'
    )
  }

  if (
    distance ===
    'medium'
  ) {
    return (
      'Ataques corpo a corpo exigem aproximação.'
    )
  }

  if (
    distance ===
    'far'
  ) {
    return (
      'Somente ataques de longo alcance estão disponíveis.'
    )
  }

  return ''
}

export default function CombatPanel({
  game,
  combat,

  onAction,
  onFinish,

  onBoost,
  onHeal,

  onEquipWeapon,
  onEquipArmor,

  onReload,

  disciplineActions = [],
  onDisciplineAction,
}) {
  if (!combat) {
    return null
  }

  const actions =
    getCombatActions(
      game,
      combat
    )

  const range =
    getCombatRangeInfo(
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
      combat.enemy
        ?.health
    )

  const blood =
    game?.blood
      ?.current ??
    0

  const bloodTurn =
    getBloodTurnState(
      game
    )
  const strength =
    game?.attributes
      ?.physical
      ?.strength ??
    0

  const dexterity =
    game?.attributes
      ?.physical
      ?.dexterity ??
    0

  const stamina =
    game?.attributes
      ?.physical
      ?.stamina ??
    0

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
      ?.magazine ??
    0

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

  const playerActions =
    combat?.turn
      ?.playerActionsRemaining ??
    1

  const extraCelerity =
    combat?.turn
      ?.celerityActionsRemaining ??
    0

  return (
    <div className="combat-overlay">
      <section className="combat-panel">
        <header className="combat-header">
          <span>
            COMBATE
          </span>

          <h2>
            {
              combat.enemy
                .name
            }
          </h2>

          <p>
            Turno
            {' '}
            {
              combat.round
            }
          </p>
        </header>

        <section
          className={
            `combat-range combat-range--${getDistanceClass(
              range.distance
            )}`
          }
        >
          <div className="combat-range__main">
            <span>
              DISTÂNCIA
            </span>

            <strong>
              {
                range.label
              }
            </strong>
          </div>

          <div className="combat-range__description">
            {
              getDistanceDescription(
                range.distance
              )
            }
          </div>

          <div className="combat-range__movement">
            <span
              className={
                range.canAdvance
                  ? 'available'
                  : ''
              }
            >
              Avançar:
              {' '}
              {
                range.canAdvance
                  ? 'SIM'
                  : 'NÃO'
              }
            </span>

            <span
              className={
                range.canRetreat
                  ? 'available'
                  : ''
              }
            >
              Recuar:
              {' '}
              {
                range.canRetreat
                  ? 'SIM'
                  : 'NÃO'
              }
            </span>
          </div>
        </section>

        <div className="combat-initiative">
          <div>
            <span>
              SUA INICIATIVA
            </span>

            <strong>
              {
                combat
                  .playerInitiative
                  ?.total ??
                0
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
              {
                combat.playerActsFirst
                  ? 'VOCÊ'
                  : combat.enemy.name
              }
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
                  ?.total ??
                0
              }
            </strong>
          </div>
        </div>

        {combat.status ===
          'active' &&
          extraCelerity > 0 && (
          <section className="combat-celerity-status">
            <span>
              CELERIDADE ATIVA
            </span>

            <strong>
              {
                playerActions
              }
              {' '}
              ação(ões)
              restante(s)
            </strong>

            <small>
              {
                extraCelerity
              }
              {' '}
              ação(ões) sobrenatural(is)
            </small>
          </section>
        )}

        <div className="combat-health-grid">
  <section className="combat-health-card">
    <span className="combat-health-owner">
      VOCÊ
    </span>

    <span className="combat-health-title">
      VITALIDADE
    </span>

    <strong>
      {
        playerHealth.label
      }
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
            {
              slot.symbol
            }
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

    <div className="combat-health-summary">
      <small>
        Dano:
        {' '}
        {
          playerDamage
        }
        /
        {
          game?.health
            ?.maximum ??
          7
        }
      </small>

      <small>
        Sangue:
        {' '}
        {
          game?.blood
            ?.current ??
          0
        }
        /
        {
          game?.blood
            ?.maximum ??
          0
        }
      </small>
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
    <span className="combat-health-owner">
      {
        combat.enemy
          .name
      }
    </span>

    <span className="combat-health-title">
      VITALIDADE
    </span>

    <strong>
      {
        enemyHealth.label
      }
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
            {
              slot.symbol
            }
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

    <div className="combat-health-summary">
      <small>
        Dano:
        {' '}
        {
          enemyDamage
        }
        /
        {
          combat.enemy
            ?.health
            ?.maximum ??
          7
        }
      </small>

      {combat.enemy
        ?.vampire && (
        <small>
          Sangue:
          {' '}
          {
            combat.enemy
              ?.blood
              ?.current ??
            0
          }
          /
          {
            combat.enemy
              ?.blood
              ?.maximum ??
            0
          }
        </small>
      )}
    </div>

    {enemyHealth.penalty !==
      0 &&
      enemyHealth.penalty !==
        null && (
      <p>
        Penalidade:
        {' '}
        {
          enemyHealth
            .penalty
        }
      </p>
    )}

    {combat.enemy
      ?.status
      ?.staked && (
      <p className="combat-staked">
        ESTACADO · PARALISADO
      </p>
    )}

    {combat.enemy
      ?.status
      ?.frenzy
      ?.active && (
      <p className="combat-frenzy">
        {
          combat.enemy
            .status
            .frenzy
            .type ===
            'fear'
            ? 'RÖTSCHRECK'
            : 'FRENESI'
        }
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
                      {
                        loadedAmmo
                      }
                      /
                      {
                        magazine
                      }
                    </small>

                    <small>
                      Reserva:
                      {' '}
                      {
                        reserveAmmo
                      }
                    </small>

                    <button
                      type="button"
                      disabled={
                        loadedAmmo >=
                          magazine ||
                        reserveAmmo <=
                          0
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
                  ARMAS
                </span>

                <button
                  type="button"
                  className={
                    (
                      game
                        ?.equipment
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
                          {
                            weapon.name
                          }
                        </strong>

                        <small>
                          {
                            weapon.damageType
                          }

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
                        {
                          armor.name
                        }
                      </strong>

                      <small>
                        Contusão
                        {' '}
                        {
                          armor
                            .protection
                            .bashing
                        }

                        {' · '}

                        Letal
                        {' '}
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
            <div className="combat-blood-turn-status">
  <div>
    <span>
      USADO NESTE TURNO
    </span>

    <strong>
      {
        bloodTurn.spent
      }
      /
      {
        bloodTurn.limit
      }
    </strong>
  </div>

  <div>
    <span>
      RESTANTE
    </span>

    <strong>
      {
        bloodTurn.remaining
      }
    </strong>
  </div>
</div>
            <div className="combat-blood-header">
              <div>
                <span>
                  SANGUE
                </span>

                <strong>
                  {
                    blood
                  }
                </strong>
              </div>

              <small>
                1 ponto por aumento
              </small>
            </div>

            <div className="combat-healing-action">
              <button
                type="button"
                disabled={
                  blood <= 0 ||
                  bloodTurn.remaining <= 0 ||
                  (
                    (game?.health
                      ?.bashing ??
                      0) <= 0 &&
                    (game?.health
                      ?.lethal ??
                      0) <= 0
                  )
                }
                onClick={
                  onHeal
                }
              >
                <span>
                  CURAR FERIMENTO
                </span>

                <strong>
                  1 ponto de sangue
                </strong>

                <small>
                  Cura dano de Contusão ou Letal
                </small>
              </button>
            </div>

            <div className="combat-boost-grid">
              <button
                type="button"
                disabled={
                  blood <= 0 ||
                  bloodTurn.remaining <= 0
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
                  {
                    strength
                  }

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
                  blood <= 0 ||
                  bloodTurn.remaining <= 0
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
                  {
                    dexterity
                  }

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
                  blood <= 0 ||
                  bloodTurn.remaining <= 0
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
                  {
                    stamina
                  }

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

        {combat.status ===
          'active' &&
          disciplineActions.length >
            0 && (
          <section className="combat-disciplines">
            <div className="combat-disciplines-header">
              <div>
                <span className="combat-section-title">
                  PODERES
                  VAMPÍRICOS
                </span>

                <small>
                  Poderes disponíveis
                  durante o confronto
                </small>
              </div>

              <strong>
                {
                  disciplineActions
                    .length
                }
              </strong>
            </div>

            <div className="combat-discipline-grid">
              {disciplineActions.map(
                (action) => (
                  <button
                    key={
                      action.id
                    }
                    type="button"
                    className={
                      (
                        action.disabled ||
                        (
                          (action.bloodCost ?? 0) >
                          bloodTurn.remaining
                        )
                      )
                        ? 'combat-discipline-action combat-discipline-action--disabled'
                        : 'combat-discipline-action'
                    }
                    disabled={
                      action.disabled ||
                      (
                        (action.bloodCost ?? 0) >
                        bloodTurn.remaining
                      )
                    }
                    onClick={() =>
                      onDisciplineAction?.(
                        action.id
                      )
                    }
                  >
                    <div className="combat-discipline-action-top">
                      <span>
                        {
                          getDisciplineLabel(
                            action
                          )
                        }
                      </span>

                      <small>
                        {'●'.repeat(
                          Math.max(
                            1,
                            Number(
                              action.level ??
                              1
                            )
                          )
                        )}
                      </small>
                    </div>

                    <strong>
                      {
                        action.label
                      }
                    </strong>

                    <p>
                      {
                        action.description
                      }
                    </p>

                    <div className="combat-discipline-meta">
                      <span>
                        Sangue:
                        {' '}
                        {
                          action.bloodCost ??
                          0
                        }
                      </span>

                      <span>
                        {
                          action.type ===
                          'deactivation'
                            ? 'Desativar'
                            : (
                                (action.bloodCost ?? 0) >
                                bloodTurn.remaining
                              )
                              ? 'Limite de sangue'
                              : 'Ativar'
                        }
                      </span>
                    </div>
                  </button>
                )
              )}
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
            LOG
          </span>

          <div className="combat-log-content">
            {(combat.log ?? [])
              .slice(-22)
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
                    {
                      entry.text
                    }
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

            <div className="combat-actions__distance">
              Distância:
              {' '}
              <strong>
                {
                  range.label
                }
              </strong>
            </div>

            {actions.map(
              (action) => (
                <button
                  key={
                    action.id
                  }
                  type="button"
                  className={
                    action.disabled
                      ? 'combat-action-disabled'
                      : ''
                  }
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

                  {action.disabled && (
                    <span className="combat-action-unavailable">
                      INDISPONÍVEL
                    </span>
                  )}
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
                : combat.endingReason ===
                    'enemy-fled'
                  ? 'INIMIGO FUGIU'
                  : combat.endingReason ===
                      'enemy-rotschreck-fled'
                    ? 'INIMIGO FUGIU EM RÖTSCHRECK'
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