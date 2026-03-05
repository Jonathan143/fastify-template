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
      level: 'info',
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true, // 彩色输出，区分不同日志级别
          translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l', // 高精度时间格式（含毫秒）
          ignore: 'pid,hostname', // 忽略冗余字段，简化输出
          singleLine: true, // 单行会输出，避免日志换行分散注意力
          levelFirst: true, // 日志级别放在最前面，一眼识别
          errorLikeObjectKeys: ['err', 'error'], // 识别错误对象并美化
        },
      },
    },
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
