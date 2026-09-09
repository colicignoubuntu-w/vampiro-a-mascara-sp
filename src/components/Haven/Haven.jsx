import { useState } from 'react'
import HavenRooms from './HavenRooms'
import CityMap from '../CityMap/CityMap'
import { advanceGameTime, minutesUntilSunrise, isDaytime } from '../../engine/time/timeEngine'
import { getBloodMessLabel, isVisiblyBloody } from '../../engine/feeding/feedingEngine'
import { getHavenInvestigations, isLiviaComputerUnlocked } from '../../engine/haven/havenEngine'
import { absoluteMinutes } from '../../engine/work/scheduleEngine'
import { JOBS } from '../../data/activities/jobs'
import './Haven.css'

export default function Haven({ game, onGameChange, onTravel, onExplore, onSleep, onQuests, blocked = false }) {
  const [mapOpen, setMapOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [confirmSleep, setConfirmSleep] = useState(false)
  const visiblyBloody = isVisiblyBloody(game)
  const investigations = getHavenInvestigations(game)
  const active = investigations.filter(q => !q.completed)
  const completed = investigations.filter(q => q.completed)
  const recommended = active.find(q => q.next)?.next
  const unlocked = isLiviaComputerUnlocked(game)
  const daylight = isDaytime(game.world)
  const sunrise = minutesUntilSunrise(game.world)
  const nextShift = [...(game.livelihood?.appointments ?? [])]
    .filter(a => a.status === 'scheduled' && a.end > absoluteMinutes(game.world))
    .sort((a, b) => a.start - b.start)[0]
  const nextJob = JOBS.find(j => j.id === nextShift?.jobId)

  function follow(next) {
    if (blocked || !next) return
    if (next.map) setMapOpen(true)
    else onExplore(next.sceneId)
  }
  function cleanUp() {
    if (blocked) return
    onGameChange(advanceGameTime({
      ...game,
      appearance: { ...game.appearance, bodyBlood: 0, clothesBlood: 0 },
      history: [...(game.history ?? []), { type: 'haven-clean-up', locationId: 'livia_apartment', timestamp: new Date().toISOString() }],
    }, 20, { reason: 'Tomar banho e trocar de roupa no refúgio' }))
    setMessage('Você removeu o sangue do corpo e vestiu roupas limpas. Passaram-se 20 minutos.')
  }
  function missionCard(quest) {
    return <article className="haven-mission" key={quest.id}>
      <div className="haven-card-heading"><span className="haven-eyebrow">{quest.completed ? 'Concluída' : 'Investigação em andamento'}</span><span className="haven-progress">{quest.steps.filter(s => s.done).length}/{quest.steps.length} etapas</span></div>
      <h3>{quest.title}</h3>
      <p>{quest.summary}</p>
      {quest.next && <p className="haven-next-step">{quest.next.detail}</p>}
      <details className="haven-checklist"><summary>Ver etapas da investigação</summary><ul>{quest.steps.map(step => <li key={step.id} className={step.done ? 'is-complete' : ''}><span aria-hidden="true">{step.done ? '✓' : '○'}</span>{step.text}<span className="haven-step-state">{step.done ? 'Concluída' : 'Pendente'}</span></li>)}</ul></details>
      {quest.next && <button className="haven-text-action" disabled={blocked} onClick={() => follow(quest.next)}>{quest.next.label}{quest.next.minutes ? ` · ${quest.next.minutes} min` : ''} <span aria-hidden="true">→</span></button>}
    </article>
  }
  return <section className="haven-screen" aria-labelledby="haven-title">
    <header className="haven-header">
      <div><span className="haven-eyebrow">Seu refúgio · Centro de São Paulo</span><h1 id="haven-title">Apartamento de Lívia</h1><p>As cortinas estão fechadas. Na mesa, os arquivos dela esperam pela próxima descoberta.</p></div>
      <div className="haven-sunrise"><span>{daylight ? 'Durante o dia' : 'Até o amanhecer'}</span><strong>{daylight ? 'Abrigo protegido' : `${Math.floor(sunrise / 60)}h ${String(sunrise % 60).padStart(2, '0')}min`}</strong></div>
    </header>
    <HavenRooms onLeave={() => setMapOpen(true)} game={game} onGameChange={onGameChange} onExplore={onExplore} onBath={cleanUp} onRest={() => setConfirmSleep(true)} blocked={blocked} />
    {message && <p className="haven-feedback" role="status">{message}</p>}
    {confirmSleep && <div className="haven-sleep-confirm"><p>O tempo avançará até o despertar. Compromissos não cumpridos continuarão sujeitos a faltas e prazos.</p><button className="haven-primary" disabled={blocked} onClick={() => { setConfirmSleep(false); onSleep() }}>Dormir</button><button className="haven-text-action" onClick={() => setConfirmSleep(false)}>Continuar acordado</button></div>}
    <details className="haven-details"><summary>Investigações, rotina e saídas</summary>
    <div className="haven-content">
      <div className="haven-investigations">
        <section className="haven-focus" aria-labelledby="haven-focus-title">
          <span className="haven-eyebrow">Próximo passo</span>
          <h2 id="haven-focus-title">{recommended?.label ?? 'Uma pausa entre as noites'}</h2>
          <p>{recommended?.detail ?? 'Consulte suas missões, cuide do refúgio ou escolha um destino na cidade.'}</p>
          {recommended ? <button className="haven-primary" disabled={blocked} onClick={() => follow(recommended)}>{recommended.label}{recommended.minutes ? ` · ${recommended.minutes} min` : ''}<span aria-hidden="true"> →</span></button> : <button className="haven-primary" disabled={blocked} onClick={onQuests}>Consultar missões</button>}
        </section>
        <div className="haven-section-heading"><h2>Investigações de Lívia</h2><button className="haven-text-action" disabled={blocked} onClick={onQuests}>Todas as missões →</button></div>
        {active.length ? active.map(missionCard) : <p className="haven-empty">Nenhuma investigação pendente no apartamento. Os pertences de Lívia continuam disponíveis para consulta.</p>}
        {completed.length > 0 && <details className="haven-completed"><summary>Investigações concluídas ({completed.length})</summary>{completed.map(missionCard)}</details>}
        <section aria-labelledby="haven-explore-title">
          <div className="haven-section-heading"><h2 id="haven-explore-title">Explorar o apartamento</h2></div>
          <div className="haven-room-grid">
            <button className="haven-room" disabled={blocked} onClick={() => onExplore('livia_apartment_inside')}><span className="haven-eyebrow">Sala</span><strong>Examinar os pertences</strong><span>Vasculhar os cômodos e procurar vestígios.</span><small>Abrir investigação · 1 min</small></button>
            <button className="haven-room" disabled={blocked} onClick={() => onExplore('livia_bedroom')}><span className="haven-eyebrow">Quarto</span><strong>Cadernos e lembranças</strong><span>Procurar os diários e objetos pessoais de Lívia.</span><small>Vasculhar · 10 min</small></button>
            <button className="haven-room" disabled={blocked} onClick={() => onExplore('livia_computer')}><span className="haven-eyebrow">Escrivaninha</span><strong>{unlocked ? 'Arquivos de Lívia' : 'Computador protegido'}</strong><span>{unlocked ? 'Consultar pastas, pistas e registros já acessados.' : 'Examinar a dica de senha e tentar acessar os documentos.'}</span><small>{unlocked ? 'Abrir arquivos' : 'Examinar computador'} · 1 min</small></button>
          </div>
        </section>
      </div>
      <aside className="haven-sidebar" aria-label="Rotina e saídas do refúgio">
        <section className="haven-panel"><span className="haven-eyebrow">Rotina</span><h2>Cuidar do refúgio</h2>
          <p className={visiblyBloody ? 'haven-warning' : 'haven-clean-state'}>{visiblyBloody ? `Sangue visível: ${getBloodMessLabel(game)}. Limpe-se antes de sair.` : 'Seu corpo e suas roupas estão sem sangue visível.'}</p>
          <button className="haven-secondary" disabled={blocked || !visiblyBloody} onClick={cleanUp}>Banho e roupas limpas <small>20 min</small></button>
          <button className="haven-secondary" disabled={blocked} onClick={() => setConfirmSleep(!confirmSleep)}>Descansar até a próxima noite</button>


        </section>
        <section className="haven-panel"><span className="haven-eyebrow">Vida noturna</span><h2>Trabalho e compromissos</h2><p>{nextJob ? `Próximo compromisso: ${nextJob.name}. ${nextJob.place}.` : 'Você pode trabalhar online neste apartamento ou consultar vagas para a próxima noite.'}</p><p className="haven-hint">Clique no computador do quarto para trabalhar online quando quiser. Na Agenda, consulte os bicos livres e os contratos com horário fixo. Mensagens dos contratantes chegam ao Celular.</p></section>
        <section className="haven-panel haven-departure"><span className="haven-eyebrow">São Paulo</span><h2>Sair para a cidade</h2><p>Escolha o destino e o transporte no mapa. O deslocamento consome tempo.</p><button className="haven-primary" disabled={blocked} onClick={() => setMapOpen(true)}>Abrir mapa →</button></section>
      </aside>
    </div>
    </details>
    {mapOpen && <CityMap game={game} onClose={() => setMapOpen(false)} onTravel={travel => { if (blocked) return; setMapOpen(false); onTravel(travel) }} />}
  </section>
}
