"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-5">
      <div className="flex flex-col items-center text-center max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-2">Acesse sua conta</h1>
        <p className="text-sm text-gray-400 mb-6">
          Faça login com o Google para agendar serviços em suas barbearias preferidas.
        </p>

        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          <LogIn size={18} />
          Entrar com Google
        </Button>
      </div>
    </div>
  );
}
