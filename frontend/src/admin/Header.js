import React from 'react';
import { BsSearch, BsJustify } from 'react-icons/bs';
import { NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoLogOut, IoPersonCircle } from 'react-icons/io5';


function Header({ OpenSidebar, userId, setUserId}) {
  const navigate = useNavigate();


  const handleLogout = () => {
    axios.get('http://localhost:8081/adminAuthRouter/adminlogout', { withCredentials: true })
        .then(response => {
            console.log(response.data.message);
            setUserId(null);
            navigate('/admin-login');
        })
        .catch(error => {
            console.error(error);
        });
};

  return (
    <header className='header'>
        <div className='menu-icon'>
        <BsJustify className='icon' onClick={OpenSidebar} />
        </div>
        <div className='header-left'>
        <BsSearch className='icon' />
      </div>
      <div className='header-right'>
        <NavDropdown title={<IoPersonCircle size={32} />} id="basic-nav-dropdown">
          <NavDropdown.Item onClick={handleLogout}><IoLogOut /> Logout</NavDropdown.Item>
        </NavDropdown>

      </div>
    </header>
  );
}

export default Header;