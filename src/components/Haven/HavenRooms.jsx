import { useEffect, useState, useSyncExternalStore } from 'react'
import FlexibleWork from '../NightLife/FlexibleWork'
import { JOBS } from '../../data/activities/jobs'
import { performWorkAction } from '../../engine/work/workEngine'
import { Howl } from 'howler'
import { audioEngine } from '../../engine/audio/audioEngine'
import { transferFridgeItem } from '../../engine/haven/storageEngine'
import { getWeapon, armor, getAmmunition } from '../../data/items'

const itemName = item => item.name ?? getWeapon(item.id)?.name ?? armor[item.id]?.name ?? getAmmunition(item.id)?.name ?? item.id

export default function HavenRooms({ game, onGameChange, onExplore, onBath, onRest, onLeave, blocked }) {
  const [room, setRoom] = useState('bedroom')
  const [computerOpen, setComputerOpen] = useState(false)
  const [workError, setWorkError] = useState('')
  const [fridgeOpen, setFridgeOpen] = useState(false)
  const [radioOn, setRadioOn] = useState(false)
  const [feedback, setFeedback] = useState('')
  const audio = useSyncExternalStore(audioEngine.subscribe, audioEngine.getSnapshot)
  useEffect(() => {
    if (!radioOn) return
    const sound = new Howl({
      src: ["/audio/music/40 - Radio ~ {Die My Darling - Needle's Eye}.mp3"],
      html5: true, loop: true, volume: audio.music, mute: audio.muted,
      onloaderror: () => { setRadioOn(false); setFeedback('Não foi possível sintonizar o rádio.') },
      onplayerror: () => { setRadioOn(false); setFeedback('Clique no rádio para tentar sintonizar novamente.') },
    })
    sound.play()
    return () => sound.unload()
  }, [radioOn, audio.music, audio.muted])

  function navigate(next) {
    setRoom(next)
    setComputerOpen(false)
    setFridgeOpen(false)
    setFeedback('')
  }
  function transfer(item, direction) {
    if (blocked) return
    const updated = transferFridgeItem(game, item.id, direction)
    if (updated === game) return
    onGameChange(updated)
    setFeedback(`${itemName(item)}: uma unidade ${direction === 'store' ? 'guardada na geladeira' : 'retirada para o inventário'}.`)
  }
  function hotspot(label, x, y, action, pressed) {
    return <button className="haven-hotspot" style={{ left: `${x}%`, top: `${y}%` }} disabled={blocked} onClick={action} aria-pressed={pressed}>{label}</button>
  }
  const fridge = game.haven?.fridge ?? []
  const available = (game.inventory ?? []).filter(item => (item.quantity ?? 1) > 0 && !Object.values(game.equipment ?? {}).includes(item.id))
  return <section className="haven-interactive" aria-label="Cômodos do refúgio">
    <nav className="haven-room-nav" aria-label="Escolher cômodo">
      {[['bedroom', 'Quarto'], ['kitchen', 'Cozinha'], ['bathroom', 'Banheiro']].map(([id, label]) => <button key={id} disabled={blocked} aria-current={room === id ? 'location' : undefined} onClick={() => navigate(id)}>{label}</button>)}
      <button disabled={blocked} onClick={onLeave}>Sair para a cidade →</button>
    </nav>
    <div className="haven-room-image">
      <img src={room === 'bedroom' ? '/images/haven/quarto.webp' : '/images/haven/cozinha-banheiro.jpeg'} alt={room === 'bedroom' ? 'Quarto do refúgio com cama e escrivaninha com computador.' : 'Cozinha do refúgio com geladeira, rádio e porta do banheiro à esquerda.'} />
      {room === 'bedroom' ? <>
        {hotspot('Descansar', 26, 60, onRest)}
        {hotspot('Computador', 65, 46, () => setComputerOpen(!computerOpen), computerOpen)}
        {hotspot('Cadernos de Lívia', 64, 60, () => onExplore('livia_bedroom'))}
        {hotspot('Ir à cozinha →', 80, 87, () => navigate('kitchen'))}
      </> : <>
        {hotspot('← Quarto', 12, 86, () => navigate('bedroom'))}
        {hotspot(room === 'bathroom' ? 'Banheiro aberto' : 'Entrar no banheiro', 26, 28, () => navigate('bathroom'))}
        {hotspot(fridgeOpen ? 'Fechar geladeira' : 'Abrir geladeira', 47, 57, () => setFridgeOpen(!fridgeOpen), fridgeOpen)}
        {hotspot(radioOn ? 'Desligar rádio ♫' : 'Ligar rádio', 82, 50, () => setRadioOn(!radioOn), radioOn)}
      </>}
    </div>
    <p className="haven-room-caption">Clique nos pontos da imagem para interagir. {radioOn ? '♫ Rádio ligado · música do acervo do jogo.' : ''}</p>
    {computerOpen && <section className="haven-panel" aria-label="Computador do refúgio">
      <div className="haven-section-heading"><h2>Computador de casa</h2><button className="haven-text-action" onClick={() => setComputerOpen(false)}>Fechar computador</button></div>
      <button className="haven-secondary" disabled={blocked} onClick={() => onExplore('livia_computer')}>Consultar arquivos de Lívia</button>
      <h3>Trabalhar pelo computador</h3>
      {JOBS.filter(job => job.flexible && job.location === 'livia_apartment').map(job => <FlexibleWork key={job.id} game={game} job={job} blocked={blocked} onWork={action => {
        if (blocked) return
        try {
          const updated = performWorkAction(game, action)
          onGameChange(updated)
          setFeedback(updated.livelihood.lastResult)
          setWorkError('')
        } catch (error) { setWorkError(error.message) }
      }} />)}
      {workError && <p role="alert">{workError}</p>}
    </section>}
    {room === 'bathroom' && <section className="haven-panel"><h2>Banheiro</h2><p>O chuveiro está pronto. Um banho e uma troca de roupa removem o sangue visível.</p><button className="haven-primary" disabled={blocked} onClick={onBath}>Tomar banho e trocar de roupa · 20 min</button></section>}
    {fridgeOpen && <section className="haven-panel" aria-label="Geladeira aberta"><div className="haven-section-heading"><h2>Geladeira aberta</h2><button className="haven-text-action" onClick={() => setFridgeOpen(false)}>Fechar</button></div><p>Guarde itens, como bolsas de sangue, para retirar depois. Cada clique transfere uma unidade.</p>
      <div className="haven-storage-grid">{[[fridge, 'Na geladeira', 'take', 'Retirar'], [available, 'No inventário', 'store', 'Guardar']].map(([items, title, direction, label]) => <div key={direction}><h3>{title}</h3>{items.length ? items.map(item => <button className="haven-secondary" key={item.id} disabled={blocked} onClick={() => transfer(item, direction)}><span>{itemName(item)} × {item.quantity ?? 1}</span><span>{label}</span></button>) : <p>{direction === 'take' ? 'A geladeira está vazia.' : 'Nenhum item disponível para guardar. Itens equipados ficam com você.'}</p>}</div>)}</div>
    </section>}
    <p className="haven-feedback" role="status">{feedback}</p>
  </section>
}
