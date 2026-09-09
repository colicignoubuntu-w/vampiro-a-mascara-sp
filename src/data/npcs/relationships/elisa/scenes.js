export default {
  "id": "elisa",
  "name": "Elisa Duarte",
  "age": 25,
  "role": "Técnica de laboratório afastada · Hospital Victor",
  "portrait": "/images/npcs/elisa/portrait.jpg",
  "cast": "Ana, enfermeira; Joana, irmã; Mara, pesquisadora; médicos que acompanham a recuperação.",
  "start": "arrival",
  "scenes": {
    "arrival": {
      "title": "O leito junto à janela",
      "place": "Hospital Victor",
      "locations": [
        "hospital_victor"
      ],
      "text": [
        "Elisa está consciente, mas mal consegue sustentar a conversa. Ana ajusta a medicação e sai para buscar a equipe. Uma complicação fez seu estado piorar naquela noite.",
        "Sozinhos por um instante, você considera oferecer seu sangue. Ela não sabe o que ele é. A intervenção pode ajudá-la, mas não equivale a uma transfusão comum nem esclarece o que a recuperação trará."
      ],
      "choices": [
        {
          "id": "blood",
          "text": "Oferecer uma pequena quantidade do seu sangue. · 1 ponto",
          "next": "reunion",
          "bloodCost": 1,
          "delayDays": 21,
          "metrics": {
            "bond": 1
          },
          "flags": {
            "receivedBlood": true
          },
          "result": "Ela aceita a ajuda sem compreender sua natureza. A melhora surpreende a equipe, que continua o tratamento. Você deixa o hospital antes de precisar explicar."
        },
        {
          "id": "staff",
          "text": "Chamar Ana e permanecer até a equipe assumir.",
          "next": "ordinary",
          "delayDays": 21,
          "metrics": {
            "trust": 2,
            "respect": 2
          },
          "result": "Ana chama reforço. A recuperação será acompanhada pela equipe; você não oferece sangue."
        },
        {
          "id": "leave",
          "text": "Sair e avisar a equipe sobre a piora.",
          "next": "ordinary",
          "delayDays": 28,
          "metrics": {
            "respect": 1
          },
          "result": "Você avisa Ana antes de sair. A equipe entra no quarto."
        }
      ],
      "venueId": "hospital_ward"
    },
    "reunion": {
      "title": "Vinte e uma noites depois",
      "place": "Rua · Centro",
      "locations": [
        "centro"
      ],
      "text": [
        "Elisa chama você pelo outro lado da rua. Está mais forte, mas segura uma lista de lugares onde pensou ter visto seu rosto. “Parece ridículo. Eu sabia que precisava encontrar você.”",
        "Ela agradece por ter sobrevivido e, na mesma frase, pede para não ser deixada sozinha. A intensidade não nasceu de convivência. Joana percebeu que a irmã anda saindo para procurar um desconhecido."
      ],
      "choices": [
        {
          "id": "truth",
          "text": "Explicar que seu sangue pode ter provocado essa necessidade.",
          "next": "limits",
          "delayDays": 2,
          "metrics": {
            "trust": 2,
            "respect": 2
          },
          "flags": {
            "informed": true
          }
        },
        {
          "id": "care",
          "text": "Sugerir que conversem com Joana e mantenham o acompanhamento.",
          "next": "limits",
          "delayDays": 2,
          "metrics": {
            "trust": 1,
            "respect": 1
          },
          "flags": {
            "sister": true
          }
        },
        {
          "id": "feed",
          "text": "Dar mais sangue para acalmá-la. · 1 ponto",
          "next": "limits",
          "bloodCost": 1,
          "delayDays": 2,
          "metrics": {
            "bond": 1,
            "respect": -2
          },
          "result": "A ansiedade cede perto de você, mas volta quando se afasta. A segunda exposição aprofunda a dependência; não cria confiança."
        }
      ],
      "venueId": "central_streets"
    },
    "ordinary": {
      "title": "Uma recuperação compartilhada",
      "place": "Hospital Victor",
      "locations": [
        "hospital_victor"
      ],
      "text": [
        "Elisa volta para uma consulta e reconhece você. A recuperação foi lenta: sessões, exames e ajuda de Joana. Ela agradece por ter chamado a equipe.",
        "Não há urgência misteriosa em sua atenção. Pergunta apenas se você aceita um café quando ela tiver alta do acompanhamento daquela noite."
      ],
      "choices": [
        {
          "id": "coffee",
          "text": "Aceitar o café e ouvir os planos de volta ao trabalho.",
          "next": "future",
          "delayDays": 7,
          "metrics": {
            "trust": 2,
            "affinity": 1
          }
        },
        {
          "id": "space",
          "text": "Desejar uma boa recuperação sem buscar intimidade.",
          "next": null,
          "ending": "Elisa segue a recuperação com a família. Vocês guardam uma lembrança cordial."
        }
      ],
      "venueId": "hospital_ward"
    },
    "limits": {
      "title": "Não chame isso de destino",
      "place": "Praça · Centro",
      "locations": [
        "centro"
      ],
      "text": [
        "Elisa chegou horas antes do combinado e faltou a um compromisso. “Eu não era assim.” Ela quer entender por que estar perto de você parece resolver tudo por alguns minutos.",
        "Joana pergunta o que houve no hospital. Elisa pede para responder por si, mas não quer ficar sem apoio. Nenhuma declaração de amor resolve essa perda de controle."
      ],
      "choices": [
        {
          "id": "explain",
          "text": "Contar a verdade e combinar encontros limitados, sem novas doses.",
          "next": "recovery",
          "delayDays": 14,
          "metrics": {
            "trust": 2,
            "respect": 2
          },
          "flags": {
            "informed": true,
            "boundaries": true
          }
        },
        {
          "id": "mara",
          "text": "Pedir uma avaliação a Mara com a concordância de Elisa.",
          "next": "recovery",
          "delayDays": 14,
          "requires": {
            "npc": "mara",
            "metric": "trust",
            "min": 3
          },
          "metrics": {
            "trust": 2,
            "respect": 2
          },
          "flags": {
            "informed": true,
            "boundaries": true
          }
        },
        {
          "id": "control",
          "text": "Oferecer sangue de novo e pedir que fique só com você. · 1 ponto",
          "next": "dependency",
          "bloodCost": 1,
          "delayDays": 2,
          "metrics": {
            "bond": 1,
            "respect": -4
          },
          "flags": {
            "isolated": true
          }
        }
      ],
      "venueId": "central_square"
    },
    "recovery": {
      "title": "Uma tarde que não gira em torno de você",
      "place": "Café · Centro",
      "locations": [
        "centro"
      ],
      "text": [
        "Elisa conta que conseguiu cumprir uma semana de compromissos sem sair para procurá-lo. Ainda sente a urgência, sobretudo depois de sonhar com o hospital. Joana a acompanha até o café e espera em outra mesa.",
        "Ela quer retomar o laboratório. “Se você realmente se importa, precisa aceitar que eu não apareça.”"
      ],
      "choices": [
        {
          "id": "respect",
          "text": "Apoiar sua autonomia e manter o limite de não oferecer sangue.",
          "next": "future",
          "delayDays": 21,
          "metrics": {
            "trust": 2,
            "respect": 2
          },
          "flags": {
            "boundaries": true
          }
        },
        {
          "id": "demand",
          "text": "Cobrar presença como retribuição por tê-la salvado.",
          "next": "dependency",
          "delayDays": 2,
          "metrics": {
            "respect": -3,
            "trust": -2
          }
        }
      ],
      "venueId": "central_cafe"
    },
    "dependency": {
      "title": "A conta da salvação",
      "place": "Rua · Centro",
      "locations": [
        "centro"
      ],
      "text": [
        "Elisa deixou o telefone tocar até Joana vir buscá-la. A proximidade que você exigiu tomou o espaço do trabalho e das outras relações. O vínculo torna difícil contrariá-lo; isso não torna a concordância dela livre.",
        "Joana insiste em interromper o isolamento. Elisa consegue pedir uma coisa: tempo longe de você."
      ],
      "choices": [
        {
          "id": "release",
          "text": "Aceitar o afastamento e não fornecer mais sangue.",
          "next": "recovery",
          "delayDays": 21,
          "metrics": {
            "respect": 2
          },
          "flags": {
            "boundaries": true
          },
          "result": "Joana acompanha Elisa. O vínculo não desaparece instantaneamente, mas ela volta a ter apoio fora de você."
        },
        {
          "id": "refuse",
          "text": "Recusar o limite e exigir que ela escolha você.",
          "next": null,
          "ending": "A relação termina em dependência e isolamento. Não é um desfecho romântico: Joana continua tentando recuperar o contato com a irmã.",
          "metrics": {
            "respect": -3
          }
        }
      ],
      "venueId": "central_streets"
    },
    "future": {
      "title": "Quem escolhe voltar",
      "place": "Café · Centro",
      "locations": [
        "centro"
      ],
      "text": [
        "Elisa voltou ao laboratório em carga reduzida. Vocês falam de coisas pequenas antes de tocar no hospital. Ela quer que sua vida tenha mais assuntos do que aquela noite.",
        "Se houve sangue entre vocês, a influência ainda merece cuidado; algumas semanas não apagam o vínculo. A amizade pode crescer sem transformar gratidão em obrigação."
      ],
      "choices": [
        {
          "id": "friend",
          "text": "Construir uma amizade com limites claros.",
          "next": null,
          "ending": "Elisa preserva o trabalho, o apoio de Joana e encontros combinados. A confiança cresce por escolhas, não por doses.",
          "metrics": {
            "respect": 2
          }
        },
        {
          "id": "date",
          "text": "Convidá-la para um encontro, aceitando uma recusa.",
          "next": null,
          "requires": {
            "notFlag": "receivedBlood",
            "metric": "trust",
            "min": 3
          },
          "ending": "Sem vínculo de sangue, Elisa aceita conhecer você fora da história do hospital. O romance começa aos poucos.",
          "metrics": {
            "affinity": 2
          }
        }
      ],
      "venueId": "central_cafe"
    }
  }
}
