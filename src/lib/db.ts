import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Construct database URL from Supabase environment variables
const getDatabaseUrl = () => {
  // If DATABASE_URL is explicitly set, use it
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL
  }
  
  // Otherwise, construct from Supabase environment variables
  const host = process.env.POSTGRES_HOST || process.env.SUPABASE_URL?.replace('https://', '')
  const user = process.env.POSTGRES_USER || 'postgres'
  const password = 'A3xqZ9qgfegoCbwd' // Your database password
  const database = process.env.POSTGRES_DATABASE || 'postgres'
  const port = '5432'
  
  if (!host) {
    throw new Error('Database host not found in environment variables')
  }
  
  return `postgresql://${user}:${password}@${host}:${port}/${database}`
}

// Create a singleton Prisma client
export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// Test database connection only in non-build environments
async function testConnection() {
  try {
    // Don't try to connect during build time or in serverless environment
    if (process.env.NEXT_PHASE !== 'phase-production-build' && process.env.NODE_ENV !== 'production') {
      await db.$connect()
      console.log('Database connected successfully')
    }
  } catch (error) {
    console.error('Database connection failed:', error)
  }
}

// Only test connection in development
if (process.env.NODE_ENV === 'development') {
  testConnection()
}