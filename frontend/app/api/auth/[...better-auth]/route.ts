import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

export const { GET, POST } = betterAuth({
  plugins: [nextCookies()],
  secret: process.env.BETTER_AUTH_SECRET!,
  db: {
    provider: "postgresql",
    url: process.env.DATABASE_URL!,
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    expiresIn: 24 * 60 * 60, // 24 hours
  },
  user: {
    additionalFields: {
      name: {
        type: "string",
        required: true,
      },
      username: {
        type: "string",
        required: true,
      },
    },
  },
});