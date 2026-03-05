import jwt from '@fastify/jwt';
import fp from 'fastify-plugin';
import type { FastifyReply, FastifyRequest } from 'fastify';

export default fp(async (fastify) => {
  await fastify.register(jwt, {
    secret: fastify.config.jwtSecret,
  });

  fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch {
      reply.code(401).send({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid or expired token',
        },
        requestId: request.id,
        timestamp: new Date().toISOString(),
      });
    }
  });
});
