const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const db = require('../db');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const session = require('express-session');

app.use(cors());
app.use(bodyParser.json());
app.use(session({
    secret: 'session',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

router.post('/adminlogin', [
    check('email').isEmail(),
    check('password').isLength({ min: 6 })
], (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const sql = "SELECT * FROM user WHERE email = ? AND role_as = 1";
    db.query(sql, [email], (err, data) => {
        if (err) {
            console.error('Error finding user:', err);
            return res.status(500).json({ error: 'Error finding user' });
        }
        if (data.length === 0) {
            console.log("User not found");
            return res.status(401).json({ error: 'User not found' });
        }
        const user = data[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).json({ error: 'Error comparing passwords' });
            }
            if (isMatch) {
                req.session.userId = user.id;
                console.log(req.session.userId);
                return res.status(200).json({ message: 'Login successful' });
            } else {
                console.log('Incorrect password');
                return res.status(401).json({ error: 'Incorrect password' });
            }
        });
    });
});

router.get('/adminlogout', (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).json({ error: 'Logout failed' });
            }
            console.log('Logout successfully');
            return res.status(200).json({ message: 'Logout successful' });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Logout failed' });
    }
});

module.exports = router;