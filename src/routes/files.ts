import type { FastifyPluginAsync } from 'fastify';
import { createReadStream, createWriteStream } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';

import { HttpError } from '../utils/http-error';

const uploadsDir = path.resolve(process.cwd(), 'uploads');

const fileRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/files/upload', {
    preHandler: [fastify.authenticate]
  }, async (request) => {
    const part = await request.file();

    if (!part) {
      throw new HttpError(400, 'FILE_REQUIRED', 'No file found in request');
    }

    await mkdir(uploadsDir, { recursive: true });

    const safeName = `${Date.now()}-${part.filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const targetPath = path.join(uploadsDir, safeName);

    await pipeline(part.file, createWriteStream(targetPath));

    return {
      success: true,
      data: {
        filename: safeName,
        mimeType: part.mimetype,
        encoding: part.encoding,
        url: `/api/files/download/${encodeURIComponent(safeName)}`
      }
    };
  });

  fastify.get('/files/download/:name', {
    preHandler: [fastify.authenticate],
    schema: {
      params: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1 }
        },
        required: ['name'],
        additionalProperties: false
      }
    }
  }, async (request, reply) => {
    const { name } = request.params as { name: string };
    const safeName = path.basename(name);
    const fullPath = path.join(uploadsDir, safeName);

    reply.header('Content-Disposition', `attachment; filename="${safeName}"`);
    reply.type('application/octet-stream');

    return reply.send(createReadStream(fullPath));
  });
};

export default fileRoutes;
