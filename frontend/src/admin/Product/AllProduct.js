import React, { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net";
import axios from "axios";
import Header from "../Header";
import SideNavbar from "../SideNavbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation, useNavigate } from "react-router-dom";

export default function AllProduct() {
    const tableRef = useRef();
    const [tableData, setTableData] = useState([]);
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setOpenSidebarToggle(!openSidebarToggle);
    };

    const location = useLocation();
    const adminId = location.state?.adminId;
    const adminName = location.state?.adminName;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8081/adminProductRouter/getProduct');
                const productData = response.data;
                const formattedData = productData.map(product => [
                    product.product_name, 
                    product.product_offerPrice 
                        ? `<strike>${product.product_price}</strike> ${product.product_offerPrice}`
                        : product.product_price,
                    product.status === 1 ? "Active" : "Not Active",
                    `<button class="view-btn btn btn-warning" data-id="${product.id}">View</button> 
                     <button class="edit-btn btn btn-success" data-id="${product.id}">Edit</button> 
                     <button class="delete-btn btn btn-danger" data-id="${product.id}">Delete</button>`
                ]);
                setTableData(formattedData);
                
            } catch (error) {
                console.error('Error fetching product data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const handleDelete = async (productId) => {
            try {
                await axios.delete(`http://localhost:8081/adminProductRouter/deleteProduct/${productId}`);
                toast.success('Product deleted successfully!');
                const productresponse = await axios.get('http://localhost:8081/adminProductRouter/getProduct');
                const productData = productresponse.data;
                const formattedData = productData.map(product => [
                    product.product_name, 
                    product.product_offerPrice 
                        ? `<strike>${product.product_price}</strike> ${product.product_offerPrice}`
                        : product.product_price,
                    product.status === 1 ? "Active" : "Not Active",
                    `<button class="view-btn btn btn-warning" data-id="${product.id}">View</button> 
                     <button class="edit-btn btn btn-success" data-id="${product.id}">Edit</button> 
                     <button class="delete-btn btn btn-danger" data-id="${product.id}">Delete</button>`
                ]);
                setTableData(formattedData);
                
            } catch (error) {
                toast.error('Error deleting product!');
                console.error('Error deleting product:', error);
            }
        };

        const table = $(tableRef.current).DataTable({
            data: tableData,
            columns: [
                { title: "Product Name" }, 
                { title: "Product Price" }, 
                { title: "Status" },
                { title: "Action" }
            ],
            destroy: true
        });

        const handleEdit = (productId) => {
            navigate(`/AdminProductEdit/${productId}`, {state: {adminId: adminId, adminName: adminName}});
        };

        const handleView = (productId) => {
            navigate(`/AdminProductView/${productId}`, {state: {adminId: adminId, adminName: adminName}});
        };

        $(tableRef.current).on('click', '.edit-btn', function() {
            const productId = $(this).data('id');
            handleEdit(productId);
        });

        $(tableRef.current).on('click', '.delete-btn', function() {
            const productId = $(this).data('id');
            handleDelete(productId);
        });

        $(tableRef.current).on('click', '.view-btn', function() {
            const productId = $(this).data('id');
            handleView(productId);
        });

        return function () {
            $(tableRef.current).off('click', '.edit-btn');
            $(tableRef.current).off('click', '.delete-btn');
            $(tableRef.current).off('click', '.view-btn');
            table.destroy();
        };
    }, [tableData]);

    const handleOpenclickAddToProduct = () => {
        navigate(`/addproduct`, {state: {adminId: adminId, adminName: adminName}});
    };

    return (
        <div>
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
                    <div className='main-title mt-4'>
                        
                        <h3>PRODUCTS</h3>
                        <button onClick={handleOpenclickAddToProduct} className="btn btn-primary">Add Product</button>
                    </div>
                    <table className="display" width="100%" ref={tableRef}></table>
                </main>
            </div>
        </div>
    );
}