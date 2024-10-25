const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const path = require("path");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        store: new FileStore({}),
        secret: 'mySecretKey',
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 1000 * 60 * 60 }
    })
);

app.use(express.static(path.join(__dirname, 'public')));

const users = [
    { username: 'nayomishah', password: 'nayomi12345678' },
    { username: 'user1', password: 'pass1234' },
];

function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

app.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/welcome');
    } else {
        res.sendFile(path.join(__dirname, 'public', 'home.html'));
    }
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        req.session.user = user;
        console.log(req.session.user);
        res.sendFile(path.join(__dirname, 'public', 'welcome.html'));
    } else {
        console.log("error");
        res.send('<h1>Invalid credentials. <a href="/login">Try again</a></h1>');
    }
});

app.get('/welcome', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'welcome.html'));
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.send('Error logging out');
        }
        res.sendFile(path.join(__dirname, 'public', 'logout.html'));
    });
});

app.listen(7000, () => {
    console.log('Listening on port no. 7000');
});
