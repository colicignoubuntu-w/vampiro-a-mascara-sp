import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { JOBS } from '../../data/activities/jobs'
import { RELATIONSHIP_NPCS } from '../../data/npcs/relationships/index.js'
import './Smartphone.css'

const GAME_START_DATE = Date.UTC(2026, 9, 11)

const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

const WEEKDAYS_SHORT = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

const INTERNET_LINKS = [
  {
    id: 'noite-sp',
    title: 'Noite SP',
    subtitle: 'Eventos, bares e casas noturnas',
    text: 'Uma página simples de eventos da cidade. Mais tarde ela pode receber shows, festas, boatos e locais desbloqueados durante a crônica.',
  },
  {
    id: 'classificados',
    title: 'Classificados',
    subtitle: 'Empregos, serviços e anúncios',
    text: 'Espaço preparado para integrar vagas de trabalho, serviços, apartamentos e anúncios suspeitos.',
  },
  {
    id: 'noticias',
    title: 'Notícias',
    subtitle: 'São Paulo agora',
    text: 'Pode futuramente mostrar notícias que mudam conforme crimes, violações da Máscara, missões e acontecimentos da história.',
  },
]

function pad(value) {
  return String(value ?? 0).padStart(2, '0')
}

function dateFromWorldDay(day = 1) {
  return new Date(
    GAME_START_DATE +
    (Math.max(1, Number(day) || 1) - 1) * 86400000
  )
}

function dayFromAbsoluteMinutes(minutes = 0) {
  return Math.floor(Math.max(0, Number(minutes) || 0) / 1440) + 1
}

function dateFromAbsoluteMinutes(minutes = 0) {
  return dateFromWorldDay(dayFromAbsoluteMinutes(minutes))
}

function sameUtcDate(a, b) {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  )
}

function formatTimeFromAbsolute(minutes) {
  const value = Math.max(0, Number(minutes) || 0)
  const minuteOfDay = value % 1440

  return `${pad(Math.floor(minuteOfDay / 60))}:${pad(minuteOfDay % 60)}`
}

function formatDayLong(date) {
  return `${date.getUTCDate()} de ${MONTHS[date.getUTCMonth()].toLowerCase()} de ${date.getUTCFullYear()}`
}

function appointmentEvent(appointment) {
  const job = JOBS.find(entry => entry.id === appointment.jobId)

  if (!job) {
    return {
      id: `appointment:${appointment.id}`,
      type: 'work',
      title: 'Compromisso',
      place: '',
      start: appointment.start,
      end: appointment.end,
      status: appointment.status,
    }
  }

  return {
    id: `appointment:${appointment.id}`,
    type: job.project ? 'deadline' : 'work',
    title: job.project ? `Prazo · ${job.name}` : job.name,
    place: job.place ?? job.employer ?? '',
    start: appointment.start,
    end: appointment.end,
    status: appointment.status,
    employer: job.employer,
  }
}

function relationshipEvents(game) {
  const list = []

  for (const [npcId, state] of Object.entries(game?.relationships ?? {})) {
    const npc = RELATIONSHIP_NPCS[npcId]

    if (!npc || state?.completed) {
      continue
    }

    if (state?.deadlineAt) {
      list.push({
        id: `relationship-deadline:${npcId}:${state.deadlineAt}`,
        type: 'deadline',
        title: `Prazo · ${npc.name}`,
        place: npc.role ?? '',
        start: state.deadlineAt,
        end: state.deadlineAt,
        status: 'important',
      })
    }
  }

  return list
}

function calendarEvents(game) {
  const appointments = (game?.livelihood?.appointments ?? [])
    .filter(entry => !['cancelled', 'excused'].includes(entry.status))
    .map(appointmentEvent)

  return [
    ...appointments,
    ...relationshipEvents(game),
  ]
}

function relationshipContacts(game) {
  const contacts = []

  for (const [npcId, state] of Object.entries(game?.relationships ?? {})) {
    const npc = RELATIONSHIP_NPCS[npcId]

    if (!npc) {
      continue
    }

    const flags = state?.flags ?? {}

    const explicitContact =
      flags.hasContact ||
      flags.hasPhone ||
      flags.hasNumber ||
      flags.phoneNumber ||
      flags.contactNumber ||
      Object.entries(flags).some(([key, value]) => {
        if (!value) {
          return false
        }

        const lower = key.toLowerCase()

        return (
          lower.includes('contact') ||
          lower.includes('phone') ||
          lower.includes('number')
        )
      })

    if (!explicitContact) {
      continue
    }

    contacts.push({
      id: `relationship:${npcId}`,
      name: npc.name,
      number:
        flags.phoneNumber ??
        flags.contactNumber ??
        'Número salvo',
      source: 'relationship',
      portrait: npc.portrait,
    })
  }

  return contacts
}

