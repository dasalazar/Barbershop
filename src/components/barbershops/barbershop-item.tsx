import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Barbershop } from "@prisma/client";

interface BarbershopItemProps {
  barbershop: Barbershop;
}

export function BarbershopItem({ barbershop }: BarbershopItemProps) {
  return (
    <Card className="min-w-[167px] max-w-[167px] rounded-2xl overflow-hidden">
      <CardContent className="p-0">
        <div className="relative h-[159px] w-full p-2">
          <div className="absolute top-3 left-3 z-10">
            <Badge
              variant="secondary"
              className="flex items-center gap-1 opacity-90"
            >
              <StarIcon size={12} className="fill-primary text-primary" />
              <span className="text-xs font-semibold">5,0</span>
            </Badge>
          </div>
          <Image
            src={barbershop.imageUrl}
            alt={barbershop.name}
            fill
            className="object-cover rounded-2xl"
          />
        </div>

        <div className="px-3 pb-3">
          <h2 className="font-bold mt-2 overflow-hidden text-ellipsis text-nowrap">
            {barbershop.name}
          </h2>
          <p className="text-sm text-gray-400 overflow-hidden text-ellipsis text-nowrap">
            {barbershop.address}
          </p>
          <Button variant="secondary" className="w-full mt-3" asChild>
            <Link href={`/barbershops/${barbershop.id}`}>Reservar</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
