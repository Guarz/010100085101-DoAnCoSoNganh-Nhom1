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
    const [data, setData] = useState({
        total_products: 0,
        total_categories: 0,
        total_orders: 0,
        total_users: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Lấy dữ liệu từ localStorage
        const products = JSON.parse(localStorage.getItem("products")) || [];
        const categories = JSON.parse(localStorage.getItem("categories")) || [];

        setData({
            total_products: products.length,
            total_categories: categories.length || 5,
            total_orders: 25,
            total_users: 10
        });

        setLoading(false);
    }, []);

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
                <h3>⏳ Đang tải dữ liệu...</h3>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <header className="dashboard-header">
                <h2 className="dashboard-title">📊 HỆ THỐNG QUẢN TRỊ</h2>
                <p className="dashboard-subtitle">
                    Chào mừng bạn quay trở lại hệ thống quản lý
                </p>
            </header>

            {/* STATISTICS GRID */}
            <div className="dashboard-grid">
                <StatBox
                    icon="📦"
                    label="Sản phẩm"
                    value={data.total_products}
                    onClick={() => navigate("/admin/products")}
                />
                <StatBox
                    icon="📂"
                    label="Danh mục"
                    value={data.total_categories}
                    onClick={() => navigate("/admin/categories")}
                />
                <StatBox
                    icon="🧾"
                    label="Đơn hàng"
                    value={data.total_orders}
                    onClick={() => navigate("/admin/orders")}
                />
                <StatBox
                    icon="👤"
                    label="Người dùng"
                    value={data.total_users}
                    onClick={() => navigate("/admin/users")}
                />
            </div>

            {/* CHART SECTION */}
            <div className="chart-box">
                <h3 className="chart-title">📈 Biểu đồ tăng trưởng đơn hàng</h3>
                <div style={{ width: "100%", height: 350 }}>
                    <ResponsiveContainer>
                        <BarChart
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#888' }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#888' }}
                            />
                            <Tooltip cursor={{ fill: "#f1f3ff" }} />
                            <Bar
                                dataKey="orders"
                                fill="#ff4081"
                                radius={[6, 6, 0, 0]}
                                barSize={40}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

/* COMPONENT CON: StatBox */
function StatBox({ icon, label, value, onClick }) {
    return (
        <div className="stat-box" onClick={onClick}>
            <div className="stat-icon">
                {icon}
            </div>
            <div className="stat-info">
                <span className="stat-value">{value}</span>
                <span className="stat-label">{label}</span>
            </div>
        </div>
    );
}

export default AdminDashboard;