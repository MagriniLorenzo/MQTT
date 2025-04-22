import Fastify from 'fastify';
import { getData } from './db.js';
import './mqtt.js';

const app = Fastify();

app.get('/data/:sensor_id', async (req, reply) => {
  const { sensor_id } = req.params;
  const { from, to } = req.query;

  if (!from || !to) {
    return reply.status(400).send({ error: 'from and to are required' });
  }

  const result = await getData(sensor_id, new Date(from), new Date(to));
  reply.send(result.rows);
});

app.listen({ port: 3000, host: '0.0.0.0' }, () => {
  console.log('API listening on port 3000');
});
