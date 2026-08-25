import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
}));
vi.mock("next-auth/react", () => ({
  useSession: () => ({ data: null, status: "unauthenticated" }),
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

import { BarbershopInfo } from "@/components/barbershops/barbershop-info";
import { BarbershopItem } from "@/components/barbershops/barbershop-item";
import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
import { SidebarSheet } from "@/components/shared/sidebar-sheet";
import { Sheet } from "@/components/ui/sheet";

const barbershop = {
  id: "shop-1",
  name: "Barbearia Vintage",
  address: "Rua das Flores, 789",
  imageUrl: "https://example.com/shop.png",
  phones: [],
  description: "desc",
  createdAt: new Date(),
  updatedAt: new Date(),
} as never;

describe("presentational components", () => {
  it("BarbershopItem renders the name, address and a reservation link", () => {
    render(<BarbershopItem barbershop={barbershop} />);

    expect(screen.getByText("Barbearia Vintage")).toBeInTheDocument();
    expect(screen.getByText("Rua das Flores, 789")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Reservar" })).toHaveAttribute(
      "href",
      "/barbershops/shop-1"
    );
  });

  it("BarbershopInfo renders the barbershop header details", () => {
    render(<BarbershopInfo barbershop={barbershop} />);

    expect(
      screen.getByRole("heading", { name: "Barbearia Vintage" })
    ).toBeInTheDocument();
    expect(screen.getByText("Rua das Flores, 789")).toBeInTheDocument();
  });

  it("Header renders the brand and a menu trigger", () => {
    render(<Header />);

    expect(screen.getByText("Barber")).toBeInTheDocument();
    expect(screen.getByText("Shop")).toBeInTheDocument();
  });

  it("Footer renders the copyright notice", () => {
    render(<Footer />);

    expect(screen.getByText(/Copyright/)).toBeInTheDocument();
  });

  it("SidebarSheet shows a login prompt for guests", () => {
    render(
      <Sheet open>
        <SidebarSheet />
      </Sheet>
    );

    expect(screen.getByText("Olá, faça seu login!")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Fazer Login/ })).toBeInTheDocument();
  });
});
