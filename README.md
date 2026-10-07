# Feed Prototype

Simula feeds de Instagram y LinkedIn con las piezas de un cliente y descarga la imagen (pieza, feed, historia, reel) con una hoja de notas para propuestas comerciales. Gratis, con AdSense discreto y muro de bloqueadores.

Stack: Next 16 (App Router, Cache Components) · Tailwind 4 · tRPC 11 + TanStack Query · Prisma 7 + Postgres · Better Auth · framer-motion · dnd-kit · html-to-image.

## Arrancar

```bash
cp .env.example .env            # STORAGE_DATABASE_URL, BETTER_AUTH_SECRET…
bun run db:up                   # Postgres local en Docker (docker-compose.yml)
bun install                     # genera el cliente de Prisma
bun run db:migrate
bun run dev
```

Rutas: `/` landing · `/try` editor sin cuenta (borrador en localStorage) · `/login` `/signup` · `/dashboard` · `/clients/[id]` · `/campaigns/[id]` · `/guias` `/privacidad` `/terminos` · `/ads.txt`.

## Producción

Variables obligatorias: `STORAGE_DATABASE_URL`, `BETTER_AUTH_SECRET` y `BETTER_AUTH_URL` (la URL pública real). Si el proveedor ofrece una conexión directa (`STORAGE_DATABASE_URL_UNPOOLED`), las migraciones la usan.

**Las migraciones deben aplicarse a la base de producción.** En Vercel lo hace el script `vercel-build` (`prisma migrate deploy && next build`) en cada despliegue. En otro proveedor, usa ese mismo comando como build o ejecuta `bunx prisma migrate deploy` con la URL de producción antes de arrancar. Sin ellas, el registro falla con «The table `public.User` does not exist». Si los despliegues de vista previa comparten la base de producción, restringe `vercel-build` a producción o usa una base aparte.

## Notas sobre la pieza

En el editor, «Anotar» (o «Añadir nota» con teclado) coloca pines rojos sobre la pieza con su texto. Se guardan por publicación (`Post.pins`, porcentajes de la pieza) y se exportan en la imagen junto a la lista numerada de la hoja ampliada.

## Verificar

`bun run lint` · `bun run typecheck` · `bun run build`. Con el servidor de producción y la base Docker arriba, `bun run e2e` comprueba registro, CRUD, guardado y que un usuario no accede a datos de otro.

## Estructura

- `features/platforms` — un único `PostDraft`; cada red es un renderer (`render.tsx`) + entrada en `types.ts`. Añadir una red = renderers nuevos y sus formatos.
- `features/editor` — editor (lista con dnd-kit, lienzo, inspector). `features/export` — hoja ampliada y PNG.
- `features/ads` — `AdSlot`, `AdBlockGate`. Los anuncios nunca están dentro de la superficie exportada.
- `server/routers` — tRPC; toda consulta filtra por el usuario dueño. `proxy.ts` solo hace una comprobación optimista de la cookie.

## AdSense

Define `NEXT_PUBLIC_ADSENSE_CLIENT` y los `NEXT_PUBLIC_ADSENSE_SLOT_*`. Sin ellos se muestran marcadores y el muro no se activa. El muro está activo en producción cuando hay `CLIENT`; fuérzalo en desarrollo con `NEXT_PUBLIC_ADBLOCK_GATE=on`. Funciona solo en el cliente, por lo que un usuario decidido puede saltárselo.

## Limitaciones conocidas

- Las imágenes subidas se reducen a JPEG (máx. 1350 px) y se guardan como data URL en Postgres. Si las filas pesan mucho, pasar a almacenamiento de objetos.
- El autoguardado se vacía al cambiar de pestaña, pero un cierre brusco puede perder los últimos 900 ms.
- Los textos legales son genéricos: revísalos antes de publicar.
