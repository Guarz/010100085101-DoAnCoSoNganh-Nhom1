import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/user/products')
            .then(res => {
                if (res.data.success) {
                    setProducts(res.data.data);
                }
            })
            .catch(err => console.error("Lỗi:", err));
    }, []);

    return (
        <div className="product-container">
            <h1>Danh Sách Sản Phẩm</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                
                {/* --- ĐOẠN CODE .MAP() NẰM Ở ĐÂY --- */}
                {products.map((item) => (
                    <div key={item.IdSP} className="product-card" style={{ border: '1px solid #ddd', padding: '10px' }}>
                        {/* 1. Lấy từ bảng SanPham */}
                        <h2>{item.TenSP}</h2> 
                        <p>{item.MoTa}</p>

                        {/* 2. Lấy từ bảng AnhSP thông qua quan hệ */}
                        <img 
                            src={item.AnhSP?.UrlAnh} 
                            alt={item.TenSP} 
                            style={{ width: '100%', height: '150px', objectFit: 'cover' }} 
                        />

                        {/* 3. Lấy từ bảng LoaiSP thông qua quan hệ */}
                        <div style={{ marginTop: '10px' }}>
                            <span>Loại: <strong>{item.LoaiSP?.TenLoai}</strong></span>
                        </div>
                    </div>
                ))}
                {/* ---------------------------------- */}

            </div>
        </div>
    );
};

export default ProductList;