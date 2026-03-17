import { useState, useEffect } from "react";
import "../../style/product.css";

function ProductManagement() {

    const [products, setProducts] = useState([]);

    const [product, setProduct] = useState({
        name: "",
        code: "",
        category: "",
        quantity: "",
        price: "",
        salePrice: "",
        size: "",
        color: "",
        shortDesc: "",
        detailDesc: "",
        image: ""
    });

    const [editingId, setEditingId] = useState(null);

    useEffect(() => {

        const saved = localStorage.getItem("products");

        if (saved) {
            setProducts(JSON.parse(saved));
        }

    }, []);

    const handleChange = (e) => {

        setProduct({
            ...product,
            [e.target.name]: e.target.value
        });

    };

    const handleImage = (e) => {

        const file = e.target.files[0];

        if (file) {
            setProduct({
                ...product,
                image: file.name
            });
        }

    };

    const resetForm = () => {

        setProduct({
            name: "",
            code: "",
            category: "",
            quantity: "",
            price: "",
            salePrice: "",
            size: "",
            color: "",
            shortDesc: "",
            detailDesc: "",
            image: ""
        });

    };

    // THÊM
    const handleAddProduct = () => {

        if (!product.name || !product.price) {
            alert("Nhập đầy đủ thông tin");
            return;
        }

        const newProduct = {
            id: Date.now(),
            ...product
        };

        const updated = [...products, newProduct];

        setProducts(updated);

        localStorage.setItem("products", JSON.stringify(updated));

        resetForm();

    };

    // SỬA
    const handleEdit = (p) => {

        setProduct(p);

        setEditingId(p.id);

        window.scrollTo({ top: 0, behavior: "smooth" });

    };

    // CẬP NHẬT
    const handleUpdateProduct = () => {

        const updated = products.map(p =>
            p.id === editingId ? { ...product, id: editingId } : p
        );

        setProducts(updated);

        localStorage.setItem("products", JSON.stringify(updated));

        setEditingId(null);

        resetForm();

    };

    // XÓA
    const handleDelete = (id) => {

        const updated = products.filter(p => p.id !== id);

        setProducts(updated);

        localStorage.setItem("products", JSON.stringify(updated));

    };

    return (

        <div className="product-page">

            <h2 className="title">🌸 Thông tin sản phẩm</h2>

            <div className="product-card">

                <div className="form-grid">

                    <input name="name" placeholder="Tên sản phẩm" value={product.name} onChange={handleChange} />

                    <input name="code" placeholder="Mã sản phẩm" value={product.code} onChange={handleChange} />

                    <input name="category" placeholder="Danh mục" value={product.category} onChange={handleChange} />

                    <input name="quantity" placeholder="Số lượng" value={product.quantity} onChange={handleChange} />

                    <input name="price" placeholder="Giá gốc" value={product.price} onChange={handleChange} />

                    <input name="salePrice" placeholder="Giá khuyến mãi" value={product.salePrice} onChange={handleChange} />

                    <input name="size" placeholder="Size" value={product.size} onChange={handleChange} />

                    <input name="color" placeholder="Màu sắc" value={product.color} onChange={handleChange} />

                    <input type="file" onChange={handleImage} />

                </div>

                <div className="desc-box">

                    <input
                        name="shortDesc"
                        placeholder="Mô tả ngắn"
                        value={product.shortDesc}
                        onChange={handleChange}
                    />

                    <textarea
                        name="detailDesc"
                        placeholder="Mô tả chi tiết"
                        value={product.detailDesc}
                        onChange={handleChange}
                    ></textarea>

                </div>

                <button
                    className="add-btn"
                    onClick={editingId ? handleUpdateProduct : handleAddProduct}
                >
                    {editingId ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
                </button>

            </div>


            {/* DANH SÁCH */}

            <div className="product-list">

                <h3>📋 Danh sách sản phẩm</h3>

                {products.length === 0 ? (

                    <p>Chưa có sản phẩm</p>

                ) : (

                    <table>

                        <thead>

                            <tr>
                                <th>Tên</th>
                                <th>Giá</th>
                                <th>Số lượng</th>
                                <th>Hành động</th>
                            </tr>

                        </thead>

                        <tbody>

                            {products.map((p) => (

                                <tr key={p.id}>

                                    <td>{p.name}</td>

                                    <td>{p.price}</td>

                                    <td>{p.quantity}</td>

                                    <td>

                                        <button
                                            className="edit-btn"
                                            onClick={() => handleEdit(p)}
                                        >
                                            Sửa
                                        </button>

                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(p.id)}
                                        >
                                            Xóa
                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                )}

            </div>

        </div>

    );

}

export default ProductManagement;