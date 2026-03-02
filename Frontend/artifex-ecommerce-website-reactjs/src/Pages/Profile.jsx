import React, { useState, useEffect } from "react";
import "./Profile.css";
import { useAuth } from "../App/AuthContext";
import { getMyOrders } from "../api";
import { Link } from "react-router-dom";
import { FaBoxOpen, FaUserCircle, FaHistory } from "react-icons/fa";

const Profile = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            getMyOrders()
                .then((data) => {
                    setOrders(data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Failed to fetch orders:", err);
                    setLoading(false);
                });
        }
    }, [user]);

    if (!user) {
        return (
            <div className="profileContainer">
                <div className="profileError">
                    <h2>Please login to view your profile</h2>
                    <Link to="/loginSignUp" className="loginBtn">Login / Register</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="profileContainer">
            <div className="profileHeader">
                <FaUserCircle className="userIcon" />
                <div className="userInfo">
                    <h1>{user.username}</h1>
                    <p>{user.email}</p>
                    <span className="userRole">{user.role}</span>
                </div>
            </div>

            <div className="orderHistorySection">
                <div className="sectionTitle">
                    <FaHistory />
                    <h2>Order History</h2>
                </div>

                {loading ? (
                    <p className="loadingText">Loading your orders...</p>
                ) : orders.length === 0 ? (
                    <div className="noOrders">
                        <FaBoxOpen size={50} />
                        <p>You haven't placed any orders yet.</p>
                        <Link to="/shop" className="shopNowBtn">Shop Now</Link>
                    </div>
                ) : (
                    <div className="orderList">
                        {orders.map((order) => (
                            <div key={order.id} className="orderCard">
                                <div className="orderCardHeader">
                                    <div className="orderId">
                                        <h3>Order #{order.id}</h3>
                                        <span>{new Date(order.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className={`orderStatus ${order.status}`}>
                                        {order.status}
                                    </div>
                                </div>

                                <div className="orderItems">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="orderItem">
                                            <span>{item.product_name}</span>
                                            <span>x{item.quantity}</span>
                                            <span>₹{item.price}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="orderFooter">
                                    <p>Total: <strong>₹{order.total_price}</strong></p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
