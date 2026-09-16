import { useState } from 'react'
import { getHavenInvestigations } from '../../engine/haven/havenEngine'
import { rollDicePool } from '../../engine/dice/rollTest'
import './LiviaFiles.css'

const INVESTIGATIONS = [
  {
    id: 'organs',
    choiceId: 'investigate_organ_traffic',
    action: 'Analisar planilhas de cirurgias e funerárias',
    file: 'PECAS_DE_REPOSICAO.txt',
    flag: 'foundOrganTrafficLead',
    icon: '📊',
    content: [
      'As planilhas ligam cirurgias, funerárias e clínicas particulares por códigos repetidos.',
      'Alguns órgãos possuem dois destinos: o declarado no prontuário e outro acompanhado de valor, data e intermediário.',
      'Os documentos provam desvios, mas ainda não revelam quem controla a operação ou quem recebe os órgãos.',
      'ANOTAÇÃO DE LÍVIA: VENDIDO.',
    ],
  },
  {
    id: 'blood',
    choiceId: 'investigate_blood_traffic',
    action: 'Cruzar estoques e transferências de sangue',
    file: 'ESTOQUE_NOTURNO.txt',
    flag: 'foundBloodTrafficLead',
    icon: '🩸',
    content: [
      'As perdas de sangue seguem horários e rotas regulares demais para serem furtos ocasionais.',
      'Funcionários diferentes autorizam as saídas, mas as placas incompletas apontam para o mesmo pequeno grupo de veículos.',
      'Lívia suspeitava de compradores que não aparecem em qualquer registro hospitalar.',
      'ANOTAÇÃO DE LÍVIA: Roubar sangue é uma coisa. Manter uma cadeia regular de fornecimento é outra.',
    ],
  },
  {
    id: 'missing',
    choiceId: 'investigate_missing_people',
    action: 'Cruzar a lista de pessoas desaparecidas',
    file: 'NOMES_AUSENTES.txt',
    flag: 'foundMissingPeopleLead',
    icon: '👤',
    content: [
      'Pessoas desaparecidas reaparecem como números em registros de clínicas, transportadoras e alojamentos clandestinos.',
      'Algumas foram vistas pela última vez perto de casas noturnas. Outras passaram por hospitais, delegacias ou abrigos.',
      'Nem todos os casos precisam ter a mesma causa.',
      'O que importa são as repetições documentais.',
    ],
  },
  {
    id: 'drugs',
    choiceId: 'investigate_drug_network',
    action: 'Comparar apreensões, medicamentos e distribuidores',
    file: 'CARGA_DESVIADA.txt',
    flag: 'foundDrugNetworkLead',
    icon: '📄',
    content: [
      'Apreensões registradas são maiores que as quantidades efetivamente entregues.',
      'Medicamentos hospitalares e drogas ilegais atravessam empresas de segurança, distribuidores e casas noturnas.',
      'Os intermediários mudam. Alguns médicos e policiais voltam a aparecer.',
      'ANOTAÇÃO DE LÍVIA: Não seguir o produto. Seguir quem consegue fazer o produto desaparecer do sistema.',
    ],
  },
  {
    id: 'influence',
    choiceId: 'investigate_influence_network',
    action: 'Montar a rede de influência',
    file: 'A_REDE.txt',
    flag: 'foundInfluenceNetworkLead',
    icon: '🗂️',
    content: [
      'Empresários, diretores hospitalares, advogados, delegados, assessores e intermediários aparecem ligados por contratos, encontros, serviços e doações.',
      'Isso não significa que todos saibam da mesma coisa.',
      'Uma rede em que cada pessoa protege outra por um motivo diferente é mais difícil de destruir que uma organização centralizada.',
    ],
  },
  {
    id: 'films',
    choiceId: 'investigate_macabre_films',
    action: 'Recuperar referências da pasta FILMES',
    file: 'FILMES.txt',
    flag: 'foundMacabreFilmsLead',
    icon: '🎞️',
    content: [
      'Fóruns antigos mencionam vídeos sem créditos que aparecem e desaparecem.',
      'Lívia comparou cenários, roupas, ferimentos, datas e pessoas desaparecidas.',
      'Uma postagem dizia reconhecer um prédio abandonado de São Paulo.',
      'ANOTAÇÃO DE LÍVIA: NINGUÉM ATUA ASSIM.',
      'NÃO É EFEITO. ENCONTRAR O ORIGINAL.',
    ],
  },
  {
    id: 'hatter',
    choiceId: 'investigate_david_hatter',
    action: 'Pesquisar David Hatter nos arquivos',
    file: 'DAVID_HATTER.txt',
    flag: 'foundDavidHatterLead',
    icon: '📜',
    content: [
      'David Hatter é humano, gerente de hotel e aspirante a roteirista.',
      'Não há confirmação de que esteja ligado à produção dos filmes.',
      'O problema é o que ele sabe sobre sociedades vampíricas, criadores, crias e a criatura interior.',
      'ANOTAÇÃO DE LÍVIA: Ele sabe demais. Quem contou?',
    ],
  },
  {
    id: 'hunters',
    choiceId: 'investigate_hunters',
    action: 'Comparar fotografias dos observadores',
    file: 'OBSERVADORES.txt',
    flag: 'foundHunterSurveillanceLead',
    icon: '📷',
    content: [
      'Pessoas repetidas aparecem perto de clubes, bares e outros pontos frequentados por vampiros.',
      'Algumas parecem policiais à paisana. Outras não.',
      'A mesma pessoa foi identificada em pelo menos três estabelecimentos diferentes.',
      'ANOTAÇÃO DE LÍVIA: Eles não estão procurando pessoas desaparecidas. Estão procurando a gente.',
    ],
  },
]


