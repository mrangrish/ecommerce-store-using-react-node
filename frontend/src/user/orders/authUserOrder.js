import React, { useEffect, useState, createRef } from "react";
import axios from "axios";
import PhoneInput from "react-phone-number-input";
import 'react-phone-number-input/style.css';
import { ToastContainer, toast } from 'react-toastify';
import './Orderdetails.css';
import 'react-toastify/dist/ReactToastify.css';

function AuthUserOrder({ userId, setUserId }) {
    const ref = createRef();
    const [values, setValues] = useState({
        phone: '',
        Address: '',
        City: '',
        zip_Code: ''
    });

    const [checkUserId, setCheckUserId] = useState([]);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [registerMessage, setRegisterMessage] = useState('');
    const [emailError, setEmailError] = useState('');

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
                            zip_Code: userResponse.data[0].zip_Code
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
                            zip_Code: userResponse.data[0].zip_Code
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

        try {
            await axios.put(`http://localhost:8081/orderdetails/updatePhoneNumber/${userId}`, values);
            setCheckUserId(prevState => prevState.map(item => item.id === userId ? { ...item, ...values } : item));
        } catch (err) {
            console.error('Error updating phone number:', err);
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
                if (response.data.success) {
                    setOtpSent(true);
                    toast.success('OTP Sent Successfully. Please check your email!');
                }
            })
            .catch(error => {
                if (error.response && error.response.status === 400) {
                    setRegisterMessage('Email not found, please register first');
                } else {
                    toast.error('Error sending OTP. Please try again.');
                }
            });
    };

    const verifyOtp = async () => {
        try {
            const response = await axios.post('http://localhost:8081/mailverified/verify-email-otp', { email, otp }, { withCredentials: true });

            if (response.data.success) {
                setOtpVerified(true);
                setUserId(response.data.userId);
                toast.success('OTP verified successfully!');
            } else {
                toast.error('OTP verification failed.');
            }
        } catch (error) {
            toast.error('Error verifying OTP: ' + error.message);
        }
    };

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
                <div className="col-md-7">
                    <div style={{ margin: "0 0", color: otpVerified ? "black" : "white", background: otpVerified ? "white" : "lightseagreen" }} className="shadow rounded p-3">
                        <p style={{ fontSize: "large", fontWeight: "500", position: "relative", margin: "0" }}>
                            {otpVerified ? `Logged in as: ${email}` : 'Login/Signup'}
                        </p>
                    </div>
                    {checkUserId.length === 0 ? (
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
                                            <PhoneInput value={values.phone} defaultCountry="IN" onChange={(value) => handleInputChange('phone', value)} ref={ref} placeholder="Enter Your Mobile number" />
                                        </div>
                                        <div className="mb-3 mt-3 col-6">
                                            <label htmlFor="exampleInputAddress" className="form-label text-muted">Address*</label>
                                            <input type="text" className="form-control input text-muted" value={values.Address} onChange={(e) => handleInputChange('Address', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="mb-3 mt-3 col-6">
                                            <label htmlFor="exampleInputCity" className="form-label text-muted">Town/City</label>
                                            <input type="text" className="form-control input text-muted" value={values.City} onChange={(e) => handleInputChange('City', e.target.value)} />
                                        </div>
                                        <div className="mb-3 mt-3 col-6">
                                            <label htmlFor="exampleInputPostcode" className="form-label text-muted">Postcode / ZIP*</label>
                                            <input type="text" className="form-control input text-muted" value={values.zip_Code} onChange={(e) => handleInputChange('zip_Code', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="form-group mt-3">
                                        <button className="btn btn-danger" onClick={handleSubmit}>Change</button>
                                        <button className="btn btn-primary">Next</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )} 
                </div>
                <div className="col-5">
                    <div className="order-summary">
                        <h4>Order Summary</h4>
                        <p>Item 1: $10</p>
                        <p>Item 2: $20</p>
                        <p>Total: $30</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthUserOrder;