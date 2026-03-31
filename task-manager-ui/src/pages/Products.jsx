import { useEffect, useState } from "react";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [tensp, setTensp] = useState("");
    const [gia, setGia] = useState("");

    // Load danh sách sản phẩm
    const loadProducts = async () => {
        const res = await fetch("http://127.0.0.1:8000/api/get-products");
        const data = await res.json();
        setProducts(data);
    };

    useEffect(() => {
        loadProducts();
    }, []);

    // Thêm sản phẩm
    const handleAdd = async () => {
        if (!tensp || !gia) {
            alert("Nhập đầy đủ thông tin");
            return;
        }

        const data = {
            tensp,
            gia
        };

        try {
            const response = await fetch("http://127.0.0.1:8000/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const res = await response.json();

            if (res.success) {
                alert("Thêm thành công!");
                setTensp("");
                setGia("");
                loadProducts();
            } else {
                alert(res.message);
            }
        } catch (err) {
            alert("Không kết nối được Laravel");
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Thêm sản phẩm</h2>

            <input
                placeholder="Tên sản phẩm"
                value={tensp}
                onChange={(e) => setTensp(e.target.value)}
            />

            <input
                placeholder="Giá"
                type="number"
                value={gia}
                onChange={(e) => setGia(e.target.value)}
            />

            <button onClick={handleAdd}>Thêm</button>

            <h2>Danh sách sản phẩm</h2>

            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên</th>
                        <th>Giá</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((p) => (
                        <tr key={p.masp}>
                            <td>{p.masp}</td>
                            <td>{p.tensp}</td>
                            <td>{p.gia}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
