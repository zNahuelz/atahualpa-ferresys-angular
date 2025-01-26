<?php

namespace Database\Seeders;

use App\Models\Customer;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Customer::create([
            'name' => 'CLIENTE',
            'surname' => 'ORDINARIO',
            'dni' => '00000000',
            'address' => '------',
            'phone' => '000000000',
            'email' => 'CLIENTE@DOMINIO.COM'
        ]);
    }
}
