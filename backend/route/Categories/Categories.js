const express = require('express');
const router = express.Router();
const multer = require('multer');
const db = require('../db');

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// Fetch all categories
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

// Add a new category
router.post('/addNewCategories', upload.single('categories_image'), (req, res) => {
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
});

// Add a new subcategory
router.post('/addNewSubcategories/:id', (req, res) => {
    const categoryId = req.params.id;
    const { subcategories_name } = req.body;
    const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const sql = `INSERT INTO subcategories (categories_id, subcategories_name, created_at) VALUES (?, ?, ?)`;

    db.query(sql, [categoryId, subcategories_name, currentDateTime], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to add subcategory', error: err.message });
        }
        res.status(200).json({ message: 'Subcategory added successfully!' });
    });
});

// Update a subcategory
router.put('/updateSubcategories/:id', (req, res) => {
    const id = req.params.id;
    const { subcategories_name } = req.body;

    const sql = "UPDATE subcategories SET subcategories_name = ? WHERE id = ?";

    db.query(sql, [subcategories_name, id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to update subcategory', error: err.message });
        }
        res.status(200).json({ message: 'Subcategory updated successfully!' });
    });
});

// Update a category with or without a new image
router.put('/updatecategories/:id', upload.single('categories_image'), (req, res) => {
    const categoryId = req.params.id;
    const { categories_name } = req.body;

    let sql, data;
    if (req.file) {
        const categories_image = req.file.filename;
        sql = 'UPDATE categories SET categories_name = ?, categories_image = ? WHERE id = ?';
        data = [categories_name, categories_image, categoryId];
    } else {
        sql = 'UPDATE categories SET categories_name = ? WHERE id = ?';
        data = [categories_name, categoryId];
    }

    db.query(sql, data, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to update category', error: err.message });
        }
        res.status(200).json({ message: 'Category updated successfully!' });
    });
});

// Toggle category status
router.put('/updateCategoriesStatus/:id', (req, res) => {
    const id = req.params.id;

    const sql = `SELECT * FROM categories WHERE id = ?`;

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to retrieve category', error: err.message });
        }

        const newStatus = result[0].Status === 1 ? 0 : 1;
        const updateSql = `UPDATE categories SET Status = ? WHERE id = ?`;

        db.query(updateSql, [newStatus, id], (updateErr, updateResult) => {
            if (updateErr) {
                return res.status(500).json({ message: 'Failed to update category status', error: updateErr.message });
            }
            res.status(200).json({ message: 'Category status updated successfully!' });
        });
    });
});

// Toggle subcategory status
router.put('/updateSubcategoriesStatus/:id', (req, res) => {
    const id = req.params.id;

    const sql = `SELECT * FROM subcategories WHERE id = ?`;

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to retrieve subcategory', error: err.message });
        }

        const newStatus = result[0].Status === 1 ? 0 : 1;
        const updateSql = `UPDATE subcategories SET Status = ? WHERE id = ?`;

        db.query(updateSql, [newStatus, id], (updateErr, updateResult) => {
            if (updateErr) {
                return res.status(500).json({ message: 'Failed to update subcategory status', error: updateErr.message });
            }
            res.status(200).json({ message: 'Subcategory status updated successfully!' });
        });
    });
});




module.exports = router;