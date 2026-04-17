import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../style/revenue.css";

function RevenueDetail() {
    const navigate = useNavigate();
    const [chartData, setChartData] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const fetchRevenue = axios.get("http://127.0.0.1:8000/api/admin/revenue-chart");
        const fetchTopProducts = axios.get("http://127.0.0.1:8000/api/admin/top-products");

        Promise.all([fetchRevenue, fetchTopProducts])
            .then(([revRes, prodRes]) => {
                setChartData(revRes.data);
                setTopProducts(prodRes.data);
            })
            .catch(err => console.error("Lỗi:", err))
            .finally(() => setLoading(false));
    }, []);

    const formatCurrency = (amount) => {
        return Number(amount).toLocaleString('vi-VN') + " VND";
    };

    if (loading) return <div className="loading-state"><h3>Đang tải...</h3></div>;

    return (
        <div className="admin-container">
            <div className="admin-header shadow-sm">
                <button className="back-btn-modern" onClick={() => navigate(-1)}>
                    <i className="bi bi-arrow-left"></i> Quay lại
                </button>
                <h2 className="admin-title">Thống kê doanh thu</h2>
            </div>

            <div className="admin-content-grid">

                {/* DOANH THU */}
                <div className="admin-card">
                    <div className="card-header-title">
                        <h3>Doanh thu theo tháng</h3>
                    </div>

                    <table className="modern-table">
                        <thead>
                            <tr>
                                <th>THÁNG</th>
                                <th>DOANH THU</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chartData.map(item => (
                                <tr key={item.month}>
                                    <td><strong>Tháng {item.month}</strong></td>
                                    <td className="price-highlight">
                                        {formatCurrency(item.revenue)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* TOP PRODUCT */}
                <div className="admin-card">
                    <div className="card-header-title">
                        <h3>Sản phẩm bán chạy</h3>
                    </div>

                    <table className="modern-table">
                        <thead>
                            <tr>
                                <th>SẢN PHẨM</th>
                                <th>ĐÃ BÁN</th>
                                <th>DOANH THU</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topProducts.map((p, index) => (
                                <tr key={index}>
                                    <td>{p.name}</td>
                                    <td className="text-center">
                                        <span className="modern-badge">{p.sold}</span>
                                    </td>
                                    <td className="price-highlight">
                                        {formatCurrency(p.revenue)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}

export default RevenueDetail;