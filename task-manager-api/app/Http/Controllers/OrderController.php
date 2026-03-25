<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    public function store(Request $request)
    {

        $request->validate([
            'IdUser' => 'required|integer',
            'TongTien' => 'required|numeric',
            'IdPT' => 'required|integer',
            'DiaChiDat' => 'required|string',
            'ChiTietDonHang' => 'required|array',
        ]);

        $user = DB::table('user')->where('IdUser', $request->IdUser)->first();

        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'Người dùng không tồn tại'], 404);
        }

        DB::beginTransaction();
        try {
            $donHangId = DB::table('donhang')->insertGetId([
                'IdUser'    => $request->IdUser,
                'DiaChiDat' => $request->DiaChiDat, 
                'TongTien'  => $request->TongTien,
                'IdPT'      => $request->IdPT,
                'IdTT'      => 1,
                'NgayDat'   => now(),
            ]);

            // 3. LƯU CHI TIẾT ĐƠN HÀNG
            $chiTietData = [];
            foreach ($request->ChiTietDonHang as $item) {
                $chiTietData[] = [
                    'IdDH'      => $donHangId,
                    'IdSP'      => $item['IdSP'],
                    'SoLuong'   => $item['SoLuong'],
                ];
            }
            DB::table('chitietdonhang')->insert($chiTietData);

            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => 'Đặt hàng thành công!',
                'user_name' => $user->Ten 
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function getOrdersByUser($idUser)
    {
        try {
            $orders = DB::table('donhang')
                ->where('IdUser', $idUser)
                ->orderBy('NgayDat', 'desc')
                ->get();

            foreach ($orders as $order) {
                $order->details = DB::table('chitietdonhang')
                    ->join('sanpham', 'chitietdonhang.IdSP', '=', 'sanpham.IdSP')
                    ->leftJoin('anhsp', 'sanpham.IdSP', '=', 'anhsp.IdSP')
                    ->where('chitietdonhang.IdDH', $order->IdDH) 
                    ->select(
                        'chitietdonhang.*', 
                        'sanpham.TenSP', 
                        'sanpham.GiaBan',
                        'anhsp.HinhAnh' 
                    )
                    ->get();
 
                $order->TrangThai = "Chờ xác nhận"; 
            }

            return response()->json($orders, 200);

        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}