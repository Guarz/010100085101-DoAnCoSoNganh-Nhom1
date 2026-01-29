import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { useState } from "react";

import Login from "./pages/Login";
import HomePage from "./pages/HomePage";

// ADMIN
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ProductManagement from "./pages/Admin/ProductManagement";
import AdminOrders from "./pages/Admin/AdminOrders";

function App() {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <Router>
      <div style={{ minHeight: "100vh", background: "#fff0f5" }}>
        {/* ===== NAVBAR USER ===== */}
        <nav style={navStyle}>
          <div style={navInnerStyle}>
            <Link to="/" style={logoStyle}>SHOP QUẦN ÁO A</Link>

            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
              <Link to="/" style={linkStyle}>Trang chủ</Link>

              {user?.role === "admin" && (
                <Link to="/admin" style={linkStyle}>Admin</Link>
              )}

              {user ? (
                <>
                  <span>Chào, {user.name}</span>
                  <button onClick={logout} style={btnLogoutStyle}>Thoát</button>
                </>
              ) : (
                <Link to="/login" style={btnLoginStyle}>Đăng nhập</Link>
              )}
            </div>
          </div>
        </nav>

        {/* ===== ROUTES ===== */}
        <Routes>
          {/* USER */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login setUser={setUser} />} />

          {/* ADMIN (BẮT BUỘC QUA AdminLayout) */}
          <Route
            path="/admin"
            element={
              user?.role === "admin"
                ? <AdminLayout />
                : <Navigate to="/login" />
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;

/* ================== STYLE ================== */
const navStyle = {
  background: "#fff",
  padding: 15,
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
};

const navInnerStyle = {
  maxWidth: 1200,
  margin: "0 auto",
  display: "flex",
  justifyContent: "space-between",
};

const logoStyle = {
  fontSize: 24,
  fontWeight: "bold",
  color: "#d63384",
  textDecoration: "none",
};

const linkStyle = {
  textDecoration: "none",
  fontWeight: "bold",
  color: "#333",
};

const btnLoginStyle = {
  background: "#d63384",
  color: "#fff",
  padding: "8px 15px",
  borderRadius: 20,
  textDecoration: "none",
};

const btnLogoutStyle = {
  border: "1px solid #dc3545",
  color: "#dc3545",
  background: "none",
  padding: "6px 10px",
  cursor: "pointer",
};
