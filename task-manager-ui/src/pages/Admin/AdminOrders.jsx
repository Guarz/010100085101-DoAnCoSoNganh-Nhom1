import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/AdminOrders.css";

function AdminOrders() {

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= LOAD DATA =================
  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/admin/orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ================= UPDATE STATUS =================
  const changeStatus = async (id, status) => {
    await fetch(`http://localhost:8000/api/admin/orders/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: status })
    });

    fetchOrders();
  };

  // ================= DELETE =================
  const deleteOrder = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa?")) return;

    await fetch(`http://localhost:8000/api/admin/orders/${id}`, {
      method: "DELETE"
    });

    fetchOrders();
  };

  const formatMoney = (money) =>
    Number(money || 0).toLocaleString() + " đ";

  // ================= UI =================
  return (
    <div className="page">

      <button className="backBtn" onClick={() => navigate("/admin/dashboard")}>
        ⬅ Quay lại Dashboard
      </button>

      <h1 className="title">📦 Quản lý đơn hàng</h1>

      <div className="card">

        <h2 className="subTitle">📋 Danh sách đơn hàng</h2>

        {loading ? (
          <p>Đang tải...</p>
        ) : orders.length === 0 ? (
          <p>Không có đơn hàng</p>
        ) : (

          <table className="table">

            <thead>
              <tr>
                <th>ID</th>
                <th>Khách hàng</th>
                <th>Sản phẩm</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>

            <tbody>

              {orders.map((order) => (

                <tr key={order.id}>

                  <td>{order.id}</td>

                  <td>{order.customer}</td>

                  <td>{order.products}</td>

                  <td className="money">
                    {formatMoney(order.total)}
                  </td>

                  <td>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        changeStatus(order.id, e.target.value)
                      }
                    >
                      <option value={1}>Chờ xử lý</option>
                      <option value={2}>Đang giao</option>
                      <option value={3}>Hoàn thành</option>
                      <option value={4}>Hủy</option>
                    </select>
                  </td>

                  <td>
                    <button
                      className="deleteBtn"
                      onClick={() => deleteOrder(order.id)}
                    >
                      Xóa
                    </button>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>
    </div>
  );
}

export default AdminOrders;