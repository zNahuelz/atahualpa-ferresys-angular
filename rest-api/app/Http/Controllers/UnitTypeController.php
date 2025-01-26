<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\UnitType;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UnitTypeController extends Controller
{

    public function createUnitType(Request $request)
    {
        $request->validate([
            'name' => ['required','string','min:3','max:100',Rule::unique('unit_types','name')]
        ]);
        $unitType = UnitType::create([
            'name' => trim(strtoupper($request->name))
        ]);
        return response()->json([
            'message' => 'Presentación creada con exito.',
            'unit_type' => $unitType
        ]);
    }

    public function updateUnitType(Request $request, $id)
    {
        $oldUnitType = UnitType::find($id);
        if(!$oldUnitType)
        {
            return response()->json(['message' => 'Presentación de ID: '.$id.' no encontrada.'],404);
        }

        $request->validate([
            'name' => ['required','string','min:3','max:100',Rule::unique('unit_types','name')->ignore($id)]
        ]);

        $oldUnitType->update([
            'name' => trim(strtoupper($request->name))
        ]);

        return response()->json(['message' => 'Presentación de ID: '.$id.' actualizada con exito.'],200);
    }

    public function getUnitTypes()
    {
        $unitTypes = UnitType::all();
        return response()->json($unitTypes);
    }

    public function getUnitType($id)
    {
        $unitType = UnitType::find($id);
        if(!$unitType)
        {
            return response()->json(['message' => 'Presentación de ID: '.$id.' no encontrada.'],404);
        }
        return response()->json($unitType);
    }

    public function getUnitTypeByName($name)
    {
        $unitTypes = UnitType::where('name','LIKE','%'.$name.'%')->get();
        if(count($unitTypes) <= 0)
        {
            return response()->json(['message' => 'Presentación de NOMBRE: '.$name.' no encontrada.'],404);
        }
        return response()->json($unitTypes);
    }
}
