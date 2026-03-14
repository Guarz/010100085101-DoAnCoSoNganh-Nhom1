<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\SanPham;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Chỉ lấy danh sách sản phẩm để hiển thị
     */
    public function index()
    {
        try {
            // Thử lấy dữ liệu
            $products = SanPham::with(['AnhSP', 'LoaiSP'])->get();

            return response()->json([
                'success' => true,
                'data'    => $products
            ], 200);
        } catch (\Exception $e) {
            // Nếu lỗi, nó sẽ trả về nội dung lỗi cụ thể cho bạn xem thay vì số 500
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(), // Thông báo lỗi
                'line' => $e->getLine(),       // Dòng bị lỗi
                'file' => $e->getFile()        // File bị lỗi
            ], 500);
        }
    }
}
