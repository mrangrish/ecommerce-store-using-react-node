require('dotenv').config();
const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const router = express.Router();
const app = express();
const db = require('/Users/Kuroit kappa/Desktop/reactjs/ecomm/backend/route/db');
const otpStorage = {};
const bcrypt = require('bcryptjs');
app.use(cors());
app.use(bodyParser.json());

const SMTP_MAIL = 'mamta@kuroit.in';
const SMTP_PORT = '465';
const SMTP_PASSWORD = 'ihnulsocvffkviqq';
const SMTP_HOST = 'smtp.gmail.com';

const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: true,
    auth: {
        user: SMTP_MAIL,
        pass: SMTP_PASSWORD
    }
});


router.post('/send-email-otp', (req, res) => {
    const { email } = req.body;
    const sql = "SELECT * FROM user WHERE email = ? AND role_as = 0";

    db.query(sql, [email], (error, results) => {
        if (error) {
            console.error("Error querying database:", error);
            res.status(500).send({ success: false, error: "Database error" });
        } else if (results.length === 0) {
            // Email not found, prompt user to register first
            return res.status(400).json({ error: 'user is not register' });
        } else {
            // Email found, generate OTP and send email
            const otp = Math.floor(100000 + Math.random() * 900000);
            const mailOptions = {
                from: SMTP_MAIL,
                to: email,
                subject: 'Your OTP Code',
                text: `Your OTP code is ${otp}`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("Error sending OTP:", error);
                    res.status(500).send({ success: false, error: "Failed to send OTP" });
                } else {
                    otpStorage[email] = otp;
                    res.status(200).send({ success: true });
                }
            });
        }
    });
});


router.post('/verify-email-otp', (req, res) => {
    const { email, otp } = req.body;
    if (otpStorage[email] && otpStorage[email] == otp) {
        delete otpStorage[email];
        // Retrieve the user ID from the database based on the email
        const sql = "SELECT id FROM user WHERE email = ?";
        db.query(sql, [email], (error, results) => {
            if (error) {
                console.error("Error querying database:", error);
                res.status(500).send({ success: false, error: "Database error" });
            } else if (results.length === 0) {
                res.status(404).send({ success: false, error: "User not found" });
            } else {
                const userId = results[0].id;
                // Set the user ID in the session
                req.session.userId = userId;
                console.log(req.session.userId);
                res.status(200).send({ success: true, userId: userId });
            }
        });
    } else {
        res.status(400).send({ success: false, message: 'OTP verification failed' });
    }
});

router.post('/insertuser', (req, res) => {
    const { name, email, password } = req.body;

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
                const insertUserQuery = "INSERT INTO user (name, email, password, created_at) VALUES (?, ?, ?, ?)";
                const values = [name, email, hash, currentDateTime];

                db.query(insertUserQuery, values, (err, result) => {
                    if (err) {
                        console.error('Error inserting user into database:', err);
                        return res.status(500).json({ error: 'Error creating user' });
                    }

                    req.session.userId = result.insertId;
                    console.log('Session userId set:', req.session.userId);

                    req.session.save((saveErr) => {
                        if (saveErr) {
                            console.error('Error saving session:', saveErr);
                            return res.status(500).json({ error: 'Error saving session' });
                        }
                        return res.status(200).json({ message: 'Register successfully', userId: req.session.userId });
                    });
                });
            });
        });
    });
});


module.exports = router;