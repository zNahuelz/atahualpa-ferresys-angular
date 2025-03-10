<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>FERRETERIA ATAHUALPA - {{ $data->voucherType->name }} #{{ $data->id }}</title>

		<style>
			.invoice-box {
				max-width: 800px;
				margin: auto;
				padding: 30px;
				border: 1px solid #eee;
				box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
				font-size: 16px;
				line-height: 24px;
				font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
				color: #555;
			}

			.invoice-box table {
				width: 100%;
				line-height: inherit;
				text-align: left;
			}

			.invoice-box table td {
				padding: 5px;
				vertical-align: top;
			}

			.invoice-box table tr td:nth-child(2) {
				text-align: right;
			}

			.invoice-box table tr.top table td {
				padding-bottom: 20px;
			}

			.invoice-box table tr.top table td.title {
				font-size: 45px;
				line-height: 45px;
				color: #333;
			}

			.invoice-box table tr.information table td {
				padding-bottom: 40px;
			}

			.invoice-box table tr.heading td {
				background: #eee;
				border-bottom: 1px solid #ddd;
				font-weight: bold;
			}

			.invoice-box table tr.details td {
				padding-bottom: 20px;
			}

			.invoice-box table tr.item td {
				border-bottom: 1px solid #eee;
			}

			.invoice-box table tr.item.last td {
				border-bottom: none;
			}

			.invoice-box table tr.total td:nth-child(2) {
				border-top: 2px solid #eee;
				font-weight: bold;
			}

			@media only screen and (max-width: 600px) {
				.invoice-box table tr.top table td {
					width: 100%;
					display: block;
					text-align: center;
				}

				.invoice-box table tr.information table td {
					width: 100%;
					display: block;
					text-align: center;
				}
			}

			/** RTL **/
			.invoice-box.rtl {
				direction: rtl;
				font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
			}

			.invoice-box.rtl table {
				text-align: right;
			}

			.invoice-box.rtl table tr td:nth-child(2) {
				text-align: left;
			}
		</style>
	</head>

	<body>
		<div class="invoice-box">
			<table cellpadding="0" cellspacing="0">
				<tr class="top">
					<td colspan="4">
						<table>
							<tr>
								<td class="title">
									<img
										src="{{ $image }}"
										style="width: 100px; height: 100px;"
									/>
								</td>

								<td>
									{{ $data->voucherType->name }} #{{ $data->id }}<br />
									Emisión: {{ $data->created_at->format('d-m-Y h:i A') }}<br />
								</td>
							</tr>
						</table>
					</td>
				</tr>

				<tr class="information">
					<td colspan="4">
						<table>
							<tr>
								<td>
									FERRETERIA ATAHUALPA<br />
									Aija 4900<br />
									Los Olivos 15304
								</td>
								<td>
									CLIENTE<br />
									{{ $data->customer->name }} {{ $data->customer->surname }}<br />
									{{ $data->customer->email }}
								</td>
							</tr>
						</table>
					</td>
				</tr>

				<tr class="heading">
					<td>Método de Pago</td>
					<td></td>
					<td></td>
					<td></td>
				</tr>

				<tr class="details">
					<td>Efectivo</td>

					<td></td>
				</tr>

				<tr class="heading">
					<td>Producto</td>
					<td style="text-align: center;">Cantidad</td>
					<td style="text-align: center;">Precio Unitario</td>
					<td style="text-align: right;">Subtotal</td>
				</tr>

				@foreach ($data->voucherDetail as $p)
				<tr class="item">
					<td >{{ $p->product->name }}</td>
					<td style="text-align: center;">{{ $p->amount }}</td>
					<td style="text-align: center;">{{ $p->unit_price }}</td>
					<td style="text-align: right;">{{ $p->subtotal }}</td>
				</tr>
				@endforeach



				<tr class="total">
					<td></td>
					<td></td>
					<td></td>
					<td>Total: {{ $data->total }}</td>
				</tr>
			</table>
		</div>
	</body>
</html>