import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [data, setData] = useState({ products: [], categories: [], orders: [], users: [], stats: {} });
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [loading, setLoading] = useState(false);

  // Hàm tải dữ liệu tổng hợp từ API Laravel
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [p, c, o, u, s] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/get-products'),
        axios.get('http://127.0.0.1:8000/api/get-categories'),
        axios.get('http://127.0.0.1:8000/api/get-orders'),
        axios.get('http://127.0.0.1:8000/api/get-users'),
        axios.get('http://127.0.0.1:8000/api/get-stats')
      ]);
      setData({ products: p.data, categories: c.data, orders: o.data, users: u.data, stats: s.data });
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const renderContent = () => {
    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}><h3>🔄 Đang cập nhật dữ liệu...</h3></div>;

    switch (activeMenu) {
      case 'dashboard':
        return (
          <div>
            <h2 style={{ marginBottom: '25px' }}>📊 Bảng điều khiển thống kê</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div style={cardStyle('#3498db')}>
                <h1 style={{ fontSize: '40px', margin: '10px 0' }}>{data.stats.total_products || 0}</h1>
                <p>Sản phẩm trong kho</p>
              </div>
              <div style={cardStyle('#27ae60')}>
                <h1 style={{ fontSize: '40px', margin: '10px 0' }}>{data.stats.total_categories || 0}</h1>
                <p>Danh mục hàng hóa</p>
              </div>
              <div style={cardStyle('#e67e22')}>
                <h1 style={{ fontSize: '40px', margin: '10px 0' }}>{data.stats.total_orders || 0}</h1>
                <p>Đơn hàng cần xử lý</p>
              </div>
            </div>
          </div>
        );
      case 'products':
        return renderTable("📦 Danh sách Sản phẩm", ["ID", "Tên sản phẩm", "Danh mục"], data.products, ["product_id", "product_name", "category_name"]);
      case 'categories':
        return renderTable("📁 Danh mục Sản phẩm", ["ID", "Tên danh mục"], data.categories, ["category_id", "category_name"]);
      case 'orders':
        return renderTable("🛒 Quản lý Đơn hàng", ["ID", "Khách hàng", "Tổng tiền", "Trạng thái"], data.orders, ["order_id", "customer_name", "total_amount", "status"]);
      case 'users':
        return renderTable("👥 Danh sách Tài khoản", ["ID", "Tên người dùng", "Email", "Ngày đăng ký"], data.users, ["user_id", "name", "email", "created_at"]);
      default:
        return <h3>Chức năng đang được cập nhật...</h3>;
    }
  };

  const renderTable = (title, headers, rows, keys) => (
    <div>
      <h2 style={{ marginBottom: '20px' }}>{title}</h2>
      <table style={tableStyle}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            {headers.map(h => <th key={h} style={tdStyle}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? rows.map((item, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
              {keys.map(k => <td key={k} style={tdStyle}>{item[k] || '---'}</td>)}
            </tr>
          )) : (
            <tr><td colSpan={headers.length} style={{ textAlign: 'center', padding: '30px' }}>Không có dữ liệu hiển thị</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw' }}>
      {/* SIDEBAR */}
      <div style={{ width: '260px', backgroundColor: '#2c3e50', color: 'white', flexShrink: 0 }}>
        <div style={{ padding: '30px', textAlign: 'center', borderBottom: '1px solid #34495e' }}>
          <h2 style={{ margin: 0 }}>🛡️ ADMIN PANEL</h2>
        </div>
        <nav style={{ padding: '15px' }}>
          <div onClick={() => setActiveMenu('dashboard')} style={navItem(activeMenu === 'dashboard')}>📊 Dashboard</div>
          <div onClick={() => setActiveMenu('products')} style={navItem(activeMenu === 'products')}>📦 Sản phẩm</div>
          <div onClick={() => setActiveMenu('categories')} style={navItem(activeMenu === 'categories')}>📁 Danh mục</div>
          <div onClick={() => setActiveMenu('orders')} style={navItem(activeMenu === 'orders')}>🛒 Đơn hàng</div>
          <div onClick={() => setActiveMenu('users')} style={navItem(activeMenu === 'users')}>👥 Tài khoản</div>
        </nav>
      </div>

      {/* CONTENT AREA */}
      <div style={{ flex: 1, backgroundColor: '#f4f7f6', display: 'flex', flexDirection: 'column' }}>
        <header style={{ padding: '20px 40px', backgroundColor: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#27ae60', fontWeight: 'bold' }}>● Online: Database webbanhang</span>
          <button onClick={fetchAllData} style={{ padding: '8px 15px', cursor: 'pointer', borderRadius: '5px' }}>Làm mới</button>
        </header>
        <main style={{ padding: '40px', flex: 1 }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

// STYLES
const navItem = (active) => ({
  padding: '15px 20px', cursor: 'pointer', borderRadius: '8px', marginBottom: '5px',
  backgroundColor: active ? '#3498db' : 'transparent', color: active ? 'white' : '#bdc3c7', transition: '0.3s'
});
const cardStyle = (color) => ({
  padding: '30px', backgroundColor: color, color: 'white', borderRadius: '15px', textAlign: 'center'
});
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const tdStyle = { padding: '15px', textAlign: 'left', borderBottom: '1px solid #eee' };

export default App;