const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redis = require('redis');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const redisClient = redis.createClient();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true in production with HTTPS
}));

const users = {
    user1: 'password1',
    user2: 'password2'
};

// Login form route
app.get('/login', (req, res) => {
    res.send(`
        <form method="POST" action="/login">
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" required>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required>
            <button type="submit">Login</button>
        </form>
    `);
});

// Login processing route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (users[username] && users[username] === password) {
        req.session.username = username;
        res.send(`Welcome, ${username}! <a href="/logout">Logout</a>`);
    } else {
        res.send('Invalid username or password. <a href="/login">Try again</a>');
    }
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.send('Error logging out.');
        }
        res.redirect('/login');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
