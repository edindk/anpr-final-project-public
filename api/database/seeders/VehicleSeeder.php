<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VehicleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('vehicles')->insert([
            'name' => 'Frederiks bil',
            'numberPlate' => 'DE92799',
            'type' => 'Tenant',
            'userId' => 3,
            'locationId' => 1,
            'fromDate' => 'Infinite',
            'toDate' => 'Infinite'
        ]);
        DB::table('vehicles')->insert([
            'name' => 'Gæste bil',
            'numberPlate' => 'BJ24379',
            'type' => 'Guest',
            'userId' => 3,
            'locationId' => 1,
            'fromDate' => date("Y-m-d G:i:s"),
            'toDate' => date("Y-m-d G:i:s")
        ]);
    }
}
