import React from "react";
import "./Banner.css";

import { Link } from "react-router-dom";

const Banner = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className="banner">
        <div className="bannerLeft">
          <h6 className="bannerh6">Starting At ₹1,599</h6>
          <h3 className="bannerh3">Women's T-shirts</h3>
          <h5 className="bannerh5">
            <Link to="/shop" onClick={scrollToTop}>
              Shop Now
            </Link>
          </h5>
        </div>
        <div className="bannerRight">
          <h6 className="bannerh6">
            Starting At ₹3,299
          </h6>
          <h3 className="bannerh3">
            Men's Sportswear
          </h3>
          <h5 className="bannerh5">
            <Link to="/shop" onClick={scrollToTop}>
              Shop Now
            </Link>
          </h5>
        </div>
      </div>
    </>
  );
};

export default Banner;
