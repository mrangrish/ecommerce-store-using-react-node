const express = require('express');
const router = express.Router();
const db = require('../db');

// POST route to add a new payment card
router.post('/PaymentCard', (req, res) => {
    const { userId, cardNumber, expiryDate, cvc } = req.body;
    const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const sql = `INSERT INTO payment_cart (user_id, Card_number, expiryDate, cvc, created_at) VALUES (?, ?, ?, ?, ?)`;
    const values = [userId, cardNumber, expiryDate, cvc, created_at];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.log('Error inserting payment card:', err);
            return res.status(500).json({ error: 'Error inserting payment card' });
        }
        return res.status(200).json({ message: 'Payment card added successfully' });
    });
});

router.get('/paymentcart/:user_id', (req, res) => {
    const userId = req.params.user_id;

    const sql = `SELECT * FROM payment_cart WHERE user_id = ?`;
    
    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.log('Error fetching payment cards:', err);
            return res.status(500).json({ error: 'Error fetching payment cards' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'No payment cards found for this user' });
        }
        return res.status(200).json({ paymentCards: results });
    });
});


module.exports = router;
