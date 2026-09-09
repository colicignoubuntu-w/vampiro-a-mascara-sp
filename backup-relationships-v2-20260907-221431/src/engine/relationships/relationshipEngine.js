import { rollDicePool } from '../dice/rollTest'
import { RELATIONSHIP_NPCS } from '../../data/npcs/relationships/index.js'
import { advanceGameTime, crossesSunrise, isDaytime } from '../time/timeEngine'
import { addDamage } from '../combat/damageEngine'
import { reconcileRelationships, relationshipMinutes } from './relationshipClock'

export function relationshipState(game, npcId) {
  const npc = RELATIONSHIP_NPCS[npcId]
  if (!npc) return null
  return game.relationships?.[npcId] ?? { node: npc.start, readyAt: 0, metrics: { trust: 0, affinity: 0, respect: 0, bond: 0 }, flags: {}, journal: [], completed: false }
}
const skill = (game, id) => game.abilities?.[id] ?? Object.values(game.attributes ?? {}).find(group => group?.[id] !== undefined)?.[id] ?? 0

export function relationshipChoiceReason(game, npcId, choice) {
  const state = relationshipState(game, npcId)
  const r = choice.requires ?? {}
  if (r.flag && !state.flags[r.flag]) return 'Esta opção depende de uma descoberta anterior.'
  if (r.notFlag && state.flags[r.notFlag]) return 'Esta opção não corresponde ao caminho escolhido.'
  if (r.skill && skill(game, r.skill) < r.min) return `Requer ${r.skill === 'brawl' ? 'Briga' : r.skill === 'streetwise' ? 'Manha' : r.skill} ${r.min}.`
  const target = r.npc ? relationshipState(game, r.npc) : state
  if (r.metric && (target?.metrics?.[r.metric] ?? 0) < r.min) return r.npc ? `É preciso construir mais confiança com ${RELATIONSHIP_NPCS[r.npc].name}.` : 'A relação ainda não permite essa aproximação.'
  if ((game.blood?.current ?? 0) <= (choice.bloodCost ?? 0) && choice.bloodCost) return 'Você precisa conservar pelo menos um ponto de sangue para continuar consciente.'
  return null
}

export function relationshipAvailability(game, npcId) {
  const state = relationshipState(game, npcId)
  const scene = RELATIONSHIP_NPCS[npcId]?.scenes[state?.node]
  if (!scene || state.completed) return 'História concluída.'
  if (game.flags?.inTorpor || game.vampireState?.torpor || game.health?.currentLevel >= 7) return 'Você não está em condições de conversar.'
  if (game.flags?.humanityCheckRequired || game.livelihood?.active || game.livelihood?.crime || game.livelihood?.workEvent) return 'Resolva a atividade em andamento primeiro.'
  if (isDaytime(game.world)) return 'Os encontros acontecem à noite.'
  if (relationshipMinutes(game.world) < state.readyAt) return 'O próximo encontro ainda não está disponível.'
  if (!scene.locations.includes(game.world?.location?.id)) return `Próximo encontro: ${scene.place}.`
  return null
}

export function performRelationshipChoice(input, npcId, nodeId, choiceId, roll = rollDicePool) {
  const game = reconcileRelationships(input)
  const npc = RELATIONSHIP_NPCS[npcId]
  const state = relationshipState(game, npcId)
  if (!npc || state.completed || state.node !== nodeId) throw new Error('Este encontro já mudou. Consulte o diário atualizado.')
  const scene = npc.scenes[nodeId]
  let choice = scene.choices.find(entry => entry.id === choiceId)
  if (!choice) throw new Error('Escolha desconhecida.')
  const reason = relationshipAvailability(game, npcId) || relationshipChoiceReason(game, npcId, choice)
  if (reason) throw new Error(reason)
  const minutes = choice.minutes ?? 15
  if (crossesSunrise({ world: game.world, minutes })) throw new Error('A conversa alcançaria o amanhecer. Volte na próxima noite.')
  const now = relationshipMinutes(game.world)
  if (state.deadlineAt && now + minutes >= state.deadlineAt) throw new Error('Não há tempo para concluir essa ação antes da ameaça. Escolha uma alternativa mais rápida.')
  let testResult = null
  if (choice.test) {
    testResult = roll({ pool: game.virtues?.[choice.test.trait] ?? skill(game, choice.test.trait), difficulty: choice.test.difficulty })
    const outcome = choice.test[testResult.result]
    if (!outcome) throw new Error('Resultado de teste desconhecido.')
    choice = { ...choice, ...outcome, metrics: { ...choice.metrics, ...outcome.metrics }, flags: { ...choice.flags, ...outcome.flags } }
  }
  const metrics = { trust: 0, affinity: 0, respect: 0, bond: 0, ...state.metrics }
  for (const [key, amount] of Object.entries(choice.metrics ?? {})) metrics[key] = Math.max(key === 'bond' ? 0 : -10, Math.min(key === 'bond' ? 3 : 10, (metrics[key] ?? 0) + amount))
  const entry = { id: `${npcId}:${nodeId}`, npcId, nodeId, choiceId, at: now + minutes, title: scene.title, test: testResult, text: choice.result ?? choice.ending ?? choice.text }
  const nextState = {
    ...state, metrics, flags: { ...state.flags, ...choice.flags },
    node: choice.next ?? nodeId, completed: !choice.next,
    ending: choice.ending ?? null,
    readyAt: now + minutes + (choice.delayDays ?? 0) * 1440,
    deadlineAt: choice.clearDeadline ? null : choice.deadlineDays ? now + minutes + choice.deadlineDays * 1440 : state.deadlineAt ?? null,
    journal: [...state.journal, entry],
  }
  let updated = { ...game, relationships: { ...game.relationships, [npcId]: nextState }, history: [...(game.history ?? []), { ...entry, type: 'relationship-choice' }] }
  if (choice.bloodCost) updated = { ...updated, blood: { ...game.blood, current: game.blood.current - choice.bloodCost } }
  if (choice.damage) updated = { ...updated, health: addDamage({ health: game.health, amount: choice.damage, damageType: 'lethal' }) }
  return reconcileRelationships(advanceGameTime(updated, minutes, { reason: `Encontro com ${npc.name}: ${scene.title}` }))
}
