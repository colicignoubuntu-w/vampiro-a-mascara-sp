import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import DotSelector from '../components/CharacterSheet/DotSelector'
import AbilitiesStep from '../components/CharacterSheet/AbilitiesStep'
import DisciplinesStep from '../components/CharacterSheet/DisciplinesStep'
import BackgroundsStep from '../components/CharacterSheet/BackgroundsStep'
import VirtuesStep from '../components/CharacterSheet/VirtuesStep'
import BonusPointsStep from '../components/CharacterSheet/BonusPointsStep'

const SAVE_KEY =
  'vampiro-sp-character-creation'

const clans = [
  'Brujah',
  'Gangrel',
  'Malkavian',
  'Nosferatu',
  'Toreador',
  'Tremere',
  'Ventrue',
]

const attributeGroups = {
  physical: {
    label: 'FÍSICOS',

    attributes: {
      strength: 'Força',
      dexterity: 'Destreza',
      stamina: 'Vigor',
    },
  },

  social: {
    label: 'SOCIAIS',

    attributes: {
      charisma: 'Carisma',
      manipulation: 'Manipulação',
      appearance: 'Aparência',
    },
  },

  mental: {
    label: 'MENTAIS',

    attributes: {
      perception: 'Percepção',
      intelligence: 'Inteligência',
      wits: 'Raciocínio',
    },
  },
}

const attributePriorityPoints = {
  primary: 7,
  secondary: 5,
  tertiary: 3,
}

function createInitialAttributes() {
  return {
    physical: {
      strength: 1,
      dexterity: 1,
      stamina: 1,
    },

    social: {
      charisma: 1,
      manipulation: 1,
      appearance: 1,
    },

    mental: {
      perception: 1,
      intelligence: 1,
      wits: 1,
    },
  }
}

function createInitialIdentity() {
  return {
    name: '',
    player: '',
    chronicle: 'São Paulo',

    nature: '',
    demeanor: '',
    clan: 'Malkavian',

    generation: '13ª',
    refuge: '',
    concept: '',
  }
}

