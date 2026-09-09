import { RELATIONSHIP_NPCS } from '../../data/npcs/relationships/index.js'
import { RELATIONSHIP_VENUES } from '../../data/npcs/relationships/venues.js'

import {
  relationshipState,
  relationshipAvailability,
  performRelationshipChoice,
  prepareRelationshipTest,
  resolveRelationshipTest,
} from './relationshipEngine'

import {
  reconcileRelationships,
} from './relationshipClock'


/*
  ============================================
  LOCAL LÓGICO DO SISTEMA DE RELACIONAMENTOS
  ============================================

  A árvore antiga de relacionamentos foi criada
  quando o Último Gole ainda era considerado
  parte de Pinheiros.

  Hoje o local físico possui id próprio:
    ultimo_gole

  Para não reescrever todas as cenas antigas,
  durante a validação de relacionamento fazemos
  o sistema enxergar Pinheiros.

  O local físico real do jogador NÃO é alterado.
*/
function relationshipGameAtVenue(
  game,
  venueId
) {
  if (
    venueId !== 'ultimo_gole' ||
    game?.world?.location?.id !==
      'ultimo_gole'
  ) {
    return game
  }

  return {
    ...game,

    world: {
      ...(game.world ?? {}),

      location: {
        ...(game.world?.location ?? {}),

        id: 'pinheiros',
        name: 'Pinheiros',
        district: 'São Paulo',
      },
    },
  }
}


/*
  ============================================
  O JOGADOR ESTÁ FISICAMENTE NO VENUE?
  ============================================
*/
function isAtVenue(
  game,
  venueId,
  venue
) {
  const locationId =
    game?.world?.location?.id

  /*
    Sistema antigo:
    Último Gole pertence a Pinheiros.
  */
  if (
    venue.location ===
    locationId
  ) {
    return true
  }

  /*
    Sistema novo:
    Último Gole é um local navegável próprio.
  */
  if (
    venueId === 'ultimo_gole' &&
    locationId === 'ultimo_gole'
  ) {
    return true
  }

  return false
}


/*
  ============================================
  ENCONTROS DISPONÍVEIS NO LOCAL
  ============================================
*/
export function encountersAtVenue(
  input,
  venueId
) {
  const game =
    reconcileRelationships(
      input
    )

  const venue =
    RELATIONSHIP_VENUES[
      venueId
    ]

  if (
    !venue ||
    !isAtVenue(
      game,
      venueId,
      venue
    )
  ) {
    return []
  }

  const relationshipGame =
    relationshipGameAtVenue(
      game,
      venueId
    )

  return Object
    .values(
      RELATIONSHIP_NPCS
    )
    .filter(
      npc => {
        const state =
          relationshipState(
            relationshipGame,
            npc.id
          )

        if (!state) {
          return false
        }

        const scene =
          npc.scenes[
            state.node
          ]

        if (
          !scene ||
          scene.venueId !==
            venueId
        ) {
          return false
        }

        return !relationshipAvailability(
          relationshipGame,
          npc.id
        )
      }
    )
}


/*
  ============================================
  PREPARAR TESTE DENTRO DO VENUE
  ============================================
*/
export function prepareVenueRelationshipTest(
  game,
  venueId,
  npcId,
  nodeId,
  choiceId
) {
  const available =
    encountersAtVenue(
      game,
      venueId
    )

  if (
    !available.some(
      npc =>
        npc.id === npcId
    )
  ) {
    throw new Error(
      'Este encontro não está disponível neste local.'
    )
  }

  const relationshipGame =
    relationshipGameAtVenue(
      game,
      venueId
    )

  return prepareRelationshipTest(
    relationshipGame,
    npcId,
    nodeId,
    choiceId
  )
}


/*
  ============================================
  RESOLVER TESTE DENTRO DO VENUE
  ============================================
*/
export function resolveVenueRelationshipTest(
  game,
  venueId,
  preparedTest,
  roll
) {
  if (
    !preparedTest ||
    !roll
  ) {
    throw new Error(
      'O teste de relação ainda não foi concluído.'
    )
  }

  const originalLocation =
    game?.world?.location
      ? {
          ...game.world.location,
        }
      : null

  const relationshipGame =
    relationshipGameAtVenue(
      game,
      venueId
    )

  let updated =
    resolveRelationshipTest(
      relationshipGame,
      preparedTest,
      roll
    )

  if (
    venueId === 'ultimo_gole' &&
    originalLocation?.id ===
      'ultimo_gole'
  ) {
    updated = {
      ...updated,

      world: {
        ...(updated.world ?? {}),

        location: {
          ...originalLocation,
        },
      },
    }
  }

  return updated
}


/*
  ============================================
  EXECUTAR ESCOLHA
  ============================================

  Executamos a escolha usando o local lógico
  antigo quando necessário.

  Depois restauramos o local físico real
  (ultimo_gole), mantendo horário, relações,
  flags, histórico etc.
*/
export function performVenueChoice(
  game,
  venueId,
  npcId,
  nodeId,
  choiceId
) {
  const available =
    encountersAtVenue(
      game,
      venueId
    )

  if (
    !available.some(
      npc =>
        npc.id === npcId
    )
  ) {
    throw new Error(
      'Este encontro não está disponível neste local.'
    )
  }

  const originalLocation =
    game?.world?.location
      ? {
          ...game.world.location,
        }
      : null

  const relationshipGame =
    relationshipGameAtVenue(
      game,
      venueId
    )

  let updated =
    performRelationshipChoice(
      relationshipGame,
      npcId,
      nodeId,
      choiceId
    )

  /*
    Se usamos a ponte Pinheiros → Último Gole,
    restauramos apenas a localização.

    Todo o restante de world, incluindo relógio,
    permanece com o valor atualizado.
  */
  if (
    venueId === 'ultimo_gole' &&
    originalLocation?.id ===
      'ultimo_gole'
  ) {
    updated = {
      ...updated,

      world: {
        ...(updated.world ?? {}),

        location: {
          ...originalLocation,
        },
      },
    }
  }

  return updated
}
