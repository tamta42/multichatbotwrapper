import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Context } from 'hono';

interface Env {
  DB: D1Database;
  OPENROUTER_API_KEY: string;
  SESSION_SECRET: string;
  NODE_ENV?: 'development' | 'production';
}

type Bindings = {
  Bindings: Env;
};

const app = new Hono<Bindings>();

// Middleware
app.use('*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
}));

// Health check endpoint
app.get('/api/health', (c: Context<Bindings>) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: c.env.NODE_ENV || 'development',
  });
});

// 404 handler
app.notFound((c: Context<Bindings>) => {
  return c.json(
    { error: 'Not Found', status: 404 },
    404
  );
});

// Error handler
app.onError((err: Error, c: Context<Bindings>) => {
  console.error('Error:', err);
  return c.json(
    { error: 'Internal Server Error', status: 500 },
    500
  );
});

export default app;
