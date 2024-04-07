<script lang="ts">
	import Init from './init.svelte';
	import Controller from './controller.svelte';
	import { screen } from '$lib/stores.ts';

	let title = 'Online Seat Stealer';
	let config: Config = {
		seat: [],
		student: []
	};
</script>

<div id="app">
	<h1>{title}</h1>
	{#if $screen < 6}
		<Init bind:config />
	{/if}
</div>
<Controller bind:config />

<style>
	#app {
		display: flex;
		width: 100%;
		height: 80vh;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		padding: 3vh 10vw;
		box-sizing: border-box;
	}
</style>
