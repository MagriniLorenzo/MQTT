import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDo0X1w2k7sTmO__M-TAMX9V40qCowPryk",
    authDomain: "mqtt-2a81d.firebaseapp.com",
    projectId: "mqtt-2a81d",
    storageBucket: "mqtt-2a81d.firebasestorage.app",
    messagingSenderId: "134515298744",
    appId: "1:134515298744:web:1160ca1a59d2e9f335bf4d",
    measurementId: "G-GQ3PTYS6LQ"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
