function Validation(values) {
    let error = {};

    if (values.name === "") {
        error.name = "Name should not be empty";
    } else {
        error.name = "";
    }

    if (values.password_view === "") {
        error.password_view = "Password Should not be empty";
    } else {
        error.password_view = "";
    }

    if (values.phone === "") {
        error.phone = "Phone Should not be empty";
    } else {
        error.phone = "";
    }
    if(values.Address === "") {
        error.Address = "Address Should not be empty";
    } else {
        error.Address = "";
    }

    if(values.City === "") {
       error.City = "City Should not be empty";
    } else {
        error.City = "";
    }
    if(values.zip_Code === ""){
        error.zip_Code = "Zip code Should not be empty";
    } else {
        error.zip_Code = "";
    }
    return error;
}

export default Validation;