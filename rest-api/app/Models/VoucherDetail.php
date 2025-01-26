<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VoucherDetail extends Model
{
    protected $fillable = [
        'amount',
        'unit_price',
        'subtotal',
        'voucher_id',
        'product_id'
    ];

    public function voucher(): BelongsTo
    {
        return $this->belongsTo(Voucher::class,'voucher_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class,'product_id');
    }
}
