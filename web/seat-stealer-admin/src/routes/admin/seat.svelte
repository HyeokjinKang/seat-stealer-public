<script lang="ts">
	import { screen } from '$lib/stores.ts';
	export let config: Config;

	let seats: HTMLDivElement[] = [];
	let labels: string[] = [];
	let showIndex = 0;

	screen.subscribe((n) => {
		if (n == 7) {
			showIndex = 0;
			resultShow(1);
		}
	});

	const resultShow = (n: number) => {
		seats[n].style.transitionDuration = '0s';
		seats[n].style.backgroundColor = '#000';
		seats[n].style.color = '#fff';
		let bgColor = '#def3ff';
		if (n in config.last) {
			if (config.last[n].length == 1) {
				bgColor = '#fff';
				labels[n] = config.last[n][0];
			} else {
				bgColor = '#ffe8e8';
				labels[n] = config.last[n].length + '명';
			}
		}
		setTimeout(() => {
			showIndex = n;
			seats[n].style.transitionDuration = '1s';
			seats[n].style.color = '#000';
			seats[n].style.backgroundColor = bgColor;
			setTimeout(() => {
				if (n < seats.length - 1) resultShow(n + 1);
			}, 200);
		}, 20);
	};
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div id="seats">
	{#each config.seat as seat, i}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			class="seat"
			id={`${i}`}
			style="margin-left: {seat.x}vw; margin-top: {seat.y}vh; {seat.width
				? `width: ${seat.width}vw;`
				: ''}"
			bind:this={seats[i]}
		>
			<span>
				{#if $screen == 7 && i <= showIndex && i != 0 && i in config.last}
					{labels[i]}
				{:else}
					{seat.name}
				{/if}
			</span>
		</div>
	{/each}
</div>

<style>
	#seats {
		width: 100%;
		height: 100%;
	}

	.seat {
		display: flex;
		justify-content: center;
		align-items: center;
		border: 1px solid #888;
		color: #000;
		background-color: #fff;
		position: absolute;
		width: 8vw;
		height: 4vh;
		transition-duration: 0.1s;
	}

	.seat > span {
		font-size: 2vh;
	}

	#rowContainer {
		position: fixed;
		bottom: 0;
		height: 8vh;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
</style>
