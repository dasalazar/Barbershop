"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { SidebarSheet } from "@/components/shared/sidebar-sheet";
import { MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <Card className="rounded-none border-t-0 border-r-0 border-l-0">
      <CardContent className="p-5 flex flex-row items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-lg text-primary">Barber</span>
            <span className="font-bold text-lg text-white">Shop</span>
          </div>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SidebarSheet />
        </Sheet>
      </CardContent>
    </Card>
  );
}
