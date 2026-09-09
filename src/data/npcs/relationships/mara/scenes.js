export default {
  "id": "mara",
  "name": "Mara Nogueira",
  "age": 28,
  "role": "Pesquisadora independente de ocultismo · beco da Liberdade",
  "portrait": "/images/npcs/mara/portrait.png",
  "cast": "Sueli, livreira; Caio, colega desaparecido; Helena, restauradora; uma sociedade de colecionadores.",
  "start": "arrival",
  "scenes": {
    "arrival": {
      "title": "O nome que faltava",
      "place": "Beco · Liberdade",
      "locations": [
        "liberdade"
      ],
      "text": [
        "Mara está ajoelhada diante de um círculo de sal e páginas presas por pedras. A vela se apaga quando você entra no beco. Ela olha para o relógio: “Você demorou.”",
        "Ela esperava uma resposta para o desaparecimento de Caio. No papel, uma silhueta sem rosto atravessa uma porta. Sua chegada coincide com a última frase do ritual; o trânsito encobre qualquer outro som."
      ],
      "choices": [
        {
          "id": "honest",
          "text": "Dizer que apenas passava por ali.",
          "next": "book",
          "delayDays": 1,
          "metrics": {
            "trust": 2,
            "respect": 1
          },
          "flags": {
            "honest": true
          }
        },
        {
          "id": "listen",
          "text": "Perguntar quem ela esperava invocar.",
          "next": "book",
          "delayDays": 1,
          "metrics": {
            "affinity": 1,
            "trust": 1
          }
        },
        {
          "id": "pretend",
          "text": "Afirmar que veio atender ao chamado.",
          "next": "book",
          "delayDays": 1,
          "metrics": {
            "affinity": 2,
            "respect": -2
          },
          "flags": {
            "deceived": true
          }
        }
      ],
      "venueId": "ritual_alley"
    },
    "book": {
      "title": "O caderno não é um oráculo",
      "place": "Livraria de Sueli · Liberdade",
      "locations": [
        "liberdade"
      ],
      "text": [
        "Sueli deixa vocês consultarem o caderno num balcão longe da porta. Mara passou semanas copiando símbolos; alguns vêm de um catálogo de exposição, não de um grimório.",
        "Há recibos de transporte nos mesmos horários em que Caio desaparecia. Mara admite que queria tanto um sinal que talvez tenha preparado a resposta antes de fazer a pergunta."
      ],
      "choices": [
        {
          "id": "records",
          "text": "Comparar datas e recibos sem ridicularizar o ritual.",
          "next": "museum",
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
          "id": "helena",
          "text": "Pedir ajuda a Helena para identificar o catálogo.",
          "next": "museum",
          "delayDays": 1,
          "requires": {
            "npc": "helena",
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
          "id": "faith",
          "text": "Incentivar Mara a repetir o ritual para obter uma resposta.",
          "next": "ritual",
          "delayDays": 1,
          "metrics": {
            "affinity": 1,
            "respect": -1
          }
        }
      ],
      "venueId": "sueli_books"
    },
    "museum": {
      "title": "Uma assinatura raspada",
      "place": "Museu de artes · Bela Vista",
      "locations": [
        "bela_vista"
      ],
      "text": [
        "No catálogo, a assinatura foi removida de propósito. A ficha de empréstimo aponta para uma coleção privada que contratava Caio para transportar peças à noite.",
        "Mara encontra uma fotografia do beco tirada anos antes. A posição do fotógrafo coincide com o ponto em que você apareceu. Isso pode explicar a encenação — ou mostrar que alguém já esperava aquela chegada."
      ],
      "choices": [
        {
          "id": "copy",
          "text": "Copiar a procedência e devolver o documento.",
          "next": "ritual",
          "delayDays": 1,
          "metrics": {
            "trust": 2
          },
          "flags": {
            "evidence": true
          }
        },
        {
          "id": "steal",
          "text": "Esconder uma página para impedir que a retirem do arquivo.",
          "next": "ritual",
          "delayDays": 1,
          "metrics": {
            "respect": -2
          },
          "flags": {
            "stolen": true
          }
        }
      ],
      "venueId": "art_museum"
    },
    "ritual": {
      "title": "Uma porta não é uma obrigação",
      "place": "Beco · Liberdade",
      "locations": [
        "liberdade"
      ],
      "text": [
        "Mara quer repetir a invocação, agora com você dentro do círculo. Um corte no papel reproduz sua sombra, embora a iluminação tenha mudado. Sueli insiste que isso não prova quem está do outro lado.",
        "“Se eu estiver errada, você vai me dizer?” Mara pergunta. Pela primeira vez, parece querer uma pessoa capaz de discordar dela."
      ],
      "choices": [
        {
          "id": "boundary",
          "text": "Recusar o papel de enviado e propor procurar Caio pelos registros.",
          "next": "caio",
          "delayDays": 2,
          "metrics": {
            "trust": 2,
            "respect": 2
          },
          "flags": {
            "boundary": true
          }
        },
        {
          "id": "confess",
          "text": "Confessar que fingiu ser o enviado.",
          "next": "caio",
          "delayDays": 3,
          "requires": {
            "flag": "deceived"
          },
          "metrics": {
            "trust": -2,
            "respect": 2
          },
          "flags": {
            "confessed": true
          }
        },
        {
          "id": "command",
          "text": "Usar a crença dela para exigir obediência.",
          "next": "rupture",
          "delayDays": 1,
          "metrics": {
            "trust": -3,
            "respect": -4
          }
        }
      ],
      "venueId": "ritual_alley"
    },
    "caio": {
      "title": "O homem que quis desaparecer",
      "place": "Café · Centro",
      "locations": [
        "centro"
      ],
      "text": [
        "Caio aceita encontrar vocês num café. Saiu por medo dos colecionadores, depois deixou Mara procurando porque não sabia como explicar o que havia transportado.",
        "Ele entrega um recibo com a data do ritual impressa antes de Mara marcá-lo. Pode ser uma cópia adulterada. Ela guarda o papel e se recusa a aceitar outra certeza fácil."
      ],
      "choices": [
        {
          "id": "support",
          "text": "Deixar Mara confrontar Caio e apoiar a investigação.",
          "next": "choice",
          "delayDays": 3,
          "metrics": {
            "trust": 2,
            "respect": 1
          }
        },
        {
          "id": "answer",
          "text": "Insistir que o recibo comprova sua natureza sobrenatural.",
          "next": "choice",
          "delayDays": 3,
          "metrics": {
            "respect": -2,
            "trust": -1
          }
        },
        {
          "id": "evidence",
          "text": "Cruzar o recibo com a procedência do museu.",
          "next": "choice",
          "delayDays": 2,
          "requires": {
            "flag": "evidence"
          },
          "metrics": {
            "trust": 2
          },
          "flags": {
            "network": true
          }
        }
      ],
      "venueId": "central_cafe"
    },
    "choice": {
      "title": "Além do círculo",
      "place": "Livraria de Sueli · Liberdade",
      "locations": [
        "liberdade"
      ],
      "text": [
        "Mara fechou o caderno do ritual, mas não abandonou o ocultismo. Quer investigar os colecionadores com método e manter Sueli informada.",
        "Ela admite que sente atração por você. “Não quero amar uma resposta. Quero saber se consigo conhecer quem está aqui.”"
      ],
      "choices": [
        {
          "id": "romance",
          "text": "Propor conhecê-la sem exigir fé ou obediência.",
          "next": null,
          "requires": {
            "metric": "respect",
            "min": 3
          },
          "ending": "Vocês começam uma aproximação afetiva. O recibo continua sem explicação; Mara preserva seu direito de duvidar.",
          "metrics": {
            "affinity": 2
          }
        },
        {
          "id": "allies",
          "text": "Manter uma parceria de investigação.",
          "next": null,
          "ending": "Mara e Sueli se tornam aliadas no núcleo ocultista. A coincidência do ritual permanece aberta.",
          "flags": {
            "ally": true
          }
        }
      ],
      "venueId": "sueli_books"
    },
    "rupture": {
      "title": "O círculo desfeito",
      "place": "Livraria · Liberdade",
      "locations": [
        "liberdade"
      ],
      "text": [
        "Sueli está ao lado de Mara quando você chega. Mara devolve qualquer coisa que tenha recebido de você. “Você quis que eu tivesse medo de perguntar.”",
        "Ela vai procurar Caio com outras pessoas. O encontro termina sem nova negociação."
      ],
      "choices": [
        {
          "id": "leave",
          "text": "Aceitar a recusa e ir embora.",
          "next": null,
          "ending": "Mara rompe o contato. Sua investigação continua sem você."
        }
      ],
      "venueId": "sueli_books"
    }
  }
}
