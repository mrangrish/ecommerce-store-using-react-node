import axios from "axios";
import React, { useEffect,useState } from "react";

function OrderSummary({ userId, setUserId }) {
    const [addtocart, setAddtocart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

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

    const getImageUrl = (jsonString) => {
        try {
            const images = JSON.parse(jsonString);
            return `http://localhost:8081/images/${images[0]}`;
        } catch (e) {
            console.error('Error parsing image JSON:', e);
            return '';
        }
    };
    
    useEffect(() => {
        const fetchAddtocartproduct = async () => {
            try {
                if (userId) {
                    const response = await axios.get(`http://localhost:8081/routeaddtocart/Getaddtocart/${userId}`);
                    setAddtocart(response.data);
                    
                } else {
                    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
                    setAddtocart(cartItems);
                    
                }
            } catch (error) {
                console.error('Error fetching cart items:', error);
                const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
                setAddtocart(cartItems);
                
            }
        };
        fetchAddtocartproduct();
    }, [userId]);
    return (
        <>
            <div className="shadow p-4 rounded bg-light">
                        <h4>Cart Items</h4>
                        <hr />
                        {addtocart.map((item, index) => (
                            <div key={index} className="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <img src={getImageUrl(item.product_image)} alt={item.product_name} width="50" />
                                    <span className="ms-3">{item.product_name}</span>
                                </div>
                                <div>
                                    <span>{item.quantity} x ₹{item.product_offerPrice || item.product_price}</span>
                                </div>
                            </div>
                        ))}
                        <hr />
                        <div className="d-flex justify-content-between align-items-center">
                           <h5>Total Price</h5>
                         <h5>₹{totalPrice.toFixed(2)}</h5>
                        </div>
                    </div>

        </>
    );
}

export default OrderSummary;