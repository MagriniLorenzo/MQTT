import { fetchDataBySensorAndDate } from '../repositories/sensorRepository.js';

export async function getSensorData(req, reply) {
  const { sensor_id } = req.params;
  const { from, to } = req.query;

  if (!from || !to) {
    return reply.status(400).send({ error: 'from and to are required' });
  }

  try {
    const data = await fetchDataBySensorAndDate(sensor_id, new Date(from), new Date(to));
    reply.send(data);
  } catch (err) {
    reply.status(500).send({ error: 'Server error' });
  }
}
