
const BASE_URL = "http://localhost:8000/api";


// Core fetch helper — handles 204 No Content correctly
async function apiFetch(endpoint, options = {}) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        credentials: "include",
        ...options,
    });

    // 204 No Content — nothing to parse, just return success
    if (response.status === 204) {
        return {};
    }

    let data;
    try {
        data = await response.json();
    } catch (e) {
        // Non-JSON response (shouldn't happen in this API)
        data = {};
    }

    if (!response.ok) {
        throw new Error(data.error || data.detail || JSON.stringify(data) || "Something went wrong");
    }

    return data;
}


// ─── Auth ────────────────────────────────────────────────────────────────────

export function registerUser(username, email, password) {
    return apiFetch("/auth/register/", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
    });
}

export function loginUser(username, password) {
    return apiFetch("/auth/login/", {
        method: "POST",
        body: JSON.stringify({ username, password }),
    });
}

export function logoutUser() {
    return apiFetch("/auth/logout/", { method: "POST" });
}

export function getProfile() {
    return apiFetch("/auth/profile/");
}

export function updateProfile(data) {
    return apiFetch("/auth/profile/update/", {
        method: "PUT",
        body: JSON.stringify(data),
    });
}


// ─── Products ─────────────────────────────────────────────────────────────────

export function getProducts() {
    return apiFetch("/products/");
}

export function getProductById(id) {
    return apiFetch(`/products/${id}/`);
}

export function getCategories() {
    return apiFetch("/products/categories/");
}


// ─── Orders ───────────────────────────────────────────────────────────────────

export function placeOrder(items, address = {}) {
    return apiFetch("/orders/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, address }),
    });
}

export function getMyOrders() {
    return apiFetch("/orders/mine/");
}
