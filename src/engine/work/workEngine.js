import { JOBS, CRIMES, SKILL_LABELS } from '../../data/activities/jobs'
import { getWeapon } from '../../data/items/weapons'
import { advanceGameTime, crossesSunrise, isDaytime } from '../time/timeEngine'
import { rollDicePool } from '../dice/rollTest'
import { increasePoliceWantedLevel } from '../police/policeWantedEngine'
import { absoluteMinutes, normalizeLivelihood, notifyWork, penalizeWork, reconcileSchedule, upcomingShifts } from './scheduleEngine'

export function skillValue(game, key) {
  return game.abilities?.[key] ?? Object.values(game.attributes ?? {}).find(group => group?.[key] !== undefined)?.[key] ?? 0
}
export function jobRequirements(game, job) {
  const missing = Object.entries(job.requirements).filter(([key, value]) => skillValue(game, key) < value).map(([key, value]) => `${SKILL_LABELS[key]} ${value}`)
  if (job.firearm && !game.inventory?.some(item => (item.quantity ?? 1) > 0 && getWeapon(item.id)?.category === 'firearm')) missing.push('arma de fogo no inventário')
  if (job.credentials && !game.livelihood?.credentials) missing.push('validar formação e identidade no Curso Livre da Liberdade')
  return missing
}
function updateAppointment(game, id, patch) {
  return { ...game, livelihood: { ...game.livelihood, appointments: game.livelihood.appointments.map(a => a.id === id ? { ...a, ...patch } : a) } }
}
function ensureTime(game, minutes) {
  if (crossesSunrise({ world: game.world, minutes })) throw new Error('Essa atividade alcança o amanhecer. Procure um horário seguro.')
}
function ensureFree(game) {
  if (game.livelihood.active || game.livelihood.crime || game.livelihood.workEvent) throw new Error('Resolva a atividade em andamento primeiro.')
  if (game.flags?.humanityCheckRequired) throw new Error('Resolva o conflito de Consciência antes de continuar.')
  if (isDaytime(game.world)) throw new Error('Estas atividades estão disponíveis à noite.')
}
function record(game, text) {
  return { ...game, livelihood: { ...game.livelihood, lastResult: text }, history: [...(game.history ?? []), { type: 'livelihood', text, at: absoluteMinutes(game.world) }] }
}
export function performWorkAction(input, action, roll = rollDicePool, random = Math.random) {
  let g = reconcileSchedule(input)
  const now = absoluteMinutes(g.world)
  if (action.type !== 'read' && (g.flags?.inTorpor || g.vampireState?.torpor || g.health?.currentLevel >= 7)) throw new Error('O personagem não está em condições de realizar atividades.')
  const job = JOBS.find(j => j.id === action.jobId)
  const appointment = g.livelihood.appointments.find(a => a.id === action.id)
  if (g.livelihood.workEvent && !['read', 'workEvent', 'abandon'].includes(action.type)) throw new Error('Resolva o acontecimento do expediente primeiro.')
  if (action.type === 'read') return { ...g, livelihood: { ...g.livelihood, phone: g.livelihood.phone.map(m => ({ ...m, read: true })) } }
  if (action.type === 'workEvent') {
    const event = g.livelihood.workEvent
    if (!event) throw new Error('Nenhum acontecimento pendente.')
    const shift = g.livelihood.appointments.find(a => a.id === event.appointmentId)
    const role = JOBS.find(j => j.id === shift?.jobId)
    if (!role || g.livelihood.active !== shift.id) throw new Error('O turno já terminou.')
    const remote = role.location === 'livia_apartment'
    const security = ['security', 'armed'].includes(role.id)
    const ability = remote ? 'computer' : security ? 'intimidation' : 'etiquette'
    const result = roll({ pool: skillValue(g, remote ? 'intelligence' : 'charisma') + skillValue(g, ability), difficulty: 6 })
    g = { ...g, livelihood: { ...g.livelihood, workEvent: null } }
    if (result.result === 'success') {
      const tip = remote || security ? 0 : 10
      g = { ...g, livelihood: { ...g.livelihood, money: g.livelihood.money + tip } }
      return record(g, `Você resolveu o imprevisto. O turno continua.${tip ? ' Recebeu R$ 10 de gorjeta.' : ''}`)
    }
    // A difficult event may cost reputation, but does not erase earned wages.
    g = { ...g, livelihood: { ...g.livelihood, contracts: { ...g.livelihood.contracts, [role.id]: { ...g.livelihood.contracts[role.id], reputation: Math.max(0, (g.livelihood.contracts[role.id].reputation ?? 0) - 1) } } } }
    return record(g, 'O supervisor precisou intervir. Sua reputação foi prejudicada, mas o salário das horas cumpridas permanece garantido.')
  }
  if (action.type === 'credentials') {
    ensureFree(g)
    if (g.world.location?.id !== 'liberdade' || skillValue(g, 'academics') < 4) throw new Error('Vá à Liberdade com Acadêmicos 4 para apresentar sua formação e regularizar a identidade profissional.')
    ensureTime(g, 60)
    g = advanceGameTime(g, 60, { reason: 'Validação da formação e documentação profissional' })
    return record({ ...g, livelihood: { ...g.livelihood, credentials: true } }, 'Formação e identidade profissional validadas pela secretaria do curso.')
  }
  if (action.type === 'flexWork') {
    ensureFree(g)
    if (!job?.flexible) throw new Error('Este trabalho exige um turno agendado.')
    if (g.world.location?.id !== job.location) throw new Error(`Você precisa estar em ${job.place}.`)
    const missing = jobRequirements(g, job)
    if (missing.length) throw new Error(`Falta: ${missing.join(', ')}.`)
    const minutes = Number(action.minutes)
    const durations = job.minimumMinutes ? [360, 420, 480] : [15, 30, 60]
    if (!durations.includes(minutes)) throw new Error(job.minimumMinutes ? 'Este trabalho exige no mínimo 6 horas. Escolha um expediente de 6, 7 ou 8 horas.' : 'Escolha 15, 30 ou 60 minutos de trabalho.')
    ensureTime(g, minutes)
    const pay = Math.round(job.rate * minutes / 60 * 100) / 100
    const previous = g.livelihood.contracts[job.id] ?? {}
    g = { ...g, livelihood: { ...g.livelihood, money: Math.round((g.livelihood.money + pay) * 100) / 100, contracts: { ...g.livelihood.contracts, [job.id]: { ...previous, status: 'available', worked: (previous.worked ?? 0) + minutes } } } }
    g = advanceGameTime(g, minutes, { reason: `Trabalho avulso: ${job.name}` })
    return record(g, `${minutes} minutos trabalhados em ${job.name}. R$ ${pay.toFixed(2)} recebidos. Você pode parar ou trabalhar mais quando quiser.`)
  }
  if (action.type === 'apply') {
    ensureFree(g)
    if (!job) throw new Error('Vaga desconhecida.')
    if (job.flexible) throw new Error('Este trabalho é livre. Escolha quanto tempo deseja trabalhar.')
    const missing = jobRequirements(g, job)
    if (missing.length) throw new Error(`Falta: ${missing.join(', ')}.`)
    const previous = g.livelihood.contracts[job.id]
    if (previous?.status === 'fired') throw new Error('Este contratante encerrou sua relação de trabalho.')
    if (g.livelihood.appointments.some(a => a.jobId === job.id && ['scheduled', 'working'].includes(a.status))) throw new Error('Você já tem um compromisso com este contratante.')
    if (previous?.retryAt > now) throw new Error('Aguarde a próxima noite para tentar outra entrevista.')
    const interviewMinutes = previous?.status === 'hired' ? 0 : 15
    ensureTime(g, interviewMinutes)
    const after = now + interviewMinutes
    let appointments = job.project ? [{ id: `${job.id}:${now}`, jobId: job.id, start: after, end: after + 3 * 1440, status: 'scheduled', worked: 0, prepared: 0 }] : upcomingShifts(job, after, job.weekdays ? 8 : 2)
    appointments = appointments.filter(a => !g.livelihood.appointments.some(existing => existing.id === a.id))
    if (!job.weekdays && !job.project) appointments = appointments.slice(0, 1)
    if (!appointments.length) throw new Error('Não há novos turnos disponíveis. Tente na próxima noite.')
    if (appointments.some(a => !job.project && g.livelihood.appointments.some(b => ['scheduled', 'working'].includes(b.status) && !JOBS.find(j => j.id === b.jobId)?.project && a.start < b.end && a.end > b.start))) throw new Error('Esta vaga conflita com um compromisso da sua agenda.')
    // Compare recurring weekly slots, beyond the first displayed week as well.
    if (job.weekdays && JOBS.some(other => other.weekdays && g.livelihood.contracts[other.id]?.status === 'hired' && other.id !== job.id && job.weekdays.some(day => other.weekdays.some(od => [-7, 0, 7].some(offset => day * 24 + job.start < (od + offset) * 24 + other.end && day * 24 + job.end > (od + offset) * 24 + other.start))))) throw new Error('As agendas semanais desses contratos se sobrepõem.')
    if (interviewMinutes) {
      const result = roll({ pool: skillValue(g, 'charisma') + Math.max(skillValue(g, 'etiquette'), skillValue(g, 'expression')), difficulty: 6 })
      g = advanceGameTime(g, interviewMinutes, { reason: `Entrevista: ${job.name}` })
      if (result.result !== 'success') {
        g = { ...g, livelihood: { ...g.livelihood, contracts: { ...g.livelihood.contracts, [job.id]: { ...previous, status: 'rejected', retryAt: now + 1440 } } } }
        return notifyWork(record(g, 'A entrevista não foi aprovada. Você poderá tentar novamente na próxima noite.'), `${job.id}:rejected:${now}`, job.employer, 'Sua candidatura não foi aprovada nesta entrevista.')
      }
    }
    g = { ...g, livelihood: { ...g.livelihood, contracts: { ...g.livelihood.contracts, [job.id]: { strikes: 0, reputation: 0, ...previous, status: 'hired' } }, appointments: [...g.livelihood.appointments, ...appointments], checkedAt: now + interviewMinutes } }
    return notifyWork(record(g, 'Contrato aceito. Consulte seu compromisso na agenda.'), `${job.id}:hired:${now}`, job.employer, 'Contratação confirmada. Cumpra os horários da agenda; três ocorrências resultam em demissão.')
  }
  if (['start', 'prepare', 'excuse', 'quit', 'continue', 'abandon'].includes(action.type)) {
    if (!appointment) throw new Error('Compromisso não encontrado.')
    const role = JOBS.find(j => j.id === appointment.jobId)
    if (action.type === 'abandon') {
      if (g.livelihood.active !== appointment.id) throw new Error('Este turno não está em andamento.')
      g = updateAppointment(g, appointment.id, { status: 'abandoned' })
      g = { ...g, livelihood: { ...g.livelihood, active: null, workEvent: null } }
      return record(penalizeWork(g, appointment, 'Você abandonou o turno.'), 'Turno abandonado. As horas já trabalhadas foram pagas; o contratante registrou uma advertência.')
    }
    if (action.type !== 'continue') ensureFree(g)
    if (action.type === 'quit') {
      if (g.livelihood.contracts[role.id]?.status !== 'hired') throw new Error('Contrato inativo.')
      return record({ ...g, livelihood: { ...g.livelihood, contracts: { ...g.livelihood.contracts, [role.id]: { ...g.livelihood.contracts[role.id], status: 'resigned' } }, appointments: g.livelihood.appointments.map(a => a.jobId === role.id && a.status === 'scheduled' ? { ...a, status: 'cancelled' } : a) } }, 'Você encerrou o contrato e cancelou os próximos compromissos.')
    }
    if (action.type === 'excuse') {
      if (appointment.status !== 'scheduled' || now > appointment.start - 120) throw new Error('Avise com pelo menos duas horas de antecedência.')
      if (g.livelihood.contracts[role.id]?.excusedUntil > now) throw new Error('O contratante permite uma dispensa a cada sete dias.')
      g = updateAppointment(g, appointment.id, { status: 'excused' })
      g = { ...g, livelihood: { ...g.livelihood, contracts: { ...g.livelihood.contracts, [role.id]: { ...g.livelihood.contracts[role.id], excusedUntil: now + 10080 } } } }
      return notifyWork(g, `${appointment.id}:excused`, role.employer, 'Dispensa aprovada, sem pagamento. Os demais compromissos continuam válidos.')
    }
    if (g.world.location?.id !== role.location) throw new Error(`Você precisa estar em ${role.place}.`)
    if (action.type === 'prepare') {
      if (!role.preparation || appointment.status !== 'scheduled' || appointment.prepared >= role.preparation) throw new Error('Esta aula não tem preparação pendente.')
      ensureTime(g, role.preparation)
      if (now + role.preparation > appointment.start) throw new Error('Não há tempo para preparar esta aula antes do início.')
      return record(advanceGameTime(updateAppointment(g, appointment.id, { prepared: role.preparation }), role.preparation, { reason: 'Preparação de aula' }), 'Aula preparada. Essa hora não é remunerada.')
    }
    if (action.type === 'start') {
      if (appointment.status !== 'scheduled' || now < appointment.start || now >= appointment.end) throw new Error('O compromisso não está disponível neste horário.')
      if (!role.project && now > appointment.start + 15) throw new Error('O limite de atraso é de 15 minutos. O contratante não aceita iniciar este turno agora.')
      if ((appointment.prepared ?? 0) < (role.preparation ?? 0)) throw new Error('Prepare a aula antes de iniciar.')
      const missing = jobRequirements(g, role)
      if (missing.length) throw new Error(`Falta: ${missing.join(', ')}.`)
      ensureTime(g, role.project ? 60 : appointment.end - now)
      g = updateAppointment(g, appointment.id, { status: 'working' })
      g = { ...g, livelihood: { ...g.livelihood, active: appointment.id } }
      if (!role.project && now > appointment.start) g = penalizeWork(g, appointment, 'Você chegou atrasado.')
    } else if (g.livelihood.active !== appointment.id) throw new Error('Este turno não está em andamento.')
    const remaining = role.project ? role.hours * 60 - appointment.worked : appointment.end - now
    const minutes = Math.min(60, remaining, appointment.end - now)
    if (minutes <= 0) throw new Error('Este compromisso terminou.')
    ensureTime(g, minutes)
    const worked = appointment.worked + minutes
    const finished = role.project ? worked >= role.hours * 60 : now + minutes >= appointment.end
    const pay = role.project ? (finished ? role.hours * role.rate : 0) : Math.round(role.rate * minutes / 60 * 100) / 100
    g = updateAppointment(g, appointment.id, { worked, status: finished ? 'completed' : role.project ? 'scheduled' : 'working' })
    const contract = g.livelihood.contracts[role.id]
    g = { ...g, livelihood: { ...g.livelihood, money: Math.round((g.livelihood.money + pay) * 100) / 100, active: finished || role.project ? null : appointment.id, contracts: { ...g.livelihood.contracts, [role.id]: { ...contract, reputation: (contract.reputation ?? 0) + (finished ? 1 : 0) } } } }
    g = advanceGameTime(g, minutes, { reason: `Trabalho: ${role.name}` })
    if (!role.project && !finished && !appointment.eventOccurred && random() < 0.2) {
      const remote = role.location === 'livia_apartment'
      const security = ['security', 'armed'].includes(role.id)
      g = updateAppointment(g, appointment.id, { eventOccurred: true })
      g = { ...g, livelihood: { ...g.livelihood, workEvent: { appointmentId: appointment.id, text: remote ? 'Uma falha técnica interrompeu o atendimento. Resolva com Inteligência + Computação.' : security ? 'Um cliente agressivo discute na entrada. Contenha a situação com Carisma + Intimidação.' : 'Um cliente exige falar com o responsável. Resolva com Carisma + Etiqueta; um bom atendimento pode render gorjeta.' } } }
    }
    return record(g, `${minutes} minutos trabalhados. R$ ${pay.toFixed(2)} recebidos.${finished ? ' Compromisso concluído.' : role.project ? ' Progresso salvo; conclua antes do prazo.' : ' O turno continua: cumpra o restante ou assuma uma advertência por abandono.'}`)
  }
  if (action.type === 'wait') {
    ensureFree(g)
    const minutes = Number(action.minutes)
    if (!Number.isInteger(minutes) || minutes < 1 || minutes > 60) throw new Error('Espere de 1 a 60 minutos.')
    ensureTime(g, minutes)
    return advanceGameTime(g, minutes, { reason: 'Aguardar compromisso' })
  }
  if (action.type === 'crime') {
    ensureFree(g)
    const crime = CRIMES.find(c => c.id === action.crimeId)
    if (!crime) throw new Error('Atividade desconhecida.')
    if (!['centro', 'liberdade', 'pinheiros', 'bela_vista', 'asylum', 'vesuvius'].includes(g.world.location?.id)) throw new Error('Procure uma oportunidade no Centro, Liberdade, Pinheiros, Asylum ou Vesuvius.')
    if (skillValue(g, crime.ability) < 1) throw new Error(`Requer ${SKILL_LABELS[crime.ability]} 1.`)
    ensureTime(g, crime.minutes)
    return { ...g, livelihood: { ...g.livelihood, crime: crime.id, lastResult: null } }
  }
  if (action.type === 'resolveCrime') {
    const crime = CRIMES.find(c => c.id === g.livelihood.crime)
    if (!crime) throw new Error('Nenhuma oportunidade em andamento.')
    g = { ...g, livelihood: { ...g.livelihood, crime: null } }
    if (action.retreat) return record(g, 'Você desistiu antes de agir. Não houve crime nem pagamento.')
    ensureTime(g, crime.minutes)
    const result = roll({ pool: skillValue(g, crime.attribute) + skillValue(g, crime.ability), difficulty: 7 })
    g = advanceGameTime(g, crime.minutes, { reason: crime.name })
    const success = result.result === 'success'
    const reward = success ? crime.reward + Math.min(result.successes, 5) * 15 : 0
    g = { ...g, livelihood: { ...g.livelihood, money: g.livelihood.money + reward } }
    if (!success) g = increasePoliceWantedLevel(g, { amount: crime.severity + (result.result === 'botch' ? 1 : 0), reason: `${crime.name}: testemunhas identificaram o personagem` })
    if ((g.humanity?.current ?? 0) >= crime.level) g = { ...g, flags: { ...g.flags, humanityCheckRequired: true, moralityViolation: crime.violation } }
    const remorse = (g.virtues?.conscience ?? 0) >= 3 ? ' A lembrança das pessoas afetadas provoca remorso.' : ''
    return record(g, `${crime.name}: ${success ? `você obteve R$ ${reward}.` : 'nenhum ganho; testemunhas provocaram uma busca policial.'}${result.result === 'botch' ? ' A falha crítica agravou a prioridade da busca.' : ''}${remorse}${g.flags?.humanityCheckRequired ? ' Resolva o teste de Consciência.' : ''}`)
  }
  throw new Error('Ação desconhecida.')
}
export { normalizeLivelihood }
