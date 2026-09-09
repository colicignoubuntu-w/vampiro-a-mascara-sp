import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { venuesAt } from '../../data/npcs/relationships/venues.js'
import { relationshipState, relationshipChoiceReason } from '../../engine/relationships/relationshipEngine'
import { encountersAtVenue, performVenueChoice } from '../../engine/relationships/venueEngine'
import { reconcileRelationships } from '../../engine/relationships/relationshipClock'
import './Relationships.css'

export default function RelationshipPlaces({ game, onChange, blocked = false, peopleOnly = false }) {
  const [opened, setOpened] = useState(null)
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')
  const dialog = useRef(null)
  const current = reconcileRelationships(game)
  const venues = venuesAt(current.world?.location?.id)
  const venue = venues.find(v => v.id === opened)
  const visible = Boolean(venue && !blocked)
  const encounters = venue ? encountersAtVenue(current, venue.id) : []
  const npc = encounters.find(p => p.id === selected) ?? (encounters.length === 1 ? encounters[0] : null)
  const state = npc && relationshipState(current, npc.id)
  const scene = npc?.scenes[state.node]
  useEffect(() => {
    if (!visible) return
    const element = dialog.current
    element.showModal()
    return () => element.close()
  }, [visible])
  if (!venues.length) return null
  return <>
    {venues.filter(place => !peopleOnly || encountersAtVenue(current, place.id).length > 0).map(place => <button className={peopleOnly ? "game-choice-button" : undefined} type="button" key={place.id} disabled={blocked} onClick={() => { setOpened(place.id); setSelected(null); setFeedback(''); setError('') }}><strong>{peopleOnly ? `Conversar com ${encountersAtVenue(current, place.id).map(npc => npc.name.split(' ')[0]).join(' e ')}.` : place.name}</strong>{!peopleOnly && <span>Entrar e explorar</span>}</button>)}
    {visible && createPortal(<dialog className="relationships-dialog relationship-place" ref={dialog} onCancel={() => setOpened(null)} onClose={() => setOpened(null)} aria-labelledby="relationship-place-title">
      <header><div><small>{game.world?.location?.name}</small><h2 id="relationship-place-title">{venue.name}</h2></div><button type="button" onClick={() => setOpened(null)}>{venue.exit}</button></header>
      <p>{venue.description}</p>
      {feedback && <p className="relationships-result" role="status">{feedback}</p>}
      {!encounters.length && <p>Nenhum encontro disponível por aqui nesta noite. Você pode permanecer observando o movimento ou voltar para a cidade.</p>}
      {encounters.length > 1 && <nav aria-label="Pessoas presentes">{encounters.map(person => <button type="button" key={person.id} aria-pressed={npc?.id === person.id} onClick={() => { setSelected(person.id); setError('') }}>{person.name}</button>)}</nav>}
      {npc && <article key={`${npc.id}:${state.node}`}>
        <div className="relationships-profile"><img src={npc.portrait} alt={`Retrato de ${npc.name}`} /><div><small>{scene.place}</small><h3>{scene.title}</h3>{scene.text.map((text, i) => <p key={i}>{text}</p>)}</div></div>
        <div className="relationships-choices">{scene.choices.map(choice => { const reason = relationshipChoiceReason(current, npc.id, choice); return <div key={choice.id}><button type="button" disabled={Boolean(reason) || blocked} onClick={() => {
          if (blocked) return
          try {
            const updated = performVenueChoice(game, venue.id, npc.id, state.node, choice.id)
            onChange(updated)
            setFeedback(updated.relationships[npc.id].journal.at(-1).text)
            setError('')
          } catch (err) { setError(err.message) }
        }}>{choice.text} <small>· {choice.minutes ?? 15} min</small></button>{reason && <small>{reason}</small>}</div> })}</div>
      </article>}
      {error && <p role="alert" className="relationships-alert">{error}</p>}
    </dialog>, document.body)}
  </>
}
