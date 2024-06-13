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
                const sql = `SELECT user.id, user.name, user.email, user.phone, user.role_as, order_address.Address, order_address.user_id, order_address.City, order_address.zip_Code, order_address.id as orderAddress_id FROM user INNER JOIN order_address ON order_address.user_id = user.id WHERE user.id = ?`;
                db.query(sql, [userId], (err, product) => {
                    if (err) {
                        console.log('Error fetching user:', err);
                        return res.status(500).json({ error: 'Error Fetching User' });
                    }

                    res.status(200).json(product);
                });
            } else {
                console.log("Order details do not exist for the user");
                res.status(201).json({ error: 'Order details not found for the user' });
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/checkuser/:userId', (req, res) => {
    const userId = req.params.userId;
    const sql = "SELECT * FROM user WHERE id = ?";
    
    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.error('Error checking user:', err);
            return res.status(500).json({ error: 'Error checking user' });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(result[0]);
    });
});

router.put('/updatePhoneNumber/:userId', (req, res) => {
    const userId = req.params.userId;
    const { phone, Address, City, zip_Code } = req.body;

    const updateUserSql = `UPDATE user SET phone = ? WHERE id = ?`;

    db.query(updateUserSql, [phone, userId], (err, result) => {
        if (err) {
            console.log('Error updating phone number:', err);
            return res.status(500).json({ error: 'Error Updating Phone Number' });
        }

        const checkOrderAddressSql = `SELECT COUNT(*) AS count FROM order_address WHERE user_id = ?`;
        db.query(checkOrderAddressSql, [userId], (err, result) => {
            if (err) {
                console.log('Error checking order address:', err);
                return res.status(500).json({ error: 'Error Checking Order Address' });
            }

            const hasOrderAddress = result[0].count > 0;

            if (hasOrderAddress) {
                const updateOrderAddressSql = `UPDATE order_address SET Address = ?, City = ?, zip_Code = ? WHERE user_id = ?`;
                db.query(updateOrderAddressSql, [Address, City, zip_Code, userId], (err, result) => {
                    if (err) {
                        console.log('Error updating order address:', err);
                        return res.status(500).json({ error: 'Error Updating Order Address' });
                    }
                    res.status(200).json({ message: 'User and order address updated successfully' });
                });
            } else {
                const insertOrderAddressSql = `INSERT INTO order_address (user_id, Address, City, zip_Code) VALUES (?, ?, ?, ?)`;
                db.query(insertOrderAddressSql, [userId, Address, City, zip_Code], (err, result) => {
                    if (err) {
                        console.log('Error inserting order address:', err);
                        return res.status(500).json({ error: 'Error Inserting Order Address' });
                    }
                    res.status(200).json({ message: 'User and order address updated successfully' });
                });
            }
        });
    });
});

router.post('/movecartItems', (req, res) => {
    console.log(req.body);
    try {
        const userId = req.body.userId;
        const productId = req.body.productId;
        // Assuming quantity is also sent in the request body
        const quantity = req.body.quantity;
        const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

        // Adjust the SQL query to include the quantity value
        const sql = "INSERT INTO addtocart (user_id, product_id, quantity, created_at) VALUES (?, ?, ?, ?)";
        // Pass all values in the array for parameterized query
        db.query(sql, [userId, productId, quantity, currentDateTime], (err, result) => {
            if (err) {
                console.error('Error inserting into addtocart:', err);
                return res.status(500).json({ error: 'Error inserting into addtocart' });
            }
            res.status(201).json({ message: 'Added to cart successfully' });
        });

    } catch (error) {
        console.error('Error in movecartItems endpoint:', error);
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