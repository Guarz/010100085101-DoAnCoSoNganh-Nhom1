<?php

namespace App\Http\Controllers\Api\Admin;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        return DB::table("loaisp")
            ->select("IdLoai as id", "TenLoai as name")
            ->orderBy("IdLoai", "desc")
            ->get();
    }

    public function store(Request $request)
    {
        $id = DB::table("loaisp")->insertGetId([
            "TenLoai" => $request->name
        ]);

        return response()->json([
            "success" => true,
            "id" => $id
        ]);
    }

    public function update(Request $request, $id)
    {
        DB::table("loaisp")
            ->where("IdLoai", $id)
            ->update([
                "TenLoai" => $request->name
            ]);

        return response()->json(["success" => true]);
    }

    public function destroy($id)
    {
        DB::table("loaisp")
            ->where("IdLoai", $id)
            ->delete();

        return response()->json(["success" => true]);
    }
}