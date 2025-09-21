const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage for users
const users = [];

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Signup route
app.post('/signup', (req, res) => {
    const { firstname, lastname, email, birthdate, password, repassword } = req.body;
    
    // Basic validation
    if (!firstname || !lastname || !email || !birthdate || !password || !repassword) {
        return res.status(400).send(`
            <html>
                <head>
                    <title>Signup Error</title>
                    <link rel="stylesheet" href="/css/style.css">
                </head>
                <body>
                    <div class="container">
                        <div class="error">All fields are required!</div>
                        <a href="/signup" class="btn">Back to Signup</a>
                    </div>
                </body>
            </html>
        `);
    }
    
    if (password !== repassword) {
        return res.status(400).send(`
            <html>
                <head>
                    <title>Signup Error</title>
                    <link rel="stylesheet" href="/css/style.css">
                </head>
                <body>
                    <div class="container">
                        <div class="error">Passwords do not match!</div>
                        <a href="/signup" class="btn">Back to Signup</a>
                    </div>
                </body>
            </html>
        `);
    }
    
    // Check if user already exists
    if (users.find(user => user.email === email)) {
        return res.status(400).send(`
            <html>
                <head>
                    <title>Signup Error</title>
                    <link rel="stylesheet" href="/css/style.css">
                </head>
                <body>
                    <div class="container">
                        <div class="error">User with this email already exists!</div>
                        <a href="/signup" class="btn">Back to Signup</a>
                    </div>
                </body>
            </html>
        `);
    }
    
    // Store user data
    const newUser = {
        id: users.length + 1,
        firstname,
        lastname,
        email,
        birthdate,
        password
    };
    
    users.push(newUser);
    
    res.send(`
        <html>
            <head>
                <title>Signup Success</title>
                <link rel="stylesheet" href="/css/style.css">
            </head>
            <body>
                <div class="container">
                    <div class="success">
                        <h2>Signup Successful!</h2>
                        <p>Welcome ${firstname} ${lastname}!</p>
                        <p>You can now log in with your email and password.</p>
                    </div>
                    <a href="/login" class="btn">Go to Login</a>
                </div>
            </body>
        </html>
    `);
});

// Login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).send(`
            <html>
                <head>
                    <title>Login Error</title>
                    <link rel="stylesheet" href="/css/style.css">
                </head>
                <body>
                    <div class="container">
                        <div class="error">Email and password are required!</div>
                        <a href="/login" class="btn">Back to Login</a>
                    </div>
                </body>
            </html>
        `);
    }
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        return res.status(401).send(`
            <html>
                <head>
                    <title>Login Error</title>
                    <link rel="stylesheet" href="/css/style.css">
                </head>
                <body>
                    <div class="container">
                        <div class="error">Invalid email or password!</div>
                        <a href="/login" class="btn">Back to Login</a>
                    </div>
                </body>
            </html>
        `);
    }
    
    res.send(`
        <html>
            <head>
                <title>Login Success</title>
                <link rel="stylesheet" href="/css/style.css">
            </head>
            <body>
                <div class="container">
                    <div class="success">
                        <h2>Login Successful!</h2>
                        <p>Welcome back, ${user.firstname} ${user.lastname}!</p>
                        <p>Email: ${user.email}</p>
                        <p>Birth Date: ${user.birthdate}</p>
                    </div>
                    <div class="actions">
                        <a href="/login" class="btn">Login Again</a>
                        <a href="/signup" class="btn">Sign Up New User</a>
                    </div>
                </div>
            </body>
        </html>
    `);
});

// Route to view all registered users (for debugging)
app.get('/users', (req, res) => {
    res.json({ users: users.map(user => ({ ...user, password: '***' })) });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});