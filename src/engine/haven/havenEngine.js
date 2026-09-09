import { getQuestDefinition } from '../../data/quests/quests'

const objectiveDone = (game, quest, id) => Boolean(game.quests?.[quest]?.objectives?.[id]?.completed)
export function isLiviaComputerUnlocked(game) {
  return Boolean(game.flags?.unlockedLiviaComputer || game.flags?.hackedLiviaComputer || game.flags?.enteredLiviaPassword || game.flags?.inspectedLiviaComputer || game.quests?.livia_legacy?.status === 'completed')
}
export function getHospitalResearchScene(game) {
  if (game.flags?.hospitalDisappearancePatternFound) return 'strange_hospitals_identified'
  if (game.flags?.hospitalDisappearancesInvestigated) return 'strange_hospitals_pattern'
  return 'strange_hospitals_records'
}
export function getHavenInvestigations(game) {
  const flags = game.flags ?? {}
  const legacy = game.quests?.livia_legacy
  const hospitals = game.quests?.strange_hospitals
  const searched = legacy?.status === 'completed' || Boolean(flags.searchedLiviaApartment || objectiveDone(game, 'livia_legacy', 'search_livia_apartment'))
  const diary = legacy?.status === 'completed' || Boolean(flags.foundLiviaDiary || flags.liviaDiaryFound || objectiveDone(game, 'livia_legacy', 'find_livia_diary'))
  const unlocked = isLiviaComputerUnlocked(game)
  const connection = legacy?.status === 'completed' || Boolean(flags.discoveredHospitalConnection || flags.liviaHospitalConnection || objectiveDone(game, 'livia_legacy', 'discover_hospital_connection'))
  const identified = hospitals?.status === 'completed' || Boolean(flags.hospitalVictorDiscovered || flags.hospitalVictorIdentified || flags.hospitalVictorUnlocked || objectiveDone(game, 'strange_hospitals', 'identify_hospital'))
  const learned = hospitals?.status === 'completed' || Boolean(flags.hospitalDisappearancesInvestigated || flags.hospitalDisappearancePatternFound || objectiveDone(game, 'strange_hospitals', 'learn_about_disappearances'))
  const legacySteps = [
    { id: 'search', text: 'Vasculhar a sala', done: searched },
    { id: 'diary', text: 'Encontrar os diários no quarto', done: diary },
    { id: 'computer', text: 'Acessar os arquivos do computador', done: unlocked },
    ...(unlocked || connection ? [{ id: 'connection', text: 'Cruzar os registros hospitalares', done: connection }] : []),
  ]
  const legacyNext = !searched
    ? { label: 'Vasculhar a sala', sceneId: 'livia_apartment_search', minutes: 10, detail: 'Comece pelos papéis e fotografias que Lívia deixou na sala.' }
    : !diary
      ? { label: 'Procurar os diários', sceneId: 'livia_bedroom', minutes: 10, detail: 'Procure os cadernos entre os pertences do quarto.' }
      : !unlocked
        ? { label: 'Examinar o computador', sceneId: 'livia_computer', minutes: 1, detail: 'Acesse o computador para continuar a investigação.' }
        : !connection
          ? { label: 'Cruzar registros hospitalares', sceneId: 'livia_hospital_clue', minutes: 15, detail: 'Compare os nomes e as datas nos arquivos hospitalares.' }
          : null
  const hospitalNext = identified
    ? { label: 'Abrir mapa da cidade', map: true, detail: objectiveDone(game, 'strange_hospitals', 'investigate_hospital') ? 'Volte ao Hospital Victor, na Vila Mariana, e acompanhe a movimentação da ambulância.' : 'O próximo passo está no Hospital Victor, na Vila Mariana. Viaje até lá para investigar.' }
    : { label: learned ? 'Continuar análise dos registros' : 'Investigar os desaparecimentos', sceneId: getHospitalResearchScene(game), minutes: 1, detail: 'Cruze os prontuários para identificar o destino das pessoas desaparecidas.' }
  const cards = []
  if (legacy?.status === 'active' || legacy?.status === 'completed' || flags.visitedLiviaApartment || flags.liviaApartmentUnlocked) {
    const completed = legacy?.status === 'completed'
    cards.push({ id: 'livia_legacy', title: getQuestDefinition('livia_legacy').title, completed, steps: legacySteps, next: completed ? null : legacyNext, summary: completed ? 'As pistas de Lívia revelaram uma ligação com os hospitais. Seus arquivos continuam disponíveis para consulta.' : 'Reconstrua a investigação que Lívia deixou para trás.' })
  }
  if (hospitals?.status === 'active' || hospitals?.status === 'completed' || connection || identified) {
    const completed = hospitals?.status === 'completed'
    cards.push({ id: 'strange_hospitals', title: getQuestDefinition('strange_hospitals').title, completed, next: completed ? null : hospitalNext, summary: completed ? 'A investigação no hospital foi concluída. Consulte o diário para rever as descobertas.' : identified ? 'Você já encontrou o hospital. A investigação agora continua fora do apartamento.' : 'Os registros apontam para desaparecimentos. Falta identificar o hospital.', steps: [
      { id: 'records', text: 'Comparar os registros de desaparecimentos', done: learned },
      { id: 'identify', text: identified ? 'Identificar o Hospital Victor' : 'Identificar o hospital', done: identified },
      { id: 'visit', text: 'Investigar o hospital durante a noite', done: completed || objectiveDone(game, 'strange_hospitals', 'investigate_hospital') },
      ...(game.quests?.strange_hospitals?.objectives?.discover_ambulance?.revealed ? [{ id: 'ambulance', text: 'Descobrir a origem da ambulância', done: objectiveDone(game, 'strange_hospitals', 'discover_ambulance') }] : []),
    ] })
  }
  return cards
}

// Central destinations keep the refuge buttons and their time costs consistent.
export const HAVEN_DESTINATIONS = {
  livia_apartment_inside: 1,
  livia_apartment_search: 10,
  livia_bedroom: 10,
  livia_diary: 15,
  livia_computer: 1,
  livia_computer_unlocked: 1,
  livia_hospital_clue: 15,
  strange_hospitals_records: 1,
  strange_hospitals_pattern: 1,
  strange_hospitals_identified: 1,
  free_roam: 1,
}
export function getHavenDestination(game, sceneId) {
  if (!(sceneId in HAVEN_DESTINATIONS)) return null
  if (sceneId === 'livia_computer' && isLiviaComputerUnlocked(game)) sceneId = 'livia_computer_unlocked'
  if (['livia_computer_unlocked', 'livia_hospital_clue'].includes(sceneId) && !isLiviaComputerUnlocked(game)) return null
  if (sceneId.startsWith('strange_hospitals_')) {
    const investigation = getHavenInvestigations(game).find(q => q.id === 'strange_hospitals')
    if (!investigation?.next?.sceneId) return null
    sceneId = getHospitalResearchScene(game)
  }
  return { sceneId, minutes: HAVEN_DESTINATIONS[sceneId] }
}
