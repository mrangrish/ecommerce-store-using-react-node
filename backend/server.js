const express = require("express");
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const router = require('./route/router.js');  

const productRouter = require('./route/product/product.js');  
const addtocartRouter = require('./route/addtocart/addtocart.js');
const userAuthRouter = require('./route/userAuth/Auth.js');
const SingleProductRouter = require('./route/SingleProduct/singleProduct.js');
const adminAuthRouter = require('./route/adminAuth/adminAuth.js');
const AdminProduct = require('./route/adminProduct/adminProduct.js');
const AdminDashboard = require('./route/admindashboard/dashboard.js');
const AdminCustomer = require('./route/admincustomer/adminCustomer.js');
const userShop = require('./route/userShop/userShop.js');
const OrderDetails = require('./route/OrderDetails/orderdetails.js');
const mailVerified = require('./route/OrderDetails/OrderMailverification/mailVerified.js');
const PaymentCart = require('./route/OrderDetails/PaymentCart.js');
const app = express();

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(session({
    secret: 'Session',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.static('public'));

app.use('/', router);
app.use('/product', productRouter);
app.use('/routeaddtocart', addtocartRouter);
app.use('/userAuth', userAuthRouter);
app.use('/singleProductRoute', SingleProductRouter);
app.use('/adminAuthRouter', adminAuthRouter);
app.use('/adminProductRouter', AdminProduct);
app.use('/adminDashboard', AdminDashboard);
app.use('/adminCustomer', AdminCustomer);
app.use('/userShop', userShop);
app.use('/orderdetails', OrderDetails);
app.use('/mailverified', mailVerified);
app.use('/AddPaymentCart', PaymentCart);

app.get('/session', (req, res) => {
    if (req.session.userId) {
        return res.json({ userId: req.session.userId });
    } else {
        
        // console.log(null);
        return res.json({ userId: null });
    }

});

app.listen(8081, () => {
    console.log("Server listening on port 8081");
});