import React, { useState } from "react";
import axios from 'axios';
import { PaymentInputsContainer } from 'react-payment-inputs';
import images from 'react-payment-inputs/images';

function PaymentInput({ userId }) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChangeCardNumber = (e) => setCardNumber(e.target.value);
  const handleChangeExpiryDate = (e) => setExpiryDate(e.target.value);
  const handleChangeCVC = (e) => setCvc(e.target.value);

  const handlePaymentcart = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await axios.post('http://localhost:8081/AddPaymentCart/PaymentCard', {
        userId,
        cardNumber,
        expiryDate,
        cvc
      });
      if (response.status === 200) {
        setSuccess('Payment information submitted successfully!');
      } else {
        setError('Failed to submit payment information.');
      }
    } catch (error) {
      setError('An error occurred while submitting payment information.');
    }
  }
  return (
    <>
      <PaymentInputsContainer>
        {({ meta, getCardNumberProps, getExpiryDateProps, getCVCProps, images, getCardImageProps }) => (
          <div className="row">
            {meta.focused !== undefined && (
              <h6>{meta.error && <span className="text-danger">{meta.error}</span>}</h6>
            )}
            <label htmlFor="cardnumber">Card Number</label>
            <div className="card-input-wrapper">
              <svg {...getCardImageProps({ images })} />
              <input
                {...getCardNumberProps({ onChange: handleChangeCardNumber })}
                value={cardNumber}
                className="form-control"
              />
            </div>
            <div className="row mt-3">
              <div className="col-6">
                <label htmlFor="expiryDate">Expiry Date</label>
                <input
                  {...getExpiryDateProps({ onChange: handleChangeExpiryDate })}
                  value={expiryDate}
                  className="form-control"
                />
              </div>
              <div className="col-6">
                <label htmlFor="cvc">CVC</label>
                <input
                  {...getCVCProps({ onChange: handleChangeCVC })}
                  value={cvc}
                  className="form-control"
                />
              </div>
            </div>
          </div>
        )}
      </PaymentInputsContainer>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {success && <div className="alert alert-success mt-3">{success}</div>}
      <button className="btn btn-success mt-3" onClick={handlePaymentcart}>Submit</button>
    </>
  )
}

export default PaymentInput;
