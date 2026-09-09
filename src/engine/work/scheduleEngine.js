import { JOBS } from '../../data/activities/jobs'

export const absoluteMinutes = (world) => ((world?.day ?? 1) - 1) * 1440 + (world?.hour ?? 0) * 60 + (world?.minute ?? 0)
export function normalizeLivelihood(game) {
  if (game.livelihood?.version === 2) return game
  const data = { money: 0, contracts: {}, appointments: [], phone: [], active: null, crime: null, ...game.livelihood }
  const flexibleIds = JOBS.filter(job => job.flexible).map(job => job.id)
  const cancelledIds = new Set(data.appointments.filter(a => flexibleIds.includes(a.jobId)).map(a => a.id))
  return { ...game, livelihood: {
    ...data, version: 2, checkedAt: undefined,
    appointments: data.appointments.map(a => cancelledIds.has(a.id) && ['scheduled', 'working'].includes(a.status) ? { ...a, status: 'cancelled' } : a),
    active: cancelledIds.has(data.active) ? null : data.active,
    workEvent: cancelledIds.has(data.workEvent?.appointmentId) ? null : data.workEvent,
    contracts: Object.fromEntries(Object.entries(data.contracts).map(([id, contract]) => [id, flexibleIds.includes(id) ? { ...contract, strikes: 0, status: 'available' } : contract])),
  } }

}
export function notifyWork(game, id, sender, text, kind = 'message') {
  const g = normalizeLivelihood(game)
  if (g.livelihood.phone.some(m => m.id === id)) return g
  return { ...g, livelihood: { ...g.livelihood, phone: [...g.livelihood.phone, { id, sender, text, kind, at: absoluteMinutes(g.world), read: false }] } }
}
export function upcomingShifts(job, now, days = 8) {
  if (job.flexible) return []
  const firstDay = Math.floor(now / 1440)
  return Array.from({ length: days }, (_, i) => firstDay + i).filter(day => !job.weekdays || job.weekdays.includes(day % 7)).map(day => ({ id: `${job.id}:${day}`, jobId: job.id, start: day * 1440 + job.start * 60, end: day * 1440 + job.end * 60, status: 'scheduled', worked: 0, prepared: 0 })).filter(a => a.start >= now)
}
export function penalizeWork(game, appointment, reason) {
  const job = JOBS.find(j => j.id === appointment.jobId)
  if (job.flexible) return game
  const contract = game.livelihood.contracts[job.id]
  const strikes = (contract?.strikes ?? 0) + 1
  let g = { ...game, livelihood: { ...game.livelihood, contracts: { ...game.livelihood.contracts, [job.id]: { ...contract, strikes, status: strikes >= 3 ? 'fired' : 'hired' } } } }
  g = notifyWork(g, `${appointment.id}:penalty`, job.employer, `${reason} Sem pagamento pelas horas não cumpridas. ${strikes >= 3 ? 'Você foi demitido após três ocorrências.' : `Advertência ${strikes}/3.`}`)
  if (strikes >= 3) g = { ...g, livelihood: { ...g.livelihood, appointments: g.livelihood.appointments.map(a => a.jobId === job.id && a.status === 'scheduled' ? { ...a, status: 'cancelled' } : a) } }
  return g
}
// Reconcile against an absolute cursor, including time jumps caused by sleep.
export function reconcileSchedule(game) {
  if (!game) return game
  let g = normalizeLivelihood(game)
  const now = absoluteMinutes(g.world)
  if (g.livelihood.checkedAt === now) return g
  const from = g.livelihood.checkedAt ?? now
  for (const job of JOBS.filter(j => !j.flexible && j.weekdays && g.livelihood.contracts[j.id]?.status === 'hired')) {
    const shifts = upcomingShifts(job, from, Math.max(8, Math.ceil((now - from) / 1440) + 8))
    const ids = new Set(g.livelihood.appointments.map(a => a.id))
    g = { ...g, livelihood: { ...g.livelihood, appointments: [...g.livelihood.appointments, ...shifts.filter(a => !ids.has(a.id))] } }
  }
  for (const snapshot of g.livelihood.appointments) {
    const a = g.livelihood.appointments.find(entry => entry.id === snapshot.id)
    if (a.status !== 'scheduled' && a.status !== 'working') continue
    const job = JOBS.find(j => j.id === a.jobId)
    if (now >= a.end) {
      g = { ...g, livelihood: { ...g.livelihood, active: g.livelihood.active === a.id ? null : g.livelihood.active, workEvent: g.livelihood.workEvent?.appointmentId === a.id ? null : g.livelihood.workEvent, appointments: g.livelihood.appointments.map(entry => entry.id === a.id ? { ...entry, status: 'missed' } : entry) } }
      g = notifyWork(g, `${a.id}:call`, job.employer, 'Ligamos sobre o compromisso que você não cumpriu.', 'call')
      g = penalizeWork(g, a, job.project ? 'O prazo do projeto terminou.' : 'Você faltou ao turno.')
    } else if (now >= a.start - 60 && now < a.end && a.status === 'scheduled') {
      g = notifyWork(g, `${a.id}:reminder`, job.employer, job.project ? 'Seu projeto está pendente. Consulte o prazo na agenda.' : 'Seu turno está próximo ou já começou. Confira o horário e o local na agenda.')
    }
  }
  return { ...g, livelihood: { ...g.livelihood, checkedAt: now } }
}
