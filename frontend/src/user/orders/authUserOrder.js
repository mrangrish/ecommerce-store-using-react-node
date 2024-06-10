import React, { useEffect, useState, createRef } from "react";
import axios from "axios";
import PhoneInput from "react-phone-number-input";
import 'react-phone-number-input/style.css';
import { ToastContainer, toast } from 'react-toastify';
import './Orderdetails.css';
import { IoCheckmark } from 'react-icons/io5';
import 'react-toastify/dist/ReactToastify.css';

function AuthUserOrder({ userId, setUserId }) {
    const ref = createRef();
    const [values, setValues] = useState({
        phone: '',
        Address: '',
        City: '',
        zip_Code: '',
        useremail: ''
    });

    const [checkUserId, setCheckUserId] = useState([]);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [registerMessage, setRegisterMessage] = useState('');
    const [emailError, setEmailError] = useState('');
    const [addtocart, setAddtocart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        const calculateTotalPrice = () => {
            let totalPrice = 0;
            addtocart.forEach(item => {
                totalPrice += parseFloat(item.product_offerPrice || item.product_price) * parseInt(item.quantity || 1);
            });
            setTotalPrice(totalPrice);
        };
        calculateTotalPrice();
    }, [addtocart]);

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
                            useremail: userResponse.data[0].email
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

    const getImageUrl = (jsonString) => {
        try {
            const images = JSON.parse(jsonString);
            return `http://localhost:8081/images/${images[0]}`;
        } catch (e) {
            console.error('Error parsing image JSON:', e);
            return '';
        }
    };

    useEffect(() => {
        const fetchAddtocartproduct = async () => {
            try {
                if (userId) {
                    const response = await axios.get(`http://localhost:8081/routeaddtocart/Getaddtocart/${userId}`);
                    setAddtocart(response.data);
                    console.log(response.data);
                } else {
                    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
                    setAddtocart(cartItems);
                    console.log(cartItems);
                }
            } catch (error) {
                console.error('Error fetching cart items:', error);
                const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
                setAddtocart(cartItems);
                console.log(cartItems);
            }
        };
        fetchAddtocartproduct();
    }, [userId]);

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
                    toast.success('OTP sent successfully. Please check your email!');
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


    const calculateDiscountPercentage = (originalPrice, offerPrice) => {
        const discountPercentage = ((originalPrice - offerPrice) / originalPrice) * 100;
        return Math.round(discountPercentage);
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
                        <div style={{ margin: "0 0", color: checkUserId === 0 ? "black" : "white", background: checkUserId === 0 ? "white" : "lightseagreen" }} className="shadow rounded p-3">
                            {checkUserId.length === 0 ? (
                                <p style={{ fontSize: "large", fontWeight: "500", position: "relative", margin: "0" }}>Login/Signup</p>
                            ) : (
                                <p style={{ fontSize: "large", fontWeight: "500", position: "relative", margin: "0" }}><IoCheckmark style={{ color: "green", fontSize: "33px" }} /> {values.useremail}</p>
                            )}
                        </div>
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
                                            </div>
                                            <div className="mb-3 mt-3 col-6">
                                                <label htmlFor="exampleInputAddress" className="form-label text-muted">Address*</label>
                                                <input
                                                    type="text"
                                                    className="form-control input text-muted"
                                                    value={values.Address}
                                                    onChange={(e) => handleInputChange('Address', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="mb-3 mt-3 col-6">
                                                <label htmlFor="exampleInputCity" className="form-label text-muted">Town/City</label>
                                                <input
                                                    type="text"
                                                    className="form-control input text-muted"
                                                    value={values.City}
                                                    onChange={(e) => handleInputChange('City', e.target.value)}
                                                />
                                            </div>
                                            <div className="mb-3 mt-3 col-6">
                                                <label htmlFor="exampleInputPostcode" className="form-label text-muted">Postcode / ZIP*</label>
                                                <input
                                                    type="text"
                                                    className="form-control input text-muted"
                                                    value={values.zip_Code}
                                                    onChange={(e) => handleInputChange('zip_Code', e.target.value)}
                                                />
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
                )}
                <div className="col-5">
                    <div className="order-summary">
                        <h4>Order Summary</h4>
                        {addtocart.length > 0 ? (
                            addtocart.map((item, index) => (
                                <div className="row border-top border-bottom" key={index}>
                                    <div className="row main align-items-center">
                                        <div className="col-4">
                                            <img className="img-fluid p-2" src={getImageUrl(item.product_image)} alt={item.product_name} />


                                        </div>
                                        <div className="col-2">
                                            <div className="row text-muted text-center ">{item.product_brand}</div>
                                            <div className="row text-center">{item.product_name}</div>
                                        </div>
                                        <div className="col-3">

                                            {item.product_offerPrice ? (
                                                <>
                                                    <strike style={{ fontSize: "small" }}>&#8377;{(item.product_price * item.quantity).toFixed(2)}</strike>
                                                    <b>&#8377;{(item.product_offerPrice * item.quantity).toFixed(2)}</b>
                                                    <div className="text-success">{calculateDiscountPercentage(item.product_price, item.product_offerPrice)}% Off</div>
                                                </>
                                            ) : (
                                                <b>&#8377;{(item.product_price * item.quantity).toFixed(2)}</b>
                                            )}
                                        </div>
                                        <div className="col-2">
                                            <p> Quantity:{item.quantity}</p>
                                        </div>



                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No items in cart</p>
                        )}
                        <p>Total: &#8377;{totalPrice.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthUserOrder;
