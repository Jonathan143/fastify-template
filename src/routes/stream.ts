import type { FastifyPluginAsync } from 'fastify';

const streamRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/stream/events', {
    preHandler: [fastify.authenticate]
  }, async (request, reply) => {
    reply.raw.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    });

    const timer = setInterval(() => {
      const payload = JSON.stringify({
        time: new Date().toISOString(),
        requestId: request.id
      });
      reply.raw.write(`data: ${payload}\n\n`);
    }, 2000);

    request.raw.on('close', () => {
      clearInterval(timer);
      reply.raw.end();
    });
  });
};

export default streamRoutes;
