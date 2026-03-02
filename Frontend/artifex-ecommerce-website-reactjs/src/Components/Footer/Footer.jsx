import React from "react";
import "./Footer.css";

import paymentIcon from "../../Assets/paymentIcon.png";
import { FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaPinterest } from "react-icons/fa";

import { Link } from "react-router-dom";

const Footer = () => {
  const handleSubscribe = (e) => {
    e.preventDefault();
    alert("Subscribed Successfully!");
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const year = new Date().getFullYear();

  return (
    <footer className="footerMain">
      <div className="footerGrid">
        {}
        <div className="footerBrand">
          <Link to="/" onClick={scrollToTop} className="footerLogoText">ARTIFEX</Link>
          <address className="footerBrandAddress">
            Lovely Professional University,<br />
            G.T. Road, Phagwara, Punjab 144411<br />
            India<br /><br />
            <strong>sale@artifex.lpu.in</strong><br />
            <strong>+91 1824 404404</strong>
          </address>
          <div className="footerSocialLinks">
            <a href="#!"><FaFacebookF size={13} /></a>
            <a href="#!"><FaXTwitter size={13} /></a>
            <a href="#!"><FaInstagram size={13} /></a>
            <a href="#!"><FaYoutube size={13} /></a>
            <a href="#!"><FaPinterest size={13} /></a>
          </div>
        </div>

        {}
        <nav className="footerColumn">
          <h5>Company</h5>
          <ul onClick={scrollToTop}>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/about">Careers</Link></li>
            <li><Link to="*">Affiliates</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </nav>

        {}
        <nav className="footerColumn">
          <h5>Shop</h5>
          <ul onClick={scrollToTop}>
            <li><Link to="/shop">New Arrivals</Link></li>
            <li><Link to="/shop">Accessories</Link></li>
            <li><Link to="/shop">Men</Link></li>
            <li><Link to="/shop">Women</Link></li>
            <li><Link to="/shop">Shop All</Link></li>
          </ul>
        </nav>

        {}
        <div className="footerSubscribe">
          <h5>Newsletter</h5>
          <p>Be the first to get the latest news about trends, promotions, and much more!</p>
          <form className="footerSubscribeForm" onSubmit={handleSubscribe}>
            <input type="email" placeholder="Your email address" required />
            <button type="submit">Join</button>
          </form>
          <div className="footerPayments">
            <img src={paymentIcon} alt="Secure Payment Methods" />
          </div>
        </div>
      </div>

      {}
      <div className="footerBottom">
        <p>© {year} Artifex. All Rights Reserved. Crafted with passion for fashion excellence.</p>
        <div className="footerLangCurrency">
          <div className="footerLang">
            <p>Language</p>
            <select name="language" id="language">
              <option value="english">United States | English</option>
              <option value="Hindi" selected>India | Hindi</option>
              <option value="Germany">Germany | Deutsch</option>
              <option value="French">France | Français</option>
            </select>
          </div>
          <div className="footerCurrency">
            <p>Currency</p>
            <select name="currency" id="currency">
              <option value="USD">$ USD</option>
              <option value="INR" selected>₹ INR</option>
              <option value="EUR">€ EUR</option>
              <option value="GBP">£ GBP</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
