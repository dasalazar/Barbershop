import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

import { Search } from "@/components/shared/search";

describe("Search", () => {
  beforeEach(() => {
    pushMock.mockReset();
  });

  it("navigates to the search results page with the typed term", async () => {
    const user = userEvent.setup();
    render(<Search />);

    await user.type(screen.getByPlaceholderText("Faça sua busca..."), "corte");
    await user.click(screen.getByRole("button"));

    expect(pushMock).toHaveBeenCalledWith("/barbershops?search=corte");
  });

  it("does not navigate when the field is submitted empty", async () => {
    const user = userEvent.setup();
    render(<Search />);

    await user.click(screen.getByRole("button"));

    expect(pushMock).not.toHaveBeenCalled();
  });

  it("pre-fills the field from defaultValues", () => {
    render(<Search defaultValues={{ search: "barba" }} />);

    expect(screen.getByPlaceholderText("Faça sua busca...")).toHaveValue("barba");
  });
});
