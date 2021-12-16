import { FastifyInstance } from 'fastify';
import HealthcheckResponse from '../interfaces/HealthcheckInterface';

export default class HealthcheckController {
  private router: FastifyInstance;

  constructor(router: FastifyInstance) {
    this.router = router;

    router.get('/api/healthcheck', this.healthcheck.bind(this));
  }

  async healthcheck(): Promise<HealthcheckResponse> {
    return {
      name: 'github-api',
      version: '1.0',
      time: new Date().getTime(),
    };
  }
}
