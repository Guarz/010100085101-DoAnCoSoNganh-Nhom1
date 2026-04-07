<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

use App\Models\GioHang;
use App\Models\DonHang;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    // Tên bảng trong database
    protected $table = 'users';

    // Khóa chính
    protected $primaryKey = 'IdUser';

    // Không dùng created_at và updated_at
    public $timestamps = false;

    // Auto increment
    public $incrementing = true;

    // Các cột cho phép insert/update
    protected $fillable = [
        'Ten',
        'Email',
        'Password',
        'DiaChi',
        'DienThoai',
    ];

    // Ẩn khi trả về JSON
    protected $hidden = [
        'Password',
        'remember_token',
    ];

    // Quan hệ: 1 user có 1 giỏ hàng
    public function GioHang()
    {
        return $this->hasOne(GioHang::class, 'IdUser', 'IdUser');
    }

    // Quan hệ: 1 user có nhiều đơn hàng
    public function DonHang()
    {
        return $this->hasMany(DonHang::class, 'IdUser', 'IdUser');
    }
}