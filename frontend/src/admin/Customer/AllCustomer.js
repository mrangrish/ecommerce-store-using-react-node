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

export default function AllCustomer() {
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
                const response = await axios.get('http://localhost:8081/adminCustomer/AllUsers');
                const CustomerData = response.data;
                const formattedData = CustomerData.map(product => [
                    product.name, 
                    product.email,
                    
                    `<button class="view-btn btn btn-warning" data-id="${product.id}">View</button>`
                ]);
                setTableData(formattedData);
                
            } catch (error) {
                console.error('Error fetching product data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        

        const table = $(tableRef.current).DataTable({
            data: tableData,
            columns: [
                { title: "Customer Name" }, 
                { title: "Customer Email" }, 
                { title: "Action" }
            
            ],
            destroy: true
        });
        
        return function () {
            table.destroy();
        };
    }, [tableData]);

    

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
                        
                        <h3>Customer</h3>
                    
                    </div>
                    <table className="display" width="100%" ref={tableRef}></table>
                </main>
            </div>
        </div>
    );
}
