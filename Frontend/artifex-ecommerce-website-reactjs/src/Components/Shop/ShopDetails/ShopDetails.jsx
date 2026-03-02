import React, { useState, useEffect, useMemo } from "react";
import "./ShopDetails.css";

import { useStore } from "../../../App/StoreContext";

import Filter from "../Filters/Filter";
import { Link } from "react-router-dom";
import StoreData from "../../../Data/StoreData";
import { getProducts } from "../../../api";
import { FiHeart } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { IoFilterSharp, IoClose } from "react-icons/io5";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import { FaCartPlus } from "react-icons/fa";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 12;
const BASE_URL = "http://localhost:8000";

// Resolve any image path to a full URL (handles http, /media, relative, and imported assets)
const getFullImageUrl = (img) => {
  if (!img) return "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=480&h=600&fit=crop";
  if (typeof img !== "string") return img; // imported static asset (already a blob/object-url)
  if (img.startsWith("http")) return img;
  return BASE_URL + (img.startsWith("/") ? "" : "/") + img;
};


const BADGE_STYLE = {
  Bestseller: { bg: "#d4af37", color: "#000" },
  New: { bg: "#2563eb", color: "#fff" },
  Trending: { bg: "#e11d48", color: "#fff" },
  Premium: { bg: "#7c3aed", color: "#fff" },
  Limited: { bg: "#065f46", color: "#fff" },
};

