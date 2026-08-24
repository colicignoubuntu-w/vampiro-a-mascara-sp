import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  buildFinalCharacter,
  saveFinalCharacter,
} from '../../utils/characterFinalizer'

const BONUS_TOTAL = 15

const costs = {
  attribute: 5,
  ability: 2,
  discipline: 7,
  background: 1,
  virtue: 2,
  humanity: 1,
  willpower: 1,
}

const attributeLabels = {
  physical: {
    strength: 'Força',
    dexterity: 'Destreza',
    stamina: 'Vigor',
  },

  social: {
    charisma: 'Carisma',
    manipulation:
      'Manipulação',
    appearance: 'Aparência',
  },

  mental: {
    perception: 'Percepção',
    intelligence:
      'Inteligência',
    wits: 'Raciocínio',
  },
}

const abilityLabels = {
  alertness: 'Prontidão',
  athletics: 'Esportes',
  brawl: 'Briga',
  dodge: 'Esquiva',
  empathy: 'Empatia',
  expression: 'Expressão',
  intimidation:
    'Intimidação',
  leadership: 'Liderança',
  streetwise: 'Manha',
  subterfuge: 'Lábia',

  animalKen:
    'Emp. Animal',

  crafts: 'Ofícios',
  drive: 'Condução',
  etiquette: 'Etiqueta',

  firearms:
    'Arm. Fogo',

  melee:
    'Arm. Branca',

  performance:
    'Performance',

  security:
    'Segurança',

  stealth:
    'Furtividade',

  survival:
    'Sobrevivência',

  academics:
    'Acadêmicos',

  computer:
    'Computador',

  finance:
    'Finanças',

  investigation:
    'Investigação',

  law:
    'Direito',

  linguistics:
    'Linguística',

  medicine:
    'Medicina',

  occult:
    'Ocultismo',

  politics:
    'Política',

  science:
    'Ciência',
}

const backgroundLabels = {
  allies: 'Aliados',
  contacts: 'Contatos',
  fame: 'Fama',
  generation: 'Geração',
  herd: 'Rebanho',
  influence: 'Influência',
  mentor: 'Mentor',
  resources: 'Recursos',
  retainers: 'Lacaios',
  status: 'Status',
}

const virtueLabels = {
  conscience:
    'Consciência',

  selfControl:
    'Autocontrole',

  courage:
    'Coragem',
}

function Dots({
  value,
  max = 5,
}) {
  return (
    <div className="bonus-dots">
      {Array.from({
        length: max,
      }).map(
        (_, index) => (
          <span
            key={index}
            className={
              index < value
                ? 'bonus-dot active'
                : 'bonus-dot'
            }
          />
        )
      )}
    </div>
  )
}

