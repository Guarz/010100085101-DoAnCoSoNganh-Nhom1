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
        $users = DB::table("users")
            ->select(
                "IdUser as id",
                "Ten as name",
                "Email as email"
            )
            ->orderBy("IdUser", "desc")
            ->get();

        return response()->json($users);
    }


    // =============================
    // THÊM USER
    // =============================
    public function store(Request $request)
    {

        if (!$request->name || !$request->email || !$request->password) {

            return response()->json([
                "success" => false,
                "message" => "Thiếu thông tin"
            ], 400);
        }

        $id = DB::table("users")->insertGetId([

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
    }


    // =============================
    // CẬP NHẬT USER
    // =============================
    public function update(Request $request, $id)
    {

        if (!$request->name || !$request->email) {

            return response()->json([
                "success" => false,
                "message" => "Thiếu thông tin"
            ], 400);
        }

        DB::table("users")
            ->where("IdUser", $id)
            ->update([
                "Ten" => $request->name,
                "Email" => $request->email
            ]);

        return response()->json([
            "success" => true,
            "message" => "Cập nhật thành công"
        ]);
    }


    // =============================
    // XÓA USER
    // =============================
    public function destroy($id)
    {
        DB::table("users")
            ->where("IdUser", $id)
            ->delete();

        return response()->json([
            "success" => true
        ]);
    }

}