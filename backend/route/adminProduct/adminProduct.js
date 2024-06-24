const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, './public/Images');
    },
    filename: function (req, file, cb) {
        return cb(null, `${file.originalname}`);
    }
});

const upload = multer({ storage });

router.post('/addproduct', upload.array('product_image'), (req, res) => {
    try {
        const {
            product_name,
            product_description,
            product_stock,
            product_price,
            product_brand,
            category_id,
            subcategory_id,
            color_id,
            Product_offerPrice
        } = req.body;
        const product_images = req.files.map(file => file.filename);
        const imagesJSON = JSON.stringify(product_images);
        const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

        console.log("Product Data:", {
            product_name,
            product_description,
            product_stock,
            product_price,
            product_brand,
            category_id,
            subcategory_id,
            color_id,
            Product_offerPrice,
            product_images,
            currentDateTime,
        });

        const sql = `INSERT INTO product (product_name, product_description, product_stock, product_price, product_brand, product_image, category_id, subcategory_id, color, Product_offerPrice, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        db.query(sql, [
            product_name,
            product_description,
            product_stock,
            product_price,
            product_brand,
            imagesJSON,
            category_id,
            subcategory_id,
            color_id,
            Product_offerPrice,
            currentDateTime
        ], (err, result) => {
            if (err) {
                console.error('Error inserting product:', err);
                return res.status(500).json({ error: 'Failed to add product' });
            }
            res.status(201).json({ message: 'Product added successfully', productId: result.insertId });
        });
    } catch (error) {
        console.error('Error in try-catch:', error);
        res.status(500).send(error);
    }
});


router.get('/subcategories/:categories_id', (req, res) => {
    try {
        const categoryId = req.params.categories_id;
        const sql = `SELECT * FROM subcategories WHERE categories_id = ${categoryId}`;
        db.query(sql, (err, subcategories) => {
            if (err) {
                console.error('Error fetching subcategories:', err);
                return res.status(500).json({ error: 'Error fetching Subcategories' });
            }
            res.status(200).json(subcategories);
        });
    } catch (error) {
        res.status(500).send(error);
    }
});


router.get('/getProduct', (req, res) => {
    try {
        const sql = `SELECT * FROM PRODUCT ORDER BY PRODUCT.created_at DESC`;
        db.query(sql, (err, product) => {
            if (err) {
                console.error('Error fetching Product:', err);
                return res.status(500).json({ error: 'Error fetching product' });
            }
            res.status(200).json(product);
        })
    } catch (error) {
        res.status(500).send(error);
    }
})

router.delete('/deleteProduct/:Product_id', (req, res) => {
    try {
        const Product_id = req.params.Product_id;
        const sql = `DELETE FROM product  WHERE id = ${Product_id}`;
        db.query(sql, (err, deleteProduct) => {
            if (err) {
                console.error('Error fetching delete product:', err);
                return res.status(200).json({ error: 'Error fetching Product delete' });
            }
            res.status(200).json(deleteProduct);
        })
    } catch (error) {
        res.status(500).send(error);
    }
})

router.get('/ViewProduct/:Product_id', (req, res) => {
    try {
        const Product_id = req.params.Product_id;
        const sql = `SELECT * FROM Product INNER JOIN categories ON categories.id = product.category_id INNER JOIN subcategories ON subcategories.id = product.subcategory_id WHERE Product.id = ${Product_id}`;
        db.query(sql, (err, ViewProduct) => {
            if (err) {
                console.error('Error fetching View product:', err);
                return res.status(200).json({ error: 'Error Fetching Product View' });
            }
            res.status(200).json(ViewProduct);
        })
    } catch (error) {
        res.status(500).send(error);
    }
})

router.get('/editProduct/:product_id', (req, res) => {
    try {
        const Product_id = req.params.product_id;
        const sql = `SELECT Product.id, product.product_description, product.product_stock, product.product_price, product.product_offerPrice, product.product_image, product.product_brand, product.color, product.product_name, product.subcategory_id, product.category_id FROM Product INNER JOIN categories ON categories.id = product.category_id INNER JOIN subcategories ON subcategories.id = product.subcategory_id WHERE Product.id = ${Product_id}`;

        db.query(sql, (err, editProduct) => {
            if (err) {
                console.error('Error fetching edit product:', err);
                return res.status(200).json({ error: 'Error Fetching Product Edit' });
            }
            res.status(200).json(editProduct);
        })
    } catch (error) {
        res.status(500).send(error);
    }
});

router.put('/updateProduct/:product_id', upload.array('product_image'), (req, res) => {
    try {
        const {
            product_name,
            product_description,
            product_stock,
            product_price,
            product_brand,
            category_id,
            subcategory_id,
            color,
            product_offerPrice
        } = req.body;

        const product_images = req.files.map(file => file.filename);
        const imagesJSON = JSON.stringify(product_images);
        console.log(product_images.length);
        if (product_images.length > 0) {
            // console.log('yes');
            var sql = `UPDATE product SET product_name = ?, product_description = ?, product_stock = ?, product_price = ?, product_brand = ?, product_image = ?, category_id = ?, subcategory_id = ?, color = ?, product_offerPrice = ? WHERE id = ?`;

            db.query(sql, [
                product_name,
                product_description,
                product_stock,
                product_price,
                product_brand,
                imagesJSON,
                category_id,
                subcategory_id,
                color,
                product_offerPrice,
                req.params.product_id
            ], (err, result) => {
                if (err) {
                    console.error('Error updating product:', err);
                    return res.status(500).json({ error: 'Failed to update product' });
                }
                res.status(200).json({ message: 'Product updated successfully' });
            })
        } else {
            // console.log('no');
            var sql = `UPDATE product SET product_name = ?, product_description = ?, product_stock = ?, product_price = ?, product_brand = ?,  category_id = ?, subcategory_id = ?, color = ?, product_offerPrice = ? WHERE id = ?`;

            db.query(sql, [
                product_name,
                product_description,
                product_stock,
                product_price,
                product_brand,
                imagesJSON,
                category_id,
                subcategory_id,
                color,
                product_offerPrice,
                req.params.product_id
            ], (err, result) => {
                if (err) {
                    console.error('Error updating product:', err);
                    return res.status(500).json({ error: 'Failed to update product' });
                }
                res.status(200).json({ message: 'Product updated successfully' });

            });

        }

        // console.log(req.files);
        // const sql = `UPDATE product SET product_name = ?, product_description = ?, product_stock = ?, product_price = ?, product_brand = ?, product_image = ?, category_id = ?, subcategory_id = ?, color = ?, product_offerPrice = ? WHERE id = ?`;

        // db.query(sql, [
        //     product_name,
        //     product_description,
        //     product_stock,
        //     product_price,
        //     product_brand,
        //     imagesJSON,
        //     category_id,
        //     subcategory_id,
        //     color,
        //     product_offerPrice,
        //     req.params.product_id
        // ], (err, result) => {
        //     if (err) {
        //         console.error('Error updating product:', err);
        //         return res.status(500).json({ error: 'Failed to update product' });
        //     }
        //     res.status(200).json({ message: 'Product updated successfully' });
        // });
    } catch (error) {
        console.error('Error in try-catch:', error);
        res.status(500).send(error);
    }
});

module.exports = router;