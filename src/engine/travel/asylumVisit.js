import scenes from '../../data/scenes/index.js'
import { getLocation } from '../../data/world/locations'
import { advanceGameTime } from '../time/timeEngine'

export function rememberAsylumConversation(game) {
  const id = game.story?.scene
  if (game.world?.location?.id !== 'asylum' || ['asylum_lobby', 'free_roam'].includes(id) || scenes[id]?.location?.id !== 'asylum') return game
  return { ...game, flags: { ...game.flags, asylumResumeScene: id } }
}

export function getAsylumConversation(game) {
  const f = game.flags ?? {}
  const resume = f.asylumResumeScene
  if (resume && !['asylum_lobby', 'free_roam'].includes(resume) && scenes[resume]?.location?.id === 'asylum') return resume
  if (f.jeanetteAgreedToMeet && !f.voermanReconciliationResolved && !f.voermanConflictResolved && !f.bertramFeudResolved) return 'therese_reconciliation_return'
  if (f.oceanSpiritObjectRecovered && !f.oceanHouseReturned && !f.oceanObjectGivenToTherese && !f.oceanObjectDestroyed && !f.bertramFeudResolved) return 'voerman_ocean_return'
  if (f.gallerySabotageResolved && !f.gallerySabotageReported && !f.voermanConflictResolved && !f.bertramFeudResolved) return 'therese_gallery_confrontation'
  if (f.voermanConflictResolved || f.bertramFeudResolved || f.voermanReconciliationResolved) return null
  return f.metJanette ? 'janette_identity' : 'asylum_entrance'
}

export function leaveAsylum(game) {
  if (game.world?.location?.id !== 'asylum') return game
  const remembered = rememberAsylumConversation(game)
  const timed = advanceGameTime(remembered, 5, { reason: 'Sair do Asylum para as ruas da Consolação' })
  return { ...timed, story: { ...timed.story, previousScene: game.story?.scene, scene: 'free_roam' }, world: { ...timed.world, location: { ...getLocation('consolacao') } } }
}

export function getAsylumScene(game, original) {
  if (game?.world?.location?.id !== 'asylum') return original
  const lobby = ['free_roam', 'asylum_lobby'].includes(original?.id)
  if (!lobby && original?.location?.id !== 'asylum') return original
  const base = lobby ? scenes.asylum_lobby : original
  const choices = [{ id: 'asylum_leave_streets', text: 'Sair para as ruas.', timeMinutes: 5, asylumAction: 'leave' }]
  if (lobby) {
    const target = getAsylumConversation(game)
    if (target) {
      const speaker = scenes[target]?.dialogue?.speaker ?? ''
      const name = speaker.includes('Therese') || target.startsWith('therese_') ? 'Therese' : 'Jeanette'
      choices.push({ id: 'asylum_talk', text: `Conversar com ${name}.`, asylumAction: 'talk' })
    }
  } else choices.push(...(base.choices ?? []))
  return { ...base, choices }
}
