import mqtt from 'mqtt';
import { SensorDataRepository } from './repositories/sensorDataRepository.js';

const sensorDataRepository = new SensorDataRepository();

const client = mqtt.connect(process.env.MQTT_BROKER_URL);

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe('sensors/#');
});

client.on('message', (topic, message) => {
  try {
    const payload = JSON.parse(message.toString());
    const sensorId = topic.split('/')[1];
    const timestamp = new Date();
    const value = parseFloat(payload.value);

    sensorDataRepository.insert(sensorId, timestamp, value);
    console.log(`Saved: ${sensorId} - ${value}`);
  } catch (err) {
    console.error('Error:', err.message);
  }
});
