import fp from 'fastify-plugin';

type LegacySuccessPayload = {
  success: true;
  data: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isLegacySuccessPayload(value: unknown): value is LegacySuccessPayload {
  return isRecord(value) && value.success === true && 'data' in value;
}

export default fp(async (fastify) => {
  fastify.addHook('preSerialization', (request, reply, payload, done) => {
    if (reply.statusCode >= 400 || reply.statusCode === 204 || reply.statusCode === 304) {
      return done(null, payload);
    }

    if (isRecord(payload) && payload.success === false) {
      return done(null, payload);
    }

    const data = isLegacySuccessPayload(payload) ? payload.data : payload;

    return done(null, {
      success: true,
      data: data ?? null,
      timestamp: new Date().toISOString(),
      reqId: request.id,
    });
  });
});
