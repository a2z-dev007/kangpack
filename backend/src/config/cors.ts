import { CorsOptions } from 'cors';
import { env } from './env';

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    const allowedOrigins = env.CORS_ORIGIN.split(',').map(o => o.trim());
    
    // Check if origin is allowed explicitly or via wildcard
    const isAllowed = allowedOrigins.includes(origin) || 
                      allowedOrigins.includes('*') ||
                      // Automatically allow any subdomain of kangpack.in in production
                      (origin.endsWith('kangpack.in') || origin.endsWith('kangpack.in/'));

    if (isAllowed) {
      return callback(null, true);
    }

    console.warn(`⚠️ CORS blocked request from origin: ${origin}`);
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma',
    'x-session-id'
  ],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  maxAge: 86400, // 24 hours
};