const ShopDetails = () => {
  const { cart, addToCart } = useStore();
  const cartItems = cart.items;

  const [wishList, setWishList] = useState({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("default");
  const [activeCategory, setActiveCategory] = useState("All");


  useEffect(() => {

    setProducts(StoreData);
    setLoading(false);


    getProducts()
      .then((data) => {
        let dbList = [];
        if (data && Array.isArray(data)) {
          dbList = data;
        } else if (data && data.results && Array.isArray(data.results)) {
          dbList = data.results;
        }

        if (dbList.length > 0) {
          const marked = dbList.map(p => ({ ...p, isFromDB: true }));
          setProducts([...marked, ...StoreData]);
        }
      })
      .catch((err) => {
        console.warn("Backend fetch failed, using static data only.", err);
      });
  }, []);


  const categories = useMemo(() => {
    const cats = new Set(["All"]);
    products.forEach((p) => {
      const cat = p.category_name || p.category?.name || p.category || null;
      if (cat) cats.add(cat);
    });
    return [...cats];
  }, [products]);


  const filtered = useMemo(() => {
    let list = activeCategory === "All"
      ? [...products]
      : products.filter((p) => {
        const cat = p.category_name || p.category?.name || p.category || "";
        return cat === activeCategory;
      });

    switch (sortBy) {
      case "lowToHigh":
        list.sort((a, b) => (+(a.price || a.productPrice) - +(b.price || b.productPrice)));
        break;
      case "highToLow":
        list.sort((a, b) => (+(b.price || b.productPrice) - +(a.price || a.productPrice)));
        break;
      case "a-z":
        list.sort((a, b) => (a.name || a.productName).localeCompare(b.name || b.productName));
        break;
      case "z-a":
        list.sort((a, b) => (b.name || b.productName).localeCompare(a.name || a.productName));
        break;
      default:
        break;
    }
    return list;
  }, [products, activeCategory, sortBy]);


  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToPage = (n) => {
    setCurrentPage(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  useEffect(() => { setCurrentPage(1); }, [activeCategory, sortBy]);

  const handleWishlistClick = (id) =>
    setWishList((prev) => ({ ...prev, [id]: !prev[id] }));

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const toggleDrawer = () => setIsDrawerOpen((v) => !v);
  const closeDrawer = () => setIsDrawerOpen(false);

  const handleAddToCart = (product) => {
    const id = product.isFromDB ? `db_${product.id}` : (product.productID || product.id);
    const inCart = cartItems.find((item) => item.productID === id);
    if (inCart && inCart.quantity >= 20) {
      toast.error("Product limit reached", { duration: 2000 });
      return;
    }

    const payload = {
      productID: id,
      productName: product.productName || product.name,
      productPrice: +(product.productPrice || product.price),
      frontImg: product.frontImg || product.image || "",
      productReviews: product.productReviews || "—",
      isFromDB: !!product.isFromDB,
    };
    addToCart(payload);
    toast.success("Added to cart!", {
      duration: 2000,
      style: { backgroundColor: "#07bc0c", color: "#fff" },
      iconTheme: { primary: "#fff", secondary: "#07bc0c" },
    });
  };

  return (
    <>
      <div className="shopDetails">
        <div className="shopDetailMain">

          { }

          { }
          <div className="shopDetails__right">

            { }
            <div className="shopDetailsSorting">
              <div className="shopDetailsBreadcrumbLink">
                <Link to="/" onClick={scrollToTop}>Home</Link>
                &nbsp;/&nbsp;
                <Link to="/shop">The Shop</Link>
              </div>
              { }
              <div className="shopDetailsSort">
                <select
                  name="sort" id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="default">Default Sorting</option>
                  <option value="a-z">Alphabetically, A-Z</option>
                  <option value="z-a">Alphabetically, Z-A</option>
                  <option value="lowToHigh">Price, Low to High</option>
                  <option value="highToLow">Price, High to Low</option>
                </select>
                { }
              </div>
            </div>

            { }
            <div className="sdCategoryPills">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`sdCategoryPill${activeCategory === cat ? " active" : ""}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            { }
            <p className="sdProductCount">
              {loadingProducts
                ? "Loading…"
                : `Showing ${Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filtered.length)}–${Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of ${filtered.length} products`}
            </p>

            { }
            <div className="shopDetailsProducts">
              <div className="shopDetailsProductsContainer">
                {loadingProducts && (
                  <div className="sdLoadingGrid">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="sdSkeletonCard">
                        <div className="sdSkeletonImg" />
                        <div className="sdSkeletonLine sdSkelLong" />
                        <div className="sdSkeletonLine sdSkelShort" />
                      </div>
                    ))}
                  </div>
                )}

                {!loadingProducts && filtered.length === 0 && (
                  <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--text-muted)" }}>
                    <p style={{ fontSize: 18 }}>No products found in this category.</p>
                  </div>
                )}

                {!loadingProducts && paginated.map((product) => {
                  const id = product.isFromDB ? `db_${product.id}` : (product.productID || product.id);
                  const name = product.name || product.productName;
                  const price = +(product.price || product.productPrice);
                  const frontImg = product.image || product.frontImg;
                  const backImg = product.backImg || frontImg;
                  const badge = product.badge || null;
                  const reviews = product.productReviews || product.reviews || "—";

                  return (
                    <div className="sdProductContainer" key={id}>
                      { }
                      {badge && (
                        <span
                          className="sdBadge"
                          style={BADGE_STYLE[badge] || { bg: "#333", color: "#fff" }}
                        >
                          {badge}
                        </span>
                      )}

                      <div className="sdProductImages">
                        <Link to={`/product/${id}`} onClick={scrollToTop}>
                          <img
                            src={getFullImageUrl(frontImg)}
                            alt={name}
                            className="sdProduct_front"
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=480&h=600&fit=crop";
                            }}
                          />
                          <img
                            src={getFullImageUrl(backImg)}
                            alt={name}
                            className="sdProduct_back"
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=480&h=600&fit=crop";
                            }}
                          />
                        </Link>

                        { }
                        <h4 onClick={() => handleAddToCart(product)}>
                          Add to Cart
                        </h4>
                      </div>

                      { }
                      <div
                        className="sdProductImagesCart"
                        onClick={() => handleAddToCart(product)}
                      >
                        <FaCartPlus />
                      </div>

                      <div className="sdProductInfo">
                        <div className="sdProductCategoryWishlist">
                          <p>{product.category_name || product.category?.name || product.category || "General"}</p>
                          <FiHeart
                            onClick={() => handleWishlistClick(id)}
                            style={{
                              color: wishList[id] ? "red" : "var(--text-muted)",
                              cursor: "pointer",
                              transition: "color 0.2s",
                            }}
                          />
                        </div>
                        <div className="sdProductNameInfo">
                          <Link to={`/product/${id}`} onClick={scrollToTop}>
                            <h5>{name}</h5>
                          </Link>
                          <p style={{ fontWeight: 600, color: "var(--gold)", fontSize: 15 }}>
                            ₹{price.toLocaleString("en-IN")}
                          </p>
                          <div className="sdProductRatingReviews">
                            <div className="sdProductRatingStar">
                              {[...Array(5)].map((_, i) => (
                                <FaStar key={i} color="#FEC78A" size={10} />
                              ))}
                            </div>
                            <span>{reviews}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            { }
            {!loadingProducts && totalPages > 1 && (
              <div className="shopDetailsPagination">
                <div
                  className="sdPaginationPrev"
                  style={{ opacity: currentPage === 1 ? 0.35 : 1, pointerEvents: currentPage === 1 ? "none" : "auto" }}
                >
                  <p onClick={() => goToPage(currentPage - 1)}>
                    <FaAngleLeft /> Prev
                  </p>
                </div>

                <div className="sdPaginationNumber">
                  <div className="paginationNum">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <p
                        key={i + 1}
                        className={currentPage === i + 1 ? "activePage" : ""}
                        onClick={() => goToPage(i + 1)}
                      >
                        {i + 1}
                      </p>
                    ))}
                  </div>
                </div>

                <div
                  className="sdPaginationNext"
                  style={{ opacity: currentPage === totalPages ? 0.35 : 1, pointerEvents: currentPage === totalPages ? "none" : "auto" }}
                >
                  <p onClick={() => goToPage(currentPage + 1)}>
                    Next <FaAngleRight />
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      { }
      <div className={`filterDrawer ${isDrawerOpen ? "open" : ""}`}>
        <div className="drawerHeader">
          <p>Filter By</p>
          <IoClose onClick={closeDrawer} className="closeButton" size={26} />
        </div>
        <div className="drawerContent">
          <Filter />
        </div>
      </div>
    </>
  );
};

export default ShopDetails;
