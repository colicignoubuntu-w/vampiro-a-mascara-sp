function pad(value) {
  return String(value).padStart(2, '0')
}

export default function GameHUD({
  game,
}) {
  const world = game?.world ?? {}
  const location =
    world.location ?? {}
  const blood =
    game?.blood ?? {}
  const humanity =
    game?.humanity ?? {}
  const willpower =
    game?.willpower ?? {}

  return (
    <header className="game-hud">
      <div className="hud-item">
        <span className="hud-label">LOCAL</span>
        <strong>
          {location.name ?? 'São Paulo'}
          <small>{location.district ?? ''}</small>
        </strong>
      </div>

      <div className="hud-item">
        <span className="hud-label">HORÁRIO</span>
        <strong>
          {pad(world.hour)}:{pad(world.minute)}
        </strong>
      </div>

      <div className="hud-item">
        <span className="hud-label">AMANHECER</span>
        <strong>
          {pad(world.sunriseHour)}:{pad(world.sunriseMinute)}
        </strong>
      </div>

      <div className="hud-item">
        <span className="hud-label">SANGUE</span>
        <strong>
          {blood.current ?? 0}/{blood.maximum ?? 0}
        </strong>
      </div>

      <div className="hud-item">
        <span className="hud-label">HUMANIDADE</span>
        <strong>{humanity.current ?? 0}</strong>
      </div>

      <div className="hud-item">
        <span className="hud-label">VONTADE</span>
        <strong>{willpower.current ?? 0}</strong>
      </div>
    </header>
  )
}