const LIVIA_LOCAL_FILES = [
  { file: 'agenda_pessoal.txt', icon: '📝', content: ['Agenda local de Lívia.', 'Compromissos pessoais e lembretes salvos apenas neste computador.'] },
  { file: 'contas.txt', icon: '📄', content: ['Contas, lembretes e pequenas despesas domésticas.', 'Este arquivo pertence ao HD de Lívia, não ao celular.'] },
]

const PLAYER_MAIL = [
  { from: 'Sistema', subject: 'Bem-vindo ao Webmail', preview: 'Sua conta está disponível neste navegador.', body: ['Esta é a conta online do protagonista.', 'Anexos não viram arquivos locais até você clicar em Baixar.'] },
]

const LIVIA_MAIL = [
  { from: 'Lívia Vesper', subject: 'rascunho não enviado', preview: 'Se eu estiver certa sobre os hospitais...', body: ['RASCUNHO', '', 'Se eu estiver certa sobre os hospitais, não é uma operação isolada.', 'Preciso cruzar os nomes antes de falar com alguém da Corte.'] },
  { from: 'contato@arquivo.local', subject: 'RE: transferências', preview: 'Os horários que você pediu estão no anexo.', body: ['Lívia,', 'os horários se repetem depois da meia-noite. Não consegui confirmar quem autoriza as transferências.', 'Não me procure no trabalho.'] },
]

const SOCIAL_POSTS = [
  { who: 'Clara', handle: '@clarafotos', text: 'mais uma noite atrás das lentes.', meta: 'Fotografia de show · publicação pública' },
  { who: 'Último Gole', handle: '@ultimogole', text: 'Programação da semana atualizada.', meta: 'Evento público · São Paulo' },
]

const TERMINAL_TOOLS = [
  { id: 'camera', label: 'CROW', desc: 'Câmeras conhecidas pela investigação', command: 'crow --list-known-nodes' },
  { id: 'people', label: 'GHOST', desc: 'Cruzar pessoas já conhecidas', command: 'ghost --index known_people' },
  { id: 'images', label: 'MIRROR', desc: 'Analisar imagens salvas neste PC', command: 'mirror --scan C:\\LIVIA\\Downloads' },
  { id: 'records', label: 'BLOODHOUND', desc: 'Cruzar arquivos investigativos', command: 'bloodhound --correlate local_archive' },
]



function terminalStat(game, key) {
  const roots = [game?.character, game?.characterSheet, game?.sheet, game?.player, game?.protagonist].filter(Boolean)
  const groups = ['attributes', 'abilities', 'skills', 'talents', 'knowledges', 'knowledge', 'mental', 'mentals']
  for (const root of roots) {
    const direct = Number(root?.[key])
    if (Number.isFinite(direct)) return direct
    for (const group of groups) {
      const value = Number(root?.[group]?.[key])
      if (Number.isFinite(value)) return value
    }
  }
  return 0
}

function terminalPool(game) {
  const intelligence = terminalStat(game, 'intelligence')
  const computer = terminalStat(game, 'computer')
  return { intelligence, computer, pool: Math.max(1, intelligence + computer) }
}

