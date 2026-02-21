import { CorsOptions } from 'cors';
import { env } from './env';

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // 1. Allow mobile/Postman
    if (!origin) return callback(null, true);

    const allowedOrigins = env.CORS_ORIGIN.split(',').map(o => o.trim());
    
    // 2. Check Kangpack domains (both HTTP and HTTPS for safety)
    const isKangpack = origin.includes('kangpack.in');
    const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1');
    
    // 3. Check explicit allowed origins or wildcard
    const isExplicitlyAllowed = allowedOrigins.includes(origin) || allowedOrigins.includes('*');

    if (isKangpack || isLocalhost || isExplicitlyAllowed) {
      return callback(null, true);
    }

    console.warn(`[CORS] Blocking unexpected origin: ${origin}`);
    // Return false instead of Error to avoid server-side error handling during flight check
    return callback(null, false);
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
    'x-session-id',
    'Range'
  ],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count', 'Content-Range', 'Accept-Ranges'],
  maxAge: 3600,
};