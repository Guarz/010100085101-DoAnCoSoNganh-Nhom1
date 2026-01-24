<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

/* API Đăng nhập */
Route::post('/login', function (Request $request) {
    // Kiểm tra email trong bảng users
    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json(['success' => false, 'message' => 'Sai tài khoản hoặc mật khẩu!'], 401);
    }

    return response()->json(['success' => true, 'user' => $user]);
});

/* API Sản phẩm & Danh mục */
// Lấy 53 sản phẩm từ bảng products
Route::get('/get-products', function() {
    return DB::table('products')->get(); 
});

// Lấy 6 danh mục từ bảng categories
Route::get('/get-categories', function() {
    return DB::table('categories')->get();
});

// Xóa sản phẩm theo ID
Route::delete('/products/{id}', function($id) {
    return DB::table('products')->where('product_id', $id)->delete();
});