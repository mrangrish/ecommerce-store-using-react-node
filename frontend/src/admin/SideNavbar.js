import React from 'react'
import 
 {BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, 
  BsListCheck, BsMenuButtonWideFill, BsFillGearFill}
 from 'react-icons/bs'

 import { IoBagOutline } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
function SideNavbar({openSidebarToggle, OpenSidebar}) {
    // const navigate = useNavigate();
  
    
  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive": ""}>
        <div className='sidebar-title'>
            <div className='sidebar-brand'>
                <IoBagOutline  className='icon_header'/> SHOP
            </div>
            <span className='icon close_icon' onClick={OpenSidebar}>X</span>
        </div>

        <ul className='sidebar-list'>
            <li className='sidebar-list-item'>
                <Link to="/dash" className='SideBar-button'>
                    <BsGrid1X2Fill className='icon'/> Dashboard
                </Link>
            </li>
            <li className='sidebar-list-item'>
                <Link to="/AllProduct">
        
                    <BsFillArchiveFill className='icon'/> Products
                    
                </Link>
            </li>
            <li className='sidebar-list-item'>
            <Link to="#">
                    <BsFillGrid3X3GapFill className='icon'/> Categories
                    </Link>
            </li>
            <li className='sidebar-list-item'>
            <Link to="/AllCustomer"> 
                    <BsPeopleFill className='icon'/> Customers
            
                </Link>
            </li>
        </ul>
    </aside>
  )
}

export default SideNavbar
