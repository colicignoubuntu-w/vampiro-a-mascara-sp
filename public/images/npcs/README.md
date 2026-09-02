# Retratos dos NPCs

Cada NPC possui uma subpasta. Coloque o retrato principal com o nome `portrait.png`.

Formato recomendado:

- PNG vertical com fundo transparente.
- Proporção aproximada de `2:3`.
- Tamanho sugerido: `1024x1536`.
- Personagem inteiro ou enquadrado dos joelhos para cima.

Pastas configuradas:

- `vi/portrait.png`
- `janette-voerman/portrait.png`
- `therese-voerman/portrait.png`
- `voerman-sisters/portrait.png`
- `jack/portrait.png`
- `mercurio/portrait.png`
- `marina/portrait.png`
- `prince/portrait.png`
- `david-hatter/portrait.png`
- `adder/portrait.png`
- `security/portrait.png`
- `unknown-vampire/portrait.png`

Os arquivos ausentes são ocultados automaticamente. Para cadastrar outro NPC, adicione seu nome e caminho em `src/data/visuals/npcVisualCatalog.js`.

Janette também possui as variações `portrait-02.png`, `portrait-03.png` e
`portrait-04.png`. Atualmente, `portrait.png` é a imagem exibida automaticamente
nas cenas dela.

O retrato do Príncipe deve ser colocado em `prince/portrait.png`. Ele aparecerá
automaticamente sempre que o interlocutor da cena for `O Príncipe`.

Jack possui o retrato principal `jack/portrait.png` e a variação
`jack/portrait-02.png`. Atualmente, o retrato principal aparece automaticamente
nas falas dele.
