import type { FastifyPluginAsync } from 'fastify';

const userRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/users/me', {
    preHandler: [fastify.authenticate]
  }, async (request) => {
    return {
      success: true,
      data: {
        user: request.user
      }
    };
  });

  fastify.get('/users', {
    preHandler: [fastify.authenticate],
    schema: {
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', minimum: 1, default: 1 },
          pageSize: { type: 'integer', minimum: 1, maximum: 100, default: 10 }
        },
        additionalProperties: false
      }
    }
  }, async (request) => {
    const { page = 1, pageSize = 10 } = request.query as { page?: number; pageSize?: number };

    return {
      success: true,
      data: {
        page,
        pageSize,
        items: []
      }
    };
  });
};

export default userRoutes;
