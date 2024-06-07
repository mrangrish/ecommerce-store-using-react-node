const express = require("express");
const mysql = require('mysql');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { check, validationResult } = require('express-validator');
const { error } = require("console");
const { constants } = require("buffer");

const app = express();
app.use(cors());
app.use(express.json());

app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
    }
}))

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "react-ecom"
})


app.post('/signup', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    const checkEmailQuery = "SELECT * FROM user WHERE email = ?";
    db.query(checkEmailQuery, [email], (err, result) => {
        if (err) {
            console.error('Error checking email existence:', err);
            return res.status(500).json({ error: 'Error checking email existence' });
        }
        if (result.length > 0) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                console.error('Error generating salt:', err);
                return res.status(500).json({ error: 'Error generating salt' });
            }
            salt = salt.toString();
            bcrypt.hash(password.toString(), salt, async (err, hash) => {
                if (err) {
                    console.error('Error hashing password:', err);
                    return res.status(500).json({ error: 'Error hashing password' });
                }

                const insertUserQuery = "INSERT INTO user (name, email, password) VALUES (?, ?, ?)";
                const values = [name, email, hash];

                db.query(insertUserQuery, values, (err, _result) => {
                    if (err) {
                        console.error('Error inserting user into database:', err);
                        return res.status(500).json({ error: 'Error creating user' });
                    }

                    console.log('User registered successfully');
                    return res.status(201).json({ message: 'User registered successfully', name: name });
                });
            });
        });
    });
});
// Define the /session route
app.get('/session', (req, res) => {
    res.json({ name: req.session.name });
});

// Handle login requests
app.post('/login', [
    check('email').isEmail(),
    check('password').isLength({ min: 6 })
], (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const sql = "SELECT * FROM user WHERE email = ? AND role_as = 0";
    db.query(sql, [email], (err, data) => {
        if (err) {
            console.error('Error finding user:', err);
            return res.status(500).json({ error: 'Error finding user' });
        }
        if (data.length === 0) {
            console.log("User not found");
            return res.status(401).json({ error: 'User not found' });
        }
        const user = data[0];

        bcrypt.compare(password.toString(), user.password, (err, isMatch) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).json({ error: 'Error comparing passwords' });
            }
            if (isMatch) {
                req.session.Userid = user.id;
                //    console.log(req.session.Userid);
                return res.status(200).json({ message: 'Login successful', id: req.session.Userid });
            } else {
                console.log('Incorrect password');
                return res.status(401).json({ error: 'Incorrect password' });
            }
        });
    });
});

app.post('/Userlogout', (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).json({ error: 'Logout failed' });
            }
            console.log('Logout successfully');
            return res.status(200).json({ message: 'Logout successful' });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Logout failed' });
    }
});

app.post('/adminlogin', [
    check('email').isEmail(),
    check('password').isLength({ min: 6 })
], (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const sql = "SELECT * FROM user WHERE email = ? AND role_as = 1";
    db.query(sql, [email], (err, data) => {
        if (err) {
            console.error('Error finding user:', err);
            return res.status(500).json({ error: 'Error finding user' });
        }
        if (data.length === 0) {
            console.log("User not found");
            return res.status(401).json({ error: 'User not found' });
        }
        const user = data[0];

        console.log('Retrieved password from database:', user.password);

        bcrypt.compare(password.toString(), user.password, (err, isMatch) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).json({ error: 'Error comparing passwords' });
            }
            if (isMatch) {
                console.log('Login successful');
                const userName = user.name;
                return res.status(200).json({ message: 'Login successful', name: userName });
            } else {
                console.log('Incorrect password');
                return res.status(401).json({ error: 'Incorrect password' });
            }
        });
    });
});

app.get('/categories', (req, res) => {
    const sql = "SELECT * FROM categories";
    db.query(sql, (err, categories) => {
        if (err) {
            console.error('Error fetching categories:', err);
            return res.status(500).json({ error: 'Error fetching categories' });
        }
        res.status(200).json(categories);
    });
});

