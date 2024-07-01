import React, { useEffect, useState } from "react";
import axios from "axios";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './style.css';

const CategoriesDropDown = () => {
    const [categories, setCategories] = useState([]);
    const [categoryProducts, setCategoryProducts] = useState({});
    const [hoveredCategory, setHoveredCategory] = useState(null);

    useEffect(() => {
        const fetchShopCategories = async () => {
            try {
                const response = await axios.get("http://localhost:8081/categories");
                setCategories(response.data);

                // Fetch subcategories for each category
                const promises = response.data.map(async (category) => {
                    try {
                        const productsResponse = await axios.get(`http://localhost:8081/GetSubcategories/${category.id}`);
                        setCategoryProducts((prevState) => ({
                            ...prevState,
                            [category.id]: productsResponse.data,
                        }));
                    } catch (error) {
                        console.log(error);
                    }
                });

                await Promise.all(promises); 
            } catch (error) {
                console.log(error);
            }
        };

        fetchShopCategories();
    }, []);

    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 1024 },
            items: 4,
            slidesToSlide: 2
        },
        desktop: {
            breakpoint: { max: 1024, min: 768 },
            items: 3,
            slidesToSlide: 2
        },
        tablet: {
            breakpoint: { max: 768, min: 464 },
            items: 3,
            slidesToSlide: 1
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 3,
            slidesToSlide: 3
        }
    };

    const renderSubcategories = (subcategories) => {
        let subcategoryGroups = [];
        let subcategoryList = [];
    
        subcategories.forEach((subcategory, index) => {
            subcategoryList.push(
                <li key={subcategory.id}>{subcategory.subcategories_name}</li>
            );
    
            // After every 4 subcategories or at the end of the list, create a new list
            if ((index + 1) % 4 === 0 || index === subcategories.length - 1) {
                subcategoryGroups.push(
                    <ul key={index / 4}>{subcategoryList}</ul>
                );
                subcategoryList = []; // Clear the list for the next group
            }
        });
    
        // If there are more than 4 subcategories, create another ul list
        if (subcategoryGroups.length > 1) {
            const secondList = subcategoryGroups.slice(1);
            subcategoryGroups = [
                <ul key={0}>{subcategoryGroups[0]}</ul>,
                <ul key={1}>{secondList}</ul>,
            ];
        }
    
        return subcategoryGroups;
    };
    
    return (
        <div className="container1 bg-body-tertiary shadow-sm rounded container-fluid">
            <ul id="autoWidth" className="cs-hidden d-none d-md-flex">
                {categories.map((category) => (
                    <li
                        key={category.id}
                        className="item-a"
                        onMouseEnter={() => setHoveredCategory(category.id)}
                        onMouseLeave={() => setHoveredCategory(null)}
                    >
                        <div className="dropdown">
                            <div className="box">
                                <img src={`http://localhost:8081/images/${category.categories_image}`} alt=""
                                    className="model" />
                                <div className="details">
                                    <p className="character-details">
                                        {category.categories_name}  {category.id && categoryProducts[category.id] && categoryProducts[category.id].length > 0 && ( <FontAwesomeIcon icon={faAngleDown} /> ) }
                                    </p>
                                </div>
                            </div>
                            {hoveredCategory === category.id && categoryProducts[category.id] && categoryProducts[category.id].length > 0 && (
                                <div className="mega-dropdown bg-body-tertiary">
                                    {renderSubcategories(categoryProducts[category.id])}
                                </div>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
            <Carousel
                responsive={responsive}
                autoPlay
                autoPlaySpeed={5000}
                ssr
                infinite
                arrows
                customLeftArrow={<button className="carousel-arrow left"><FiChevronLeft /></button>}
                customRightArrow={<button className="carousel-arrow right"><FiChevronRight /></button>}
                className="d-md-none"
            >
                {categories.map((category) => (
                    <div key={category.id} className="box">
                        <img src={`http://localhost:8081/images/${category.categories_image}`} alt="" className="model" />
                        <div className="details">
                            <p className="character-details">
                                {category.categories_name} <FontAwesomeIcon icon={faAngleDown} />
                            </p>
                        </div>
                        {categoryProducts[category.id] && categoryProducts[category.id].length > 0 && (
                            <div className="mega-dropdown bg-body-tertiary">
                                {renderSubcategories(categoryProducts[category.id])}
                            </div>
                        )}
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default CategoriesDropDown;