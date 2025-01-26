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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name',150);
            $table->string('description',255)->default('------');
            $table->double('buy_price');
            $table->double('sell_price');
            $table->integer('stock');
            $table->boolean('visible')->default(true);
            $table->unsignedBigInteger('supplier_id');
            $table->unsignedBigInteger('unit_type');
            $table->foreign('supplier_id')->references('id')->on('suppliers');
            $table->foreign('unit_type')->references('id')->on('unit_types');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
