import { auth } from '../firebase/firebaseClient.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithCustomToken } from 'firebase/auth';


async function getCustomToken(idToken) {
    try {
      const response = await fetch('http://localhost:3000/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });
  
      const data = await response.json();
      if (response.ok) {
        return data.customToken;
      } else {
        throw new Error(data.error || 'Errore nel recupero del Custom Token');
      }
    } catch (error) {
      console.error('Errore nella richiesta del Custom Token:', error.message);
      throw error;
    }
}

async function authenticateWithCustomToken(customToken) {
    try {
      const userCredential = await signInWithCustomToken(auth, customToken);
      const user = userCredential.user;
  
      const idToken = await user.getIdToken();
      const refreshToken = user.refreshToken;
  
      return {
        uid: user.uid,
        email: user.email,
        idToken, // Access Token
        refreshToken // Refresh Token
      };
    } catch (error) {
      console.error('Errore nell\'autenticazione con Custom Token:', error.message);
      throw error;
    }
}


export async function register(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      const idToken = await user.getIdToken();
  
      const customToken = await getCustomToken(idToken);
  
      const authResult = await authenticateWithCustomToken(customToken);
  
      return {
        uid: authResult.uid,
        email: authResult.email,
        idToken: authResult.idToken,
        refreshToken: authResult.refreshToken
      };
    } catch (error) {
      console.error('Errore nella registrazione:', error.message);
      throw error;
    }
}

export async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      const idToken = await user.getIdToken();
  
      const customToken = await getCustomToken(idToken);
  
      const authResult = await authenticateWithCustomToken(customToken);
  
      return {
        uid: authResult.uid,
        email: authResult.email,
        idToken: authResult.idToken,
        refreshToken: authResult.refreshToken
      };
    } catch (error) {
      console.error('Errore nel login:', error.message);
      throw error;
    }
}
