import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Validation from './LoginValidation';
import Header from '../Header/header';
import Footer from '../footer/footer';
import './Login.css';
import loginImage from './login.jpg';
import { IoLogoFacebook, IoReload } from 'react-icons/io5';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

function Login({ userId, setUserId }) {
    const [captchaText, setCaptchaText] = useState('');
    const [userInput, setUserInput] = useState('');
    const [captchaError, setCaptchaError] = useState('');
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        initializeCaptcha(ctx);
    }, []);

    const generateRandomChar = (min, max) =>
        String.fromCharCode(Math.floor(Math.random() * (max - min + 1) + min));

    const generateCaptchaText = () => {
        let captcha = '';
        for (let i = 0; i < 3; i++) {
            captcha += generateRandomChar(65, 90);
            captcha += generateRandomChar(97, 122);
            captcha += generateRandomChar(48, 57);
        }
        return captcha.split('').sort(() => Math.random() - 0.5).join('');
    };

    const drawCaptchaOnCanvas = (ctx, captcha) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        const textColors = ['rgb(0,0,0)', 'rgb(130,130,130)'];
        const letterSpace = 150 / captcha.length;
        for (let i = 0; i < captcha.length; i++) {
            const xInitialSpace = 25;
            ctx.font = '20px Roboto Mono';
            ctx.fillStyle = textColors[Math.floor(Math.random() * 2)];
            ctx.fillText(captcha[i], xInitialSpace + i * letterSpace, Math.floor(Math.random() * 16 + 25), 100);
        }
    };

    const initializeCaptcha = (ctx) => {
        setUserInput('');
        const newCaptcha = generateCaptchaText();
        setCaptchaText(newCaptcha);
        drawCaptchaOnCanvas(ctx, newCaptcha);
    };

    const handleUserInputChange = (e) => {
        setUserInput(e.target.value);
    };

    const [values, setValues] = useState({ email: '', password: '' });
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [backendError, setBackendError] = useState([]);

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleGoogleLogin = (response) => {
        window.location.href = 'http://localhost:8081/userAuth/auth/google';
    };

    const handleGoogleError = (error) => {
        console.log(error);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const err = Validation(values);
        setErrors(err);

        if (userInput === '') {
            setCaptchaError('Captcha should not be empty');
            return;
        }

        if (userInput !== captchaText) {
            setCaptchaError('Incorrect captcha');
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            initializeCaptcha(ctx);
            return;
        }

        if (err.email === "" && err.password === "") {
            axios.post('http://localhost:8081/userAuth/login', values, { withCredentials: true })
                .then(res => {
                    if (res.data.errors) {
                        setBackendError(res.data.errors);
                        console.log(res.data.errors);
                    } else {
                        setBackendError([]);
                        if (res.data.message === "Login successful") {
                            setUserId(res.data.userId);
                            navigate('/');
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
        <>
            <Header userId={userId} setUserId={setUserId} />
            <div className="container">
                <div className="row m-5 no-gutters shadow-lg">
                    <div className="col-md-7 bg-white p-5">
                        <h3 className="pb-3">Login Form</h3>
                        <div className="form-style">
                            {backendError ? backendError.map(e => (<p className='text-danger'>{e.msg}</p>)) : <span></span>}
                            <form onSubmit={handleSubmit}>
                                <div className="form-group pb-3">
                                    <input type="email" placeholder="Email" className="form-control" name='email' onChange={handleInput} id="exampleInputEmail1" aria-describedby="emailHelp" />
                                    {errors.email && <span className='text-danger'> {errors.email}</span>}
                                </div>
                                <div className="form-group pb-3">
                                    <input type="password" placeholder="Password" className="form-control" name='password' onChange={handleInput} id="exampleInputPassword1" />
                                    {errors.password && <span className='text-danger'> {errors.password}</span>}
                                </div>
                                <div className='form-group pb-3'>
                                    <div className='row'>
                                        <div class="col-5">
                                            <canvas ref={canvasRef} width="200" height="70" style={{ background: "lightgray", border: "1px solid" }}></canvas>
                                        </div>
                                        <div class="col-4">
                                            <button type="button" id="reload-button" onClick={() => initializeCaptcha(canvasRef.current.getContext('2d'))} style={{ height: "auto", background: "#cd1616", color: "white", border: "1px solid whitesmoke" }}>
                                                <IoReload />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className='form-group pb-3'>
                                    <input type="text" id="user-input" className="form-control" placeholder="Enter the text in the image" value={userInput} onChange={handleUserInputChange} />
                                    {captchaError && <span className='text-danger'>{captchaError}</span>}
                                </div>
                                <div className="pb-2">
                                    <button type="submit" className="btn btn-dark w-100 font-weight-bold mt-2">Submit</button>
                                </div>
                            </form>
                            <div className="sideline">OR</div>
                            <GoogleOAuthProvider clientId="363201812379-l4vkkrse7e89vn10c1dggd8ikpu24ja5.apps.googleusercontent.com">
                                <GoogleLogin
                                    onSuccess={handleGoogleLogin}
                                    onError={handleGoogleError}
                                />
                            </GoogleOAuthProvider>
                            <div>
                                {/* <button type="submit" className="btn btn-primary w-100 font-weight-bold mt-2"> <IoLogoFacebook /> Login With Facebook</button> */}
                            </div>
                            <div className="pt-4 text-center">
                                Get Members Benefit. <Link to="/signup" style={{ textDecoration: "none" }}>Sign Up</Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-5 d-none d-md-block">
                        <img src={loginImage} alt="nice" style={{ minHeight: "100%", maxWidth: "103%" }} />
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Login;