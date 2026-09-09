export const relationshipMinutes = world => ((world?.day ?? 1) - 1) * 1440 + (world?.hour ?? 0) * 60 + (world?.minute ?? 0)

// Pure clock reconciliation also covers sleep, travel, work and old saves.
export function reconcileRelationships(game) {
  const state = game?.relationships?.clara
  const now = relationshipMinutes(game?.world)
  if (!state?.deadlineAt || state.flags?.protected || state.flags?.dead || now < state.deadlineAt) return game
  const entry = { id: 'clara:deadline', npcId: 'clara', at: state.deadlineAt, title: 'A ameaça se concretizou', text: 'Bia avisou que Rafael matou Clara. Ele também está procurando você em Pinheiros.' }
  return {
    ...game,
    relationships: { ...game.relationships, clara: { ...state, node: 'loss', readyAt: state.deadlineAt, deadlineAt: null, flags: { ...state.flags, dead: true }, journal: [...(state.journal ?? []), entry] } },
    history: [...(game.history ?? []), { ...entry, type: 'relationship-deadline' }],
  }
}