function explicitContacts(game) {
  const raw =
    game?.phone?.contacts ??
    game?.contacts ??
    game?.phonebook ??
    []

  if (Array.isArray(raw)) {
    return raw
      .filter(Boolean)
      .map((contact, index) => ({
        id: contact.id ?? `explicit:${index}`,
        name: contact.name ?? contact.label ?? 'Contato',
        number: contact.number ?? contact.phone ?? 'Número salvo',
        source: 'explicit',
        portrait: contact.portrait,
      }))
  }

  return Object.entries(raw).map(([id, contact]) => ({
    id,
    name: contact?.name ?? id,
    number: contact?.number ?? contact?.phone ?? 'Número salvo',
    source: 'explicit',
    portrait: contact?.portrait,
  }))
}

function messageContacts(game) {
  return (game?.livelihood?.phone ?? [])
    .map(message => {
      const name = String(message?.sender ?? '').trim()

      if (!name) {
        return null
      }

      return {
        id: `message-contact:${name.toLowerCase()}`,
        name,
        number: 'Número salvo',
        source: 'messages',
      }
    })
    .filter(Boolean)
}

function allContacts(game) {
  const merged = [
    ...explicitContacts(game),
    ...relationshipContacts(game),
    ...messageContacts(game),
  ]

  const seen = new Set()

  return merged
    .filter(contact => {
      const key = contact.name.toLowerCase()

      if (seen.has(key)) {
        return false
      }

      seen.add(key)
      return true
    })
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
}

function Icon({ type }) {
  const icons = {
    contacts: '☎',
    messages: '✉',
    calendar: '▦',
    internet: '◎',
  }

  return (
    <span className={`phone-app-icon phone-app-icon-${type}`}>
      {icons[type] ?? '•'}
    </span>
  )
}

function HomeApp({ unread, onOpen }) {
  return (
    <div className="phone-home">
      <div className="phone-wallpaper-mark">
        SÃO PAULO
        <small>DEPOIS DA MEIA-NOITE</small>
      </div>

      <div className="phone-app-grid">
        <button type="button" onClick={() => onOpen('contacts')}>
          <Icon type="contacts" />
          <span>Contatos</span>
        </button>

        <button type="button" onClick={() => onOpen('messages')}>
          <span className="phone-icon-wrap">
            <Icon type="messages" />

            {unread > 0 && (
              <b className="phone-badge">
                {unread > 99 ? '99+' : unread}
              </b>
            )}
          </span>

          <span>Mensagens</span>
        </button>

        <button type="button" onClick={() => onOpen('calendar')}>
          <Icon type="calendar" />
          <span>Agenda</span>
        </button>

        <button type="button" onClick={() => onOpen('internet')}>
          <Icon type="internet" />
          <span>Internet</span>
        </button>
      </div>
    </div>
  )
}

