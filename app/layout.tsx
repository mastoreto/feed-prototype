import type { Metadata } from "next";
import { Archivo, DM_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});
const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Feed Prototype", template: "%s · Feed Prototype" },
  description:
    "Simula feeds de Instagram y LinkedIn con las piezas de tu cliente y descarga la imagen para tu propuesta comercial.",
};

const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${archivo.variable} ${dmMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {children}
        {client && (
          <>
            {/* Funding Choices: consent message (EEA/UK) managed from the AdSense dashboard */}
            <Script
              id="fc"
              strategy="afterInteractive"
              src={`https://fundingchoicesmessages.google.com/i/${client.replace("ca-", "")}?ers=1`}
            />
            <Script
              id="adsense"
              strategy="afterInteractive"
              crossOrigin="anonymous"
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
            />
          </>
        )}
      </body>
    </html>
  );
}
