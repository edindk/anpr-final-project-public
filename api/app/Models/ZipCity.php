<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ZipCity extends Model
{
    use HasFactory;

    protected $table = 'zipCity';
    public $timestamps = false;
    protected $primaryKey = 'id';
    protected $fillable = [
        'zip',
        'city',
    ];
}
