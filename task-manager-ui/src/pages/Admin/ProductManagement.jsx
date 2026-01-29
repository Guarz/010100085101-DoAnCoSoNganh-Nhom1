import { useEffect, useState } from "react";
import { initProducts, getProducts, saveProducts } from "../../data/productStorage";
import ProductForm from "../../components/ProductForm";
import ProductList from "../../components/ProductList";

export default function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [editing, setEditing] = useState(null);

    useEffect(() => {
        initProducts();
        setProducts(getProducts());
    }, []);

    const handleSave = (product) => {
        let newProducts;
        if (editing) {
            newProducts = products.map(p => p.id === product.id ? product : p);
        } else {
            newProducts = [...products, { ...product, id: Date.now() }];
        }
        setProducts(newProducts);
        saveProducts(newProducts);
        setEditing(null);
    };

    const handleDelete = (id) => {
        const newProducts = products.filter(p => p.id !== id);
        setProducts(newProducts);
        saveProducts(newProducts);
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
