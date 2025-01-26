<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\username;
use Illuminate\Container\Attributes\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => ['required','string','min:5','max:20'],
            'password' => ['required','string','min:5','max:20']
        ]);

        $credentials = $request->only('username','password');
        
        $token = Auth::guard('api')->attempt($credentials);
        if(!$token)
        {
            return response()->json([
                'message' => 'Intento de inicio de sesión fallido.'
            ],401);
        }

        $user = Auth::guard('api')->user();
        return response()->json([
            'auth' => [
                'token' => $token,
                'type' => 'Bearer'
            ]
        ]);
    }

    //TODO!
    public function register(Request $request)
    {
        $request->validate([
            'username' => ['required','string','min:5','max:20'],
            'password' => ['required','string','min:5','max:20'],
            'name' => ['required'],
            'paternal_surname' => ['required'],
            'maternal_surname' => ['required'],
            'email' => ['required','email','max:50'],
            'phone' => ['required','numeric','min:7','max:15']
        ]);

        $user = User::create([
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'name' => strtoupper($request->name),
            'paternal_surname' => strtoupper($request->paternal_surname),
            'maternal_surname' => strtoupper($request->maternal_surname),
            'email' => strtoupper($request->email),
            'phone' => $request->phone,
            'id_rol' => 1
        ]);

        $token = Auth::guard('api')->login($user);

        return response()->json([
            'user' => $user,
            'auth' => [
                'token' => $token,
                'type' => 'Bearer'
            ]
        ]);
    }
}
