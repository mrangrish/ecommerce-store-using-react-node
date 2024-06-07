const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/AllUsers', (req, res) => {
    try {
        const sql = "SELECT * FROM User WHERE role_as = 0";
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error fetching product count', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.status(200).json(result);
        });
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;