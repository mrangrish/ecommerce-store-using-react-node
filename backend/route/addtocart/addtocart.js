const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/cart', (req, res) => {
    try {
        const users_id = req.body.users_id;
        const products_id = req.body.product_id;
        const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const checkSql = "SELECT * FROM addtocart WHERE user_id = ? AND product_id = ?";
        db.query(checkSql, [users_id, products_id], (checkErr, checkResult) => {
            if (checkErr) {
                console.error('error checking cart', checkErr);
                return res.status(500).json({ err: 'Error checking cart' });
            }

            if (checkResult.length > 0) {
                // Entry exists, update quantity
                const updateSql = "UPDATE addtocart SET quantity = quantity + 1 WHERE user_id = ? AND product_id = ?";
                db.query(updateSql, [users_id, products_id], (updateErr, updateResult) => {
                    if (updateErr) {
                        console.error('error updating cart', updateErr);
                        return res.status(500).json({ err: 'Error updating cart' });
                    }
                    res.status(200).json({ message: 'Cart updated successfully' });
                });
            } else {
                // Entry does not exist, insert new entry
                const insertSql = "INSERT INTO addtocart (user_id, product_id, quantity, created_at) VALUES (?, ?, 1, ?)";
                db.query(insertSql, [users_id, products_id, currentDateTime], (insertErr, insertResult) => {
                    if (insertErr) {
                        console.error('error adding to cart', insertErr);
                        return res.status(500).json({ err: 'Error adding to cart' });
                    }
                    res.status(201).json({ message: 'Added to cart successfully' });
                });
            }
        });
    } catch (error) {
        res.status(500).send(error);
    }
});



router.get('/addtocartcount/:id', (req, res) => {
    const userId = req.params.id;
    const sql = "SELECT COUNT(*) AS count FROM addtocart WHERE user_id = ?";
    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.error('Error fetching add to cart count', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (result.length > 0) {
            res.json({ count: result[0].count });
        } else {
            res.json({ count: 0 });
        }
    });
});

router.get('/Getaddtocart/:id', (req, res) => {
    try {
        const userId = req.params.id;
        const sql = "SELECT addtocart.id, addtocart.product_id, addtocart.quantity, addtocart.user_id, product.product_name, product.product_description, product.product_price, product.product_brand, product.product_image, product.product_offerPrice, product.product_stock  FROM addtocart INNER JOIN product ON product.id = addtocart.product_id WHERE user_id = ? ORDER BY addtocart.created_at DESC";

        db.query(sql, [userId], (err, result) => {
            if (err) {
                console.error('Error fetching add to cart product', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.status(200).send(result);
        })
    } catch (error) {
        res.status(500).send(error);
    }
});

router.delete('/deletecart/:id', (req, res) => {
    try {
        const addtocartId = req.params.id;
        const sql = "DELETE FROM addtocart WHERE id = ?";
        db.query(sql, [addtocartId], (err, result) => {
            if (err) {
                console.error('Error fetching delete addtocart product', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.status(200).send(result);
        })
    }
    catch (error) {
        res.status(500).send(error);
    }
})

router.get('/checkStock/:id/:quantity', (req, res) => {
    try { 
        const addtocartId = req.params.id;
        const quantity = req.params.quantity;
        
        const sql = "SELECT addtocart.quantity AS cart_quantity, product.PRODUCT_STOCK AS stock FROM addtocart INNER JOIN Product ON Product.id = addtocart.product_id WHERE addtocart.id = ?";
        
        db.query(sql, [addtocartId], (err, result) => {
            if(err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal Server Error'});
            }
            
            if (result.length === 0) {
                return res.status(404).json({ error: 'Item not found in the cart' });
            }
            
            const cartQuantity = result[0].cart_quantity;
            const stock = result[0].stock;
            
            const stockAvailable = cartQuantity <= stock;
            res.status(200).json({ stockAvailable });
        });
    } catch (error) {
        res.status(500).send(error);
    }
});
router.put('/updatequantity/:id/:quantity', (req, res) => {
    try {
        const addtocartId = req.params.id;
        const quantity = req.params.quantity; 
        const sql = "UPDATE addtocart SET quantity = ?  WHERE id = ? ";
        db.query(sql, [quantity, addtocartId], (err, result) => {
            if(err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.status(200).json(result);
        });
    } catch (error) {
       res.status(500).send(error);
    }
});


module.exports = router;