<?php

namespace App\Http\Controllers;

use App\Http\Resources\LocationResource;
use App\Models\Location;
use App\Models\ZipCity;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class LocationController extends Controller
{
    public function getAllLocations(Request $request)
    {
        $role = $request->user()->role;

        if ($role === 'Admin') {
            return LocationResource::collection(Location::all());
        }
    }

    public function delete(Request $request)
    {
        $role = $request->user()->role;
        $locationId = $request->id;
        $location = Location::find($locationId);

        if ($role === 'Admin') {
            $location->delete();
        }

        return LocationResource::collection(Location::all());
    }

    public function create(Request $request)
    {
        $role = $request->user()->role;

        $lat = 56.26392;
        $lng = 11.5;

        if ($role === 'Admin') {
            $request->validate([
                "address" => 'required',
                "zip" => 'required',
                "city" => 'required',
                "numbOfParkingSpaces" => 'required',
                "latLng.lat" => 'required|not_in:' . $lat,
                "latLng.lng" => 'required|not_in:' . $lng
            ]);

            try {
                DB::beginTransaction();

                $zipCity = ZipCity::where('zip', $request->zip)->get()->first();

                if ($zipCity == null) {
                    $zipCity = ZipCity::create([
                        'zip' => $request->zip,
                        'city' => $request->city,
                    ]);
                }

                Location::create([
                    'address' => $request->address,
                    'numbOfParkingSpaces' => $request->numbOfParkingSpaces,
                    'zipCityId' => $zipCity->id,
                    'lat' => $request->latLng['lat'],
                    'lng' => $request->latLng['lng']
                ]);

                DB::commit();
                return LocationResource::collection(Location::all());

            } catch (Exception $e) {
                DB::rollBack();
                return $e;
            }
        }
    }

    public function update(Request $request)
    {
        $role = $request->user()->role;
        $locationId = $request->id;
        $location = Location::find($locationId);

        if ($role === 'Admin') {
            $request->validate([
                "address" => 'required',
                "zip" => 'required',
                "city" => 'required',
                "numbOfParkingSpaces" => 'required',
                "latLng" => 'required',
            ]);

            try {
                DB::beginTransaction();

                $zipCity = ZipCity::where('zip', $request->zip)->get()->first();

                if ($zipCity == null) {
                    $zipCity = ZipCity::create([
                        'zip' => $request->zip,
                        'city' => $request->city,
                    ]);
                }

                $location->update([
                    'address' => $request->address,
                    'numbOfParkingSpaces' => $request->numbOfParkingSpaces,
                    'zipCityId' => $zipCity->id,
                    'lat' => $request->latLng['lat'],
                    'lng' => $request->latLng['lng']
                ]);

                DB::commit();
                return LocationResource::collection(Location::all());

            } catch (Exception $e) {
                DB::rollBack();
                return $e;
            }
        }
    }
}
