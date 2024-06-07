const express = require('express');
const router = express.Router();
const db = require('../db');

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
            let sql;

            if (hasOrderAddress) {
                sql = `SELECT user.id, user.name, user.email, user.phone, user.role_as, order_address.Address, order_address.user_id, order_address.City, order_address.zip_Code, order_address.id as orderAddress_id FROM user INNER JOIN order_address ON order_address.user_id = user.id WHERE user.id = ?`;
            } else {
                sql = `SELECT * FROM user WHERE user.id = ?`;
            }

            db.query(sql, [userId], (err, product) => {
                if (err) {
                    console.log('Error fetching user:', err);
                    return res.status(500).json({ error: 'Error Fetching User' });
                }
                
                res.status(200).json(product);
            });
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
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

module.exports = router;