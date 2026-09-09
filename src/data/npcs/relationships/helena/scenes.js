export default {
  "id": "helena",
  "name": "Helena Vasconcelos",
  "age": 30,
  "role": "Restauradora · museu de artes na Bela Vista",
  "portrait": "/images/npcs/helena/portrait.jpg",
  "cast": "Raul, curador; Lúcia, arquivista; Mara e Sueli, pesquisadoras; um patrocinador interessado em ocultar a procedência.",
  "start": "arrival",
  "scenes": {
    "arrival": {
      "title": "A mulher diante da ausência",
      "place": "Visita noturna ao museu · Bela Vista",
      "locations": [
        "bela_vista"
      ],
      "text": [
        "Helena, de vestido vinho, observa o espaço vazio entre duas obras. O texto da parede celebra um doador, mas não explica por que uma peça foi retirada.",
        "“Você veio ver o que está exposto ou o que esconderam?” Ela sorri ao perceber o tom e se apresenta como restauradora da mostra noturna."
      ],
      "choices": [
        {
          "id": "art",
          "text": "Perguntar sobre a obra ausente.",
          "next": "archive",
          "delayDays": 2,
          "metrics": {
            "trust": 1,
            "affinity": 1
          }
        },
        {
          "id": "work",
          "text": "Ouvir como ela chegou à restauração.",
          "next": "archive",
          "delayDays": 2,
          "metrics": {
            "trust": 1,
            "respect": 1
          }
        },
        {
          "id": "flirt",
          "text": "Elogiar a presença dela e pedir para acompanhá-la na visita.",
          "next": "archive",
          "delayDays": 2,
          "metrics": {
            "affinity": 2
          }
        }
      ],
      "venueId": "art_museum"
    },
    "archive": {
      "title": "A ficha de empréstimo",
      "place": "Arquivo do museu · Bela Vista",
      "locations": [
        "bela_vista"
      ],
      "text": [
        "Lúcia encontrou duas versões da ficha da peça retirada. Uma identifica a coleção de origem; a outra apaga o nome. Raul teme perder o patrocínio se a divergência virar denúncia.",
        "Helena pede discrição com a fonte, não silêncio sobre os fatos. Há símbolos na borda da fotografia que lembram um diagrama ritual."
      ],
      "choices": [
        {
          "id": "copy",
          "text": "Comparar as versões e preservar a identidade de Lúcia.",
          "next": "pressure",
          "delayDays": 2,
          "metrics": {
            "trust": 2,
            "respect": 1
          },
          "flags": {
            "evidence": true
          }
        },
        {
          "id": "mara",
          "text": "Consultar Mara sobre o diagrama sem revelar a fonte.",
          "next": "pressure",
          "delayDays": 1,
          "requires": {
            "npc": "mara",
            "metric": "trust",
            "min": 2
          },
          "metrics": {
            "trust": 2
          },
          "flags": {
            "evidence": true
          }
        },
        {
          "id": "publish",
          "text": "Divulgar a suspeita citando Lúcia antes de conferir.",
          "next": "pressure",
          "delayDays": 1,
          "metrics": {
            "trust": -3,
            "respect": -2
          },
          "flags": {
            "exposed": true
          }
        }
      ],
      "venueId": "art_museum"
    },
    "pressure": {
      "title": "O jantar que não é um encontro",
      "place": "Museu · Bela Vista",
      "locations": [
        "bela_vista"
      ],
      "text": [
        "Raul oferece a Helena um contrato mais longo se ela assinar o laudo sem a ressalva de procedência. Ela precisa do trabalho; recusar tem custo real.",
        "Ela convida você para conversar depois, deixando claro que não quer ser comprada nem resgatada. Quer pensar com alguém que não tenha um contrato sobre a mesa."
      ],
      "choices": [
        {
          "id": "document",
          "text": "Ajudar a documentar a pressão e buscar revisão independente.",
          "next": "private",
          "delayDays": 3,
          "metrics": {
            "trust": 2,
            "respect": 2
          },
          "flags": {
            "review": true
          }
        },
        {
          "id": "support",
          "text": "Ouvir os riscos e apoiar a decisão de não assinar ainda.",
          "next": "private",
          "delayDays": 3,
          "metrics": {
            "trust": 1,
            "respect": 1
          }
        },
        {
          "id": "decide",
          "text": "Falar com Raul e aceitar a oferta em nome dela.",
          "next": "rupture",
          "delayDays": 1,
          "metrics": {
            "trust": -4,
            "respect": -3
          }
        }
      ],
      "venueId": "art_museum"
    },
    "private": {
      "title": "O que não se restaura",
      "place": "Café · Centro",
      "locations": [
        "centro"
      ],
      "text": [
        "Helena conta que já perdeu um emprego por contestar um laudo. A experiência a deixou cautelosa, não indiferente. “Não consigo reconstruir uma carreira toda vez que alguém resolve testar meus princípios.”",
        "Ela pergunta por que você aparece sempre à noite e nunca fala de onde veio. A conversa pode ganhar intimidade, mas confiança exige aceitar perguntas."
      ],
      "choices": [
        {
          "id": "honest",
          "text": "Admitir que há partes da sua vida que ainda não pode explicar.",
          "next": "review",
          "delayDays": 4,
          "metrics": {
            "trust": 1,
            "respect": 1,
            "affinity": 1
          }
        },
        {
          "id": "date",
          "text": "Convidá-la para outro encontro, fora da investigação.",
          "next": "review",
          "delayDays": 4,
          "requires": {
            "metric": "trust",
            "min": 3
          },
          "metrics": {
            "affinity": 2
          }
        },
        {
          "id": "friend",
          "text": "Manter o vínculo como amizade e colaboração.",
          "next": "review",
          "delayDays": 4,
          "flags": {
            "friendship": true
          },
          "metrics": {
            "trust": 2
          }
        }
      ],
      "venueId": "central_cafe"
    },
    "review": {
      "title": "Uma parede com contexto",
      "place": "Museu · Bela Vista",
      "locations": [
        "bela_vista"
      ],
      "text": [
        "A peça volta ao acervo com uma nota sobre a procedência ainda contestada. Lúcia mantém cópias do processo e Helena se recusa a chamar uma revisão parcial de vitória completa.",
        "Um endereço nos documentos liga a coleção aos transportes investigados por Mara. O museu não explica o ritual, mas revela quem lucrou com o silêncio."
      ],
      "choices": [
        {
          "id": "share",
          "text": "Compartilhar as cópias autorizadas com Sueli e Mara.",
          "next": "future",
          "delayDays": 3,
          "requires": {
            "flag": "evidence"
          },
          "metrics": {
            "trust": 2
          },
          "flags": {
            "network": true
          }
        },
        {
          "id": "protect",
          "text": "Guardar os registros e respeitar o sigilo das fontes.",
          "next": "future",
          "delayDays": 3,
          "metrics": {
            "respect": 2
          }
        }
      ],
      "venueId": "art_museum"
    },
    "future": {
      "title": "Depois que as portas fecham",
      "place": "Museu · Bela Vista",
      "locations": [
        "bela_vista"
      ],
      "text": [
        "Helena termina uma visita comentada e encontra você no saguão. O vestido vinho agora lembra a primeira conversa, antes de vocês conhecerem os riscos um do outro.",
        "Ela quer continuar encontrando você, mas pergunta que lugar haverá para a vida dela nessa proximidade."
      ],
      "choices": [
        {
          "id": "romance",
          "text": "Propor uma aproximação sem exigir que abandone a carreira.",
          "next": null,
          "requires": {
            "metric": "trust",
            "min": 4,
            "notFlag": "friendship"
          },
          "ending": "Helena aceita construir uma relação aos poucos, mantendo a carreira e a independência.",
          "metrics": {
            "affinity": 2
          }
        },
        {
          "id": "friends",
          "text": "Continuar como amigos e parceiros de pesquisa.",
          "next": null,
          "ending": "Helena permanece uma aliada no museu e no estudo da procedência das peças.",
          "flags": {
            "ally": true
          }
        }
      ],
      "venueId": "art_museum"
    },
    "rupture": {
      "title": "Você não tinha autorização",
      "place": "Museu · Bela Vista",
      "locations": [
        "bela_vista"
      ],
      "text": [
        "Helena encontrou a proposta que você negociou em seu nome. Retira a assinatura, chama Raul e encerra a conversa na sua presença.",
        "“Eu preciso de pessoas em quem confiar. Não de alguém que use a minha vida para parecer importante.”"
      ],
      "choices": [
        {
          "id": "leave",
          "text": "Reconhecer o limite e ir embora.",
          "next": null,
          "ending": "Helena encerra a relação pessoal. O museu continua aberto, mas ela não será seu contato."
        }
      ],
      "venueId": "art_museum"
    }
  }
}
