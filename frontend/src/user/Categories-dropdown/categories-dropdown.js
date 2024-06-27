import axios from "axios";
import React, { useEffect, useState } from "react";

function CategoriesDropDown () {
   const [Categories, setCategories] = useState([]);


   useEffect(() => {
    const fetchcategories = async () => {
        try {
            const response = await axios.get('http://localhost:8081/categories');
            setCategories(response.data);
    
        } catch (error) {
            console.error('Error fetching categories:', error.message);
        }
    };
    fetchcategories();
   }, []);


    return (
        <>
        <div className="container-fluid mt-3 mb-3">
            <div className="bg-body-tertiary shadow-sm">
                <div className="row">
                    {Categories.map((item, index) => (
                    <div className="col" key={index}>
                     <img src={`http://localhost:8081/images/${item.categories_image}`} style={{ width: "50px", height: "50px"}}/>
                     <p>{item.categories_name}</p>
                    </div>
                     ))} 
                </div>
            </div>
        </div>
        </>
    )
}

export default CategoriesDropDown;