import { PrismaClient } from "@prisma/client";

// One client per process: Next's dev reloads would otherwise open a new connection pool each time.
const g = globalThis as unknown as { prisma?: PrismaClient };
export const db = g.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") g.prisma = db;
