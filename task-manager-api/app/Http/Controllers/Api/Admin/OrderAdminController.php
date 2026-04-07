<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class OrderAdminController extends Controller
{

    // Danh sách đơn hàng
    public function index()
    {
        $orders = DB::table("donhang")
            ->join("users", "donhang.IdUser", "=", "users.IdUser")
            ->leftJoin("chitietdonhang", "donhang.IdDH", "=", "chitietdonhang.IdDH")
            ->leftJoin("sanpham", "chitietdonhang.IdSP", "=", "sanpham.IdSP")

            ->select(
                "donhang.IdDH as id",
                "users.Ten as customer",
                DB::raw("GROUP_CONCAT(sanpham.TenSP SEPARATOR ', ') as products"),
                DB::raw("SUM(chitietdonhang.TongTien) as total"),
                "donhang.IdTT as status",
                "donhang.NgayDat as date"
            )

            ->groupBy(
                "donhang.IdDH",
                "users.Ten",
                "donhang.IdTT",
                "donhang.NgayDat"
            )

            ->orderBy("donhang.IdDH", "desc")
            ->get();

        return response()->json($orders);
    }



    // Chi tiết đơn hàng
    public function show($id)
    {
        $items = DB::table("chitietdonhang")
            ->join("sanpham", "chitietdonhang.IdSP", "=", "sanpham.IdSP")

            ->select(
                "sanpham.TenSP as product",
                "chitietdonhang.SoLuong as qty",
                "chitietdonhang.TongTien as total"
            )

            ->where("chitietdonhang.IdDH", $id)
            ->get();

        return response()->json($items);
    }



    // Cập nhật trạng thái đơn hàng
    public function updateStatus(Request $request, $id)
    {
        DB::table("donhang")
            ->where("IdDH", $id)
            ->update([
                "IdTT" => $request->status
            ]);

        return response()->json([
            "success" => true
        ]);
    }



    // Xóa đơn hàng
    public function destroy($id)
    {
        DB::beginTransaction();

        // Xóa chi tiết đơn hàng trước
        DB::table("chitietdonhang")
            ->where("IdDH", $id)
            ->delete();

        // Sau đó xóa đơn hàng
        DB::table("donhang")
            ->where("IdDH", $id)
            ->delete();

        DB::commit();

        return response()->json([
            "success" => true
        ]);
    }
}