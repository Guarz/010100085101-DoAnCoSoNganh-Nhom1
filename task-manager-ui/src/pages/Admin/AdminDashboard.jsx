import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CountUp from "react-countup";

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

    const [stats, setStats] = useState({
        total_products: 0,
        total_categories: 0,
        total_orders: 0,
        total_users: 0,
        total_revenue: 0
    });

    const [chartData, setChartData] = useState([]);

    // =============================
    // LOAD DASHBOARD
    // =============================
    const loadDashboard = async () => {

        try {

            const res = await axios.get("http://127.0.0.1:8000/api/admin/dashboard");

            setStats({
                total_products: res.data.totalProducts || 0,
                total_categories: res.data.totalCategories || 0,
                total_orders: res.data.totalOrders || 0,
                total_users: res.data.totalUsers || 0,
                total_revenue: res.data.totalRevenue || 0
            });

        } catch (error) {

            console.error("Dashboard API error:", error);

        }

    };

    // =============================
    // LOAD CHART
    // =============================
    const loadChart = async () => {

        try {

            const res = await axios.get("http://127.0.0.1:8000/api/admin/revenue-chart");

            const formatted = res.data.map(item => ({
                name: "T" + item.month,
                revenue: Number(item.revenue)
            }));

            setChartData(formatted);

        } catch (error) {

            console.log("Chart error:", error);

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

        } catch {

            localStorage.removeItem("user");
            window.location.href = "/admin/login";
            return;

        }

        const loadAll = async () => {
            await loadDashboard();
            await loadChart();
            setLoading(false);
        };

        loadAll();

    }, []);

    const handleLogout = () => {

        if (!window.confirm("Bạn có chắc chắn muốn đăng xuất không?")) return;

        localStorage.removeItem("user");
        window.location.href = "/admin/login";

    };

    if (loading) {

        return (

            <div className="dashboard-loading">

                <div className="spinner"></div>

                <p style={{ marginTop: 20 }}>
                    Đang tải dữ liệu hệ thống...
                </p>

            </div>

        );

    }

    return (

        <div className="admin-dashboard">

            {/* HEADER */}
            <header className="dashboard-header">

                <div>

                    <h2 className="dashboard-title">
                        📊 HỆ THỐNG QUẢN TRỊ
                    </h2>

                    <p className="dashboard-subtitle">
                        Chào mừng Quản trị viên quay trở lại
                    </p>

                </div>

                <button className="logout-btn" onClick={handleLogout}>
                    Đăng xuất
                </button>

            </header>


            {/* STATS */}
            <div className="dashboard-grid">

                <StatBox
                    icon="📦"
                    label="Sản phẩm"
                    value={stats.total_products}
                    color="#4318FF"
                    onClick={() => navigate("/admin/products")}
                />

                <StatBox
                    icon="📂"
                    label="Danh mục"
                    value={stats.total_categories}
                    color="#6AD2FF"
                    onClick={() => navigate("/admin/categories")}
                />

                <StatBox
                    icon="🧾"
                    label="Đơn hàng"
                    value={stats.total_orders}
                    color="#FF4081"
                    onClick={() => navigate("/admin/orders")}
                />

                <StatBox
                    icon="👤"
                    label="Người dùng"
                    value={stats.total_users}
                    color="#1b2559"
                    onClick={() => navigate("/admin/users")}
                />

                <StatBox
                    icon="💰"
                    label="Doanh thu"
                    value={stats.total_revenue}
                    color="#00C853"
                />

            </div>


            {/* CHART */}
            <div className="chart-box">

                <h3 className="chart-title">
                    📈 Doanh thu theo tháng
                </h3>

                <div className="chart-container">

                    <ResponsiveContainer width="100%" height={300}>

                        <BarChart data={chartData}>

                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis dataKey="name" />

                            <YAxis
                                tickFormatter={(value) =>
                                    value.toLocaleString()
                                }
                            />

                            <Tooltip
                                formatter={(value) =>
                                    value.toLocaleString() + " đ"
                                }
                            />

                            <Bar
                                dataKey="revenue"
                                fill="#4318FF"
                                radius={[10, 10, 0, 0]}
                                barSize={40}
                            />

                        </BarChart>

                    </ResponsiveContainer>

                </div>

            </div>

        </div>

    );

}


// =============================
// STAT COMPONENT
// =============================
function StatBox({ icon, label, value, onClick, color }) {

    return (

        <div
            className="stat-box"
            onClick={onClick}
            style={{ cursor: onClick ? "pointer" : "default" }}
        >

            <div
                className="stat-icon"
                style={{
                    backgroundColor: `${color}20`,
                    color: color
                }}
            >

                {icon}

            </div>

            <div>

                <span className="stat-label">
                    {label}
                </span>

                <h3 className="stat-value">

                    <CountUp
                        end={value}
                        duration={2}
                        separator=","
                    />

                </h3>

            </div>

        </div>

    );

}

export default AdminDashboard;