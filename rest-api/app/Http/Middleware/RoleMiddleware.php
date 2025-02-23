<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if(Auth::check())
        {
            $userRole = Auth::user()->role->name;
            foreach($roles as $role)
            {
                if($userRole == $role)
                {
                    $request->headers->set('Accept','application/json');
                    return $next($request);
                }
            }
        }
        return response()->json([
            'message' => 'Permisos insuficientes para realizar acción o token invalido.'
        ],401);
    }
}
