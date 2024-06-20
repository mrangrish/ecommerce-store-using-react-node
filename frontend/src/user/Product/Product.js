import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import './filter.css';
import { IoCart, IoHeartOutline } from "react-icons/io5";

import AOS from "aos";
import 'aos/dist/aos.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "../Header/header";

function Product({ userId, setUserId }) {
    const location = useLocation();
    const id = location.state && location.state.id;
    const [products, setProducts] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [color, setcolor] = useState([]);
    const [brand, setbrand] = useState([]);

    const [addtocartcount, setAddtocartcount] = useState(0);
    const [localStoragecount, setLocalStoragecount] = useState(0);

    useEffect(() => {
        const fetchAddtocartCount = async () => {
            try {
                if (userId) {
                    const response = await axios.get(`http://localhost:8081/routeaddtocart/addtocartcount/${userId}`);
                    setAddtocartcount(response.data.count);
                } else {
                    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
                    setLocalStoragecount(cartItems.length);
                }
            } catch (error) {
                console.error('Error fetching Addtocart count:', error);
            }
        };
        fetchAddtocartCount();
    }, [userId]);

    const [filters, setFilters] = useState({ subcategories: [], colors: [], brands: [] });
    const getCategoryFromUrl = () => {
        const pathParts = window.location.pathname.split('/');
        return pathParts[pathParts.length - 1];
    };
    const categoryId = getCategoryFromUrl();

    useEffect(() => {
        AOS.init();
    }, []);

    useEffect(() => {
        const fetchbrand = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/product/Productbrand/${categoryId}`);
                setbrand(response.data);
            } catch (error) {
                console.error('Error fetching Brand:', error);
            }
        };
        fetchbrand();
    }, [categoryId]);

    useEffect(() => {
        const fetchProducts = async () => {
            const query = new URLSearchParams({
                subcategories: filters.subcategories.join(','),
                colors: filters.colors.join(','),
                brands: filters.brands.join(',')
            }).toString();

            try {
                const response = await axios.get(`http://localhost:8081/product/products/${categoryId}?${query}`);
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, [categoryId, filters]);

    const handleFilterChange = (type, value, checked) => {
        setFilters(prevFilters => {
            const newFilters = { ...prevFilters };
            if (checked) {
                newFilters[type].push(value);
            } else {
                newFilters[type] = newFilters[type].filter(item => item !== value);
            }
            return newFilters;
        });
    };

    useEffect(() => {
        const fetchcolor = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/product/ProductColor/${categoryId}`);
                setcolor(response.data);
            } catch (error) {
                console.error('Error fetching color:', error);
            }
        };
        fetchcolor();
    }, [categoryId]);

    useEffect(() => {
        const fetchSubcategories = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/product/ProductSubcategories/${categoryId}`);
                setSubcategories(response.data);
            } catch (err) {
                console.error('Error fetching Product Subcategories:', err);
            }
        };

        fetchSubcategories();
    }, [categoryId]);

    const getImageUrl = (jsonString) => {
        try {
            const images = JSON.parse(jsonString);
            return `http://localhost:8081/images/${images[0]}`;
        } catch (e) {
            console.error('Error parsing image JSON:', e);
            return '';
        }
    };

    const calculateDiscountPercentage = (originalPrice, offerPrice) => {
        const discountPercentage = ((originalPrice - offerPrice) / originalPrice) * 100;
        return Math.round(discountPercentage);
    };

    const handleFormSubmit = async (e, productId, product_name, product_price, product_brand, product_image, product_offerPrice) => {
        e.preventDefault();
        try {
            if (userId) {
                await axios.post("http://localhost:8081/routeaddtocart/cart", { users_id: userId, product_id: productId });

                toast.success('Product add to cart successfully!');
            } else {
                const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
                const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
                cartItems.push({ productId, quantity: 1, product_name, product_price, product_brand, product_image, product_offerPrice, created_at });
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                console.log(cartItems);
                toast.success('Product add to cart successfully!');
            }
        } catch (error) {
            console.error("Error adding item to cart:", error);
            toast.error('Product is not add to cart!');
        }
    };



    return (
        <div>
            <Header userId={userId} setUserId={setUserId} addtocartcount={addtocartcount} localStoragecount={localStoragecount}/>
            <div className="container mt-5">
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

                <div className="row g-2">
                    <div className="col-md-2" style={{ marginRight: "5%" }}>
                        <div className="processor p-2">
                            <div className="heading d-flex justify-content-between align-items-center">
                                <h6 className="text-uppercase">Subcategories</h6>
                            </div>
                            {subcategories.map((item, index) => (
                                <div className="d-flex justify-content-between mt-2" key={index}>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" value={item.id} onChange={e => handleFilterChange('subcategories', item.id, e.target.checked)} />
                                        <label className="form-check-label" htmlFor={`flexCheckDefault${item.id}`}>{item.subcategories_name}</label>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="brand p-2">
                            <div className="heading d-flex justify-content-between align-items-center">
                                <h6 className="text-uppercase">Product_color</h6>
                            </div>
                            {color.map((item, index) => (
                                <div className="d-flex justify-content-between mt-2" key={index}>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" value={item.color} onChange={e => handleFilterChange('colors', item.color, e.target.checked)} />
                                        <label className="form-check-label" htmlFor={`flexCheckDefaultColor${item.color}`}>{item.color}</label>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="type p-2">
                            <div className="heading d-flex justify-content-between align-items-center">
                                <h6 className="text-uppercase">Product_brand</h6>
                            </div>
                            {brand.map((item) => (
                                <div className="d-flex justify-content-between mt-2" key={item.id}>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" value={item.product_brand} onChange={e => handleFilterChange('brands', item.product_brand, e.target.checked)} />
                                        <label className="form-check-label" htmlFor={`flexCheckDefaultBrand${item.id}`}>{item.product_brand}</label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-md-9">
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
            </div>
        </div>
    );
}
export default Product;