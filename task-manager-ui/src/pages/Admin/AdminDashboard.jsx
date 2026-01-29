import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
    const [data, setData] = useState(null);

    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/api/admin/dashboard")
            .then(res => setData(res.data))
            .catch(err => console.error("Lỗi dashboard:", err));
    }, []);

    if (!data) return <p style={{ padding: 20 }}>Đang tải dashboard...</p>;

    return (
        <div style={{ padding: 30 }}>
            <h2>📊 ADMIN DASHBOARD</h2>

            <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
                <Box title="Sản phẩm" value={data.total_products} />
                <Box title="Danh mục" value={data.total_categories} />
                <Box title="Đơn hàng" value={data.total_orders} />
                <Box title="Người dùng" value={data.total_users} />
            </div>
        </div>
    );
}

const Box = ({ title, value }) => (
    <div style={{
        background: "#fff",
        padding: 20,
        borderRadius: 10,
        width: 180,
        textAlign: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    }}>
        <h3>{title}</h3>
        <p style={{ fontSize: 24, fontWeight: "bold" }}>{value}</p>
    </div>
);

export default AdminDashboard;
