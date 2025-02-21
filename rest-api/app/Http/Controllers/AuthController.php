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
use Illuminate\Validation\Rule;

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

    public function createAccount(Request $request)
    {
        $request->validate([
            'name' => ['required','regex:/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]{1,30}$/'],
            'paternal_surname' => ['required','regex:/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]{1,30}$/'],
            'maternal_surname' => ['required','regex:/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]{1,30}$/'],
            'email' => ['required','email','max:50',Rule::unique('users','email')],
            'phone' => ['required','string','min:6','max:15','regex:/^\+?\d{6,15}$/'],
            'role' => ['required','exists:roles,id']
        ]);

        $username = strtoupper(substr(trim($request->name),0,1))
        .strtoupper(substr(trim($request->paternal_surname),0,1))
        .strtoupper(substr(trim($request->maternal_surname),0,1))
        .trim(str_replace('+','',$request->phone))
        .random_int(1,9);
        $password = strrev($username);

        $user = User::create([
            'username' => $username,
            'password' => Hash::make($password),
            'name' => trim(strtoupper($request->name)),
            'paternal_surname' => trim(strtoupper($request->paternal_surname)),
            'maternal_surname' => trim(strtoupper($request->maternal_surname)),
            'email' => trim(strtoupper($request->email)),
            'phone' => trim($request->phone),
            'role_id' => $request->role,
        ]);
        return response()->json($user,201);
    }

    public function profile()
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['message' => 'Error! Token expirado o invalido.'], 401);
        }
        return response()->json($user->load('role'));
    }

    public function updateAccountData(Request $request)
    {
        $request->validate([
            'id' => ['required','exists:users,id'],
            'oldPassword' => ['required','string','min:5','max:20'],
            'newPassword' => ['required','string','min:5','max:20'],
            'email' => ['required','email','max:50',Rule::unique('users','email')->ignore($request->id)],
            'phone' => ['required','string','min:6','max:15','regex:/^\+?\d{6,15}$/'],
            'username' => ['required','string','min:5','max:20',Rule::unique('users','username')->ignore($request->id)]
        ]);

        $user = User::find(Auth::user()->id);
        if(!$user)
        {
            return response()->json(['message' => 'Error! Token expirado o invalido.'],401);
        }
        $validPassword = Hash::check($request->oldPassword,$user->password);
        if(!$validPassword){
            return response(['message' => 'Oops! Error en la actualización de datos. Credenciales incorrectas.'],400);
        }
        $user->update([
            'password' => Hash::make($request->newPassword),
            'email' => trim(strtoupper($request->email)),
            'phone' => trim($request->phone),
            'username' => trim($request->username),
        ]);
        //TODO: Enviar e-mail de contraseña actualizada!!
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

    public function getUsers()
    {
        $users = User::with('role')->get();
        return response()->json($users,200);
    }

    public function deleteUser($id)
    {
        $user = User::find($id);
        if(!$user)
        {
            return response()->json(['message' => 'Usuario de ID: '.$id.' no encontrado.'],404);
        }
        $user->delete();
        return response()->json(['message' => 'Usuario de ID: '.$id.' eliminado correctamente.']);
    }

    public function resetAccountPassword($id)
    {
        $user = User::find($id);
        if(!$user)
        {
            return response()->json(['message' => 'Usuario de ID: '.$id.' no encontrado.'],404);
        }
        $user->update([
            'password' => Hash::make(trim($user->username))
        ]);
        return response()->json(['message' => 'Contraseña reseteada para el usuario de ID: '.$id, $user]);
    }
}
