# Backend (Cloudflare Workers + Hono + Prisma)

## Development

```bash
npm install
npm run dev
```

## Deployment

Deploy to Cloudflare Workers:

```bash
npm run deploy
```

## Worker URL

https://medium-api.patraabhinav12.workers.dev

Update DATABASE_URL in Cloudflare Workers dashboard:
1. Go to https://dash.cloudflare.com
2. Select your account > Workers & Pages
3. Go to medium-api > Settings > Environment Variables
4. Add DATABASE_URL with your PostgreSQL connection string from Aiven