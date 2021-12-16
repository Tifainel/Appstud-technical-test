import HttpGateway from './HttpGateway';
import ExampleController from './controllers/ExampleController';
import HealthcheckController from './controllers/HealthcheckController';
import TimemachineController from './controllers/TimemachineController';
import RegisterController from './controllers/RegisterController';
import GetUsersController from './controllers/GetUsersController';
import LoginController from './controllers/LoginController';

(async function main() {
  // Init Fastify router
  const http = new HttpGateway();

  // Controllers
  new ExampleController(http.router);
  new HealthcheckController(http.router);
  new TimemachineController(http.router);
  new RegisterController(http.router);
  new GetUsersController(http.router);
  new LoginController(http.router);

  // Fastify router start
  await http.start();
})();
