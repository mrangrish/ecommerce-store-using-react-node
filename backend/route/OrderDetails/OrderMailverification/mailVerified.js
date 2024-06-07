require('dotenv').config();
const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const router = express.Router();
const app = express();
const db = require('/Users/Kuroit kappa/Desktop/reactjs/ecomm/backend/route/db');
const otpStorage = {};

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


module.exports = router;