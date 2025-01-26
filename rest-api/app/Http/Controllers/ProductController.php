<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\UnitType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    public function createProduct(Request $request)
    {
        //TODO: Description is always default.
        $request->validate([
            'name' => ['required','string','min:2','max:150'],
            'description' => ['max:255'],
            'buy_price' => ['required','numeric','regex:/^\d+(\.\d{1,2})?$/'],
            'sell_price' => ['required','numeric','regex:/^\d+(\.\d{1,2})?$/'],
            'stock' => ['required','numeric'],
            'supplier_id' => ['required','numeric','exists:suppliers,id'],
            'unit_type_id' => ['required','numeric','exists:unit_types,id'],
            'visible' => ['required','boolean']
        ]);

        $product = Product::create([
            'name' => trim(strtoupper($request->name)),
            'description' => trim($request->description),
            'buy_price' => $request->buy_price,
            'sell_price' => $request->sell_price,
            'stock' => $request->stock,
            'supplier_id' => $request->supplier_id,
            'unit_type' => $request->unit_type_id,
            'visible' => $request->visible,
        ]);

        return response()->json([
            'message' => 'Producto creado con exito.',
            'product' => $product
        ],201);
    }

    public function updateProduct(Request $request,$id)
    {
        $oldProduct = Product::find($id);
        if(!$oldProduct){
            return response()->json(['message' => "Producto de ID: ".$id." no encontrado."],404);
        }

        $request->validate([
            'name' => ['required','string','min:2','max:150'],
            'description' => ['max:255'],
            'buy_price' => ['required','numeric','regex:/^\d+(\.\d{1,2})?$/'],
            'sell_price' => ['required','numeric','regex:/^\d+(\.\d{1,2})?$/'],
            'stock' => ['required','numeric'],
            'supplier_id' => ['required','exists:suppliers,id'],
            'unit_type_id' => ['required','exists:unit_types,id'],
            'visible' => ['required','boolean']
        ]);

        $oldProduct->update([
            'name' => trim(strtoupper($request->name)),
            'description' => trim($request->description),
            'buy_price' => $request->buy_price,
            'sell_price' => $request->sell_price,
            'stock' => $request->stock,
            'supplier_id' => $request->supplier_id,
            'unit_type' => $request->unit_type_id,
            'visible' => $request->visible,
        ]);

        return response()->json([
            'message' => 'Producto de ID: '.$id.' actualizado con exito.',
        ],200);
    }

    public function deleteProduct($id){
        if(!Product::exists($id)){
            return response()->json(['message' => 'Producto de ID: '.$id.' no encontrado.'],404);
        }
        Product::find($id)->delete();
        return response()->json(['message' => 'Producto de ID: '.$id.' eliminado con exito.'],200);
    }

    public function getProducts()
    {
        $products = Product::with(['supplier','unitType'])->get(); //TODO Check!
        return response()->json($products);
    }

    public function getProductsByName($name)
    {
        $products = Product::with(['supplier','unitType'])->where('name','LIKE','%'.$name.'%')->get();
        return response()->json($products);
    }

    public function getProductsByDescription($description)
    {
        $products = Product::with(['supplier','unitType'])->where('description','LIKE','%'.$description.'%')->get();
        return response()->json($products);
    }

    public function getProductsByUnitType($unitType)
    {
        $products = Product::with(['supplier','unitType'])->whereHas('unitType', function($query) use ($unitType){
            $query->where('id',$unitType);
        })->get();
        return response()->json($products);
    }

    public function getProduct($id)
    {
        $product = Product::with(['supplier','unitType'])->find($id); //TODO Check!
        if(!$product)
        {
            return response()->json([
                'message' => 'Producto de ID: '.$id.' no encontrado.'
            ],404);
        }
        
        return response()->json($product);
    }

    public function getProductsPaginated()
    {
        $products = Product::all()->paginate(50);
        return response()->json($products);
    }
}
