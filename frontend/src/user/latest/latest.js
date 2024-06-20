
import React, { useState, useEffect } from "react";
import axios from "axios";
import '../Product/filter.css';
import AOS from "aos";
import 'aos/dist/aos.css';
import { IoHeartOutline, IoCart } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Latest({ userId }) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        AOS.init();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8081/latestProduct');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchData();
    }, []);
    const getImageUrl = (jsonString) => {
        try {
            const images = JSON.parse(jsonString);
            return `http://localhost:8081/images/${images[0]}`;
        } catch (e) {
            console.error('Error parsing image JSON:', e);
            return '';
        }
    };

    const handleFormSubmit = async (e, productId, product_name, product_price, product_brand, product_image, product_offerPrice) => {
        e.preventDefault();
        try {
            if (userId) {
                await axios.post("http://localhost:8081/routeaddtocart/cart", { users_id: userId, product_id: productId });
                toast.success('Product added to cart successfully!');
            } else {
                const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
                const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
                cartItems.push({ productId, quantity: 1, product_name, product_price, product_brand, product_image, product_offerPrice, created_at });
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                toast.success('Product added to cart successfully!');
            }
        } catch (error) {
            console.error("Error adding item to cart:", error);
            toast.error('Product is not added to cart!');
        }
    };

    const calculateDiscountPercentage = (originalPrice, offerPrice) => {
        const discountPercentage = ((originalPrice - offerPrice) / originalPrice) * 100;
        return Math.round(discountPercentage);
    };

    return (
        <div>
            <h1 className="text-center mt-5 mb-5">Latest Products</h1>
            <div className="container mb-5">
            <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
                <div className="row">
                {products.map((item, index) => (
                        <div key={index} className="col-md-3 col-sm-6" data-aos="fade-up">
                            <div className="product-grid">
                                <div className="product-image">
                                    <Link to={`/SingleProduct/${item.id}`} className="image">
                                        <div className="card-image-grid" style={{ width: "100%", height: "250px", overflow: "hidden" }}>
                                            <img className="pic-1" src={getImageUrl(item.product_image)} alt={item.product_name} />
                                            <img className="pic-2" src={getImageUrl(item.product_image)} alt={item.product_name} />
                                        </div>
                                    </Link>
                                    {item.product_offerPrice && (
                                        <div className="discount-badge">
                                            {calculateDiscountPercentage(item.product_price, item.product_offerPrice)}% OFF
                                        </div>
                                    )}
                                    <ul className="product-links">
                                        <li><button><IoHeartOutline /></button></li>
                                        <form onSubmit={(e) => handleFormSubmit(e, item.id, item.product_name, item.product_price, item.product_brand, item.product_image, item.product_offerPrice)}>
                                            <li><button type="submit"><IoCart /></button></li>
                                        </form>
                                    </ul>
                                </div>
                                <div className="product-content">
                                    <Link to={`/SingleProduct/${item.id}`} className="image" style={{ textDecoration: "none", color: "black" }}>
                                        <h3 className="title">{item.product_name}</h3>
                                        {item.product_offerPrice ? (
                                            <>
                                                <div className="price">
                                                    &#8377;{item.product_offerPrice} <strike style={{ color: "black", fontSize: "smaller" }}> &#8377;{item.product_price}</strike>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="price">&#8377;{item.product_price}</div>
                                        )}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Latest;