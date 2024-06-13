import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import Header from '../Header';
import { useLocation} from 'react-router-dom'
import SideNavbar from '../SideNavbar';
import axios from 'axios';
import Validation from './adminproductvalidation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Addproduct() {
    
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [subcategories, setSubcategories] = useState([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [productImage, setproductimage] = useState([]);

    const location = useLocation();
    const adminId = location.state?.adminId;
    const adminName = location.state?.adminName;
    
    const [values, setValues] = useState({
        product_name: '',
        product_description: '',
        product_stock: '',
        product_price: '',
        product_brand: '',
        category_id: '',
        subcategory_id: '',
        color_id: '',
        Product_offerPrice: ''
    });

    const toggleSidebar = () => {
        setOpenSidebarToggle(!openSidebarToggle);
    };

    const [errors, setErrors] = useState({});
    
    const handleInput = (event) => {
        setValues(prev => ({
            ...prev,
            [event.target.name]: event.target.value
        }));
    };

    const handleImage = (event) => {
        const filesArray = Array.from(event.target.files).map(file => file);
        console.log(filesArray);
        setproductimage(event.target.files);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const err = Validation(values);
        setErrors(err);
        
        if (
            err.product_name === "" &&
            err.product_description === "" &&
            err.product_stock === "" &&
            err.product_price === "" &&
            err.product_brand === "" &&
            err.category_id === "" &&
            err.subcategory_id === "" &&
            err.color_id === "" 
        ) {
            try {
                const formData = new FormData();
                formData.append('product_name', values.product_name);
                formData.append('product_description', values.product_description);
                formData.append('product_stock', values.product_stock);
                formData.append('product_price', values.product_price);
                formData.append('product_brand', values.product_brand);
                formData.append('category_id', values.category_id);
                formData.append('subcategory_id', values.subcategory_id);
                formData.append('color_id', values.color_id);
                formData.append('Product_offerPrice', values.Product_offerPrice);

                if (productImage.length > 0) {
                    for (let i = 0; i < productImage.length; i++) {
                        formData.append('product_image', productImage[i]);
                    }
                }

                const response = await axios.post('http://localhost:8081/adminProductRouter/addproduct', formData);
                console.log(response.data);

                setValues({
                    product_name: '',
                    product_description: '',
                    product_stock: '',
                    product_price: '',
                    product_brand: '',
                    category_id: '',
                    subcategory_id: '',
                    color_id: '',
                    Product_offerPrice: ''
                });
                setproductimage(['']);

                toast.success('Product added successfully!');

            } catch (error) {
                toast.error('Failed to add product!');
                console.error('Error adding product:', error);
            }
        }
    };

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
                const response = await axios.get(`http://localhost:8081/adminProductRouter/subcategories/${selectedCategory}`);
                setSubcategories(response.data);
            } catch (error) {
                console.error('Error fetching subcategories:', error);
            }
        };

        if (selectedCategory) {
            fetchSubcategories();
        } else {
            setSubcategories([]);
        }
    }, [selectedCategory]);

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        setSelectedSubcategory('');
    };

    return (
        <div>
            <div className='grid-container'>
            <Header toggleSidebar={toggleSidebar} adminId={adminId} adminName={adminName} />
                <SideNavbar openSidebarToggle={openSidebarToggle} toggleSidebar={toggleSidebar} adminId={adminId} adminName={adminName} />
                    <main className='main-container'>
                    <div className='main-title mb-4'>
                        <h3>PRODUCTS</h3>
                    </div>
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

                    <div >
                        <div className='card-body'>
                            <form onSubmit={handleSubmit}>
                            <div className='form-group mb-3'>
                                    <label>Product Name</label>
                                    <input type="text" name='product_name' value={values.product_name} onChange={handleInput} className='form-control' />
                                    {errors.product_name && <span className='text-danger'> {errors.product_name}</span>}
                                </div>
                                <div className='form-group mb-3'>
                                    <label>Product Description</label>
                                    <textarea type="text" name='product_description' value={values.product_description} onChange={handleInput} className='form-control'></textarea>
                                    {errors.product_description && <span className='text-danger'> {errors.product_description}</span>}
                                </div>
                                <div className='row mb-3'>
                                    <div className='col'>
                                        <label>Product Stock</label>
                                        <input type="number" name='product_stock' value={values.product_stock} onChange={handleInput} className='form-control' />
                                        {errors.product_stock && <span className='text-danger'> {errors.product_stock}</span>}
                                    </div>
                                    <div className='col'>
                                        <label>Product Price</label>
                                        <input type="text" name='product_price' value={values.product_price} onChange={handleInput} className='form-control' />
                                        {errors.product_price && <span className='text-danger'> {errors.product_price}</span>}
                                    </div>
                                </div>
                                <div className='row mb-3'>
                                    <div className='col'>
                                        <label>Product Brand</label>
                                        <input type="text" name='product_brand' value={values.product_brand} onChange={handleInput} className='form-control' />
                                        {errors.product_brand && <span className='text-danger'> {errors.product_brand}</span>}
                                    </div>
                                    <div className='col'>
                                        <label>Product Image</label>
                                        <input type="file" name='product_image' onChange={handleImage} className='form-control' multiple />
                                        {errors.product_image && <span className='text-danger'> {errors.product_image}</span>}
                                    </div>
                                </div>
                                <div className='row mb-3'>
                                    <div className='col'>
                                        <label>Product Categories</label>
                                        <select className='form-control' name='category_id' value={values.category_id} onChange={(event) => { handleInput(event); handleCategoryChange(event); }}>
                                            <option value="">Select category</option>
                                            {categories.map(category => (
                                                <option key={category.id} value={category.id}>{category.categories_name}</option>
                                            ))}
                                        </select>
                                        {errors.category_id && <span className='text-danger'> {errors.category_id}</span>}
                                    </div>
                                    <div className='col'>
                                        <label>Product SubCategories</label>
                                        <select className='form-control' name='subcategory_id' value={values.subcategory_id} disabled={!selectedCategory} onChange={handleInput} >
                                            <option value="">Select subcategory</option>
                                            {subcategories.map(subcategory => (
                                                <option key={subcategory.id} value={subcategory.id}>{subcategory.subcategories_name}</option>
                                            ))}
                                        </select>
                                        {errors.subcategory_id && <span className='text-danger'> {errors.subcategory_id}</span>}
                                    </div>
                                </div>
                                <div className='row mb-3'>
                                    <div className='col'>
                                        <label>Product Color</label>
                                        <input type="text" name='color_id' value={values.color_id} onChange={handleInput} className='form-control' />
                                        {errors.color_id && <span className='text-danger'> {errors.color_id}</span>}
                                    </div>
                                    <div className='col'>
                                        <label>Product Offer Price</label>
                                        <input type="text" name="Product_offerPrice" value={values.Product_offerPrice} onChange={handleInput} className='form-control' />
                                        {errors.Product_offerPrice && <span className='text-danger'>{errors.Product_offerPrice}</span>}
                                    </div>
                                </div>
                                <button type='submit' className='btn btn-primary'>Add Product</button>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
} 
export default Addproduct;