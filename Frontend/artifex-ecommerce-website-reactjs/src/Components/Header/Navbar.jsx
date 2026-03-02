import React, { useState } from "react";
import "./Navbar.css";

import { useStore } from "../../App/StoreContext";
import { useTheme } from "../../App/ThemeContext";
import { useAuth } from "../../App/AuthContext";

import { Link } from "react-router-dom";

import { RiMenu2Line } from "react-icons/ri";
import { FiSearch } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa6";
import { RiShoppingBagLine } from "react-icons/ri";
import { MdOutlineClose } from "react-icons/md";
import { FiHeart } from "react-icons/fi";
import { FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaPinterest } from "react-icons/fa";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";

import Badge from "@mui/material/Badge";

const Navbar = () => {
  const { cart } = useStore();
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();  

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    document.body.style.overflow = mobileMenuOpen ? "auto" : "hidden";
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {}
      <nav className="navBar">
        <div className="logoLinkContainer">
          <div className="logoContainer">
            <Link to="/" onClick={scrollToTop} style={{ textDecoration: "none" }}>
              <h1 className="logoText">ARTIFEX</h1>
            </Link>
          </div>
          <div className="linkContainer">
            <ul>
              <li><Link to="/" onClick={scrollToTop}>HOME</Link></li>
              <li><Link to="/shop" onClick={scrollToTop}>SHOP</Link></li>
              <li><Link to="/blog" onClick={scrollToTop}>BLOG</Link></li>
              <li><Link to="/about" onClick={scrollToTop}>ABOUT</Link></li>
              <li><Link to="/contact" onClick={scrollToTop}>CONTACT</Link></li>
            </ul>
          </div>
        </div>
        <div className="iconContainer">
          <FiSearch size={20} onClick={scrollToTop} style={{ cursor: "pointer" }} />

          {}
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {user.role === "admin" && (
                <Link
                  to="/admin-panel"
                  onClick={scrollToTop}
                  style={{
                    padding: "3px 10px", fontSize: "12px", fontWeight: 600,
                    background: "var(--border-gold)", color: "#000",
                    borderRadius: "4px", textDecoration: "none",
                  }}
                >
                  Admin Panel
                </Link>
              )}
              <Link to="/profile" onClick={scrollToTop} style={{ textDecoration: "none" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                  Hi, {user.username}
                </span>
              </Link>
              <button
                onClick={logout}
                style={{
                  background: "none", border: "1px solid var(--border-gold)",
                  color: "var(--text-primary)", padding: "3px 8px",
                  borderRadius: "4px", cursor: "pointer", fontSize: "12px"
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/loginSignUp" onClick={scrollToTop} title="Login / Register">
              <FaRegUser size={20} />
            </Link>
          )}
          <Link to="/cart" onClick={scrollToTop}>
            <Badge
              badgeContent={cart.items.length === 0 ? "0" : cart.items.length}
              color="primary"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
              <RiShoppingBagLine size={20} />
            </Badge>
          </Link>
          <FiHeart size={20} onClick={scrollToTop} style={{ cursor: "pointer" }} />
          {}
          <button
            className="themeToggleBtn"
            onClick={toggleTheme}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <MdOutlineLightMode size={20} />
            ) : (
              <MdOutlineDarkMode size={20} />
            )}
          </button>
        </div>
      </nav>

      {}
      <nav>
        <div className="mobile-nav">
          {mobileMenuOpen ? (
            <MdOutlineClose size={22} onClick={toggleMobileMenu} />
          ) : (
            <RiMenu2Line size={22} onClick={toggleMobileMenu} />
          )}
          <div className="logoContainer">
            <Link to="/" style={{ textDecoration: "none" }}>
              <h1 className="logoText" style={{ fontSize: "24px" }}>ARTIFEX</h1>
            </Link>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              className="themeToggleBtn"
              onClick={toggleTheme}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <MdOutlineLightMode size={20} /> : <MdOutlineDarkMode size={20} />}
            </button>
            <Link to="/cart">
              <Badge
                badgeContent={cart.items.length === 0 ? "0" : cart.items.length}
                color="primary"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              >
                <RiShoppingBagLine size={22} />
              </Badge>
            </Link>
          </div>
        </div>

        <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
          <div className="mobile-menuTop">
            <div className="mobile-menuSearchBar">
              <div className="mobile-menuSearchBarContainer">
                <input type="text" placeholder="Search products" />
                <Link to="/shop">
                  <FiSearch size={20} onClick={toggleMobileMenu} />
                </Link>
              </div>
            </div>
            <div className="mobile-menuList">
              <ul>
                <li><Link to="/" onClick={toggleMobileMenu}>HOME</Link></li>
                <li><Link to="/shop" onClick={toggleMobileMenu}>SHOP</Link></li>
                <li><Link to="/blog" onClick={toggleMobileMenu}>BLOG</Link></li>
                <li><Link to="/about" onClick={toggleMobileMenu}>ABOUT</Link></li>
                <li><Link to="/contact" onClick={toggleMobileMenu}>CONTACT</Link></li>
              </ul>
            </div>
          </div>

          <div className="mobile-menuFooter">
            <div className="mobile-menuFooterLogin">
              {user ? (
                <>
                  <FaRegUser />
                  <p style={{ fontWeight: 600 }}>Hi, {user.username}</p>
                  <button
                    onClick={() => { logout(); toggleMobileMenu(); }}
                    style={{
                      background: "none", border: "1px solid var(--border-gold)",
                      color: "var(--text-primary)", padding: "4px 10px",
                      borderRadius: "4px", cursor: "pointer", marginLeft: "8px"
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/loginSignUp" onClick={toggleMobileMenu}>
                  <FaRegUser />
                  <p>My Account</p>
                </Link>
              )}
            </div>
            <div className="mobile-menuFooterLangCurrency">
              <div className="mobile-menuFooterLang">
                <p>Language</p>
                <select name="language" id="language">
                  <option value="english">United States | English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Germany">Germany</option>
                  <option value="French">French</option>
                </select>
              </div>
              <div className="mobile-menuFooterCurrency">
                <p>Currency</p>
                <select name="currency" id="currency">
                  <option value="USD">$ USD</option>
                  <option value="INR" selected>₹ INR</option>
                  <option value="EUR">€ EUR</option>
                  <option value="GBP">£ GBP</option>
                </select>
              </div>
            </div>
            <div className="mobile-menuSocial_links">
              <FaFacebookF />
              <FaXTwitter />
              <FaInstagram />
              <FaYoutube />
              <FaPinterest />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
