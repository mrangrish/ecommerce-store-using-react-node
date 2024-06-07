import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../Header";
import SideNavbar from "../SideNavbar";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminProductEdit() {
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
    const [editProduct, setEditProduct] = useState({});
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [subcategories, setSubcategories] = useState([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productStock, setProductStock] = useState(0);
    const [productPrice, setProductPrice] = useState('');
    const [productBrand, setProductBrand] = useState('');
    const [productColor, setProductColor] = useState('');
    const [productOfferPrice, setProductOfferPrice] = useState('');
    const [productImages, setProductImages] = useState([]);
    const [newProductImages, setNewProductImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);


    const toggleSidebar = () => {
        setOpenSidebarToggle(!openSidebarToggle);
    };

    const location = useLocation();
    const adminId = location.state?.adminId;
    const adminName = location.state?.adminName;

    const getProductIdFromUrl = () => {
        const pathParts = window.location.pathname.split('/');
        return pathParts[pathParts.length - 1];
    };
    const product_id = getProductIdFromUrl();

    useEffect(() => {
        const fetchEditProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/adminProductRouter/editProduct/${product_id}`);
                const productData = response.data[0];
                setEditProduct(productData);
                setProductName(productData.product_name);
                setProductDescription(productData.product_description);
                setProductStock(productData.product_stock);
                setProductPrice(productData.product_price);
                setProductBrand(productData.product_brand);
                setProductColor(productData.color);
                setSelectedCategory(productData.category_id);
                setSelectedSubcategory(productData.subcategory_id);
                setProductOfferPrice(productData.product_offerPrice);
                setProductImages(productData.product_image ? JSON.parse(productData.product_image) : []);
            } catch (error) {
                console.error(error);
            }
        };
        fetchEditProduct();
    }, [product_id]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8081/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchSubcategories = async () => {
            try {
                if (selectedCategory) {
                    const response = await axios.get(`http://localhost:8081/adminProductRouter/subcategories/${selectedCategory}`);
                    setSubcategories(response.data);
                } else {
                    setSubcategories([]);
                }
            } catch (error) {
                console.error('Error fetching subcategories:', error);
            }
        };

        fetchSubcategories();
    }, [selectedCategory]);

    const getImageUrls = (imageArray) => {
        try {
            return imageArray.map(image => `http://localhost:8081/images/${image}`);
        } catch (e) {
            console.error('Error parsing image JSON:', e);
            return [];
        }
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        setSelectedSubcategory('');
    };

    const handleSubcategoryChange = (e) => {
        setSelectedSubcategory(e.target.value);
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setNewProductImages(files);

        const previewUrls = files.map(file => URL.createObjectURL(file));
        setPreviewImages(previewUrls);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('product_name', productName);
        formData.append('product_description', productDescription);
        formData.append('product_stock', productStock);
        formData.append('product_price', productPrice);
        formData.append('product_brand', productBrand);
        formData.append('color', productColor);
        formData.append('category_id', selectedCategory);
        formData.append('subcategory_id', selectedSubcategory);
        formData.append('product_offerPrice', productOfferPrice);

        if (newProductImages.length > 0) {
            newProductImages.forEach((image) => {
                formData.append('product_image', image);
            });
        } 
    
        try {
            await axios.put(`http://localhost:8081/adminProductRouter/updateProduct/${product_id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Product update successfully!');

        } catch (error) {
            console.error('Error updating product:', error);
            toast.error('Product is not update!');

        }
    };
    
    
    return (
        <>
            <div className='grid-container'>
                <Header toggleSidebar={toggleSidebar} adminId={adminId} adminName={adminName} />
                <SideNavbar openSidebarToggle={openSidebarToggle} toggleSidebar={toggleSidebar} adminId={adminId} adminName={adminName} />
                <main className='main-container'>
                <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
                    <div className='main-title mb-4'><h3>Edit Product</h3></div>
                    <form onSubmit={handleFormSubmit}>
                        <div className='form-group mb-3'>
                            <label>Product Name</label>
                            <input type="text" name='product_name' value={productName} className='form-control' onChange={(e) => setProductName(e.target.value)} />
                        </div>
                        <div className='form-group mb-3'>
                            <label>Product Description</label>
                            <textarea name='product_description' value={productDescription} className='form-control' onChange={(e) => setProductDescription(e.target.value)}></textarea>
                        </div>
                        <div className='row mb-3'>
                            <div className='col'>
                                <label>Product Stock</label>
                                <input type="number" name='product_stock' value={productStock} className='form-control' onChange={(e) => setProductStock(e.target.value)} />
                            </div>
                            <div className='col'>
                                <label>Product Price</label>
                                <input type="text" name='product_price' value={productPrice} className='form-control' onChange={(e) => setProductPrice(e.target.value)} />
                            </div>
                        </div>
                        <div className='row mb-3'>
                            <div className='col'>
                                <label>Product Brand</label>
                                <input type="text" name='product_brand' value={productBrand} className='form-control' onChange={(e) => setProductBrand(e.target.value)} />
                            </div>
                            <div className='col'>
                                <label>Product Color</label>
                                <input type="text" name='color' value={productColor} className='form-control' onChange={(e) => setProductColor(e.target.value)} />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col">
                                <label>Product Categories</label>
                                <select className='form-control' name='category_id' value={selectedCategory} onChange={handleCategoryChange}>
                                    <option value=''>Select Category</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>{category.categories_name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col">
                                <label>Product Subcategories</label>
                                <select className='form-control' name='subcategory_id' value={selectedSubcategory} onChange={handleSubcategoryChange} disabled={!selectedCategory}>
                                    <option value=''>Select Subcategory</option>
                                    {subcategories.map(subcategory => (
                                        <option key={subcategory.id} value={subcategory.id}>{subcategory.subcategories_name}</option>
                                    ))}
                                </select>
                            </div>


                        </div>
                        <div className="row mb-3">
                            <div className="col">
                                <label>Product OfferPrice</label>
                                <input type="text" name="product_offerPrice" className="form-control" value={productOfferPrice} onChange={(e) => setProductOfferPrice(e.target.value)} />
                            </div>
                            <div className="col">
                                <label htmlFor='image'>Image</label>
                                <input type="file" name='product_image' className='form-control'  multiple onChange={handleFileChange} />
                            </div>
                        </div>
                        <h5 className="mt-4">Product Related Images</h5>
                        <div>
                            {getImageUrls(productImages).map((url, index) => (
                                <img src={url} key={index} width={200} alt="product edit image" />
                            ))}
                            {previewImages.map((url, index) => (
                                <img src={url} key={index} width={200} alt="Product Preview" />
                            ))}
                        </div>
                        <button type="submit" className="btn btn-primary">Update product</button>
                    </form>
                </main>
            </div>
        </>
    );
}

export default AdminProductEdit;