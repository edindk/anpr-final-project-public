<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('locations')->insert([
            'address' => 'Forchhammersvej 9',
            'numbOfParkingSpaces' => 50,
            'zipCityId' => 1,
            'lat' => 57.035410,
            'lng' => 9.913770
        ]);

        DB::table('locations')->insert([
            'address' => 'Ryesgade',
            'numbOfParkingSpaces' => 10,
            'zipCityId' => 1,
            'lat' => 57.053820,
            'lng' => 9.903030
        ]);
    }
}
