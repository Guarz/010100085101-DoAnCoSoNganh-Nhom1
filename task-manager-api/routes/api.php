<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\User\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\Api\CartController;



Route::post('/login', function (Request $request) {

    $request->validate([
        'email' => 'required|email',
        'password' => 'required'
    ]);

    $user = DB::table('user')
        ->where('Email', $request->email)
        ->first();

    if (!$user || $user->Password != $request->password) {
        return response()->json([
            "success" => false,
            "message" => "Email hoặc mật khẩu không đúng"
        ], 401);
    }

    return response()->json([
        "success" => true,
        "message" => "Đăng nhập thành công",
        "user" => [
            "id" => $user->IdUser,
            "name" => $user->Ten,
            "email" => $user->Email,
            "role" => "user"
        ]
    ]);
});


Route::post('/admin-login', function (Request $request) {

    $request->validate([
        'email' => 'required|email',
        'password' => 'required'
    ]);

    $admin = DB::table('admin')
        ->where('Email', $request->email)
        ->first();

    if (!$admin || $admin->Password != $request->password) {

        return response()->json([
            "success" => false,
            "message" => "Tài khoản quản trị không chính xác"
        ], 401);
    }

    return response()->json([
        "success" => true,
        "message" => "Chào mừng Admin quay trở lại",
        "user" => [
            "id" => $admin->idAdmin,
            "name" => $admin->TenAdmin,
            "email" => $admin->Email,
            "role" => "admin"
        ]
    ]);
});


Route::post('/register', [AuthController::class, 'register']);
Route::put('/user/update/{id}', [AuthController::class, 'updateProfile']);


/*
|--------------------------------------------------------------------------
<<<<<<< Updated upstream
| ADMIN DASHBOARD
|--------------------------------------------------------------------------
*/

Route::get('/admin/dashboard', function () {

    return response()->json([
        "totalProducts" => DB::table("sanpham")->count(),
        "totalCategories" => DB::table("loaisp")->count(),
        "totalOrders" => DB::table("donhang")->count(),
        "totalUsers" => DB::table("user")->count()
    ]);
});


/*
|--------------------------------------------------------------------------
| ADMIN CATEGORY
|--------------------------------------------------------------------------
*/

Route::prefix('admin/categories')->group(function () {

    Route::get('/', function () {

        return DB::table("loaisp")
            ->select("IdLoai as id", "TenLoai as name")
            ->orderBy("IdLoai", "desc")
            ->get();
    });

    Route::post('/', function (Request $request) {

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

        return response()->json(["success" => true]);
    });

    Route::delete('/{id}', function ($id) {

        DB::table("loaisp")
            ->where("IdLoai", $id)
            ->delete();

        return response()->json(["success" => true]);
    });
});


/*
|--------------------------------------------------------------------------
| ADMIN PRODUCTS
|--------------------------------------------------------------------------
*/

Route::prefix('admin/products')->group(function () {

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
});


/*
|--------------------------------------------------------------------------
| ADMIN ORDERS
|--------------------------------------------------------------------------
*/

Route::prefix('admin/orders')->group(function () {

    Route::get('/', function () {

        return DB::table("donhang")

            ->join("user", "donhang.IdUser", "=", "user.IdUser")

            ->leftJoin("chitietdonhang", "donhang.IdDonHang", "=", "chitietdonhang.IdDonHang")

            ->leftJoin("sanpham", "chitietdonhang.IdSP", "=", "sanpham.IdSP")

            ->select(
                "donhang.IdDonHang as id",
                "user.Ten as customer",
                DB::raw("GROUP_CONCAT(sanpham.TenSP SEPARATOR ', ') as products"),
                "donhang.TongTien as total",
                "donhang.TrangThai as status",
                "donhang.NgayTao as created_at"
            )

            ->groupBy(
                "donhang.IdDonHang",
                "user.Ten",
                "donhang.TongTien",
                "donhang.TrangThai",
                "donhang.NgayTao"
            )

            ->orderBy("donhang.IdDonHang", "desc")

            ->get();
    });
});


/*
|--------------------------------------------------------------------------
| ADMIN USERS
|--------------------------------------------------------------------------
*/

