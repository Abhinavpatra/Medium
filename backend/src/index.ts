//index.ts

import { Hono } from 'hono'
import userRouter  from './routes/user'
import blogRouter from './routes/post'
import { cors } from 'hono/cors'
// wrangler.toml file has all the c.env.stuff
// HONO works in cloudflare workers and not express
//@ts-ignore
  // this ignores the next line, for ts errorspsq;

const app = new Hono();

app.use('/*', cors());
app.get('/',async (c)=>{
  return c.json({
    "hello":"world, we work"
  })
})

app.route("api/v1/user/", userRouter);
app.route("api/v1/blog/", blogRouter);
app.get("/api/v1/anything", async(c)=>{
  return c.json({
    "message": "I work"
  })
}) ;

// this is the middleware

export default app 
// HONO works in cloudflare workers and not express