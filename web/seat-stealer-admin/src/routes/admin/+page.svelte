<script lang="ts">
	import Init from './init.svelte';
	import Seat from './seat.svelte';
	import Controller from './controller.svelte';
	import { screen } from '$lib/stores.ts';

	let title = 'Online Seat Stealer';
	let count = 0;
	let config: Config = {
		seat: [],
		student: [],
		pre: {
			seat: {},
			student: {}
		},
		last: {}
	};

	screen.subscribe((num) => {
		switch (num) {
			case 6:
				title = '원하는 자리에 투표해주세요.';
				break;
			case 7:
				title = '투표 결과';
				break;
			case 8:
				title = '승부의 시간!';
				break;
			case 9:
				count++;
				title = `${count}차 배치 결과`;
				break;
			case 10:
				title = '최종 결과';
				break;
		}
	});
</script>

<div id="app">
	<h1>{title}</h1>
	{#if $screen < 6}
		<Init bind:config />
	{:else}
		<Seat bind:config />
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
