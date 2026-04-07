import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../style/revenue.css"; // Đường dẫn đúng với cấu trúc của bạn

function RevenueDetail() {
    const navigate = useNavigate();
    const [chartData, setChartData] = useState([]);
    const [topProducts, setTopProducts] = useState([]);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/admin/revenue-chart")
            .then(res => setChartData(res.data))
            .catch(err => console.error(err));

        axios.get("http://127.0.0.1:8000/api/admin/top-products")
            .then(res => setTopProducts(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="revenue-page">
            <button className="back-btn" onClick={() => navigate(-1)}>
                🔙 Quay lại
            </button>

            <h2>📊 Thống kê doanh thu</h2>

            <table className="revenue-table">
                <thead>
                    <tr>
                        <th>Tháng</th>
                        <th>Doanh thu</th>
                    </tr>
                </thead>
                <tbody>
                    {chartData.map(item => (
                        <tr key={item.month}>
                            <td>{item.month}</td>
                            <td>{item.revenue.toLocaleString()} VND</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2 style={{ marginTop: "40px" }}>🔥 Sản phẩm bán chạy</h2>

            <table className="revenue-table">
                <thead>
                    <tr>
                        <th>Sản phẩm</th>
                        <th>Số lượng bán</th>
                        <th>Doanh thu</th>
                    </tr>
                </thead>
                <tbody>
                    {topProducts.map((p, index) => (
                        <tr key={index}>
                            <td>{p.name}</td>
                            <td>{p.sold}</td>
                            <td>{p.revenue.toLocaleString()} VND</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default RevenueDetail;