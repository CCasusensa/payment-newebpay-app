<script lang="ts">
	import PayConfirm from '$lib/components/PayConfirm.svelte';
	import { page } from '$app/stores';

	let query = $page.url.searchParams;
	let account = query.get('account') ?? '';
	let amount = Number(query.get('amount') ?? '0');
</script>

<PayConfirm {account} {amount} />