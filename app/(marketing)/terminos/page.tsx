import type { Metadata } from "next";
import { Prose } from "@/components/Prose";

export const metadata: Metadata = { title: "Términos de uso" };

export default function Page() {
  return (
    <Prose title="Términos de uso">
      <p>Última actualización: octubre de 2026.</p>
      <h2>El servicio</h2>
      <p>
        Feed Prototype es una herramienta gratuita para crear simulaciones de
        publicaciones con fines de presentación comercial. Las simulaciones no
        son publicaciones reales ni están afiliadas a ninguna red social.
      </p>
      <h2>Tu contenido</h2>
      <p>
        Eres responsable de las imágenes y textos que cargas y declaras tener
        derechos para usarlos. No cargues contenido ilegal ni que infrinja
        derechos de terceros.
      </p>
      <h2>Publicidad</h2>
      <p>
        El servicio es gratuito gracias a la publicidad. Para usar la
        herramienta debes permitir los anuncios en este sitio.
      </p>
      <h2>Disponibilidad</h2>
      <p>
        Ofrecemos el servicio tal como está y podemos modificarlo o suspenderlo.
        Te recomendamos conservar copia de tus archivos originales.
      </p>
    </Prose>
  );
}
