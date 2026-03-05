import fp from 'fastify-plugin';

import { HttpError } from '../utils/http-error';

export default fp(async (fastify) => {
  fastify.setErrorHandler((error, request, reply) => {
    request.log.error({ err: error }, 'Request failed');
    const maybeError = error as {
      validation?: unknown;
      statusCode?: number;
      message?: string;
    };

    if (error instanceof HttpError) {
      return reply.status(error.statusCode).send({
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details
        },
        requestId: request.id,
        timestamp: new Date().toISOString()
      });
    }

    if (maybeError.validation) {
      return reply.status(400).send({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Request validation failed',
          details: maybeError.validation
        },
        requestId: request.id,
        timestamp: new Date().toISOString()
      });
    }

    const statusCode = maybeError.statusCode ?? 500;

    return reply.status(statusCode).send({
      success: false,
      error: {
        code: statusCode >= 500 ? 'INTERNAL_SERVER_ERROR' : 'REQUEST_ERROR',
        message: statusCode >= 500 ? 'Internal server error' : maybeError.message ?? 'Request error'
      },
      requestId: request.id,
      timestamp: new Date().toISOString()
    });
  });
});
