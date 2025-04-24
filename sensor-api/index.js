import Fastify from 'fastify';
import dataRoutes from './routes/data.js';
import sensorRoutes from './routes/sensors.js';
import './mqtt.js';

const app = Fastify();

app.register(dataRoutes);
app.register(sensorRoutes);

app.listen({ port: 3000, host: '0.0.0.0' }, () => {
  console.log('API listening on port 3000');
});
