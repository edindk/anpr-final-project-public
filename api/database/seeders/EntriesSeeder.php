<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EntriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        {
            DB::table('entries')->insert([
                'numberPlate' => 'DE92799',
                'imagePath' => 'images/entries/car1.png',
                'entryDate' => '2022-11-10 17:22:48',
                'locationId' => 1
            ]);
        }
        {
            DB::table('entries')->insert([
                'numberPlate' => 'BJ24379',
                'imagePath' => 'images/entries/car2.png',
                'entryDate' => '2022-11-10 17:22:48',
                'locationId' => 1
            ]);
        }
        {
            DB::table('entries')->insert([
                'numberPlate' => 'DB39130',
                'imagePath' => 'images/entries/car3.png',
                'entryDate' => '2022-11-10 17:22:48',
                'locationId' => 1
            ]);
        }
        {
            DB::table('entries')->insert([
                'numberPlate' => 'AV95468',
                'imagePath' => 'images/entries/car4.png',
                'entryDate' => '2022-11-10 17:22:48',
                'locationId' => 1
            ]);
        }
        {
            DB::table('entries')->insert([
                'numberPlate' => 'DM26145',
                'imagePath' => 'images/entries/car5.png',
                'entryDate' => '2022-11-10 17:22:48',
                'locationId' => 1
            ]);
        }
    }
}
