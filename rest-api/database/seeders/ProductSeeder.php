<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $product = [
            [
                'name' => 'CLAVO ACERADO 1/2',
                'buy_price' => 3.20,
                'sell_price' => 4.5,
                'stock' => 50,
                'visible' => true,
                'supplier_id' => 1,
                'unit_type' => 2,
            ],
            [
                'name' => 'CEMENTO SOL',
                'buy_price' => 16,
                'sell_price' => 32,
                'stock' => 120,
                'visible' => true,
                'supplier_id' => 2,
                'unit_type' => 12,
            ],
            [
                'name' => 'CEMENTO ANDINO',
                'buy_price' => 14.5,
                'sell_price' => 28,
                'stock' => 200,
                'visible' => true,
                'supplier_id' => 2,
                'unit_type' => 12,
            ],
            [
                'name' => 'BARRA DE CONSTRUCCIÓN SP 1/2" x 9MTS',
                'buy_price' => 38,
                'sell_price' => 42.5,
                'stock' => 50,
                'visible' => true,
                'supplier_id' => 1,
                'unit_type' => 1,
            ],
            [
                'name' => 'BARRA DE CONSTRUCCIÓN SP 6MM x 9MTS',
                'buy_price' => 15,
                'sell_price' => 30,
                'stock' => 30,
                'visible' => true,
                'supplier_id' => 1,
                'unit_type' => 1,
            ],
            [
                'name' => 'BARRA DE CONSTRUCCIÓN SP 3/4" x 9MTS',
                'buy_price' => '80',
                'sell_price' => '90',
                'stock' => 34,
                'visible' => true,
                'supplier_id' => 1,
                'unit_type' => 1,
            ],
            [
                'name' => 'BARRA DE CONSTRUCCIÓN SP 12MM x 9MTS',
                'buy_price' => '30',
                'sell_price' => '37',
                'stock' => 45,
                'visible' => true,
                'supplier_id' => 1,
                'unit_type' => 1,
            ],
            [
                'name' => 'ALAMBRE CORRUGADO 4.7MM x 8.80MTS',
                'buy_price' => 3,
                'sell_price' => 5.50,
                'stock' => 34,
                'visible' => true,
                'supplier_id' => 1,
                'unit_type' => 13,
            ],
        ];

        foreach($product as $p)
        {
            Product::create([
                'name' => $p['name'],
                'buy_price' => $p['buy_price'],
                'sell_price' => $p['sell_price'],
                'stock' => $p['stock'],
                'visible' => $p['visible'],
                'supplier_id' => $p['supplier_id'],
                'unit_type' => $p['unit_type'],
            ]);
        }
    }
}
