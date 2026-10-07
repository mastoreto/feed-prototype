import { Suspense } from "react";
import { ClientView } from "./view";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<p className="lab p-8 text-ink2">Cargando…</p>}>
      <Inner params={params} />
    </Suspense>
  );
}

async function Inner({ params }: { params: Promise<{ id: string }> }) {
  return <ClientView id={(await params).id} />;
}
