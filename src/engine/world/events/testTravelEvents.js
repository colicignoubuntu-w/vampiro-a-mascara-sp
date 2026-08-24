import {
  rollTravelEvent,
} from './travelEvents'

export function testTravelEvents() {
  const events = []

  for (
    let i = 0;
    i < 100;
    i++
  ) {
    const event =
      rollTravelEvent({
        risk: 'high',
        hunger: 3,
        hour: 23,
      })

    if (event) {
      events.push(
        event.id
      )
    }
  }

  console.log(
    'Eventos de viagem:',
    events
  )

  return events
}