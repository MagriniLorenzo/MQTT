import { adminAuth } from '../services/firebaseAdmin.js';
import { register, login } from '../services/authService.js';

export async function verifyToken(req, reply) {
    const { idToken } = req.body;
  
    try {
      const decoded = await adminAuth.verifyIdToken(idToken);
      const uid = decoded.uid;
      const email = decoded.email || null; 

      const customToken = await adminAuth.createCustomToken(uid, {
        email: email || undefined
      });
  
      reply.send({
        uid,
        email,
        customToken
      });
    } catch (err) {
      console.error('Errore:', err.message);
      reply.status(401).send({ error: 'Invalid token or custom token creation failed' });
    }
}

export async function registerUser(req, reply) {
    const { email, password } = req.body;
  
    try {
      const authResult = await register(email, password);
      reply.status(201).send({
        user: {
          email: authResult.email || null,
          uid: authResult.uid,
          idToken: authResult.idToken,
          refreshToken: authResult.refreshToken
        }
      });
    } catch (error) {
      reply.status(400).send({
        error: error.message
      });
    }
  }
  
export async function loginUser(req, reply) {
    const { email, password } = req.body;
  
    try {
      const authResult = await login(email, password);
      reply.status(200).send({
        user: {
            email: authResult.email || null,
            uid: authResult.uid,
            idToken: authResult.idToken,
            refreshToken: authResult.refreshToken
          }
      });
    } catch (error) {
      reply.status(401).send({
        error: error.message
      });
    }
}  
