import { config as loadEnv } from 'dotenv';
import { z } from 'zod';

loadEnv();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  HOST: z.string().default('0.0.0.0'),
  PORT: z.coerce.number().int().positive().default(3000),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
  JWT_EXPIRES_IN: z.string().default('1h'),
  CORS_ORIGINS: z.string().default('*'),
  DB_TYPE: z.enum(['none', 'mysql', 'mongo']).default('none'),
  MYSQL_URI: z.string().optional(),
  MONGO_URI: z.string().optional(),
  DEMO_USER: z.string().default('admin'),
  DEMO_PASSWORD: z.string().default('admin123'),
});

const rawEnv = envSchema.parse(process.env);

if (rawEnv.DB_TYPE === 'mysql' && !rawEnv.MYSQL_URI) {
  throw new Error('MYSQL_URI is required when DB_TYPE=mysql');
}

if (rawEnv.DB_TYPE === 'mongo' && !rawEnv.MONGO_URI) {
  throw new Error('MONGO_URI is required when DB_TYPE=mongo');
}

export type AppEnv = {
  nodeEnv: 'development' | 'test' | 'production';
  host: string;
  port: number;
  jwtSecret: string;
  jwtExpiresIn: string;
  corsOrigins: string[] | '*';
  dbType: 'none' | 'mysql' | 'mongo';
  mysqlUri?: string;
  mongoUri?: string;
  demoUser: string;
  demoPassword: string;
};

const parsedOrigins =
  rawEnv.CORS_ORIGINS.trim() === '*'
    ? '*'
    : rawEnv.CORS_ORIGINS.split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);

export const env: AppEnv = {
  nodeEnv: rawEnv.NODE_ENV,
  host: rawEnv.HOST,
  port: rawEnv.PORT,
  jwtSecret: rawEnv.JWT_SECRET,
  jwtExpiresIn: rawEnv.JWT_EXPIRES_IN,
  corsOrigins: parsedOrigins,
  dbType: rawEnv.DB_TYPE,
  mysqlUri: rawEnv.MYSQL_URI,
  mongoUri: rawEnv.MONGO_URI,
  demoUser: rawEnv.DEMO_USER,
  demoPassword: rawEnv.DEMO_PASSWORD,
};
