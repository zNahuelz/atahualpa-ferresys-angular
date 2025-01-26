<?php

namespace Database\Seeders;

use App\Models\Supplier;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SupplierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Supplier::create([
            'name' => 'ACEROS AREQUIPA',
            'ruc' => '20370146994',
            'address' => 'Car. Panamericana Sur Nro. 241 Panamericana Sur',
            'phone' => '994615443',
            'email' => 'VENTAS@ACEROS_AREQUIPA.COM',
            'description' => '------',
            'visible' => true,
        ]);

        Supplier::create([
            'name' => 'FERROPOLIS PE',
            'ruc' => '20601968607',
            'address' => 'Mza. G Lote. 01 A.H. los Alamos de Ventanilla',
            'phone' => '996192665',
            'email' => 'VENTAS@FERROPOLIS.NET',
            'description' => '------',
            'visible' => true,
        ]);
    }
}
