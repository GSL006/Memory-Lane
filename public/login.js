document.addEventListener('DOMContentLoaded', function () {
  const wrapper = document.querySelector('.wrapper');
  const loginLink = document.querySelector('.login p');
  const registerLink = document.querySelector('.register a');
  const forgotLink = document.querySelector('.login a');
  const loginButton = document.querySelector('.btnLogin-popup');
  const iconClose = document.querySelector('.icon-close');
  const forgotLogin = document.querySelector('.forgot a');
  let userLoggedIn = false;


  const xhr = new XMLHttpRequest();

  // Specify the file name
  const fileName = 'flag.txt';

  // Configure the request
  xhr.open('GET', fileName, true);

  // Set up the event handler for when the request is complete
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const data = xhr.responseText;

      // Process the file content
      if (data.trim() === 'true') {
        userLoggedIn = true;
        loginButton.textContent = 'My Profile';
        // loginButton.addEventListener('click', function (event) {
        //   event.preventDefault(); 
        // });
        loginButton.disabled = true;
        updateNavigationLinks();
      }
      else {
        userLoggedIn = false;
        updateNavigationLinks();
      }
    }
  };

  // Send the request
  xhr.send();

  // Function to update navigation links based on login status
  function updateNavigationLinks() {
    const navigationLinks = document.querySelectorAll('.navigation a');
    navigationLinks.forEach(link => {
      if (!userLoggedIn) {
        if (link.id == 'dis') {
          // If user is not logged in, set the href to #
          link.href = '#';
        }

      }
    });
  }
  const zwoooopLink = document.getElementById('dis');
  zwoooopLink.addEventListener('click', function (event) {
    // Check if the user is not logged in
    if (!userLoggedIn) {
      event.preventDefault(); // Prevent the default behavior (navigating to the link)
      alert('Please log in to access Zwoooop.'); // Display an alert message
    }
  });

  // Call the function initially to set the initial state of links
  //updateNavigationLinks();

  forgotLogin.addEventListener('click', (e) => {
    e.preventDefault();
    wrapper.classList.remove('active1');
  });

  registerLink.addEventListener('click', (e) => {
    e.preventDefault();
    wrapper.classList.remove('active');
  });

  loginLink.addEventListener('click', (e) => {
    e.preventDefault();
    wrapper.classList.add('active');
  });

  forgotLink.addEventListener('click', (e) => {
    e.preventDefault();
    wrapper.classList.add('active1');
  });

  loginButton.addEventListener('click', () => {
    wrapper.classList.add('active-popup');
    wrapper.classList.remove('active');
    wrapper.classList.remove('active1');
  });

  iconClose.addEventListener('click', () => {
    wrapper.classList.remove('active-popup');
    document.querySelector("form").reset();
  });

  const loginForm = document.querySelector('.form-box.login form');
  const registerForm = document.querySelector('.form-box.register form');
  const forgotPasswordForm = document.querySelector('.form-box.forgot form');

  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const usernameOrEmail = document.getElementById('login-username-email').value;
    const password = document.getElementById('login-password').value;

    // Send login request to the server
    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ usernameOrEmail, password }),
    })
      .then(response => response.json())
      .then(data => {
        alert(data.message);
      })
      .catch(error => console.error('Error:', error));
  });

  registerForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const newUsername = document.getElementById('new-username').value;
    const newEmail = document.getElementById('new-email').value;
    const newPassword = document.getElementById('new-password').value;

    // Send register request to the server
    fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: newUsername, email: newEmail, password: newPassword }),
    })
      .then(response => response.json())
      .then(data => {
        alert(data.message);
        if (data.success) {
          // If registration is successful, switch to the login form
          wrapper.classList.remove('active');
        }
      })
      .catch(error => console.error('Error:', error));
  });

  forgotPasswordForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const forgotEmail = document.getElementById('forgot-email').value;

    // Send forgot password request to the server
    fetch('/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: forgotEmail }),
    })
      .then(response => response.json())
      .then(data => {
        alert(data.message);
      })
      .catch(error => console.error('Error:', error));
  });
});