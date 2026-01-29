import { useEffect, useState } from "react";
import axios from "axios";
import ProductForm from "../../components/ProductForm";
import ProductList from "../../components/ProductList";

export default function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [editing, setEditing] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        axios.get("http://127.0.0.1:8000/api/admin/products")
            .then(res => setProducts(res.data))
            .catch(err => console.error("Lỗi load sản phẩm:", err));
    };

    const handleSave = (product) => {
        if (editing) {
            axios.put(
                `http://127.0.0.1:8000/api/admin/products/${product.id}`,
                product
            ).then(fetchProducts);
        } else {
            axios.post(
                "http://127.0.0.1:8000/api/admin/products",
                product
            ).then(fetchProducts);
        }
        setEditing(null);
    };

    const handleDelete = (id) => {
        axios.delete(
            `http://127.0.0.1:8000/api/admin/products/${id}`
        ).then(fetchProducts);
    };

    return (
        <div style={{ display: "flex", gap: 30 }}>
            <ProductForm onSave={handleSave} editing={editing} />
            <ProductList
                products={products}
                onEdit={setEditing}
                onDelete={handleDelete}
            />
        </div>
    );
}
