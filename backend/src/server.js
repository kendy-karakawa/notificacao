require("dotenv").config();
const app = require("./app");
const { connectConsumer } = require("./consumers/notification.consumer");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  connectConsumer();
});
