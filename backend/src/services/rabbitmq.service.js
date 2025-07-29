require("dotenv").config();
const amqp = require("amqplib");

const RABBIT_URL = process.env.RABBITMQ_URL;
const QUEUE_NAME = process.env.QUEUE_ENTRADA;

let channel;

const createRabbitConnection = async () => {
  const conn = await amqp.connect(RABBIT_URL);
  channel = await conn.createChannel();
  await channel.assertQueue(QUEUE_NAME, { durable: true });
  return channel;
};

const publishToQueue = async (mensagemId, conteudoMensagem) => {
  if (!channel) await createRabbitConnection();
  const payload = JSON.stringify({ mensagemId, conteudoMensagem });
  channel.sendToQueue(QUEUE_NAME, Buffer.from(payload));
};

module.exports = {
  publishToQueue,
};
