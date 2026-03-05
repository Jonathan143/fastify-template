import { buildApp } from './app';

async function start() {
  const app = await buildApp();

  try {
    await app.listen({
      host: app.config.host,
      port: app.config.port,
    });

    app.log.info(`Server started at http://${app.config.host}:${app.config.port}`);
  } catch (error) {
    app.log.error(error, 'Failed to start server');
    process.exit(1);
  }
}

void start();
