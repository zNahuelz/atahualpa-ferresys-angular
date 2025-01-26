<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Voucher extends Model
{
    protected $fillable = [
        'subtotal',
        'total',
        'igv',
        'paid',
        'voucher_type',
        'customer_id'
    ];

    public function customer(): HasOne
    {
        return $this->hasOne(Customer::class,'customer_id');
    }

    public function voucherType(): HasOne
    {
        return $this->hasOne(VoucherType::class, 'voucher_type');
    }

    public function voucherDetail(): HasMany
    {
        return $this->hasMany(VoucherDetail::class);
    }
}