function terminalOutcome(tool, roll, context) {
  const s = roll.successes
  if (roll.result === 'botch') return ['[ERRO] falha critica', '[!] a consulta deixou rastros no sistema', '[!] interrompendo ferramenta']
  if (s <= 0) return ['[-] nenhum resultado util', '[i] os dados disponiveis nao foram suficientes']

  if (tool.id === 'camera') {
    if (!context.hospitalKnown) return [`[+] ${s} sucesso(s)`, '[i] nenhum alvo de vigilancia conhecido ainda']
    if (s === 1) return ['[+] HOSPITAL_VICTOR localizado no indice', '[i] somente dados externos']
    if (s === 2) return ['[+] cameras externas catalogadas', '[+] horarios noturnos recorrentes']
    if (s === 3) return ['[+] rotas de entrada e saida correlacionadas', '[+] janela de atividade apos meia-noite']
    return ['[+] padrao de vigilancia reconstruido', '[+] material suficiente para investigacao presencial']
  }

  if (tool.id === 'people') {
    if (!context.relationshipCount) return ['[-] nenhum perfil conhecido para cruzar']
    if (s === 1) return [`[+] ${context.relationshipCount} perfil(is) conhecido(s) indexado(s)`]
    if (s === 2) return [`[+] ${context.relationshipCount} perfil(is) indexado(s)`, '[+] referencias publicas correlacionadas']
    return [`[+] ${context.relationshipCount} perfil(is) indexado(s)`, '[+] conexoes recorrentes encontradas']
  }

  if (tool.id === 'images') {
    if (!context.downloadCount) return ['[-] Downloads vazio', '[i] baixe imagens ou documentos primeiro']
    if (s === 1) return [`[+] ${context.downloadCount} arquivo(s) reconhecido(s)`]
    if (s === 2) return [`[+] ${context.downloadCount} arquivo(s) reconhecido(s)`, '[+] metadados locais indexados']
    return [`[+] ${context.downloadCount} arquivo(s) analisado(s)`, '[+] padroes visuais e metadados cruzados']
  }

  if (tool.id === 'records') {
    if (!context.unlockedCount) return ['[-] nenhum arquivo investigativo liberado']
    if (s === 1) return [`[+] ${context.unlockedCount} arquivo(s) indexado(s)`]
    if (s === 2) return [`[+] ${context.unlockedCount} arquivo(s) indexado(s)`, '[+] datas e nomes repetidos encontrados']
    return [`[+] ${context.unlockedCount} arquivo(s) correlacionado(s)`, '[+] padroes entre investigacoes destacados']
  }

  return [`[+] ${s} sucesso(s)`]
}

function DesktopIcon({ icon, label, subtitle, onClick, disabled, badge }) {
  return (
    <button type="button" className="livia-desktop-icon" onClick={onClick} disabled={disabled} title={subtitle || label}>
      <span className="livia-desktop-icon-art" aria-hidden="true">{icon}</span>
      <span className="livia-desktop-icon-label">{label}</span>
      {badge && <span className="livia-desktop-icon-badge">{badge}</span>}
    </button>
  )
}

