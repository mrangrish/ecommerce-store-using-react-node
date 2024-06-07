import React from "react";
import Header from "../Header/header"
import AuthUserOrder from "./authUserOrder";


function OrderDetails({ userId, setUserId }) {


    return (
        <>
            <Header userId={userId} setUserId={setUserId} />

            <AuthUserOrder userId={userId} setUserId={setUserId} />

        </>
    )
}
export default OrderDetails;