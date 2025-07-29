require("dotenv").config();
const amqp = require("amqplib");
const { statusStore } = require("../store/status.store");

const RABBIT_URL = process.env.RABBITMQ_URL;
const ENTRADA_QUEUE = process.env.QUEUE_ENTRADA;
const STATUS_QUEUE = process.env.QUEUE_STATUS;

const connectConsumer = async () => {
  const conn = await amqp.connect(RABBIT_URL);
  const channel = await conn.createChannel();

  await channel.assertQueue(ENTRADA_QUEUE, { durable: true });
  await channel.assertQueue(STATUS_QUEUE, { durable: true });

  console.log(`Consumindo de: ${ENTRADA_QUEUE}`);

  channel.consume(ENTRADA_QUEUE, async (msg) => {
    const data = JSON.parse(msg.content.toString());
    console.log("Recebido:", data);

    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 1000)
    );

    const status =
      Math.random() <= 0.2 ? "FALHA_PROCESSAMENTO" : "PROCESSADO_SUCESSO";

    console.log(`Status: ${status}`);

    const retorno = JSON.stringify({ mensagemId: data.mensagemId, status });
    channel.sendToQueue(STATUS_QUEUE, Buffer.from(retorno));
    statusStore.set(data.mensagemId, status);
    channel.ack(msg);
  });
};

module.exports = {
  connectConsumer,
};
