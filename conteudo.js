// Informações que aparecem no cartão do topo da página.
// Edite os valores à direita dos dois pontos.

const SOBRE_PALESTRANTE = {
  nome: "Maria Luiza Alves da Silva Machado",
  formacao: "Técnico em Informática — turma de 2021",
  escola: "Colégio Univap",
  atuacaoAtual: "Hoje trabalho como Analista Programadora SQL Pleno, criando soluções que usam dados para ajudar empresas a tomar decisões.",
  bio: "Comecei estudando no curso técnico em Informática e logo consegui meu primeiro estágio na área. Com o tempo fui crescendo profissionalmente, me formei em Ciência da Computação e hoje trabalho com bancos de dados e inteligência artificial, aplicando a tecnologia para resolver problemas do dia a dia.",
};

// Frases de abertura que a MarIA usa ao cumprimentar (uma é escolhida ao acaso)
const SAUDACOES = [
  "Olá, eu sou a MarIA! Pode perguntar qualquer coisa sobre a palestra de hoje 🤖",
  "E aí! Sou a MarIA, a parte 'IA' do nome já entrega quem eu sou. Mande sua pergunta!",
  "Oi, tudo bem? Fui treinada com tudo que rolou na palestra de hoje. O que você quer saber?",
];

// Sugestões de perguntas mostradas como botões (chips)
const PERGUNTAS_SUGERIDAS = [
  "O que é Inteligência Artificial?",
  "Vou perder meu emprego pra IA?",
  "Explique IA generativa como se eu tivesse 10 anos",
  "Qual foi o recado final da palestra?",
];
 
// ---- Redes sociais ----
// Deixe vazio ("") o link de qualquer rede que você não queira mostrar.
const REDES_SOCIAIS = [
  { nome: "Instagram", url: "https://instagram.com/submaria.jpeg" },
  { nome: "LinkedIn", url: "https://linkedin.com/in/marialuizamachado" },
  { nome: "GitHub", url: "https://github.com/submaria" },
];

// ---- Link da pasta com cursos gratuitos ----
const LINK_CURSOS = "https://drive.google.com/drive/folders/1KTt2ZmPRHqpoo_Te8Bvw475EV-iMPy_n?usp=sharing";
const TEXTO_CURSOS = "Reuni uma pasta com cursos gratuitos de IA e tecnologia que eu recomendo! Clique abaixo para acessar.";

// ---- Fotos da trajetória ----
// Cada foto precisa de um "src" (caminho do arquivo de imagem) e uma "legenda".
// Coloque os arquivos de imagem dentro da pasta /fotos e referencie assim:
// "fotos/nome-do-arquivo.jpg"
const FOTOS_TRAJETORIA = [
  { src: "fotos/placeholder1.svg", legenda: "[Legenda da foto 1 — ex: Formatura em 2025]" },
  { src: "fotos/placeholder2.svg", legenda: "[Legenda da foto 3]" },
  { src: "fotos/placeholder3.svg", legenda: "[Legenda da foto 3]" },
];