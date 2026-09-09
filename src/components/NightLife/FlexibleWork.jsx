import { jobRequirements } from '../../engine/work/workEngine'

export default function FlexibleWork({ game, job, blocked, onWork }) {
  const missing = jobRequirements(game, job)
  const durations = job.minimumMinutes ? [360, 420, 480] : [15, 30, 60]
  const atWork = game.world?.location?.id === job.location
  return <article className="night-card haven-panel">
    <h3>{job.name}</h3>
    <p>{job.place} · R$ {job.rate}/h. Início livre, pagamento por tempo trabalhado.</p>
    <p>{job.minimumMinutes ? 'Comece quando quiser durante a noite, mas cumpra pelo menos 6 horas seguidas no local. O expediente inteiro passa ao confirmar; é preciso terminar antes do amanhecer.' : 'Trabalhe quantas vezes quiser durante a noite. Você fica livre ao terminar cada período, sem atraso, faltas ou pedido de dispensa.'}</p>
    {missing.length > 0 && <p>Requisitos pendentes: {missing.join(', ')}.</p>}
    {!atWork && <p>Vá até {job.place} para trabalhar.</p>}
    <div className="night-actions">{durations.map(minutes => <button className="haven-primary" key={minutes} disabled={blocked || !atWork || missing.length > 0} onClick={() => onWork({ type: 'flexWork', jobId: job.id, minutes })}>Trabalhar {job.minimumMinutes ? `${minutes / 60}h` : `${minutes} min`} · R$ {(job.rate * minutes / 60).toLocaleString('pt-BR')}</button>)}</div>
  </article>
}
