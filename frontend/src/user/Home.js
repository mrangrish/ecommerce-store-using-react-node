import React from 'react';
import Header from './Header/header';
import Slideshow from '../slider/Slideshow';
import Latest from './latest/latest';
import Productcategories from './Categories/productcategories';
import Footer from './footer/footer';

function Home({ userId, setUserId }) {
    return (
        <div>
            <Header userId={userId} setUserId={setUserId} />
            <Slideshow />
            <Productcategories userId={userId} />
            <Latest userId={userId} setUserId={setUserId} />
            <Footer />
        </div>
    );
}

export default Home;