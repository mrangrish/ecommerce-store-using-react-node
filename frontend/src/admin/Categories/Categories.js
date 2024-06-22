import React, { useState } from "react";
import Header from "../Header";
import SideNavbar from "../SideNavbar";
function Categories({ userId, setUserId }) {
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
    const toggleSidebar = () => {
        setOpenSidebarToggle(!openSidebarToggle);
    };
    return (
        <>
            <div className='grid-container'>
                <Header toggleSidebar={toggleSidebar} userId={userId} setUserId={setUserId} />
                <SideNavbar openSidebarToggle={openSidebarToggle} toggleSidebar={toggleSidebar} userId={userId} setUserId={setUserId} />
                <main className='main-container-dash'>
                    <div className='main-title mb-4'>
                        <h3>Categories</h3>
                    </div>
                </main>
            </div>
        </>
    );
}

export default Categories;