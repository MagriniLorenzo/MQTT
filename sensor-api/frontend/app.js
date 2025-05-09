const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const messageDiv = document.getElementById('message');

const apiUrl = 'http://localhost:3000';

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
  
    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        messageDiv.innerHTML = 'Login riuscito!<br>Access Token: ' + data.user.idToken + '<br><br>Refresh Token: <br>' + data.user.refreshToken;
      } else {
        messageDiv.innerHTML = 'Errore login: ' + data.error;
      }
    } catch (error) {
      messageDiv.innerHTML = 'Errore nel login: ' + error.message;
    }
});

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  try {
    const response = await fetch(`${apiUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      messageDiv.innerHTML = 'Registrazione riuscita! Benvenuto: ' + data.user.email;
    } else {
      messageDiv.innerHTML = 'Errore registrazione: ' + data.error;
    }
  } catch (error) {
    messageDiv.innerHTML = 'Errore nella registrazione: ' + error.message;
  }
});
