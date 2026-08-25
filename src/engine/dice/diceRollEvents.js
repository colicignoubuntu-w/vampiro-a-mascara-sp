const listeners = new Set()

export function subscribeToDiceRolls(
  listener
) {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

export function notifyDiceRoll(
  context = 'test'
) {
  for (const listener of listeners) {
    listener(context)
  }
}

