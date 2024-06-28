import React, { useEffect, useRef, useState } from "react";
import Header from "../Header";
import SideNavbar from "../SideNavbar";
import axios from "axios";
import $ from 'jquery';
import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net";
import { Modal, Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';

function Categories({ userId, setUserId }) {
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
    const [openCategoriesModal, setOpenCategoriesModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const tableRef = useRef();
    const [tableData, setTableData] = useState([]);
    const [categoriesImage, setCategoriesImage] = useState(null);
    const [editValues, setEditValues] = useState({
        id: '',
        categories_name: '',
        categories_image: ''
    });
    const [values, setValues] = useState({
        categories_name: ''
    });

    const handleEditInput = (event) => {
        const { name, value, files } = event.target;
        setEditValues(prev => ({ ...prev, [name]: files ? files[0] : value }));
    };

    const handleEditSubmit = async (event) => {
        event.preventDefault();
        try {
            const formData = new FormData();
            formData.append('categories_name', editValues.categories_name);
            if (editValues.categories_image instanceof File) {
                formData.append('categories_image', editValues.categories_image);
            }

            await axios.put(`http://localhost:8081/productCategories/updatecategories/${editValues.id}`, formData);
            toast.success('Category updated successfully!');
            setOpenEditModal(false);
            fetchCategories();
        } catch (err) {
            console.log(err);
            toast.error('Failed to update category!');
        }
    };

    const toggleSidebar = () => {
        setOpenSidebarToggle(!openSidebarToggle);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8081/productCategories/categories');
            const productData = response.data;

            const formattedData = productData.map(product => [
                product.categories_name,
                `<img src="http://localhost:8081/images/${product.categories_image}" alt="${product.categories_name}" style="width: 70px; height: 50px;"/>`,
                `<a href="/Subcategories/${product.id}" class="btn btn-primary">Subcategories</a>`,
                product.Status === 1 ? `<button class='btn btn-warning btn-Status' data-id=${product.id} data-status="1">Active</button>` : `<button class='btn btn-secondary btn-Status' data-id=${product.id} data-status="0">Inactive</button>`,
                `<button class='btn btn-primary btn-edit' data-id=${product.id}>Edit</button>`
            ]);

            setTableData(formattedData);

            if ($.fn.DataTable.isDataTable(tableRef.current)) {
                $(tableRef.current).DataTable().clear().rows.add(formattedData).draw();
            } else {
                $(tableRef.current).DataTable({
                    data: formattedData,
                    columns: [
                        { title: "Category Name" },
                        { title: "Category Image" },
                        { title: "Subcategories" },
                        { title: "Status" },
                        { title: "Actions" }
                    ]
                });
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleInput = (event) => {
        const { name, value, files } = event.target;
        setValues(prev => ({ ...prev, [name]: files ? files[0] : value }));
        if (name === 'categories_image') {
            setCategoriesImage(URL.createObjectURL(files[0]));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const formData = new FormData();
            formData.append('categories_name', values.categories_name);
            formData.append('categories_image', values.categories_image);

            await axios.post('http://localhost:8081/productCategories/addNewCategories', formData);
            toast.success('Category added successfully!');
            setOpenCategoriesModal(false);
            fetchCategories();
        } catch (err) {
            console.log(err);
            toast.error('Failed to add category!');
        }
    };

    useEffect(() => {
        const handleEditClick = (event) => {
            const button = $(event.currentTarget);
            const id = button.data('id');
            const row = button.closest('tr');
            const name = row.find('td').eq(0).text();
            const imageUrl = row.find('td').eq(1).find('img').attr('src');

            setEditValues({ id, categories_name: name, categories_image: imageUrl });
            setOpenEditModal(true);
        };

        const handleStatusClick = async (event) => {
            const button = $(event.currentTarget);
            const id = button.data('id');
            const status = button.data('status');

            try {
                await axios.put(`http://localhost:8081/productCategories/updateCategoriesStatus/${id}`);
                toast.success('Status updated successfully!');
                fetchCategories();
            } catch (err) {
                console.log(err);
                toast.error('Failed to update status!');
            }
        };

        $(document).on('click', '.btn-edit', handleEditClick);
        $(document).on('click', '.btn-Status', handleStatusClick);

        return () => {
            $(document).off('click', '.btn-edit', handleEditClick);
            $(document).off('click', '.btn-Status', handleStatusClick);
        };
    }, []);

    return (
        <div>
            {/* <Header toggleSidebar={toggleSidebar} /> */}
            <div className='grid-container'>
                <Header toggleSidebar={toggleSidebar} userId={userId} setUserId={setUserId} />
                <SideNavbar openSidebarToggle={openSidebarToggle} toggleSidebar={toggleSidebar} userId={userId} setUserId={setUserId} />
     
           
                <main className='main-container-dash'>
                <div className='main-title mb-4'>
                            <h1 className="h2">Categories</h1>
                            <div className="btn-toolbar mb-2 mb-md-0">
                                <Button variant="primary" onClick={() => setOpenCategoriesModal(true)}>Add New Categories</Button>
                            </div>
                        </div>
                        <ToastContainer />
                        <table ref={tableRef} className="display" width="100%"></table>

                        <Modal show={openCategoriesModal} onHide={() => setOpenCategoriesModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Add New Category</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form onSubmit={handleSubmit} encType="multipart/form-data">
                                    <div className="form-group">
                                        <label htmlFor="categories_name">Category Name</label>
                                        <input type="text" className="form-control" id="categories_name" name="categories_name" onChange={handleInput} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="categories_image">Category Image</label>
                                        <input type="file" className="form-control" id="categories_image" name="categories_image" onChange={handleInput} accept="image/*" required />
                                    </div>
                                    {categoriesImage && <img src={categoriesImage} alt="Preview" style={{ width: '100px', height: '100px' }} />}
                                    <button type="submit" className="btn btn-primary mt-3">Add Category</button>
                                </form>
                            </Modal.Body>
                        </Modal>

                        <Modal show={openEditModal} onHide={() => setOpenEditModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Edit Category</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form onSubmit={handleEditSubmit} encType="multipart/form-data">
                                    <div className="form-group">
                                        <label htmlFor="categories_name">Category Name</label>
                                        <input type="text" className="form-control" id="categories_name" name="categories_name" value={editValues.categories_name} onChange={handleEditInput} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="categories_image">Category Image</label>
                                        <input type="file" className="form-control" id="categories_image" name="categories_image" onChange={handleEditInput} accept="image/*" />
                                    </div>
                                    {editValues.categories_image && (
                                        <img src={typeof editValues.categories_image === 'string' ? editValues.categories_image : URL.createObjectURL(editValues.categories_image)} alt="Preview" style={{ width: '100px', height: '100px' }} />
                                    )}
                                    <button type="submit" className="btn btn-primary mt-3">Save Changes</button>
                                </form>
                            </Modal.Body>
                        </Modal>
                    </main>
                </div>
            </div>
        
    );
}

export default Categories;