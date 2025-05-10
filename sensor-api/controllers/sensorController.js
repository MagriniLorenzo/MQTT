import { z } from 'zod';
import { SensorController } from '../repositories/sensorRepository.js';

const sensorController = new SensorController();

const sensorSchema = z.object({
    name: z.string(),
    tags: z.array(z.string()).optional()
});

export async function postSensor(req, reply) {
    const parseResult = sensorSchema.safeParse(req.body);
    if (!parseResult.success) {
      return reply.status(400).send({ error: parseResult.error.message });
    }
  
    try {
      const sensor = await sensorController.create(parseResult.data);
      reply.code(201).send(sensor);
    } catch (err) {
      reply.status(500).send({ error: 'Error' });
    }
}

  export async function getSensors(req, reply) {
    try {
      const sensors = await sensorController.get();
      reply.send(sensors);
    } catch (err) {
      reply.status(500).send({ error: 'Error' });
    }
  }

export async function putSensor(req, reply) {
    const { id } = req.params;
  
    const parseResult = sensorSchema.omit({ id: true }).safeParse(req.body);
    if (!parseResult.success) {
      return reply.status(400).send({ error: parseResult.error.message });
    }
  
    try {
      const updatedSensor = await sensorController.update(id, parseResult.data);
      reply.send(updatedSensor);
    } catch (err) {
      reply.status(500).send({ error: 'Error' });
    }
  }
