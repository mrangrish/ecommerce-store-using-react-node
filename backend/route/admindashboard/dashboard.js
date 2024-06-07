const express = require('express');
const router = express.Router();
const db = require('../db');


router.get('/productcount', (req, res) => {
    try {
        const sql = "SELECT COUNT(*) AS count FROM product";
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error fetching product count', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            if (result.length > 0) {
                res.json({ count: result[0].count });
            } else {
                res.json({ count: 0 });
            }
        });
    } catch (error) {
        console.log(error);
    }
});

router.get('/userscount', (req, res) => {
    try {
        const sql = "SELECT COUNT(*) AS count FROM user WHERE role_as = 0";
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error fetching users count', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.status(200).json({ count: result[0].count });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
module.exports = router;