import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  // Migrations need a direct connection (advisory locks do not work through a pooler).
  datasource: {
    url:
      process.env.STORAGE_DATABASE_URL_UNPOOLED ?? env("STORAGE_DATABASE_URL"),
  },
});
