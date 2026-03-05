import type { AppEnv } from '../config/env';
import type { DatabaseConnections } from '../db';
import type { FastifyReply, FastifyRequest } from 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    config: AppEnv;
    db: DatabaseConnections;
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}
