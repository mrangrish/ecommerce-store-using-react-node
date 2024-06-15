const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');

router.get('/orderUserId/:userId', (req, res) => {
    try {
        const userId = req.params.userId;

        const checkSql = `SELECT COUNT(*) AS count FROM order_address WHERE user_id = ?`;
        db.query(checkSql, [userId], (err, result) => {
            if (err) {
                console.log('Error checking order address:', err);
                return res.status(500).json({ error: 'Error Checking Order Address' });
            }

            const hasOrderAddress = result[0].count > 0;

            if (hasOrderAddress) {
                sql = `SELECT user.id, user.name, user.email, user.phone, user.role_as, order_address.Address, order_address.user_id, order_address.City, order_address.zip_Code, order_address.id as orderAddress_id FROM user INNER JOIN order_address ON order_address.user_id = user.id WHERE user.id = ?`;
                db.query(sql, [userId], (err, product) => {
                    if (err) {
                        console.log('Error fetching user:', err);
                        return res.status(500).json({ error: 'Error Fetching User' });
                    }
                    res.status(200).json(product);
                });
            } else {
                sql = `SELECT id, name, email, password_view ,phone, role_as, 
                              '' AS Address, '' AS City, '' AS zip_Code 
                       FROM user 
                       WHERE user.id = ?`;
                db.query(sql, [userId], (err, product) => {
                    if (err) {
                        console.log('Error fetching user:', err);
                        return res.status(500).json({ error: 'Error Fetching User' });
                    }
                    res.status(201).json(product);
                });
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/updatePhoneNumber/:userId', (req, res) => {
    const userId = req.params.userId;
    const { phone, Address, City, zip_Code } = req.body;

    const insertOrderAddressSql = `INSERT INTO order_address (user_id, Address, phone, City, zip_Code) VALUES (?, ?, ?, ?, ?)`;
    db.query(insertOrderAddressSql, [userId, Address, phone, City, zip_Code], (err, result) => {
        if (err) {
            console.log('Error inserting order address:', err);
            return res.status(500).json({ error: 'Error Inserting Order Address' });
        }
        return res.status(200).json({ message: 'User and order address updated successfully' });
    });
});


router.post('/movecartItems', (req, res) => {
    console.log(req.body);
    try {
        const users_id = req.body.userId;
        const products_id = req.body.productId;
        const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const checkSql = "SELECT * FROM addtocart WHERE user_id = ? AND product_id = ?";
        db.query(checkSql, [users_id, products_id], (checkErr, checkResult) => {
            if (checkErr) {
                console.error('error checking cart', checkErr);
                return res.status(500).json({ err: 'Error checking cart' });
            }

            if (checkResult.length > 0) {
                const updateSql = "UPDATE addtocart SET quantity = quantity + 1 WHERE user_id = ? AND product_id = ?";
                db.query(updateSql, [users_id, products_id], (updateErr, updateResult) => {
                    if (updateErr) {
                        console.error('error updating cart', updateErr);
                        return res.status(500).json({ err: 'Error updating cart' });
                    }
                    res.status(200).json({ message: 'Cart updated successfully' });
                });
            } else {
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

router.put('/updateDetails/:userId', (req, res) => {
    const userId = req.params.userId;
    const { password_view, name } = req.body;

    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            console.error('Error generating salt:', err);
            return res.status(500).json({ error: 'Error generating salt' });
        }
        bcrypt.hash(password_view, salt, (err, hash) => {
            if (err) {
                console.error('Error hashing password:', err);
                return res.status(500).json({ error: 'Error hashing password' });
            }
            const updateUserSql = `UPDATE user SET password = ?, Password_view = ?, name = ? WHERE id = ?`;

            db.query(updateUserSql, [hash, password_view, name, userId], (err, result) => {
                if (err) {
                    console.log('Error updating phone number:', err);
                    return res.status(500).json({ error: 'Error Updating Phone Number' });
                }
                console.log(hash);
                res.status(200).json({ message: 'User and order address updated successfully' });
            });
        });
    });
});

module.exports = router;