<?php

namespace App\Http\Resources;

use App\Models\Location;
use App\Models\Vehicle;
use Illuminate\Http\Resources\Json\JsonResource;

class EntryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'numberPlate' => $this->numberPlate,
            'imagePath' => $this->imagePath,
            'location' => LocationResource::collection([Location::find($this->locationId)]),
            'entryDate' => $this->entryDate,
            'status' => $this->checkNumberPLate($this->numberPlate)
        ];
    }

    public function checkNumberPLate($numberPlate)
    {
        $vehicle = Vehicle::where('numberPlate', $numberPlate)->first();
        $status = 'Invalid';

        if (isset($vehicle)) {
            $status = 'Valid';
        }

        return $status;
    }
}
