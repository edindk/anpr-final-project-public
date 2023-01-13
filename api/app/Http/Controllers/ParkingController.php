<?php

namespace App\Http\Controllers;

use App\Events\EntriesEvent;
use App\Http\Resources\EntryResource;
use App\Models\Entry;
use App\Models\Location;
use App\Models\Vehicle;
use Google\Cloud\Vision\V1\ImageAnnotatorClient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ParkingController extends Controller
{
    public function getNumberPlate($image)
    {
        $imageAnnotatorClient = new ImageAnnotatorClient();

        $imageContent = file_get_contents($image);
        $response = $imageAnnotatorClient->textDetection($imageContent);
        $text = $response->getTextAnnotations();

        $arr = explode("\n", $text[0]->getDescription());
        $numberPlate = 'undefined';

        foreach ($arr as $value) {
            $tempValue = preg_replace('/\s+/', '', $value);
            if (strlen($tempValue) == 7) {
                $numberPlate = $tempValue;
            }
        }

        return $numberPlate;
    }

    public function entry(Request $request)
    {
        try {
            Storage::disk('s3')->put('images/entries/' . $request->file('image')->getClientOriginalName(), file_get_contents($request->file('image')));

            Entry::create([
                'numberPlate' => $this->getNumberPlate($request->file('image')),
                'imagePath' => 'images/entries/' . $request->file('image')->getClientOriginalName(),
                'locationId' => $request->locationId,
                'entryDate' => date("Y-m-d G:i:s")
            ]);

            broadcast(new EntriesEvent(EntryResource::collection(Entry::all())));
        } catch (\Exception $e) {
            return $e;
        }

    }

    public function exit(Request $request)
    {
        $entry = Entry::find($request->id);

        Storage::disk('s3')->delete($entry->imagePath);

        Entry::destroy($entry->id);
    }

    public function getAllEntries(Request $request)
    {
        $role = $request->user()->role;
        if ($role === 'Admin') {
            return EntryResource::collection(Entry::all());
        }
    }

    public function getOverallParkingInfo(Request $request)
    {
        $role = $request->user()->role;

        if ($role === 'Admin') {
            $totalParkingSpaces = 0;
            $numbOfInvalidParkings = 0;

            $locations = Location::all();
            $vehicles = Vehicle::all()->toArray();
            $entries = Entry::all()->toArray();

            $newVehicleArr = [];
            foreach ($vehicles as $vehicle) {
                $newVehicleArr[$vehicle['numberPlate']] = $vehicle;
            }

            foreach ($entries as $entry) {
                if (!(array_key_exists($entry['numberPlate'], $newVehicleArr))) {
                    $numbOfInvalidParkings += 1;
                }
            }

            foreach ($locations as $location) {
                $totalParkingSpaces += $location->numbOfParkingSpaces;
            }
        }

        return ['totalParkingSpaces' => $totalParkingSpaces, 'numbOfFreeParkingSpaces' => $totalParkingSpaces - count($entries), 'numbOfInvalidParkings' => $numbOfInvalidParkings];
    }
}
