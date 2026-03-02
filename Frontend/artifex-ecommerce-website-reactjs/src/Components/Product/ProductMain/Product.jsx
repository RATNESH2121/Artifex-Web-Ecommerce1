import React, { useState, useEffect } from "react";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import { useParams, Link } from "react-router-dom";

import { useStore } from "../../../App/StoreContext";
import StoreData from "../../../Data/StoreData";
import { getProducts } from "../../../api";

import { GoChevronLeft } from "react-icons/go";
import { GoChevronRight } from "react-icons/go";
import { FaStar } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import { PiShareNetworkLight } from "react-icons/pi";

import toast from "react-hot-toast";

import "./Product.css";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImg, setCurrentImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [clicked, setClicked] = useState(false);
  const [selectSize, setSelectSize] = useState("S");
  const [highlightedColor, setHighlightedColor] = useState("#C8393D");

  const { cart, addToCart } = useStore();
  const cartItems = cart.items;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const isDB = String(id).startsWith("db_");
      const actualId = isDB ? String(id).replace("db_", "") : String(id);

      if (!isDB) {
        const staticProduct = StoreData.find(p => String(p.productID || p.id) === actualId);
        if (staticProduct) {
          setProduct(staticProduct);
          setLoading(false);
          return;
        }
      }


      try {
        const data = await getProducts();
        let allProducts = [];
        if (Array.isArray(data)) allProducts = data;
        else if (data && data.results) allProducts = data.results;

        const found = allProducts.find(p => String(p.id || p.productID) === actualId);
        if (found) {

          const BASE_URL = "http://localhost:8000";
          const img = found.image || found.frontImg;
          const fullImg = img ? (img.startsWith("http") ? img : BASE_URL + (img.startsWith("/") ? "" : "/") + img) : "";
          setProduct({ ...found, image: fullImg, frontImg: fullImg, isFromDB: true });
        }
      } catch (err) {
        console.error("Failed to fetch product details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return <div className="productLoading">Loading Product Details...</div>;
  }

  if (!product) {
    return (
      <div className="productNotFound">
        <h2>Product Not Found</h2>
        <Link to="/shop">Back to Shop</Link>
      </div>
    );
  }


  const name = product.productName || product.name;
  const price = +(product.productPrice || product.price);
  const frontImg = product.frontImg || product.image;
  const backImg = product.backImg || frontImg;
  const productImg = [frontImg, backImg].filter(Boolean);
  if (productImg.length === 0) {
    productImg.push("https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=480&h=600&fit=crop");
  }

  const prevImg = () => {
    setCurrentImg(currentImg === 0 ? productImg.length - 1 : currentImg - 1);
  };

  const nextImg = () => {
    setCurrentImg(currentImg === productImg.length - 1 ? 0 : currentImg + 1);
  };

  const increment = () => setQuantity(quantity + 1);
  const decrement = () => quantity > 1 && setQuantity(quantity - 1);

  const handleInputChange = (event) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value > 0) setQuantity(value);
  };

  const handleWishClick = () => setClicked(!clicked);

  const sizes = ["XS", "S", "M", "L", "XL"];
  const sizesFullName = ["Extra Small", "Small", "Medium", "Large", "Extra Large"];
  const colors = ["#222222", "#C8393D", "#E4E4E4"];
  const colorsName = ["Black", "Red", "Grey"];

  const handleAddToCart = () => {
    const productDetails = {
      productID: product.isFromDB ? `db_${product.id}` : (product.productID || product.id),
      productName: name,
      productPrice: price,
      frontImg: frontImg,
      productReviews: product.productReviews || "—",
      quantity: quantity
    };

    const productInCart = cartItems.find(
      (item) => item.productID === productDetails.productID
    );

    if (productInCart && productInCart.quantity + quantity > 20) {
      toast.error("Product limit reached (max 20)", { duration: 2000 });
    } else {
      addToCart(productDetails);
      toast.success(`Added ${quantity} to cart!`, {
        duration: 2000,
        style: { backgroundColor: "#07bc0c", color: "white" },
      });
    }
  };

  return (
    <>
      <div className="productSection">
        <div className="productShowCase">
          <div className="productGallery">
            {productImg.length > 1 && (
              <div className="productThumb">
                {productImg.map((img, idx) => (
                  <img key={idx} src={img} onClick={() => setCurrentImg(idx)} alt="" />
                ))}
              </div>
            )}
            <div className="productFullImg">
              <img src={productImg[currentImg]} alt={name} />
              {productImg.length > 1 && (
                <div className="buttonsGroup">
                  <button onClick={prevImg} className="directionBtn">
                    <GoChevronLeft size={18} />
                  </button>
                  <button onClick={nextImg} className="directionBtn">
                    <GoChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="productDetails">
            <div className="productBreadcrumb">
              <div className="breadcrumbLink">
                <Link to="/">Home</Link>&nbsp;/&nbsp;
                <Link to="/shop">The Shop</Link>
              </div>
            </div>
            <div className="productName">
              <h1>{name}</h1>
            </div>
            <div className="productRating">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} color="#FEC78A" size={10} />
              ))}
              <p>{product.productReviews || product.reviews || "—"}</p>
            </div>
            <div className="productPrice">
              <h3>₹{price.toLocaleString("en-IN")}</h3>
            </div>
            <div className="productDescription">
              <p>
                {product.description || "Phasellus sed volutpat orci. Fusce eget lore mauris vehicula elementum gravida nec dui. Aenean aliquam varius ipsum, non ultricies tellus sodales eu. Donec dignissim viverra nunc, ut aliquet magna posuere eget."}
              </p>
            </div>
            <div className="productSizeColor">
              <div className="productSize">
                <p>Sizes</p>
                <div className="sizeBtn">
                  {sizes.map((size, index) => (
                    <Tooltip
                      key={size}
                      title={sizesFullName[index]}
                      placement="top"
                      TransitionComponent={Zoom}
                      enterTouchDelay={0}
                      arrow
                    >
                      <button
                        className={selectSize === size ? "selected" : ""}
                        onClick={() => setSelectSize(size)}
                      >
                        {size}
                      </button>
                    </Tooltip>
                  ))}
                </div>
              </div>
              <div className="productColor">
                <p>Color</p>
                <div className="colorBtn">
                  {colors.map((color, index) => (
                    <Tooltip
                      key={color}
                      title={colorsName[index]}
                      placement="top"
                      enterTouchDelay={0}
                      TransitionComponent={Zoom}
                      arrow
                    >
                      <button
                        className={
                          highlightedColor === color ? "highlighted" : ""
                        }
                        style={{
                          backgroundColor: color.toLowerCase(),
                        }}
                        onClick={() => setHighlightedColor(color)}
                      />
                    </Tooltip>
                  ))}
                </div>
              </div>
            </div>
            <div className="productCartQuantity">
              <div className="productQuantity">
                <button onClick={decrement}>-</button>
                <input
                  type="text"
                  value={quantity}
                  tabIndex="-1"
                  readOnly
                />
                <button onClick={increment}>+</button>
              </div>
              <div className="productCartBtn">
                <button onClick={handleAddToCart}>Add to Cart</button>
              </div>
            </div>
            <div className="productWishShare">
              <div className="productWishList">
                <button onClick={handleWishClick}>
                  <FiHeart color={clicked ? "red" : ""} size={17} />
                  <p>Add to Wishlist</p>
                </button>
              </div>
              <div className="productShare">
                <PiShareNetworkLight size={22} />
                <p>Share</p>
              </div>
            </div>
            <div className="productTags">
              <p>
                <span>SKU: </span>{product.sku || "N/A"}
              </p>
              <p>
                <span>CATEGORIES: </span>{product.category_name || product.category?.name || product.category || "General"}
              </p>
              <p>
                <span>TAGS: </span>{product.tags || "fashion, style, artifex"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
