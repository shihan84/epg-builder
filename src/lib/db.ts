import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create a singleton Prisma client
export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// Test database connection
async function testConnection() {
  try {
    await db.$connect()
    console.log('Database connected successfully')
  } catch (error) {
    console.error('Database connection failed:', error)
  }
}

// Only test connection in development or when explicitly requested
if (process.env.NODE_ENV === 'development') {
  testConnection()
}