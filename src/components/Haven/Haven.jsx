import {
  useState,
} from 'react'

import CityMap from '../CityMap/CityMap'

import {
  addMinutes,
} from '../../utils/gameState'

import {
  changeClothes,
  getBloodMessLabel,
  isVisiblyBloody,
  shower,
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

  function takeShower() {
    let updatedGame =
      shower(
        game
      )

    updatedGame = {
      ...updatedGame,

      world:
        addMinutes(
          updatedGame.world,
          15
        ),
    }

    onGameChange(
      updatedGame
    )

    if (
      (
        updatedGame
          .appearance
          ?.clothesBlood ??
        0
      ) > 0
    ) {
      setMessage(
        'Depois de quinze minutos, o sangue desaparece da sua pele e do cabelo. Suas roupas, porém, continuam manchadas.'
      )
    } else {
      setMessage(
        'Você toma um banho e remove os últimos vestígios de sangue do corpo.'
      )
    }
  }

  function putOnCleanClothes() {
    let updatedGame =
      changeClothes(
        game
      )

    updatedGame = {
      ...updatedGame,

      world:
        addMinutes(
          updatedGame.world,
          5
        ),
    }

    onGameChange(
      updatedGame
    )

    if (
      (
        updatedGame
          .appearance
          ?.bodyBlood ??
        0
      ) > 0
    ) {
      setMessage(
        'Você coloca roupas limpas, mas ainda há sangue seco na pele, rosto e cabelo. Um banho ainda seria uma boa ideia.'
      )
    } else {
      setMessage(
        'Você troca as roupas ensanguentadas por roupas limpas.'
      )
    }
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

          <button
            type="button"
            onClick={
              takeShower
            }
          >
            Tomar banho
            {' '}
            (+15 min)
          </button>

          <button
            type="button"
            onClick={
              putOnCleanClothes
            }
          >
            Trocar de roupa
            {' '}
            (+5 min)
          </button>

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