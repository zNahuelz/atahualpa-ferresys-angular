<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('suppliers', function (Blueprint $table) {
            $table->id();
            $table->string('name',150);
            $table->string('ruc',11)->default('00000000000');
            $table->string('address',100);
            $table->string('phone',15)->default('000000000');
            $table->string('email',50)->default('EMAIL@DOMINIO.COM');
            $table->string('description',150)->default('PROVEEDOR GENERAL');
            $table->double('visible')->default(true);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('suppliers');
    }
};
