import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import DotSelector from './DotSelector'

const abilityGroups = {
  talents: {
    label: 'TALENTOS',

    abilities: {
      alertness: 'Prontidão',
      athletics: 'Esportes',
      brawl: 'Briga',
      dodge: 'Esquiva',
      empathy: 'Empatia',
      expression: 'Expressão',
      intimidation: 'Intimidação',
      leadership: 'Liderança',
      streetwise: 'Manha',
      subterfuge: 'Lábia',
    },
  },

  skills: {
    label: 'PERÍCIAS',

    abilities: {
      animalKen: 'Emp. Animal',
      crafts: 'Ofícios',
      drive: 'Condução',
      etiquette: 'Etiqueta',
      firearms: 'Arm. Fogo',
      melee: 'Arm. Branca',
      performance: 'Performance',
      security: 'Segurança',
      stealth: 'Furtividade',
      survival: 'Sobrevivência',
    },
  },

  knowledges: {
    label: 'CONHECIMENTOS',

    abilities: {
      academics: 'Acadêmicos',
      computer: 'Computador',
      finance: 'Finanças',
      investigation: 'Investigação',
      law: 'Direito',
      linguistics: 'Linguística',
      medicine: 'Medicina',
      occult: 'Ocultismo',
      politics: 'Política',
      science: 'Ciência',
    },
  },
}

const pointsByPriority = {
  primary: 13,
  secondary: 9,
  tertiary: 5,
}

function createInitialAbilities() {
  const abilities = {}

  Object.values(
    abilityGroups
  ).forEach((group) => {
    Object.keys(
      group.abilities
    ).forEach(
      (key) => {
        abilities[key] = 0
      }
    )
  })

  return abilities
}

export default function AbilitiesStep({
  initialData,
  onBack,
  onChange,
  onContinue,
}) {
  const [abilities, setAbilities] =
    useState(
      initialData?.abilities ??
      createInitialAbilities()
    )

  const [priorities, setPriorities] =
    useState(
      initialData?.priorities ?? {
        talents: 'primary',
        skills: 'secondary',
        knowledges: 'tertiary',
      }
    )

  function getSpent(
    groupKey
  ) {
    return Object.keys(
      abilityGroups[groupKey]
        .abilities
    ).reduce(
      (total, abilityKey) =>
        total +
        abilities[abilityKey],
      0
    )
  }

  function getRemaining(
    groupKey
  ) {
    return (
      pointsByPriority[
        priorities[groupKey]
      ] -
      getSpent(groupKey)
    )
  }

  function updateAbility(
    groupKey,
    abilityKey,
    newValue
  ) {
    if (
      newValue < 0 ||
      newValue > 3
    ) {
      return
    }

    const current =
      abilities[abilityKey]

    const difference =
      newValue - current

    if (
      difference > 0 &&
      difference >
        getRemaining(
          groupKey
        )
    ) {
      return
    }

    setAbilities(
      (currentAbilities) => ({
        ...currentAbilities,

        [abilityKey]:
          newValue,
      })
    )
  }

  function changePriority(
    groupKey,
    newPriority
  ) {
    const oldPriority =
      priorities[groupKey]

    if (
      oldPriority ===
      newPriority
    ) {
      return
    }

    const other =
      Object.entries(
        priorities
      ).find(
        ([key, value]) =>
          key !== groupKey &&
          value ===
            newPriority
      )

    if (!other) {
      return
    }

    const [otherKey] =
      other

    setPriorities(
      (current) => ({
        ...current,

        [groupKey]:
          newPriority,

        [otherKey]:
          oldPriority,
      })
    )

    setAbilities(
      createInitialAbilities()
    )
  }

  const allPointsSpent =
    useMemo(() => {
      return Object.keys(
        abilityGroups
      ).every(
        (groupKey) =>
          getRemaining(
            groupKey
          ) === 0
      )
    }, [
      abilities,
      priorities,
    ])

  useEffect(() => {
    onChange?.({
      abilities,
      priorities,
    })
  }, [
    abilities,
    priorities,
  ])

  return (
    <section className="creation-panel abilities-sheet">
      <div className="creation-section">
        <h2 className="sheet-style-title">
          HABILIDADES
        </h2>

        <p className="creation-help">
          Distribua 13, 9 e 5
          pontos entre Talentos,
          Perícias e Conhecimentos.
          Máximo de 3 pontos por
          Habilidade nesta etapa.
        </p>

        <div className="abilities-sheet-grid">
          {Object.entries(
            abilityGroups
          ).map(
            ([
              groupKey,
              group,
            ]) => (
              <section
                className="sheet-ability-column"
                key={
                  groupKey
                }
              >
                <div className="sheet-ability-header">
                  <h3>
                    {group.label}
                  </h3>

                  <select
                    value={
                      priorities[
                        groupKey
                      ]
                    }
                    onChange={(
                      event
                    ) =>
                      changePriority(
                        groupKey,
                        event
                          .target
                          .value
                      )
                    }
                  >
                    <option value="primary">
                      Primário — 13
                    </option>

                    <option value="secondary">
                      Secundário — 9
                    </option>

                    <option value="tertiary">
                      Terciário — 5
                    </option>
                  </select>

                  <span>
                    Restantes:{' '}

                    <strong>
                      {getRemaining(
                        groupKey
                      )}
                    </strong>
                  </span>
                </div>

                <div className="sheet-ability-list">
                  {Object.entries(
                    group.abilities
                  ).map(
                    ([
                      abilityKey,
                      label,
                    ]) => (
                      <div
                        className="sheet-ability-row"
                        key={
                          abilityKey
                        }
                      >
                        <span className="sheet-ability-name">
                          {label}
                        </span>

                        <span className="sheet-dots-line" />

                        <DotSelector
                          value={
                            abilities[
                              abilityKey
                            ]
                          }
                          min={0}
                          max={5}
                          onChange={(
                            value
                          ) =>
                            updateAbility(
                              groupKey,
                              abilityKey,
                              value
                            )
                          }
                        />
                      </div>
                    )
                  )}
                </div>
              </section>
            )
          )}
        </div>
      </div>

      <div className="creation-actions creation-actions-between">
        <button
          type="button"
          className="secondary-button"
          onClick={onBack}
        >
          Voltar
        </button>

        <button
          type="button"
          className="primary-button"
          disabled={
            !allPointsSpent
          }
          onClick={() =>
            onContinue({
              abilities,
              priorities,
            })
          }
        >
          Continuar para Disciplinas
        </button>
      </div>
    </section>
  )
}