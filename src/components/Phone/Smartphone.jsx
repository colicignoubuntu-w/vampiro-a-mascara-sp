import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { JOBS } from '../../data/activities/jobs'
import { RELATIONSHIP_NPCS } from '../../data/npcs/relationships/index.js'
import {
  getRelationshipState,
} from '../../engine/relationships/relationshipModel'
import {
  RELATIONSHIP_PHONE_ACTIONS,
  performRelationshipPhoneAction,
  relationshipPhoneActionReason,
  resolveRelationshipCallChoice,
  startRelationshipCall,
  getRelationshipChatOptions,
  sendRelationshipChatChoice,
} from '../../engine/relationships/relationshipPhoneEngine'
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

  const relationshipAppointments = (game?.relationshipAppointments ?? [])
    .filter(entry => !['cancelled'].includes(entry.status))
    .map(entry => ({
      id: entry.id,
      type: 'relationship',
      title: entry.title ?? 'Encontro',
      place: entry.place ?? '',
      start: entry.start,
      end: entry.end,
      status: entry.status,
      npcId: entry.npcId,
    }))

  return [
    ...appointments,
    ...relationshipAppointments,
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
      state?.contact?.known ||
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
      npcId,
      name: npc.name,
      number:
        state?.contact?.number ??
        flags.phoneNumber ??
        flags.contactNumber ??
        'Número salvo',
      source: 'relationship',
      portrait: npc.portrait,
      blocked: Boolean(state?.contact?.blocked),
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
      if (message?.direction === 'outgoing' || message?.sender === 'Você') {
        return null
      }

      const name = String(message?.sender ?? '').trim()

      if (!name) {
        return null
      }

      return {
        id: `message-contact:${message.npcId ?? name.toLowerCase()}`,
        npcId: message.npcId ?? null,
        name,
        number: 'Número salvo',
        source: message.npcId ? 'relationship' : 'messages',
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
    social: 'V',
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

        <button type="button" onClick={() => onOpen('social')}>
          <Icon type="social" />
          <span>Vitta</span>
        </button>
      </div>
    </div>
  )
}

