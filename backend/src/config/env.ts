import dotenv from 'dotenv';
import { z } from 'zod';
import path from 'path';

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';

console.log(`[Config] NODE_ENV is ${process.env.NODE_ENV}`);
console.log(`[Config] Seeking ${envFile}...`);

const cwdPath = path.join(process.cwd(), envFile);
const relativePath = path.resolve(__dirname, '../../', envFile);

const result = dotenv.config({ path: cwdPath });
if (result.error) {
  console.log(`[Config] CWD path failed, trying relative: ${relativePath}`);
  dotenv.config({ path: relativePath });
} else {
  console.log(`[Config] Loaded environment from: ${cwdPath}`);
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3000'),
  MONGODB_URI: z.string().min(1, 'MongoDB URI is required'),
  JWT_ACCESS_SECRET: z.string().min(32, 'JWT Access Secret must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT Refresh Secret must be at least 32 characters'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  CORS_ORIGIN: z.string().default('*'),
  MAX_FILE_SIZE: z.string().transform(Number).default('5242880'),
  UPLOAD_PATH: z.string().default('uploads'),
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('100'),
  BCRYPT_SALT_ROUNDS: z.string().transform(Number).default('12'),
  COOKIE_SECRET: z.string().min(16, 'Cookie secret must be at least 16 characters'),
  FRONTEND_URL: z.string().transform(val => {
    // Take the first URL if it's a list (comma-separated) and clean it
    if (val.includes(',')) {
      console.warn(`[Config] FRONTEND_URL contains multiple URLs, picking the first one.`);
      const first = val.split(',')[0].trim().replace(/^["']|["']$/g, '');
      console.log(`[Config] Cleaned FRONTEND_URL: ${first}`);
      return first;
    }
    return val.trim().replace(/^["']|["']$/g, '');
  }).default('https://kangpack.in'),
  SMTP_HOST: z.string().default('smtpout.secureserver.net'),
  SMTP_PORT: z.string().transform(Number).default('587'),
  SMTP_SECURE: z.string().transform(val => val === 'true').default('false'),
  SMTP_USER: z.string().default('support@kangpack.in'),
  SMTP_PASS: z.string().transform(val => val.replace(/^["']|["']$/g, '')).optional(),
  FROM_NAME: z.string().default('Kangpack Support'),
  FROM_EMAIL: z.string().default('support@kangpack.in'),
  AWS_ACCESS_KEY_ID: z.string().default(''),
  AWS_SECRET_ACCESS_KEY: z.string().default(''),
  AWS_REGION: z.string().default(''),
  S3_BUCKET_NAME: z.string().default(''),
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Invalid environment variables:');
    result.error.issues.forEach((issue) => {
      console.error(`   - ${issue.path.join('.')}: ${issue.message}`);
    });
    process.exit(1);
  }

  return result.data;
};

export const env = parseEnv();

export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';