import fp from 'fastify-plugin';

import { closeDatabase, connectDatabase } from '../db';

export default fp(async (fastify) => {
  const db = await connectDatabase(fastify.config, fastify.log);
  fastify.decorate('db', db);

  fastify.addHook('onClose', async () => {
    await closeDatabase(db);
  });
});
