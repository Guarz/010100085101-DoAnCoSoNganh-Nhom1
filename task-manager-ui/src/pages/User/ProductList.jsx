import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ProductList.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // 1. Tạo State để lưu danh mục đang được chọn (Mặc định là "Tất cả")
    const [selectedCategory, setSelectedCategory] = useState("Tất cả");

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/user/products')
            .then(res => {
                if (Array.isArray(res.data)) {
                    setProducts(res.data);
                } else if (res.data.success) {
                    setProducts(res.data.data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi gọi API:", err);
                setLoading(false);
            });
    }, []);

    // 2. Hàm xử lý lọc sản phẩm
    const filteredProducts = selectedCategory === "Tất cả"
        ? products
        : products.filter(item => item.category === selectedCategory);

    if (loading) return <div className="text-center mt-5" style={{color: '#d81b60'}}>Đang tải sản phẩm...</div>;

    return (
        <div className="container-fluid p-0 pb-5">
            <h2 className="text-center page-title mb-4 mt-5">DANH SÁCH SẢN PHẨM</h2>

            {/* --- THANH DANH MỤC --- */}
            <div className="container mb-5">
                <ul className="nav nav-pills justify-content-center category-pills">
                    
                    {["Tất cả", "Áo thun", "Sơ mi", "Quần jean", "Váy"].map((cat) => (
                        <li className="nav-item" key={cat}>
                            <button 
                                className={`nav-link ${selectedCategory === cat ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat === "Tất cả" ? "Tất cả quần áo" : cat}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* --- LƯỚI SẢN PHẨM --- */}
            <div className="container">
                <div className="row g-4"> 
                
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((item) => {
                            const imageSrc = item.image?.startsWith('data:image') 
                                ? item.image 
                                : `data:image/jpeg;base64,${item.image}`;

                            return (
                                <div key={item.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                                    <div className="card h-100 border-0 product-card shadow-sm">
                                        <Link to={`/product/${item.id}`} className="text-decoration-none">
                                            <div className="position-relative overflow-hidden">
                                                <img 
                                                    src={imageSrc} 
                                                    className="card-img-top product-img" 
                                                    alt={item.name}
                                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300x400?text=No+Image' }}
                                                />
                                            </div>
                                        </Link>
                                        <div className="card-body d-flex flex-column text-center">
                                            <span className="text-muted small mb-1 text-uppercase">{item.category}</span>
                                            <h5 className="card-title fw-bold mb-2 text-dark">{item.name}</h5>
                                            <div className="mt-auto">
                                                <p className="fw-bold fs-5 mb-3" style={{color: '#d81b60'}}>
                                                    {item.price?.toLocaleString('vi-VN')} đ
                                                </p>
                                                <Link to={`/product/${item.id}`} className="btn btn-view-detail w-100 rounded-pill py-2 fw-bold">
                                                    XEM CHI TIẾT
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center w-100 mt-5 text-muted">Không có sản phẩm "{selectedCategory}" nào.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductList;