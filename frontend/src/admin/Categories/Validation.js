function Validation (values) {
    let error = {}

    if(values.subcategories_name === "") {     
      error.subcategories_name = "subcategories_name should not be empty"  
     }
     else {   
        error.subcategories_name = ""   
      }

      return error;
}

export default Validation;