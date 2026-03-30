<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\User\ProductController;
use App\Http\Controllers\OrderController;

/*
|--------------------------------------------------------------------------
| API ROUTES - SHOP QUẦN ÁO
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| AUTHENTICATION
|--------------------------------------------------------------------------
*/

Route::post('/login', function (Request $request) {

    $request->validate([
        'email' => 'required',
        'password' => 'required'
    ]);

    $user = DB::table('user')
        ->where('Email', $request->email)
        ->first();

    if (!$user) {
        return response()->json([
            "success" => false,
            "message" => "Email không tồn tại"
        ]);
    }

    if ($user->Password != $request->password) {
        return response()->json([
            "success" => false,
            "message" => "Mật khẩu không đúng"
        ]);
    }

    // phân quyền
    $role = "user";

    if ($user->Email === "admin@gmail.com") {
        $role = "admin";
    }

    return response()->json([
        "success" => true,
        "message" => "Đăng nhập thành công",
        "user" => [
            "id" => $user->IdUser,
            "name" => $user->Ten,
            "email" => $user->Email,
            "address" => $user->DiaChi,
            "phone" => $user->DienThoai,
            "role" => $role
        ]
    ]);

});


Route::post('/register', [AuthController::class, 'register']);

Route::put('/user/update/{id}', [AuthController::class, 'updateProfile']);


/*
|--------------------------------------------------------------------------
| USER API
|--------------------------------------------------------------------------
*/

Route::prefix('user')->group(function () {

    Route::get('/products', [ProductController::class, 'index']);

    Route::get('/products/{id}', [ProductController::class, 'show']);

});


/*
|--------------------------------------------------------------------------
| ADMIN DASHBOARD
|--------------------------------------------------------------------------
*/

Route::get('/admin/dashboard', function () {

    return response()->json([
        "total_products" => DB::table("sanpham")->count(),
        "total_categories" => DB::table("loaisp")->count(),
        "total_orders" => DB::table("donhang")->count(),
        "total_users" => DB::table("user")->count()
    ]);

});


/*
|--------------------------------------------------------------------------
| CATEGORY MANAGEMENT
|--------------------------------------------------------------------------
*/

Route::prefix('admin/categories')->group(function () {

    Route::get('/', function () {

        return DB::table("loaisp")
            ->select(
                "IdLoai as id",
                "TenLoai as name"
            )
            ->orderBy("IdLoai", "desc")
            ->get();

    });


    Route::post('/', function (Request $request) {

        if (!$request->name) {
            return response()->json([
                "success" => false,
                "message" => "Thiếu tên danh mục"
            ]);
        }

        $id = DB::table("loaisp")->insertGetId([
            "TenLoai" => $request->name
        ]);

        return response()->json([
            "success" => true,
            "id" => $id
        ]);

    });


    Route::put('/{id}', function (Request $request, $id) {

        DB::table("loaisp")
            ->where("IdLoai", $id)
            ->update([
                "TenLoai" => $request->name
            ]);

        return response()->json([
            "success" => true
        ]);

    });


    Route::delete('/{id}', function ($id) {

        DB::table("loaisp")
            ->where("IdLoai", $id)
            ->delete();

        return response()->json([
            "success" => true
        ]);

    });

});


/*
|--------------------------------------------------------------------------
| PRODUCT MANAGEMENT
|--------------------------------------------------------------------------
*/

Route::prefix('admin/products')->group(function () {

    /*
    GET PRODUCT LIST
    */

    Route::get('/', function () {

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

    });



    /*
    ADD PRODUCT
    */

    Route::post('/', function (Request $request) {

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

            $categoryId = $request->categoryId
                ?? DB::table("loaisp")->value("IdLoai");

            $productId = DB::table("sanpham")->insertGetId([

                "TenSP" => $request->name,
                "MoTa" => $request->description ?? "",
                "NgayTao" => now(),
                "IdLoai" => $categoryId,
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

    });



    /*
    DELETE PRODUCT
    */

    Route::delete('/{id}', function ($id) {

        DB::table("sanpham")
            ->where("IdSP", $id)
            ->delete();

        return response()->json([
            "success" => true
        ]);

    });

});


/*
|--------------------------------------------------------------------------
| ORDERS
|--------------------------------------------------------------------------
*/

Route::post('/orders', [OrderController::class, 'store']);

Route::get('/orders/{id}', [OrderController::class, 'getOrdersByUser']);