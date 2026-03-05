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
              timestamp: { type: 'string' },
              reqId: { type: 'string' },
            },
            required: ['success', 'data', 'timestamp', 'reqId'],
          },
        },
      },
    },
    async () => {
      return {
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      };
    }
  );
};

export default healthRoutes;
