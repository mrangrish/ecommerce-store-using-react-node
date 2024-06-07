import React, { useState } from "react";

function Example() {
    const [isInputsHidden, setIsInputsHidden] = useState(false);

    const handleInputsHide = (event) => {
        event.preventDefault();
        setIsInputsHidden(true);
    };

    return (
        <div className="container mt-5">
            <div>
                <h6>Login/Signup</h6>
                {!isInputsHidden && (
                    <>
                        <label>Email</label>
                        <input type="email" />
                        <button type="submit" onClick={handleInputsHide}>Submit</button>
                    </>
                )}
            </div>
            <h6>Address Details</h6>
            {isInputsHidden && (
                <div>
                    
                    <input type="text" placeholder="Address Line 1" />
                    <input type="text" placeholder="Address Line 2" />
                    <button>Submit</button>
                </div>
            )}
        </div>
    );
}

export default Example;
