# Feed Prototype

Simula feeds de Instagram y LinkedIn con las piezas de un cliente y descarga la imagen (pieza, feed, historia, reel) con una hoja de notas para propuestas comerciales. Gratis, con AdSense discreto y muro de bloqueadores.

Stack: Next 16 (App Router, Cache Components) · Tailwind 4 · tRPC 11 + TanStack Query · Prisma 7 + Postgres · Better Auth · framer-motion · dnd-kit · html-to-image.

## Arrancar

```bash
cp .env.example .env            # DATABASE_URL, BETTER_AUTH_SECRET…
docker run -d --name feedproto-pg -e POSTGRES_PASSWORD=feed -e POSTGRES_DB=feedprototype -p 54329:5432 postgres:17-alpine
bun install                     # genera el cliente de Prisma
bun run db:migrate
bun run dev
```

Rutas: `/` landing · `/try` editor sin cuenta (borrador en localStorage) · `/login` `/signup` · `/dashboard` · `/clients/[id]` · `/campaigns/[id]` · `/guias` `/privacidad` `/terminos` · `/ads.txt`.

## Estructura

- `features/platforms` — un único `PostDraft`; cada red es un renderer (`render.tsx`) + entrada en `types.ts`. Añadir una red = renderers nuevos y sus formatos.
- `features/editor` — editor (lista con dnd-kit, lienzo, inspector). `features/export` — hoja ampliada y PNG.
- `features/ads` — `AdSlot`, `AdBlockGate`. Los anuncios nunca están dentro de la superficie exportada.
- `server/routers` — tRPC; toda consulta filtra por el usuario dueño. `proxy.ts` solo hace una comprobación optimista de la cookie.

## AdSense

Define `NEXT_PUBLIC_ADSENSE_CLIENT` y los `NEXT_PUBLIC_ADSENSE_SLOT_*`. Sin ellos se muestran marcadores y el muro no se activa. El muro está activo en producción cuando hay `CLIENT`; fuérzalo en desarrollo con `NEXT_PUBLIC_ADBLOCK_GATE=on`. Funciona solo en el cliente, por lo que un usuario decidido puede saltárselo.

## Limitaciones conocidas

- Las imágenes subidas se reducen a JPEG (máx. 1350 px) y se guardan como data URL en Postgres. Si las filas pesan mucho, pasar a almacenamiento de objetos.
- El autoguardado no se vacía al cerrar la pestaña (debounce de 900 ms).
- Los textos legales son genéricos: revísalos antes de publicar.
