import {
    postSensor,
    getSensors,
    putSensor
  } from '../controllers/sensorController.js';
  
  export default async function (fastify) {
    fastify.get('/sensors', getSensors);
    fastify.post('/sensors', postSensor);
    fastify.put('/sensors/:id', putSensor);
  }
  