import type { Metadata } from "next";
import { Prose } from "@/components/Prose";

export const metadata: Metadata = { title: "Privacidad y cookies" };

export default function Page() {
  return (
    <Prose title="Privacidad y cookies">
      <p>Última actualización: octubre de 2026.</p>
      <h2>Qué datos tratamos</h2>
      <ul>
        <li>
          <b>Cuenta:</b> nombre, correo y una contraseña cifrada si creas una
          cuenta.
        </li>
        <li>
          <b>Contenido:</b> clientes, campañas, textos e imágenes que guardas en
          tu cuenta.
        </li>
        <li>
          <b>Borradores sin cuenta:</b> se guardan solo en tu navegador
          (almacenamiento local) y no se envían a nuestros servidores.
        </li>
      </ul>
      <h2>Publicidad y cookies</h2>
      <p>
        Este sitio se financia con publicidad de Google AdSense. Google y sus
        socios pueden usar cookies para mostrar anuncios. En las regiones donde
        la ley lo exige, te pediremos tu consentimiento antes de cargarlos.
        Puedes cambiar tu elección y consultar cómo usa Google los datos en{" "}
        <a href="https://policies.google.com/technologies/partner-sites">
          policies.google.com/technologies/partner-sites
        </a>
        .
      </p>
      <p>
        Usamos además una cookie de sesión necesaria para mantenerte conectado.
      </p>
      <h2>Tus derechos</h2>
      <p>
        Puedes pedir acceso, corrección o eliminación de tus datos
        escribiéndonos. Al eliminar un cliente o campaña se borran también sus
        piezas.
      </p>
    </Prose>
  );
}
