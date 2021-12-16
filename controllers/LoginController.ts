import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { customReply } from '../helpers/reply';
import { v4 as uuidv4 } from 'uuid';
import User from '../interfaces/UserInterface';
import UsersArray from '../interfaces/UsersArrayInterface';

const fs = require('fs');

export default class LoginController {
  private router: FastifyInstance;

  constructor(router: FastifyInstance) {
    this.router = router;

    router.get('/api/users/login', this.loginUser.bind(this));
  }

  async loginUser(req: FastifyRequest, reply: FastifyReply): Promise<void> {
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

      if (!fs.existsSync('users.json')) {
        customReply(reply, { error: 'User not found' }, 404);
        return;
      }

      const users: UsersArray = JSON.parse(fs.readFileSync('users.json'));

      if (
        this.isLoginDataValid(
          { username: query.username, password: query.password },
          users.users,
          token,
        )
      )
        customReply(reply, { username: query.username, token }, 200);
      else customReply(reply, { error: 'User not found' }, 404);
    } catch (err) {
      customReply(
        reply,
        { error: `An error occured in LoginController: ${err}` },
        500,
      );
    }
  }

  isLoginDataValid(user: User, users: Array<User>, token: string) {
    return !!users.find((element) => {
      if (
        element.username === user.username &&
        element.password === user.password
      ) {
        element.token = token;
        fs.writeFileSync('users.json', `{"users": ${JSON.stringify(users)}}`);

        return true;
      }
      return false;
    });
  }
}
