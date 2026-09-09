/*
  Personalidade social dos NPCs.

  Escala: 0 a 100.

  Estes valores NÃO são moralidade e não definem se alguém é
  "bom" ou "ruim". Eles controlam tendências de reação.
*/

export const DEFAULT_RELATIONSHIP_PERSONALITY = {
  jealousy: 45,
  forgiveness: 50,
  attachment: 50,
  independence: 50,
  confrontation: 50,
  lieSensitivity: 55,
  boundarySensitivity: 65,
  abandonmentSensitivity: 55,
  fearResponse: 50,
}

export const RELATIONSHIP_PERSONALITIES = {
  clara: {
    jealousy: 62,
    forgiveness: 48,
    attachment: 72,
    independence: 52,
    confrontation: 64,
    lieSensitivity: 78,
    boundarySensitivity: 78,
    abandonmentSensitivity: 68,
    fearResponse: 52,
  },

  elisa: {
    jealousy: 42,
    forgiveness: 58,
    attachment: 50,
    independence: 78,
    confrontation: 72,
    lieSensitivity: 82,
    boundarySensitivity: 84,
    abandonmentSensitivity: 42,
    fearResponse: 46,
  },

  helena: {
    jealousy: 50,
    forgiveness: 65,
    attachment: 68,
    independence: 48,
    confrontation: 38,
    lieSensitivity: 67,
    boundarySensitivity: 74,
    abandonmentSensitivity: 76,
    fearResponse: 66,
  },

  iris: {
    jealousy: 34,
    forgiveness: 42,
    attachment: 44,
    independence: 86,
    confrontation: 80,
    lieSensitivity: 88,
    boundarySensitivity: 90,
    abandonmentSensitivity: 36,
    fearResponse: 38,
  },

  mara: {
    jealousy: 70,
    forgiveness: 34,
    attachment: 78,
    independence: 40,
    confrontation: 76,
    lieSensitivity: 73,
    boundarySensitivity: 72,
    abandonmentSensitivity: 80,
    fearResponse: 58,
  },
}

export function getRelationshipPersonality(npcId) {
  return {
    ...DEFAULT_RELATIONSHIP_PERSONALITY,
    ...(RELATIONSHIP_PERSONALITIES[npcId] ?? {}),
  }
}

export function personalityLabel(key) {
  return {
    jealousy: 'Ciúme',
    forgiveness: 'Perdão',
    attachment: 'Apego',
    independence: 'Independência',
    confrontation: 'Confronto',
    lieSensitivity: 'Sensível a mentiras',
    boundarySensitivity: 'Sensível a limites',
    abandonmentSensitivity: 'Sensível a abandono',
    fearResponse: 'Resposta ao medo',
  }[key] ?? key
}
