<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'username' => 'ADMIN',
            'password' => Hash::make('administrador'),
            'name' => 'Pedro',
            'paternal_surname' => 'Guerra',
            'maternal_surname' => 'Salazar',
            'email' => 'administrador@tienda.com',
            'phone' => '999111222',
            'role_id' => 1,
        ]);

        User::create([
            'username' => 'VENDEDOR',
            'password' => Hash::make('vendeDOR2025'),
            'name' => 'Carlos',
            'paternal_surname' => 'Patrick',
            'maternal_surname' => 'Cueva',
            'email' => 'carlitos@gmail.es',
            'phone' => '999222111',
            'role_id' => 2,
        ]);
    }
}
