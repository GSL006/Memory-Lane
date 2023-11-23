const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const app = express();
const fs = require('fs');

// Use body-parser to parse JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Dummy user data for demonstration purposes (in a real app, you'd use a database)
let users = [
  { username: 'user1', hashedPassword: '$2b$10$zWau/E8v3YPSqotQy1XsOecB2Isf0Lfu6aGp7O0bPhll4Hc4OXu2i', email: 'user1@example.com' },
  { username: 'user2', hashedPassword: '$2b$10$H2GvlyatG9EBvJfZcblNSezoyhMd5KMDU7v7jv1uqlOUMb2YG3.HS', email: 'user2@example.com' },
];

// Add this route for the root endpoint
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Login route
app.post('/login', (req, res) => {
  const { usernameOrEmail, password } = req.body;
  const user = users.find(u => (u.username === usernameOrEmail || u.email === usernameOrEmail));

  if (user && bcrypt.compareSync(password, user.hashedPassword)) {
    const directory = 'public';
    const fileName = 'flag.txt';
    const fileContent = 'true';
    const filePath = path.join(directory, fileName);
    // Use the fs.writeFile method to create the file
    fs.writeFile(filePath, fileContent, (err) => {
      if (err) {
        console.error('Error creating flag:', err);
      } else {
        console.log('Flag created successfully!');
      }
    });
    res.json({ success: true, message: 'Login successful' });
    //window.open("http://127.0.0.1:5501/public/login.html")
    //res.redirect('http://127.0.0.1:5501/public/login.html');

  } else {
    res.json({ success: false, message: 'Invalid username, email, or password' });
  }
});

// Register route
app.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  // Check if the username is already taken
  const isUsernameTaken = users.some(u => u.username === username);
  if (isUsernameTaken) {
    res.json({ success: false, message: 'Username is already taken' });
  } else {
    // Hash the password before storing it
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Add the new user to the backend
    const newUser = { username, hashedPassword, email };
    users.push(newUser);

    // Log the user's credentials to the terminal (with hashed password)
    console.log(`New user registered:\nUsername: ${username}\nHashed Password: ${hashedPassword}\nEmail: ${email}`);

    res.json({ success: true, message: 'Registration successful' });
  }
});

// Forgot password route
app.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  // Dummy logic for forgot password (in a real app, you'd send a reset link to the user's email)
  res.json({ success: true, message: 'Password reset email sent' });
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
