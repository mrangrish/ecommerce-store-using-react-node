import React, { useEffect, useRef, useState } from "react";
import Header from "../Header";
import SideNavbar from "../SideNavbar";
import axios from "axios";
import $, { error, event } from "jquery";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import Validation from "./Validation";


function SubCategories({ userId, setUserId }) {
    const tableRef = useRef();
    const [tableData, setTableData] = useState([]);
    const [openCategoriesModal, setOpenCategoriesModal] = useState(false);
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
    const [errors, setErrors] = useState({});
    const [values, setValues] = useState({
        subcategories_name: '',
    })
    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: [event.target.value] }))
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const err = Validation(values);
        setErrors(err);
        if (errors.subcategories_name === "") {
            axios.post(`http://localhost:8081/productCategories/addNewSubcategories/${product_id}`, values)
                .then(
                    res =>
                        console.log(res),
                    setValues({
                        categories_name: '',
                    }),


                    toast.success('Category added successfully!'),
                    setOpenCategoriesModal(false),
                    fetchCategories()
                )
                .catch(err => console.log(err));
        }

    }

    const getCategoryFromUrl = () => {
        const pathParts = window.location.pathname.split('/');
        return pathParts[pathParts.length - 1];
    };
    const product_id = getCategoryFromUrl();
    // console.log(product_id);

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
                { title: "Subcatgories Name" },

            ],
            destroy: true
        });
    }, [tableData]);

    const handleOpenCategoriesModal = () => {
        setOpenCategoriesModal(true);
    };

    const handleCloseCategoriesModal = () => {
        setOpenCategoriesModal(false);
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
                    <table className="display" width="100%" ref={tableRef}></table>
                </main>
            </div>
            <Modal show={openCategoriesModal} onHide={handleCloseCategoriesModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Subcategories</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                            <label>SubCategories</label>
                            <input type="text" className="form-control" name="subcategories_name" onChange={handleInput} />
                            {errors.subcategories_name && <span className='text-danger'> {errors.subcategories_name}</span>}
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
        </>
    )
}

export default SubCategories;