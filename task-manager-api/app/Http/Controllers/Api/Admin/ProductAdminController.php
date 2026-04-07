<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class ProductAdminController extends Controller
{

    // =====================================
    // DANH SÁCH SẢN PHẨM
    // =====================================
    public function index()
    {

        $products = DB::table("sanpham")

            ->leftJoin("loaisp", "sanpham.IdLoai", "=", "loaisp.IdLoai")
            ->leftJoin("anhsp", "sanpham.IdSP", "=", "anhsp.IdSP")

            ->select(
                "sanpham.IdSP as id",
                "sanpham.TenSP as name",
                "sanpham.MoTa as description",
                "sanpham.Gia as price",
                "sanpham.Size as size",
                "sanpham.IdLoai as categoryId",
                "loaisp.TenLoai as category_name",
                "anhsp.HinhAnh as image"
            )

            ->orderBy("sanpham.IdSP", "desc")

            ->get();


        // convert image blob -> base64
        foreach ($products as $p) {

            if ($p->image) {

                $p->image = "data:image/jpeg;base64," . base64_encode($p->image);

            } else {

                $p->image = null;

            }

        }

        return response()->json($products);
    }



    // =====================================
    // THÊM SẢN PHẨM
    // =====================================
    public function store(Request $request)
    {

        try {

            DB::beginTransaction();

            // kiểm tra dữ liệu
            if (!$request->name || !$request->price || !$request->categoryId) {

                return response()->json([
                    "success" => false,
                    "message" => "Thiếu thông tin sản phẩm"
                ], 400);

            }


            // thêm sản phẩm
            $productId = DB::table("sanpham")->insertGetId([

                "TenSP" => $request->name,
                "MoTa" => $request->description ?? "",
                "Gia" => $request->price,
                "Size" => $request->size ?? "M",
                "NgayTao" => now(),
                "IdLoai" => $request->categoryId

            ]);


            // upload ảnh
            if ($request->hasFile("image")) {

                $file = $request->file("image");

                $imageData = file_get_contents($file->getRealPath());

                DB::table("anhsp")->insert([

                    "IdSP" => $productId,
                    "HinhAnh" => $imageData

                ]);

            }


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
            ], 500);

        }
    }



    // =====================================
    // XÓA SẢN PHẨM
    // =====================================
    public function destroy($id)
    {

        try {

            DB::beginTransaction();

            DB::table("anhsp")->where("IdSP", $id)->delete();

            DB::table("sanpham")->where("IdSP", $id)->delete();

            DB::commit();

            return response()->json([
                "success" => true
            ]);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                "success" => false,
                "error" => $e->getMessage()
            ], 500);

        }
    }

}