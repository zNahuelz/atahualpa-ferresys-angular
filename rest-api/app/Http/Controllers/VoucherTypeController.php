<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\VoucherType;
use Illuminate\Http\Request;

class VoucherTypeController extends Controller
{
    public function getVoucherTypes()
    {
        $voucherTypes = VoucherType::all();
        return response()->json($voucherTypes);
    }
}
