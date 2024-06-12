require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const session = require('express-session');
const db = require('/Users/Kuroit kappa/Desktop/reactjs/ecomm/backend/route/db');

const app = express();
const router = express.Router();

const otpStorage = {};

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

app.use(cors());
app.use(bodyParser.json());
app.use(session({
    secret: 'session',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

function generateRandomPassword() {
    const length = 8;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}

router.post('/send-email-otp', (req, res) => {
    const { email } = req.body;
    const sql = "SELECT * FROM user WHERE email = ? AND role_as = 0";

    db.query(sql, [email], (error, results) => {
        if (error) {
            console.error("Error querying database:", error);
            return res.status(500).send({ success: false, error: "Database error" });
        }
        if (results.length === 0) {
            const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
            const randomPassword = generateRandomPassword();

            bcrypt.genSalt(10, (err, salt) => {
                if (err) {
                    console.error('Error generating salt:', err);
                    return res.status(500).json({ error: 'Error generating salt' });
                }
                bcrypt.hash(randomPassword, salt, (err, hash) => {
                    if (err) {
                        console.error('Error hashing password:', err);
                        return res.status(500).json({ error: 'Error hashing password' });
                    }
                    const insertUserQuery = "INSERT INTO user (email, password, password_view, created_at) VALUES (?, ?, ?, ?)";
                    db.query(insertUserQuery, [email, hash, randomPassword, currentDateTime], (insertError, insertResults) => {
                        if (insertError) {
                            console.error("Error inserting new user:", insertError);
                            return res.status(500).send({ success: false, error: "Database error" });
                        }

                        const userId = insertResults.insertId;
                        req.session.userId = userId;
                        req.session.insertIduserid = userId;

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
                                return res.status(500).send({ success: false, error: "Failed to send OTP" });
                            } else {
                                otpStorage[email] = { otp, randomPassword };
                                return res.status(201).send({ success: true, userId, randomPassword });
                            }
                        });
                    });
                });
            });
        } else {
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
                    return res.status(500).send({ success: false, error: "Failed to send OTP" });
                } else {
                    otpStorage[email] = { otp };
                    res.status(200).send({ success: true });
                }
            });
        }
    });
});

router.post('/verify-email-otp', (req, res) => {
    const { email, otp } = req.body;
    if (otpStorage[email] && otpStorage[email].otp == otp) {
        const randomPassword = otpStorage[email].randomPassword;
        delete otpStorage[email];

        const sql = "SELECT id FROM user WHERE email = ?";
        db.query(sql, [email], (error, results) => {
            if (error) {
                console.error("Error querying database:", error);
                return res.status(500).send({ success: false, error: "Database error" });
            } else if (results.length === 0) {
                return res.status(404).send({ success: false, error: "User not found" });
            } else {
                const userId = results[0].id;
                req.session.userId = userId;
                return res.status(201).send({ success: true, userId, randomPassword });
            }
        });
    } else {
        return res.status(400).send({ success: false, message: 'OTP verification failed' });
    }
});

module.exports = router;