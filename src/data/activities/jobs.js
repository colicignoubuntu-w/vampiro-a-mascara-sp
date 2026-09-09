// Weekdays follow the calendar: 0 = Sunday, day 1 = 11 October 2026.
export const JOBS = [
  { id: 'diner', flexible: true, minimumMinutes: 360, name: 'Atendente de lanchonete', employer: 'Lanchonete do Centro', location: 'centro', place: 'Centro', rate: 10, requirements: { dexterity: 1 } },
  { id: 'barista', flexible: true, minimumMinutes: 360, name: 'Barista', employer: 'Café de Pinheiros', location: 'pinheiros', place: 'Pinheiros', rate: 30, requirements: { etiquette: 3, dexterity: 2 } },
  { id: 'security', name: 'Segurança de bar', employer: 'Asylum', location: 'asylum', place: 'Asylum', start: 22, end: 28, rate: 30, requirements: { strength: 3, brawl: 2 } },
  { id: 'armed', name: 'Segurança armado', employer: 'Vesuvius', location: 'vesuvius', place: 'Vesuvius', start: 22, end: 28, rate: 45, requirements: { strength: 2, firearms: 2 }, firearm: true },
  { id: 'support', flexible: true, name: 'Suporte remoto', employer: 'Plantão Digital', location: 'livia_apartment', place: 'Apartamento de Lívia · computador disponível', rate: 10, requirements: { computer: 2 } },
  { id: 'developer', flexible: true, name: 'Desenvolvedor remoto', employer: 'Código Noturno', location: 'livia_apartment', place: 'Apartamento de Lívia · computador disponível', rate: 60, requirements: { computer: 4 } },
  { id: 'teacher', name: 'Professor de curso noturno', employer: 'Curso Livre da Liberdade', location: 'liberdade', place: 'Liberdade', start: 19, end: 22, rate: 60, requirements: { academics: 3, expression: 2 }, weekdays: [2, 4], preparation: 60 },
  { id: 'professor', name: 'Professor universitário', employer: 'Faculdade de Pinheiros', location: 'pinheiros', place: 'Pinheiros', start: 19, end: 22, rate: 100, requirements: { academics: 4, expression: 2 }, weekdays: [1, 3], preparation: 60, credentials: true },
  { id: 'freelance', flexible: true, name: 'Projeto de programação', employer: 'Cliente remoto', location: 'livia_apartment', place: 'Apartamento de Lívia · computador disponível', rate: 60, requirements: { computer: 3 } },
]
export const SKILL_LABELS = { dexterity: 'Destreza', strength: 'Força', etiquette: 'Etiqueta', brawl: 'Briga', firearms: 'Armas de Fogo', computer: 'Computação', academics: 'Acadêmicos', expression: 'Expressão', stealth: 'Furtividade', streetwise: 'Manha', intimidation: 'Intimidação' }
export const CRIMES = [
  { id: 'theft', name: 'Furto', ability: 'stealth', attribute: 'dexterity', group: 'physical', minutes: 30, reward: 45, severity: 1, violation: 'theft', level: 7 },
  { id: 'robbery', name: 'Assalto', ability: 'intimidation', attribute: 'strength', group: 'physical', minutes: 45, reward: 120, severity: 3, violation: 'intentionalHarm', level: 5 },
  { id: 'drugs', name: 'Serviço para uma rede de tráfico', ability: 'streetwise', attribute: 'manipulation', group: 'social', minutes: 60, reward: 100, severity: 2, violation: 'seriousNegligence', level: 6 },
]
