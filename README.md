# 🛍️ Artifex — Full Stack E-Commerce Platform

A modern, full-stack e-commerce web application built with **React.js** on the frontend and **Django REST Framework** on the backend. Artifex provides a seamless shopping experience with features like user authentication, product management, order tracking, and a dedicated admin dashboard.

---

## 📸 Project Overview

Artifex is a feature-rich e-commerce platform that allows users to browse products, manage their shopping cart, place orders, and track their order history — all within a clean and responsive interface. Administrators can manage products, users, and orders through a custom-built admin dashboard.

---

## 🚀 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React.js 18 | Core UI Framework |
| React Router DOM v6 | Client-side Routing |
| Redux Toolkit | Global State Management |
| Material UI (MUI) | UI Components |
| Swiper.js | Carousels & Sliders |
| React Hot Toast | Notifications |
| React Icons | Icon Library |
| Three.js / R3F | 3D Elements |
| Axios | HTTP Client |

### Backend
| Technology | Purpose |
|---|---|
| Django 4+ | Core Backend Framework |
| Django REST Framework | REST API |
| django-cors-headers | CORS Management |
| SQLite3 | Database (Development) |

---

## ✨ Features

### 👤 User
- Register and log in with session-based authentication
- Browse products by categories
- View detailed product pages
- Add to cart and manage cart items
- Place orders with shipping address
- View personal order history
- Edit profile details

### 🛠️ Admin
- Full Admin Dashboard (custom-built, not Django default)
- Add, edit, and delete products with images
- View and manage all customer orders
- Manage registered users
- View order details including shipping address

---

## 📁 Project Structure

```
Artifex-Web-Ecommerce1/
│
├── Backend/
│   └── Artifex/
│       ├── Artifex/          # Django project settings & URLs
│       ├── accounts/         # User auth, registration, login, profile
│       ├── products/         # Product models, views, serializers
│       ├── orders/           # Order placement & management
│       ├── media/            # Uploaded product images
│       └── manage.py
│
├── Frontend/
│   └── artifex-ecommerce-website-reactjs/
│       ├── public/
│       └── src/
│           ├── App/          # StoreContext (global state)
│           ├── Components/   # Reusable UI components
│           │   ├── Home/     # Hero, Featured, Instagram, etc.
│           │   ├── Cart/     # Cart sidebar & items
│           │   ├── Navbar/   # Navigation bar
│           │   └── ...
│           ├── Pages/        # Route-level pages
│           │   ├── Home.jsx
│           │   ├── Shop.jsx
│           │   ├── ProductDetails.jsx
│           │   ├── AdminDashboard.jsx
│           │   ├── Profile.jsx
│           │   ├── Authentication.jsx
│           │   └── ...
│           ├── Features/     # Redux slices
│           ├── api.js        # Centralized Axios API config
│           └── index.js
│
├── .gitignore
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or yarn

---

### 🔧 Backend Setup

```bash
# Navigate to the backend directory
cd Backend/Artifex

# Create and activate a virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install django djangorestframework django-cors-headers pillow

# Apply database migrations
python manage.py migrate

# Create a superuser (for admin access)
python manage.py createsuperuser

# Start the Django development server
python manage.py runserver
```
The backend API will be running at: **http://localhost:8000/**

---

### 💻 Frontend Setup

```bash
# Navigate to the frontend directory
cd Frontend/artifex-ecommerce-website-reactjs

# Install dependencies
npm install

# Start the React development server
npm start
```
The frontend will be running at: **http://localhost:3000/**

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/accounts/register/` | User Registration |
| `POST` | `/api/accounts/login/` | User Login |
| `POST` | `/api/accounts/logout/` | User Logout |
| `GET` | `/api/accounts/profile/` | Get User Profile |
| `GET` | `/api/products/` | List All Products |
| `GET` | `/api/products/<id>/` | Product Detail |
| `POST` | `/api/products/` | Add Product (Admin) |
| `PUT` | `/api/products/<id>/` | Update Product (Admin) |
| `DELETE` | `/api/products/<id>/` | Delete Product (Admin) |
| `GET` | `/api/orders/` | List Orders |
| `POST` | `/api/orders/place/` | Place an Order |

---

## 🌍 Environment & Configuration

The Django backend is pre-configured for local development:
- **CORS** is enabled for `http://localhost:3000`
- **Database**: SQLite3 (can be replaced with PostgreSQL for production)
- **Media files** are stored in `Backend/Artifex/media/`

> ⚠️ **Important:** Before deploying to production, make sure to:
> - Set `DEBUG = False` in `settings.py`
> - Use a strong, secret `SECRET_KEY` stored in environment variables
> - Switch to a production-grade database (e.g., PostgreSQL)
> - Configure proper `ALLOWED_HOSTS`

---

## 👤 Author

**Ratnesh** — [GitHub Profile](https://github.com/RATNESH2121)

---

## 📄 License

This project is open-source and available for personal and educational use.
