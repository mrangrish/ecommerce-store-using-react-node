import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Validation from './AdminLoginValidation';
import axios from 'axios';
import AdminImage from './assets/jon-ly-Xn7GvimQrk8-unsplash.jpg';

function Adminlogin() {
    const [values, setValues] = useState({ email: '', password: '' });
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [backendError, setBackendError] = useState([]);

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const err = Validation(values);
        setErrors(err);
        if (err.email === "" && err.password === "") {
            axios.post('http://localhost:8081/adminAuthRouter/adminlogin',values, { withCredentials: true })
            .then(res => {
                if (res.data.errors) {
                    setBackendError(res.data.errors);
                    console.log(res.data.errors);
                } else {
                    setBackendError([]);
                    if (res.data.message === "Login successful") {
                        setUserId(res.data.userId);
                        navigate('/dash');
                    } else if (res.data.error === "Incorrect password") {
                        alert("Incorrect password");
                    } else {
                        alert("No record existed");
                    }
                }
            })
            .catch(err => console.log(err));
        }
    };

    return (
        <div className="container-fluid">
            <div className="row no-gutter">
                <div className="col-md-4">
                    <img src={AdminImage} style={{ width: "35.7%", position: "absolute", left: "0%" }} />
                </div>
                <div className="col-md-8 bg-light">
                    <div className="login d-flex align-items-center py-5">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-10 col-xl-8 mx-auto">
                                    <div className='shadow p-3 mb-5 bg-white rounded'>
                                        <div className='card-body'>
                                            <h3 className="display-4">Admin login</h3>
                                            <p className="text-muted mb-4">Login now and check your dashboard</p>
                                            <form onSubmit={handleSubmit}>
                                                {backendError.length > 0 && backendError.map(e => (<p className='text-danger' key={e.msg}>{e.msg}</p>))}
                                                <div className="form-group mb-3">
                                                    <input id="inputEmail" type="email" placeholder="Email address" required="" name='email' onChange={handleInput} className="form-control rounded-pill shadow-sm px-4" />
                                                    {errors.email && <span className='text-danger'> {errors.email}</span>}
                                                </div>
                                                <div className="form-group mb-3">
                                                    <input id="inputPassword" type="password" onChange={handleInput} name="password" placeholder="Password" required="" className="form-control rounded-pill shadow-sm px-4 text-primary" />
                                                    {errors.password && <span className='text-danger'> {errors.password}</span>}
                                                </div>
                                                <button type="submit" className="btn btn-primary btn-block text-uppercase mb-2 rounded-pill shadow-sm">Sign in</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Adminlogin;