const { publishToQueue } = require("../services/rabbitmq.service");
const { statusStore } = require("../store/status.store");

const enviarNotificacao = async (req, res) => {
  const { mensagemId, conteudoMensagem } = req.body;

  if (!conteudoMensagem?.trim()) {
    return res.status(400).json({ erro: "Mensagem não pode ser vazia" });
  }

  try {
    await publishToQueue(mensagemId, conteudoMensagem);
    statusStore.set(mensagemId, "AGUARDANDO_PROCESSAMENTO");
    return res
      .status(202)
      .json({ mensagemId, status: "AGUARDANDO_PROCESSAMENTO" });
  } catch (error) {
    return res.status(500).json({ erro: "Erro ao publicar a mensagem", error });
  }
};

const consultarStatus = (req, res) => {
  const { id } = req.params;
  const status = statusStore.get(id);
  if (!status) {
    return res.status(404).json({ erro: "Mensagem não encontrada" });
  }
  return res.json({ mensagemId: id, status });
};

module.exports = {
  enviarNotificacao,
  consultarStatus,
};
