import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import User from '../interfaces/UserInterface';
import UsersArray from '../interfaces/UsersArrayInterface';
import { v4 as uuidv4 } from 'uuid';
import { customReply } from '../helpers/reply';

const fs = require('fs');

export default class RegisterController {
  private router: FastifyInstance;

  constructor(router: FastifyInstance) {
    this.router = router;

    router.post('/api/users/register', this.register.bind(this));
  }

  async register(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const query: any = req.query;
      const token = uuidv4();

      if (!query.username || !query.password) {
        customReply(
          reply,
          { error: 'Username and password must be given' },
          500,
        );
        return;
      }

      const isUserCreated = await this.createUser({
        username: query.username,
        password: query.password,
        token: token,
      });

      if (!isUserCreated) {
        customReply(reply, { error: 'This username is already taken' }, 403);
        return;
      }

      customReply(reply, { username: query.username, token }, 200);
      return;
    } catch (err) {
      customReply(
        reply,
        { error: `An error occured in RegisterController: ${err}` },
        500,
      );
    }
  }

  async createUser(user: User): Promise<Boolean> {
    if (fs.existsSync('users.json')) {
      const currentData: UsersArray = JSON.parse(fs.readFileSync('users.json'));
      if (this.userExists(user, currentData.users)) return false;
      currentData.users.push(user);
      fs.writeFileSync('users.json', JSON.stringify(currentData));
    } else {
      fs.writeFileSync('users.json', `{ "users": [${JSON.stringify(user)}] }`);
    }
    return true;
  }

  userExists(user: User, users: Array<User>): Boolean {
    return !!users.find((element) => element.username === user.username);
  }
}
