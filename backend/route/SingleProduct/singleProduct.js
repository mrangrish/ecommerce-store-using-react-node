const express = require('express');
const router = express.Router();
const db = require('../db');
router.get('/SingleProduct/:Product_id', (req, res) => {
    
    try {
        const Product_id = req.params.Product_id;

        const sql = `SELECT categories.id as category_id, product.product_name, product.product_price, product.product_description, product.product_brand, product.product_image, product.id, categories.categories_name, Product.product_stock FROM Product INNER JOIN categories ON categories.id = product.category_id WHERE Product.id = ${Product_id}`;

        db.query(sql, (err, product) => {
            if (err) {
                console.log('error fetch single product:', err);
                return res.status(500).json({ error: 'Error Fetching Product' });
            }
            res.status(200).json(product);
        });
    }

    catch (error) {
        res.status(500).send(error);
    }

});

router.get('/RelatedProduct/:category_id/:product_id', (req, res) => {
    try {
        const { category_id, product_id } = req.params;
        const sql = `SELECT * FROM Product WHERE category_id = ? AND id != ? LIMIT 4`;
        db.query(sql, [category_id, product_id], (err, results) => {
            if (err) {
                console.error('Error fetching related products:', err);
                return res.status(500).json({ error: 'Error fetching related products' });
            }
            res.status(200).json(results);
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).send('Server error');
    }
});


module.exports = router;