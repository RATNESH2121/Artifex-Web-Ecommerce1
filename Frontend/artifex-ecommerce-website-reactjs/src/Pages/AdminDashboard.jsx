import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";
import { useAuth } from "../App/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


const BASE_URL = "http://localhost:8000";
const BASE = BASE_URL + "/api";


const getFullImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return BASE_URL + (img.startsWith("/") ? "" : "/") + img;
};



async function apiFetch(url, opts = {}) {
    const isFormData = opts.body instanceof FormData;
    const defaultHeaders = isFormData ? {} : { "Content-Type": "application/json" };
    const fullUrl = url.startsWith("http") ? url : BASE + url;

    const res = await fetch(fullUrl, {
        method: opts.method || "GET",
        headers: { ...defaultHeaders, ...opts.headers },
        credentials: "include",
        ...opts,
    });

    if (res.status === 204) return {};

    let data;
    try {
        data = await res.json();
    } catch (e) {
        data = { detail: "Empty or invalid response from server." };
    }

    if (!res.ok) {
        console.error(`API ERROR [${res.status}] ${fullUrl}:`, data);
        const errMsg = data.error || data.detail || `Server Error ${res.status}`;
        throw new Error(errMsg);
    }
    return data;
}


function buildProductFormData(fields, imageFile) {
    const fd = new FormData();
    Object.entries(fields).forEach(([k, v]) => {
        if (v !== "" && v != null) fd.append(k, v);
    });
    if (imageFile) fd.append("image", imageFile);
    return fd;
}

