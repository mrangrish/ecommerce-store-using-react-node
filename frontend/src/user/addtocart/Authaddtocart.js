import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInr, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import { IoArrowBackOutline } from "react-icons/io5";

function Authaddtocart({ userId, setAddtocartcount, addtocartcount}) {
    const [addtocart, setAddtocart] = useState([]);
    // const [addtocartcount, setAddtocartcount] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [discount, setDiscount] = useState(0);

    useEffect(() => {
        const calculateTotalPrice = () => {
            let totalPrice = 0;
            addtocart.forEach(item => {
                totalPrice += parseFloat(item.product_offerPrice || item.product_price) * parseInt(item.quantity || 1);
            });
            setTotalPrice(totalPrice);
        };
        calculateTotalPrice();
    }, [addtocart]);

    useEffect(() => {
        const calculateDiscount = () => {
            let totalDiscount = 0;
            addtocart.forEach(item => {
                if (item.product_offerPrice) {
                    const itemDiscount = (parseInt(item.product_price) - parseInt(item.product_offerPrice)) * parseInt(item.quantity);
                    totalDiscount += itemDiscount;
                }
            });
            setDiscount(totalDiscount);
        };
        calculateDiscount();
    }, [addtocart]);

    useEffect(() => {
        const fetchAddtocartproduct = async () => {
            try {
                if (userId) {
                    const response = await axios.get(`http://localhost:8081/routeaddtocart/Getaddtocart/${userId}`);
                    setAddtocart(response.data);
                    
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchAddtocartproduct();
    }, [userId]);

    useEffect(() => {
        const fetchAddtocartCount = async () => {
            try {
                if (userId) {
                    const response = await axios.get(`http://localhost:8081/routeaddtocart/addtocartcount/${userId}`);
                    setAddtocartcount(response.data.count);
                }
            } catch (error) {
                console.error('Error fetching Addtocart count:', error);
            }
        };
        fetchAddtocartCount();
    }, [userId]);

    const getImageUrl = (jsonString) => {
        try {
            const images = JSON.parse(jsonString);
            return `http://localhost:8081/images/${images[0]}`;
        } catch (e) {
            console.error('Error parsing image JSON:', e);
            return '';
        }
    };

    const handleDeleteAddtocart = async (addtocartId) => {
        try {
            await axios.delete(`http://localhost:8081/routeaddtocart/deletecart/${addtocartId}`);
            setAddtocartcount(prevCount => prevCount - 1);
            setAddtocart(prevAddtocart => prevAddtocart.filter(item => item.id !== addtocartId));
            console.log("Item removed from cart successfully!");
        } catch (error) {
            console.error('Error deleting item from cart:', error);
        }
    };

    
    const calculateDiscountPercentage = (originalPrice, offerPrice) => {
        const discountPercentage = ((originalPrice - offerPrice) / originalPrice) * 100;
        return Math.round(discountPercentage);
    };

    const handleIncrement = async (addtocartId, quantity) => {
        try {
            // console.log(addtocartId,quantity);
            const incrementedQuantity = parseInt(quantity) + 1;
            const response = await axios.get(`http://localhost:8081/routeaddtocart/checkStock/${addtocartId}/${incrementedQuantity}`);
            
            if (response.data.stockAvailable) {
                const updatedAddtocart = addtocart.map(item => {
                    if (item.id === addtocartId) {
                        return { ...item, quantity: parseInt(quantity) + 1 };
                    }
                    return item;
                });
                setAddtocart(updatedAddtocart);
                
                await axios.put(`http://localhost:8081/routeaddtocart/updatequantity/${addtocartId}/${incrementedQuantity}`);
            } else {
                console.log("Insufficient stock!");
            }
        } catch (error) {
            console.error('Error incrementing quantity:', error);
        }
    };
    
    const handleDecrement = async (addtocartId, quantity) => {
        try {
            if (quantity > 1) {
                const updatedAddtocart = addtocart.map(item => {
                    if (item.id === addtocartId) {
                        return { ...item, quantity: quantity - 1 };
                    }
                    return item;
                });
                setAddtocart(updatedAddtocart);
                await axios.put(`http://localhost:8081/routeaddtocart/updatequantity/${addtocartId}/${quantity - 1}`);
            }
        } catch (error) {
            console.error('Error decrementing quantity:', error);
        }
    };
    

    return (
        <>
            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-8">
                        <div className="col"><h4><b>Shopping Cart</b></h4></div>
                        {addtocart.map((item, index) => (
                            <div className="row border-top border-bottom" key={index}>
                                <div className="row main align-items-center">
                                    <div className="col-2">
                                        <img className="img-fluid" src={getImageUrl(item.product_image)} style={{ padding: "7%" }} alt={item.product_name} />
                                    </div>
                                    <div className="col-3">
                                        <div className="row text-muted">{item.product_brand}</div>
                                        <div className="row">{item.product_name}</div>
                                    </div>
                                    <div className="col-3">
                                    
                                        <button onClick={(e) => { e.preventDefault(); handleDecrement(item.id, item.quantity); }} style={{ background: "transparent", border: "none" }}><FontAwesomeIcon icon={faMinus} style={{ fontSize: "xx-small", border: "1px solid lightgrey", padding: "7px 7px", borderRadius: "25px" }} /></button>

                                        <span style={{ border: "1px solid lightgrey", textAlign: "center", padding: "11px 24px" }}>{item.quantity}</span>
                                        <button onClick={(e) => { e.preventDefault(); handleIncrement(item.id, item.quantity); }} style={{ background: "transparent", border: "none" }}><FontAwesomeIcon icon={faPlus} style={{ fontSize: "xx-small", border: "1px solid lightgrey", padding: "7px 7px", borderRadius: "25px" }} /></button>
                                    </div>
                                    <div className="col-3">
                                        {item.product_offerPrice ? (
                                            <>
                                                <strike style={{ fontSize: "small" }}>&#8377;{(item.product_price * item.quantity).toFixed(2)}</strike>
                                                <b>&#8377;{(item.product_offerPrice * item.quantity).toFixed(2)}</b>
                                                <div className="text-success">{calculateDiscountPercentage(item.product_price, item.product_offerPrice)}% Off</div>
                                            </>
                                        ) : (
                                            <b>&#8377;{(item.product_price * item.quantity).toFixed(2)}</b>
                                        )}
                                    </div>
                                    <div className="col">
                                        <button style={{ background: "transparent", border: "none", color: "black" }} onClick={() => handleDeleteAddtocart(item.id)}>
                                            <span className="close">&#10005;</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="back-to-shop">
                            <Link to="/" style={{ textDecoration: "none", color: "black" }}>
                                <IoArrowBackOutline />
                                <span className="text-muted">Back to shop</span>
                            </Link>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div><h4><b>Product Details</b></h4></div>
                        <hr style={{ margin: "1px 0" }} />

                        <div className="row" style={{ margin: "1rem" }}>
                            <div className="col-8" style={{ paddingleft: "0" }}>Price ({addtocartcount})</div>
                            <div className="col text-right"><FontAwesomeIcon icon={faInr} /> {totalPrice.toFixed(2)}</div>
                        </div>
                        <div className="row" style={{ margin: "1rem" }}>
                            <div className="col-8">Discount</div>
                            <div className="col text-right text-success"><FontAwesomeIcon icon={faInr} />{discount.toFixed(2)}</div>
                        </div>
                        <div className="row" style={{ margin: "1rem" }}>
                            <div className="col-8">Delivery Charges</div>
                            <div className="col text-right text-success"> Free </div>
                        </div>
                        <div className="row" style={{ borderTop: "1px solid rgba(0,0,0,.1)", margin: "1rem" }}>
                            <div className="col-8">TOTAL PRICE</div>
                            <div className="col text-right"><FontAwesomeIcon icon={faInr} /> {totalPrice.toFixed(2)}</div>
                        </div>
                        <div className="row" style={{ margin: "1rem" }}>
                            <Link to="/orders" className="btn btn-dark">Place Order</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Authaddtocart;