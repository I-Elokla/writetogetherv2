import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
 
const prisma = new PrismaClient();
 
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mysql",
  }),
  // TODO: Remove this comment
  // You can add other stuff like Github, gmail etc
  emailAndPassword: {
    enabled: true,
  }
});