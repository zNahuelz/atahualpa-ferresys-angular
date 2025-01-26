<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CustomerController extends Controller
{
    public function createCustomer(Request $request)
    {
        $request->validate([
            'name' => ['required','regex:/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]{1,30}$/'],
            'surname' => ['required','regex:/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]{1,30}$/'],
            'dni' => ['required','regex:/^[0-9]{8,9}$/',Rule::unique('customers','dni')],
            'address' => ['string','max:100'],
            'phone' => ['string','regex:/^[1-9]\d{8}$/'],
            'email' => ['email','max:50'],
        ]);

        $customer = Customer::create([
            'name' => trim(strtoupper($request->name)),
            'surname' => trim(strtoupper($request->surname)),
            'dni' => trim($request->dni),
            'address' => trim($request->address),
            'phone' => trim($request->phone),
            'email' => trim(strtoupper($request->email)),
        ]);

        return response()->json([
            'message' => 'Cliente creado correctamente.',
            'customer' => $customer
        ],201);
    }

    public function updateCustomer(Request $request,$id)
    {
        $oldCustomer = Customer::find($id);
        if(!$oldCustomer)
        {
            return response()->json(['message' => 'Cliente de ID: '.$id.' no encontrado'],404);
        }

        $request->validate([
            'name' => ['required','regex:/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]{1,30}$/'],
            'surname' => ['required','regex:/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]{1,30}$/'],
            'dni' => ['required','regex:/^[0-9]{8,9}$/',Rule::unique('customers','dni')->ignore($id)],
            'address' => ['string','max:100'],
            'phone' => ['string','regex:/^[1-9]\d{8}$/'],
            'email' => ['email','max:50'],
        ]);

        $oldCustomer->update([
            'name' => trim(strtoupper($request->name)),
            'surname' => trim(strtoupper($request->surname)),
            'dni' => trim($request->dni),
            'address' => trim($request->address),
            'phone' => trim($request->phone),
            'email' => trim(strtoupper($request->email)),
        ]);

        return response()->json([
            'message' => 'Cliente de ID: '.$id.' actualizado correctamente.'
        ],200);
    }

    public function deleteCustomer($id)
    {
        if(!Customer::exists($id)){
            return response()->json(['message' => 'Cliente de ID: '.$id.' no encontrado.'],404);
        }
        Customer::find($id)->delete();
        return response()->json(['message' => 'Cliente de ID: '.$id.' eliminado con exito.'],200);
    }

    public function getCustomers()
    {
        $customers = Customer::all();
        return response()->json($customers,200);
    }

    public function getCustomer($id)
    {
        $customer = Customer::find($id);
        if(!$customer)
        {
            return response()->json(['message' => 'Cliente de ID: '.$id.' no encontrado.'],404);
        }
        return response()->json($customer);
    }

    public function getCustomerByDNI($dni){
        $customer = Customer::where('dni',$dni)->first();
        if(!$customer)
        {
            return response()->json(['message' => 'Cliente de DNI: '.$dni.' no encontrado'],404);
        }
        return response()->json($customer);
    }

}
