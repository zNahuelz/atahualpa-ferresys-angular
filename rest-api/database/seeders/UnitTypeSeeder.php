<?php

namespace Database\Seeders;

use App\Models\UnitType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UnitTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $units = [
            'UND.',
            'DOCENA',
            'CAJA',
            'BOTELLA 100ML',
            'BOTELLA 500ML',
            'BOTELLA 1LT',
            'BOTELLA 2LT',
            'GALON 4LT',
            'BOLSA 25KG',
            'SACO 20KG',
            'SACO 25KG',
            'SACO 42KG',
            '1MT.'
        ];

        foreach($units as $u)
        {
            UnitType::create([
                'name' => $u
            ]);
        }
    }
}
