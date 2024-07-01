const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/fetchSliderImage', (req, res) => {
    try {
        const sql = `SELECT * FROM slideshow_image`;
        db.query(sql, (err, result) => {
            if (err) {
                console.log('error fetch single product:', err);
                return res.status(500).json({ error: 'Error Fetching Product' });
            }
            res.status(200).json(result);
        })

    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = router;