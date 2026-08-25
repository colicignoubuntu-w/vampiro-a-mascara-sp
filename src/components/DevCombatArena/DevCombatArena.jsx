import {
  useMemo,
  useState,
} from 'react'

import {
  getAllCombatEncounters,
} from '../../data/npcs/combatEncounters'

import {
  getAllWeapons,
} from '../../data/items/weapons'

import {
  getAllArmor,
} from '../../data/items/armor'

import './DevCombatArena.css'

const DISCIPLINES = [
  { id: 'animalism', label: 'Animalismo' },
  { id: 'auspex', label: 'Auspícios' },
  { id: 'celerity', label: 'Celeridade' },
  { id: 'dementia', label: 'Demência' },
  { id: 'dominate', label: 'Dominação' },
  { id: 'fortitude', label: 'Fortitude' },
  { id: 'obfuscate', label: 'Ofuscação' },
  { id: 'potency', label: 'Potência' },
  { id: 'presence', label: 'Presença' },
  { id: 'protean', label: 'Proteanismo' },
  { id: 'thaumaturgy', label: 'Taumaturgia' },
]

const ATTRIBUTES = [
  { id: 'strength', label: 'Força' },
  { id: 'dexterity', label: 'Destreza' },
  { id: 'stamina', label: 'Vigor' },
  { id: 'charisma', label: 'Carisma' },
  { id: 'manipulation', label: 'Manipulação' },
  { id: 'wits', label: 'Raciocínio' },
  { id: 'intelligence', label: 'Inteligência' },
]

const ABILITIES = [
  { id: 'brawl', label: 'Briga' },
  { id: 'melee', label: 'Armas Brancas' },
  { id: 'firearms', label: 'Armas de Fogo' },
  { id: 'dodge', label: 'Esquiva' },
  { id: 'athletics', label: 'Esportes' },
  { id: 'intimidation', label: 'Intimidação' },
]

const VIRTUES = [
  { id: 'conscience', label: 'Consciência' },
  { id: 'selfControl', label: 'Autocontrole' },
  { id: 'courage', label: 'Coragem' },
]

const PERSONALITIES = [
  'balanced',
  'aggressive',
  'coward',
  'ranged',
  'predator',
]

const DISTANCES = [
  'close',
  'medium',
  'far',
]

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

function cloneEncounter(
  encounter
) {
  return structuredClone(
    encounter
  )
}

