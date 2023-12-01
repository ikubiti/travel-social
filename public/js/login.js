
const loginFormHandler = async (event) => {
  event.preventDefault();

  console.log('we are here');
  // Collect values from the login form
  const userInfo = document.querySelector('#user-login').value.trim();
  const password = document.querySelector('#password-login').value.trim();

  if (userInfo && password) {
    // Send a POST request to the API endpoint
    const response = await fetch('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ userInfo, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      // If successful, redirect the browser to the profile page
      document.location.replace('/profile');
    } else {
      alert(response.statusText);
    }
  }
};


document
  .querySelector('#login-form')
  .addEventListener('click', loginFormHandler);