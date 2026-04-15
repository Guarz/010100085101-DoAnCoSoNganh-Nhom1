<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class UserController extends Controller
{

    // =============================
    // LẤY DANH SÁCH USER
    // =============================
    public function index()
    {
        try {
            $users = DB::table("user")
                ->select(
                    "IdUser as id",
                    "Ten as name",
                    "Email as email"
                )
                ->orderBy("IdUser", "desc")
                ->get();

            return response()->json($users);

        } catch (\Exception $e) {
            return response()->json([
                "error" => $e->getMessage()
            ], 500);
        }
    }


    // =============================
    // THÊM USER
    // =============================
    public function store(Request $request)
    {
        try {

            // Validate dữ liệu
            $request->validate([
                "name" => "required",
                "email" => "required|email",
                "password" => "required|min:6"
            ]);

            // Kiểm tra email trùng
            $exists = DB::table("user")
                ->where("Email", $request->email)
                ->exists();

            if ($exists) {
                return response()->json([
                    "success" => false,
                    "message" => "Email đã tồn tại"
                ], 400);
            }

            // Thêm user
            $id = DB::table("user")->insertGetId([
                "Ten" => $request->name,
                "Email" => $request->email,
                "Password" => bcrypt($request->password),
                "DiaChi" => $request->address ?? "",
                "DienThoai" => $request->phone ?? "",
                "TrangThai" => 1
            ]);

            return response()->json([
                "success" => true,
                "id" => $id
            ]);

        } catch (\Exception $e) {
            return response()->json([
                "error" => $e->getMessage()
            ], 500);
        }
    }


    // =============================
    // CẬP NHẬT USER
    // =============================
    public function update(Request $request, $id)
    {
        try {

            $request->validate([
                "name" => "required",
                "email" => "required|email"
            ]);

            DB::table("user")
                ->where("IdUser", $id)
                ->update([
                    "Ten" => $request->name,
                    "Email" => $request->email
                ]);

            return response()->json([
                "success" => true,
                "message" => "Cập nhật thành công"
            ]);

        } catch (\Exception $e) {
            return response()->json([
                "error" => $e->getMessage()
            ], 500);
        }
    }


    // =============================
    // XÓA USER
    // =============================
    public function destroy($id)
    {
        try {

            DB::table("user")
                ->where("IdUser", $id)
                ->delete();

            return response()->json([
                "success" => true
            ]);

        } catch (\Exception $e) {
            return response()->json([
                "error" => $e->getMessage()
            ], 500);
        }
    }

}