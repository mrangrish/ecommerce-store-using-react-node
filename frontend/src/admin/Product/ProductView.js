import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../Header";
import SideNavbar from "../SideNavbar";
import axios from "axios";

function ProductView() {
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
    const [viewProduct, setViewProduct] = useState(null);

    const toggleSidebar = () => {
        setOpenSidebarToggle(!openSidebarToggle);
    };

    const location = useLocation();
    const adminId = location.state?.adminId;
    const adminName = location.state?.adminName;


    const getCategoryFromUrl = () => {
        const pathParts = window.location.pathname.split('/');
        return pathParts[pathParts.length - 1];
    };
    const product_id = getCategoryFromUrl();

    const getImageUrls = (jsonString) => {
        try {
            const images = JSON.parse(jsonString);
            return images.map(image => `http://localhost:8081/images/${image}`);
        } catch (e) {
            console.error('Error parsing image JSON:', e);
            return [];
        }
    };

    useEffect(() => {
        const fetchViewProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/adminProductRouter/ViewProduct/${product_id}`);
                setViewProduct(response.data);
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchViewProduct();
    }, [product_id]);

    return (
        <>
            <div className='grid-container'>
                <Header toggleSidebar={toggleSidebar} adminId={adminId} adminName={adminName} />
                <SideNavbar openSidebarToggle={openSidebarToggle} toggleSidebar={toggleSidebar} adminId={adminId} adminName={adminName} />
                <main className='main-container'>
                    <div className='main-title mb-4'><h3>View Product</h3></div>
                    {viewProduct && viewProduct.map((item) => (
                        <div>
                            <div className='form-group mb-3' key={item.id}>
                                <label>Product Name</label>
                                <input type="text" name='product_name' value={item.product_name} className='form-control' disabled />
                            </div>
                            <div className='form-group mb-3'>
                                <label>Product Description</label>
                                <textarea type="text" name='product_description' value={item.product_description} className='form-control' disabled></textarea>
                            </div>
                            <div className='row mb-3'>
                                <div className='col'>
                                    <label>Product Stock</label>
                                    <input type="number" name='product_stock' value={item.product_stock} className='form-control' disabled />
                                </div>
                                <div className='col'>
                                    <label>Product Price</label>
                                    <input type="text" name='product_price' value={item.product_price} className='form-control' disabled />
                                </div>
                            </div>
                            <div className='row mb-3'>
                                <div className='col'>
                                    <label>Product Brand</label>
                                    <input type="text" name='product_stock' value={item.product_brand} className='form-control' disabled />
                                </div>
                                <div className='col'>
                                    <label>Product Color</label>
                                    <input type="text" name='product_stock' value={item.color} className='form-control' disabled />
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col">
                                    <label>Product categories</label>
                                    <input type="text" name="product_categories" value={item.categories_name} className="form-control" disabled />
                                </div>
                                <div className="col">
                                    <label>Product Subcategories</label>
                                    <input type="text" name="product_subcategories" className="form-control" value={item.subcategories_name} disabled />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col">
                                    <label>Product OfferPrice</label>
                                    <input type="text" name="product_offerprice" className="form-control" value={item.product_offerPrice} disabled />
                                </div>
                            </div>

                            <h5 className="mt-4">Product RelatedImages </h5>
                            <div>
                                {getImageUrls(item.product_image).map((url, index) => (
                                    <img src={url} key={index} width={200} />
                                ))}
                            </div>
                        </div>
                    ))}
                </main>

            </div>
        </>
    )
}
export default ProductView;