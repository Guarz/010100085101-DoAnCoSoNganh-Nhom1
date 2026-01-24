import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [data, setData] = useState({ products: [], categories: [], orders: [], users: [], stats: {} });
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({ product_name: '', category_id: '', description: '' });

  // 1. Tải toàn bộ dữ liệu từ API Laravel
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
      console.error("Lỗi kết nối database:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAllData(); }, []);

  // 2. Hàm thêm sản phẩm mới
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.product_name || !newProduct.category_id) return alert("Vui lòng điền đủ thông tin!");
    try {
      await axios.post('http://127.0.0.1:8000/api/products', newProduct);
      setNewProduct({ product_name: '', category_id: '', description: '' });
      fetchAllData();
      alert("Thêm sản phẩm thành công!");
    } catch (err) { alert("Lỗi khi lưu sản phẩm!"); }
  };

  // 3. Hàm xóa sản phẩm
  const deleteProduct = async (id) => {
    if (window.confirm("Xác nhận xóa sản phẩm này?")) {
      await axios.delete(`http://127.0.0.1:8000/api/products/${id}`);
      fetchAllData();
    }
  };

  const renderContent = () => {
    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}><h3>🔄 Đang tải dữ liệu...</h3></div>;

    switch (activeMenu) {
      case 'dashboard':
        return (
          <div>
            <h2 style={{ marginBottom: '25px' }}>📊 Bảng điều khiển thống kê</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
              <div style={cardStyle('#3498db')}><h1>{data.stats.total_products || 0}</h1><p>Sản phẩm</p></div>
              <div style={cardStyle('#27ae60')}><h1>{data.stats.total_categories || 0}</h1><p>Danh mục</p></div>
              <div style={cardStyle('#f39c12')}><h1>{data.stats.total_orders || 0}</h1><p>Đơn hàng</p></div>
              <div style={cardStyle('#e74c3c')}><h1>{data.stats.total_users || 0}</h1><p>Thành viên</p></div>
            </div>
          </div>
        );
      case 'products':
        return (
          <div>
            <h2 style={{ marginBottom: '20px' }}>📦 Quản lý Kho sản phẩm</h2>
            <form onSubmit={handleAddProduct} style={formStyle}>
              <input type="text" placeholder="Tên sản phẩm..." value={newProduct.product_name} onChange={(e) => setNewProduct({ ...newProduct, product_name: e.target.value })} style={inputStyle} />
              <select value={newProduct.category_id} onChange={(e) => setNewProduct({ ...newProduct, category_id: e.target.value })} style={inputStyle}>
                <option value="">-- Chọn danh mục --</option>
                {data.categories.map(c => <option key={c.category_id} value={c.category_id}>{c.category_name}</option>)}
              </select>
              <button type="submit" style={btnSaveStyle}>LƯU LẠI</button>
            </form>
            {renderTable(["ID", "Tên SP", "Danh mục", "Thao tác"], data.products, ["product_id", "product_name", "category_name"], true)}
          </div>
        );
      case 'categories': return renderTable(["ID", "Tên danh mục"], data.categories, ["category_id", "category_name"]);
      case 'orders': return renderTable(["ID", "Khách hàng", "Tổng tiền", "Trạng thái"], data.orders, ["order_id", "customer_name", "total_amount", "status"]);
      case 'users': return renderTable(["ID", "Tên", "Email", "Ngày tạo"], data.users, ["user_id", "name", "email", "created_at"]);
      default: return <h3>Chức năng đang cập nhật...</h3>;
    }
  };

  const renderTable = (headers, rows, keys, isProd = false) => (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead><tr style={{ background: '#f8f9fa' }}>{headers.map(h => <th key={h} style={tdStyle}>{h}</th>)}</tr></thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
            {keys.map(k => <td key={k} style={tdStyle}>{r[k] || '---'}</td>)}
            {isProd && <td style={tdStyle}><button onClick={() => deleteProduct(r.product_id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Xóa bỏ</button></td>}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw' }}>
      <div style={{ width: '260px', backgroundColor: '#2c3e50', color: 'white', flexShrink: 0 }}>
        <h2 style={{ padding: '30px', textAlign: 'center', borderBottom: '1px solid #34495e' }}>🛡️ ADMIN</h2>
        <nav style={{ padding: '15px' }}>
          {['dashboard', 'products', 'categories', 'orders', 'users'].map(m => (
            <div key={m} onClick={() => setActiveMenu(m)} style={navItem(activeMenu === m)}>{m.toUpperCase()}</div>
          ))}
        </nav>
      </div>
      <div style={{ flex: 1, backgroundColor: '#f4f7f6', display: 'flex', flexDirection: 'column' }}>
        <header style={{ padding: '20px 40px', backgroundColor: 'white', borderBottom: '1px solid #ddd' }}>
          <b style={{ color: '#27ae60' }}>● Database: webbanhang</b>
        </header>
        <main style={{ padding: '40px', flex: 1 }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

// Styles
const navItem = (a) => ({ padding: '15px 20px', cursor: 'pointer', borderRadius: '8px', marginBottom: '5px', backgroundColor: a ? '#3498db' : 'transparent', color: a ? 'white' : '#bdc3c7' });
const cardStyle = (c) => ({ padding: '30px', backgroundColor: c, color: 'white', borderRadius: '12px', textAlign: 'center' });
const tdStyle = { padding: '15px', textAlign: 'left' };
const formStyle = { display: 'flex', gap: '10px', marginBottom: '30px', background: '#f8f9fa', padding: '20px', borderRadius: '10px' };
const inputStyle = { padding: '10px', borderRadius: '5px', border: '1px solid #ddd', flex: 1 };
const btnSaveStyle = { padding: '10px 25px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };

export default App;