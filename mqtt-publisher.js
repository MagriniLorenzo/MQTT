import mqtt from 'mqtt';

const client = mqtt.connect('mqtt://localhost:1883');

client.on('connect', () => {
  console.log('Publisher MQTT connesso');
  client.publish('sensors/1', JSON.stringify({ value: 20 }), () => {
    console.log('Messaggio inviato');
    client.end();
  });
});
