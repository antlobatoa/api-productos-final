const express = require("express");
const {
  listar,
  obtener,
  crear,
  actualizar,
  eliminar
} = require("../controllers/productosController");
const verificarApiKey = require("../middlewares/verificarApiKey");

const router = express.Router();

router.get("/", listar);
router.get("/:id", obtener);
router.post("/", verificarApiKey, crear);
router.put("/:id", verificarApiKey, actualizar);
router.delete("/:id", verificarApiKey, eliminar);

module.exports = router;
