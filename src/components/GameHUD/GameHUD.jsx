import { useGameStore } from '../../store/gameStore'

function pad(value) {
  return String(value).padStart(2, '0')
}

export default function GameHUD() {
  const world = useGameStore((state) => state.world)
  const character = useGameStore((state) => state.character)

  return (
    <header className="game-hud">
      <div className="hud-item">
        <span className="hud-label">LOCAL</span>
        <strong>
          {world.location.name}
          <small>{world.location.district}</small>
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
          {character.blood}/{character.maxBlood}
        </strong>
      </div>

      <div className="hud-item">
        <span className="hud-label">HUMANIDADE</span>
        <strong>{character.humanity}</strong>
      </div>

      <div className="hud-item">
        <span className="hud-label">VONTADE</span>
        <strong>{character.willpower}</strong>
      </div>
    </header>
  )
}