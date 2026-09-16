import { getHavenInvestigations } from '../../engine/haven/havenEngine'
import './LiviaFiles.css'

const FILE_GROUPS = [
  { title: 'Registros e operações', files: [
    ['investigate_organ_traffic', 'Órgãos', 'Planilhas de clínicas, cirurgias e destinos de órgãos.', 'foundOrganTrafficLead'],
    ['investigate_blood_traffic', 'Bolsas de sangue', 'Estoques, transferências e veículos noturnos.', 'foundBloodTrafficLead'],
    ['investigate_missing_people', 'Pessoas desaparecidas', 'Nomes e registros de pessoas que sumiram.', 'foundMissingPeopleLead'],
    ['investigate_drug_network', 'Drogas e desvios', 'Relatórios de apreensões e medicamentos desviados.', 'foundDrugNetworkLead'],
  ] },
  { title: 'Pessoas e outras pistas', files: [
    ['investigate_influence_network', 'Rede de influência', 'Contatos e relações anotadas por Lívia.', 'foundInfluenceNetworkLead'],
    ['investigate_macabre_films', 'Filmes', 'Fóruns, gravações e imagens suspeitas.', 'foundMacabreFilmsLead'],
    ['investigate_david_hatter', 'David Hatter', 'Um roteiro sobre a sociedade vampírica.', 'foundDavidHatterLead'],
    ['investigate_hunters', 'Caçadores', 'Fotografias e sinais de vigilância.', 'foundHunterSurveillanceLead'],
  ] },
]

export default function LiviaFiles({ game, scene, onChoice, onExplore, blocked }) {
  const hospitalChoice = scene.choices.find(c => c.id === 'investigate_hospital_files')
  const research = getHavenInvestigations(game).find(q => q.id === 'strange_hospitals')
  const knownConnection = Boolean(game.flags?.discoveredHospitalConnection || game.flags?.liviaHospitalConnection || game.quests?.livia_legacy?.objectives?.discover_hospital_connection?.completed)
  return <section className="livia-files" aria-labelledby="livia-files-title">
    <header className="livia-files-header">
      <div><span className="haven-eyebrow">Apartamento de Lívia / Computador</span><h1 id="livia-files-title">Arquivos de Lívia</h1><p>Documentos recuperados da pasta protegida. Escolha uma investigação ou consulte os arquivos por assunto.</p></div>
      <button disabled={blocked} onClick={() => onExplore('free_roam')}>Voltar ao refúgio · 1 min</button>
    </header>
    <article className="livia-files-main">
      <span className="haven-eyebrow">Investigação principal</span><h2>Hospitais e desaparecimentos</h2>
      <p>{knownConnection ? research?.summary ?? 'A ligação com os hospitais foi registrada no diário de missões.' : 'Compare nomes e datas dos registros hospitalares para continuar a investigação de Lívia.'}</p>
      {!knownConnection && <button className="is-primary" disabled={blocked} onClick={() => onChoice(hospitalChoice)}>Cruzar registros hospitalares · {hospitalChoice.timeMinutes} min →</button>}
      {knownConnection && research?.next?.sceneId && <button className="is-primary" disabled={blocked} onClick={() => onExplore(research.next.sceneId)}>Continuar análise dos desaparecimentos · 1 min →</button>}
      {knownConnection && research?.next?.map && <p className="livia-files-next">{research.next.detail} Volte ao refúgio para abrir o mapa.</p>}
      {knownConnection && <button disabled={blocked} onClick={() => onChoice(hospitalChoice)}>Reler a ligação com os hospitais · {hospitalChoice.timeMinutes} min</button>}
    </article>
    <div className="livia-files-section"><h2>Arquivos complementares</h2><p>Anotações e pistas organizadas por assunto. Consulte o diário para acompanhar as missões em andamento. Pastas já lidas permanecem disponíveis.</p></div>
    {FILE_GROUPS.map(group => <section className="livia-files-group" key={group.title} aria-label={group.title}>
      <h3>{group.title}</h3>
      <div className="livia-files-grid">{group.files.map(([id, title, description, flag]) => {
        const choice = scene.choices.find(c => c.id === id)
        if (!choice) return null
        const read = Boolean(game.flags?.[flag])
        return <button className="livia-file" key={id} disabled={blocked} onClick={() => onChoice(choice)}>
          <span className={read ? 'livia-file-read' : 'livia-file-new'}>{read ? '✓ Consultado' : 'Não consultado'}</span>
          <strong>{title}</strong><span>{description}</span><small>{read ? 'Reler' : 'Consultar'} · {choice.timeMinutes} min →</small>
        </button>
      })}</div>
    </section>)}
    <details className="livia-files-notes"><summary>Ler a descrição completa dos arquivos encontrados</summary>{scene.narration.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</details>
  </section>
}
