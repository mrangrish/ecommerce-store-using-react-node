import React from "react";
import Header from "../Header/header"
import AuthUserOrder from "./authUserOrder";


function OrderDetails({ userId, setUserId, addtocartcount, localStoragecount }) {
    return (
        <>
            <Header userId={userId} setUserId={setUserId} addtocartcount={addtocartcount} localStoragecount={localStoragecount}/>
            <AuthUserOrder userId={userId} setUserId={setUserId} />
        </>
    )
}
export default OrderDetails;