function Validation(values) {

  let error = {}

  if(values.product_name === "") {     
    error.product_name = "product_name should not be empty"  
   }
   else {   
      error.product_name = ""   
    }
  
  if(values.product_description === "") {        
    error.product_description = "Name should not be empty"  
  }
  else {     
   error.product_description = ""  
  }

  if(values.product_stock === "") {     
    error.product_stock = "product_stock should not be empty"  
  } 
  else {   
    error.product_stock = ""
  }
  
  if(values.product_price === "") {     
    error.product_price = "product_price should not be empty"  
  }   
  else {   
   error.product_price = ""
  }    
  
  if(values.product_brand === "") {     
    error.product_brand = "product_brand should not be empty"  
    }    
     else {   
       error.product_brand = ""
      }  
      
  if(values.product_images === "") {     
    error.product_images = "product_image should not be empty"  
   }     
   else {   
    error.product_image = ""
  }    
  
  if(values.category_id === "") {     
   error.category_id = "category_id should not be empty"  
   }    
    else {   
    error.category_id = ""
   }    
             
   if(values.subcategory_id === "") {     
     error.subcategory_id = "subcategory_id should not be empty"  
    }
         else {   
     error.subcategory_id = ""
   }    

   if(values.color_id === "") {     
       error.color_id = "color should not be empty"  
    } 
    else {   
      error.color_id = ""
    }    
    if (values.Product_offerPrice) {  
    error.Product_offerPrice = ""
  }
     
    return error;
}
                           
export default Validation;