function FileViewer({ file }) {
  return (
    <article className="livia-notepad">
      <div className="livia-notepad-menu">Arquivo&nbsp;&nbsp; Editar&nbsp;&nbsp; Exibir</div>
      <div className="livia-notepad-paper">
        <h2>{file.file}</h2>
        {file.content.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      </div>
    </article>
  )
}

export default function LiviaFiles({
  game,
  scene,
  onChoice,
  onComputerAction,
  onExplore,
  blocked,
}) {
  const [windowId, setWindowId] = useState(null)
  const [openFile, setOpenFile] = useState(null)
  const [browserPage, setBrowserPage] = useState('home')
  const [mailAccount, setMailAccount] = useState('player')
  const [terminalLines, setTerminalLines] = useState(['ORPHEUS SHELL 3.7', 'Sessão local: LIVIA', 'Selecione uma ferramenta.'])
  const pcDownloads = game?.digital?.devices?.liviaPc?.downloads ?? []


  const flags = game?.flags ?? {}
  const choices = scene?.choices ?? []
  const research = getHavenInvestigations(game).find(q => q.id === 'strange_hospitals')
  const hospitalChoice = choices.find(c => c.id === 'investigate_hospital_files')
  const knownConnection = Boolean(
    flags.discoveredHospitalConnection ||
    flags.liviaHospitalConnection ||
    game?.quests?.livia_legacy?.objectives?.discover_hospital_connection?.completed
  )

  const unlockedFiles = INVESTIGATIONS.filter(item => Boolean(flags[item.flag]))
  const pendingActions = INVESTIGATIONS.filter(item => !flags[item.flag])
  const world = game?.world ?? {}
  const hour = String(world.hour ?? 0).padStart(2, '0')
  const minute = String(world.minute ?? 0).padStart(2, '0')
  const day = world.day ?? 1


  function downloadToComputer(file) {
    if(!onChange) return
    const current=game?.digital?.devices?.liviaPc?.downloads??[]
    if(current.some(item=>item.file===file.file)) return
    onChange({...game,digital:{...(game?.digital??{}),devices:{...(game?.digital?.devices??{}),liviaPc:{...(game?.digital?.devices?.liviaPc??{}),downloads:[...current,file]}}}})
  }

  function runTerminal(tool) {
    const stats = terminalPool(game)
    const difficulty = 7
    const roll = rollDicePool({ pool: stats.pool, difficulty })
    const context = {
      hospitalKnown: Boolean(flags.hospitalVictorDiscovered || flags.hospitalVictorIdentified),
      relationshipCount: Object.keys(game?.relationships ?? {}).length,
      downloadCount: pcDownloads.length,
      unlockedCount: unlockedFiles.length,
    }

    setTerminalLines(current => [
      ...current.slice(-12),
      '',
      `LIVIA@ORPHEUS ${hour}:${minute}> ${tool.command}`,
      '',
      'TESTE: Inteligencia + Computador',
      `Inteligencia ${stats.intelligence} + Computador ${stats.computer}`,
      `Parada: ${stats.pool} dado(s) | Dificuldade: ${difficulty}`,
      `DADOS: ${roll.dice.join('  ')}`,
      roll.result === 'botch' ? 'RESULTADO: FALHA CRITICA' : roll.successes > 0 ? `RESULTADO: ${roll.successes} SUCESSO(S)` : 'RESULTADO: FALHA',
      ...terminalOutcome(tool, roll, context),
    ])

    if (roll.result === 'botch' && onChange) {
      onChange({ ...game, flags: { ...(game?.flags ?? {}), digitalTrace: true } })
    }
  }

  function closeWindow() {
    setOpenFile(null)
    setWindowId(null)
  }

  function runAction(item) {
    const choice = choices.find(c => c.id === item.choiceId)
    if (!choice) return
    if (onComputerAction) {
      onComputerAction(choice, item.flag)
      setWindowId('files')
      return
    }
    onChoice?.(choice)
  }

  function runHospitalAction() {
    if (!hospitalChoice) return
    if (onComputerAction) {
      onComputerAction(hospitalChoice, 'discoveredHospitalConnection')
      setWindowId('hospital')
      return
    }
    onChoice?.(hospitalChoice)
  }

  return (
    <section className="livia-computer" aria-label="Computador de Lívia">
      <div className="livia-monitor">
        <div className="livia-screen">
          <div className="livia-wallpaper" aria-hidden="true">
            <div className="livia-wallpaper-glow" />
            <div className="livia-wallpaper-mark">L</div>
          </div>

          <div className="livia-desktop">
            <div className="livia-desktop-icons">
              <DesktopIcon icon="🔎" label="Investigações" onClick={() => { setOpenFile(null); setWindowId('actions') }} disabled={blocked} badge={pendingActions.length || null} />
              <DesktopIcon icon="📁" label="Arquivos" onClick={() => { setOpenFile(null); setWindowId('files') }} disabled={blocked} badge={unlockedFiles.length || null} />
              <DesktopIcon icon="🏥" label="Hospitais" onClick={() => { setOpenFile(null); setWindowId('hospital') }} disabled={blocked} badge={knownConnection ? '✓' : '!'} />
              <DesktopIcon icon="📝" label="LEIA-ME" onClick={() => { setOpenFile(null); setWindowId('notes') }} disabled={blocked} />
              <DesktopIcon icon="🗑️" label="Lixeira" onClick={() => { setOpenFile(null); setWindowId('trash') }} disabled={blocked} />
              <DesktopIcon icon="🌐" label="Navegador" onClick={() => { setOpenFile(null); setBrowserPage('home'); setWindowId('browser') }} disabled={blocked} />
              <DesktopIcon icon="✉️" label="E-mail" onClick={() => { setOpenFile(null); setWindowId('mail') }} disabled={blocked} />
              <DesktopIcon icon=">_" label="Terminal" onClick={() => { setOpenFile(null); setWindowId('terminal') }} disabled={blocked} />
              <DesktopIcon icon="⬇️" label="Downloads" onClick={() => { setOpenFile(null); setWindowId('downloads') }} disabled={blocked} badge={pcDownloads.length || null} />
              <DesktopIcon icon="📄" label="Documentos" onClick={() => { setOpenFile(null); setWindowId('documents') }} disabled={blocked} />

            </div>

            {windowId && (
              <div className="livia-window" role="dialog" aria-modal="false">
                <header className="livia-window-titlebar">
                  <div className="livia-window-title">
                    <span>{windowId === 'actions' ? '🔎' : windowId === 'files' ? '📁' : windowId === 'hospital' ? '🏥' : windowId === 'browser' ? '🌐' : windowId === 'mail' ? '✉️' : windowId === 'terminal' ? '>_' : windowId === 'downloads' ? '⬇️' : windowId === 'documents' ? '📄' : '▣'}</span>
                    <span>{windowId === 'actions' ? 'Investigações' : windowId === 'files' ? 'Arquivos liberados' : windowId === 'hospital' ? 'Hospitais e desaparecimentos' : windowId === 'notes' ? 'LEIA-ME.txt' : windowId === 'browser' ? 'Navegador' : windowId === 'mail' ? 'Webmail' : windowId === 'terminal' ? 'Terminal ORPHEUS' : windowId === 'downloads' ? 'Downloads' : windowId === 'documents' ? 'Documentos locais' : 'Lixeira'}</span>
                  </div>
                  <button type="button" className="livia-window-close" onClick={closeWindow}>×</button>
                </header>

                <div className="livia-window-toolbar">
                  <button type="button" onClick={() => openFile ? setOpenFile(null) : closeWindow()}>← {openFile ? 'Arquivos' : 'Área de trabalho'}</button>
                  <span>C:\LIVIA\{windowId === 'actions' ? 'INVESTIGACOES' : windowId === 'files' ? 'ARQUIVOS' : windowId.toUpperCase()}\</span>
                </div>

                <div className="livia-window-content">
                  {openFile && <FileViewer file={openFile} />}

                  {!openFile && windowId === 'actions' && (
                    <div className="livia-folder-view">
                      <div className="livia-folder-heading"><span>Ação</span><span>Status</span></div>
                      {INVESTIGATIONS.map(item => {
                        const done = Boolean(flags[item.flag])
                        const choice = choices.find(c => c.id === item.choiceId)
                        if (!choice) return null
                        return (
                          <button type="button" className={`livia-file-row livia-action-row ${done ? 'is-complete' : ''}`} key={item.id} disabled={blocked || done} onClick={() => runAction(item)}>
                            <span className="livia-file-row-icon">{done ? '✓' : '⌕'}</span>
                            <span className="livia-file-row-copy">
                              <strong>{item.action}</strong>
                              <small>{done ? `${item.file} foi liberado em Arquivos.` : `${choice.timeMinutes ?? '?'} min · analisar dados`}</small>
                            </span>
                            <span className={done ? 'is-read' : 'is-unread'}>{done ? 'Concluído' : 'Investigar'}<small>{done ? 'Arquivo liberado' : 'Executar →'}</small></span>
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {!openFile && windowId === 'files' && (
                    <div className="livia-folder-view">
                      <div className="livia-folder-heading"><span>Nome</span><span>Status</span></div>
                      {unlockedFiles.length === 0 ? (
                        <div className="livia-empty-folder"><span>📁</span><h2>Nenhum arquivo liberado</h2><p>Use Investigações para analisar os dados encontrados.</p></div>
                      ) : unlockedFiles.map(item => (
                        <button type="button" className="livia-file-row" key={item.id} onClick={() => setOpenFile(item)}>
                          <span className="livia-file-row-icon">{item.icon}</span>
                          <span className="livia-file-row-copy"><strong>{item.file}</strong><small>Resultado salvo pela investigação.</small></span>
                          <span className="is-read">Disponível<small>Abrir</small></span>
                        </button>
                      ))}
                    </div>
                  )}

                  {!openFile && windowId === 'hospital' && (
                    <article className="livia-computer-investigation">
                      <span className="livia-computer-kicker">INVESTIGAÇÃO PRINCIPAL</span>
                      <h2>Hospitais e desaparecimentos</h2>
                      {!knownConnection ? (
                        <>
                          <p>Cruze prontuários, transferências e desaparecimentos sem sair do computador.</p>
                          <div className="livia-computer-actions">
                            {hospitalChoice && <button className="is-primary" disabled={blocked} onClick={runHospitalAction}>Cruzar registros hospitalares · {hospitalChoice.timeMinutes} min →</button>}
                          </div>
                        </>
                      ) : (
                        <>
                          <p>{research?.summary ?? 'O cruzamento revelou uma ligação recorrente entre desaparecimentos e registros hospitalares.'}</p>
                          <div className="livia-terminal-note">
                            <b>ARQUIVO LIBERADO: HOSPITAIS.txt</b>
                            <p>Pacientes oficialmente mortos aparecem novamente em registros posteriores.</p>
                            <p>Bolsas de sangue desaparecem. Cadáveres são transferidos sem documentação completa.</p>
                            <p>“NÃO É TRÁFICO COMUM.”</p>
                            <p>“ELES SABEM O QUE SOMOS.”</p>
                          </div>
                          {research?.next?.sceneId && <div className="livia-computer-actions"><button className="is-primary" disabled={blocked} onClick={() => onExplore(research.next.sceneId)}>Continuar investigação fora do computador →</button></div>}
                        </>
                      )}
                    </article>
                  )}

                  {!openFile && windowId === 'notes' && (
                    <article className="livia-notepad">
                      <div className="livia-notepad-menu">Arquivo&nbsp;&nbsp; Editar&nbsp;&nbsp; Exibir</div>
                      <div className="livia-notepad-paper">
                        <p>Se você chegou até esta pasta procurando uma resposta única, vai se decepcionar.</p>
                        <p>Eu não tenho uma. Tenho padrões.</p>
                        <p>FATO = documento, fotografia, registro ou repetição verificável.</p>
                        <p>HIPÓTESE = explicação possível.</p>
                        <p>PERGUNTA = coisa que ainda preciso descobrir.</p>
                        <p>— L.V.</p>
                      </div>
                    </article>
                  )}


                  {!openFile && windowId === 'browser' && (
                    <div className="livia-browser">
                      <div className="livia-browser-bar">🌐 início.orpheus.local</div>
                      {browserPage === 'home' && <>
                        <h2>Navegador</h2>
                        <p>Serviços online não são arquivos deste computador.</p>
                        <div className="livia-web-grid">
                          <button onClick={() => setBrowserPage('social')}>🌐 <b>Vitta</b><small>Rede social</small></button>
                          <button onClick={() => setWindowId('mail')}>✉️ <b>Webmail</b><small>Contas online</small></button>
                          <button onClick={() => setBrowserPage('search')}>🔎 <b>Pesquisa</b><small>Internet e notícias</small></button>
                        </div>
                      </>}
                      {browserPage === 'social' && <>
                        <button className="livia-back-link" onClick={() => setBrowserPage('home')}>← início</button>
                        <h2>Vitta</h2>
                        <p className="livia-online-note">Conta online. O feed pode ser visto no PC e no celular, mas não pertence ao HD.</p>
                        {SOCIAL_POSTS.map((post, i) => <article className="livia-social-post" key={i}><b>{post.who}</b> <small>{post.handle}</small><p>{post.text}</p><small>{post.meta}</small></article>)}
                      </>}

                      {browserPage === 'search' && <>
                        <button className="livia-back-link" onClick={() => setBrowserPage('home')}>← início</button>
                        <h2>Pesquisa</h2>
                        <input className="livia-search-input" placeholder="Pesquisar na web..." />
                        <div className="livia-placeholder-card">A busca narrativa poderá usar NPCs, locais e pistas já descobertos.</div>
                      </>}
                    </div>
                  )}

                  {!openFile && windowId === 'mail' && (
                    <div className="livia-mail">
                      <div className="livia-mail-tabs">
                        <button className={mailAccount === 'player' ? 'active' : ''} onClick={() => setMailAccount('player')}>Minha conta</button>
                        <button className={mailAccount === 'livia' ? 'active' : ''} onClick={() => setMailAccount('livia')}>Conta de Lívia</button>
                      </div>
                      <p className="livia-online-note">Webmail é online. Anexos só entram no HD quando forem baixados.</p>
                      {(mailAccount === 'player' ? PLAYER_MAIL : LIVIA_MAIL).map((mail, i) => (
                        <button className="livia-mail-row" key={i} onClick={() => setOpenFile({ file: mail.subject + '.mail', icon: '✉️', content: [`De: ${mail.from}`, `Assunto: ${mail.subject}`, '', ...mail.body] })}>
                          <b>{mail.from}</b><span>{mail.subject}</span><small>{mail.preview}</small>
                        </button>
                      ))}
                      {mailAccount === 'player' && <div className="livia-mail-attachment-demo"><span>ANEXO DE TESTE: foto_recebida.jpg</span><button onClick={() => downloadToComputer({ file: 'foto_recebida.jpg', icon: '🖼️', content: ['Imagem recebida por e-mail.', 'Agora ela está salva localmente no computador de Lívia.'] })}>Baixar para este PC</button></div>}
                    </div>
                  )}

                  {!openFile && windowId === 'terminal' && (
                    <div className="livia-terminal">
                      <div className="livia-terminal-output">{terminalLines.map((line, i) => <div key={i}>{line || ' '}</div>)}</div>
                      <div className="livia-terminal-tools">{TERMINAL_TOOLS.map(tool => <button key={tool.id} onClick={() => runTerminal(tool)} disabled={blocked}><b>{tool.label}</b><span>{tool.desc}</span><code>{tool.command}</code></button>)}</div>
                      <p className="livia-terminal-warning">Ferramentas deixadas por Lívia. Testes usam Inteligência + Computador da ficha.</p>
                    </div>
                  )}

                  {!openFile && windowId === 'downloads' && (
                    <div className="livia-folder-view">
                      <div className="livia-folder-heading"><span>Nome</span><span>Origem</span></div>
                      {pcDownloads.length === 0 ? <div className="livia-empty-folder"><span>⬇️</span><h2>Downloads vazio</h2><p>Arquivos online só aparecem aqui depois de baixados.</p></div> : pcDownloads.map((file, i) => <button className="livia-file-row" key={i} onClick={() => setOpenFile(file)}><span className="livia-file-row-icon">{file.icon ?? '📄'}</span><span className="livia-file-row-copy"><strong>{file.file}</strong><small>Arquivo local deste computador</small></span><span className="is-read">Local<small>C:\LIVIA\Downloads</small></span></button>)}
                    </div>
                  )}

                  {!openFile && windowId === 'documents' && (
                    <div className="livia-folder-view">
                      <div className="livia-folder-heading"><span>Nome</span><span>Dispositivo</span></div>
                      {LIVIA_LOCAL_FILES.map((file, i) => <button className="livia-file-row" key={i} onClick={() => setOpenFile(file)}><span className="livia-file-row-icon">{file.icon}</span><span className="livia-file-row-copy"><strong>{file.file}</strong><small>Existe somente no computador de Lívia</small></span><span className="is-read">PC Lívia<small>arquivo local</small></span></button>)}
                    </div>
                  )}

                  {!openFile && windowId === 'trash' && <div className="livia-empty-folder"><span>🗑️</span><h2>Lixeira</h2><p>Alguns arquivos foram removidos.</p></div>}
                </div>
              </div>
            )}

            <div className="livia-taskbar">
              <button type="button" className="livia-start"><span>◆</span> iniciar</button>
              <div className="livia-taskbar-current">{windowId && <button type="button">{windowId === 'actions' ? '🔎 Investigações' : windowId === 'files' ? '📁 Arquivos' : '▣ LIVIA OS'}</button>}</div>
              <div className="livia-tray"><span>◖))</span><span>⌁</span><time>{hour}:{minute}</time></div>
            </div>
          </div>
        </div>
        <div className="livia-monitor-bottom">
          <span className="livia-monitor-brand">ORPHEUS</span>
          <span className="livia-monitor-led" />
          <span className="livia-monitor-day">NOITE {day}</span>
        </div>
      </div>

      <div className="livia-computer-controls">
        <span>Computador de Lívia · sessão desbloqueada</span>
        <button type="button" disabled={blocked} onClick={() => onExplore('free_roam')}>Levantar e voltar ao refúgio · 1 min</button>
      </div>
    </section>
  )
}
