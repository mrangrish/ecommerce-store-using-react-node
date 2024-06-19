import React, { useEffect, useState, createRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Orderdetails.css';
import OrderSummary from "./OrderSummary";
import Validation from "./OrderinputValidation";
import { IoCheckmark } from 'react-icons/io5';
import $, { error, event } from "jquery";
import RegisterUser from "./RegsiterUser";
import UserAddressForm from "./UserAddressForm";
import AddNewAddress from './AddNewAddress';
import PaymentInput from "./PaymentInputs";
function AuthUserOrder({ userId, setUserId }) {
    const ref = createRef();
    const [values, setValues] = useState({
        phone: '',
        Address: '',
        City: '',
        zip_Code: '',
        useremail: '',
        name: '',
        password_view: '',
    });
    const [list, setList] = useState(false)
    const [addNewAddress, setaddNewAddress] = useState(false);
    const [checkUserId, setCheckUserId] = useState([]);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [registerMessage, setRegisterMessage] = useState('');
    const [emailError, setEmailError] = useState('');
    const [newuserOtp, setNewuserOtp] = useState(false);
    const [errors, setErrors] = useState({});
    const [address, setAddress] = useState('');
    const [userOrderAddressDetails, setUserOrderAddressDetails] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState('');
    const [getUpdateAddress, setgetUpdateAddress] = useState([]);
    const [openPayment, setopenPayment] = useState([]);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const userResponse = await axios.get(`http://localhost:8081/orderdetails/orderUserId/${userId}`);
                const data = userResponse.data;

                if (userResponse.status === 201) {
                    setAddress('User order details not existed.');
                    setValues({
                        useremail: data[0]?.email || '',
                        name: data[0]?.name || '',
                        password_view: data[0]?.password_view || '',
                        phone: data[0]?.phone || '',
                        Address: data[0]?.Address || '',
                        City: data[0]?.City || '',
                        zip_Code: data[0]?.zip_Code || ''
                    });
                } else if (userResponse.status === 200 && data.length > 0) {
                    setAddress('');
                    setValues({
                        phone: data[0]?.phone || '',
                        Address: data[0]?.Address || '',
                        City: data[0]?.City || '',
                        zip_Code: data[0]?.zip_Code || '',
                        useremail: data[0]?.email || '',
                        name: data[0]?.name || '',
                        password_view: data[0]?.password_view || ''
                    });
                }
                setUserOrderAddressDetails(Array.isArray(data) ? data : []);
                setCheckUserId(data || []);
            } catch (err) {
                console.error('Error fetching user details:', err);
            }
        };
        if (userId) {
            fetchUserId();
        }
    }, [userId]);

    useEffect(() => {
        if (checkUserId.length > 0) {
            $('#checkuserid').css('display', 'none');
        } else {
            $('#checkuserid').css('display', 'block');
        }
    }, [checkUserId.length]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (otpVerified) {
                try {
                    const userResponse = await axios.get(`http://localhost:8081/orderdetails/orderUserId/${userId}`);
                    const data = userResponse.data;
                    setCheckUserId(userResponse.data);
                    if (userResponse.status === 201) {
                        setAddress('User order details not existed.');
                        setValues({
                            useremail: userResponse.data[0].email,
                            name: userResponse.data[0].name,
                            password_view: userResponse.data[0].password_view,
                            phone: userResponse.data[0].phone,
                            Address: userResponse.data[0].Address,
                            City: userResponse.data[0].City,
                            zip_Code: userResponse.data[0].zip_Code
                        });
                    } else if (userResponse.status === 200 && userResponse.data.length > 0) {
                        setAddress('');
                        setValues({
                            phone: userResponse.data[0].phone,
                            Address: userResponse.data[0].Address,
                            City: userResponse.data[0].City,
                            zip_Code: userResponse.data[0].zip_Code,
                            useremail: userResponse.data[0].email,
                            name: userResponse.data[0].name,
                            password_view: userResponse.data[0].password_view
                        });
                    }

                    setUserOrderAddressDetails(Array.isArray(data) ? data : []);
                } catch (err) {
                    console.error('Error fetching user details:', err);
                }
            }
        };

        fetchUserDetails();
    }, [otpVerified, userId]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const err = Validation(values);
        setErrors(err);
        console.log(err);

        if (err.phone === "" && err.Address === "" && err.City === "" && err.zip_Code === "") {
            try {
                await axios.post(`http://localhost:8081/orderdetails/updatePhoneNumber/${userId}`, values);
                setCheckUserId(prevState => prevState.map(item => item.id === userId ? { ...item, ...values } : item));
                toast.success('Order Address Add successfully!');
                setAddress('');
                setUserOrderAddressDetails(prevDetails => [...prevDetails, values]);
                setaddNewAddress(!addNewAddress)
            } catch (err) {
                console.error('Error updating phone number:', err);
            }
        }
    };

    const handleInputChange = (name, value) => {
        setValues(prev => ({ ...prev, [name]: value }));
    }

    const sendOtp = async () => {
        if (email.trim() === '') {
            setEmailError('Email should not be empty');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8081/mailverified/send-email-otp', { email });
            if (response.status === 201) {
                setNewuserOtp(true);
                toast.success('OTP sent successfully. Please check your email!');
            } else if (response.data.success) {
                setOtpSent(true);
                toast.success('OTP sent successfully. Please check your email!');
            }
        } catch (error) {
            toast.error('Error sending OTP. Please try again.');
        }
    };

    const verifyOtp = async () => {
        if (!email || !otp) {
            toast.error('Email and OTP are required.');
            return;
        }
    
        try {
            const response = await axios.post('http://localhost:8081/mailverified/verify-email-otp', { email, otp }, { withCredentials: true });
    
            if (response.data.success) {
                setOtpVerified(true);
                setUserId(response.data.userId);
                toast.success('OTP verified successfully!');
    
                const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
                for (const item of cartItems) {
                    try {
                        await axios.post(`http://localhost:8081/orderdetails/movecartItems`, { userId: response.data.userId, productId: item.productId, quantity: item.quantity });
                    } catch (error) {
                        console.error('Error moving cart item:', error);
                    }
                }
                localStorage.removeItem('cartItems');
            } else {
                toast.error('OTP verification failed.');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            toast.error(`Error verifying OTP: ${error.response?.data?.message || error.message}`);
        }
    };
    
    const verifyNewUserOtp = async () => {
        if (!email || !otp) {
            toast.error('Email and OTP are required.');
            return;
        }
    
        try {
            const response = await axios.post('http://localhost:8081/mailverified/verify-email-otp', { email, otp }, { withCredentials: true });
    
            if (response.data.success) {
                setOtpVerified(true);
                setUserId(response.data.userId);
                setRegisterMessage(response.data);
                toast.success('OTP verified successfully!');
    
                const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
                for (const item of cartItems) {
                    try {
                        await axios.post(`http://localhost:8081/orderdetails/movecartItems`, { userId: response.data.userId, productId: item.productId, quantity: item.quantity });
                    } catch (error) {
                        console.error('Error moving cart item:', error);
                    }
                }
                localStorage.removeItem('cartItems');
            } else {
                toast.error('OTP verification failed.');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            toast.error(`Error verifying OTP: ${error.response?.data?.message || error.message}`);
        }
    };
    
    const handleUpdateDetails = async (event) => {
        event.preventDefault();
        const err = Validation(values);
        setErrors(err);
        if (err.name === "" && err.password_view === "") {
            try {
                await axios.put(`http://localhost:8081/orderdetails/updateDetails/${userId}`, values);
                toast.success('Details updated successfully!');
                setRegisterMessage('');
            } catch (err) {
                console.error('Error updating details:', err);
            }
        }
    };

    const handleChangeAddress = async (e) => {
        e.preventDefault()
        if (e.target.value) {
            setList(!list)
        }
        setList(!list)
    }

    const handleAddnewAddress = async (e) => {
        e.preventDefault()
        if (e.target.value) {
            setaddNewAddress(!addNewAddress)
        }
        setaddNewAddress(!addNewAddress)
    }

    const handleRadioClick = (event) => {
        const selectedValue = event.target.value;
        setSelectedAddressId(selectedValue);
        setList(!list);
        setopenPayment(!openPayment);
    };

    useEffect(() => {
        const fetchSelectedAddressId = async () => {
            if (selectedAddressId) {
                const response = await axios.get(`http://localhost:8081/orderdetails/updateAddress/${selectedAddressId}`);
                setgetUpdateAddress(response.data);
            }
        }
        fetchSelectedAddressId();
    })

    return (
        <div className="container-fluid mt-5">
            <div className="row justify-content-center">
                <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
                {registerMessage ? (
                    <RegisterUser values={values} handleInputChange={handleInputChange} errors={errors} handleUpdateDetails={handleUpdateDetails} />
                ) : (
                    <div className="col-md-7">
                        {checkUserId.length === 0 ? (
                            <>
                                <div id="checkuserid" style={{ margin: "0 0", color: "white", background: "lightseagreen" }} className="shadow rounded p-3">
                                    <p style={{ fontSize: "large", fontWeight: "500", position: "relative", margin: "0" }}>Login/Signup</p>
                                </div>
                                {!otpVerified ? (
                                    <div id="checkuserid" style={{ background: "lightgrey", padding: "3% 4%" }}>
                                        <label htmlFor="exampleInputEmail" className="form-label text-muted">Email*</label>
                                        <input
                                            type="email"
                                            className="form-control text-muted input"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={otpSent}
                                            placeholder="Enter Email"
                                        />
                                        {emailError && <span className='text-danger'>{emailError}</span>}
                                        <div className='mt-2'>
                                            {!otpSent && (
                                                <button onClick={sendOtp} className="btn btn-warning">Submit</button>
                                            )}
                                        </div>
                                        {newuserOtp && (
                                            <div className="mb-3">
                                                <label htmlFor="exampleInputOtp" className="form-label text-muted">Enter OTP*</label>
                                                <input
                                                    type="text"
                                                    className="form-control text-muted input"
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value)}
                                                />
                                                <button onClick={verifyNewUserOtp} className="btn btn-success">Verify OTP</button>
                                            </div>
                                        )}
                                        {otpSent && !otpVerified && (
                                            <div className="mb-3">
                                                <label htmlFor="exampleInputOtp" className="form-label text-muted">Enter OTP*</label>
                                                <input
                                                    type="text"
                                                    className="form-control text-muted input"
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value)}
                                                />
                                                <button onClick={verifyOtp} className="btn btn-success">Verify OTP</button>
                                            </div>
                                        )}
                                    </div>

                                ) : null}
                                <div style={{ margin: "0 0", color: "black", background: "white" }} className="shadow rounded p-3">
                                    <p style={{ fontSize: "large", fontWeight: "500", position: "relative", margin: "0" }}>
                                        OrderDetails
                                    </p>
                                </div>
                                <div style={{ margin: "0 0", color: "black", background: "white" }} className="shadow rounded p-3">
                                    <p style={{ fontSize: "large", fontWeight: "500", position: "relative", margin: "0" }}>
                                        Payment Details
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <>
                                    <div style={{ margin: "0 0", color: "black", background: "white" }} className="shadow rounded p-3">

                                        <p style={{ fontSize: "large", fontWeight: "500", position: "relative", margin: "0" }}>
                                            <IoCheckmark style={{ color: "green", fontSize: "33px" }} /> {values.useremail}
                                        </p>
                                    </div>
                                    {address ? (
                                        <>
                                            <UserAddressForm
                                                values={values}
                                                errors={errors}
                                                handleInputChange={handleInputChange}
                                                handleSubmit={handleSubmit}
                                            />
                                            <div style={{ margin: "0 0", color: "black", background: "white" }} className="shadow rounded p-3">
                                                <p style={{ fontSize: "large", fontWeight: "500", position: "relative", margin: "0" }}>
                                                    Payment Details
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            {!list ?
                                                <div style={{ margin: "0 0", color: "black", background: "white" }} className="shadow rounded p-3">
                                                    <div className="row">
                                                        <div className="col-8">
                                                            {!selectedAddressId ? (
                                                                <p style={{ fontSize: "large", fontWeight: "500", position: "relative", margin: "0" }}>
                                                                    <IoCheckmark style={{ color: "green", fontSize: "33px" }} /> {values.Address}
                                                                </p>
                                                            ) : (
                                                                getUpdateAddress.map((item, index) => (
                                                                    <div key={index}>
                                                                        <p style={{ fontSize: "large", fontWeight: "500", position: "relative", margin: "0" }}>
                                                                            <IoCheckmark style={{ color: "green", fontSize: "33px" }} /> {item.Address}
                                                                        </p>
                                                                    </div>
                                                                ))
                                                            )}

                                                        </div>
                                                        <div className="col-4">
                                                            <button className="btn btn-primary" onClick={handleChangeAddress}>Change</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                :
                                                <>
                                                    <div style={{ margin: "0 0", color: "white", background: "lightseagreen" }} className="shadow rounded p-3">
                                                        <p style={{ fontSize: "large", fontWeight: "500", position: "relative", margin: "0" }}>Delivery Address</p>
                                                    </div>

                                                    <div style={{ background: "lightgrey", padding: "3% 4%" }}>

                                                        {userOrderAddressDetails.length > 0 && userOrderAddressDetails.map((detail, index) => (
                                                            <div className="row" key={index}>
                                                                <div className="col-2" style={{ width: "3.333333%" }}>
                                                                    <input
                                                                        type="radio"
                                                                        name="address_id"
                                                                        onClick={handleRadioClick}
                                                                        value={detail.order_addressId}
                                                                    />
                                                                </div>
                                                                <div className="col-5">
                                                                    <p><b>{detail.name}</b> {detail.phone}
                                                                        {detail.Address}{detail.City}{detail.zip_Code}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="shadow p-3 bg-body rounded"><button className="btn btn-primary" onClick={handleAddnewAddress}>Add New Address</button></div>
                                                    {addNewAddress ?
                                                        <>
                                                             <AddNewAddress setUserOrderAddressDetails={setUserOrderAddressDetails} setaddNewAddress={setaddNewAddress} addNewAddress={addNewAddress} setAddress={setAddress} userId={userId} setCheckUserId={setCheckUserId}/>
                                                        </>
                                                        : ""}
                                                </>
                                            }
                                            {!openPayment ?
                                                <>
                                                    <div style={{ margin: "0 0", color: "white", background: "lightseagreen" }} className="shadow rounded p-3">
                                                        <p style={{ fontSize: "large", fontWeight: "500", position: "relative", margin: "0" }}>Payment Details</p>
                                                    </div>
                                                    <div style={{ background: "lightgrey", padding: "3% 4%" }}>
                                                    <PaymentInput  userId={userId}/>

                                                    </div>
                                                </>
                                                : <div style={{ margin: "0 0", color: "black", background: "white" }} className="shadow rounded p-3">
                                                    <p style={{ fontSize: "large", fontWeight: "500", position: "relative", margin: "0" }}>
                                                        Payment Details
                                                    </p>
                                                </div>
                                            }
                                        </>
                                    )}
                                </>

                            </>
                        )}
                    </div>
                )}
                <div className="col-4">
                    <OrderSummary userId={userId} setUserId={setUserId} />
                </div>
            </div>
        </div>
    );
}

export default AuthUserOrder;