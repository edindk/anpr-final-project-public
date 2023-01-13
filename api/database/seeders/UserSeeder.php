<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        {
            DB::table('users')->insert([
                'name' => 'Admin',
                'email' => 'admin@anpr.com',
                'password' => bcrypt('password'),
                'role' => 'Admin',
                'locationId' => null
            ]);
        }
        {
            DB::table('users')->insert([
                'name' => 'Jan',
                'email' => 'jan@anpr.com',
                'password' => bcrypt('password'),
                'role' => 'Customer',
                'locationId' => 1
            ]);
        }
        {
            DB::table('users')->insert([
                'name' => 'Frederik',
                'email' => 'frederik@anpr.com',
                'password' => bcrypt('password'),
                'role' => 'Customer',
                'locationId' => 1
            ]);
        }
    }
}
