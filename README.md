# Marketplace Global — Asmyne Group (MVP)

Marketplace independiente (tipo Mercado Libre) para Asmyne Group. Vive separado del sitio principal para aislar el tráfico.

**Stack:** Node 20+ · Express · EJS (SSR) · MongoDB (Mongoose) · imágenes en GridFS (re-codificadas a WebP con sharp).

## Funciones
- Registro / login (bcrypt + JWT en cookie httpOnly), cuentas comprador y vendedor, rate limit en auth.
- Panel de vendedor: crear / editar / pausar / eliminar publicaciones con hasta 6 fotos (JPG/PNG/WebP, 5 MB c/u).
- Catálogo: inicio (destacados + recientes), 30 categorías, búsqueda con filtros (categoría, precio, estado), orden, paginación, ficha con galería e info del vendedor.
- Mensajes internos comprador ↔ vendedor.
- Moderación (rol admin): aprobar / retirar / destacar / eliminar publicaciones, suspender usuarios.
- i18n ES (por defecto) / EN / FR con detección del navegador y selector persistente (cookie).
- Pagos: stub de Stripe Connect en `src/lib/payments.js` (fase 2).

## Variables de entorno
| Variable | Uso |
|---|---|
| `MONGO_URL` | Cadena de conexión MongoDB (requerida) |
| `JWT_SECRET` | Secreto de sesión (requerido en producción) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Crea/promueve la cuenta admin al arrancar |
| `REQUIRE_APPROVAL` | `true` = publicaciones nuevas quedan "en revisión" |
| `SEED_DEMO` | `false` para no sembrar publicaciones demo |
| `MAIN_SITE_URL` | Enlace de vuelta al sitio principal |

Nunca guardes secretos en el repositorio.

## Local
```bash
npm install
MONGO_URL=mongodb://127.0.0.1:27017/marketplace npm run dev
```
