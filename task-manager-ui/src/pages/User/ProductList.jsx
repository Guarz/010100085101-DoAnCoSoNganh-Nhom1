import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <div className="text-center mt-5" style={{color: '#d81b60'}}>Đang tải sản phẩm...</div>;

    return (
        <div className="container-fluid p-0 pb-5">
            
            {/* --- TIÊU ĐỀ --- */}
            <h2 className="text-center page-title mb-4 mt-5">DANH SÁCH SẢN PHẨM</h2>

            {/* --- THANH DANH MỤC (Thay thế ul li cũ thành nav-pills) --- */}
            <div className="container mb-5">
                <ul className="nav nav-pills justify-content-center category-pills">
                    <li className="nav-item">
                        <button className="nav-link active">Tất cả quần áo</button>
                    </li>
                    <li className="nav-item">
                        <button className="nav-link">Áo thun</button>
                    </li>
                    <li className="nav-item">
                        <button className="nav-link">Sơ mi</button>
                    </li>
                    <li className="nav-item">
                        <button className="nav-link">Quần jean</button>
                    </li>
                    <li className="nav-item">
                        <button className="nav-link">Váy</button>
                    </li>
                </ul>
            </div>

            {/* --- LƯỚI SẢN PHẨM --- */}
            <div className="container">
                <div className="row g-4"> 
                    
                    {products.length > 0 ? (
                        products.map((item) => {
                            // Xử lý ảnh base64
                            const imageSrc = item.image?.startsWith('data:image') 
                                ? item.image 
                                : `data:image/jpeg;base64,${item.image}`;

                            return (
                                <div key={item.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                                    <div className="card h-100 border-0 product-card">
                                        
                                        {/* Click vào ảnh để vào chi tiết */}
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

                                        {/* NỘI DUNG SẢN PHẨM */}
                                        <div className="card-body d-flex flex-column text-center">
                                            <span className="text-muted small mb-1 text-uppercase">{item.category}</span>
                                            <h5 className="card-title fw-bold mb-2 text-truncate text-dark">{item.name}</h5>
                                            <p className="card-text text-muted small flex-grow-1" style={{
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden'
                                            }}>
                                                {item.description}
                                            </p>
                                            
                                            <div className="mt-auto pt-3">
                                                <p className="fw-bold fs-5 mb-3" style={{color: '#d81b60'}}>
                                                    {item.price ? item.price.toLocaleString('vi-VN') : 'Liên hệ'} đ
                                                </p>
                                                
                                                {/* Nút bấm chuyển vào trang chi tiết */}
                                                <Link to={`/product/${item.id}`} className="btn btn-view-detail w-100 rounded-pill py-2 fw-bold text-decoration-none">
                                                    XEM CHI TIẾT
                                                </Link>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center w-100 mt-5 text-muted">Không có sản phẩm nào để hiển thị.</div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default ProductList;