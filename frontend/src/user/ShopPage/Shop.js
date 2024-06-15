import React, { useEffect, useState } from "react";
import Header from "../Header/header";
import "../Product/filter.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { IoHeartOutline, IoCart } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Shop({ userId, setUserId }) {
  console.log(userId);
  const [shopCategories, setShopCategories] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState({});

  useEffect(() => {
    const fetchShopCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/userShop/Getshop/categories"
        );
        setShopCategories(response.data);

        response.data.forEach(async (category) => {
          try {
            const productsResponse = await axios.get(
              `http://localhost:8081/userShop/GetProduct/${category.id}`
            );
            setCategoryProducts((prevState) => ({
              ...prevState,
              [category.id]: productsResponse.data,
            }));
          } catch (error) {
            console.log(error);
          }
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchShopCategories();
  }, []);

  const getImageUrl = (jsonString) => {
    try {
      const images = JSON.parse(jsonString);
      return `http://localhost:8081/images/${images[0]}`;
    } catch (e) {
      console.error("Error parsing image JSON:", e);
      return "";
    }
  };

  const handleFormSubmit = async (
    e,
    productId,
    product_name,
    product_price,
    product_brand,
    product_image,
    product_offerPrice
  ) => {
    e.preventDefault();
    try {
      if (userId) {
        await axios.post(
          "http://localhost:8081/routeaddtocart/cart",
          { users_id: userId, product_id: productId },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Product added to cart successfully!");
      } else {
        const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        const created_at = new Date().toISOString().slice(0, 19).replace("T", " ");
        cartItems.push({
          productId,
          quantity: 1,
          product_name,
          product_price,
          product_brand,
          product_image,
          product_offerPrice,
          created_at,
        });
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        toast.success("Product added to cart successfully!");
      }
    } catch (error) {
      toast.error("Failed to add product to cart!");
    }
  };

  const calculateDiscountPercentage = (originalPrice, offerPrice) => {
    const discountPercentage =
      ((originalPrice - offerPrice) / originalPrice) * 100;
    return Math.round(discountPercentage);
  };

  return (
    <>
      <Header userId={userId} setUserId={setUserId} />
      <div className="container mt-5">
        <h4 className="text-center">Shop</h4>
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
          toastStyle={{
            position: "relative",
            top: "0px",
            right: "0px",
            zIndex: 9999,
          }}
        />
        <hr />
        <div className="mt-4">
          {shopCategories.map((category) => (
            <div key={category.id}>
              <h5 className="mb-4 mt-4">{category.categories_name}</h5>
              <div className="row">
                {categoryProducts[category.id]?.map((product) => (
                  <div
                    key={product.id}
                    className="col-md-3 col-sm-6"
                    style={{ marginBottom: "20px" }}
                  >
                    <div className="product-grid">
                      <div className="product-image">
                        <Link
                          to={`/SingleProduct/${product.id}`}
                          className="image"
                        >
                          <div
                            className="card-image-grid"
                            style={{
                              width: "100%",
                              height: "250px",
                              overflow: "hidden",
                            }}
                          >
                            <img
                              className="pic-1"
                              src={getImageUrl(product.product_image)}
                              alt={product.product_name}
                            />
                            <img
                              className="pic-2"
                              src={getImageUrl(product.product_image)}
                              alt={product.product_name}
                            />
                          </div>
                        </Link>
                        {product.product_offerPrice && (
                          <div className="discount-badge">
                            {calculateDiscountPercentage(
                              product.product_price,
                              product.product_offerPrice
                            )}
                            % OFF
                          </div>
                        )}
                        <ul className="product-links">
                          <li>
                            <button>
                              <IoHeartOutline />
                            </button>
                          </li>
                          <form
                            onSubmit={(e) =>
                              handleFormSubmit(
                                e,
                                product.id,
                                product.product_name,
                                product.product_price,
                                product.product_brand,
                                product.product_image,
                                product.product_offerPrice
                              )
                            }
                          >
                            <li>
                              <button type="submit">
                                <IoCart />
                              </button>
                            </li>
                          </form>
                        </ul>
                      </div>
                      <div className="product-content">
                        <Link
                          to={`/SingleProduct/${product.id}`}
                          className="image"
                          style={{
                            textDecoration: "none",
                            color: "black",
                          }}
                        >
                          <h3 className="title">{product.product_name}</h3>
                          {product.product_offerPrice ? (
                            <div className="price">
                              ₹{product.product_offerPrice}{" "}
                              <strike
                                style={{
                                  color: "black",
                                  fontSize: "smaller",
                                }}
                              >
                                ₹{product.product_price}
                              </strike>
                            </div>
                          ) : (
                            <div className="price">
                              ₹{product.product_price}
                            </div>
                          )}
                        </Link>
                      </div>
                    </div>
                  </div>
                )) || <p>Loading products...</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Shop;
