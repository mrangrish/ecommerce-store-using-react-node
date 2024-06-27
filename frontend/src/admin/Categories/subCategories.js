import React, { useEffect, useRef, useState } from "react";
import Header from "../Header";
import SideNavbar from "../SideNavbar";
import axios from "axios";
import $ from "jquery";
import { Button, Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import Validation from "./Validation";

function SubCategories({ userId, setUserId }) {
    const tableRef = useRef();
    const [tableData, setTableData] = useState([]);
    const [openCategoriesModal, setOpenCategoriesModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
    const [errors, setErrors] = useState({});
    const [values, setValues] = useState({ subcategories_name: '' });
    const [editValues, setEditValues] = useState({ id: '', subcategories_name: '' });

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleEditInput = (event) => {
        setEditValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const err = Validation(values);
        setErrors(err);
        if (!err.subcategories_name) {
            axios.post(`http://localhost:8081/productCategories/addNewSubcategories/${product_id}`, values)
                .then(res => {
                    setValues({ subcategories_name: '' });
                    toast.success('Category added successfully!');
                    setOpenCategoriesModal(false);
                    fetchCategories();
                })
                .catch(err => console.log(err));
        }
    };

    const handleEditSubmit = (event) => {
        event.preventDefault();
        axios.put(`http://localhost:8081/productCategories/updateSubcategories/${editValues.id}`, editValues)
            .then(res => {
                toast.success('Category updated successfully!');
                setOpenEditModal(false);
                fetchCategories();
            })
            .catch(err => console.log(err));
    };

    const getCategoryFromUrl = () => {
        const pathParts = window.location.pathname.split('/');
        return pathParts[pathParts.length - 1];
    };
    const product_id = getCategoryFromUrl();

    const toggleSidebar = () => {
        setOpenSidebarToggle(!openSidebarToggle);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/Product/ProductSubcategories/${product_id}`);
            const productData = response.data;
            const formattedData = productData.map(product => [
                product.subcategories_name,
                product.Status === 1 ? `<button class='btn btn-warning btn-Status' data-id=${product.id} data-status="1">Active</button>` : `<button class='btn btn-secondary btn-Status' data-id=${product.id} data-status="0">DeActive</button>`,
                `<button class="edit-btn btn btn-success" data-id="${product.id}" data-name="${product.subcategories_name}">Edit</button>`
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
                { title: "Subcategories Name" },
                { title: "Status" },
                { title: "Action" }
            ],
            destroy: true
        });

        $(tableRef.current).on('click', '.btn-Status', async function (e) {
            e.preventDefault();
            const categoryId = $(this).data('id');
            const currentStatus = $(this).data('status');
            try {
                const response = await axios.put(`http://localhost:8081/productCategories/updateSubcategoriesStatus/${categoryId}`);
                const newStatus = response.data.status;
                toast.success('Category status updated successfully!');

                // Update the tableData state to reflect the new status
                setTableData(prevData => prevData.map(row => {
                    if (row[0] === $(this).closest('tr').find('td').first().text()) {
                        row[3] = newStatus === 1
                            ? `<button class='btn btn-warning btn-Status' data-id=${categoryId} data-status="1">Active</button>`
                            : `<button class='btn btn-secondary btn-Status' data-id=${categoryId} data-status="0">DeActive</button>`;
                    }
                    return row;
                }));
                fetchCategories();
            } catch (error) {
                toast.error('Failed to update category status!');
            }
        });

        $(tableRef.current).on('click', '.edit-btn', function () {
            const id = $(this).data('id');
            const name = $(this).data('name');
            setEditValues({ id, subcategories_name: name });
            setOpenEditModal(true);
        });

        return () => {
            $(tableRef.current).off('click', '.edit-btn');
        };
    }, [tableData]);

    const handleOpenCategoriesModal = () => {
        setOpenCategoriesModal(true);
    };

    const handleCloseCategoriesModal = () => {
        setOpenCategoriesModal(false);
    };

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
                        <h3>SubCategories</h3>
                        <button className="btn btn-primary" onClick={handleOpenCategoriesModal}>Add Categories</button>
                    </div>
                    <a href="/Categories" className="btn btn-primary">Back to categories</a>
                    <table className="display" width="100%" ref={tableRef}></table>
                </main>
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
            <Modal show={openCategoriesModal} onHide={handleCloseCategoriesModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Subcategories</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                            <label>SubCategories</label>
                            <input type="text" className="form-control" name="subcategories_name" onChange={handleInput} />
                            {errors.subcategories_name && <span className='text-danger'>{errors.subcategories_name}</span>}
                        </div>
                        <div className="form-group">
                            <button className="btn btn-primary">Submit</button>
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
                            <label>Edit Subcategories</label>
                            <input type="text" className="form-control" name="subcategories_name" value={editValues.subcategories_name} onChange={handleEditInput} />
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

export default SubCategories;