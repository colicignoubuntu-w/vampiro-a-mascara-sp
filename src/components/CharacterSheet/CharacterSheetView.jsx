const GAME_SAVE_KEY =
  'vampiro-sp-game-save'

const CREATION_SAVE_KEY =
  'vampiro-sp-character-creation'

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

const attributeGroups = {
  physical: {
    label: 'FÍSICOS',

    items: {
      strength: 'Força',
      dexterity: 'Destreza',
      stamina: 'Vigor',
    },
  },

  social: {
    label: 'SOCIAIS',

    items: {
      charisma: 'Carisma',
      manipulation: 'Manipulação',
      appearance: 'Aparência',
    },
  },

  mental: {
    label: 'MENTAIS',

    items: {
      perception: 'Percepção',
      intelligence: 'Inteligência',
      wits: 'Raciocínio',
    },
  },
}

const abilityGroups = {
  talents: {
    label: 'TALENTOS',

    items: {
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

    items: {
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

    items: {
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

const defaultVirtues = {
  conscience: 1,
  selfControl: 1,
  courage: 1,
}

const defaultHealthLevels = [
  {
    id: 'bruised',
    label: 'Escoriado',
    penalty: 0,
  },

  {
    id: 'hurt',
    label: 'Machucado',
    penalty: -1,
  },

  {
    id: 'injured',
    label: 'Ferido',
    penalty: -1,
  },

  {
    id: 'wounded',
    label: 'Ferido Gravemente',
    penalty: -2,
  },

  {
    id: 'mauled',
    label: 'Espancado',
    penalty: -2,
  },

  {
    id: 'crippled',
    label: 'Aleijado',
    penalty: -5,
  },

  {
    id: 'incapacitated',
    label: 'Incapacitado',
    penalty: null,
  },
]

function safeParse(
  value
) {
  if (!value) {
    return null
  }

  try {
    return JSON.parse(
      value
    )
  } catch (error) {
    console.error(
      'Erro ao ler save:',
      error
    )

    return null
  }
}

function loadSheetData() {
  const gameSave =
    safeParse(
      localStorage.getItem(
        GAME_SAVE_KEY
      )
    )

  /*
    Se o personagem já foi finalizado,
    sempre usamos o save definitivo.
  */

  if (
    gameSave?.characterComplete
  ) {
    return {
      type: 'game',
      data: gameSave,
    }
  }

  /*
    Antes da finalização ainda permitimos
    visualizar a ficha durante a criação.
  */

  const creationSave =
    safeParse(
      localStorage.getItem(
        CREATION_SAVE_KEY
      )
    )

  return {
    type: 'creation',
    data:
      creationSave || {},
  }
}

function Dots({
  value = 0,
  max = 5,
}) {
  const safeValue =
    Math.max(
      0,
      Math.min(
        value,
        max
      )
    )

  return (
    <span className="sheet-view-dots">
      {Array.from({
        length: max,
      }).map(
        (_, index) => (
          <span
            key={index}
            className={
              index <
              safeValue
                ? 'sheet-view-dot active'
                : 'sheet-view-dot'
            }
          />
        )
      )}
    </span>
  )
}

function Info({
  label,
  value,
}) {
  const displayValue =
    value === 0
      ? 0
      : value || '—'

  return (
    <div className="sheet-info">
      <span>
        {label}:
      </span>

      <strong>
        {displayValue}
      </strong>
    </div>
  )
}

function getPenaltyText(
  penalty
) {
  if (
    penalty === null ||
    penalty === undefined
  ) {
    return ''
  }

  if (penalty === 0) {
    return ''
  }

  return ` (${penalty})`
}

export default function CharacterSheetView({
  onBack,
}) {
  const {
    type,
    data: save,
  } =
    loadSheetData()

  const isFinalSave =
    type === 'game'

  /* =========================
     IDENTIDADE
  ========================= */

  const identity =
    save.identity || {}

  /* =========================
     ATRIBUTOS
  ========================= */

  const attributes =
    save.attributes || {}

  /* =========================
     HABILIDADES
  ========================= */

  const abilities =
    isFinalSave
      ? save.abilities || {}
      : save.abilitiesData
          ?.abilities || {}

  /* =========================
     DISCIPLINAS
  ========================= */

  const disciplines =
    isFinalSave
      ? save.disciplines || {}
      : save.disciplinesData
          ?.disciplines || {}

  /* =========================
     ANTECEDENTES
  ========================= */

  const backgrounds =
    isFinalSave
      ? save.backgrounds || {}
      : save.backgroundsData
          ?.backgrounds || {}

  /* =========================
     VIRTUDES
  ========================= */

  const virtues =
    isFinalSave
      ? save.virtues ||
        defaultVirtues
      : save.virtuesData
          ?.virtues ||
        defaultVirtues

  /* =========================
     HUMANIDADE
  ========================= */

  const humanityCurrent =
    isFinalSave
      ? save.humanity
          ?.current ?? 0
      : save.humanity ?? 0

  const humanityMaximum =
    isFinalSave
      ? save.humanity
          ?.maximum ??
        humanityCurrent
      : 10

  /* =========================
     FORÇA DE VONTADE
  ========================= */

  const willpowerCurrent =
    isFinalSave
      ? save.willpower
          ?.current ?? 0
      : save.willpower ?? 0

  const willpowerMaximum =
    isFinalSave
      ? save.willpower
          ?.maximum ??
        willpowerCurrent
      : 10

  /* =========================
     SANGUE
  ========================= */

  const bloodCurrent =
    isFinalSave
      ? save.blood
          ?.current ?? 0
      : typeof save.blood ===
          'number'
        ? save.blood
        : 0

  const bloodMaximum =
    isFinalSave
      ? save.blood
          ?.maximum ?? 10
      : 10

  const bloodPerTurn =
    isFinalSave
      ? save.blood
          ?.perTurn ?? 1
      : 1

  /* =========================
     VITALIDADE
  ========================= */

  const healthLevels =
    isFinalSave
      ? save.health
          ?.levels ??
        defaultHealthLevels
      : defaultHealthLevels

  const currentHealthLevel =
    isFinalSave
      ? save.health
          ?.currentLevel ?? 0
      : 0

  /* =========================
     EXPERIÊNCIA
  ========================= */

  const experienceCurrent =
    isFinalSave
      ? save.experience
          ?.current ?? 0
      : typeof save.experience ===
          'number'
        ? save.experience
        : 0

  return (
    <main className="character-sheet-view">
      {/* =========================
          BARRA SUPERIOR
      ========================= */}

      <header className="sheet-toolbar">
        <button
          type="button"
          className="secondary-button"
          onClick={
            onBack
          }
        >
          ← Voltar
        </button>

        <div>
          <span className="creation-kicker">
            VAMPIRO: SÃO PAULO
          </span>

          <h1>
            Ficha do Personagem
          </h1>
        </div>
      </header>

      <section className="sheet-paper">
        {/* =========================
            IDENTIDADE
        ========================= */}

        <section className="sheet-identity-grid">
          <div>
            <Info
              label="Nome"
              value={
                identity.name
              }
            />

            <Info
              label="Jogador"
              value={
                identity.player
              }
            />

            <Info
              label="Crônica"
              value={
                identity.chronicle ||
                'São Paulo'
              }
            />
          </div>

          <div>
            <Info
              label="Natureza"
              value={
                identity.nature
              }
            />

            <Info
              label="Comportamento"
              value={
                identity.demeanor
              }
            />

            <Info
              label="Clã"
              value={
                identity.clan
              }
            />
          </div>

          <div>
            <Info
              label="Geração"
              value={
                identity.generation
              }
            />

            <Info
              label="Refúgio"
              value={
                identity.refuge
              }
            />

            <Info
              label="Conceito"
              value={
                identity.concept
              }
            />
          </div>
        </section>

        {/* =========================
            ATRIBUTOS
        ========================= */}

        <section className="sheet-main-section">
          <h2>
            ATRIBUTOS
          </h2>

          <div className="sheet-three-columns">
            {Object.entries(
              attributeGroups
            ).map(
              ([
                groupKey,
                group,
              ]) => (
                <div
                  className="sheet-column"
                  key={
                    groupKey
                  }
                >
                  <h3>
                    {group.label}
                  </h3>

                  {Object.entries(
                    group.items
                  ).map(
                    ([
                      key,
                      label,
                    ]) => (
                      <div
                        className="sheet-stat-row"
                        key={key}
                      >
                        <span>
                          {label}
                        </span>

                        <span className="sheet-dotted-line" />

                        <Dots
                          value={
                            attributes[
                              groupKey
                            ]?.[
                              key
                            ] ?? 1
                          }
                        />
                      </div>
                    )
                  )}
                </div>
              )
            )}
          </div>
        </section>

        {/* =========================
            HABILIDADES
        ========================= */}

        <section className="sheet-main-section">
          <h2>
            HABILIDADES
          </h2>

          <div className="sheet-three-columns">
            {Object.entries(
              abilityGroups
            ).map(
              ([
                groupKey,
                group,
              ]) => (
                <div
                  className="sheet-column"
                  key={
                    groupKey
                  }
                >
                  <h3>
                    {
                      group.label
                    }
                  </h3>

                  {Object.entries(
                    group.items
                  ).map(
                    ([
                      key,
                      label,
                    ]) => (
                      <div
                        className="sheet-stat-row"
                        key={
                          key
                        }
                      >
                        <span>
                          {
                            label
                          }
                        </span>

                        <span className="sheet-dotted-line" />

                        <Dots
                          value={
                            abilities[
                              key
                            ] ?? 0
                          }
                        />
                      </div>
                    )
                  )}
                </div>
              )
            )}
          </div>
        </section>

        {/* =========================
            VANTAGENS
        ========================= */}

        <section className="sheet-main-section">
          <h2>
            VANTAGENS
          </h2>

          <div className="sheet-three-columns">
            {/* ANTECEDENTES */}

            <div className="sheet-column">
              <h3>
                ANTECEDENTES
              </h3>

              {Object.entries(
                backgroundLabels
              ).map(
                ([
                  key,
                  label,
                ]) => (
                  <div
                    className="sheet-stat-row"
                    key={
                      key
                    }
                  >
                    <span>
                      {
                        label
                      }
                    </span>

                    <span className="sheet-dotted-line" />

                    <Dots
                      value={
                        backgrounds[
                          key
                        ] ?? 0
                      }
                    />
                  </div>
                )
              )}
            </div>

            {/* DISCIPLINAS */}

            <div className="sheet-column">
              <h3>
                DISCIPLINAS
              </h3>

              {Object.keys(
                disciplines
              ).length === 0 ? (
                <div className="sheet-empty-message">
                  Nenhuma Disciplina definida.
                </div>
              ) : (
                Object.entries(
                  disciplines
                ).map(
                  ([
                    discipline,
                    value,
                  ]) => (
                    <div
                      className="sheet-stat-row"
                      key={
                        discipline
                      }
                    >
                      <span>
                        {
                          discipline
                        }
                      </span>

                      <span className="sheet-dotted-line" />

                      <Dots
                        value={
                          value
                        }
                      />
                    </div>
                  )
                )
              )}
            </div>

            {/* VIRTUDES */}

            <div className="sheet-column">
              <h3>
                VIRTUDES
              </h3>

              <div className="sheet-stat-row">
                <span>
                  Consciência
                </span>

                <span className="sheet-dotted-line" />

                <Dots
                  value={
                    virtues.conscience ??
                    1
                  }
                />
              </div>

              <div className="sheet-stat-row">
                <span>
                  Autocontrole
                </span>

                <span className="sheet-dotted-line" />

                <Dots
                  value={
                    virtues.selfControl ??
                    1
                  }
                />
              </div>

              <div className="sheet-stat-row">
                <span>
                  Coragem
                </span>

                <span className="sheet-dotted-line" />

                <Dots
                  value={
                    virtues.courage ??
                    1
                  }
                />
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            HUMANIDADE
        ========================= */}

        <section className="sheet-bottom">
          <div className="sheet-bottom-row">
            <div>
              <strong>
                Humanidade
              </strong>

              <span className="sheet-current-value">
                {
                  humanityCurrent
                }
                /
                {
                  humanityMaximum
                }
              </span>
            </div>

            <Dots
              value={
                humanityCurrent
              }
              max={10}
            />
          </div>

          {/* =========================
              FORÇA DE VONTADE
          ========================= */}

          <div className="sheet-bottom-row">
            <div>
              <strong>
                Força de Vontade
              </strong>

              <span className="sheet-current-value">
                {
                  willpowerCurrent
                }
                /
                {
                  willpowerMaximum
                }
              </span>
            </div>

            <Dots
              value={
                willpowerCurrent
              }
              max={10}
            />
          </div>

          {/* =========================
              SANGUE
          ========================= */}

          <div className="sheet-resource-section">
            <div className="sheet-resource-title">
              <strong>
                Pontos de Sangue
              </strong>

              <span>
                {
                  bloodCurrent
                }
                /
                {
                  bloodMaximum
                }
              </span>
            </div>

            <p className="sheet-resource-note">
              Máximo de sangue gasto por turno:{' '}
              <strong>
                {
                  bloodPerTurn
                }
              </strong>
            </p>

            <div className="blood-boxes">
              {Array.from({
                length:
                  bloodMaximum,
              }).map(
                (
                  _,
                  index
                ) => (
                  <span
                    key={
                      index
                    }
                    className={
                      index <
                      bloodCurrent
                        ? 'blood-box active'
                        : 'blood-box'
                    }
                  />
                )
              )}
            </div>
          </div>

          {/* =========================
              VITALIDADE
          ========================= */}

          <div className="sheet-resource-section">
            <div className="sheet-resource-title">
              <strong>
                Vitalidade
              </strong>

              <span>
                Nível atual:{' '}
                {
                  currentHealthLevel
                }
              </span>
            </div>

            <div className="health-list">
              {healthLevels.map(
                (
                  level,
                  index
                ) => {
                  const damaged =
                    Boolean(
                      level.damaged
                    ) ||
                    (
                      currentHealthLevel >
                      index
                    )

                  return (
                    <span
                      key={
                        level.id
                      }
                      className={
                        damaged
                          ? 'health-level damaged'
                          : 'health-level'
                      }
                    >
                      <span className="health-box">
                        {
                          damaged
                            ? '■'
                            : '□'
                        }
                      </span>

                      {' '}

                      {
                        level.label
                      }

                      {
                        getPenaltyText(
                          level.penalty
                        )
                      }
                    </span>
                  )
                }
              )}
            </div>
          </div>

          {/* =========================
              EXPERIÊNCIA
          ========================= */}

          <div className="sheet-experience">
            <Info
              label="Experiência"
              value={
                experienceCurrent
              }
            />
          </div>
        </section>
      </section>
    </main>
  )
}