const ErrorHttp = require("./ErrorHttp");

function verificarApiKey(req, res, next) {
  const clave = req.header("x-api-key");
  const API_KEY = process.env.API_KEY || "clave-secreta-123";

  if (!clave || clave !== API_KEY) {
    return next(new ErrorHttp(401, "No autorizado"));
  }

  next();
}

module.exports = verificarApiKey;
