"use client";

import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, HomeIcon, LogInIcon, LogOutIcon } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export function SidebarSheet() {
  const { data: session } = useSession();

  return (
    <SheetContent className="overflow-y-auto">
      <SheetHeader className="text-left">
        <SheetTitle>Menu</SheetTitle>
      </SheetHeader>

      <div className="py-5 border-b border-solid">
        {session?.user ? (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={session.user.image ?? ""} />
              <AvatarFallback>{session.user.name?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold">{session.user.name}</p>
              <p className="text-xs text-gray-400">{session.user.email}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <h2 className="font-bold text-lg">Olá, faça seu login!</h2>
            <p className="text-xs text-gray-400">
              Faça login para agendar seus cortes com facilidade.
            </p>
            <Button
              className="mt-2 flex items-center justify-start gap-2"
              onClick={() => signIn("google")}
            >
              <LogInIcon size={16} />
              Fazer Login
            </Button>
          </div>
        )}
      </div>

      <div className="py-5 flex flex-col gap-2 border-b border-solid">
        <Button asChild className="justify-start gap-2" variant="ghost">
          <Link href="/">
            <HomeIcon size={18} />
            Início
          </Link>
        </Button>

        {session?.user && (
          <Button asChild className="justify-start gap-2" variant="ghost">
            <Link href="/bookings">
              <CalendarIcon size={18} />
              Agendamentos
            </Link>
          </Button>
        )}
      </div>

      {session?.user && (
        <div className="py-5">
          <Button
            variant="ghost"
            className="justify-start gap-2 w-full text-red-500 hover:text-red-600 hover:bg-red-500/10"
            onClick={() => signOut()}
          >
            <LogOutIcon size={18} />
            Sair da conta
          </Button>
        </div>
      )}
    </SheetContent>
  );
}
