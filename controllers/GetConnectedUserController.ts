import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { customReply } from '../helpers/reply';
import { v4 as uuidv4 } from 'uuid';
import User from '../interfaces/UserInterface';
import UsersArray from '../interfaces/UsersArrayInterface';

const fs = require('fs');

export default class GetConnectedUserController {
  private router: FastifyInstance;

  constructor(router: FastifyInstance) {
    this.router = router;

    router.get('/api/users/me', this.getUserByToken.bind(this));
  }

  async getUserByToken(
    req: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const query: any = req.query;
      const token = query.token;

      if (!query.token) {
        customReply(reply, { error: 'Token is required' }, 500);
        return;
      }

      if (!fs.existsSync('users.json')) {
        customReply(reply, { error: 'User not found' }, 404);
        return;
      }

      const users: UsersArray = JSON.parse(fs.readFileSync('users.json'));
      const currentUser = this.getCurrentUser(token, users.users);

      if (currentUser)
        customReply(reply, { username: currentUser.username }, 200);
      else customReply(reply, { error: 'User not found' }, 404);
    } catch (err) {
      customReply(
        reply,
        { error: `An error occured in GetConnectedUserController: ${err}` },
        500,
      );
    }
  }

  getCurrentUser(token: string, users: Array<User>): User | undefined {
    return users.find((element) => {
      if (element.token === token) {
        return element;
      }
      return null;
    });
  }
}
