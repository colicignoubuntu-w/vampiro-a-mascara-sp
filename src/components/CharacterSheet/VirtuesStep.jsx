import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import DotSelector from './DotSelector'

function createInitialVirtues() {
  return {
    conscience: 1,
    selfControl: 1,
    courage: 1,
  }
}

export default function VirtuesStep({
  initialData = null,
  onBack,
  onChange,
  onContinue,
}) {
  const [virtues, setVirtues] =
    useState(
      initialData?.virtues ??
        createInitialVirtues()
    )

  const maximumExtraPoints = 7

  const spentExtraPoints =
    useMemo(() => {
      return (
        (virtues.conscience - 1) +
        (virtues.selfControl - 1) +
        (virtues.courage - 1)
      )
    }, [virtues])

  const remainingPoints =
    maximumExtraPoints -
    spentExtraPoints

  const humanity =
    virtues.conscience +
    virtues.selfControl

  const willpower =
    virtues.courage

  function updateVirtue(
    virtueKey,
    newValue
  ) {
    if (
      newValue < 1 ||
      newValue > 5
    ) {
      return
    }

    const currentValue =
      virtues[virtueKey]

    const difference =
      newValue - currentValue

    if (
      difference > 0 &&
      difference > remainingPoints
    ) {
      return
    }

    setVirtues(
      (current) => ({
        ...current,
        [virtueKey]: newValue,
      })
    )
  }

  const allPointsSpent =
    remainingPoints === 0

  useEffect(() => {
    onChange?.({
      virtues,
      humanity,
      willpower,
    })
  }, [
    virtues,
    humanity,
    willpower,
  ])

  function handleContinue() {
    if (!allPointsSpent) {
      return
    }

    onContinue({
      virtues,
      humanity,
      willpower,
    })
  }

  return (
    <section className="creation-panel">
      <div className="creation-section">
        <h2 className="sheet-style-title">
          VIRTUDES
        </h2>

        <p className="creation-help">
          Cada Virtude começa com 1 ponto.
          Distribua 7 pontos adicionais entre
          Consciência, Autocontrole e Coragem.
        </p>

        <div className="virtues-summary">
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
              Humanidade
            </span>

            <strong>
              {humanity}
            </strong>
          </div>

          <div>
            <span>
              Força de Vontade
            </span>

            <strong>
              {willpower}
            </strong>
          </div>
        </div>

        <div className="virtues-list">
          <div className="virtue-row">
            <span className="virtue-name">
              Consciência
            </span>

            <span className="sheet-dots-line" />

            <DotSelector
              value={
                virtues.conscience
              }
              min={1}
              max={5}
              onChange={(value) =>
                updateVirtue(
                  'conscience',
                  value
                )
              }
            />
          </div>

          <div className="virtue-row">
            <span className="virtue-name">
              Autocontrole
            </span>

            <span className="sheet-dots-line" />

            <DotSelector
              value={
                virtues.selfControl
              }
              min={1}
              max={5}
              onChange={(value) =>
                updateVirtue(
                  'selfControl',
                  value
                )
              }
            />
          </div>

          <div className="virtue-row">
            <span className="virtue-name">
              Coragem
            </span>

            <span className="sheet-dots-line" />

            <DotSelector
              value={
                virtues.courage
              }
              min={1}
              max={5}
              onChange={(value) =>
                updateVirtue(
                  'courage',
                  value
                )
              }
            />
          </div>
        </div>

        <div className="virtues-derived">
          <div>
            <span>
              Humanidade
            </span>

            <strong>
              {humanity}
            </strong>

            <div className="virtue-track">
              {Array.from({
                length: 10,
              }).map(
                (_, index) => (
                  <span
                    key={index}
                    className={
                      index < humanity
                        ? 'virtue-track-dot active'
                        : 'virtue-track-dot'
                    }
                  />
                )
              )}
            </div>
          </div>

          <div>
            <span>
              Força de Vontade
            </span>

            <strong>
              {willpower}
            </strong>

            <div className="virtue-track">
              {Array.from({
                length: 10,
              }).map(
                (_, index) => (
                  <span
                    key={index}
                    className={
                      index < willpower
                        ? 'virtue-track-dot active'
                        : 'virtue-track-dot'
                    }
                  />
                )
              )}
            </div>
          </div>
        </div>

        {!allPointsSpent && (
          <p className="virtue-warning">
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
          Voltar para Antecedentes
        </button>

        <button
          type="button"
          className="primary-button"
          disabled={!allPointsSpent}
          onClick={handleContinue}
        >
          Continuar para Revisão
        </button>
      </div>
    </section>
  )
}