import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import DotSelector from './DotSelector'

const clanDisciplines = {
  Brujah: [
    'Celeridade',
    'Potência',
    'Presença',
  ],

  Gangrel: [
    'Animalismo',
    'Fortitude',
    'Metamorfose',
  ],

  Malkavian: [
    'Auspícios',
    'Demência',
    'Ofuscação',
  ],

  Nosferatu: [
    'Animalismo',
    'Ofuscação',
    'Potência',
  ],

  Toreador: [
    'Auspícios',
    'Celeridade',
    'Presença',
  ],

  Tremere: [
    'Auspícios',
    'Dominação',
    'Taumaturgia',
  ],

  Ventrue: [
    'Dominação',
    'Fortitude',
    'Presença',
  ],
}

function createInitialDisciplines(
  clan
) {
  const disciplines = {}

  const available =
    clanDisciplines[clan] ?? []

  available.forEach(
    (discipline) => {
      disciplines[discipline] = 0
    }
  )

  return disciplines
}

export default function DisciplinesStep({
  clan,
  initialData = null,
  onBack,
  onChange,
  onContinue,
}) {
  const [
    disciplines,
    setDisciplines,
  ] = useState(() => {
    if (
      initialData &&
      initialData.clan === clan
    ) {
      return (
        initialData.disciplines ??
        createInitialDisciplines(
          clan
        )
      )
    }

    return createInitialDisciplines(
      clan
    )
  })

  const maxPoints = 3

  const spentPoints =
    useMemo(() => {
      return Object.values(
        disciplines
      ).reduce(
        (total, value) =>
          total + value,
        0
      )
    }, [disciplines])

  const remainingPoints =
    maxPoints - spentPoints

  function updateDiscipline(
    discipline,
    newValue
  ) {
    if (
      newValue < 0 ||
      newValue > 5
    ) {
      return
    }

    const currentValue =
      disciplines[
        discipline
      ] ?? 0

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

    setDisciplines(
      (current) => ({
        ...current,

        [discipline]:
          newValue,
      })
    )
  }

  const allPointsSpent =
    remainingPoints === 0

  useEffect(() => {
    onChange?.({
      clan,
      disciplines,
    })
  }, [
    clan,
    disciplines,
  ])

  function handleContinue() {
    if (!allPointsSpent) {
      return
    }

    onContinue({
      clan,
      disciplines,
    })
  }

  return (
    <section className="creation-panel">
      <div className="creation-section">
        <h2 className="sheet-style-title">
          DISCIPLINAS
        </h2>

        <p className="creation-help">
          Distribua 3 pontos entre
          as Disciplinas do seu clã.
        </p>

        <div className="current-character-summary">
          <span>
            Clã
          </span>

          <strong>
            {clan}
          </strong>
        </div>

        <div className="discipline-points-summary">
          <span>
            Pontos disponíveis
          </span>

          <strong>
            {remainingPoints}
          </strong>
        </div>

        <div className="disciplines-list">
          {Object.entries(
            disciplines
          ).map(
            ([
              discipline,
              value,
            ]) => (
              <div
                key={
                  discipline
                }
                className="discipline-row"
              >
                <span className="discipline-name">
                  {
                    discipline
                  }
                </span>

                <span className="sheet-dots-line" />

                <DotSelector
                  value={value}
                  min={0}
                  max={5}
                  onChange={(
                    newValue
                  ) =>
                    updateDiscipline(
                      discipline,
                      newValue
                    )
                  }
                />
              </div>
            )
          )}
        </div>

        {!allPointsSpent && (
          <p className="discipline-warning">
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
          onClick={onBack}
        >
          Voltar para Habilidades
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
          Continuar para Antecedentes
        </button>
      </div>
    </section>
  )
}