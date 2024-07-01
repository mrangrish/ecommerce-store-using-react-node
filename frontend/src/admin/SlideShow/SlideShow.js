import React, { useEffect, useRef, useState } from "react";
import Header from "../Header";
import SideNavbar from "../SideNavbar";
import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Modal } from "react-bootstrap";
function SlideShow({ userId, setUserId }) {
    const tableRef = useRef();
    const [tableData, setTableData] = useState([]);
    const [openCategoriesModal, setOpenCategoriesModal] = useState(false);
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
    const [values, setValues] = useState({
        content: '',

    });
    const [checkbox, setCheckbox] = useState(false);
    
    const [categoriesImage, setCategoriesImage] = useState(null);
    const toggleSidebar = () => {
        setOpenSidebarToggle(!openSidebarToggle);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        try {
        
            const formData = new FormData();
            formData.append('content', values.content);
            formData.append('image', values.image);
            // await axios.post('http://localhost:8081/productCategories/addNewCategories', formData);
            // toast.success('Category added successfully!');
            // setOpenCategoriesModal(false);
            // fetchCategories();
        } catch (err) {
            console.log(err);
            toast.error('Failed to add category!');
        }
    };

    const handleInput = (event) => {
        const { name, value, files } = event.target;
        setValues(prev => ({ ...prev, [name]: files ? files[0] : value }));
        if (name === 'categories_image') {
            setCategoriesImage(URL.createObjectURL(files[0]));
        }
        setCheckbox(event.target.checked);
    };


    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/SlideShow/fetchSliderImage`);
            const productData = response.data;
            const formattedData = productData.map(product => [
                product.content,
                `<img src="http://localhost:8081/images/${product.Images}" alt="${product.id}" style="width: 70px; height: 50px;"/>`,
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
        if ($.fn.DataTable.isDataTable(tableRef.current)) {
            $(tableRef.current).DataTable().destroy();
        }

        const table = $(tableRef.current).DataTable({
            data: tableData,
            columns: [
                { title: "Content" },
                { title: "Slide Image" },

            ],
            destroy: true
        });

        return () => {
            if ($.fn.DataTable.isDataTable(tableRef.current)) {
                table.destroy();
            }
        };
    }, [tableData]);

    return (
        <div className='grid-container'>
            <Header toggleSidebar={toggleSidebar} userId={userId} setUserId={setUserId} />
            <SideNavbar openSidebarToggle={openSidebarToggle} toggleSidebar={toggleSidebar} userId={userId} setUserId={setUserId} />

            <main className='main-container-dash'>
                <div className='main-title mb-4'>
                    <h3>SlideShow</h3>
                    <div className="btn-toolbar mb-2 mb-md-0">
                        <Button variant="primary" onClick={() => setOpenCategoriesModal(true)}>Add New SlideShow</Button>
                    </div>
                </div>
                <table className="display" width="100%" ref={tableRef}></table>
            </main>
            <Modal show={openCategoriesModal} onHide={() => setOpenCategoriesModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New SlideShow</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="form-group">
                            <label htmlFor="content">Content</label>
                            <input type="text" className="form-control" id="content" name="content" onChange={handleInput} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="categories_image">Category Image</label>
                            <input type="file" className="form-control" id="image" name="image" onChange={handleInput} accept="image/*" required />
                        </div>
                        <div>
                            <input type="checkbox"  onChange={handleInput} />
                            <p>Checkbox is {checkbox ? "checked" : "unchecked"}</p>
                        </div>

                        {categoriesImage && <img src={categoriesImage} alt="Preview" style={{ width: '100px', height: '100px' }} />}
                        <button type="submit" className="btn btn-primary mt-3">Add Category</button>
                    </form>
                </Modal.Body>
            </Modal>
        </div>

    )
}
export default SlideShow;