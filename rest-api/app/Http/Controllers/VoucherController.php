<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Voucher;
use App\Models\VoucherDetail;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;

class VoucherController extends Controller
{
    public function createVoucher(Request $request)
    {
        //TODO: Review.
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


    public function getVouchersByMonth(Request $request)
    {
        $dateString = $request->query('date');
        if($dateString)
        {
            try
            {
                $date = Carbon::createFromFormat('Y-m-d',$dateString);
            }
            catch(Exception $ex)
            {
                $date->now();
            }
            $firstDay = $date->copy()->startOfMonth();
            $lastDay = $date->copy()->endOfMonth();
            $vouchers = Voucher::with(['voucherType','customer'])->whereBetween('created_at',[$firstDay,$lastDay])->paginate(50);
            return response()->json($vouchers);
        }
        else
        {
            return response()->json(['message' => 'Debe proporcionar una fecha valida para completar la solicitud.'],400);
        }
    }

    public function getVouchersByRange(Request $request)
    {
        $startDateString = $request->query('startDate');
        $endDateString = $request->query('endDate');
        if($startDateString && $endDateString)
        {
            try
            {
                $startDate = Carbon::createFromFormat('Y-m-d',$startDateString)->startOfDay();
                $endDate = Carbon::createFromFormat('Y-m-d',$endDateString)->endOfDay();
            }
            catch(Exception $ex)
            {
                return response()->json(['message' => 'El rango proporcionado no tiene el formato correcto.'],400);
            }
            $vouchers = Voucher::with(['voucherType','customer'])->whereBetween('created_at',[$startDate,$endDate])->paginate(50);
            return response()->json($vouchers);
        }
    }

    public function getVouchersByCustomerDni($dni)
    {
        $customer = Customer::where('dni',$dni);
        if(!$customer)
        {
            return response()->json(['message' => 'Cliente de DNI: '.$dni.' no encontrado.'],404);
        }
        Voucher::with(['voucherType','customer'])->where('customer_id',$customer->id)->paginate(50);
    }
}
