const express = require('express');
const router = express.Router();
const db = require('../db'); 

router.get('/Productbrand/:category_id', (req, res) => {
    try {
        const categoryId = req.params.category_id;
        const sql = `SELECT DISTINCT(product_brand) FROM product WHERE category_id = ? ORDER BY id DESC`;
        db.query(sql, [categoryId], (err, brands) => {
            if (err) {
                console.error('error fetching brands', err);
                return res.status(500).json({ error: 'Internal Server Error' })
            }
            res.status(200).json(brands);
        })
    } catch (error) {
        console.error('error in route /Productbrand/:category_id', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/ProductColor/:category_id', (req, res) => {
    try {
        const categoryId = req.params.category_id;
        const sql = `SELECT DISTINCT color FROM product WHERE category_id = ?`;
        db.query(sql, [categoryId], (err, colors) => {
            if (err) {
                console.error('Error Fetching Color:', err);
                return res.status(500).json({ error: 'Error fetching color' });
            }
            res.status(200).send(colors);
        });
    } catch (error) {
        res.status(500).send(error);
    }
});


router.get('/products/:category_id', (req, res) => {
    try {
        const { category_id } = req.params;
        const { subcategories, colors, brands } = req.query;

        let sql = `SELECT * FROM product WHERE category_id = ?`;
        let params = [category_id];

        let conditions = [];
        if (subcategories && subcategories.trim() !== "") {
            conditions.push(`subcategory_id IN (${subcategories.split(',').map(id => '?').join(',')})`);
            params = params.concat(subcategories.split(','));
        }

        if (colors && colors.trim() !== "") {
            conditions.push(`color IN (${colors.split(',').map(id => '?').join(',')})`);
            params = params.concat(colors.split(','));
        }

        if (brands && brands.trim() !== "") {
            conditions.push(`product_brand IN (${brands.split(',').map(id => '?').join(',')})`);
            params = params.concat(brands.split(','));
        }

        if (conditions.length > 0) {
            sql += " AND " + conditions.join(' AND ');
        }

        sql += " ORDER BY id DESC";

        db.query(sql, params, (err, products) => {
            if (err) {
                console.error('Error fetching products:', err);
                return res.status(500).json({ error: 'Error fetching products' });
            }
            res.status(200).json(products);
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/ProductSubcategories/:category_id', (req, res) => {
    try {
        const categoryId = req.params.category_id;
        const sql = `SELECT * FROM subcategories WHERE categories_id = ?`;
        db.query(sql, [categoryId], (err, subcategories) => {
            if (err) {
                console.error('Error Fetching Subcategories:', err);
                return res.status(500).json({ error: 'Error fetching Subcategories' });
            }
            res.status(200).send(subcategories);
        });
    } catch (error) {
        res.status(500).send(error);
    }
});


module.exports = router;