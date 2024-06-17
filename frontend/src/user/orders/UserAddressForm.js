import React, { createRef } from 'react';
import PhoneInput from "react-phone-number-input";
import 'react-phone-number-input/style.css';

function UserAddressForm({ values, errors, handleInputChange, handleSubmit }) {
    const ref = createRef();
    return (
        <div>
            <div style={{ margin: "0 0", color: "white", background: "lightseagreen" }} className="shadow rounded p-3">
                <p style={{ fontSize: "large", fontWeight: "500", position: "relative", margin: "0" }}>Please Add Your Address Details</p>
            </div>
            <div style={{ background: "lightgrey", padding: "3% 4%" }}>
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="mt-3 col-6">
                            <label>Phone Number</label>
                            <PhoneInput ref={ref} defaultCountry="IN" value={values.phone} placeholder="Enter your phone" onChange={(value) => handleInputChange('phone', value)} />
                            {errors.phone && <span style={{ color: "red" }}>{errors.phone}</span>}
                        </div>
                        <div className="mt-3 col-6">
                            <label>Address</label>
                            <input type="text" name="Address" className="form-control input" placeholder="Enter Your Address" value={values.Address} onChange={(e) => handleInputChange('Address', e.target.value)} />
                            {errors.Address && <span style={{ color: "red" }}>{errors.Address}</span>}
                        </div>
                        <div className="mt-3 col-6">
                            <label>City</label>
                            <input type="text" name="City" placeholder="Enter City" className="form-control input" value={values.City} onChange={(e) => handleInputChange('City', e.target.value)} />
                            {errors.City && <span style={{ color: "red" }}>{errors.City}</span>}
                        </div>
                        <div className="mt-3 col-6">
                            <label>Zip Code</label>
                            <input type="text" name="zip_Code" placeholder="Enter Zipcode" value={values.zip_Code} className="form-control input" onChange={(e) => handleInputChange('zip_Code', e.target.value)} />
                            {errors.zip_Code && <span style={{ color: "red" }}>{errors.zip_Code}</span>}
                        </div>
                    </div>
                    <button className="btn btn-primary mt-3" type="submit">
                        Add Address
                    </button>
                </form>
            </div>
        </div>
    );
}

export default UserAddressForm;
