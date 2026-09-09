export default {
  "id": "iris",
  "name": "Íris Moura",
  "age": 27,
  "role": "Produtora musical e DJ · Asylum",
  "portrait": "/images/npcs/iris/portrait.jpg",
  "cast": "Nando, técnico de som; Duda, gerente do bar; Clara, fotógrafa; um promotor que retém pagamentos.",
  "start": "arrival",
  "scenes": {
    "arrival": {
      "title": "Do outro lado da pista",
      "place": "Asylum",
      "locations": [
        "asylum"
      ],
      "text": [
        "Íris percebe seu olhar, mas aponta primeiro para o cabo que alguém está prestes a arrancar. Ela está trabalhando na produção da noite, não esperando ser retirada da pista.",
        "Depois de resolver o problema, volta: “Agora sim. Você queria falar comigo?”"
      ],
      "choices": [
        {
          "id": "music",
          "text": "Perguntar sobre o set e o trabalho dela.",
          "next": "debt",
          "delayDays": 2,
          "metrics": {
            "trust": 1,
            "affinity": 1
          }
        },
        {
          "id": "flirt",
          "text": "Dizer que gostaria de conversar quando ela terminar.",
          "next": "debt",
          "delayDays": 2,
          "metrics": {
            "affinity": 2,
            "respect": 1
          }
        },
        {
          "id": "pressure",
          "text": "Insistir para que abandone o trabalho e saia com você.",
          "next": "debt",
          "delayDays": 3,
          "metrics": {
            "respect": -2
          }
        }
      ],
      "venueId": "asylum_floor"
    },
    "debt": {
      "title": "A festa que não pagou ninguém",
      "place": "Asylum",
      "locations": [
        "asylum"
      ],
      "text": [
        "Nando mostra a Íris os comprovantes do aluguel de equipamento. O promotor vendeu ingressos, mas diz que a noite deu prejuízo. Ela não quer briga na porta: quer receber e pagar a equipe.",
        "Íris pede uma testemunha para conferir os documentos. Há espaço para ajudar sem falar por ela."
      ],
      "choices": [
        {
          "id": "records",
          "text": "Comparar recibos e registrar o que falta.",
          "next": "meeting",
          "delayDays": 1,
          "metrics": {
            "trust": 2
          },
          "flags": {
            "records": true
          }
        },
        {
          "id": "clara",
          "text": "Sugerir o registro fotográfico de Clara, com autorização dela.",
          "next": "meeting",
          "delayDays": 1,
          "requires": {
            "npc": "clara",
            "metric": "trust",
            "min": 3
          },
          "metrics": {
            "trust": 2
          },
          "flags": {
            "records": true
          }
        },
        {
          "id": "threat",
          "text": "Oferecer assustar o promotor.",
          "next": "meeting",
          "delayDays": 1,
          "metrics": {
            "respect": -2
          },
          "flags": {
            "threat": true
          }
        }
      ],
      "venueId": "asylum_floor"
    },
    "meeting": {
      "title": "A sala depois do último cliente",
      "place": "Asylum",
      "locations": [
        "asylum"
      ],
      "text": [
        "O promotor tenta negociar separadamente com Íris. Ela mantém Nando na sala: “O dinheiro não é só meu.” Uma planilha impressa contradiz a versão do prejuízo.",
        "Quando você se aproxima demais, ela toca seu braço para pedir espaço. É um limite, não um convite."
      ],
      "choices": [
        {
          "id": "support",
          "text": "Acompanhar a cobrança documentada e deixar Íris conduzir.",
          "next": "quiet",
          "delayDays": 3,
          "requires": {
            "flag": "records"
          },
          "metrics": {
            "trust": 2,
            "respect": 2
          },
          "flags": {
            "network": true
          }
        },
        {
          "id": "witness",
          "text": "Ajudar a reunir a equipe e combinar uma cobrança conjunta.",
          "next": "quiet",
          "delayDays": 4,
          "metrics": {
            "trust": 1,
            "respect": 1
          },
          "flags": {
            "network": true
          }
        },
        {
          "id": "force",
          "text": "Ignorar o pedido e ameaçar o promotor em nome dela.",
          "next": "break",
          "delayDays": 1,
          "metrics": {
            "trust": -3,
            "respect": -3
          }
        }
      ],
      "venueId": "asylum_floor"
    },
    "quiet": {
      "title": "Sem música para preencher o silêncio",
      "place": "Café · Centro",
      "locations": [
        "centro"
      ],
      "text": [
        "Íris aparece de tênis, cansada, e conta que parte do pagamento chegou. O restante continua sendo cobrado. Fora da pista, fala baixo e demora a confiar.",
        "Ela quer saber se você procura uma pessoa ou a imagem de alguém que parece não ter medo de nada."
      ],
      "choices": [
        {
          "id": "honest",
          "text": "Falar sobre sua dificuldade em manter uma vida comum.",
          "next": "secret",
          "delayDays": 3,
          "metrics": {
            "trust": 2,
            "affinity": 1
          }
        },
        {
          "id": "listen",
          "text": "Ouvir o que ela deseja para o próximo ano.",
          "next": "secret",
          "delayDays": 3,
          "metrics": {
            "trust": 1,
            "respect": 1
          }
        },
        {
          "id": "kiss",
          "text": "Perguntar se pode beijá-la.",
          "next": "secret",
          "delayDays": 3,
          "requires": {
            "metric": "affinity",
            "min": 2
          },
          "metrics": {
            "affinity": 2,
            "respect": 1
          }
        }
      ],
      "venueId": "central_cafe"
    },
    "secret": {
      "title": "Os horários que nunca mudam",
      "place": "Asylum",
      "locations": [
        "asylum"
      ],
      "text": [
        "Íris percebe que você evita qualquer compromisso diurno. Não exige todos os seus segredos, mas não aceita que mentiras envolvam sua equipe.",
        "Ela oferece uma escolha: continuar se conhecendo com limites claros ou manter apenas a parceria profissional."
      ],
      "choices": [
        {
          "id": "limits",
          "text": "Explicar seus limites de horário e respeitar os dela.",
          "next": "future",
          "delayDays": 5,
          "metrics": {
            "trust": 1,
            "respect": 2
          }
        },
        {
          "id": "friends",
          "text": "Preferir uma amizade e a parceria musical.",
          "next": "future",
          "delayDays": 5,
          "flags": {
            "friendship": true
          },
          "metrics": {
            "trust": 2
          }
        },
        {
          "id": "lie",
          "text": "Inventar uma doença para impedir novas perguntas.",
          "next": "future",
          "delayDays": 5,
          "metrics": {
            "trust": -2
          },
          "flags": {
            "lied": true
          }
        }
      ],
      "venueId": "asylum_floor"
    },
    "future": {
      "title": "Um nome na lista",
      "place": "Asylum",
      "locations": [
        "asylum"
      ],
      "text": [
        "O próximo show tem contratos mais claros, equipe paga e espaço para fotógrafos independentes. Íris guarda dois lugares perto da mesa de som.",
        "Ela não promete estar disponível toda noite. Espera o mesmo direito de você."
      ],
      "choices": [
        {
          "id": "romance",
          "text": "Propor uma relação que respeite trabalho, amigos e limites.",
          "next": null,
          "requires": {
            "metric": "respect",
            "min": 3,
            "notFlag": "friendship"
          },
          "ending": "Íris aceita uma aproximação afetiva. Vocês combinam encontros; ninguém se torna dono da agenda do outro.",
          "metrics": {
            "affinity": 2
          }
        },
        {
          "id": "ally",
          "text": "Celebrar a amizade e continuar apoiando a equipe.",
          "next": null,
          "ending": "Íris se torna uma aliada na noite e sua rede pode ajudar outros personagens.",
          "flags": {
            "ally": true
          }
        }
      ],
      "venueId": "asylum_floor"
    },
    "break": {
      "title": "Fora da lista",
      "place": "Asylum",
      "locations": [
        "asylum"
      ],
      "text": [
        "Íris pede que a conversa aconteça perto da segurança. “Eu pedi ajuda com uma dívida. Você usou meu nome para ameaçar alguém.”",
        "Ela encerra a parceria e não aceita discutir um romance. Nando acompanha sua volta à mesa de som."
      ],
      "choices": [
        {
          "id": "leave",
          "text": "Respeitar o afastamento.",
          "next": null,
          "ending": "Íris interrompe o contato. A equipe resolve a cobrança sem você."
        }
      ],
      "venueId": "asylum_floor"
    }
  }
}
