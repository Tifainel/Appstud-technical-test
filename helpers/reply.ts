import { FastifyReply } from 'fastify';

export function customReply(
  reply: FastifyReply,
  response: Object | String | Array<any>,
  code: number,
) {
  reply
    .code(code)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send(response);
}
