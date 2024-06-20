import React, { useEffect, useState } from "react";
import Header from "../Header/header"
import AuthUserOrder from "./authUserOrder";
import axios from "axios";


function OrderDetails({ userId, setUserId}) {
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

    return (
        <>
            <Header userId={userId} setUserId={setUserId} addtocartcount={addtocartcount} localStoragecount={localStoragecount}/>
            <AuthUserOrder userId={userId} setUserId={setUserId} />
        </>
    )
}
export default OrderDetails;