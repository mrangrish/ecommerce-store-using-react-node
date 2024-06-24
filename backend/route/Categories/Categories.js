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
    try{ 
        const categoryId = req.params.id;
        const subcategories_name = req.body.subcategories_name;
        const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const sql = `INSERT INTO subcategories (categories_id, subcategories_name, created_at) VALUES (?, ?, ?)`;
        db.query(sql, [categoryId, subcategories_name, currentDateTime], (err, result) => {
            if(err) {
                return res.status(500).json({ message: 'Failed to add subcategory', error: err.message });
            }
           res.status(200).json({message: 'Subcategory added successfully!'});
        })

    } catch (error) {
        res.status(500).json({ message: 'Failed to add category', error: error.message });
    }

})


router.put('/updateSubcategories/:id', (req, res) => {
    // try {
    //   const id = req.params.id;
    //   const subcategories_name = req.body.subcategories_name;
        
    //   const sql = `UPDATE subcategories SET  subcategories_name = ? WHERE id = ?`;
    //   db.query(sql, [subcategories_name, id], (err, result) => {
    //     if(err) {
    //         return res.status(500).json({ message: 'Failed to update Subcategories', error: err.message });
    //     }
    //     res.status(200).json({message: 'Update Subcategories Successfully!'});
    //   });

    // } catch (error) {
    //     res.status(500).json({message: 'Failed to update Subcategories', error: error.message});
    // }
    try {
        const id = req.params.id;
        const subcategories_name = req.body.subcategories_name; 
        const sql = "UPDATE subcategories SET subcategories_name = ?  WHERE id = ? ";
        db.query(sql, [id, subcategories_name], (err, result) => {
            if(err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.status(200).json(result);
        });
    } catch (error) {
       res.status(500).send(error);
    }
})

module.exports = router;
