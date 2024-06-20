import React, { useEffect, useState } from "react";
import Header from "../Header/header";
import Authaddtocart from "./Authaddtocart";
import UnAuthaddtocart from "./unAuthaddtocart";
import axios from "axios";

function Addtocart({ userId, setUserId }) {

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
        <div>
            <Header userId={userId} setUserId={setUserId} addtocartcount={addtocartcount} localStoragecount={localStoragecount} />

            {userId ? (
                <>
                    <Authaddtocart userId={userId} setUserId={setUserId} setAddtocartcount={setAddtocartcount} addtocartcount={addtocartcount}/>
                </>
            ) : (
                <>
                    <UnAuthaddtocart setLocalStoragecount={setLocalStoragecount} localStorage={localStoragecount}/>
                </>
            )
            }
        </div>
    );
}
export default Addtocart;

