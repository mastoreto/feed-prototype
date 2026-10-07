import type { Metadata } from "next";
import Link from "next/link";
import { Prose } from "@/components/Prose";

export const metadata: Metadata = {
  title: "Guías para presentar un feed a un cliente",
  description:
    "Medidas, zonas seguras y buenas prácticas para mostrar propuestas de contenido en Instagram y LinkedIn.",
};

export default function Page() {
  return (
    <Prose title="Guías para presentar un feed">
      <p>
        Un feed simulado ahorra reuniones: el cliente ve lo que verá su público
        y decide con más información. Estas guías resumen lo que usamos para
        armar cada propuesta.
      </p>

      <h2>Medidas de cada formato</h2>
      <ul>
        <li>
          <b>Instagram, post y carrusel:</b> 4:5 vertical, 1080×1350 px. Es el
          formato que más espacio ocupa en el feed.
        </li>
        <li>
          <b>Instagram, historia y reel:</b> 9:16, 1080×1920 px.
        </li>
        <li>
          <b>LinkedIn, post con imagen:</b> 1:1, 1200×1200 px funciona bien en
          móvil y escritorio.
        </li>
        <li>
          <b>LinkedIn, documento:</b> carrusel en PDF, láminas en 4:5 (1080×1350
          px).
        </li>
      </ul>
      <p>
        En el editor, cada formato muestra su medida bajo el lienzo para que
        prepares los archivos al tamaño correcto.
      </p>

      <h2>Zonas seguras en historias y reels</h2>
      <p>
        La interfaz de la red tapa parte del cuadro. Arriba queda la cabecera
        con el perfil y la barra de progreso, y abajo la barra de respuesta o el
        texto del reel. Como regla práctica, reserva alrededor del 14% superior
        y el 20% inferior sin texto ni logotipos. Activa «Zonas seguras» en el
        editor para verlas sobre tu pieza.
      </p>

      <h2>Cómo escribir las notas para el cliente</h2>
      <ul>
        <li>
          Una nota por pieza, enfocada en una decisión: qué debe aprobar o
          corregir.
        </li>
        <li>
          Explica el porqué de la imagen y del llamado a la acción, no solo qué
          se ve.
        </li>
        <li>
          Indica la fecha sugerida de publicación para que el cliente valide el
          calendario.
        </li>
      </ul>

      <h2>Del borrador a la propuesta</h2>
      <p>
        Descarga la pieza con la hoja ampliada para reuniones y el feed completo
        para dar contexto. Si trabajas con varios clientes, crea una cuenta y
        guarda cada campaña por separado.
      </p>
      <p>
        <Link href="/try">
          Abre el editor y prueba con tus propias imágenes
        </Link>
        .
      </p>
    </Prose>
  );
}
