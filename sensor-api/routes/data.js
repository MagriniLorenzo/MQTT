import { getSensorData } from '../controllers/dataController.js';

export default async function (fastify) {
  fastify.get('/data/:sensor_id', getSensorData);
}
