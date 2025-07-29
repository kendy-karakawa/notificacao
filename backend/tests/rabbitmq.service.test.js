require("dotenv").config({ path: ".env.test" }); // se quiser usar env separado para teste

const amqp = require("amqplib");
const { publishToQueue } = require("../src/services/rabbitmq.service");

jest.mock("amqplib");

describe("publishToQueue", () => {
  let mockChannel;

  beforeEach(() => {
    mockChannel = {
      assertQueue: jest.fn(),
      sendToQueue: jest.fn(),
    };

    amqp.connect.mockResolvedValue({
      createChannel: jest.fn().mockResolvedValue(mockChannel),
    });
  });

  it("deve publicar mensagem corretamente na fila", async () => {
    process.env.QUEUE_ENTRADA = "fila.notificacao.entrada.kendy";

    const mensagemId = "abc-123";
    const conteudoMensagem = "mensagem de teste";

    await publishToQueue(mensagemId, conteudoMensagem);

    expect(mockChannel.sendToQueue).toHaveBeenCalledWith(
      "fila.notificacao.entrada.kendy",
      Buffer.from(JSON.stringify({ mensagemId, conteudoMensagem }))
    );
  });
});
