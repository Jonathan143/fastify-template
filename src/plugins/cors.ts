import cors from '@fastify/cors';
import fp from 'fastify-plugin';

export default fp(async (fastify) => {
  const origins = fastify.config.corsOrigins;

  await fastify.register(cors, {
    origin: origins === '*' ? true : origins,
    credentials: true,
  });
});
