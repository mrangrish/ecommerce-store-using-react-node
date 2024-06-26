import React, { useState } from 'react';
import { BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill } from 'react-icons/bs';
import { IoBagOutline, IoSwapHorizontal } from "react-icons/io5";
import { Link, useLocation } from 'react-router-dom';
import { GoListOrdered } from "react-icons/go";

function SideNavbar({ openSidebarToggle, OpenSidebar }) {
    const location = useLocation();
    const [activeLink, setActiveLink] = useState(location.pathname);

    const handleLinkClick = (path) => {
        setActiveLink(path);
    };

    return (
        <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
            <div className='sidebar-title'>
                <div className='sidebar-brand'>
                    <IoBagOutline className='icon_header' /> SHoP
                </div>
                <span className='icon close_icon' onClick={OpenSidebar}>X</span>
            </div>

            <ul className='sidebar-list'>
                <li 
                  className={`sidebar-list-item ${activeLink === '/dash' ? 'active' : ''}`} 
                  onClick={() => handleLinkClick('/dash')}
                >
                    <Link to="/dash" className='SideBar-button'>
                        <BsGrid1X2Fill className='icon' /> Dashboard
                    </Link>
                </li>
                <li 
                  className={`sidebar-list-item ${activeLink === '/AllProduct' ? 'active' : ''}`} 
                  onClick={() => handleLinkClick('/AllProduct')}
                >
                    <Link to="/AllProduct">
                        <BsFillArchiveFill className='icon' /> Products
                    </Link>
                </li>
                <li 
                  className={`sidebar-list-item ${activeLink === '/Categories' ? 'active' : ''}`} 
                  onClick={() => handleLinkClick('/Categories')}
                >
                    <Link to="/Categories">
                        <BsFillGrid3X3GapFill className='icon' /> Categories
                    </Link>
                </li>
                <li 
                  className={`sidebar-list-item ${activeLink === '/AllCustomer' ? 'active' : ''}`} 
                  onClick={() => handleLinkClick('/AllCustomer')}
                >
                    <Link to="/AllCustomer">    
                        <BsPeopleFill className='icon' /> Customers
                    </Link>
                </li>
                <li className={`sidebar-list-item ${activeLink === '/AllOrders' ? 'active': ''}`} onClick={() => handleLinkClick('/AllOrders')}>
                <Link to="/AllOrders">
                <GoListOrdered className='icon' /> Orders
                </Link>
                </li>
                <li className={`sidebar-list-item ${activeLink === '/SlideShow' ? 'active': '' }`} onClick={() => handleLinkClick('/SlideShow')}>
                <Link to='/SlideShow'> <IoSwapHorizontal/> SlideShow</Link>
                </li>
            </ul>
        </aside>
    );
}

export default SideNavbar;
