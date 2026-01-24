const handleAdd = async () => {
    const data = {
        product_name: "Sản phẩm mới", 
        description: "Mô tả ở đây",
        category_id: 1 // Chú ý: Số này phải tồn tại trong bảng categories ở Database
    };

    try {
        const response = await fetch('http://127.0.0.1:8000/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const res = await response.json();
        if (res.success) alert("Thêm thành công!");
        else alert("Lỗi: " + res.message);
    } catch (e) {
        alert("Không kết nối được đến server Laravel (Cổng 8000)!");
    }
};