<?php

namespace Database\Seeders;

use App\Models\VoucherType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VoucherTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        VoucherType::create([
            'name' => 'BOLETA'
        ]);
        VoucherType::create([
            'name' => 'FACTURA'
        ]);
    }
}
