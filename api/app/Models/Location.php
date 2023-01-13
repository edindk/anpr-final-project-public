<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    use HasFactory;

    public $timestamps = false;
    protected $primaryKey = 'id';
    protected $fillable = [
        'address',
        'numbOfParkingSpaces',
        'zipCityId',
        'lat',
        'lng'
    ];

    protected $with = [
        'zipCity',
    ];

    public function zipCity()
    {
        return $this->hasOne(ZipCity::class, "id", 'zipCityId');
    }
}
