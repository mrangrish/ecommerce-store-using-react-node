
import React, { useEffect, useState } from 'react';
import Header from './Header/header';
import Slideshow from '../slider/Slideshow';
import Latest from './latest/latest';
import Productcategories from './Categories/productcategories';
import Footer from './footer/footer';
import axios from 'axios';
import CategoriesDropDown from './Categories-dropdown/categories-dropdown';
function Home({ userId, setUserId }) {
    const [addtocartcount, setAddtocartcount] = useState(0);
    const [localStoragecount, setLocalStoragecount] = useState(0);
    useEffect(() => {
        const fetchAddtocartCount = async () => {
            try {
                if (userId) {
                    const response = await axios.get(`http://localhost:8081/routeaddtocart/addtocartcount/${userId}`);
                    setAddtocartcount(response.data.count);
                } else {
                    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
                    setLocalStoragecount(cartItems.length);
                }
            } catch (error) {
                console.error('Error fetching Addtocart count:', error);
            }
        };
        fetchAddtocartCount();
    }, [userId]);

    return (
        <div>
            <Header userId={userId} setUserId={setUserId} addtocartcount={addtocartcount} localStoragecount={localStoragecount} />
            <CategoriesDropDown />
            <Slideshow />
            {/* <Productcategories userId={userId} /> */}
            <Latest userId={userId} setUserId={setUserId} setAddtocartcount={setAddtocartcount} setLocalStoragecount={setLocalStoragecount} />
            <Footer />
        </div>
    );
}

export default Home;