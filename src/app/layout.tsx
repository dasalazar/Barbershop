import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/components/shared/auth-provider";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Barber Shop - Agendamento para Barbearias",
  description: "Agende seus serviços favoritos na melhor barbearia perto de você.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <div className="flex-1">{children}</div>
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
