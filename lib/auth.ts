import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/lib/db";

// Origins allowed to call the auth API. BETTER_AUTH_URL must be the public site URL in production.
const trustedOrigins = [
  process.env.BETTER_AUTH_URL,
  process.env.VERCEL_PROJECT_PRODUCTION_URL &&
    `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
  process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
].filter((o): o is string => !!o);

export const auth = betterAuth({
  trustedOrigins,
  database: prismaAdapter(db, { provider: "postgresql" }),
  emailAndPassword: { enabled: true, minPasswordLength: 8 },
  socialProviders: process.env.GOOGLE_CLIENT_ID
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
      }
    : {},
  plugins: [nextCookies()], // must stay last
});
