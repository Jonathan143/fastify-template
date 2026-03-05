import type { FastifyPluginAsync } from 'fastify';

const healthRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get(
    '/health',
    {
      schema: {
        tags: ['system'],
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'object',
                properties: {
                  status: { type: 'string' },
                  uptime: { type: 'number' },
                  timestamp: { type: 'string' },
                },
                required: ['status', 'uptime', 'timestamp'],
              },
            },
            required: ['success', 'data'],
          },
        },
      },
    },
    async () => {
      return {
        success: true,
        data: {
          status: 'ok',
          uptime: process.uptime(),
          timestamp: new Date().toISOString(),
        },
      };
    }
  );
};

export default healthRoutes;
