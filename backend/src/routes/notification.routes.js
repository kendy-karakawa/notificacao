const express = require("express");
const {
  enviarNotificacao,
  consultarStatus,
} = require("../controllers/notification.controller");

const router = express.Router();

router.post("/notificar", enviarNotificacao);
router.get("/notificacao/status/:id", consultarStatus);

module.exports = router;
