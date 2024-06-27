const express = require('express');
const router = express.Router();
const multer = require('multer');
const db = require('../db');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

router.get('/categories', (req, res) => {
    const sql = "SELECT * FROM categories";
    db.query(sql, (err, categories) => {
        if (err) {
            console.error('Error fetching categories:', err);
            return res.status(500).json({ error: 'Error fetching categories' });
        }
        res.json(categories);
    });
});

router.post('/addNewCategories', upload.single('categories_image'), (req, res) => {
    try {
        const { categories_name } = req.body;
        const categories_image = req.file.filename;
        const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const sql = `INSERT INTO categories (categories_name, categories_image, created_at) VALUES (?, ?, ?)`;

        db.query(sql, [categories_name, categories_image, currentDateTime], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to add category', error: err.message });
            }
            const newCategory = { id: result.insertId, categories_name, categories_image };
            res.status(201).json({ message: 'Category added successfully!', category: newCategory });
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add category', error: error.message });
    }
});

router.post('/addNewSubcategories/:id', (req, res) => {
    try {
        const categoryId = req.params.id;
        const subcategories_name = req.body.subcategories_name;
        const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const sql = `INSERT INTO subcategories (categories_id, subcategories_name, created_at) VALUES (?, ?, ?)`;
        db.query(sql, [categoryId, subcategories_name, currentDateTime], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to add subcategory', error: err.message });
            }
            res.status(200).json({ message: 'Subcategory added successfully!' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add subcategory', error: error.message });
    }
});

router.put('/updateSubcategories/:id', (req, res) => {
    try {
        const id = req.params.id;
        const subcategories_name = req.body.subcategories_name;
        const sql = "UPDATE subcategories SET subcategories_name = ? WHERE id = ?";
        db.query(sql, [subcategories_name, id], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to update subcategory', error: err.message });
            }
            res.status(200).json({ message: 'Subcategory updated successfully!' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update subcategory', error: error.message });
    }
});

router.put('/updatecategories/:id', upload.single('categories_image'), (req, res) => {

    try {
        if (req.file) {
            const categoryId = req.params.id;
            const { categories_name } = req.body;
            const categories_image = req.file.filename;
            const sql = 'UPDATE categories SET categories_name = ?, categories_image = ? WHERE id = ?';
            db.query(sql, [categories_name, categories_image], (err, result) => {
                if (err) {
                    return res.status(500).json({ message: 'Failed to add subcategory', error: err.message });
                }
                res.status(200).json({ message: 'Subcategory added successfully!' });

            });
        } else {
            const categoryId = req.params.id;
            const { categories_name } = req.body;
            const sql = 'UPDATE categories SET categories_name = ? WHERE id = ?';
            const data = [categories_name, categoryId];
            db.query(sql, data, (err, result) => {
                if (err) {
                    console.error('Error updating category:', err);
                    return res.status(500).json({ error: 'Failed to update category.' });
                }
                res.status(200).json({ message: 'Category updated successfully!' });
            });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
});


router.put('/updateCategoriesStatus/:id', (req, res) => {
    try {
        const id = req.params.id;
        const sql = `SELECT * FROM categories WHERE id = ?`;
        db.query(sql, [id], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to count Status', error: err.message });
            }

            if (result[0].Status === 1) {
                const Status = 0;
                const sql = `UPDATE categories SET Status = ? Where id = ?`;
                db.query(sql, [Status, id], (err, result) => {
                    if (err) {
                        return res.status(500).json({ message: 'Failed to update Categories', error: err.message });
                    }
                    res.status(200).json({ message: 'Categories Status Update SuccessFully!' });
                });
            } else {
                const Status = 1;
                const sql = `UPDATE categories SET Status = ? Where id = ?`;
                db.query(sql, [Status, id], (err, result) => {
                    if (err) {
                        return res.status(500).json({ message: 'Failed to update Categories', error: err.message });
                    }
                    res.status(200).json({ message: 'Categories Status Update SuccessFully!' });
                });
            }
        })


    } catch (error) {
        res.status(500).json({ message: 'Failed to update catgeories Status', error: error.message });
    }
})

router.put('/updateSubcategoriesStatus/:id', (req, res) => {
    try {
        const id = req.params.id;
        const sql = `SELECT * FROM subcategories WHERE id = ?`;
        db.query(sql, [id], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to count Status', error: err.message });
            }

            if (result[0].Status === 1) {
                const Status = 0;
                const sql = `UPDATE subcategories SET Status = ? Where id = ?`;
                db.query(sql, [Status, id], (err, result) => {
                    if (err) {
                        return res.status(500).json({ message: 'Failed to update Categories', error: err.message });
                    }
                    res.status(200).json({ message: 'Categories Status Update SuccessFully!' });
                });
            } else {
                const Status = 1;
                const sql = `UPDATE subcategories SET Status = ? Where id = ?`;
                db.query(sql, [Status, id], (err, result) => {
                    if (err) {
                        return res.status(500).json({ message: 'Failed to update Categories', error: err.message });
                    }
                    res.status(200).json({ message: 'Categories Status Update SuccessFully!' });
                });
            }
        })


    } catch (error) {
        res.status(500).json({ message: 'Failed to update catgeories Status', error: error.message });
    }
})
module.exports = router;