app.get('/subcategories/:categories_id', (req, res) => {
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


app.get('/SingleProduct/:Product_id', (req, res) => {
    try {
        const Product_id = req.params.Product_id;
        const sql = `SELECT * FROM Product INNER JOIN categories ON categories.id = product.category_id  WHERE Product.id = ${Product_id}`;
        db.query(sql, (err, product) => {
            if (err) {
                console.log('error fetch single product:', err);
                return res.status(500).json({ error: 'Error Fetching Product' });
            }
            res.status(200).json(product);
        });
    }
    catch (error) {
        res.status(500).send(error);
    }
});

app.get('/RelatedProduct/:category_id/:product_id', (req, res) => {
    try {
        const { category_id, product_id } = req.params;
        const sql = `SELECT * FROM Product WHERE category_id = ? AND id != ? LIMIT 4`;
        db.query(sql, [category_id, product_id], (err, results) => {
            if (err) {
                console.error('Error fetching related products:', err);
                return res.status(500).json({ error: 'Error fetching related products' });
            }
            res.status(200).json(results);
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).send('Server error');
    }
});



app.get('/color', (req, res) => {
    try {
        const sql = `SELECT * FROM colors`;
        db.query(sql, (err, color) => {
            if (err) {
                console.error('Error fetching categories:', err);
                return res.status(500).json({ error: 'Error fetching categories' });
            }
            res.status(200).json(color);
        })
    } catch (error) {
        res.status(500).send(error);
    }
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, "./public/Images")
    },

    filename: function (req, file, cb) {
        return cb(null, `${file.originalname}`);
    }
})

const upload = multer({ storage })


app.post('/addproduct', upload.array('product_image'), (req, res) => {

    try {
        const { product_name, product_description, product_stock, product_price, product_brand, category_id, subcategory_id, color_id } = req.body;

        console.log("heooe:", req.files)
        const product_images = req.files.map(file => file.filename);

        const imagesJSON = JSON.stringify(product_images);
        const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const sql = `INSERT INTO product (product_name, product_description, product_stock, product_price, product_brand, product_image, category_id, subcategory_id, color_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        db.query(sql, [product_name, product_description, product_stock, product_price, product_brand, imagesJSON, category_id, subcategory_id, color_id, currentDateTime], (err, result) => {
            if (err) {
                console.error('Error inserting product:', err);
                return res.status(500).json({ error: 'Failed to add product' });
            }
            res.status(201).json({ message: 'Product added successfully', productId: result.insertId });
        });

    } catch (error) {
        res.status(500).send(error);
    }
});
app.use(express.static('public'));
app.use(cors());

app.get('/latestProduct', (req, res) => {
    try {
        const sql = `SELECT * FROM Product ORDER BY id DESC LIMIT 4`;
        db.query(sql, (err, product) => {
            if (err) {
                console.error('Error fetching products:', err);
                return res.status(500).json({ error: 'Error fetching products' });
            }
            res.status(200).json(product);
            // console.log(product);
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/categories', (req, res) => {
    try {
        const sql = `SELECT * FROM categories`;
        db.query(sql, (err, categories) => {
            if (err) {
                console.error('Error fetching categories:', err);
                return res.status(500).json({ error: 'Error fetching categories' });
            }
            res.status(200).json(categories);
        })
    }
    catch (error) {
        res.status(500).send(error);
    }
})

app.get('/products/:category_id', (req, res) => {
    try {
        const { category_id } = req.params;
        const { subcategories, colors, brands } = req.query;

        let sql = `SELECT * FROM product WHERE category_id = ?`;
        let params = [category_id];

        let conditions = [];
        if (subcategories && subcategories.trim() !== "") {
            conditions.push(`subcategory_id IN (${subcategories.split(',').map(id => '?').join(',')})`);
            params = params.concat(subcategories.split(','));
        }

        if (colors && colors.trim() !== "") {
            conditions.push(`color_id IN (${colors.split(',').map(id => '?').join(',')})`);
            params = params.concat(colors.split(','));
        }

        if (brands && brands.trim() !== "") {
            conditions.push(`product_brand IN (${brands.split(',').map(id => '?').join(',')})`);
            params = params.concat(brands.split(','));
        }

        if (conditions.length > 0) {
            sql += " AND " + conditions.join(' AND ');
        }

        sql += " ORDER BY id DESC";

        db.query(sql, params, (err, products) => {
            if (err) {
                console.error('Error fetching products:', err);
                return res.status(500).json({ error: 'Error fetching products' });
            }
            res.status(200).json(products);
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/ProductSubcategories/:category_id', (req, res) => {
    try {
        const categoryId = req.params.category_id;
        const sql = `SELECT * FROM subcategories WHERE categories_id = ?`;
        db.query(sql, [categoryId], (err, subcategories) => {
            if (err) {
                console.error('Error Fetching Subcategories:', err);
                return res.status(500).json({ error: 'Error fetching Subcategories' });
            }
            res.status(200).send(subcategories);
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/ProductColor/:category_id', (req, res) => {
    try {
        const categoryId = req.params.category_id;
        const sql = `SELECT DISTINCT color_name, color_id FROM product INNER JOIN colors ON colors.id = product.color_id WHERE category_id = ?`;
        db.query(sql, [categoryId], (err, colors) => {
            if (err) {
                console.error('Error Fetching Color:', err);
                return res.status(500).json({ error: 'Error fetching color' });
            }
            res.status(200).send(colors);
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/Productbrand/:category_id', (req, res) => {
    try {
        const categoryId = req.params.category_id;
        const sql = `SELECT DISTINCT(product_brand) FROM product WHERE category_id = ? ORDER BY id DESC`;
        db.query(sql, [categoryId], (err, brand) => {
            if (err) {
                console.error('error fetching brand', err);
                return res.status(500).json({ error: 'Error' })
            }
            res.status(200).send(brand);
        })
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/cart', (req, res) => {
    try {
        const users_id = req.body.users_id;
        const products_id = req.body.product_id;
        const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const sql = "INSERT INTO addtocart (user_id, product_id, created_at) VALUES (?,?, ?)"
        db.query(sql, [users_id, products_id, currentDateTime], (err, result) => {
            if (err) {
                console.error('error fetching brand', err);
                return res.status(500).json({ err: 'Error' })
            }
            res.status(201).json({ message: 'add to cart successfully' });
        });
        console.log(req.body);
    } catch (error) {
        res.status(500).send(error);
    }
})

app.get('/addtocartcount/:id', (req, res) => {
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

app.get('/Getaddtocart/:id', (req, res) => {
    try {
   const userId = req.params.id;
   const sql = "SELECT * FROM addtocart WHERE user_id = ?";
   db.query(sql, [userId], (err, result) => {
    if(err) {
        console.error('Error fetching add to cart product', err);
        return res.status(500).json({ error: 'Internal Server Error'});
    }
    res.status(200).send(result);
   })
} catch (error) {
    res.status(500).send(error);
}
});

app.listen(8081, () => { console.log("listening"); })