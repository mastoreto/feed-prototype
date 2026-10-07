"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

/** Map Better Auth failures to something the user can act on. A 5xx is ours, not theirs. */
function authMessage(e: { status: number; code?: string }, signup: boolean) {
  if (e.status >= 500)
    return "El servicio no está disponible en este momento. Inténtalo de nuevo en unos minutos.";
  if (e.status === 403)
    return "No pudimos validar el origen de la solicitud. Recarga la página e inténtalo de nuevo.";
  if (e.code?.startsWith("USER_ALREADY_EXISTS"))
    return "Ya existe una cuenta con ese correo. Entra con ella.";
  if (e.code === "PASSWORD_TOO_SHORT")
    return "La contraseña debe tener al menos 8 caracteres.";
  if (e.code === "INVALID_EMAIL") return "Revisa el correo: no parece válido.";
  return signup
    ? "No pudimos crear la cuenta. Revisa los datos e inténtalo de nuevo."
    : "Correo o contraseña incorrectos.";
}

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const signup = mode === "signup";

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email"));
    const password = String(f.get("password"));
    setPending(true);
    setError("");
    const { error } = signup
      ? await authClient.signUp.email({
          name: String(f.get("name")),
          email,
          password,
        })
      : await authClient.signIn.email({ email, password });
    setPending(false);
    if (error) return setError(authMessage(error, signup));
    router.push("/dashboard");
  }

  return (
    <div className="grid min-h-dvh bg-paper md:grid-cols-2">
      <form
        onSubmit={submit}
        className="mx-auto grid w-full max-w-[480px] content-center gap-4 px-4 py-8 md:px-16"
      >
        <Link
          href="/"
          className="disp inline-flex min-h-11 items-center text-sm [font-stretch:125%]"
        >
          Feed Prototype
        </Link>
        <h1 className="disp text-[clamp(30px,4vw,44px)]">
          {signup ? "Crea tu cuenta" : "Entra y retoma tu campaña"}
        </h1>
        <p className="text-ink2">
          Guarda clientes y campañas para volver a ellas cuando el cliente pida
          cambios.
        </p>
        {process.env.NEXT_PUBLIC_GOOGLE_ENABLED && (
          <button
            type="button"
            className="btn btn-lg"
            onClick={() =>
              authClient.signIn.social({
                provider: "google",
                callbackURL: "/dashboard",
              })
            }
          >
            Continuar con Google
          </button>
        )}
        {signup && (
          <div className="grid gap-1">
            <label className="field-label" htmlFor="name">
              Nombre
            </label>
            <input
              id="name"
              name="name"
              required
              autoComplete="name"
              className="field"
            />
          </div>
        )}
        <div className="grid gap-1">
          <label className="field-label" htmlFor="email">
            Correo
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="field"
            placeholder="tu@agencia.com"
          />
        </div>
        <div className="grid gap-1">
          <label className="field-label" htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete={signup ? "new-password" : "current-password"}
            className="field"
            placeholder="Mínimo 8 caracteres"
          />
        </div>
        {error && (
          <p className="text-red" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="btn btn-pri btn-lg" disabled={pending}>
          {pending ? "Un momento…" : signup ? "Crear cuenta" : "Entrar"}
        </button>
        <p className="text-ink2">
          {signup ? "¿Ya tienes cuenta? " : "¿Sin cuenta? "}
          <Link
            href={signup ? "/login" : "/signup"}
            className="inline-block py-3 font-semibold text-brand underline underline-offset-4"
          >
            {signup ? "Entrar" : "Crear cuenta gratis"}
          </Link>
        </p>
      </form>
      <div className="hidden place-items-center bg-brand p-8 text-on-brand md:grid">
        <p className="disp max-w-[10ch] text-[clamp(40px,5vw,72px)]">
          Tu feed, antes de publicarlo
        </p>
      </div>
    </div>
  );
}
