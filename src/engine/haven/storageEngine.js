// Transfer whole item records so custom items (including blood) retain their metadata.
export function transferFridgeItem(game, itemId, direction) {
  if (!['store', 'take'].includes(direction)) return game
  const inventory = game.inventory ?? []
  const fridge = game.haven?.fridge ?? []
  const source = direction === 'store' ? inventory : fridge
  const destination = direction === 'store' ? fridge : inventory
  const item = source.find(entry => entry.id === itemId && (entry.quantity ?? 1) > 0)
  if (!item || (direction === 'store' && Object.values(game.equipment ?? {}).includes(itemId))) return game
  const remaining = source.flatMap(entry => entry !== item ? [entry] : (entry.quantity ?? 1) > 1 ? [{ ...entry, quantity: entry.quantity - 1 }] : [])
  const existing = destination.find(entry => entry.id === itemId)
  const added = existing
    ? destination.map(entry => entry === existing ? { ...entry, quantity: (entry.quantity ?? 1) + 1 } : entry)
    : [...destination, { ...item, quantity: 1 }]
  return {
    ...game,
    inventory: direction === 'store' ? remaining : added,
    haven: { ...game.haven, fridge: direction === 'store' ? added : remaining },
  }
}
