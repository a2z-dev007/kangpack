import { CorsOptions } from 'cors';
import { env } from './env';

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // 1. Allow mobile/Postman/Server-side requests (no origin header)
    if (!origin) return callback(null, true);

    const allowedOrigins = (env.CORS_ORIGIN || '').split(',').map(o => o.trim()).filter(Boolean);
    
    // 2. Comprehensive origin check
    const isKangpack = origin.includes('kangpack.in');
    const isLocalhost = origin.includes('localhost') || 
                       origin.includes('127.0.0.1') || 
                       origin.startsWith('http://192.168.') ||
                       origin.startsWith('http://10.') ||
                       origin.startsWith('http://172.');
    
    // Check if explicitly allowed or if we should allow all in development
    const isExplicitlyAllowed = allowedOrigins.includes(origin) || 
                               allowedOrigins.includes('*') ||
                               allowedOrigins.some(ao => ao !== '*' && origin.startsWith(ao));

    if (isKangpack || isLocalhost || isExplicitlyAllowed || (process.env.NODE_ENV !== 'production' && !origin)) {
      return callback(null, true);
    }

    console.warn(`[CORS] Blocking unexpected origin: ${origin}`);
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
    'x-refresh-token',
    'Range'
  ],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count', 'Content-Range', 'Accept-Ranges'],
  maxAge: 3600,
};