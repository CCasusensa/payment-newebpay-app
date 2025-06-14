<script lang="ts">
	import { goto } from '$app/navigation';
	let account = '';
	let amount = 100;

	async function handleSubmit() {
		const formData = new FormData();
		formData.append('username', account);
		formData.append('amount', String(amount));

		await fetch('/pay/api/createOrder', {
			method: 'POST',
			body: formData
		});

		goto(`/pay/confirm?account=${encodeURIComponent(account)}&amount=${amount}`);
	}
</script>

<div class="min-h-screen bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-md overflow-hidden rounded-lg bg-white shadow-md">
		<div class="px-6 py-8">
			<h2 class="mb-8 text-center text-2xl font-bold text-gray-800">藍新金流付款測試</h2>

			<form on:submit|preventDefault={handleSubmit} class="space-y-6">
				<div>
					<label for="account" class="mb-1 block text-sm font-medium text-gray-700">帳號</label>
					<input
						id="account"
						type="text"
						bind:value={account}
						required
						class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm"
						placeholder="請輸入您的帳號"
					/>
				</div>

				<div>
					<label for="amount" class="mb-1 block text-sm font-medium text-gray-700">金額</label>
					<input
						id="amount"
						type="number"
						bind:value={amount}
						min="100"
						required
						class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm"
						placeholder="請輸入贊助金額"
					/>
				</div>

				<button
					type="submit"
					class="w-full rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
				>
					贊助
				</button>
			</form>
		</div>
	</div>
</div>