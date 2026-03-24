import React from 'react';
import axios from 'axios';
import { useNavigate, Link, useOutletContext } from 'react-router-dom';

const CartPage = () => {
    const navigate = useNavigate();

    const context = useOutletContext();
    const cart = context?.cart || [];
    const setCart = context?.setCart || (() => {});

    const themeColor = "#d81b60"; // Đổi màu chủ đạo sang hồng đậm cho tông xuyệt tông với ProductList

    // Lấy user an toàn
    const user = (() => {
        try {
            const data = localStorage.getItem('user');
            return data ? JSON.parse(data) : null;
        } catch (e) {
            return null;
        }
    })();

    // Tính tổng tiền (hỗ trợ cả GiaKM, GiaBan và price)
    const totalAmount = (cart || []).reduce((sum, item) => sum + ((item.GiaKM || item.GiaBan || item.price || 0) * (item.quantity || 1)), 0);

    // Tăng/giảm số lượng qua nút bấm
    const updateQty = async (id, delta) => {
    const itemToUpdate = cart.find(item => (item.IdSP || item.id) === id);
    if (!itemToUpdate) return;

    // ÉP KIỂU Number cho cả số lượng cũ và delta
    const currentQty = Number(itemToUpdate.quantity) || 1;
    const newQty = currentQty + Number(delta);
    const finalQty = newQty > 0 ? newQty : 1;

    const newCart = cart.map(item => (item.IdSP || item.id) === id ? { ...item, quantity: finalQty } : item);
    
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart)); // Quan trọng: Cập nhật lại kho lưu trữ

    // Phần gọi API giữ nguyên...
    try {
        await axios.post('http://127.0.0.1:8000/api/cart/update', {
            IdGH: itemToUpdate.IdGH || itemToUpdate.cart_id,
            IdSP: id,
            SoLuong: finalQty
        });
    } catch (error) {
        console.error("Lỗi khi cập nhật số lượng:", error);
    }
};

    // Nhập số lượng trực tiếp bằng bàn phím
    const handleInputQty = async (id, value) => {
    // Nếu xóa trống thì tạm thời để 1 hoặc để trống để người dùng gõ tiếp
    if (value === '') {
        setCart(cart.map(item => (item.IdSP || item.id) === id ? { ...item, quantity: '' } : item));
        return;
    }

    const newQty = Number(value);
    if (isNaN(newQty) || newQty < 1) return;

    const itemToUpdate = cart.find(item => (item.IdSP || item.id) === id);
    if (!itemToUpdate) return;

    const newCart = cart.map(item => (item.IdSP || item.id) === id ? { ...item, quantity: newQty } : item);
    
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));

    try {
        await axios.post('http://127.0.0.1:8000/api/cart/update', {
            IdGH: itemToUpdate.IdGH || itemToUpdate.cart_id,
            IdSP: id,
            SoLuong: newQty
        });
    } catch (error) {
        console.error("Lỗi khi cập nhật số lượng:", error);
    }
};

    // Xóa sản phẩm khỏi giỏ
    const removeItem = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
            const itemToRemove = cart.find(item => (item.IdSP || item.id) === id);
            setCart(cart.filter(item => (item.IdSP || item.id) !== id));

            if (itemToRemove && (itemToRemove.IdGH || itemToRemove.cart_id)) {
                try {
                    await axios.post('http://127.0.0.1:8000/api/cart/remove', {
                        IdGH: itemToRemove.IdGH || itemToRemove.cart_id,
                        IdSP: id
                    });
                } catch (error) {
                    console.error("Lỗi khi xóa sản phẩm:", error);
                }
            }
        }
    };

    const handleCheckout = async () => {
        if (!user) {
            alert("Vui lòng đăng nhập để đặt hàng!");
            return navigate('/login');
        }

        try {
            await axios.post('http://127.0.0.1:8000/api/orders', {
                user_email: user.email,
                total_price: totalAmount,
                items: cart
            });
            alert("Đặt hàng thành công!");
            setCart([]);
            navigate('/user-orders');
        } catch (error) {
            alert("Lỗi khi đặt hàng!");
            console.error(error);
        }
    };

    if (!cart) return <div className="text-center mt-5" style={{ color: themeColor }}>Đang tải dữ liệu...</div>;

    // --- RENDER GIAO DIỆN ---
    return (
        <div style={{ backgroundColor: "#f5f5f5", padding: "20px 0", fontFamily: "Arial, sans-serif", minHeight: "80vh" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 15px" }}>
                
                {/* Header Row */}
                <div style={styles.headerRow}>
                    <div style={{ display: 'flex', alignItems: 'center', width: '45%' }}>
                        <input type="checkbox" style={{...styles.checkbox, accentColor: themeColor}} />
                        <span style={{ marginLeft: 10, color: '#888' }}>Sản Phẩm</span>
                    </div>
                    <div style={{ width: '15%', textAlign: 'center', color: '#888' }}>Đơn Giá</div>
                    <div style={{ width: '15%', textAlign: 'center', color: '#888' }}>Số Lượng</div>
                    <div style={{ width: '15%', textAlign: 'center', color: '#888' }}>Số Tiền</div>
                    <div style={{ width: '10%', textAlign: 'center', color: '#888' }}>Thao Tác</div>
                </div>

                {cart.length === 0 ? (
                    <div style={{ ...styles.shopBlock, padding: "80px 20px", textAlign: "center" }}>
                        <p style={{ fontSize: 16, color: '#555' }}>Giỏ hàng của bạn còn trống.</p>
                        <Link to="/products" style={{ color: "white", backgroundColor: themeColor, textDecoration: "none", fontWeight: "bold", padding: "10px 30px", borderRadius: "50px", marginTop: 15, display: "inline-block" }}>
                            MUA SẮM NGAY
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Khối Sản phẩm */}
                        <div style={styles.shopBlock}>
                            {/* Tên Shop */}
                            <div style={styles.shopHeader}>
                                <input type="checkbox" style={{...styles.checkbox, accentColor: themeColor}} />
                                <span style={{ ...styles.shopIcon, color: themeColor }}>🏪</span>
                                <span style={{ fontWeight: 'bold', marginLeft: 8, color: themeColor }}>SHOP QUẦN ÁO A</span>
                                <span style={{ marginLeft: 8, color: themeColor, cursor: 'pointer' }}>💬</span>
                            </div>

                            {/* Danh sách sản phẩm */}
                            {cart.map((item, index) => {
                                // Đồng bộ tên biến dữ liệu
                                const itemId = item.IdSP || item.id;
                                const itemName = item.TenSP || item.name || 'Tên sản phẩm';
                                const itemPrice = item.GiaKM || item.GiaBan || item.price || 0;
                                const itemQty = item.quantity || 1;
                                
                                // Xử lý ảnh base64
                                const rawImg = item.HinhAnh || item.image;
                                const imageSrc = rawImg?.startsWith('data:image') || rawImg?.startsWith('http')
                                    ? rawImg 
                                    : `data:image/jpeg;base64,${rawImg}`;

                                return (
                                    <div key={itemId} style={{ ...styles.productRow, borderTop: index === 0 ? 'none' : '1px solid #f5f5f5' }}>
                                        
                                        {/* Cột 1: Thông tin sản phẩm */}
                                        <div style={{ display: 'flex', width: '45%', alignItems: 'center' }}>
                                            <input type="checkbox" style={{...styles.checkbox, accentColor: themeColor}} />
                                            
                                            <div style={{ display: 'flex', marginLeft: 15, flex: 1 }}>
                                                {rawImg ? (
                                                    <img 
                                                        src={imageSrc} 
                                                        alt={itemName} 
                                                        style={styles.productImg}
                                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/80?text=No+Image' }}
                                                    />
                                                ) : (
                                                    <div style={{ ...styles.productImg, background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>No Image</div>
                                                )}
                                                
                                                <div style={{ marginLeft: 10, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                                                    <div style={styles.productName}>{itemName}</div>
                                                    <div style={{ marginTop: 5 }}>
                                                        <span style={{ backgroundColor: themeColor, color: '#fff', fontSize: 10, padding: '2px 4px', borderRadius: 2 }}>Đang bán chạy</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Phân loại hàng */}
                                            <div style={styles.variantBlock}>
                                                <div style={{ color: '#888', marginBottom: 5, fontSize: 12 }}>Phân Loại: ▼</div>
                                                <div style={{ color: '#333', fontSize: 13 }}>Mặc định</div>
                                            </div>
                                        </div>

                                        {/* Cột 2: Đơn giá */}
                                        <div style={{ width: '15%', textAlign: 'center' }}>
                                            {Number(itemPrice).toLocaleString('vi-VN')}₫
                                        </div>

                                        {/* Cột 3: Số lượng */}
                                        <div style={{ width: '15%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <div style={styles.qtyWrapper}>
                                                <button onClick={() => updateQty(itemId, -1)} style={styles.qtyBtn}>-</button>
                                                <input 
                                                    type="text" 
                                                    value={itemQty} 
                                                    onChange={(e) => handleInputQty(itemId, e.target.value)}
                                                    style={styles.qtyInput}
                                                />
                                                <button onClick={() => updateQty(itemId, 1)} style={styles.qtyBtn}>+</button>
                                            </div>
                                        </div>

                                        {/* Cột 4: Số tiền */}
                                        <div style={{ width: '15%', textAlign: 'center', color: themeColor, fontWeight: 'bold' }}>
                                            {(itemPrice * itemQty).toLocaleString('vi-VN')}₫
                                        </div>

                                        {/* Cột 5: Thao tác */}
                                        <div style={{ width: '10%', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 5 }}>
                                            <span onClick={() => removeItem(itemId)} style={styles.actionDelete}>Xóa</span>
                                            <span style={{ cursor: 'pointer', color: themeColor, fontSize: 12 }}>Tìm sản phẩm<br/>tương tự ▼</span>
                                        </div>

                                    </div>
                                );
                            })}
                        </div>

                        {/* Thanh thanh toán Footer */}
                        <div style={styles.checkoutBar}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <input type="checkbox" style={{ ...styles.checkbox, marginLeft: 20, accentColor: themeColor }} />
                                <span style={{ marginLeft: 10 }}>Chọn tất cả ({cart.length})</span>
                                <span style={{ marginLeft: 20, cursor: 'pointer', color: '#555' }}>Xóa</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ marginRight: 20, fontSize: 16 }}>
                                    Tổng thanh toán ({cart.length} Sản phẩm): <span style={{ color: themeColor, fontSize: 24, fontWeight: 'bold', marginLeft: 10 }}>{totalAmount.toLocaleString('vi-VN')}₫</span>
                                </div>
                                <button onClick={handleCheckout} style={{ ...styles.checkoutBtn, backgroundColor: themeColor }}>
                                    Mua Hàng
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

// --- CSS STYLES (Giữ nguyên của bạn) ---
const styles = {
    headerRow: { display: 'flex', alignItems: 'center', backgroundColor: '#fff', padding: '15px 20px', borderRadius: 3, boxShadow: '0 1px 1px 0 rgba(0,0,0,.05)', marginBottom: 15, fontSize: 14 },
    shopBlock: { backgroundColor: '#fff', borderRadius: 3, boxShadow: '0 1px 1px 0 rgba(0,0,0,.05)', marginBottom: 15 },
    shopHeader: { padding: '15px 20px', borderBottom: '1px solid rgba(0,0,0,.09)', display: 'flex', alignItems: 'center', fontSize: 14 },
    shopIcon: { marginLeft: 10, fontSize: 16 },
    productRow: { display: 'flex', alignItems: 'center', padding: '20px', fontSize: 14, color: '#222' },
    checkbox: { width: 16, height: 16, cursor: 'pointer' },
    productImg: { width: 80, height: 80, objectFit: 'cover', border: '1px solid #e1e1e1', borderRadius: 2 },
    productName: { fontSize: 14, lineHeight: '20px', maxHeight: 40, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' },
    variantBlock: { marginLeft: 15, width: 140, fontSize: 14 },
    qtyWrapper: { display: 'flex', alignItems: 'center', border: '1px solid rgba(0,0,0,.09)', borderRadius: 2, overflow: 'hidden' },
    qtyBtn: { width: 32, height: 32, backgroundColor: '#fff', border: 'none', outline: 'none', cursor: 'pointer', fontSize: 16, color: '#666' },
    qtyInput: { width: 50, height: 32, borderLeft: '1px solid rgba(0,0,0,.09)', borderRight: '1px solid rgba(0,0,0,.09)', borderTop: 'none', borderBottom: 'none', textAlign: 'center', fontSize: 16, color: '#222', outline: 'none' },
    actionDelete: { cursor: 'pointer', color: '#333', marginBottom: 8, fontWeight: 'bold' },
    checkoutBar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', padding: '12px 0', borderRadius: 3, boxShadow: '0 -2px 5px 0 rgba(0,0,0,.05)', position: 'sticky', bottom: 0, zIndex: 10 },
    checkoutBtn: { color: '#fff', border: 'none', padding: '13px 36px', marginRight: 20, fontSize: 16, borderRadius: 2, cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' }
};

export default CartPage;