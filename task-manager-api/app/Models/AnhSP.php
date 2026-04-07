<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\SanPham;

class AnhSP extends Model
{
    // Tên bảng
    protected $table = 'anhsp';

    // Khóa chính
    protected $primaryKey = 'IdAnh';

    // Không dùng created_at / updated_at
    public $timestamps = false;

    // Các cột cho phép thêm dữ liệu
    protected $fillable = [
        'IdSP',
        'HinhAnh'
    ];

    // Quan hệ: ảnh thuộc về sản phẩm
    public function sanpham()
    {
        return $this->belongsTo(SanPham::class, 'IdSP', 'IdSP');
    }
}