<?php

namespace App\Http\Controllers\Api\Admin;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class DashboardController extends Controller
{
    public function index()
    {
        $revenue = DB::table("chitietdonhang")->sum("TongTien");

        return response()->json([
            "totalProducts" => DB::table("sanpham")->count(),
            "totalCategories" => DB::table("loaisp")->count(),
            "totalOrders" => DB::table("donhang")->count(),
            "totalUsers" => DB::table("user")->count(),
            "totalRevenue" => $revenue
        ]);
    }

    public function revenueChart()
    {
        $data = DB::table("donhang")
            ->join("chitietdonhang", "donhang.IdDH", "=", "chitietdonhang.IdDH")
            ->select(
                DB::raw("MONTH(donhang.NgayDat) as month"),
                DB::raw("SUM(chitietdonhang.TongTien) as revenue")
            )
            ->groupBy(DB::raw("MONTH(donhang.NgayDat)"))
            ->get();

        $result = [];

        for ($i = 1; $i <= 12; $i++) {

            $found = $data->firstWhere('month', $i);

            $result[] = [
                "month" => $i,
                "revenue" => $found ? $found->revenue : 0
            ];
        }

        return response()->json($result);
    }
}