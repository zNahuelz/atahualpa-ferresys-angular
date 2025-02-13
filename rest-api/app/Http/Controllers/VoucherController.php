<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Voucher;
use App\Models\VoucherDetail;
use Illuminate\Http\Request;

class VoucherController extends Controller
{
    public function createVoucher(Request $request)
    {
        $request->validate([
            'voucherType' => ['required','integer','exists:voucher_types,id'],
            'customerId' => ['required','integer','min:1','exists:customers,id'],
            'cartItems' => ['required','array','min:1'],
            'paid' => ['required','boolean'],
            'subtotal' => ['required','decimal:0,2','gt:0'],
            'igv' => ['required','decimal:0,2','gt:0'],
            'total' => ['required','decimal:0,2','gt:0']
        ]);

        $voucher = Voucher::create([
            'subtotal' => $request->subtotal,
            'total' => $request->total,
            'igv' => $request->igv,
            'paid' => $request->paid,
            'voucher_type' => $request->voucherType,
            'customer_id' => $request->customerId,
        ]); 

        $cartItems = $request->input('cartItems');
        $algo = [];
        foreach($cartItems as $i)
        {
            $productId = $i['product']['id'];
            $amount = $i['amount'];
            $subtotal = $i['subtotal'];
            $unitPrice = $i['product']['sell_price'];
            if(Product::exists($productId))
            {
                $product = Product::find($productId);
                $voucherDetail = VoucherDetail::create([
                    'amount' => $amount,
                    'unit_price' => $unitPrice,
                    'subtotal' => $subtotal,
                    'voucher_id' => $voucher->id,
                    'product_id' => $productId
                ]);
                $newStock = $product->stock - $amount;
                if($newStock <= 0){ $newStock = 0; }
                $product->update([
                    'stock' => $newStock
                ]);
            }
        }
        return response()->json($voucher);
    }
}
