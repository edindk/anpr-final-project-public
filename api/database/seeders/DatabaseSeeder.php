<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([ZipCitySeeder::class]);
        $this->call([LocationSeeder::class]);
        $this->call([UserSeeder::class]);
        $this->call([EntriesSeeder::class]);
        $this->call([VehicleSeeder::class]);
    }
}
