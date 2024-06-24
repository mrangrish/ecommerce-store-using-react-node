const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../db'); // Adjust the path based on your project structure

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/'); 
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Specify the file name
    }
});

const upload = multer({ storage });

// Endpoint to add new category
router.post('/addNewCategories', upload.single('categories_image'), (req, res) => {
    try {
        const { categories_name } = req.body;
        const categories_image = req.file.filename; // Get the filename from the uploaded file
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

module.exports = router;
