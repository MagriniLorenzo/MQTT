import { z } from 'zod';
import { createSensor, listSensors, updateSensor } from '../repositories/sensorRepository.js';

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
    const sensorId = await createSensor(parseResult.data);
    reply.code(201).send({ success: true});
    } catch (err) {
    reply.status(500).send({ error: 'Error' });
    }
}

export async function getSensors(req, reply) {
    try {
        const sensors = await listSensors();
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
        await updateSensor(id, parseResult.data);
        reply.send({ success: true });
    } catch (err) {
        reply.status(500).send({ error: 'Error' });
    }
}