export default function DevCombatArena({
  onStart,
  onClose,
}) {
  const encounters =
    useMemo(
      () =>
        getAllCombatEncounters(),
      []
    )

  const weapons =
    useMemo(
      () =>
        getAllWeapons(),
      []
    )

  const armor =
    useMemo(
      () =>
        getAllArmor(),
      []
    )

  const [
    selectedId,
    setSelectedId,
  ] = useState(
    encounters[0]?.id ??
    null
  )

  const [
    customEncounter,
    setCustomEncounter,
  ] = useState(
    encounters[0]
      ? cloneEncounter(
          encounters[0]
        )
      : null
  )

  function selectEncounter(
    encounter
  ) {
    setSelectedId(
      encounter.id
    )

    setCustomEncounter(
      cloneEncounter(
        encounter
      )
    )
  }

  function updateEnemy(
    key,
    value
  ) {
    setCustomEncounter(
      (current) => ({
        ...current,

        enemy: {
          ...current.enemy,

          [key]:
            value,
        },
      })
    )
  }

  function updateAttribute(
    key,
    value
  ) {
    setCustomEncounter(
      (current) => ({
        ...current,

        enemy: {
          ...current.enemy,

          attributes: {
            ...(current.enemy
              ?.attributes ??
              {}),

            [key]:
              Math.max(
                0,
                safeNumber(
                  value,
                  0
                )
              ),
          },
        },
      })
    )
  }

  function updateAbility(
    key,
    value
  ) {
    setCustomEncounter(
      (current) => ({
        ...current,

        enemy: {
          ...current.enemy,

          abilities: {
            ...(current.enemy
              ?.abilities ??
              {}),

            [key]:
              Math.max(
                0,
                safeNumber(
                  value,
                  0
                )
              ),
          },
        },
      })
    )
  }

  function updateVirtue(
    key,
    value
  ) {
    setCustomEncounter(
      (current) => ({
        ...current,

        enemy: {
          ...current.enemy,

          virtues: {
            ...(current.enemy
              ?.virtues ??
              {}),

            [key]:
              Math.max(
                0,
                safeNumber(
                  value,
                  0
                )
              ),
          },
        },
      })
    )
  }

  function updateHealth(
    key,
    value
  ) {
    setCustomEncounter(
      (current) => ({
        ...current,

        enemy: {
          ...current.enemy,

          health: {
            ...(current.enemy
              ?.health ??
              {}),

            [key]:
              Math.max(
                0,
                safeNumber(
                  value,
                  0
                )
              ),
          },
        },
      })
    )
  }

  function updateBlood(
    key,
    value
  ) {
    setCustomEncounter(
      (current) => ({
        ...current,

        enemy: {
          ...current.enemy,

          blood: {
            ...(current.enemy
              ?.blood ??
              {}),

            [key]:
              Math.max(
                0,
                safeNumber(
                  value,
                  0
                )
              ),
          },
        },
      })
    )
  }

  function updateDiscipline(
    discipline,
    value
  ) {
    setCustomEncounter(
      (current) => ({
        ...current,

        enemy: {
          ...current.enemy,

          disciplines: {
            ...(current.enemy
              ?.disciplines ??
              {}),

            [discipline]:
              Math.max(
                0,
                Math.min(
                  8,
                  safeNumber(
                    value,
                    0
                  )
                )
              ),
          },
        },
      })
    )
  }

  function updateDistance(
    value
  ) {
    setCustomEncounter(
      (current) => ({
        ...current,

        distance:
          value,

        environment: {
          ...(current.environment ??
            {}),

          distance:
            value,
        },
      })
    )
  }

  function toggleFlag(
    key
  ) {
    setCustomEncounter(
      (current) => ({
        ...current,

        flags: {
          ...(current.flags ??
            {}),

          [key]:
            !current.flags
              ?.[key],
        },
      })
    )
  }

  function toggleEnvironment(
    key
  ) {
    setCustomEncounter(
      (current) => ({
        ...current,

        environment: {
          ...(current.environment ??
            {}),

          [key]:
            !current.environment
              ?.[key],
        },
      })
    )
  }

  function handleStart() {
    if (
      !customEncounter
    ) {
      return
    }

    onStart(
      cloneEncounter(
        customEncounter
      )
    )
  }

  if (
    !customEncounter
  ) {
    return null
  }

  return (
    <div className="dev-combat-arena-overlay">
      <section className="dev-combat-arena">
        <header className="dev-combat-arena__header">
          <div>
            <span>
              FERRAMENTA DEV
            </span>

            <h2>
              Arena de Combate
            </h2>

            <p>
              Monte um inimigo e teste o motor de combate.
            </p>
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

        <section className="dev-combat-arena__templates">
          {encounters.map(
            (encounter) => (
              <button
                key={
                  encounter.id
                }
                type="button"
                className={
                  selectedId ===
                  encounter.id
                    ? 'selected'
                    : ''
                }
                onClick={() =>
                  selectEncounter(
                    encounter
                  )
                }
              >
                {
                  encounter.label
                }
              </button>
            )
          )}
        </section>

        <div className="dev-combat-arena__editor">
          <section className="dev-combat-arena__block">
            <h3>
              Identidade
            </h3>

            <label>
              Nome

              <input
                value={
                  customEncounter
                    .enemy
                    .name
                }
                onChange={(
                  event
                ) =>
                  updateEnemy(
                    'name',
                    event.target
                      .value
                  )
                }
              />
            </label>

            <label>
              Clã

              <select
                value={
                  customEncounter
                    .enemy
                    .clan ??
                  ''
                }
                onChange={(
                  event
                ) =>
                  updateEnemy(
                    'clan',
                    event.target
                      .value
                  )
                }
              >
                <option value="brujah">
                  Brujah
                </option>

                <option value="gangrel">
                  Gangrel
                </option>

                <option value="malkavian">
                  Malkaviano
                </option>

                <option value="nosferatu">
                  Nosferatu
                </option>

                <option value="toreador">
                  Toreador
                </option>

                <option value="tremere">
                  Tremere
                </option>

                <option value="ventrue">
                  Ventrue
                </option>
              </select>
            </label>

            <label>
              Geração

              <select
                value={
                  customEncounter
                    .enemy
                    .generation
                }
                onChange={(
                  event
                ) =>
                  updateEnemy(
                    'generation',
                    event.target
                      .value
                  )
                }
              >
                {[
                  6,
                  7,
                  8,
                  9,
                  10,
                  11,
                  12,
                  13,
                ].map(
                  (
                    generation
                  ) => (
                    <option
                      key={
                        generation
                      }
                      value={
                        `${generation}ª`
                      }
                    >
                      {
                        generation
                      }
                      ª
                    </option>
                  )
                )}
              </select>
            </label>

            <label>
              Personalidade

              <select
                value={
                  customEncounter
                    .enemy
                    .combatPersonality
                }
                onChange={(
                  event
                ) =>
                  updateEnemy(
                    'combatPersonality',
                    event.target
                      .value
                  )
                }
              >
                {PERSONALITIES.map(
                  (
                    personality
                  ) => (
                    <option
                      key={
                        personality
                      }
                      value={
                        personality
                      }
                    >
                      {
                        personality
                      }
                    </option>
                  )
                )}
              </select>
            </label>
          </section>

          <section className="dev-combat-arena__block">
            <h3>
              Combate
            </h3>

            <label>
              Distância

              <select
                value={
                  customEncounter
                    .distance
                }
                onChange={(
                  event
                ) =>
                  updateDistance(
                    event.target
                      .value
                  )
                }
              >
                {DISTANCES.map(
                  (
                    distance
                  ) => (
                    <option
                      key={
                        distance
                      }
                      value={
                        distance
                      }
                    >
                      {
                        distance
                      }
                    </option>
                  )
                )}
              </select>
            </label>

            <label>
              Arma

              <select
                value={
                  customEncounter
                    .enemy
                    .weaponId
                }
                onChange={(
                  event
                ) =>
                  updateEnemy(
                    'weaponId',
                    event.target
                      .value
                  )
                }
              >
                {weapons.map(
                  (
                    weapon
                  ) => (
                    <option
                      key={
                        weapon.id
                      }
                      value={
                        weapon.id
                      }
                    >
                      {
                        weapon.name
                      }
                    </option>
                  )
                )}
              </select>
            </label>

            <label>
              Armadura

              <select
                value={
                  customEncounter
                    .enemy
                    .armorId
                }
                onChange={(
                  event
                ) =>
                  updateEnemy(
                    'armorId',
                    event.target
                      .value
                  )
                }
              >
                {armor.map(
                  (
                    item
                  ) => (
                    <option
                      key={
                        item.id
                      }
                      value={
                        item.id
                      }
                    >
                      {
                        item.name
                      }
                    </option>
                  )
                )}
              </select>
            </label>
          </section>

          <section className="dev-combat-arena__block">
            <h3>
              Vitae
            </h3>

            <label>
              Sangue atual

              <input
                type="number"
                min="0"
                value={
                  customEncounter
                    .enemy
                    .blood
                    .current
                }
                onChange={(
                  event
                ) =>
                  updateBlood(
                    'current',
                    event.target
                      .value
                  )
                }
              />
            </label>

            <label>
              Sangue máximo

              <input
                type="number"
                min="1"
                value={
                  customEncounter
                    .enemy
                    .blood
                    .maximum
                }
                onChange={(
                  event
                ) =>
                  updateBlood(
                    'maximum',
                    event.target
                      .value
                  )
                }
              />
            </label>

            <div className="dev-combat-arena__toggles">
              <button
                type="button"
                className={
                  customEncounter
                    .flags
                    ?.visibleBlood
                    ? 'selected'
                    : ''
                }
                onClick={() =>
                  toggleFlag(
                    'visibleBlood'
                  )
                }
              >
                Sangue visível
              </button>

              <button
                type="button"
                className={
                  customEncounter
                    .flags
                    ?.bloodScent
                    ? 'selected'
                    : ''
                }
                onClick={() =>
                  toggleFlag(
                    'bloodScent'
                  )
                }
              >
                Cheiro de sangue
              </button>

              <button
                type="button"
                className={
                  customEncounter
                    .environment
                    ?.fire
                    ? 'selected'
                    : ''
                }
                onClick={() =>
                  toggleEnvironment(
                    'fire'
                  )
                }
              >
                Fogo
              </button>
            </div>
          </section>

          <section className="dev-combat-arena__block">
            <h3>
              Estado
            </h3>

            <label>
              Vitalidade máxima

              <input
                type="number"
                min="1"
                max="20"
                value={
                  customEncounter
                    .enemy
                    .health
                    ?.maximum ??
                  7
                }
                onChange={(
                  event
                ) =>
                  updateHealth(
                    'maximum',
                    event.target
                      .value
                  )
                }
              />
            </label>

            <label>
              Força de Vontade

              <input
                type="number"
                min="1"
                max="10"
                value={
                  customEncounter
                    .enemy
                    .willpower ??
                  6
                }
                onChange={(
                  event
                ) =>
                  updateEnemy(
                    'willpower',
                    Math.max(
                      1,
                      safeNumber(
                        event.target
                          .value,
                        1
                      )
                    )
                  )
                }
              />
            </label>

            <label>
              Humanidade

              <input
                type="number"
                min="0"
                max="10"
                value={
                  customEncounter
                    .enemy
                    .humanity ??
                  5
                }
                onChange={(
                  event
                ) =>
                  updateEnemy(
                    'humanity',
                    Math.max(
                      0,
                      safeNumber(
                        event.target
                          .value,
                        0
                      )
                    )
                  )
                }
              />
            </label>
          </section>

          <section className="dev-combat-arena__block dev-combat-arena__wide">
            <h3>
              Atributos
            </h3>

            <div className="dev-combat-arena__numeric-grid">
              {ATTRIBUTES.map(
                (
                  attribute
                ) => (
                  <label
                    key={
                      attribute.id
                    }
                  >
                    {
                      attribute.label
                    }

                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={
                        customEncounter
                          .enemy
                          .attributes
                          ?.[
                            attribute.id
                          ] ??
                        0
                      }
                      onChange={(
                        event
                      ) =>
                        updateAttribute(
                          attribute.id,
                          event.target
                            .value
                        )
                      }
                    />
                  </label>
                )
              )}
            </div>
          </section>

          <section className="dev-combat-arena__block dev-combat-arena__wide">
            <h3>
              Habilidades
            </h3>

            <div className="dev-combat-arena__numeric-grid">
              {ABILITIES.map(
                (
                  ability
                ) => (
                  <label
                    key={
                      ability.id
                    }
                  >
                    {
                      ability.label
                    }

                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={
                        customEncounter
                          .enemy
                          .abilities
                          ?.[
                            ability.id
                          ] ??
                        0
                      }
                      onChange={(
                        event
                      ) =>
                        updateAbility(
                          ability.id,
                          event.target
                            .value
                        )
                      }
                    />
                  </label>
                )
              )}
            </div>
          </section>

          <section className="dev-combat-arena__block dev-combat-arena__wide">
            <h3>
              Virtudes
            </h3>

            <div className="dev-combat-arena__numeric-grid">
              {VIRTUES.map(
                (
                  virtue
                ) => (
                  <label
                    key={
                      virtue.id
                    }
                  >
                    {
                      virtue.label
                    }

                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={
                        customEncounter
                          .enemy
                          .virtues
                          ?.[
                            virtue.id
                          ] ??
                        0
                      }
                      onChange={(
                        event
                      ) =>
                        updateVirtue(
                          virtue.id,
                          event.target
                            .value
                        )
                      }
                    />
                  </label>
                )
              )}
            </div>
          </section>

          <section className="dev-combat-arena__block dev-combat-arena__disciplines">
            <h3>
              Disciplinas
            </h3>

            <div className="dev-combat-arena__discipline-grid">
              {DISCIPLINES.map(
                (
                  discipline
                ) => (
                  <label
                    key={
                      discipline.id
                    }
                  >
                    {
                      discipline.label
                    }

                    <input
                      type="number"
                      min="0"
                      max="8"
                      value={
                        customEncounter
                          .enemy
                          .disciplines
                          ?.[
                            discipline.id
                          ] ??
                        0
                      }
                      onChange={(
                        event
                      ) =>
                        updateDiscipline(
                          discipline.id,
                          event.target
                            .value
                        )
                      }
                    />
                  </label>
                )
              )}
            </div>
          </section>
        </div>

        <footer className="dev-combat-arena__footer">
          <div>
            <span>
              INIMIGO
            </span>

            <strong>
              {
                customEncounter
                  .enemy
                  .name
              }
            </strong>

            <small>
              {
                customEncounter
                  .enemy
                  .clan
              }

              {' · '}

              {
                customEncounter
                  .enemy
                  .generation
              }

              {' · '}

              {
                customEncounter
                  .enemy
                  .combatPersonality
              }
            </small>
          </div>

          <button
            type="button"
            onClick={
              handleStart
            }
          >
            INICIAR COMBATE
          </button>
        </footer>
      </section>
    </div>
  )
}