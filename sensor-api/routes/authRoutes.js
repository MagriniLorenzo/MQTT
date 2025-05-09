import { verifyToken, registerUser, loginUser } from '../controllers/authController.js';

export default async function (fastify) {
  fastify.post('/auth/register', registerUser);
  fastify.post('/auth/login', loginUser);
  fastify.post('/auth/verify', verifyToken);
}
