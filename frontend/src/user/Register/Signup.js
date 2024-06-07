import React, { useState, useRef, useEffect } from 'react';
import { createRef } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Validation from './SignupValidation';
import axios from 'axios';
import Header from '../Header/header';
import Footer from '../footer/footer';
import { IoReload } from 'react-icons/io5';
import loginImage from '../Login/login.jpg';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import PhoneInput from "react-phone-number-input";
import 'react-phone-number-input/style.css';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

function Signup({ userId, setUserId }) {
  const ref = createRef();
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

  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoneInput = (value) => {
    setValues(prev => ({ ...prev, phone: value }));
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

    const phoneNumber = parsePhoneNumberFromString(values.phone);
    if (!phoneNumber || !phoneNumber.isValid()) {
      setErrors({ ...errors, phone: 'Invalid phone number' });
      return;
    }

    if (!err.name && !err.email && !err.password && !err.phone) {
      axios.post('http://localhost:8081/userAuth/signup', values, { withCredentials: true })
        .then(res => {
          if (res.data.message === "register successfully") {
            setUserId(res.data.userId);
            navigate('/');
          }
        })
        .catch(err => {
          if (err.response && err.response.status === 400) {
            setErrors({ email: 'Email is already existed' });
          }
          console.log(err);
        });
    }
  };
  
  const handleGoogleLogin = (response) => {
    window.location.href = 'http://localhost:8081/userAuth/auth/google';
  };
  
  const handleGoogleError = (error) => {
    console.log(error);
  };

  return (
    <>
      <Header userId={userId} setUserId={setUserId} />
      <div className="container">
        <div className="row m-5 no-gutters shadow-lg">
          <div className="col-md-7 bg-white p-5">
            <h3 className="pb-3">Signup Form</h3>
            <div className="form-style">
              <form onSubmit={handleSubmit}>
                <div className='form-group pb-3'>
                  <input type='text' placeholder='Name' className='form-control' name='name' onChange={handleInput} />
                  {errors.name && <span className='text-danger'>{errors.name}</span>}
                </div>
                <div className="form-group pb-3">
                  <input type="email" placeholder="Email" className="form-control" name='email' onChange={handleInput} />
                  {errors.email && <span className='text-danger'>{errors.email}</span>}
                </div>
                <div className="form-group pb-3">
                  <input type="password" placeholder="Password" className="form-control" name='password' onChange={handleInput} />
                  {errors.password && <span className='text-danger'>{errors.password}</span>}
                </div>
                <div className="form-group pb-3" id="">
                  <PhoneInput value={values.phone} onChange={handlePhoneInput} ref={ref} />
                  {errors.phone && <span className='text-danger'>{errors.phone}</span>}
                </div>
                <div className='form-group pb-3'>
                  <div className='row'>
                    <div className="col-5">
                      <canvas ref={canvasRef} width="200" height="70" style={{ background: "lightgray", border: "1px solid" }}></canvas>
                    </div>
                    <div className="col-4">
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
              <div>
                <GoogleOAuthProvider clientId="363201812379-l4vkkrse7e89vn10c1dggd8ikpu24ja5.apps.googleusercontent.com">
                  <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={handleGoogleError}
                    width="100%"
                    containerProps={{
                      style: {
                        width: "100% !important",
                      },
                    }}
                  />
                </GoogleOAuthProvider>
              </div>
              <div className="pt-4 text-center">
                Already Registered? <Link to="/Login" style={{ textDecoration: "none" }}>Sign in</Link>
              </div>
            </div>
          </div>
          <div className="col-md-5 d-none d-md-block">
            <img src={loginImage} className="img-fluid" style={{ minHeight: "100%", maxWidth: "103%" }} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Signup;