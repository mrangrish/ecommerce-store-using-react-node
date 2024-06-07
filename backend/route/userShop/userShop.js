const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/Getshop/categories', (req, res) => {
    try {
        const sql = `SELECT * FROM categories`;
        db.query(sql, (err, categories) => {
            if (err) {
                console.log('error fetch single product:', err);
                return res.status(500).json({ error: 'Error Fetching Product' });
            }
            res.status(200).json(categories);
        });  
    } catch(error) {
         console.log(error);
    }
})

router.get('/GetProduct/:category_id', (req, res) => {
    try {
        const category_id = req.params.category_id;
        const sql = `SELECT * FROM Product WHERE category_id = ? ORDER BY created_at DESC LIMIT 4`;
        db.query(sql, [category_id], (err, products) => {
            if (err) {
                console.log('Error fetching category products:', err);
                return res.status(500).json({ error: 'Error fetching products' });
            }
            res.status(200).json(products);
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;