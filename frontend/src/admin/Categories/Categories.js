import React, { useEffect, useRef, useState } from "react";
import Header from "../Header";
import SideNavbar from "../SideNavbar";
import axios from "axios";
import $ from 'jquery';
import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net";
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

function Categories({ userId, setUserId }) {
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [subcategories, setSubcategories] = useState([]);
    const [openCategoriesModal, setOpenCategoriesModal] = useState(false);
    const tableRef = useRef();
    const [tableData, setTableData] = useState([]);
    const [categoriesImage, setCategoriesImage] = useState(null);
    const [values, setValues] = useState({
        categories_name: ''
    });

    const toggleSidebar = () => {
        setOpenSidebarToggle(!openSidebarToggle);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8081/categories');
            const productData = response.data;
            const formattedData = productData.map(product => [
                product.categories_name,
                `<img src="http://localhost:8081/images/${product.categories_image}" alt="${product.categories_name}" style="width: 70px; height: 50px;"/>`,
                `<a href="/Subcategories/${product.id}" class="btn btn-primary" >Subcategories</a>`
            ]);
            setTableData(formattedData);
        } catch (error) {
            console.error('Error fetching categories:', error.message);
        }
    };

    useEffect(() => {
        const table = $(tableRef.current).DataTable({
            data: tableData,
            columns: [
                { title: "Categories Name" },
                { title: "Categories Image",
                    render: function (data) {
                        return data;
                    }
                },
                { title: "Subcategories" }
            ],
            destroy: true
        });

        $(tableRef.current).on('click', '.subcategories-btn', function () {
            const categoryId = $(this).data('id');
            handleSubcategoriesClick(categoryId);
        });

        return () => {
            table.destroy();
        };
    }, [tableData]);

    const handleSubcategoriesClick = (categoryId) => {
        setSelectedCategoryId(categoryId);
        fetchSubcategories(categoryId);
        setShowModal(true);
    };

    const fetchSubcategories = async (categoryId) => {
        try {
            const response = await axios.get(`http://localhost:8081/Product/ProductSubcategories/${categoryId}`);
            setSubcategories(response.data);
        } catch (error) {
            console.error('Error fetching subcategories:', error.message);
        }
    };

    const handleOpenCategoriesModal = () => {
        setOpenCategoriesModal(true);
    };

    const handleCloseCategoriesModal = () => {
        setOpenCategoriesModal(false);
    };

    const handleInput = (event) => {
        setValues(prev => ({
            ...prev,
            [event.target.name]: event.target.value
        }));
    };

    const handleImage = (event) => {
        setCategoriesImage(event.target.files[0]); 
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const formData = new FormData();
            formData.append('categories_name', values.categories_name);
            formData.append('categories_image', categoriesImage); 

            const response = await axios.post('http://localhost:8081/productCategories/addNewCategories', formData);
            console.log(response.data);

            setValues({
                categories_name: '',
            });
            setCategoriesImage(null);

            toast.success('Category added successfully!');
            setOpenCategoriesModal(false);
            fetchCategories();
        } catch (error) {
            toast.error('Failed to add category!');
            console.error('Error adding category:', error);
        }
    };

    return (
        <>
            <div className='grid-container'>
                <Header toggleSidebar={toggleSidebar} userId={userId} setUserId={setUserId} />
                <SideNavbar openSidebarToggle={openSidebarToggle} toggleSidebar={toggleSidebar} userId={userId} setUserId={setUserId} />
                <main className='main-container-dash'>
                    <div className='main-title mb-4'>
                        <h3>Categories</h3>
                        <button className="btn btn-primary" onClick={handleOpenCategoriesModal}>Add Categories</button>
                    </div>
                    <table className="display" width="100%" ref={tableRef}></table>
                </main>
            </div>

            <Modal show={openCategoriesModal} onHide={handleCloseCategoriesModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Categories</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                            <label>Categories Name*</label>
                            <input type="text" className="form-control" name="categories_name" value={values.categories_name} onChange={handleInput} required />
                        </div>
                        <div className="form-group">
                            <label>Categories Image*</label>
                            <input type="file" className="form-control" name="categories_image" onChange={handleImage} required />
                        </div>
                        <div className="form-group mt-3">
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseCategoriesModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    );
}

export default Categories;
