const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const session = require('express-session');
const { check, validationResult } = require('express-validator');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cors = require('cors');

const clientId = "363201812379-l4vkkrse7e89vn10c1dggd8ikpu24ja5.apps.googleusercontent.com";
const clientSecret = "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";

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};

const app = express();
app.use(cors(corsOptions));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: clientId,
    clientSecret: clientSecret,
    callbackURL: "http://localhost:8081/userAuth/auth/google/callback"
},
    (token, tokenSecret, profile, done) => {
        try {
            const email = profile.emails[0].value;
            const name = profile.displayName;
            const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
            db.query('SELECT * FROM user WHERE email = ?', [email], (err, result) => {
                if (err) return done(err);

                if (result.length > 0) {
                    const user = result[0];
                    return done(null, user);
                } else {
                    const newUser = { name, email, password: '',  created_at };
                    db.query('INSERT INTO user SET ?', newUser, (err, result) => {
                        if (err) return done(err);
                        newUser.id = result.insertId;
                        return done(null, newUser);
                    });
                }
            });
        } catch (error) {
            done(error, null);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    db.query('SELECT * FROM user WHERE id = ?', [id], (err, result) => {
        if (err) return done(err);
        done(null, result[0]);
    });
});

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: 'http://localhost:3000/Login' }),
    (req, res) => {
        if (req.user) {
            req.session.userId = req.user.id;
            // console.log(req.session.userId);
            res.redirect('http://localhost:3000');
        } else {
            res.redirect('http://localhost:3000/Login');
        }
    }
);

router.post('/signup', (req, res) => {
    const { name, email, password, phone } = req.body;
  
    const checkPhoneQuery = "SELECT * FROM user WHERE phone = ?";
    db.query(checkPhoneQuery, [phone], (err, result) => {
        if(err) {
            console.error('Error checking phone number existence:', err);
            return res.status(500).json({error: 'Error checking phone existence '});
        } 
        if (result.length > 0) {
            return res.status(401).json({ error: 'Phone number already exists' });
        
          }
    const checkEmailQuery = "SELECT * FROM user WHERE email = ?";
    db.query(checkEmailQuery, [email], (err, result) => {
      if (err) {
        console.error('Error checking email existence:', err);
        return res.status(500).json({ error: 'Error checking email existence' });
      }
      if (result.length > 0) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          console.error('Error generating salt:', err);
          return res.status(500).json({ error: 'Error generating salt' });
        }
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).json({ error: 'Error hashing password' });
          }

          const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
          const insertUserQuery = "INSERT INTO user (name, email, password, phone, created_at) VALUES (?, ?, ?, ?, ?)";
          const values = [name, email, hash, phone, currentDateTime];
  
          db.query(insertUserQuery, values, (err, result) => {
            if (err) {
              console.error('Error inserting user into database:', err);
              return res.status(500).json({ error: 'Error creating user' });
            }
        
            req.session.userId = result.insertId;
            // console.log(req.session.userId);
        
            return res.status(200).json({ message: 'register successfully' }); 
          });
        });
        });
      });
    });
  });


  router.post('/login', [
    check('email').isEmail(),
    check('password').isLength({ min: 6 })
], (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const sql = "SELECT * FROM user WHERE email = ? AND role_as = 0";
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

router.get('/Userlogout', (req, res) => {
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
