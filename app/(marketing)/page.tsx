import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { AdSlot } from "@/features/ads/AdSlot";
import { Sheet } from "@/features/export/Sheet";
import { Piece } from "@/features/platforms/render";
import { samplePosts, sampleProfile } from "@/features/platforms/sample";

const post = samplePosts.INSTAGRAM[0];
const FORMATS = [
  ["4:5", "Instagram · Post y carrusel", "1080×1350"],
  ["3×N", "Instagram · Grilla de perfil", "3 columnas"],
  ["9:16", "Instagram · Historia y Reel", "1080×1920"],
  ["1:1", "LinkedIn · Post", "1200×1200"],
  ["4:5", "LinkedIn · Documento", "PDF por láminas"],
  ["1:N", "LinkedIn · Feed", "timeline"],
];
const STEPS = [
  [
    "Elige la red y el formato",
    "Instagram o LinkedIn. Después se sumarán más.",
  ],
  [
    "Monta las piezas",
    "Arrastra imágenes, escribe el copy y reordena el feed.",
  ],
  [
    "Descarga con notas",
    "El feed o cada pieza, con la hoja ampliada para el cliente.",
  ],
];
const FAQ = [
  [
    "¿Aparecen logos de Instagram o LinkedIn?",
    "No. Reproducimos la estructura con iconos genéricos para que se entienda, sin usar marcas.",
  ],
  [
    "¿Guardan mis imágenes?",
    "Solo si guardas la campaña en tu cuenta. Los borradores sin cuenta se quedan en tu navegador.",
  ],
  [
    "¿Puedo descargar una historia o un reel?",
    "Sí. En el editor puedes activar zonas seguras para ver qué tapa la interfaz de la red.",
  ],
];
const pad = "px-4 md:px-14";

