import React, { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net";
import axios from "axios";
import Header from "../Header";
import SideNavbar from "../SideNavbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function AllProduct({ userId, setUserId }) {
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
                `<a href="/AdminProductView/${product.id}" class="view-btn btn btn-warning" data-id="${product.id}">View</a>
                 <a href="/AdminProductEdit/${product.id}" class="edit-btn btn btn-success" data-id="${product.id}">Edit</a>
                 <button class="delete-btn btn btn-danger" data-id="${product.id}">Delete</button>`
            ]);
            setTableData(formattedData);
        } catch (error) {
            console.error('Error fetching product data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const handleDelete = async (productId) => {
            try {
                await axios.delete(`http://localhost:8081/adminProductRouter/deleteProduct/${productId}`);
                toast.success('Product deleted successfully!');
                fetchData(); // Refresh data after deletion
            } catch (error) {
                toast.error('Error deleting product!');
                console.error('Error deleting product:', error);
            }
        };

        if ($.fn.DataTable.isDataTable(tableRef.current)) {
            $(tableRef.current).DataTable().destroy();
        }

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

        $(tableRef.current).on('click', '.delete-btn', function () {
            const productId = $(this).data('id');
            handleDelete(productId);
        });

        return () => {
            $(tableRef.current).off('click', '.delete-btn');
            if ($.fn.DataTable.isDataTable(tableRef.current)) {
                table.destroy();
            }
        };
    }, [tableData]);

    return (
        <div>
            <div className='grid-container'>
                <Header toggleSidebar={toggleSidebar} userId={userId} setUserId={setUserId} />
                <SideNavbar openSidebarToggle={openSidebarToggle} toggleSidebar={toggleSidebar} userId={userId} setUserId={setUserId} />
                <main className='main-container-dash'>
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
                        <Link to='/addproduct' className="btn btn-primary">Add Product</Link>
                    </div>
                    <table className="display" width="100%" ref={tableRef}></table>
                </main>
            </div>
        </div>
    );
}
