<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Diet;

class CartController extends Controller
{
	public function calculateCart(Request $request)
	{
		$data = $request->all();
		$arr = [];
		$schedule = [
			[
				'date'         => '',
				'day'          => '',
				'breakfast'    => [
					'type'     => '',
					'time'     => '',
					'location' => '',
					'address'  => ''
				],
				'lunch'    => [
					'type'     => '',
					'time'     => '',
					'location' => '',
					'address'  => ''
				],
				'dinner'    => [
					'type'     => '',
					'time'     => '',
					'location' => '',
					'address'  => ''
				]
			]
		];

		foreach ($data as $item) {
			$food = Diet::find($item['id']);
			$price = 0;
			$mealOpt = '';
			$easySunday = false;
			$subname = '';
			if ($item['meal'] == 'singlemeal') {
				// different price calculation
				$mealOpt = 'Single meal';
				$singlemeal = [
					'breakfast' => false,
					'lunch' => false,
					'dinner' => false
				];
				foreach ($item['singleMeal'] as $type => $value) {
					if ($value) {
						$price += $food->priceByType($type, 'price');
						$subname .= $type .', ';
						$singlemeal[$type] = true;
					}
				}
				$price = $price * intVal($item['totalDays']);
				if ($subname != '') {
					$subname = substr($subname, 0, -2);
				}
			} else {
				$pricedata = $food->prices->where('type', $item['meal'])->first();
				$mealOpt = $pricedata->name;
				$price = $pricedata->price;
				$subname = $pricedata->description;
				$singlemeal = [
					'breakfast' => true,
					'lunch' => true,
					'dinner' => true
				];

				if ($item['meal'] == 'weekly') {
					if ($item['easySunday']) {
						$sundayprice = $food->prices->where('type', 'sunday')->first();
						$sp = $sundayprice->price;

						$subname = " and Easy Sunday";
						$price += $sp;
					}
				}

				if ($item['meal'] == 'fullday') {
					// calculate by total days
					$price = $price * intVal($item['totalDays']);
				}
			}
			if ($food->id == 10) {
				// high protein
				$food->name = $item['hp'];
			}
			$arr[] = [
				'id'            => $food->id,
				'category_id'   => $food->category_id,
				'name'          => $food->name,
				'subname'       => $subname,
				'price'         => $price,
				'type'          => $mealOpt,
				'typeraw'       => $item['meal'],
				'easysunday'    => $item['easySunday'],
				'totaldays'     => $item['totalDays'],
				'qty'           => $item['qty'],
				'deliverydate'  => $item['deliverydates']['date'],
				'deliverydates' => $item['deliverydates'],
				'schedule'      => '',
				'singlemeal'    => $singlemeal
			];
		}
		return $arr;
	}
}
