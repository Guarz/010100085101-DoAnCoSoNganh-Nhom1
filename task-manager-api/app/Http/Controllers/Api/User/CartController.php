<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChiTietGioHang;
use App\Models\GioHang;
// use App\Models\User;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function getCartByUserId($idUser)
    {
        $gioHang = GioHang::firstOrCreate(['IdUser' => $idUser]);
        $listItems = ChiTietGioHang::where('IdGH', $gioHang->IdGH)
            ->with(['SanPham.anhSP', 'SanPham.chiTietSanPham'])
            ->get();

        if ($listItems->isEmpty()) {
            return response()->json([
                'success' => true,
                'products' => [],
                'cart_id' => $gioHang->IdGH
            ]);
        }

        $items = $listItems->map(function ($ct) {
            $sp = $ct->SanPham;

            return [
                'IdSP'     => $sp->IdSP,
                'TenSP'    => $sp->TenSP,
                'quantity' => $ct->SoLuong, 
                'Gia'      => $sp->chiTietSanPham->Gia ?? 0,
                'HinhAnh'  => $sp->anhSP ? 'data:image/jpeg;base64,' . base64_encode($sp->anhSP->HinhAnh) : null,
            ];
        });

        return response()->json([
            'success' => true,
            'cart_id' => $gioHang->IdGH,
            'products' => $items
        ]);
    }
    public function addToCart(Request $request)
    {
        $idUser = $request->IdUser;
        $idSP = $request->IdSP;
        $soLuongThem = $request->SoLuong;

        $gioHang = GioHang::firstOrCreate(['IdUser' => $idUser]);

        $chiTiet = ChiTietGioHang::where('IdGH', $gioHang->IdGH)
            ->where('IdSP', $idSP)
            ->first();

        if ($chiTiet) {
            $chiTiet->SoLuong += $soLuongThem;
            $chiTiet->save();
        } else {
            ChiTietGioHang::create([
                'IdGH' => $gioHang->IdGH,
                'IdSP' => $idSP,
                'SoLuong' => $soLuongThem
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Đã thêm sản phẩm vào giỏ hàng',
            'IdGH' => $gioHang->IdGH
        ]);
    }
    public function updateQty(Request $request)
    {
        $gioHang = GioHang::where('IdUser', $request->IdUser)->first();

        if (!$gioHang) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy giỏ hàng'], 404);
        }

        $chiTiet = ChiTietGioHang::where('IdGH', $gioHang->IdGH)
            ->where('IdSP', $request->IdSP)
            ->first();

        if ($chiTiet) {
            $chiTiet->SoLuong = $request->SoLuong; 
            $chiTiet->save();
            return response()->json(['success' => true]);
        }

        return response()->json(['success' => false, 'message' => 'Sản phẩm không tồn tại'], 404);
    }

    public function removeItem(Request $request)
    {
        $gioHang = GioHang::where('IdUser', $request->IdUser)->first();

        if (!$gioHang) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy giỏ hàng'], 404);
        }

        $deleted = ChiTietGioHang::where('IdGH', $gioHang->IdGH)
            ->where('IdSP', $request->IdSP)
            ->delete();

        if ($deleted) {
            return response()->json(['success' => true, 'message' => 'Xóa thành công']);
        }

        return response()->json(['success' => false, 'message' => 'Sản phẩm không tồn tại'], 404);
    }
}