function ContactDetail({
  game,
  contact,
  onChange,
  onBack,
}) {
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [callConversation, setCallConversation] = useState(null)

  const state =
    contact.npcId
      ? getRelationshipState(
          game,
          contact.npcId
        )
      : null

  function startCall() {
    if (
      !contact.npcId ||
      !onChange
    ) {
      return
    }

    setError(null)
    setResult(null)

    try {
      const next =
        startRelationshipCall(
          game,
          contact.npcId
        )

      onChange(
        next.game
      )

      setCallConversation(
        next.conversation
      )
    } catch (actionError) {
      setError(
        actionError?.message ??
        'Não foi possível iniciar a ligação.'
      )
    }
  }

  function chooseCallOption(
    choiceId
  ) {
    if (
      !callConversation ||
      !onChange
    ) {
      return
    }

    setError(null)

    try {
      const next =
        resolveRelationshipCallChoice(
          game,
          callConversation,
          choiceId
        )

      onChange(
        next.game
      )

      setCallConversation(
        next.conversation
      )
    } catch (actionError) {
      setError(
        actionError?.message ??
        'Não foi possível continuar a ligação.'
      )
    }
  }

  function perform(action) {
    if (
      !contact.npcId ||
      !onChange
    ) {
      return
    }

    setError(null)
    setResult(null)

    try {
      const next =
        performRelationshipPhoneAction(
          game,
          contact.npcId,
          action
        )

      onChange(next)

      setResult(
        action === 'invite'
          ? 'Convite enviado. Confira as mensagens e a agenda.'
          : action === 'call'
            ? 'Ligação concluída. Confira o histórico.'
            : action === 'blood'
              ? 'Pedido enviado. A resposta aparece nas mensagens.'
              : action === 'help'
                ? 'Pedido de ajuda enviado.'
                : 'Mensagem enviada.'
      )
    } catch (actionError) {
      setError(
        actionError?.message ??
        'Não foi possível realizar essa ação.'
      )
    }
  }

  return (
    <section className="phone-app-screen">
      <button
        type="button"
        className="phone-contact-back"
        onClick={onBack}
      >
        ‹ contatos
      </button>

      <div className="phone-contact-profile">
        <div className="phone-avatar phone-avatar-large">
          {contact.portrait ? (
            <img src={contact.portrait} alt="" />
          ) : (
            contact.name.slice(0, 1).toUpperCase()
          )}
        </div>

        <div>
          <h3>{contact.name}</h3>

          <span>
            {contact.blocked
              ? 'Contato bloqueado'
              : contact.number}
          </span>

          {contact.npcId && (
            <small>
              Contato pessoal
            </small>
          )}
        </div>
      </div>

      {contact.npcId ? (
        <>
          {callConversation ? (
            <div className="phone-call-conversation">
              <div className="phone-call-live">
                <span>
                  {callConversation.active
                    ? 'LIGAÇÃO EM ANDAMENTO'
                    : 'LIGAÇÃO ENCERRADA'}
                </span>

                <strong>
                  {contact.name}
                </strong>
              </div>

              <div className="phone-call-dialogue">
                <small>
                  {callConversation.speaker}
                </small>

                <p>
                  {callConversation.line}
                </p>
              </div>

              {callConversation.active ? (
                <div className="phone-call-choices">
                  {callConversation.choices.map(choice => (
                    <button
                      type="button"
                      key={choice.id}
                      onClick={() =>
                        chooseCallOption(
                          choice.id
                        )
                      }
                    >
                      {choice.text}
                    </button>
                  ))}
                </div>
              ) : (
                <button
                  type="button"
                  className="phone-call-return"
                  onClick={() =>
                    setCallConversation(
                      null
                    )
                  }
                >
                  Voltar ao contato
                </button>
              )}
            </div>
          ) : (
          <div className="phone-contact-actions">
            {Object.entries(
              RELATIONSHIP_PHONE_ACTIONS
            ).map(([action, label]) => {
              const reason =
                relationshipPhoneActionReason(
                  game,
                  contact.npcId,
                  action
                )

              return (
                <button
                  type="button"
                  key={action}
                  disabled={Boolean(reason)}
                  title={reason ?? ''}
                  onClick={() =>
                    action === 'call'
                      ? startCall()
                      : perform(action)
                  }
                >
                  <strong>{label}</strong>

                  {reason && (
                    <span>{reason}</span>
                  )}
                </button>
              )
            })}
          </div>
          )}

          {result && !callConversation && (
            <p className="phone-action-result">
              {result}
            </p>
          )}

          {error && (
            <p className="phone-action-error">
              {error}
            </p>
          )}
        </>
      ) : (
        <p className="phone-empty">
          Este contato ainda não possui ações de relacionamento.
        </p>
      )}
    </section>
  )
}

function ContactsApp({
  game,
  onChange,
}) {
  const contacts = allContacts(game)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = contacts.filter(contact =>
    contact.name.toLowerCase().includes(query.trim().toLowerCase())
  )

  if (selected) {
    const current =
      contacts.find(
        contact =>
          contact.id === selected.id
      ) ??
      selected

    return (
      <ContactDetail
        game={game}
        contact={current}
        onChange={onChange}
        onBack={() => setSelected(null)}
      />
    )
  }

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
          <button
            type="button"
            key={contact.id}
            className="phone-contact phone-contact-button"
            onClick={() => setSelected(contact)}
          >
            <div className="phone-avatar">
              {contact.portrait ? (
                <img src={contact.portrait} alt="" />
              ) : (
                contact.name.slice(0, 1).toUpperCase()
              )}
            </div>

            <div>
              <strong>{contact.name}</strong>
              <span>
                {contact.blocked
                  ? 'Contato bloqueado'
                  : contact.number}
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}

