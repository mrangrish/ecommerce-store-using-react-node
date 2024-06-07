import React, { useState } from 'react';
import {  BsPersonCircle, BsSearch, BsJustify } from 'react-icons/bs';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


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
        <DropdownButton id="dropdown-basic-button" variant="light" title={<BsPersonCircle />}>
          <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
        </DropdownButton>

      </div>
    </header>
  );
}

export default Header;