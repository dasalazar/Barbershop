"use client";

import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { searchSchema, SearchSchema } from "@/lib/validations/search";

interface SearchProps {
  defaultValues?: SearchSchema;
}

export function Search({ defaultValues }: SearchProps) {
  const router = useRouter();

  const { register, handleSubmit } = useForm<SearchSchema>({
    resolver: zodResolver(searchSchema),
    defaultValues,
  });

  const handleSearchSubmit = (data: SearchSchema) => {
    router.push(`/barbershops?search=${data.search}`);
  };

  return (
    <form
      onSubmit={handleSubmit(handleSearchSubmit)}
      className="flex items-center gap-2"
    >
      <Input
        placeholder="Faça sua busca..."
        {...register("search")}
        className="w-full"
      />
      <Button type="submit">
        <SearchIcon size={18} />
      </Button>
    </form>
  );
}
