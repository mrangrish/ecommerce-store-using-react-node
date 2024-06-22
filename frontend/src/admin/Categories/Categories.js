import React, { useEffect, useRef, useState } from "react";
import Header from "../Header";
import SideNavbar from "../SideNavbar";
import axios from "axios";
import $ from 'jquery';
import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net";
import { Modal, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";

function Categories({ userId, setUserId }) {
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [subcategories, setSubcategories] = useState([]);
    const [openCategoriesModal, setopenCategoriesModal] = useState(false);
    const tableRef = useRef();
    const [tableData, setTableData] = useState([]);

    const toggleSidebar = () => {
        setOpenSidebarToggle(!openSidebarToggle);
    };

    useEffect(() => {
        fetchcategories();
    }, []);

    const fetchcategories = async () => {
        try {
            const response = await axios.get('http://localhost:8081/categories');
            const productData = response.data;
            console.log(response.data);
            const formattedData = productData.map(product => [
                product.categories_name,
                `<img src="http://localhost:8081/images/${product.categories_image}" alt="${product.categories_name}" style="width: 70px; height: 50px;"/>`,
                `<button class="btn btn-primary subcategories-btn" data-id="${product.id}">Subcategories</button>`
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
                    render: function (data, type, row) {
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

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleCatgories = () => {
        setopenCategoriesModal(true);
    }
    const handleCloseCategories = () => {

        setopenCategoriesModal(false);
    }
    return (
        <>
            <div className='grid-container'>
                <Header toggleSidebar={toggleSidebar} userId={userId} setUserId={setUserId} />
                <SideNavbar openSidebarToggle={openSidebarToggle} toggleSidebar={toggleSidebar} userId={userId} setUserId={setUserId} />
                <main className='main-container-dash'>
                    <div className='main-title mb-4'>
                        <h3>Categories</h3>
                        <button className="btn btn-primary" onClick={handleCatgories}>Add Categories</button>
                    </div>
                    <table className="display" width="100%" ref={tableRef}></table>
                </main>
            </div>

            <Modal show={openCategoriesModal} onHide={handleCloseCategories}>
                <Modal.Header closeButton>
                    <Modal.Title>Categories</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group mb-3">
                    <label>Categories Name*</label>
                        <input type="text" className="form-control" name="categories_name" />
                    </div>
                    <div className="form-group">
                    <label>Categories Image*</label>
                        <input type="file" className="form-control" name="categories_image" />
                    </div>
                    <div className="form-group mt-3">
                        <button className="btn btn-primary">submit</button>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseCategories}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Subcategories</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {subcategories.length > 0 ? (
                        <ul>
                            {subcategories.map(subcategory => (
                                <li key={subcategory.id}>{subcategory.subcategories_name}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No subcategories available.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Categories;
