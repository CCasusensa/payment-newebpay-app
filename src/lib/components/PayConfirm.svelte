<script lang="ts">
	export let account: string;
	export let amount: number;

	let tradeData: any = null;

	async function handleConfirm() {
		const formData = new FormData();
		formData.append('username', account);
		formData.append('amount', amount.toString());

		const res = await fetch('/pay/api/createOrder', {
			method: 'POST',
			body: formData
		});

		if (!res.ok) {
			alert('建立訂單失敗');
			return;
		}

		tradeData = await res.json();

		const form = document.createElement('form');
		form.method = 'POST';
		form.action = import.meta.env.PayGateWay ?? 'https://ccore.newebpay.com/MPG/mpg_gateway';
		form.style.display = 'none';

		const appendInput = (name: string, value: string) => {
			const input = document.createElement('input');
			input.name = name;
			input.value = value;
			form.appendChild(input);
		};

		appendInput('MerchantID', tradeData.MerchantID);
		appendInput('TradeInfo', tradeData.TradeInfo);
		appendInput('TradeSha', tradeData.TradeSha);
		appendInput('Version', tradeData.Version);

		document.body.appendChild(form);
		form.submit();
	}
</script>

<div class="mx-auto mt-10 max-w-md rounded bg-white p-6 shadow">
	<h2 class="mb-4 text-xl font-bold">確認付款資訊</h2>
	<p><strong>帳號：</strong> {account}</p>
	<p><strong>金額：</strong> NT$ {amount}</p>

	<button
		on:click={handleConfirm}
		class="mt-6 w-full rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
	>
		確認送出
	</button>
</div>
