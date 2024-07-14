import { Hono } from 'hono'
import { userRouter } from './routes/user'
import { cors } from 'hono/cors'
import { blogRouter } from './routes/blog';


// const app = new Hono()
// this is to get the correct types on c.env
export const app = new Hono<{
  Bindings: {
    DATABASE_URL: string
    JWT_SECRET: string
  };
}>();

app.use('/*', cors({
  origin: '*', // Specify the allowed origin
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.route('/api/v1/user', userRouter)
app.route("/api/v1/blog", blogRouter)


export default app