function conversationMessages(
  game,
  contact
) {
  return (
    game?.livelihood?.phone ??
    []
  ).filter(
    message =>
      contact.npcId
        ? message.npcId ===
          contact.npcId
        : message.sender ===
          contact.name
  )
}

function conversationPreview(
  game,
  contact
) {
  const messages =
    conversationMessages(
      game,
      contact
    )

  const latest =
    messages[
      messages.length - 1
    ]

  return (
    latest?.text ??
    'Nenhuma mensagem ainda.'
  )
}

function ConversationView({
  game,
  contact,
  onChange,
  onBack,
}) {
  const [
    composerOpen,
    setComposerOpen,
  ] = useState(
    false
  )

  const [
    callConversation,
    setCallConversation,
  ] = useState(
    null
  )

  const [
    error,
    setError,
  ] = useState(
    null
  )

  const messages =
    conversationMessages(
      game,
      contact
    )

  const options =
    contact.npcId
      ? getRelationshipChatOptions(
          game,
          contact.npcId
        )
      : []

  function startCall() {
    if (
      !contact.npcId
    ) {
      return
    }

    try {
      const result =
        startRelationshipCall(
          game,
          contact.npcId
        )

      onChange(
        result.game
      )

      setCallConversation(
        result.conversation
      )

      setError(
        null
      )
    } catch (callError) {
      setError(
        callError?.message ??
        'Não foi possível iniciar a ligação.'
      )
    }
  }

  function chooseCall(
    choiceId
  ) {
    try {
      const result =
        resolveRelationshipCallChoice(
          game,
          callConversation,
          choiceId
        )

      onChange(
        result.game
      )

      setCallConversation(
        result.conversation
      )

      setError(
        null
      )
    } catch (callError) {
      setError(
        callError?.message ??
        'Não foi possível continuar a ligação.'
      )
    }
  }

  function sendChoice(
    choiceId
  ) {
    if (
      !contact.npcId
    ) {
      return
    }

    try {
      const result =
        sendRelationshipChatChoice(
          game,
          contact.npcId,
          choiceId
        )

      onChange(
        result.game
      )

      setComposerOpen(
        false
      )

      setError(
        null
      )
    } catch (sendError) {
      setError(
        sendError?.message ??
        'Não foi possível enviar a mensagem.'
      )
    }
  }

  return (
    <section className="phone-whatsapp">
      <header className="phone-whatsapp-header">
        <button
          type="button"
          className="phone-whatsapp-back"
          onClick={onBack}
          aria-label="Voltar"
        >
          ‹
        </button>

        <div className="phone-whatsapp-avatar">
          {contact.portrait ? (
            <img
              src={contact.portrait}
              alt=""
            />
          ) : (
            contact.name
              .slice(
                0,
                1
              )
              .toUpperCase()
          )}
        </div>

        <div className="phone-whatsapp-person">
          <strong>
            {contact.name}
          </strong>

          <span>
            {contact.blocked
              ? 'bloqueado'
              : 'online recentemente'}
          </span>
        </div>

        {contact.npcId && (
          <button
            type="button"
            className="phone-whatsapp-call"
            onClick={
              startCall
            }
            aria-label="Ligar"
            title="Ligar"
          >
            ☎
          </button>
        )}
      </header>

      {callConversation ? (
        <div className="phone-whatsapp-call-screen">
          <div className="phone-whatsapp-call-status">
            <span>
              {callConversation.active
                ? 'LIGAÇÃO'
                : 'LIGAÇÃO ENCERRADA'}
            </span>

            <strong>
              {contact.name}
            </strong>
          </div>

          <div className="phone-whatsapp-call-line">
            <span>
              {callConversation.speaker}
            </span>

            <p>
              {callConversation.line}
            </p>
          </div>

          {callConversation.active ? (
            <div className="phone-whatsapp-call-choices">
              {callConversation.choices.map(
                choice => (
                  <button
                    type="button"
                    key={choice.id}
                    onClick={() =>
                      chooseCall(
                        choice.id
                      )
                    }
                  >
                    {choice.text}
                  </button>
                )
              )}
            </div>
          ) : (
            <button
              type="button"
              className="phone-whatsapp-end-call"
              onClick={() =>
                setCallConversation(
                  null
                )
              }
            >
              Voltar à conversa
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="phone-whatsapp-messages">
            {messages.length ===
              0 && (
              <p className="phone-whatsapp-empty">
                Nenhuma mensagem ainda.
              </p>
            )}

            {messages.map(
              message => (
                <div
                  key={
                    message.id
                  }
                  className={[
                    'phone-whatsapp-bubble',
                    message.direction ===
                      'outgoing'
                      ? 'outgoing'
                      : 'incoming',
                  ].join(' ')}
                >
                  <p>
                    {message.text}
                  </p>

                  <small>
                    {formatTimeFromAbsolute(
                      message.at
                    )}
                    {message.direction ===
                      'outgoing'
                      ? ' ✓✓'
                      : ''}
                  </small>
                </div>
              )
            )}
          </div>

          {error && (
            <div className="phone-whatsapp-error">
              {error}
            </div>
          )}

          {composerOpen && (
            <div className="phone-whatsapp-options">
              <span>
                O que você quer mandar?
              </span>

              {options.map(
                option => (
                  <button
                    type="button"
                    key={
                      option.id
                    }
                    onClick={() =>
                      sendChoice(
                        option.id
                      )
                    }
                  >
                    {option.text}
                  </button>
                )
              )}
            </div>
          )}

          <div className="phone-whatsapp-composer">
            <button
              type="button"
              className="phone-whatsapp-input"
              onClick={() =>
                setComposerOpen(
                  current =>
                    !current
                )
              }
              disabled={
                !contact.npcId ||
                contact.blocked
              }
            >
              {contact.blocked
                ? 'Contato bloqueado'
                : 'Mensagem...'}
            </button>

            <button
              type="button"
              className="phone-whatsapp-send"
              onClick={() =>
                setComposerOpen(
                  true
                )
              }
              disabled={
                !contact.npcId ||
                contact.blocked
              }
              aria-label="Escolher mensagem"
            >
              ➤
            </button>
          </div>
        </>
      )}
    </section>
  )
}

function MessagesApp({
  game,
  onChange,
}) {
  const [
    selected,
    setSelected,
  ] = useState(
    null
  )

  const contacts =
    allContacts(
      game
    ).filter(
      contact => {
        if (
          contact.npcId
        ) {
          return true
        }

        return (
          game?.livelihood
            ?.phone ??
          []
        ).some(
          message =>
            message.sender ===
            contact.name
        )
      }
    )

  if (
    selected
  ) {
    const current =
      contacts.find(
        contact =>
          contact.id ===
          selected.id
      ) ??
      selected

    return (
      <ConversationView
        game={game}
        contact={current}
        onChange={onChange}
        onBack={() =>
          setSelected(
            null
          )
        }
      />
    )
  }

  return (
    <section className="phone-app-screen">
      <div className="phone-app-title">
        <span>
          Mensagens
        </span>

        <strong>
          {contacts.length}
        </strong>
      </div>

      <div className="phone-whatsapp-thread-list">
        {contacts.map(
          contact => {
            const thread =
              conversationMessages(
                game,
                contact
              )

            const unread =
              thread.filter(
                message =>
                  !message.read &&
                  message.direction !==
                    'outgoing'
              ).length

            const latest =
              thread[
                thread.length - 1
              ]

            return (
              <button
                type="button"
                className="phone-whatsapp-thread"
                key={
                  contact.id
                }
                onClick={() => {
                  if (
                    unread > 0 &&
                    onChange
                  ) {
                    onChange({
                      ...game,

                      livelihood: {
                        ...(game.livelihood ??
                          {}),

                        phone: (
                          game.livelihood
                            ?.phone ??
                          []
                        ).map(
                          message =>
                            (
                              contact.npcId
                                ? message.npcId ===
                                  contact.npcId
                                : message.sender ===
                                  contact.name
                            )
                              ? {
                                  ...message,
                                  read:
                                    true,
                                }
                              : message
                        ),
                      },
                    })
                  }

                  setSelected(
                    contact
                  )
                }}
              >
                <div className="phone-whatsapp-thread-avatar">
                  {contact.portrait ? (
                    <img
                      src={
                        contact.portrait
                      }
                      alt=""
                    />
                  ) : (
                    contact.name
                      .slice(
                        0,
                        1
                      )
                      .toUpperCase()
                  )}
                </div>

                <div className="phone-whatsapp-thread-main">
                  <strong>
                    {contact.name}
                  </strong>

                  <span>
                    {conversationPreview(
                      game,
                      contact
                    )}
                  </span>
                </div>

                <div className="phone-whatsapp-thread-meta">
                  <small>
                    {latest
                      ? formatTimeFromAbsolute(
                          latest.at
                        )
                      : ''}
                  </small>

                  {unread > 0 && (
                    <b>
                      {unread}
                    </b>
                  )}
                </div>
              </button>
            )
          }
        )}
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

          const hasRelationship = dayEvents.some(
            event => event.type === 'relationship'
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

                  {hasRelationship && (
                    <i className="phone-dot phone-dot-relationship" />
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

const VITTA_POSTS = [
  { id:'clara-01', npcId:'clara', name:'Clara', handle:'@clarafotos', text:'mais uma noite atrás das lentes.', meta:'Fotografia de show · São Paulo' },
  { id:'gole-01', name:'Último Gole', handle:'@ultimogole', text:'Programação da semana atualizada.', meta:'Evento público · São Paulo' },
]

function VittaApp({ game }) {
  const [profile,setProfile]=useState(null)
  const visible=VITTA_POSTS.filter(p=>!p.npcId || Boolean(game?.relationships?.[p.npcId]))
  if(profile){
    return <section className="phone-app-screen phone-vitta">
      <button type="button" className="phone-browser-back" onClick={()=>setProfile(null)}>‹ feed</button>
      <div className="phone-vitta-profile"><span className="phone-vitta-avatar">{profile.name[0]}</span><div><h3>{profile.name}</h3><span>{profile.handle}</span></div></div>
      {visible.filter(p=>p.handle===profile.handle).map(p=><article className="phone-vitta-post" key={p.id}><p>{p.text}</p><small>{p.meta}</small></article>)}
    </section>
  }
  return <section className="phone-app-screen phone-vitta">
    <div className="phone-app-title"><span>Vitta</span><strong>feed</strong></div>
    {visible.map(p=><article className="phone-vitta-post" key={p.id}>
      <button type="button" className="phone-vitta-author" onClick={()=>setProfile(p)}><span className="phone-vitta-avatar">{p.name[0]}</span><span><strong>{p.name}</strong><small>{p.handle}</small></span></button>
      <p>{p.text}</p><small>{p.meta}</small><div className="phone-vitta-actions"><span>♡</span><span>comentários</span><span>compartilhar</span></div>
    </article>)}
  </section>
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

  function openApp(nextApp) {
    if (
      nextApp === 'messages' &&
      onChange
    ) {
      const phone =
        game?.livelihood?.phone ??
        []

      const hasUnread =
        phone.some(
          message =>
            !message.read &&
            message.direction !==
              'outgoing'
        )

      if (hasUnread) {
        onChange({
          ...game,

          livelihood: {
            ...(game.livelihood ?? {}),

            phone:
              phone.map(
                message => ({
                  ...message,

                  read:
                    message.direction ===
                    'outgoing'
                      ? true
                      : true,
                })
              ),
          },
        })
      }
    }

    setApp(
      nextApp
    )
  }

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
                      onOpen={openApp}
                    />
                  )}

                  {app === 'contacts' && (
                    <ContactsApp
                      game={game}
                      onChange={onChange}
                    />
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

                  {app === 'social' && (
                    <VittaApp game={game} />
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
