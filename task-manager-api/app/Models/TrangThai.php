<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrangThai extends Model
{
    protected $table = 'TrangThai';
    protected $primaryKey = 'IdTT';
    public function DonHang()
{
    return $this->hasMany(DonHang::class, 'IdTT', 'IdTT');
}
}
