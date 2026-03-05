import type { FastifyBaseLogger } from 'fastify';
import { MongoClient } from 'mongodb';
import mysql from 'mysql2/promise';

import type { AppEnv } from '../config/env';

export type DatabaseConnections = {
  type: 'none' | 'mysql' | 'mongo';
  mysql?: mysql.Pool;
  mongo?: MongoClient;
};

export async function connectDatabase(
  env: AppEnv,
  logger: FastifyBaseLogger
): Promise<DatabaseConnections> {
  if (env.dbType === 'none') {
    logger.info('Database connection disabled (DB_TYPE=none)');
    return { type: 'none' };
  }

  if (env.dbType === 'mysql') {
    const pool = mysql.createPool({
      uri: env.mysqlUri,
      waitForConnections: true,
      connectionLimit: 10,
    });

    await pool.query('SELECT 1');
    logger.info('MySQL connected');
    return { type: 'mysql', mysql: pool };
  }

  const client = new MongoClient(env.mongoUri!);
  await client.connect();
  logger.info('MongoDB connected');
  return { type: 'mongo', mongo: client };
}

export async function closeDatabase(db: DatabaseConnections): Promise<void> {
  if (db.type === 'mysql' && db.mysql) {
    await db.mysql.end();
  }

  if (db.type === 'mongo' && db.mongo) {
    await db.mongo.close();
  }
}
