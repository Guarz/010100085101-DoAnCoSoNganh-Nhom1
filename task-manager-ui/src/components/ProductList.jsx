export default function ProductList({ products, onEdit, onDelete }) {
    return (
        <div style={{ flex: 1 }}>
            <h3>📦 Danh sách sản phẩm</h3>

            {products.length === 0 && <p>Chưa có sản phẩm</p>}

            <table width="100%" border="1" cellPadding="8">
                <thead>
                    <tr>
                        <th>Tên</th>
                        <th>Giá</th>
                        <th width="150">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((p) => (
                        <tr key={p.id}>
                            <td>{p.name}</td>
                            <td>{Number(p.price).toLocaleString()} VNĐ</td>
                            <td>
                                <button onClick={() => onEdit(p)}>✏️</button>
                                <button
                                    onClick={() => onDelete(p.id)}
                                    style={{ marginLeft: 10, color: "red" }}
                                >
                                    🗑️
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
