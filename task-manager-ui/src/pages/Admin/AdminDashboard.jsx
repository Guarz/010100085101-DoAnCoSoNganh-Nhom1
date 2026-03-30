import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";

import "../../style/dashboard.css";

function AdminDashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [data, setData] = useState({
        total_products: 0,
        total_categories: 0,
        total_orders: 0,
        total_users: 0
    });

    useEffect(() => {
        // 1. Kiểm tra quyền truy cập ngay khi vào trang
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            // Nếu không có user, dùng window.location để reset sạch state
            window.location.href = "/admin/login";
            return;
        }

        const user = JSON.parse(storedUser);

        if (user.role !== "admin") {
            window.location.href = "/admin/login";
            return;
        }

        // 2. Nếu hợp lệ thì mới cấp quyền hiển thị
        setIsAuthorized(true);

        // Lấy dữ liệu từ localStorage
        const products = JSON.parse(localStorage.getItem("products")) || [];
        const categories = JSON.parse(localStorage.getItem("categories")) || [];

        setData({
            total_products: products.length,
            total_categories: categories.length,
            total_orders: 25, 
            total_users: 10   
        });

        // 3. Tắt loading sau 500ms
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);

    }, []); // Chỉ chạy 1 lần khi component mount

    // 🔥 HÀM ĐĂNG XUẤT ĐÃ SỬA LỖI
    const handleLogout = () => {
        if (window.confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
            localStorage.removeItem("user");
            // Thay vì navigate, ta dùng window.location.href để xoá sạch mọi state cũ
            window.location.href = "/admin/login";
        }
    };

    const chartData = [
        { name: "T1", orders: 40 },
        { name: "T2", orders: 65 },
        { name: "T3", orders: 30 },
        { name: "T4", orders: 90 },
        { name: "T5", orders: 55 },
        { name: "T6", orders: 70 }
    ];

    // Ngăn chặn render nội dung nếu chưa xác thực hoặc đang tải
    if (!isAuthorized || loading) {
        return (
            <div className="dashboard-loading">
                <div className="spinner"></div>
                <h3 style={{ marginTop: '20px', color: '#666' }}>
                    Đang bảo mật hệ thống...
                </h3>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            {/* HEADER */}
            <header className="dashboard-header">
                <div className="header-left">
                    <h2 className="dashboard-title">📊 HỆ THỐNG QUẢN TRỊ</h2>
                    <p className="dashboard-subtitle">Chào mừng Quản trị viên quay trở lại</p>
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                    Đăng xuất
                </button>
            </header>

            {/* STATISTICS GRID */}
            <div className="dashboard-grid">
                <StatBox
                    icon="📦"
                    label="Sản phẩm"
                    value={data.total_products}
                    color="#4318FF"
                    onClick={() => navigate("/admin/products")}
                />
                <StatBox
                    icon="📂"
                    label="Danh mục"
                    value={data.total_categories}
                    color="#6AD2FF"
                    onClick={() => navigate("/admin/categories")}
                />
                <StatBox
                    icon="🧾"
                    label="Đơn hàng"
                    value={data.total_orders}
                    color="#FF4081"
                    onClick={() => navigate("/admin/orders")}
                />
                <StatBox
                    icon="👤"
                    label="Người dùng"
                    value={data.total_users}
                    color="#422AFB"
                />
            </div>

            {/* CHART SECTION */}
            <div className="chart-box">
                <h3 className="chart-title">📈 Biểu đồ tăng trưởng đơn hàng</h3>
                <div style={{ width: "100%", height: 350 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#a3aed0', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#a3aed0', fontSize: 12 }}
                            />
                            <Tooltip
                                cursor={{ fill: '#f4f7fe' }}
                                contentStyle={{ 
                                    borderRadius: '15px', 
                                    border: 'none', 
                                    boxShadow: '0 10px 15px rgba(0,0,0,0.1)' 
                                }}
                            />
                            <Bar
                                dataKey="orders"
                                fill="#ff4081"
                                radius={[8, 8, 0, 0]}
                                barSize={40}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

function StatBox({ icon, label, value, onClick, color }) {
    return (
        <div className="stat-box" onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
            <div className="stat-icon" style={{ backgroundColor: `${color}15`, color: color }}>
                {icon}
            </div>
            <div className="stat-info">
                <span className="stat-label">{label}</span>
                <span className="stat-value">{value}</span>
            </div>
        </div>
    );
}

export default AdminDashboard;