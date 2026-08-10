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
      criarBolha(dados.error || "Algo deu errado. Tente de novo!", "maria");
      return;
    }

    criarBolha(dados.resposta, "maria");

    historico.push({ role: "user", content: limpo });
    historico.push({ role: "assistant", content: dados.resposta });
    historico = historico.slice(-8); // mantém só as últimas trocas
  } catch (erro) {
    digitando.remove();
    criarBolha("Não consegui me conectar agora. Verifique sua internet e tente de novo.", "maria");
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
  document.getElementById("sp-formacao").textContent = SOBRE_PALESTRANTE.formacao;
  document.getElementById("sp-escola").textContent = SOBRE_PALESTRANTE.escola;
  document.getElementById("sp-atuacao").textContent = SOBRE_PALESTRANTE.atuacaoAtual;
  document.getElementById("sp-bio").textContent = SOBRE_PALESTRANTE.bio;
}

montarSobrePalestrante();
montarChips();
criarBolha(escolherAleatorio(SAUDACOES), "maria");