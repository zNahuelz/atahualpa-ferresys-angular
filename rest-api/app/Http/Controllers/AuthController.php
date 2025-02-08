<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Mail\ForgotPasswordMail;
use App\Models\RecoveryToken;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => ['required', 'string', 'min:5', 'max:20'],
            'password' => ['required', 'string', 'min:5', 'max:20']
        ]);

        $credentials = $request->only('username', 'password');

        $token = Auth::guard('api')->attempt($credentials);
        if (!$token) {
            return response()->json([
                'message' => 'Intento de inicio de sesión fallido.'
            ], 401);
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
            'username' => ['required', 'string', 'min:5', 'max:20'],
            'password' => ['required', 'string', 'min:5', 'max:20'],
            'name' => ['required'],
            'paternal_surname' => ['required'],
            'maternal_surname' => ['required'],
            'email' => ['required', 'email', 'max:50'],
            'phone' => ['required', 'numeric', 'min:7', 'max:15']
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

    public function profile()
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['message' => 'Error! Token expirado o invalido.'], 401);
        }
        return response()->json($user);
    }

    public function sendRecoveryMail(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email', 'max:50']
        ]);

        $user = User::where(['email' => $request->email])->first();

        if (!$user) {
            return response()->json([
                'message' => 'Operación completada correctamente. Si el E-Mail ingresado pertenece a un usuario las instrucciones para recuperar tu cuenta seran enviadas.'
            ], 200);
        } else {
            RecoveryToken::where(['email' => $request->email])->delete();
            $hash = Str::random(200);

            $recoveryLink = env('ANGULAR_FRONTEND_URL', 'http://localhost:3000') . '/recover-account?token=' . $hash;

            RecoveryToken::create([
                'email' => $user->email,
                'token' => $hash,
                'expiration' => Carbon::now()->addMinutes(10)
            ]);

            Mail::to($user->email)->send(new ForgotPasswordMail($user, $recoveryLink));
            return response()->json([
                'message' => 'Operación completada correctamente. Si el E-Mail ingresado pertenece a un usuario las instrucciones para recuperar tu cuenta seran enviadas.'
            ], 200);
        }
    }
    
    public function verifyRecoveryToken(Request $request)
    {
        $request->validate(['token' => ['required','string','min:200','max:200']]);
        
        $databaseToken = RecoveryToken::where(['token' => $request->token])->first();
        
        if(!$databaseToken)
        {
            return response()->json(['message' => 'Error! Token expirado o invalido.'],404);
        }
        else {
            $expirationDate = Carbon::parse($databaseToken->expiration);
            $currentDate = Carbon::now();
            if($expirationDate->lessThan($currentDate))
            {
                return response()->json(['message' => 'Error! Token expirado o invalido.'],404);
            }
            return response()->json(['message' => 'Token valido.'],200);
        }
    }
    
    public function changePasswordWithToken(Request $request)
    {
        $request->validate([
           'password' => ['required','string','min:5','max:20'],
           'token' => ['required','string','min:200','max:200']
        ]);
        
        $databaseToken = RecoveryToken::where(['token' => $request->token])->first();
        
        if(!$databaseToken)
        {
            return response()->json(['message' => 'Error! Token expirado o invalido'],404);
        }
        else {
            $expirationDate = Carbon::parse($databaseToken->expiration);
            $currentDate = Carbon::now();
            if($expirationDate->lessThan($currentDate))
            {
                return response()->json(['message' => 'Error! Token expirado o invalido.'],404);
            }
            
            $user = User::where(['email' => $databaseToken->email])->first();
            if(!$user){
                return response()->json(['message' => 'Error! Usuario no encontrado.'],404);
            }
            
            $user->update([
                'password' => Hash::make($request->password)
            ]);
            
            $databaseToken->delete();
            return response()->json([
                'message' => 'Contraseña actualizadas. Inicie sesión con sus nuevas credenciales.',
                'user' => $user
            ],200);
        }
    }
}
