const productos = require("../data/productos");
const ErrorHttp = require("../middlewares/ErrorHttp");

function datosInvalidos({ nombre, categoria, precio }, parcial = false) {
  const nombreMal =
    nombre === undefined ? !parcial : typeof nombre !== "string" || nombre.trim() === "";
  const categoriaMal =
    categoria === undefined ? !parcial : typeof categoria !== "string" || categoria.trim() === "";
  const precioMal =
    precio === undefined ? !parcial : typeof precio !== "number" || precio < 0;

  return nombreMal || categoriaMal || precioMal;
}

function listar(req, res, next) {
  const { buscar, categoria, precioMin, precioMax } = req.query;

  const page = req.query.page === undefined ? 1 : Number(req.query.page);
  const limit = req.query.limit === undefined ? 5 : Number(req.query.limit);

  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1 || limit > 50) {
    return next(new ErrorHttp(400, "page y limit deben ser enteros positivos (limit máximo 50)"));
  }

  let resultado = productos;

  if (buscar) {
    const texto = String(buscar).toLowerCase();
    resultado = resultado.filter((p) => p.nombre.toLowerCase().includes(texto));
  }

  if (categoria) {
    const cat = String(categoria).toLowerCase();
    resultado = resultado.filter((p) => p.categoria.toLowerCase() === cat);
  }

  if (precioMin !== undefined) {
    const min = Number(precioMin);
    if (Number.isNaN(min)) return next(new ErrorHttp(400, "precioMin debe ser un número"));
    resultado = resultado.filter((p) => p.precio >= min);
  }

  if (precioMax !== undefined) {
    const max = Number(precioMax);
    if (Number.isNaN(max)) return next(new ErrorHttp(400, "precioMax debe ser un número"));
    resultado = resultado.filter((p) => p.precio <= max);
  }

  const total = resultado.length;
  const totalPaginas = Math.ceil(total / limit);
  const inicio = (page - 1) * limit;

  res.json({
    total,
    page,
    limit,
    totalPaginas,
    datos: resultado.slice(inicio, inicio + limit)
  });
}

function obtener(req, res, next) {
  const id = Number(req.params.id);
  const producto = productos.find((p) => p.id === id);

  if (!producto) {
    return next(new ErrorHttp(404, "Producto no encontrado"));
  }

  res.json(producto);
}

function crear(req, res, next) {
  const cuerpo = req.body ?? {};

  if (datosInvalidos(cuerpo)) {
    return next(new ErrorHttp(400, "Datos inválidos"));
  }

  const nuevo = {
    id: productos.length > 0 ? Math.max(...productos.map((p) => p.id)) + 1 : 1,
    nombre: cuerpo.nombre.trim(),
    categoria: cuerpo.categoria.trim(),
    precio: cuerpo.precio
  };

  productos.push(nuevo);
  res.status(201).json(nuevo);
}

function actualizar(req, res, next) {
  const id = Number(req.params.id);
  const producto = productos.find((p) => p.id === id);

  if (!producto) {
    return next(new ErrorHttp(404, "Producto no encontrado"));
  }

  const cuerpo = req.body ?? {};

  if (datosInvalidos(cuerpo, true)) {
    return next(new ErrorHttp(400, "Datos inválidos"));
  }

  if (cuerpo.nombre !== undefined) producto.nombre = cuerpo.nombre.trim();
  if (cuerpo.categoria !== undefined) producto.categoria = cuerpo.categoria.trim();
  if (cuerpo.precio !== undefined) producto.precio = cuerpo.precio;

  res.json(producto);
}

function eliminar(req, res, next) {
  const id = Number(req.params.id);
  const posicion = productos.findIndex((p) => p.id === id);

  if (posicion === -1) {
    return next(new ErrorHttp(404, "Producto no encontrado"));
  }

  productos.splice(posicion, 1);
  res.json({ success: true, mensaje: `Producto ${id} eliminado` });
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
