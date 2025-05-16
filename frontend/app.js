const firebaseConfig = {
    apiKey: "AIzaSyDo0X1w2k7sTmO__M-TAMX9V40qCowPryk",
    authDomain: "mqtt-2a81d.firebaseapp.com",
    projectId: "mqtt-2a81d",
    storageBucket: "mqtt-2a81d.firebasestorage.app",
    messagingSenderId: "134515298744",
    appId: "1:134515298744:web:1160ca1a59d2e9f335bf4d",
    measurementId: "G-GQ3PTYS6LQ"
  };

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

const authContainer = document.getElementById('auth-container');
const tokenContainer = document.getElementById('token-container');
const errorMessage = document.getElementById('error-message');

function showLoginForm() {
  authContainer.innerHTML = `
    <h2>Login</h2>
    <form id="login-form">
      <div>
        <label>Email:</label>
        <input type="email" id="email" required />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" id="password" required />
      </div>
      <button type="submit">Accedi</button>
    </form>
  `;
  tokenContainer.innerHTML = '';

  const loginForm = document.getElementById('login-form');
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    errorMessage.textContent = '';

    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch (err) {
      errorMessage.textContent = err.message;
    }
  });
}

function showAuthenticatedUI(user) {
  authContainer.innerHTML = `
    <p>Benvenuto, ${user.email}</p>
    <button id="logout-button">Logout</button>
    <button id="sensors-button">Visualizza Sensori</button>
  `;
  tokenContainer.innerHTML = '<p>Caricamento...</p>';

  const logoutButton = document.getElementById('logout-button');
  logoutButton.addEventListener('click', async () => {
    try {
      await auth.signOut();
    } catch (err) {
      errorMessage.textContent = err.message;
    }
  });

  const sensorsButton = document.getElementById('sensors-button');
  sensorsButton.addEventListener('click', () => callSensorsApi(user));
}

async function callSensorsApi(user) {
  errorMessage.textContent = '';
  try {
    const idToken = await user.getIdToken();
    const sensorId = 1;
    const fromDate = '2023-01-01';
    const toDate = '2026-01-31';

    const url = new URL(`http://localhost:3000/data/${sensorId}`);
    url.searchParams.append('from', fromDate);
    url.searchParams.append('to', toDate);

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Errore API: ${response.statusText}`);
    }

    const sensorsData = await response.json();

    console.log(sensorsData);

    tokenContainer.innerHTML = `
      <h2>Token di Autenticazione</h2>
      <pre id="tokens-data"></pre>
      <h2>Dati Sensori</h2>
      <pre>${JSON.stringify(sensorsData, null, 2)}</pre>
    `;
  } catch (err) {
    errorMessage.textContent = err.message;
  }
}


async function getCustomTokenAndAuthenticate(user) {
  errorMessage.textContent = '';
  try {
    const idToken = await user.getIdToken();

    const response = await fetch('http://localhost:3000/auth/custom-token', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Errore: ${response.statusText}`);
    }

    const { customToken } = await response.json();

    const userCredential = await auth.signInWithCustomToken(customToken);
    const newIdToken = await userCredential.user.getIdToken(); // Access token
    const refreshToken = userCredential.user.refreshToken; // Refresh token

    const tokensData = document.getElementById('tokens-data') || tokenContainer;
    tokensData.innerHTML = `
      <h2>Token di Autenticazione</h2>
      <pre>${JSON.stringify({ accessToken: newIdToken, refreshToken }, null, 2)}</pre>
    `;
  } catch (err) {
    errorMessage.textContent = err.message;
    tokenContainer.innerHTML = '';
  }
}

// Monitoro lo stato di autenticazione
auth.onAuthStateChanged((user) => {
  if (user) {
    showAuthenticatedUI(user);
    getCustomTokenAndAuthenticate(user); 
  } else {
    showLoginForm();
  }
});