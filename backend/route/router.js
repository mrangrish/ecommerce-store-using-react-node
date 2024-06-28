const express = require('express');
const router = express.Router();
const db = require('./db'); 

router.get('/categories', (req, res) => {
    const sql = "SELECT * FROM categories WHERE Status = 1";
    db.query(sql, (err, categories) => {
        if (err) {
            console.error('Error fetching categories:', err);
            return res.status(500).json({ error: 'Error fetching categories' });
        }
        res.json(categories);
    });
});

router.get('/latestProduct', (req, res) => {
    try {
        const sql = `SELECT * FROM Product ORDER BY id DESC LIMIT 4`;
        db.query(sql, (err, product) => {
            if (err) {
                console.error('Error fetching products:', err);
                return res.status(500).json({ error: 'Error fetching products' });
            }
            res.status(200).json(product);
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/GetSubcategories/:category_id', (req, res) => {
    try {
        const category_id = req.params.category_id;
        const sql = `SELECT * FROM subcategories WHERE categories_id = ? AND Status = 1`;
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