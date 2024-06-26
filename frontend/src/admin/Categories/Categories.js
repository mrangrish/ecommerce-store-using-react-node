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
    const [openEditModal, setOpenEditModal] = useState(false);
    const [categoriesImage, setCategoriesImage] = useState(null);
    const [editValues, setEditValues] = useState({
        id: '',
        categories_name: '',
        categories_image: ''
    });
    console.log(editValues);
    const [values, setValues] = useState({
        categories_name: ''
    });

    const handleEditInput = (event) => {
        setEditValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleEditSubmit = (event) => {
        event.preventDefault();
        axios.put(`http://localhost:8081/productCategories/updatecategories/${editValues.id}`, editValues)
            .then(res => {
                toast.success('Category updated successfully!');
                setOpenEditModal(false);
                fetchCategories();
            })
            .catch(err => console.log(err));
    };

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
            console.log(productData);

            const formattedData = productData.map(product => [

                product.categories_name,
                `<img src="http://localhost:8081/images/${product.categories_image}" alt="${product.categories_name}" style="width: 70px; height: 50px;"/>`,
                `<a href="/Subcategories/${product.id}" class="btn btn-primary" >Subcategories</a>`,
                product.Status === 1 ? "<button class='btn btn-warning'>Active</button>" : "<button class='btn btn-secondary'>DeActive</button>",
                `<button class="edit-btn btn btn-success" data-id="${product.id}" data-name="${product.categories_name}" data-image="${product.categories_image}">Edit</button>`
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
                {
                    title: "Categories Image",
                    render: function (data) {
                        return data;
                    }
                },
                { title: "Subcategories" },
                { title: "Status" },
                { title: "Action" }
            ],
            destroy: true
        });

        $(tableRef.current).on('click', '.subcategories-btn', function () {
            const categoryId = $(this).data('id');

        });

        return () => {
            table.destroy();
        };
    }, [tableData]);



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

    $(tableRef.current).on('click', '.edit-btn', function () {
        const id = $(this).data('id');
        const name = $(this).data('name');
        const image = $(this).data('image');
        setEditValues({ id, categories_name: name, categories_image: image });
        setOpenEditModal(true);
    });

    const handleCloseEditModal = () => {
        setOpenEditModal(false);
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
            <Modal show={openEditModal} onHide={handleCloseEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit SubCategories</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleEditSubmit}>
                        <div className="form-group mb-3">
                            <label>Edit categories</label>
                            <input type="text" className="form-control" name="categories_name" value={editValues.categories_name} onChange={handleEditInput} />
                        </div>
                        <div className="form-group mb-3">
                            <label>Edit categories_image</label>
                            <input type="file" className="form-control" name="categories_image" onChange={handleEditInput} value={editValues.categories_image} />
                            <img src={`http://localhost:8081/images/${editValues.categories_image}`} alt={editValues.categories_image} style={{ height: "100px" }} />
                        </div>
                        <div className="form-group">
                            <button className="btn btn-primary">Submit</button>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEditModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}


export default Categories;