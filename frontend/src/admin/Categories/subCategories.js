import React, { useEffect, useRef, useState } from "react";
import Header from "../Header";
import SideNavbar from "../SideNavbar";
import axios from "axios";
import $ from "jquery";
import { Button, Modal } from "react-bootstrap";

function SubCategories({ userId, setUserId }) {
    const tableRef = useRef();
    const [tableData, setTableData] = useState([]);
    const [openCategoriesModal, setOpenCategoriesModal] = useState(false);
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
    const getCategoryFromUrl = () => {
        const pathParts = window.location.pathname.split('/');
        return pathParts[pathParts.length - 1];
    };
    const product_id = getCategoryFromUrl();
    console.log(product_id);

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
                    <form>
                        <div className="form-group mb-3">
                            <label>SubCategories</label>
                            <input type="text" className="form-control" />
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