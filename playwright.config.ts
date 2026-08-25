import path from "node:path";
import { defineConfig, devices } from "@playwright/test";
import { config } from "dotenv";

config({ path: path.resolve(__dirname, ".env.test"), override: true });

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  reporter: "line",
  globalSetup: require.resolve("./tests/e2e/global-setup.ts"),
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run build && npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
