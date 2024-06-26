import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Home from './user/Home';
import Adminlogin from './admin/Adminlogin';
import Dashboard from './admin/dashboard';
import Addproduct from './admin/Product/Addproduct';
import AllProduct from './admin/Product/AllProduct';
import Toster from './admin/toster';
import Signup from './user/Register/Signup';
import Product from './user/Product/Product';
import SingleProduct from './user/SingleProduct/SingleProduct';
import Addtocart from './user/addtocart/addtocart';
import ProductView from './admin/Product/ProductView';
import AdminProductEdit from './admin/Product/AdminProductEdit';
import AllCustomer from './admin/Customer/AllCustomer';
import Shop from './user/ShopPage/Shop';
import Login from './user/Login/Login';
import OrderDetails from './user/orders/orderdetails';
import PaymentInputs from './user/orders/PaymentInputs';
import Categories from './admin/Categories/Categories';
import SubCategories from './admin/Categories/subCategories';
import SlideShow from './admin/SlideShow/SlideShow';

function App() {
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await axios.get('http://localhost:8081/session', {
                    withCredentials: true
                });
                sessionStorage.setItem('userId', response.data.userId);
                setUserId(response.data.userId);
            } catch (error) {
                console.error('Error fetching session id:', error);
            }
        };
        fetchUserId();
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                {/* All Client area routes */}
                <Route path='/signup' element={<Signup userId={userId} setUserId={setUserId} />} />
                <Route path='/' element={<Home userId={userId} setUserId={setUserId} />} />
                <Route path='/login' element={<Login userId={userId} setUserId={setUserId} />} />
                <Route path='/toseter' element={<Toster />} />
                <Route path='/product/:id' element={<Product userId={userId} setUserId={setUserId} />} />
                <Route path='/singleproduct/:id' element={<SingleProduct userId={userId} setUserId={setUserId} />} />
                <Route path='/addtocart' element={<Addtocart userId={userId} setUserId={setUserId} />} />
                <Route path='/shop' element={<Shop userId={userId} setUserId={setUserId} />} />
                <Route path='/orders' element={<OrderDetails userId={userId} setUserId={setUserId} />} />
                <Route path='/paymentinput' element={<PaymentInputs />} />

                {/* All Admin area routes */}
                <Route path='/adminproductview/:id' element={<ProductView userId={userId} setUserId={setUserId} />} />
                <Route path='/adminproductedit/:id' element={<AdminProductEdit userId={userId} setUserId={setUserId} />} />
                <Route path='/allcustomer' element={<AllCustomer userId={userId} setUserId={setUserId} />} />
                <Route path='/dash' element={<Dashboard userId={userId} setUserId={setUserId} />} />
                <Route path='/admin-login' element={<Adminlogin userId={userId} setUserId={setUserId} />} />
                <Route path='/addproduct' element={<Addproduct userId={userId} setUserId={setUserId} />} />
                <Route path='/allproduct' element={<AllProduct userId={userId} setUserId={setUserId} />} />
                <Route path='/Categories' element={<Categories  userId={userId} setUserId={setUserId} />} />
                <Route path='/subCategories/:id' element={<SubCategories userId={userId} setUserId={setUserId} />} />
                <Route path='/SlideShow' element={<SlideShow  userId={userId} setUserId={setUserId}/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;