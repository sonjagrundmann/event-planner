
import { PrismaClient } from "../generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const isVercel = !!process.env.VERCEL;

const adapter = isVercel
  ? new PrismaNeon({
      connectionString: process.env.DATABASE_URL!,
    })
  : new PrismaPg(
      new Pool({
        connectionString: process.env.DATABASE_URL!,
      })
    );

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}