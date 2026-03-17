import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
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

        // Lấy sản phẩm từ localStorage
        const products = JSON.parse(localStorage.getItem("products")) || [];

        // Fake dữ liệu cho dashboard
        setData({
            total_products: products.length,
            total_categories: 3,
            total_orders: 12,
            total_users: 5
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
        return <div className="dashboard-loading">Đang tải...</div>;
    }

    return (

        <div className="admin-dashboard">

            <h2 className="dashboard-title">📊 ADMIN DASHBOARD</h2>

            <div className="dashboard-grid">

                <StatBox
                    icon="📦"
                    title="Sản phẩm"
                    value={data.total_products}
                    onClick={() => navigate("/admin/products")}
                />

                <StatBox
                    icon="📂"
                    title="Danh mục"
                    value={data.total_categories}
                    onClick={() => navigate("/admin/categories")}
                />

                <StatBox
                    icon="🧾"
                    title="Đơn hàng"
                    value={data.total_orders}
                    onClick={() => navigate("/admin/orders")}
                />

                <StatBox
                    icon="👤"
                    title="Người dùng"
                    value={data.total_users}
                    onClick={() => navigate("/admin/users")}
                />

            </div>

            <div className="chart-box">

                <h3>📈 Thống kê đơn hàng</h3>

                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="orders" fill="#e91e63" />
                    </BarChart>
                </ResponsiveContainer>

            </div>

        </div>
    );
}

function StatBox({ icon, title, value, onClick }) {

    return (

        <div className="stat-box" onClick={onClick}>

            <div className="stat-icon">{icon}</div>

            <h3>{title}</h3>

            <p className="stat-value">{value}</p>

        </div>

    );
}

export default AdminDashboard;