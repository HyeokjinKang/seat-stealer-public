<script lang="ts">
	import { screen, seat } from '$lib/stores.ts';
	import { onMount } from 'svelte';
	import html2canvas from 'html2canvas';
	export let config: Config;

	let seats: HTMLDivElement[] = [];
	let labels: string[] = [];
	let captureArea: HTMLDivElement;

	screen.subscribe((n) => {
		if (n == 6) {
			for (let i = 0; i < seats.length; i++) {
				seats[i].style.transitionDuration = '0s';
				seats[i].style.backgroundColor = '#fff';
				seats[i].style.color = '#000';
			}
		} else if (n == 7) {
			setTimeout(() => {
				resultShow(1);
			}, 500);
		} else if (n == 9) {
			for (let i = 0; i < seats.length; i++) {
				if (i in config.last && config.last[i].length == 1) {
					labels[i] = config.last[i][0];
				}
			}
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
			seats[n].style.transitionDuration = '1s';
			seats[n].style.color = '#000';
			seats[n].style.backgroundColor = bgColor;
			setTimeout(() => {
				if (n < seats.length - 1) resultShow(n + 1);
			}, 200);
		}, 20);
	};

	const seatSelected = (i: string) => {
		seat.set(i);
	};

	export const capture = () => {
		html2canvas(captureArea).then((canvas) => {
			const a = document.createElement('a');
			a.href = canvas.toDataURL('image/png');
			a.download = `자리배치결과-${new Date().toLocaleDateString('ko-kr')}png`;
			a.click();
		});
	};

	onMount(() => {
		config.seat.forEach((seat) => {
			labels.push(seat.name);
		});
		labels = labels;
	});
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div id="seats" bind:this={captureArea}>
	{#each config.seat as seat, i}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			class="seat"
			id={`${i}`}
			style="margin-left: {seat.x}vw; margin-top: {seat.y}vh; {seat.width
				? `width: ${seat.width}vw;`
				: ''}"
			on:click={() => {
				seatSelected(`${i}`);
			}}
			bind:this={seats[i]}
		>
			<span>
				{labels[i]}
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
		cursor: pointer;
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
