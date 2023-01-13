<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\ParkingController;
use App\Http\Controllers\VehicleController;
use App\Models\Entry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Public routes
Route::post('/entry', [ParkingController::class, 'entry']);
Route::delete('/exit/{id}', [ParkingController::class, 'exit']);
Route::post('/login', [AuthController::class, 'login']);


// Protected routes
Route::group(['middleware' => ['auth:sanctum']], function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/checktoken', [AuthController::class, 'checkToken']);

    // Vehicle routes
    Route::get('/vehicles', [VehicleController::class, 'getVehiclesById']);
    Route::post('/vehicles', [VehicleController::class, 'create']);
    Route::post('/vehicles/{id}', [VehicleController::class, 'update']);
    Route::delete('/vehicles/{id}', [VehicleController::class, 'delete']);

    // Parking routes
    Route::get('/overallinfo', [ParkingController::class, 'getOverallParkingInfo']);
    Route::get('/entry', [ParkingController::class, 'getAllEntries']);

    // Location routes
    Route::get('/locations', [LocationController::class, 'getAllLocations']);
    Route::post('/locations', [LocationController::class, 'create']);
    Route::post('/locations/{id}', [LocationController::class, 'update']);
    Route::delete('/locations/{id}', [LocationController::class, 'delete']);
});

