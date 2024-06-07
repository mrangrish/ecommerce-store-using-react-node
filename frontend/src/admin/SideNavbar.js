import React from 'react'
import 
 {BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, 
  BsListCheck, BsMenuButtonWideFill, BsFillGearFill}
 from 'react-icons/bs'

 import { IoBagOutline } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
function SideNavbar({openSidebarToggle, OpenSidebar, adminId, adminName}) {
    const navigate = useNavigate();
  
    const handleOpenProduct = () => {
        navigate(`/AllProduct`, { state: { adminId: adminId, adminName: adminName } });
      };

      const handleOpenDashboard = () => {
        navigate(`/dash`, { state: {adminId: adminId, adminName: adminName}});
      };
    
      const handleOpenCustomer = () => {
        navigate(`/AllCustomer`, { state: {adminId: adminId, adminName: adminName} });
      }
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
                <button onClick={handleOpenDashboard} className='SideBar-button'>
                    <BsGrid1X2Fill className='icon'/> Dashboard
                </button>
            </li>
            <li className='sidebar-list-item'>
                {/* <Link to="/AllProduct"> */}
                <button onClick={handleOpenProduct} className='SideBar-button'>
                    <BsFillArchiveFill className='icon'/> Products
                    </button>
                {/* </Link> */}
            </li>
            <li className='sidebar-list-item'>
            <button className='SideBar-button'>
                    <BsFillGrid3X3GapFill className='icon'/> Categories
                </button>
            </li>
            <li className='sidebar-list-item'>
            <button className='SideBar-button' onClick={handleOpenCustomer}>
                    <BsPeopleFill className='icon'/> Customers
                </button>
            </li>
        </ul>
    </aside>
  )
}

export default SideNavbar
