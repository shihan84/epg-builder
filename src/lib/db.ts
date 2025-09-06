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
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const postgresHost = process.env.POSTGRES_HOST
  const postgresUser = process.env.POSTGRES_USER || 'postgres'
  const postgresDatabase = process.env.POSTGRES_DATABASE || 'postgres'
  
  // Try to extract host from Supabase URL
  let host = postgresHost
  if (!host && supabaseUrl) {
    // Convert Supabase URL to database host
    // e.g., https://ijklmnopqrs.supabase.co -> db.ijklmnopqrs.supabase.co
    const urlMatch = supabaseUrl.match(/https:\/\/([^\.]+)/)
    if (urlMatch) {
      const projectId = urlMatch[1]
      host = `db.${projectId}.supabase.co`
    }
  }
  
  if (!host) {
    throw new Error('Database host not found in environment variables')
  }
  
  // Try to get password from various sources
  const password = process.env.SUPABASE_SERVICE_ROLE_KEY || 
                     process.env.SUPABASE_ANON_KEY ||
                     'A3xqZ9qgfegoCbwd' // fallback to known password
  
  return `postgresql://${postgresUser}:${password}@${host}:5432/${postgresDatabase}`
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