import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { customReply } from '../helpers/reply';
import User from '../interfaces/UserInterface';

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

      customReply(reply, this.removePassword(users), 200);
    } catch (err) {
      customReply(
        reply,
        { error: `An error occured in GetUsersController: ${err}` },
        500,
      );
    }
  }

  removePassword(users: Array<User>): Array<User> {
    for (let i = 0; i < users.length; i++) {
      users[i] = { username: users[i].username };
    }
    return users;
  }
}
