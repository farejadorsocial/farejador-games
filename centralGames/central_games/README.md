# Farejador Games

Central HTML5 com quatro quizzes independentes:

1. Desafio Bíblico (v3, novo tema claro "céu e luz")
2. Bandeiras e Capitais
3. Quiz do Milhão
4. Futebol Brasileiro

## Testar no Windows

1. Extraia todo o conteúdo do ZIP para uma pasta.
2. Abra `INICIAR_FAREJADOR_GAMES.bat`.
3. Acesse `http://localhost:8000` no navegador.

É necessário ter Python instalado. Também é possível publicar o conteúdo desta pasta em um serviço de hospedagem estática, como GitHub Pages.

## Estrutura

- `index.html`, `css/style.css`, `js/app.js`: a central (lista de jogos, busca, filtros e recordes).
- `jogos/`: cada quiz em uma pasta independente, com CSS, JavaScript, perguntas, ícones, manifesto e service worker próprios.

## Como adicionar um novo quiz

1. Coloque a pasta do jogo em `jogos/nome-do-quiz/`.
2. Em `js/app.js`, adicione um item na lista `games` (título, categoria, emoji, tema de cor, descrição, `url`, e a chave do localStorage do jogo para mostrar o recorde).
3. Se for uma categoria nova, adicione um botão `chip` em `index.html` e uma cor `.t-novo .cover` em `css/style.css`.

Observação: os recordes mostrados nos cartões só aparecem quando a central e os jogos são abertos pelo mesmo endereço (servidor local ou hospedagem).
