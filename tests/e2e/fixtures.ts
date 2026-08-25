import { readFileSync } from "node:fs";
import path from "node:path";

export interface E2EFixtures {
  barbershopId: string;
  serviceId: string;
  sessionToken: string;
}

export function readFixtures(): E2EFixtures {
  const raw = readFileSync(path.join(__dirname, ".fixtures.json"), "utf-8");
  return JSON.parse(raw) as E2EFixtures;
}
