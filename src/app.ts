import Fastify from 'fastify';

import corsPlugin from './plugins/cors';
import databasePlugin from './plugins/database';
import envPlugin from './plugins/env';
import errorHandlerPlugin from './plugins/error-handler';
import jwtPlugin from './plugins/jwt';
import loggerPlugin from './plugins/logger';
import multipartPlugin from './plugins/multipart';
import staticPlugin from './plugins/static';
import apiRoutes from './routes';

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: 'info'
    }
  });

  await app.register(envPlugin);
  await app.register(corsPlugin);
  await app.register(jwtPlugin);
  await app.register(multipartPlugin);
  await app.register(staticPlugin);
  await app.register(databasePlugin);
  await app.register(loggerPlugin);
  await app.register(errorHandlerPlugin);

  await app.register(apiRoutes, { prefix: '/api' });

  return app;
}
