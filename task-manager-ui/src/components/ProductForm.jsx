import { useEffect, useState } from "react";

export default function ProductForm({ onSave, editing }) {
    const [form, setForm] = useState({
        name: "",
        price: "",
    });

    useEffect(() => {
        if (editing) {
            setForm(editing);
        }
    }, [editing]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name || !form.price) return alert("Nhập đủ thông tin");

        onSave(form);
        setForm({ name: "", price: "" });
    };

    return (
        <div style={{ width: 300 }}>
            <h3>{editing ? "✏️ Sửa sản phẩm" : "➕ Thêm sản phẩm"}</h3>

            <form onSubmit={handleSubmit}>
                <input
                    name="name"
                    placeholder="Tên sản phẩm"
                    value={form.name}
                    onChange={handleChange}
                    style={inputStyle}
                />

                <input
                    name="price"
                    type="number"
                    placeholder="Giá"
                    value={form.price}
                    onChange={handleChange}
                    style={inputStyle}
                />

                <button style={btnStyle}>
                    {editing ? "Cập nhật" : "Thêm"}
                </button>
            </form>
        </div>
    );
}

const inputStyle = {
    width: "100%",
    padding: 8,
    marginBottom: 10,
};

const btnStyle = {
    width: "100%",
    padding: 10,
    background: "#000",
    color: "#fff",
    border: "none",
    cursor: "pointer",
};
