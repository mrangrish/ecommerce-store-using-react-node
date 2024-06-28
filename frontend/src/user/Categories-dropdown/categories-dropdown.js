import React, { useEffect, useState } from "react";
import axios from "axios";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'; // For custom navigation buttons
import './style.css'; // Make sure your custom styles are imported correctly

const CategoriesDropDown = () => {
    const [categories, setCategories] = useState([]);
    const [categoryProducts, setCategoryProducts] = useState({});
    const [hoveredCategory, setHoveredCategory] = useState(null);

    useEffect(() => {
        const fetchShopCategories = async () => {
            try {
                const response = await axios.get("http://localhost:8081/categories");
                setCategories(response.data);

                response.data.forEach(async (category) => {
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
                                        {category.categories_name} <FontAwesomeIcon icon={faAngleDown} />
                                    </p>
                                </div>
                            </div>
                            {hoveredCategory === category.id && (
                                <div className="mega-dropdown bg-body-tertiary">
                                    <ul>
                                        {categoryProducts[category.id]?.map((subcategories) => (
                                            <li key={subcategories.id}>{subcategories.subcategories_name}</li>
                                        ))}
                                    </ul>
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
                        <div className="mega-dropdown bg-body-tertiary">
                            <ul>
                                {categoryProducts[category.id]?.map((subcategories) => (
                                    <li key={subcategories.id}>{subcategories.subcategories_name}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default CategoriesDropDown;
