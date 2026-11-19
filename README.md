# Admin Stock

Panel para llevar el inventario de un negocio pequeño: **productos**, **compras por lote** y **ventas**, con el stock y la ganancia calculados solos.

Cada compra crea un lote con su costo; cada venta descuenta de un lote concreto. Así la ganancia de una venta es `precio de venta − costo de ese lote`, aunque el mismo producto se haya comprado a precios distintos.

## Qué hace

- **Dashboard:** número de productos, valor del inventario, ventas, ganancia y lista de productos con stock bajo (≤ 5) o agotados.
- **Productos:** crear, editar y eliminar. Un producto con compras registradas no se puede eliminar (409), para no dejar el historial huérfano.
- **Compras:** registra un lote (producto, cantidad, costo unitario). El stock del lote empieza igual a la cantidad.
- **Ventas:** se elige el lote, la cantidad y el precio. Si no alcanza el stock responde `409`.
- **Acceso con cuenta** (Clerk): sin sesión, las páginas redirigen al login y la API responde `401`.

## Decisiones de diseño

- **La API no confía en el formulario:** todo se valida en `src/lib/validate.ts` (con pruebas) antes de tocar la base.
- **Venta atómica:** el descuento de stock es un `UPDATE … WHERE stock >= cantidad` dentro de una transacción. Dos ventas simultáneas no pueden llevarse las mismas últimas unidades ni dejar el stock negativo.
- **Todas las rutas pasan por un único guardián** (`src/lib/route.ts`): sesión obligatoria y errores inesperados registrados, sin filtrar detalles al cliente.

## Stack

Next.js 15 (App Router), React 19, TypeScript, Prisma + PostgreSQL, Clerk, Tailwind CSS + shadcn/ui.

## Cómo correrlo

1. Necesitas un PostgreSQL (local con Docker: `docker run -d -p 5433:5432 -e POSTGRES_PASSWORD=stock -e POSTGRES_DB=stock postgres:16-alpine`) y una app gratis en [Clerk](https://clerk.com).
2. Crea `.env`:

   ```env
   DATABASE_URL=postgres://postgres:stock@localhost:5433/stock
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

3. Instala, crea las tablas y (opcional) carga datos de ejemplo:

   ```bash
   npm install
   npm run db:push
   npm run seed
   npm run dev
   ```

Pruebas: `npm test`.

## Límites

Los datos son compartidos entre todos los usuarios con cuenta (no hay separación por negocio), no se pueden anular compras ni ventas, y las ventas se hacen sobre un lote elegido a mano, no con descuento automático por antigüedad. Es un proyecto de práctica.

Empezó como una guía de clase (Walver); la API, la validación, las compras, las ventas y el dashboard son propios.
