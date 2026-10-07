const express = require("express");
const logger = require("./middlewares/logger");
const { rutaNoEncontrada, manejadorErrores } = require("./middlewares/manejadorErrores");

const app = express();

app.use(express.json());
app.use(logger);

app.get("/", (req, res) => {
  res.json({ mensaje: "API de productos funcionando" });
});

app.use("/productos", require("./routes/productos"));

app.use(rutaNoEncontrada);
app.use(manejadorErrores);

const PUERTO = process.env.PORT || 3000;
app.listen(PUERTO, () => {
  console.log(`API escuchando en http://localhost:${PUERTO}`);
});
