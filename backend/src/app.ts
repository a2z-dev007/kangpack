import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { env, isDevelopment } from './config/env';
import { corsOptions } from './config/cors';
import { v1Routes } from './routes/v1.routes';
import { generalRateLimit } from './common/middlewares/rateLimit.middleware';
import { errorHandler, notFoundHandler } from './common/middlewares/error.middleware';
const app = express();

// Trust proxy for Nginx
app.set('trust proxy', true);

// --- 1. CONSOLIDATED CORS HANDLING ---
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Define allowed origins patterns
  const isAllowedOrigin = origin && (
    origin.includes('kangpack.in') || 
    origin.includes('localhost') || 
    origin.includes('127.0.0.1') ||
    origin === env.CORS_ORIGIN // Fallback to explicit env value
  );

  if (isAllowedOrigin) {
    res.setHeader('Access-Control-Allow-Origin', origin as string);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Authorization, x-session-id, Range, Accept, Cache-Control, Pragma, x-refresh-token');
    res.setHeader('Access-Control-Max-Age', '3600');
    res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count, X-Page-Count, Content-Range, Accept-Ranges');
  }
  
  // Handle Preflight directly
  if (req.method === 'OPTIONS') {
    if (isAllowedOrigin) {
      return res.status(200).end();
    }
    // For non-allowed origins, still return 204 or 403? 
    // Usually 204/200 but without the headers will cause browser to block.
    return res.status(204).end();
  }
  next();
});

// Remove secondary cors middleware to prevent "multiple header" errors
// app.use(cors(corsOptions)); 

// Dedicated CORS test route
app.get('/cors-test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'CORS is working', 
    receivedOrigin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

// 3. Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Fix for subdomain CORS issues
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.kangpack.in", "https://kangpack.in", "http://localhost:*"],
    },
  },
}));

// Rate limiting
app.use(generalRateLimit);

// Body parsing middleware - skip for multipart/form-data (handled by multer)
app.use((req, res, next) => {
  if (req.headers['content-type']?.includes('multipart/form-data')) {
    return next();
  }
  express.json({ limit: '10mb' })(req, res, next);
});
app.use((req, res, next) => {
  if (req.headers['content-type']?.includes('multipart/form-data')) {
    return next();
  }
  express.urlencoded({ extended: true, limit: '10mb' })(req, res, next);
});
app.use(cookieParser(env.COOKIE_SECRET));

// Compression
app.use(compression());

// Logging
if (isDevelopment) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// API routes
app.use('/api/v1', v1Routes);

// Static files
app.use('/uploads', express.static('uploads'));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Ecommerce Backend API',
    version: '1.0.0',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;