const fetchProducts = () => apiFetch("/products/");
const createProduct = (fd) => apiFetch("/products/", { method: "POST", body: fd });
const updateProduct = (id, fd) => apiFetch(`/products/${id}/`, { method: "PUT", body: fd });
const deleteProduct = (id) => apiFetch(`/products/${id}/`, { method: "DELETE" });
const fetchUsers = () => apiFetch("/auth/users/");
const fetchAllOrders = () => apiFetch("/orders/");
const deleteOrder = (id) => apiFetch(`/orders/${id}/`, { method: "DELETE" });
const updateOrderStatus = (id, s) => apiFetch(`/orders/${id}/status/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: s }),
});



const STATUS_COLORS = {
    pending: { bg: "rgba(255, 215, 0, 0.15)", color: "#b8860b" },
    shipped: { bg: "rgba(30, 144, 255, 0.15)", color: "#1e90ff" },
    delivered: { bg: "rgba(50, 205, 50, 0.15)", color: "#2e8b57" },
    cancelled: { bg: "rgba(255, 69, 0, 0.15)", color: "#ff4500" },
};


const AdminDashboard = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [tab, setTab] = useState("products");

    const [products, setProducts] = useState([]);
    const [loadingProds, setLoadingProds] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProd, setEditingProd] = useState(null);
    const [form, setForm] = useState({ name: "", description: "", price: "", stock: "", category: "" });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);

    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            navigate("/loginSignUp");
        } else if (user.role !== "admin") {
            navigate("/");
            toast.error("Admin access only!");
        }
    }, [user, authLoading, navigate]);

    useEffect(() => {
        if (authLoading || !user || user.role !== "admin") return;

        fetchProducts()
            .then(setProducts)
            .catch(() => toast.error("Failed to load products"))
            .finally(() => setLoadingProds(false));

        fetchUsers()
            .then(setUsers)
            .catch(() => toast.error("Failed to load users"))
            .finally(() => setLoadingUsers(false));

        fetchAllOrders()
            .then(setOrders)
            .catch(() => toast.error("Failed to load orders"))
            .finally(() => setLoadingOrders(false));
    }, [authLoading, user]);

    if (authLoading) return <div className="adminLoading">Checking access...</div>;
    if (!user || user.role !== "admin") return null;


    const resetForm = () => {
        setEditingProd(null);
        setForm({ name: "", description: "", price: "", stock: "", category: "" });
        setImageFile(null);
        setImagePreview("");
        setShowForm(false);
    };

    const startEdit = (p) => {
        setEditingProd(p);
        setForm({ name: p.name, description: p.description || "", price: p.price, stock: p.stock, category: p.category || "" });
        setImageFile(null);

        setImagePreview(getFullImageUrl(p.image));
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            name: form.name,
            description: form.description,
            price: parseFloat(form.price),
            stock: parseInt(form.stock),
        };
        if (form.category) payload.category_name = form.category;
        const fd = buildProductFormData(payload, imageFile);

        try {
            console.log("Submitting product...", payload);
            if (editingProd) {
                const updated = await updateProduct(editingProd.id, fd);
                setProducts((prev) => prev.map((p) => (p.id === editingProd.id ? updated : p)));
                toast.success("Product updated ✓");
            } else {
                const created = await createProduct(fd);
                console.log("Product created:", created);
                setProducts((prev) => [...prev, created]);
                toast.success("Product created ✓");
            }
            resetForm();
        } catch (err) {
            console.error("Submit failed:", err);
            toast.error(err.message);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
        try {
            console.log(`ACTION: Delete Product ID=${id}, Name="${name}"`);
            await deleteProduct(id);
            setProducts((prev) => prev.filter((p) => p.id !== id));
            toast.success(`Product "${name}" deleted`);
        } catch (err) {
            console.error("DELETE PRODUCT FAILURE:", err);
            toast.error(`Delete failed: ${err.message}`);
        }
    };


    const handleOrderStatus = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
            toast.success(`Order #${orderId} → ${newStatus}`);
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm(`Delete Order #${orderId}? This cannot be undone.`)) return;
        try {
            await deleteOrder(orderId);
            setOrders((prev) => prev.filter((o) => o.id !== orderId));
            toast.success(`Order #${orderId} deleted`);
        } catch (err) {
            toast.error(err.message);
        }
    };

    if (!user || user.role !== "admin") return null;


    const totalRevenue = orders
        .filter((o) => o.status !== "cancelled")
        .reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0);

    return (
        <div className="adminContainer">
            { }
            <aside className="adminSidebar">
                <div className="adminLogo">
                    ARTIFEX<span>Admin Panel</span>
                </div>

                <nav className="adminNav">
                    <button className={tab === "products" ? "active" : ""} onClick={() => setTab("products")}>
                        📦&nbsp; Products
                    </button>
                    <button className={tab === "orders" ? "active" : ""} onClick={() => setTab("orders")}>
                        🧾&nbsp; Orders
                    </button>
                    <button className={tab === "users" ? "active" : ""} onClick={() => setTab("users")}>
                        👥&nbsp; Users
                    </button>
                </nav>

                <Link to="/" className="adminBackLink">← Back to Store</Link>
            </aside>

            { }
            <main className="adminMain">

                { }
                <div className="adminStats">
                    <div className="adminStatCard">
                        <p>Total Products</p>
                        <h2>{products.length}</h2>
                    </div>
                    <div className="adminStatCard">
                        <p>Total Orders</p>
                        <h2>{orders.length}</h2>
                    </div>
                    <div className="adminStatCard">
                        <p>Revenue (non-cancelled)</p>
                        <h2>₹{totalRevenue.toFixed(2)}</h2>
                    </div>
                </div>

                { }
                {tab === "products" && (
                    <section>
                        <div className="adminHeader">
                            <h1>Products</h1>
                            <button className="adminPrimaryBtn" onClick={() => { resetForm(); setShowForm(!showForm); }}>
                                {showForm ? "✕ Cancel" : "+ Add Product"}
                            </button>
                        </div>

                        { }
                        {showForm && (
                            <form className="adminForm" onSubmit={handleSubmit}>
                                <h3>{editingProd ? `Edit: ${editingProd.name}` : "New Product"}</h3>
                                <div className="adminFormGrid">
                                    <input
                                        required placeholder="Product Name" value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    />
                                    <input
                                        required type="number" step="0.01" min="0" placeholder="Price (e.g. 29.99)"
                                        value={form.price}
                                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                                    />
                                    <input
                                        required type="number" min="0" placeholder="Stock Quantity"
                                        value={form.stock}
                                        onChange={(e) => setForm({ ...form, stock: e.target.value })}
                                    />
                                    <input
                                        placeholder="Category Name (e.g. Dresses)" value={form.category}
                                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    />
                                </div>
                                <textarea
                                    rows={3} placeholder="Product description (optional)"
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                />

                                { }
                                <div className="adminImageUpload">
                                    <label htmlFor="productImage" className="adminImageLabel">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="preview" className="adminImagePreview" />
                                        ) : (
                                            <div className="adminImagePlaceholder">
                                                <span>📷</span>
                                                <p>Click to upload product image</p>
                                                <small>JPG, PNG, WEBP — max 5MB</small>
                                            </div>
                                        )}
                                    </label>
                                    <input
                                        id="productImage"
                                        type="file"
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        onChange={handleImageChange}
                                    />
                                    {imagePreview && (
                                        <button
                                            type="button"
                                            className="adminRemoveImageBtn"
                                            onClick={() => { setImageFile(null); setImagePreview(""); }}
                                        >
                                            ✕ Remove image
                                        </button>
                                    )}
                                </div>

                                <div className="adminFormActions">
                                    <button type="submit" className="adminPrimaryBtn">
                                        {editingProd ? "Update Product" : "Create Product"}
                                    </button>
                                    <button type="button" className="adminSecondaryBtn" onClick={resetForm}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}

                        { }
                        {loadingProds ? (
                            <p className="adminLoading">⏳ Loading products…</p>
                        ) : (
                            <table className="adminTable">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Image</th>
                                        <th>Name</th>
                                        <th>Price</th>
                                        <th>Stock</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="adminEmptyState">
                                                No products yet — click "+ Add Product" to get started.
                                            </td>
                                        </tr>
                                    ) : (
                                        products.map((p) => (
                                            <tr key={p.id}>
                                                <td style={{ color: "var(--text-muted)", fontWeight: 500 }}>{p.id}</td>
                                                <td>
                                                    {p.image ? (
                                                        <img
                                                            src={getFullImageUrl(p.image)}
                                                            alt={p.name}
                                                            style={{
                                                                width: 52, height: 52,
                                                                objectFit: "cover",
                                                                borderRadius: 6,
                                                                border: "1px solid var(--border-default)",
                                                            }}
                                                            onError={(e) => { e.target.style.display = "none"; }}
                                                        />
                                                    ) : (
                                                        <div style={{
                                                            width: 52, height: 52, borderRadius: 6,
                                                            background: "var(--bg-surface-2)", border: "1px dashed var(--border-default)",
                                                            display: "flex", alignItems: "center", justifyContent: "center",
                                                            fontSize: 20, color: "var(--text-muted)",
                                                        }}>📷</div>
                                                    )}
                                                </td>
                                                <td style={{ color: "var(--text-primary)", fontWeight: 600 }}>{p.name}</td>
                                                <td style={{ color: "var(--gold)", fontWeight: 600 }}>₹{parseFloat(p.price).toFixed(2)}</td>
                                                <td style={{ color: p.stock === 0 ? "#ff6b3d" : "var(--text-secondary)" }}>{p.stock}</td>
                                                <td>
                                                    <span style={{
                                                        padding: "2px 10px",
                                                        borderRadius: 20,
                                                        fontSize: 11,
                                                        fontWeight: 700,
                                                        background: p.is_active ? "rgba(50,205,50,0.15)" : "rgba(255,69,0,0.15)",
                                                        color: p.is_active ? "#2e8b57" : "#ff4500",
                                                    }}>
                                                        {p.is_active ? "Active" : "Inactive"}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="adminActions">
                                                        <button className="editBtn" onClick={() => startEdit(p)}>Edit</button>
                                                        <button className="deleteBtn" onClick={() => handleDelete(p.id, p.name)}>Delete</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
                    </section>
                )}

                { }
                {tab === "orders" && (
                    <section>
                        <div className="adminHeader">
                            <h1>Orders</h1>
                            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{orders.length} total orders</span>
                        </div>

                        {loadingOrders ? (
                            <p className="adminLoading">⏳ Loading orders…</p>
                        ) : (
                            <table className="adminTable">
                                <thead>
                                    <tr>
                                        <th>Order #</th>
                                        <th>Customer</th>
                                        <th>Items</th>
                                        <th>Total</th>
                                        <th>Shipping Address</th>
                                        <th>Payment</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="adminEmptyState">No orders yet.</td>
                                        </tr>
                                    ) : (
                                        orders.map((o) => {
                                            const sc = STATUS_COLORS[o.status] || { bg: "#333", color: "#aaa" };
                                            return (
                                                <tr key={o.id}>
                                                    <td style={{ color: "var(--gold)", fontWeight: 700 }}>#{o.id}</td>
                                                    <td style={{ color: "var(--text-primary)" }}>{o.username}</td>
                                                    <td style={{ color: "var(--text-secondary)" }}>{(o.items || []).length} item(s)</td>
                                                    <td style={{ color: "#6bcc8a", fontWeight: 600 }}>₹{parseFloat(o.total_price).toFixed(2)}</td>
                                                    <td style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                                                        {o.first_name || o.last_name ? (
                                                            <>
                                                                <strong style={{ color: "var(--text-primary)" }}>
                                                                    {[o.first_name, o.last_name].filter(Boolean).join(" ")}
                                                                </strong><br />
                                                                {o.street && <>{o.street}<br /></>}
                                                                {o.city && <>{o.city}{o.postcode ? ` – ${o.postcode}` : ""}<br /></>}
                                                                {o.country && <>{o.country}<br /></>}
                                                                {o.phone && <span style={{ color: "var(--gold)" }}>📞 {o.phone}</span>}
                                                            </>
                                                        ) : (
                                                            <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>No address provided</span>
                                                        )}
                                                    </td>
                                                    <td style={{ fontSize: 11, color: "var(--text-muted)" }}>{o.payment_method || "—"}</td>
                                                    <td>
                                                        <span
                                                            className="statusBadge"
                                                            style={{ background: (STATUS_COLORS[o.status] || {}).bg || "#333", color: (STATUS_COLORS[o.status] || {}).color || "#aaa" }}
                                                        >
                                                            {o.status}
                                                        </span>
                                                    </td>
                                                    <td style={{ color: "var(--text-muted)" }}>{new Date(o.created_at).toLocaleDateString()}</td>
                                                    <td>
                                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                            <select
                                                                className="statusSelect"
                                                                value={o.status}
                                                                onChange={(e) => handleOrderStatus(o.id, e.target.value)}
                                                            >
                                                                <option value="pending">Pending</option>
                                                                <option value="shipped">Shipped</option>
                                                                <option value="delivered">Delivered</option>
                                                                <option value="cancelled">Cancelled</option>
                                                            </select>
                                                            <button
                                                                className="deleteBtn"
                                                                onClick={() => handleDeleteOrder(o.id)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        )}
                    </section>
                )}

                { }
                {tab === "users" && (
                    <section>
                        <div className="adminHeader">
                            <h1>Users</h1>
                            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{users.length} registered users</span>
                        </div>

                        {loadingUsers ? (
                            <p className="adminLoading">⏳ Loading users…</p>
                        ) : (
                            <table className="adminTable">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Username</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Joined</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="adminEmptyState">No users found.</td>
                                        </tr>
                                    ) : (
                                        users.map((u) => (
                                            <tr key={u.id}>
                                                <td style={{ color: "var(--text-muted)" }}>{u.id}</td>
                                                <td style={{ color: "var(--text-primary)", fontWeight: 600 }}>{u.username}</td>
                                                <td style={{ color: "var(--text-secondary)" }}>{u.email || "—"}</td>
                                                <td>
                                                    <span className={`roleBadge ${u.role}`}>{u.role}</span>
                                                </td>
                                                <td style={{ color: "var(--text-muted)" }}>
                                                    {u.date_joined ? new Date(u.date_joined).toLocaleDateString() : "—"}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
                    </section>
                )}

            </main>
        </div>
    );
};

export default AdminDashboard;
