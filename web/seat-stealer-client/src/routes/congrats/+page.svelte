<script lang="ts">
	import { page } from '$app/stores';

	let seat = $page.url.searchParams.get('seat');
</script>

<div>
	<span>축하합니다!</span>
	<span><strong>{seat}</strong>번 자리 확정</span>
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	span {
		font-size: 1.1em;
		color: #000;
	}
</style>
