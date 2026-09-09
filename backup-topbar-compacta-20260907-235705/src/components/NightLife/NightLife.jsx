import FlexibleWork from './FlexibleWork'
import { createPortal } from 'react-dom'
import { useEffect, useRef, useState } from 'react'
import { JOBS, CRIMES, SKILL_LABELS } from '../../data/activities/jobs'
import { absoluteMinutes, normalizeLivelihood } from '../../engine/work/scheduleEngine'
import { jobRequirements, performWorkAction } from '../../engine/work/workEngine'
import { formatCalendarDate } from '../../engine/time/timeEngine'
import './NightLife.css'

const money = value => Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const hour = n => `${String(Math.floor(n / 60) % 24).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`
const date = n => `${formatCalendarDate({ day: Math.floor(n / 1440) + 1 })} · ${hour(n)}`
const statusLabels = { scheduled: 'Agendado', working: 'Em andamento', completed: 'Concluído', missed: 'Falta / prazo perdido', abandoned: 'Abandonado', cancelled: 'Cancelado', excused: 'Dispensado' }

export default function NightLife({ game, onChange, blocked }) {
  const [tab, setTab] = useState(null)
  const [error, setError] = useState('')
  const dialog = useRef(null)
  const opener = useRef(null)
  const data = normalizeLivelihood(game).livelihood
  const now = absoluteMinutes(game.world)
  const forced = !blocked && (data.active || data.crime)
  const open = Boolean(tab || forced)
  const selected = tab || 'agenda'
  const unread = data.phone.filter(m => !m.read).length
  const appointments = [...data.appointments].sort((a, b) => a.start - b.start)
  const due = appointments.filter(a => ['scheduled', 'working'].includes(a.status))
  const active = appointments.find(a => a.id === data.active)
  useEffect(() => {
    if (!open) return
    opener.current = document.activeElement
    dialog.current?.focus()
    return () => opener.current?.focus?.()
  }, [open])
  function run(action) {
    if (blocked && action.type !== 'read') return
    try {
      const updated = performWorkAction(game, action)
      onChange(updated)
      setError('')
      if (updated.flags?.humanityCheckRequired) setTab(null)
    } catch (err) { setError(err.message) }
  }
  function close() { if (!forced) { setTab(null); setError('') } }
  function trap(event) {
    if (event.key === 'Escape') close()
    if (event.key !== 'Tab') return
    const buttons = [...dialog.current.querySelectorAll('button:not(:disabled), [tabindex="0"]')]
    const first = buttons[0], last = buttons.at(-1)
    if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog.current)) { event.preventDefault(); last?.focus() }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
  }
  return <>
    <span className="night-wallet" aria-label="Saldo em dinheiro">{money(data.money)}</span>
    <button type="button" onClick={() => setTab('agenda')} aria-haspopup="dialog">▦ Agenda {due.length > 0 && `(${due.length})`}{due.some(a => now >= a.start - 60 && now < a.end) && ' · Compromisso próximo'}</button>
    <button type="button" onClick={() => setTab('phone')} aria-haspopup="dialog">▯ Celular {unread > 0 && <span className="night-badge">{unread}</span>}</button>
    {open && createPortal(<div className="night-backdrop" onClick={close}>
      <section className="night-dialog" role="dialog" aria-modal="true" aria-labelledby="night-title" tabIndex={-1} ref={dialog} onKeyDown={trap} onClick={e => e.stopPropagation()}>
        <header><div><small>VIDA NOTURNA · {hour(now)}</small><h2 id="night-title">{selected === 'phone' ? 'Celular' : 'Agenda e trabalho'}</h2></div><button type="button" onClick={close} disabled={Boolean(forced)} aria-label="Fechar agenda e celular">Fechar</button></header>
        <nav aria-label="Seções da agenda">{[['agenda', 'Agenda'], ['jobs', 'Trabalhos'], ['crime', 'Atividades de risco'], ['phone', `Celular (${unread})`]].map(([id, label]) => <button type="button" key={id} aria-pressed={selected === id} onClick={() => setTab(id)}>{label}</button>)}</nav>
        <p className="night-balance">Saldo: <strong>{money(data.money)}</strong> · {game.world.location?.name}</p>
        {blocked && <p className="night-warning">Resolva a cena ou o teste em andamento para realizar atividades. A agenda e as mensagens continuam disponíveis para consulta.</p>}
        {error && <p role="alert" className="night-warning">{error}</p>}
        {data.lastResult && <p role="status" className="night-result">{data.lastResult}</p>}
        {active && <article className="night-card night-warning"><h3>Turno em andamento: {JOBS.find(j => j.id === active.jobId)?.name}</h3><p>Compromisso até {hour(active.end)}. Horas cumpridas: {(active.worked / 60).toFixed(2)}. Sair antes do fim gera uma advertência.</p><button disabled={blocked || Boolean(data.workEvent)} onClick={() => run({ type: 'continue', id: active.id })}>Cumprir próxima hora</button><button disabled={blocked} onClick={() => run({ type: 'abandon', id: active.id })}>Abandonar turno · receber advertência</button></article>}
        {data.workEvent && <article className="night-card night-warning"><h3>Imprevisto no expediente</h3><p>{data.workEvent.text}</p><button disabled={blocked} onClick={() => run({ type: 'workEvent' })}>Resolver acontecimento · teste de habilidade</button></article>}
        {data.crime && <article className="night-card night-warning"><h3>{CRIMES.find(c => c.id === data.crime)?.name}: confirmar decisão</h3><p>Há pessoas que podem identificar você. Uma falha pode gerar procura policial; um assalto pode levar diretamente a uma busca ativa. A ação também pode exigir um teste de Consciência. O pagamento é incerto.</p><button disabled={blocked} onClick={() => run({ type: 'resolveCrime', retreat: true })}>Desistir antes de agir</button><button disabled={blocked} onClick={() => run({ type: 'resolveCrime' })}>Agir e assumir as consequências</button></article>}
        {selected === 'agenda' && <>
          <p>Trabalhos de computador têm duração livre. Atendente e barista podem começar quando quiserem, mas exigem pelo menos 6 horas seguidas no local. Escolha a duração na aba Trabalhos. Apenas os contratos de segurança e aulas exigem presença no local até o fim do turno. Tolerância: 15 minutos, com advertência por atraso. Três ocorrências causam demissão. Uma dispensa por semana pode ser solicitada com 2h de antecedência.</p>
          <div className="night-actions"><button disabled={blocked || Boolean(forced)} onClick={() => run({ type: 'wait', minutes: 15 })}>Esperar 15 min</button><button disabled={blocked || Boolean(forced)} onClick={() => run({ type: 'wait', minutes: 60 })}>Esperar 1h</button></div>
          {!appointments.length && <p>Nenhum compromisso. Consulte as vagas em Trabalhos.</p>}
          {appointments.map(a => { const job = JOBS.find(j => j.id === a.jobId); if (!job) return null; return <article className="night-card" key={a.id}>
            <small>{statusLabels[a.status]}</small><h3>{job.name}</h3><p>{job.project ? `Prazo: ${date(a.end)}` : `${date(a.start)} → ${hour(a.end)}${Math.floor(a.end / 1440) > Math.floor(a.start / 1440) ? ' do dia seguinte' : ''}`}</p>
            <p>{job.place} · {job.project ? `${a.worked / 60}/${job.hours} horas · ${money(job.hours * job.rate)} na entrega` : `${money(job.rate)}/h · ${money((job.end - job.start) * job.rate)} por turno completo`}</p>
            {job.preparation && <p>Preparação: {a.prepared}/{job.preparation} min, no local, antes da aula e sem remuneração.</p>}
            {a.status === 'scheduled' && <div className="night-actions"><button disabled={blocked || Boolean(forced) || now < a.start || now >= a.end} onClick={() => run({ type: 'start', id: a.id })}>{job.project ? 'Trabalhar 1h no projeto' : 'Iniciar turno completo'}</button>{job.preparation && a.prepared < job.preparation && <button disabled={blocked || Boolean(forced)} onClick={() => run({ type: 'prepare', id: a.id })}>Preparar aula · 1h</button>}<button disabled={blocked || Boolean(forced)} onClick={() => run({ type: 'excuse', id: a.id })}>Pedir dispensa</button><button disabled={blocked || Boolean(forced)} onClick={() => run({ type: 'quit', id: a.id })}>Encerrar contrato</button></div>}
          </article> })}
        </>}
        {selected === 'jobs' && <>
          <p>Nos contratos com horário fixo, a primeira candidatura inclui entrevista social de 15 minutos (Carisma + Etiqueta ou Expressão). Requisitos mínimos são obrigatórios. Depois de contratado, você recebe pelas horas cumpridas, sem testes rotineiros.</p>
          <button disabled={blocked || Boolean(forced) || data.credentials} onClick={() => run({ type: 'credentials' })}>{data.credentials ? 'Documentação profissional validada' : 'Validar formação e identidade · Liberdade · Acadêmicos 4 · 1h'}</button>
          {JOBS.map(job => { if (job.flexible) return <FlexibleWork key={job.id} game={game} job={job} blocked={blocked || Boolean(forced)} onWork={run} />; const missing = jobRequirements(game, job); const contract = data.contracts[job.id]; return <article className="night-card" key={job.id}><h3>{job.name}</h3><p>{job.employer} · {job.place}</p><p>{job.project ? `Projeto de ${job.hours}h, prazo de 3 dias · ${money(job.hours * job.rate)} na entrega` : `${hour(job.start * 60)}–${hour(job.end * 60)} · ${money(job.rate)}/h · ${job.weekdays ? job.weekdays.map(d => ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'][d]).join(', ') : 'bico de um turno'}`}</p><p>Requisitos: {Object.entries(job.requirements).map(([key, value]) => `${SKILL_LABELS[key]} ${value}`).join(', ')}{job.firearm ? ', arma de fogo' : ''}{job.credentials ? ', documentação profissional' : ''}.</p>{missing.length > 0 && <p className="night-muted">Falta: {missing.join(', ')}.</p>}{contract && <p>Advertências: {contract.strikes ?? 0}/3 · Turnos concluídos: {contract.reputation ?? 0}{contract.status === 'fired' ? ' · Demitido' : ''}</p>}<button disabled={blocked || Boolean(forced) || missing.length > 0 || contract?.status === 'fired' || due.some(a => a.jobId === job.id)} onClick={() => run({ type: 'apply', jobId: job.id })}>{contract?.status === 'hired' ? 'Reservar próximo bico' : 'Candidatar-se'}</button></article> })}
        </>}
        {selected === 'crime' && <><p>Oportunidades no Centro, Liberdade, Pinheiros, Asylum e Vesuvius. O retorno depende do teste; falhas deixam testemunhas e podem provocar perseguição policial. Consciência elevada pode trazer remorso, e a Humanidade determina a necessidade de um teste moral.</p>{CRIMES.map(crime => <article className="night-card" key={crime.id}><h3>{crime.name}</h3><p>{crime.minutes} min · requer {SKILL_LABELS[crime.ability]} 1 · retorno variável, a partir de {money(crime.reward + 15)} em caso de sucesso.</p><button disabled={blocked || Boolean(forced)} onClick={() => run({ type: 'crime', crimeId: crime.id })}>Examinar oportunidade</button></article>)}</>}
        {selected === 'phone' && <><button onClick={() => run({ type: 'read' })} disabled={!unread}>Marcar tudo como lido</button>{!data.phone.length && <p>Nenhuma mensagem ou ligação perdida. Contratantes entrarão em contato por aqui.</p>}{[...data.phone].reverse().map(m => <article className={`night-card ${m.read ? '' : 'night-unread'}`} key={m.id}><small>{m.kind === 'call' ? '☎ Ligação perdida' : 'Mensagem'} · {date(m.at)}{!m.read ? ' · Não lida' : ''}</small><h3>{m.sender}</h3><p>{m.text}</p></article>)}</>}
      </section>
    </div>, document.body)}
  </>
}
