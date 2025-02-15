<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class BlobResponseMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if ($response->headers->get('Content-Type') === 'application/pdf' || 
            str_starts_with($response->headers->get('Content-Type'), 'image/')) {
            $response->headers->set('Content-Disposition', 'attachment');
            $response->headers->set('Content-Type', 'application/octet-stream');
        }
        return $response;
    }
}
