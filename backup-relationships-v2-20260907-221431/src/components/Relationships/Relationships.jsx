import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { RELATIONSHIP_NPCS, RELATIONSHIP_METRICS } from '../../data/npcs/relationships/index.js'
import { relationshipAvailability, relationshipState } from '../../engine/relationships/relationshipEngine'
import { reconcileRelationships, relationshipMinutes } from '../../engine/relationships/relationshipClock'
import { formatCalendarDate } from '../../engine/time/timeEngine'
import './Relationships.css'

const date = minutes => `${formatCalendarDate({ day: Math.floor(minutes / 1440) + 1 })} · ${String(Math.floor(minutes / 60) % 24).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`

export default function Relationships({ game, blocked }) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const dialog = useRef(null)
  const current = reconcileRelationships(game)
  const now = relationshipMinutes(current.world)
  const available = Object.keys(RELATIONSHIP_NPCS).filter(id => !relationshipAvailability(current, id))
  const npc = RELATIONSHIP_NPCS[selected]
  const state = npc && relationshipState(current, selected)
  const scene = npc?.scenes[state.node]
  const reason = npc && relationshipAvailability(current, selected)
  const emergency = Object.values(current.relationships ?? {}).some(r => r.deadlineAt || (r.flags?.dead && !r.completed))
  useEffect(() => {
    if (!open || blocked) return
    const element = dialog.current
    element.showModal()
    return () => element.close()
  }, [open, blocked])


  return <>
    <button type="button" onClick={() => setOpen(true)} aria-haspopup="dialog">Relações {available.length > 0 ? `(${available.length})` : ''}{emergency ? ' · Alerta' : ''}</button>
    {open && !blocked && createPortal(<dialog ref={dialog} className="relationships-dialog" onCancel={() => setOpen(false)} onClose={() => setOpen(false)} aria-labelledby="relationships-title">
      <header><div><small>PESSOAS DA NOITE</small><h2 id="relationships-title">Status dos relacionamentos</h2></div><button type="button" onClick={() => setOpen(false)}>Fechar</button></header>
      <p>Consulte seus vínculos e o diário. As conversas acontecem nos estabelecimentos e locais da cidade.</p>
      {emergency && <p className="relationships-alert" role="status">Há uma atualização urgente na história de Clara. Consulte o diário dela.</p>}
      <nav aria-label="Personagens">{Object.values(RELATIONSHIP_NPCS).map(person => <button key={person.id} type="button" aria-pressed={selected === person.id} onClick={() => { setSelected(person.id) }}>{person.name.split(' ')[0]}{available.includes(person.id) ? ' · Aqui' : ''}</button>)}</nav>
      {!npc && <div className="relationships-cards">{Object.values(RELATIONSHIP_NPCS).map(person => <button type="button" key={person.id} onClick={() => setSelected(person.id)}><img src={person.portrait} alt="" /><strong>{person.name}</strong><span>{person.role}</span></button>)}</div>}
      {npc && <article>
        <div className="relationships-profile"><img src={npc.portrait} alt={`Retrato de ${npc.name}`} /><div><h3>{npc.name}</h3><p>{npc.age} anos · {npc.role}</p>{state.journal.length > 0 && <dl>{Object.entries(RELATIONSHIP_METRICS).filter(([key]) => key !== 'bond' || state.metrics.bond > 0).map(([key, label]) => <div key={key}><dt>{label}</dt><dd>{state.metrics[key] ?? 0}{key === 'bond' ? '/3' : ''}</dd></div>)}</dl>}{state.metrics.bond > 0 && <p>O vínculo sobrenatural não mede afeto nem substitui uma escolha livre. Esta influência não desaparece só porque algumas semanas passaram.</p>}</div></div>
        {state.deadlineAt && <p className="relationships-alert" role="status">Ameaça ativa até {date(state.deadlineAt)}. Faltam {Math.max(0, Math.ceil((state.deadlineAt - now) / 60))} horas. Ajudar Clara a se proteger não exige um romance.</p>}
        {state.journal.length > 0 && <p className="relationships-result" role="status">{state.journal.at(-1).text}</p>}
        {state.completed ? <section><h3>Desfecho</h3><p>{state.ending}</p></section> : <section><h3>Próximo encontro</h3><p>{scene.place}</p><p>{reason ?? 'Entre nesse local para encontrar a personagem e conversar.'}</p>{state.readyAt > now && <p>Disponível a partir de {date(state.readyAt)}.</p>}</section>}
        {state.journal.length > 0 && <details><summary>Diário de encontros ({state.journal.length})</summary>{[...state.journal].reverse().map((entry, i) => <section className="relationships-entry" key={`${entry.id}:${i}`}><small>{date(entry.at)}</small><h4>{entry.title}</h4><p>{entry.text}</p></section>)}</details>}
      </article>}
    </dialog>, document.body)}
  </>
}
