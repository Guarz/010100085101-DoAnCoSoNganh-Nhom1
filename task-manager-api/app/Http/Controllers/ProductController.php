public function store(Request $request)
{
    // 1. Kiểm tra dữ liệu đầu vào
    $validated = $request->validate([
        'name' => 'required|string|max:255',
    ]);

    // 2. Lưu vào Database
    $product = Product::create([
        'name' => $validated['name'],
        // 'status' => 1, (nếu có)
    ]);

    return response()->json($product, 201);
}