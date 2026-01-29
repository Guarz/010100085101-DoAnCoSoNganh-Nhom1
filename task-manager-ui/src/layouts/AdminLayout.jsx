import { Link, Outlet, useNavigate } from "react-router-dom";

function AdminLayout() {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div style={wrapper}>
            {/* SIDEBAR */}
            <aside style={sidebar}>
                <h2 style={logo}>ADMIN</h2>

                <nav style={menu}>
                    <Link to="/admin/dashboard" style={menuItem}>📊 Dashboard</Link>
                    <Link to="/admin/products" style={menuItem}>👕 Sản phẩm</Link>
                    <Link to="/admin/orders" style={menuItem}>📦 Đơn hàng</Link>
                </nav>

                <button onClick={logout} style={logoutBtn}>Đăng xuất</button>
            </aside>

            {/* CONTENT */}
            <main style={content}>
                <Outlet />
            </main>
        </div>
    );
}

/* ===== STYLE ===== */
const wrapper = {
    display: "flex",
    minHeight: "100vh",
    background: "#f4f6f9"
};

const sidebar = {
    width: 220,
    background: "#111",
    color: "#fff",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
};

const logo = {
    textAlign: "center",
    marginBottom: 30
};

const menu = {
    display: "flex",
    flexDirection: "column",
    gap: 15
};

const menuItem = {
    color: "#fff",
    textDecoration: "none",
    padding: "10px 15px",
    borderRadius: 6,
    background: "#222"
};

const logoutBtn = {
    padding: 10,
    background: "#dc3545",
    border: "none",
    color: "#fff",
    borderRadius: 6,
    cursor: "pointer"
};

const content = {
    flex: 1,
    padding: 30
};

export default AdminLayout;
