// ===========================================================
// INTERFACE DO CHAT — não precisa editar este arquivo.
// Ele manda a pergunta do aluno para /api/chat e mostra a
// resposta que voltar de lá.
// ===========================================================

const elMensagens = document.getElementById("mensagens");
const elForm = document.getElementById("form-chat");
const elInput = document.getElementById("input-pergunta");
const elChips = document.getElementById("chips");

let historico = []; // guarda as últimas mensagens da conversa, pra IA ter contexto

function escolherAleatorio(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

function criarBolha(texto, autor) {
  const bolha = document.createElement("div");
  bolha.className = `bolha bolha--${autor}`;
  const p = document.createElement("p");
  p.textContent = texto;
  bolha.appendChild(p);
  elMensagens.appendChild(bolha);
  elMensagens.scrollTop = elMensagens.scrollHeight;
  return bolha;
}

function mostrarDigitando() {
  const bolha = document.createElement("div");
  bolha.className = "bolha bolha--maria bolha--digitando";
  bolha.innerHTML = "<span></span><span></span><span></span>";
  elMensagens.appendChild(bolha);
  elMensagens.scrollTop = elMensagens.scrollHeight;
  return bolha;
}

async function enviarPergunta(texto) {
  const limpo = texto.trim();
  if (!limpo) return;

  criarBolha(limpo, "usuario");
  elInput.value = "";
  elInput.disabled = true;

  const digitando = mostrarDigitando();

  try {
    const resp = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mensagem: limpo, historico }),
    });

    const dados = await resp.json();
    digitando.remove();

    if (!resp.ok) {
      criarBolha(dados.error || "Algo deu errado. Tenta de novo?", "maria");
      return;
    }

    criarBolha(dados.resposta, "maria");

    historico.push({ role: "user", content: limpo });
    historico.push({ role: "assistant", content: dados.resposta });
    historico = historico.slice(-8); // mantém só as últimas trocas
  } catch (erro) {
    digitando.remove();
    criarBolha("Não consegui me conectar agora. Verifica sua internet e tenta de novo.", "maria");
  } finally {
    elInput.disabled = false;
    elInput.focus();
  }
}

elForm.addEventListener("submit", (e) => {
  e.preventDefault();
  enviarPergunta(elInput.value);
});

function montarChips() {
  for (const pergunta of PERGUNTAS_SUGERIDAS) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.textContent = pergunta;
    chip.addEventListener("click", () => enviarPergunta(pergunta));
    elChips.appendChild(chip);
  }
}

function montarSobrePalestrante() {
  document.getElementById("sp-nome").textContent = SOBRE_PALESTRANTE.nome;
  document.getElementById("sp-tecnico").textContent = SOBRE_PALESTRANTE.tecnico;
  document.getElementById("sp-bacharel").textContent = SOBRE_PALESTRANTE.bacharel;
  document.getElementById("sp-pos").textContent = SOBRE_PALESTRANTE.pos;
  document.getElementById("sp-atuacao").textContent = SOBRE_PALESTRANTE.atuacaoAtual;
  document.getElementById("sp-bio").textContent = SOBRE_PALESTRANTE.bio;
}

// Ícones simples em SVG para cada rede social conhecida
const ICONES_REDES = {
  Instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>',
  LinkedIn: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C3.34 3.5 2 4.84 2 6.48s1.34 2.98 2.98 2.98 2.98-1.34 2.98-2.98S6.62 3.5 4.98 3.5zM2.4 21.5h5.16V9.75H2.4V21.5zM9.5 9.75h4.94v1.6h.07c.69-1.3 2.37-2.67 4.88-2.67 5.22 0 6.19 3.43 6.19 7.9v7.92h-5.16v-7.02c0-1.68-.03-3.83-2.34-3.83-2.34 0-2.7 1.83-2.7 3.71v7.14H9.5V9.75z"/></svg>',
  GitHub: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.5 0-.24-.01-1.04-.01-1.88-2.78.62-3.37-1.22-3.37-1.22-.46-1.2-1.11-1.52-1.11-1.52-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.55 2.33 1.11 2.9.85.09-.65.34-1.11.62-1.36-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05a9.3 9.3 0 0 1 5 0c1.9-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.35 4.8-4.58 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .28.18.6.69.5A10.03 10.03 0 0 0 22 12.25C22 6.58 17.52 2 12 2z"/></svg>',
};

function montarRedes() {
  const elRedes = document.getElementById("redes");
  for (const rede of REDES_SOCIAIS) {
    if (!rede.url || rede.url.includes("[")) continue; // ignora links não preenchidos ainda
    const a = document.createElement("a");
    a.href = rede.url;
    a.target = "_blank";
    a.rel = "noopener";
    a.className = "rede";
    a.innerHTML = `${ICONES_REDES[rede.nome] || ""}<span>${rede.nome}</span>`;
    elRedes.appendChild(a);
  }
}

function montarGaleria() {
  const elGaleria = document.getElementById("galeria");
  for (const foto of FOTOS_TRAJETORIA) {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    img.src = foto.src;
    img.alt = foto.legenda;
    img.loading = "lazy";
    const caption = document.createElement("figcaption");
    caption.textContent = foto.legenda;
    figure.appendChild(img);
    figure.appendChild(caption);
    elGaleria.appendChild(figure);
  }
}

function montarCursos() {
  document.getElementById("texto-cursos").textContent = TEXTO_CURSOS;
  document.getElementById("link-cursos").href = LINK_CURSOS;
}

function montarAbas() {
  const botoes = document.querySelectorAll(".aba-botao");
  const paineis = {
    chat: document.getElementById("painel-chat"),
    trajetoria: document.getElementById("painel-trajetoria"),
    cursos: document.getElementById("painel-cursos"),
  };

  botoes.forEach((botao) => {
    botao.addEventListener("click", () => {
      botoes.forEach((b) => b.setAttribute("aria-selected", "false"));
      Object.values(paineis).forEach((p) => p.classList.remove("ativa"));

      botao.setAttribute("aria-selected", "true");
      paineis[botao.dataset.aba].classList.add("ativa");
    });
  });
}

montarSobrePalestrante();
montarRedes();
montarGaleria();
montarCursos();
montarAbas();
montarChips();
criarBolha(escolherAleatorio(SAUDACOES), "maria");