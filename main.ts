import HttpGateway from './HttpGateway';
import ExampleController from './controllers/ExampleController';
import HealthcheckController from './controllers/HealthcheckController';
import TimemachineController from './controllers/TimemachineController';

(async function main() {
  // Init Fastify router
  const http = new HttpGateway();

  // Controllers
  new ExampleController(http.router);
  new HealthcheckController(http.router);
  new TimemachineController(http.router);

  // Fastify router start
  await http.start();
})();
