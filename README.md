# API de productos

API REST para gestionar un catálogo de productos, hecha con Node.js y Express.

## Características

- CRUD completo de productos
- Validación de datos
- Búsqueda, filtros y paginación
- Autenticación por API key en las operaciones de escritura
- Manejo de errores centralizado

## Requisitos

- Node.js 18 o superior

## Instalación

```bash
git clone <URL-del-repositorio>
cd api-productos-final
npm install
npm start
```

La API se inicia en `http://localhost:3000`.

## Variables de entorno

| Variable  | Descripción                                   | Por defecto          |
|-----------|-----------------------------------------------|----------------------|
| `PORT`    | Puerto en el que escucha la API               | `3000`               |
| `API_KEY` | Clave exigida en POST, PUT y DELETE           | `clave-secreta-123`  |

## Endpoints

| Método | Ruta               | Descripción                    | Requiere API key |
|--------|--------------------|--------------------------------|------------------|
| GET    | `/productos`       | Lista productos (con filtros)  | No               |
| GET    | `/productos/:id`   | Devuelve un producto           | No               |
| POST   | `/productos`       | Crea un producto               | Sí               |
| PUT    | `/productos/:id`   | Modifica un producto           | Sí               |
| DELETE | `/productos/:id`   | Elimina un producto            | Sí               |

## Búsqueda, filtros y paginación

`GET /productos` admite estos parámetros, que se pueden combinar:

| Parámetro    | Descripción                                          |
|--------------|------------------------------------------------------|
| `buscar`     | Texto que debe contener el nombre                    |
| `categoria`  | Categoría exacta (sin distinguir mayúsculas)         |
| `precioMin`  | Precio mínimo                                        |
| `precioMax`  | Precio máximo                                        |
| `page`       | Número de página (por defecto `1`)                   |
| `limit`      | Productos por página (por defecto `5`, máximo `50`)  |

Ejemplos:

```text
GET /productos?categoria=audio
GET /productos?buscar=ra&precioMax=100
GET /productos?page=2&limit=3
```

Respuesta:

```json
{
  "total": 8,
  "page": 1,
  "limit": 5,
  "totalPaginas": 2,
  "datos": [
    { "id": 1, "nombre": "Portátil", "categoria": "informática", "precio": 899 }
  ]
}
```

## Autenticación

Las peticiones POST, PUT y DELETE necesitan la cabecera `x-api-key`:

```text
x-api-key: clave-secreta-123
```

Sin ella, o con una clave incorrecta, la API responde `401`.

## Ejemplos

Crear un producto:

```http
POST /productos
x-api-key: clave-secreta-123
Content-Type: application/json

{ "nombre": "Webcam", "categoria": "informática", "precio": 49 }
```

Modificar solo el precio:

```http
PUT /productos/1
x-api-key: clave-secreta-123
Content-Type: application/json

{ "precio": 799 }
```

## Códigos de respuesta

| Código | Significado                                      |
|--------|--------------------------------------------------|
| 200    | Correcto                                         |
| 201    | Producto creado                                  |
| 400    | Datos o parámetros inválidos                     |
| 401    | Falta la API key o es incorrecta                 |
| 404    | Producto o ruta no encontrados                   |
| 500    | Error interno del servidor                       |

Todos los errores tienen este formato:

```json
{ "success": false, "error": "Producto no encontrado" }
```

## Estructura del proyecto

```text
api-productos-final/
├── server.js
├── routes/
│   └── productos.js
├── controllers/
│   └── productosController.js
├── middlewares/
│   ├── ErrorHttp.js
│   ├── logger.js
│   ├── manejadorErrores.js
│   └── verificarApiKey.js
└── data/
    └── productos.js
```

Los datos se guardan en memoria, así que se restablecen cada vez que se reinicia el servidor.

## Despliegue

URL en Render: _pendiente de publicar_
