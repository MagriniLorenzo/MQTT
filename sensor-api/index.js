import Fastify from 'fastify';
import firebaseAdmin from 'firebase-admin';
import dataRoutes from './routes/data.js';
import sensorRoutes from './routes/sensors.js';
import './mqtt.js';

// Inizializza Firebase Admin SDK
const serviceAccount = './auth/firebase-service-account.json';
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});

const app = Fastify();

// Middleware per verificare l'ID token
app.decorate('verifyFirebaseToken', async (request, reply) => {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    reply.code(401).send({ error: 'Unauthorized: Missing or invalid token' });
    return;
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    request.user = decodedToken; // Aggiungi i dati dell'utente alla richiesta
  } catch (error) {
    reply.code(401).send({ error: 'Unauthorized: Invalid token', details: error.message });
  }
});

// Nuova rotta per generare il custom token
app.post('/auth/custom-token', { preHandler: app.verifyFirebaseToken }, async (request, reply) => {
  try {
    const uid = request.user.uid;
    // Crea il custom token
    const customToken = await firebaseAdmin.auth().createCustomToken(uid);
    reply.send({ customToken });
  } catch (error) {
    reply.code(500).send({ error: 'Failed to generate custom token', details: error.message });
  }
});

// Applica il middleware a tutte le altre rotte (es. data e sensors)
app.addHook('onRequest', app.verifyFirebaseToken);

// Registra le rotte
await app.register(dataRoutes);
await app.register(sensorRoutes);

app.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`API listening on ${address}`);
});