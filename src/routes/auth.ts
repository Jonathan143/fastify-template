import type { FastifyPluginAsync } from 'fastify';

import { HttpError } from '../utils/http-error';

const authRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post(
    '/auth/login',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            username: { type: 'string', minLength: 1 },
            password: { type: 'string', minLength: 1 },
          },
          required: ['username', 'password'],
          additionalProperties: false,
        },
      },
    },
    async (request) => {
      const { username, password } = request.body as { username: string; password: string };

      if (username !== fastify.config.demoUser || password !== fastify.config.demoPassword) {
        throw new HttpError(401, 'INVALID_CREDENTIALS', 'Username or password is incorrect');
      }

      const token = await fastify.jwt.sign(
        { sub: username },
        { expiresIn: fastify.config.jwtExpiresIn }
      );

      return {
        token,
        tokenType: 'Bearer',
        expiresIn: fastify.config.jwtExpiresIn,
      };
    }
  );
};

export default authRoutes;
