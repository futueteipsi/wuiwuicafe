// SERVER CONFIGURATION & SETUP 
const i18n = require('i18n');
const path = require('path');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); 
const axios = require('axios'); 
const bcrypt = require('bcrypt');
const db = require('./database');

const app = express();
const PORT = 3000;

// MIDDLEWARE SETUP
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

i18n.configure({
    locales: ['en', 'lv'],
    directory: path.join(__dirname, 'locales', 'locales'), 
    defaultLocale: 'en',
    cookie: 'lang',
    queryParameter: 'lang',
    updateFiles: false
});

app.use(i18n.init);

app.use((req, res, next) => {
    res.locals.locale = req.getLocale();
    next();
});

app.get('/change-lang/:lang', (req, res) => {
    const targetLang = req.params.lang;
    if (['en', 'lv'].includes(targetLang)) {
        res.cookie('lang', targetLang, { maxAge: 900000, httpOnly: true });
        req.setLocale(targetLang);
    }
    res.redirect(req.get('referer') || '/');
});

// VIEW ENGINE SETUP
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// SESSION MANAGEMENT 
app.use(session({
    secret: 'wuiwuicafe_secure_key',
    resave: false,
    saveUninitialized: false
}));

// DATA STORAGE 
const myCats = [
    {
        name: "Snus",
        age: "3 years",
        description: "Snus is the fluffiest cat in our cafe. He loves chasing laser pointers and stealing teaspoons.",
        images: ["/images/snus1.jpg", "/images/snus2.jpg", "/images/snus3.jpg"] 
    },
    {
        name: "Koshka",
        age: "7 years",
        description: "Koshka is the only girl and the oldest one. She is calm, silent, and loves chin scratches.",
        images: ["/images/koshka1.jpg", "/images/koshka2.jpg", "/images/koshka3.jpg"]
    },
    {
        name: "Smokie",
        age: "7 months",
        description: "Our little sunshine! Smokie has the energy of 3 cats and loves every food in the world.",
        images: ["/images/smoki1.jpg", "/images/smoki2.jpg", "/images/smoki3.jpg"]
    }
];

// ROUTES
// HOME PAGE & API INTEGRATION 
app.get('/', async (req, res) => {
    let randomImages = [];
    try {
        const response = await axios.get('https://api.thecatapi.com/v1/images/search?limit=3');
        randomImages = response.data;
    } catch (error) {
        console.error("Error fetching API images:", error);
    }
    
    res.render('index', { 
        user: req.session.user, 
        apiCats: randomImages 
    });
});

// CATS GALLERY 
app.get('/cats', (req, res) => {
    res.render('cats', { 
        user: req.session.user,
        cats: myCats 
    });
});

// GAMES SECTION
app.get('/games', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render('games', { user: req.session.user });
});

app.get('/games/catsweeper', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render('catsweeper', { user: req.session.user });
});

// AUTHENTICATION
app.get('/register', (req, res) => {
    res.render('register', { user: req.session.user });
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hashedPassword], (err) => {
        if (err) {
            return res.send(`Error: Username ${username} already exists! <a href="/register">Try again</a>`);
        }
        res.redirect('/login');
    });
});

app.get('/login', (req, res) => {
    res.render('login', { user: req.session.user, error: null });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
        if (err || !user) {
            return res.render('login', { user: null, error: "User not found!" });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        
        if (validPassword) {
            req.session.user = user; 
            res.redirect('/');
        } else {
            res.render('login', { user: null, error: "Wrong password!" });
        }
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

// 404 page 
app.use((req, res) => {
    res.status(404).render('404', { user: req.session.user });
});

// start server
app.listen(PORT, () => {
    console.log(`Server running at: http://localhost:${PORT}`);
});