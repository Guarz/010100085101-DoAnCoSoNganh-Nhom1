import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CountUp from "react-countup"; // Nhớ chạy lệnh: npm install react-countup
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Cell
} from "recharts";

import "../../style/dashboard.css";

function AdminDashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        total_products: 0,
        total_categories: 0,
        total_orders: 0,
        total_users: 0
    });

    const loadDashboard = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:8000/api/admin/dashboard");
            setData({
                total_products: res.data.totalProducts || 0,
                total_categories: res.data.totalCategories || 0,
                total_orders: res.data.totalOrders || 0,
                total_users: res.data.totalUsers || 0
            });
        } catch (error) {
            console.error("Dashboard API error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            window.location.href = "/admin/login";
            return;
        }

        try {
            const user = JSON.parse(storedUser);
            if (!user || user.role !== "admin") {
                localStorage.removeItem("user");
                window.location.href = "/admin/login";
                return;
            }
        } catch (e) {
            localStorage.removeItem("user");
            window.location.href = "/admin/login";
            return;
        }

        loadDashboard();
    }, []);

    const handleLogout = () => {
        if (!window.confirm("Bạn có chắc chắn muốn đăng xuất không?")) return;
        localStorage.removeItem("user");
        window.location.href = "/admin/login";
    };

    const chartData = [
        { name: "T1", orders: 40 },
        { name: "T2", orders: 65 },
        { name: "T3", orders: 30 },
        { name: "T4", orders: 90 },
        { name: "T5", orders: 55 },
        { name: "T6", orders: 70 }
    ];

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="spinner"></div>
                <p style={{ marginTop: '20px', fontWeight: '600', color: '#1b2559' }}>
                    Đang tải dữ liệu hệ thống...
                </p>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            {/* HEADER */}
            <header className="dashboard-header">
                <div className="header-info">
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
                    color="#1b2559"
                    onClick={() => navigate("/admin/users")}
                />
            </div>

            {/* CHART SECTION */}
            <div className="chart-box">
                <h3 className="chart-title">📈 Biểu đồ tăng trưởng đơn hàng</h3>
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#A3AED0', fontSize: 12, fontWeight: 500 }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#A3AED0', fontSize: 12, fontWeight: 500 }}
                            />
                            <Tooltip
                                cursor={{ fill: '#F4F7FE' }}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                            />
                            <Bar dataKey="orders" radius={[10, 10, 0, 0]} barSize={35}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#4318FF" : "#FF4081"} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

/* COMPONENT STATBOX */
function StatBox({ icon, label, value, onClick, color }) {
    return (
        <div className="stat-box" onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
            <div className="stat-icon" style={{ backgroundColor: `${color}15`, color: color }}>
                {icon}
            </div>
            <div className="stat-info">
                <span className="stat-label">{label}</span>
                <h3 className="stat-value" style={{ color: '#1b2559', margin: 0 }}>
                    <CountUp end={value} duration={2} separator="," />
                </h3>
            </div>
        </div>
    );
}

export default AdminDashboard;