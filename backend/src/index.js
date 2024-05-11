const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const auth = require("./routes/auth.js");
const wallpaper = require("./routes/wallpaper.js");
const chats = require("./routes/chats.js");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 80;

// app.use(express.json());
app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser())

// login redirector -- must be above the public(frontend) magic
app.use("/", (req, res, next) => {
    const currentURL = `${req.secure ? 'https' : 'http'}://${req.hostname}${req.url}`;
    const parsedURL = new URL(currentURL);
    const routePath = parsedURL.pathname;
    if (routePath == '/') { // You are in the homepage
        if (!req.cookies) return res.redirect('/login');
        // checking user cookies...
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        if (!token) { // token not found!
          return res.redirect('/login');
        }
        // token found
    }
    if (routePath == '/register') {
        if (req.cookies) {
            const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
            if (token) {
                // already logged in:
                return res.redirect('/');
            }
        }
    }
    next();
});

// frontend magic
app.use(express.static(path.join(__dirname, '../../frontend'), { extensions: ['html'] }));

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    console.error('Error: MONGO_URI environment variable is not defined.');
    process.exit(1);
}
console.warn(mongoUri);
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.warn('Connected to MongoDB')).catch(err => console.error('Error connecting to MongoDB:', err));

app.use("/auth", auth); // Mount the auth routes
app.use("/wallpaper", wallpaper); // Mount the wallpaper routes
app.use("/chats", chats); // Mount the chats routes

app.listen(port, function () {
    console.warn('Server is running on port:', port);
});
