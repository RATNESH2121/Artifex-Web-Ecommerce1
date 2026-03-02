import React, { useState } from "react";
import "./RelatedProducts.css";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom"; 

import StoreData from "../../../Data/StoreData";

import { FiHeart } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const RelatedProducts = () => {
  const [wishList, setWishList] = useState({});

  const handleWishlistClick = (productID) => {
    setWishList((prevWishlist) => ({
      ...prevWishlist,
      [productID]: !prevWishlist[productID],
    }));
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className="relatedProductSection">
        <div className="relatedProducts">
          <h2>
            RELATED <span>PRODUCTS</span>
          </h2>
        </div>
        <div className="relatedProductSlider">
          <div className="swiper-button image-swiper-button-next">
            <IoIosArrowForward />
          </div>
          <div className="swiper-button image-swiper-button-prev">
            <IoIosArrowBack />
          </div>
          <Swiper
            slidesPerView={4}
            slidesPerGroup={1} 
            spaceBetween={30}
            loop={true}
            navigation={{
              nextEl: ".image-swiper-button-next",
              prevEl: ".image-swiper-button-prev",
            }}
            modules={[Navigation]}
            breakpoints={{
              320: {
                slidesPerView: 2,
                slidesPerGroup: 1,
                spaceBetween: 14,
              },
              768: {
                slidesPerView: 3,
                slidesPerGroup: 1,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 4,
                slidesPerGroup: 1,
                spaceBetween: 30,
              },
            }}
          >
            {StoreData.slice(0, 10).map((product) => {
              const id = product.productID || product.id;
              return (
                <SwiperSlide key={id}>
                  <div className="rpContainer">
                    <Link to={`/product/${id}`} onClick={scrollToTop}>
                      <div className="rpImages">
                        <img
                          src={product.frontImg}
                          alt={product.productName}
                          className="rpFrontImg"
                        />
                        <img
                          src={product.backImg}
                          className="rpBackImg"
                          alt={product.productName}
                        />
                        <h4>View Details</h4>
                      </div>
                    </Link>

                    <div className="relatedProductInfo">
                      <div className="rpCategoryWishlist">
                        <p>{product.category || "Dresses"}</p>
                        <FiHeart
                          onClick={() => handleWishlistClick(id)}
                          style={{
                            color: wishList[id] ? "red" : "#767676",
                            cursor: "pointer",
                          }}
                        />
                      </div>
                      <div className="productNameInfo">
                        <Link to={`/product/${id}`} onClick={scrollToTop}>
                          <h5>{product.productName}</h5>
                        </Link>
                        <p>₹{product.productPrice.toLocaleString("en-IN")}</p>
                        <div className="productRatingReviews">
                          <div className="productRatingStar">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} color="#FEC78A" size={10} />
                            ))}
                          </div>
                          <span>{product.productReviews}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default RelatedProducts;
