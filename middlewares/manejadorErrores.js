const ErrorHttp = require("./ErrorHttp");

function rutaNoEncontrada(req, res, next) {
  next(new ErrorHttp(404, "Ruta no encontrada"));
}

function manejadorErrores(err, req, res, next) {
  const status = err.status ?? (err.type === "entity.parse.failed" ? 400 : 500);
  const mensaje =
    status === 500 ? "Error interno del servidor" : err.status ? err.message : "JSON inválido";

  if (status === 500) console.error(err);

  res.status(status).json({ success: false, error: mensaje });
}

module.exports = { rutaNoEncontrada, manejadorErrores };
