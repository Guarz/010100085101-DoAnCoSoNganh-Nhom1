<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\SanPham;

class LoaiSP extends Model
{
    // Tên bảng trong database
    protected $table = 'loaisp';

    // Khóa chính
    protected $primaryKey = 'IdLoai';

    // Bảng không có created_at và updated_at
    public $timestamps = false;

    // Các cột cho phép thêm dữ liệu
    protected $fillable = [
        'TenLoai'
    ];

    // Quan hệ: 1 loại có nhiều sản phẩm
    public function SanPham()
    {
        return $this->hasMany(SanPham::class, 'IdLoai', 'IdLoai');
    }
}