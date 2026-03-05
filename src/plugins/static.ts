import fastifyStatic from '@fastify/static';
import fp from 'fastify-plugin';
import path from 'node:path';

export default fp(async (fastify) => {
  await fastify.register(fastifyStatic, {
    root: path.resolve(process.cwd(), 'public'),
    prefix: '/public/',
  });
});