export default function BonusPointsStep({
  identity,

  attributes,

  abilitiesData,

  disciplinesData,

  backgroundsData,

  virtuesData,

  humanity,

  willpower,

  initialData,

  onBack,

  onChange,

  onFinish,
}) {
  const [
    bonusAttributes,
    setBonusAttributes,
  ] = useState(
    initialData
      ?.attributes ?? {}
  )

  const [
    bonusAbilities,
    setBonusAbilities,
  ] = useState(
    initialData
      ?.abilities ?? {}
  )

  const [
    bonusDisciplines,
    setBonusDisciplines,
  ] = useState(
    initialData
      ?.disciplines ?? {}
  )

  const [
    bonusBackgrounds,
    setBonusBackgrounds,
  ] = useState(
    initialData
      ?.backgrounds ?? {}
  )

  const [
    bonusVirtues,
    setBonusVirtues,
  ] = useState(
    initialData
      ?.virtues ?? {}
  )

  const [
    bonusHumanity,
    setBonusHumanity,
  ] = useState(
    initialData
      ?.humanity ?? 0
  )

  const [
    bonusWillpower,
    setBonusWillpower,
  ] = useState(
    initialData
      ?.willpower ?? 0
  )

  const spent =
    useMemo(() => {
      let total = 0

      Object.values(
        bonusAttributes
      ).forEach(
        (value) => {
          total +=
            value *
            costs.attribute
        }
      )

      Object.values(
        bonusAbilities
      ).forEach(
        (value) => {
          total +=
            value *
            costs.ability
        }
      )

      Object.values(
        bonusDisciplines
      ).forEach(
        (value) => {
          total +=
            value *
            costs.discipline
        }
      )

      Object.values(
        bonusBackgrounds
      ).forEach(
        (value) => {
          total +=
            value *
            costs.background
        }
      )

      Object.values(
        bonusVirtues
      ).forEach(
        (value) => {
          total +=
            value *
            costs.virtue
        }
      )

      total +=
        bonusHumanity

      total +=
        bonusWillpower

      return total
    }, [
      bonusAttributes,
      bonusAbilities,
      bonusDisciplines,
      bonusBackgrounds,
      bonusVirtues,
      bonusHumanity,
      bonusWillpower,
    ])

  const remaining =
    BONUS_TOTAL -
    spent

  const finalAttributes =
    useMemo(() => {
      const result =
        structuredClone(
          attributes
        )

      Object.entries(
        bonusAttributes
      ).forEach(
        ([
          compoundKey,
          value,
        ]) => {
          const [
            groupKey,
            attributeKey,
          ] =
            compoundKey.split('.')

          result[
            groupKey
          ][
            attributeKey
          ] += value
        }
      )

      return result
    }, [
      attributes,
      bonusAttributes,
    ])

  const finalAbilities =
    useMemo(() => {
      const base =
        abilitiesData
          ?.abilities ?? {}

      const result = {
        ...base,
      }

      Object.entries(
        bonusAbilities
      ).forEach(
        ([key, value]) => {
          result[key] =
            (base[key] ?? 0) +
            value
        }
      )

      return result
    }, [
      abilitiesData,
      bonusAbilities,
    ])

  const finalDisciplines =
    useMemo(() => {
      const base =
        disciplinesData
          ?.disciplines ?? {}

      const result = {
        ...base,
      }

      Object.entries(
        bonusDisciplines
      ).forEach(
        ([key, value]) => {
          result[key] =
            (base[key] ?? 0) +
            value
        }
      )

      return result
    }, [
      disciplinesData,
      bonusDisciplines,
    ])

  const finalBackgrounds =
    useMemo(() => {
      const base =
        backgroundsData
          ?.backgrounds ?? {}

      const result = {
        ...base,
      }

      Object.entries(
        bonusBackgrounds
      ).forEach(
        ([key, value]) => {
          result[key] =
            (base[key] ?? 0) +
            value
        }
      )

      return result
    }, [
      backgroundsData,
      bonusBackgrounds,
    ])

  const finalVirtues =
    useMemo(() => {
      const base =
        virtuesData
          ?.virtues ?? {}

      const result = {
        ...base,
      }

      Object.entries(
        bonusVirtues
      ).forEach(
        ([key, value]) => {
          result[key] =
            (base[key] ?? 1) +
            value
        }
      )

      return result
    }, [
      virtuesData,
      bonusVirtues,
    ])

  const finalHumanity =
    Math.min(
      10,
      humanity +
        bonusHumanity
    )

  const finalWillpower =
    Math.min(
      10,
      willpower +
        bonusWillpower
    )

  function increase(
    category,
    key,
    currentValue,
    max = 5
  ) {
    const cost =
      costs[category]

    if (
      remaining < cost
    ) {
      return
    }

    if (
      currentValue >= max
    ) {
      return
    }

    const setters = {
      attribute:
        setBonusAttributes,

      ability:
        setBonusAbilities,

      discipline:
        setBonusDisciplines,

      background:
        setBonusBackgrounds,

      virtue:
        setBonusVirtues,
    }

    if (
      setters[category]
    ) {
      setters[category](
        (current) => ({
          ...current,

          [key]:
            (current[key] ?? 0) +
            1,
        })
      )

      return
    }

    if (
      category ===
      'humanity'
    ) {
      setBonusHumanity(
        (value) =>
          value + 1
      )
    }

    if (
      category ===
      'willpower'
    ) {
      setBonusWillpower(
        (value) =>
          value + 1
      )
    }
  }

  function decrease(
    category,
    key
  ) {
    const collections = {
      attribute: {
        values:
          bonusAttributes,

        setter:
          setBonusAttributes,
      },

      ability: {
        values:
          bonusAbilities,

        setter:
          setBonusAbilities,
      },

      discipline: {
        values:
          bonusDisciplines,

        setter:
          setBonusDisciplines,
      },

      background: {
        values:
          bonusBackgrounds,

        setter:
          setBonusBackgrounds,
      },

      virtue: {
        values:
          bonusVirtues,

        setter:
          setBonusVirtues,
      },
    }

    if (
      collections[
        category
      ]
    ) {
      const {
        values,
        setter,
      } =
        collections[
          category
        ]

      const value =
        values[key] ?? 0

      if (value <= 0) {
        return
      }

      setter(
        (current) => ({
          ...current,

          [key]:
            value - 1,
        })
      )

      return
    }

    if (
      category ===
      'humanity'
    ) {
      if (
        bonusHumanity <= 0
      ) {
        return
      }

      setBonusHumanity(
        (value) =>
          value - 1
      )
    }

    if (
      category ===
      'willpower'
    ) {
      if (
        bonusWillpower <= 0
      ) {
        return
      }

      setBonusWillpower(
        (value) =>
          value - 1
      )
    }
  }

  const resultData = {
    spent,

    attributes:
      bonusAttributes,

    abilities:
      bonusAbilities,

    disciplines:
      bonusDisciplines,

    backgrounds:
      bonusBackgrounds,

    virtues:
      bonusVirtues,

    humanity:
      bonusHumanity,

    willpower:
      bonusWillpower,

    finalAttributes,

    finalAbilities,

    finalDisciplines,

    finalBackgrounds,

    finalVirtues,

    finalHumanity,

    finalWillpower,
  }

  useEffect(() => {
    onChange?.(
      resultData
    )
  }, [
    bonusAttributes,
    bonusAbilities,
    bonusDisciplines,
    bonusBackgrounds,
    bonusVirtues,
    bonusHumanity,
    bonusWillpower,
  ])

  function finalizeCharacter() {
    if (
      remaining !== 0
    ) {
      return
    }

    const character =
      buildFinalCharacter({
        identity,

        attributes:
          finalAttributes,

        abilitiesData: {
          abilities:
            finalAbilities,
        },

        disciplinesData: {
          disciplines:
            finalDisciplines,
        },

        backgroundsData: {
          backgrounds:
            finalBackgrounds,
        },

        virtuesData: {
          virtues:
            finalVirtues,
        },

        humanity:
          finalHumanity,

        willpower:
          finalWillpower,

        bonusData:
          resultData,
      })

    saveFinalCharacter(
      character
    )

    onFinish?.(
      character
    )
  }

  function BonusRow({
    label,

    value,

    category,

    dataKey,

    max = 5,
  }) {
    return (
      <div className="bonus-row">
        <span className="bonus-name">
          {label}
        </span>

        <span className="sheet-dots-line" />

        <Dots
          value={value}
          max={max}
        />

        <div className="bonus-controls">
          <button
            type="button"
            onClick={() =>
              decrease(
                category,
                dataKey
              )
            }
          >
            −
          </button>

          <button
            type="button"
            onClick={() =>
              increase(
                category,
                dataKey,
                value,
                max
              )
            }
          >
            +
          </button>
        </div>
      </div>
    )
  }

  return (
    <section className="creation-panel">
      <div className="creation-section">
        <h2 className="sheet-style-title">
          PONTOS BÔNUS
        </h2>

        <p className="creation-help">
          Distribua os 15
          pontos bônus para
          concluir o personagem.
        </p>

        <div className="bonus-summary">
          <div>
            <span>
              Disponíveis
            </span>

            <strong>
              {remaining}
            </strong>
          </div>

          <div>
            <span>
              Gastos
            </span>

            <strong>
              {spent}
            </strong>
          </div>
        </div>

        <div className="bonus-costs">
          <span>
            Atributo: 5
          </span>

          <span>
            Habilidade: 2
          </span>

          <span>
            Disciplina: 7
          </span>

          <span>
            Antecedente: 1
          </span>

          <span>
            Virtude: 2
          </span>

          <span>
            Humanidade: 1
          </span>

          <span>
            Vontade: 1
          </span>
        </div>

        <section className="bonus-section">
          <h3>
            ATRIBUTOS
          </h3>

          <div className="bonus-three-columns">
            {Object.entries(
              attributeLabels
            ).map(
              ([
                groupKey,
                group,
              ]) => (
                <div
                  key={
                    groupKey
                  }
                >
                  {Object.entries(
                    group
                  ).map(
                    ([
                      key,
                      label,
                    ]) => (
                      <BonusRow
                        key={key}

                        label={
                          label
                        }

                        value={
                          finalAttributes[
                            groupKey
                          ][
                            key
                          ]
                        }

                        category="attribute"

                        dataKey={`${groupKey}.${key}`}
                      />
                    )
                  )}
                </div>
              )
            )}
          </div>
        </section>

        <section className="bonus-section">
          <h3>
            HABILIDADES
          </h3>

          <div className="bonus-grid">
            {Object.entries(
              abilityLabels
            ).map(
              ([
                key,
                label,
              ]) => (
                <BonusRow
                  key={key}

                  label={label}

                  value={
                    finalAbilities[
                      key
                    ] ?? 0
                  }

                  category="ability"

                  dataKey={key}
                />
              )
            )}
          </div>
        </section>

        <section className="bonus-section">
          <h3>
            DISCIPLINAS
          </h3>

          <div className="bonus-grid">
            {Object.entries(
              finalDisciplines
            ).map(
              ([
                key,
                value,
              ]) => (
                <BonusRow
                  key={key}

                  label={key}

                  value={value}

                  category="discipline"

                  dataKey={key}
                />
              )
            )}
          </div>
        </section>

        <section className="bonus-section">
          <h3>
            ANTECEDENTES
          </h3>

          <div className="bonus-grid">
            {Object.entries(
              backgroundLabels
            ).map(
              ([
                key,
                label,
              ]) => (
                <BonusRow
                  key={key}

                  label={label}

                  value={
                    finalBackgrounds[
                      key
                    ] ?? 0
                  }

                  category="background"

                  dataKey={key}
                />
              )
            )}
          </div>
        </section>

        <section className="bonus-section">
          <h3>
            VIRTUDES
          </h3>

          <div className="bonus-grid">
            {Object.entries(
              virtueLabels
            ).map(
              ([
                key,
                label,
              ]) => (
                <BonusRow
                  key={key}

                  label={label}

                  value={
                    finalVirtues[
                      key
                    ] ?? 1
                  }

                  category="virtue"

                  dataKey={key}
                />
              )
            )}
          </div>
        </section>

        <section className="bonus-section">
          <h3>
            OUTROS
          </h3>

          <BonusRow
            label="Humanidade"

            value={
              finalHumanity
            }

            category="humanity"

            dataKey="humanity"

            max={10}
          />

          <BonusRow
            label="Força de Vontade"

            value={
              finalWillpower
            }

            category="willpower"

            dataKey="willpower"

            max={10}
          />
        </section>
      </div>

      <div className="creation-actions creation-actions-between">
        <button
          type="button"
          className="secondary-button"
          onClick={
            onBack
          }
        >
          Voltar para Virtudes
        </button>

        <button
          type="button"
          className="primary-button"
          disabled={
            remaining !== 0
          }
          onClick={
            finalizeCharacter
          }
        >
          Finalizar Personagem
        </button>
      </div>
    </section>
  )
}