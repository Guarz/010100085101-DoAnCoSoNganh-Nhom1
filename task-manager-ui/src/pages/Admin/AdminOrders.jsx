import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminOrders() {

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // LOAD DATA
  // =========================
  const fetchOrders = async () => {
    try {
      setLoading(true);
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

  // =========================
  // UPDATE STATUS
  // =========================
  const changeStatus = async (id, status) => {
    await fetch(`http://localhost:8000/api/admin/orders/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ IdTT: status })
    });

    fetchOrders();
  };

  // =========================
  // DELETE
  // =========================
  const deleteOrder = async (id) => {
    if (!window.confirm("Xóa đơn này?")) return;

    await fetch(`http://localhost:8000/api/admin/orders/${id}`, {
      method: "DELETE"
    });

    fetchOrders();
  };

  // =========================
  // FORMAT
  // =========================
  const formatMoney = (money) =>
    Number(money || 0).toLocaleString() + " đ";

  // =========================
  // STATUS COLOR
  // =========================
  const getStatus = (idTT) => {
    switch (idTT) {
      case 1:
        return { text: "Chờ xử lý", color: "#f39c12" };
      case 2:
        return { text: "Đang giao", color: "#3498db" };
      case 3:
        return { text: "Hoàn thành", color: "#2ecc71" };
      case 4:
        return { text: "Hủy", color: "#e74c3c" };
      default:
        return { text: "Không rõ", color: "#777" };
    }
  };

  return (
    <div style={styles.container}>

      {/* HEADER */}
      <div style={styles.header}>
        <button onClick={() => navigate("/admin/dashboard")} style={styles.back}>
          ⬅
        </button>

        <h2>📦 Quản lý đơn hàng</h2>
      </div>

      {/* LOADING */}
      {loading ? (
        <p>⏳ Đang tải...</p>
      ) : orders.length === 0 ? (
        <div style={styles.emptyBox}>
          <p>📭 Không có đơn hàng</p>
        </div>
      ) : (

        <div style={styles.tableWrapper}>

          <table style={styles.table}>

            <thead>
              <tr>
                <th>ID</th>
                <th>Khách</th>
                <th>Sản phẩm</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th></th>
              </tr>
            </thead>

            <tbody>

              {orders.map((order) => {
                const status = getStatus(order.IdTT);

                return (
                  <tr key={order.IdDH} style={styles.row}>

                    <td>#{order.IdDH}</td>

                    <td>
                      <b>{order.user?.name || "Không rõ"}</b>
                    </td>

                    {/* PRODUCTS */}
                    <td>
                      {order.chi_tiet?.length > 0 ? (
                        order.chi_tiet.map((item) => (
                          <div key={item.IdCTDH} style={styles.product}>
                            {item.san_pham?.TenSP} x{item.SoLuong}
                          </div>
                        ))
                      ) : (
                        <span>Không có</span>
                      )}
                    </td>

                    {/* MONEY */}
                    <td style={styles.money}>
                      {formatMoney(order.TongTien)}
                    </td>

                    {/* STATUS */}
                    <td>
                      <span
                        style={{
                          ...styles.badge,
                          background: status.color
                        }}
                      >
                        {status.text}
                      </span>

                      <br />

                      <select
                        value={order.IdTT}
                        onChange={(e) =>
                          changeStatus(order.IdDH, e.target.value)
                        }
                        style={styles.select}
                      >
                        <option value={1}>Chờ xử lý</option>
                        <option value={2}>Đang giao</option>
                        <option value={3}>Hoàn thành</option>
                        <option value={4}>Hủy</option>
                      </select>
                    </td>

                    {/* ACTION */}
                    <td>
                      <button
                        onClick={() => deleteOrder(order.IdDH)}
                        style={styles.delete}
                      >
                        🗑
                      </button>
                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>
      )}
    </div>
  );
}

export default AdminOrders;


// ================= STYLE =================
const styles = {
  container: {
    padding: 30,
    background: "#f4f6f9",
    minHeight: "100vh"
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 20
  },

  back: {
    padding: "6px 12px",
    background: "#333",
    color: "#fff",
    border: "none",
    cursor: "pointer"
  },

  tableWrapper: {
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    overflow: "hidden"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse"
  },

  row: {
    borderBottom: "1px solid #eee"
  },

  product: {
    fontSize: 14
  },

  money: {
    color: "#e74c3c",
    fontWeight: "bold"
  },

  badge: {
    padding: "4px 10px",
    borderRadius: 20,
    color: "#fff",
    fontSize: 12,
    display: "inline-block"
  },

  select: {
    marginTop: 5,
    padding: "3px"
  },

  delete: {
    background: "#e74c3c",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: 5,
    cursor: "pointer"
  },

  emptyBox: {
    background: "#fff",
    padding: 40,
    textAlign: "center",
    borderRadius: 10
  }
};