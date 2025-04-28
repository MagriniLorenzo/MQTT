import { z } from 'zod';
import { SensorDataRepository } from '../repositories/sensorDataRepository.js';

const sensorDataController = new SensorDataRepository();


const querySchema = z.object({
  from: z.coerce.date(),
  to: z.coerce.date()
});

export async function getSensorData(req, reply) {
  const { sensor_id } = req.params;

  const parseResult = querySchema.safeParse(req.query);

  if (!parseResult.success) {
    return reply.status(400).send({ error: parseResult.error.message });
  }

  const { from, to } = parseResult.data;

  try {
    const data = await sensorDataController.fetchBySensorAndDate(sensor_id, from, to);
    reply.send(data);
  } catch (err) {
    reply.status(500).send({ error: 'Server error' });
  }
}
