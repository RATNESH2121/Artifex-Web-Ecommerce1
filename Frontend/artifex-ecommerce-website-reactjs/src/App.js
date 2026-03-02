import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

import { ThemeProvider } from "./App/ThemeContext";
import { AuthProvider } from "./App/AuthContext";

import Home from "./Pages/Home";
import About from "./Pages/About";
import Shop from "./Pages/Shop";
import Contact from "./Pages/Contact";
import Blog from "./Pages/Blog";
import Header from "./Components/Header/Navbar";
import Footer from "./Components/Footer/Footer";
import ProductDetails from "./Pages/ProductDetails";
import NotFound from "./Pages/NotFound";
import ScrollToTop from "./Components/ScrollButton/ScrollToTop";
import Authentication from "./Pages/Authentication";
import ResetPass from "./Components/Authentication/Reset/ResetPass";
import BlogDetails from "./Components/Blog/BlogDetails/BlogDetails";
import TermsConditions from "./Pages/TermsConditions";
import ShoppingCart from "./Components/ShoppingCart/ShoppingCart";
import Popup from "./Components/PopupBanner/Popup";
import Profile from "./Pages/Profile";
import AdminDashboard from "./Pages/AdminDashboard";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Popup />
          <ScrollToTop />
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/loginSignUp" element={<Authentication />} />
            <Route path="/resetPassword" element={<ResetPass />} />
            <Route path="/BlogDetails" element={<BlogDetails />} />
            <Route path="/terms" element={<TermsConditions />} />
            <Route path="/cart" element={<ShoppingCart />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin-panel" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
          <Toaster
            toastOptions={{
              style: {
                background: "var(--bg-surface)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-gold)",
                fontFamily: "'Inter', sans-serif",
              },
            }}
          />
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
