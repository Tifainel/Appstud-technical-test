import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { customReply } from '../helpers/reply';

const fs = require('fs');

export default class GetUsersController {
  private router: FastifyInstance;

  constructor(router: FastifyInstance) {
    this.router = router;

    router.get('/api/users', this.getAll.bind(this));
  }

  async getAll(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      if (!fs.existsSync('users.json')) {
        customReply(reply, [], 200);
        return;
      }
      const users = JSON.parse(fs.readFileSync('users.json')).users;
      customReply(reply, users, 200);
    } catch (err) {
      customReply(
        reply,
        { error: `An error occured in GetUsersController: ${err}` },
        500,
      );
    }
  }
}
