<script lang="ts">
	export let data: {
		status: string;
		message: string;
		shopProduct?: string;
		account: string;
		amount: number;
		tradeNo?: string;
	};
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-100">
	<div class="max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
		<h1 class="mb-4 text-2xl font-bold">
			{data.status === 'success' ? '付款成功' : '付款失敗'}
		</h1>
		<p class="mb-2 text-gray-700">{data.message}</p>
		<p class="mb-2 text-gray-700">贊助帳號：{data.account}</p>
		<p class="mb-2 text-gray-700">贊助商品：{data.shopProduct}</p>
		<p class="mb-2 text-gray-700">贊助金額：{data.amount} NTD</p>
		<p class="text-gray-700">交易編號：{data.tradeNo}</p>
		<a href="/" class="mt-6 inline-block text-blue-600 hover:underline"> 回首頁 </a>
	</div>
</div>
