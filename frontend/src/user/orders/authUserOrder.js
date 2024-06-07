import React, { useEffect, useState, createRef } from "react";
import axios from "axios";
import PhoneInput from "react-phone-number-input";
import 'react-phone-number-input/style.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AuthUserOrder({ userId, setUserId }) {
    const ref = createRef();
    const [values, setValues] = useState({
        phone: '',
        Address: '',
        City: '',
        zip_Code: ''
    });

    const [checkuserId, setcheckuserId] = useState([]);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [registerMessage, setRegisterMessage] = useState('');

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/session`, { withCredentials: true });
                if (response.data.userId) {
                    const userResponse = await axios.get(`http://localhost:8081/orderdetails/orderUserId/${response.data.userId}`);
                    setcheckuserId(userResponse.data);
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

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.put(`http://localhost:8081/orderdetails/updatePhoneNumber/${userId}`, values);
            setcheckuserId(prevState => prevState.map(item => item.id === userId ? { ...item, ...values } : item));
        } catch (err) {
            console.error('Error updating phone number:', err);
        }
    };

    const handleInputChange = (name, value) => {
        setValues(prev => ({ ...prev, [name]: value }));
    };

    const sendOtp = () => {
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

                const userResponse = await axios.get(`http://localhost:8081/orderdetails/orderUserId/${response.data.userId}`);
                setcheckuserId(userResponse.data);
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
                {registerMessage ? (
                    <div className="col-md-6">
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="exampleInputemail" className="form-label text-muted">Email*</label>
                                <input type="email" className="form-control text-muted" value={email} />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="exampleInputName">Name*</label>
                                <input type="text" className="form-control text-muted" />
                            </div>
                            <div className="col-md-6 mb-3 mt-3">
                                <label htmlFor="exampleInputpassword">Password*</label>
                                <input type="password" className="form-control text-muted" />
                            </div>
                            <div className="col-md-6 mb-3 mt-3">
                                <label htmlFor="exampleInputaddress">Phone*</label>
                                <PhoneInput value={values.phone} defaultCountry="IN" onChange={(value) => handleInputChange('phone', value)} ref={ref} placeholder="Enter Your Mobile number" />
                            </div>
                            <div className="col-md-6 mb-3 mt-3">
                                <label htmlFor="exampleInputaddress">Address*</label>
                                <input type="text" className="form-control text-muted"></input>
                            </div>
                            <div className="col-md-6 mb-3 mt-3">
                                <label htmlFor="exampleInputCity" className="form-label text-muted">Town/City</label>
                                <input type="text" className="form-control text-muted" />
                            </div>
                            <div className="col-md-6 mb-3 mt-3">
                                <label htmlFor="exampleInputPostcode" className="form-label text-muted">Postcode / ZIP*</label>
                                <input type="text" className="form-control text-muted" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="col-md-7">
                        <div style={{ margin: "0 0", background: 'lightseagreen', padding: "25px", color: "white" }} className="shadow rounded">
                            <p style={{ fontSize: "large", fontWeight: "500", position: "absolute", top: '128px', left: '131px' }}>Login/Signup</p>
                        </div>
                    
                        
                    
                            {checkuserId.length === 0 ? (
                                <div>
                                    <div style={{ background: "lightgrey", padding: "3% 4%" }}>
                                    <label htmlFor="exampleInputemail" className="form-label text-muted">Email*</label>
                                    <input
                                        type="email"
                                        className="form-control text-muted"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={otpSent}
                                    />
                                    {!otpSent && (
                                        <button onClick={sendOtp} className="btn btn-warning">Submit</button>
                                    )}
                                    {otpSent && !otpVerified && (
                                        <div className="mb-3">
                                            <label htmlFor="exampleInputOtp" className="form-label text-muted">Enter OTP*</label>
                                            <input
                                                type="text"
                                                className="form-control text-muted"
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
                                checkuserId.map((item, index) => (
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
                                                <input type="text" className="form-control text-muted" value={values.Address} onChange={(e) => handleInputChange('Address', e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="mb-3 mt-3 col-6">
                                                <label htmlFor="exampleInputCity" className="form-label text-muted">Town/City</label>
                                                <input type="text" className="form-control text-muted" value={values.City} onChange={(e) => handleInputChange('City', e.target.value)} />
                                            </div>
                                            <div className="mb-3 mt-3 col-6">
                                                <label htmlFor="exampleInputPostcode" className="form-label text-muted">Postcode / ZIP*</label>
                                                <input type="text" className="form-control text-muted" value={values.zip_Code} onChange={(e)=> handleInputChange('zip_Code', e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="form-group mt-3">
                                            <button className="btn btn-danger" onClick={handleSubmit}>Change</button>
                                        </div>
                                    </div>
                                    </div>
                                ))
                            )}
                        
                    </div>
                )}
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