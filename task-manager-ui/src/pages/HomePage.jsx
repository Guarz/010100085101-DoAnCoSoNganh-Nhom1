import { useEffect, useState } from "react";
import axios from "axios";

function HomePage() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/get-products")
            .then(res => setProducts(res.data))
            .catch(err => console.error("Lỗi load sản phẩm:", err));
    }, []);

    return (
        <div style={wrapper}>
            <h2 style={title}>SẢN PHẨM MỚI NHẤT</h2>

            <div style={grid}>
                {products.map(p => (
                    <div key={p.IdSP} style={card}>
                        <img
                            src={
                                p.HinhAnh
                                    ? `http://localhost:8000/storage/${p.HinhAnh}`
                                    : "https://via.placeholder.com/300x400"
                            }
                            style={image}
                        />

                        <div style={cardBody}>
                            <h3>{p.TenSP}</h3>
                            <p style={price}>
                                {new Intl.NumberFormat("vi-VN").format(p.Gia)} VNĐ
                            </p>
                            <button style={btnBuy}>Mua ngay</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ===== STYLE ===== */
const wrapper = {
    padding: 30,
    maxWidth: 1200,
    margin: "0 auto"
};

const title = {
    textAlign: "center",
    color: "#d63384",
    marginBottom: 30
};

const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: 20
};

const card = {
    background: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
};

const image = {
    width: "100%",
    height: 300,
    objectFit: "cover"
};

const cardBody = {
    padding: 15
};

const price = {
    color: "#d63384",
    fontWeight: "bold",
    margin: "10px 0"
};

const btnBuy = {
    width: "100%",
    padding: 10,
    background: "#000",
    color: "#fff",
    border: "none",
    cursor: "pointer"
};

export default HomePage;
