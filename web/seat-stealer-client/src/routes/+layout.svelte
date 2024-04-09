<script lang="ts">
	import Controller from './controller.svelte';
</script>

<div>
	<h1>Online Seat Stealer</h1>
	<slot />
	<Controller />
</div>

<style>
	div {
		box-sizing: border-box;
		padding: 3em 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		height: 100%;
	}
</style>
