<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SupplierController extends Controller
{

    public function createSupplier(Request $request)
    {
        $request->validate([
            'name' => ['required','string','min:2','max:150'],
            'ruc' => ['required','string','min:11','max:11',Rule::unique('suppliers','ruc')],
            'address' => ['required','max:100'],
            'phone' => ['required','string','min:6','max:15'],
            'email' => ['required','email','max:50'],
            'description' => ['string','max:150'],
        ]);

        $supplier = Supplier::create([
            'name' => trim(strtoupper($request->name)),
            'ruc' => trim($request->ruc),
            'address' => trim($request->address),
            'phone' => trim($request->phone),
            'email' => trim(strtoupper($request->email)),
            'description' => trim($request->description),
        ]);

        return response()->json([
            'message' => 'Proveedor creado con exito.',
            'supplier' => $supplier
        ],201);
    }

    public function updateSupplier(Request $request, $id)
    {
        $oldSupplier = Supplier::find($id);
        if(!$oldSupplier){
            return response()->json(['message' => 'Proveedor de ID: '.$id.' no encontrado.'],404);
        }

        $request->validate([
            'name' => ['required','string','min:2','max:150'],
            'ruc' => ['required','string','min:11','max:11',Rule::unique('suppliers','ruc')->ignore($id)],
            'address' => ['required','max:100'],
            'phone' => ['required','string','min:6','max:15'],
            'email' => ['required','email','max:50'],
            'description' => ['string','max:150'],
            'visible' => ['required','boolean']
        ]);

        $oldSupplier->update([
            'name' => trim(strtoupper($request->name)),
            'ruc' => trim($request->ruc),
            'address' => trim($request->address),
            'phone' => trim($request->phone),
            'email' => trim(strtoupper($request->email)),
            'description' => trim($request->description),
            'visible' => $request->visible,
        ]);

        return response()->json(['message' => 'Proveedor de ID: '.$id.' actualizado con exito.'],200);
    }

    public function deleteSupplier($id)
    {
        $supplier = Supplier::find($id);
        if(!$supplier)
        {
            return response()->json(['message' => 'Proveedor de ID: '.$id.' no encontrado.']);
        }
        $supplier->delete();
        return response()->json(['message' => 'Proveedor de ID: '.$id.' eliminado correctamente.']);          
    }

    public function getSuppliers()
    {
        $suppliers = Supplier::all();
        return response()->json($suppliers);
    }

    public function getSupplier($id)
    {
        $supplier = Supplier::find($id);
        if(!$supplier)
        {
            return response()->json(['message' => 'Proveedor de ID: '.$id.' no encontrado.'],404);
        }
        return response()->json($supplier);
    }

    public function getSupplierByRUC($ruc)
    {
        $supplier = Supplier::where('ruc',$ruc)->first();
        if(!$supplier)
        {
            return response()->json(['message' => 'Proveedor de RUC: '.$ruc.' no encontrado.'],404);
        }
        return response()->json($supplier);
    }

    public function getSupplierByName($name)
    {
        $suppliers = Supplier::where('name','LIKE','%'.$name.'%')->get();
        if(count($suppliers) <= 0)
        {
            return response()->json(['message' => 'Proveedor de NOMBRE: '.$name.' no encontrado.'],404);
        }
        return response()->json($suppliers);
    }

    public function getSupplierByEmail($email)
    {
        $supplier = Supplier::where('email',$email)->first();
        if(!$supplier)
        {
            return response()->json(['message' => 'Proveedor de E-MAIL: '.$email.' no encontrado.'],404);
        }
        return response()->json($supplier);
    }

}
