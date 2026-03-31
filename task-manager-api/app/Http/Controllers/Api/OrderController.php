<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DonHang;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Lấy danh sách đơn hàng (Admin)
     */
    public function index()
    {
        $orders = DonHang::orderBy('created_at', 'desc')->get();

        return response()->json($orders);
    }

    /**
     * Xem chi tiết 1 đơn hàng
     */
    public function show($id)
    {
        $order = DonHang::find($id);

        if (!$order) {
            return response()->json([
                'message' => 'Đơn hàng không tồn tại'
            ], 404);
        }

        return response()->json($order);
    }

    /**
     * Cập nhật trạng thái đơn hàng
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'trang_thai' => 'required|string'
        ]);

        $order = DonHang::find($id);

        if (!$order) {
            return response()->json([
                'message' => 'Đơn hàng không tồn tại'
            ], 404);
        }

        $order->trang_thai = $request->trang_thai;
        $order->save();

        return response()->json([
            'message' => 'Cập nhật trạng thái đơn hàng thành công',
            'order' => $order
        ]);
    }

    /**
     * Hủy đơn hàng
     */
    public function destroy($id)
    {
        $order = DonHang::find($id);

        if (!$order) {
            return response()->json([
                'message' => 'Đơn hàng không tồn tại'
            ], 404);
        }

        $order->delete();

        return response()->json([
            'message' => 'Hủy đơn hàng thành công'
        ]);
    }
}
