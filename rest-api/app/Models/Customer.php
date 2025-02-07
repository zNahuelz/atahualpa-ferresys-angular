<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    use SoftDeletes;

    protected $attributes = [
        'address' => '------',
        'phone' => '000000000',
        'email' => 'EMAIL@DOMINIO.COM'
    ];
    
    protected $fillable = [
        'name',
        'surname',
        'dni',
        'address',
        'phone',
        'email',
    ];

    public function vouchers(): HasMany
    {
        return $this->hasMany(Voucher::class);
    }
}
