import type { Platform, PostDraft, Profile } from "./types";

export const sampleProfile: Profile = {
  name: "Café Almanaque",
  handle: "cafealmanaque",
  campaign: "Lanzamiento Cerro Alto",
};

const p = (
  id: string,
  img: number,
  caption: string,
  hashtags: string,
  notes: string,
  format: PostDraft["format"] = "post",
): PostDraft => ({
  id,
  format,
  caption,
  hashtags,
  notes,
  media: [`art:${img}`],
  scheduledAt: null,
});

// Fixed ids so server and client render the same markup.
export const samplePosts: Record<Platform, PostDraft[]> = {
  INSTAGRAM: [
    p(
      "s-ig-1",
      0,
      "Llega Cerro Alto, nuestro blend de temporada. Cacao, naranja y panela en cada taza. Desde el viernes en las tres sucursales y en la tienda en línea.",
      "#cafedeespecialidad #cerroalto #almanaque",
      "Primera pieza de la campaña. Mostramos el producto en taza antes que en bolsa para vender la experiencia.",
    ),
    p(
      "s-ig-2",
      1,
      "Del cultivo a tu mesa: así llega el grano que tostamos cada mañana.",
      "#origen #caficultores",
      "Pieza de origen. Imagen real de la finca del proveedor en la versión final.",
    ),
    p(
      "s-ig-3",
      2,
      "Cold brew listo para llevar. 12 horas de infusión, cero prisa.",
      "#coldbrew #parallevar",
      "Producto nuevo en formato botella. Sugerimos publicarlo el jueves por la tarde.",
    ),
    p(
      "s-ig-4",
      5,
      "Suscripción mensual: recibe un café distinto cada mes y cambia cuando quieras.",
      "#suscripcion #almanaque",
      "Llamado a la acción hacia la tienda. Enlace en bio.",
    ),
  ],
  LINKEDIN: [
    p(
      "s-li-1",
      2,
      "Cuando lanzamos Cerro Alto, el reto no era el sabor, era contar su origen.\n\nEn tres meses trabajamos con 14 familias caficultoras para trazar cada lote.\n\nLo que aprendimos sobre trazabilidad:\n• Medir antes de comunicar\n• Documentar cada cosecha\n• Pagar por calidad, no por volumen",
      "#cafe #trazabilidad #marca",
      "Post de liderazgo de opinión. Sin imagen de producto para que el texto lleve el mensaje.",
    ),
    p(
      "s-li-2",
      1,
      "Abrimos nuestra tercera sucursal en Chapinero. Gracias a quienes nos acompañan desde el primer día.",
      "#crecimiento #equipo",
      "Anuncio corporativo con foto del equipo en la versión final.",
    ),
    p(
      "s-li-3",
      4,
      "Tendencias 2026 en café de especialidad. Guía descargable en el documento adjunto.",
      "#tendencias #cafedeespecialidad",
      "Formato documento (carrusel PDF). Cada diapositiva es una página.",
      "doc",
    ),
  ],
};
