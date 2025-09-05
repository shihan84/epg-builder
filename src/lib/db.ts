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

// Test database connection only in non-build environments
async function testConnection() {
  try {
    // Don't try to connect during build time
    if (process.env.NEXT_PHASE !== 'phase-production-build') {
      await db.$connect()
      console.log('Database connected successfully')
    }
  } catch (error) {
    console.error('Database connection failed:', error)
  }
}

// Only test connection in development or when explicitly requested
if (process.env.NODE_ENV === 'development') {
  testConnection()
}