function ContactsApp({ game }) {
  const contacts = allContacts(game)
  const [query, setQuery] = useState('')

  const filtered = contacts.filter(contact =>
    contact.name.toLowerCase().includes(query.trim().toLowerCase())
  )

  return (
    <section className="phone-app-screen">
      <div className="phone-app-title">
        <span>Contatos</span>
        <strong>{contacts.length}</strong>
      </div>

      <label className="phone-search">
        <span>Buscar</span>

        <input
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder="Nome"
        />
      </label>

      <div className="phone-contact-list">
        {filtered.length === 0 && (
          <p className="phone-empty">
            Nenhum contato disponível.
          </p>
        )}

        {filtered.map(contact => (
          <article key={contact.id} className="phone-contact">
            <div className="phone-avatar">
              {contact.portrait ? (
                <img src={contact.portrait} alt="" />
              ) : (
                contact.name.slice(0, 1).toUpperCase()
              )}
            </div>

            <div>
              <strong>{contact.name}</strong>
              <span>{contact.number}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function MessagesApp({ game, onChange }) {
  const messages = [...(game?.livelihood?.phone ?? [])]
    .sort((a, b) => (b.at ?? 0) - (a.at ?? 0))

  function markAllRead() {
    if (!onChange || messages.every(message => message.read)) {
      return
    }

    onChange({
      ...game,
      livelihood: {
        ...(game.livelihood ?? {}),
        phone: (game.livelihood?.phone ?? []).map(message => ({
          ...message,
          read: true,
        })),
      },
    })
  }

  return (
    <section className="phone-app-screen">
      <div className="phone-app-title">
        <span>Mensagens</span>

        <button type="button" onClick={markAllRead}>
          Marcar lidas
        </button>
      </div>

      <div className="phone-message-list">
        {messages.length === 0 && (
          <p className="phone-empty">
            Nenhuma mensagem recebida.
          </p>
        )}

        {messages.map(message => (
          <article
            key={message.id}
            className={`phone-message ${message.read ? '' : 'phone-message-unread'}`}
          >
            <header>
              <strong>{message.sender ?? 'Desconhecido'}</strong>

              <time>
                Dia {dayFromAbsoluteMinutes(message.at)} · {formatTimeFromAbsolute(message.at)}
              </time>
            </header>

            <p>{message.text}</p>

            {message.kind && (
              <small>
                {message.kind === 'call' ? 'Ligação' : 'Mensagem'}
              </small>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}

function CalendarApp({ game }) {
  const currentDate = dateFromWorldDay(game?.world?.day ?? 1)

  const [cursor, setCursor] = useState(() => ({
    year: currentDate.getUTCFullYear(),
    month: currentDate.getUTCMonth(),
  }))

  const [selectedDate, setSelectedDate] = useState(currentDate)

  const events = useMemo(
    () => calendarEvents(game),
    [game]
  )

  const first = new Date(
    Date.UTC(cursor.year, cursor.month, 1)
  )

  const daysInMonth = new Date(
    Date.UTC(cursor.year, cursor.month + 1, 0)
  ).getUTCDate()

  const cells = []

  for (
    let index = 0;
    index < first.getUTCDay();
    index += 1
  ) {
    cells.push(null)
  }

  for (
    let day = 1;
    day <= daysInMonth;
    day += 1
  ) {
    cells.push(
      new Date(
        Date.UTC(cursor.year, cursor.month, day)
      )
    )
  }

  const selectedEvents = events
    .filter(event =>
      sameUtcDate(
        dateFromAbsoluteMinutes(event.start),
        selectedDate
      )
    )
    .sort((a, b) => (a.start ?? 0) - (b.start ?? 0))

  function eventsForDate(date) {
    return events.filter(event =>
      sameUtcDate(
        dateFromAbsoluteMinutes(event.start),
        date
      )
    )
  }

  function moveMonth(amount) {
    const next = new Date(
      Date.UTC(cursor.year, cursor.month + amount, 1)
    )

    setCursor({
      year: next.getUTCFullYear(),
      month: next.getUTCMonth(),
    })

    setSelectedDate(next)
  }

  function goToday() {
    setCursor({
      year: currentDate.getUTCFullYear(),
      month: currentDate.getUTCMonth(),
    })

    setSelectedDate(currentDate)
  }

  return (
    <section className="phone-calendar">
      <header className="phone-calendar-header">
        <button
          type="button"
          onClick={() => moveMonth(-1)}
          aria-label="Mês anterior"
        >
          ‹
        </button>

        <div>
          <strong>{MONTHS[cursor.month]}</strong>
          <span>{cursor.year}</span>
        </div>

        <button
          type="button"
          onClick={() => moveMonth(1)}
          aria-label="Próximo mês"
        >
          ›
        </button>
      </header>

      <button
        type="button"
        className="phone-calendar-today"
        onClick={goToday}
      >
        Hoje
      </button>

      <div className="phone-calendar-weekdays">
        {WEEKDAYS_SHORT.map((day, index) => (
          <span key={`${day}:${index}`}>
            {day}
          </span>
        ))}
      </div>

      <div className="phone-calendar-grid">
        {cells.map((date, index) => {
          if (!date) {
            return (
              <span
                key={`empty:${index}`}
                className="phone-calendar-empty"
              />
            )
          }

          const dayEvents = eventsForDate(date)
          const today = sameUtcDate(date, currentDate)
          const selected = sameUtcDate(date, selectedDate)

          const hasWork = dayEvents.some(
            event => event.type === 'work'
          )

          const hasDeadline = dayEvents.some(
            event => event.type === 'deadline'
          )

          return (
            <button
              type="button"
              key={date.toISOString()}
              className={[
                'phone-calendar-day',
                today ? 'phone-calendar-day-today' : '',
                selected ? 'phone-calendar-day-selected' : '',
                dayEvents.length ? 'phone-calendar-day-event' : '',
                hasDeadline ? 'phone-calendar-day-deadline' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => setSelectedDate(date)}
            >
              <span>{date.getUTCDate()}</span>

              {dayEvents.length > 0 && (
                <small className="phone-calendar-dots">
                  {hasWork && (
                    <i className="phone-dot phone-dot-work" />
                  )}

                  {hasDeadline && (
                    <i className="phone-dot phone-dot-deadline" />
                  )}
                </small>
              )}
            </button>
          )
        })}
      </div>

      <div className="phone-day-agenda">
        <header>
          <span>AGENDA DO DIA</span>
          <strong>{formatDayLong(selectedDate)}</strong>
        </header>

        {selectedEvents.length === 0 ? (
          <p className="phone-empty">
            Nenhum compromisso importante.
          </p>
        ) : (
          selectedEvents.map(event => (
            <article
              key={event.id}
              className={`phone-agenda-item phone-agenda-${event.type}`}
            >
              <time>
                {event.type === 'deadline'
                  ? 'PRAZO'
                  : formatTimeFromAbsolute(event.start)}
              </time>

              <div>
                <strong>{event.title}</strong>

                {event.place && (
                  <span>{event.place}</span>
                )}

                {event.status === 'missed' && (
                  <small>Não cumprido</small>
                )}

                {event.status === 'working' && (
                  <small>Em andamento</small>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  )
}

function InternetApp() {
  const [page, setPage] = useState(null)

  if (page) {
    return (
      <section className="phone-app-screen phone-browser-page">
        <button
          type="button"
          className="phone-browser-back"
          onClick={() => setPage(null)}
        >
          ‹ resultados
        </button>

        <small>
          www.saopaulo-noite.net/{page.id}
        </small>

        <h3>{page.title}</h3>
        <p>{page.text}</p>

        <div className="phone-browser-placeholder">
          Este aplicativo está pronto para receber páginas e eventos da história.
        </div>
      </section>
    )
  }

  return (
    <section className="phone-app-screen">
      <div className="phone-browser-address">
        www.saopaulo-noite.net
      </div>

      <div className="phone-browser-links">
        {INTERNET_LINKS.map(link => (
          <button
            type="button"
            key={link.id}
            onClick={() => setPage(link)}
          >
            <strong>{link.title}</strong>
            <span>{link.subtitle}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

export default function Smartphone({
  game,
  onChange,
  blocked = false,
}) {
  const [open, setOpen] = useState(false)
  const [app, setApp] = useState('home')

  const unread = (game?.livelihood?.phone ?? [])
    .filter(message => !message.read)
    .length

  function closePhone() {
    setOpen(false)
    setApp('home')
  }

  return (
    <>
      <button
        type="button"
        className="game-phone-button"
        onClick={() => setOpen(true)}
        disabled={blocked}
        aria-haspopup="dialog"
      >
        Celular

        {unread > 0 && (
          <span className="game-phone-button-badge">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open &&
        createPortal(
          <div
            className="phone-overlay"
            role="presentation"
            onMouseDown={event => {
              if (event.target === event.currentTarget) {
                closePhone()
              }
            }}
          >
            <section
              className="smartphone"
              role="dialog"
              aria-modal="true"
              aria-label="Celular"
            >
              <div className="phone-speaker" />

              <div className="phone-screen">
                <header className="phone-statusbar">
                  <strong>
                    {pad(game?.world?.hour)}:{pad(game?.world?.minute)}
                  </strong>

                  <span className="phone-status-icons">
                    <i>▮▮▮</i>
                    <i>⌁</i>
                    <i>▰</i>
                  </span>
                </header>

                <div className="phone-content">
                  {app === 'home' && (
                    <HomeApp
                      unread={unread}
                      onOpen={setApp}
                    />
                  )}

                  {app === 'contacts' && (
                    <ContactsApp game={game} />
                  )}

                  {app === 'messages' && (
                    <MessagesApp
                      game={game}
                      onChange={onChange}
                    />
                  )}

                  {app === 'calendar' && (
                    <CalendarApp game={game} />
                  )}

                  {app === 'internet' && (
                    <InternetApp />
                  )}
                </div>

                <footer className="phone-navigation">
                  <button
                    type="button"
                    onClick={() => setApp('home')}
                    aria-label="Tela inicial"
                    className={app === 'home' ? 'active' : ''}
                  >
                    ○
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (app === 'home') {
                        closePhone()
                      } else {
                        setApp('home')
                      }
                    }}
                    aria-label="Voltar"
                  >
                    ‹
                  </button>

                  <button
                    type="button"
                    onClick={closePhone}
                    aria-label="Fechar celular"
                  >
                    ×
                  </button>
                </footer>
              </div>
            </section>
          </div>,
          document.body
        )}
    </>
  )
}
