import type { FastifyPluginAsync } from 'fastify';

import authRoutes from './auth';
import fileRoutes from './files';
import healthRoutes from './health';
import streamRoutes from './stream';
import userRoutes from './user';

const apiRoutes: FastifyPluginAsync = async (fastify) => {
  await fastify.register(healthRoutes);
  await fastify.register(authRoutes);
  await fastify.register(userRoutes);
  await fastify.register(fileRoutes);
  await fastify.register(streamRoutes);
};

export default apiRoutes;
