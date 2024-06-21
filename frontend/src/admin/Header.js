import React, { useState } from 'react';
import {  BsPersonCircle, BsSearch, BsJustify } from 'react-icons/bs';
import { NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoPersonCircle } from 'react-icons/io5';


function Header({ OpenSidebar , adminId, adminName }) {
     const navigate = useNavigate();
 
 
     const handleLogout = () => {
    if(adminId){
    axios.post('http://localhost:8081/adminAuthRouter/adminlogout')
      .then(response => {
        console.log(response.data.message);
        navigate('/admin-login');
      })
      .catch(error => {
        console.error(error);
      });
    }
  };
  return (
    <header className='Dashboard-header'>
      <div className='menu-icon'>
        <BsJustify className='icon' onClick={OpenSidebar} />
      </div>
      <div className='header-left'>
        <BsSearch className='icon' />
      </div>
      <div className='header-right'>
        {/* <BsFillBellFill className='icon' />
        <BsFillEnvelopeFill className='icon' />
       */}
      
      <NavDropdown title={<IoPersonCircle size={32} />} id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={handleLogout}><IoLogOut /> Logout</NavDropdown.Item>
                            </NavDropdown>

      </div>
    </header>
  );
}

export default Header;