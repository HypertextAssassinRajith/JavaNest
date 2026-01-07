import { PrismaClient } from "@prisma/client";

// Prevent creating many PrismaClients in dev with hot reload / nodemon
const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
