<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Supplier extends Model
{
    use SoftDeletes;
    
    protected $fillable = [
        'name',
        'ruc',
        'address',
        'phone',
        'email',
        'description',
        'visible'
    ];

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}
