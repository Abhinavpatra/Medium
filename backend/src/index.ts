import { Hono } from 'hono'
import userRouter from './routes/user'
import blogRouter from './routes/post'
import { cors } from 'hono/cors'
import type { Env } from './types'

type AppBindings = {
  Bindings: Env
}

const app = new Hono<AppBindings>();

app.use('/*', cors({
  origin: '*',
  credentials: true
}));

app.get('/', async (c) => {
  return c.json({ message: "world, we work" })
});

app.route("api/v1/user/", userRouter);
app.route("api/v1/blog/", blogRouter);
app.get("/api/v1/anything", async(c)=>{
  return c.json({
    "message": "I work"
  })
}) ;

// this is the middleware

export default app;