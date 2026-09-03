const shelterProfiles = {
  centro: {
    secure: 'um quarto sem janelas em um hotel antigo, pago em dinheiro, com a porta bloqueada por um móvel',
    adequate: 'um quarto de hotel barato; você cobre as frestas das cortinas e prende um aviso de não perturbe na porta',
    precarious: 'o depósito abandonado de uma loja fechada, entre caixas, poeira e uma porta que talvez alguém abra',
    desperate: 'um trecho seco de uma galeria de águas pluviais, oculto sob o ruído das avenidas do Centro',
  },
  estacao_da_luz: {
    secure: 'um quarto interno de uma pensão do Bom Retiro, longe das janelas e do movimento da estação',
    adequate: 'o porão trancado de um pequeno hotel nas imediações da Luz',
    precarious: 'uma sala de manutenção esquecida sob o fluxo dos trilhos',
    desperate: 'um vão imundo da drenagem ferroviária, onde cada composição faz o concreto estremecer',
  },
  paulista: {
    secure: 'um quarto interno de hotel, pago antes do amanhecer, com cortinas pesadas e nenhuma janela voltada para a Paulista',
    adequate: 'uma garagem subterrânea vigiada, dentro de um carro escurecido e coberto por uma lona',
    precarious: 'um depósito de serviço nos fundos de um edifício comercial',
    desperate: 'um nicho técnico sob a avenida, apertado entre tubulações e cabos',
  },
  liberdade: {
    secure: 'um quarto interno de um hotel discreto, acima de um comércio da Liberdade',
    adequate: 'o depósito sem janelas de um restaurante, cedido por dinheiro e sem perguntas',
    precarious: 'um porão úmido atrás de uma loja fechada',
    desperate: 'uma passagem de manutenção abaixo das ruas do Glicério',
  },
  bela_vista: {
    secure: 'um quarto interno de um hotel discreto perto da Augusta, pago em dinheiro e isolado das janelas',
    adequate: 'um quarto de motel barato, com toalhas e cobertores vedando cada fresta',
    precarious: 'os bastidores abandonados de um teatro fechado',
    desperate: 'um porão invadido de um casarão condenado, onde passos ecoam no andar de cima',
  },
  vila_madalena: {
    secure: 'um estúdio alugado por uma diária, com venezianas reforçadas e acesso interno',
    adequate: 'o depósito sem janelas de um bar depois do fechamento',
    precarious: 'uma garagem antiga no fim de uma ladeira residencial',
    desperate: 'uma obra paralisada, sob plástico preto e placas de compensado',
  },
  cantareira: {
    secure: 'o subsolo de uma casa vazia, protegido pela encosta e pela mata',
    adequate: 'uma garagem fechada de um imóvel desocupado',
    precarious: 'um abrigo de ferramentas esquecido junto à mata',
    desperate: 'um tubo de drenagem sob a estrada da serra, entre barro, insetos e água fria',
  },
  morumbi: {
    secure: 'uma suíte interna de hotel, protegida por cortinas grossas e serviço que não fará perguntas',
    adequate: 'uma garagem subterrânea, dentro de um veículo coberto e longe das rampas de entrada',
    precarious: 'um cômodo de serviço vazio numa construção cercada por muros',
    desperate: 'uma tubulação de drenagem na encosta, escondida da avenida mas não da chuva',
  },
  default: {
    secure: 'um quarto interno de hotel ou pensão, pago em dinheiro e cuidadosamente vedado antes do nascer do Sol',
    adequate: 'uma garagem ou depósito sem janelas, discreto o bastante para atravessar o dia',
    precarious: 'um imóvel abandonado, com portas improvisadas e frestas cobertas às pressas',
    desperate: 'um cano de drenagem ou galeria de esgoto, onde ninguém procuraria por uma pessoa viva',
  },
}

function getShelterTier(successes) {
  const total = Math.max(0, Number(successes) || 0)

  if (total >= 4) return 'secure'
  if (total >= 2) return 'adequate'
  if (total === 1) return 'precarious'
  return 'desperate'
}

export function describeDayShelter(locationId, successes = 0) {
  const profile = shelterProfiles[locationId] ?? shelterProfiles.default
  const tier = getShelterTier(successes)
  const shelter = profile[tier] ?? shelterProfiles.default[tier]

  const endings = {
    secure: 'Ninguém tem motivo para entrar. Quando o peso do dia o transforma numa imitação perfeita de cadáver, você está tão seguro quanto poderia estar longe de um refúgio próprio.',
    adequate: 'O esconderijo não é confortável, mas deve permanecer fechado. Você confere cada fresta antes de sucumbir à imobilidade cadavérica do dia.',
    precarious: 'A proteção parece suficiente, não segura. Durante o dia você será incapaz de reagir se um funcionário, vizinho ou policial resolver abrir a porta.',
    desperate: 'É uma escolha extrema. A luz não o alcança diretamente, mas água, invasores ou uma abertura inesperada podem transformar o sono diurno em uma sentença de morte.',
  }

  return `Antes de perder a consciência, você se esconde em ${shelter}. ${endings[tier]}`
}