export default function Home() {
  return (
    <div className="bg-paper">
      <section
        className={`bg-brand pb-[clamp(80px,9vw,120px)] text-on-brand ${pad}`}
      >
        <nav
          className="flex items-center gap-5 pb-2 pt-4"
          aria-label="Principal"
        >
          <span className="disp mr-auto text-sm [font-stretch:125%]">
            Feed Prototype
          </span>
          <Link
            href="/guias"
            className="hidden min-h-11 items-center px-2.5 font-medium sm:flex"
          >
            Guías
          </Link>
          <Link
            href="/login"
            className="inline-flex min-h-11 items-center border-[1.5px] border-current px-3.5 font-semibold"
          >
            Entrar
          </Link>
        </nav>
        <h1 className="disp mb-7 mt-[clamp(40px,7vw,84px)] max-w-[14ch] text-[clamp(44px,9.2vw,96px)]">
          Muestra el feed antes de publicarlo
        </h1>
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-5">
          <p className="max-w-[38ch] text-[clamp(17px,2vw,21px)] leading-snug">
            Carga las imágenes y los textos de tu cliente, míralos montados en
            un feed realista y descarga la imagen para tu propuesta, con las
            notas ya escritas.
          </p>
          <div className="flex flex-wrap items-center gap-4 max-md:w-full max-md:flex-col max-md:items-stretch">
            <Link href="/try" className="btn btn-wht btn-lg">
              Crear un feed <ArrowRight className="i" />
            </Link>
            <span className="lab text-center">Gratis · sin tarjeta</span>
          </div>
        </div>
      </section>

      <section
        className={`relative -mt-[clamp(56px,7vw,92px)] ${pad}`}
        aria-label="Ejemplo"
      >
        <div className="rule flex flex-wrap items-start justify-center gap-[clamp(18px,3vw,40px)] bg-paper p-[clamp(18px,3vw,40px)]">
          <div className="relative w-[min(320px,100%)] max-md:pl-3">
            <Piece platform="INSTAGRAM" post={post} profile={sampleProfile} />
            <span className="pin" style={{ top: "34%" }}>
              1
            </span>
            <span className="pin" style={{ top: "80%" }}>
              2
            </span>
            <span className="pin" style={{ top: "89%" }}>
              3
            </span>
          </div>
          <div className="w-[min(300px,100%)] [&_.sheet]:w-full">
            <Sheet
              platform="INSTAGRAM"
              post={post}
              profile={sampleProfile}
              pins
            />
          </div>
        </div>
        <p className="lab pt-2.5 text-ink2">
          Fig. 1 — Pieza de Instagram y su hoja para el cliente
        </p>
      </section>

      <section className={`bg-paper pt-[clamp(40px,6vw,84px)] ${pad}`}>
        <h2 className="disp max-w-[16ch] text-[clamp(28px,4.4vw,52px)]">
          Cada pieza, en su medida real
        </h2>
        <ul className="rule-t m-0 mt-7 list-none p-0">
          {FORMATS.map(([r, n, s]) => (
            <li
              key={n}
              className="rule-b grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-4 px-1 py-3 md:grid-cols-[minmax(110px,.9fr)_minmax(0,1.3fr)_minmax(0,1fr)] md:py-3.5"
            >
              <span className="disp row-span-2 min-w-[92px] text-[30px] [font-stretch:125%] md:row-span-1 md:text-[clamp(30px,5vw,56px)]">
                {r}
              </span>
              <span className="text-base font-bold [font-stretch:110%] md:text-lg">
                {n}
              </span>
              <span className="font-mono text-xs md:text-right">{s}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 max-w-[60ch] text-ink2">
          Copiamos la estructura que ve el público: cabecera, acciones,
          contadores, texto truncado. Sin logos ni marcas de las redes.
        </p>
      </section>

      <section className={`bg-paper pt-[clamp(40px,6vw,84px)] ${pad}`}>
        <h2 className="disp max-w-[16ch] text-[clamp(28px,4.4vw,52px)]">
          De los archivos al PNG en tres pasos
        </h2>
        <ol className="rule-t m-0 mt-7 grid list-none p-0 md:grid-cols-3">
          {STEPS.map(([t, d], i) => (
            <li
              key={t}
              className="grid content-start gap-1.5 py-4 pr-5 max-md:[&:not(:first-child)]:rule-t md:[&:not(:first-child)]:rule-l md:[&:not(:first-child)]:pl-5"
            >
              <span className="font-mono text-xs text-red">PASO {i + 1}</span>
              <b className="text-[22px] leading-tight [font-stretch:112%]">
                {t}
              </b>
              <span className="max-w-[30ch] text-ink2">{d}</span>
            </li>
          ))}
        </ol>
      </section>

      <section
        className={`grid gap-8 bg-paper pt-[clamp(40px,6vw,84px)] md:grid-cols-2 md:gap-14 ${pad}`}
      >
        <div>
          <h2 className="disp max-w-[16ch] text-[clamp(28px,4.4vw,52px)]">
            Gratis, con publicidad discreta
          </h2>
          <p className="mt-4 max-w-[48ch] text-ink2">
            Feed Prototype se financia con anuncios. Mostramos pocos, lejos de
            tu trabajo, y nunca aparecen en la imagen descargada.
          </p>
        </div>
        <div className="grid content-start gap-4">
          <p className="text-ink2">
            Para usar la herramienta necesitas desactivar el bloqueador de
            anuncios en este sitio.
          </p>
          <AdSlot kind="content" />
        </div>
      </section>

      <section
        className={`max-w-[900px] bg-paper pt-[clamp(40px,6vw,84px)] ${pad}`}
      >
        <h2 className="disp mb-5 max-w-[16ch] text-[clamp(28px,4.4vw,52px)]">
          Preguntas frecuentes
        </h2>
        {FAQ.map(([q, a], i) => (
          <details
            key={q}
            className={`rule-t py-3.5 ${i === FAQ.length - 1 ? "rule-b" : ""}`}
          >
            <summary className="cursor-pointer py-2 text-lg font-bold [font-stretch:108%]">
              {q}
            </summary>
            <p className="mt-2 max-w-[60ch] text-ink2">{a}</p>
          </details>
        ))}
      </section>
      <div className="bg-paper pt-[clamp(40px,6vw,84px)]" />
      <SiteFooter />
    </div>
  );
}
