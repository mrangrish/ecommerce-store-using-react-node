import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInr, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";

function UnAuthaddtocart({setLocalStoragecount, localStoragecount}) {
    const [items, setItems] = useState([]);
    // const [localStoragecount, setlocalStoragecount] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [discount, setDiscount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const itemsWithOriginalIndex = cartItems.map((item, index) => ({ ...item, originalIndex: index }));
        setItems(itemsWithOriginalIndex);
        setLocalStoragecount(itemsWithOriginalIndex.length);

        const totalPrice = itemsWithOriginalIndex.reduce((total, item) => {
            return total + parseFloat(item.product_offerPrice || item.product_price) * parseInt(item.quantity || 1);
        }, 0);
        setTotalPrice(totalPrice);
    }, []);

    useEffect(() => {
        const calculateDiscount = () => {
            let totalDiscount = 0;
            items.forEach(item => {
                if (item.product_offerPrice) {
                    const itemDiscount = (parseInt(item.product_price) - parseInt(item.product_offerPrice)) * parseInt(item.quantity);
                    totalDiscount += itemDiscount;
                }
            });
            setDiscount(totalDiscount);
        };
        calculateDiscount();
    }, [items]);

    const getImageUrl = (jsonString) => {
        try {
            const images = JSON.parse(jsonString);
            return `http://localhost:8081/images/${images[0]}`;
        } catch (e) {
            console.error('Error parsing image JSON:', e);
            return '';
        }
    };

    const handleDeleteAddtocart = (index) => {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        cartItems.splice(index, 1);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        setItems(cartItems);
        setLocalStoragecount(cartItems.length);

        const totalPrice = cartItems.reduce((total, item) => {
            return total + parseFloat(item.product_offerPrice || item.product_price) * parseInt(item.quantity || 1);
        }, 0);
        setTotalPrice(totalPrice);
    };

    const handleIncrement = (originalIndex) => {
        const updatedItems = items.map((item, index) => {
            if (index === originalIndex) {
                return { ...item, quantity: (item.quantity || 0) + 1 };
            }
            return item;
        });
        localStorage.setItem('cartItems', JSON.stringify(updatedItems));
        setItems(updatedItems);

        const totalPrice = updatedItems.reduce((total, item) => {
            return total + parseFloat(item.product_offerPrice || item.product_price) * parseInt(item.quantity || 1);
        }, 0);
        setTotalPrice(totalPrice);
    };

    const handleDecrement = (originalIndex) => {
        const updatedItems = items.map((item, index) => {
            if (index === originalIndex && item.quantity > 1) {
                return { ...item, quantity: item.quantity - 1 };
            }
            return item;
        });
        localStorage.setItem('cartItems', JSON.stringify(updatedItems));
        setItems(updatedItems);

        const totalPrice = updatedItems.reduce((total, item) => {
            return total + parseFloat(item.product_offerPrice || item.product_price) * parseInt(item.quantity || 1);
        }, 0);
        setTotalPrice(totalPrice);
    };

    const calculateDiscountPercentage = (originalPrice, offerPrice) => {
        const discountPercentage = ((originalPrice - offerPrice) / originalPrice) * 100;
        return Math.round(discountPercentage);
    };

    const handlebacktoshop = () => {
        navigate(`/`);
    };

    return (
        <>
            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-8">
                        <div className="col"><h4><b>Shopping Cart</b></h4></div>
                        
                        {items.slice().reverse().map((item) => (
                            <Link
                                to={`/SingleProduct/${item.productId}`}
                                style={{ textDecoration: "none", color: "black" }}
                                key={item.originalIndex}
                            >
                                <div className="row border-top border-bottom">
                                    <div className="row main align-items-center">
                                        <div className="col-2">
                                            <img
                                                className="img-fluid"
                                                src={getImageUrl(item.product_image)}
                                                style={{ padding: "7%" }}
                                                alt={`${item.product_name} image`}
                                            />
                                        </div>
                                        <div className="col-3">
                                            <div className="row text-muted">{item.product_brand}</div>
                                            <div className="row">{item.product_name}</div>
                                        </div>
                                        <div className="col-3">
                                            <button
                                                onClick={(e) => { e.preventDefault(); handleDecrement(item.originalIndex); }}
                                                style={{ background: "transparent", border: "none" }}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faMinus}
                                                    style={{ fontSize: "xx-small", border: "1px solid lightgrey", padding: "7px 7px", borderRadius: "25px" }}
                                                />
                                            </button>
                                            <span
                                                style={{ border: "1px solid lightgrey", textAlign: "center", padding: "11px 24px" }}
                                            >
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={(e) => { e.preventDefault(); handleIncrement(item.originalIndex); }}
                                                style={{ background: "transparent", border: "none" }}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faPlus}
                                                    style={{ fontSize: "xx-small", border: "1px solid lightgrey", padding: "7px 7px", borderRadius: "25px" }}
                                                />
                                            </button>
                                        </div>
                                        <div className="col-3 text-center">
                                            {item.product_offerPrice ? (
                                                <>
                                                    <strike style={{ fontSize: "small" }}>
                                                        &#8377;{(item.product_price * item.quantity).toFixed(2)}
                                                    </strike>
                                                    <b>
                                                        &#8377;{(item.product_offerPrice * item.quantity).toFixed(2)}
                                                    </b>
                                                    <div className="text-success">
                                                        {calculateDiscountPercentage(item.product_price, item.product_offerPrice)}% Off
                                                    </div>
                                                </>
                                            ) : (
                                                <b>
                                                    &#8377;{(item.product_price * item.quantity).toFixed(2)}
                                                </b>
                                            )}
                                        </div>
                                        <div className="col">
                                            <button
                                                style={{ background: "transparent", border: "none", color: "black" }}
                                                onClick={(e) => { e.preventDefault(); handleDeleteAddtocart(item.originalIndex); }}
                                            >
                                                <span className="close">&#10005;</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                        <div className="back-to-shop">
                            <button onClick={() => handlebacktoshop()} style={{ background: "transparent", border: "none" }}>
                                <IoArrowBackOutline />
                                <span className="text-muted">Back to shop</span>
                            </button>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div><h4><b>Product Details</b></h4></div>
                        <hr style={{ margin: "1px 0" }} />
                        <div className="row" style={{ margin: "1rem" }}>
                            <div className="col-8" style={{ paddingleft: "0" }}>Price ({localStoragecount})</div>
                            <div className="col text-right"><FontAwesomeIcon icon={faInr} /> {totalPrice.toFixed(2)}</div>
                        </div>
                        <div className="row" style={{ margin: "1rem" }}>
                            <div className="col-8">Discount</div>
                            <div className="col text-right text-success">{discount.toFixed(2)}</div>
                        </div>
                        <div className="row" style={{ margin: "1rem" }}>
                            <div className="col-8">Delivery Charges</div>
                            <div className="col text-right text-success"> Free </div>
                        </div>
                        <div className="row" style={{ borderTop: "1px solid rgba(0,0,0,.1)", margin: "1rem" }}>
                            <div className="col-8">TOTAL PRICE</div>
                            <div className="col text-right"><FontAwesomeIcon icon={faInr} /> {totalPrice.toFixed(2)}</div>
                        </div>
                        <div className="row" style={{ margin: "1rem"}}>
                            <Link to="/orders" className="btn btn-dark">Place Order</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default UnAuthaddtocart;