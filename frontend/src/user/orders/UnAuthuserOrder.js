import React, { useState } from 'react';
import axios from 'axios';

function UnAuthaddtocart() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [userId, setUserId] = useState(null);

    const sendOtp = () => {
        axios.post('http://localhost:8081/mailverified/send-email-otp', { email })
            .then(response => {
                if (response.data.success) {
                    setOtpSent(true);
                    alert('OTP sent successfully!');
                } else {
                    alert('Failed to send OTP.');
                }
            })
            .catch(error => {
                alert('Error sending OTP: ' + error.message);
            });
    };

    const verifyOtp = () => {
        axios.post('http://localhost:8081/mailverified/verify-email-otp', { email, otp }, { withCredentials: true })
            .then(response => {
                if (response.data.success) {
                    setOtpVerified(true);
                    alert('OTP verified successfully!');
                    axios.get('http://localhost:8081/session', { withCredentials: true })
                        .then(sessionResponse => {
                            setUserId(sessionResponse.data.userId);
                        })
                        .catch(error => {
                            console.error('Error fetching session id:', error);
                        });
                } else {
                    alert('OTP verification failed.');
                }
            })
            .catch(error => {
                alert('Error verifying OTP: ' + error.message);
            });
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <label htmlFor="exampleInputemail" className="form-label text-muted">Email*</label>
                    <input
                        type="email"
                        className="form-control text-muted"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={otpSent}
                    />
                    <button onClick={sendOtp} disabled={otpSent}>Submit</button>
                </div>
            </div> 

            {otpSent && !otpVerified && (
                <div className="row justify-content-center mt-4">
                    <div className="col-md-6">
                        <label htmlFor="exampleInputOtp" className="form-label text-muted">Enter OTP*</label>
                        <input
                            type="text"
                            className="form-control text-muted"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <button onClick={verifyOtp}>Verify OTP</button>
                    </div>
                </div>
            )}

            {otpVerified && userId && (
                <div className="row justify-content-center mt-4">
                    <div className="col-md-6">
                        <p>OTP verified! User ID: {userId}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UnAuthaddtocart;