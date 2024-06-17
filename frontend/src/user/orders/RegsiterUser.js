import React from "react";

function RegisterUser({values, handleInputChange, errors, handleUpdateDetails}) {
    return (
        <>
            <div className="col-md-7">
                <div style={{ margin: "0 0", color: "white", background: "lightseagreen" }} className="shadow rounded p-3">
                    <p style={{ fontSize: "large", fontWeight: "500", position: "relative", margin: "0" }}>Update Your Name and Password</p>
                </div>
                <div style={{ background: "lightgrey", padding: "3% 4%" }}>
                    <div className="row">
                        <div className="mt-3 col-6">
                            <label>Name</label>
                            <input type="text" name="name" placeholder="Enter Your Name" value={values.name} className="form-control input" onChange={(e) => handleInputChange('name', e.target.value)} />
                            {errors.name && <span style={{ color: "red" }}>{errors.name}</span>}
                        </div>

                        <div className="mt-3 col-6">
                            <label>Password</label>
                            <input type="text" name="password_view" placeholder="Enter Password" value={values.password_view} className="form-control input" onChange={(e) => handleInputChange('password_view', e.target.value)} />
                            {errors.password_view && <span style={{ color: "red" }}>{errors.password_view}</span>}
                        </div>
                    </div>
                    <button className="btn btn-primary mt-3" onClick={handleUpdateDetails}>Update Details</button>
                </div>
            </div>
        </>
    )
}
export default RegisterUser;
