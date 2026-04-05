<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

use App\Models\LoaiSP;
use App\Models\AnhSP;
use App\Models\ChiTietGioHang;
use App\Models\ChiTietDonHang;

class SanPham extends Model
{
    use HasFactory;

    protected $table = 'sanpham';
    protected $primaryKey = 'IdSP';

    public $timestamps = false;

    protected $fillable = [
        'IdLoai',
        'TenSP',
        'MoTa',
        'NgayTao',
        'Gia',
        'Size'
    ];

    public function LoaiSP()
    {
        return $this->belongsTo(LoaiSP::class, 'IdLoai', 'IdLoai');
    }
    public function AnhSP()
    {
        // SanPham có nhiều ảnh, khóa ngoại nằm bên bảng AnhSP là IdSP
        return $this->hasMany(AnhSP::class, 'IdSP', 'IdSP');
    }

    public function ChiTietGioHang()
    {
        return $this->hasMany(ChiTietGioHang::class, 'IdSP', 'IdSP');
    }

    public function ChiTietDonHang()
    {
        return $this->hasMany(ChiTietDonHang::class, 'IdSP', 'IdSP');
    }
}
