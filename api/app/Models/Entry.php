<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Entry extends Model
{
    use HasFactory;

    public $timestamps = false;
    protected $primaryKey = 'id';
    protected $fillable = [
        'numberPlate',
        'imagePath',
        'locationId',
        'entryDate'
    ];

//    protected $with = [
//        'location'
//    ];
//
//    public function location()
//    {
//        return $this->hasOne(Location::class, 'id', 'locationId');
//    }
}
