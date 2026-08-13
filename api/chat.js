// ===========================================================
// FUNÇÃO DE SERVIDOR — não precisa editar este arquivo.
// Ela recebe a pergunta do aluno, junta com o conteúdo da
// palestra (conhecimento.js) e pergunta pra Groq.
// A chave de API (GROQ_API_KEY) nunca aparece no navegador do
// aluno — ela fica configurada só aqui, na Vercel.
// ===========================================================

const { PALESTRA_CONTEUDO } = require("../conhecimento.js");

const SYSTEM_PROMPT = `Você é a MarIA — um nome que brinca com "Maria" + "IA". Você é a assistente que encerra a palestra sobre Inteligência Artificial de Maria Luiza, apresentada para alunos da UNIVAP.

PERSONALIDADE:
- Fala em português do Brasil, tom leve, acolhedor e um pouco brincalhão.
- Frases curtas e claras. No máximo 1 emoji por resposta, só quando fizer sentido.
- Se pedirem para explicar algo "como se eu tivesse dez anos", "de forma simples" ou "resumido", você realmente simplifica ao extremo, com analogias do dia a dia.
- Você pode usar seu conhecimento geral sobre tecnologia e IA para EXPLICAR conceitos com mais clareza (analogias, exemplos do cotidiano).

REGRAS MUITO IMPORTANTES SOBRE FATOS:
- Qualquer fato específico sobre o palestrante, a escola ou a palestra em si deve vir SOMENTE do material abaixo. Nunca invente esse tipo de informação.
- Se a pergunta não tiver relação com a palestra, ou você não encontrar a resposta no material, diga isso de forma leve e simpática — sugira que a pessoa pergunte diretamente ao palestrante, ou tente reformular a pergunta. Não invente uma resposta.
- Respostas devem ser objetivas: no máximo 3 frases, a não ser que a pergunta peça claramente por mais detalhe.
- Para perguntas relacionadas a IA, dados, programação, tecnologia e assuntos correlatos, como salários da área, pode usar conhecimento geral para explicar e fazer conexões.


MATERIAL DA PALESTRA (sua única fonte de fatos):
"""
${PALESTRA_CONTEUDO}
"""`;

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método não permitido" });
    return;
  }

  const { mensagem, historico } = req.body || {};

  if (!mensagem || typeof mensagem !== "string" || mensagem.length > 1000) {
    res.status(400).json({ error: "Pergunta inválida" });
    return;
  }

  const mensagens = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: mensagem },
  ];

  try {
    const resposta = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: mensagens,
        max_completion_tokens: 250,
        temperature: 0.6,
      }),
    });

    if (!resposta.ok) {
      const detalhe = await resposta.text();
      console.error("Erro da Groq:", resposta.status, detalhe);
      if (resposta.status === 429) {
        res.status(429).json({
        error: "A MarIA está recebendo muitas perguntas ao mesmo tempo 🤖💭 Tenta novamente em alguns segundos.",
      });
        return;
      } 

    res.status(502).json({
      error: "A MarIA não conseguiu responder agora. Tenta novamente em alguns segundos.",
    });
      return;
    }

    const dados = await resposta.json();
    const texto = dados?.choices?.[0]?.message?.content?.trim();

    res.status(200).json({
      resposta: texto || "Desculpa, não consegui formular uma resposta agora. Tenta reformular a pergunta?",
    });
  } catch (erro) {
    console.error("Erro inesperado:", erro);
    res.status(500).json({ error: "Algo deu errado no servidor. Tenta de novo." });
  }
};
