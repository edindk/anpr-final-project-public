<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use Illuminate\Http\Request;

class VehicleController extends Controller
{
    public function getVehiclesById(Request $request)
    {
        $id = $request->user()->id;

        return Vehicle::where('userId', str($id))->get();
    }

    public function create(Request $request)
    {
        $userId = $request->user()->id;
        $locationId = $request->user()->locationId;

        $request->validate([
            "name" => 'required',
            "numberPlate" => 'required',
            "type" => 'required',
        ]);

        if ($request->type == 'Tenant') {
            Vehicle::create([
                'name' => $request->name,
                'numberPlate' => $request->numberPlate,
                'type' => $request->type,
                'userId' => $userId,
                'locationId' => $locationId,
                'fromDate' => 'infinite',
                'toDate' => 'infinite'
            ]);
        } else if ($request->type == 'Guest') {
            Vehicle::create([
                'name' => $request->name,
                'numberPlate' => $request->numberPlate,
                'type' => $request->type,
                'userId' => $userId,
                'locationId' => $locationId,
                'fromDate' => $request->fromDate,
                'toDate' => $request->toDate
            ]);
        }

        return Vehicle::where('userId', str($userId))->get();
    }

    public function delete(Request $request)
    {
        $vehicleId = $request->id;
        Vehicle::find($vehicleId)->delete();

        return $this->getVehiclesById($request);
    }

    public function update(Request $request)
    {
        $vehicleId = $request->id;
        $fromDate = 'Infinite';
        $toDate = 'Infinite';;

        $request->validate([
            "name" => 'required',
            "numberPlate" => 'required',
            "type" => 'required',
        ]);

        if ($request->type == 'Guest') {
            $fromDate = $request->fromDate;
            $toDate = $request->toDate;
        }

        Vehicle::where('id', $vehicleId)->update([
            'name' => $request->name,
            'numberPlate' => $request->numberPlate,
            'type' => $request->type,
            'fromDate' => $fromDate,
            'toDate' => $toDate
        ]);

        return $this->getVehiclesById($request);
    }
}
