import React, { useEffect, useState, createRef } from "react";
import axios from "axios";
import PhoneInput from "react-phone-number-input";
import 'react-phone-number-input/style.css';
import { ToastContainer, toast } from 'react-toastify';
import './Orderdetails.css';
import OrderSummary from "./OrderSummary";
import Validation from "./OrderinputValidation";
import { IoCheckmark } from 'react-icons/io5';
import 'react-toastify/dist/ReactToastify.css';

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

    const [checkUserId, setCheckUserId] = useState([]);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [registerMessage, setRegisterMessage] = useState('');
    const [emailError, setEmailError] = useState('');
    const [newuserOtp, setNewuserOtp] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/session`, { withCredentials: true });
                if (response.data.userId) {
                    const userResponse = await axios.get(`http://localhost:8081/orderdetails/orderUserId/${response.data.userId}`);
                    setCheckUserId(userResponse.data);
                
                    if (userResponse.data.length > 0) {
                        setValues({
                            phone: userResponse.data[0].phone,
                            Address: userResponse.data[0].Address,
                            City: userResponse.data[0].City,
                            zip_Code: userResponse.data[0].zip_Code,
                            useremail: userResponse.data[0].email,
                            name: userResponse.data[0].name,
                            password_view: userResponse.data.password_view
                        });
                    }
                }
            } catch (err) {
                console.error('Error fetching user data:', err);
            }
        };
        fetchUserId();
    }, []);


    useEffect(() => {
        const fetchUserDetails = async () => {
            if (otpVerified) {
                try {
                    const userResponse = await axios.get(`http://localhost:8081/orderdetails/orderUserId/${userId}`);
                    setCheckUserId(userResponse.data);
                    
                    if (userResponse.data.length > 0) {
                        setValues({
                            phone: userResponse.data[0].phone,
                            Address: userResponse.data[0].Address,
                            City: userResponse.data[0].City,
                            zip_Code: userResponse.data[0].zip_Code,
                            useremail: userResponse.data[0].email,
                            name: userResponse.data[0].name,
                            password_view: userResponse.data[0].Password_view

                        });
                    }
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
            await axios.put(`http://localhost:8081/orderdetails/updatePhoneNumber/${userId}`, values);
            setCheckUserId(prevState => prevState.map(item => item.id === userId ? { ...item, ...values } : item));
        } catch (err) {
            console.error('Error updating phone number:', err);
        }
    }
    };

    const handleInputChange = (name, value) => {
        setValues(prev => ({ ...prev, [name]: value }));
    };
    const sendOtp = () => {
        if (email.trim() === '') {
            setEmailError('Email should not be empty');
            return;
        }

        axios.post('http://localhost:8081/mailverified/send-email-otp', { email })
            .then(response => {
                if (response.status === 201) {
                    console.log(response);
                    setNewuserOtp(true);
                    toast.success('OTP sent successfully. Please check your email!');
                } else if (response.data.success) {
                    setOtpSent(true);
                    toast.success('OTP sent successfully. Please check your email!');
                }
            })
            .catch(error => {
                toast.error('Error sending OTP. Please try again.');
            });
    };

    const verifyOtp = async () => {
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
            toast.error('Error verifying OTP: ' + error.message);
        }
    };

    const verifynewuserOtp = async () => {
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
    }

    const handleInputupdateChange = (name, value) => {
        setValues(prev => ({ ...prev, [name]: value }));
    }

    const handleUpdateDetails = async (event) => {
        event.preventDefault();
        const err = Validation(values);
        setErrors(err);
        if (err.name === "" && err.password_view === "") {
            try {
                await axios.put(`http://localhost:8081/orderdetails/updateDetails/${userId}`, values);
                toast.success('Update Details Successfully!');
                setRegisterMessage('');
            }
            catch (err) {
                console.error('Error updating details:', err);
            }
        }
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
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
                {registerMessage ? (
                    <div className="col-md-7">
                        <div style={{ margin: "0 0", color: "white", background: "lightseagreen" }} className="shadow rounded p-3">
                            <p style={{ fontSize: "large", fontWeight: "500", position: "relative", margin: "0" }}>Update Your Name and password</p>
                        </div>
                        <div style={{ background: "lightgrey", padding: "3% 4%" }}>

                            <div className="row">
                                <div className="mt-3 col-6">
                                    <label htmlFor="exampleInputemail" className="form-label text-muted">Email*</label>
                                    <input type="text" className="form-control text-muted input" value={email} disabled />
                                </div>
                                <div className="mt-3 col-6">
                                    <label htmlFor="exampleInputname" className="form-label text-muted">Name*</label>
                                    <input
                                        type="text"
                                        className="form-control text-muted input"
                                        value={values.name}
                                        onChange={(e) => handleInputupdateChange('name', e.target.value)}
                                    />
                                    {errors.name && <span className='text-danger'>{errors.name}</span>}
                                </div>
                            </div>
                            <div className="mb-3 mt-3">
                                <label htmlFor="exampleInputpassword">Password*</label>
                                <input
                                    type="text"
                                    className="form-control text-muted input"
                                    value={values.password_view}
                                    onChange={(e) => handleInputupdateChange('password_view', e.target.value)}
                                />
                                {errors.password_view && <span className='text-danger'>{errors.password_view}</span>}
                            </div>
                            <button type="submit" className="btn btn-warning" onClick={handleUpdateDetails}>Update Details</button>
                            
                        </div>
                        <div style={{ margin: "0 0", background: 'lightseagreen', color: "white" }} className="shadow rounded p-3">
                            Address Details
                        </div>
                    </div>
                ) : (
                    <div className="col-md-7">

                        {checkUserId.length === 0 ? (
                            <div style={{ margin: "0 0", color: "white", background: "lightseagreen" }} className="shadow rounded p-3">
                                <p style={{ fontSize: "large", fontWeight: "500", position: "relative", margin: "0" }}>Login/Signup</p>
                            </div>
                        ) : (
                            <div style={{ margin: "0 0", color: "black", background: "white" }} className="shadow rounded p-3">

                                <p style={{ fontSize: "large", fontWeight: "500", position: "relative", margin: "0" }}><IoCheckmark style={{ color: "green", fontSize: "33px" }} />{values.useremail}</p>
                            </div>
                        )}

                        {checkUserId.length === 0 ? (
                            !otpVerified ? (
                                <div>
                                    <div style={{ background: "lightgrey", padding: "3% 4%" }}>
                                        <label htmlFor="exampleInputemail" className="form-label text-muted">Email*</label>
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
                                                <button onClick={verifynewuserOtp} className="btn btn-success">Verify OTP</button>
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
                                    <div style={{ margin: "0 0", background: 'lightseagreen', color: "white" }} className="shadow rounded p-3">
                                        Address Details
                                    </div>
                                </div>
                            ) : null
                        ) : (
                            checkUserId.map((item, index) => (
                                <div key={index}>
                                    <div style={{ margin: "0 0", background: 'lightseagreen', color: "white" }} className="shadow rounded p-3">
                                        Address Details
                                    </div>
                                    <div style={{ background: "lightgrey", padding: "3% 4%" }}>
                                        <div className="row">
                                            <div className="mb-3 mt-3 col-6">
                                                <label htmlFor="exampleInputphone" className="form-label text-muted">Phone Number</label>
                                                <PhoneInput
                                                    value={values.phone}
                                                    defaultCountry="IN"
                                                    onChange={(value) => handleInputChange('phone', value)}
                                                    ref={ref}
                                                    placeholder="Enter Your Mobile number"
                                                />
                                                {errors.phone && <span className='text-danger'>{errors.phone}</span>}
                                            </div>
                                            <div className="mb-3 mt-3 col-6">
                                                <label htmlFor="exampleInputAddress" className="form-label text-muted">Address*</label>
                                                <input
                                                    type="text"
                                                    className="form-control input text-muted"
                                                    value={values.Address}
                                                    placeholder="Enter Your Address"
                                                    onChange={(e) => handleInputChange('Address', e.target.value)}
                                                />
                                                {errors.Address && <span className='text-danger'>{errors.Address}</span>}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="mb-3 mt-3 col-6">
                                                <label htmlFor="exampleInputCity" className="form-label text-muted">Town/City</label>
                                                <input
                                                    type="text"
                                                    className="form-control input text-muted"
                                                    value={values.City}
                                                    placeholder="Enter Your City"
                                                    onChange={(e) => handleInputChange('City', e.target.value)}
                                                />
                                                {errors.City && <span className='text-danger'>{errors.City}</span>}
                                            </div>
                                            <div className="mb-3 mt-3 col-6">
                                                <label htmlFor="exampleInputPostcode" className="form-label text-muted">Postcode / ZIP*</label>
                                                <input
                                                    type="text"
                                                    className="form-control input text-muted"
                                                    value={values.zip_Code}
                                                    placeholder="Enter Your Zip_code"
                                                    onChange={(e) => handleInputChange('zip_Code', e.target.value)}
                                                />
                                                {errors.zip_Code && <span className='text-danger'>{errors.zip_Code}</span>}
                                            </div>
                                        </div>
                                        <div className="form-group mt-3">
                                            <button className="btn btn-primary" onClick={handleSubmit}>Next</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
                <div className="col-5">
                <OrderSummary userId={userId} setUserId={setUserId} />
                </div>
            </div>
        </div>

    );
}

export default AuthUserOrder;