export default function CharacterCreation({
  onOpenSheet,
}) {
  const [step, setStep] =
    useState(1)

  const [
    identity,
    setIdentity,
  ] = useState(
    createInitialIdentity()
  )

  const [
    attributes,
    setAttributes,
  ] = useState(
    createInitialAttributes()
  )

  const [
    attributePriorities,
    setAttributePriorities,
  ] = useState({
    physical: 'primary',
    social: 'secondary',
    mental: 'tertiary',
  })

  const [
    abilitiesData,
    setAbilitiesData,
  ] = useState(null)

  const [
    disciplinesData,
    setDisciplinesData,
  ] = useState(null)

  const [
    backgroundsData,
    setBackgroundsData,
  ] = useState(null)

  const [
    virtuesData,
    setVirtuesData,
  ] = useState(null)

  const [
    bonusData,
    setBonusData,
  ] = useState(null)

  const [
    humanity,
    setHumanity,
  ] = useState(7)

  const [
    willpower,
    setWillpower,
  ] = useState(0)

  const [
    blood,
    setBlood,
  ] = useState(0)

  const [
    experience,
    setExperience,
  ] = useState(0)

  const [
    saveLoaded,
    setSaveLoaded,
  ] = useState(false)

  /* =========================
     CARREGAR SAVE
  ========================= */

  useEffect(() => {
    const saved =
      localStorage.getItem(
        SAVE_KEY
      )

    if (!saved) {
      setSaveLoaded(true)
      return
    }

    try {
      const data =
        JSON.parse(saved)

      if (
        typeof data.step ===
        'number'
      ) {
        setStep(data.step)
      }

      if (data.identity) {
        setIdentity(
          data.identity
        )
      }

      if (data.attributes) {
        setAttributes(
          data.attributes
        )
      }

      if (
        data.attributePriorities
      ) {
        setAttributePriorities(
          data.attributePriorities
        )
      }

      if (
        data.abilitiesData
      ) {
        setAbilitiesData(
          data.abilitiesData
        )
      }

      if (
        data.disciplinesData
      ) {
        setDisciplinesData(
          data.disciplinesData
        )
      }

      if (
        data.backgroundsData
      ) {
        setBackgroundsData(
          data.backgroundsData
        )
      }

      if (
        data.virtuesData
      ) {
        setVirtuesData(
          data.virtuesData
        )
      }

      if (
        data.bonusData
      ) {
        setBonusData(
          data.bonusData
        )
      }

      if (
        typeof data.humanity ===
        'number'
      ) {
        setHumanity(
          data.humanity
        )
      }

      if (
        typeof data.willpower ===
        'number'
      ) {
        setWillpower(
          data.willpower
        )
      }

      if (
        typeof data.blood ===
        'number'
      ) {
        setBlood(
          data.blood
        )
      }

      if (
        typeof data.experience ===
        'number'
      ) {
        setExperience(
          data.experience
        )
      }
    } catch (error) {
      console.error(
        'Erro ao carregar ficha:',
        error
      )
    } finally {
      setSaveLoaded(true)
    }
  }, [])

  /* =========================
     AUTOSAVE
  ========================= */

  useEffect(() => {
    if (!saveLoaded) {
      return
    }

    const data = {
      version: 2,

      step,

      identity,

      attributes,

      attributePriorities,

      abilitiesData,

      disciplinesData,

      backgroundsData,

      virtuesData,

      bonusData,

      humanity,

      willpower,

      blood,

      experience,

      savedAt:
        new Date().toISOString(),
    }

    localStorage.setItem(
      SAVE_KEY,
      JSON.stringify(data)
    )
  }, [
    saveLoaded,
    step,
    identity,
    attributes,
    attributePriorities,
    abilitiesData,
    disciplinesData,
    backgroundsData,
    virtuesData,
    bonusData,
    humanity,
    willpower,
    blood,
    experience,
  ])

  function updateIdentity(
    field,
    value
  ) {
    setIdentity(
      (current) => ({
        ...current,
        [field]: value,
      })
    )
  }

  function getAttributeSpent(
    groupKey
  ) {
    return Object.values(
      attributes[groupKey]
    ).reduce(
      (total, value) =>
        total +
        (value - 1),
      0
    )
  }

  function getAttributeRemaining(
    groupKey
  ) {
    const priority =
      attributePriorities[
      groupKey
      ]

    return (
      attributePriorityPoints[
      priority
      ] -
      getAttributeSpent(
        groupKey
      )
    )
  }

  function updateAttribute(
    groupKey,
    attributeKey,
    newValue
  ) {
    if (
      newValue < 1 ||
      newValue > 5
    ) {
      return
    }

    const currentValue =
      attributes[
      groupKey
      ][
      attributeKey
      ]

    const difference =
      newValue -
      currentValue

    if (
      difference > 0 &&
      difference >
      getAttributeRemaining(
        groupKey
      )
    ) {
      return
    }

    setAttributes(
      (current) => ({
        ...current,

        [groupKey]: {
          ...current[
          groupKey
          ],

          [attributeKey]:
            newValue,
        },
      })
    )
  }

  function changeAttributePriority(
    groupKey,
    newPriority
  ) {
    const currentPriority =
      attributePriorities[
      groupKey
      ]

    if (
      currentPriority ===
      newPriority
    ) {
      return
    }

    const other =
      Object.entries(
        attributePriorities
      ).find(
        ([key, value]) =>
          key !== groupKey &&
          value ===
          newPriority
      )

    if (!other) {
      return
    }

    const [
      otherGroupKey,
    ] = other

    setAttributePriorities(
      (current) => ({
        ...current,

        [groupKey]:
          newPriority,

        [otherGroupKey]:
          currentPriority,
      })
    )

    setAttributes(
      createInitialAttributes()
    )
  }

  const allAttributePointsSpent =
    useMemo(() => {
      return Object.keys(
        attributeGroups
      ).every(
        (groupKey) =>
          getAttributeRemaining(
            groupKey
          ) === 0
      )
    }, [
      attributes,
      attributePriorities,
    ])

  function getProgressClass(
    targetStep
  ) {
    if (
      step === targetStep
    ) {
      return (
        'progress-step active'
      )
    }

    if (
      step > targetStep
    ) {
      return (
        'progress-step complete'
      )
    }

    return 'progress-step'
  }

  function resetCharacterCreation() {
    const confirmed =
      window.confirm(
        'Deseja apagar esta ficha e começar novamente?'
      )

    if (!confirmed) {
      return
    }

    localStorage.removeItem(
      SAVE_KEY
    )

    setStep(1)

    setIdentity(
      createInitialIdentity()
    )

    setAttributes(
      createInitialAttributes()
    )

    setAttributePriorities({
      physical: 'primary',
      social: 'secondary',
      mental: 'tertiary',
    })

    setAbilitiesData(null)

    setDisciplinesData(null)

    setBackgroundsData(null)

    setVirtuesData(null)

    setBonusData(null)

    setHumanity(7)

    setWillpower(0)

    setBlood(0)

    setExperience(0)
  }

  return (
    <main className="character-creation">
      {/* =========================
          CABEÇALHO
      ========================= */}

      <section className="creation-header">
        <div>
          <span className="creation-kicker">
            VAMPIRO: SÃO PAULO
          </span>

          <h1>
            Criação do Personagem
          </h1>

          <p>
            Monte sua ficha antes
            de entrar nas noites
            de São Paulo.
          </p>
        </div>

        <div className="creation-header-actions">
          <button
            type="button"
            className="sheet-open-button"
            onClick={
              onOpenSheet
            }
          >
            Ficha
          </button>

          <button
            type="button"
            className="reset-creation-button"
            onClick={
              resetCharacterCreation
            }
          >
            Nova ficha
          </button>
        </div>
      </section>

      {/* =========================
          PROGRESSO
      ========================= */}

      <section className="creation-progress">
        {[
          'Conceito',
          'Atributos',
          'Habilidades',
          'Disciplinas',
          'Antecedentes',
          'Virtudes',
          'Revisão',
        ].map(
          (
            label,
            index
          ) => {
            const number =
              index + 1

            return (
              <div
                key={label}
                className={
                  getProgressClass(
                    number
                  )
                }
              >
                <strong>
                  {number}
                </strong>

                <span>
                  {label}
                </span>
              </div>
            )
          }
        )}
      </section>

      {/* =========================
          ETAPA 1
          IDENTIDADE
      ========================= */}

      {step === 1 && (
        <section className="creation-panel">
          <div className="creation-section">
            <h2>
              Identidade
            </h2>

            <div className="identity-sheet-grid">
              <div>
                <label>
                  Nome

                  <input
                    type="text"
                    value={
                      identity.name
                    }
                    onChange={(
                      event
                    ) =>
                      updateIdentity(
                        'name',
                        event
                          .target
                          .value
                      )
                    }
                  />
                </label>

                <label>
                  Jogador

                  <input
                    type="text"
                    value={
                      identity.player
                    }
                    onChange={(
                      event
                    ) =>
                      updateIdentity(
                        'player',
                        event
                          .target
                          .value
                      )
                    }
                  />
                </label>

                <label>
                  Crônica

                  <input
                    type="text"
                    value={
                      identity.chronicle
                    }
                    onChange={(
                      event
                    ) =>
                      updateIdentity(
                        'chronicle',
                        event
                          .target
                          .value
                      )
                    }
                  />
                </label>
              </div>

              <div>
                <label>
                  Natureza

                  <input
                    type="text"
                    value={
                      identity.nature
                    }
                    onChange={(
                      event
                    ) =>
                      updateIdentity(
                        'nature',
                        event
                          .target
                          .value
                      )
                    }
                  />
                </label>

                <label>
                  Comportamento

                  <input
                    type="text"
                    value={
                      identity.demeanor
                    }
                    onChange={(
                      event
                    ) =>
                      updateIdentity(
                        'demeanor',
                        event
                          .target
                          .value
                      )
                    }
                  />
                </label>

                <label>
                  Clã

                  <input
                    type="text"
                    value={
                      identity.clan
                    }
                    readOnly
                  />
                </label>
              </div>

              <div>
                <label>
                  Geração

                  <input
                    type="text"
                    value={
                      identity.generation
                    }
                    readOnly
                  />
                </label>

                <label>
                  Refúgio

                  <input
                    type="text"
                    value={
                      identity.refuge
                    }
                    onChange={(
                      event
                    ) =>
                      updateIdentity(
                        'refuge',
                        event
                          .target
                          .value
                      )
                    }
                  />
                </label>

                <label>
                  Conceito

                  <input
                    type="text"
                    value={
                      identity.concept
                    }
                    onChange={(
                      event
                    ) =>
                      updateIdentity(
                        'concept',
                        event
                          .target
                          .value
                      )
                    }
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="creation-section">
            <h2>
              Clã
            </h2>

            <div className="clan-grid">
              {clans.map(
                (
                  clanName
                ) => (
                  <button
                    key={
                      clanName
                    }
                    type="button"
                    className={
                      identity.clan ===
                        clanName
                        ? 'clan-card selected'
                        : 'clan-card'
                    }
                    onClick={() =>
                      updateIdentity(
                        'clan',
                        clanName
                      )
                    }
                  >
                    <strong>
                      {
                        clanName
                      }
                    </strong>

                    <span>
                      {clanName ===
                        'Malkavian'
                        ? 'Percepção fragmentada, presságios e uma ligação inquietante com a realidade.'
                        : 'Clã disponível para criação.'}
                    </span>
                  </button>
                )
              )}
            </div>
          </div>

          <div className="creation-actions">
            <button
              type="button"
              className="primary-button"
              onClick={() =>
                setStep(2)
              }
            >
              Continuar para Atributos
            </button>
          </div>
        </section>
      )}

      {/* =========================
          ETAPA 2
          ATRIBUTOS
      ========================= */}

      {step === 2 && (
        <section className="creation-panel">
          <div className="creation-section">
            <h2 className="sheet-style-title">
              ATRIBUTOS
            </h2>

            <p className="creation-help">
              Distribua 7, 5 e 3
              pontos. Cada Atributo
              começa com 1.
            </p>

            <div className="attributes-grid">
              {Object.entries(
                attributeGroups
              ).map(
                ([
                  groupKey,
                  group,
                ]) => (
                  <section
                    className="attribute-group"
                    key={
                      groupKey
                    }
                  >
                    <div className="attribute-group-header">
                      <h3>
                        {
                          group.label
                        }
                      </h3>

                      <select
                        value={
                          attributePriorities[
                          groupKey
                          ]
                        }
                        onChange={(
                          event
                        ) =>
                          changeAttributePriority(
                            groupKey,
                            event
                              .target
                              .value
                          )
                        }
                      >
                        <option value="primary">
                          Primário — 7
                        </option>

                        <option value="secondary">
                          Secundário — 5
                        </option>

                        <option value="tertiary">
                          Terciário — 3
                        </option>
                      </select>

                      <span>
                        Restantes:{' '}

                        <strong>
                          {getAttributeRemaining(
                            groupKey
                          )}
                        </strong>
                      </span>
                    </div>

                    <div className="attribute-list">
                      {Object.entries(
                        group.attributes
                      ).map(
                        ([
                          attributeKey,
                          label,
                        ]) => (
                          <div
                            className="attribute-row sheet-row-style"
                            key={
                              attributeKey
                            }
                          >
                            <span>
                              {
                                label
                              }
                            </span>

                            <span className="sheet-dots-line" />

                            <DotSelector
                              value={
                                attributes[
                                groupKey
                                ][
                                attributeKey
                                ]
                              }
                              min={1}
                              max={5}
                              onChange={(
                                value
                              ) =>
                                updateAttribute(
                                  groupKey,
                                  attributeKey,
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
              onClick={() =>
                setStep(1)
              }
            >
              Voltar
            </button>

            <button
              type="button"
              className="primary-button"
              disabled={
                !allAttributePointsSpent
              }
              onClick={() =>
                setStep(3)
              }
            >
              Continuar para Habilidades
            </button>
          </div>
        </section>
      )}

      {/* =========================
          ETAPA 3
      ========================= */}

      {step === 3 && (
        <AbilitiesStep
          initialData={
            abilitiesData
          }

          onBack={() =>
            setStep(2)
          }

          onChange={(
            data
          ) =>
            setAbilitiesData(
              data
            )
          }

          onContinue={(
            data
          ) => {
            setAbilitiesData(
              data
            )

            setStep(4)
          }}
        />
      )}

      {/* =========================
          ETAPA 4
      ========================= */}

      {step === 4 && (
        <DisciplinesStep
          clan={
            identity.clan
          }

          initialData={
            disciplinesData
          }

          onBack={() =>
            setStep(3)
          }

          onChange={(
            data
          ) =>
            setDisciplinesData(
              data
            )
          }

          onContinue={(
            data
          ) => {
            setDisciplinesData(
              data
            )

            setStep(5)
          }}
        />
      )}

      {/* =========================
          ETAPA 5
      ========================= */}

      {step === 5 && (
        <BackgroundsStep
          initialData={
            backgroundsData
          }

          onBack={() =>
            setStep(4)
          }

          onChange={(
            data
          ) => {
            setBackgroundsData(
              data
            )

            setIdentity(
              (current) => ({
                ...current,

                generation:
                  data.generation,
              })
            )
          }}

          onContinue={(
            data
          ) => {
            setBackgroundsData(
              data
            )

            setIdentity(
              (current) => ({
                ...current,

                generation:
                  data.generation,
              })
            )

            setStep(6)
          }}
        />
      )}

      {/* =========================
          ETAPA 6
      ========================= */}

      {step === 6 && (
        <VirtuesStep
          initialData={
            virtuesData
          }

          onBack={() =>
            setStep(5)
          }

          onChange={(
            data
          ) => {
            setVirtuesData(
              data
            )

            setHumanity(
              data.humanity
            )

            setWillpower(
              data.willpower
            )
          }}

          onContinue={(
            data
          ) => {
            setVirtuesData(
              data
            )

            setHumanity(
              data.humanity
            )

            setWillpower(
              data.willpower
            )

            setStep(7)
          }}
        />
      )}

      {/* =========================
          ETAPA 7
          PONTOS BÔNUS
      ========================= */}

      {step === 7 && (
        <BonusPointsStep
        identity={identity}
          attributes={
            attributes
          }

          abilitiesData={
            abilitiesData
          }

          disciplinesData={
            disciplinesData
          }

          backgroundsData={
            backgroundsData
          }

          virtuesData={
            virtuesData
          }

          humanity={
            humanity
          }

          willpower={
            willpower
          }

          initialData={
            bonusData
          }

          onBack={() =>
            setStep(6)
          }

          onChange={(
            data
          ) => {
            setBonusData(
              data
            )
          }}

          onFinish={(
            data
          ) => {
            setBonusData(
              data
            )

            setAttributes(
              data.finalAttributes
            )

            setAbilitiesData(
              (current) => ({
                ...current,

                abilities:
                  data.finalAbilities,
              })
            )

            setDisciplinesData(
              (current) => ({
                ...current,

                disciplines:
                  data.finalDisciplines,
              })
            )

            setBackgroundsData(
              (current) => ({
                ...current,

                backgrounds:
                  data.finalBackgrounds,
              })
            )

            setVirtuesData(
              (current) => ({
                ...current,

                virtues:
                  data.finalVirtues,
              })
            )

            setHumanity(
              data.finalHumanity
            )

            setWillpower(
              data.finalWillpower
            )

            onOpenSheet()
          }}
        />
      )}
    </main>
  )
}