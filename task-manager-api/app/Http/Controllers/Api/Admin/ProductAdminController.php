<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class ProductAdminController extends Controller
{

    // Lấy danh sách sản phẩm
    public function index()
    {
        $products = DB::table("sanpham")

            ->join("chitietsanpham", "sanpham.IdCT", "=", "chitietsanpham.IdCT")

            ->leftJoin("anhsp", "sanpham.IdAnh", "=", "anhsp.IdAnh")

            ->leftJoin("loaisp", "sanpham.IdLoai", "=", "loaisp.IdLoai")

            ->select(
                "sanpham.IdSP as id",
                "sanpham.TenSP as name",
                "sanpham.MoTa as description",
                "sanpham.IdLoai as categoryId",
                "chitietsanpham.Gia as price",
                "loaisp.TenLoai as category_name",
                "anhsp.HinhAnh as image"
            )

            ->orderBy("sanpham.IdSP", "desc")

            ->get();

        foreach ($products as $p) {
            if ($p->image) {
                $p->image = base64_encode($p->image);
            }
        }

        return response()->json($products);
    }



    // Thêm sản phẩm
    public function store(Request $request)
    {
        try {

            DB::beginTransaction();

            if (!$request->name || !$request->price) {
                return response()->json([
                    "success" => false,
                    "message" => "Thiếu tên hoặc giá"
                ]);
            }

            $imageId = null;

            if ($request->hasFile("image")) {

                $imageData = file_get_contents($request->file("image"));

                $imageId = DB::table("anhsp")->insertGetId([
                    "HinhAnh" => $imageData
                ]);
            }

            $sizeId = DB::table("sizesp")->value("IdSize") ?? 1;

            $detailId = DB::table("chitietsanpham")->insertGetId([
                "Gia" => $request->price,
                "IdSize" => $sizeId
            ]);

            $productId = DB::table("sanpham")->insertGetId([
                "TenSP" => $request->name,
                "MoTa" => $request->description ?? "",
                "NgayTao" => now(),
                "IdLoai" => $request->categoryId,
                "IdCT" => $detailId,
                "IdAnh" => $imageId
            ]);

            DB::commit();

            return response()->json([
                "success" => true,
                "id" => $productId
            ]);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                "success" => false,
                "error" => $e->getMessage()
            ]);
        }
    }



    // Xóa sản phẩm
    public function destroy($id)
    {
        DB::table("sanpham")
            ->where("IdSP", $id)
            ->delete();

        return response()->json([
            "success" => true
        ]);
    }
}