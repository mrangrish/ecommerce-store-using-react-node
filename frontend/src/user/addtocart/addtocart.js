import React from "react";
import Header from "../Header/header";
import Authaddtocart from "./Authaddtocart";
import UnAuthaddtocart from "./unAuthaddtocart";

function Addtocart({ userId, setUserId }) {
    return (
        <div>
            <Header userId={userId} setUserId={setUserId} />
            {userId ? (
                <>
                    <Authaddtocart userId={userId} setUserId={setUserId} />
                </>
            ) : (
                <>
                    <UnAuthaddtocart />
                </>
            )
            }
        </div>
    );
}
export default Addtocart;

