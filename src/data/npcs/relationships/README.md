# Pessoas da noite

Cinco personagens fictícias adultas. Nomes, idades e biografias pertencem ao jogo, não identificam as pessoas das imagens de referência.

O botão **Relações** no topo é somente de consulta: status, diário e indicação do próximo encontro. Para conversar, use os botões dos lugares na tela da cidade (junto de Caçar e Mapa) ou na entrada do hospital/Asylum. Entrar abre a cena local com retrato, narração e escolhas; sair retorna à tela anterior sem alterar o progresso. O painel indica encontros disponíveis no local atual, o próximo endereço, a data mínima e um diário persistente. Os encontros são noturnos e não substituem as cenas principais dos locais.

| Pasta | Primeiro encontro | Núcleos e conflitos |
| --- | --- | --- |
| [clara](clara/README.md) | Último Gole, em Pinheiros | Fotografia, namoro controlador, irmã, equipe do bar, perseguição e proteção |
| [mara](mara/README.md) | Beco na Liberdade | Ritual ambíguo, livreira, colega desaparecido, procedência de objetos |
| [elisa](elisa/README.md) | Hospital Victor | Recuperação, família, retorno ao trabalho, sangue e autonomia |
| [iris](iris/README.md) | Asylum | Produção musical, equipe, dívida do promotor, intimidade fora da pista |
| [helena](helena/README.md) | Visita noturna a um museu na Bela Vista | Restauração, arquivos, patrocínio, ética profissional e intimidade |

O museu e o bar são sublocais narrativos dos distritos existentes. O Hospital Victor conserva as condições de descoberta do mapa principal.

## Organização

Cada `scenes.js` contém o perfil, elenco e grafo completo da personagem. Os IDs são locais à pasta: `arrival` em duas personagens não conflita. O README de cada pasta lista as escolhas e seus destinos. Os retratos originais ficam em `public/images/npcs/<id>/portrait.*`.

- `index.js`: registro das personagens e nomes dos indicadores.
- `src/engine/relationships/relationshipEngine.js`: valida local, tempo, condição do jogador, escolhas, requisitos e custos; aplica consequências e salva o avanço no estado retornado.
- `src/engine/relationships/relationshipClock.js`: consequência temporal idempotente da ameaça contra Clara. Chamado pelo avanço de tempo, save e consulta de relações; abrange saltos de calendário.
- `src/components/Relationships/Relationships.jsx`: painel modal, diário, retratos, indicadores, locais e datas.
- `test/relationships.test.js`: integridade dos grafos, progressão, sangue, restrições, dano, relógio, proteção, finais e conexões.

## Estado e regras

`game.relationships[npcId]` guarda `node`, `readyAt`, `deadlineAt`, `metrics`, `flags`, `journal`, `completed` e `ending`. Saves sem esse campo começam sem apagar ou reescrever personagens existentes. Escolhas só podem executar no nó atual; não é possível repetir uma conversa passada para acumular pontos.

Confiança, afinidade e respeito variam de -10 a 10. O vínculo de sangue vai de 0 a 3 e é **uma adaptação narrativa própria deste jogo**, não uma implementação completa de uma edição do RPG. Exposições não aumentam confiança automaticamente. Não há decaimento automático, poderes de carniçal ou controle direto do NPC nesta versão. O romance de Elisa só está disponível no caminho sem sangue; a recuperação com sangue oferece amizade, limites ou um final de dependência.

Cada escolha consome 15 minutos, salvo `minutes`. `delayDays` significa dias completos após a escolha. Elisa reaparece no Centro 21 dias depois de receber sangue. A dose custa um ponto real, exigindo que o jogador conserve pelo menos um ponto. O relógio impede ações que alcancem o amanhecer.

A ameaça de Rafael começa **somente depois de um aviso explícito** na cena `warning`, com 72 horas (48 se provocado). O painel registra o prazo exato. Proteção pode ser organizada sem romance ou testes sociais. Confrontar Rafael sozinho não remove o prazo. Falhar em proteger Clara até o prazo produz `loss` uma única vez e uma tentativa de ataque ao jogador; o dano usa o sistema de vitalidade existente. Não há morte retroativa por deixar de conhecer uma personagem. A morte de Clara não é revertida por voltar a uma cena anterior.

## Conexões entre núcleos

- Confiança 3 com Íris abre apoio de sua rede à proteção de Clara.
- Confiança 3 com Clara abre a colaboração fotográfica no conflito de Íris.
- Confiança 2 com Helena ajuda Mara a identificar o catálogo.
- Confiança 2 com Mara ajuda Helena com o diagrama.
- Confiança 3 com Mara abre uma consulta sobre a influência do sangue em Elisa.

## Adicionar cenas

Uma cena tem `title`, `place`, `locations` (IDs do mapa), `text` (parágrafos) e `choices`. Cada escolha tem ID único no nó, texto e `next` ou `ending`. Opções: `minutes`, `delayDays`, `metrics`, `flags`, `result`, `bloodCost`, `damage`, `requires`.

`requires` admite `flag`, `notFlag`, `metric` + `min`, `npc` + `metric` + `min`, ou `skill` + `min`. As condições combinadas precisam ser satisfeitas juntas. Todas são verificadas pelo motor, não apenas pelo botão desabilitado.

`deadlineDays` e `clearDeadline` pertencem ao arco de Clara. Não reutilize esses campos para outra personagem sem implementar o respectivo evento no relógio e testes. Ao mudar destinos de cenas já publicados, migre os nós salvos antes de removê-los.

Validação: `npm test`, `npm run build` e `npx oxlint src/engine/relationships src/components/Relationships src/data/npcs/relationships test/relationships.test.js`.

## Locais dos encontros

`venues.js` define os estabelecimentos e sublocais. Cada cena declara `venueId`; não basta estar no distrito para conversar em qualquer estabelecimento. `venueEngine.js` filtra encontros disponíveis e valida a escolha dentro do local correto. `RelationshipPlaces.jsx` apresenta os botões e a tela de cada lugar. A navegação local não cobra minutos; as escolhas mantêm seus custos originais.

- Pinheiros: Último Gole e ruas (perseguição).
- Liberdade: beco e livraria de Sueli.
- Hospital Victor: ala de internação.
- Asylum: pista e bastidores.
- Bela Vista: museu de artes.
- Centro: café, praça e ruas, conforme a etapa.

Quando não há um encontro disponível, aparece apenas a descrição do lugar, sem antecipar a próxima cena. Datas, prazos e progresso continuam no save. Os testes narrativos de `choice.test` usam o motor de dados e registram o resultado no diário.
