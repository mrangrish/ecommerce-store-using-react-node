import React, { useState, useEffect } from "react";
import axios from "axios";
import AOS from "aos";
import 'aos/dist/aos.css';
import './productcategories.css';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGreaterThan, faLessThan } from "@fortawesome/free-solid-svg-icons";

function Productcategories({ id }) {
    const [categories, setCategories] = useState([]);
    const [startIndex, setStartIndex] = useState(0);
    const [endIndex, setEndIndex] = useState(2); 
    const navigate = useNavigate();

    useEffect(() => {
        AOS.init();
        fetchcategories();
    }, []);

    const fetchcategories = async () => {
        try {
            const response = await axios.get('http://localhost:8081/categories');
            setCategories(response.data);
    
        } catch (error) {
            console.error('Error fetching categories:', error.message);
        }
    };

    const handleCategoryClick = (categoryId) => {
        navigate(`/Product/${categoryId}`, { state: { id: id } });
    };

    const handleNextClick = () => {
        if (endIndex < categories.length - 1) {
            setStartIndex(startIndex + 1);
            setEndIndex(endIndex + 1);
        }
    };

    const handlePrevClick = () => {
        if (startIndex > 0) {
            setStartIndex(startIndex - 1);
            setEndIndex(endIndex - 1);
        }
    };

    const calculateCardWidth = () => {
        const sliderWidth = document.querySelector('.slider').offsetWidth;
        const numCards = endIndex - startIndex + 1;
        const cardMargin = 30; 
        return (sliderWidth - (numCards - 1) * cardMargin) / numCards;
    };

    return (
        <div className="mt-5 text-center">
            <h1>Categories</h1>
            <div className="container mt-5 text-center slider-container"> 
                <div className="slider">
                    {categories.slice(startIndex, endIndex + 1).map((item, index) => (
                        <div key={index} className="card" style={{ width: calculateCardWidth() }}>
                            <img src={`http://localhost:8081/images/${item.categories_image}`} className="card-img-top" alt="..." />
                            <div className="content-overlay">
                                <div className="con">
                                    <p onClick={() => handleCategoryClick(item.id)}>{item.categories_name}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="prev-button" onClick={handlePrevClick} disabled={startIndex === 0} style={{ position: "absolute", left: "3.5%", bottom: "-55%", background: "whitesmoke", padding: "9px 14px", borderRadius: "50%", border: "none" }}><FontAwesomeIcon icon={faLessThan} /></button>

                <button className="next-button" onClick={handleNextClick} disabled={endIndex === categories.length - 1} style={{ position: "absolute", right: "5%", bottom: "-55%", background: "whitesmoke", padding: "9px 14px", borderRadius: "50%", border: "none" }}><FontAwesomeIcon icon={faGreaterThan} /></button>
            </div>
        </div>
    );
}

export default Productcategories;