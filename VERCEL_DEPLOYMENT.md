# EPG Manager - Vercel Deployment Guide

## 🚀 Deployment Options

### Option 1: SQLite on Vercel (Current Setup)

**Status:** ⚠️ May have issues due to serverless file system limitations

**Environment Variables:**
```
DATABASE_URL=file:./dev.db
```

**Pros:**
- Zero database costs
- Easy setup
- Good for development

**Cons:**
- Database file may be lost between deployments
- Not reliable for production use

### Option 2: PostgreSQL (Recommended for Production)

**Best for:** Reliable production deployment

**Steps:**
1. **Choose a PostgreSQL provider:**
   - [Supabase](https://supabase.com) (Free tier available)
   - [Neon](https://neon.tech) (Free tier available)
   - [Railway](https://railway.app) (Free tier available)
   - [Heroku PostgreSQL](https://www.heroku.com/postgres)

2. **Get Database URL:**
   ```env
   DATABASE_URL="postgresql://username:password@host:port/database"
   ```

3. **Update Prisma Schema:**
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

4. **Deploy to Vercel:**
   - Add DATABASE_URL to Vercel environment variables
   - Deploy automatically

### Option 3: Supabase (PostgreSQL + Features)

**Best for:** All-in-one solution with additional features

**Steps:**
1. **Create Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Get database URL from settings

2. **Environment Variables:**
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres"
   ```

3. **Deploy to Vercel:**
   - Connect GitHub repository
   - Add environment variables
   - Deploy

## 🔧 Current Build Issues

The current deployment is failing because:

1. **Prisma Generation:** Vercel caches dependencies, but Prisma needs to generate client during build
2. **SQLite Limitations:** Serverless environments don't guarantee persistent file storage
3. **Database Connection:** Build process tries to connect to database

## 🛠️ Quick Fix for Current Setup

### For Immediate Deployment (SQLite):

1. **Add Environment Variables in Vercel:**
   ```
   DATABASE_URL=file:./dev.db
   ```

2. **The build should now work** with the updated scripts

### For Production Deployment (PostgreSQL):

1. **Set up PostgreSQL database** (Supabase recommended)
2. **Update environment variables** in Vercel
3. **Update Prisma schema** to use PostgreSQL
4. **Run database migration**

## 🎯 Recommended Solution

**For now, use SQLite for testing, then switch to PostgreSQL for production:**

### Step 1: Deploy with SQLite (Testing)
```bash
# Current setup should work with the fixes
git add .
git commit -m "Fix Vercel deployment"
git push origin main
```

### Step 2: Switch to PostgreSQL (Production)
```bash
# 1. Install PostgreSQL driver
npm install pg

# 2. Update prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

# 3. Update environment variables
DATABASE_URL="postgresql://..."

# 4. Push schema
npm run db:push
```

## 📋 Vercel Environment Variables

### For SQLite:
```
DATABASE_URL=file:./dev.db
```

### For PostgreSQL:
```
DATABASE_URL=postgresql://username:password@host:port/database
```

## 🚀 Deployment Commands

The project now includes:
- `postinstall`: `prisma generate` - Generates Prisma client after install
- `build`: `prisma generate && next build` - Generates client and builds app

This should resolve the Prisma generation issues on Vercel.