import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import DotSelector from './DotSelector'

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

function createInitialBackgrounds() {
  return {
    allies: 0,
    contacts: 0,
    fame: 0,
    generation: 0,
    herd: 0,
    influence: 0,
    mentor: 0,
    resources: 0,
    retainers: 0,
    status: 0,
  }
}

function getGenerationLabel(
  backgroundValue
) {
  const generations = {
    0: '13ª',
    1: '12ª',
    2: '11ª',
    3: '10ª',
    4: '9ª',
    5: '8ª',
  }

  return (
    generations[
      backgroundValue
    ] ?? '13ª'
  )
}

export default function BackgroundsStep({
  initialData = null,
  onBack,
  onChange,
  onContinue,
}) {
  const [
    backgrounds,
    setBackgrounds,
  ] = useState(
    initialData?.backgrounds ??
      createInitialBackgrounds()
  )

  const maximumPoints = 5

  const spentPoints =
    useMemo(() => {
      return Object.values(
        backgrounds
      ).reduce(
        (total, value) =>
          total + value,
        0
      )
    }, [backgrounds])

  const remainingPoints =
    maximumPoints -
    spentPoints

  const generation =
    getGenerationLabel(
      backgrounds.generation
    )

  function updateBackground(
    backgroundKey,
    newValue
  ) {
    if (
      newValue < 0 ||
      newValue > 5
    ) {
      return
    }

    const currentValue =
      backgrounds[
        backgroundKey
      ]

    const difference =
      newValue -
      currentValue

    if (
      difference > 0 &&
      difference >
        remainingPoints
    ) {
      return
    }

    setBackgrounds(
      (current) => ({
        ...current,

        [backgroundKey]:
          newValue,
      })
    )
  }

  const allPointsSpent =
    remainingPoints === 0

  useEffect(() => {
    onChange?.({
      backgrounds,
      generation,
    })
  }, [
    backgrounds,
    generation,
  ])

  function handleContinue() {
    if (!allPointsSpent) {
      return
    }

    onContinue({
      backgrounds,
      generation,
    })
  }

  return (
    <section className="creation-panel">
      <div className="creation-section">
        <h2 className="sheet-style-title">
          ANTECEDENTES
        </h2>

        <p className="creation-help">
          Distribua 5 pontos entre
          os Antecedentes do
          personagem.
        </p>

        <div className="background-summary">
          <div>
            <span>
              Pontos restantes
            </span>

            <strong>
              {remainingPoints}
            </strong>
          </div>

          <div>
            <span>
              Geração atual
            </span>

            <strong>
              {generation}
            </strong>
          </div>
        </div>

        <div className="backgrounds-list">
          {Object.entries(
            backgroundLabels
          ).map(
            ([
              backgroundKey,
              label,
            ]) => (
              <div
                className="background-row"
                key={
                  backgroundKey
                }
              >
                <span className="background-name">
                  {label}
                </span>

                <span className="sheet-dots-line" />

                <DotSelector
                  value={
                    backgrounds[
                      backgroundKey
                    ]
                  }
                  min={0}
                  max={5}
                  onChange={(
                    value
                  ) =>
                    updateBackground(
                      backgroundKey,
                      value
                    )
                  }
                />
              </div>
            )
          )}
        </div>

        <div className="generation-info">
          <strong>
            Geração
          </strong>

          <p>
            0 pontos = 13ª
          </p>

          <p>
            1 ponto = 12ª
          </p>

          <p>
            2 pontos = 11ª
          </p>

          <p>
            3 pontos = 10ª
          </p>

          <p>
            4 pontos = 9ª
          </p>

          <p>
            5 pontos = 8ª
          </p>
        </div>

        {!allPointsSpent && (
          <p className="background-warning">
            Você ainda possui{' '}
            <strong>
              {remainingPoints}
            </strong>{' '}
            ponto(s) para distribuir.
          </p>
        )}
      </div>

      <div className="creation-actions creation-actions-between">
        <button
          type="button"
          className="secondary-button"
          onClick={
            onBack
          }
        >
          Voltar para Disciplinas
        </button>

        <button
          type="button"
          className="primary-button"
          disabled={
            !allPointsSpent
          }
          onClick={
            handleContinue
          }
        >
          Continuar para Virtudes
        </button>
      </div>
    </section>
  )
}