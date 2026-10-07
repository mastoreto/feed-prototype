import type { Metadata } from "next";
import { AuthForm } from "@/features/app/AuthForm";

export const metadata: Metadata = { title: "Entrar" };

export default function Page() {
  return <AuthForm mode="login" />;
}
