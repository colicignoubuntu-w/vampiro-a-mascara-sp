import {
  useState,
} from 'react'

import CityMap from '../CityMap/CityMap'

import {
  advanceGameTime,
} from '../../engine/time/timeEngine'

import {
  getBloodMessLabel,
  isVisiblyBloody,
} from '../../engine/feeding/feedingEngine'

import './Haven.css'

export default function Haven({
  game,
  onGameChange,
  onTravel,
  onComputer,
}) {
  const [
    mapOpen,
    setMapOpen,
  ] = useState(false)

  const [
    message,
    setMessage,
  ] = useState(
    'O apartamento ainda guarda o cheiro de Lívia.'
  )

  const visiblyBloody =
    isVisiblyBloody(
      game
    )

  const bloodMess =
    getBloodMessLabel(
      game
    )

  /*
    ========================================
    BANHO + TROCA DE ROUPA
    ========================================

    Uma única ação remove completamente
    o sangue visível do corpo e das roupas.
  */

  function cleanUp() {
    let updatedGame = {
      ...game,

      appearance: {
        ...(game.appearance ??
          {}),

        bodyBlood:
          0,

        clothesBlood:
          0,
      },

      history: [
        ...(game.history ??
          []),

        {
          type:
            'haven-clean-up',

          locationId:
            game.world
              ?.location
              ?.id ??
            'livia_apartment',

          timestamp:
            new Date()
              .toISOString(),
        },
      ],
    }

    /*
      Banho + troca de roupa:
      20 minutos.
    */

    updatedGame =
      advanceGameTime(
        updatedGame,
        20,
        {
          reason:
            'Tomar banho e trocar de roupa no refúgio',
        }
      )

    onGameChange(
      updatedGame
    )

    setMessage(
      'Você toma um banho, remove o sangue da pele e do cabelo e veste roupas limpas. Não há mais sangue visível em você.'
    )
  }

  return (
    <main className="haven-screen">
      <div className="haven-background" />

      <div className="haven-overlay" />

      <header className="haven-header">
        <div>
          <span>
            REFÚGIO
          </span>

          <h1>
            Apartamento de Lívia
          </h1>
        </div>

        <div>
          <strong>
            {
              String(
                game.world
                  ?.hour ?? 0
              ).padStart(
                2,
                '0'
              )
            }
            :
            {
              String(
                game.world
                  ?.minute ?? 0
              ).padStart(
                2,
                '0'
              )
            }
          </strong>
        </div>
      </header>

      <section className="haven-content">
        <div className="haven-description">
          <p>
            O apartamento é pequeno,
            antigo e decadente.
          </p>

          <p>
            A televisão ocupa um móvel
            velho perto da parede. Há
            garrafas vazias, roupas
            espalhadas e livros
            empilhados em lugares
            improváveis.
          </p>

          <p>
            Sobre uma escrivaninha há
            um computador. Fotografias
            estão presas na parede e
            algumas mostram lugares que
            você reconhece.
          </p>

          <p>
            Uma delas mostra você.
          </p>

          {visiblyBloody && (
            <blockquote>
              Estado atual:
              {' '}
              <strong>
                {bloodMess}
              </strong>
              .
              {' '}
              Você precisa se limpar
              antes de circular
              normalmente entre
              mortais.
            </blockquote>
          )}

          <blockquote>
            {message}
          </blockquote>
        </div>

        <div className="haven-actions">
          <button
            type="button"
            onClick={() => {
              setMessage(
                'O computador está bloqueado por senha. Talvez Lívia tenha deixado pistas.'
              )

              onComputer?.()
            }}
          >
            Computador
          </button>

          <button
            type="button"
            onClick={() =>
              setMessage(
                'A televisão mostra um jornal local. Nada sobre vampiros, é claro.'
              )
            }
          >
            Televisão
          </button>

          <button
            type="button"
            onClick={() =>
              setMessage(
                'Você encontra fotografias suas tiradas semanas antes do Abraço. Lívia vinha observando você.'
              )
            }
          >
            Investigar o apartamento
          </button>

          {visiblyBloody && (
            <button
              type="button"
              onClick={
                cleanUp
              }
            >
              Tomar banho e trocar de roupa
              {' '}
              (+20 min)
            </button>
          )}

          <button
            type="button"
            onClick={() =>
              setMapOpen(
                true
              )
            }
          >
            Mapa de São Paulo
          </button>
        </div>
      </section>

      {mapOpen && (
        <CityMap
          game={game}

          onClose={() =>
            setMapOpen(
              false
            )
          }

          onTravel={(
            travel
          ) => {
            setMapOpen(
              false
            )

            onTravel(
              travel
            )
          }}
        />
      )}
    </main>
  )
}