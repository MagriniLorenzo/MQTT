import Fastify from 'fastify';
import cors from '@fastify/cors';
import firebaseAdmin from 'firebase-admin';
import dataRoutes from './routes/data.js';
import sensorRoutes from './routes/sensors.js';
import './mqtt.js';

const serviceAccount = './auth/firebase-service-account.json';
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});

const app = Fastify();

await app.register(cors, {
  origin: 'http://127.0.0.1:8080',
  methods: ['GET', 'POST', 'PUT'],
  credentials: true,
});

// Middleware per verificare l'ID token
app.decorate('verifyFirebaseToken', async (request, reply) => {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    reply.code(401).send({ error: 'Unauthorized' });
    return;
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    request.user = decodedToken;
  } catch (error) {
    reply.code(401).send({ error: 'Unauthorized', details: error.message });
  }
});

app.post('/auth/custom-token', { preHandler: app.verifyFirebaseToken }, async (request, reply) => {
  try {
    const uid = request.user.uid;
    // Creo il custom token
    const customToken = await firebaseAdmin.auth().createCustomToken(uid);
    reply.send({ customToken });
  } catch (error) {
    reply.code(500).send({ error: 'Error', details: error.message });
  }
});

// Applico il middleware
app.addHook('onRequest', app.verifyFirebaseToken);

await app.register(dataRoutes);
await app.register(sensorRoutes);

app.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {console.log(`API listening on ${address}`);});