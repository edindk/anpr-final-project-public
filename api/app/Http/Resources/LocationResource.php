<?php

namespace App\Http\Resources;

use App\Models\Entry;
use App\Models\ZipCity;
use Illuminate\Http\Resources\Json\JsonResource;

class LocationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $zipCity = ZipCity::find($this->zipCityId);
        $entriesCount = count(Entry::where('locationId', $this->id)->get()->toArray());


        return [
            'id' => $this->id,
            'zipCity' => ['id' => $zipCity->id, 'zip' => $zipCity->zip,
                'city' => $zipCity->city,],
            'address' => $this->address,
            'numbOfParkingSpaces' => $this->numbOfParkingSpaces,
            'numbOfFreeParkingSpaces' => $this->numbOfParkingSpaces - $entriesCount,
            'lat' => $this->lat,
            'lng' => $this->lng,
        ];
    }
}
