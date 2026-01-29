import { useEffect, useState } from "react";
import axios from "axios";

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = () => {
        axios.get("http://127.0.0.1:8000/api/admin/orders")
            .then(res => {
                setOrders(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    const updateStatus = (orderId, newStatus) => {
        if (!window.confirm("Xác nhận đổi trạng thái đơn hàng?")) return;

        axios.put(`http://127.0.0.1:8000/api/admin/orders/${orderId}`, {
            status: newStatus
        })
            .then(() => {
                alert("Cập nhật thành công");
                fetchOrders();
            })
            .catch(() => alert("Lỗi cập nhật"));
    };

    if (loading) return <p>Đang tải đơn hàng...</p>;

    return (
        <div style={{ padding: 30 }}>
            <h2>📦 QUẢN LÝ ĐƠN HÀNG</h2>

            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Khách hàng</th>
                        <th>Ngày</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>

                <tbody>
                    {orders.map(o => (
                        <tr key={o.id}>
                            <td>{o.id}</td>
                            <td>{o.customer_name}</td>
                            <td>{o.order_date}</td>
                            <td style={{ color: "#d63384", fontWeight: "bold" }}>
                                {new Intl.NumberFormat("vi-VN").format(o.total_price)} VNĐ
                            </td>
                            <td>{o.status}</td>
                            <td>
                                <select
                                    value={o.IdTT}
                                    onChange={e => updateStatus(o.id, e.target.value)}
                                >
                                    <option value={0}>Chờ xử lý</option>
                                    <option value={1}>Đã xác nhận</option>
                                    <option value={2}>Đang giao</option>
                                    <option value={3}>Hoàn thành</option>
                                    <option value={4}>Hủy</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff"
};

export default AdminOrders;
