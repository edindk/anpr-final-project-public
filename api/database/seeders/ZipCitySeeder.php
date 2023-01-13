<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ZipCitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('zipCity')->insert([
            'zip' => 9000,
            'city' => 'Aalborg'
        ]);
        DB::table('zipCity')->insert([
            'zip' => 8700,
            'city' => 'Horsens'
        ]);
    }
}
