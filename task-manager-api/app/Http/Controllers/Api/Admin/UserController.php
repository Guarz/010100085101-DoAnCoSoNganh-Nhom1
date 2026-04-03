<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class UserController extends Controller
{

    // Lấy danh sách user
    public function index()
    {
        $users = DB::table("user")
            ->select(
                "IdUser as id",
                "Ten as name",
                "Email as email",
                "NgayTao as created_at"
            )
            ->orderBy("IdUser", "desc")
            ->get();

        return response()->json($users);
    }



    // Cập nhật user
    public function update(Request $request, $id)
    {
        if (!$request->name || !$request->email) {

            return response()->json([
                "success" => false,
                "message" => "Thiếu thông tin"
            ], 400);
        }

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
    }



    // Xóa user
    public function destroy($id)
    {
        DB::table("user")
            ->where("IdUser", $id)
            ->delete();

        return response()->json([
            "success" => true
        ]);
    }

}