# Database (backend/db)

PostgreSQL database managed with Prisma. Hosted on Aiven Cloud.

## Schema

Models: User, Post, Comment

## Setup

1. Install dependencies:

   ```bash
   cd backend
   npm install
   ```

2. Update `DATABASE_URL` in `.env` if needed.

3. Push schema to database (creates/updates tables):

   ```bash
   cd db
   bunx prisma db push
   ```

4. Reset database (deletes all data):

   ```bash
   cd db
   bunx prisma db push --force-reset
   ```

5. Generate Prisma client:
   ```bash
   cd db
   bunx prisma generate
   ```
6. Seed demo users and posts:
   ```bash
   cd backend
   bun run db:seed
   ```
   Demo credentials:
   - `demo@gmail.com` / `demo000` - Demo check
   - `reshme@reshme.com` / `Reshme@123` - Reshme Yadav
   - `anika@papertrail.dev` / `Anika#2026` - Anika Rao
   - `samir@cratecloud.dev` / `Samir!2026` - Samir Khan
   - `lina@typefoundry.dev` / `Lina@12345` - Lina Bose
7. To see the database details
   ```bash
   cd db
   bunx prisma studio
   ```

## Database URL

The database URL is stored in `.env`. Get it from Aiven Console:

1. Go to https://console.aiven.io
2. Select your project
3. Go to PostgreSQL > medium-project-patraabhinav12-0ef3
4. Copy the connection string from "Connection string" tab