Route::prefix('admin/users')->group(function () {

    Route::get('/', function () {

        return DB::table("user")

            ->select(
                "IdUser as id",
                "Ten as name",
                "Email as email",
                "NgayTao as created_at"
            )

            ->orderBy("IdUser", "desc")

            ->get();
    });

    Route::delete('/{id}', function ($id) {

        DB::table("user")
            ->where("IdUser", $id)
            ->delete();

        return response()->json([
            "success" => true
        ]);
    });
});


// USER ROUTES Đm thằng nào Admin mà làm chỗ này t đánh chết >:( 

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

Route::get('/user/cart/{idUser}', [CartController::class, 'getCartByUserId']);

Route::post('/cart/add', [CartController::class, 'addToCart']);

Route::post('/cart/update', [CartController::class, 'updateQty']);

Route::post('/cart/remove', [CartController::class, 'removeItem']);

Route::post('/orders', [OrderController::class, 'store']);
Route::get('/orders/{id}', [OrderController::class, 'getOrdersByUser']);
=======
| AUTH
|--------------------------------------------------------------------------
*/
Route::post('/login', function (Request $request) {
    $user = DB::table('user')->where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json([
            'success' => false,
            'message' => 'Sai email hoặc mật khẩu'
        ], 401);
    }

    return response()->json([
        'success' => true,
        'user' => $user
    ]);
});

/*
|--------------------------------------------------------------------------
| SẢN PHẨM
|--------------------------------------------------------------------------
*/

/**
 * Lấy danh sách sản phẩm
 */
Route::get('/sanpham', function () {
    return DB::table('sanpham')
        ->join('loaisp', 'sanpham.maloai', '=', 'loaisp.maloai')
        ->select(
            'sanpham.masp',
            'sanpham.tensp',
            'sanpham.gia',
            'sanpham.soluong',
            'loaisp.tenloai'
        )
        ->orderBy('sanpham.masp', 'desc')
        ->get();
});

/**
 * Thêm sản phẩm
 */
Route::post('/sanpham', function (Request $request) {

    if (
        !$request->tensp ||
        !$request->gia ||
        !$request->soluong ||
        !$request->maloai
    ) {
        return response()->json([
            'success' => false,
            'message' => 'Thiếu dữ liệu'
        ], 400);
    }

    DB::table('sanpham')->insert([
        'tensp' => $request->tensp,
        'gia' => $request->gia,
        'soluong' => $request->soluong,
        'maloai' => $request->maloai
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Thêm sản phẩm thành công'
    ]);
});

/**
 * Xóa sản phẩm
 */
Route::delete('/sanpham/{id}', function ($id) {
    DB::table('sanpham')->where('masp', $id)->delete();

    return response()->json([
        'success' => true
    ]);
});

/*
|--------------------------------------------------------------------------
| ĐƠN HÀNG
|--------------------------------------------------------------------------
*/

/**
 * Danh sách đơn hàng
 */
Route::get('/donhang', function () {
    return DB::table('donhang')
        ->join('user', 'donhang.user_id', '=', 'user.user_id')
        ->join('trangthai', 'donhang.matt', '=', 'trangthai.matt')
        ->select(
            'donhang.madh',
            'user.name',
            'donhang.ngaydat',
            'donhang.tongtien',
            'trangthai.tentt'
        )
        ->orderBy('donhang.madh', 'desc')
        ->get();
});

/**
 * Chi tiết đơn hàng
 */
Route::get('/donhang/{id}', function ($id) {

    $donhang = DB::table('donhang')
        ->where('madh', $id)
        ->first();

    if (!$donhang) {
        return response()->json(['message' => 'Không tìm thấy đơn hàng'], 404);
    }

    $chitiet = DB::table('chitietdonhang')
        ->join('sanpham', 'chitietdonhang.masp', '=', 'sanpham.masp')
        ->where('chitietdonhang.madh', $id)
        ->select(
            'sanpham.tensp',
            'chitietdonhang.soluong',
            'chitietdonhang.dongia'
        )
        ->get();

    return response()->json([
        'donhang' => $donhang,
        'chitiet' => $chitiet
    ]);
});

/**
 * Cập nhật trạng thái đơn hàng
 */
Route::put('/donhang/{id}/trangthai', function (Request $request, $id) {

    if (!$request->matt) {
        return response()->json([
            'success' => false,
            'message' => 'Thiếu trạng thái'
        ], 400);
    }

    DB::table('donhang')
        ->where('madh', $id)
        ->update(['matt' => $request->matt]);

    return response()->json([
        'success' => true
    ]);
});
>>>>>>> Stashed changes
