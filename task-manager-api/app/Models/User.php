<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Tắt chế độ tự động cập nhật created_at và updated_at
     * Vì bảng users trong database webbanhang của bạn không có 2 cột này
     */
    public $timestamps = false;

    /**
     * Các trường có thể nhập dữ liệu vào
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * Ẩn mật khẩu khi xuất dữ liệu API
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Định dạng kiểu dữ liệu
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
}