<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'name',
        'description',
        'buy_price',
        'sell_price',
        'stock',
        'visible',
        'supplier_id',
        'unit_type'
    ];

    public function unitType(): BelongsTo
    {
        return $this->belongsTo(UnitType::class,'unit_type');
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class, 'supplier_id');
    }

    public function voucherDetail(): HasMany
    {
        return $this->hasMany(VoucherDetail::class);
    }
}
