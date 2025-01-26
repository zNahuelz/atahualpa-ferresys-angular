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
        Schema::create('vouchers', function (Blueprint $table) {
            $table->id();
            $table->double('subtotal');
            $table->double('total');
            $table->double('igv');
            $table->boolean('paid');
            $table->unsignedBigInteger('voucher_type');
            $table->unsignedBigInteger('customer_id');
            $table->foreign('voucher_type')->references('id')->on('voucher_types');
            $table->foreign('customer_id')->references('id')->on('customers');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vouchers');
    }
};
