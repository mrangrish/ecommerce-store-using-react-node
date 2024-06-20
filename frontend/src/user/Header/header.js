import React from 'react';
import { Navbar, Nav, Container, Badge, NavDropdown } from 'react-bootstrap';
import axios from 'axios';
import { IoHeartOutline, IoLogIn, IoLogOut, IoPersonCircle, IoBagOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

function Header({ userId, setUserId, addtocartcount, localStoragecount }) {
    const navigate = useNavigate();
    const handleLogout = () => {
        axios.get('http://localhost:8081/userAuth/Userlogout', { withCredentials: true })
            .then(response => {
                console.log(response.data.message);
                setUserId(null);
                navigate('/');
            })
            .catch(error => {
                console.error(error);
            });
    };

    return (
        <Navbar expand="lg" className="bg-body-tertiary shadow-sm rounded" sticky="top">
            <Container style={{ paddingTop: '2px', paddingBottom: '2px' }}>
                <Navbar.Brand href="/">SHoP</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mx-auto">
                        <Nav.Link href='/'>Home</Nav.Link>
                        <Nav.Link href='/shop'>Shop</Nav.Link>
                        <Nav.Link href="#contactus">Contact Us</Nav.Link>
                    </Nav>
                    <Nav>
                        <Nav.Link href="#"><IoHeartOutline size={32} /></Nav.Link>
                        <div style={{ marginRight: '-3px' }}></div>
                        <Nav.Link href="/addtocart">
                            <IoBagOutline size={32} style={{ verticalAlign: 'middle' }} />
                            <Badge bg="danger" style={{ borderRadius: '100px' }}>
                                {userId ? addtocartcount : localStoragecount}
                            </Badge>
                        </Nav.Link>
                        <div style={{ marginRight: '-3px' }}></div>
                        {userId === null ? (
                            <Nav.Link href="/Login"><IoLogIn size={32} /></Nav.Link>
                        ) : (
                            <NavDropdown title={<IoPersonCircle size={32} />} id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={handleLogout}><IoLogOut /> Logout</NavDropdown.Item>
                            </NavDropdown>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;