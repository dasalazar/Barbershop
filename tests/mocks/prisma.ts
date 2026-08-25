import type { PrismaClient } from "@prisma/client";
import { beforeEach, vi } from "vitest";
import { type DeepMockProxy, mockDeep, mockReset } from "vitest-mock-extended";

vi.mock("@/lib/prisma", () => ({
  db: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(prismaMock);
});

import { db } from "@/lib/prisma";

export const prismaMock = db as unknown as DeepMockProxy<PrismaClient>;
