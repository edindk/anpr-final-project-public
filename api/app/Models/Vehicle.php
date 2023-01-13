<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;

    public $timestamps = false;
    protected $primaryKey = 'id';
    protected $fillable = [
        'name',
        'numberPlate',
        'type',
        'userId',
        'locationId',
        'fromDate',
        'toDate'
    ];

    protected $with = [
        'location',
    ];

    public function location()
    {
        return $this->hasOne(Location::class, "id", 'locationId');
    }
}
