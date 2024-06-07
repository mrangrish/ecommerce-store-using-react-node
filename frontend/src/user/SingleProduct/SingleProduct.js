import axios from "axios";
import React, { useEffect, useState } from "react";
import Header from "../Header/header";
import './SingleProduct.css';
import { Link, useLocation } from "react-router-dom";
import AOS from "aos";
import 'aos/dist/aos.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SingleProduct({ userId, setUserId }) {

  const [singleProduct, setSingleProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [mainImage, setMainImage] = useState('');

  const getCategoryFromUrl = () => {
    const pathParts = window.location.pathname.split('/');
    return pathParts[pathParts.length - 1];
  };

  const product_id = getCategoryFromUrl();
  useEffect(() => {
    AOS.init();
  }, []);

  useEffect(() => {
    const fetchSingleProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/singleProductRoute/SingleProduct/${product_id}`);
        setSingleProduct(response.data);
        setMainImage(getImageUrls(response.data.product_image)[0]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSingleProduct();
  }, [product_id]);

  useEffect(() => {
    if (singleProduct) {
      const fetchRelatedProducts = async () => {
        try {
          const url = `http://localhost:8081/singleProductRoute/RelatedProduct/${singleProduct[0].category_id}/${product_id}`;
          const response = await axios.get(url);
          setRelatedProducts(response.data);
        } catch (error) {
          console.error('Error fetching related products:', error);
        }
      };
      fetchRelatedProducts();
    }
  }, [singleProduct, product_id]);

  const getImageUrls = (jsonString) => {
    try {
      const images = JSON.parse(jsonString);
      return images.map(image => `http://localhost:8081/images/${image}`);
    } catch (e) {
      console.error('Error parsing image JSON:', e);
      return [];
    }
  };

  const handlePreviewClick = (imageUrl) => {
    setMainImage(imageUrl);
  };

  if (!singleProduct) {
    return <div>Loading...</div>;
  }

  const handleFormSubmit = async (e, productId, product_name, product_price, product_brand, product_image) => {
    e.preventDefault();
    try {
      if (userId) {
        await axios.post("http://localhost:8081/routeaddtocart/cart", { users_id: userId, product_id: productId });
        toast.success('Product add to cart successfully!');
      } else {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
        cartItems.push({ productId, quantity: 1, product_name, product_price, product_brand, product_image, created_at });
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        console.log(cartItems);
        toast.success('Product add to cart successfully!');
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.error('Product is not add to cart!');
    }
  };

  return (
    <>
      <Header userId={userId} setUserId={setUserId} />
      <div className="container my-5">
      <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />

      {singleProduct.map((item) => (
          <div className="row" key={item.id}>
            <div className="col-md-5">
              <div className="main-img">
                <img className="img-fluid" src={mainImage || getImageUrls(item.product_image)[0]} alt="ProductS" data-aos="fade-right" data-aos-duration="3000"/>
                <div className="row my-3 previews">
                  {getImageUrls(item.product_image).map((imageUrl, index) => (
                    <div className="col-md-3" key={index} onClick={() => handlePreviewClick(imageUrl)} >
                      <img className="w-100" src={imageUrl} alt={`Preview ${index}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-md-7" data-aos="fade-left" data-aos-duration="3000">
              <div className="main-description px-2">
                <div className="category text-bold">
                  Category: {item.categories_name}
                </div>
                <div className="product-title my-1">
                  {item.product_name}
                </div>
                <p className="new-price">{item.product_price}</p>
                <div className="price-area my-1">
                  <p className="text-secondary mb-1">{item.product_brand}</p>
                </div>
                <div className="buttons d-flex my-2">
                  <div className="block">
                    <Link to="#" className="shadow btn custom-btn ">Wishlist</Link>
                  </div>
                  <div className="block">
                    <form onSubmit={(e) => handleFormSubmit(e, item.id, item.product_name, item.product_price, item.product_brand, item.product_image)}>
                      <button className="shadow btn custom-btn">Add to cart</button>
                    </form>
                  </div>
                  <div className="block quantity">
                    <input type="number" className="form-control" id="cart_quantity" value="1" min="0" max="5" placeholder="Enter email" name="cart_quantity" />
                  </div>
                </div>
              </div>
              <div className="product-details my-4">
                <p className="details-title text-color mb-1">Product Details</p>
                <p className="description">{item.product_description}</p>
              </div>
              <div className="row questions bg-light p-3">
                <div className="col-md-1 icon">
                  <i className="fa-brands fa-rocketchat questions-icon"></i>
                </div>
                <div className="col-md-11 text">
                  Have a question about our products at E-Store? Feel free to contact our representatives via live chat or email.
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="container similar-products my-4" style={{ width: "81%", margin: "0 auto" }}>
        <hr />
        <p className="display-6 text-center">Similar Products</p>
        <div className="row">
          {relatedProducts.map((item, index) => (
            <div className="col-md-3" key={index}>
              <div className="similar-product" data-aos="fade-up" data-aos-duration="3000">
                {item.product_image && (
                  <img className="w-100" src={getImageUrls(item.product_image)[0]} alt="Preview" />
                )}
                <p className="title">{item.product_name}</p>
                <p className="price">{item.product_price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default SingleProduct;